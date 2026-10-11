// Runs initSound() + the Sound line of initTheme() on the published staging page (local src/motion.js injected, as nav-run
// does) and checks the Sound button (docs/sections/sound.md «План анімації»):
//   enter  — the entrance after the preloader: scale 0 → 1 together with the navbar (IX2 a-161: 0.6 s, delay 0.2)
//   theme  — the scheme under the Sound line (viewport bottom − 90 px) for every [data-theme] zone: dark / light / colour
//            (lesson background), the dark demo inside easing and the lesson after it, Resources light through its pin,
//            back up again; the tween length (≈ 0.4 s)
//   footer — hide / show over the footer sampled every frame against the IX2 a-130 / a-131 model (opacity 0.2 s, scale 0.4 s,
//            linear, display none after), both directions
//   toggle — click: is-on on the mute line, aria-pressed, the background loop plays / pauses, gtag sound_on / sound_off;
//            hover sounds of the menu cards and of Not real-time (≥992), the click sound of the toggle; nothing while off
// Usage: node sound-run.mjs <project-root> <out-dir> [1440|768|600|375] [--live] [--reduce]   env PART=enter,theme,footer,toggle
// --live: the staging page exactly as published (snippets already in Webflow), nothing injected.
// --reduce: prefers-reduced-motion — the theme and the hide / show switch without a tween.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const live = args.includes('--live');
const reduce = args.includes('--reduce');
const [root, out, only = '1440'] = args.filter((a) => !a.startsWith('--'));
mkdirSync(out, { recursive: true });
const parts = (process.env.PART || 'enter,theme,footer,toggle').split(',');
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const VPS = { 1440: { w: 1440, h: 900, m: false }, 768: { w: 768, h: 1024, m: true }, 600: { w: 600, h: 900, m: true }, 375: { w: 375, h: 812, m: true } };
const DARK = 'rgb(12, 11, 11)';
const LIGHT = 'rgb(253, 252, 250)';
const LINE = 90; // the Sound line: viewport bottom − 90 px
const vp = VPS[only];
const src = (f) => readFileSync(`${root}/src/${f}`, 'utf8');
let flags = 0;
const flag = (ok, line) => { if (!ok) flags++; console.log(`${ok ? '✓' : '✗'} ${line}`); };

// Installed before any script: logs media play / pause and gtag calls, samples the entrance of the button every frame.
const HOOKS = `
  window.__plays = []; window.__gtag = [];
  const play = HTMLMediaElement.prototype.play, pause = HTMLMediaElement.prototype.pause;
  HTMLMediaElement.prototype.play = function () { window.__plays.push(['play', this.currentSrc || this.src, +this.currentTime.toFixed(2)]); return play.call(this); };
  HTMLMediaElement.prototype.pause = function () { window.__plays.push(['pause', this.currentSrc || this.src, +this.currentTime.toFixed(2)]); return pause.call(this); };
  // The page footer redefines gtag() onto dataLayer: capture both.
  window.gtag = function () { window.__gtag.push([...arguments]); };
  window.dataLayer = [];
  window.dataLayer.push = function (a) { if (a && a[0] === 'event') window.__gtag.push([...a]); return Array.prototype.push.call(this, a); };
  window.__enter = [];
  const t0 = performance.now();
  const tick = () => {
    const b = document.querySelector('[data-motion="sound-btn"]'), n = document.querySelector('[data-motion="nav"]');
    if (b && n) {
      const m = new DOMMatrix(getComputedStyle(b).transform), nm = new DOMMatrix(getComputedStyle(n).transform);
      const last = window.__enter.at(-1);
      const row = [Math.round(performance.now() - t0), +m.a.toFixed(3), +nm.f.toFixed(1)];
      if (!last || last[1] !== row[1] || last[2] !== row[2]) window.__enter.push(row);
    }
    if (performance.now() - t0 < 40000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
`;

const b = await chromium.launch({ channel: 'chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({
  viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, ...(vp.m ? { userAgent: UA } : {}),
  reducedMotion: reduce ? 'reduce' : 'no-preference',
});
const p = await ctx.newPage();
const logs = [];
p.on('pageerror', (e) => !/play\(\) request was interrupted|interrupted by a (new load|call to pause)/.test(e.message) && logs.push('pageerror: ' + e.message));
const js = live ? null : src('motion.js');
await p.route(STAGING + '*', async (route) => {
  if (!/webflow\.io\/(\?|$)/.test(route.request().url())) return route.continue();
  const res = await route.fetch();
  let html = await res.text();
  html = html.replace('<head>', `<head><script>${HOOKS}</script>`);
  if (js) {
    html = html.replace(/<script type="module" src="[^"]*motion\.js"><\/script>/, '');
    html = html.replace('</body>', `<script type="module">${js}</script></body>`);
  }
  route.fulfill({ response: res, body: html });
});
if (js) for (const f of ['legacy-guard.js', 'sphere.js']) await p.route(`**/${f}`, (r) => r.fulfill({ contentType: 'text/javascript', body: src(f) }));
await p.goto(STAGING + '?run=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 120000 });
await Promise.race([
  p.evaluate(() => new Promise((r) => document.addEventListener('motion:preloader-done', () => r(), { once: true }))),
  p.waitForTimeout(25000),
]);
await p.waitForTimeout(2500);

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

// The painted button: bg / text / border of the button, the mute line, the box of the wrapper.
const btnState = () => p.evaluate(() => {
  const b = document.querySelector('[data-motion="sound-btn"]');
  const s = document.querySelector('[data-motion="sound-state"]');
  const cs = getComputedStyle(b);
  const m = new DOMMatrix(cs.transform);
  return { bg: cs.backgroundColor, fg: cs.color, border: cs.borderTopColor, display: cs.display, opacity: +(+cs.opacity).toFixed(2), scale: +m.a.toFixed(3),
    mute: +(+getComputedStyle(s).opacity).toFixed(2), on: s.classList.contains('is-on'), pressed: b.getAttribute('aria-pressed') };
});
const want = (theme, bg) => ({ bg: theme === 'dark' ? DARK : theme === 'light' ? LIGHT : bg, fg: theme === 'dark' ? LIGHT : DARK });
const sameScheme = (s, w) => s.bg === w.bg && s.fg === w.fg && s.border === w.fg;
const fmtS = (s) => `bg ${s.bg} fg ${s.fg} border ${s.border}`;

const zones = () => p.evaluate(() => [...document.querySelectorAll('[data-theme]')]
  .filter((e) => !e.closest('[data-motion="nb"]') && !e.closest('[data-motion="snd"]'))
  .map((e, i) => {
    const r = e.getBoundingClientRect();
    return { key: (e.id || `${e.dataset.motion}-${i}`).replace(/-next$/, ''), theme: e.dataset.theme, top: r.top + scrollY, h: r.height, bg: getComputedStyle(e).backgroundColor, motion: e.dataset.motion };
  }));
const footTop = () => p.evaluate(() => document.querySelector('[data-motion="footer"]').getBoundingClientRect().top + scrollY);
const settle = reduce ? 300 : 800;
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
const aimFooter = async (dist) => {
  // dist = footer top − viewport bottom at the target.
  let y = 0;
  for (let k = 0; k < 4; k++) {
    const ny = Math.round((await footTop()) - vp.h - dist);
    if (k && Math.abs(ny - y) < 3) break;
    y = ny;
    await scrollTo(y);
  }
  await p.waitForTimeout(settle);
  return y;
};

if (parts.includes('enter')) {
  console.log(`== ${only}${reduce ? ' reduce' : ''}${live ? ' live' : ''}: enter`);
  const rows = await p.evaluate(() => window.__enter);
  if (reduce) {
    // Reduced motion: the preloader shows the Hero at once, the button has no entrance to measure.
    const s0 = await btnState();
    flag(s0.scale === 1 && s0.opacity === 1 && s0.display !== 'none', `reduce: shown without an entrance (scale ${s0.scale} opacity ${s0.opacity} display ${s0.display})`);
    flag(!s0.on && s0.pressed === 'false' && s0.mute === 1, `off at start: is-on ${s0.on} aria-pressed ${s0.pressed} mute line ${s0.mute}`);
  } else {
  // The navbar sits at −200 % (px here) until phase 3, then slides to 0; the button is at scale 0 until the same moment.
  const navStart = rows.find((r, i) => i && rows[i - 1][2] < -50 && r[2] > rows[i - 1][2] + 0.5)?.[0];
  const zeroAt = rows.findIndex((r) => r[1] === 0);
  const scaleStart = zeroAt >= 0 ? rows.slice(zeroAt).find((r) => r[1] > 0.001)?.[0] : undefined;
  const scaleEnd = rows.find((r, i) => r[1] >= 0.999 && i > 0 && rows[i - 1][1] < 0.999 && r[0] > (scaleStart ?? 0))?.[0];
  flag(zeroAt >= 0 && rows[zeroAt][0] < (navStart ?? Infinity) - 1000, `at scale 0 under the preloader from +${rows[zeroAt]?.[0]} ms (first sample scale ${rows[0]?.[1]} at +${rows[0]?.[0]} ms)`);
  flag(scaleStart !== undefined && navStart !== undefined && Math.abs(scaleStart - navStart) <= 50, `starts with the navbar: scale +${scaleStart} ms, nav +${navStart} ms`);
  flag(scaleEnd - scaleStart > 500 && scaleEnd - scaleStart < 720, `scale 0 → 1 in ${scaleEnd - scaleStart} ms (want ≈ 600)`);
  const s = await btnState();
  flag(s.scale === 1 && s.opacity === 1 && s.display !== 'none', `after the entrance: scale ${s.scale} opacity ${s.opacity} display ${s.display}`);
  flag(!s.on && s.pressed === 'false' && s.mute === 1, `off at start: is-on ${s.on} aria-pressed ${s.pressed} mute line opacity ${s.mute}`);
  }
}

if (parts.includes('theme')) {
  console.log(`== ${only}${reduce ? ' reduce' : ''}${live ? ' live' : ''}: theme (line bottom − ${LINE})`);
  const zs = await zones();
  const color = (key) => zs.find((z) => z.key === key)?.bg;
  // Zone top 40 px below the Sound line: the zone is under the line, the previous one above it.
  const lineAt = (g, off) => g.top - (vp.h - LINE) + off;
  const checks = [];
  for (const z of zs) {
    if (z.motion === 'footer') continue;
    checks.push({ name: `${z.key} top+40`, key: z.key, at: (g) => lineAt(g, 40), theme: z.theme, bg: z.bg });
    if (z.motion === 'lesson-demo') checks.push({ name: 'easing after the demo', key: z.key, at: (g) => lineAt(g, g.h + 40), theme: 'color', bg: color('easing') });
    if (z.motion === 'resources') checks.push({ name: 'resources pin middle', key: z.key, at: (g) => lineAt(g, g.h / 2), theme: 'light' });
  }
  const back = ['zoom', 'easing'].filter((k) => zs.find((z) => z.key === k));
  back.forEach((k) => checks.push({ name: `back up: ${k}`, key: k, at: (g) => lineAt(g, 40), theme: 'color', bg: color(k) }));
  checks.push({ name: 'back up: top', key: zs[0].key, at: () => 0, theme: 'dark' });
  for (const c of checks) {
    const y = await aimZone(c.key, c.at);
    const s = await btnState();
    const w = want(c.theme, c.bg);
    flag(sameScheme(s, w), `${c.name} (y ${y}): ${c.theme} — ${fmtS(s)}${sameScheme(s, w) ? '' : ` | want ${fmtS({ ...w, border: w.fg })}`}`);
  }
  // Tween length: from the dark top into the light Interactive, sampled on the button background.
  if (!vp.m) {
    const z = (await zones()).find((x) => x.theme === 'light');
    await aimZone(zs[0].key, () => lineAt(z, -200));
    const samples = await p.evaluate(async (y) => {
      const t = document.querySelector('[data-motion="sound-btn"]');
      const res = [];
      scrollTo(0, y);
      const t0 = performance.now();
      while (performance.now() - t0 < 700) {
        await new Promise(requestAnimationFrame);
        res.push([Math.round(performance.now() - t0), getComputedStyle(t).backgroundColor]);
      }
      return res;
    }, Math.round(lineAt(z, 40)));
    const firstLight = samples.find(([, c]) => c === LIGHT)?.[0];
    const firstMove = samples.find(([, c]) => c !== DARK)?.[0];
    const span = firstLight - firstMove;
    flag(reduce ? span <= 34 : span > 300 && span < 480, `dark → light tween ${firstMove} → ${firstLight} ms (span ${span}, want ${reduce ? '0' : '≈400'})`);
  }
}

if (parts.includes('footer')) {
  console.log(`== ${only}${reduce ? ' reduce' : ''}${live ? ' live' : ''}: footer`);
  await aimFooter(300);
  let s = await btnState();
  flag(s.display !== 'none' && s.opacity === 1 && s.scale === 1, `footer 300 px below the viewport: shown (display ${s.display} opacity ${s.opacity} scale ${s.scale})`);
  // Jump so that the footer top lands 60 px inside the viewport; sample every frame.
  const c01 = (v) => Math.min(1, Math.max(0, v));
  const model = (hide, t) => ({ op: hide ? 1 - c01(t / 0.2) : c01(t / 0.2), sc: hide ? 1 - c01(t / 0.4) : c01(t / 0.4) });
  const fits = (hide, r) => {
    if (reduce) return r.t > 0.05 ? (hide ? r.op === 0 && r.sc === 0 : r.op === 1 && r.sc === 1) : true;
    let okOp = false, okSc = false;
    // Window [t − 50, t + 70] ms: the start is seen one sampled frame late, and the mobile bands sample at ~30 fps.
    for (let dt = -0.05; dt <= 0.07; dt += 0.004) {
      const m = model(hide, Math.max(0, r.t + dt));
      okOp ||= Math.abs(m.op - r.op) <= 0.03;
      okSc ||= Math.abs(m.sc - r.sc) <= 0.03;
    }
    return okOp && okSc;
  };
  const sample = (y) => p.evaluate(async (y) => {
    const b = document.querySelector('[data-motion="sound-btn"]');
    const res = [];
    scrollTo(0, y);
    let t0 = null;
    const start = performance.now();
    let last = null;
    while (performance.now() - start < 1200) {
      await new Promise(requestAnimationFrame);
      const cs = getComputedStyle(b);
      const row = { op: +(+cs.opacity).toFixed(3), sc: cs.display === 'none' ? 0 : +new DOMMatrix(cs.transform).a.toFixed(3), d: cs.display, ms: performance.now() - start };
      if (t0 === null && last && (row.op !== last.op || row.sc !== last.sc || row.d !== last.d)) t0 = last.ms;
      row.t = t0 === null ? -1 : (row.ms - t0) / 1000;
      res.push(row);
      last = row;
    }
    return res;
  }, y);
  const judge = (hide, rows) => {
    if (reduce) {
      // Instant switch: no frame between the two states, the end state within 100 ms of the jump.
      const mid = rows.filter((r) => r.op > 0 && r.op < 1);
      const end = rows.find((r) => r.ms > 100 && (hide ? r.d === 'none' : r.op === 1 && r.sc === 1 && r.d !== 'none'));
      flag(mid.length === 0, `${hide ? 'hide' : 'show'} (reduce): ${mid.length} frames mid-fade`);
      flag(!!end, `${hide ? 'hide' : 'show'} (reduce): end state ${hide ? 'none' : 'shown'} by +${Math.round(end?.ms ?? -1)} ms (last frame: ${JSON.stringify(rows.at(-1))})`);
      return;
    }
    const moving = rows.filter((r) => r.t >= 0);
    const bad = moving.filter((r) => r.d !== 'none' && !fits(hide, r));
    const firstT = moving[0]?.ms;
    flag(moving.length > 0, `${hide ? 'hide' : 'show'}: starts at +${Math.round(firstT ?? -1)} ms after the jump`);
    flag(bad.length === 0, `${hide ? 'hide' : 'show'}: ${moving.length} frames against the a-${hide ? 130 : 131} model, ${bad.length} off${bad.length ? ': ' + bad.slice(0, 3).map((r) => `t ${r.t.toFixed(3)} op ${r.op} sc ${r.sc}`).join('; ') : ''}`);
    const noneAt = moving.find((r) => r.d === 'none')?.t;
    if (hide) flag(noneAt !== undefined && noneAt >= (reduce ? 0 : 0.36), `hide: display none at t ${noneAt?.toFixed(3)} (want ≈ 0.4, after the scale; one sampled frame of slack)`);
    else flag(!moving.some((r) => r.d === 'none'), `show: display back before the fade (${moving.filter((r) => r.d === 'none').length} frames none)`);
    const end = moving.at(-1);
    flag(end && (hide ? end.op === 0 && end.sc === 0 && end.d === 'none' : end.op === 1 && end.sc === 1 && end.d !== 'none'), `${hide ? 'hide' : 'show'}: ends at opacity ${end?.op} scale ${end?.sc} display ${end?.d}`);
  };
  const ft = await footTop();
  judge(true, await sample(Math.round(ft - vp.h + 60)));
  s = await btnState();
  flag(s.display === 'none', `footer 60 px in: hidden (display ${s.display})`);
  judge(false, await sample(Math.round(ft - vp.h - 300)));
  // Exact edge: 20 px steps around the footer top crossing the viewport bottom.
  const edge = [];
  for (const d of [40, 20, 0, -20, -40]) {
    await p.evaluate((y) => scrollTo(0, y), Math.round(ft - vp.h - d));
    await p.waitForTimeout(reduce ? 200 : 700);
    const st = await btnState();
    edge.push(`${d > 0 ? '+' : ''}${d}:${st.display === 'none' ? 'none' : 'shown'}`);
  }
  flag(edge[0].endsWith('shown') && edge[1].endsWith('shown') && edge[3].endsWith('none') && edge[4].endsWith('none'), `edge (footer top − viewport bottom): ${edge.join(' ')}`);
  await aimFooter(400);
}

if (parts.includes('toggle')) {
  console.log(`== ${only}${reduce ? ' reduce' : ''}${live ? ' live' : ''}: toggle`);
  await scrollTo(0);
  await p.waitForTimeout(500);
  const plays = () => p.evaluate(() => window.__plays.splice(0));
  const gtag = () => p.evaluate(() => window.__gtag.splice(0));
  await plays();
  await gtag();
  const file = (rows, re, kind = 'play') => rows.filter((r) => r[0] === kind && re.test(r[1]));
  let s = await btnState();
  flag(!s.on && s.pressed === 'false' && s.mute === 1, `before: is-on ${s.on} aria-pressed ${s.pressed} mute line ${s.mute}`);
  const btn = p.locator('[data-motion="sound-btn"]');
  // Nothing sounds while off: hover a menu card.
  await p.locator('[data-motion="nb-toggle"]').click();
  await p.waitForTimeout(900);
  await p.locator('[data-motion="nb-cards"] a').nth(1).hover();
  await p.waitForTimeout(300);
  flag((await plays()).length === 0, 'off: no sound on a card hover');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(600);
  await plays();

  await btn.click();
  await p.waitForTimeout(600);
  s = await btnState();
  let pl = await plays(), gt = await gtag();
  flag(s.on && s.pressed === 'true' && s.mute === 0, `on: is-on ${s.on} aria-pressed ${s.pressed} mute line ${s.mute} (0.4 s transition)`);
  flag(file(pl, /motion_bg_low_vol/).length === 1, `on: background loop started (${pl.map((r) => r[0] + ' ' + r[1].split('/').pop()).join(', ') || 'nothing'})`);
  flag(gt.length === 1 && gt[0][1] === 'sound_on' && gt[0][2]?.event_category === 'Sound' && gt[0][2]?.event_label === 'Sound On', `on: gtag ${JSON.stringify(gt)}`);
  const bgState = await p.evaluate(() => { const a = [...document.querySelectorAll('audio')]; return a.length; });
  // Hover sounds: menu card 2 → hover_2, card 4 → hover_8 (live mapping); the toggle click → perc_click.
  await p.locator('[data-motion="nb-toggle"]').click();
  await p.waitForTimeout(900);
  pl = await plays();
  flag(file(pl, /perc_click/).length === 1, `toggle click → perc_click (${pl.map((r) => r[1].split('/').pop()).join(', ')})`);
  await p.locator('[data-motion="nb-cards"] a').nth(1).hover();
  await p.waitForTimeout(300);
  pl = await plays();
  flag(file(pl, /hover_2\.mp3/).length === 1, `card 2 hover → hover_2 (${pl.map((r) => r[1].split('/').pop()).join(', ')})`);
  await p.locator('[data-motion="nb-cards"] a').nth(3).hover();
  await p.waitForTimeout(300);
  pl = await plays();
  flag(file(pl, /hover_8\.mp3/).length === 1, `card 4 hover → hover_8 (${pl.map((r) => r[1].split('/').pop()).join(', ')})`);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(600);
  await plays();
  if (!vp.m) {
    // Not real-time hover (the Interactive pin): aim its zone, hover the circle.
    const z = (await zones()).find((x) => x.theme === 'light');
    let y = await aimZone(z.key, (g) => g.top + 10);
    let box = await p.locator('[data-motion="interactive-hover"]').boundingBox();
    // The circle rides the pinned track: scroll on through the pin until it is inside the viewport.
    for (let k = 0; k < 12 && box && box.x + box.width > vp.w; k++) {
      y += 300;
      await scrollTo(y);
      await p.waitForTimeout(600);
      box = await p.locator('[data-motion="interactive-hover"]').boundingBox();
    }
    if (box && box.x + box.width <= vp.w && box.x >= 0) {
      await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await p.waitForTimeout(300);
      pl = await plays();
      // ≥ 1: the scroll steps can move the circle under the pointer once before the explicit move.
      flag(file(pl, /1_NOT_REAL_TIME/).length >= 1, `Not real-time hover → 1_NOT_REAL_TIME (${pl.map((r) => r[1].split('/').pop()).join(', ')})`);
      await p.mouse.move(10, vp.h / 2);
    } else flag(false, `Not real-time circle not in view (${JSON.stringify(box)})`);
    await scrollTo(0);
    await p.waitForTimeout(500);
  }
  await plays();
  await btn.click();
  await p.waitForTimeout(600);
  s = await btnState();
  pl = await plays();
  gt = await gtag();
  flag(!s.on && s.pressed === 'false' && s.mute === 1, `off again: is-on ${s.on} aria-pressed ${s.pressed} mute line ${s.mute}`);
  flag(file(pl, /motion_bg_low_vol/, 'pause').length === 1, `off again: background paused (${pl.map((r) => r[0] + ' ' + r[1].split('/').pop()).join(', ') || 'nothing'})`);
  flag(gt.length === 1 && gt[0][1] === 'sound_off' && gt[0][2]?.event_label === 'Sound Off', `off again: gtag ${JSON.stringify(gt)}`);
  const legacy = await p.evaluate(() => document.querySelectorAll('audio').length);
  console.log(`  (legacy <audio> elements on the page: ${legacy}, bg state check ${bgState})`);
}

await p.screenshot({ path: `${out}/sound-run-${only}${reduce ? '-reduce' : ''}${live ? '-live' : ''}.png` });
if (logs.length) console.log(logs.join('\n'));
console.log(`${flags} flags, ${logs.length} page errors`);
await b.close();
process.exit(flags || logs.length ? 1 : 0);
