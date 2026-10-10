// Probe the live Interactive section: computed styles once, then element rects
// and transforms at several scroll positions (wheel input, so Lenis-driven pins work).
// Usage: node interactive-probe.mjs [url] [outDir]   (run from a dir with playwright installed)
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
const PROPS = ['display', 'position', 'width', 'height', 'minHeight', 'padding', 'margin', 'gap', 'flexDirection',
  'justifyContent', 'alignItems', 'fontFamily', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'textTransform',
  'textAlign', 'color', 'backgroundColor', 'backgroundImage', 'border', 'borderRadius', 'overflow', 'zIndex', 'transform', 'top', 'left', 'maxWidth', 'whiteSpace'];

const b = await chromium.launch({ channel: 'chrome' });
const only = process.env.ONLY;
for (const vp of VPS.filter((v) => !only || v.name === only)) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.m ? IPHONE : undefined });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(16000); // let the old preloader finish

  const styles = await p.evaluate((PROPS) => {
    const sec = document.querySelector('#interactive');
    const o = [];
    const walk = (el, d) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const s = {};
      for (const k of PROPS) s[k] = cs[k];
      o.push({ d, tag: el.tagName.toLowerCase(), cls: el.className?.baseVal ?? el.className, id: el.id, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, text: el.children.length ? '' : (el.textContent || '').trim().slice(0, 40), s });
      for (const c of el.children) if (c.tagName !== 'svg' && c.tagName !== 'CANVAS' && d < 9) walk(c, d + 1);
    };
    walk(sec.parentElement, 0);
    return o;
  }, PROPS);
  fs.writeFileSync(`${out}/interactive-styles-${vp.name}.json`, JSON.stringify(styles, null, 1));

  const top = await p.evaluate(() => Math.round(document.querySelector('#interactive').getBoundingClientRect().top + scrollY));
  const shift = await p.evaluate(() => { const e = document.querySelector('.height-section.is-interactive'); return e.scrollWidth - innerWidth; });
  const hs = await p.evaluate(() => { const e = document.querySelector('.height-section.is-interactive'); return Math.round(e.getBoundingClientRect().top + scrollY); });
  const rows = [`top ${top} heightSectionTop ${hs} shift ${shift} vh ${vp.h}`];
  const marks = [['enter', top - vp.h], ['half', top - vp.h / 2], ['top', top], ['hs-top', hs], ['p25', hs + shift * 0.25], ['p50', hs + shift * 0.5], ['p100', hs + shift], ['after', hs + shift + vp.h * 0.6]];
  for (const [name, target] of marks) {
    for (let i = 0; i < 60; i++) {
      const y = await p.evaluate(() => scrollY);
      const d = target - y;
      if (Math.abs(d) < 20) break;
      if (vp.m) await p.evaluate((d) => scrollBy(0, d), Math.sign(d) * Math.min(600, Math.abs(d)));
      else await p.mouse.wheel(0, Math.sign(d) * Math.min(600, Math.abs(d)));
      await p.waitForTimeout(120);
    }
    await p.waitForTimeout(2200);
    const st = await p.evaluate(() => {
      const q = (s) => document.querySelector(s);
      const R = (e) => { if (!e) return '-'; const r = e.getBoundingClientRect(); return `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}`; };
      const items = [...document.querySelectorAll('#interactive .horizontal-item')].map(R).join(' | ');
      const h2 = q('#interactive h2');
      return `scrollY ${Math.round(scrollY)} | h2 ${R(h2)} tf ${getComputedStyle(h2).transform} fs ${getComputedStyle(h2).fontSize} | section ${R(q('#interactive'))} | hs ${R(q('.height-section.is-interactive'))} tf ${getComputedStyle(q('.height-section.is-interactive')).transform} | items ${items} | canvas ${R(q('#canvas canvas'))}`;
    });
    rows.push(`${name}: ${st}`);
    await p.screenshot({ path: `${out}/interactive-${vp.name}-${name}.png` });
  }
  fs.writeFileSync(`${out}/interactive-scroll-${vp.name}.txt`, rows.join('\n'));
  console.log(vp.name, '\n' + rows.join('\n'));
  await ctx.close();
}
await b.close();
