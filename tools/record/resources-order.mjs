// Order of the two Resources lists: staging (new section-resources) vs the live original (motion.zajno.com).
// Replaces the ORDER check of resources-compare.mjs after the old #resources was deleted from the copy (step 2
// of docs/legacy-removal.md): the reference now lives only on the live site. Both pages are fetched with scripts
// blocked (the live script.v33, our module) so the lists sit in their natural DOM order.
// Usage: node resources-order.mjs [stagingUrl] [liveUrl]
import { chromium } from 'playwright';

const staging = process.argv[2] || 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const live = process.argv[3] || 'https://motion.zajno.com/';

const hosts = async (page, url, listSel, linkSel) => {
  await page.route(/script\.v33|cdn\.jsdelivr\.net\/gh\/kov-dev/, (r) => r.abort());
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  return page.evaluate(([ls, as]) => [...document.querySelectorAll(ls)].map((l) =>
    [...l.querySelectorAll(as)].map((a) => new URL(a.href).hostname)), [listSel, linkSel]);
};

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
// The new section: `#resources` after step 3, `#resources-next` before it.
const n = await hosts(await ctx.newPage(), staging, '[data-motion="resources"] .res-list', '.res-link');
const o = await hosts(await ctx.newPage(), live, 'section#resources .resources-list', '.resources-link');
await browser.close();

let flags = 0;
['courses', 'sources'].forEach((name, i) => {
  const ok = n[i] && o[i] && n[i].join() === o[i].join();
  if (!ok) flags++;
  console.log(`${ok ? '✓' : '✗'} order ${name}: ${ok ? n[i].length + ' rows' : `ORDER staging [${(n[i] || []).join(', ')}] vs live [${(o[i] || []).join(', ')}]`}`);
});
console.log(`flags: ${flags}`);
process.exit(flags ? 1 : 0);
