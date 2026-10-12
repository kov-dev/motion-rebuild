// Legacy removal step 4: is anything on the staging page still held by the old `main-css` embed?
// The *-compare scripts measured each new section against the old one on the same page, and the old sections are gone,
// so this measures the page against itself: once with the embed (before its removal) and once without (after).
//   inventory — every selector of the embed (pseudo-classes / pseudo-elements stripped) against the DOM with JS on,
//               after a scroll to the end and back (lazy classes, Lenis classes, video sources); a selector with matches
//               is a rule that may still style something
//   snapshot  — JS off (no preloader, no pins, no tweens): rect + a set of computed properties of every element in
//               body (and its ::before / ::after), plus html font-size and the root scrollbar width
// Usage: node main-css-diff.mjs <out-dir> snapshot <tag> [1440|768|600|375 …]   → <out-dir>/<tag>-<band>.json
//        node main-css-diff.mjs <out-dir> diff <tagA> <tagB> [bands…]          → Δ per element, 0 = identical
//        node main-css-diff.mjs <out-dir> inventory [bands…]                   → selectors with matches
// PAGE=styleguide (env) — snapshot / inventory another staging path instead of Home (session 38, style cleanup)
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const [out, mode, ...rest] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const VPS = { 1440: { w: 1440, h: 900, m: false }, 768: { w: 768, h: 1024, m: true }, 600: { w: 600, h: 900, m: true }, 375: { w: 375, h: 812, m: true } };
const bandsOf = (a) => (a.length ? a : ['1440', '768', '600', '375']);
const PROPS = ['display', 'position', 'visibility', 'opacity', 'transform', 'overflow-x', 'overflow-y', 'clip-path', '-webkit-mask-image',
  'pointer-events', 'z-index', 'font-size', 'line-height', 'letter-spacing', 'text-decoration-line', 'color', 'background-color',
  'background-image', 'border-top-width', 'border-top-color', 'width', 'height', 'top', 'left', 'animation-name', 'transition-property',
  'transition-duration', 'font-family', 'font-weight', 'user-select', 'scroll-behavior', 'scrollbar-width', '-webkit-tap-highlight-color'];

const open = async (b, band, js) => {
  const vp = VPS[band];
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, javaScriptEnabled: js, ...(vp.m ? { isMobile: true, hasTouch: true, userAgent: UA } : {}) });
  const p = await ctx.newPage();
  await p.goto(STAGING + (process.env.PAGE || '') + '?nocache=' + Date.now(), { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(1500);
  return { ctx, p };
};

const b = await chromium.launch({ channel: 'chrome' });

if (mode === 'snapshot') {
  const [tag, ...bands] = rest;
  for (const band of bandsOf(bands)) {
    const { ctx, p } = await open(b, band, false);
    const data = await p.evaluate((PROPS) => {
      const embed = document.querySelector('.main-css');
      const pick = (cs) => Object.fromEntries(PROPS.map((k) => [k, cs.getPropertyValue(k)]));
      const rows = [];
      for (const el of document.body.querySelectorAll('*')) {
        if (embed && (el === embed || embed.contains(el))) continue;
        if (/^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName)) continue;
        const r = el.getBoundingClientRect();
        const pseudo = {};
        for (const ps of ['::before', '::after']) {
          const cs = getComputedStyle(el, ps);
          if (cs.content !== 'none' && cs.content !== 'normal') pseudo[ps] = { content: cs.content, ...pick(cs) };
        }
        const path = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].join('.')}`;
        rows.push({ path, rect: [r.left + scrollX, r.top + scrollY, r.width, r.height].map((v) => Math.round(v * 100) / 100), css: pick(getComputedStyle(el)), pseudo });
      }
      return {
        embed: !!embed,
        html: { scrollbar: innerWidth - document.documentElement.clientWidth, docH: document.documentElement.scrollHeight, ...pick(getComputedStyle(document.documentElement)) },
        body: pick(getComputedStyle(document.body)),
        rows,
      };
    }, PROPS);
    writeFileSync(`${out}/${tag}-${band}.json`, JSON.stringify(data));
    const { scrollbar, docH, 'font-size': fs, 'overflow-y': oy } = data.html;
    console.log(`${tag} ${band}: embed ${data.embed}, ${data.rows.length} elements, html font-size ${fs} overflow-y ${oy} scrollbar ${scrollbar} docH ${docH}`);
    await ctx.close();
  }
}

if (mode === 'diff') {
  const [a, c, ...bands] = rest;
  let total = 0;
  for (const band of bandsOf(bands)) {
    const A = JSON.parse(readFileSync(`${out}/${a}-${band}.json`, 'utf8'));
    const B = JSON.parse(readFileSync(`${out}/${c}-${band}.json`, 'utf8'));
    const flags = [];
    for (const part of ['html', 'body'])
      for (const k in A[part]) if (A[part][k] !== B[part][k]) flags.push(`${part} ${k}: ${A[part][k]} → ${B[part][k]}`);
    if (A.rows.length !== B.rows.length) flags.push(`element count ${A.rows.length} → ${B.rows.length}`);
    A.rows.forEach((ra, i) => {
      const rb = B.rows[i];
      if (!rb) return;
      if (ra.path !== rb.path) return flags.push(`#${i} path ${ra.path} → ${rb.path}`);
      const d = Math.max(...ra.rect.map((v, k) => Math.abs(v - rb.rect[k])));
      if (d > 0.5) flags.push(`${ra.path} rect Δ${d.toFixed(2)} ${ra.rect} → ${rb.rect}`);
      for (const k in ra.css) if (ra.css[k] !== rb.css[k]) flags.push(`${ra.path} ${k}: ${ra.css[k]} → ${rb.css[k]}`);
      const ps = new Set([...Object.keys(ra.pseudo), ...Object.keys(rb.pseudo)]);
      for (const k of ps) if (JSON.stringify(ra.pseudo[k]) !== JSON.stringify(rb.pseudo[k])) flags.push(`${ra.path}${k} differs`);
    });
    total += flags.length;
    console.log(`== ${band}: ${A.rows.length} elements, ${flags.length} flags`);
    flags.slice(0, 40).forEach((f) => console.log('  ' + f));
  }
  console.log(`TOTAL ${total}`);
}

if (mode === 'inventory') {
  for (const band of bandsOf(rest)) {
    const { ctx, p } = await open(b, band, true);
    await p.waitForFunction(() => !document.documentElement.classList.contains('is-preloading'), null, { timeout: 30000 }).catch(() => {});
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 400) {
      await p.evaluate((y) => scrollTo(0, y), y);
      await p.waitForTimeout(40);
    }
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(500);
    const res = await p.evaluate(() => {
      const embed = document.querySelector('.main-css style');
      if (!embed) return { embed: false, hits: [] };
      const hits = [];
      const walk = (rules, media) => {
        for (const r of rules) {
          if (r.cssRules && r.media) {
            if (matchMedia(r.media.mediaText).matches) walk(r.cssRules, r.media.mediaText);
            continue;
          }
          if (!r.selectorText) continue;
          for (const sel of r.selectorText.split(',')) {
            const bare = sel.replace(/::?[a-z-]+(\([^)]*\))?/gi, (m) => (/^:(not|is|where|first-child|last-child|nth-child)/i.test(m) ? m : '')).trim() || '*';
            let n = 0;
            try { n = document.querySelectorAll(bare).length; } catch { n = -1; }
            if (n) hits.push({ media: media || '', sel: sel.trim(), bare, n, sample: n > 0 ? [...document.querySelectorAll(bare)].slice(0, 3).map((e) => e.tagName.toLowerCase() + '.' + [...e.classList].join('.')) : [] });
          }
        }
      };
      walk(embed.sheet.cssRules);
      return { embed: true, hits };
    });
    console.log(`== ${band}: embed ${res.embed}, selectors with matches: ${res.hits.length}`);
    res.hits.forEach((h) => console.log(`  ${h.media ? '@' + h.media + ' ' : ''}${h.sel} → ${h.n} ${h.sample.join(' ')}`));
    await ctx.close();
  }
}

await b.close();
