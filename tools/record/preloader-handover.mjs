// Preloader hand-over check: the loader ball must turn into the first disc with no jump, and every
// word must start fully below the viewport and end fully above it.
// Runs src/motion.js (local) on the staging page, samples every animation frame of phase 1 → 2.
// Usage: node preloader-handover.mjs [--live]   (--live = the module the staging page loads itself)
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const live = process.argv.includes('--live');
const VIEWPORTS = [
  { w: 1440, h: 750 },
  { w: 1710, h: 1060 },
  { w: 768, h: 1024 },
  { w: 375, h: 812, m: true },
];

const b = await chromium.launch({ channel: 'chrome' });
let flags = 0;
for (const vp of VIEWPORTS) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.m, hasTouch: !!vp.m });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  if (!live) {
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
  await p.goto(STAGING, { waitUntil: 'domcontentloaded' });

  const rows = await p.evaluate(
    () =>
      new Promise((resolve) => {
        const q = (r) => document.querySelector(`[data-motion="${r}"]`);
        const loader = q('preloader-loader');
        const ball = q('preloader-bounce-ball');
        const discs = [...document.querySelectorAll('[data-motion="preloader-disc"]')];
        const words = [...document.querySelectorAll('[data-motion="preloader-step"] > [data-motion="preloader-word"]')];
        const out = [];
        const t0 = performance.now();
        const tick = () => {
          const t = (performance.now() - t0) / 1000;
          const br = ball.getBoundingClientRect();
          out.push({
            t,
            loader: getComputedStyle(loader).display !== 'none',
            ball: { x: br.left + br.width / 2, y: br.top + br.height / 2, w: br.width, h: br.height },
            clip: discs.map((d) => getComputedStyle(d).clipPath),
            words: words.map((w) => {
              const r = w.getBoundingClientRect();
              return [r.top, r.bottom];
            }),
          });
          if (t < 9.5 && document.documentElement.classList.contains('is-preloading')) requestAnimationFrame(tick);
          else resolve(out);
        };
        requestAnimationFrame(tick);
      })
  );

  const vh = vp.h;
  const parse = (c) => {
    const m = /circle\(([\d.]+)px at ([\d.]+)px ([\d.]+)px\)/.exec(c);
    return m ? { r: +m[1], x: +m[2], y: +m[3] } : null;
  };
  const cut = rows.findIndex((r) => !r.loader);
  const msg = [];
  if (cut < 1) {
    msg.push('⚠ loader never hidden');
    flags++;
  } else {
    const before = rows[cut - 1].ball;
    const disc = parse(rows[cut].clip[0]);
    const dr = disc ? Math.abs(disc.r - before.w / 2) : Infinity;
    const dx = disc ? Math.hypot(disc.x - before.x, disc.y - before.y) : Infinity;
    const round = Math.abs(before.w - before.h);
    const ok = dr <= 1 && dx <= 1 && round <= 0.5;
    if (!ok) flags++;
    msg.push(
      `${ok ? '✓' : '⚠'} hand-over @${rows[cut].t.toFixed(2)}s: ball Ø${before.w.toFixed(1)}×${before.h.toFixed(1)} at (${before.x.toFixed(1)}, ${before.y.toFixed(1)}) → disc ${disc ? `r${disc.r.toFixed(1)} at (${disc.x.toFixed(1)}, ${disc.y.toFixed(1)})` : rows[cut].clip[0]}  Δr ${dr.toFixed(2)} Δc ${dx.toFixed(2)}`
    );
    // Nothing of a word may be on screen before its own tween moves it, nor after it left.
    const phase2 = rows.slice(cut);
    const first = phase2[0].words;
    const peek = first.map(([top]) => top < vh);
    const lastRow = phase2[phase2.length - 1].words;
    first.forEach(([top], i) => {
      const bad = peek[i];
      if (bad) flags++;
      msg.push(`${bad ? '⚠' : '✓'} word ${i}: start top ${top.toFixed(0)} (vh ${vh}), end bottom ${lastRow[i][1].toFixed(0)}`);
    });
    // The disc must stay a growing circle, never jump back to 0 after the hand-over.
    let shrink = 0;
    for (let i = cut + 1; i < rows.length; i++) {
      const a = parse(rows[i - 1].clip[0]);
      const c = parse(rows[i].clip[0]);
      if (a && c && c.r + 0.01 < a.r) shrink++;
    }
    if (shrink) flags++;
    msg.push(`${shrink ? '⚠' : '✓'} disc 1 radius monotonic (${shrink} drops)`);
  }
  if (errors.length) {
    flags++;
    msg.push('⚠ errors: ' + errors.slice(0, 3).join(' | '));
  }
  console.log(`${vp.w}×${vp.h}${vp.m ? ' mobile' : ''} (${rows.length} frames)\n  ` + msg.join('\n  '));
  await ctx.close();
}
await b.close();
console.log(flags ? `${flags} flag(s)` : '0 flags');
process.exit(flags ? 1 : 0);
