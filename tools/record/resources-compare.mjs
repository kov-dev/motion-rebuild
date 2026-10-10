// Static layout compare on staging: new `section-resources` (#resources-next) vs the old #resources
// (same page, so fonts/rem are identical). Old script.v33 and our module are blocked, so the old pin is
// not built and both sections sit in their natural (unpinned) layout at the same scroll position.
// Every rect is relative to a base block that exists on both sides: the pin box (.res-pin / .resources)
// or the section itself (clouds hang above the section top). Lists are compared row by row.
// Images: the new rows carry their own CMS image, initResources() moves them into the stack; the script
// does the same move, then pairs each new image with the old stack item of the same file and checks that
// the image of row k belongs to row k (file name vs link host — the old courses images list is reversed).
// Usage: node resources-compare.mjs [url] [outDir]
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

const sameFont = (a, b) => {
  const pa = a.split(' '), pb = b.split(' ');
  if (pa.slice(0, 2).join() !== pb.slice(0, 2).join()) return false;
  const [sa, la] = pa[2].split('/').map(parseFloat), [sb, lb] = pb[2].split('/').map(parseFloat);
  return sa === sb && Math.abs(la - lb) <= 0.1 && Math.abs((parseFloat(pa[3]) || 0) - (parseFloat(pb[3]) || 0)) <= 0.05;
};

// Base blocks: [new selector, old selector], relative to the document.
const BASES = {
  pin: ['#resources-next .res-pin', 'section#resources .resources'],
  sec: ['#resources-next', 'section#resources'],
};

// [name, new selector, old selector, base, checks]. Selectors are relative to the base. Checks are '+'-joined:
//   box   x / y / w / h and offset size          font  x / y + font / colour / case / text
//   text  box + font / colour / case / text      bg    box + background colour
//   bgi   box + background-image file            bdb   box + bottom border width / style
//   card  box + radius                            href  box + link target
//   tf    box + computed transform               now   x / y / h only (the old track is block-wide, ours max-content)
//   nogeo skip geometry (content rows paired by link, not by position)
const ROWS = (l, n) => Array.from({ length: n }, (_, k) => k + 1).flatMap((k) => {
  // Geometry pairs rows by position (data-cmp), content pairs them by link (data-cmph), so a different
  // list order is reported once (ORDER) instead of on every row.
  const ni = `.res-item[data-cmp="l${l}r${k}"]`, oi = `.resources-item[data-cmp="l${l}r${k}"]`, oh = `.resources-item[data-cmph="l${l}r${k}"]`;
  return [
    [`l${l}r${k}`, ni, oi, 'pin', 'bdb'],
    [`l${l}r${k}link`, `${ni} .res-link`, `${oi} .resources-link`, 'pin', 'box'],
    [`l${l}r${k}href`, `${ni} .res-link`, `${oh} .resources-link`, 'pin', 'href+nogeo'],
    // Name width follows the text, so it is not compared here (text and letter-spacing are checked by content).
    [`l${l}r${k}name`, `${ni} .res-name`, `${oi} .resources-item__name`, 'pin', 'tf+now'],
    [`l${l}r${k}dot`, `${ni} .res-dot`, `${oi} .resources-item__dot`, 'pin', 'bg+card'],
    [`l${l}r${k}textBox`, `${ni} .res-text p`, `${oi} .resources-item__text .p3`, 'pin', 'now'],
    [`l${l}r${k}text`, `${ni} .res-text p`, `${oh} .resources-item__text .p3`, 'pin', 'text+nogeo'],
    [`l${l}r${k}view`, `${ni} .res-view`, `${oi} .resources-item__button`, 'pin', 'box'],
    [`l${l}r${k}viewText`, `${ni} .res-view > div:first-child`, `${oi} .resources-item__button > div:first-child`, 'pin', 'text'],
    [`l${l}r${k}icon`, `${ni} .res-icon`, `${oi} .btn-link-icon`, 'pin', 'box'],
  ];
});
const MAP = [
  ['section', '', '', 'sec', 'box'],
  ['pin', '', '', 'pin', 'box+bg'],
  ...['first', 'second', 'third', 'fourth'].map((c) => [`cloud-${c}`, `.res-cloud.is-${c}`, `.resources-cloud-item.${c}`, 'sec', 'bgi']),
  ['track', '.res-track', '.resources-track', 'pin', 'now'],
  ['intro', '.res-intro', '.resources-main', 'pin', 'box'],
  ['titles', '.res-titles', '.resources-titles', 'pin', 'text'],
  ...[1, 2, 3].flatMap((i) => [
    [`row${i}`, `.res-row:nth-child(${i})`, `.arrow-title-wrap:nth-child(${i})`, 'pin', 'box'],
    [`word${i}`, `.res-row:nth-child(${i}) .res-word`, `.arrow-title-wrap:nth-child(${i}) > div:first-child`, 'pin', 'text'],
    [`shutter${i}`, `.res-row:nth-child(${i}) .res-shutter`, `.arrow-title-wrap:nth-child(${i}) .resources-arrow`, 'pin', 'bg'],
    [`arrow${i}`, `.res-row:nth-child(${i}) .res-arrow`, `.arrow-title-wrap:nth-child(${i}) .resources-arrow-icon`, 'pin', 'box'],
    [`arrowSvg${i}`, `.res-row:nth-child(${i}) .res-arrow svg`, `.arrow-title-wrap:nth-child(${i}) .resources-arrow-icon svg`, 'pin', 'box'],
  ]),
  ['student', '.res-student', '.resources-student', 'pin', 'text'],
  ['studentText', '.res-student-text', '.text-block-3', 'pin', 'tf'],
  ['main', '.res-main', '.resources-full', 'pin', 'box'],
  ['layout', '.res-layout', '.resources-wrapp', 'pin', 'box'],
  ['stack', '.res-stack', '.resources-images', 'pin', 'box'],
  ['content', '.res-content', '.resources-content', 'pin', 'box'],
  ['tabs', '.res-tabs', '.resources-header', 'pin', 'bg'],
  ...[1, 2].flatMap((i) => [
    [`tab${i}`, `.res-tab:nth-child(${i})`, `.resources-header__item:nth-child(${i})`, 'pin', 'box'],
    [`tabTitle${i}`, `.res-tab:nth-child(${i}) h3`, `.resources-header__item:nth-child(${i}) h5`, 'pin', 'text'],
    [`count${i}`, `.res-tab:nth-child(${i}) .res-count`, `.resources-header__item:nth-child(${i}) .resources-header__count`, 'pin', 'text+bg+card'],
  ]),
  ['lists', '.res-lists', '.resources-lists', 'pin', 'box'],
  ['list1', '.res-list:nth-child(1)', '.resources-list:nth-child(1)', 'pin', 'box'],
  ['list2', '.res-list:nth-child(2)', '.resources-list:nth-child(2)', 'pin', 'box'],
  ...ROWS(1, 10), ...ROWS(2, 4),
  ['overlay', '.res-overlay', '.resources-overlay', 'pin', 'box'],
];

const b = await chromium.launch({ channel: 'chrome' });
let fails = 0;
for (const vp of VPS) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.m ? IPHONE : undefined });
  const p = await ctx.newPage();
  await p.route(/script\.v33|cdn\.jsdelivr\.net\/gh\/kov-dev/, (r) => r.abort());
  await p.goto(url + '?nocache=' + Date.now(), { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(2000);
  // Load every image of both stacks (they are lazy and far down the page), then do what
  // initResources() does with the new ones: move each row image into the stack.
  await p.evaluate(async () => {
    const imgs = [...document.querySelectorAll('#resources-next .res-image, section#resources .resources-images__item img')];
    imgs.forEach((i) => { i.loading = 'eager'; });
    await Promise.all(imgs.map((i) => (i.complete && i.naturalWidth ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 15000); }))));
    const stack = document.querySelector('#resources-next .res-stack');
    document.querySelectorAll('#resources-next .res-list').forEach((l, li) => l.querySelectorAll('.res-item').forEach((it, k) => {
      const img = it.querySelector('.res-image');
      if (img) { img.dataset.list = li; img.dataset.index = k; img.dataset.host = new URL(it.querySelector('a').href).hostname; stack.append(img); }
    }));
    // Pair rows by link: new row k of list l and the old row with the same href get the same data-cmp.
    document.querySelectorAll('#resources-next .res-list').forEach((l, li) => {
      const olds = [...document.querySelectorAll('section#resources .resources-list')[li].querySelectorAll('.resources-item')];
      l.querySelectorAll('.res-item').forEach((it, k) => {
        const tag = `l${li + 1}r${k + 1}`, href = it.querySelector('a').href;
        it.dataset.cmp = tag;
        if (olds[k]) olds[k].dataset.cmp = tag;
        const o = olds.find((e) => e.querySelector('a').href === href);
        if (o) o.dataset.cmph = tag;
      });
    });
    // IX2 writes keyframe-0 transforms inline on the old clouds / overlay; the new side has none without the code.
    document.querySelectorAll('section#resources [style], .resources-clouds-list [style]').forEach((e) => { e.style.transform = ''; });
  });
  const res = await p.evaluate((MAP_BASES) => {
    const [MAP, BASES] = MAP_BASES;
    const base = (side, k) => document.querySelector(BASES[k][side === 'new' ? 0 : 1]);
    const root = (side, k) => (k === 'sec' && side === 'old' ? document : base(side, k));
    const m = (side, sel, bk) => {
      const b = base(side, bk);
      if (!b) return null;
      // Old clouds live at the end of the old Lessons wrapper, not inside the old section.
      const e = sel ? root(side, bk).querySelector(sel) : b;
      if (!e) return null;
      const s = b.getBoundingClientRect(), r = e.getBoundingClientRect(), cs = getComputedStyle(e);
      return {
        x: +(r.left - s.left).toFixed(1), y: +(r.top - s.top).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
        ow: e.offsetWidth, oh: e.offsetHeight, tf: cs.transform, txt: e.textContent.replace(/\s+/g, '').toUpperCase(), // old markup has whitespace between title rows, ours not
        f: `${cs.fontFamily.split(',')[0]} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.letterSpacing}`, tt: cs.textTransform,
        c: cs.color, bg: cs.backgroundColor, bdb: `${cs.borderBottomWidth} ${cs.borderBottomStyle}`, rad: cs.borderTopLeftRadius,
        bgi: (cs.backgroundImage.match(/[^/_]+_([^/]+?)"?\)$/) || [, ''])[1], href: e.closest('a')?.href || e.querySelector('a')?.href || '',
        tgt: e.closest('a')?.target || '',
      };
    };
    const rows = MAP.map(([k, ns, os, bk]) => ({ k, n: m('new', ns, bk), o: m('old', os, bk) }));
    // Images: new stack image ↔ old stack item with the same file.
    const ps = document.querySelector(BASES.pin[0]).getBoundingClientRect(), po = document.querySelector(BASES.pin[1]).getBoundingClientRect();
    // srcset variants are double-encoded (%2540 → %40 → @).
    const file = (src) => {
      let f = src.split('/').pop();
      while (/%[0-9a-f]{2}/i.test(f)) f = decodeURIComponent(f);
      return f.replace(/^[0-9a-f]+_/, '').replace(/-p-\d+/, '');
    };
    const olds = [...document.querySelectorAll('section#resources .resources-images__item')];
    const imgs = [...document.querySelectorAll('#resources-next .res-stack .res-image')].map((i) => {
      const f = file(i.currentSrc || i.src), o = olds.find((d) => file(d.querySelector('img').currentSrc || d.querySelector('img').src) === f);
      const r = i.getBoundingClientRect(), ro = o?.getBoundingClientRect(), label = i.dataset.host.replace(/^www\./, '').split('.')[0];
      return {
        k: `img${+i.dataset.list + 1}.${+i.dataset.index + 1}`, f, owner: f.toLowerCase().includes(label), label,
        n: { x: r.left - ps.left, y: r.top - ps.top, w: r.width, h: r.height, rad: getComputedStyle(i).borderTopLeftRadius, op: getComputedStyle(i).opacity },
        o: o && { x: ro.left - po.left, y: ro.top - po.top, w: ro.width, h: ro.height, rad: getComputedStyle(o).borderTopLeftRadius, op: getComputedStyle(o).opacity },
      };
    });
    const order = [...document.querySelectorAll('#resources-next .res-list')].map((l, li) => ({
      n: [...l.querySelectorAll('.res-link')].map((a) => new URL(a.href).hostname),
      o: [...document.querySelectorAll('section#resources .resources-list')[li].querySelectorAll('.resources-link')].map((a) => new URL(a.href).hostname),
    }));
    return { rows, imgs, order };
  }, [MAP, BASES]);
  const lines = [];
  for (const [i, { k, n, o }] of res.rows.entries()) {
    const ck = MAP[i][4].split('+');
    if (!n || !o) { lines.push(`✗ ${k}: MISSING new=${!!n} old=${!!o}`); fails++; continue; }
    const font = ck.includes('font');
    const geo = ck.includes('nogeo') ? [] : ck.includes('now') ? ['x', 'y', 'h'] : font ? ['x', 'y'] : ['x', 'y', 'w', 'h'];
    const dx = Math.max(0, ...geo.map((g) => Math.abs(n[g] - o[g])), ...(font || !geo.length || ck.includes('now') ? [] : [Math.abs(n.ow - o.ow), Math.abs(n.oh - o.oh)]));
    const diffs = [];
    if (ck.includes('text') || font) {
      if (!sameFont(n.f, o.f)) diffs.push(`FONT new[${n.f}] old[${o.f}]`);
      if (n.c !== o.c || n.tt !== o.tt) diffs.push(`COLOR/CASE ${n.c} ${n.tt} vs ${o.c} ${o.tt}`);
      if (n.txt !== o.txt) diffs.push(`TEXT "${n.txt.slice(0, 40)}" vs "${o.txt.slice(0, 40)}"`);
    }
    if (ck.includes('bgi') && n.bgi !== o.bgi) diffs.push(`BGI ${n.bgi} vs ${o.bgi}`);
    if (ck.includes('bg') && n.bg !== o.bg) diffs.push(`BG ${n.bg} vs ${o.bg}`);
    if (ck.includes('bdb') && n.bdb !== o.bdb) diffs.push(`BORDER-B ${n.bdb} vs ${o.bdb}`);
    if (ck.includes('card') && n.rad !== o.rad) diffs.push(`RADIUS ${n.rad} vs ${o.rad}`);
    if (ck.includes('href') && (n.href !== o.href || n.tgt !== o.tgt)) diffs.push(`HREF ${n.href} ${n.tgt} vs ${o.href} ${o.tgt}`);
    if (ck.includes('tf') && n.tf !== o.tf) diffs.push(`TF ${n.tf} vs ${o.tf}`);
    const flag = dx > 1 || diffs.length;
    if (flag) fails++;
    lines.push(`${flag ? '✗' : '✓'} ${k}: Δ${dx.toFixed(1)} new ${n.x},${n.y} ${n.w}x${n.h} | old ${o.x},${o.y} ${o.w}x${o.h} ${diffs.join(' ')}`);
  }
  for (const im of res.imgs) {
    const diffs = [];
    if (!im.o) diffs.push(`NO OLD ITEM for ${im.f}`);
    if (!im.owner) diffs.push(`WRONG ROW: ${im.f} is not ${im.label}`);
    let dx = 0;
    if (im.o) {
      dx = Math.max(...['x', 'y', 'w', 'h'].map((g) => Math.abs(im.n[g] - im.o[g])));
      if (im.n.rad !== im.o.rad) diffs.push(`RADIUS ${im.n.rad} vs ${im.o.rad}`);
      if (im.n.op !== im.o.op) diffs.push(`OPACITY ${im.n.op} vs ${im.o.op}`);
    }
    const flag = dx > 1 || diffs.length;
    if (flag) fails++;
    lines.push(`${flag ? '✗' : '✓'} ${im.k} ${im.f}: Δ${dx.toFixed(1)} ${im.n.w.toFixed(1)}x${im.n.h.toFixed(1)} ${diffs.join(' ')}`);
  }
  for (const [li, { n, o }] of res.order.entries()) {
    const ok = n.join() === o.join();
    if (!ok) fails++;
    lines.push(`${ok ? '✓' : '✗'} order list${li + 1}: ${ok ? n.length + ' rows' : `ORDER new [${n.join(', ')}] vs old [${o.join(', ')}]`}`);
  }
  const bad = lines.filter((r) => r.startsWith('✗'));
  const maxD = Math.max(0, ...lines.map((r) => +(r.match(/Δ([\d.]+)/) || [, 0])[1]).filter((d) => d < 50));
  console.log(`== ${vp.n}: ${lines.length - bad.length}/${lines.length} ok, max Δ ${maxD}` + (bad.length ? '\n' + bad.join('\n') : ''));
  if (process.env.VERBOSE) console.log(lines.join('\n'));

  // Screenshots: intro (titles + clouds above), then the lists view (track shifted by hand on both sides,
  // first image of each stack shown).
  await p.addStyleTag({ content: '.section-preloader, .loader, .loader-wrap { display: none !important; } html, body { overflow: visible !important; }' });
  for (const [tag, sel] of [['new', '#resources-next'], ['old', 'section#resources']]) {
    await p.evaluate((sel) => window.scrollTo(0, document.querySelector(sel).getBoundingClientRect().top + scrollY - innerHeight * 0.3), sel);
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${out}/resources-${vp.n}-${tag}-intro.png` });
    await p.evaluate((sel) => {
      const sec = document.querySelector(sel), track = sec.querySelector('.res-track, .resources-track'), pin = sec.querySelector('.res-pin, .resources');
      track.style.transform = `translateX(${-(pin.scrollWidth - innerWidth)}px)`;
      const first = sec.querySelector('.res-stack .res-image, .resources-images__item');
      if (first) first.style.opacity = 1;
      window.scrollTo(0, pin.getBoundingClientRect().top + scrollY);
    }, sel);
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${out}/resources-${vp.n}-${tag}-lists.png` });
  }
  await ctx.close();
}
await b.close();
console.log('flags:', fails);
