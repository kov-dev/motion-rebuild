// Static layout compare on staging: new `section-interactive` vs old `#interactive`
// (same page, so fonts/rem are identical). Rects are relative to each section's top-left.
// Usage: node interactive-compare.mjs [url] [outDir]
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] || 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const out = process.argv[3] || '.';
fs.mkdirSync(out, { recursive: true });
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const VPS = [{ n: '1440', w: 1440, h: 900, m: false }, { n: '768', w: 768, h: 1024, m: true }, { n: '375', w: 375, h: 812, m: true }];

// Same family/weight/size; line-height and letter-spacing within 0.05px (em vs px rounding).
const sameFont = (a, b) => {
  const pa = a.split(' '), pb = b.split(' ');
  if (pa.slice(0, 2).join() !== pb.slice(0, 2).join()) return false;
  const [sa, la] = pa[2].split('/').map(parseFloat), [sb, lb] = pb[2].split('/').map(parseFloat);
  return sa === sb && Math.abs(la - lb) <= 0.1 && Math.abs(parseFloat(pa[3]) - parseFloat(pb[3])) <= 0.05;
};
const b = await chromium.launch({ channel: 'chrome' });
let fails = 0;
for (const vp of VPS) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.m ? IPHONE : undefined });
  const p = await ctx.newPage();
  // Static layout only: block old and new animation code so neither section is pinned/moved.
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
        return { x: +(r.left - s.left).toFixed(1), y: +(r.top - s.top).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), f: `${cs.fontFamily.split(',')[0]} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.letterSpacing}`, c: cs.color, bg: cs.backgroundColor, bd: cs.borderTopWidth + ' ' + cs.borderTopColor };
      });
    };
    const n = document.querySelector('.section-interactive');
    const o = document.querySelector('#interactive');
    const N = ['h2', '[data-motion="interactive-pin"]', (s) => s.querySelectorAll('.interactive-item')[0], (s) => s.querySelectorAll('.interactive-item')[1], (s) => s.querySelectorAll('.interactive-item')[2],
      (s) => s.querySelectorAll('.interactive-text')[0], (s) => s.querySelectorAll('.interactive-text p')[0], (s) => s.querySelectorAll('.interactive-text p')[1], (s) => s.querySelectorAll('.interactive-text p')[2], (s) => s.querySelectorAll('.interactive-text p span')[0],
      (s) => s.querySelectorAll('.interactive-text p')[3], (s) => s.querySelectorAll('.interactive-text p')[4], '[data-motion="interactive-sphere"]', '[data-motion="interactive-lottie"]', '[data-motion="interactive-hover"]', (s) => s];
    const O = ['h2', '.height-section', (s) => s.querySelectorAll('.horizontal-item')[0], (s) => s.querySelectorAll('.horizontal-item')[1], (s) => s.querySelectorAll('.horizontal-item')[2],
      (s) => s.querySelectorAll('.h-item-content')[0], '.h-item-content .p3-bold', (s) => s.querySelectorAll('.h-item-content .p3')[0], (s) => s.querySelectorAll('.h-item-content .p3')[1], '.h-item-content .p3 .p3-bold',
      (s) => s.querySelectorAll('.h-item-content .p3')[2], (s) => s.querySelectorAll('.h-item-content .p3')[3], '#canvas', '.h-item-lottie', '#notrealtime', (s) => s];
    const names = ['h2', 'pin', 'item1', 'item2', 'item3', 'text1', 'strong', 'p-real', 'p-not', 'span', 'label2', 'label3', 'sphere', 'lottie', 'hover', 'section'];
    const a = pick(n, N), c = pick(o, O);
    return names.map((k, i) => ({ k, n: a[i], o: c[i] }));
  });
  const rows = [];
  for (const { k, n, o } of res) {
    if (!n || !o) { rows.push(`${k}: MISSING new=${!!n} old=${!!o}`); fails++; continue; }
    // Section height differs by design (old one carries the GSAP pin-spacer), so skip its h.
    const dx = Math.max(Math.abs(n.x - o.x), Math.abs(n.y - o.y), Math.abs(n.w - o.w), k === 'section' ? 0 : Math.abs(n.h - o.h));
    const TEXT = ['h2', 'strong', 'p-real', 'p-not', 'span', 'label2', 'label3'];
    const fontDiff = TEXT.includes(k) && !sameFont(n.f, o.f) ? ` FONT new[${n.f}] old[${o.f}]` : '';
    // Containers without own text inherit Webflow's default #333 on the old side; only text colour matters.
    const colDiff = TEXT.includes(k) && n.c !== o.c ? ` COLOR ${n.c} vs ${o.c}` : '';
    const bdDiff = k.startsWith('item') && n.bd !== o.bd ? ` BORDER ${n.bd} vs ${o.bd}` : '';
    const bgDiff = k === 'section' && n.bg !== o.bg ? ` BG ${n.bg} vs ${o.bg}` : '';
    const flag = dx > 1 || fontDiff || colDiff || bdDiff || bgDiff;
    if (flag) fails++;
    rows.push(`${flag ? '✗' : '✓'} ${k}: Δ${dx.toFixed(1)} new ${n.x},${n.y} ${n.w}x${n.h} | old ${o.x},${o.y} ${o.w}x${o.h}${fontDiff}${colDiff}${bdDiff}${bgDiff}`);
  }
  console.log(`== ${vp.n}\n` + rows.join('\n'));
  // Code is blocked, so the preloader overlays stay up: hide them for the screenshots.
  await p.addStyleTag({ content: '.section-preloader, .loader, .loader-wrap { display: none !important; } html, body { overflow: visible !important; }' });
  await p.evaluate(() => document.querySelector('.section-interactive').scrollIntoView());
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/compare-${vp.n}-new.png` });
  await p.evaluate(() => document.querySelector('#interactive').scrollIntoView());
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/compare-${vp.n}-old.png` });
  await ctx.close();
}
await b.close();
console.log('flags:', fails);
