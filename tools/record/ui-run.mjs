// Runs src/motion.js (initHero + initIntro + initUi) on the staging page with the Intro fixture in place of the
// published section-intro (old script.v33 / Lenis / old GSAP blocked) and walks the Intro UI slider: both pins at
// the same timeline units as the live site, and the ball hand-over between the blocks. Compares what is on screen
// (panel rects, open/closed clip, video, heading, dots), not the rail transform: on ≤991 our rail is one step
// behind the live one by design (no margin tween), the panels land in the same place.
// Touch bands (768, 375) use a phone UA on both sides, so the live site takes its touch path (pin ×3).
// Usage: node ui-run.mjs <project-root> <out-dir> [1440|768|375 ...]
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const [root, out, ...only] = process.argv.slice(2);
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const LIVE = 'https://motion.zajno.com/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const fixture = readFileSync(`${root}/tools/record/fixtures/intro.html`, 'utf8');
const css = fixture.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/html \{[^}]*\}/g, '').replace(/body \{[^}]*\}/, '');
let section = fixture.match(/<section[\s\S]*<\/section>/)[0];
for (const bp of ['desktop', 'tablet', 'mobile']) section = section.replace(`<!--#path-${bp}-->`, readFileSync(`${root}/src/intro/path-${bp}.html`, 'utf8'));
readFileSync(`${root}/src/intro/ui-videos.html`, 'utf8').match(/<video[\s\S]*?<\/video>/g)
  .forEach((v, i) => { section = section.replace(`<!--#video-${i + 1}-->`, v); });
const js = readFileSync(`${root}/src/motion.js`, 'utf8');

const vps = [{ n: '1440', w: 1440, h: 900 }, { n: '768', w: 768, h: 1024, m: true }, { n: '375', w: 375, h: 812, m: true }]
  .filter((v) => !only.length || only.includes(v.n));
const OLD = /script\.v33|lenis|cdnjs\.cloudflare\.com\/ajax\/libs\/gsap|ifvisible|splide|matter|autovideo/;

// Points: [block, unit] inside a pin (unit of the 32/30-unit timeline) or ['ho', progress] in the hand-over.
const points = (D) => [
  ...[0, 2, 4, 5, 6, 8, 10, 12, 13, 14, 16, 18, 20, 21, 22, 24, 26, 27, 28, 30, 32].filter((u) => u <= D).map((u) => [0, u]),
  ...[0.1, 0.3, 0.39, 0.5, 0.7, 0.9, 0.99].map((p) => ['ho', p]),
  ...[1, 4, 5, 8, 14, 22, 26, D].map((u) => [1, u]),
];

// Both pages are measured with the same function; `s` maps roles to selectors.
function measure(s) {
  const vw = innerWidth, vh = innerHeight;
  const f = (v, d = 3) => (+v).toFixed(d);
  const ctr = (el) => { const r = el.getBoundingClientRect(); return `${Math.round(r.left + r.width / 2)},${Math.round(r.top + r.height / 2)}`; };
  const blocks = [...document.querySelectorAll(s.block)];
  const parts = blocks.map((b, j) => {
    const br = b.getBoundingClientRect();
    if (br.bottom <= 0 || br.top >= vh) return `B${j} off`;
    const panels = [...b.querySelectorAll(s.panel)].map((p) => {
      const r = p.getBoundingClientRect();
      const rad = (getComputedStyle(p).clipPath.match(/circle\(([\d.]+)px/) || [])[1];
      const v = p.querySelector('video');
      const open = rad > 50 ? 'O' : rad > 10 ? '~' : '.';
      return `${f(r.left / vw, 2)}+${f(r.width / vw, 2)}${open}${v ? `v${f(getComputedStyle(v).opacity, 1)}${v.paused ? 'p' : '>'}` : ''}`;
    }).join(' ');
    const h = b.querySelector(s.heading);
    const hr = h.getBoundingClientRect();
    const clip = getComputedStyle(h).clipPath.replace(/polygon|\s|px|%/g, '').slice(0, 24);
    const track = getComputedStyle(b.querySelector(s.track)).opacity;
    const land = b.querySelector(s.landing);
    return `B${j} top ${Math.round(br.top)} track op ${track} | head ${f(hr.left / vw, 2)},${Math.round(hr.top)} clip ${clip} | ${panels} | land op ${getComputedStyle(land).opacity}`;
  });
  const dot = document.querySelector(s.dot);
  const ball = document.querySelector(s.ball);
  const bs = getComputedStyle(ball);
  return `${parts.join(' || ')} || dot ${ctr(dot)} op ${getComputedStyle(dot).opacity} || hero ${ctr(ball)} ${bs.display === 'none' || bs.visibility === 'hidden' ? 'hidden' : 'shown'}`;
}
const SEL_NEW = { block: '[data-motion="ui"]', panel: '[data-motion="ui-slide"]', heading: '[data-motion="ui-text"]', track: '[data-motion="ui-track"]',
  landing: '[data-motion="ui-slide"] > div', dot: '[data-motion="ui-ball"]', ball: '[data-motion="hero-ball"]' };
const SEL_LIVE = { block: '.ui', panel: '.ui-slide', heading: '.ui-text', track: '.ui-track', landing: '.section-slide-wrap', dot: '.ui-ball', ball: '#anim-ball' };

// Pin and hand-over ranges in scroll px: block i pins at the top of its spacer for `len` px.
function ranges(sel) {
  const bl = [...document.querySelectorAll(sel)].map((b) => {
    const sp = b.parentElement.classList.contains('pin-spacer') ? b.parentElement : b;
    const top = Math.round(sp.getBoundingClientRect().top + scrollY);
    return { top, len: Math.round(sp.offsetHeight - b.offsetHeight) };
  });
  return { b: bl, ho: [bl[0].top + bl[0].len, bl[1].top] };
}

async function walk(p, sel, D, wait, tag, vp) {
  const r = await p.evaluate(ranges, sel.block);
  const rows = [`== ${vp.n} ${tag}: pins ${r.b.map((b) => `${b.top}+${b.len}`).join(', ')} | hand-over ${r.ho.join('→')}`];
  for (const [b, u] of points(D)) {
    const y = b === 'ho' ? Math.round(r.ho[0] + u * (r.ho[1] - r.ho[0])) : Math.round(r.b[b].top + (u / D) * r.b[b].len);
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(wait);
    const label = b === 'ho' ? `ho ${u.toFixed(2)}` : `b${b} u${String(u).padStart(2, '0')}`;
    rows.push(`${label} | ${await p.evaluate(measure, sel)}`);
    if ([4, 5, 13, 21, 28].includes(u) || (b === 'ho' && [0.39, 0.7].includes(u)))
      await p.screenshot({ path: `${out}/ui-${vp.n}-${label.replace(' ', '')}-${tag}.png` });
  }
  return { rows, r };
}

const b = await chromium.launch({ channel: 'chrome' });
for (const vp of vps) {
  const opts = { viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.m, hasTouch: !!vp.m, ...(vp.m ? { userAgent: UA } : {}) };
  const D = vp.m ? 30 : 32;

  /* ---- new ---- */
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  const logs = []; p.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
  p.on('console', (m) => m.type() === 'error' && !/ERR_FAILED|Splide/.test(m.text()) && logs.push('console: ' + m.text()));
  await p.route('**/*', (r) => (OLD.test(r.request().url()) ? r.abort() : r.continue()));
  await p.route('**/legacy-guard.js', (r) => r.fulfill({ contentType: 'text/javascript', body: readFileSync(`${root}/src/legacy-guard.js`, 'utf8') })); // motion.js imports it relatively
  await p.goto(STAGING, { waitUntil: 'load', timeout: 90000 });
  await p.evaluate(({ css, section }) => {
    const st = document.createElement('style');
    st.textContent = css + '.loader,.section-preloader,.navigation,.fixed-bottom{display:none!important}';
    document.head.append(st);
    document.querySelector('.section-intro').outerHTML = section;
  }, { css, section });
  await p.evaluate(() => document.fonts.ready);
  await p.addScriptTag({ type: 'module', content: js });
  await p.waitForTimeout(2500);
  const env = await p.evaluate(() => `coarse ${matchMedia('(hover: none) and (pointer: coarse)').matches}`);
  const { rows, r } = await walk(p, SEL_NEW, D, 1300, 'new', vp);
  rows.splice(1, 0, env);
  // Back to the intro end: the Hero ball must be shown again, the slider closed.
  await p.evaluate((y) => scrollTo(0, y), r.b[0].top - 300);
  await p.waitForTimeout(2000);
  rows.push('back | ' + await p.evaluate(measure, SEL_NEW));
  // Idle sway: no input for 4 s while the slider is on screen.
  await p.evaluate((y) => scrollTo(0, y), Math.round(r.b[0].top + r.b[0].len * 6 / D));
  await p.waitForTimeout(5500);
  const sway = await p.evaluate(() => [...document.querySelectorAll('[data-motion="ui-slide"]')].slice(0, 2).map((e) => e.style.transform).join(' / '));
  await p.mouse.move(10, 10); await p.mouse.move(20, 20);
  await p.waitForTimeout(300);
  const still = await p.evaluate(() => document.querySelector('[data-motion="ui-slide"]').style.transform);
  rows.push(`idle 5.5 s: ${sway} | after input: ${still}`);
  rows.push(logs.slice(0, 8).join('\n') || 'no page errors');
  console.log(rows.join('\n'));
  await ctx.close();

  /* ---- live ---- */
  const lctx = await b.newContext(opts);
  const lp = await lctx.newPage();
  await lp.goto(LIVE, { waitUntil: 'load', timeout: 90000 });
  await lp.waitForTimeout(11000); // preloader
  await lp.addStyleTag({ content: '.navigation,.fixed-bottom{display:none!important}' });
  const live = await walk(lp, SEL_LIVE, D, 2600, 'live', vp);
  console.log(live.rows.join('\n'));
  await lctx.close();
}
await b.close();
