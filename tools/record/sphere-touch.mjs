// Touch policy of src/sphere.js on a bare page (no old script): a swipe from the empty part of the circle scrolls
// the page, a swipe from a ball drags the ball. On staging the old normalizeScroll (mobile) scrolls in both cases.
// Usage: node sphere-touch.mjs <project-root>
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const root = process.argv[2];
const html = `<!doctype html><html><body style="margin:0"><div style="height:600px"></div>
<div id="w" style="position:relative;width:344px;height:344px;margin:0 15px;border:1px solid #000;border-radius:50%"></div>
<div style="height:3000px"></div>
<script type="module">import { createSphere } from './sphere.js'; window.s = createSphere(document.getElementById('w'));</script></body></html>`;
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.route('http://t.test/', (r) => r.fulfill({ contentType: 'text/html', body: html }));
await p.route('http://t.test/sphere.js', (r) => r.fulfill({ contentType: 'text/javascript', body: readFileSync(root + '/src/sphere.js', 'utf8') }));
p.on('pageerror', (e) => console.log('pageerror', e.message));
await p.goto('http://t.test/');
await p.evaluate(() => scrollTo(0, 300));
await p.waitForTimeout(3000);
const cdp = await ctx.newCDPSession(p);
const r = await p.evaluate(() => { const b = document.querySelector('#w canvas').getBoundingClientRect(); return { x: b.left + b.width / 2, top: b.top, h: b.height }; });
for (const [name, y] of [['empty', r.top + r.h * 0.2], ['ball', r.top + r.h * 0.85]]) {
  const y0 = await p.evaluate(() => scrollY);
  await cdp.send('Input.synthesizeScrollGesture', { x: Math.round(r.x), y: Math.round(y), yDistance: -150, gestureSourceType: 'touch', speed: 800 });
  await p.waitForTimeout(1000);
  console.log(name, 'scrolled', Math.round((await p.evaluate(() => scrollY)) - y0));
  await p.evaluate((y) => scrollTo(0, y), y0);
  await p.waitForTimeout(1500);
}
await b.close();
