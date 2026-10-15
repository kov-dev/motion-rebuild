// Scroll paint of the Hero statement (initHeroTitle, session 49): words start grey and turn white in reading order
// as their line rises through the lower half of the viewport.
// Checks per band: the split keeps the line layout; nothing is painted while the title is below the paint front;
// paint never runs ahead of reading order; a line is fully white before it reaches the Hero axis (it goes under the
// plate there); scrolling back greys it again; --reduce: no split, plain white text. Frames go to <out-dir>.
// Usage: node title-paint-run.mjs <out-dir> [--reduce] [--published]
//   default: staging markup + local src/motion.js (role injected if the markup has none yet)
//   --published: the page exactly as published
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const args = process.argv.slice(2);
const reduce = args.includes('--reduce');
const published = args.includes('--published');
const out = args.find((a) => !a.startsWith('--')) || '.';
fs.mkdirSync(out, { recursive: true });

const VPS = [
  { n: '1440', w: 1440, h: 900 },
  { n: '1920', w: 1920, h: 1080 },
  { n: '768', w: 768, h: 1024, touch: true },
  { n: '375', w: 375, h: 812, touch: true },
];
const DIM = 0.2;

const b = await chromium.launch({ channel: 'chrome' });
let total = 0;
for (const vp of VPS) {
  const ctx = await b.newContext({
    viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, reducedMotion: reduce ? 'reduce' : 'no-preference',
    isMobile: !!vp.touch, hasTouch: !!vp.touch,
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  if (!published) {
    await p.route(/cdn\.jsdelivr\.net\/gh\/kov-dev\/motion-rebuild@[^/]+\/src\/(.+\.js)/, (r) => {
      const f = r.request().url().match(/\/src\/(.+\.js)/)[1];
      r.fulfill({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(`${ROOT}/src/${f}`, 'utf8') });
    });
    await p.route(STAGING, async (r) => {
      const res = await r.fetch();
      let html = await res.text();
      if (!html.includes('data-motion="hero-title"')) html = html.replace('<h1 class="heading-xl"', '<h1 data-motion="hero-title" class="heading-xl"');
      r.fulfill({ response: res, body: html });
    });
  }
  // Line layout of the unsplit title, read before the module splits it.
  await p.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const h1 = document.querySelector('[data-motion="hero-title"]');
      if (!h1) return;
      const rg = document.createRange();
      rg.selectNodeContents(h1);
      const top = h1.getBoundingClientRect().top;
      window.__lines0 = [...new Set([...rg.getClientRects()].filter((x) => x.width).map((x) => Math.round(x.top - top)))];
      window.__h0 = h1.offsetHeight;
    });
  });
  await p.goto(STAGING, { waitUntil: 'load', timeout: 90000 });
  await p.waitForFunction(() => !document.documentElement.classList.contains('is-preloading'), null, { timeout: 30000 });
  // initHeroTitle() runs once the preloader resolves (after the Hero entrance), and the split may wait for the fonts.
  if (!reduce) await p.waitForFunction(() => document.querySelector('[data-motion="hero-title"] div'), null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(1500);

  const rows = [`== ${vp.n} ${vp.w}×${vp.h}${vp.touch ? ' touch' : ''}${reduce ? ' reduce' : ''}${published ? ' published' : ''}`];
  let flags = 0;
  const flag = (s) => { flags++; rows.push(`  ⚠ ${s}`); };

  const read = () => p.evaluate(() => {
    const h1 = document.querySelector('[data-motion="hero-title"]');
    if (!h1) return null;
    const axis = document.querySelector('[data-motion="hero-ball-wrap"]').getBoundingClientRect();
    const words = [...h1.querySelectorAll('div')].map((w) => {
      const r = w.getBoundingClientRect();
      return { t: w.textContent, top: r.top, bottom: r.bottom, o: +getComputedStyle(w).opacity };
    });
    const top = h1.getBoundingClientRect().top;
    const lines = [...new Set(words.map((w) => Math.round(w.top - top)))];
    return { y: scrollY, vh: innerHeight, axis: axis.top + axis.height / 2, top, h: h1.offsetHeight, words, lines,
      lines0: window.__lines0, h0: window.__h0, color: getComputedStyle(h1).color };
  });

  let g = await read();
  if (!g) {
    flag('no [data-motion="hero-title"] on the page');
  } else if (reduce) {
    if (g.words.length) flag(`reduce: title split into ${g.words.length} words`);
    else rows.push('  reduce: not split, plain text');
  } else {
    if (!g.words.length) flag('title not split');
    // 1. Layout: same line offsets and height as the unsplit title (±1 px).
    // Text boxes sit half a leading below the word boxes: compare line steps, not raw offsets.
    const steps0 = (g.lines0 || []).map((v) => v - g.lines0[0]);
    const steps1 = g.lines.map((v) => v - g.lines[0]);
    const sameLines = steps0.length === steps1.length && steps0.every((v, i) => Math.abs(v - steps1[i]) <= 1);
    if (!sameLines || Math.abs(g.h - g.h0) > 1) flag(`layout changed: lines ${JSON.stringify(g.lines0)} → ${JSON.stringify(g.lines)}, h ${g.h0} → ${g.h}`);
    else rows.push(`  layout: ${g.lines.length} lines, h ${g.h} — same as unsplit; ${g.words.length} words`);
    // 2. At load the title is below the front: all grey.
    const lit0 = g.words.filter((w) => w.o > DIM + 0.01).length;
    if (lit0) flag(`at load ${lit0} words already painted`);
    else rows.push('  load: all words grey');

    // 3. Scroll through: reading order, lines white before the axis, back = grey.
    const docTop = g.top + g.y;
    const from = Math.max(0, docTop - g.vh);
    const to = docTop + g.h - g.axis + 40;
    const steps = 24;
    let painted = 0;
    let n = g.words.length;
    let shot = 0;
    for (let i = 0; i <= steps; i++) {
      const y = from + ((to - from) * i) / steps;
      await p.evaluate((y) => scrollTo(0, y), y);
      await p.waitForTimeout(vp.touch ? 250 : 2400); // Lenis eases 2 s to a programmatic jump
      const s = await read();
      // Reading order: opacity never rises from one word to the next.
      for (let k = 1; k < s.words.length; k++)
        if (s.words[k].o > s.words[k - 1].o + 0.02) {
          flag(`y ${Math.round(s.y)}: «${s.words[k].t}» ${s.words[k].o.toFixed(2)} ahead of «${s.words[k - 1].t}» ${s.words[k - 1].o.toFixed(2)}`);
          break;
        }
      // A word visible between the axis and the viewport bottom is fully white once its top is at the axis.
      const late = s.words.filter((w) => w.top <= s.axis && w.bottom > s.axis - 400 && w.o < 0.99);
      if (late.length) flag(`y ${Math.round(s.y)}: ${late.length} words at/above the axis not white (${late[0].t} ${late[0].o.toFixed(2)})`);
      // Nothing below the front (85 % vh) is painted.
      const early = s.words.filter((w) => w.top > s.vh * 0.85 + 2 && w.o > DIM + 0.01);
      if (early.length) flag(`y ${Math.round(s.y)}: ${early.length} words below the front already painted (${early[0].t})`);
      painted = s.words.filter((w) => w.o > 0.99).length;
      n = s.words.length;
      const mid = s.words.filter((w) => w.o > DIM + 0.01 && w.o < 0.99).length;
      if (i % 4 === 0) rows.push(`  y ${Math.round(s.y)}: white ${painted}, painting ${mid}, grey ${s.words.length - painted - mid}`);
      if (mid && shot < 3 && s.words.some((w) => w.o < 0.99 && w.top < s.vh)) {
        await p.screenshot({ path: `${out}/title-paint-${vp.n}-${++shot}.png` });
      }
    }
    if (painted !== n) flag(`end: only ${painted}/${n} white`);
    // Back up: grey again.
    await p.evaluate((y) => scrollTo(0, y), from);
    await p.waitForTimeout(vp.touch ? 400 : 2600);
    const back = await read();
    const lit = back.words.filter((w) => w.o > DIM + 0.01).length;
    if (lit) flag(`back at y ${Math.round(back.y)}: ${lit} words still painted`);
    else rows.push('  back: all grey again');
  }
  if (errs.length) flag(`page errors: ${errs.join(' | ')}`);
  rows.push(`  ${flags ? `${flags} flags` : '0 flags'}`);
  console.log(rows.join('\n'));
  total += flags;
  await ctx.close();
}
await b.close();
console.log(`TOTAL ${total} flags`);
