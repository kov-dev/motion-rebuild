// Probe the live navbar (div.navigation: logo eyes, breadcrumbs, #menu-toggle) and the full-screen menu (.nav-menu).
//   struct — computed-style walk of .navigation closed and open (nav-struct-<vp>.json), every CSS rule of the live
//            stylesheet whose selector mentions nav classes, incl. media queries (nav-css.txt), screenshots
//   scan   — scrolls the whole page in vh/4 steps and logs every change of the navbar scheme (logo / toggle colours,
//            eye opacity, breadcrumbs, visible crumb) and of the sound button, together with the .nav wrapper and
//            .nav-inner under the navbar line (top+1) and under the sound line (bottom−90) (nav-scan-<vp>.txt)
//   menu   — opens / closes the menu and samples the IX2 keys every ~30 ms; hovers a card and samples its Lottie frame;
//            wheels over the menu and logs the track scrollLeft; clicks a link and logs where the page lands (nav-menu-<vp>.txt)
//   edge   — not in the default set: the Resources → footer switch in 20 px steps, env FROM / TO (nav-edge-<vp>.txt)
// Usage: node nav-probe.mjs [url] [outDir]   env ONLY=1440|768|375, PART=struct,scan,menu[,edge]
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
const PROPS = ['display', 'position', 'width', 'height', 'padding', 'margin', 'gap', 'flexDirection', 'justifyContent', 'alignItems',
  'fontFamily', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'textTransform', 'color', 'backgroundColor', 'backgroundImage',
  'border', 'borderRadius', 'overflow', 'overflowX', 'overflowY', 'zIndex', 'transform', 'top', 'left', 'right', 'bottom', 'opacity',
  'visibility', 'pointerEvents', 'transition', 'cursor', 'whiteSpace', 'mixBlendMode'];
const NAV_RE = /nav|toggle|breadcrumb|logo|lottie-card|eye-|sound|height-container\.is-nav|sticky-container\.is-nav/;
const parts = (process.env.PART || 'struct,scan,menu').split(',');
const only = process.env.ONLY;

// Navbar / sound state as the old script.v33 block I paints it.
const STATE = () => {
  const cs = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e) : null; };
  const c = (s, p) => cs(s)?.[p] ?? '-';
  const crumbs = [...document.querySelectorAll('#breadcrumbs-wrap .breadcrumb-item')];
  const vis = crumbs.map((e, i) => (+getComputedStyle(e).opacity > 0.5 ? i : -1)).filter((i) => i >= 0);
  const lineHit = (y) => {
    const hit = [...document.querySelectorAll('.nav')].find((n) => { const r = n.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    const inner = [...document.querySelectorAll('.nav-inner')].find((n) => { const r = n.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    const name = (n) => (n ? (n.id || n.querySelector('[id]')?.id || '') + '.' + [...n.classList].filter((k) => k !== 'nav').join('.') : '-');
    return name(hit) + (inner ? ' >inner' + name(inner) : '');
  };
  return {
    logo: [c('#logo-wrap', 'backgroundColor'), c('#logo-wrap', 'borderTopColor'), c('#logo-wrap', 'color')].join(' '),
    toggle: [c('#menu-toggle', 'backgroundColor'), c('#menu-toggle', 'borderTopColor'), c('#menu-toggle', 'color')].join(' '),
    span: c('.toggle-span', 'backgroundColor'),
    eyes: `d${(+c('.logo-eye-dark', 'opacity')).toFixed(2)} l${(+c('.logo-eye-light', 'opacity')).toFixed(2)} bg ${c('.eye-bg-sections', 'backgroundColor')}`,
    crumbs: `${(+c('#breadcrumbs-wrap', 'opacity')).toFixed(2)} [${vis.join(',')}]`,
    sound: [c('.sound-icon-wrap', 'backgroundColor'), c('.sound-icon-wrap', 'borderTopColor'), c('.sound-btn-wrap', 'display')].join(' '),
    navLine: lineHit(1),
    soundLine: lineHit(innerHeight - 90),
  };
};

async function walk(p, root) {
  return p.evaluate(({ root, PROPS }) => {
    const res = [];
    const rec = (el, d) => {
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el), st = {};
      for (const k of PROPS) st[k] = cs[k];
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim();
      res.push({ d, tag: el.tagName.toLowerCase(), id: el.id || undefined, cls: el.className?.baseVal ?? el.className,
        r: [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(1)), text: own || undefined,
        href: el.getAttribute('href') || undefined, target: el.getAttribute('target') || undefined,
        src: el.getAttribute('data-src') || undefined, ix: el.getAttribute('data-w-id') || undefined,
        aria: el.getAttribute('aria-label') || undefined, st });
      if (el.tagName === 'svg' || el.classList?.contains('w-embed')) return;
      if (el.getAttribute('data-animation-type') === 'lottie') return;
      for (const ch of el.children) rec(ch, d + 1);
    };
    const el = document.querySelector(root);
    if (el) rec(el, 0);
    return res;
  }, { root, PROPS });
}

// Live CSS: every rule whose selector mentions nav classes, grouped by media query.
async function dumpCss(p) {
  const href = await p.evaluate(() => [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href).find((h) => /webflow.*\.css/.test(h)));
  const css = await (await fetch(href)).text();
  const lines = [];
  let i = 0, media = '';
  const take = (start) => { let depth = 0, j = start; for (; j < css.length; j++) { if (css[j] === '{') depth++; else if (css[j] === '}') { depth--; if (!depth) break; } } return j; };
  const scan = (from, to, mq) => {
    let k = from;
    while (k < to) {
      const open = css.indexOf('{', k);
      if (open < 0 || open >= to) break;
      const sel = css.slice(k, open).trim();
      if (sel.startsWith('@media')) { const end = take(open); scan(open + 1, end, sel); k = end + 1; continue; }
      const close = css.indexOf('}', open);
      if (NAV_RE.test(sel)) lines.push(`${mq ? mq + ' ' : ''}${sel} {${css.slice(open + 1, close)}}`);
      k = close + 1;
    }
  };
  scan(0, css.length, media);
  fs.writeFileSync(`${out}/nav-css.txt`, `${href}\n` + lines.join('\n') + '\n');
  return lines.length;
}

async function scrollToY(p, vp, target) {
  for (let i = 0; i < 800; i++) {
    const y = await p.evaluate(() => scrollY);
    const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    const t = Math.min(target, max), d = t - y;
    if (Math.abs(d) < 8) return y;
    const step = Math.sign(d) * Math.min(600, Math.abs(d));
    if (vp.m) await p.evaluate((s) => scrollBy(0, s), step);
    else await p.mouse.wheel(0, step);
    await p.waitForTimeout(vp.m ? 60 : 120);
  }
  return p.evaluate(() => scrollY);
}

const b = await chromium.launch({ channel: 'chrome' });
for (const vp of VPS.filter((v) => !only || v.name === only)) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, userAgent: vp.m ? IPHONE : undefined });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'load', timeout: 120000 });
  // Skip the preloader the way a visitor does.
  await p.waitForTimeout(6000);
  await p.click('.trigger', { timeout: 5000 }).catch(() => {});
  await p.waitForTimeout(3000);

  if (parts.includes('struct')) {
    const closed = await walk(p, '.navigation');
    await p.screenshot({ path: `${out}/nav-closed-${vp.name}.png` });
    await p.click('#menu-toggle');
    await p.waitForTimeout(1500);
    const open = await walk(p, '.navigation');
    await p.screenshot({ path: `${out}/nav-open-${vp.name}.png` });
    const track = await p.evaluate(() => { const t = document.querySelector('.nav-track'); return { sw: t.scrollWidth, cw: t.clientWidth, sh: t.scrollHeight, ch: t.clientHeight }; });
    await p.click('#menu-toggle');
    await p.waitForTimeout(1200);
    fs.writeFileSync(`${out}/nav-struct-${vp.name}.json`, JSON.stringify({ closed, open, track }, null, 1));
    if (vp.name === '1440') console.log('css rules', await dumpCss(p));
    console.log(vp.name, 'struct', closed.length, open.length, JSON.stringify(track));
  }

  if (parts.includes('menu')) {
    const log = [];
    const sample = async (tag, ms) => {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) {
        const s = await p.evaluate(() => {
          const g = (q) => document.querySelector(q);
          const cs = (q) => (g(q) ? getComputedStyle(g(q)) : {});
          return [cs('.nav-menu').display, (+cs('.nav-menu').opacity).toFixed(2), cs('.nav-links').transform,
            cs('.toggle-label').transform, cs('.toggle-span.is-top').transform, cs('.toggle-span.is-bottom').transform,
            getComputedStyle(document.documentElement).overflow, cs('#menu-toggle').backgroundColor].join(' | ');
        });
        log.push(`${tag} +${Date.now() - t0}ms ${s}`);
        await p.waitForTimeout(25);
      }
    };
    await scrollToY(p, vp, vp.h * 0.5);
    await p.waitForTimeout(800);
    log.push('before open: ' + JSON.stringify(await p.evaluate(STATE)));
    await p.click('#menu-toggle');
    await sample('open', 900);
    log.push('open: ' + JSON.stringify(await p.evaluate(STATE)));
    // Card hover → Lottie frame (Webflow lottie plugin).
    if (!vp.m) {
      const card = p.locator('.nav-link').nth(1);
      const frames = async (ms) => {
        const t0 = Date.now(); const f = [];
        while (Date.now() - t0 < ms) {
          f.push(await p.evaluate(() => {
            const el = document.querySelectorAll('.nav-link')[1].querySelector('.lottie-card');
            const a = window.Webflow?.require?.('lottie')?.lottie?.getRegisteredAnimations?.().find((x) => x.wrapper === el);
            return a ? `${Math.round(a.currentFrame)}/${Math.round(a.totalFrames)}` : '?';
          }));
          await p.waitForTimeout(50);
        }
        return f.join(' ');
      };
      await card.hover();
      log.push('hover frames: ' + (await frames(900)));
      await p.mouse.move(vp.w / 2, 30);
      log.push('out frames: ' + (await frames(900)));
      // Wheel over the menu scrolls the track horizontally.
      const sl0 = await p.evaluate(() => document.querySelector('.nav-track').scrollLeft);
      await p.mouse.move(vp.w / 2, vp.h / 2);
      await p.mouse.wheel(0, 300);
      await p.waitForTimeout(400);
      const sl1 = await p.evaluate(() => document.querySelector('.nav-track').scrollLeft);
      log.push(`wheel 300: scrollLeft ${sl0} → ${sl1}, page scrollY ${await p.evaluate(() => scrollY)}`);
    } else {
      const t = await p.evaluate(() => { const t = document.querySelector('.nav-track'); const sc = document.querySelector('.sticky-container.is-nav-links'); const h = document.querySelector('.height-container.is-nav-links'); return { track: [t.scrollWidth, t.clientWidth, getComputedStyle(t).overflowX, getComputedStyle(t).overflowY], sticky: getComputedStyle(sc).position, height: h.getBoundingClientRect().height, menuOverflow: getComputedStyle(document.querySelector('.nav-menu')).overflowY }; });
      log.push('mobile track: ' + JSON.stringify(t));
    }
    await p.click('#menu-toggle');
    await sample('close', 700);
    await p.waitForTimeout(600);
    log.push('after close: ' + JSON.stringify(await p.evaluate(STATE)));
    // Link click: open the menu, click Courses & sources (last link), see where the page lands.
    await p.click('#menu-toggle');
    await p.waitForTimeout(900);
    const hrefs = await p.evaluate(() => [...document.querySelectorAll('.nav-link')].map((a) => a.getAttribute('href')));
    log.push('hrefs: ' + hrefs.join(' '));
    await p.locator('.nav-link').nth(2).click({ force: true });
    await p.waitForTimeout(2500);
    log.push(`after link 3 click: scrollY ${await p.evaluate(() => scrollY)} target top ${await p.evaluate((h) => document.querySelector(h)?.getBoundingClientRect().top, hrefs[2])} ` + JSON.stringify(await p.evaluate(STATE)));
    fs.writeFileSync(`${out}/nav-menu-${vp.name}.txt`, log.join('\n') + '\n');
    console.log(vp.name, 'menu', log.length);
  }

  // edge — the Resources → footer switch: env FROM / TO (scrollY, defaults: 0.9·max … max), 20 px steps; logs the footer top,
  // the overlay opacity, the old pin box and the navbar / sound colours (nav-edge-<vp>.txt).
  if (parts.includes('edge')) {
    await p.goto(url, { waitUntil: 'load', timeout: 120000 });
    await p.waitForTimeout(6000);
    await p.click('.trigger', { timeout: 5000 }).catch(() => {});
    await p.waitForTimeout(3000);
    // Walk down first: the old Resources pin is created lazily.
    const max0 = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    await scrollToY(p, vp, max0 * 0.8);
    await p.waitForTimeout(1500);
    const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    const from = +(process.env.FROM || max * 0.9), to = +(process.env.TO || max);
    const lines = [];
    let prev = '';
    for (let y = from; y <= to; y += 20) {
      const at = await scrollToY(p, vp, y);
      await p.waitForTimeout(450);
      const s = await p.evaluate(() => {
        const r = (q) => document.querySelector(q)?.getBoundingClientRect();
        const c = (q, k) => (document.querySelector(q) ? getComputedStyle(document.querySelector(q))[k] : '-');
        return { foot: Math.round(r('.footer')?.top), pin: Math.round(r('.resources')?.top), sec: Math.round(r('section#resources')?.bottom),
          overlay: (+c('.resources-overlay', 'opacity')).toFixed(2), overlayBg: c('.resources-overlay', 'backgroundColor'),
          logo: c('#logo-wrap', 'backgroundColor'), sound: c('.sound-icon-wrap', 'backgroundColor') + ' ' + c('.sound-btn-wrap', 'display') };
      });
      const key = s.logo + s.sound;
      lines.push(`${key !== prev ? '*' : ' '} y ${Math.round(at)} footTop ${s.foot} pinTop ${s.pin} secBottom ${s.sec} overlay ${s.overlay} ${s.overlayBg} | logo ${s.logo} | sound ${s.sound}`);
      prev = key;
    }
    fs.writeFileSync(`${out}/nav-edge-${vp.name}.txt`, `max ${max}\n` + lines.join('\n') + '\n');
    console.log(vp.name, 'edge', lines.length);
  }

  if (parts.includes('scan')) {
    await p.goto(url, { waitUntil: 'load', timeout: 120000 });
    await p.waitForTimeout(6000);
    await p.click('.trigger', { timeout: 5000 }).catch(() => {});
    await p.waitForTimeout(3000);
    const lines = [];
    let prev = '';
    let y = 0;
    for (let i = 0; i < 2000; i++) {
      const at = await scrollToY(p, vp, y);
      await p.waitForTimeout(550);
      const s = await p.evaluate(STATE);
      const key = JSON.stringify(s);
      if (key !== prev) {
        lines.push(`y ${Math.round(at)} navLine ${s.navLine} | soundLine ${s.soundLine}\n   logo ${s.logo} | toggle ${s.toggle} | span ${s.span} | eyes ${s.eyes} | crumbs ${s.crumbs} | sound ${s.sound}`);
        prev = key;
      }
      const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      if (at >= max - 8) break;
      y = at + vp.h / 4;
    }
    fs.writeFileSync(`${out}/nav-scan-${vp.name}.txt`, lines.join('\n') + '\n');
    console.log(vp.name, 'scan', lines.length);
  }
  await ctx.close();
}
await b.close();
