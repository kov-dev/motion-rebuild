// Static layout compare on staging: new `site-nav` (header.site-nav, first after styles-rem) vs the old navbar
// (div.navigation.w-nav). Same page, so fonts / rem are identical. Old script.v33 and our module are blocked, so
// neither side is themed or animated: the old navbar is un-hidden over the legacy-hide rule, IX2 start transforms
// (nav-panels y −200 %, nav-links x 4rem) are cleared. Both bars sit at the viewport top (fixed / sticky at scroll 0),
// every rect is relative to the root (header.site-nav / .navigation). Closed state: the bar; open state: both menus
// forced to display block (they overlap, which does not matter for geometry).
// Expected differences (not flagged): pill background (old static pills are transparent, the theme code paints them;
// new pills carry the semantic bg), card hrefs (new point to `#<lesson>-next` until the old sections go).
// Usage: node nav-compare.mjs [url] [outDir]
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
const BASE = ['header.site-nav', '.navigation'];
const SHOW_OLD = 'html body .navigation { display: block !important; } html body .nav-menu { display: block !important; opacity: 1 !important; }';
const SHOW_NEW = 'html body .nb-menu { display: block !important; }';

const sameFont = (a, b) => {
  const pa = a.split(' '), pb = b.split(' ');
  if (pa.slice(0, 2).join() !== pb.slice(0, 2).join()) return false;
  const [sa, la] = pa[2].split('/').map(parseFloat), [sb, lb] = pb[2].split('/').map(parseFloat);
  return sa === sb && Math.abs(la - lb) <= 0.1 && Math.abs((parseFloat(pa[3]) || 0) - (parseFloat(pb[3]) || 0)) <= 0.05;
};

// [name, new selector, old selector, checks]; '' = the root. Checks are '+'-joined:
//   box  geometry · text  box + font / colour / case / text · bd  border (width, style, colour) + radius
//   fg  text colour · href  link target + new tab · dec  text decoration · sw  scrollWidth
//   xw  geometry without height. Used where the old height is invisible: the old .navigation box is 1rem tall with
//   margin-bottom −1rem (the bar itself is compared through its children), and old social links are 4 px taller than
//   their 24 px icon (the icons themselves are compared exactly).
const CRUMBS = ['easing', 'delay', 'fade', 'morph', 'masking', 'dimension', 'parallax', 'zoom'];
const OLD_CRUMB = { dimension: 'scale' };
const BAR = [
  ['root', '', '', 'xw'],
  ['panel', '.nb-panel', '.nav-panel', 'box'],
  ['start', '.nb-start', '.nav-logo', 'box'],
  ['logo', '.nb-logo', '.symbols-wrap', 'box'],
  ['eyes-dark', '.nb-eyes:not(.is-light)', '.logo-eye-dark', 'box'],
  ['eyes-light', '.nb-eyes.is-light', '.logo-eye-light', 'box'],
  ['eye-bg-left', '.nb-eye-bg.is-left', '.eye-bg-sections.is-left', 'box'],
  ['eye-bg-right', '.nb-eye-bg.is-right', '.eye-bg-sections.is-right', 'box'],
  ['motion-ed', '.nb-start > .nb-pill', '.logo-text-sections', 'text+bd+href'],
  ['crumbs', '.nb-crumbs', '.breadcrumbs-wrap', 'box'],
  ...CRUMBS.map((c) => [`crumb-${c}`, `.nb-crumb.is-${c}`, `.breadcrumb-item.is-${OLD_CRUMB[c] || c}`, 'text+bd']),
  ['toggle', '.nb-toggle', '.nav-toggle', 'text+bd'],
  ['label-wrap', '.nb-toggle-label-wrap', '.toggle-label-wrap', 'box'],
  ['label-menu', '.nb-toggle-label:not(.is-close)', '.toggle-label:not(.is-active)', 'text'],
  ['label-close', '.nb-toggle-label.is-close', '.toggle-label.is-active', 'text'],
  ['icon', '.nb-toggle-icon', '.toggle-icon-wrap', 'box'],
  ['line-top', '.nb-toggle-line:first-child', '.toggle-span.is-top', 'box'],
  ['line-bottom', '.nb-toggle-line:last-child', '.toggle-span.is-bottom', 'box'],
];
const CARD_OLD = ['#hero', '#easing', '#delay', '#fade', '#morph', '#masking', '#dimension', '#parallax', '#zoom', '#resources'];
const SOCIAL = ['Dribbble', 'Instagram', 'Twitter', 'LinkedIn', 'Clutch'];
const MENU = [
  ['menu', '.nb-menu', '.nav-menu', 'box'],
  ['scroller', '.nb-scroller', '.sticky-container.is-nav-links', 'box'],
  ['track', '.nb-track', '.nav-track', 'box+sw'],
  ...CARD_OLD.map((h, i) => [`card-${h.slice(1)}`, `.nb-card:nth-child(${i + 1})`, `.nav-link:nth-child(${i + 1})`, 'box']),
  ['bottom', '.nb-bottom', '.nav-absolute', 'box'],
  ['credit', '.nb-credit', '.nav-absolute > div:first-child', 'text'],
  ['zajno', '.nb-link', '.nav-absolute .link', 'text+href+dec'],
  ['socials', '.nb-socials', '.navbar-socials-list', 'box'],
  ...SOCIAL.flatMap((t, i) => [
    [`social-${t}`, `.nb-socials > li:nth-child(${i + 1}) .nb-social`, `.navbar-socials-list > .nav-social-link:nth-child(${i + 1})`, 'xw+href+fg'],
    [`social-${t}-icon`, `.nb-socials > li:nth-child(${i + 1}) svg`, `.navbar-socials-list > .nav-social-link:nth-child(${i + 1}) svg`, 'box'],
  ]),
];

const measure = (page, MAP) => page.evaluate(([MAP, BASE]) => {
  const m = (side, sel) => {
    const b = document.querySelector(BASE[side]);
    if (!b) return null;
    const e = sel ? b.querySelector(sel) : b;
    if (!e) return null;
    const s = b.getBoundingClientRect(), r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    const a = e.closest('a') || e.querySelector('a');
    return {
      hid: !e.getClientRects().length || cs.visibility === 'hidden',
      x: +(r.left - s.left).toFixed(1), y: +(r.top - s.top).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
      txt: e.textContent.replace(/\s+/g, '').toUpperCase(),
      f: `${cs.fontFamily.split(',')[0]} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.letterSpacing}`, tt: cs.textTransform,
      c: cs.color, dec: cs.textDecorationLine,
      bd: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor} r${cs.borderTopLeftRadius}`,
      href: a?.getAttribute('href') || '', tgt: a?.target || '', sw: e.scrollWidth,
    };
  };
  return MAP.map(([k, ns, os]) => ({ k, n: m(0, ns), o: m(1, os) }));
}, [MAP, BASE]);

const b = await chromium.launch({ channel: 'chrome' });
let fails = 0;
for (const vp of VPS) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.m ? IPHONE : undefined });
  const p = await ctx.newPage();
  await p.route(/script\.v33|cdn\.jsdelivr\.net\/gh\/kov-dev/, (r) => r.abort());
  await p.goto(url + '?nocache=' + Date.now(), { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(2500); // the preloader gate bails 1 s after DOMContentLoaded without our module
  await p.addStyleTag({ content: SHOW_OLD + ' .section-preloader, .loader { display: none !important; }' });
  await p.evaluate(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll('.navigation [style]').forEach((e) => { e.style.transform = ''; });
  });
  await p.waitForTimeout(300);

  const lines = [];
  const run = async (MAP, state) => {
    const res = await measure(p, MAP);
    for (const [i, { k, n, o }] of res.entries()) {
      const ck = MAP[i][3].split('+');
      const key = `${state}/${k}`;
      if (!n || !o) { lines.push(`✗ ${key}: MISSING new=${!!n} old=${!!o}`); fails++; continue; }
      const diffs = [];
      let dx = 0;
      if (n.hid || o.hid) {
        if (n.hid !== o.hid) diffs.push(`VISIBILITY new hidden=${n.hid} old hidden=${o.hid}`);
      } else {
        dx = Math.max(...(ck.includes('xw') ? ['x', 'y', 'w'] : ['x', 'y', 'w', 'h']).map((g) => Math.abs(n[g] - o[g])));
        if (ck.includes('text')) {
          if (!sameFont(n.f, o.f)) diffs.push(`FONT new[${n.f}] old[${o.f}]`);
          if (n.c !== o.c || n.tt !== o.tt) diffs.push(`COLOR/CASE ${n.c} ${n.tt} vs ${o.c} ${o.tt}`);
          if (n.txt !== o.txt) diffs.push(`TEXT "${n.txt.slice(0, 40)}" vs "${o.txt.slice(0, 40)}"`);
        }
        if (ck.includes('fg') && n.c !== o.c) diffs.push(`COLOR ${n.c} vs ${o.c}`);
        if (ck.includes('bd') && n.bd !== o.bd) diffs.push(`BORDER ${n.bd} vs ${o.bd}`);
        if (ck.includes('dec') && n.dec !== o.dec) diffs.push(`DECORATION ${n.dec} vs ${o.dec}`);
        if (ck.includes('sw') && Math.abs(n.sw - o.sw) > 1) diffs.push(`SCROLLWIDTH ${n.sw} vs ${o.sw}`);
      }
      if (ck.includes('href') && (n.href !== o.href || n.tgt !== o.tgt)) diffs.push(`HREF ${n.href} ${n.tgt} vs ${o.href} ${o.tgt}`);
      const flag = dx > 1 || diffs.length;
      if (flag) fails++;
      lines.push(`${flag ? '✗' : '✓'} ${key}: Δ${dx.toFixed(1)}${n.hid ? ' (hidden)' : ` new ${n.x},${n.y} ${n.w}x${n.h} | old ${o.x},${o.y} ${o.w}x${o.h}`} ${diffs.join(' ')}`);
    }
  };

  // Closed: the bar.
  await run(BAR, 'closed');
  for (const [tag, hide] of [['new', '.navigation'], ['old', 'header.site-nav']]) {
    const h = await p.addStyleTag({ content: `html body ${hide} { visibility: hidden !important; }` });
    await p.screenshot({ path: `${out}/nav-${vp.n}-closed-${tag}.png`, clip: { x: 0, y: 0, width: vp.w, height: 120 } });
    await h.evaluate((el) => el.remove());
  }

  // Open: both menus shown, IX2 start offset of the old cards cleared.
  await p.addStyleTag({ content: SHOW_NEW });
  await p.evaluate(() => document.querySelectorAll('.nav-menu [style]').forEach((e) => { e.style.transform = ''; }));
  await p.waitForTimeout(500); // old Lottie cards size themselves from their SVG
  await run(MENU, 'open');
  // Card links: new ones point to `#<lesson>-next` (hero stays) until the old sections are removed.
  const hrefs = await p.evaluate(() => [...document.querySelectorAll('.nb-card')].map((a) => a.getAttribute('href') + '|' + a.getAttribute('aria-label')));
  const want = CARD_OLD.map((h) => (h === '#hero' ? h : h + '-next'));
  const hrefOk = hrefs.length === 10 && hrefs.every((h, i) => h.split('|')[0] === want[i] && h.split('|')[1] !== 'null');
  if (!hrefOk) fails++;
  lines.push(`${hrefOk ? '✓' : '✗'} open/card-hrefs: ${hrefs.map((h) => h.split('|')[0]).join(' ')}`);
  for (const [tag, hide] of [['new', '.navigation'], ['old', 'header.site-nav']]) {
    const h = await p.addStyleTag({ content: `html body ${hide} { visibility: hidden !important; }` });
    await p.screenshot({ path: `${out}/nav-${vp.n}-open-${tag}.png` });
    await h.evaluate((el) => el.remove());
  }

  const bad = lines.filter((r) => r.startsWith('✗'));
  const maxD = Math.max(0, ...lines.map((r) => +(r.match(/Δ([\d.]+)/) || [, 0])[1]));
  console.log(`== ${vp.n}: ${lines.length - bad.length}/${lines.length} ok, max Δ ${maxD}` + (bad.length ? '\n' + bad.join('\n') : ''));
  if (process.env.VERBOSE) console.log(lines.join('\n'));
  await ctx.close();
}
await b.close();
console.log('flags:', fails);
