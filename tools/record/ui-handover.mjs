// Hero ball → first ui dot hand-over with the local src/motion.js: samples ±400 px around the first pin start, down and up.
// Usage: node ui-handover.mjs 1440 1280 768 375   (counts frames with 0 or 2 balls and the jump at the swap)
import { chromium } from 'playwright';
import fs from 'fs';
const SRC = '/Users/mac/Claude/Projects/Motion/src';
const VPS = { 1440: [1440, 750], 1280: [1280, 800], 768: [768, 1024], 375: [375, 812] };
const b = await chromium.launch({ channel: 'chrome' });
for (const key of process.argv.slice(2)) {
  const [w, h] = VPS[key];
  const m = w < 480;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: m, hasTouch: m });
  const p = await ctx.newPage();
  await p.route(/cdn\.jsdelivr\.net\/gh\/kov-dev\/motion-rebuild@[^/]+\/src\/(.+\.js)/, (r) => {
    const f = r.request().url().match(/\/src\/(.+\.js)/)[1];
    r.fulfill({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(`${SRC}/${f}`, 'utf8') });
  });
  await p.goto('https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/', { waitUntil: 'load', timeout: 90000 });
  await p.waitForTimeout(9000);
  const start = await p.evaluate(() => {
    const st = ScrollTriggerStart();
    function ScrollTriggerStart() { const b = document.querySelector('[data-motion="ui"]'); const sp = b.parentElement; return (sp.classList.contains('pin-spacer') ? sp : b).getBoundingClientRect().top + scrollY; }
    return st;
  });
  const sample = () => p.evaluate(() => {
    const vis = (el) => { const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && +cs.opacity > 0.01; };
    const c = (r) => [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)];
    const ball = document.querySelector('[data-motion="hero-ball"]');
    const block = document.querySelector('[data-motion="ui"]');
    const panel = block.querySelector('[data-motion="ui-slide"]');
    const land = block.querySelector('[data-motion="ui-landing"]');
    const br = ball.getBoundingClientRect();
    return { y: Math.round(scrollY), hero: vis(ball) && br.bottom > 0 && br.top < innerHeight ? c(br) : null, dot: vis(land) ? c(panel.getBoundingClientRect()) : null, clip: getComputedStyle(panel).clipPath };
  });
  const rows = [];
  for (const dir of [1, -1]) {
    const ys = []; for (let d = -400; d <= 400; d += 20) ys.push(start + d);
    if (dir < 0) ys.reverse();
    await p.evaluate((y) => scrollTo(0, y), ys[0]); await p.waitForTimeout(800);
    for (const y of ys) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(60); rows.push({ dir, ...(await sample()) }); }
  }
  let bad = 0, maxGap = 0;
  for (const r of rows) {
    if (r.hero && r.dot) bad++;
    if (!r.hero && !r.dot) bad++;
  }
  // jump at the swap: last hero position vs first dot position (down) and back
  for (let i = 1; i < rows.length; i++) {
    const a = rows[i - 1], c = rows[i];
    if (a.dir !== c.dir) continue;
    const pa = a.hero || a.dot, pc = c.hero || c.dot;
    if ((a.hero && c.dot) || (a.dot && c.hero)) maxGap = Math.max(maxGap, Math.hypot(pa[0] - pc[0], pa[1] - pc[1]));
  }
  console.log(key, 'pinStart', Math.round(start), 'frames with 0 or 2 balls:', bad, 'swap jump px:', Math.round(maxGap));
  if (bad) console.log(rows.filter((r) => (r.hero && r.dot) || (!r.hero && !r.dot)).slice(0, 6));
  await ctx.close();
}
await b.close();
