// Styleguide page (session 37): the rebuilt design-system reference on staging.
// Checks per band: noindex meta; no legacy markup (old rem embed, .styleguide-wrapper, h2/p1… classes); html font-size
// from styles-rem only; every colour chip paints its token's hex; the dark mode panel inverts bg/foreground; the band
// columns force the type sizes of desktop / tablet / mobile; no horizontal page scroll; fixed component roots stay
// inside their boards; page errors. Full-page screenshots go to the scratchpad.
// Usage: node styleguide-check.mjs [1440|768|600|375 ...] (default all)
import { chromium } from 'playwright';

const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io';
const OUT = process.env.OUT || '.';
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const VPS = [
  { n: '1440', w: 1440, h: 900, layout: 1440 },
  { n: '768', w: 768, h: 1024, layout: 768 },
  { n: '600', w: 600, h: 900, layout: 768 },
  { n: '375', w: 375, h: 812, layout: 375 },
].filter((v) => (only.length ? only.includes(v.n) : true));

const CHIPS = {
  'is-neutral-0': '#fdfcfa', 'is-neutral-800': '#3d3c3c', 'is-neutral-1000': '#0c0b0b',
  'is-lesson-easing': '#c8cfe8', 'is-lesson-delay': '#d2c8e8', 'is-lesson-fade': '#e4e8c8', 'is-lesson-morph': '#c8e8e8',
  'is-lesson-masking': '#e8c8e5', 'is-lesson-dimension': '#e8c8c8', 'is-lesson-parallax': '#d6e8c8', 'is-lesson-zoom': '#c2d5d7',
  'is-classic-easing': '#aab8eb', 'is-classic-delay': '#bdb1d7',
};
// display-xl size per band column, in rem (type collection modes)
const BAND_REM = [2.15, 1.2, 0.56];

const browser = await chromium.launch({ channel: 'chrome' });
let flags = 0;
const flag = (vp, msg) => { flags++; console.log(`  ⚠ ${vp}: ${msg}`); };

for (const vp of VPS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${STAGING}/styleguide?v=${Date.now()}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(({ CHIPS }) => {
    const hex = (c) => {
      const m = c.match(/\d+(\.\d+)?/g);
      if (!m) return c;
      return '#' + m.slice(0, 3).map((x) => (+x).toString(16).padStart(2, '0')).join('');
    };
    const q = (s) => [...document.querySelectorAll(s)];
    const chips = {};
    for (const k of Object.keys(CHIPS)) {
      const el = document.querySelector(`.sg-chip.${k}`);
      chips[k] = el ? hex(getComputedStyle(el).backgroundColor) : null;
    }
    const light = document.querySelector('.sg-mode:not(.is-dark)');
    const dark = document.querySelector('.sg-mode.is-dark');
    const cs = (el) => (el ? { bg: hex(getComputedStyle(el).backgroundColor), fg: hex(getComputedStyle(el).color) } : null);
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const bands = q('.sg-band').map((b) => parseFloat(getComputedStyle(b.querySelector('.display-xl')).fontSize) / rem);
    const contained = q('.sg-board').map((b) => {
      const root = b.firstElementChild;
      const br = b.getBoundingClientRect();
      const rr = root.getBoundingClientRect();
      return { cls: root.className, inside: rr.top >= br.top - 1 && rr.left >= br.left - 1 && rr.right <= br.right + 1, h: Math.round(br.height) };
    });
    return {
      robots: document.querySelector('meta[name="robots"]')?.content || null,
      legacy: q('.styleguide-wrapper, .h2, .h3, .p1, .p3, .og-image, .splide__arrows').length,
      embeds: q('body > .w-embed').length,
      rem,
      chips,
      light: cs(light),
      dark: cs(dark),
      bands,
      contained,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: q('h1').length,
      height: document.documentElement.scrollHeight,
    };
  }, { CHIPS });

  console.log(`${vp.n}: rem ${r.rem.toFixed(3)} · height ${r.height} · bands ${r.bands.map((x) => x.toFixed(2)).join(' / ')} · boards ${r.contained.map((c) => c.h).join(' / ')}`);
  if (r.robots !== 'noindex') flag(vp.n, `robots meta = ${r.robots}`);
  if (r.legacy) flag(vp.n, `${r.legacy} legacy elements`);
  if (r.embeds !== 1) flag(vp.n, `${r.embeds} embeds (expected only styles-rem in Body)`);
  const remWant = (vp.w / vp.layout) * 100;
  if (Math.abs(r.rem - remWant) > 0.01) flag(vp.n, `rem ${r.rem} ≠ ${remWant}`);
  for (const [k, want] of Object.entries(CHIPS)) if (r.chips[k] !== want) flag(vp.n, `chip ${k} ${r.chips[k]} ≠ ${want}`);
  if (r.light?.bg !== '#fdfcfa' || r.light?.fg !== '#0c0b0b') flag(vp.n, `light mode ${JSON.stringify(r.light)}`);
  if (r.dark?.bg !== '#0c0b0b' || r.dark?.fg !== '#fdfcfa') flag(vp.n, `dark mode ${JSON.stringify(r.dark)}`);
  r.bands.forEach((x, i) => { if (Math.abs(x - BAND_REM[i]) > 0.005) flag(vp.n, `band ${i} display-xl ${x.toFixed(3)}rem ≠ ${BAND_REM[i]}`); });
  r.contained.forEach((c) => { if (!c.inside) flag(vp.n, `${c.cls} escapes its board`); });
  if (r.overflow > 0) flag(vp.n, `horizontal overflow ${r.overflow}px`);
  if (r.h1 !== 1) flag(vp.n, `${r.h1} h1`);
  if (errors.length) flag(vp.n, `page errors: ${errors.join(' | ')}`);
  await page.screenshot({ path: `${OUT}/styleguide-${vp.n}.png`, fullPage: true });
  await ctx.close();
}
await browser.close();
console.log(flags ? `${flags} flag(s)` : '0 flags');
process.exit(flags ? 1 : 0);
