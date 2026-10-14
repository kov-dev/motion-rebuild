// Ball hits → heading lines: steps the scroll over the landing with the local src/motion.js, logs ball + line state, shoots frames.
import { chromium } from 'playwright';
import fs from 'fs';
const SRC = '/Users/mac/Claude/Projects/Motion/src';
const [,, out = 'hits', w = '1440', h = '820', step = '20'] = process.argv;
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.route(/cdn\.jsdelivr\.net\/gh\/kov-dev\/motion-rebuild@[^/]+\/src\/(.+\.js)/, (r) => {
  const f = r.request().url().match(/\/src\/(.+\.js)/)[1];
  r.fulfill({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(`${SRC}/${f}`, 'utf8') });
});
const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await p.goto('https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/', { waitUntil: 'load', timeout: 90000 });
await p.waitForTimeout(9000);
const top = await p.evaluate(() => { const b = document.querySelector('[data-motion=ui]'); return b.getBoundingClientRect().top + scrollY; });
const from = top - 1.3 * +h, to = top + 0.36 * +w * 1.6;
let last = null; const log = [];
for (let y = from; y <= to; y += +step) {
  await p.evaluate((y) => scrollTo(0, y), y);
  await p.waitForTimeout(120);
  const s = await p.evaluate(() => {
    const ball = document.querySelector('[data-motion=hero-ball]').getBoundingClientRect();
    const lines = [...document.querySelectorAll('[data-motion=ui] .ui-title')][0];
    const ls = [...lines.querySelectorAll('div > div')].filter((d) => d.parentElement.style.overflow || true);
    const L = [...lines.children].map((m) => { const l = m.firstElementChild; const t = getComputedStyle(l).transform; return t === 'none' ? '0' : t.split(',')[5]?.trim(); });
    const first = lines.children[0]?.getBoundingClientRect();
    return { sy: Math.round(scrollY), ballBottom: Math.round(ball.bottom), lineTop: first && Math.round(first.top), L, n: lines.children.length, vis: getComputedStyle(document.querySelector('[data-motion=hero-ball]')).visibility };
  });
  log.push(s);
  const key = s.L.join('|');
  if (key !== last) { await p.screenshot({ path: `${out}/f${String(log.length).padStart(3, '0')}.png` }); last = key; }
}
await p.waitForTimeout(1200);
await p.screenshot({ path: `${out}/end.png` });
fs.writeFileSync(`${out}/log.json`, JSON.stringify(log, null, 0));
console.log('lines', log[0].n, 'errors', errs.slice(0, 5));
for (const s of log) console.log(s.sy, s.ballBottom, s.lineTop, s.vis, s.L.join(' '));
await b.close();
