// Static layout compare on staging: new `lesson-section` instances (`#<id>-next`) vs old `#<id>`
// (same page, so fonts/rem are identical). Every rect is relative to a base block that exists on
// both sides: the lesson root, the Implementation block, or one of the one-off blocks in the
// lesson slots (easing: schemes slider, examples, demo; easing + delay: classic). The roots of
// those blocks are also measured against the lesson, so their vertical placement is checked.
// Page stays at scrollY 0, so sticky blocks sit at their natural positions on both sides.
// Usage: node lessons-compare.mjs [url] [outDir] [ids,comma-separated]
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] || 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const out = process.argv[3] || '.';
fs.mkdirSync(out, { recursive: true });
const IDS = (process.argv[4] || 'easing,delay,fade,morph,masking,dimension,parallax,zoom').split(',');
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const VPS = [
  { n: '1440', w: 1440, h: 900, m: false }, { n: '768', w: 768, h: 1024, m: true },
  { n: '600', w: 600, h: 900, m: true }, { n: '375', w: 375, h: 812, m: true },
];

const sameFont = (a, b) => {
  const pa = a.split(' '), pb = b.split(' ');
  if (pa.slice(0, 2).join() !== pb.slice(0, 2).join()) return false;
  const [sa, la] = pa[2].split('/').map(parseFloat), [sb, lb] = pb[2].split('/').map(parseFloat);
  return sa === sb && Math.abs(la - lb) <= 0.1 && Math.abs((parseFloat(pa[3]) || 0) - (parseFloat(pb[3]) || 0)) <= 0.05;
};

// Base blocks: [new selector, old selector] inside the new / old lesson. '' = the lesson itself.
const BASES = {
  lesson: ['', ''],
  cases: ['.lesson-cases', '.lesson-item.is-implementation'],
  schemes: ['.lesson-schemes', '.splide-container'],
  examples: ['.lesson-examples', '.lesson-item.is-examples'],
  demo: ['.lesson-demo', '.nav-inner.nav-dark'],
  classic: ['.lesson-classic', '.classic-anim_wrap'],
};

// [name, new selector, old selector, base, checks]. Checks are '+'-joined tokens:
//   box     x / y / w / h and offset size        font   x / y + font / colour / case / text
//   text    box + font / colour / case / text     card   box + border width / style / radius
//   bgi     box + background-image file           bg     box + background colour
//   sticky  box + position / top                  src    box + video source (band-specific)
//   poster  box + image file                      href   box + link target
//   op      box + opacity                         deco   text-decoration line
//   vis     old selector matches several tags (desktop / tablet / mobile): take the displayed one
//   nogeo   skip geometry (old videos with preload=none and no CSS size render at the default 300 px)
//   round   600 px only: allow 2.5 px (Splide rounds the slide width to whole px, the step adds up)
// A row whose element is missing on both sides is skipped (e.g. the link in the easing classic).
const MAP = [
  ['lesson', '', '', 'lesson', 'box+bg'],
  ['visualRow', '.lesson-visual-row', '.hero-animation', 'lesson', 'box'],
  ['starL', '.lesson-star.is-left', '.is-star-xs.is-left', 'lesson', 'bgi'],
  ['visual', '.lesson-visual', '.hero-visual', 'lesson', 'box'],
  ['starR', '.lesson-star.is-right', '.is-star-xs.is-right', 'lesson', 'bgi'],
  ['head', '.lesson-head', '.hero-content', 'lesson', 'box'],
  ['heading', '.lesson-heading', '.flex-display.is-hero', 'lesson', 'box'],
  ['numberBox', '.lesson-number', '.label-1.is-lesson', 'lesson', 'box'],
  // The old number is the stretched flex item itself; ours wraps it, so compare type only.
  ['number', '.lesson-number .heading-md', '.label-1.is-lesson', 'lesson', 'font'],
  ['titleBox', '.lesson-title', '.hero-title', 'lesson', 'box'],
  ['title', '.lesson-title h2', '.hero-title h4', 'lesson', 'text'],
  ['descBox', '.lesson-desc', '.text-wrap.is-hero-desc', 'lesson', 'box'],
  ['desc', '.lesson-desc p', '.is-hero-desc .p2', 'lesson', 'text'],
  ['cases', '.lesson-cases', '.lesson-item.is-implementation', 'lesson', 'box'],
  ['casesHead', '.lesson-cases-head', '.title-wrap.is-implementation', 'cases', 'box'],
  ['casesTitle', '.lesson-cases-head h3', '.title-wrap.is-implementation h3', 'cases', 'text'],
  ['pin', '.lesson-cases-pin', '.sticky-container.is-implementation', 'cases', 'sticky'],
  ['track', '.lesson-cases-track', '.list-wrap.is-implementation', 'cases', 'box'],
  ...[1, 2, 3].flatMap((i) => [
    [`card${i}`, `.lesson-card:nth-child(${i})`, `.card-link:nth-child(${i})`, 'cases', 'card+href'],
    [`media${i}`, `.lesson-card:nth-child(${i}) .lesson-card-media`, `.card-link:nth-child(${i}) .card-video-item`, 'cases', 'card'],
    [`video${i}`, `.lesson-card:nth-child(${i}) video`, `.card-link:nth-child(${i}) video`, 'cases', 'src'],
    [`poster${i}`, `.lesson-card:nth-child(${i}) .lesson-card-poster`, `.card-link:nth-child(${i}) :is(.card-video-img, .a-lesson-img)`, 'cases', 'poster'],
    [`text${i}`, `.lesson-card:nth-child(${i}) .lesson-card-text p`, `.card-link:nth-child(${i}) .p3`, 'cases', 'text'],
    [`view${i}`, `.lesson-card:nth-child(${i}) .lesson-card-btn > div:first-child`, `.card-link:nth-child(${i}) .btn-link > div:first-child`, 'cases', 'text'],
    [`icon${i}`, `.lesson-card:nth-child(${i}) .lesson-card-icon`, `.card-link:nth-child(${i}) .btn-link-icon`, 'cases', 'box'],
  ]),
  ['overlay', '.lesson-cases-overlay', '.overlay-bg', 'cases', 'box'],

  // Easing: schemes slider (Splide on the old side).
  ['schemes', '.lesson-schemes', '.splide-container', 'lesson', 'box'],
  ['sTrack', '.lesson-schemes-track', '.splide__list', 'schemes', 'box'],
  ...[1, 2, 3, 4, 5].flatMap((i) => [
    [`scheme${i}`, `.lesson-scheme:nth-child(${i})`, `.splide__slide:nth-child(${i})`, 'schemes', 'card+round'],
    [`sLottie${i}`, `.lesson-scheme:nth-child(${i}) .lesson-scheme-lottie`, `.splide__slide:nth-child(${i}) .slide-lottie.not-active`, 'schemes', 'box+round'],
    [`sLabel${i}`, `.lesson-scheme:nth-child(${i}) .lesson-scheme-label`, `.splide__slide:nth-child(${i}) .slide-inner-label`, 'schemes', 'text+deco+round'],
  ]),
  ['sPrev', '[data-motion=schemes-prev]', '.splide__arrow--prev', 'schemes', 'card+bg'],
  ['sNext', '[data-motion=schemes-next]', '.splide__arrow--next', 'schemes', 'card+bg'],
  ['sDivider', '.lesson-schemes-divider', '.splide-container .divider', 'schemes', 'box+bg'],
  ['sCaption', '.lesson-schemes-caption', '.hero_wrap', 'schemes', 'box'],
  ['sText', '.lesson-schemes-caption p', '.hero_text', 'schemes', 'text'],

  // Easing: «Let's look at an example».
  ['examples', '.lesson-examples', '.lesson-item.is-examples', 'lesson', 'box'],
  ['exSticky', '.lesson-examples-sticky', '.sticky-container.is-examples', 'examples', 'sticky'],
  ['exStars', '.lesson-examples-stars', '.imgs-wrap.is-anim-stars', 'examples', 'box'],
  ...[1, 2, 3, 4, 5].map((i) => [`exStar${i}`, `.lesson-examples-star:nth-child(${i})`, `.star-vector:nth-child(${i})`, 'examples', 'bgi']),
  ['exLine', '.lesson-examples-line', '.scrolling-text.is-lessons', 'examples', 'box'],
  ['exTitle', '.lesson-examples-title', '.scrolling-text.is-lessons .flex-shrink-none', 'examples', 'text'],

  // Easing: dark demo (6 videos + progress).
  ['demo', '.lesson-demo', '.nav-inner.nav-dark', 'lesson', 'box+bg'],
  ['dSticky', '.lesson-demo-sticky', '.sticky-container.is-examples-2', 'demo', 'sticky'],
  ['dMedia', '.lesson-demo-media', '.example-videos-desktop', 'demo', 'box'],
  ...[1, 2, 3, 4, 5, 6].flatMap((i) => [
    [`dWrap${i}`, `.lesson-demo-video:nth-child(${i})`, `.example-video-${i}`, 'demo', 'box+op'],
    [`dVideo${i}`, `.lesson-demo-video:nth-child(${i})`, `.example-video-${i} video`, 'demo', 'src+vis+nogeo'],
  ]),
  ['dProgress', '.lesson-demo-progress', '.example-progress-bar', 'demo', 'box'],
  ...[1, 2, 3].map((i) => [`dStep${i}`, `.lesson-demo-step:nth-child(${i}) p`, `.progress-bar-item:nth-child(${i}) .progress-bar-title`, 'demo', 'text']),
  // Ticks 2..6 of the new row = small / large marks of the old items 1..3.
  ...[[2, 1, 'small'], [3, 1, 'large'], [4, 2, 'small'], [5, 2, 'large'], [6, 3, 'small']].flatMap(([t, i, s]) => [
    [`dTick${t}`, `.lesson-demo-tick:nth-child(${t})`, `.progress-bar-item:nth-child(${i}) .progress-bar_divider-wrap_${s}`, 'demo', 'box+bg'],
    [`dFill${t}`, `.lesson-demo-tick:nth-child(${t}) .lesson-demo-tick-fill`, `.progress-bar-item:nth-child(${i}) .progress-bar_divider-line_${s}`, 'demo', 'box'],
  ]),
  ['dLine', '.lesson-demo-line', '.progress-bar_line-wrap', 'demo', 'box+bg'],
  ['dLineFill', '.lesson-demo-line-fill', '.progress-bar_line-active', 'demo', 'box+bg'],

  // Easing + delay: «An example from classic animation».
  ['classic', '.lesson-classic', '.classic-anim_wrap', 'lesson', 'box'],
  ['cMask', '.lesson-classic-mask', '.classic-anim_musk', 'classic', 'box'],
  ['cFilmL', '.lesson-classic-film.is-left', '.classic-anim_sideimg.is-left', 'classic', 'sticky+bg+bgi'],
  ['cFilmR', '.lesson-classic-film.is-right', '.classic-anim_sideimg.is-right', 'classic', 'sticky+bg+bgi'],
  ['cBody', '.lesson-classic-body', '.classic-anim_container', 'classic', 'box+bg'],
  ['cHead', '.lesson-classic-head', '.classic-anim_content', 'classic', 'box'],
  ['cTitle', '.lesson-classic-title h3', '.h2-secondary', 'classic', 'text'],
  ['cList', '.lesson-classic-list', '.a-lesson-list', 'classic', 'box'],
  ['cMedia1', '.lesson-classic-list .lesson-classic-media', '.a-lesson-list .a-lesson-item_overflow-hidden', 'classic', 'card'],
  ['cVideo1', '.lesson-classic-list video', '.a-lesson-list video', 'classic', 'src'],
  ['cPoster1', '.lesson-classic-list .lesson-classic-poster', '.a-lesson-list .a-lesson-img', 'classic', 'poster'],
  ['cSteps', '.lesson-classic-steps', '.a-lesson-item_heigh', 'classic', 'box'],
  ['cSticky', '.lesson-classic-sticky', '.a-lesson-item_sticky', 'classic', 'sticky'],
  ['cStepTitle', '.lesson-classic-sticky .is-strong', '.a-lesson-item_sticky .p3-bold', 'classic', 'text'],
  ['cStepText', '.lesson-classic-text p.body-sm:not(.is-strong)', '.a-lesson-item_sticky .a-lesson-text-wrap .p3', 'classic', 'text'],
  ['cLink', '.lesson-classic-link', '.btn-link.is-delay', 'classic', 'href'],
  ['cLinkText', '.lesson-classic-link > div:first-child', '.btn-link.is-delay > div:first-child', 'classic', 'text'],
  ['cMedia2', '.lesson-classic-sticky .lesson-classic-media', '.a-lesson-item_sticky .a-lesson-item_overflow-hidden', 'classic', 'card'],
  ['cVideo2', '.lesson-classic-sticky video', '.a-lesson-item_sticky video', 'classic', 'src'],
  ['cPoster2', '.lesson-classic-sticky .lesson-classic-poster', '.a-lesson-item_sticky .a-lesson-img', 'classic', 'poster'],
  ['cNote', '.lesson-classic-step:nth-child(2) p', '.a-lesson-item_sticky > .a-lesson-item:nth-child(2) .p3', 'classic', 'text'],
];

const b = await chromium.launch({ channel: 'chrome' });
let fails = 0;
for (const vp of VPS) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.m ? IPHONE : undefined });
  const p = await ctx.newPage();
  await p.route(/script\.v33|cdn\.jsdelivr\.net\/gh\/kov-dev/, (r) => r.abort());
  await p.goto(url + '?nocache=' + Date.now(), { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(3000);
  for (const id of IDS) {
  const res = await p.evaluate(([MAP, BASES, id]) => {
    const nl = document.querySelector(`section#${id}-next`);
    const ol = document.querySelector(`section#${id} .lesson`);
    // IX2 writes keyframe-0 transforms inline on the old side (cards y 150 / 300, title scale,
    // stars, marquee): drop them, the new side has no start state without the code.
    ol.querySelectorAll('[style]').forEach((e) => { e.style.transform = ''; });
    // The card offsets (y 150 / 300) survive that reset, so force them off as well.
    ol.querySelectorAll('.card-link, .title-wrap, .list-wrap').forEach((e) => e.style.setProperty('transform', 'none', 'important'));
    const roots = { new: nl, old: ol };
    const base = (side, k) => (BASES[k][side === 'new' ? 0 : 1] ? roots[side].querySelector(BASES[k][side === 'new' ? 0 : 1]) : roots[side]);
    // Band-specific source of a new-side video (code picks it by matchMedia).
    const bandSrc = (e) => (innerWidth <= 479 && e.dataset.srcMobile) || (innerWidth <= 991 && e.dataset.srcTablet) || e.dataset.src || '';
    const m = (side, sel, bk, vis) => {
      const root = base(side, bk);
      if (!root) return null;
      let e = sel ? root.querySelector(sel) : root;
      if (sel && vis && side === 'old') e = [...root.querySelectorAll(sel)].find((v) => getComputedStyle(v).display !== 'none') || e;
      if (!e) return null;
      const s = root.getBoundingClientRect(), r = e.getBoundingClientRect(), cs = getComputedStyle(e);
      // IX2 keeps rewriting the old cards' start offset (y 1.5rem / 3rem) every frame; the new
      // side gets it from initLessons(). Measure both in the untransformed layout.
      const card = e.closest('.card-link, .lesson-card');
      const ty = card ? new DOMMatrix(getComputedStyle(card).transform).m42 : 0;
      const src = e.tagName === 'VIDEO' ? (side === 'new' ? bandSrc(e) : e.currentSrc || e.querySelector('source')?.src || '') : e.currentSrc || e.getAttribute('src') || '';
      return {
        start: +ty.toFixed(1), x: +(r.left - s.left).toFixed(1), y: +(r.top - s.top - ty).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
        ow: e.offsetWidth, oh: e.offsetHeight, tf: cs.transform, txt: e.textContent.trim().replace(/\s+/g, ' ').toUpperCase(),
        f: `${cs.fontFamily.split(',')[0]} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.letterSpacing}`, tt: cs.textTransform,
        c: cs.color, bg: cs.backgroundColor, bd: `${cs.borderTopWidth} ${cs.borderTopStyle}`, rad: cs.borderTopLeftRadius,
        bgi: (cs.backgroundImage.match(/[^/_]+_([^/]+?)"?\)$/) || [, ''])[1], pos: cs.position, top: cs.top, op: cs.opacity,
        deco: cs.textDecorationLine, src, href: e.closest('a')?.href || '', tgt: e.closest('a')?.target || '',
      };
    };
    return MAP.map(([k, ns, os, bk, checks]) => ({ k, n: m('new', ns, bk, checks.includes('vis')), o: m('old', os, bk, checks.includes('vis')) }));
  }, [MAP, BASES, id]);
  const rows = [];
  for (const [i, { k, n, o }] of res.entries()) {
    const ck = MAP[i][4].split('+');
    if (!n && !o) continue; // block not in this lesson (or optional part absent on both sides)
    // The overlay only exists on the old lessons that carry a classic block (easing, delay).
    if (k === 'overlay' && n && !o) continue;
    if (!n || !o) { rows.push(`✗ ${k}: MISSING new=${!!n} old=${!!o}`); fails++; continue; }
    const font = ck.includes('font');
    const geo = ck.includes('nogeo') ? [] : font ? ['x', 'y'] : ['x', 'y', 'w', 'h'];
    const dx = Math.max(0, ...geo.map((g) => Math.abs(n[g] - o[g])), ...(font || !geo.length ? [] : [Math.abs(n.ow - o.ow), Math.abs(n.oh - o.oh)]));
    const tol = vp.n === '600' && ck.includes('round') ? 2.5 : 1;
    const diffs = [];
    if (ck.includes('text') || font) {
      if (!sameFont(n.f, o.f)) diffs.push(`FONT new[${n.f}] old[${o.f}]`);
      if (n.c !== o.c || n.tt !== o.tt) diffs.push(`COLOR/CASE ${n.c} ${n.tt} vs ${o.c} ${o.tt}`);
      if (n.txt !== o.txt) diffs.push(`TEXT "${n.txt.slice(0, 40)}" vs "${o.txt.slice(0, 40)}"`);
    }
    if (ck.includes('deco') && n.deco !== o.deco) diffs.push(`DECO ${n.deco} vs ${o.deco}`);
    if (ck.includes('card') && (n.bd !== o.bd || n.rad !== o.rad)) diffs.push(`BORDER ${n.bd} r${n.rad} vs ${o.bd} r${o.rad}`);
    if (ck.includes('bgi') && n.bgi !== o.bgi) diffs.push(`BGI ${n.bgi} vs ${o.bgi}`);
    if (ck.includes('bg') && n.bg !== o.bg) diffs.push(`BG ${n.bg} vs ${o.bg}`);
    if (ck.includes('op') && n.op !== o.op) diffs.push(`OPACITY ${n.op} vs ${o.op}`);
    if (ck.includes('sticky') && (n.pos !== o.pos || n.top !== o.top)) diffs.push(`STICKY ${n.pos} ${n.top} vs ${o.pos} ${o.top}`);
    if (ck.includes('src') && decodeURI(n.src) !== decodeURI(o.src)) diffs.push(`SRC ${n.src.split('/').pop()} vs ${o.src.split('/').pop()}`);
    if (ck.includes('poster') && n.src.split('_').slice(1).join('_') !== o.src.split('_').slice(1).join('_')) diffs.push(`POSTER ${n.src.split('/').pop()} vs ${o.src.split('/').pop()}`);
    if (ck.includes('href') && (n.href !== o.href || n.tgt !== o.tgt)) diffs.push(`HREF ${n.href} ${n.tgt} vs ${o.href} ${o.tgt}`);
    if (n.tf !== o.tf && !/^card\d$/.test(k)) diffs.push(`TF ${n.tf} vs ${o.tf}`);
    const note = /^card\d$/.test(k) && o.start ? ` (IX2 start y ${o.start} on old — set by code)` : '';
    const flag = dx > tol || diffs.length;
    if (flag) fails++;
    rows.push(`${flag ? '✗' : '✓'} ${k}: Δ${dx.toFixed(1)} new ${n.x},${n.y} ${n.w}x${n.h} | old ${o.x},${o.y} ${o.w}x${o.h} ${diffs.join(' ')}${note}`);
  }
  const bad = rows.filter((r) => r.startsWith('✗'));
  const maxD = Math.max(0, ...rows.map((r) => +(r.match(/Δ([\d.]+)/) || [, 0])[1]).filter((d) => d < 50));
  console.log(`== ${vp.n} ${id}: ${rows.length - bad.length}/${rows.length} ok, max Δ ${maxD}` + (bad.length ? '\n' + bad.join('\n') : ''));
  }
  await p.addStyleTag({ content: '.section-preloader, .loader, .loader-wrap { display: none !important; } html, body { overflow: visible !important; }' });
  const SHOTS = [
    ['new', '#easing-next'], ['old', 'section#easing'],
    ['new-schemes', '#easing-next .lesson-schemes'], ['old-schemes', 'section#easing .splide-container'],
    ['new-demo', '#easing-next .lesson-demo'], ['old-demo', 'section#easing .nav-inner.nav-dark'],
    ['new-classic', '#delay-next .lesson-classic'], ['old-classic', 'section#delay .classic-anim_wrap'],
    ['new-cases', '#easing-next .lesson-cases-pin'], ['old-cases', 'section#easing .sticky-container.is-implementation'],
  ];
  for (const [tag, sel] of SHOTS) {
    await p.evaluate((sel) => document.querySelector(sel).scrollIntoView(), sel);
    await p.waitForTimeout(1500); // lazy posters + repaint after a long jump
    await p.screenshot({ path: `${out}/lessons-${vp.n}-${tag}.png` });
  }
  await ctx.close();
}
await b.close();
console.log('flags:', fails);
