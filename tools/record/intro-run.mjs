// Runs src/motion.js (initHero + initIntro) on the staging page with the Intro fixture in place of the published
// section-intro; the old script.v33 / Lenis / old GSAP are blocked so only the new module drives the page.
// Measures the Hero ball against the SVG path, the pill texts, the hand-over and the clouds at timeline
// progress points, and takes the same frames on the live site for a side-by-side check.
// Usage: node intro-run.mjs <project-root> <out-dir> [1440|768|375 ...]
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const [root, out, ...only] = process.argv.slice(2);
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const LIVE = 'https://motion.zajno.com/';

const fixture = readFileSync(`${root}/tools/record/fixtures/intro.html`, 'utf8');
const css = fixture.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/html \{[^}]*\}/g, '').replace(/body \{[^}]*\}/, '');
let section = fixture.match(/<section[\s\S]*<\/section>/)[0];
for (const bp of ['desktop', 'tablet', 'mobile']) section = section.replace(`<!--#path-${bp}-->`, readFileSync(`${root}/src/intro/path-${bp}.html`, 'utf8'));
readFileSync(`${root}/src/intro/ui-videos.html`, 'utf8').match(/<video[\s\S]*?<\/video>/g)
  .forEach((v, i) => { section = section.replace(`<!--#video-${i + 1}-->`, v); });
const js = readFileSync(`${root}/src/motion.js`, 'utf8');

const vps = [{ n: '1440', w: 1440, h: 900 }, { n: '768', w: 768, h: 1024, m: true }, { n: '375', w: 375, h: 812, m: true }]
  .filter((v) => !only.length || only.includes(v.n));
// Timeline progress points: start, each text mark, mid-segments, path end, landing, past the end.
const PROGRESS = [0, 0.03, 0.06, 0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 0.9, 0.95, 1];
const OLD = /script\.v33|lenis|cdnjs\.cloudflare\.com\/ajax\/libs\/gsap|ifvisible|splide|matter|autovideo/;

const b = await chromium.launch({ channel: 'chrome' });
for (const vp of vps) {
  const opts = { viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.m, hasTouch: !!vp.m };

  /* ---- new: staging + fixture + motion.js ---- */
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  const logs = []; p.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
  p.on('console', (m) => m.type() === 'error' && !/ERR_FAILED/.test(m.text()) && logs.push('console: ' + m.text()));
  await p.route('**/*', (r) => (OLD.test(r.request().url()) ? r.abort() : r.continue()));
  await p.goto(STAGING, { waitUntil: 'load', timeout: 90000 });
  await p.evaluate(({ css, section }) => {
    const st = document.createElement('style');
    st.textContent = css + '.loader,.section-preloader,.navigation,.fixed-bottom{display:none!important}';
    document.head.append(st);
    document.querySelector('.section-intro').outerHTML = section;
  }, { css, section });
  await p.evaluate(() => document.fonts.ready);
  await p.addScriptTag({ type: 'module', content: js });
  await p.waitForTimeout(2000);

  const range = await p.evaluate(() => {
    const scene = document.querySelector('[data-motion="intro"]').getBoundingClientRect();
    const block = document.querySelector('[data-motion="ui"]').getBoundingClientRect();
    return { start: Math.round(scene.top + scrollY - innerHeight / 2), end: Math.round(block.top + scrollY) };
  });
  const rows = [`== ${vp.n} new: tl scroll ${range.start} → ${range.end}`];
  for (const pr of PROGRESS) {
    const y = Math.round(range.start + pr * (range.end - range.start));
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(1600); // scrub: 1 settles
    rows.push(`p ${pr.toFixed(2)} y ${y} | ` + await p.evaluate(() => {
      const ball = document.querySelector('[data-motion="hero-ball"]');
      const r = ball.getBoundingClientRect();
      const c = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      const bp = innerWidth >= 992 ? 'desktop' : innerWidth >= 480 ? 'tablet' : 'mobile';
      const path = document.querySelector(`[data-motion="intro-path"][data-bp="${bp}"]`);
      const m = path.getScreenCTM(), L = path.getTotalLength();
      let best = 1e9, at = 0;
      for (let i = 0; i <= 2000; i++) {
        const q = path.getPointAtLength((L * i) / 2000);
        const d = Math.hypot(m.a * q.x + m.c * q.y + m.e - c.x, m.b * q.x + m.d * q.y + m.f - c.y);
        if (d < best) { best = d; at = i / 2000; }
      }
      const texts = [...document.querySelectorAll('[data-motion="intro-text"]')]
        .map((t) => Math.round(new DOMMatrix(getComputedStyle(t).transform).f / t.offsetHeight * 100)).join('/');
      const land = document.querySelector('[data-motion="ui-landing"]');
      const lr = land.parentElement.getBoundingClientRect();
      const clouds = [...document.querySelectorAll('[data-motion="intro-cloud"]')]
        .map((e) => (new DOMMatrix(getComputedStyle(e).transform).f / parseFloat(getComputedStyle(document.documentElement).fontSize)).toFixed(2)).join('/');
      return `ball ${Math.round(c.x)},${Math.round(c.y)} ${getComputedStyle(ball).visibility} | path Δ${best.toFixed(1)} @${at.toFixed(3)} | `
        + `panel ${Math.round(lr.left + lr.width / 2)},${Math.round(lr.top + lr.height / 2)} op ${getComputedStyle(land).opacity} | texts ${texts} | clouds rem ${clouds}`;
    }));
    await p.screenshot({ path: `${out}/intro-${vp.n}-p${String(Math.round(pr * 100)).padStart(3, '0')}-new.png` });
  }
  // Back to the top: texts close, the ball returns to the Hero axis.
  await p.evaluate((y) => scrollTo(0, y), range.start - 200);
  await p.waitForTimeout(2000);
  rows.push('back: ' + await p.evaluate(() => {
    const ball = document.querySelector('[data-motion="hero-ball"]');
    const axis = document.querySelector('[data-motion="hero-ball-wrap"]').getBoundingClientRect();
    const r = ball.getBoundingClientRect();
    return `ball Δaxis ${Math.round(r.top + r.height / 2 - (axis.top + axis.height / 2))} vis ${getComputedStyle(ball).visibility} | texts `
      + [...document.querySelectorAll('[data-motion="intro-text"]')].map((t) => new DOMMatrix(getComputedStyle(t).transform).f.toFixed(0)).join('/');
  }));
  rows.push(logs.slice(0, 8).join('\n') || 'no page errors');
  console.log(rows.join('\n'));
  await ctx.close();

  /* ---- live: same progress points of its intro timeline ---- */
  const lctx = await b.newContext(opts);
  const lp = await lctx.newPage();
  await lp.goto(LIVE, { waitUntil: 'load', timeout: 90000 });
  await lp.waitForTimeout(11000); // preloader
  await lp.addStyleTag({ content: '.navigation,.fixed-bottom{display:none!important}' });
  const lr = await lp.evaluate(() => {
    const w = document.querySelector('.intro-wrap').getBoundingClientRect();
    const ui = document.querySelector('.ui.first').getBoundingClientRect();
    return { start: Math.round(w.top + scrollY - innerHeight / 2), end: Math.round(ui.top + scrollY) };
  });
  const lrows = [`== ${vp.n} live: tl scroll ${lr.start} → ${lr.end}`];
  for (const pr of PROGRESS) {
    const y = Math.round(lr.start + pr * (lr.end - lr.start));
    await lp.evaluate((y) => scrollTo(0, y), y);
    await lp.waitForTimeout(2600); // Lenis + scrub
    lrows.push(`p ${pr.toFixed(2)} | ` + await lp.evaluate(() => {
      const r = document.querySelector('#anim-ball').getBoundingClientRect();
      const texts = ['also', 'controls', 'your', 'attention'].map((k) => document.querySelector(`.is-${k} .anim-text`))
        .map((t) => Math.round(new DOMMatrix(getComputedStyle(t).transform).f / t.offsetHeight * 100)).join('/');
      const clouds = ['first', 'second', 'third'].map((k) => document.querySelector(`.bg-list-item.is-${k}`))
        .map((e) => (new DOMMatrix(getComputedStyle(e).transform).f / parseFloat(getComputedStyle(document.documentElement).fontSize)).toFixed(2)).join('/');
      return `scrollY ${Math.round(scrollY)} ball ${Math.round(r.left + r.width / 2)},${Math.round(r.top + r.height / 2)} | texts ${texts} | clouds rem ${clouds}`;
    }));
    await lp.screenshot({ path: `${out}/intro-${vp.n}-p${String(Math.round(pr * 100)).padStart(3, '0')}-live.png` });
  }
  console.log(lrows.join('\n'));
  await lctx.close();
}
await b.close();
