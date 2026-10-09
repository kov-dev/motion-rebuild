// Compare new Hero layout (local page with copied class values) against the live Hero.
import { chromium } from 'playwright';
const LOCAL = 'file://' + process.argv[2];
const out = process.argv[3];
const vps = [{ n: '1440x900', w: 1440, h: 900 }, { n: '768x1024', w: 768, h: 1024 }, { n: '375x812', w: 375, h: 812, m: true }];
const b = await chromium.launch({ channel: 'chrome' });
const measure = (sel) => (s) => {
  const r = (q) => { const e = document.querySelector(q); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top + scrollY), h: Math.round(b.height), w: Math.round(b.width), x: Math.round(b.left) }; };
  return Object.fromEntries(Object.entries(s).map(([k, q]) => [k, r(q)]));
};
const live = { section: '#hero', ring: '#hero .anim-ball-border', ball: '#anim-ball', p: '#hero .p1', h: '#hero .h3', lineL: '#hero .ball-divider.is-left' };
const mine = { section: '.section-hero', ring: '.ball-ring', ball: '.ball.is-hero', p: '.hero-text .body-lg', h: '.hero-statement h1', lineL: '.ball-line.is-left' };
const res = {};
for (const vp of vps) {
  for (const [name, url, sel] of [['live', 'https://motion.zajno.com/', live], ['new', LOCAL, mine]]) {
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.m, hasTouch: !!vp.m });
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'load', timeout: 90000 });
    await p.evaluate(() => document.fonts.ready);
    if (name === 'live') { await p.waitForTimeout(12000); await p.addStyleTag({ content: '.loader,.navigation,.fixed-bottom{display:none!important}' }); }
    res[`${vp.n} ${name}`] = await p.evaluate(measure(), sel);
    await p.screenshot({ path: `${out}/hero-${vp.n}-${name}.png` });
    await ctx.close();
  }
}
await b.close();
for (const [k, v] of Object.entries(res)) console.log(k.padEnd(18), Object.entries(v).map(([a, r]) => r ? `${a} t${r.top} h${r.h} w${r.w}` : `${a} -`).join(' | '));
