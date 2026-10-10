// Runs initFooter() on the published staging page (local src/motion.js injected, as resources-run does) and checks the overlay
// of Resources and the black clouds against the live IX2 a-126 model (docs/sections/footer.md «IX2 футера»):
//   p = (vh + 0.15·h − top) / (vh + 0.15·h), top / h of the footer; overlay opacity = p / 0.5, clouds y = p / 0.72 · 1.2 / 1 / 2 rem.
// The old footer is still on the staging page with its native Webflow IX2 (the live a-126), so the same points are measured on it
// too ("live" column): its overlay rgba alpha and .footer-cloud-item y. The old footer sits at the page end, so its progress
// is cut where the page ends (1440: max ≈ 0.556), as on motion.zajno.com.
// 1440 also rebuilds the Resources pin by a width change (1440 → 1280) and re-checks one point (the footer refreshes after it).
// Usage: node footer-run.mjs <project-root> <out-dir> [1440|768|600|375] [--live] [--reduce]
// --live: the staging page exactly as published (snippets already in Webflow), nothing injected.
// --reduce: prefers-reduced-motion — the overlay follows p without the catch-up, the clouds stand.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const live = args.includes('--live');
const reduce = args.includes('--reduce');
const [root, out, only = '1440'] = args.filter((a) => !a.startsWith('--'));
mkdirSync(out, { recursive: true });
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const VPS = { 1440: { w: 1440, h: 900, m: false }, 768: { w: 768, h: 1024, m: true }, 600: { w: 600, h: 900, m: true }, 375: { w: 375, h: 812, m: true } };
const CLOUDS = [1.2, 1, 2]; // rem: second, third, fourth
const POINTS = [0.05, 0.15, 0.3, 0.45, 0.6, 0.8, 1];
const vp = VPS[only];
const src = (f) => readFileSync(`${root}/src/${f}`, 'utf8');
let flags = 0;
const flag = (ok, line) => { if (!ok) flags++; console.log(`${ok ? '✓' : '✗'} ${line}`); };
const clamp = (v) => Math.min(1, Math.max(0, v));

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({
  viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, ...(vp.m ? { userAgent: UA } : {}),
  reducedMotion: reduce ? 'reduce' : 'no-preference',
});
const p = await ctx.newPage();
const logs = [];
p.on('pageerror', (e) => !/play\(\) request was interrupted|interrupted by a (new load|call to pause)/.test(e.message) && logs.push('pageerror: ' + e.message));
if (!live) {
  const js = src('motion.js');
  await p.route(STAGING + '*', async (route) => {
    if (!/webflow\.io\/(\?|$)/.test(route.request().url())) return route.continue();
    const res = await route.fetch();
    let html = await res.text();
    html = html.replace(/<script type="module" src="[^"]*motion\.js"><\/script>/, '');
    html = html.replace('</body>', `<script type="module">${js}</script></body>`);
    route.fulfill({ response: res, body: html });
  });
  for (const f of ['legacy-guard.js', 'sphere.js']) await p.route(`**/${f}`, (r) => r.fulfill({ contentType: 'text/javascript', body: src(f) }));
}
await p.goto(STAGING + '?run=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 120000 });
await Promise.race([
  p.evaluate(() => new Promise((r) => document.addEventListener('motion:preloader-done', () => r(), { once: true }))),
  p.waitForTimeout(25000),
]);
await p.waitForTimeout(2500);

// A native jump first (Lenis syncs to it), then wheel / scrollBy passes, as resources-run.
const scrollTo = async (target, tol = 3) => {
  await p.evaluate((y) => scrollTo(0, y), target);
  await p.waitForTimeout(300);
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < 40; i++) {
      const d = target - (await p.evaluate(() => scrollY));
      if (Math.abs(d) < tol) break;
      const step = Math.sign(d) * Math.min(600, Math.abs(d));
      if (vp.m) await p.evaluate((s) => scrollBy(0, s), step);
      else await p.mouse.wheel(0, step);
      await p.waitForTimeout(120);
    }
    await p.waitForTimeout(500);
  }
};

// Old IX2 targets on the same page: the first .resources-overlay, the old .footer and its .footer-cloud-item.
const state = () => p.evaluate(() => {
  const tf = (e) => +new DOMMatrix(getComputedStyle(e).transform).m42.toFixed(2);
  const alpha = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); const v = m ? m[1].split(',').map(Number) : []; return v.length === 4 ? v[3] : v.length ? 1 : 0; };
  const prog = (foot) => {
    const top = foot.getBoundingClientRect().top, s = innerHeight + 0.15 * foot.offsetHeight;
    return { top: +top.toFixed(1), p: (s - top) / s };
  };
  const nf = document.querySelector('[data-motion="footer"]');
  const of = document.querySelector('.footer');
  return {
    y: scrollY, max: document.documentElement.scrollHeight - innerHeight, rem: parseFloat(getComputedStyle(document.documentElement).fontSize),
    nTop: nf.getBoundingClientRect().top + scrollY, nH: nf.offsetHeight, n: prog(nf),
    nOverlay: +(+getComputedStyle(document.querySelector('[data-motion="res-overlay"]')).opacity).toFixed(3),
    nClouds: [...nf.querySelectorAll('[data-motion="ft-cloud"]')].map(tf),
    oTop: of ? of.getBoundingClientRect().top + scrollY : null, oH: of?.offsetHeight, o: of ? prog(of) : null,
    oOverlay: of ? +alpha(getComputedStyle(document.querySelector('.resources-overlay')).backgroundColor).toFixed(3) : null,
    oClouds: of ? [...of.querySelectorAll('.footer-cloud-item:not(.is-first)')].map(tf) : [],
  };
});
const model = (pr, rem) => ({
  overlay: clamp(pr / 0.5),
  clouds: CLOUDS.map((v) => (reduce ? 0 : clamp(pr / 0.72) * v * rem)),
});
const dOf = (got, want) => ({
  a: Math.abs(got.overlay - want.overlay),
  c: Math.max(0, ...got.clouds.map((y, i) => Math.abs(y - want.clouds[i]))),
});
// Overlay within 0.02 (the scrub catch-up never quite lands), clouds within 1 px.
const okD = (d) => d.a <= 0.02 && d.c <= 1;
const fmt = (o) => `overlay ${o.overlay.toFixed(3)} clouds [${o.clouds.map((v) => v.toFixed(1))}]`;
const settle = reduce ? 600 : 3000; // scrub 1 / IX2 smoothing 90

const s0 = await state();
console.log(`== ${only}${reduce ? ' reduce' : ''}${live ? ' live' : ''}: new footer top ${s0.nTop.toFixed(0)} h ${s0.nH}, old footer top ${s0.oTop?.toFixed(0)} h ${s0.oH}, max scroll ${s0.max}, rem ${s0.rem}`);

// Before the start: everything at rest.
const span = (h) => vp.h + 0.15 * h;
await scrollTo(Math.round(s0.nTop - span(s0.nH) - 200));
await p.waitForTimeout(settle);
{
  const s = await state();
  const got = { overlay: s.nOverlay, clouds: s.nClouds };
  flag(got.overlay === 0 && got.clouds.every((v) => v === 0), `before start (p ${s.n.p.toFixed(3)}): ${fmt(got)}`);
}

// Aim until the progress is reached: old lazy pins (built when their section passes) change the page height on the way.
// A long jump also gets extra time: the old IX2 smoothing starts from far away.
const aim = async (pr, which) => {
  let s1, y, far = false;
  for (let k = 0; k < 5; k++) {
    s1 = await state();
    y = Math.round(s1[which + 'Top'] - span(s1[which + 'H']) * (1 - pr));
    const t = Math.min(y, s1.max);
    if (Math.abs(t - s1.y) > 3 * vp.h) far = true;
    if (k && Math.abs(t - s1.y) < 4) break;
    await scrollTo(t);
    await p.waitForTimeout(800);
  }
  await p.waitForTimeout(settle + (far ? 2000 : 0));
  return y > s1.max + 2; // cut by the page end
};
const check = async (pr, tag = '') => {
  await aim(pr, 'n');
  const s = await state();
  const got = { overlay: s.nOverlay, clouds: s.nClouds };
  const want = model(s.n.p, s.rem);
  const d = dOf(got, want);
  // A missed aim would pass trivially (both at rest): the reached progress must be the asked one.
  flag(okD(d) && Math.abs(s.n.p - pr) <= 0.03, `${tag}new p ${s.n.p.toFixed(3)} (asked ${pr}): ${fmt(got)} | model ${fmt(want)} Δa ${d.a.toFixed(3)} Δc ${d.c.toFixed(1)}`);
  return s;
};
for (const pr of POINTS) {
  const s = await check(pr);
  if (pr === 0.45 || pr === 1) await p.screenshot({ path: `${out}/footer-run-${only}${reduce ? '-reduce' : ''}-${Math.round(s.n.p * 100)}.png` });
}

// The old footer with the live IX2 a-126: same points, as far as the page end allows (reduced motion does not change IX2).
if (s0.oTop != null && !reduce) {
  for (const pr of POINTS) {
    const cut = await aim(pr, 'o');
    const s = await state();
    const got = { overlay: s.oOverlay, clouds: s.oClouds };
    const want = model(s.o.p, s.rem);
    const d = dOf(got, want);
    // The IX2 overlay goes rgba(0,0,0,0) → rgb(12,11,11): its alpha is the progress of the key.
    flag(okD(d) && (cut || Math.abs(s.o.p - pr) <= 0.03), `live IX2 p ${s.o.p.toFixed(3)} (asked ${pr}): ${fmt(got)} | model ${fmt(want)} Δa ${d.a.toFixed(3)} Δc ${d.c.toFixed(1)}`);
    if (cut) break; // the page end: the rest of the points are unreachable
  }
}

// Width change: Resources rebuilds its pin after the footer trigger was created.
if (only === '1440' && !live) {
  await p.setViewportSize({ width: 1280, height: vp.h });
  await p.waitForTimeout(1500);
  await check(0.3, 'after resize to 1280: ');
}

if (logs.length) console.log(logs.join('\n'));
flag(!logs.length, `page errors: ${logs.length}`);
await b.close();
console.log('flags:', flags);
