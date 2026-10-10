// Probe the live Lessons section (#lessons, 8 lessons). Four parts, each per viewport:
//   struct — lesson geometry, computed-style walk of every lesson, sticky elements, Lottie/video inventory,
//            breadcrumbs (lessons-struct-<vp>.json)
//   scan   — scrolls through #lessons in vh/3 steps and logs the IX2-driven values (examples marquee + stars,
//            example videos + progress bar, implementation cards, classic-anim/overlay backgrounds), sticky tops and
//            the navbar colours / visible breadcrumb (lessons-scan-<vp>.txt, screenshots every vh)
//   splide — the easing schemes slider: geometry, then each «next» click sampled every 50 ms (list transform,
//            active slide, .hero_text swap), then back to the start (lessons-splide-<vp>.txt)
// Fine scan: RANGE="<selector>:<from>:<to>:<step>" scans only from (element top + from) to (element top + to), every
// <step> px (lessons-scan-<vp>-fine.txt, no screenshots), e.g. RANGE=".lesson-item.is-examples:-900:600:25".
// Usage: node lessons-probe.mjs [url] [outDir]   env ONLY=1440|768|375, PART=struct,scan,splide, RANGE
// (run from a dir with playwright installed)
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] || 'https://motion.zajno.com/';
const out = process.argv[3] || '.';
fs.mkdirSync(out, { recursive: true });

const VPS = [
  { name: '1440', w: 1440, h: 900, m: false },
  { name: '768', w: 768, h: 1024, m: true },
  { name: '375', w: 375, h: 812, m: true },
];
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const PROPS = ['display', 'position', 'width', 'height', 'minHeight', 'padding', 'margin', 'gap', 'flexDirection', 'flexWrap',
  'justifyContent', 'alignItems', 'gridTemplateColumns', 'fontFamily', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight',
  'textTransform', 'textAlign', 'textDecorationLine', 'color', 'backgroundColor', 'backgroundImage', 'backgroundSize', 'border',
  'borderRadius', 'boxShadow', 'overflow', 'overflowX', 'overflowY', 'zIndex', 'transform', 'transformOrigin', 'top', 'left',
  'right', 'bottom', 'maxWidth', 'whiteSpace', 'opacity', 'objectFit', 'aspectRatio', 'clipPath', 'maskImage', 'pointerEvents'];
const parts = (process.env.PART || 'struct,scan,splide').split(',');
const only = process.env.ONLY;

// Scroll to an absolute y: wheel on desktop (Lenis), scrollBy on touch (native + normalizeScroll), as techniques-probe.
async function scrollToY(p, vp, target) {
  for (let i = 0; i < 80; i++) {
    const y = await p.evaluate(() => scrollY);
    const d = target - y;
    if (Math.abs(d) < 8) break;
    const step = Math.sign(d) * Math.min(600, Math.abs(d));
    if (vp.m) await p.evaluate((s) => scrollBy(0, s), step);
    else await p.mouse.wheel(0, step);
    await p.waitForTimeout(vp.m ? 60 : 120);
  }
}

const b = await chromium.launch({ channel: 'chrome' });
for (const vp of VPS.filter((v) => !only || v.name === only)) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.m ? IPHONE : undefined });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(16000); // let the old preloader finish

  if (parts.includes('struct')) {
    const data = await p.evaluate((PROPS) => {
      const root = document.querySelector('#lessons');
      const abs = (e) => { const r = e.getBoundingClientRect(); return { top: Math.round(r.top + scrollY), left: Math.round(r.left), w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 }; };
      const path = (e) => { const s = []; for (let n = e; n && n !== root; n = n.parentElement) s.unshift((n.className?.baseVal ?? n.className ?? '').toString().trim().split(/\s+/).slice(0, 3).join('.') || n.tagName.toLowerCase()); return s.join(' > '); };
      // 1. Lessons: geometry, colour, children.
      const lessons = [...root.children].map((s) => ({ id: s.id, cls: s.className, ...abs(s),
        lessonBg: s.firstElementChild ? getComputedStyle(s.firstElementChild).backgroundColor : null,
        kids: [...(s.querySelector('.lesson-list') || s).children].map((c) => `${c.className} ${Math.round(c.getBoundingClientRect().height)}`) }));
      // 2. Full computed-style walk of every lesson (depth ≤ 14).
      const walk = (el, d, o) => {
        const cs = getComputedStyle(el); const s = {};
        for (const k of PROPS) s[k] = cs[k];
        const at = {}; for (const a of el.attributes) if (/^data-|^src$|^href$|^autoplay|^loop|^muted|^playsinline|^preload|^poster|^aria|^role/.test(a.name)) at[a.name] = a.value.slice(0, 160);
        o.push({ d, tag: el.tagName.toLowerCase(), cls: (el.className?.baseVal ?? el.className).toString(), id: el.id, ...abs(el), at, text: el.children.length ? '' : (el.textContent || '').trim().slice(0, 300), s });
        if (el.tagName !== 'svg' && d < 14) for (const c of el.children) walk(c, d + 1, o);
        return o;
      };
      const trees = {}; for (const s of root.children) trees[s.id || s.className] = walk(s, 0, []);
      // 3. Sticky elements and the room they have to travel.
      const sticky = [...root.querySelectorAll('*')].filter((e) => getComputedStyle(e).position === 'sticky').map((e) => ({ path: path(e), top: getComputedStyle(e).top, ...abs(e), parentH: Math.round(e.parentElement.getBoundingClientRect().height), travel: Math.round(e.parentElement.getBoundingClientRect().height - e.getBoundingClientRect().height) }));
      // 4. Lottie (Webflow registry) and videos.
      let lot = [];
      try {
        const anims = window.Webflow.require('lottie').lottie.getRegisteredAnimations();
        lot = anims.map((a) => { const w = a.wrapper; return { inLessons: root.contains(w), path: root.contains(w) ? path(w) : '', src: (a.path || '').split('/').pop() || w.dataset.src?.split('/').pop(), frames: a.totalFrames, fr: a.frameRate, loop: a.loop, autoplay: a.autoplay, paused: a.isPaused, renderer: a.renderer?.rendererType, data: { ...w.dataset }, ...abs(w) }; }).filter((x) => x.inLessons);
      } catch (e) { lot = [{ err: String(e) }]; }
      const videos = [...root.querySelectorAll('video')].map((v) => ({ path: path(v), cls: v.className, src: (v.currentSrc || v.querySelector('source')?.src || '').split('/').pop(), type: v.querySelector('source')?.type, poster: (v.getAttribute('poster') || '').split('/').pop(), autoplay: v.autoplay, loop: v.loop, muted: v.muted, playsinline: v.playsInline, preload: v.preload, display: getComputedStyle(v).display, paused: v.paused, ready: v.readyState, vw: v.videoWidth, vh: v.videoHeight, ...abs(v) }));
      const imgs = [...root.querySelectorAll('img')].map((i) => ({ path: path(i), src: i.currentSrc.split('/').pop(), nat: `${i.naturalWidth}x${i.naturalHeight}`, loading: i.loading, ...abs(i) }));
      const bgImgs = [...root.querySelectorAll('*')].filter((e) => getComputedStyle(e).backgroundImage !== 'none').map((e) => ({ path: path(e), bg: getComputedStyle(e).backgroundImage.slice(0, 200) }));
      // 5. Breadcrumbs (navbar) and the navbar parts the old script colours.
      const crumbs = [...document.querySelectorAll('#breadcrumbs-wrap .breadcrumb-item')].map((c) => { const cs = getComputedStyle(c); return { cls: c.className, text: c.textContent.trim(), bg: cs.backgroundColor, color: cs.color, op: cs.opacity, display: cs.display, font: `${cs.fontFamily} ${cs.fontSize}/${cs.lineHeight} ${cs.letterSpacing}`, pad: cs.padding, radius: cs.borderRadius, border: cs.border, ...abs(c) }; });
      const crumbWrap = document.querySelector('#breadcrumbs-wrap');
      const crumbWrapInfo = crumbWrap && { cls: crumbWrap.className, html: crumbWrap.outerHTML.slice(0, 1500), ...abs(crumbWrap), cs: Object.fromEntries(['display', 'position', 'gap', 'opacity', 'flexDirection', 'alignItems'].map((k) => [k, getComputedStyle(crumbWrap)[k]])) };
      return { lessons, sticky, lot, videos, imgs, bgImgs, crumbs, crumbWrapInfo, trees, docH: document.documentElement.scrollHeight };
    }, PROPS);
    fs.writeFileSync(`${out}/lessons-struct-${vp.name}.json`, JSON.stringify(data, null, 1));
    console.log(vp.name, 'struct', data.lessons.map((l) => `${l.id || l.cls} top ${l.top} h ${l.h} bg ${l.lessonBg}`).join('\n  '));
  }

  if (parts.includes('scan')) {
    const range = process.env.RANGE?.split(':');
    const geo = await p.evaluate((sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return { top: Math.round(r.top + scrollY), h: Math.round(r.height) }; }, range ? range[0] : '#lessons');
    const step = range ? +range[3] : Math.round(vp.h / 3);
    const from = range ? geo.top + +range[1] : geo.top - vp.h, to = range ? geo.top + +range[2] : geo.top + geo.h;
    const rows = [`${range ? range[0] : '#lessons'} top ${geo.top} h ${geo.h} vh ${vp.h} step ${step}`];
    let i = 0;
    for (let y = from; y <= to; y += step, i++) {
      await scrollToY(p, vp, y);
      await p.waitForTimeout(1500); // IX2 smoothing 90 settles in ~1.2 s
      const row = await p.evaluate(() => {
        const vh = innerHeight;
        const vis = (e) => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < vh && r.width > 0; };
        const tf = (e) => { const m = new DOMMatrix(getComputedStyle(e).transform); return { x: Math.round(m.m41 * 10) / 10, y: Math.round(m.m42 * 10) / 10, s: Math.round(Math.hypot(m.a, m.b) * 1000) / 1000 }; };
        const rr = (e) => { const r = e.getBoundingClientRect(); return `${Math.round(r.top)}/${Math.round(r.height)}`; };
        const all = (s) => [...document.querySelectorAll(s)].map((e, i) => [e, i]).filter(([e]) => vis(e));
        const o = [];
        const lesson = [...document.querySelectorAll('#lessons > section')].find((s) => { const r = s.getBoundingClientRect(); return r.top <= 1 && r.bottom > 1; });
        o.push(`L ${lesson ? lesson.id : '-'}`);
        for (const [e, i] of all('.lesson-item')) o.push(`item${i}.${e.className.replace('lesson-item', '').trim().replace(/\s+/g, '.')} ${rr(e)}`);
        for (const [e] of all('.scrolling-text.is-lessons')) o.push(`marquee x ${tf(e).x} (${(tf(e).x / e.offsetWidth * 100).toFixed(1)}%)`);
        const so = document.querySelector('.star-vector.odd'), se = document.querySelector('.star-vector.even');
        if (so && vis(so)) o.push(`stars odd ${tf(so).y} even ${tf(se).y}`);
        for (const [e, i] of all('[class^="example-video-"]:not(.example-video-padding)')) { const op = getComputedStyle(e).opacity; if (op !== '0') o.push(`ev${i + 1} op ${op}`); }
        const pl = document.querySelector('.progress-bar_line-active');
        if (pl && vis(pl)) {
          o.push(`pbar ${(pl.getBoundingClientRect().width / pl.parentElement.getBoundingClientRect().width * 100).toFixed(1)}%`);
          o.push('div ' + [...document.querySelectorAll('.progress-bar_divider-line_small, .progress-bar_divider-line_large')].map((d) => Math.round(d.getBoundingClientRect().height / d.parentElement.getBoundingClientRect().height * 100)).join(','));
          o.push('titles ' + [1, 2, 3].map((n) => getComputedStyle(document.querySelector(`.progress-bar_title-${n}`)).color.replace(/rgba?\(|\)| /g, '')).join(' | '));
        }
        for (const [e, i] of all('.title-wrap.is-implementation')) o.push(`impl${i} title s ${tf(e).s}`);
        for (const [e, i] of all('.list-wrap.is-implementation')) o.push(`impl${i} list x ${tf(e).x} (${(tf(e).x / e.offsetWidth * 100).toFixed(1)}%) c2 ${tf(e.querySelector('.card-link.is-second')).y} c3 ${e.querySelector('.card-link.is-third') ? tf(e.querySelector('.card-link.is-third')).y : '-'}`);
        for (const [e, i] of all('.classic-anim_wrap')) o.push(`classic${i} bg ${getComputedStyle(e).backgroundColor} ${rr(e)}`);
        for (const [e, i] of all('.overlay-bg')) o.push(`overlay${i} bg ${getComputedStyle(e).backgroundColor}`);
        for (const [e] of all('.sticky-container, .a-lesson-item_sticky')) o.push(`sticky.${e.className.split(' ').pop()} top ${Math.round(e.getBoundingClientRect().top)}`);
        const lg = document.querySelector('#logo-wrap'), mt = document.querySelector('#menu-toggle'), sb = document.querySelector('.sound-icon-wrap');
        const crumb = [...document.querySelectorAll('#breadcrumbs-wrap .breadcrumb-item')].find((c) => +getComputedStyle(c).opacity > 0.5);
        o.push(`nav logo ${getComputedStyle(lg).backgroundColor} menu ${getComputedStyle(mt).backgroundColor} crumbs ${getComputedStyle(document.querySelector('.breadcrumbs-wrap')).opacity} «${crumb ? crumb.textContent.trim() : '-'}» sound ${sb ? getComputedStyle(sb).backgroundColor : '-'}`);
        return `y ${Math.round(scrollY)} | ` + o.join(' | ');
      });
      rows.push(row);
      if (!range && i % 3 === 0) await p.screenshot({ path: `${out}/lessons-${vp.name}-scan-${String(i).padStart(3, '0')}.jpg`, quality: 55, type: 'jpeg' });
    }
    fs.writeFileSync(`${out}/lessons-scan-${vp.name}${range ? '-fine' : ''}.txt`, rows.join('\n'));
    console.log(vp.name, 'scan', rows.length, 'rows');
  }

  if (parts.includes('splide')) {
    const sTop = await p.evaluate(() => { const r = document.querySelector('.splide2').getBoundingClientRect(); return Math.round(r.top + scrollY); });
    await scrollToY(p, vp, sTop - vp.h * 0.3);
    await p.waitForTimeout(1500);
    const snap = () => p.evaluate(() => {
      const list = document.querySelector('.splide2 .splide__list');
      const m = new DOMMatrix(getComputedStyle(list).transform);
      const slides = [...document.querySelectorAll('.splide2 .splide__slide')];
      const act = slides.findIndex((s) => s.classList.contains('is-active'));
      const lot = slides.map((s) => { const a = s.querySelector('.slide-lottie.active'), n = s.querySelector('.slide-lottie.not-active'); return `${getComputedStyle(a).opacity}/${getComputedStyle(n).opacity}`; }).join(' ');
      return `x ${Math.round(m.m41 * 10) / 10} act ${act} prevDis ${document.querySelector('.splide__arrow--prev').disabled} nextDis ${document.querySelector('.splide__arrow--next').disabled} text «${document.querySelector('.hero_text').textContent.trim().slice(0, 40)}» lottie(a/n) ${lot}`;
    });
    const geo = await p.evaluate(() => {
      const R = (e) => { const r = e.getBoundingClientRect(); return `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}`; };
      const q = (s) => document.querySelector(s);
      const slides = [...document.querySelectorAll('.splide2 .splide__slide')].map((s) => `${R(s)} «${s.querySelector('.slide-inner-label').textContent.trim()}» text «${s.querySelector('.text1').textContent.trim()}»`);
      const cs = (s) => { const c = getComputedStyle(q(s)); return `${c.backgroundColor} ${c.color} ${c.border} r${c.borderRadius} ${c.width}x${c.height}`; };
      return [`container ${R(q('.splide-container'))} right ${R(q('.hero_right'))} left ${R(q('.hero_left'))} divider ${R(q('.splide-container .divider'))}`,
        `track ${R(q('.splide2 .splide__track'))} arrows ${R(q('.splide2 .splide__arrows'))} prev ${R(q('.splide__arrow--prev'))} ${cs('.splide__arrow--prev')} next ${R(q('.splide__arrow--next'))} ${cs('.splide__arrow--next')}`,
        `hero_text ${R(q('.hero_text'))}`, ...slides].join('\n  ');
    });
    const rows = [`splide top ${sTop}\n  ${geo}`, `start: ${await snap()}`];
    await p.screenshot({ path: `${out}/lessons-${vp.name}-splide-0.png` });
    for (let k = 1; k <= 5; k++) {
      const dis = await p.evaluate(() => document.querySelector('.splide__arrow--next').disabled);
      if (dis) { rows.push(`next disabled after ${k - 1} clicks`); break; }
      await p.evaluate(() => document.querySelector('.splide__arrow--next').click());
      const t0 = Date.now();
      for (let t = 0; t < 22; t++) { rows.push(`  click${k} +${Date.now() - t0}ms ${await snap()}`); await p.waitForTimeout(50); }
      await p.screenshot({ path: `${out}/lessons-${vp.name}-splide-${k}.png` });
    }
    await p.evaluate(() => document.querySelector('.splide__arrow--prev').click());
    await p.waitForTimeout(800);
    rows.push(`after one prev: ${await snap()}`);
    fs.writeFileSync(`${out}/lessons-splide-${vp.name}.txt`, rows.join('\n'));
    console.log(vp.name, 'splide\n' + rows.slice(0, 3).join('\n'));
  }
  await ctx.close();
}
await b.close();
