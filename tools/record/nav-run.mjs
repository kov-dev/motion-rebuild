// Runs initNav() / initTheme() on the published staging page (local src/motion.js injected, as footer-run does) and checks
// the navbar (docs/sections/navigation.md «План анімації»):
//   theme — the scheme under the navbar line for every [data-theme] zone: dark / light / colour (lesson background + its crumb),
//           the dark demo inside easing and the lesson after it, Resources light through its whole pin, the footer dark from
//           footer progress 0.25 (overlay of Resources ≥ 50 %), and back up again
//   menu  — open / close sampled every frame in the page against the live a-58 / a-88 model (linear, cards power1.inOut),
//           aria-expanded, html overflow, the dark scheme while open over a light section, Esc, the logo and card Lotties,
//           hover frames (≥992), the wheel → track scrollLeft; with LIVE=<nav-menu-1440.txt> the live samples of nav-probe.mjs
//           are fitted to the same model (their clock starts late: the offset is fitted on the cards x)
//   links — a card click closes the menu and lands its section at the top (±2 px) with the section's scheme
// Usage: node nav-run.mjs <project-root> <out-dir> [1440|768|600|375] [--live] [--reduce]   env PART=theme,menu,links
// --live: the staging page exactly as published (snippets already in Webflow), nothing injected.
// --reduce: prefers-reduced-motion — the cards do not slide, the theme switches without a tween.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const live = args.includes('--live');
const reduce = args.includes('--reduce');
const [root, out, only = '1440'] = args.filter((a) => !a.startsWith('--'));
mkdirSync(out, { recursive: true });
const parts = (process.env.PART || 'theme,menu,links').split(',');
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const VPS = { 1440: { w: 1440, h: 900, m: false }, 768: { w: 768, h: 1024, m: true }, 600: { w: 600, h: 900, m: true }, 375: { w: 375, h: 812, m: true } };
const DARK = 'rgb(12, 11, 11)';
const LIGHT = 'rgb(253, 252, 250)';
const vp = VPS[only];
const src = (f) => readFileSync(`${root}/src/${f}`, 'utf8');
let flags = 0;
const flag = (ok, line) => { if (!ok) flags++; console.log(`${ok ? '✓' : '✗'} ${line}`); };

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

// A native jump first (Lenis syncs to it), then wheel / scrollBy passes, as footer-run.
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
    await p.waitForTimeout(400);
  }
};

// The painted navbar: the toggle pill (bg / text), the line, both eyes, the visible crumbs.
const navState = () => p.evaluate(() => {
  const nb = document.querySelector('[data-motion="nb"]');
  const cs = (e) => getComputedStyle(e);
  const toggle = nb.querySelector('[data-motion="nb-toggle"]');
  const line = nb.querySelector('[data-motion="nb-line-top"]');
  const eyes = [...nb.querySelectorAll('[data-motion="nb-eyes"]')].map((e) => `${e.dataset.eyes}:${(+cs(e).opacity).toFixed(2)}`).join(' ');
  const crumbs = [...nb.querySelectorAll('[data-motion="nb-crumb"]')].filter((c) => +cs(c).opacity > 0.01).map((c) => `${c.dataset.crumb}:${(+cs(c).opacity).toFixed(2)}`);
  return { bg: cs(toggle).backgroundColor, fg: cs(toggle).color, border: cs(toggle).borderTopColor, line: cs(line).backgroundColor, eyes, crumbs: crumbs.join(' ') };
});
const want = (theme, bg, crumb) => ({
  bg: theme === 'dark' ? DARK : theme === 'light' ? LIGHT : bg,
  fg: theme === 'dark' ? LIGHT : DARK,
  eyes: theme === 'dark' ? 'dark:1.00 light:0.00' : 'dark:0.00 light:1.00',
  crumbs: theme === 'color' ? `${crumb}:1.00` : '',
});
const sameScheme = (s, w) => s.bg === w.bg && s.fg === w.fg && s.border === w.fg && s.line === w.fg && s.eyes === w.eyes && s.crumbs === w.crumbs;
const fmtS = (s) => `bg ${s.bg} fg ${s.fg} eyes [${s.eyes}] crumbs [${s.crumbs}]`;

// Zone geometry, measured fresh (pins and lazy media move things).
const zones = () => p.evaluate(() => [...document.querySelectorAll('[data-theme]')]
  .filter((e) => !e.closest('[data-motion="nb"]'))
  .map((e, i) => {
    const r = e.getBoundingClientRect();
    return { key: e.id || `${e.dataset.motion}-${i}`, theme: e.dataset.theme, top: r.top + scrollY, h: r.height, bg: getComputedStyle(e).backgroundColor, motion: e.dataset.motion };
  }));
const settle = reduce ? 300 : 800;

// Aim at a point of a zone until it stays (scrubbed pins above can still be catching up).
const aimZone = async (key, at) => {
  let y = 0;
  for (let k = 0; k < 4; k++) {
    const z = (await zones()).find((x) => x.key === key);
    const ny = Math.round(at(z));
    if (k && Math.abs(ny - y) < 3) break;
    y = ny;
    await scrollTo(y);
  }
  await p.waitForTimeout(settle);
  return y;
};

if (parts.includes('theme')) {
  console.log(`== ${only}${reduce ? ' reduce' : ''}${live ? ' live' : ''}: theme`);
  const zs = await zones();
  const color = (key) => zs.find((z) => z.key === key)?.bg;
  const crumb = (key) => key.replace(/-next$/, '');
  const checks = [];
  for (const z of zs) {
    if (z.motion === 'footer') continue;
    checks.push({ name: `${z.key} top+40`, key: z.key, at: (g) => g.top + 40, theme: z.theme, bg: z.bg, crumb: crumb(z.key) });
    if (z.motion === 'lesson-demo') checks.push({ name: 'easing after the demo', key: z.key, at: (g) => g.top + g.h + 40, theme: 'color', bg: color('easing-next'), crumb: 'easing' });
    if (z.motion === 'resources') checks.push({ name: 'resources pin middle', key: z.key, at: (g) => g.top + g.h / 2, theme: 'light' });
  }
  // Footer: progress p = (span − top) / span, span = vh + 0.15·h; the theme turns at p = 0.25.
  const footAt = (pr) => (g) => g.top - (vp.h + 0.15 * g.h) * (1 - pr);
  const fz = zs.find((z) => z.motion === 'footer');
  if (fz) {
    checks.push({ name: 'footer p 0.22 (overlay 44 %)', key: fz.key, at: footAt(0.22), theme: 'light' });
    checks.push({ name: 'footer p 0.28 (overlay 56 %)', key: fz.key, at: footAt(0.28), theme: 'dark' });
  }
  // Back up: a lesson, the light Interactive, the dark top.
  const back = ['zoom-next', 'easing-next'].filter((k) => zs.find((z) => z.key === k));
  back.forEach((k) => checks.push({ name: `back up: ${k}`, key: k, at: (g) => g.top + 40, theme: 'color', bg: color(k), crumb: crumb(k) }));
  checks.push({ name: 'back up: top', key: zs[0].key, at: () => 0, theme: 'dark' });

  for (const c of checks) {
    const y = await aimZone(c.key, c.at);
    const s = await navState();
    const w = want(c.theme, c.bg, c.crumb);
    flag(sameScheme(s, w), `${c.name} (y ${y}): ${c.theme} — ${fmtS(s)}${sameScheme(s, w) ? '' : ` | want ${fmtS({ ...w, border: w.fg, line: w.fg })}`}`);
  }
  // Tween length: switch from the dark top to the light Interactive and sample the toggle background.
  if (!vp.m) {
    const z = (await zones()).find((x) => x.theme === 'light');
    await aimZone(zs[0].key, () => z.top - 200);
    const samples = await p.evaluate(async (y) => {
      const t = document.querySelector('[data-motion="nb-toggle"]');
      const res = [];
      scrollTo(0, y);
      const t0 = performance.now();
      while (performance.now() - t0 < 700) {
        await new Promise(requestAnimationFrame);
        res.push([Math.round(performance.now() - t0), getComputedStyle(t).backgroundColor]);
      }
      return res;
    }, Math.round(z.top + 40));
    const firstLight = samples.find(([, c]) => c === LIGHT)?.[0];
    const firstMove = samples.find(([, c]) => c !== DARK)?.[0];
    const span = firstLight - firstMove;
    flag(reduce ? span <= 34 : span > 300 && span < 480, `dark → light tween ${firstMove} → ${firstLight} ms (span ${span}, want ${reduce ? '0' : '≈400'})`);
  }
}

// Open / close model of the live a-58 / a-88 (sampled on motion.zajno.com, session 27).
const pio = (u) => (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u)); // power1.inOut
const c01 = (v) => Math.min(1, Math.max(0, v));
const model = (open, t, rem) => {
  const k = (d) => c01(t / d);
  const f = (d) => (open ? k(d) : 1 - k(d));
  return {
    op: f(0.2),
    x: reduce ? 0 : 4 * rem * (1 - (open ? pio(k(0.6)) : 1 - pio(k(0.6)))),
    label: -104 * f(0.3),
    angle: 45 * f(0.2),
    y: 0.02 * rem * f(0.2),
  };
};
const KEYS = { op: 0.02, x: 1, label: 1, angle: 0.6, y: 0.1 };
// A sample passes if it lies within the model over [t − 50 ms, t + 34 ms]: GSAP starts a tween at its last tick (up to a frame
// before the click), our rAF read
// can come before or after its tick, and the first open lays out the menu (one long frame). Keys the band hides are null.
const fits = (open, s, rem) => {
  const lo = {}, hi = {};
  for (let dt = -0.05; dt <= 0.034; dt += 0.004) {
    const m = model(open, Math.max(0, s.t + dt), rem);
    for (const k of Object.keys(KEYS)) { lo[k] = Math.min(lo[k] ?? Infinity, m[k]); hi[k] = Math.max(hi[k] ?? -Infinity, m[k]); }
  }
  return Object.keys(KEYS).filter((k) => s[k] !== null && !(s[k] >= lo[k] - KEYS[k] && s[k] <= hi[k] + KEYS[k]));
};

const sampleToggle = (how) => p.evaluate(async (how) => {
  const nb = document.querySelector('[data-motion="nb"]');
  const g = (r) => nb.querySelector(`[data-motion="${r}"]`);
  const toggle = g('nb-toggle'), menu = g('nb-menu'), cards = g('nb-cards'), label = g('nb-toggle-label'), top = g('nb-line-top');
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const m = (e) => new DOMMatrix(getComputedStyle(e).transform);
  const res = [];
  const t0 = performance.now();
  if (how === 'esc') document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  else toggle.click();
  while (performance.now() - t0 < 900) {
    const t = (performance.now() - t0) / 1000;
    const cm = cards ? m(cards) : new DOMMatrix();
    const lm = m(label), tm = m(top);
    res.push({
      t, display: getComputedStyle(menu).display, op: +getComputedStyle(menu).opacity, x: cm.m41, label: label.offsetHeight ? (lm.m42 / label.getBoundingClientRect().height) * 100 : null,
      angle: (Math.atan2(tm.b, tm.a) * 180) / Math.PI, y: tm.m42, overflow: document.documentElement.style.overflow,
      aria: toggle.getAttribute('aria-expanded'),
    });
    await new Promise(requestAnimationFrame);
  }
  return { rem, res };
}, how);

const checkRun = (tag, open, run) => {
  const bad = run.res.filter((s) => s.display !== 'none' || open).map((s) => ({ s, keys: fits(open, s, run.rem) })).filter((x) => x.keys.length);
  const last = run.res[run.res.length - 1];
  flag(!bad.length, `${tag}: ${run.res.length} frames vs model${bad.length ? ` — ${bad.length} off, first t ${bad[0].s.t.toFixed(3)} [${bad[0].keys.map((k) => `${k} ${bad[0].s[k].toFixed(2)}`)}]` : ''}`);
  const endOk = open
    ? last.display === 'block' && last.op === 1 && Math.abs(last.x) < 0.5 && last.aria === 'true' && last.overflow === 'hidden'
    : last.display === 'none' && last.aria === 'false' && last.overflow === '';
  flag(endOk, `${tag} end: display ${last.display} op ${last.op} x ${last.x.toFixed(1)} aria ${last.aria} overflow '${last.overflow}'`);
  const hide = run.res.find((s) => s.display === 'none');
  if (!open) flag(hide && hide.t >= 0.18 && hide.t <= 0.26, `${tag}: display none at ${hide?.t.toFixed(3)} s (live 0.2)`);
};

// Live samples (nav-probe.mjs PART=menu): fit the sampling offset on the cards x, then check the other keys at that offset.
const checkLive = (file) => {
  const rows = readFileSync(file, 'utf8').split('\n').filter((l) => /^(open|close) \+/.test(l));
  const parse = (l) => {
    const [head, op, x, label, top] = l.split(' | ');
    const mm = (s) => (s.trim() === 'none' ? [1, 0, 0, 1, 0, 0] : s.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number));
    const [tag, ms] = head.split(' +');
    const tm = mm(top);
    return { tag, ms: parseInt(ms), display: head.split(' ').pop(), op: +op, x: mm(x)[4], label: (mm(label)[5] / 16) * 100, angle: (Math.atan2(tm[1], tm[0]) * 180) / Math.PI, y: tm[5] };
  };
  const all = rows.map(parse);
  for (const open of [true, false]) {
    const tag = open ? 'open' : 'close';
    const s = all.filter((r) => r.tag === tag && (open || r.display !== 'none'));
    let best = null;
    for (let off = 0; off <= 0.3; off += 0.002) {
      const err = s.reduce((a, r) => a + Math.abs(r.x - model(open, r.ms / 1000 + off, 100).x), 0);
      if (!best || err < best.err) best = { off, err };
    }
    const dev = { op: 0, label: 0, angle: 0 };
    s.forEach((r) => {
      const m = model(open, r.ms / 1000 + best.off, 100);
      for (const k of Object.keys(dev)) dev[k] = Math.max(dev[k], Math.abs(r[k] - m[k]));
    });
    const xdev = Math.max(...s.map((r) => Math.abs(r.x - model(open, r.ms / 1000 + best.off, 100).x)));
    // x tolerance: one 60 fps frame at the peak speed of power1.inOut over 4rem / 0.6 s (≈ 22 px at 1440).
    flag(xdev < 22 && dev.op < 0.1 && dev.label < 8 && dev.angle < 6,
      `live ${tag} (${s.length} samples, clock offset ${(best.off * 1000).toFixed(0)} ms): max Δ x ${xdev.toFixed(1)} px, opacity ${dev.op.toFixed(2)}, label ${dev.label.toFixed(1)} %, angle ${dev.angle.toFixed(1)}° (IX2 frames jitter ±1 tick)`);
  }
};

if (parts.includes('menu')) {
  console.log(`== ${only}${reduce ? ' reduce' : ''}${live ? ' live' : ''}: menu`);
  if (process.env.LIVE && existsSync(process.env.LIVE)) checkLive(process.env.LIVE);
  await scrollTo(0);
  await p.waitForTimeout(settle);
  // Logo eyes: both loaded, the visible one plays, the hidden one stands.
  const eyes = await p.evaluate(async () => {
    const url = 'https://cdn.jsdelivr.net/npm/lottie-web@5.13.0/build/player/lottie_light.min.js/+esm';
    const lottie = (await import(url)).default;
    const boxes = [...document.querySelectorAll('[data-motion="nb-eyes"]')];
    const anims = boxes.map((bx) => lottie.getRegisteredAnimations().find((a) => a.wrapper === bx));
    const f0 = anims.map((a) => a?.currentFrame);
    await new Promise((r) => setTimeout(r, 400));
    return boxes.map((bx, i) => `${bx.dataset.eyes}: svg ${!!bx.querySelector('svg')} op ${(+getComputedStyle(bx).opacity).toFixed(2)} ${anims[i] ? (anims[i].currentFrame !== f0[i] ? 'playing' : 'still') : 'no anim'}`);
  });
  const eyesOk = eyes[0].includes('svg true') && eyes[1].includes('svg true') && eyes[0].includes(reduce ? 'still' : 'playing') && eyes[1].includes('still');
  flag(eyesOk, `logo eyes (top, dark): ${eyes.join(' | ')}`);

  const cardsBefore = await p.evaluate(() => document.querySelectorAll('[data-motion="nb-card-lottie"] svg').length);
  flag(cardsBefore === 0, `card Lotties before the first open: ${cardsBefore} (lazy)`);

  // Over the light Interactive: open → dark, close → light again.
  const zs = await zones();
  const light = zs.find((z) => z.theme === 'light');
  await aimZone(light.key, (g) => g.top + 40);
  const before = await navState();
  const opened = await sampleToggle('click');
  checkRun('open', true, opened);
  await p.waitForTimeout(600);
  const inMenu = await navState();
  flag(before.bg === LIGHT && inMenu.bg === DARK && inMenu.eyes === 'dark:1.00 light:0.00', `scheme over Interactive: ${before.bg} → open ${inMenu.bg}, eyes [${inMenu.eyes}]`);
  const cardsLoaded = await p.evaluate(() => document.querySelectorAll('[data-motion="nb-card-lottie"] svg').length);
  flag(cardsLoaded === 10, `card Lotties after open: ${cardsLoaded} / 10`);

  if (!vp.m) {
    // Hover the second card: frames 0 → end in 0.67 s, out back to 0 in 0.67 s (live 0 3 6 9 … per 50 ms).
    const box = await p.locator('[data-motion="nb-cards"] a').nth(1).boundingBox();
    const frames = async (ms) => p.evaluate(async (ms) => {
      const url = 'https://cdn.jsdelivr.net/npm/lottie-web@5.13.0/build/player/lottie_light.min.js/+esm';
      const lottie = (await import(url)).default;
      const el = document.querySelectorAll('[data-motion="nb-card-lottie"]')[1];
      const a = lottie.getRegisteredAnimations().find((x) => x.wrapper === el);
      const out = [];
      const t0 = performance.now();
      while (performance.now() - t0 < ms) {
        out.push([Math.round(performance.now() - t0), Math.round(a.currentFrame)]);
        await new Promise((r) => setTimeout(r, 50));
      }
      return { out, total: a.totalFrames };
    }, ms);
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const inF = await frames(900);
    await p.mouse.move(vp.w / 2, 20);
    const outF = await frames(900);
    const last = inF.total - 1;
    // The sampling clock starts a little after the mouse move: check the slope over the moving part (last / 0.67 s) instead.
    const slope = (o, dir) => {
      const mv = o.filter(([, f], i) => i && f !== o[i - 1][1] && f > 0 && f < last);
      if (mv.length < 3) return 0;
      return (dir * (mv.at(-1)[1] - mv[0][1])) / ((mv.at(-1)[0] - mv[0][0]) / 1000);
    };
    const want = last / 0.67;
    const linIn = Math.abs(slope(inF.out, 1) / want - 1) < 0.15;
    const linOut = Math.abs(slope(outF.out, -1) / want - 1) < 0.15;
    flag(linIn && inF.out.at(-1)[1] === last, `hover in (${slope(inF.out, 1).toFixed(0)} f/s, want ${want.toFixed(0)}): ${inF.out.map(([, f]) => f).join(' ')}`);
    flag(linOut && outF.out.at(-1)[1] === 0, `hover out (${slope(outF.out, -1).toFixed(0)} f/s): ${outF.out.map(([, f]) => f).join(' ')}`);

    // Wheel over the menu: the track scrolls sideways, the page stays.
    const w0 = await p.evaluate(() => [document.querySelector('[data-motion="nb-track"]').scrollLeft, scrollY]);
    await p.mouse.move(vp.w / 2, vp.h / 2);
    await p.mouse.wheel(0, 300);
    await p.waitForTimeout(500);
    const w1 = await p.evaluate(() => [document.querySelector('[data-motion="nb-track"]').scrollLeft, scrollY]);
    flag(w1[0] - w0[0] === 300 && w1[1] === w0[1], `wheel 300: scrollLeft ${w0[0]} → ${w1[0]}, page scrollY ${w0[1]} → ${w1[1]}`);
    await p.evaluate(() => (document.querySelector('[data-motion="nb-track"]').scrollLeft = 0));
  }

  // Esc closes and gives the focus back to the toggle.
  const closed = await sampleToggle('esc');
  checkRun('close (Esc)', false, closed);
  await p.waitForTimeout(600);
  const after = await navState();
  const focus = await p.evaluate(() => document.activeElement?.dataset.motion);
  flag(after.bg === LIGHT && focus === 'nb-toggle', `after close: scheme ${after.bg}, focus ${focus}`);

  // Toggle close too, from a second open.
  await sampleToggle('click');
  await p.waitForTimeout(300);
  checkRun('close (toggle)', false, await sampleToggle('click'));
}

if (parts.includes('links')) {
  console.log(`== ${only}${reduce ? ' reduce' : ''}${live ? ' live' : ''}: links`);
  const cards = await p.evaluate(() => [...document.querySelectorAll('[data-motion="nb-cards"] a')].map((a) => a.getAttribute('href')));
  for (const i of [2, 6, 9, 0, 1]) {
    const href = cards[i];
    const startY = i === 0 ? vp.h * 3 : vp.h / 2;
    await scrollTo(startY);
    await p.waitForTimeout(400);
    await p.locator('[data-motion="nb-toggle"]').click();
    await p.waitForTimeout(800);
    await p.locator('[data-motion="nb-cards"] a').nth(i).click({ timeout: 5000 });
    await p.waitForTimeout(reduce ? 800 : 2500);
    const r = await p.evaluate((h) => {
      const t = document.querySelector(h);
      return { top: t ? +t.getBoundingClientRect().top.toFixed(1) : null, y: scrollY, theme: t?.dataset.theme, bg: t ? getComputedStyle(t).backgroundColor : '',
        menu: getComputedStyle(document.querySelector('[data-motion="nb-menu"]')).display, overflow: document.documentElement.style.overflow };
    }, href);
    const s = await navState();
    const theme = r.theme || 'dark';
    const w = want(theme, r.bg, href.slice(1).replace(/-next$/, ''));
    flag(r.top !== null && Math.abs(r.top) <= 2 && r.menu === 'none' && r.overflow === '' && sameScheme(s, w),
      `card ${i} ${href}: target top ${r.top} (scrollY ${r.y}), menu ${r.menu}, scheme ${theme} — ${fmtS(s)}`);
  }
}

if (logs.length) console.log(logs.slice(0, 5).join('\n'));
flag(!logs.length, `page errors: ${logs.length}`);
console.log(`flags: ${flags}`);
await b.close();
process.exit(flags ? 1 : 0);
