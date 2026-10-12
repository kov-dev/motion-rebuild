// Collect every asset URL referenced by staging pages (HTML + linked CSS/JS/JSON) and check each one for 404.
// Usage: node asset-404.mjs <deleted-ids.json>  (session 40, asset wave 2)
// Also flags any reference to the wave-2 deleted IDs.
import { readFileSync } from 'node:fs';
const STAGING = 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io';
const PAGES = ['/', '/styleguide', '/lesson/parallax', '/lesson/the-basics-of-easing', '/lesson/transform-morph', '/this-page-does-not-exist-404'];
const deleted = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const URL_RE = /https?:\/\/(?:[^\s"'()<>\\]|\(\d+\))+/g; // '(1)' allowed: asset names like '… (1).webp'; other parens end the URL (CSS url())
// bare origins (preconnect / dns-prefetch hints) are not assets
const isAsset = (u) => /website-files\.com|webflow-prod-assets|uploads-ssl\.webflow\.com|assets\.website-files/.test(u) && new URL(u).pathname.length > 1;
const seen = new Set(), sources = new Map(), texts = [];
const get = async (u) => { const r = await fetch(u, { redirect: 'follow' }); return { status: r.status, text: await r.text(), ct: r.headers.get('content-type') || '' }; };
const queue = [];
for (const p of PAGES) {
  const r = await get(STAGING + p + '?nocache=' + Date.now());
  console.log('page', p, r.status);
  texts.push([p, r.text]);
  for (const m of r.text.match(URL_RE) || []) {
    const u = m.replace(/&amp;/g, '&').replace(/[,;]$/, '');
    if (!isAsset(u)) continue;
    if (!sources.has(u)) sources.set(u, p);
    if (/\.(css|js|json)(\?|$)/.test(u)) queue.push(u);
  }
}
// one level deep: CSS / JS / Lottie JSON referenced from pages
for (const u of [...new Set(queue)]) {
  const r = await get(u);
  texts.push([u, r.text]);
  for (const m of r.text.match(URL_RE) || []) { const v = m.replace(/[,;]$/, ''); if (isAsset(v) && !sources.has(v)) sources.set(v, u); }
  for (const m of r.text.matchAll(/url\((["']?)([^)"']+)\1\)/g)) {
    try { const v = new URL(m[2], u).href; if (isAsset(v) && !sources.has(v)) sources.set(v, u); } catch {}
  }
}
const bad = [];
const urls = [...sources.keys()];
for (let i = 0; i < urls.length; i += 12) {
  await Promise.all(urls.slice(i, i + 12).map(async (u) => {
    let s; try { s = (await fetch(u, { method: 'HEAD' })).status; if (s === 405 || s === 403) s = (await fetch(u)).status; } catch (e) { s = 'ERR ' + e.message; }
    if (s !== 200) bad.push([s, u, sources.get(u)]);
  }));
}
const hits = [];
for (const [src, t] of texts) for (const id of deleted) if (t.includes(id)) hits.push([id, src]);
console.log('asset URLs checked:', urls.length, '| non-200:', bad.length, '| deleted-ID references:', hits.length);
for (const b of bad) console.log('  BAD', ...b);
for (const h of hits) console.log('  HIT', ...h);
