// Compare the new Intro layout (local fixture + src/intro embeds) against the live Introduction.
// Usage: node intro-compare.mjs <project-root> <out-dir>
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const [root, out] = process.argv.slice(2);
let html = readFileSync(`${root}/tools/record/fixtures/intro.html`, 'utf8');
for (const bp of ['desktop', 'tablet', 'mobile']) html = html.replace(`<!--#path-${bp}-->`, readFileSync(`${root}/src/intro/path-${bp}.html`, 'utf8'));
const videos = readFileSync(`${root}/src/intro/ui-videos.html`, 'utf8').match(/<video[\s\S]*?<\/video>/g);
videos.forEach((v, i) => { html = html.replace(`<!--#video-${i + 1}-->`, v); });

const vps = [{ n: '1440', w: 1440, h: 900 }, { n: '768', w: 768, h: 1024, m: true }, { n: '375', w: 375, h: 812, m: true }];
const live = { sec: '#introduction', wrap: '.intro-wrap', art: '.div-2', clouds: '.bg-wrap.is-bottom', c1: '.bg-list-item.is-first', c2: '.bg-list-item.is-second', c3: '.bg-list-item.is-third', smoke: '.anim-smoke',
  also: '.anim-shape.is-also', alsoT: '.is-also .anim-text', controls: '.anim-shape.is-controls', your: '.anim-shape.is-your', attention: '.anim-shape.is-attention', attentionT: '.is-attention .anim-text',
  pathD: '.embed-path', pathT: '.embed-path_tablet', pathM: '.embed-path_mobile', stage: '.ui-wrap', ui1: '.ui.first', heading: '.ui.first .ui-text', title: '.ui.first .h6', slide: '.ui.first .ui-slide', media: '.ui.first .section-slide-img-wrap', video: '.ui.first video', caption: '.ui.first .p3' };
const mine = { sec: '.section-intro', wrap: '.intro-scene', art: '.intro-art', clouds: '.intro-clouds', c1: '.intro-cloud.is-left', c2: '.intro-cloud.is-right', c3: '.intro-cloud.is-middle', smoke: '.intro-smoke',
  also: '.intro-shape.is-also', alsoT: '.is-also .text-shape', controls: '.intro-shape.is-controls', your: '.intro-shape.is-your', attention: '.intro-shape.is-attention', attentionT: '.is-attention .text-shape',
  pathD: '.intro-path:not(.is-tablet):not(.is-mobile)', pathT: '.intro-path.is-tablet', pathM: '.intro-path.is-mobile', stage: '.ui-stage', ui1: '.ui-block', heading: '.ui-block .ui-heading', title: '.ui-block .ui-title', slide: '.ui-block .ui-panel', media: '.ui-block .ui-media', video: '.ui-block video', caption: '.ui-block .body-sm' };
const measure = (s) => {
  const sec = document.querySelector(s.sec).getBoundingClientRect().top;
  return Object.fromEntries(Object.entries(s).map(([k, q]) => {
    const e = document.querySelector(q); if (!e) return [k, null];
    const r = e.getBoundingClientRect(); if (!r.width && !r.height) return [k, null];
    return [k, { x: Math.round(r.left), y: Math.round(r.top - sec), w: Math.round(r.width), h: Math.round(r.height) }];
  }));
};
const b = await chromium.launch({ channel: 'chrome' });
const rows = [];
for (const vp of vps) {
  const res = {};
  for (const name of ['live', 'new']) {
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.m, hasTouch: !!vp.m });
    const p = await ctx.newPage();
    if (name === 'live') {
      await p.goto('https://motion.zajno.com/', { waitUntil: 'load', timeout: 90000 });
      await p.waitForTimeout(3000);
      await p.addStyleTag({ content: '.loader,.navigation,.fixed-bottom{display:none!important}' });
    } else {
      await p.setContent(html, { waitUntil: 'load' });
    }
    await p.evaluate(() => document.fonts.ready);
    res[name] = await p.evaluate(measure, name === 'live' ? live : mine);
    // Scene shot: the illustrated part of the section, shapes forced visible on live for parity.
    if (name === 'live') await p.addStyleTag({ content: '.anim-text{transform:none!important}' });
    const top = await p.evaluate((q) => document.querySelector(q).getBoundingClientRect().top + scrollY, name === 'live' ? live.sec : mine.sec);
    const h = await p.evaluate((q) => document.querySelector(q).getBoundingClientRect().height, name === 'live' ? live.art : mine.art);
    await p.screenshot({ path: `${out}/intro-${vp.n}-${name}.png`, fullPage: true, clip: { x: 0, y: top, width: vp.w, height: Math.min(h, 16000) } });
    await ctx.close();
  }
  for (const k of Object.keys(live)) {
    const a = res.live[k], c = res.new[k];
    const d = a && c ? Math.max(Math.abs(a.x - c.x), Math.abs(a.y - c.y), Math.abs(a.w - c.w), Math.abs(a.h - c.h)) : null;
    rows.push(`${vp.n.padEnd(5)} ${k.padEnd(11)} live ${a ? `${a.x},${a.y} ${a.w}×${a.h}` : '-'}`.padEnd(48) + ` new ${c ? `${c.x},${c.y} ${c.w}×${c.h}` : '-'}`.padEnd(30) + (d === null ? (a || c ? '  ≠' : '') : `  Δ${d}`));
  }
}
await b.close();
console.log(rows.join('\n'));
