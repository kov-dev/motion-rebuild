// Ball-hit heading states with the local src/motion.js: jump past the landing, scroll back above it, resize across 992,
// 375 and reduced motion (no split there). Line values = translateY px (line box ≈ 80 px at 1440: −89 hidden above, −31 ≈ hit 1, 0 shown).
// Usage: node hits-check.mjs
import { chromium } from 'playwright';
import fs from 'fs';
const SRC = '/Users/mac/Claude/Projects/Motion/src';
const b = await chromium.launch({ channel: 'chrome' });
const page = async (w, h, opts = {}) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, ...opts });
  const p = await ctx.newPage();
  await p.route(/cdn\.jsdelivr\.net\/gh\/kov-dev\/motion-rebuild@[^/]+\/src\/(.+\.js)/, (r) => {
    const f = r.request().url().match(/\/src\/(.+\.js)/)[1];
    r.fulfill({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(`${SRC}/${f}`, 'utf8') });
  });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/', { waitUntil: 'load', timeout: 90000 });
  await p.waitForTimeout(9000);
  return { p, errs };
};
const state = (p) => p.evaluate(() => {
  const t = document.querySelector('[data-motion=ui] .ui-title');
  return { sy: Math.round(scrollY), split: t.children.length, st: [...t.children].map((m) => m.firstElementChild?.style.transform).join(' | '), L: [...t.children].map((m) => { const l = m.firstElementChild; if (!l) return '-'; const tr = getComputedStyle(l).transform; return tr === 'none' ? 0 : Math.round(parseFloat(tr.split(',')[5])); }).join(' ') };
});
// 1440 up: from the pin end back above the landing
{
  const { p, errs } = await page(1440, 820);
  const top = await p.evaluate(() => document.querySelector('[data-motion=ui]').getBoundingClientRect().top + scrollY);
  await p.evaluate((y) => scrollTo(0, y), top + 900); await p.waitForTimeout(3500);
  console.log('1440 down-jump', JSON.stringify(await state(p)));
  for (let y = top + 900; y >= top - 1200; y -= 30) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(90); }
  await p.waitForTimeout(1000);
  console.log('1440 back above', JSON.stringify(await state(p)), errs);
  // resize across 992 and back
  await p.setViewportSize({ width: 900, height: 820 }); await p.waitForTimeout(1500);
  console.log('900 after resize', JSON.stringify(await state(p)));
  await p.setViewportSize({ width: 1440, height: 820 }); await p.waitForTimeout(1500);
  await p.evaluate((y) => scrollTo(0, y), top + 900); await p.waitForTimeout(1500);
  console.log('1440 again, pinned', JSON.stringify(await state(p)), errs);
}
{
  const { p, errs } = await page(375, 812, { isMobile: true, hasTouch: true });
  console.log('375', JSON.stringify(await state(p)), errs);
}
{
  const { p, errs } = await page(1440, 820, { reducedMotion: 'reduce' });
  console.log('1440 reduce', JSON.stringify(await state(p)), errs);
}
await b.close();
