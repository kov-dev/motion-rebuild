// Fast-scroll probe (session 48, user: "a sharp flick breaks the scroll animations", "entering a pinned / horizontal
// section jerks"). Staging with the local src/*.js, mouse band (Lenis). For every pin of the page (its .pin-spacer):
//   flick — a hard wheel spin (50 × 120 px every 16 ms) from 1.5 vh above the pin start;
//   notch — an ordinary scroll (2 × 100 px, 60 ms apart) from 150 px above the pin start;
// plus one flick through the Lessons (no pins). Each run traces every frame: scroll and the pinned element's top.
// Reported: travelled distance, peak scroll speed, scroll speed when the pin starts, and the peak frame-to-frame change
// of the pinned element's screen velocity (px/s) — the jerk of the stop.
// Usage: node scroll-flick.mjs [--live] [1440|1280]
import { chromium } from 'playwright';
import fs from 'node:fs';

const ROOT = '/Users/mac/Claude/Projects/Motion';
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const args = process.argv.slice(2);
const published = args.includes('--live');
const only = args.filter((a) => !a.startsWith('--'));
const VPS = [
  { n: '1440', w: 1440, h: 900 },
  { n: '1280', w: 1280, h: 800 },
].filter((v) => (only.length ? only.includes(v.n) : v.n === '1440'));

function pins() {
  return [...document.querySelectorAll('.pin-spacer')].map((sp) => {
    const el = sp.firstElementChild;
    const top = Math.round(sp.getBoundingClientRect().top + scrollY);
    const role = el.dataset.motion || el.className.split(' ')[0];
    return { role, top, end: Math.round(top + sp.offsetHeight - el.offsetHeight) };
  });
}

function startTrace(i) {
  const el = i >= 0 ? document.querySelectorAll('.pin-spacer')[i].firstElementChild : null;
  const rows = [];
  window.__trace = rows;
  const t0 = performance.now();
  const tick = () => {
    rows.push({ t: performance.now() - t0, y: scrollY, e: el ? el.getBoundingClientRect().top : null });
    if (window.__trace === rows) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const stopTrace = () => {
  const r = window.__trace;
  window.__trace = null;
  return r;
};

const speeds = (rows, pick) => {
  const v = [];
  for (let i = 1; i < rows.length; i++) {
    const dt = (rows[i].t - rows[i - 1].t) / 1000;
    v.push(dt > 0 ? (pick(rows[i]) - pick(rows[i - 1])) / dt : 0);
  }
  return v;
};

const b = await chromium.launch({ channel: 'chrome' });
for (const vp of VPS) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  if (!published)
    await p.route(/cdn\.jsdelivr\.net\/gh\/kov-dev\/motion-rebuild@[^/]+\/src\/(.+\.js)/, (r) => {
      const f = r.request().url().match(/\/src\/(.+\.js)/)[1];
      r.fulfill({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(`${ROOT}/src/${f}`, 'utf8') });
    });
  await p.goto(STAGING, { waitUntil: 'load', timeout: 90000 });
  await p.waitForFunction(() => !document.documentElement.classList.contains('is-preloading') && document.querySelectorAll('.pin-spacer').length >= 4, null, { timeout: 30000 });
  await p.waitForTimeout(1500);
  const ps = await p.evaluate(pins);
  const lessons = await p.evaluate(() => Math.round(document.querySelector('#easing').getBoundingClientRect().top + scrollY));
  console.log(`== ${vp.n}${published ? ' live' : ''}: ${ps.map((x) => `${x.role} ${x.top}–${x.end}`).join(', ')}`);

  const run = async (name, from, idx, n, dy, gap, pinTop) => {
    await p.evaluate((y) => scrollTo(0, y), Math.round(from));
    await p.waitForTimeout(2500);
    await p.mouse.move(vp.w / 2, vp.h / 2);
    await p.evaluate(startTrace, idx);
    for (let i = 0; i < n; i++) {
      await p.mouse.wheel(0, dy);
      await p.waitForTimeout(gap);
    }
    await p.waitForTimeout(3500);
    const rows = await p.evaluate(stopTrace);
    const vs = speeds(rows, (r) => r.y);
    const peak = Math.max(...vs.map(Math.abs));
    let atPin = '';
    let jerk = '';
    if (pinTop != null) {
      const k = rows.findIndex((r) => r.y >= pinTop);
      atPin = k > 0 ? `, at pin ${Math.round(Math.abs(vs[k - 1]))} px/s` : ', pin not reached';
      const ve = speeds(rows, (r) => r.e);
      let dv = 0;
      for (let i = 1; i < ve.length; i++) dv = Math.max(dv, Math.abs(ve[i] - ve[i - 1]));
      jerk = `, stop jerk ${Math.round(dv)} px/s`;
    }
    const d = Math.round(rows[rows.length - 1].y - rows[0].y);
    console.log(`${name.padEnd(28)} +${d} px, peak ${Math.round(peak)} px/s${atPin}${jerk}`);
  };

  for (const [i, pin] of ps.entries()) {
    await run(`flick → ${pin.role}`, pin.top - 1.5 * vp.h, i, 50, 120, 16, pin.top);
    await run(`notch → ${pin.role}`, pin.top - 150, i, 2, 100, 60, pin.top);
  }
  await run('flick lessons', lessons, -1, 50, 120, 16, null);
  if (errs.length) console.log(`errors: ${errs.join(' | ')}`);
  await ctx.close();
}
await b.close();
