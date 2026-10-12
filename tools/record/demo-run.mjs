// Easing demo on staging with the local src/*.js (--live: the published module), session 42 (user: "jerky, the line
// must fill with the scroll, and carry on if we got stuck in the middle").
// 1) Sweep: native scrollTo to points across the sticky zone (plus a little before / after, which must stay put), wait,
//    and check that the scroll rests on a state: line on tick (i + 1) / 6, video i visible and the only one playing,
//    ticks 0…i lit, step titles [1, 1, 2, 2, 3, 3][i].
// 2) Wheel (mouse bands, Lenis): from state 1, a few notches down (the line stops between ticks) → state 2; then up → 1.
// 3) Smoothness: one slow wheel run through the whole zone sampled every frame — the line only grows, never jumps by
//    more than a tick in one frame, and every video swap happens with the line near the middle between two ticks.
// Usage: node demo-run.mjs [--live] [--reduce] [1440|768|375 ...] (default 1440 768 375)
import { chromium } from 'playwright';
import fs from 'node:fs';

const ROOT = '/Users/mac/Claude/Projects/Motion';
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const args = process.argv.slice(2);
const published = args.includes('--live');
const reduce = args.includes('--reduce');
const only = args.filter((a) => !a.startsWith('--'));
const VPS = [
  { n: '1440', w: 1440, h: 900 },
  { n: '768', w: 768, h: 1024, touch: true, ua: UA },
  { n: '375', w: 375, h: 812, touch: true, ua: UA },
].filter((v) => (only.length ? only.includes(v.n) : true));
const STATES = 6;
const STEPS = [1, 1, 2, 2, 3, 3];

function read() {
  const d = document.querySelector('[data-motion="lesson-demo"]');
  const vids = [...d.querySelectorAll('[data-motion="demo-video"]')];
  const line = d.querySelector('[data-motion="demo-line"]');
  const fill = line.getBoundingClientRect().width / line.parentElement.getBoundingClientRect().width;
  const ticks = [...d.querySelectorAll('[data-motion="demo-tick"]')];
  return {
    y: Math.round(scrollY),
    top: Math.round(d.getBoundingClientRect().top + scrollY),
    h: d.offsetHeight,
    fill,
    video: vids.findIndex((v) => v.classList.contains('is-active')),
    opaque: vids.map((v) => +getComputedStyle(v).opacity),
    playing: vids.map((v, i) => (!v.paused ? i : null)).filter((x) => x !== null),
    lit: ticks.filter((e) => e.classList.contains('is-on')).length,
    steps: [...d.querySelectorAll('[data-motion="demo-step"]')].filter((e) => e.classList.contains('is-active')).length,
  };
}

const b = await chromium.launch({ channel: 'chrome' });
let total = 0;
for (const vp of VPS) {
  const ctx = await b.newContext({
    viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, reducedMotion: reduce ? 'reduce' : 'no-preference',
    isMobile: !!vp.touch, hasTouch: !!vp.touch, ...(vp.ua ? { userAgent: vp.ua } : {}),
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  if (!published)
    await p.route(/cdn\.jsdelivr\.net\/gh\/kov-dev\/motion-rebuild@[^/]+\/src\/(.+\.js)/, (r) => {
      const f = r.request().url().match(/\/src\/(.+\.js)/)[1];
      r.fulfill({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(`${ROOT}/src/${f}`, 'utf8') });
    });
  await p.goto(STAGING, { waitUntil: 'load', timeout: 90000 });
  await p.waitForFunction(() => !document.documentElement.classList.contains('is-preloading'), null, { timeout: 30000 });
  await p.waitForTimeout(2000);
  let g = await p.evaluate(read);
  const from = g.top;
  const to = g.top + g.h - vp.h;
  const unit = (to - from) / (STATES - 1);
  const rows = [`== ${vp.n} ${vp.w}×${vp.h}${vp.touch ? ' touch' : ''}${reduce ? ' reduce' : ''}: zone ${from}…${to}, ${Math.round(unit)} px per state`];
  let flags = 0;
  const flag = (s) => { flags++; rows.push(`  ⚠ ${s}`); };
  const settle = 2600;
  const label = (s) => `y ${s.y} line ${(s.fill * 100).toFixed(1)}% video ${s.video} playing [${s.playing}] ticks ${s.lit} steps ${s.steps}`;
  // Rest state i: the scroll at its tick, everything else consistent with i.
  const restOf = (s) => {
    const i = Math.round((s.y - from) / unit);
    const ok = i >= 0 && i < STATES && Math.abs(s.y - (from + i * unit)) <= 2 && Math.abs(s.fill - (i + 1) / STATES) < 0.004
      && s.video === i && s.lit === Math.min(i + 1, 5) && s.steps === STEPS[i] && (reduce || s.playing.join() === String(i));
    return ok ? i : null;
  };

  // 1) Sweep.
  const step = Math.round(unit * 0.37);
  await p.evaluate((y) => scrollTo(0, y), from - vp.h);
  await p.waitForTimeout(800);
  for (let y = from - Math.round(unit / 2); y <= to + unit / 2; y += step) {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(settle);
    const s = await p.evaluate(read);
    const inZone = y >= from && y <= to;
    if (!inZone && Math.abs(s.y - y) > 2) flag(`outside the demo ${y} moved to ${s.y}`);
    const i = restOf(s);
    if (inZone && i === null) flag(`${y} → ${label(s)}: not a rest state`);
    rows.push(`sweep ${String(y).padStart(6)} → ${i === null ? '-' : `state ${i}`} ${label(s)}${Math.abs(s.y - y) > 2 ? '  (snap)' : ''}`);
  }

  // 2) Wheel between two ticks (Lenis only).
  if (!vp.touch && !reduce) {
    await p.mouse.move(vp.w / 2, vp.h / 2);
    for (const [dir, start, want] of [[1, 1, 2], [-1, 2, 1]]) {
      await p.evaluate((y) => scrollTo(0, y), Math.round(from + start * unit));
      await p.waitForTimeout(settle);
      for (let k = 0; k < 2; k++) {
        await p.mouse.wheel(0, 100 * dir);
        await p.waitForTimeout(60);
      }
      const mid = await p.evaluate(read);
      await p.waitForTimeout(settle + 800);
      const s = await p.evaluate(read);
      rows.push(`wheel ${dir > 0 ? 'down' : 'up'} 2 notches from state ${start}: ${label(mid)} → state ${restOf(s)} ${label(s)}`);
      if (restOf(s) !== want) flag(`wheel ${dir > 0 ? 'down' : 'up'}: expected state ${want}`);
    }
  }

  // 3) Smoothness: snap off, one slow wheel / scroll run through the zone, sampled every frame.
  if (!reduce) {
    await p.evaluate(() => (document.documentElement.dataset.motionSnap = 'off'));
    await p.evaluate((y) => scrollTo(0, y), from - 10);
    await p.waitForTimeout(settle);
    await p.evaluate(() => {
      window.__demo = [];
      const d = document.querySelector('[data-motion="lesson-demo"]');
      const line = d.querySelector('[data-motion="demo-line"]');
      const vids = [...d.querySelectorAll('[data-motion="demo-video"]')];
      const tick = () => {
        window.__demo.push({ fill: line.getBoundingClientRect().width / line.parentElement.getBoundingClientRect().width, video: vids.findIndex((v) => v.classList.contains('is-active')) });
        window.__raf = requestAnimationFrame(tick);
      };
      tick();
    });
    if (!vp.touch) {
      await p.mouse.move(vp.w / 2, vp.h / 2);
      for (let y = 0; y < to - from + 200; y += 60) {
        await p.mouse.wheel(0, 60);
        await p.waitForTimeout(50);
      }
    } else {
      for (let y = from; y <= to + 100; y += 12) {
        await p.evaluate((y) => scrollTo(0, y), y);
        await p.waitForTimeout(16);
      }
    }
    await p.waitForTimeout(settle);
    const f = await p.evaluate(() => (cancelAnimationFrame(window.__raf), delete document.documentElement.dataset.motionSnap, window.__demo));
    let maxJump = 0;
    let back = 0;
    const swaps = [];
    for (let k = 1; k < f.length; k++) {
      const dj = f[k].fill - f[k - 1].fill;
      maxJump = Math.max(maxJump, dj);
      if (dj < -0.001) back++;
      if (f[k].video !== f[k - 1].video) swaps.push(f[k].fill * STATES - 1); // in states: i + 0.5 expected
    }
    const offMid = swaps.map((u) => Math.abs(u - Math.floor(u) - 0.5));
    rows.push(`smooth: ${f.length} frames, line ${(f[0].fill * 100).toFixed(1)} → ${(f.at(-1).fill * 100).toFixed(1)}%, max step ${(maxJump * 100).toFixed(2)}%/frame, back ${back}, swaps at ${swaps.map((u) => u.toFixed(2)).join(' ')}`);
    if (maxJump > 1 / STATES / 2) flag('line jumps more than half a tick in one frame');
    if (back) flag('line went back on a forward scroll');
    if (swaps.length !== STATES - 1) flag(`expected ${STATES - 1} video swaps`);
    if (offMid.some((x) => x > 0.08)) flag('a video swap is far from the middle between ticks');
  }

  if (errs.length) flag(`errors: ${errs.join(' | ')}`);
  rows.push(`${flags ? `⚠ ${flags} flags` : '0 flags'}`);
  console.log(rows.join('\n'));
  total += flags;
  await ctx.close();
}
await b.close();
console.log(`TOTAL ${total} flags`);
