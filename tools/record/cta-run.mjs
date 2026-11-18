// CTA check (session 50): the "made by zajno" bubble, the call after the menu cards, the call above the footer and the
// project-request modal. Screenshots + assertions on the staging page with the local src/motion.js injected.
// Usage: node cta-run.mjs <project-root> <out-dir> [1440|768|600|375] [--proto] [--live] [--reduce]
// --proto: the markup and CSS are not in Webflow yet — inject tools/record/fixtures/cta/proto.{html,css}.
// --live: the staging page exactly as published, nothing injected.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const live = args.includes('--live');
const proto = args.includes('--proto');
const reduce = args.includes('--reduce');
const [root, out, only = '1440'] = args.filter((a) => !a.startsWith('--'));
mkdirSync(out, { recursive: true });
// MOTION_URL: another build of the same page (the Astro build: http://localhost:4321/), used with --live.
const STAGING = process.env.MOTION_URL || 'https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io/';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const VPS = { 1440: { w: 1440, h: 900, m: false }, 768: { w: 768, h: 1024, m: true }, 600: { w: 600, h: 900, m: true }, 375: { w: 375, h: 812, m: true } };
const vp = VPS[only];
const src = (f) => readFileSync(`${root}/src/${f}`, 'utf8');
const fx = (f) => readFileSync(`${root}/tools/record/fixtures/cta/${f}`, 'utf8');
let flags = 0;
const flag = (ok, line) => { if (!ok) flags++; console.log(`${ok ? '✓' : '✗'} ${line}`); };

// Places the prototype fragments where the Webflow build puts them.
const PLACE = `(() => {
  const host = document.createElement('div');
  host.innerHTML = ${JSON.stringify(proto ? fx('proto.html') : '')};
  const t = (k) => host.querySelector('template[data-into="' + k + '"]')?.content;
  const toggle = document.querySelector('[data-motion="nb-toggle"]');
  if (t('nav') && toggle) toggle.before(t('nav'));
  const snd = document.querySelector('[data-motion="snd"]');
  if (t('sound') && snd) snd.append(t('sound'));
  const cards = document.querySelector('[data-motion="nb-cards"]');
  if (t('menu') && cards) cards.append(t('menu'));
  const ft = document.querySelector('.ft-content');
  if (t('footer') && ft) ft.prepend(t('footer'));
  if (t('body')) document.body.append(t('body'));
})();`;

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({
  viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, ...(vp.m ? { userAgent: UA } : {}),
  reducedMotion: reduce ? 'reduce' : 'no-preference',
});
const p = await ctx.newPage();
const logs = [];
p.on('pageerror', (e) => !/play\(\) request was interrupted|interrupted by a (new load|call to pause)/.test(e.message) && logs.push('pageerror: ' + e.message));
p.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && logs.push('console: ' + m.text()));
if (!live) {
  const js = src('motion.js');
  await p.route(STAGING + '*', async (route) => {
    if (!/^https?:\/\/[^\/]+\/(\?|$)/.test(route.request().url())) return route.continue();
    const res = await route.fetch();
    let html = await res.text();
    html = html.replace(/<script type="module" src="[^"]*motion\.js"><\/script>/, '');
    if (proto) html = html.replace('</head>', `<style>${fx('proto.css')}</style></head>`);
    html = html.replace('</body>', `${proto ? `<script>${PLACE}</script>` : ''}<script type="module">${js}</script></body>`);
    route.fulfill({ response: res, body: html });
  });
  for (const f of ['sphere.js']) await p.route(`**/${f}`, (r) => r.fulfill({ contentType: 'text/javascript', body: src(f) }));
}
await p.goto(STAGING + '?run=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 120000 });
await Promise.race([
  p.evaluate(() => new Promise((r) => document.addEventListener('motion:preloader-done', () => r(), { once: true }))),
  p.waitForTimeout(25000),
]);
await p.waitForTimeout(2500);
const shot = (n) => p.screenshot({ path: `${out}/${only}-${n}.png` });
const rect = (sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), shown: getComputedStyle(e).display !== 'none' && r.width > 0 }; }, sel);
const jump = async (y) => { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(1600); };
const topOf = (sel) => p.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, sel);

// 1. Bubble: in the bar ≥768, floating on the Sound line below.
const wide = vp.w >= 768;
const navBtn = '.nb-cta [data-motion="cta-open"]';
const floatBtn = '[data-motion="cta-float"] [data-motion="cta-open"]';
const bubble = wide ? navBtn : floatBtn;
const nb = await rect(navBtn), fl = await rect(floatBtn), tg = await rect('[data-motion="nb-toggle"]');
flag(!!nb?.shown === wide, `navbar bubble ${wide ? 'shown' : 'hidden'}: ${JSON.stringify(nb)}`);
flag(!!fl?.shown === !wide, `floating bubble ${wide ? 'hidden' : 'shown'}: ${JSON.stringify(fl)}`);
if (wide) flag(Math.abs(nb.y - tg.y) < 1 && Math.abs(nb.h - tg.h) < 1 && nb.x + nb.w < tg.x, `bubble on the toggle line, left of it (gap ${(tg.x - nb.x - nb.w).toFixed(1)} px)`);
await shot('1-top');
// On a light and on a coloured section (the scheme inverted).
await jump(await topOf('#easing') + 20);
if (wide) {
  const cr = await p.evaluate(() => { const c = [...document.querySelectorAll('[data-motion="nb-crumb"]')].map((e) => e.getBoundingClientRect()); return Math.max(...c.map((r) => r.right)); });
  const nb2 = await rect(navBtn);
  flag(cr < nb2.x, `longest lesson crumb ends before the bubble (${cr.toFixed(0)} < ${nb2.x.toFixed(0)})`);
}
await shot('2-lesson');
if (wide && !vp.m) { await p.hover(navBtn); await p.waitForTimeout(500); await shot('2b-hover'); await p.mouse.move(10, 400); }
await jump(await topOf('#resources') + 200);
await shot('3-resources');

// 2. Modal from the bubble.
const state = () => p.evaluate(() => { const m = document.querySelector('[data-motion="cta-modal"]'); const pn = document.querySelector('[data-motion="cta-panel"]'); const r = pn.getBoundingClientRect(); return { display: getComputedStyle(m).display, panel: [r.x, r.y, r.width, r.height].map(Math.round), src: document.querySelector('[data-motion="cta-source"]')?.value, focus: document.activeElement?.id || document.activeElement?.dataset.motion || document.activeElement?.tagName, locked: document.documentElement.classList.contains('lenis-stopped') || document.documentElement.style.overflow === 'hidden' }; });
await p.click(bubble);
await p.waitForTimeout(250);
await shot('4-modal-mid');
await p.waitForTimeout(1200);
let s = await state();
flag(await p.evaluate(() => ![...document.querySelectorAll('[data-motion="cta-form"] [placeholder]')].some((e) => /Example/.test(e.placeholder))), 'no default "Example Text" placeholders');
flag(s.display === 'block' && s.locked, `modal open, page locked: ${JSON.stringify(s)}`);
flag(s.src === (wide ? 'nav' : 'float'), `Source field = ${s.src}`);
flag(s.panel[0] >= 0 && s.panel[0] + s.panel[2] <= vp.w && s.panel[1] >= 0 && s.panel[1] + s.panel[3] <= vp.h, 'panel inside the viewport');
await shot('5-modal');
const y0 = await p.evaluate(() => scrollY);
await p.mouse.move(40, vp.h / 2);
await p.mouse.wheel(0, 600);
await p.waitForTimeout(900);
flag(Math.abs((await p.evaluate(() => scrollY)) - y0) < 2, 'the page does not scroll under the modal');
if (!vp.m) {
  for (let i = 0; i < 12; i++) await p.keyboard.press('Tab');
  flag(await p.evaluate(() => document.querySelector('[data-motion="cta-panel"]').contains(document.activeElement)), 'Tab stays inside the sheet');
}
await p.keyboard.press('Escape');
await p.waitForTimeout(700);
s = await state();
flag(s.display === 'none' && !s.locked, `Esc closes and unlocks: ${JSON.stringify(s)}`);
flag(s.focus === 'cta-open', `focus back on the opener (${s.focus})`);

// 3. Menu end.
await p.click('[data-motion="nb-toggle"]');
await p.waitForTimeout(1400);
await p.evaluate(() => { const t = document.querySelector('[data-motion="nb-track"]'); t.scrollLeft = t.scrollWidth; });
await p.waitForTimeout(1300);
const end = await rect('[data-motion="nb-end"]');
const card = await p.evaluate(() => { const r = [...document.querySelectorAll('.nb-card')].at(-1).getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
flag(end && end.x + end.w <= vp.w + 1 && end.x >= card.x + card.w, `menu call after the last card, inside the viewport: ${JSON.stringify(end)}`);
flag(await p.evaluate(() => [...document.querySelector('[data-motion="nb-end"]').children].every((e) => +getComputedStyle(e).opacity > 0.6 || e.classList.contains('nb-end-text'))), 'menu call revealed');
await shot('6-menu-end');
await p.click('[data-motion="nb-end"] [data-motion="cta-open"]');
await p.waitForTimeout(1300);
s = await state();
flag(s.display === 'block' && s.src === 'menu', `modal from the menu: ${JSON.stringify(s)}`);
await shot('7-modal-menu');
await p.click('[data-motion="cta-close"]');
await p.waitForTimeout(700);
s = await state();
flag(s.display === 'none' && s.locked, 'closed back to the menu, page still locked');
await p.keyboard.press('Escape');
await p.waitForTimeout(900);
flag(!(await state()).locked, 'menu closed, page unlocked');

// 4. Footer call.
const ft = await topOf('[data-motion="footer"]');
for (const [i, off] of [[0, -1.0], [1, -0.5], [2, 0.3]]) { await jump(ft + off * vp.h); await shot(`8-footer-${i}`); }
await jump(1e7);
await shot('8-footer-end');
if (!wide) flag(await p.evaluate(() => getComputedStyle(document.querySelector('[data-motion="cta-float"]')).visibility === 'hidden'), 'floating bubble hidden over the footer');
if (vp.w < 480) await jump(ft - 0.2 * vp.h);
const fb = await rect('.ft-cta [data-motion="cta-open"]');
flag(fb?.shown && fb.y > 0 && fb.y + fb.h < vp.h, `footer call button in view${vp.w < 480 ? '' : ' on the last screen'}: ${JSON.stringify(fb)}`);
await p.click('.ft-cta [data-motion="cta-open"]');
await p.waitForTimeout(1300);
s = await state();
flag(s.display === 'block' && s.src === 'footer', `modal from the footer: ${JSON.stringify(s)}`);
await p.fill('#cta-name', 'Test Name');
await p.fill('#cta-email', 'test@example.com');
await p.fill('#cta-message', 'A short note about the project.');
await shot('9-modal-filled');
// Submit with the network stubbed: no lead is ever sent from a test. webflow.js posts through jQuery.ajax.
if (!proto) {
  await p.evaluate(() => {
    window.__sent = [];
    const $ = window.jQuery;
    $.ajax = (o) => { window.__sent.push(typeof o.data === 'string' ? o.data : JSON.stringify(o.data)); const d = $.Deferred(); setTimeout(() => { const ok = { code: 200, msg: 'ok' }; o.success?.(ok); d.resolve(ok); }, 50); return d.promise(); };
  });
  // A bot: the trap field filled → the submit never reaches webflow.js.
  await p.evaluate(() => { document.querySelector('[data-motion="cta-trap"]').value = 'x'; });
  await p.click('[data-motion="cta-form"] [type="submit"]');
  await p.waitForTimeout(600);
  flag((await p.evaluate(() => window.__sent.length)) === 0, 'trap field filled → nothing sent');
  // A script: untrusted submit event.
  await p.evaluate(() => { document.querySelector('[data-motion="cta-trap"]').value = ''; document.querySelector('[data-motion="cta-form"]').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
  await p.waitForTimeout(600);
  flag((await p.evaluate(() => window.__sent.length)) === 0, 'untrusted submit → nothing sent');
  // A person.
  await p.click('[data-motion="cta-form"] [type="submit"]');
  await p.waitForTimeout(1200);
  const sent = await p.evaluate(() => window.__sent);
  flag(sent.length === 1 && /Test(\+|%20| )Name/.test(decodeURIComponent(sent[0])) && /Source/.test(sent[0]) && new RegExp('footer').test(sent[0]), `a real submit goes to webflow.js once, with Source (${sent.length}: ${decodeURIComponent(sent[0] || '').slice(0, 220)})`);
  flag(await p.evaluate(() => getComputedStyle(document.querySelector('.cta-done')).display !== 'none' && getComputedStyle(document.querySelector('[data-motion="cta-form"]')).display === 'none'), 'success message shown instead of the form');
  flag(await p.evaluate(() => getComputedStyle(document.querySelector('#cta-title')).display === 'none'), 'the invitation is hidden after a successful submit');
  flag(!/Test/.test(p.url()), 'no form data in the URL');
  await shot('9b-modal-done');
}
await p.click('[data-motion="cta-backdrop"]', { position: { x: 5, y: 5 } }).catch(() => {});
await p.waitForTimeout(700);
flag((await state()).display === 'none', 'backdrop click closes');

logs.forEach((l) => console.log('LOG', l));
flag(!logs.length, `no page errors (${logs.length})`);
console.log(`\n${only}${reduce ? ' reduce' : ''}${live ? ' live' : proto ? ' proto' : ''}: ${flags} flag(s)`);
await b.close();
process.exit(flags ? 1 : 0);
