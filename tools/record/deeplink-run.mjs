// Deep links on Home (session 36): /#<section> skips the intro, the overlay stays up until the pins are built, then the
// section lands at the top and the overlay fades. Staging with the local src/*.js (jsDelivr routed to disk); --live runs
// the published module, and also follows /lesson/<slug> (the Lessons template redirect) to its section.
// Checks per band: the target top within 2 px of the viewport top, the overlay gone ≤ 1.5 s after the load event, no
// page errors;
// and that the plain URL still runs the full preloader (is-preloading still on at 3 s).
// Usage: node deeplink-run.mjs [--live] [--reduce] [1440|ipad|768|375 ...] (default 1440 768 375)
import { chromium } from 'playwright';
import fs from 'node:fs';

const ROOT = '/Users/mac/Claude/Projects/Motion';
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const IPAD = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const args = process.argv.slice(2);
const published = args.includes('--live');
const reduce = args.includes('--reduce');
const only = args.filter((a) => !a.startsWith('--'));
const VPS = [
  { n: '1440', w: 1440, h: 900 },
  { n: 'ipad', w: 1366, h: 1024, touch: true, ua: IPAD },
  { n: '768', w: 768, h: 1024, touch: true, ua: UA },
  { n: '375', w: 375, h: 812, touch: true, ua: UA },
].filter((v) => (only.length ? only.includes(v.n) : v.n !== 'ipad'));
// [path, expected section id]
const LINKS = [
  ['/#easing', 'easing'],
  ['/#fade', 'fade'],
  ['/#zoom', 'zoom'],
  ['/#resources', 'resources'],
  ...(published ? [['/lesson/the-basics-of-easing', 'easing'], ['/lesson/transform-morph', 'morph'], ['/lesson/parallax', 'parallax']] : []),
];

async function open(b, vp, path) {
  const ctx = await b.newContext({
    viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1,
    isMobile: !!vp.touch, hasTouch: !!vp.touch, ...(vp.ua ? { userAgent: vp.ua } : {}),
    reducedMotion: reduce ? 'reduce' : 'no-preference',
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('requestfailed', (r) => /jsdelivr|cdnjs/.test(r.url()) && errs.push(`requestfailed ${r.url()}`));
  if (!published)
    await p.route(/cdn\.jsdelivr\.net\/gh\/kov-dev\/motion-rebuild@[^/]+\/src\/(.+\.js)/, (r) => {
      const f = r.request().url().match(/\/src\/(.+\.js)/)[1];
      r.fulfill({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(`${ROOT}/src/${f}`, 'utf8') });
    });
  await p.goto(STAGING + path, { waitUntil: 'load', timeout: 90000 });
  return { ctx, p, errs, t0: Date.now() };
}

const overlayGone = () => {
  const r = document.querySelector('[data-motion="preloader"]');
  return !document.documentElement.classList.contains('is-preloading') && (!r || getComputedStyle(r).display === 'none');
};

const b = await chromium.launch({ channel: 'chrome' });
let flags = 0;
const flag = (s) => { flags++; console.log(`  ⚠ ${s}`); };

for (const vp of VPS) {
  console.log(`== ${vp.n} ${vp.w}×${vp.h}${vp.touch ? ' touch' : ''}${reduce ? ' reduce' : ''}${published ? ' live' : ''}`);
  for (const [path, id] of LINKS) {
    const { ctx, p, errs, t0 } = await open(b, vp, path);
    try {
      await p.waitForFunction(overlayGone, null, { timeout: 15000 });
      const ms = Date.now() - t0;
      await p.waitForTimeout(800);
      const r = await p.evaluate((id) => {
        const el = document.getElementById(id);
        return { url: location.pathname + location.hash, y: Math.round(scrollY), top: el ? Math.round(el.getBoundingClientRect().top) : null };
      }, id);
      const ok = r.top !== null && Math.abs(r.top) <= 2;
      console.log(`  ${ok ? '✓' : ' '} ${path} → ${r.url}: #${id} top ${r.top}, scrollY ${r.y}, overlay off ${ms} ms after load`);
      if (!ok) flag(`${path}: #${id} top ${r.top}`);
      if (ms > 1500) flag(`${path}: overlay off ${ms} ms after load`);
    } catch (e) {
      flag(`${path}: ${String(e).split('\n')[0]}`);
    }
    errs.forEach((e) => flag(`${path}: ${e}`));
    await ctx.close();
  }
  // The plain URL keeps the full intro.
  const { ctx, p, errs } = await open(b, vp, '/');
  await p.waitForTimeout(3000);
  const still = await p.evaluate(() => document.documentElement.classList.contains('is-preloading'));
  if (reduce) console.log(`  / → reduce: preloader ${still ? 'still on' : 'done'} at 3 s`);
  else if (!still) flag('/ : preloader already over at 3 s');
  else console.log('  ✓ / → preloader still running at 3 s');
  errs.forEach((e) => flag(`/: ${e}`));
  await ctx.close();
}
await b.close();
console.log(flags ? `${flags} flag(s)` : '0 flags');
