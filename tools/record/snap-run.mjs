// Slider snap on staging with the local src/*.js (--live: the published module): wherever a scroll comes to rest
// inside the UI slider, the screen must settle on a rest state — a panel fully open or a heading in place with its
// dot — never on dots alone (session 41, user: "a black screen with two dots").
// 1) Sweep: native scrollTo to points across the whole slider zone, wait, check the final state.
// 2) Wheel (mouse bands, Lenis): from an open panel, wheel notches until the screen holds only dots, stop, and check
//    that the next panel opens (and back up: the previous one).
// Usage: node snap-run.mjs [--live] [1440|1280|ipad|768|375 ...] (default 1440 768 375)
import { chromium } from 'playwright';
import fs from 'node:fs';

const ROOT = '/Users/mac/Claude/Projects/Motion';
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const IPAD = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const args = process.argv.slice(2);
const published = args.includes('--live');
const only = args.filter((a) => !a.startsWith('--'));
const VPS = [
  { n: '1440', w: 1440, h: 900 },
  { n: '1280', w: 1280, h: 800 },
  { n: 'ipad', w: 1366, h: 1024, touch: true, ua: IPAD },
  { n: '768', w: 768, h: 1024, touch: true, ua: UA },
  { n: '375', w: 375, h: 812, touch: true, ua: UA },
].filter((v) => (only.length ? only.includes(v.n) : ['1440', '768', '375'].includes(v.n)));

// What the slider shows: per block on screen, open panels and whether its heading stands in place.
function state() {
  const vw = innerWidth;
  const out = { y: Math.round(scrollY), open: [], heading: [] };
  [...document.querySelectorAll('[data-motion="ui"]')].forEach((b, j) => {
    const br = b.getBoundingClientRect();
    if (br.bottom <= 0 || br.top >= innerHeight) return;
    b.querySelectorAll('[data-motion="ui-slide"]').forEach((p, i) => {
      const rad = +(getComputedStyle(p).clipPath.match(/circle\(([\d.]+)px/) || [])[1] || 0;
      const r = p.getBoundingClientRect();
      if (rad > 50 && r.right > 0 && r.left < vw) out.open.push(`B${j}p${i}`);
    });
    const h = b.querySelector('[data-motion="ui-text"]').getBoundingClientRect();
    if (Math.abs(br.top) < 2 && h.left > -0.02 * vw && h.left < 0.1 * vw) out.heading.push(`B${j}`);
  });
  return out;
}
const rest = (s) => s.open.length > 0 || s.heading.length > 0;
const label = (s) => `${s.y} ${s.open.join(',') || '-'} ${s.heading.length ? `head ${s.heading.join(',')}` : ''}`.trim();

function zone() {
  const bs = [...document.querySelectorAll('[data-motion="ui"]')].map((b) => {
    const sp = b.parentElement.classList.contains('pin-spacer') ? b.parentElement : b;
    const top = sp.getBoundingClientRect().top + scrollY;
    return { top: Math.round(top), end: Math.round(top + sp.offsetHeight - b.offsetHeight) };
  });
  return { from: bs[0].top, to: bs[bs.length - 1].end, pins: bs };
}

const b = await chromium.launch({ channel: 'chrome' });
let total = 0;
for (const vp of VPS) {
  const ctx = await b.newContext({
    viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1,
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
  await p.waitForFunction(() => !document.documentElement.classList.contains('is-preloading')
    && [...document.querySelectorAll('[data-motion="ui"]')].every((b) => b.parentElement.classList.contains('pin-spacer')), null, { timeout: 30000 });
  await p.waitForTimeout(1500);
  const z = await p.evaluate(zone);
  const rows = [`== ${vp.n} ${vp.w}×${vp.h}${vp.touch ? ' touch' : ''}: zone ${z.from}…${z.to}, pins ${z.pins.map((x) => `${x.top}–${x.end}`).join(', ')}`];
  let flags = 0;
  const flag = (s) => { flags++; rows.push(`  ⚠ ${s}`); };
  const settle = 2600;

  // 1) Sweep (inside the zone, plus a little before its start and after its end, which must stay untouched).
  const step = Math.round(vp.h * 0.37);
  let snapped = 0;
  await p.evaluate((y) => scrollTo(0, y), z.from - vp.h);
  await p.waitForTimeout(800);
  for (let y = z.from - Math.round(vp.h / 2); y <= z.to + vp.h / 2; y += step) {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(settle);
    const s = await p.evaluate(state);
    const inZone = y >= z.from && y <= z.to;
    if (Math.abs(s.y - y) > 2) snapped++;
    if (!inZone && Math.abs(s.y - y) > 2) flag(`outside the slider ${y} moved to ${s.y}`);
    if (inZone && !rest(s)) flag(`${y} → ${label(s)}: dots only`);
    rows.push(`sweep ${String(y).padStart(6)} → ${label(s)}${Math.abs(s.y - y) > 2 ? '  (snap)' : ''}`);
  }
  rows.push(`sweep: ${snapped} snaps`);

  // 2) Wheel through a gap (Lenis only): from the first open panel down until only dots are left, then up.
  if (!vp.touch) {
    const first = z.pins[0];
    let y0 = null;
    for (let y = first.top; y < first.end; y += Math.round(vp.h * 0.1)) {
      await p.evaluate((y) => scrollTo(0, y), y);
      await p.waitForTimeout(150);
      if ((await p.evaluate(state)).open.includes('B0p0')) { y0 = y + Math.round(vp.h * 0.2); break; }
    }
    if (y0 === null) flag('wheel: panel 0 never opened');
    else {
      for (const [dir, from, to] of [[1, 'B0p0', 'B0p1'], [-1, 'B0p1', 'B0p0']]) {
        await p.evaluate((y) => scrollTo(0, y), dir > 0 ? y0 : (await p.evaluate(state)).y);
        await p.waitForTimeout(settle);
        await p.mouse.move(vp.w / 2, vp.h / 2);
        let notches = 0;
        let s = await p.evaluate(state);
        // Wheel in 100 px notches, 60 ms apart, until the panel we started on has folded.
        while (s.open.includes(from) && notches < 40) {
          await p.mouse.wheel(0, 100 * dir);
          await p.waitForTimeout(60);
          notches++;
          s = await p.evaluate(state);
        }
        const mid = s;
        await p.waitForTimeout(settle + 1000);
        s = await p.evaluate(state);
        rows.push(`wheel ${dir > 0 ? 'down' : 'up'} ${notches} notches: ${label(mid)} → ${label(s)}`);
        if (!s.open.includes(to)) flag(`wheel ${dir > 0 ? 'down' : 'up'}: expected ${to} open, got ${label(s)}`);
      }
    }
  }

  if (errs.length) flag(`errors: ${errs.join(' | ')}`);
  rows.push(`${flags ? `⚠ ${flags} flags` : '0 flags'}`);
  console.log(rows.join('\n'));
  total += flags;
  await ctx.close();
}
await b.close();
console.log(`TOTAL ${total} flags`);
