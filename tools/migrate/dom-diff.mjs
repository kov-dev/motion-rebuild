// Compares the Astro build with the published Webflow staging page, scripts off on both sides:
// the same elements in the same order (tag, classes, attributes, own text) and the same boxes on four bands.
// Usage: node tools/migrate/dom-diff.mjs [local url] [--tol 0.5]
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const LOCAL = args.find((a) => /^https?:/.test(a)) || 'http://localhost:4321/';
const TOL = +(args[args.indexOf('--tol') + 1] || 0.5);
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const BANDS = [
  [1440, 900],
  [1024, 768],
  [768, 1024],
  [375, 812],
];

const snapshot = () => {
  const URLISH = new Set(['src', 'srcset', 'href', 'poster', 'data-src', 'data-poster', 'action']);
  const SKIP = new Set(['data-wf-page-id', 'data-wf-element-id']);
  const file = (v) =>
    v
      .split(/\s*,\s*(?=https?:|\/)/)
      .map((u) => {
        const [url, size = ''] = u.trim().split(/\s+/);
        if (!/website-files\.com|^\/assets\//.test(url)) return u.trim();
        // Compare by what the name is made of: the port renames files (id prefix dropped, odd characters to dashes).
        const name = decodeURIComponent(url.split('/').pop()).replace(/^[0-9a-f]{24}_/, '');
        return name.replace(/-[0-9a-f]{4}(?=\.\w+$)/, '').replace(/[^A-Za-z0-9]+/g, '').toLowerCase() + ' ' + size;
      })
      .join(',');
  const out = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (el.closest('script, style, .code-embed') || el.closest('svg') !== (el.tagName === 'svg' ? el : null)) continue;
    const attrs = [...el.attributes]
      .filter((a) => !SKIP.has(a.name))
      // Inline styles: the formatter of the port spaces the declarations, nothing more.
      .map((a) => `${a.name}=${URLISH.has(a.name) ? file(a.value) : a.name === 'style' ? a.value.replace(/\s+/g, '').replace(/;$/, '') : a.value.trim().replace(/\s+/g, ' ')}`)
      .sort()
      .join(' ');
    const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim().replace(/\s+/g, ' ')).filter(Boolean).join('|');
    const r = el.getBoundingClientRect();
    out.push({
      key: `${el.tagName.toLowerCase()} ${attrs} «${text}»`,
      svg: el.tagName === 'svg' ? el.innerHTML.replace(/\s+/g, '') : '',
      box: [r.left + scrollX, r.top + scrollY, r.width, r.height],
      name: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().replace(/\s+/g, '.') : ''),
    });
  }
  return { els: out, height: document.documentElement.scrollHeight };
};

const b = await chromium.launch({ channel: 'chrome' });
let flags = 0;
for (const [w, h] of BANDS) {
  const shots = [];
  for (const url of [STAGING, LOCAL]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'load', timeout: 120000 });
    await p.waitForTimeout(1500);
    // Playwright's evaluate runs in the page even with its scripts switched off.
    shots.push(await p.evaluate(snapshot));
    await ctx.close();
  }
  const [a, c] = shots;
  const lines = [];
  if (a.els.length !== c.els.length) lines.push(`element count ${a.els.length} → ${c.els.length}`);
  let dom = 0, svg = 0, box = 0, worst = 0;
  for (let i = 0; i < Math.min(a.els.length, c.els.length); i++) {
    const x = a.els[i], y = c.els[i];
    if (x.key !== y.key) {
      if (dom++ < 6) lines.push(`DOM #${i}\n    staging: ${x.key.slice(0, 260)}\n    local:   ${y.key.slice(0, 260)}`);
      continue;
    }
    if (x.svg !== y.svg && svg++ < 3) lines.push(`SVG #${i} ${x.name}: inner markup differs (${x.svg.length} → ${y.svg.length})`);
    const d = Math.max(...x.box.map((v, k) => Math.abs(v - y.box[k])));
    worst = Math.max(worst, d);
    if (d > TOL && box++ < 8) lines.push(`BOX #${i} ${x.name.slice(0, 80)}: ${x.box.map((v) => v.toFixed(1))} → ${y.box.map((v) => v.toFixed(1))}`);
  }
  if (Math.abs(a.height - c.height) > TOL) lines.push(`page height ${a.height} → ${c.height}`);
  const bad = dom + svg + box + (a.els.length !== c.els.length) + (Math.abs(a.height - c.height) > TOL);
  flags += bad;
  console.log(`${bad ? '✗' : '✓'} ${w}×${h}: ${a.els.length} elements, DOM diffs ${dom}, SVG diffs ${svg}, boxes over ${TOL}px ${box} (worst Δ ${worst.toFixed(2)}px), height ${a.height}`);
  lines.forEach((l) => console.log('  ' + l));
}
await b.close();
console.log(flags ? `\n${flags} flag(s)` : '\n0 flags');
process.exit(flags ? 1 : 0);
