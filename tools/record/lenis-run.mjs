// Lenis on the staging page against the live motion.zajno.com (stage 4, session 32).
//   wheel — the same wheel input on both pages (one 100 px step, one 300 px step, a burst of 5 × 100 px every 60 ms), scrollY
//           sampled every frame from the wheel event: travelled distance and the time to 50 / 90 / 99 % of it must match
//           (live: Lenis 1.0.29, duration 2, 1.001 − 2^(−10t); ours: Lenis 1.3.26 with the same options).
//   state — Lenis is on with a mouse (html.lenis), stopped under the preloader and the open menu, off on touch (375) and
//           with reduced motion (native scroll, no html.lenis); a footer lesson link lands its section at the top (±2 px).
// Usage: node lenis-run.mjs <project-root> <out-dir> [1440|375] [--live] [--reduce]   env PART=wheel,state
// --live: the staging page exactly as published; without it src/motion.js is injected in place of the jsDelivr module.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const args = process.argv.slice(2);
const live = args.includes('--live');
const reduce = args.includes('--reduce');
const [root, out, only = '1440'] = args.filter((a) => !a.startsWith('--'));
const parts = (process.env.PART || 'wheel,state').split(',');
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const LIVE = 'https://motion.zajno.com/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const VPS = { 1440: { w: 1440, h: 900, m: false }, 375: { w: 375, h: 812, m: true } };
const vp = VPS[only];
mkdirSync(out, { recursive: true });

let flags = 0;
const flag = (ok, msg) => {
  if (!ok) flags++;
  console.log(`${ok ? '  ok' : '  ✗ '} ${msg}`);
};

const b = await chromium.launch({ channel: 'chrome' });
const open = async (url, staging) => {
  const ctx = await b.newContext({
    viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, ...(vp.m ? { userAgent: UA } : {}),
    reducedMotion: reduce ? 'reduce' : 'no-preference',
  });
  const p = await ctx.newPage();
  p.errors = [];
  p.on('pageerror', (e) => !/play\(\) request was interrupted|interrupted by a (new load|call to pause)/.test(e.message) && p.errors.push(e.message));
  if (staging && !live) {
    const js = readFileSync(`${root}/src/motion.js`, 'utf8');
    await p.route(STAGING + '*', async (route) => {
      if (!/webflow\.io\/(\?|$)/.test(route.request().url())) return route.continue();
      const res = await route.fetch();
      let html = await res.text();
      html = html.replace(/<script type="module" src="[^"]*motion\.js"><\/script>/, '');
      html = html.replace('</body>', `<script type="module">${js}</script></body>`);
      route.fulfill({ response: res, body: html });
    });
    await p.route('**/sphere.js', (r) => r.fulfill({ contentType: 'text/javascript', body: readFileSync(`${root}/src/sphere.js`, 'utf8') }));
  }
  return p;
};

// Every frame from the first wheel event on: [ms since that event, scrollY].
const sample = (p, ms) =>
  p.evaluate(
    (ms) =>
      new Promise((resolve) => {
        const rows = [];
        let t0 = null;
        const y0 = scrollY;
        addEventListener('wheel', () => t0 ??= performance.now(), { capture: true, passive: true, once: true });
        const tick = () => {
          if (t0 !== null) rows.push([performance.now() - t0, scrollY - y0]);
          if (t0 !== null && performance.now() - t0 > ms) return resolve(rows);
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    ms
  );

const at = (rows, frac) => {
  const end = rows[rows.length - 1][1];
  const hit = rows.find(([, d]) => Math.abs(d) >= Math.abs(end) * frac);
  return hit ? hit[0] : NaN;
};

const SCENARIOS = [
  { key: 'step100', wheel: [100] },
  { key: 'step300', wheel: [300] },
  { key: 'burst5x100', wheel: [100, 100, 100, 100, 100], gap: 60 },
];

const wheelCurves = async (p, tag) => {
  const res = {};
  for (const s of SCENARIOS) {
    await p.evaluate(() => scrollTo(0, 2000));
    await p.waitForTimeout(800);
    await p.mouse.move(vp.w / 2, vp.h / 2);
    const rows = sample(p, 2600);
    for (const [i, d] of s.wheel.entries()) {
      if (i) await p.waitForTimeout(s.gap);
      await p.mouse.wheel(0, d);
    }
    res[s.key] = await rows;
    await p.waitForTimeout(300);
  }
  writeFileSync(`${out}/lenis-wheel-${tag}-${only}.json`, JSON.stringify(res));
  return res;
};

if (parts.includes('wheel') && !vp.m && !reduce) {
  console.log(`== ${only}${live ? ' live' : ''}: wheel (motion.zajno.com ↔ staging)`);
  const ref = await open(LIVE, false);
  await ref.goto(LIVE, { waitUntil: 'domcontentloaded', timeout: 120000 });
  // The live script builds Lenis on window load, after its preloader starts.
  await ref.waitForFunction(() => document.documentElement.classList.contains('lenis'), null, { timeout: 90000 });
  await ref.waitForTimeout(12000);
  const a = await wheelCurves(ref, 'live');
  await ref.context().close();

  const st = await open(STAGING, true);
  await st.goto(STAGING + '?run=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 120000 });
  await Promise.race([
    st.evaluate(() => new Promise((r) => document.addEventListener('motion:preloader-done', () => r(), { once: true }))),
    st.waitForTimeout(25000),
  ]);
  await st.waitForTimeout(1500);
  const c = await wheelCurves(st, 'staging');
  flag(!st.errors.length, `staging page errors: ${st.errors.length ? st.errors.join(' | ') : 'none'}`);
  await st.context().close();

  for (const s of SCENARIOS) {
    const [ra, rc] = [a[s.key], c[s.key]];
    const da = ra[ra.length - 1][1];
    const dc = rc[rc.length - 1][1];
    const ts = [0.5, 0.9, 0.99].map((f) => [at(ra, f), at(rc, f)]);
    // One 60 fps frame plus the wheel dispatch jitter.
    const okT = ts.every(([x, y]) => Math.abs(x - y) <= 50);
    flag(Math.abs(da - dc) <= 2 && okT,
      `${s.key}: distance live ${da.toFixed(1)} / ours ${dc.toFixed(1)} px; t50 / t90 / t99 ms ` +
        ts.map(([x, y]) => `${x.toFixed(0)}↔${y.toFixed(0)}`).join(' · '));
  }
}

if (parts.includes('state')) {
  console.log(`== ${only}${reduce ? ' reduce' : ''}${live ? ' live' : ''}: state`);
  const p = await open(STAGING, true);
  await p.goto(STAGING + '?run=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 120000 });
  const cls = () => p.evaluate(() => document.documentElement.className);
  const smooth = !vp.m && !reduce;
  // Reduced motion: the preloader is a 0.8 s fade, already gone by now.
  await p.waitForTimeout(reduce ? 300 : 3000);
  const pre = await cls();
  flag((/is-preloading/.test(pre) || reduce) && (smooth ? /\blenis\b.*lenis-stopped|lenis-stopped.*\blenis\b/.test(pre) : !/\blenis\b/.test(pre)),
    `preloader: html "${pre}"`);
  await Promise.race([
    p.evaluate(() => new Promise((r) => document.addEventListener('motion:preloader-done', () => r(), { once: true }))),
    p.waitForTimeout(25000),
  ]);
  await p.waitForTimeout(800);
  const after = await cls();
  flag(smooth ? /\blenis\b/.test(after) && !/lenis-stopped/.test(after) : !/\blenis\b/.test(after), `after the preloader: html "${after}"`);
  await p.evaluate(() => scrollTo(0, 1500));
  await p.waitForTimeout(600);
  await p.locator('[data-motion="nb-toggle"]').click();
  await p.waitForTimeout(700);
  const menu = await p.evaluate(() => [document.documentElement.className, document.documentElement.style.overflow, scrollY]);
  if (vp.m) await p.evaluate(() => scrollBy(0, 400)); // a touch-scroll stand-in: overflow hidden must hold it
  else {
    await p.mouse.move(vp.w / 2, vp.h / 2);
    await p.mouse.wheel(0, 400);
  }
  await p.waitForTimeout(900);
  const y1 = await p.evaluate(() => scrollY);
  flag((smooth ? /lenis-stopped/.test(menu[0]) && menu[1] === '' : menu[1] === 'hidden') && (smooth ? y1 === menu[2] : true),
    `menu open: html "${menu[0]}", overflow "${menu[1]}", scrollY ${menu[2]} → ${y1} after a wheel`);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(700);
  const closed = await p.evaluate(() => [document.documentElement.className, document.documentElement.style.overflow]);
  flag(!/lenis-stopped/.test(closed[0]) && closed[1] === '', `menu closed: html "${closed[0]}", overflow "${closed[1]}"`);
  if (smooth) {
    const y2 = await p.evaluate(() => scrollY);
    await p.mouse.wheel(0, 300);
    await p.waitForTimeout(2300);
    const y3 = await p.evaluate(() => scrollY);
    flag(Math.abs(y3 - y2 - 300) <= 2, `wheel after close: scrollY ${y2} → ${y3}`);
  }
  // A footer lesson link lands its section at the top, as a menu card (scrollToSection, not Webflow's anchor scroll).
  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(1500);
  await p.locator('[data-motion="footer"] a[href="#delay"]').click();
  await p.waitForTimeout(reduce || vp.m ? 800 : 2500);
  const ft = await p.evaluate(() => [+document.querySelector('#delay').getBoundingClientRect().top.toFixed(1), scrollY]);
  flag(Math.abs(ft[0]) <= 2, `footer link #delay: target top ${ft[0]} (scrollY ${ft[1]})`);
  flag(!p.errors.length, `page errors: ${p.errors.length ? p.errors.join(' | ') : 'none'}`);
  await p.context().close();
}

await b.close();
console.log(flags ? `${flags} flag(s)` : 'no flags');
