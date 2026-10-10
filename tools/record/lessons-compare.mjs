// Static layout compare on staging: new `lesson-section` instances (`#<id>-next`) vs old `#<id>`
// (same page, so fonts/rem are identical). Hero rects are relative to the lesson top-left,
// Implementation rects to the cases block (the old easing has slider/examples/demo between
// them, the new one has an empty slot there). Page stays at scrollY 0, so sticky blocks sit
// at their natural positions on both sides.
// Usage: node lessons-compare.mjs [url] [outDir] [ids,comma-separated]
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] || 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const out = process.argv[3] || '.';
fs.mkdirSync(out, { recursive: true });
const IDS = (process.argv[4] || 'easing,delay,fade,morph,masking,dimension,parallax,zoom').split(',');
// Lessons without one-off blocks: their whole height must match too.
const PLAIN = ['fade', 'morph', 'masking', 'dimension', 'parallax', 'zoom'];
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

// [name, new selector, old selector, base ('lesson' | 'cases'), kind]
const MAP = [
  ['lesson', '', '', 'lesson', 'box'],
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
  ['cases', '', '', 'cases', 'box'],
  ['casesHead', '.lesson-cases-head', '.title-wrap.is-implementation', 'cases', 'box'],
  ['casesTitle', '.lesson-cases-head h3', '.title-wrap.is-implementation h3', 'cases', 'text'],
  ['pin', '.lesson-cases-pin', '.sticky-container.is-implementation', 'cases', 'box'],
  ['track', '.lesson-cases-track', '.list-wrap.is-implementation', 'cases', 'box'],
  ...[1, 2, 3].flatMap((i) => [
    [`card${i}`, `.lesson-card:nth-child(${i})`, `.card-link:nth-child(${i})`, 'cases', 'card'],
    [`media${i}`, `.lesson-card:nth-child(${i}) .lesson-card-media`, `.card-link:nth-child(${i}) .card-video-item`, 'cases', 'card'],
    [`video${i}`, `.lesson-card:nth-child(${i}) video`, `.card-link:nth-child(${i}) video`, 'cases', 'box'],
    [`poster${i}`, `.lesson-card:nth-child(${i}) .lesson-card-poster`, `.card-link:nth-child(${i}) :is(.card-video-img, .a-lesson-img)`, 'cases', 'box'],
    [`text${i}`, `.lesson-card:nth-child(${i}) .lesson-card-text p`, `.card-link:nth-child(${i}) .p3`, 'cases', 'text'],
    [`view${i}`, `.lesson-card:nth-child(${i}) .lesson-card-btn > div:first-child`, `.card-link:nth-child(${i}) .btn-link > div:first-child`, 'cases', 'text'],
    [`icon${i}`, `.lesson-card:nth-child(${i}) .lesson-card-icon`, `.card-link:nth-child(${i}) .btn-link-icon`, 'cases', 'box'],
  ]),
  ['overlay', '.lesson-cases-overlay', '.overlay-bg', 'cases', 'box'],
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
  const res = await p.evaluate(([MAP, id]) => {
    const nl = document.querySelector(`section#${id}-next`);
    const ol = document.querySelector(`section#${id} .lesson`);
    // IX2 writes keyframe-0 transforms inline on the old side (cards y 150 / 300, title scale):
    // drop them, the new side has no start state without the code.
    ol.querySelectorAll('[style]').forEach((e) => { e.style.transform = ''; });
    // The card offsets (y 150 / 300) survive that reset, so force them off as well.
    ol.querySelectorAll('.card-link, .title-wrap, .list-wrap').forEach((e) => e.style.setProperty('transform', 'none', 'important'));
    const bases = {
      new: { lesson: nl, cases: nl.querySelector('.lesson-cases') },
      old: { lesson: ol, cases: ol.querySelector('.lesson-item.is-implementation') },
    };
    const m = (side, sel, base) => {
      const root = bases[side][base];
      const e = sel ? root.querySelector(sel) : root;
      if (!e) return null;
      const s = root.getBoundingClientRect(), r = e.getBoundingClientRect(), cs = getComputedStyle(e);
      // IX2 keeps rewriting the old cards' start offset (y 1.5rem / 3rem) every frame; the new
      // side gets it from initLessons(). Measure both in the untransformed layout.
      const card = e.closest('.card-link, .lesson-card');
      const ty = card ? new DOMMatrix(getComputedStyle(card).transform).m42 : 0;
      return {
        start: +ty.toFixed(1), x: +(r.left - s.left).toFixed(1), y: +(r.top - s.top - ty).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
        ow: e.offsetWidth, oh: e.offsetHeight, tf: cs.transform, txt: e.textContent.trim().replace(/\s+/g, ' ').toUpperCase(),
        f: `${cs.fontFamily.split(',')[0]} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.letterSpacing}`, tt: cs.textTransform,
        c: cs.color, bg: cs.backgroundColor, bd: `${cs.borderTopWidth} ${cs.borderTopStyle}`, rad: cs.borderTopLeftRadius,
        bgi: (cs.backgroundImage.match(/[^/_]+_([^/]+?)"?\)$/) || [, ''])[1], pos: cs.position, top: cs.top, ov: cs.overflow,
        fit: cs.objectFit, src: e.currentSrc || e.getAttribute('data-src') || e.querySelector?.('source')?.src || '',
        href: e.closest('a')?.href || '', tgt: e.closest('a')?.target || '',
      };
    };
    return MAP.map(([k, ns, os, base]) => ({ k, n: m('new', ns, base), o: m('old', os, base) }));
  }, [MAP, id]);
  const rows = [];
  for (const [i, { k, n, o }] of res.entries()) {
    const kind = MAP[i][4];
    // The overlay only exists on the old lessons that carry a classic block (easing, delay).
    if (k === 'overlay' && n && !o) continue;
    if (!n || !o) { rows.push(`✗ ${k}: MISSING new=${!!n} old=${!!o}`); fails++; continue; }
    // Block heights legitimately differ for the lesson root (old easing carries extras + classic).
    const full = PLAIN.includes(id);
    const geo = k === 'lesson' && !full ? ['x', 'w'] : kind === 'font' ? ['x', 'y'] : ['x', 'y', 'w', 'h'];
    const dx = Math.max(...geo.map((g) => Math.abs(n[g] - o[g])), ...((k === 'lesson' && !full) || kind === 'font' ? [] : [Math.abs(n.ow - o.ow), Math.abs(n.oh - o.oh)]));
    const diffs = [];
    if (kind === 'text' || kind === 'font') {
      if (!sameFont(n.f, o.f)) diffs.push(`FONT new[${n.f}] old[${o.f}]`);
      if (n.c !== o.c || n.tt !== o.tt) diffs.push(`COLOR/CASE ${n.c} ${n.tt} vs ${o.c} ${o.tt}`);
      if (n.txt !== o.txt) diffs.push(`TEXT "${n.txt.slice(0, 40)}" vs "${o.txt.slice(0, 40)}"`);
    }
    if (kind === 'card' && (n.bd !== o.bd || n.rad !== o.rad)) diffs.push(`BORDER ${n.bd} r${n.rad} vs ${o.bd} r${o.rad}`);
    if (kind === 'bgi' && n.bgi !== o.bgi) diffs.push(`BGI ${n.bgi} vs ${o.bgi}`);
    if (k === 'lesson' && (n.bg !== o.bg || n.bd !== o.bd)) diffs.push(`BG ${n.bg} ${n.bd} vs ${o.bg} ${o.bd}`);
    if (k === 'pin' && (n.pos !== o.pos || n.top !== o.top)) diffs.push(`STICKY ${n.pos} ${n.top} vs ${o.pos} ${o.top}`);
    if (/^video\d$/.test(k) && decodeURI(n.src) !== decodeURI(o.src)) diffs.push(`SRC ${n.src.split('/').pop()} vs ${o.src.split('/').pop()}`);
    if (/^poster\d$/.test(k) && n.src.split('_').slice(1).join('_') !== o.src.split('_').slice(1).join('_')) diffs.push(`POSTER ${n.src.split('/').pop()} vs ${o.src.split('/').pop()}`);
    if (/^card\d$/.test(k) && (n.href !== o.href || n.tgt !== o.tgt)) diffs.push(`HREF ${n.href} ${n.tgt} vs ${o.href} ${o.tgt}`);
    if (n.tf !== o.tf && !/^card\d$/.test(k)) diffs.push(`TF ${n.tf} vs ${o.tf}`);
    const note = /^card\d$/.test(k) && o.start ? ` (IX2 start y ${o.start} on old — set by code)` : '';
    const flag = dx > 1 || diffs.length;
    if (flag) fails++;
    rows.push(`${flag ? '✗' : '✓'} ${k}: Δ${dx.toFixed(1)} new ${n.x},${n.y} ${n.w}x${n.h} | old ${o.x},${o.y} ${o.w}x${o.h} ${diffs.join(' ')}${note}`);
  }
  const bad = rows.filter((r) => r.startsWith('✗'));
  const maxD = Math.max(...rows.map((r) => +(r.match(/Δ([\d.]+)/) || [, 0])[1]).filter((d) => d < 50));
  console.log(`== ${vp.n} ${id}: ${rows.length - bad.length}/${rows.length} ok, max Δ ${maxD}` + (bad.length ? '\n' + bad.join('\n') : ''));
  }
  await p.addStyleTag({ content: '.section-preloader, .loader, .loader-wrap { display: none !important; } html, body { overflow: visible !important; }' });
  for (const [tag, sel] of [['new', '#easing-next'], ['old', 'section#easing'], ['new-cases', '#easing-next .lesson-cases-pin'], ['old-cases', 'section#easing .sticky-container.is-implementation']]) {
    await p.evaluate((sel) => document.querySelector(sel).scrollIntoView(), sel);
    await p.waitForTimeout(1500); // lazy posters + repaint after a long jump
    await p.screenshot({ path: `${out}/lessons-${vp.n}-${tag}.png` });
  }
  await ctx.close();
}
await b.close();
console.log('flags:', fails);
