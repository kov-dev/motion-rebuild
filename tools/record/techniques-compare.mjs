// Static layout compare on staging: new `section-techniques` vs old `#techniques`
// (same page, so fonts/rem are identical). Rects are relative to each section's top-left.
// Sticky children are measured with the page at scrollY 0 (both sections below the fold),
// so they sit at the same constrained positions on both sides.
// Usage: node techniques-compare.mjs [url] [outDir]
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] || 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const out = process.argv[3] || '.';
fs.mkdirSync(out, { recursive: true });
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const VPS = [{ n: '1440', w: 1440, h: 900, m: false }, { n: '768', w: 768, h: 1024, m: true }, { n: '375', w: 375, h: 812, m: true }];

const sameFont = (a, b) => {
  const pa = a.split(' '), pb = b.split(' ');
  if (pa.slice(0, 2).join() !== pb.slice(0, 2).join()) return false;
  const [sa, la] = pa[2].split('/').map(parseFloat), [sb, lb] = pb[2].split('/').map(parseFloat);
  return sa === sb && Math.abs(la - lb) <= 0.1 && Math.abs((parseFloat(pa[3]) || 0) - (parseFloat(pb[3]) || 0)) <= 0.05;
};
const b = await chromium.launch({ channel: 'chrome' });
let fails = 0;
for (const vp of VPS) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.m ? IPHONE : undefined });
  const p = await ctx.newPage();
  // Static layout only: block old and new animation code (IX2 stays, but its scroll
  // actions are at progress 0 for both sections far below the fold — old side only).
  await p.route(/script\.v33|cdn\.jsdelivr\.net\/gh\/kov-dev/, (r) => r.abort());
  await p.goto(url + '?nocache=' + Date.now(), { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(3000);
  const res = await p.evaluate(() => {
    const pick = (sec, sel) => {
      const s = sec.getBoundingClientRect();
      return sel.map((q) => {
        const e = typeof q === 'string' ? sec.querySelector(q) : q(sec);
        if (!e) return null;
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        const bgi = (cs.backgroundImage.match(/[^/_]+_([^/]+?)"?\)$/) || [, ''])[1];
        return {
          x: +(r.left - s.left).toFixed(1), y: +(r.top - s.top).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
          ow: e.offsetWidth, oh: e.offsetHeight, tf: cs.transform,
          f: `${cs.fontFamily.split(',')[0]} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.letterSpacing}`, tt: cs.textTransform,
          c: cs.color, bg: cs.backgroundColor, bd: cs.borderTopWidth + ' ' + cs.borderTopColor, bgi, z: cs.zIndex, pos: cs.position,
        };
      });
    };
    const n = document.querySelector('.section-techniques');
    const o = document.querySelector('#techniques');
    // IX2 (webflow.js is not blocked) writes keyframe-0 transforms inline on the old side
    // (word 2 gets translateY 1rem); drop them so only the class rotate is compared.
    o.querySelectorAll('[style]').forEach((e) => { e.style.transform = ''; });
    const N = ['.techniques-words', '.techniques-word.is-first', '.techniques-word.is-second', '.techniques-word.is-third',
      '.is-first .display-xl', '.is-second .display-xl', '.is-third .display-xl', '.techniques-divider',
      '.techniques-star.is-first', '.techniques-star.is-second', '.techniques-clouds', '.techniques-text', '.techniques-text p', (s) => s];
    const O = ['.list-wrap', '.list-item.first', '.list-item.second', '.list-item.third',
      '.list-item.first > div', '.list-item.second > div', '.list-item.third > div', '.bg-divider',
      '.is-star.first', '.is-star.second', '.content-wrap', '.text-wrap', '.text-wrap .p1', (s) => s];
    const names = ['words', 'word1', 'word2', 'word3', 'text1', 'text2', 'text3', 'divider', 'star1', 'star2', 'clouds', 'textwrap', 'p', 'section'];
    const a = pick(n, N), c = pick(o, O);
    return names.map((k, i) => ({ k, n: a[i], o: c[i] }));
  });
  const rows = [];
  const TEXT = ['text1', 'text2', 'text3', 'p'];
  for (const { k, n, o } of res) {
    if (!n || !o) { rows.push(`${k}: MISSING new=${!!n} old=${!!o}`); fails++; continue; }
    const dx = Math.max(Math.abs(n.x - o.x), Math.abs(n.y - o.y), Math.abs(n.w - o.w), Math.abs(n.h - o.h), Math.abs(n.ow - o.ow), Math.abs(n.oh - o.oh));
    const diffs = [];
    if (TEXT.includes(k) && !sameFont(n.f, o.f)) diffs.push(`FONT new[${n.f}] old[${o.f}]`);
    if (TEXT.includes(k) && (n.c !== o.c || n.tt !== o.tt)) diffs.push(`COLOR/CASE ${n.c} ${n.tt} vs ${o.c} ${o.tt}`);
    if (/^word\d$/.test(k) && (n.bd !== o.bd || n.bg !== o.bg)) diffs.push(`PLATE ${n.bd} ${n.bg} vs ${o.bd} ${o.bg}`);
    if (n.tf !== o.tf) diffs.push(`TF ${n.tf} vs ${o.tf}`);
    if (n.bgi !== o.bgi) diffs.push(`BGI ${n.bgi} vs ${o.bgi}`);
    if (n.pos !== o.pos || n.z !== o.z) diffs.push(`POS ${n.pos}/${n.z} vs ${o.pos}/${o.z}`);
    if (k === 'section' && n.bg !== o.bg) diffs.push(`BG ${n.bg} vs ${o.bg}`);
    const flag = dx > 1 || diffs.length;
    if (flag) fails++;
    rows.push(`${flag ? '✗' : '✓'} ${k}: Δ${dx.toFixed(1)} new ${n.x},${n.y} ${n.w}x${n.h} | old ${o.x},${o.y} ${o.w}x${o.h} ${diffs.join(' ')}`);
  }
  console.log(`== ${vp.n}\n` + rows.join('\n'));
  // Code is blocked, so the preloader overlays stay up: hide them for the screenshots.
  await p.addStyleTag({ content: '.section-preloader, .loader, .loader-wrap { display: none !important; } html, body { overflow: visible !important; }' });
  for (const [tag, sel] of [['new', '.section-techniques'], ['old', '#techniques']]) {
    await p.evaluate((sel) => document.querySelector(sel).scrollIntoView(), sel);
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${out}/techniques-${vp.n}-${tag}.png` });
  }
  await ctx.close();
}
await b.close();
console.log('flags:', fails);
