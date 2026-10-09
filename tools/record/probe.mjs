import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
for (const vp of [{w:1440,h:900,m:false},{w:375,h:812,m:true}]) {
  const ctx = await b.newContext({ viewport:{width:vp.w,height:vp.h}, isMobile:vp.m, hasTouch:vp.m,
    userAgent: vp.m ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined });
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(e.message));
  await p.goto('https://motion.zajno.com/', { waitUntil: 'load', timeout: 90000 });
  await p.waitForTimeout(6000);
  const r = await p.evaluate(() => {
    const ids=['hero','introduction','interactive','techniques','lessons','easing','delay','fade','morph','masking','dimension','parallax','zoom','resources'];
    const o={docH:document.documentElement.scrollHeight, html:getComputedStyle(document.documentElement).fontSize, overflow:getComputedStyle(document.documentElement).overflow};
    for (const i of ids){const e=document.getElementById(i); o[i]=e?Math.round(e.getBoundingClientRect().top+scrollY):null;}
    const f=document.querySelector('.footer'); o.footer=f?Math.round(f.getBoundingClientRect().top+scrollY):null;
    o.loader=!!document.querySelector('.loader-wrap') && getComputedStyle(document.querySelector('.loader-wrap')).display;
    return o;});
  console.log(vp.w, JSON.stringify(r), 'errors:', errs.slice(0,5));
  await ctx.close();
}
await b.close();
