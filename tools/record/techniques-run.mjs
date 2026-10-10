// Runs initTechniques() on the published staging page next to the old script (as interactive-run does) and checks
// the transforms of the words, stars and paragraph on the 8 progress marks of techniques-probe.mjs against the live
// section (motion.zajno.com, IX2) and against the IX2 keys (docs/sections/techniques.md «Лайв-заміри»).
// Progress as in the probe: 0 = section top at the viewport bottom, 1 = its bottom at the top.
// --lag (1440): scrolls through the section like the recording (wheel 40 px every 50 ms), samples word 3 every frame
// and reports how far the animation trails the scroll and how long it takes to settle, on both pages: used to fit
// the scrub of our timeline to the IX2 smoothing 90.
// Usage: node techniques-run.mjs <project-root> <out-dir> [1440|768|375] [--live] [--lag] [--scrub=N] [--no-ref]
// --live: the staging page exactly as published (snippets already in Webflow), nothing injected.
// --scrub=N: (not with --live) replaces TECHNIQUES_SCRUB in the injected motion.js.
// --no-ref: skip the live site (ours against the IX2 keys only).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const args = process.argv.slice(2);
const live = args.includes('--live');
const lag = args.includes('--lag');
const noRef = args.includes('--no-ref');
const scrub = args.find((a) => a.startsWith('--scrub='))?.split('=')[1];
const [root, out, only = '1440'] = args.filter((a) => !a.startsWith('--'));
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const LIVE = 'https://motion.zajno.com/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const VPS = {
  1440: { w: 1440, h: 900, m: false },
  768: { w: 768, h: 1024, m: true },
  375: { w: 375, h: 812, m: true },
};
const vp = VPS[only];
const src = (f) => readFileSync(`${root}/src/${f}`, 'utf8');
const MARKS = [['p0', 0], ['p10', 0.1], ['p24', 0.24], ['p36', 0.36], ['p50', 0.5], ['p60', 0.6], ['p72', 0.72], ['p85', 0.85]];
const ANGLES = [-5, 5, -8];

// Element lookup per page: ours by data-motion roles, the live one by its classes.
const SEL = {
  ours: { sec: '[data-motion="techniques-word"]', words: '[data-motion="techniques-word"]', stars: '[data-motion="techniques-star"]', text: '[data-motion="techniques-text"]' },
  live: { sec: '#techniques', words: '.list-item.is-techniques', stars: '.bg-image.is-star', text: '.text-wrap.is-techniques' },
};

// The IX2 keys at section progress p (techniques.md): ≤991 starts 30 % of the section later.
const model = (p, h) => {
  const tablet = vp.w <= 991;
  const q = tablet ? (p * (h + vp.h) - 0.3 * h) / (0.7 * h + vp.h) : p;
  const k = (from, to, a, b) => from + (to - from) * Math.min(1, Math.max(0, (q - a) / (b - a)));
  return {
    q,
    w2y: k(100, -200, 0, 0.5),
    w3y: k(0, vp.w <= 767 ? -300 : -500, 0, 0.6),
    s1: [k(1, 0.4, 0, 0.26), k(0, -60, 0, 0.26)],
    s2: [k(1, 0.4, 0, 0.24), k(0, -100, 0, 0.24)],
    txt: k(1, 0.6, 0.6, 0.72),
  };
};

const b = await chromium.launch({ channel: 'chrome' });

async function open(kind) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, ...(vp.m ? { userAgent: UA } : {}) });
  const p = await ctx.newPage();
  const logs = [];
  p.on('pageerror', (e) => !/play\(\) request was interrupted/.test(e.message) && logs.push('pageerror: ' + e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' | ')));
  p.on('console', (m) => m.type() === 'error' && !/ERR_FAILED|Splide|twitter|status of 4/.test(m.text()) && logs.push('console: ' + m.text()));
  if (kind === 'ours' && !live) {
    let js = src('motion.js');
    if (scrub) js = js.replace(/const TECHNIQUES_SCRUB = [\d.]+;/, `const TECHNIQUES_SCRUB = ${scrub};`);
    await p.route(STAGING, async (route) => {
      const res = await route.fetch();
      let html = await res.text();
      // The published page already carries the snippets: swap their module for the local motion.js.
      html = html.replace(/<script type="module" src="[^"]*motion\.js"><\/script>/, '');
      html = html.replace('</body>', `<script type="module">${js}</script></body>`);
      route.fulfill({ response: res, body: html });
    });
    // motion.js is inline here, so its relative imports resolve against the page URL.
    for (const f of ['legacy-guard.js', 'sphere.js']) await p.route(`**/${f}`, (r) => r.fulfill({ contentType: 'text/javascript', body: src(f) }));
  }
  await p.goto(kind === 'ours' ? STAGING : LIVE, { waitUntil: kind === 'ours' ? 'domcontentloaded' : 'load', timeout: 120000 });
  if (kind === 'ours') {
    await Promise.race([
      p.evaluate(() => new Promise((r) => document.addEventListener('motion:preloader-done', () => r(), { once: true }))),
      p.waitForTimeout(25000),
    ]);
    await p.waitForTimeout(2500);
  } else {
    await p.waitForTimeout(16000); // the old preloader
  }
  // Two passes: smooth scrolling keeps moving after the first one lands.
  const scrollTo = async (target, tol = 10) => {
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < 40; i++) {
        const y = await p.evaluate(() => scrollY);
        const d = target - y;
        if (Math.abs(d) < tol) break;
        const step = Math.sign(d) * Math.min(600, Math.abs(d));
        if (vp.m) await p.evaluate((s) => scrollBy(0, s), step);
        else await p.mouse.wheel(0, step);
        await p.waitForTimeout(120);
      }
      await p.waitForTimeout(800);
    }
  };
  return { ctx, p, logs, scrollTo, sel: SEL[kind], kind };
}

// Section geometry and the transforms of its parts, read from the computed matrices.
const read = (pg) => pg.p.evaluate((s) => {
  const first = document.querySelector(s.sec);
  const sec = first.tagName === 'SECTION' ? first : first.closest('section');
  const r = sec.getBoundingClientRect();
  const tf = (e) => {
    if (!e) return null;
    const m = new DOMMatrix(getComputedStyle(e).transform);
    return { y: +m.f.toFixed(1), s: +Math.hypot(m.a, m.b).toFixed(3), r: +(Math.atan2(m.b, m.a) * 180 / Math.PI).toFixed(2) };
  };
  const words = [...document.querySelectorAll(s.words)].filter((e) => sec.contains(e)).map(tf);
  const stars = [...document.querySelectorAll(s.stars)].filter((e) => sec.contains(e)).map(tf);
  return { top: Math.round(r.top + scrollY), h: Math.round(r.height), y: scrollY, rem: parseFloat(getComputedStyle(document.documentElement).fontSize), words, stars, text: tf(sec.querySelector(s.text)) };
}, pg.sel);

const pages = [await open('ours')];
if (!noRef) pages.push(await open('live'));
const rows = [`== ${only}${live ? ' (live staging)' : ''}${scrub ? ` scrub ${scrub}` : ''}`];

if (!lag) {
  const res = {};
  for (const pg of pages) {
    const g = await read(pg);
    rows.push(`${pg.kind}: section top ${g.top} h ${g.h} rem ${g.rem}`);
    res[pg.kind] = [];
    for (const [name, f] of MARKS) {
      await pg.scrollTo(Math.round(g.top - vp.h + (g.h + vp.h) * f));
      await pg.p.waitForTimeout(2500); // scrub / IX2 smoothing settle
      const s = await read(pg);
      res[pg.kind].push({ name, prog: (s.y - (g.top - vp.h)) / (g.h + vp.h), h: g.h, ...s });
      if (pg.kind === 'ours') await pg.p.screenshot({ path: `${out}/techniques-run-${only}-${name}.png` });
    }
  }
  let flags = 0;
  const fmt = (t) => (t ? `y ${t.y} s ${t.s}` : '-');
  for (let i = 0; i < MARKS.length; i++) {
    const o = res.ours[i];
    const m = model(o.prog, o.h);
    const l = res.live?.[i];
    const ml = l && model(l.prog, l.h);
    // Ours against the keys at our own progress (scroll positions differ a little between the pages).
    const d = [
      Math.abs(o.words[1].y - m.w2y), Math.abs(o.words[2].y - m.w3y), Math.abs(o.words[0].y),
      Math.abs(o.stars[0].y - m.s1[1]), Math.abs(o.stars[1].y - m.s2[1]),
    ];
    const ds = [Math.abs(o.stars[0].s - m.s1[0]), Math.abs(o.stars[1].s - m.s2[0]), Math.abs(o.text.s - m.txt)];
    const rot = o.words.map((w, j) => Math.abs(w.r - ANGLES[j]));
    const bad = Math.max(...d) > 2 || Math.max(...ds) > 0.01 || Math.max(...rot) > 0.05;
    flags += bad;
    rows.push(`${o.name} ours prog ${o.prog.toFixed(3)} (keys ${m.q.toFixed(3)})${l ? ` | live prog ${l.prog.toFixed(3)}` : ''}${bad ? '  ⚠' : ''}`);
    rows.push(`  words ours ${o.words.map((w) => `y ${w.y} r ${w.r}`).join(' / ')} | keys y 0 / ${m.w2y.toFixed(1)} / ${m.w3y.toFixed(1)}`);
    if (l) rows.push(`  words live ${l.words.map((w) => `y ${w.y} r ${w.r}`).join(' / ')} | keys@live y ${ml.w2y.toFixed(1)} / ${ml.w3y.toFixed(1)}`);
    rows.push(`  stars ours ${o.stars.map(fmt).join(' / ')} | keys s ${m.s1[0].toFixed(3)} y ${m.s1[1].toFixed(1)} / s ${m.s2[0].toFixed(3)} y ${m.s2[1].toFixed(1)}`);
    if (l) rows.push(`  stars live ${l.stars.map(fmt).join(' / ')}`);
    rows.push(`  text ours s ${o.text.s} | keys ${m.txt.toFixed(3)}${l ? ` | live s ${l.text.s} (keys@live ${ml.txt.toFixed(3)})` : ''}`);
    rows.push(`  Δ ours−keys: y max ${Math.max(...d).toFixed(1)} px, scale max ${Math.max(...ds).toFixed(3)}, rotate max ${Math.max(...rot).toFixed(2)}°`);
  }
  rows.push(`flags: ${flags}`);
} else {
  // Steady scroll like the recording, then stop; word 3 is sampled every frame inside the page.
  for (const pg of pages) {
    const g = await read(pg);
    const span = g.h + vp.h;
    await pg.scrollTo(Math.round(g.top - vp.h - 300));
    await pg.p.waitForTimeout(2500);
    await pg.p.evaluate((s) => {
      const first = document.querySelector(s.sec);
      const sec = first.tagName === 'SECTION' ? first : first.closest('section');
      const w3 = [...document.querySelectorAll(s.words)].filter((e) => sec.contains(e))[2];
      window.__lag = [];
      const t0 = performance.now();
      const tick = () => {
        window.__lag.push([performance.now() - t0, scrollY, new DOMMatrix(getComputedStyle(w3).transform).f]);
        if (window.__lag.length < 4000) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, pg.sel);
    // Wheel 40 px every 50 ms until word 3 is halfway through its run (progress 0.3), then let go.
    const stopAt = g.top - vp.h + span * 0.3;
    const tStop = await (async () => {
      for (let i = 0; i < 400; i++) {
        await pg.p.mouse.wheel(0, 40);
        await pg.p.waitForTimeout(50);
        if ((await pg.p.evaluate(() => scrollY)) >= stopAt) return pg.p.evaluate(() => (window.__lag.at(-1) || [0])[0]);
      }
      return 0;
    })();
    await pg.p.waitForTimeout(3000);
    const smp = await pg.p.evaluate(() => window.__lag);
    // Word 3 runs 0 → −5rem over progress 0 → 0.6: its y gives the progress the animation shows.
    const full = 5 * g.rem;
    const prog = (y) => (y - (g.top - vp.h)) / span;
    const steady = smp.filter(([t, y]) => t < tStop && prog(y) > 0.08 && prog(y) < 0.28);
    const trail = steady.map(([, y, f]) => (prog(y) - (-f / full) * 0.6) * span);
    const speed = steady.length > 1 ? (steady.at(-1)[1] - steady[0][1]) / ((steady.at(-1)[0] - steady[0][0]) / 1000) : 0;
    const end = smp.at(-1);
    const target = -Math.min(1, prog(end[1]) / 0.6) * full;
    const settle = smp.find(([t, , f]) => t > tStop && smp.filter(([u]) => u >= t).every(([, , h]) => Math.abs(h - target) < 1));
    const mean = trail.reduce((a, x) => a + x, 0) / (trail.length || 1);
    rows.push(`${pg.kind}: scroll ${speed.toFixed(0)} px/s | word 3 trails the scroll by ${mean.toFixed(0)} px (${(mean / speed * 1000).toFixed(0)} ms) over ${trail.length} frames | settles ${settle ? (settle[0] - tStop).toFixed(0) : '>3000'} ms after the scroll stops`);
    // Response after the stop, every 100 ms: distance left to the target.
    const after = [];
    for (let t = 0; t <= 1500; t += 100) {
      const s = smp.find(([u]) => u >= tStop + t);
      if (s) after.push(`${t}:${Math.abs(s[2] - target).toFixed(0)}`);
    }
    rows.push(`  left to target after stop (ms:px) ${after.join(' ')}`);
  }
}

for (const pg of pages) rows.push(`${pg.kind}: ${pg.logs.slice(0, 8).join('\n') || 'no page errors'}`);
console.log(rows.join('\n'));
await b.close();
