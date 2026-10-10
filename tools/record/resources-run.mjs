// Runs initResources() on the published staging page (local src/motion.js injected, as lessons-run does) and checks it
// against the model of the live block E (docs/sections/resources.md «Лайв-заміри»): pin length, the three phases at
// fixed points of the pin (shutters x, track x, lists yPercent), the tab under the tabs bar, the clouds (≥992), and
// on 1440 the hover stack (rotation cycle, z-index, three images max, list switch, revisit) against the rules.
// Live numbers (s21 probe): total 4684 / 2944 / 2121, shift 1570 / 898 / 457, arrows end 0.84·vw (≤479 0.78·vw).
// Usage: node resources-run.mjs <project-root> <out-dir> [1440|768|600|375] [--live]
// --live: the staging page exactly as published (snippets already in Webflow), nothing injected.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const live = args.includes('--live');
const [root, out, only = '1440'] = args.filter((a) => !a.startsWith('--'));
mkdirSync(out, { recursive: true });
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const VPS = { 1440: { w: 1440, h: 900, m: false }, 768: { w: 768, h: 1024, m: true }, 600: { w: 600, h: 900, m: true }, 375: { w: 375, h: 812, m: true } };
const LIVE = { 1440: { total: 4684, shift: 1570 }, 768: { total: 2944, shift: 898 }, 375: { total: 2121, shift: 457 } };
const vp = VPS[only];
const src = (f) => readFileSync(`${root}/src/${f}`, 'utf8');
let flags = 0;
const flag = (ok, line) => { if (!ok) flags++; console.log(`${ok ? '✓' : '✗'} ${line}`); };

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, ...(vp.m ? { userAgent: UA } : {}) });
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

// A native jump first (Lenis syncs to it), then wheel / scrollBy passes, as lessons-run.
const scrollTo = async (target, tol = 4) => {
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

const state = () => p.evaluate(() => {
  const sec = document.querySelector('[data-motion="resources"]');
  const pin = sec.querySelector('[data-motion="res-pin"]');
  const tx = (e) => new DOMMatrix(getComputedStyle(e).transform);
  const lists = sec.querySelector('[data-motion="res-lists"]');
  const tabs = [...sec.querySelectorAll('[data-motion="res-tab"]')];
  return {
    y: scrollY, pinTop: +pin.getBoundingClientRect().top.toFixed(1),
    spacer: pin.parentElement.classList.contains('pin-spacer') ? pin.parentElement.getBoundingClientRect().height : 0,
    secTop: sec.getBoundingClientRect().top + scrollY,
    shutters: [...sec.querySelectorAll('[data-motion="res-shutter"]')].map((e) => +tx(e).m41.toFixed(1)),
    track: +tx(sec.querySelector('[data-motion="res-track"]')).m41.toFixed(1),
    trackW: sec.querySelector('[data-motion="res-track"]').offsetWidth,
    listsY: +tx(lists).m42.toFixed(1), listsH: lists.getBoundingClientRect().height,
    tab: tabs.findIndex((t) => t.classList.contains('is-active')),
    counts: tabs.map((t) => t.querySelector('[data-motion="res-count"]')?.textContent),
    clouds: [...sec.querySelectorAll('[data-motion="res-cloud"]')].map((e) => +tx(e).m42.toFixed(1)),
    rem: parseFloat(getComputedStyle(document.documentElement).fontSize),
    // Offset of list 2 inside the lists block (both carry the same transform).
    list2Off: (sec.querySelectorAll('[data-motion="res-list"]')[1]?.getBoundingClientRect().top ?? 0) - lists.getBoundingClientRect().top,
  };
});

// Model of the live timeline.
const s0 = await state();
const vw = vp.w;
const shift = s0.trackW - vw, listsH = s0.listsH, total = 1.5 * vw + shift + listsH;
const pA = Math.trunc((1.5 * vw / total) * 100), pT = Math.trunc((shift / total) * 100), pL = Math.trunc((2 * listsH / total) * 100);
const T = 1.5 * pA + pT + pL;
const arrowEnd = (vw <= 479 ? 0.78 : 0.84) * vw;
const clamp = (v) => Math.min(1, Math.max(0, v));
const model = (f) => {
  const t = f * T;
  return {
    shutters: [0, 1, 2].map((i) => clamp((t - (i * pA) / 4) / pA) * arrowEnd),
    track: -clamp((t - 1.5 * pA) / pT) * shift,
    listsY: -clamp((t - 1.5 * pA - pT) / pL) * listsH,
  };
};
console.log(`== ${only}: total ${total.toFixed(0)} (pA ${pA} pT ${pT} pL ${pL}, T ${T}), shift ${shift}, lists ${listsH.toFixed(1)}, counts ${s0.counts}`);
const L = LIVE[only];
if (L) flag(Math.abs(total - L.total) <= 2 && Math.abs(shift - L.shift) <= 1, `pin vs live: total ${total.toFixed(0)} / ${L.total}, shift ${shift} / ${L.shift}`);
flag(s0.counts.join() === '10,4', `counters ${s0.counts}`);

// Clouds (before the pin): IX2 0 → 40 % from pin top at 1.2·vh, ≥992 only.
const pinStart = s0.secTop; // section top = spacer top
if (vw >= 992) {
  for (const f of [0.5, 1]) {
    const y = Math.round(pinStart - 1.2 * vp.h + f * 0.4 * (2.2 * vp.h));
    await scrollTo(y);
    await p.waitForTimeout(2000);
    const s = await state();
    const want = [1.2, 1, 2].map((v) => v * s.rem * f);
    const d = Math.max(...s.clouds.map((c, i) => Math.abs(c - want[i])));
    flag(d <= 1.5, `clouds at ${f * 40}% IX2: [${s.clouds}] want [${want.map((v) => v.toFixed(1))}] Δ${d.toFixed(1)}`);
  }
} else {
  await scrollTo(pinStart - 200);
  await p.waitForTimeout(1000);
  const s = await state();
  flag(s.clouds.every((c) => c === 0), `clouds stand on ≤991: [${s.clouds}]`);
}

// Pin phases.
const pinLen = s0.spacer ? s0.spacer - vp.h : NaN;
flag(Math.abs(pinLen - total) <= 2, `pin spacer: ${pinLen.toFixed(0)} vs model ${total.toFixed(0)}`);
// Tab: live switches when the bar bottom crosses the top of list 2 (1440: at 82 % of the lists phase).
// The lists start right under the bar, so list 2 reaches it when the lists have moved by its offset in them.
const tabAt = (fr) => {
  const t = fr * T, lists = -clamp((t - 1.5 * pA - pT) / pL) * listsH;
  return s0.list2Off + lists <= 0 ? 1 : 0;
};
const marks = [0.1, 0.25, 1.5 * pA / T, 0.6, (1.5 * pA + pT) / T, 0.8, 0.9, 0.95, 1];
for (const f of marks) {
  await scrollTo(Math.round(pinStart + f * total));
  await p.waitForTimeout(5000); // scrub 3 catches up
  const s = await state();
  const fr = (s.y - pinStart) / total; // the progress actually reached
  const m = model(fr);
  const d = Math.max(...s.shutters.map((x, i) => Math.abs(x - m.shutters[i])), Math.abs(s.track - m.track), Math.abs(s.listsY - m.listsY));
  // Tab: the list under the tabs bottom (lists start right under the bar, 1rem / .4 / .8 gap between them).
  // Near the switch the scrubbed lists may sit a hair off: accept either tab within 3 px of the edge.
  const edge = Math.abs(s0.list2Off + m.listsY) <= 3;
  const ok = d <= 2 && Math.abs(s.pinTop) <= 1 && (edge || s.tab === tabAt(fr));
  flag(ok, `f ${fr.toFixed(3)}: shutters [${s.shutters}] track ${s.track} lists ${s.listsY} tab ${s.tab} (want ${tabAt(fr)}) pinTop ${s.pinTop} | model [${m.shutters.map((v) => v.toFixed(1))}] ${m.track.toFixed(1)} ${m.listsY.toFixed(1)} Δ${d.toFixed(1)}`);
  await p.screenshot({ path: `${out}/resources-run-${only}-${Math.round(fr * 1000)}.png` });
}
// Tab switch: live switches at 82 % of the lists phase on 1440 — check the active tab against the geometry.
const tabCheck = await p.evaluate(() => {
  const sec = document.querySelector('[data-motion="resources"]');
  const bar = sec.querySelector('[data-motion="res-tab"]').parentElement.getBoundingClientRect().bottom;
  const lists = [...sec.querySelectorAll('[data-motion="res-list"]')].map((l) => l.getBoundingClientRect());
  const under = lists.findIndex((r) => bar >= r.top && bar < r.bottom);
  const tab = [...sec.querySelectorAll('[data-motion="res-tab"]')].findIndex((t) => t.classList.contains('is-active'));
  return { under, tab };
});
flag(tabCheck.under === -1 || tabCheck.under === tabCheck.tab, `tab at the end: active ${tabCheck.tab}, list under the bar ${tabCheck.under}`);

// Hover stack (desktop): park in the lists phase and fire pointerenter on rows.
if (!vp.m) {
  await scrollTo(Math.round(pinStart + ((1.5 * pA + pT) / T) * total + 10));
  await p.waitForTimeout(5000);
  const seq = [[0, 2], [0, 4], [0, 6], [0, 4], [1, 0], [1, 2], [0, 0]];
  // Expected after each step: [rotation of the hovered image, stack size, hovered z].
  const want = [[-3, 2], [-6, 3], [0, 3], [-6, 3], [0, 1], [-3, 2], [0, 1]];
  for (const [i, [li, ri]] of seq.entries()) {
    const s = await p.evaluate(([li, ri]) => {
      const sec = document.querySelector('[data-motion="resources"]');
      const lists = [...sec.querySelectorAll('[data-motion="res-list"]')];
      const row = lists[li].querySelectorAll('[data-motion="res-item"]')[ri];
      row.dispatchEvent(new PointerEvent('pointerenter'));
      const imgs = [...sec.querySelectorAll('[data-motion="res-stack"] [data-motion="res-image"]')];
      const host = new URL(row.querySelector('a').href).hostname.replace(/^www\./, '').split('.')[0];
      const own = imgs.find((im) => decodeURIComponent(im.src).includes(host));
      const rot = (e) => Math.round((Math.atan2(new DOMMatrix(getComputedStyle(e).transform).b, new DOMMatrix(getComputedStyle(e).transform).a) * 180) / Math.PI);
      const act = imgs.filter((im) => im.classList.contains('is-active'));
      return {
        own: !!own, rot: own ? rot(own) : null, z: own ? +own.style.zIndex : null, active: act.length,
        top: act.sort((a, b) => +b.style.zIndex - +a.style.zIndex)[0] === own,
        names: [...sec.querySelectorAll('[data-motion="res-name"].is-active')].length,
      };
    }, [li, ri]);
    const [r, n] = want[i];
    flag(s.own && s.rot === r && s.active === n && s.top && s.names === 1,
      `hover list ${li + 1} row ${ri + 1}: rotation ${s.rot} (want ${r}), stack ${s.active} (want ${n}), on top ${s.top}, z ${s.z}, active names ${s.names}`);
  }
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${out}/resources-run-${only}-hover.png` });
}
if (logs.length) console.log(logs.join('\n'));
flag(!logs.length, `page errors: ${logs.length}`);
await b.close();
console.log('flags:', flags);
