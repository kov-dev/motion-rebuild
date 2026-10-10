// Runs initLessons() / initLessonSchemes() on the published staging page next to the old script (as techniques-run
// does) and checks them against the live lessons (motion.zajno.com, IX2 + Splide) and against the IX2 keys
// (docs/sections/lessons.md «Скрол-анімації»). Progress is the IX2 one: 0 = trigger top at vh (startsEntering) or at
// max(vh − h, 0), 1 = trigger top at −h·(1 − endOffset). Both pages are measured at the same progress of their own
// trigger, so the page heights above do not matter.
// Parts (--part=a,b; default all):
//   impl     — Implementation of easing, fade and zoom: title scale, cards 2/3 y, track xPercent
//   examples — examples row xPercent and the odd/even stars y
//   demo     — demo state: visible video, line width, lit ticks, lit step titles
//   classic  — classic wrapper + overlay background alpha (easing, delay)
//   splide   — schemes slider: each «next» click sampled every frame (x as a fraction of the step, active circle, caption
//              swap time), disabled arrows, one «prev»; ours against the live Splide
//   media    — ours only: lazy videos (src by band, playing on screen, paused off it), hero Lotties, dimension video
// Usage: node lessons-run.mjs <project-root> <out-dir> [1440|768|600|375] [--live] [--no-ref] [--part=…]
// --live: the staging page exactly as published (snippets already in Webflow), nothing injected.
// --no-ref: skip the live site (ours against the IX2 keys only). 600: lessons 2–8 have no live reference (live bug).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const args = process.argv.slice(2);
const live = args.includes('--live');
const noRef = args.includes('--no-ref');
const parts = (args.find((a) => a.startsWith('--part='))?.split('=')[1] || 'impl,examples,demo,classic,splide,media').split(',');
const [root, out, only = '1440'] = args.filter((a) => !a.startsWith('--'));
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const LIVE = 'https://motion.zajno.com/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const VPS = {
  1440: { w: 1440, h: 900, m: false },
  768: { w: 768, h: 1024, m: true },
  600: { w: 600, h: 900, m: true },
  375: { w: 375, h: 812, m: true },
};
const vp = VPS[only];
const src = (f) => readFileSync(`${root}/src/${f}`, 'utf8');

// IX2 keys (motion.js CASES_KEYS / the IX2 JSON).
const bandKey = vp.w >= 992 ? 'desktop' : vp.w >= 768 ? 'tablet' : 'small';
const CASES = {
  desktop: { entering: true, end: 0.26, title: [0.23, 0.32], c2: [0.32, 0.42], c3: [0.38, 0.48], track: [0.5, 0.84, -40] },
  tablet: { entering: false, end: 0.5, title: [0, 0.24], c2: [0.24, 0.5], c3: null, track: [0.45, 1, -122] },
  small: { entering: true, end: 0.26, title: [0.23, 0.3], c2: [0.3, 0.44], c3: null, track: [0.48, 0.74, -178] },
}[bandKey];
const lerp = (from, to, [a, b], p) => from + (to - from) * Math.min(1, Math.max(0, (p - a) / (b - a)));
const implModel = (p, rem) => ({
  s: lerp(1, 0.6, CASES.title, p),
  c2: lerp(1.5 * rem, 0, CASES.c2, p),
  c3: CASES.c3 ? lerp(3 * rem, 0, CASES.c3, p) : 0,
  xp: lerp(0, CASES.track[2], CASES.track, p),
});
const exSmall = vp.w <= 767;
const EX = { end: exSmall ? 0.5 : 0.8, span: [0, exSmall ? 1 : 0.8], x: exSmall ? -130 : -104, star: exSmall ? 0.54 : 0.9 };
const DEMO_STEPS = [0.17, 0.345, 0.51, 0.675, 0.835];
const DEMO_LINE = [16.7, 33.33, 50.03, 66.63, 83.35, 100];
const demoState = (p) => DEMO_STEPS.filter((x) => p >= x).length;
const CLASSIC = { easing: [0.18, 0.24], delay: [0.24, 0.3] };

// Element lookup per page: ours by data-motion roles, the live one by its classes.
const SEL = {
  ours: {
    impl: (id) => ({ trig: `#${id}-next [data-motion="lesson-cases"]`, head: '[data-motion="lesson-cases-head"]', track: '[data-motion="lesson-track"]', card: '[data-motion="lesson-card"]' }),
    ex: { trig: '[data-motion="lesson-examples"]', line: '[data-motion="examples-line"]', star: '[data-motion="examples-star"]' },
    demo: { trig: '[data-motion="lesson-demo"]', video: '[data-motion="demo-video"]', line: '[data-motion="demo-line"]', tick: '[data-motion="demo-tick"]', step: '[data-motion="demo-step"]' },
    classic: (id) => ({ trig: `#${id}-next [data-motion="lesson-classic"]`, overlay: `#${id}-next [data-motion="lesson-overlay"]` }),
    splide: { root: '[data-motion="lesson-schemes"]', track: '[data-motion="schemes-track"]', slide: '[data-motion="scheme"]', next: '[data-motion="schemes-next"]', prev: '[data-motion="schemes-prev"]', text: '[data-motion="schemes-text"]' },
  },
  live: {
    impl: (id) => ({ trig: `#${id} .lesson-item.is-implementation`, head: '.title-wrap.is-implementation', track: '.list-wrap.is-implementation', card: '.card-link' }),
    ex: { trig: '.lesson-item.is-examples', line: '.scrolling-text.is-lessons', star: '.star-vector' },
    demo: { trig: '.nav-inner.nav-dark', video: '[class^="example-video-"]:not(.example-video-padding)', line: '.progress-bar_line-active', tick: '.progress-bar_divider-line_small, .progress-bar_divider-line_large', step: '[class^="progress-bar_title-"]' },
    classic: (id) => ({ trig: `#${id} .classic-anim_wrap`, overlay: `#${id} .overlay-bg` }),
    splide: { root: '.splide-container', track: '.splide2 .splide__list', slide: '.splide2 .splide__slide', next: '.splide__arrow--next', prev: '.splide__arrow--prev', text: '.hero_text' },
  },
};

const b = await chromium.launch({ channel: 'chrome' });

async function open(kind) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, ...(vp.m ? { userAgent: UA } : {}) });
  const p = await ctx.newPage();
  const logs = [];
  p.on('pageerror', (e) => !/play\(\) request was interrupted|interrupted by a (new load|call to pause)/.test(e.message) && logs.push('pageerror: ' + e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' | ')));
  p.on('console', (m) => m.type() === 'error' && !/ERR_FAILED|Splide|twitter|status of 4/.test(m.text()) && logs.push('console: ' + m.text()));
  if (kind === 'ours' && !live) {
    const js = src('motion.js');
    await p.route(STAGING, async (route) => {
      const res = await route.fetch();
      let html = await res.text();
      // The published page already carries the snippets: swap their module for the local motion.js.
      html = html.replace(/<script type="module" src="[^"]*motion\.js"><\/script>/, '');
      html = html.replace('</body>', `<script type="module">${js}</script></body>`);
      route.fulfill({ response: res, body: html });
    });
    // motion.js is inline here, so its relative imports resolve against the page URL.
    for (const f of ['legacy-guard.js', 'sphere.js']) await p.route(`**/${f}`, (r) => r.fulfill({ contentType: 'text/javascript', body: src(f) }));
  }
  await p.goto(kind === 'ours' ? STAGING : LIVE, { waitUntil: kind === 'ours' ? 'domcontentloaded' : 'load', timeout: 120000 });
  if (kind === 'ours') {
    await Promise.race([
      p.evaluate(() => new Promise((r) => document.addEventListener('motion:preloader-done', () => r(), { once: true }))),
      p.waitForTimeout(25000),
    ]);
    await p.waitForTimeout(2500);
  } else {
    await p.waitForTimeout(16000); // the old preloader
  }
  // A native jump first (Lenis syncs to it), then wheel / scrollBy passes: smooth scrolling keeps moving after the first one.
  const scrollTo = async (target, tol = 6) => {
    await p.evaluate((y) => scrollTo(0, y), target);
    await p.waitForTimeout(300);
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < 40; i++) {
        const y = await p.evaluate(() => scrollY);
        const d = target - y;
        if (Math.abs(d) < tol) break;
        const step = Math.sign(d) * Math.min(600, Math.abs(d));
        if (vp.m) await p.evaluate((s) => scrollBy(0, s), step);
        else await p.mouse.wheel(0, step);
        await p.waitForTimeout(120);
      }
      await p.waitForTimeout(600);
    }
  };
  return { ctx, p, logs, scrollTo, sel: SEL[kind], kind };
}

// Document top and height of a trigger.
const geo = (pg, sel) => pg.p.evaluate((s) => {
  const e = document.querySelector(s);
  if (!e) return null;
  const r = e.getBoundingClientRect();
  return { top: r.top + scrollY, h: r.height, rem: parseFloat(getComputedStyle(document.documentElement).fontSize) };
}, sel);
// Scroll position where the IX2 progress of a trigger is p.
const yAt = (g, p, entering, end) => {
  const s = entering ? vp.h : Math.max(vp.h - g.h, 0);
  const e = -g.h * (1 - end);
  return Math.round(g.top - s + p * (s - e));
};
// Progress actually reached (the scroll lands within a few px).
const progAt = (pg, g, entering, end) => pg.p.evaluate(() => scrollY).then((y) => {
  const s = entering ? vp.h : Math.max(vp.h - g.h, 0);
  const e = -g.h * (1 - end);
  return (g.top - y - s) / (e - s);
});

async function measure(pg, sel, entering, end, marks, readFn) {
  const rows = [];
  for (const m of marks) {
    const g = await geo(pg, sel.trig);
    if (!g) return null;
    await pg.scrollTo(yAt(g, m, entering, end));
    await pg.p.waitForTimeout(2500); // scrub / IX2 smoothing settle
    const p = await progAt(pg, g, entering, end);
    rows.push({ mark: m, p, rem: g.rem, ...(await pg.p.evaluate(readFn, sel)) });
  }
  return rows;
}

const tfRead = `(e) => { if (!e) return null; const m = new DOMMatrix(getComputedStyle(e).transform); return { x: m.m41, y: m.m42, s: Math.hypot(m.a, m.b), w: e.offsetWidth }; }`;

const pages = [await open('ours')];
if (!noRef) pages.push(await open('live'));
const rows = [`== ${only}${live ? ' (live staging)' : ''}`];
let flags = 0;
const flag = (bad) => (bad ? (flags++, '  ⚠') : '');
const f1 = (v) => (v == null ? '-' : (+v).toFixed(1));
const f3 = (v) => (v == null ? '-' : (+v).toFixed(3));

if (parts.includes('impl')) {
  const marks = [0.1, 0.27, 0.36, 0.45, 0.6, 0.75, 0.95];
  const read = new Function('s', `const tf = ${tfRead}; const t = document.querySelector(s.trig);
    const cards = [...t.querySelectorAll(s.card)]; return { head: tf(t.querySelector(s.head)), track: tf(t.querySelector(s.track)), c2: tf(cards[1]), c3: tf(cards[2]) };`);
  for (const id of ['easing', 'fade', 'zoom']) {
    const res = {};
    for (const pg of pages) {
      if (pg.kind === 'live' && only === '600' && id !== 'easing') continue; // live bug: 480–767 static in lessons 2–8
      res[pg.kind] = await measure(pg, pg.sel.impl(id), CASES.entering, CASES.end, marks, read);
    }
    rows.push(`-- implementation ${id} (${bandKey} keys)`);
    res.ours?.forEach((o, i) => {
      const m = implModel(o.p, o.rem);
      const xp = (o.track.x / o.track.w) * 100;
      const d = Math.max(Math.abs(o.head.s - m.s) * 100, Math.abs(o.c2.y - m.c2), Math.abs(o.c3.y - m.c3), Math.abs(xp - m.xp));
      const l = res.live?.[i];
      const ml = l && implModel(l.p, l.rem);
      rows.push(`${f3(o.p)} ours s ${f3(o.head.s)} c2 ${f1(o.c2.y)} c3 ${f1(o.c3.y)} x% ${f1(xp)} | keys s ${f3(m.s)} c2 ${f1(m.c2)} c3 ${f1(m.c3)} x% ${f1(m.xp)}${flag(d > 1.5)}`);
      if (l) rows.push(`${f3(l.p)} live s ${f3(l.head.s)} c2 ${f1(l.c2.y)} c3 ${f1(l.c3?.y)} x% ${f1((l.track.x / l.track.w) * 100)} | keys@live s ${f3(ml.s)} c2 ${f1(ml.c2)} x% ${f1(ml.xp)}`);
    });
  }
}

if (parts.includes('examples')) {
  const marks = [0.1, 0.4, 0.7, 0.9];
  const read = new Function('s', `const tf = ${tfRead}; const t = document.querySelector(s.trig);
    const st = [...t.querySelectorAll(s.star)].map(tf); return { line: tf(t.querySelector(s.line)), odd: st[0], even: st[1] };`);
  const res = {};
  for (const pg of pages) res[pg.kind] = await measure(pg, pg.sel.ex, false, EX.end, marks, read);
  rows.push(`-- examples (end ${EX.end})`);
  res.ours?.forEach((o, i) => {
    const xp = (o.line.x / o.line.w) * 100;
    const mx = lerp(0, EX.x, EX.span, o.p);
    const ms = lerp(0, EX.star * o.rem, EX.span, o.p);
    const d = Math.max(Math.abs(xp - mx), Math.abs(o.odd.y - ms), Math.abs(o.even.y + ms));
    rows.push(`${f3(o.p)} ours x% ${f1(xp)} odd ${f1(o.odd.y)} even ${f1(o.even.y)} | keys x% ${f1(mx)} ±${f1(ms)}${flag(d > 1.5)}`);
    const l = res.live?.[i];
    if (l) rows.push(`${f3(l.p)} live x% ${f1((l.line.x / l.line.w) * 100)} odd ${f1(l.odd.y)} even ${f1(l.even.y)} | keys@live x% ${f1(lerp(0, EX.x, EX.span, l.p))}`);
  });
}

if (parts.includes('demo')) {
  const marks = [0.08, 0.26, 0.43, 0.6, 0.76, 0.93];
  const read = (s) => {
    const t = document.querySelector(s.trig);
    const shown = (e) => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0;
    const vids = [...t.querySelectorAll(s.video)];
    const video = vids.findIndex((v) => +getComputedStyle(v).opacity > 0.5 && (shown(v) || v.querySelector('video')));
    const playing = vids.map((v) => [...(v.tagName === 'VIDEO' ? [v] : v.querySelectorAll('video'))].filter(shown).some((x) => !x.paused));
    const line = t.querySelector(s.line);
    const ticks = [...t.querySelectorAll(s.tick)].map((e) => e.getBoundingClientRect().height / e.parentElement.getBoundingClientRect().height);
    const steps = [...t.querySelectorAll(s.step)].map((e) => {
      const c = getComputedStyle(e.querySelector('p') || e).color.match(/\d+/g).map(Number);
      return c[0] > 150;
    });
    return {
      video,
      playing: playing.map((x, i) => (x ? i : null)).filter((x) => x !== null),
      line: (line.getBoundingClientRect().width / line.parentElement.getBoundingClientRect().width) * 100,
      ticks: ticks.map((x) => Math.round(x * 100)),
      lit: ticks.filter((x) => x > 0.5).length,
      steps: steps.filter(Boolean).length,
    };
  };
  const res = {};
  for (const pg of pages) res[pg.kind] = await measure(pg, pg.sel.demo, false, 0.2, marks, read);
  rows.push('-- demo (end 20)');
  res.ours?.forEach((o, i) => {
    const s = demoState(o.p);
    const bad = o.video !== s || Math.abs(o.line - DEMO_LINE[s]) > 0.5 || o.lit !== Math.min(s + 1, 5) || o.steps !== [1, 1, 2, 2, 3, 3][s] || o.playing.join() !== String(s);
    rows.push(`${f3(o.p)} ours video ${o.video} playing [${o.playing}] line ${f1(o.line)}% ticks ${o.lit} (${o.ticks}) steps ${o.steps} | keys state ${s} line ${DEMO_LINE[s]}%${flag(bad)}`);
    const l = res.live?.[i];
    if (l) rows.push(`${f3(l.p)} live video ${l.video} playing [${l.playing}] line ${f1(l.line)}% ticks ${l.lit} (${l.ticks}) steps ${l.steps} | keys@live state ${demoState(l.p)}`);
  });
}

if (parts.includes('classic')) {
  const read = (s) => {
    const a = (e) => { const m = getComputedStyle(e).backgroundColor.match(/[\d.]+/g).map(Number); return m.length > 3 ? m[3] : 1; };
    return { wrap: a(document.querySelector(s.trig)), overlay: a(document.querySelector(s.overlay)) };
  };
  for (const id of ['easing', 'delay']) {
    const [w0, w1] = CLASSIC[id];
    const marks = [w0 - 0.03, (w0 + w1) / 2, w1 + 0.03];
    const res = {};
    for (const pg of pages) res[pg.kind] = await measure(pg, pg.sel.classic(id), true, 0, marks, read);
    rows.push(`-- classic ${id} (${w0}–${w1})`);
    res.ours?.forEach((o, i) => {
      const m = lerp(0, 1, [w0, w1], o.p);
      rows.push(`${f3(o.p)} ours wrap ${f3(o.wrap)} overlay ${f3(o.overlay)} | keys ${f3(m)}${flag(Math.max(Math.abs(o.wrap - m), Math.abs(o.overlay - m)) > 0.03)}`);
      const l = res.live?.[i];
      if (l) rows.push(`${f3(l.p)} live wrap ${f3(l.wrap)} overlay ${f3(l.overlay)} | keys@live ${f3(lerp(0, 1, [w0, w1], l.p))}`);
    });
  }
}

if (parts.includes('splide')) {
  // One click sampled every frame inside the page: x, active index, caption, arrows.
  const click = (pg, which) => pg.p.evaluate(([s, which]) => new Promise((resolve) => {
    const track = document.querySelector(s.track);
    const slides = [...document.querySelectorAll(s.slide)];
    const text = document.querySelector(s.text);
    const x = () => new DOMMatrix(getComputedStyle(track).transform).m41;
    const step = slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left; // layout step
    const x0 = x();
    const t0text = text.textContent.trim();
    const smp = [];
    let textAt = null;
    let actAt = null;
    const act0 = slides.findIndex((e) => e.classList.contains('is-active'));
    const t0 = performance.now();
    document.querySelector(which === 'next' ? s.next : s.prev).click();
    const tick = () => {
      const t = performance.now() - t0;
      const act = slides.findIndex((e) => e.classList.contains('is-active'));
      if (actAt === null && act !== act0) actAt = t;
      if (textAt === null && text.textContent.trim() !== t0text) textAt = t;
      smp.push([t, x()]);
      if (t < 900) requestAnimationFrame(tick);
      else resolve({ step, x0, smp, actAt, textAt, act, prevDis: document.querySelector(s.prev).disabled, nextDis: document.querySelector(s.next).disabled });
    };
    requestAnimationFrame(tick);
  }), [pg.sel.splide, which]);
  const res = {};
  for (const pg of pages) {
    const g = await geo(pg, pg.sel.splide.root);
    await pg.scrollTo(Math.round(g.top - vp.h * 0.3));
    await pg.p.waitForTimeout(1500);
    res[pg.kind] = [];
    for (let k = 1; k <= 4; k++) res[pg.kind].push(await click(pg, 'next'));
    res[pg.kind].push(await click(pg, 'prev'));
    await pg.p.screenshot({ path: `${out}/lessons-run-${only}-splide-${pg.kind}.png` });
  }
  rows.push('-- schemes slider (x as a fraction of one step at ms after the click)');
  // Time is counted from the first frame that moved: Splide starts its CSS transition ~28 ms after the click (two
  // frames), our tween on the next tick; the curves are compared from their own start.
  const moveStart = (r) => {
    const i = r.smp.findIndex(([, x]) => Math.abs(x - r.x0) > 0.5);
    return i > 0 ? r.smp[i - 1][0] : 0;
  };
  const at = (r, t) => {
    t += moveStart(r);
    const i = r.smp.findIndex(([u]) => u >= t);
    if (i <= 0) return r.smp[Math.max(i, 0)]?.[1];
    const [ta, xa] = r.smp[i - 1];
    const [tb, xb] = r.smp[i];
    return xa + ((xb - xa) * (t - ta)) / (tb - ta);
  };
  const T = [100, 200, 300, 400, 500, 600, 700];
  res.ours.forEach((o, k) => {
    const frac = (r) => T.map((t) => Math.abs((at(r, t) - r.x0) / Math.abs(r.step)));
    const fo = frac(o);
    const l = res.live?.[k];
    const fl = l && frac(l);
    const d = fl ? Math.max(...fo.map((v, i) => Math.abs(v - fl[i]))) : 0;
    const end = Math.abs(o.smp.at(-1)[1] - o.x0) / Math.abs(o.step);
    const label = k < 4 ? `next ${k + 1}` : 'prev';
    rows.push(`${label} ours step ${f1(o.step)} move @${f1(moveStart(o))}ms act ${o.act} @${f1(o.actAt)}ms text @${f1(o.textAt)}ms end ${f3(end)} dis ${o.prevDis}/${o.nextDis} | ${fo.map(f3).join(' ')}${flag(d > 0.05 || Math.abs(end - 1) > 0.01 || (o.textAt !== null && Math.abs(o.textAt - 400) > 60))}`);
    if (l) rows.push(`${label} live step ${f1(l.step)} move @${f1(moveStart(l))}ms act ${l.act} @${f1(l.actAt)}ms text @${f1(l.textAt)}ms dis ${l.prevDis}/${l.nextDis} | ${fl.map(f3).join(' ')} (Δ max ${f3(d)})`);
  });
}

if (parts.includes('media')) {
  const pg = pages[0];
  const state = () => pg.p.evaluate(() => {
    const vh = innerHeight;
    const onScreen = (e) => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < innerWidth && r.width > 0; };
    const vids = [...document.querySelectorAll('[data-motion="lesson-video"]')];
    const vis = vids.filter(onScreen);
    const visual = [...document.querySelectorAll('[data-motion="lesson-visual"]')].map((b) => ({ id: b.closest('section').id, on: onScreen(b), svg: !!b.querySelector('svg'), video: b.querySelector('video') }));
    return {
      onScreenVideos: vis.map((v) => `${v.dataset.loaded ? 'src' : 'nosrc'}/${v.paused ? 'paused' : 'playing'}`).join(' '),
      offScreenPlaying: vids.filter((v) => !onScreen(v) && !v.paused).length,
      withSrc: vids.filter((v) => v.dataset.loaded).length,
      visuals: visual.filter((v) => v.svg || v.video).map((v) => `${v.id}${v.on ? '*' : ''}:${v.video ? `video ${v.video.paused ? 'paused' : 'playing'} ${v.video.currentSrc.split('.').pop()}` : 'lottie'}`).join(' '),
      demoSrc: [...document.querySelectorAll('[data-motion="demo-video"]')].map((v) => (v.dataset.loaded || '').split('/').pop() || '-').join(' '),
      schemes: [...document.querySelectorAll('[data-motion="scheme-lottie"]')].map((b) => (b.querySelector('svg') ? 'svg' : '-')).join(' '),
    };
  });
  // Lottie frames move only while playing: compare two snapshots of the visual SVG.
  const moving = (id) => pg.p.evaluate(async (id) => {
    const box = document.querySelector(`#${id} [data-motion="lesson-visual"]`);
    const snap = () => box.innerHTML.length + ':' + [...box.querySelectorAll('g[transform], path')].slice(0, 40).map((g) => g.getAttribute('transform') || g.getAttribute('d')).join('|');
    const a = snap();
    await new Promise((r) => setTimeout(r, 400));
    return a !== snap();
  }, id);
  rows.push('-- media (ours)');
  for (const [where, sel, f] of [
    ['easing hero', '#easing-next [data-motion="lesson-visual"]', 0.4],
    ['easing cases', '#easing-next [data-motion="lesson-cases"]', -0.6],
    ['easing classic', '#easing-next [data-motion="lesson-classic"]', 0.3],
    ['dimension hero', '#dimension-next [data-motion="lesson-visual"]', 0.4],
    ['fade cases', '#fade-next [data-motion="lesson-cases"]', -0.6],
  ]) {
    const g = await geo(pg, sel);
    await pg.scrollTo(Math.round(g.top - vp.h * f));
    await pg.p.waitForTimeout(2500);
    const s = await state();
    const mv = where.endsWith('hero') && !where.startsWith('dimension') ? ` lottie moving ${await moving(sel.split(' ')[0].slice(1))}` : '';
    const bad = /nosrc|paused/.test(s.onScreenVideos) || s.offScreenPlaying > 0 || mv.endsWith('false');
    rows.push(`${where}: on-screen videos [${s.onScreenVideos}] off-screen playing ${s.offScreenPlaying} with src ${s.withSrc}${mv}${flag(bad)}`);
    rows.push(`  visuals ${s.visuals || '-'}`);
    if (where === 'easing cases') rows.push(`  demo src ${s.demoSrc} | scheme lotties ${s.schemes}`);
  }
}

rows.push(`flags: ${flags}`);
for (const pg of pages) rows.push(`${pg.kind}: ${pg.logs.slice(0, 8).join('\n') || 'no page errors'}`);
console.log(rows.join('\n'));
await b.close();
