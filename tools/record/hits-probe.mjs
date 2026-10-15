// Ball hits → heading lines: steps the scroll over a heading landing with the local src/motion.js, logs ball + line
// state, shoots a frame whenever the lines change. Block 0 = the Hero ball onto the first heading, 1 = the ui-ball of
// block 0 onto the second heading. Line values = translateY px (line box ≈ 80 px at 1440).
// Usage: node hits-probe.mjs [out] [block] [w] [h] [step]
import { chromium } from 'playwright';
import fs from 'fs';
const SRC = '/Users/mac/Claude/Projects/Motion/src';
const [,, out = 'hits', blk = '0', w = '1440', h = '820', step = '20'] = process.argv;
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
// No slider snap: the probe rests between steps on purpose. The pins of later blocks settle after a scroll into the slider.
await p.evaluate(() => (document.documentElement.dataset.motionSnap = 'off'));
await p.evaluate(() => scrollTo(0, document.querySelector('[data-motion=ui]').getBoundingClientRect().top + scrollY));
await p.waitForTimeout(1500);
const top = await p.evaluate((j) => { const b = document.querySelectorAll('[data-motion=ui]')[j]; const a = b.parentElement.classList.contains('pin-spacer') ? b.parentElement : b; return a.getBoundingClientRect().top + scrollY; }, +blk);
const from = top - 1.3 * +h, to = top + 0.36 * +w * 1.6;
let last = null; const log = [];
for (let y = from; y <= to; y += +step) {
  await p.evaluate((y) => scrollTo(0, y), y);
  await p.waitForTimeout(120);
  const s = await p.evaluate((j) => {
    const blocks = document.querySelectorAll('[data-motion=ui]');
    const el = j ? blocks[j - 1].querySelector('[data-motion=ui-ball]') : document.querySelector('[data-motion=hero-ball]');
    const ball = el.getBoundingClientRect();
    const lines = blocks[j].querySelector('.ui-title');
    const L = [...lines.children].map((m) => { const l = m.firstElementChild; if (!l) return '-'; const t = getComputedStyle(l).transform; return t === 'none' ? 0 : Math.round(parseFloat(t.split(',')[5])); });
    const first = lines.children[0]?.getBoundingClientRect();
    return { sy: Math.round(scrollY), ball: `${Math.round(ball.left + ball.width / 2)},${Math.round(ball.bottom)}`, lineTop: first && Math.round(first.top), L, n: lines.children.length, op: getComputedStyle(el).opacity + getComputedStyle(el).visibility[0] };
  }, +blk);
  log.push(s);
  const key = s.L.join('|');
  if (key !== last) { await p.screenshot({ path: `${out}/f${String(log.length).padStart(3, '0')}.png` }); last = key; }
}
await p.waitForTimeout(1200);
await p.screenshot({ path: `${out}/end.png` });
fs.writeFileSync(`${out}/log.json`, JSON.stringify(log, null, 0));
console.log('lines', log[log.length - 1].n, 'errors', errs.slice(0, 5));
for (const s of log) console.log(s.sy, s.ball, s.lineTop, s.op, s.L.join(' '));
await b.close();
