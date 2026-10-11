// Probe the live Sound button (div.fixed-bottom → .sound-btn-wrap → .sound-icon-wrap, two SVG embeds) on motion.zajno.com.
//   struct — computed-style walk of .fixed-bottom (sound-struct-<vp>.json), the live CSS rules of its classes (sound-css.txt),
//            the <audio> elements and their sources, screenshots of both states
//   enter  — reloads and samples the entrance scale of .sound-btn-wrap after the preloader every ~30 ms (sound-enter-<vp>.txt)
//   scan   — scrolls the whole page in vh/4 steps and logs every change of the button colours together with the .nav wrapper
//            under the sound line (bottom − 90) and under the navbar line (top + 1) (sound-scan-<vp>.txt)
//   footer — the hide / show over the footer: aims at the footer top in 20 px steps and samples display / opacity / scale
//            of .sound-btn-wrap every ~25 ms around the switch, both directions (sound-footer-<vp>.txt)
//   click  — clicks the button: is-active class, the bg <audio> state, the dataLayer events, the click / hover sounds
//            (sound-click-<vp>.txt)
// Usage: node sound-probe.mjs [url] [outDir]   env ONLY=1440|768|375, PART=struct,enter,scan,footer,click
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
  'color', 'backgroundColor', 'border', 'borderRadius', 'overflow', 'zIndex', 'transform', 'top', 'left', 'right', 'bottom', 'opacity',
  'visibility', 'pointerEvents', 'transition', 'cursor', 'order', 'boxSizing'];
const SOUND_RE = /sound|fixed-bottom/;
const parts = (process.env.PART || 'struct,enter,scan,footer,click').split(',');
const only = process.env.ONLY;

// Sound button state as the old script.v33 block I paints it, with the wrappers under both lines.
const STATE = () => {
  const cs = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e) : null; };
  const c = (s, p) => cs(s)?.[p] ?? '-';
  const lineHit = (y) => {
    const hit = [...document.querySelectorAll('.nav')].find((n) => { const r = n.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    const inner = [...document.querySelectorAll('.nav-inner')].find((n) => { const r = n.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    const name = (n) => (n ? (n.id || n.querySelector('[id]')?.id || '') + '.' + [...n.classList].filter((k) => k !== 'nav').join('.') : '-');
    return name(hit) + (inner ? ' >inner' + name(inner) : '');
  };
  const wrap = document.querySelector('.sound-btn-wrap');
  const r = wrap?.getBoundingClientRect();
  return {
    sound: [c('.sound-icon-wrap', 'backgroundColor'), c('.sound-icon-wrap', 'borderTopColor'), c('.sound-icon-wrap', 'color')].join(' '),
    wrap: `${c('.sound-btn-wrap', 'display')} op ${(+c('.sound-btn-wrap', 'opacity')).toFixed(2)} tf ${c('.sound-btn-wrap', 'transform')} box ${r ? [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(1)).join(',') : '-'}`,
    logo: c('#logo-wrap', 'backgroundColor'),
    navLine: lineHit(1),
    soundLine: lineHit(innerHeight - 90),
    footTop: Math.round(document.querySelector('.footer')?.getBoundingClientRect().top ?? -1),
  };
};

async function walk(p, root) {
  return p.evaluate(({ root, PROPS }) => {
    const res = [];
    const rec = (el, d) => {
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el), st = {};
      for (const k of PROPS) st[k] = cs[k];
      res.push({ d, tag: el.tagName.toLowerCase(), id: el.id || undefined, cls: el.className?.baseVal ?? el.className,
        r: [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(1)), ix: el.getAttribute('data-w-id') || undefined,
        style: el.getAttribute('style') || undefined, html: el.classList?.contains('w-embed') ? el.innerHTML.trim() : undefined, st });
      if (el.tagName === 'svg' || el.classList?.contains('w-embed')) return;
      for (const ch of el.children) rec(ch, d + 1);
    };
    const el = document.querySelector(root);
    if (el) rec(el, 0);
    return res;
  }, { root, PROPS });
}

async function dumpCss(p) {
  const href = await p.evaluate(() => [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href).find((h) => /webflow.*\.css/.test(h)));
  const css = await (await fetch(href)).text();
  const lines = [];
  const take = (start) => { let depth = 0, j = start; for (; j < css.length; j++) { if (css[j] === '{') depth++; else if (css[j] === '}') { depth--; if (!depth) break; } } return j; };
  const scan = (from, to, mq) => {
    let k = from;
    while (k < to) {
      const open = css.indexOf('{', k);
      if (open < 0 || open >= to) break;
      const sel = css.slice(k, open).trim();
      if (sel.startsWith('@media')) { const end = take(open); scan(open + 1, end, sel); k = end + 1; continue; }
      const close = css.indexOf('}', open);
      if (SOUND_RE.test(sel)) lines.push(`${mq ? mq + ' ' : ''}${sel} {${css.slice(open + 1, close)}}`);
      k = close + 1;
    }
  };
  scan(0, css.length, '');
  fs.writeFileSync(`${out}/sound-css.txt`, `${href}\n` + lines.join('\n') + '\n');
  return lines.length;
}

// Native jump first (the live Lenis syncs to it), then short wheel / scrollBy nudges; gives up after 20 tries.
async function scrollToY(p, vp, target) {
  const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const t = Math.min(target, max);
  await p.evaluate((y) => scrollTo(0, y), t);
  await p.waitForTimeout(250);
  for (let i = 0; i < 20; i++) {
    const y = await p.evaluate(() => scrollY);
    const d = t - y;
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

  if (parts.includes('enter')) {
    // The entrance after the preloader (IX2 a-161: scale 0 → 1, 600 ms, delay 200 after phase 3 starts).
    const log = [];
    const t0 = Date.now();
    let last = '';
    while (Date.now() - t0 < 16000) {
      const s = await p.evaluate(() => {
        const w = document.querySelector('.sound-btn-wrap'), n = document.querySelector('.nav-panels');
        return `${getComputedStyle(w).transform} | nav ${getComputedStyle(n).transform} | loader ${getComputedStyle(document.querySelector('.loader-wrap')).display}`;
      });
      if (s !== last) log.push(`+${Date.now() - t0}ms ${s}`);
      last = s;
      await p.waitForTimeout(30);
    }
    fs.writeFileSync(`${out}/sound-enter-${vp.name}.txt`, log.join('\n') + '\n');
    console.log(vp.name, 'enter', log.length);
  } else {
    await p.waitForTimeout(6000);
    await p.click('.trigger', { timeout: 5000 }).catch(() => {});
    await p.waitForTimeout(3000);
  }
  await p.waitForTimeout(2000);

  if (parts.includes('struct')) {
    const off = await walk(p, '.fixed-bottom');
    const audio = await p.evaluate(() => [...document.querySelectorAll('audio')].map((a) => ({ id: a.id, loop: a.loop, preload: a.preload, src: a.querySelector('source')?.src, readyState: a.readyState, volume: a.volume })));
    await p.screenshot({ path: `${out}/sound-off-${vp.name}.png`, clip: { x: vp.w - 120, y: vp.h - 100, width: 120, height: 100 } });
    await p.click('.sound-btn-wrap');
    await p.waitForTimeout(800);
    const on = await walk(p, '.fixed-bottom');
    await p.screenshot({ path: `${out}/sound-on-${vp.name}.png`, clip: { x: vp.w - 120, y: vp.h - 100, width: 120, height: 100 } });
    await p.click('.sound-btn-wrap');
    await p.waitForTimeout(800);
    fs.writeFileSync(`${out}/sound-struct-${vp.name}.json`, JSON.stringify({ off, on, audio }, null, 1));
    if (vp.name === '1440') console.log('css rules', await dumpCss(p));
    console.log(vp.name, 'struct', off.length, JSON.stringify(audio.map((a) => a.id)));
  }

  if (parts.includes('click')) {
    const log = [];
    await p.evaluate(() => { window.__dl = []; const push = dataLayer.push.bind(dataLayer); dataLayer.push = (...a) => { window.__dl.push(JSON.stringify([...a[0] || a])); return push(...a); }; });
    const st = () => p.evaluate(() => {
      const a = document.getElementById('audio');
      return `mute.is-active ${document.querySelector('.sound-btn-mute').classList.contains('is-active')} | icon ${getComputedStyle(document.querySelector('.sound-icon-wrap')).backgroundColor} | bg paused ${a.paused} t ${a.currentTime.toFixed(2)} vol ${a.volume} loop ${a.loop} | dl ${JSON.stringify(window.__dl)}`;
    });
    log.push('initial: ' + (await st()));
    await p.click('.sound-btn-wrap');
    await p.waitForTimeout(700);
    log.push('after click 1: ' + (await st()));
    // The click sound on a menu link and a hover sound (desktop): sample the <audio> elements.
    if (!vp.m) {
      await p.click('#menu-toggle');
      await p.waitForTimeout(900);
      await p.hover('#link2');
      await p.waitForTimeout(300);
      log.push('hover link2: ' + (await p.evaluate(() => [...document.querySelectorAll('audio')].filter((a) => !a.paused).map((a) => `${a.id} t ${a.currentTime.toFixed(2)}`).join(' '))));
      await p.click('#menu-toggle');
      await p.waitForTimeout(900);
    }
    const clickSrc = await p.evaluate(() => document.querySelectorAll('.sound_click').length);
    log.push(`.sound_click elements: ${clickSrc}`);
    await p.click('.sound-btn-wrap');
    await p.waitForTimeout(700);
    log.push('after click 2: ' + (await st()));
    fs.writeFileSync(`${out}/sound-click-${vp.name}.txt`, log.join('\n') + '\n');
    console.log(vp.name, 'click', log.length);
  }

  if (parts.includes('scan')) {
    const lines = [];
    let prev = '';
    const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let y = 0; y <= max + vp.h / 4; y += vp.h / 4) {
      const at = await scrollToY(p, vp, y);
      await p.waitForTimeout(600);
      const s = await p.evaluate(STATE);
      const key = s.sound + s.wrap.split(' op')[0];
      if (key !== prev) lines.push(`y ${Math.round(at)} soundLine ${s.soundLine} | navLine ${s.navLine} | footTop ${s.footTop}\n   sound ${s.sound} | wrap ${s.wrap} | logo ${s.logo}`);
      prev = key;
      if (at >= max - 2) break;
    }
    fs.writeFileSync(`${out}/sound-scan-${vp.name}.txt`, lines.join('\n') + '\n');
    console.log(vp.name, 'scan', lines.length);
  }

  if (parts.includes('footer')) {
    // Around the footer entering the viewport: where exactly the hide fires and its timing, then back up.
    const log = [];
    const footTop = async () => p.evaluate(() => document.querySelector('.footer').getBoundingClientRect().top + scrollY);
    const sample = async (tag, ms) => {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) {
        const s = await p.evaluate(() => { const w = document.querySelector('.sound-btn-wrap'); const cs = getComputedStyle(w); return `${cs.display} ${(+cs.opacity).toFixed(2)} ${cs.transform} footTop ${Math.round(document.querySelector('.footer').getBoundingClientRect().top)} vh ${innerHeight}`; });
        log.push(`${tag} +${Date.now() - t0}ms ${s}`);
        await p.waitForTimeout(25);
      }
    };
    const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    await scrollToY(p, vp, max);
    await p.waitForTimeout(1500);
    await scrollToY(p, vp, max);
    await p.waitForTimeout(1500);
    let ft = await footTop();
    log.push(`max ${max} footTop ${ft} (footer top − vh = ${ft - vp.h})`);
    // Walk up until the button is visible, then down in 20 px steps and sample at the switch.
    await scrollToY(p, vp, ft - vp.h - 400);
    await p.waitForTimeout(1200);
    ft = await footTop();
    log.push(`up: ${JSON.stringify(await p.evaluate(STATE))}`);
    for (let y = ft - vp.h - 100; y <= Math.min(max, ft - vp.h + 100); y += 20) {
      await p.evaluate((y) => scrollTo(0, y), y);
      await p.waitForTimeout(120);
      const s = await p.evaluate(() => { const w = document.querySelector('.sound-btn-wrap'); const cs = getComputedStyle(w); return `${cs.display} ${(+cs.opacity).toFixed(2)} footTop ${Math.round(document.querySelector('.footer').getBoundingClientRect().top)}`; });
      const changed = !log.at(-1).endsWith(s);
      log.push(`${changed ? '*' : ' '} y ${y} scrollY ${await p.evaluate(() => scrollY)} ${s}`);
      if (changed && s.startsWith('none')) break;
    }
    // Timing: go back up 300 px, then jump 300 px down and sample every ~25 ms.
    await p.evaluate((y) => scrollTo(0, y), ft - vp.h - 300);
    await p.waitForTimeout(1500);
    await p.evaluate((y) => scrollTo(0, y), ft - vp.h + 60);
    await sample('hide', 900);
    await p.evaluate((y) => scrollTo(0, y), ft - vp.h - 300);
    await sample('show', 900);
    fs.writeFileSync(`${out}/sound-footer-${vp.name}.txt`, log.join('\n') + '\n');
    console.log(vp.name, 'footer', log.length);
  }

  await ctx.close();
}
await b.close();
