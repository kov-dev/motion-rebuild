// Static checks of the new preloader on the copy's staging (read-only).
// Hides the old IX2 loader, then shoots each preloader state and measures the words.
// Usage: node preloader-shots.mjs <outDir>
import { chromium } from 'playwright';

const URL = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const out = process.argv[2] || '.';
const viewports = [
  { name: '1440x750', w: 1440, h: 750 },
  { name: '1440x900', w: 1440, h: 900 },
  { name: '768x1024', w: 768, h: 1024 },
  { name: '375x812', w: 375, h: 812, m: true },
];
// state → which layers stay visible
const states = {
  loader: {},
  'step3-disc': { hideLoader: true, steps: [2] },
  'step3-base': { hideLoader: true, steps: [2], hideDiscs: true },
  'step2-disc': { hideLoader: true, steps: [1] },
  'step1-base': { hideLoader: true, steps: [0], hideDiscs: true },
};

const b = await chromium.launch({ channel: 'chrome' });
const report = {};
for (const vp of viewports) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.m, hasTouch: !!vp.m });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'load', timeout: 90000 });
  await p.evaluate(() => document.fonts.ready);
  // old preloader and nav sit on top of everything — remove them for the check
  await p.addStyleTag({ content: '.loader,.navigation,.fixed-bottom{display:none!important}' });
  await p.evaluate(() => scrollTo(0, 0));
  for (const [state, cfg] of Object.entries(states)) {
    await p.evaluate((cfg) => {
      const q = (s) => [...document.querySelectorAll(s)];
      q('[data-motion="preloader-loader"]').forEach((e) => (e.style.display = cfg.hideLoader ? 'none' : ''));
      q('[data-motion="preloader-step"]').forEach((e, i) => (e.style.display = !cfg.steps || cfg.steps.includes(i) ? '' : 'none'));
      q('[data-motion="preloader-disc"]').forEach((e) => (e.style.display = cfg.hideDiscs ? 'none' : ''));
    }, cfg);
    await p.locator('.section-preloader').screenshot({ path: `${out}/preloader-${vp.name}-${state}.png` });
  }
  report[vp.name] = await p.evaluate(() => {
    document.querySelectorAll('[data-motion^="preloader-"]').forEach((e) => (e.style.display = ''));
    const html = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const words = [...document.querySelectorAll('[data-motion="preloader-step"] > .preloader-word')].map((e) => {
      const r = document.createRange();
      r.selectNodeContents(e);
      const cs = getComputedStyle(e);
      return { text: e.textContent, fontSize: cs.fontSize, family: cs.fontFamily, ls: cs.letterSpacing, inkWidth: Math.round(r.getBoundingClientRect().width) };
    });
    const c = document.querySelector('[data-motion="preloader-counter"]');
    const cs = getComputedStyle(c);
    return { html, words, counter: { fontSize: cs.fontSize, lh: cs.lineHeight, family: cs.fontFamily, bottom: cs.bottom } };
  });
  await ctx.close();
}
await b.close();
console.log(JSON.stringify(report, null, 1));
