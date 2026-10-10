// Runs the new code NEXT TO the old one, as it will sit in Webflow during the transition ("variant 2"):
// staging page, old script.v33 / Lenis / GSAP 3.10 NOT blocked, head gate + preloader.css injected into <head>,
// the Intro fixture in place of the stale published section-intro, src/motion.js as a module after the old scripts.
// Checks: the preloader holds the scroll, which gsap ends up global, new sections animate under real wheel input,
// and the old pins below still start where their spacers are.
// Usage: node coexist-run.mjs <project-root> <out-dir> [1440|375] [--published] [--cdn]
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const args = process.argv.slice(2);
const published = args.includes('--published');
const cdn = args.includes('--cdn');
const [root, out, only = '1440'] = args.filter((a) => !a.startsWith('--'));
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const fixture = readFileSync(`${root}/tools/record/fixtures/intro.html`, 'utf8');
const fixtureCss = fixture.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/html \{[^}]*\}/g, '').replace(/body \{[^}]*\}/, '');
let section = fixture.match(/<section[\s\S]*<\/section>/)[0];
for (const bp of ['desktop', 'tablet', 'mobile']) section = section.replace(`<!--#path-${bp}-->`, readFileSync(`${root}/src/intro/path-${bp}.html`, 'utf8'));
readFileSync(`${root}/src/intro/ui-videos.html`, 'utf8').match(/<video[\s\S]*?<\/video>/g)
  .forEach((v, i) => { section = section.replace(`<!--#video-${i + 1}-->`, v); });
const gate = readFileSync(`${root}/src/preloader-gate.js`, 'utf8');
const css = readFileSync(`${root}/src/preloader.css`, 'utf8');
const js = readFileSync(`${root}/src/motion.js`, 'utf8');

const vp = only === '375'
  ? { w: 375, h: 812, isMobile: true, hasTouch: true, userAgent: UA }
  : { w: 1440, h: 900 };

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, ...(vp.userAgent ? { userAgent: vp.userAgent } : {}) });
const p = await ctx.newPage();
const logs = [];
p.on('pageerror', (e) => logs.push('pageerror: ' + e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 4).join(' | ')));
p.on('console', (m) => m.type() === 'error' && !/ERR_FAILED|Splide|twitter|status of 4/.test(m.text()) && logs.push('console: ' + m.text()));

await p.route('**/*', async (route) => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const res = await route.fetch();
  let html = await res.text();
  html = html.replace('<head>', cdn
    ? `<head>${readFileSync(`${root}/src/webflow/home-head.html`, 'utf8')}${published ? '' : `<style>${fixtureCss}</style>`}`
    : `<head><script>${gate}</script><style>${css}\n${published ? '' : fixtureCss}</style>`);
  // --published: the staging Intro already carries every data-motion role (published 2026-10-10), no fixture.
  if (!published) html = html.replace(/<section[^>]*class="section-intro[\s\S]*?<\/section>/, section);
  // --cdn: exactly the Webflow page code (src/webflow/home-footer.html, motion.js from jsDelivr).
  html = html.replace('</body>', cdn ? `${readFileSync(`${root}/src/webflow/home-footer.html`, 'utf8')}</body>` : `<script type="module">${js}</script></body>`);
  route.fulfill({ response: res, body: html });
});

const t0 = Date.now();
if (!cdn) await p.route('**/legacy-guard.js', (r) => r.fulfill({ contentType: 'text/javascript', body: readFileSync(`${root}/src/legacy-guard.js`, 'utf8') })); // motion.js imports it relatively
await p.goto(STAGING, { waitUntil: 'domcontentloaded', timeout: 90000 });
const rows = [`== ${only}`];
const done = p.evaluate(() => new Promise((r) => document.addEventListener('motion:preloader-done', () => r(), { once: true })));

// Scroll input while the preloader is up must not move the page.
await p.waitForTimeout(2500);
if (vp.isMobile) {
  // A real touch swipe (scrollBy would be programmatic, which no gate can or should stop).
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Input.synthesizeScrollGesture', { x: 187, y: 600, yDistance: -1500, gestureSourceType: 'touch', speed: 3000 });
} else await p.mouse.wheel(0, 2000);
await p.waitForTimeout(1500);
rows.push(`during preloader: scrollY ${await p.evaluate(() => scrollY)} | is-preloading ${await p.evaluate(() => document.documentElement.classList.contains('is-preloading'))}`);
await p.screenshot({ path: `${out}/coexist-${only}-preloader.png` });

await Promise.race([done, p.waitForTimeout(20000)]);
rows.push(`preloader done at ${((Date.now() - t0) / 1000).toFixed(1)} s, scrollY ${await p.evaluate(() => scrollY)}`);
await p.waitForTimeout(2500);
rows.push('globals: ' + await p.evaluate(() => `window.gsap ${window.gsap?.version} | window.ScrollTrigger ${typeof window.ScrollTrigger} triggers ${window.ScrollTrigger?.getAll().length}`));

// Old pins: where each old trigger starts vs where its spacer actually is now.
const oldPins = () => (window.ScrollTrigger?.getAll() || []).filter((st) => st.pin).map((st) => {
  const sp = st.pin.parentElement;
  const top = Math.round(sp.getBoundingClientRect().top + scrollY);
  return `${(st.pin.className || '').split(' ').slice(0, 2).join('.')} start ${Math.round(st.start)} spacer ${top} Δ${Math.round(st.start - top)}`;
});
rows.push('old pins: ' + (await p.evaluate(oldPins)).join(' ; '));

// Real input through the new sections: hero exit, intro path, ui slider.
const marks = await p.evaluate(() => {
  const top = (s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; };
  return { intro: top('[data-motion="intro"]'), ui: top('[data-motion="ui"]'), oldHero: top('.section.is-hero') };
});
rows.push('marks: ' + JSON.stringify(marks));
const shots = [['hero', 0.5], ['intro-a', 1.0], ['intro-b', 1.6], ['ui', 2.6], ['ui-b', 4.5]];
for (const [name, k] of shots) {
  const target = Math.round(k * vp.h + (name.startsWith('ui') ? marks.ui - 2.6 * vp.h : marks.intro - vp.h));
  for (let i = 0; i < 40; i++) {
    const y = await p.evaluate(() => scrollY);
    if (Math.abs(y - target) < 40) break;
    if (vp.isMobile) await p.evaluate((d) => scrollBy(0, d), Math.sign(target - y) * Math.min(400, Math.abs(target - y)));
    else await p.mouse.wheel(0, Math.sign(target - y) * Math.min(400, Math.abs(target - y)));
    await p.waitForTimeout(150);
  }
  await p.waitForTimeout(1800);
  const st = await p.evaluate(() => {
    const ball = document.querySelector('[data-motion="hero-ball"]');
    const r = ball?.getBoundingClientRect();
    const dot = document.querySelector('[data-motion="ui-ball"]')?.getBoundingClientRect();
    return `scrollY ${Math.round(scrollY)} | hero-ball ${r ? `${Math.round(r.left + r.width / 2)},${Math.round(r.top + r.height / 2)}` : '-'} ${ball && getComputedStyle(ball).visibility} | ui-ball ${dot ? `${Math.round(dot.left)},${Math.round(dot.top)}` : '-'}`;
  });
  rows.push(`${name}: ${st}`);
  await p.screenshot({ path: `${out}/coexist-${only}-${name}.png` });
}

// Old sections below: scroll into the old intro slider and check its pin holds.
if (marks.oldHero) {
  const oldUi = await p.evaluate(() => { const e = document.querySelector('.ui'); const sp = e.parentElement; return Math.round(sp.getBoundingClientRect().top + scrollY); });
  // Real input: the old pins read Lenis' own scroll value through a scrollerProxy.
  for (let i = 0; i < 80; i++) {
    const y = await p.evaluate(() => scrollY);
    const d = oldUi + 600 - y;
    if (Math.abs(d) < 60) break;
    if (vp.isMobile) await p.evaluate((d) => scrollBy(0, d), Math.sign(d) * Math.min(1500, Math.abs(d)));
    else await p.mouse.wheel(0, Math.sign(d) * Math.min(1500, Math.abs(d)));
    await p.waitForTimeout(250);
  }
  await p.waitForTimeout(2500);
  rows.push('scrollY ' + await p.evaluate(() => Math.round(scrollY)) + ' target ' + (oldUi + 600));
  rows.push('old .ui at +600: top ' + await p.evaluate(() => Math.round(document.querySelector('.ui').getBoundingClientRect().top)));
  await p.screenshot({ path: `${out}/coexist-${only}-old-ui.png` });
}
rows.push('old pins after walk: ' + (await p.evaluate(oldPins)).join(' ; '));
rows.push(logs.slice(0, 10).join('\n') || 'no page errors');
console.log(rows.join('\n'));
await b.close();
