// Implementation cards (session 43): the sticky pin centres the cards in the viewport (top = max(old top, 50svh − ½ card)).
// Prints the gap above / below the first easing card while the pin is stuck. Default = published staging CSS;
// without --none the proposed CSS is injected on top (prototype mode). Usage: node cards-center.mjs [--none]

import { chromium } from 'playwright';
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io';
const CSS = process.argv.includes('--none') ? '' : `.lesson-cases-pin{top:max(1.02rem,calc(50svh - 2.575rem))}
@media (max-width:991px){.lesson-cases-pin{top:max(1.94rem,calc(50svh - 2.155rem))}}
@media (max-width:479px){.lesson-cases-pin{top:max(1.6rem,calc(50svh - 1.82rem))}}`;
const VPS = [[1710,1052],[1440,900],[1440,700],[1920,1080],[2560,1300],[1280,1000],[1024,1366],[1366,1024],[820,1180],[768,1024],[600,900],[844,390],[390,844],[375,667]];
const b = await chromium.launch({ channel: 'chrome' });
for (const [w,h] of VPS) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.goto(STAGING + '/#easing', { waitUntil: 'load', timeout: 90000 });
  if (CSS) await p.addStyleTag({ content: CSS });
  await p.waitForTimeout(2000);
  const r = await p.evaluate(async () => {
    const cases = document.querySelector('[data-motion="lesson-cases"]');
    window.scrollTo(0, cases.getBoundingClientRect().top + scrollY + cases.offsetHeight * 0.45);
    await new Promise(r=>setTimeout(r,1200));
    const c = cases.querySelector('[data-motion="lesson-card"]').getBoundingClientRect();
    const nav = document.querySelector('nav, [data-motion="nav"]')?.getBoundingClientRect();
    return { above: Math.round(c.top), below: Math.round(innerHeight - c.bottom), navBottom: nav && Math.round(nav.bottom) };
  });
  console.log(`${w}x${h}`, JSON.stringify(r));
  
  await ctx.close();
}
await b.close();
