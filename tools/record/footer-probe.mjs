// Probe the live footer (div.nav.nav-dark > div.footer; the first .nav-dark on the page is the navbar) and its boundary with Resources:
//   struct — geometry + computed-style walk of the footer, the clouds (.footer-cloud-item: background SVGs), links
//            (href / target / text), icon SVGs, the Resources pin end and .resources-overlay, every CSS rule whose
//            selector mentions the footer classes (incl. media queries) (footer-struct-<vp>.json)
//   scan   — scrolls from the end of the Resources pin to the page bottom in vh/8 steps and logs the footer top, the
//            overlay colour, the clouds y, the sound button and the navbar colours, plus the IX2 e-720 progress
//            computed from the trigger (footer-scan-<vp>.txt, screenshots every vh/2)
//   hover  — desktop only: hovers every footer link and samples colour / opacity / decoration / icon transform every
//            50 ms (footer-hover-<vp>.txt)
// The live Resources pin is created lazily when .is-lessons reaches the top, so the probe first scrolls through Lessons.
// Usage: node footer-probe.mjs [url] [outDir]   env ONLY=1440|768|375, PART=struct,scan,hover
// (run from a dir with playwright installed)
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] || 'https://motion.zajno.com/';
const out = process.argv[3] || '.';
fs.mkdirSync(out, { recursive: true });

const VPS = [
  { name: '1440', w: 1440, h: 900, m: false },
  { name: '768', w: 768, h: 1024, m: true },
  { name: '375', w: 375, h: 812, m: true },
];
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const PROPS = ['display', 'position', 'width', 'height', 'minHeight', 'maxWidth', 'padding', 'margin', 'gap', 'flexDirection',
  'flexWrap', 'justifyContent', 'alignItems', 'gridTemplateColumns', 'fontFamily', 'fontSize', 'lineHeight', 'letterSpacing',
  'fontWeight', 'textTransform', 'textAlign', 'textDecorationLine', 'color', 'backgroundColor', 'backgroundImage', 'backgroundSize',
  'backgroundPosition', 'border', 'borderTop', 'borderBottom', 'borderRadius', 'overflow', 'zIndex', 'transform', 'transformOrigin',
  'top', 'left', 'right', 'bottom', 'whiteSpace', 'opacity', 'visibility', 'pointerEvents', 'transition', 'cursor'];
const parts = (process.env.PART || 'struct,scan,hover').split(',');
const only = process.env.ONLY;

async function scrollToY(p, vp, target) {
  for (let i = 0; i < 600; i++) {
    const y = await p.evaluate(() => scrollY);
    const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    const t = Math.min(target, max);
    const d = t - y;
    if (Math.abs(d) < 8) break;
    const step = Math.sign(d) * Math.min(600, Math.abs(d));
    if (vp.m) await p.evaluate((s) => scrollBy(0, s), step);
    else await p.mouse.wheel(0, step);
    await p.waitForTimeout(vp.m ? 60 : 120);
  }
}

const b = await chromium.launch({ channel: 'chrome' });
for (const vp of VPS.filter((v) => !only || v.name === only)) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.m ? IPHONE : undefined });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(16000); // let the old preloader finish
  // Pass .is-lessons so the old script builds the Resources pin (it changes the document height).
  const lt = await p.evaluate(() => Math.round(document.querySelector('.is-lessons').getBoundingClientRect().top + scrollY));
  await scrollToY(p, vp, lt + 200);
  await p.waitForTimeout(1500);
  const geo = () => p.evaluate(() => {
    const top = (e) => Math.round(e.getBoundingClientRect().top + scrollY);
    const res = document.querySelector('.resources');
    const spacer = res.parentElement.classList.contains('pin-spacer') ? res.parentElement : null;
    const st = window.ScrollTrigger?.getAll().find((t) => t.pin === res || t.trigger === res);
    const foot = document.querySelector('.footer'), nav = foot.parentElement;
    const ov = document.querySelector('.resources-overlay');
    return { secTop: top(document.querySelector('#resources')), secBottom: Math.round(document.querySelector('#resources').getBoundingClientRect().bottom + scrollY),
      pinEnd: st ? Math.round(st.end) : null, spacerBottom: spacer ? Math.round(spacer.getBoundingClientRect().bottom + scrollY) : null,
      navTop: top(nav), navH: Math.round(nav.getBoundingClientRect().height), footTop: top(foot), footH: Math.round(foot.getBoundingClientRect().height),
      ovTop: top(ov), ovH: Math.round(ov.getBoundingClientRect().height),
      docH: document.documentElement.scrollHeight, vw: innerWidth, vh: innerHeight };
  });
  const g = await geo();
  console.log(vp.name, 'geo', JSON.stringify(g));

  if (parts.includes('struct')) {
    const data = await p.evaluate((PROPS) => {
      const abs = (e) => { const r = e.getBoundingClientRect(); return { top: Math.round(r.top + scrollY), left: Math.round(r.left * 10) / 10, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 }; };
      const walk = (el, d, o, max) => {
        const cs = getComputedStyle(el); const s = {};
        for (const k of PROPS) s[k] = cs[k];
        const at = {}; for (const a of el.attributes) if (/^data-|^src$|^href$|^target$|^rel$|^alt$|^aria|^role|^id$/.test(a.name)) at[a.name] = a.value.slice(0, 200);
        o.push({ d, tag: el.tagName.toLowerCase(), cls: (el.className?.baseVal ?? el.className).toString(), ...abs(el), at,
          text: el.children.length ? '' : (el.textContent || '').trim().slice(0, 200), s });
        if (el.tagName !== 'svg' && d < max) for (const c of el.children) walk(c, d + 1, o, max);
        return o;
      };
      const nav = document.querySelector('.footer').parentElement;
      const tree = walk(nav, 0, [], 16);
      const links = [...nav.querySelectorAll('a')].map((a) => ({ text: a.innerText.replace(/\s+/g, ' ').trim(), href: a.getAttribute('href'), target: a.target, rel: a.rel, cls: a.className, ...abs(a) }));
      const svgs = [...new Set([...nav.querySelectorAll('svg')].map((s) => s.outerHTML))];
      const overlay = walk(document.querySelector('.resources-overlay'), 0, [], 0);
      const rules = [];
      const take = (list, media) => { for (const r of list) {
        if (r.cssRules && r.media) take(r.cssRules, r.media.mediaText);
        else if (r.selectorText && /footer|\.f-|zajno|nav-dark|resources-overlay|sound-btn|text-span|flex-display|mobile-hidden|\.h5\b/.test(r.selectorText)) rules.push(`${media ? `@media ${media} ` : ''}${r.cssText}`);
      } };
      for (const sh of document.styleSheets) { try { take(sh.cssRules, ''); } catch (e) { rules.push(`(blocked ${sh.href})`); } }
      return { tree, links, svgs, overlay, rules };
    }, PROPS);
    fs.writeFileSync(`${out}/footer-struct-${vp.name}.json`, JSON.stringify({ geo: g, ...data }, null, 1));
    console.log(vp.name, 'struct', data.tree.length, 'nodes,', data.links.length, 'links,', data.svgs.length, 'svgs,', data.rules.length, 'rules');
  }

  if (parts.includes('scan')) {
    const step = Math.round(vp.h / 8);
    const from = (g.pinEnd ?? g.secBottom - vp.h) - vp.h;
    const to = g.docH - vp.h;
    const rows = [`geo ${JSON.stringify(g)} step ${step}`];
    let i = 0;
    for (let y = from; y <= to + step - 1; y += step, i++) {
      await scrollToY(p, vp, Math.min(y, to));
      await p.waitForTimeout(2500); // IX2 smoothing 90
      const row = await p.evaluate(() => {
        const tf = (e) => { const m = new DOMMatrix(getComputedStyle(e).transform); return { x: Math.round(m.m41 * 10) / 10, y: Math.round(m.m42 * 10) / 10, s: Math.round(Math.hypot(m.a, m.b) * 1000) / 1000 }; };
        const q = (s) => document.querySelector(s);
        const foot = q('.footer');
        const ft = foot.getBoundingClientRect().top, fh = foot.offsetHeight, vh = innerHeight;
        // IX2 e-720 progress candidates: start = top at vh·1.15 (startsEntering −15 %), end = top at vh − vh·(1+0.15) − … ;
        // logged raw so the formula is fitted from the data.
        const o = [`ftop ${Math.round(ft)}`, `fh ${fh}`];
        o.push(`overlay ${getComputedStyle(q('.resources-overlay')).backgroundColor} @${Math.round(q('.resources-overlay').getBoundingClientRect().top)}`);
        o.push('clouds ' + [...document.querySelectorAll('.footer-cloud-item')].map((c) => `${tf(c).y}@${Math.round(c.getBoundingClientRect().top)}`).join(','));
        const sb = q('.sound-btn-wrap');
        if (sb) { const cs = getComputedStyle(sb); o.push(`sound ${cs.display} ${(+cs.opacity).toFixed(2)} ${cs.transform}`); }
        const lg = q('#logo-wrap'), mt = q('#menu-toggle');
        o.push(`nav ${lg ? getComputedStyle(lg).backgroundColor : '-'} ${mt ? getComputedStyle(mt).backgroundColor : '-'}`);
        return `y ${Math.round(scrollY)} | ` + o.join(' | ');
      });
      rows.push(row);
      if (i % 4 === 0) await p.screenshot({ path: `${out}/footer-${vp.name}-scan-${String(i).padStart(3, '0')}.jpg`, quality: 55, type: 'jpeg' });
    }
    fs.writeFileSync(`${out}/footer-scan-${vp.name}.txt`, rows.join('\n'));
    console.log(vp.name, 'scan', rows.length, 'rows');
  }

  if (parts.includes('hover') && !vp.m) {
    await scrollToY(p, vp, g.docH - vp.h);
    await p.waitForTimeout(2500);
    const n = await p.evaluate(() => document.querySelectorAll('.footer a').length);
    const rows = [];
    for (let k = 0; k < n; k++) {
      const r = await p.evaluate((k) => { const a = document.querySelectorAll('.footer a')[k]; const r = a.getBoundingClientRect(); return { x: r.left + Math.min(20, r.width / 2), y: r.top + r.height / 2, t: a.innerText.trim() }; }, k);
      const snap = () => p.evaluate((k) => {
        const a = document.querySelectorAll('.footer a')[k];
        const all = [a, ...a.querySelectorAll('*')];
        return all.map((e) => { const cs = getComputedStyle(e); const m = new DOMMatrix(cs.transform);
          return `${(e.className?.baseVal ?? e.className) || e.tagName}: c ${cs.color} op ${(+cs.opacity).toFixed(2)} dec ${cs.textDecorationLine} x ${Math.round(m.m41 * 10) / 10} y ${Math.round(m.m42 * 10) / 10} r ${Math.round(Math.atan2(m.b, m.a) * 1800 / Math.PI) / 10}`; }).join(' ; ');
      }, k);
      rows.push(`link ${k} «${r.t}» rest: ${await snap()}`);
      await p.mouse.move(r.x, r.y, { steps: 3 });
      for (const t of [50, 150, 300, 600]) { await p.waitForTimeout(t === 50 ? 50 : t / 2); rows.push(`  +${t}ms ${await snap()}`); }
      await p.mouse.move(5, 5);
      await p.waitForTimeout(700);
    }
    fs.writeFileSync(`${out}/footer-hover-${vp.name}.txt`, rows.join('\n'));
    console.log(vp.name, 'hover', rows.length, 'rows');
  }
  await ctx.close();
}
await b.close();
