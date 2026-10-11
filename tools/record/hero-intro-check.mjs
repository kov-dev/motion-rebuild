// Staging check for two Hero / Intro details:
// 1) the black plate covers everything above the Hero axis once the axis is stuck (no text between the
//    ring's top and the line), 2) the four Intro pills carry their words and open when the ball reaches them.
// Usage: node hero-intro-check.mjs <out-dir> [1440|768|375 ...] [--live]  (--live: also measure motion.zajno.com)
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const live = args.includes('--live');
const [out, ...only] = args.filter((a) => a !== '--live');
const LIVE = 'https://motion.zajno.com/';
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const VIEWPORTS = { 1440: { w: 1440, h: 900 }, 768: { w: 768, h: 1024 }, 375: { w: 375, h: 812, m: true } };
const WORDS = ['It also', 'controls', 'your', 'attention'];

// Scrolls through Intro and returns, for every pill, the scroll step where its word starts to open and how far
// the ball centre is from the pill box then (0 = on it). The word is open once its translateY is below its height.
// `old`: the live site's DOM (.anim-text, #anim-ball, #introduction).
async function pillOpenings(p, old) {
  const sel = old
    ? { scene: '#introduction', text: '.anim-text', ball: '#anim-ball' }
    : { scene: '[data-motion="intro"]', text: '[data-motion="intro-text"]', ball: '[data-motion="hero-ball"]' };
  const range = await p.evaluate((sel) => {
    const s = document.querySelector(sel.scene).getBoundingClientRect();
    return { from: s.top + scrollY - innerHeight / 2, to: s.bottom + scrollY - innerHeight / 2 };
  }, sel);
  const opened = WORDS.map(() => null);
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const y = range.from + ((range.to - range.from) * i) / steps;
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(i ? 100 : 1500);
    const state = await p.evaluate(
      ({ sel, WORDS }) => {
        const b = document.querySelector(sel.ball).getBoundingClientRect();
        const bx = b.left + b.width / 2;
        const by = b.top + b.height / 2;
        const all = [...document.querySelectorAll(sel.text)];
        return WORDS.map((w) => {
          const t = all.find((el) => el.textContent.trim() === w);
          if (!t) return null;
          const ty = new DOMMatrix(getComputedStyle(t).transform).m42;
          const pill = t.parentElement.parentElement.getBoundingClientRect();
          const dx = Math.max(pill.left - bx, 0, bx - pill.right);
          const dy = Math.max(pill.top - by, 0, by - pill.bottom);
          return { shown: ty < t.offsetHeight - 1, d: Math.round(Math.hypot(dx, dy)) };
        });
      },
      { sel, WORDS }
    );
    state.forEach((s, k) => {
      if (s && s.shown && !opened[k]) opened[k] = { i, d: s.d };
    });
  }
  return WORDS.map((w, k) => {
    const o = opened[k];
    return { o, line: `${o ? '✓' : '⚠'} «${w}» opens at step ${o ? o.i : '—'}/${steps}, ball ${o ? o.d : '—'} px from the pill` };
  });
}

const b = await chromium.launch({ channel: 'chrome' });
let flags = 0;
for (const [name, vp] of Object.entries(VIEWPORTS)) {
  if (only.length && !only.includes(name)) continue;
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.m, hasTouch: !!vp.m });
  const p = await ctx.newPage();
  await p.goto(STAGING, { waitUntil: 'load' });
  await p.waitForFunction(() => !document.documentElement.classList.contains('is-preloading'), null, { timeout: 30000 });
  await p.waitForTimeout(2000);
  const msg = [];

  // 1) Plate: scroll through Hero; at every step nothing but the plate / axis may sit above the line.
  const plate = [];
  for (const k of [0.3, 0.6, 0.9, 1.2]) {
    await p.evaluate((k) => scrollTo(0, k * innerHeight), k);
    await p.waitForTimeout(400);
    plate.push(
      await p.evaluate(() => {
        const axis = document.querySelector('[data-motion="hero-ball-wrap"]').getBoundingClientRect();
        const ring = document.querySelector('[data-motion="hero-ball-border"]').getBoundingClientRect();
        const y0 = axis.top + axis.height / 2;
        // The plate has pointer-events: none, so hit testing can't see it: compare geometry instead.
        // Uncovered parts of the band above the line = [0, y0 − 1] minus the plate.
        const pl = document.querySelector('.hero-plate').getBoundingClientRect();
        const open = [[0, Math.min(pl.top, y0 - 1)], [Math.max(pl.bottom, 0), y0 - 1]].filter(([a, c]) => c - a > 0.5);
        const leaks = [];
        for (const el of document.querySelectorAll('.hero-lead p, .hero-statement h1')) {
          const range = document.createRange();
          range.selectNodeContents(el);
          for (const line of range.getClientRects()) {
            if (open.some(([a, c]) => line.bottom > a && line.top < c)) leaks.push(`${el.tagName} line ${Math.round(line.top)}…${Math.round(line.bottom)}`);
          }
        }
        return { y0: Math.round(y0), leaks: leaks.length, sample: leaks.slice(0, 2), ring: Math.round(ring.height) };
      })
    );
  }
  const leaky = plate.filter((s) => s.leaks);
  if (leaky.length) flags++;
  msg.push(`${leaky.length ? '⚠' : '✓'} plate: ${plate.map((s) => `axis ${s.y0}: ${s.leaks} leaks${s.leaks ? ' ' + s.sample.join(' ') : ''}`).join(' · ')}`);
  await p.evaluate(() => scrollTo(0, 0.6 * innerHeight));
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/plate-${name}.png` });

  // 2) Pills: words, then open moments against the ball position along the Intro scroll.
  const texts = await p.evaluate(() =>
    [...document.querySelectorAll('[data-motion="intro-text"]')].sort((a, c) => a.dataset.step - c.dataset.step).map((t) => t.textContent.trim())
  );
  const wordsOk = WORDS.every((w, i) => texts[i] === w);
  if (!wordsOk) flags++;
  msg.push(`${wordsOk ? '✓' : '⚠'} pill words: ${texts.join(' / ')}`);

  const ours = await pillOpenings(p, false);
  flags += ours.filter((r) => !r.o).length;
  msg.push(...ours.map((r) => r.line));
  if (live) {
    // Same measurement on motion.zajno.com for comparison.
    const lp = await ctx.newPage();
    await lp.goto(LIVE, { waitUntil: 'load' });
    await lp.waitForFunction(() => getComputedStyle(document.querySelector('.loader')).display === 'none', null, { timeout: 40000 });
    await lp.waitForTimeout(2000);
    msg.push(...(await pillOpenings(lp, true)).map((r) => 'live ' + r.line));
    await lp.close();
  }
  await p.screenshot({ path: `${out}/pills-${name}.png` });
  console.log(`${name}\n  ` + msg.join('\n  '));
  await ctx.close();
}
await b.close();
console.log(flags ? `${flags} flag(s)` : '0 flags');
process.exit(flags ? 1 : 0);
