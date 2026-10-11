// Records staging with the local src/motion.js (jsDelivr module routed to disk), steady wheel scroll.
// Usage: node local-rec.mjs <out> <fromY> <toY> [step=60] [w=1440] [h=750]
import { chromium } from 'playwright';
import fs from 'fs';
const [,, out, from, to, step = '60', w = '1440', h = '750'] = process.argv;
const SRC = '/Users/mac/Claude/Projects/Motion/src';
fs.mkdirSync(out, { recursive: true });
const vp = { width: +w, height: +h };
const b = await chromium.launch({ channel: 'chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, recordVideo: { dir: out, size: vp } });
const p = await ctx.newPage();
await p.route(/cdn\.jsdelivr\.net\/gh\/kov-dev\/motion-rebuild@[^/]+\/src\/(.+\.js)/, (r) => {
  const f = r.request().url().match(/\/src\/(.+\.js)/)[1];
  r.fulfill({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(`${SRC}/${f}`, 'utf8') });
});
const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
await p.goto('https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/', { waitUntil: 'load', timeout: 90000 });
await p.mouse.move(700, 400);
await p.waitForTimeout(9000);
await p.evaluate((y) => scrollTo(0, y), +from);
await p.waitForTimeout(2500);
const t0 = Date.now(); const log = [];
while (true) {
  await p.mouse.wheel(0, +step);
  await p.waitForTimeout(50);
  const y = await p.evaluate(() => scrollY);
  log.push([Date.now() - t0, Math.round(y)]);
  if (y > +to) break;
}
await p.waitForTimeout(2500);
const v = p.video(); await ctx.close(); await b.close();
fs.renameSync(await v.path(), `${out}/run.webm`);
fs.writeFileSync(`${out}/log.json`, JSON.stringify(log));
console.log('errors', errs);
