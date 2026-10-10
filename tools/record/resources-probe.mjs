// Probe the live Resources section (#resources: pinned arrows → horizontal track → CMS lists, hover image stack)
// and the clouds at the end of Lessons (.resources-clouds-list). Three parts, each per viewport:
//   struct — geometry + computed-style walk of #resources and the clouds, CMS items, images, arrow SVG, pin-spacer,
//            every CSS rule whose selector mentions «resources» (incl. media queries) (resources-struct-<vp>.json)
//   scan   — scrolls through the pin in vh/4 steps and logs arrows x, track x, lists y, active header tab, overlay bg,
//            clouds y, navbar colours (resources-scan-<vp>.txt, screenshots every vh)
//   hover  — desktop only: parks the pin in the lists phase, hovers a sequence of items (incl. a revisit and a list
//            switch) and samples the active classes and the image stack (opacity / rotate / z-index) every 50 ms
//            (resources-hover-<vp>.txt + a screenshot per hover)
// The live pin is created lazily when .is-lessons reaches the top, so every part first scrolls through Lessons.
// Usage: node resources-probe.mjs [url] [outDir]   env ONLY=1440|768|375, PART=struct,scan,hover
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
const PROPS = ['display', 'position', 'width', 'height', 'minHeight', 'maxWidth', 'padding', 'margin', 'gap', 'flexDirection',
  'flexWrap', 'justifyContent', 'alignItems', 'gridTemplateColumns', 'fontFamily', 'fontSize', 'lineHeight', 'letterSpacing',
  'fontWeight', 'textTransform', 'textAlign', 'textDecorationLine', 'color', 'backgroundColor', 'backgroundImage', 'border',
  'borderBottom', 'borderRadius', 'overflow', 'overflowX', 'overflowY', 'zIndex', 'transform', 'transformOrigin', 'top', 'left',
  'right', 'bottom', 'whiteSpace', 'opacity', 'visibility', 'objectFit', 'aspectRatio', 'pointerEvents', 'transition', 'cursor'];
const parts = (process.env.PART || 'struct,scan,hover').split(',');
const only = process.env.ONLY;

// Scroll to an absolute y: wheel on desktop (Lenis), scrollBy on touch, as lessons-probe.
async function scrollToY(p, vp, target) {
  for (let i = 0; i < 400; i++) {
    const y = await p.evaluate(() => scrollY);
    const d = target - y;
    if (Math.abs(d) < 8) break;
    const step = Math.sign(d) * Math.min(600, Math.abs(d));
    if (vp.m) await p.evaluate((s) => scrollBy(0, s), step);
    else await p.mouse.wheel(0, step);
    await p.waitForTimeout(vp.m ? 60 : 120);
  }
}

// Pass .is-lessons so the old script builds the pin, then read the pin geometry.
async function armPin(p, vp) {
  const lt = await p.evaluate(() => { const r = document.querySelector('.is-lessons').getBoundingClientRect(); return Math.round(r.top + scrollY); });
  await scrollToY(p, vp, lt + 200);
  await p.waitForTimeout(1500);
  return p.evaluate(() => {
    const sec = document.querySelector('#resources'), res = document.querySelector('.resources');
    const spacer = res.parentElement.classList.contains('pin-spacer') ? res.parentElement : null;
    const st = window.ScrollTrigger?.getAll().find((t) => t.pin === res || t.trigger === res);
    const r = (spacer || res).getBoundingClientRect();
    return { secTop: Math.round(sec.getBoundingClientRect().top + scrollY), secH: Math.round(sec.getBoundingClientRect().height),
      pinTop: Math.round(r.top + scrollY), spacerH: spacer ? Math.round(r.height) : null,
      stStart: st ? Math.round(st.start) : null, stEnd: st ? Math.round(st.end) : null,
      resScrollW: res.scrollWidth, listsH: Math.round(document.querySelector('.resources-lists').getBoundingClientRect().height),
      docH: document.documentElement.scrollHeight, vw: innerWidth, vh: innerHeight };
  });
}

const b = await chromium.launch({ channel: 'chrome' });
for (const vp of VPS.filter((v) => !only || v.name === only)) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.m ? IPHONE : undefined });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(16000); // let the old preloader finish
  const pin = await armPin(p, vp);
  console.log(vp.name, 'pin', JSON.stringify(pin));

  if (parts.includes('struct')) {
    const data = await p.evaluate((PROPS) => {
      const abs = (e) => { const r = e.getBoundingClientRect(); return { top: Math.round(r.top + scrollY), left: Math.round(r.left), w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 }; };
      const walk = (el, d, o, max) => {
        const cs = getComputedStyle(el); const s = {};
        for (const k of PROPS) s[k] = cs[k];
        const at = {}; for (const a of el.attributes) if (/^data-|^src$|^href$|^target$|^alt$|^loading$|^aria|^role/.test(a.name)) at[a.name] = a.value.slice(0, 200);
        o.push({ d, tag: el.tagName.toLowerCase(), cls: (el.className?.baseVal ?? el.className).toString(), id: el.id, ...abs(el), at,
          text: el.children.length ? '' : (el.textContent || '').trim().slice(0, 200), s });
        if (el.tagName !== 'svg' && d < max) for (const c of el.children) walk(c, d + 1, o, max);
        return o;
      };
      const sec = document.querySelector('#resources');
      // Walk everything except the CMS items beyond the first two of each list (they repeat).
      const tree = walk(sec, 0, [], 14).filter((n) => true);
      const clouds = document.querySelector('.resources-clouds-list');
      const cloudTree = clouds ? walk(clouds, 0, [], 4) : null;
      const lists = [...document.querySelectorAll('.resources-list')].map((l) => [...l.querySelectorAll('.resources-item')].map((it) => ({
        text: it.innerText.replace(/\s+/g, ' ').trim(), href: it.querySelector('a')?.href || it.closest('a')?.href || null,
        cls: it.className, nameCls: it.querySelector('.resources-item__name')?.className, ...abs(it) })));
      const images = [...document.querySelectorAll('.resources-images__list')].map((l) => [...l.querySelectorAll('.resources-images__item')].map((it) => {
        const i = it.querySelector('img'); const cs = getComputedStyle(it);
        return { cls: it.className, src: i ? i.currentSrc.split('/').pop() : null, srcset: i?.getAttribute('srcset')?.slice(0, 300), sizes: i?.sizes, nat: i ? `${i.naturalWidth}x${i.naturalHeight}` : null, loading: i?.loading, op: cs.opacity, tf: cs.transform, z: cs.zIndex, ...abs(it) };
      }));
      const header = [...document.querySelectorAll('.resources-header__item')].map((h) => ({ cls: h.className, text: h.innerText.replace(/\s+/g, ' ').trim(), ...abs(h) }));
      const arrowSvg = document.querySelector('.resources-arrow-icon')?.innerHTML.slice(0, 3000);
      const itemSvg = document.querySelector('#resources .btn-link-icon')?.outerHTML.slice(0, 3000);
      // CSS rules mentioning resources (+ media conditions), to read hover / .active states and breakpoints.
      const rules = [];
      const take = (list, media) => { for (const r of list) {
        if (r.cssRules && r.media) take(r.cssRules, r.media.mediaText);
        else if (r.selectorText && /resources|arrow-title|text-block-3/.test(r.selectorText)) rules.push(`${media ? `@media ${media} ` : ''}${r.cssText}`);
      } };
      for (const sh of document.styleSheets) { try { take(sh.cssRules, ''); } catch (e) { rules.push(`(blocked ${sh.href})`); } }
      return { tree, cloudTree, lists, images, header, arrowSvg, itemSvg, rules, docH: document.documentElement.scrollHeight };
    }, PROPS);
    fs.writeFileSync(`${out}/resources-struct-${vp.name}.json`, JSON.stringify({ pin, ...data }, null, 1));
    console.log(vp.name, 'struct', data.tree.length, 'nodes,', data.lists.map((l) => l.length), 'items,', data.images.map((l) => l.length), 'images,', data.rules.length, 'rules');
  }

  if (parts.includes('scan')) {
    const step = Math.round(vp.h / 4);
    const from = pin.pinTop - vp.h * 1.5, to = (pin.stEnd ?? pin.pinTop + (pin.spacerH || 0)) + vp.h * 1.5;
    const rows = [`pin ${JSON.stringify(pin)} step ${step}`];
    let i = 0;
    for (let y = from; y <= to; y += step, i++) {
      await scrollToY(p, vp, y);
      await p.waitForTimeout(3500); // scrub 3 + IX2 smoothing 90
      const row = await p.evaluate(() => {
        const tf = (e) => { const m = new DOMMatrix(getComputedStyle(e).transform); return { x: Math.round(m.m41 * 10) / 10, y: Math.round(m.m42 * 10) / 10, r: Math.round(Math.atan2(m.b, m.a) * 1800 / Math.PI) / 10 }; };
        const q = (s) => document.querySelector(s);
        const o = [];
        const res = q('.resources');
        o.push(`res top ${Math.round(res.getBoundingClientRect().top)}`);
        o.push('arrows ' + [...document.querySelectorAll('.resources-arrow')].map((a) => tf(a).x).join(','));
        o.push(`track ${tf(q('.resources-track')).x}`);
        const lists = q('.resources-lists');
        o.push(`lists y ${tf(lists).y} (${(tf(lists).y / lists.offsetHeight * 100).toFixed(1)}%)`);
        o.push('tab ' + [...document.querySelectorAll('.resources-header__item')].findIndex((h) => h.classList.contains('active')));
        o.push(`hdr ${Math.round(q('.resources-header').getBoundingClientRect().top)}`);
        o.push(`overlay ${getComputedStyle(q('.resources-overlay')).backgroundColor}`);
        o.push('clouds ' + [...document.querySelectorAll('.resources-cloud-item')].map((c) => `${tf(c).y}@${Math.round(c.getBoundingClientRect().top)}`).join(','));
        const lg = q('#logo-wrap'), mt = q('#menu-toggle');
        o.push(`nav ${lg ? getComputedStyle(lg).backgroundColor : '-'} ${mt ? getComputedStyle(mt).backgroundColor : '-'} crumbs ${getComputedStyle(q('.breadcrumbs-wrap')).opacity}`);
        return `y ${Math.round(scrollY)} | ` + o.join(' | ');
      });
      rows.push(row);
      if (i % 4 === 0) await p.screenshot({ path: `${out}/resources-${vp.name}-scan-${String(i).padStart(3, '0')}.jpg`, quality: 55, type: 'jpeg' });
    }
    fs.writeFileSync(`${out}/resources-scan-${vp.name}.txt`, rows.join('\n'));
    console.log(vp.name, 'scan', rows.length, 'rows');
  }

  if (parts.includes('hover') && !vp.m) {
    // Park in the lists phase: track fully shifted.
    const shift = pin.resScrollW - pin.vw;
    let y = pin.pinTop + 1.5 * pin.vw + shift;
    await scrollToY(p, vp, y);
    for (let k = 0; k < 20; k++) {
      await p.waitForTimeout(3500);
      const x = await p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.resources-track')).transform).m41);
      if (x <= -shift + 2) break;
      y += 200; await scrollToY(p, vp, y);
    }
    const snap = () => p.evaluate(() => {
      const items = [...document.querySelectorAll('.resources-item')];
      const act = items.map((e, i) => (e.classList.contains('active') ? i : -1)).filter((i) => i >= 0);
      const name = document.querySelector('.resources-item.active .resources-item__name');
      const ncs = name && getComputedStyle(name);
      const imgs = [...document.querySelectorAll('.resources-images__list')].map((l, li) => [...l.querySelectorAll('.resources-images__item')].map((e, i) => {
        const cs = getComputedStyle(e); const m = new DOMMatrix(cs.transform);
        return { li, i, act: e.classList.contains('active'), op: +(+cs.opacity).toFixed(3), r: Math.round(Math.atan2(m.b, m.a) * 1800 / Math.PI) / 10, s: Math.round(Math.hypot(m.a, m.b) * 1000) / 1000, z: cs.zIndex, vis: cs.visibility };
      }).filter((x) => x.act || x.op > 0)).flat();
      return `act ${act} name ${ncs ? `${ncs.color} ${ncs.textDecorationLine} op ${ncs.opacity}` : '-'} | ` + imgs.map((x) => `L${x.li}#${x.i}${x.act ? '*' : ''} op ${x.op} r ${x.r} s ${x.s} z ${x.z}`).join(' ; ');
    });
    const rows = [`parked y ${Math.round(await p.evaluate(() => scrollY))}`, `start ${await snap()}`];
    const seq = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 1], [0, 5], [1, 0], [1, 1], [0, 2]];
    for (const [li, ii] of seq) {
      // Bring the item into view if the lists have scrolled it away.
      for (let k = 0; k < 15; k++) {
        const r = await p.evaluate(([li, ii]) => { const r = document.querySelectorAll('.resources-list')[li].querySelectorAll('.resources-item')[ii].getBoundingClientRect(); return { top: r.top, h: r.height, l: r.left, w: r.width }; }, [li, ii]);
        if (r.top > 150 && r.top + r.h < vp.h - 20) break;
        y += r.top > vp.h / 2 ? 150 : -150; await scrollToY(p, vp, y); await p.waitForTimeout(3500);
      }
      const r = await p.evaluate(([li, ii]) => { const r = document.querySelectorAll('.resources-list')[li].querySelectorAll('.resources-item')[ii].getBoundingClientRect(); return { x: r.left + Math.min(120, r.width / 3), y: r.top + r.height / 2 }; }, [li, ii]);
      await p.mouse.move(r.x, r.y, { steps: 4 });
      const t0 = Date.now();
      rows.push(`hover L${li}#${ii}`);
      for (let t = 0; t < 14; t++) { rows.push(`  +${Date.now() - t0}ms ${await snap()}`); await p.waitForTimeout(50); }
      await p.screenshot({ path: `${out}/resources-${vp.name}-hover-L${li}-${ii}.png` });
    }
    await p.mouse.move(5, 5);
    await p.waitForTimeout(800);
    rows.push(`mouse out ${await snap()}`);
    fs.writeFileSync(`${out}/resources-hover-${vp.name}.txt`, rows.join('\n'));
    console.log(vp.name, 'hover', rows.length, 'rows');
  }
  await ctx.close();
}
await b.close();
