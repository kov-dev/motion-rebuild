// Runs src/motion.js initHero() on the staging Hero with the Intro fixture injected after it (read-only).
// Usage: node hero-exit-run.mjs <project-root> <out-dir>
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const [root, out] = process.argv.slice(2);
const fixture = readFileSync(`${root}/tools/record/fixtures/intro.html`, 'utf8');
const css = fixture.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/html \{[^}]*\}/g, '').replace(/body \{[^}]*\}/, '');
const section = fixture.match(/<section[\s\S]*<\/section>/)[0]
  .replace('<!--#path-desktop-->', readFileSync(`${root}/src/intro/path-desktop.html`, 'utf8'));
const js = readFileSync(`${root}/src/motion.js`, 'utf8');

const b = await chromium.launch({ channel: 'chrome' });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const logs = []; p.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
await p.route('**/legacy-guard.js', (r) => r.fulfill({ contentType: 'text/javascript', body: readFileSync(`${root}/src/legacy-guard.js`, 'utf8') })); // motion.js imports it relatively
await p.goto('https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/', { waitUntil: 'load', timeout: 90000 });
await p.evaluate(({ css, section }) => {
  // Old loader/preloader overlays off; new Intro right after the new Hero, as in the copy.
  const st = document.createElement('style');
  st.textContent = css + '.loader,.section-preloader,.navigation,.fixed-bottom{display:none!important}';
  document.head.append(st);
  document.querySelector('.section-hero').insertAdjacentHTML('afterend', section);
}, { css, section });
await p.addScriptTag({ type: 'module', content: js });
await p.waitForTimeout(1500);

const state = () => p.evaluate(() => {
  const sx = (e) => new DOMMatrix(getComputedStyle(e).transform).a.toFixed(2);
  const [l, r] = document.querySelectorAll('[data-motion="hero-divider"]');
  const ring = document.querySelector('[data-motion="hero-ball-border"]');
  return `scroll ${Math.round(scrollY)} | lines ${sx(l)}/${sx(r)} | ring ${sx(ring)}`;
});
// Trigger point: Intro top − axis height at the viewport centre.
const point = await p.evaluate(() => {
  const intro = document.querySelector('[data-motion="intro"]').getBoundingClientRect().top + scrollY;
  return Math.round(intro - document.querySelector('[data-motion="hero-ball-wrap"]').offsetHeight - innerHeight / 2);
});
const res = [`trigger point ≈ ${point}px`];
for (const [y, t] of [[0, 0], [point - 50, 2000], [point + 50, 400], [point + 50, 1400], [point + 400, 1500], [point - 200, 600], [point - 200, 1500]]) {
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await p.waitForTimeout(t);
  res.push(`${await state()} (after ${t} ms)`);
  if (y === point + 400) await p.screenshot({ path: `${out}/hero-exit-collapsed.png` });
}
console.log(res.join('\n'));
console.log(logs.slice(0, 10).join('\n') || 'no page errors');
await b.close();
