// Records the nav menu: open, hover each Lottie link, horizontal wheel on the track, close.
import { chromium } from 'playwright';
import fs from 'fs';
const out = 'out/menu'; fs.mkdirSync(out, { recursive: true });
const vp = { width: 1440, height: 900 };
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: vp, recordVideo: { dir: out, size: vp } });
const p = await ctx.newPage();
const t0 = Date.now(); const T = () => +((Date.now() - t0) / 1000).toFixed(2); const log = [];
await p.goto('https://motion.zajno.com/', { waitUntil: 'load', timeout: 90000 });
await p.waitForTimeout(7000); log.push({ t: T(), id: 'ready' });
await p.click('#menu-toggle'); log.push({ t: T(), id: 'menu-open' });
await p.waitForTimeout(2000);
const cards = await p.$$('.nav-menu .lottie-card');
log.push({ t: T(), id: `cards:${cards.length}` });
for (const [i, c] of cards.entries()) {
  if (!(await c.isVisible())) { await p.mouse.move(vp.width / 2, vp.height / 2); await p.mouse.wheel(0, 300); await p.waitForTimeout(800); }
  try { await c.hover({ timeout: 3000 }); log.push({ t: T(), id: `hover-${i + 1}` }); } catch { log.push({ t: T(), id: `skip-${i + 1}` }); }
  await p.waitForTimeout(1400);
}
await p.mouse.move(vp.width / 2, 40);
for (let i = 0; i < 20; i++) { await p.mouse.wheel(0, -150); await p.waitForTimeout(60); }
await p.waitForTimeout(1000);
await p.click('#menu-toggle'); log.push({ t: T(), id: 'menu-close' });
await p.waitForTimeout(2500);
const v = p.video(); await ctx.close(); await b.close();
fs.renameSync(await v.path(), `${out}/full.webm`);
fs.writeFileSync(`${out}/timeline.json`, JSON.stringify(log, null, 1));
console.log(JSON.stringify(log));
