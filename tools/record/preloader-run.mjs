// Runs src/motion.js + src/preloader.css against the staging preloader markup (injected, read-only).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const [css, js, out] = [readFileSync(process.argv[2], 'utf8'), readFileSync(process.argv[3], 'utf8'), process.argv[4]];
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 750 } });
const p = await ctx.newPage();
const logs = []; p.on('console', (m) => logs.push(m.type() + ': ' + m.text())); p.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
// inject the head gate exactly as it will sit in Webflow page <head>
await p.route('**/*', async (route) => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const res = await route.fetch();
  const body = (await res.text()).replace('<head>', `<head><script>document.documentElement.classList.add('is-preloading')</script><style>${css}\n.loader{display:none!important}</style>`);
  route.fulfill({ response: res, body });
});
await p.route('**/legacy-guard.js', (r) => r.fulfill({ contentType: 'text/javascript', body: readFileSync(process.argv[3].replace(/motion\.js$/, 'legacy-guard.js'), 'utf8') })); // motion.js imports it relatively
await p.goto('https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/', { waitUntil: 'domcontentloaded' });
const t0 = Date.now();
await p.addScriptTag({ type: 'module', content: js });
for (const t of [1.0, 4.6, 5.6, 6.4, 7.3, 8.1, 8.6, 10.2]) {
  await p.waitForTimeout(Math.max(0, t * 1000 - (Date.now() - t0)));
  await p.screenshot({ path: `${out}/run-${String(t).padEnd(4, '0')}.png` });
}
console.log('html class after:', await p.evaluate(() => document.documentElement.className));
console.log(logs.filter((l) => !l.includes('Failed to load resource')).slice(0, 15).join('\n'));
await b.close();
