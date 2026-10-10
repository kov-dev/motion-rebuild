// Probe the live Techniques section: computed styles once, then rects/transforms of the
// words, stars, divider and text at several scroll positions (IX2 scroll-into-view scrub).
// Usage: node techniques-probe.mjs [url] [outDir]   (run from a dir with playwright installed)
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
  'justifyContent', 'alignItems', 'fontFamily', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'textTransform',
  'textAlign', 'color', 'backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundPosition', 'border', 'borderRadius',
  'overflow', 'overflowX', 'overflowY', 'zIndex', 'transform', 'transformOrigin', 'top', 'left', 'right', 'bottom', 'maxWidth', 'whiteSpace', 'marginTop'];

const b = await chromium.launch({ channel: 'chrome' });
const only = process.env.ONLY;
for (const vp of VPS.filter((v) => !only || v.name === only)) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.m ? IPHONE : undefined });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(16000); // let the old preloader finish

  const styles = await p.evaluate((PROPS) => {
    const sec = document.querySelector('#techniques');
    const o = [];
    const walk = (el, d) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const s = {};
      for (const k of PROPS) s[k] = cs[k];
      o.push({ d, tag: el.tagName.toLowerCase(), cls: el.className?.baseVal ?? el.className, id: el.id, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, text: el.children.length ? '' : (el.textContent || '').trim().slice(0, 40), s });
      for (const c of el.children) if (d < 9) walk(c, d + 1);
    };
    walk(sec.parentElement, 0);
    // Neighbours: the end of Interactive and the start of Lessons (transition context).
    const prev = sec.parentElement.previousElementSibling, next = sec.parentElement.nextElementSibling;
    const box = (e) => { const r = e.getBoundingClientRect(); return { cls: e.className, top: Math.round(r.top + scrollY), h: Math.round(r.height), bg: getComputedStyle(e.firstElementChild || e).backgroundColor }; };
    return { tree: o, prev: box(prev), next: box(next) };
  }, PROPS);
  fs.writeFileSync(`${out}/techniques-styles-${vp.name}.json`, JSON.stringify(styles, null, 1));

  const geo = await p.evaluate(() => { const r = document.querySelector('#techniques').getBoundingClientRect(); return { top: Math.round(r.top + scrollY), h: Math.round(r.height) }; });
  const rows = [`top ${geo.top} h ${geo.h} vh ${vp.h} prev ${JSON.stringify(styles.prev)} next ${JSON.stringify(styles.next)}`];
  // IX2 scroll-into-view progress: 0 when the section top hits the viewport bottom, 1 when its bottom leaves the top.
  const span = geo.h + vp.h;
  const marks = [['p0', 0], ['p10', 0.1], ['p24', 0.24], ['p36', 0.36], ['p50', 0.5], ['p60', 0.6], ['p72', 0.72], ['p85', 0.85]]
    .map(([n, f]) => [n, geo.top - vp.h + span * f]);
  for (const [name, target] of marks) {
    for (let i = 0; i < 60; i++) {
      const y = await p.evaluate(() => scrollY);
      const d = target - y;
      if (Math.abs(d) < 10) break;
      if (vp.m) await p.evaluate((d) => scrollBy(0, d), Math.sign(d) * Math.min(600, Math.abs(d)));
      else await p.mouse.wheel(0, Math.sign(d) * Math.min(600, Math.abs(d)));
      await p.waitForTimeout(120);
    }
    await p.waitForTimeout(2500); // IX2 smoothing 90 settles slowly
    const st = await p.evaluate(({ top, span, vh }) => {
      const q = (s) => document.querySelector(s);
      const R = (e) => { if (!e) return '-'; const r = e.getBoundingClientRect(); return `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)} tf ${getComputedStyle(e).transform}`; };
      const prog = ((scrollY - (top - vh)) / span).toFixed(3);
      const sel = { w1: '.list-item.is-techniques.first', w2: '.list-item.is-techniques.second', w3: '.list-item.is-techniques.third', div: '.bg-divider.is-techniques', s1: '.bg-image.is-star.first', s2: '.bg-image.is-star.second', txt: '.text-wrap.is-techniques', sec: '#techniques' };
      return `scrollY ${Math.round(scrollY)} prog ${prog}\n  ` + Object.entries(sel).map(([k, s]) => `${k} ${R(q(s))}`).join('\n  ');
    }, { top: geo.top, span, vh: vp.h });
    rows.push(`${name}: ${st}`);
    await p.screenshot({ path: `${out}/techniques-${vp.name}-${name}.png` });
  }
  fs.writeFileSync(`${out}/techniques-scroll-${vp.name}.txt`, rows.join('\n'));
  console.log(vp.name, '\n' + rows.join('\n'));
  await ctx.close();
}
await b.close();
