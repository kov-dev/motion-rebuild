// Records a full live scroll-through of motion.zajno.com with section timestamps.
import { chromium } from 'playwright';
import fs from 'fs';
const [,, mode='desktop', speed='40'] = process.argv;
const M = mode === 'mobile';
const vp = M ? { width: 375, height: 812 } : { width: 1440, height: 900 };
const out = `out/${mode}`; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({ viewport: vp, isMobile: M, hasTouch: M, deviceScaleFactor: 1,
  userAgent: M ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined,
  recordVideo: { dir: out, size: vp } });
const p = await ctx.newPage();
const t0 = Date.now(); const T = () => +((Date.now() - t0) / 1000).toFixed(2);
const log = [{ t: 0, id: 'start' }];
await p.goto('https://motion.zajno.com/', { waitUntil: 'commit', timeout: 90000 });
log.push({ t: T(), id: 'nav-commit' });
await p.waitForLoadState('load'); log.push({ t: T(), id: 'load' });
await p.mouse.move(vp.width / 2, vp.height / 2);
await p.waitForTimeout(8000); log.push({ t: T(), id: 'hero-idle-end' });
const ids = ['hero','introduction','interactive','techniques','easing','delay','fade','morph','masking','dimension','parallax','zoom','resources','footer'];
let last = null, stuck = 0, prevY = -1, useBy = false, atEnd = 0;
const step = +speed;
while (true) {
  if (useBy) await p.evaluate(s => scrollBy(0, s), step); else await p.mouse.wheel(0, step);
  await p.waitForTimeout(50);
  const s = await p.evaluate(ids => {
    let cur = null;
    for (const i of ids) { const e = i === 'footer' ? document.querySelector('.footer') : document.getElementById(i);
      if (e && e.getBoundingClientRect().top <= innerHeight / 2) cur = i; }
    return { y: scrollY, max: document.documentElement.scrollHeight - innerHeight, cur };
  }, ids);
  if (s.cur !== last) { log.push({ t: T(), id: s.cur, y: Math.round(s.y) }); last = s.cur; }
  if (Math.abs(s.y - prevY) < 1) { if (++stuck > 40 && !useBy && s.y < s.max - 5) { useBy = true; log.push({ t: T(), id: 'fallback-scrollBy' }); } } else stuck = 0;
  prevY = s.y;
  if (s.y >= s.max - 5) { if (++atEnd > 60) break; } else atEnd = 0;
}
log.push({ t: T(), id: 'end' });
await p.waitForTimeout(1500);
const v = p.video(); await ctx.close(); await b.close();
fs.renameSync(await v.path(), `${out}/full.webm`);
fs.writeFileSync(`${out}/timeline.json`, JSON.stringify(log, null, 1));
console.log(JSON.stringify(log));
