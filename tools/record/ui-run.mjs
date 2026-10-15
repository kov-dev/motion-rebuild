// Walks the Intro UI slider on staging with the local src/*.js (the pinned jsDelivr module is routed to disk; with
// --live the published module runs as is).
// ≥992 (motion video scheme, session 34): checks the storyboard at the steady points of the UI_UNITS schedule — dot
// and panel centres in viewport widths, open/closed panels, the heading gone, the pin length — and that exactly one
// ball is on screen through the hand-over between the blocks. ≤991 (live scheme, unchanged): compares what is on
// screen with motion.zajno.com at the same timeline units (panel rects, open clip, heading, dots).
// Touch bands use a touch context (hover: none, pointer: coarse), so the wide pin is ×UI_TOUCH_WIDE (narrow ×3); `ipad` = 1366×1024 landscape.
// Usage: UI_OUT=<shots-dir> node ui-run.mjs [--live] [--reduce] [1440|1280|ipad|ipad11|768|375 ...] (default 1440 768 375)
import { chromium } from 'playwright';
import fs from 'node:fs';

const ROOT = '/Users/mac/Claude/Projects/Motion';
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const LIVE = 'https://motion.zajno.com/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const IPAD = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const args = process.argv.slice(2);
const published = args.includes('--live');
const reduce = args.includes('--reduce');
const only = args.filter((a) => !a.startsWith('--'));
const VPS = [
  { n: '1440', w: 1440, h: 900 },
  { n: '1280', w: 1280, h: 800 },
  { n: 'ipad', w: 1366, h: 1024, touch: true, ua: IPAD },
  { n: 'ipad11', w: 1194, h: 834, touch: true, ua: IPAD },
  { n: '768', w: 768, h: 1024, touch: true, ua: UA },
  { n: '375', w: 375, h: 812, touch: true, ua: UA },
].filter((v) => (only.length ? only.includes(v.n) : !v.n.startsWith('ipad') && v.n !== '1280'));

// Wide schedule straight from the source, so the walk follows the code's units; the geometry it checks comes from
// the storyboard (docs/sections/intro.md), not from the code.
const src = fs.readFileSync(`${ROOT}/src/motion.js`, 'utf8');
const U = Function(`return ${src.match(/const UI_UNITS = (\{[^}]+\})/)[1]}`)();
const UNIT_PX = +src.match(/const UI_UNIT_PX = ([\d.]+)/)[1];
const TOUCH_WIDE = +src.match(/const UI_TOUCH_WIDE = ([\d.]+)/)[1];
const LAND = +src.match(/const UI_LAND = ([\d.]+)/)[1];

// Steady points of one wide block with n panels: [unit, label, expectations].
// Centres are × vw; `open` lists the panels that must be open, every other panel must be a dot or off screen.
// A block's lead holds the ball's landing (UI_LAND units; the Hero ball on the first block, the previous block's
// ui-ball on the others since session 47, not with reduced motion): its rest point comes after it.
function wideSchedule(n, final, landed) {
  const pts = [[landed ? (LAND + U.lead) / 2 : U.lead / 2, 'rest', { open: [], dots: [[0, 5 / 6]], heading: 'in' }]];
  let t = U.lead + 1 + U.shift;
  const opens = [t];
  for (let i = 1; i < n; i++) {
    t += U.hold;
    t += U.close + U.move;
    opens.push(t);
  }
  opens.forEach((o, i) => {
    const last = i === n - 1;
    const exp = { open: [[i, last && n > 1 ? 2 / 3 : 1 / 3, 2 / 3]], dots: [], heading: 'out' };
    if (!last) exp.dots.push([i + 1, 5 / 6]);
    else if (n > 1) exp.dots.push([i - 1, 1 / 6]);
    pts.push([o + U.hold / 2, `open ${i}`, exp]);
    // Between this panel and the next: both folded into dots, the conveyor halfway (not checked for position).
    if (!last) pts.push([o + U.hold + U.close + U.move / 2, `move ${i}→${i + 1}`, { open: [], dots: null, heading: 'out' }]);
  });
  t += U.hold + U.expand;
  pts.push([t + 0.5, 'wide', { open: [[n - 1, 1 / 2, 1]], dots: [], heading: 'out' }]);
  t += 1;
  if (final) pts.push([t + 0.5, 'final', { open: [[n - 1, 1 / 2, 1]], dots: [], heading: 'out' }]);
  else {
    pts.push([t + U.tail - 1, 'centre dot', { open: [], dots: [[n - 1, 1 / 2]], heading: 'out' }]);
    t += U.tail;
  }
  return { units: final ? t + 1 : t, pts };
}

// Everything on screen that matters, in viewport fractions. A panel is a visible dot when its clip is the small
// circle and the product of opacities from its body up to the block is > 0.5.
function measure() {
  const vw = innerWidth, vh = innerHeight;
  const opacity = (el, stop) => { let o = 1; for (let n = el; n && n !== stop.parentElement; n = n.parentElement) o *= +getComputedStyle(n).opacity; return o; };
  const blocks = [...document.querySelectorAll('[data-motion="ui"]')];
  return {
    blocks: blocks.map((b) => {
      const br = b.getBoundingClientRect();
      const h = b.querySelector('[data-motion="ui-text"]').getBoundingClientRect();
      return {
        top: Math.round(br.top),
        heading: { left: h.left / vw, right: h.right / vw },
        panels: [...b.querySelectorAll('[data-motion="ui-slide"]')].map((p) => {
          const r = p.getBoundingClientRect();
          const rad = +(getComputedStyle(p).clipPath.match(/circle\(([\d.]+)px/) || [])[1] || 0;
          const v = p.querySelector('video');
          const body = p.firstElementChild;
          return {
            cx: (r.left + r.width / 2) / vw, cy: (r.top + r.height / 2) / vh, w: r.width / vw, left: r.left / vw,
            state: rad > 50 ? 'open' : rad > 10 ? 'tween' : 'dot',
            op: opacity(body, b),
            video: v ? { op: +getComputedStyle(v).opacity, playing: !v.paused } : null,
          };
        }),
        ball: (() => {
          const d = b.querySelector('[data-motion="ui-ball"]');
          if (!d) return null;
          const r = d.getBoundingClientRect();
          return { cx: (r.left + r.width / 2) / vw, cy: (r.top + r.height / 2) / vh, op: opacity(d, b) };
        })(),
      };
    }),
  };
}

// Visible balls: dots of closed panels and ui-balls on screen.
function balls(m) {
  const out = [];
  m.blocks.forEach((b, j) => {
    b.panels.forEach((p, i) => p.state === 'dot' && p.op > 0.5 && p.cx > 0 && p.cx < 1 && p.cy > 0 && p.cy < 1 && out.push({ k: `B${j}p${i}`, cx: p.cx, cy: p.cy }));
    if (b.ball && b.ball.op > 0.5 && b.ball.cy > 0 && b.ball.cy < 1) out.push({ k: `B${j}ball`, cx: b.ball.cx, cy: b.ball.cy });
  });
  return out;
}

function ranges() {
  return [...document.querySelectorAll('[data-motion="ui"]')].map((b) => {
    const sp = b.parentElement.classList.contains('pin-spacer') ? b.parentElement : b;
    return { top: Math.round(sp.getBoundingClientRect().top + scrollY), len: Math.round(sp.offsetHeight - b.offsetHeight), n: b.querySelectorAll('[data-motion="ui-slide"]').length };
  });
}

const TOL = 0.012; // × vw / vh
const near = (a, b) => Math.abs(a - b) <= TOL;
const f2 = (v) => v.toFixed(3);

async function openPage(b, vp, url, local) {
  const ctx = await b.newContext({
    viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1,
    isMobile: !!vp.touch, hasTouch: !!vp.touch, ...(vp.ua ? { userAgent: vp.ua } : {}),
    reducedMotion: reduce ? 'reduce' : 'no-preference',
  });
  const p = await ctx.newPage();
  // The walk stops between slides on purpose: the slider snap (snap-run.mjs) is off.
  await p.addInitScript(() => document.addEventListener('DOMContentLoaded', () => (document.documentElement.dataset.motionSnap = 'off')));
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  // A failed ESM import (e.g. a blocked CDN dependency) is not a pageerror: watch failed requests too.
  p.on('requestfailed', (r) => /jsdelivr|cdnjs/.test(r.url()) && errs.push(`requestfailed ${r.url()}`));
  if (local)
    await p.route(/cdn\.jsdelivr\.net\/gh\/kov-dev\/motion-rebuild@[^/]+\/src\/(.+\.js)/, (r) => {
      const f = r.request().url().match(/\/src\/(.+\.js)/)[1];
      r.fulfill({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(`${ROOT}/src/${f}`, 'utf8') });
    });
  await p.goto(url, { waitUntil: 'load', timeout: 90000 });
  return { ctx, p, errs };
}

// Waits for the module: preloader done and the ui blocks pinned.
async function ready(p) {
  await p.waitForFunction(() => !document.documentElement.classList.contains('is-preloading') && document.querySelectorAll('[data-motion="ui"]').length
    && [...document.querySelectorAll('[data-motion="ui"]')].every((b) => b.parentElement.classList.contains('pin-spacer')), null, { timeout: 30000 });
  await p.waitForTimeout(1500);
}

const go = async (p, y, wait) => {
  await p.evaluate((y) => scrollTo(0, y), Math.round(y));
  await p.waitForTimeout(wait);
};

async function runWide(p, vp, out) {
  const rows = [];
  let flags = 0;
  const flag = (s) => { flags++; rows.push(`  ⚠ ${s}`); };
  const r = await p.evaluate(ranges);
  const touch = await p.evaluate(() => matchMedia('(hover: none) and (pointer: coarse)').matches);
  const k = touch ? TOUCH_WIDE : 1;
  rows.push(`== ${vp.n} ${vp.w}×${vp.h} wide${touch ? ' touch' : ''}${reduce ? ' reduce' : ''}: pins ${r.map((x) => `${x.top}+${x.len} (n ${x.n})`).join(', ')}`);
  const wait = reduce ? 500 : 1100;

  for (const [j, blk] of r.entries()) {
    const sch = wideSchedule(blk.n, j === r.length - 1, j === 0 || !reduce);
    const expLen = sch.units * UNIT_PX * vp.w * k;
    if (Math.abs(blk.len - expLen) > 2) flag(`B${j} pin ${blk.len} ≠ ${Math.round(expLen)} (${sch.units} u × ${UNIT_PX}·vw × ${k})`);
    const y = (u) => blk.top + (u / sch.units) * blk.len;
    for (const [u, label, exp] of sch.pts) {
      await go(p, y(u), wait);
      const m = await p.evaluate(measure);
      const b = m.blocks[j];
      const desc = b.panels.map((x, i) => `${i}:${x.state}@${f2(x.cx)}+${f2(x.w)}${x.op < 0.5 ? ' hid' : ''}${x.video ? ` v${x.video.op.toFixed(1)}${x.video.playing ? '>' : 'p'}` : ''}`).join(' ');
      rows.push(`B${j} u${u.toFixed(1).padStart(5)} ${label.padEnd(10)} | ${desc} | head ${f2(b.heading.left)}…${f2(b.heading.right)}`);
      if (Math.abs(b.top) > 1) flag(`not pinned: block top ${b.top}`);
      const openIdx = exp.open.map(([i]) => i);
      for (const [i, cx, w] of exp.open) {
        const x = b.panels[i];
        if (x.state !== 'open') flag(`panel ${i} ${x.state}, expected open`);
        if (!near(x.cx, cx) || !near(x.w, w)) flag(`panel ${i} at ${f2(x.cx)}+${f2(x.w)}, expected ${f2(cx)}+${f2(w)}`);
        if (!near(x.cy, 0.5)) flag(`panel ${i} cy ${f2(x.cy)}`);
        if (x.video && !reduce && x.video.op < 0.9) flag(`panel ${i} video opacity ${x.video.op}`);
      }
      b.panels.forEach((x, i) => !openIdx.includes(i) && x.state !== 'dot' && flag(`panel ${i} ${x.state}, expected a dot`));
      if (exp.dots) {
        const seen = balls(m);
        for (const [i, cx] of exp.dots) {
          const d = seen.find((s) => s.k === `B${j}p${i}`);
          if (!d) flag(`dot ${i} not visible`);
          else if (!near(d.cx, cx) || !near(d.cy, 0.5)) flag(`dot ${i} at ${f2(d.cx)},${f2(d.cy)}, expected ${f2(cx)},0.500`);
        }
        const extra = seen.filter((s) => !exp.dots.some(([i]) => s.k === `B${j}p${i}`));
        if (extra.length) flag(`extra balls: ${extra.map((s) => `${s.k}@${f2(s.cx)},${f2(s.cy)}`).join(' ')}`);
      }
      if (exp.heading === 'in' && (b.heading.left < -TOL || b.heading.left > 0.1)) flag(`heading left ${f2(b.heading.left)}, expected in place`);
      if (exp.heading === 'out' && b.heading.right > TOL) flag(`heading right ${f2(b.heading.right)}, expected gone`);
      if (['rest', 'open 0', 'wide'].includes(label)) await p.screenshot({ path: `${out}/ui-${vp.n}-B${j}-${label.replace(' ', '')}.png` });
    }

    // Hand-over into the next block: one ball all the way, landing on the next block's first dot (5/6) — UI_LAND
    // units into its pin after the bounces on its heading (reduced motion: at the pin start).
    if (j === r.length - 1) break;
    const h0 = blk.top + blk.len;
    const h1 = r[j + 1].top + (reduce ? 0 : LAND * UNIT_PX * vp.w * k);
    let prev = null;
    for (const q of [0.01, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 0.99, 1]) {
      await go(p, h0 + q * (h1 - h0), reduce ? 300 : 600);
      const seen = balls(await p.evaluate(measure));
      rows.push(`ho ${q.toFixed(2)} | ${seen.map((s) => `${s.k}@${f2(s.cx)},${f2(s.cy)}`).join(' ') || 'no ball'}`);
      if (seen.length !== 1) flag(`hand-over ${q}: ${seen.length} balls`);
      if (q === 0.99) prev = seen[0];
      if (q === 1 && seen[0]) {
        if (!near(seen[0].cx, 5 / 6) || !near(seen[0].cy, 0.5)) flag(`landing at ${f2(seen[0].cx)},${f2(seen[0].cy)}, expected 0.833,0.500`);
        if (prev && Math.hypot((prev.cx - seen[0].cx) * vp.w, (prev.cy - seen[0].cy) * vp.h) > 12) flag(`jump at the landing ${f2(prev.cx)},${f2(prev.cy)} → ${f2(seen[0].cx)},${f2(seen[0].cy)}`);
      }
    }
  }

  // Back up past the first pin: the slider closes, the heading returns.
  await go(p, r[0].top + 1, reduce ? 500 : 1500);
  const back = (await p.evaluate(measure)).blocks[0];
  rows.push(`back | ${back.panels.map((x) => x.state).join(' ')} | head ${f2(back.heading.left)}`);
  if (back.panels.some((x) => x.state !== 'dot')) flag('back at the pin start: a panel is still open');
  return { rows, flags };
}

// ≤991: same timeline units on both sides, panels compared by rect and state (the live rail is one step ahead by design).
const NARROW_U = (D) => [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, D].filter((u) => u <= D);
function narrowMeasure(s) {
  const vw = innerWidth;
  return [...document.querySelectorAll(s.block)].slice(0, 1).map((b) => {
    const panels = [...b.querySelectorAll(s.panel)].map((p) => {
      const r = p.getBoundingClientRect();
      const rad = +(getComputedStyle(p).clipPath.match(/circle\(([\d.]+)px/) || [])[1] || 0;
      return { left: r.left / vw, w: r.width / vw, state: rad > 50 ? 'open' : rad > 10 ? 'tween' : 'dot' };
    });
    const h = b.querySelector(s.heading).getBoundingClientRect();
    return { panels, head: Math.round(h.top) };
  })[0];
}
const SEL_NEW = { block: '[data-motion="ui"]', panel: '[data-motion="ui-slide"]', heading: '[data-motion="ui-text"]' };
const SEL_LIVE = { block: '.ui', panel: '.ui-slide', heading: '.ui-text' };

async function walkNarrow(p, sel, wait) {
  const r = await p.evaluate((s) => [...document.querySelectorAll(s)].map((b) => {
    const sp = b.parentElement.classList.contains('pin-spacer') ? b.parentElement : b;
    return { top: Math.round(sp.getBoundingClientRect().top + scrollY), len: Math.round(sp.offsetHeight - b.offsetHeight) };
  }), sel.block);
  const out = [];
  for (const u of NARROW_U(30)) {
    await go(p, r[0].top + (u / 30) * r[0].len, wait);
    out.push([u, await p.evaluate(narrowMeasure, sel)]);
  }
  return { r, out };
}

async function runNarrow(b, p, vp) {
  const rows = [];
  let flags = 0;
  const ours = await walkNarrow(p, SEL_NEW, reduce ? 500 : 1300);
  const { ctx, p: lp } = await openPage(b, { ...vp }, LIVE, false);
  await lp.waitForTimeout(11000); // live preloader
  const live = await walkNarrow(lp, SEL_LIVE, 2600);
  await ctx.close();
  rows.push(`== ${vp.n} ${vp.w}×${vp.h} narrow${reduce ? ' reduce' : ''}: pin ${ours.r[0].len} (live ${live.r[0].len})`);
  if (Math.abs(ours.r[0].len - live.r[0].len) > 3) { flags++; rows.push(`  ⚠ pin length ${ours.r[0].len} ≠ live ${live.r[0].len}`); }
  ours.out.forEach(([u, m], i) => {
    const l = live.out[i][1];
    const d = (x) => x.panels.map((q) => `${f2(q.left)}+${f2(q.w)}${q.state[0]}`).join(' ');
    rows.push(`u${String(u).padStart(2)} | new ${d(m)} | live ${d(l)}`);
    const bad = m.panels.some((q, k) => !l.panels[k] || Math.abs(q.left - l.panels[k].left) > 0.031 || q.state !== l.panels[k].state && !(reduce || [q.state, l.panels[k].state].includes('tween')));
    if (bad) { flags++; rows.push('  ⚠ differs from live'); }
  });
  return { rows, flags };
}

const shots = process.env.UI_OUT || '.'; // screenshot dir
fs.mkdirSync(shots, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
let total = 0;
for (const vp of VPS) {
  const { ctx, p, errs } = await openPage(b, vp, STAGING, !published);
  await ready(p);
  const wide = vp.w >= 992;
  const res = wide ? await runWide(p, vp, shots) : await runNarrow(b, p, vp);
  if (errs.length) { res.flags++; res.rows.push(`  ⚠ ${errs.slice(0, 5).join('\n  ⚠ ')}`); }
  console.log(res.rows.join('\n'));
  console.log(`-- ${vp.n}: ${res.flags} flags\n`);
  total += res.flags;
  await ctx.close();
}
await b.close();
console.log(`total flags: ${total}`);
