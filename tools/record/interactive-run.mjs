// Runs initInteractive() on the published staging page next to the old script (as coexist-run does) and checks it:
// the pin shift against the live numbers (852 / 1224 / 827 px), the track position along the pin, the ball pit
// (canvas, pixel ratio, balls drawn, gravity tilt while scrolling), the Lottie hover, old pins below, page errors.
// Touch (768/375): the swipe from a ball also scrolls here, because the old script.v33 normalizeScroll owns touch
// scrolling on staging; sphere-touch.mjs checks the policy on a bare page.
// Usage: node interactive-run.mjs <project-root> <out-dir> [1440|768|375] [--live]
// --live: the staging page exactly as published (snippets already in Webflow), nothing injected.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const args = process.argv.slice(2);
const live = args.includes('--live');
const [root, out, only = '1440'] = args.filter((a) => !a.startsWith('--'));
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const LIVE_SHIFT = { 1440: 852, 768: 1224, 375: 827 };
const VPS = {
  1440: { w: 1440, h: 900, m: false },
  768: { w: 768, h: 1024, m: true },
  375: { w: 375, h: 812, m: true },
};
const vp = VPS[only];
const src = (f) => readFileSync(`${root}/src/${f}`, 'utf8');

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2, isMobile: vp.m, hasTouch: vp.m, ...(vp.m ? { userAgent: UA } : {}) });
const p = await ctx.newPage();
const logs = [];
p.on('pageerror', (e) => logs.push('pageerror: ' + e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' | ')));
p.on('console', (m) => m.type() === 'error' && !/ERR_FAILED|Splide|twitter|status of 4/.test(m.text()) && logs.push('console: ' + m.text()));

if (!live) {
  await p.route(STAGING, async (route) => {
    const res = await route.fetch();
    let html = await res.text();
    // The published page already carries the snippets: swap their module for the local motion.js.
    html = html.replace(/<script type="module" src="[^"]*motion\.js"><\/script>/, '');
    html = html.replace('</body>', `<script type="module">${src('motion.js')}</script></body>`);
    route.fulfill({ response: res, body: html });
  });
  // motion.js is inline here, so its relative imports resolve against the page URL.
  for (const f of ['legacy-guard.js', 'sphere.js']) await p.route(`**/${f}`, (r) => r.fulfill({ contentType: 'text/javascript', body: src(f) }));
}

await p.goto(STAGING, { waitUntil: 'domcontentloaded', timeout: 90000 });
await Promise.race([
  p.evaluate(() => new Promise((r) => document.addEventListener('motion:preloader-done', () => r(), { once: true }))),
  p.waitForTimeout(25000),
]);
await p.waitForTimeout(2500);
const rows = [`== ${only}${live ? ' (live staging)' : ''}`];

const scrollTo = async (target, tol = 30) => {
  for (let i = 0; i < 60; i++) {
    const y = await p.evaluate(() => scrollY);
    const d = target - y;
    if (Math.abs(d) < tol) break;
    const step = Math.sign(d) * Math.min(500, Math.abs(d));
    if (vp.m) await p.evaluate((s) => scrollBy(0, s), step);
    else await p.mouse.wheel(0, step);
    await p.waitForTimeout(120);
  }
};

// Geometry from our pin trigger (the one whose pin is [data-motion=interactive-pin]).
const geo = () => p.evaluate(() => {
  const pin = document.querySelector('[data-motion="interactive-pin"]');
  const track = document.querySelector('[data-motion="interactive-track"]');
  const sp = pin.parentElement.classList.contains('pin-spacer') ? pin.parentElement : pin;
  const top = Math.round(sp.getBoundingClientRect().top + scrollY);
  const shift = Math.round(parseFloat(getComputedStyle(pin).paddingLeft) + track.offsetWidth - innerWidth);
  return { top, shift, spacerH: Math.round(sp.offsetHeight), pinH: pin.offsetHeight };
});
const state = () => p.evaluate(() => {
  const pin = document.querySelector('[data-motion="interactive-pin"]');
  const track = document.querySelector('[data-motion="interactive-track"]');
  const items = [...track.children].map((e) => { const r = e.getBoundingClientRect(); return `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}`; });
  const m = new DOMMatrix(getComputedStyle(track).transform);
  return `scrollY ${Math.round(scrollY)} | pin top ${Math.round(pin.getBoundingClientRect().top)} | track x ${m.e.toFixed(1)} | items ${items.join(' ; ')}`;
});

const g = await geo();
rows.push(`pin top ${g.top} spacer ${g.spacerH} pinH ${g.pinH} | shift ${g.shift} (live ${LIVE_SHIFT[only]}, Δ${g.shift - LIVE_SHIFT[only]}) | spacer − pinH ${g.spacerH - g.pinH}`);

const marks = [['before', g.top - vp.h * 0.5], ['pin0', g.top], ['p50', g.top + g.shift * 0.5], ['p100', g.top + g.shift], ['after', g.top + g.shift + vp.h * 0.5]];
for (const [name, target] of marks) {
  await scrollTo(Math.round(target));
  await p.waitForTimeout(2200); // scrub: 1 plus Lenis
  rows.push(`${name}: ${await state()}`);
  await p.screenshot({ path: `${out}/interactive-run-${only}-${name}.png` });
}

// Ball pit: canvas, backing store, balls drawn (dark pixels) and their centroid.
const pit = () => p.evaluate(() => {
  const c = document.querySelector('[data-motion="interactive-sphere"] canvas');
  if (!c) return null;
  const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  let n = 0, sx = 0, sy = 0;
  for (let i = 0; i < x.length; i += 16) {
    if (x[i + 3] > 200 && x[i] < 60) { const k = i / 4; n++; sx += k % c.width; sy += Math.floor(k / c.width); }
  }
  const r = c.getBoundingClientRect();
  return { css: `${Math.round(r.width)}x${Math.round(r.height)}`, store: `${c.width}x${c.height}`, ratio: c.dataset.pixelRatio, dark: n, cx: n ? +(sx / n / c.width).toFixed(3) : null, cy: n ? +(sy / n / c.height).toFixed(3) : null };
});
// Back to the middle of the pin, where the Real-time circle is on screen.
await scrollTo(Math.round(g.top + g.shift * 0.4));
await p.waitForTimeout(3000);
const rest = await pit();
rows.push('pit at rest: ' + JSON.stringify(rest));
// Gravity tilt: keep scrolling down inside the pin, sample while moving.
let moving = null;
for (let i = 0; i < 8; i++) {
  if (vp.m) await p.evaluate(() => scrollBy(0, 25)); else await p.mouse.wheel(0, 25);
  await p.waitForTimeout(110);
}
moving = await pit();
rows.push('pit while scrolling down: ' + JSON.stringify(moving) + ` | centroid Δx ${moving && rest ? (moving.cx - rest.cx).toFixed(3) : '-'}`);
await p.waitForTimeout(2500);
rows.push('pit after scrollEnd: ' + JSON.stringify(await pit()));
await p.screenshot({ path: `${out}/interactive-run-${only}-pit.png` });

// Touch over the pit: a swipe from the empty top of the circle scrolls the page, one from a ball drags it instead.
if (vp.m) {
  const cdp = await ctx.newCDPSession(p);
  await scrollTo(Math.round(g.top + g.shift * 0.3));
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => { const b = document.querySelector('[data-motion="interactive-sphere"] canvas').getBoundingClientRect(); return { x: b.left + b.width / 2, top: b.top, h: b.height }; });
  for (const [name, y] of [['empty', r.top + r.h * 0.2], ['ball', r.top + r.h * 0.85]]) {
    const y0 = await p.evaluate(() => scrollY);
    await cdp.send('Input.synthesizeScrollGesture', { x: Math.round(Math.min(vp.w - 10, Math.max(10, r.x))), y: Math.round(y), yDistance: -150, gestureSourceType: 'touch', speed: 800 });
    await p.waitForTimeout(1200);
    rows.push(`touch swipe from ${name} (x ${Math.round(r.x)}): scrolled ${Math.round((await p.evaluate(() => scrollY)) - y0)} px`);
  }
}

// Lottie: SVG present; hover (≥992) or tap (≤991) changes the drawn frame, then it returns to frame 0.
await scrollTo(Math.round(g.top + g.shift));
await p.waitForTimeout(2500);
const lottieSig = () => p.evaluate(() => {
  const svg = document.querySelector('[data-motion="interactive-lottie"] svg');
  if (!svg) return null;
  let h = 0; const s = svg.innerHTML;
  for (let i = 0; i < s.length; i += 7) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
});
const zone = await p.evaluate(() => { const r = document.querySelector('[data-motion="interactive-hover"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: Math.round(r.width) }; });
const box = p.locator('[data-motion="interactive-lottie"]');
const s0 = await lottieSig();
const img0 = await box.screenshot({ path: `${out}/interactive-run-${only}-lottie-0.png` });
if (vp.m) await p.touchscreen.tap(zone.x, zone.y); else await p.mouse.move(zone.x, zone.y, { steps: 4 });
await p.waitForTimeout(1500);
const s1 = await lottieSig();
await p.screenshot({ path: `${out}/interactive-run-${only}-lottie.png` });
if (!vp.m) await p.mouse.move(zone.x, 40, { steps: 4 });
await p.waitForTimeout(4200);
const s2 = await lottieSig();
const img2 = await box.screenshot({ path: `${out}/interactive-run-${only}-lottie-2.png` });
// Share of pixels that differ by more than 48 in any channel (SVG anti-aliasing differs run to run).
const diff = await p.evaluate(async ([a, b]) => {
  const load = async (s) => { const bm = await createImageBitmap(await (await fetch('data:image/png;base64,' + s)).blob()); const c = new OffscreenCanvas(bm.width, bm.height); const x = c.getContext('2d'); x.drawImage(bm, 0, 0); return x.getImageData(0, 0, bm.width, bm.height).data; };
  const [x, y] = await Promise.all([load(a), load(b)]);
  let n = 0;
  for (let i = 0; i < x.length; i += 4) if (Math.abs(x[i] - y[i]) > 48 || Math.abs(x[i + 1] - y[i + 1]) > 48 || Math.abs(x[i + 2] - y[i + 2]) > 48) n++;
  return n / (x.length / 4);
}, [img0.toString('base64'), img2.toString('base64')]);
rows.push(`lottie: svg ${s0 !== null} | markup changed on ${vp.m ? 'tap' : 'hover'} ${s0 !== s1} | back to frame 0: ${(diff * 100).toFixed(2)} % pixels differ | zone ${zone.w}px`);

// Old pins below ours: their start still matches their spacer.
rows.push('old pins: ' + (await p.evaluate(() => (window.ScrollTrigger?.getAll() || []).filter((st) => st.pin).map((st) => {
  const top = Math.round(st.pin.parentElement.getBoundingClientRect().top + scrollY);
  return `${(st.pin.className || '').split(' ').slice(0, 2).join('.')} Δ${Math.round(st.start - top)}`;
}))).join(' ; '));
rows.push(logs.slice(0, 10).join('\n') || 'no page errors');
console.log(rows.join('\n'));
await b.close();
