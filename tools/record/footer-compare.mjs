// Static layout compare on staging: new `site-footer` (footer.site-footer, right after section-resources) vs the old
// footer (div.nav.nav-dark > div.footer at the page end). Same page, so fonts / rem are identical. Old script.v33 and
// our module are blocked; IX2 still writes cloud transforms on the old clouds, so inline transforms are cleared first.
// Every rect is relative to the footer root (.site-footer / .footer). Hidden elements (display none at a band:
// arrows and social icons above 479, the S. label and social texts at ≤479) must be hidden on both sides.
// 1440 also hovers the first menu link on both sides (underline).
// Usage: node footer-compare.mjs [url] [outDir]
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] || 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const out = process.argv[3] || '.';
fs.mkdirSync(out, { recursive: true });
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const VPS = [
  { n: '1440', w: 1440, h: 900, m: false }, { n: '768', w: 768, h: 1024, m: true },
  { n: '600', w: 600, h: 900, m: true }, { n: '375', w: 375, h: 812, m: true },
];
const BASE = ['footer.site-footer', '.nav.nav-dark > .footer'];

const sameFont = (a, b) => {
  const pa = a.split(' '), pb = b.split(' ');
  if (pa.slice(0, 2).join() !== pb.slice(0, 2).join()) return false;
  const [sa, la] = pa[2].split('/').map(parseFloat), [sb, lb] = pb[2].split('/').map(parseFloat);
  return sa === sb && Math.abs(la - lb) <= 0.1 && Math.abs((parseFloat(pa[3]) || 0) - (parseFloat(pb[3]) || 0)) <= 0.05;
};

// [name, new selector, old selector, checks]; '' = the root. Checks are '+'-joined:
//   box  geometry · text  box + font / colour / case / text · bg  background colour · bgi  background-image file
//   bdb  bottom + top border · href  link target · dec  text decoration
const MENU = ['Introduction', 'Easing', 'Delay', 'Fade', 'Morph', 'Masking', 'Dimension', 'Parallax', 'Zoom', 'Resources'];
const SOCIAL = ['Dribbble', 'Instagram', 'Twitter', 'Linkedin', 'Clutch'];
const MAP = [
  ['root', '', '', 'box'],
  ...['first', 'second', 'third', 'fourth'].map((c) => [`cloud-${c}`, `.ft-cloud.is-${c}`, `.footer-cloud-item.is-${c}`, 'box+bgi']),
  ['content', '.ft-content', '.footer-content', 'box+bg'],
  ['main', '.ft-main', '.footer-list', 'box'],
  ['title', '.ft-title', '.h5', 'text'],
  ['navs', '.ft-navs', '.flex-display.is-footer', 'box'],
  ['navMenu', '.ft-nav.is-menu', '.footer-item._2', 'box'],
  ['labelN', '.ft-nav.is-menu .ft-label', '.footer-item._2 .f-label', 'text'],
  ['listMenu', '.ft-list.is-menu', '.f-navigation-list.is-menu', 'box'],
  ...MENU.flatMap((t, i) => [
    [`menu-${t}`, `.ft-list.is-menu > li:nth-child(${i + 1}) .ft-link`, `.f-navigation-list.is-menu > .f-link:nth-child(${i + 1})`, 'box+href'],
    [`menu-${t}-text`, `.ft-list.is-menu > li:nth-child(${i + 1}) .ft-link > div:first-child`, `.f-navigation-list.is-menu > .f-link:nth-child(${i + 1}) > div:first-child`, 'text'],
    [`menu-${t}-arrow`, `.ft-list.is-menu > li:nth-child(${i + 1}) .ft-arrow svg`, `.f-navigation-list.is-menu > .f-link:nth-child(${i + 1}) .f-icon svg`, 'box'],
  ]),
  ['navSocial', '.ft-nav:not(.is-menu)', '.flex-display.is-footer > .footer-item:not(._2)', 'box'],
  ['labelS', '.ft-nav:not(.is-menu) .ft-label', '.flex-display.is-footer > .footer-item:not(._2) .f-label', 'text'],
  ['listSocial', '.ft-list.is-social', '.f-navigation-list.is-social', 'box+bdb'],
  ...SOCIAL.flatMap((t, i) => [
    [`social-${t}`, `.ft-list.is-social > li:nth-child(${i + 1}) .ft-link`, `.f-navigation-list.is-social > .f-link:nth-child(${i + 1})`, 'box+href'],
    [`social-${t}-text`, `.ft-list.is-social > li:nth-child(${i + 1}) .ft-link-text`, `.f-navigation-list.is-social > .f-link:nth-child(${i + 1}) .text-hidden`, 'text'],
    [`social-${t}-icon`, `.ft-list.is-social > li:nth-child(${i + 1}) .ft-social-icon svg`, `.f-navigation-list.is-social > .f-link:nth-child(${i + 1}) .f-icon svg`, 'box'],
  ]),
  ['info', '.ft-info', '.f-info-container', 'box'],
  ['credit', '.ft-credit', '.zajno-label.is-desktop', 'text'],
  ['zajno', '.ft-zajno', '.zajno-link', 'text+href+dec'],
  ['copy', '.ft-copy', '.f-info-container > div:last-child', 'text'],
];

const b = await chromium.launch({ channel: 'chrome' });
let fails = 0;
for (const vp of VPS) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.m ? IPHONE : undefined });
  const p = await ctx.newPage();
  await p.route(/script\.v33|cdn\.jsdelivr\.net\/gh\/kov-dev/, (r) => r.abort());
  await p.goto(url + '?nocache=' + Date.now(), { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(2000);
  await p.evaluate(() => document.querySelectorAll('.footer-cloud-item[style]').forEach((e) => { e.style.transform = ''; }));
  const res = await p.evaluate(([MAP, BASE]) => {
    const m = (side, sel) => {
      const b = document.querySelector(BASE[side]);
      if (!b) return null;
      const e = sel ? b.querySelector(sel) : b;
      if (!e) return null;
      const s = b.getBoundingClientRect(), r = e.getBoundingClientRect(), cs = getComputedStyle(e);
      const a = e.closest('a') || e.querySelector('a');
      return {
        hid: !e.getClientRects().length,
        x: +(r.left - s.left).toFixed(1), y: +(r.top - s.top).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
        txt: e.textContent.replace(/\s+/g, '').toUpperCase(),
        f: `${cs.fontFamily.split(',')[0]} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.letterSpacing}`, tt: cs.textTransform,
        c: cs.color, bg: cs.backgroundColor, dec: cs.textDecorationLine,
        bd: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor} / ${cs.borderBottomWidth} ${cs.borderBottomStyle} ${cs.borderBottomColor}`,
        bgi: (cs.backgroundImage.match(/[^/_]+_([^/]+?)"?\)$/) || [, ''])[1], href: a?.href || '', tgt: a?.target || '',
      };
    };
    return MAP.map(([k, ns, os]) => ({ k, n: m(0, ns), o: m(1, os) }));
  }, [MAP, BASE]);
  const lines = [];
  for (const [i, { k, n, o }] of res.entries()) {
    const ck = MAP[i][3].split('+');
    if (!n || !o) { lines.push(`✗ ${k}: MISSING new=${!!n} old=${!!o}`); fails++; continue; }
    const diffs = [];
    let dx = 0;
    if (n.hid || o.hid) {
      if (n.hid !== o.hid) diffs.push(`VISIBILITY new hidden=${n.hid} old hidden=${o.hid}`);
    } else {
      dx = Math.max(...['x', 'y', 'w', 'h'].map((g) => Math.abs(n[g] - o[g])));
      if (ck.includes('text')) {
        if (!sameFont(n.f, o.f)) diffs.push(`FONT new[${n.f}] old[${o.f}]`);
        if (n.c !== o.c || n.tt !== o.tt) diffs.push(`COLOR/CASE ${n.c} ${n.tt} vs ${o.c} ${o.tt}`);
        if (n.txt !== o.txt) diffs.push(`TEXT "${n.txt.slice(0, 40)}" vs "${o.txt.slice(0, 40)}"`);
      }
      if (ck.includes('bgi') && n.bgi !== o.bgi) diffs.push(`BGI ${n.bgi} vs ${o.bgi}`);
      if (ck.includes('bg') && n.bg !== o.bg) diffs.push(`BG ${n.bg} vs ${o.bg}`);
      if (ck.includes('bdb') && n.bd !== o.bd) diffs.push(`BORDER ${n.bd} vs ${o.bd}`);
      if (ck.includes('dec') && n.dec !== o.dec) diffs.push(`DECORATION ${n.dec} vs ${o.dec}`);
    }
    if (ck.includes('href') && (n.href !== o.href || n.tgt !== o.tgt)) diffs.push(`HREF ${n.href} ${n.tgt} vs ${o.href} ${o.tgt}`);
    const flag = dx > 1 || diffs.length;
    if (flag) fails++;
    lines.push(`${flag ? '✗' : '✓'} ${k}: Δ${dx.toFixed(1)}${n.hid ? ' (hidden)' : ` new ${n.x},${n.y} ${n.w}x${n.h} | old ${o.x},${o.y} ${o.w}x${o.h}`} ${diffs.join(' ')}`);
  }

  if (!vp.m) {
    // Hover: the first menu link gets an underline on both sides.
    const dec = [];
    for (const sel of [`${BASE[0]} .ft-list.is-menu .ft-link`, `${BASE[1]} .f-navigation-list.is-menu .f-link`]) {
      await p.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: 'center' }), sel);
      await p.waitForTimeout(300);
      await p.hover(sel);
      await p.waitForTimeout(200);
      dec.push(await p.evaluate((sel) => getComputedStyle(document.querySelector(sel)).textDecorationLine, sel));
      await p.mouse.move(1, 1);
    }
    const ok = dec[0] === 'underline' && dec[1] === 'underline';
    if (!ok) fails++;
    lines.push(`${ok ? '✓' : '✗'} hover: new ${dec[0]} / old ${dec[1]}`);
  }

  const bad = lines.filter((r) => r.startsWith('✗'));
  const maxD = Math.max(0, ...lines.map((r) => +(r.match(/Δ([\d.]+)/) || [, 0])[1]));
  console.log(`== ${vp.n}: ${lines.length - bad.length}/${lines.length} ok, max Δ ${maxD}` + (bad.length ? '\n' + bad.join('\n') : ''));
  if (process.env.VERBOSE) console.log(lines.join('\n'));

  // Screenshots: each footer with its clouds (the view starts 0.6·vh above the footer top).
  await p.addStyleTag({ content: '.section-preloader, .loader, .loader-wrap { display: none !important; } html, body { overflow: visible !important; }' });
  for (const [tag, sel] of [['new', BASE[0]], ['old', BASE[1]]]) {
    await p.evaluate((sel) => window.scrollTo(0, document.querySelector(sel).getBoundingClientRect().top + scrollY - innerHeight * 0.6), sel);
    await p.waitForTimeout(800);
    await p.evaluate(() => document.querySelectorAll('.footer-cloud-item[style]').forEach((e) => { e.style.transform = ''; }));
    await p.screenshot({ path: `${out}/footer-${vp.n}-${tag}.png` });
  }
  await ctx.close();
}
await b.close();
console.log('flags:', fails);
