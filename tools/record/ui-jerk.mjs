// UI slider smoothness probe (session 45, user: "the ball snaps back very sharply from the second heading", "headings
// bounce in the centre on a fast scroll", "vertical ↔ horizontal transitions are not smooth"). Staging with the local
// src/*.js, mouse band (Lenis). Each scenario wheels from a start point and traces every frame: scroll, heading tops,
// the hand-over ball. Reported: scroll path, scroll reversals (a bounce), peak scroll speed after the input stopped
// (a snap that kicks off fast), peak frame-to-frame change of the screen velocity of the watched element (a jerk).
// Variants patch the source: --snap-off (html[data-motion-snap=off]), --no-anticipate (anticipatePin 0).
// Usage: node ui-jerk.mjs [--live] [--snap-off] [--no-anticipate] [1440|1280]
import { chromium } from 'playwright';
import fs from 'node:fs';

const ROOT = '/Users/mac/Claude/Projects/Motion';
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const args = process.argv.slice(2);
const published = args.includes('--live');
const snapOff = args.includes('--snap-off');
const noAnticipate = args.includes('--no-anticipate');
const only = args.filter((a) => !a.startsWith('--'));
const VPS = [
  { n: '1440', w: 1440, h: 900 },
  { n: '1280', w: 1280, h: 800 },
].filter((v) => (only.length ? only.includes(v.n) : v.n === '1440'));

function geo() {
  const bs = [...document.querySelectorAll('[data-motion="ui"]')].map((b) => {
    const sp = b.parentElement.classList.contains('pin-spacer') ? b.parentElement : b;
    const top = sp.getBoundingClientRect().top + scrollY;
    return { top: Math.round(top), end: Math.round(top + sp.offsetHeight - b.offsetHeight), h: b.offsetHeight };
  });
  return { pins: bs, unit: 0.12 * innerWidth };
}

// Per-frame trace of what the eye follows.
function startTrace() {
  const bs = [...document.querySelectorAll('[data-motion="ui"]')];
  const hs = bs.map((b) => b.querySelector('[data-motion="ui-text"]'));
  const ball = bs[0].querySelector('[data-motion="ui-ball"]');
  const rows = [];
  window.__trace = rows;
  const t0 = performance.now();
  const tick = () => {
    const br = ball.getBoundingClientRect();
    rows.push({
      t: performance.now() - t0,
      y: scrollY,
      h: hs.map((h) => h.getBoundingClientRect().top),
      bx: br.left + br.width / 2,
      by: br.top + br.height / 2,
      bo: +getComputedStyle(ball).opacity,
    });
    if (window.__trace === rows) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const stopTrace = () => {
  const r = window.__trace;
  window.__trace = null;
  return r;
};

// Frame metrics on a series v(t): screen velocity px/s per frame, max |Δv| between neighbouring frames.
function metrics(rows, pick, fromT = 0) {
  let peakV = 0;
  let peakDv = 0;
  let atDv = 0;
  let prevV = null;
  for (let i = 1; i < rows.length; i++) {
    const a = pick(rows[i - 1]);
    const b = pick(rows[i]);
    if (a == null || b == null) { prevV = null; continue; }
    const dt = (rows[i].t - rows[i - 1].t) / 1000;
    if (dt <= 0) continue;
    const v = (b - a) / dt;
    if (rows[i].t >= fromT) peakV = Math.max(peakV, Math.abs(v));
    if (prevV !== null && Math.abs(v - prevV) > peakDv) {
      peakDv = Math.abs(v - prevV);
      atDv = Math.round(rows[i].t);
    }
    prevV = v;
  }
  return { peakV: Math.round(peakV), peakDv: Math.round(peakDv), atDv };
}
function reversals(rows) {
  let dir = 0;
  let n = 0;
  for (let i = 1; i < rows.length; i++) {
    const d = Math.sign(Math.round(rows[i].y - rows[i - 1].y));
    if (!d) continue;
    if (dir && d !== dir) n++;
    dir = d;
  }
  return n;
}

const b = await chromium.launch({ channel: 'chrome' });
for (const vp of VPS) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  if (!published)
    await p.route(/cdn\.jsdelivr\.net\/gh\/kov-dev\/motion-rebuild@[^/]+\/src\/(.+\.js)/, (r) => {
      const f = r.request().url().match(/\/src\/(.+\.js)/)[1];
      let body = fs.readFileSync(`${ROOT}/src/${f}`, 'utf8');
      if (noAnticipate) body = body.replace(/anticipatePin: 1/g, 'anticipatePin: 0');
      r.fulfill({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body });
    });
  await p.goto(STAGING, { waitUntil: 'load', timeout: 90000 });
  await p.waitForFunction(() => !document.documentElement.classList.contains('is-preloading')
    && [...document.querySelectorAll('[data-motion="ui"]')].every((b) => b.parentElement.classList.contains('pin-spacer')), null, { timeout: 30000 });
  if (snapOff) await p.evaluate(() => (document.documentElement.dataset.motionSnap = 'off'));
  await p.waitForTimeout(1500);
  const g = await p.evaluate(geo);
  const [p0, p1] = g.pins;
  console.log(`== ${vp.n}${snapOff ? ' snap-off' : ''}${noAnticipate ? ' no-anticipate' : ''}${published ? ' live' : ''}: pins ${g.pins.map((x) => `${x.top}–${x.end}`).join(', ')}, unit ${g.unit}px`);

  const scenarios = [
    // The user's case: resting on the second heading, a short wheel up.
    { name: 'back from heading 2', from: p1.top + 2 * g.unit, notches: 6, dy: -100, gap: 60, watch: (r) => r.by, what: 'ball' },
    // A fast scroll from the last panel of block 1 into the second heading.
    { name: 'fast down to heading 2', from: p0.end - 6 * g.unit, notches: 8, dy: 100, gap: 30, watch: (r) => r.h[1], what: 'heading 2' },
    // A fast scroll from the Intro into the first heading.
    { name: 'fast down to heading 1', from: p0.top - 1.2 * vp.h, notches: 8, dy: 100, gap: 30, watch: (r) => r.h[0], what: 'heading 1' },
    // A fast scroll up from the panels of block 2 to its heading.
    { name: 'fast up to heading 2', from: p1.top + 14 * g.unit, notches: 8, dy: -100, gap: 30, watch: (r) => r.h[1], what: 'heading 2' },
    // Leaving the last block downwards into Interactive.
    { name: 'fast down out of block 2', from: p1.end - 3 * g.unit, notches: 8, dy: 100, gap: 30, watch: (r) => r.h[1], what: 'heading 2' },
  ];
  for (const s of scenarios) {
    await p.evaluate((y) => scrollTo(0, y), Math.round(s.from));
    await p.waitForTimeout(2500);
    await p.mouse.move(vp.w / 2, vp.h / 2);
    await p.evaluate(startTrace);
    const tIn = Date.now();
    for (let i = 0; i < s.notches; i++) {
      await p.mouse.wheel(0, s.dy);
      await p.waitForTimeout(s.gap);
    }
    const inputMs = Date.now() - tIn;
    await p.waitForTimeout(3500);
    const rows = await p.evaluate(stopTrace);
    const y0 = Math.round(rows[0].y);
    const y1 = Math.round(rows[rows.length - 1].y);
    const m = metrics(rows, s.watch);
    const sc = metrics(rows, (r) => r.y, inputMs + 250);
    console.log(
      `${s.name.padEnd(26)} scroll ${y0} → ${y1} (${y1 - y0 > 0 ? '+' : ''}${y1 - y0}), reversals ${reversals(rows)}, ` +
        `scroll peak after input ${sc.peakV} px/s; ${s.what}: peak ${m.peakV} px/s, peak Δv ${m.peakDv} px/s at ${m.atDv} ms`
    );
  }
  if (errs.length) console.log(`errors: ${errs.join(' | ')}`);
  await ctx.close();
}
await b.close();
