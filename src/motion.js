/*
  motion.js — the single animation module of the Motion rebuild.
  Canonical source: src/motion.js. Runs next to the old script.v33 during the transition: see legacy-guard.js
  and syncLegacy() below; both go away together with the old script.

  Rules (CONVENTIONS.md):
  - DOM is bound only through data-motion="<role>" attributes, never through classes.
  - Every section is one init function with an "is it in the DOM?" guard.
  - Library versions are pinned. One GSAP for the whole site.
  - Numbers come from docs/sections/<section>.md; keep them 1:1 with the live site.
*/

// Must stay the first import: hides the old global GSAP while ours is imported.
import './legacy-guard.js';
// Pinned: re-check the latest 3.x before stage 4 and bump in one place.
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm';
import { CustomEase } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/CustomEase/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/ScrollTrigger/+esm';
import { MotionPathPlugin } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/MotionPathPlugin/+esm';

gsap.registerPlugin(CustomEase, ScrollTrigger, MotionPathPlugin);
// Our plugins are bound to our core now: give the old script its global back.
if ('__legacyGsap' in window) {
  window.gsap = window.__legacyGsap;
  delete window.__legacyGsap;
}

// Landing eases of the live site (script.v33 block C), used by intro and ui.
CustomEase.create('bounce', 'M0,0 C0.05222,-0.59802 0.31828,-1.38625 0.55039,0 0.65208,-0.78892 0.94566,-0.58262 1,1');
CustomEase.create('bounceSmall', 'M0,0,C0.052,-0.598,0.246,-0.72,0.336,0,0.498,-0.502,0.792,-0.482,1,1');

/* ---------- helpers ---------- */

const q = (role, root = document) => root.querySelector(`[data-motion="${role}"]`);
const qa = (role, root = document) => [...root.querySelectorAll(`[data-motion="${role}"]`)];
// Present elements only: GSAP throws on null entries inside a target array.
const els = (...xs) => xs.flat().filter(Boolean);

// Named cubic-bezier ease, cached by its control points.
const bez = (x1, y1, x2, y2) => {
  const name = `bez-${x1}-${y1}-${x2}-${y2}`;
  return CustomEase.get(name) || CustomEase.create(name, `M0,0 C${x1},${y1} ${x2},${y2} 1,1`);
};

const remPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

// Bands match the Webflow breakpoints: medium ≤991, tiny ≤479.
const band = () => (innerWidth >= 992 ? 'desktop' : innerWidth >= 480 ? 'tablet' : 'mobile');

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const wait = (s) => new Promise((resolve) => gsap.delayedCall(s, resolve));

/* ---------- preloader (docs/sections/preloader.md, «План анімації») ---------- */

const FRAME = 1 / 24; // the live Lottie ran at 24 fps

// Phase 2 timing per band, seconds inside the 3.23 s phase: [start, duration].
const WORDS_TIMING = {
  desktop: { disc: [[0, 1.35], [0.94, 1.37], [1.82, 1.36]], word: [[0.17, 1.24], [1.28, 1.06], [2.09, 1.11]], k: [0.604, 0.613, 0.613] },
  tablet: { disc: [[0, 1.46], [0.82, 1.48], [1.58, 1.48]], word: [[0.15, 1.37], [1.11, 1.21], [1.81, 1.41]], k: [0.545, 0.545, 0.545] },
  mobile: { disc: [[0, 1.54], [0.92, 1.56], [1.65, 1.55]], word: [[0.14, 1.45], [1.06, 1.3], [1.73, 1.49]], k: [0.535, 0.535, 0.535] },
};
const PHASE1 = 5.0;
const PHASE2 = 3.23;

// Phase 1: the ball bounces on its shadow, 13 frames per loop.
function bounceLoop(ball, shadow) {
  const r = remPx();
  const f = (n) => n * FRAME;
  const tl = gsap.timeline({ repeat: -1 });
  tl.set(ball, { transformOrigin: '50% 50%' }, 0)
    // fall, impact, hold, rise
    .to(ball, { y: 0.355 * r, duration: f(4), ease: bez(0.641, 0, 0.702, 0.74) }, 0)
    .to(ball, { y: 0.384 * r, duration: f(1), ease: bez(0.271, 0.715, 0.592, 1) }, f(4))
    .to(ball, { y: 0, duration: f(7), ease: bez(0.167, 0.021, 0.833, 1) }, f(6))
    // squash and stretch, linear between key frames (Lottie % / 200)
    .fromTo(ball, { scaleX: 1, scaleY: 1 }, { scaleX: 0.9, scaleY: 1.105, duration: f(1), ease: 'none' }, f(2))
    .to(ball, { scaleX: 0.825, scaleY: 1.075, duration: f(1), ease: 'none' }, f(3))
    .to(ball, { scaleX: 1.2, scaleY: 0.8, duration: f(1), ease: 'none' }, f(4))
    .to(ball, { scaleX: 1.25, scaleY: 0.75, duration: f(1), ease: 'none' }, f(5))
    .to(ball, { scaleX: 0.825, scaleY: 1.075, duration: f(1), ease: 'none' }, f(6))
    .to(ball, { scaleX: 0.91, scaleY: 1.075, duration: f(1), ease: 'none' }, f(7))
    .to(ball, { scaleX: 1, scaleY: 1, duration: f(2), ease: 'none' }, f(8))
    // shadow shrinks on impact; TODO verify the f5–f7 window against the recording
    .to(shadow, { scaleX: 0.5, duration: f(1), ease: bez(0.63, 0, 0.37, 1) }, f(4))
    .to(shadow, { scaleX: 1, duration: f(3), ease: bez(0.63, 0, 0.37, 1) }, f(7))
    .set({}, {}, f(13)); // pad the loop to exactly 13 frames
  return tl;
}

function countTo100(counter, duration) {
  const state = { v: 0 };
  return gsap.to(state, {
    v: 100,
    duration,
    ease: 'none',
    onUpdate: () => (counter.textContent = Math.round(state.v)),
  });
}

// Phase 2: three discs grow from the centre, each word crosses the centre inside them.
function wordsTimeline(scene, b) {
  const t = WORDS_TIMING[b];
  const R = (Math.hypot(innerWidth, innerHeight) / 2) * 1.01;
  const vh = innerHeight;
  const tl = gsap.timeline();
  qa('preloader-step', scene).forEach((step, i) => {
    const disc = q('preloader-disc', step);
    const words = qa('preloader-word', step); // base word + its copy inside the disc
    tl.fromTo(
      disc,
      { clipPath: 'circle(0px at 50% 50%)' },
      { clipPath: `circle(${R}px at 50% 50%)`, duration: t.disc[i][1], ease: bez(0.65, 0, 0.833, 0.833) },
      t.disc[i][0]
    );
    tl.fromTo(
      words,
      { y: t.k[i] * vh },
      { y: -t.k[i] * vh, duration: t.word[i][1], ease: i === 0 ? bez(0.309, 0, 0.833, 0.833) : bez(0.35, 0, 0.833, 0.833) },
      t.word[i][0]
    );
  });
  tl.set({}, {}, PHASE2); // the phase is exactly 3.23 s long whatever the band
  return tl;
}

// Hero start states, set while the overlay still covers the page.
function heroHidden() {
  gsap.set(els(q('hero-ball-border'), q('hero-ball')), { scale: 0, opacity: 0 });
  gsap.set(els(qa('hero-divider')), { scaleX: 0 });
  gsap.set(els(q('hero-text')), { y: innerHeight * 0.5 });
}

// Phase 3: the real Hero enters (no Hero copy inside the preloader).
function heroEntrance() {
  const ring = els(q('hero-ball-border'), q('hero-ball'));
  const nav = q('nav');
  const sound = q('sound-btn');
  const tl = gsap.timeline();
  tl.to(ring, { scale: 1, duration: 0.6, ease: bez(0.17, 0.17, 0.2, 1) }, 0)
    .to(ring, { opacity: 1, duration: 0.1, ease: 'none' }, 0)
    .to(els(q('hero-text')), { y: 0, duration: 1.1, ease: bez(0.17, 0.17, 0.29, 1) }, 0)
    .to(els(qa('hero-divider')), { scaleX: 1, duration: 1.5, ease: bez(0.17, 0.17, 0.01, 1) }, 0.2);
  // Navigation and Sound get their roles in their own passes.
  if (nav) tl.fromTo(nav, { yPercent: -200 }, { yPercent: 0, duration: 0.6, ease: bez(0.17, 0.17, 0.29, 1) }, 0.2);
  if (sound) tl.fromTo(sound, { scale: 0 }, { scale: 1, duration: 0.6, ease: bez(0.17, 0.17, 0.29, 1) }, 0.2);
  return tl;
}

function heroShown() {
  gsap.set(els(q('hero-ball-border'), q('hero-ball')), { scale: 1, opacity: 1 });
  gsap.set(els(qa('hero-divider')), { scaleX: 1 });
  gsap.set(els(q('hero-text')), { y: 0 });
}

/**
 * Runs the preloader and resolves once Hero has fully entered (≈9.93 s on the live site).
 * Other section modules start after it, then ScrollTrigger.refresh().
 */
export async function initPreloader({ lenis = null } = {}) {
  const root = q('preloader');
  const html = document.documentElement;
  if (!root || !html.classList.contains('is-preloading')) return;
  window.__motionPreloader = true;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);
  lenis?.stop();

  const loader = q('preloader-loader', root);
  const counter = q('preloader-counter', root);

  try {
    if (reducedMotion()) {
      heroShown();
      counter.textContent = '100';
      await wait(0.4);
      await gsap.to(root, { opacity: 0, duration: 0.4, ease: 'none' });
      return;
    }

    heroHidden();

    // Phase 1, 0 → 5.0 s: bounce + counter; words never start in a fallback font.
    const bounce = bounceLoop(q('preloader-bounce-ball', root), q('preloader-bounce-shadow', root));
    countTo100(counter, 4.0);
    await Promise.all([wait(PHASE1), document.fonts.ready]);
    bounce.kill();
    loader.style.display = 'none'; // instant, as on the live site

    // Phase 2, 5.0 → 8.23 s: discs and words; ends on a fully dark screen.
    await wordsTimeline(q('preloader-scene', root), band());

    // Phase 3, 8.23 → 9.93 s: overlay off, the real Hero enters.
    html.classList.remove('is-preloading');
    await heroEntrance();
  } finally {
    html.classList.remove('is-preloading');
    lenis?.start();
    document.dispatchEvent(new Event('motion:preloader-done'));
  }
}

/* ---------- hero ---------- */

// Exit of the lines and ring when Intro enters (docs/sections/hero.md, script.v33 block C).
// One point trigger: Intro top minus the axis height reaches the viewport centre.
// Down: lines collapse towards the ring (1 s), then the ring shrinks (0.5 s); up: reverse order.
// Eases are GSAP defaults (power1.out), as on the live site.
export function initHero() {
  const axis = q('hero-ball-wrap');
  const intro = q('intro');
  if (!axis || !intro) return;
  const lines = els(qa('hero-divider'));
  const ring = els(q('hero-ball-border'));
  const k = reducedMotion() ? 0 : 1;

  const collapse = () =>
    gsap.timeline({ defaults: { overwrite: true } })
      .to(lines, { scaleX: 0, duration: 1 * k })
      .to(ring, { scale: 0, duration: 0.5 * k });
  const expand = () =>
    gsap.timeline({ defaults: { overwrite: true } })
      .to(ring, { scale: 1, duration: 0.5 * k })
      .to(lines, { scaleX: 1, duration: 1 * k });

  const point = () => `top-=${axis.offsetHeight} center`;
  ScrollTrigger.create({
    trigger: intro,
    start: point,
    end: point,
    onEnter: collapse,
    onLeaveBack: expand,
  });
}

/* ---------- intro ---------- */

// Path progress (0..1) where the pill texts 1–3 open; the 4th opens at the path end. Live values per band.
const INTRO_STOPS = {
  desktop: [0.1477, 0.43367, 0.61329, 1],
  tablet: [0.12336, 0.37553, 0.53228, 1],
  mobile: [0.13847, 0.348, 0.5061, 1],
};

// Document-space centre of a box.
const centre = (r) => ({ x: r.left + r.width / 2 + scrollX, y: r.top + r.height / 2 + scrollY });

// Where the Hero ball rests with no own transform once Hero has scrolled past: the sticky box is then
// released at the bottom of its section. Layout-based, so it does not depend on the current scroll
// (the live site aligned the path at load time, while the sticky box was somewhere else).
function heroBallRest(ball) {
  const sticky = q('hero-ball-sticky');
  const wrap = q('hero-ball-wrap');
  const c = centre(ball.getBoundingClientRect());
  let dx = -gsap.getProperty(ball, 'x') - (wrap ? gsap.getProperty(wrap, 'x') : 0);
  let dy = -gsap.getProperty(ball, 'y');
  if (sticky) {
    const host = sticky.parentElement;
    const stickyY = gsap.getProperty(sticky, 'y');
    const bottom = host.getBoundingClientRect().bottom - parseFloat(getComputedStyle(host).paddingBottom);
    dy += bottom - (sticky.getBoundingClientRect().bottom - stickyY) - stickyY;
  }
  return { x: c.x + dx, y: c.y + dy };
}

// Width of a ui panel before the slider touches it (CSS: 25vw, ≤991 100vw).
const panelRestWidth = () => (innerWidth >= 992 ? 0.25 : 1) * innerWidth;

// Natural (unpinned, untransformed) centre of an element inside a ui block, in document space.
// `w` overrides the element width (a panel may be mid-tween during a refresh).
function uiNaturalCentre(el, block, w = el.offsetWidth) {
  const anchor = block.parentElement.classList.contains('pin-spacer') ? block.parentElement : block;
  const a = anchor.getBoundingClientRect();
  let x = w / 2;
  let y = el.offsetHeight / 2;
  for (let n = el; n && n !== block; n = n.offsetParent) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x: a.left + scrollX + x, y: a.top + scrollY + y };
}

/**
 * The Hero ball drops into Intro, rolls along the SVG path and opens the four pill texts, then lands
 * in the first UI panel (script.v33 block C). The pill clouds get the IX2 parallax of the live site.
 */
export function initIntro() {
  const scene = q('intro');
  const ball = q('hero-ball');
  if (!scene || !ball) return;
  const texts = qa('intro-text', scene).sort((a, b) => a.dataset.step - b.dataset.step);
  const block = q('ui');
  const landing = block && q('ui-landing', block);

  // Pill texts and the ball hand-over follow the timeline position, so jumps and refreshes stay consistent.
  const shown = texts.map(() => null);
  const setText = (i, on) => {
    if (shown[i] === on) return;
    shown[i] = on;
    gsap.to(texts[i], { yPercent: on ? 0 : 100, overwrite: true });
  };
  let handed = null;
  const handOver = (on) => {
    if (handed === on) return;
    handed = on;
    gsap.set(ball, { visibility: on ? 'hidden' : '' }); // opacity belongs to the preloader entrance
    if (landing) gsap.set(landing, { opacity: on ? 1 : 0 });
  };

  initIntroClouds(scene);

  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: '(min-width: 992px)',
      tablet: '(min-width: 480px) and (max-width: 991px)',
      mobile: '(max-width: 479px)',
      reduce: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const b = ctx.conditions.desktop ? 'desktop' : ctx.conditions.tablet ? 'tablet' : 'mobile';
      const path = scene.querySelector(`[data-motion="intro-path"][data-bp="${b}"]`);
      if (!path) return;

      if (ctx.conditions.reduce) {
        // No travel: texts are visible, the ball hands over as soon as Intro starts.
        texts.forEach((t, i) => setText(i, true));
        const st = ScrollTrigger.create({
          trigger: scene,
          start: 'top center',
          onEnter: () => handOver(true),
          onLeaveBack: () => handOver(false),
        });
        const resync = () => {
          handed = null;
          handOver(st.scroll() >= st.start);
        };
        ScrollTrigger.addEventListener('refresh', resync);
        return () => ScrollTrigger.removeEventListener('refresh', resync);
      }

      // Path geometry in the ball's translate space, recomputed on every refresh.
      const toBall = () => {
        const m = path.getScreenCTM();
        const rest = heroBallRest(ball);
        return { a: m.a, b: m.b, c: m.c, d: m.d, e: m.e + scrollX - rest.x, f: m.f + scrollY - rest.y };
      };
      const at = (t) => {
        const m = toBall();
        const p = path.getPointAtLength(t * path.getTotalLength());
        return { x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f };
      };
      const land = () => {
        const target = uiNaturalCentre(q('ui-slide', block), block, panelRestWidth());
        const rest = heroBallRest(ball);
        return { x: target.x - rest.x, y: target.y - rest.y };
      };
      const segment = (start, end) => () => ({ path: path.getAttribute('d'), matrix: toBall(), start, end });

      const stops = INTRO_STOPS[b];
      const drop = b === 'desktop' ? 4 : 8;
      // Timeline positions where text i opens: end of the drop, then the first three stops.
      const marks = [drop, drop + 7, drop + 25, drop + 39];

      gsap.set(texts, { yPercent: 100 });
      shown.fill(false);

      const tl = gsap.timeline({
        defaults: { ease: 'none', immediateRender: false },
        scrollTrigger: {
          trigger: scene,
          start: 'top center',
          // Ends exactly where the first UI block pins (desktop: half the heading below the scene).
          endTrigger: block || scene,
          end: block ? 'top top' : 'bottom center',
          scrub: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => sync(),
      });
      const sync = () => {
        const t = tl.time();
        marks.forEach((m, i) => setText(i, t >= m));
        handOver(tl.progress() === 1);
      };
      // ScrollTrigger.refresh() reverts the inline styles of matchMedia animations to measure and restores them
      // afterwards, which can undo state sets made during it: drop the caches and re-apply after every refresh.
      const resync = () => {
        shown.fill(null);
        handed = null;
        sync();
      };
      ScrollTrigger.addEventListener('refresh', resync);

      // Drop from the Hero axis to the path start (live: 0.033·vw + path top on desktop).
      tl.fromTo(ball, { x: 0, y: 0 }, { x: () => at(0).x, y: () => at(0).y, duration: drop })
        .to(ball, { motionPath: segment(0, stops[0]), duration: 7 })
        .to(ball, { motionPath: segment(stops[0], stops[1]), duration: 18 })
        .to(ball, { motionPath: segment(stops[1], stops[2]), duration: 14 })
        .to(ball, { motionPath: segment(stops[2], stops[3]), duration: 27 });

      // Desktop: bounce down into the centre of the first panel while drifting right.
      if (b === 'desktop' && block) {
        tl.fromTo(ball, { y: () => at(1).y }, { y: () => land().y, duration: 8, ease: 'bounce' })
          .fromTo(ball, { x: () => at(1).x }, { x: () => land().x, duration: 8 }, '<');
      }

      return () => {
        ScrollTrigger.removeEventListener('refresh', resync);
        handOver(false);
        gsap.set(ball, { clearProps: 'x,y' });
      };
    }
  );
}

// Bottom clouds settle while the art leaves the viewport: 78→100 % of its pass (IX2 a-127 / a-156).
// The back cloud stops short (1.3rem / 0.8rem); ≤767 starts lower by 2rem instead of 3rem.
function initIntroClouds(scene) {
  const art = q('intro-art', scene);
  const clouds = qa('intro-cloud', scene);
  if (!art || !clouds.length) return;
  gsap.matchMedia().add(
    // Every band is listed: matchMedia() skips the callback when no condition matches.
    { small: '(max-width: 767px)', large: '(min-width: 768px)', reduce: '(prefers-reduced-motion: reduce)' },
    ({ conditions: c }) => {
      if (c.reduce) return;
      const from = () => (c.small ? 2 : 3) * remPx();
      const to = (el) => () => (el.dataset.layer === 'back' ? (c.small ? 0.8 : 1.3) * remPx() : 0);
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: art, start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true },
      });
      // The leading 0–78 gap is part of the timeline, so the clouds hold their start offset until then.
      clouds.forEach((el) => tl.fromTo(el, { y: from }, { y: to(el), duration: 22 }, 78));
    }
  );
}

/* ---------- ui slider (Intro, script.v33 blocks B and D) ---------- */

const CLIP_FULL = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
const CLIP_GONE = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)';

// Centre of an element relative to its ui block, without the element's own GSAP x/y.
function blockRelCentre(el, block) {
  const r = el.getBoundingClientRect();
  const b = block.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 - b.left - gsap.getProperty(el, 'x'),
    y: r.top + r.height / 2 - b.top - gsap.getProperty(el, 'y'),
  };
}

// Document-space top-left of a ui block as laid out in the flow (its pin-spacer while pinned).
function blockOrigin(block) {
  const anchor = block.parentElement.classList.contains('pin-spacer') ? block.parentElement : block;
  const a = anchor.getBoundingClientRect();
  return { x: a.left + scrollX, y: a.top + scrollY };
}

/**
 * Pinned horizontal slider of the Intro: every [data-motion=ui] block pins in DOM order, its rail slides left
 * panel by panel, panels grow 25→75vw and open with a circular clip-path, the video fades in and plays.
 * Between blocks the ui-ball drops from one block into the first panel of the next.
 * Timeline units are the live ones (8 per panel); the live per-panel timelines are merged into one per block.
 */
export function initUi() {
  const blocks = qa('ui');
  if (!blocks.length) return;
  const heroSticky = q('hero-ball-sticky');
  const heroAxis = q('hero-ball-wrap');
  const finalPanel = qa('ui-slide', blocks[blocks.length - 1]).pop();

  gsap.matchMedia().add(
    {
      wide: '(min-width: 992px)',
      narrow: '(max-width: 991px)',
      touch: '(hover: none) and (pointer: coarse)',
      reduce: '(prefers-reduced-motion: reduce)',
    },
    ({ conditions: c }) => {
      const wide = c.wide;
      // Touch screens scroll faster: the live site tripled the pin there and used a slower schedule
      // (+2 units before each panel). Narrow mouse windows take that schedule too: on the live site they
      // mixed both and the rail drifted out of sync with the panels.
      const slow = c.touch || !wide;
      const k = c.reduce ? 0 : 1;
      const vw = () => innerWidth;
      // One rail step: the active panel width.
      const step = () => (wide ? 0.75 : 1) * vw();

      // Videos are preload="none" (the live site autoplayed all six at load): buffer one panel ahead instead.
      const warm = (panel) => {
        const video = q('ui-video', panel);
        if (!video || video.preload === 'auto') return;
        video.preload = 'auto';
        if (video.readyState === 0 && video.networkState !== video.NETWORK_LOADING) video.load();
      };

      const open = new Map();
      const setPanel = (panel, on) => {
        if (open.get(panel) === on) return;
        open.set(panel, on);
        const video = q('ui-video', panel);
        if (on) {
          // 'auto', not true: true would also kill the scrubbed width tweens of the panel.
          gsap.to(panel, { clipPath: `circle(${Math.max(vw(), innerHeight)}px at 50% 50%)`, duration: 0.7 * k, ease: 'none', overwrite: 'auto' });
          if (!video) return;
          video.currentTime = 0;
          gsap.to(video, {
            opacity: 1,
            delay: 0.1 * k,
            duration: 0.6 * k,
            ease: 'none',
            overwrite: true,
            onComplete: () => video.play().catch(() => {}),
          });
        } else {
          gsap.to(panel, {
            clipPath: `circle(${0.09 * remPx()}px at 50% 50%)`,
            duration: 0.7 * k,
            ease: 'none',
            overwrite: 'auto',
            onComplete: () => gsap.set(panel, { clearProps: 'clipPath' }), // back to the rem-based CSS dot
          });
          if (!video) return;
          gsap.to(video, { opacity: 0, duration: 0.7 * k, ease: 'none', overwrite: true, onComplete: () => video.pause() });
        }
      };
      // End state of a panel at once, nothing restarted (after a refresh; an open panel also takes the new radius).
      const settle = (panel, on) => {
        open.set(panel, on);
        const video = q('ui-video', panel);
        gsap.killTweensOf(panel, 'clipPath');
        if (on) gsap.set(panel, { clipPath: `circle(${Math.max(vw(), innerHeight)}px at 50% 50%)` });
        else gsap.set(panel, { clearProps: 'clipPath' });
        if (!video) return;
        gsap.killTweensOf(video);
        gsap.set(video, { opacity: on ? 1 : 0 });
        if (!on) video.pause();
        else if (video.paused) video.play().catch(() => {});
      };

      // ScrollTrigger.refresh() reverts the inline styles of matchMedia animations to measure and restores them
      // afterwards, which can undo state sets made during it: every block re-applies its states after a refresh.
      const resyncs = [];
      const onRefresh = () => resyncs.forEach((f) => f());
      ScrollTrigger.addEventListener('refresh', onRefresh);

      blocks.forEach((block, j) => {
        const track = q('ui-track', block);
        const heading = q('ui-text', block);
        const panels = qa('ui-slide', block);
        const n = panels.length;
        if (!track || !n) return;
        panels.forEach((p) => open.set(p, false));

        // Live: vw·k + vw·n·k + 0.5·vw·n + 0.25·vw, ×3 on touch screens.
        const pinLength = () => {
          const w = vw();
          const kk = wide ? 0.75 : 1;
          return (w * kk + w * n * kk + 0.5 * w * n + 0.25 * w) * (c.touch ? 3 : 1);
        };
        // Rail position after `s` steps. Narrow: the live rail went −100vw while the panel row went from
        // margin −100vw to 0 (no visible move); here the margin stays and the rail is one step behind.
        const railX = (s) => () => -(wide ? s : s - 1) * step();

        const windows = [];
        const tl = gsap.timeline({
          defaults: { ease: 'none', immediateRender: false },
          scrollTrigger: {
            trigger: block,
            pin: true,
            anticipatePin: 1,
            start: 'top top',
            end: () => `+=${pinLength()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
          onUpdate: () => sync(setPanel),
        });
        const sync = (apply) => {
          const t = tl.time();
          windows.forEach(([r0, r1], i) => {
            if (t > r0 - 8) warm(panels[i]);
            apply(panels[i], t > r0 && (t < r1 || panels[i] === finalPanel));
          });
        };
        resyncs.push(() => sync((panel, on) => (open.get(panel) === on ? settle(panel, on) : setPanel(panel, on))));
        // The first video starts buffering one viewport before the pin.
        ScrollTrigger.create({ trigger: block, start: 'top bottom', onEnter: () => warm(panels[0]) });

        // Step 0: the rail brings the first panel in (narrow: the heading wipes out downwards instead).
        if (wide) tl.fromTo(track, { x: 0 }, { x: railX(1), duration: 4 }, 0);
        else if (heading) {
          gsap.set(heading, { y: 0, yPercent: 50 }); // the CSS translateY(50%), kept relative
          tl.fromTo(heading, { yPercent: 50, clipPath: CLIP_FULL }, { yPercent: -50, clipPath: CLIP_GONE, duration: 4 }, 0);
        }

        // Middle panels: one step each, then a hold while the panel is open.
        let t = 4 + (slow ? 6 : 4);
        let s = 1;
        for (let i = 1; i < n - 1; i++, s++, t += 8) tl.fromTo(track, { x: railX(s) }, { x: railX(s + 1), duration: 4 }, t);
        // Last panel: wide holds, then the rail shifts by the 25vw strip; narrow moves one step, then holds.
        const last = s;
        if (wide) {
          t += slow ? 8 : 12;
          tl.fromTo(track, { x: railX(last) }, { x: () => railX(last)() - 0.25 * vw(), duration: 4 }, t);
          t += 4;
        } else {
          tl.fromTo(track, { x: railX(last) }, { x: railX(last + 1), duration: 4 }, t);
          t += 12;
        }
        const total = t;
        tl.set({}, {}, total);

        // Panels: grow at 8·i (+2 slow), open for 4 units (the wide last one for 8), the one before last
        // folds back to 25vw, the last one widens to the full viewport.
        panels.forEach((panel, i) => {
          const start = 8 * i + (slow ? 2 : 0);
          const r0 = start + 4;
          const r1 = r0 + (i === n - 1 && !slow ? 8 : 4);
          windows.push([r0, r1]);
          if (!wide) return;
          tl.fromTo(panel, { width: () => 0.25 * vw() }, { width: () => 0.75 * vw(), duration: 4 }, start);
          if (i === n - 2) tl.fromTo(panel, { width: () => 0.75 * vw() }, { width: () => 0.25 * vw(), duration: 4 }, r1);
          if (i === n - 1) tl.fromTo(panel, { width: () => 0.75 * vw() }, { width: vw, duration: 4 }, r1);
        });

        // The Hero ball can still be landing (intro scrub lags ~1 s): keep it on the first panel. The pin
        // scrolls the page by pinLength linearly, so one tween replaces the live per-frame "manual sticky".
        if (j === 0) {
          if (heroSticky) tl.fromTo(heroSticky, { y: 0 }, { y: () => -pinLength(), duration: total }, 0);
          if (heroAxis && wide) {
            gsap.set(heroAxis, { y: 0, yPercent: 50 }); // keep the CSS translateY(50%) relative
            tl.fromTo(heroAxis, { x: 0 }, { x: () => -0.5 * vw(), duration: 4 }, 0);
          }
        }

        // Hand-over to the next block: from the pin end until the next block pins (one block height later).
        const next = blocks[j + 1];
        if (!next) return;
        const dot = q('ui-ball', block);
        const nextLanding = q('ui-landing', next);
        let mode = null;
        const handState = (p) => {
          const m = p <= 0 ? 0 : p >= 1 ? 2 : 1;
          if (m === mode) return;
          mode = m;
          gsap.set(track, { opacity: m === 0 ? 1 : 0 }); // the dot replaces the last panel's dot
          if (dot) gsap.set(dot, { opacity: m === 1 ? 1 : 0 });
          if (nextLanding) gsap.set(nextLanding, { opacity: m === 2 ? 1 : 0 });
        };

        const ho = gsap.timeline({
          defaults: { ease: 'none', immediateRender: false },
          scrollTrigger: {
            trigger: block,
            start: () => tl.scrollTrigger.end,
            end: () => tl.scrollTrigger.end + block.offsetHeight,
            scrub: true,
            invalidateOnRefresh: true,
          },
          onUpdate: () => handState(ho.progress()),
        });
        resyncs.push(() => {
          mode = null;
          handState(ho.progress());
        });
        if (!dot) return;
        gsap.set(dot, { x: 0, y: 0, xPercent: 50, yPercent: -50 }); // the CSS centring, kept relative

        // Offset from the dot to the centre of the next block's first panel, both as laid out in the flow
        // (this block where its pin releases it).
        const target = () => {
          const from = blockRelCentre(dot, block);
          const o = blockOrigin(block);
          o.y += tl.scrollTrigger.end - tl.scrollTrigger.start;
          const to = uiNaturalCentre(q('ui-slide', next), next, panelRestWidth());
          return { x: to.x - o.x - from.x, y: to.y - o.y - from.y };
        };
        if (wide) {
          // Live: drop near the viewport bottom (½vh + the space under the heading + one ball), then bounce
          // up into the panel while drifting right. The live bounce ended 7 px low and snapped; here it ends centred.
          const drop = () => innerHeight / 2 + (innerHeight - (heading?.offsetHeight || 0)) / 2 + dot.offsetHeight;
          ho.fromTo(dot, { y: 0 }, { y: drop, duration: 0.45 })
            .fromTo(dot, { x: 0 }, { x: () => target().x, duration: 0.7 })
            .fromTo(dot, { y: drop }, { y: () => target().y, duration: 0.7, ease: 'bounceSmall' }, '<');
        } else {
          // Narrow: the dot holds the viewport centre while the next block scrolls up under it.
          ho.fromTo(dot, { y: 0 }, { y: () => target().y, duration: 1 });
        }
      });

      return () => {
        ScrollTrigger.removeEventListener('refresh', onRefresh);
        open.forEach((on, panel) => {
          gsap.set(panel, { clearProps: 'clipPath,width' });
          const video = q('ui-video', panel);
          if (video) {
            gsap.set(video, { opacity: 0 }); // the embed starts at inline opacity 0
            video.pause();
          }
        });
        blocks.forEach((block) => {
          gsap.set(els(q('ui-track', block), q('ui-text', block), q('ui-ball', block)), { clearProps: 'transform,clipPath,opacity' });
          const landing = q('ui-landing', block);
          if (landing && block !== blocks[0]) gsap.set(landing, { clearProps: 'opacity' });
        });
        gsap.set(els(heroSticky, heroAxis), { clearProps: 'transform' });
      };
    }
  );

  initUiIdle(blocks);
}

// Idle hint (live block B): after 4 s without input the panels sway ±1.5 %, any input stops them.
// Own timer instead of ifvisible; runs only while a slider block is on screen.
function initUiIdle(blocks) {
  const panels = blocks.flatMap((b) => qa('ui-slide', b));
  if (!panels.length) return;
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const sway = gsap
      .timeline({ repeat: -1, paused: true, defaults: { duration: 0.4, ease: 'none' } })
      .to(panels, { xPercent: -1.5 })
      .to(panels, { xPercent: 0 })
      .to(panels, { xPercent: 1.5 })
      .to(panels, { xPercent: 0 });
    const inView = new Set();
    const io = new IntersectionObserver((entries) =>
      entries.forEach((e) => (e.isIntersecting ? inView.add(e.target) : inView.delete(e.target)))
    );
    blocks.forEach((b) => io.observe(b));

    let timer = 0;
    let idle = false;
    const sleep = () => {
      if (document.hidden || !inView.size) return;
      idle = true;
      sway.restart();
    };
    const wake = () => {
      clearTimeout(timer);
      if (idle) {
        idle = false;
        sway.pause(0.8); // 0.8 s into the loop the panels are back at 0
      }
      timer = setTimeout(sleep, 4000);
    };
    const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll', 'visibilitychange'];
    events.forEach((e) => addEventListener(e, wake, { passive: true }));
    wake();

    return () => {
      clearTimeout(timer);
      io.disconnect();
      events.forEach((e) => removeEventListener(e, wake));
      gsap.set(panels, { clearProps: 'transform' });
    };
  });
}

/* ---------- interactive (script.v33 blocks F and G, docs/sections/interactive.md) ---------- */

// Pinned: loaded on demand, near the section only.
const LOTTIE_URL = 'https://cdn.jsdelivr.net/npm/lottie-web@5.13.0/build/player/lottie_light.min.js/+esm';
const LOTTIE_RUN = 3.43; // live IX2: one pass over the whole file (206 frames at 60 fps)

// Sound state. Transition: the old Sound button (`.sound-btn-mute.is-active` = muted) until the Navigation pass.
const soundOn = () => {
  const mute = q('sound-state') || document.querySelector('.sound-btn-mute');
  return !!mute && !mute.classList.contains('is-active');
};

/**
 * Interactive: the row of circles pins and slides left until the last circle has passed (live block G),
 * the Real-time circle gets the Matter.js ball pit, the Not real-time circle gets its Lottie.
 * Both load once the pin is one viewport away. The scroll direction tilts the pit's gravity while pinned.
 */
export function initInteractive() {
  const pin = q('interactive-pin');
  const track = pin && q('interactive-track', pin);
  if (!pin || !track) return;

  // Live: scrollWidth − vw of the pinned block = its padding-left + the track (with its end padding) − vw.
  const shift = () => Math.max(0, parseFloat(getComputedStyle(pin).paddingLeft) + track.offsetWidth - innerWidth);

  let sphere = null;
  gsap.to(track, {
    x: () => -shift(),
    ease: 'sine.out',
    scrollTrigger: {
      trigger: pin,
      pin: true,
      anticipatePin: 1,
      scrub: 1,
      start: 'top top',
      end: () => `+=${shift()}`,
      invalidateOnRefresh: true,
      // The live tilt never ran (its trigger looked for .wf-section, script-map №15); restored on the pin.
      onUpdate: (self) => sphere?.setTilt(-self.direction / 2),
    },
  });
  ScrollTrigger.addEventListener('scrollEnd', () => sphere?.setTilt(0));

  ScrollTrigger.create({
    trigger: pin,
    start: 'top bottom',
    once: true,
    onEnter: () => {
      initSphere().then((s) => (sphere = s));
      initInteractiveLottie();
    },
  });
}

// The Matter.js ball pit, lazy: the module (and Matter.js with it) is fetched on first use.
async function initSphere() {
  const wrap = q('interactive-sphere');
  if (!wrap || wrap.dataset.ready) return null;
  wrap.dataset.ready = '1';
  const { createSphere } = await import('./sphere.js');
  return createSphere(wrap, { soundOn });
}

// Not real-time: lottie-web plays the live file on hover (≥992) or tap (≤991), as the live IX2 did:
// hover = from frame 0 to the end; out = finish the pass from where it is, then back to frame 0; tap = one pass.
async function initInteractiveLottie() {
  const box = q('interactive-lottie');
  const zone = q('interactive-hover');
  if (!box?.dataset.src || box.dataset.ready) return;
  box.dataset.ready = '1';
  const { default: lottie } = await import(LOTTIE_URL);
  const anim = lottie.loadAnimation({ container: box, renderer: 'svg', loop: false, autoplay: false, path: box.dataset.src });
  await new Promise((resolve) => anim.addEventListener('DOMLoaded', resolve));
  if (!zone) return;

  const last = anim.totalFrames - 1;
  const head = { frame: 0 };
  const draw = () => anim.goToAndStop(head.frame, true);
  // Constant duration whatever the distance, like an IX2 tween towards a target value.
  const toEnd = (from, then) => {
    if (from !== undefined) head.frame = from;
    gsap.to(head, { frame: last, duration: LOTTIE_RUN, ease: 'none', overwrite: true, onUpdate: draw, onComplete: then });
  };
  const reset = () => {
    head.frame = 0;
    draw();
  };
  const wide = () => innerWidth >= 992;
  zone.addEventListener('mouseenter', () => wide() && toEnd(0));
  zone.addEventListener('mouseleave', () => wide() && toEnd(undefined, reset));
  zone.addEventListener('click', () => !wide() && toEnd(0, reset));
  draw();
}

/* ---------- techniques (live IX2 e-632 / e-634 / e-633, docs/sections/techniques.md) ---------- */

// Catch-up time of the scrub, fitted to the live IX2 smoothing 90 (tools/record/techniques-run.mjs --lag).
const TECHNIQUES_SCRUB = 1;

/**
 * Techniques: while the section passes the viewport, word 2 and word 3 drift up at their own pace, the stars
 * shrink to 0.4 and the paragraph to 0.6 (the words and the paragraph are sticky, so this reads as parallax).
 * Progress 0 = section top at the viewport bottom, 1 = its bottom at the top; ≤991 starts 30 % of the section later.
 * The tilt of the words stays in their classes: GSAP reads it from the matrix and keeps it while moving y.
 */
export function initTechniques() {
  const [w1, w2, w3] = qa('techniques-word');
  const sec = w1?.closest('section');
  if (!sec || !w2 || !w3) return;
  const [s1, s2] = qa('techniques-star', sec);
  const text = q('techniques-text', sec);
  const rem = (v) => () => v * remPx();

  gsap.matchMedia().add(
    // Every band is listed: matchMedia() skips the callback when no condition matches.
    { large: '(min-width: 992px)', tablet: '(max-width: 991px)', small: '(max-width: 767px)', reduce: '(prefers-reduced-motion: reduce)' },
    ({ conditions: c }) => {
      if (c.reduce) return; // static: the words stand as laid out, as without JS
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sec,
          start: c.tablet ? '30% bottom' : 'top bottom',
          end: 'bottom top',
          scrub: TECHNIQUES_SCRUB,
          invalidateOnRefresh: true,
        },
      });
      // Positions and durations are fractions of the whole pass (the timeline is padded to 1 below).
      tl.fromTo(w2, { y: rem(1) }, { y: rem(-2), duration: 0.5 }, 0)
        .fromTo(w3, { y: 0 }, { y: rem(c.small ? -3 : -5), duration: 0.6 }, 0);
      if (s1) tl.fromTo(s1, { scale: 1, y: 0 }, { scale: 0.4, y: rem(-0.6), duration: 0.26 }, 0);
      if (s2) tl.fromTo(s2, { scale: 1, y: 0 }, { scale: 0.4, y: rem(-1), duration: 0.24 }, 0);
      if (text) tl.fromTo(text, { scale: 1 }, { scale: 0.6, duration: 0.12 }, 0.6);
      tl.set({}, {}, 1);
    }
  );
}

/* ---------- lessons (live IX2 e-668…e-687, docs/sections/lessons.md «Скрол-анімації», «План анімації») ---------- */

// Same catch-up as Techniques: every lesson trigger has IX2 smoothing 90.
const LESSONS_SCRUB = 1;

// IX2 scroll progress as ScrollTrigger positions. 0: the trigger top at the viewport bottom (startsEntering) or at
// max(vh − h, 0); 1: its top at −h·(1 − endOffset), i.e. its bottom at h·endOffset from the viewport top.
const ix2Range = (el, entering, endOffset = 0) => ({
  start: () => (entering ? 'top bottom' : `top ${Math.max(innerHeight - el.offsetHeight, 0)}px`),
  end: () => `bottom ${el.offsetHeight * endOffset}px`,
});

// Implementation keys per band, as fractions of the progress: [from, to] (track: [from, to, xPercent]).
// ≤767 takes the tiny keys in every lesson: on the live site 480–767 had them in easing only (lessons 2–8 stood still).
const CASES_KEYS = {
  desktop: { entering: true, endOffset: 0.26, title: [0.23, 0.32], card2: [0.32, 0.42], card3: [0.38, 0.48], track: [0.5, 0.84, -40] },
  tablet: { entering: false, endOffset: 0.5, title: [0, 0.24], card2: [0.24, 0.5], card3: null, track: [0.45, 1, -122] },
  small: { entering: true, endOffset: 0.26, title: [0.23, 0.3], card2: [0.3, 0.44], card3: null, track: [0.48, 0.74, -178] },
};

// Demo: state i (video i, line width) starts at DEMO_STEPS[i − 1] of the progress; the live IX2 jumps within 1 %.
const DEMO_STEPS = [0.17, 0.345, 0.51, 0.675, 0.835];
const DEMO_LINE = [16.7, 33.33, 50.03, 66.63, 83.35, 100];

// Classic: the wrapper and the overlay over Implementation go transparent → black. Easing first, then delay.
const CLASSIC_WINDOWS = [[0.18, 0.24], [0.24, 0.3]];

const loadLottie = (() => {
  let p = null;
  return () => (p ||= import(LOTTIE_URL).then((m) => m.default));
})();

// One file per band in the demo (data-src-tablet / data-src-mobile), one file elsewhere.
const videoSrc = (v) => {
  const b = band();
  return (b === 'mobile' && v.dataset.srcMobile) || (b === 'tablet' && v.dataset.srcTablet) || v.dataset.src;
};
const setVideoSrc = (v, preload = 'metadata') => {
  const src = videoSrc(v);
  if (!src || v.dataset.loaded === src) return;
  const resume = v.dataset.loaded && !v.paused;
  v.dataset.loaded = src;
  v.preload = preload;
  v.src = src;
  if (resume) v.play().catch(() => {});
};
// Transition: Finsweet autovideo (still on the page for the old sections) plays every <video> in view, ours included.
// A video of ours that was not asked to play pauses itself again. Goes away with the old script.
const wantedVideos = new WeakSet();
const guardVideo = (v) => {
  if (v.dataset.guard) return;
  v.dataset.guard = '1';
  v.addEventListener('play', () => wantedVideos.has(v) || v.pause());
};
// Reduced motion: the first frame only, no playback.
const playVideo = (v) => {
  guardVideo(v);
  setVideoSrc(v, 'auto');
  if (reducedMotion()) return;
  wantedVideos.add(v);
  v.play().catch(() => {});
};
const pauseVideo = (v) => {
  wantedVideos.delete(v);
  if (!v.paused) v.pause();
};

// Videos that already have a source take the file of the new band.
let videoBandWatch = false;
function watchVideoBand() {
  if (videoBandWatch) return;
  videoBandWatch = true;
  ['(min-width: 992px)', '(max-width: 479px)'].forEach((m) =>
    matchMedia(m).addEventListener('change', () =>
      document.querySelectorAll('video[data-loaded]').forEach((v) => setVideoSrc(v, v.preload))
    )
  );
}

/**
 * Lazy videos instead of Finsweet autovideo: the band's file is set half a viewport ahead (metadata only, the poster
 * stays under the video), the video plays while on screen and pauses off it.
 */
function lazyVideo(videos) {
  if (!videos.length) return;
  watchVideoBand();
  const near = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (setVideoSrc(e.target), near.unobserve(e.target))),
    { rootMargin: '50% 0px' }
  );
  const seen = new IntersectionObserver((entries) =>
    entries.forEach((e) => (e.isIntersecting ? playVideo(e.target) : pauseVideo(e.target)))
  );
  videos.forEach((v) => (guardVideo(v), near.observe(v), seen.observe(v)));
}

/**
 * Hero visual of every lesson: the Lottie (or the dimension video) loads one viewport ahead and plays only while on
 * screen (on the live site all 17 Lotties played all the time).
 */
function initLessonVisuals() {
  const boxes = qa('lesson-visual').filter((b) => b.dataset.src);
  if (!boxes.length) return;
  const players = new Map();
  const visible = new Set();
  const run = (box) => {
    const p = players.get(box);
    if (!p) return;
    const on = visible.has(box) && !reducedMotion();
    if (p instanceof HTMLVideoElement) on ? playVideo(p) : pauseVideo(p);
    else on ? p.play() : p.pause();
  };
  const load = async (box) => {
    if (box.dataset.kind === 'video') {
      const v = document.createElement('video');
      Object.assign(v, { muted: true, loop: true, playsInline: true, preload: 'auto' });
      guardVideo(v);
      v.setAttribute('aria-hidden', 'true');
      v.style.cssText = 'width:100%;height:100%;display:block';
      // The live embed paired the HEVC file (alpha, Safari) with a VP9 webm for the other browsers.
      const sources = [[box.dataset.src, 'video/mp4; codecs="hvc1"'], [box.dataset.src.replace(/_hevc\.mov$/, '_VP9.webm'), 'video/webm']];
      sources.forEach(([src, type], i) => {
        if (i && src === box.dataset.src) return;
        const s = document.createElement('source');
        Object.assign(s, { src, type });
        v.append(s);
      });
      box.append(v);
      players.set(box, v);
    } else {
      const lottie = await loadLottie();
      const anim = lottie.loadAnimation({ container: box, renderer: 'svg', loop: true, autoplay: false, path: box.dataset.src });
      players.set(box, anim);
    }
    run(box);
  };
  const near = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (near.unobserve(e.target), load(e.target))),
    { rootMargin: '100% 0px' }
  );
  const seen = new IntersectionObserver((entries) =>
    entries.forEach((e) => {
      e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
      run(e.target);
    })
  );
  boxes.forEach((b) => (near.observe(b), seen.observe(b)));
}

/**
 * Lessons ×8: Implementation (title shrinks, cards 2–3 rise, the track slides left), the easing extras (examples row
 * and stars, the demo states), the black background of the classic blocks, lazy videos and Lotties.
 * Every scroll animation is a port of the live IX2 keys with the live progress formula (ix2Range).
 */
export function initLessons() {
  const lessons = qa('lesson');
  if (!lessons.length) return;
  const rem = (v) => () => v * remPx();

  gsap.matchMedia().add(
    // Every band is listed: matchMedia() skips the callback when no condition matches.
    {
      desktop: '(min-width: 992px)',
      tablet: '(min-width: 768px) and (max-width: 991px)',
      small: '(max-width: 767px)',
      reduce: '(prefers-reduced-motion: reduce)',
    },
    ({ conditions: c }) => {
      const k = CASES_KEYS[c.desktop ? 'desktop' : c.tablet ? 'tablet' : 'small'];
      // Reduced motion: no smoothing and no decorative moves; the track still slides, it carries cards 2–3 into view.
      const scrub = c.reduce ? true : LESSONS_SCRUB;
      const span = ([a, b]) => b - a;

      qa('lesson-cases').forEach((cases) => {
        const track = q('lesson-track', cases);
        if (!track) return;
        const head = q('lesson-cases-head', cases);
        const [, c2, c3] = qa('lesson-card', track);
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: cases, ...ix2Range(cases, k.entering, k.endOffset), scrub, invalidateOnRefresh: true },
        });
        if (!c.reduce) {
          if (head) tl.fromTo(head, { scale: 1 }, { scale: 0.6, duration: span(k.title) }, k.title[0]);
          if (c2) tl.fromTo(c2, { y: rem(1.5) }, { y: 0, duration: span(k.card2) }, k.card2[0]);
          if (c3 && k.card3) tl.fromTo(c3, { y: rem(3) }, { y: 0, duration: span(k.card3) }, k.card3[0]);
        }
        tl.fromTo(track, { xPercent: 0 }, { xPercent: k.track[2], duration: k.track[1] - k.track[0] }, k.track[0]);
        tl.set({}, {}, 1);
      });

      // Examples (easing): the row runs left, odd stars sink, even ones rise; ≥768 over 0–80 % with end offset 80.
      const examples = q('lesson-examples');
      const line = examples && q('examples-line', examples);
      if (line && !c.reduce) {
        const small = c.small;
        const stars = qa('examples-star', examples);
        const d = small ? 1 : 0.8;
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: examples, ...ix2Range(examples, false, small ? 0.5 : 0.8), scrub, invalidateOnRefresh: true },
        });
        tl.fromTo(line, { xPercent: 0 }, { xPercent: small ? -130 : -104, duration: d }, 0);
        stars.forEach((s, i) => tl.fromTo(s, { y: 0 }, { y: rem((i % 2 ? -1 : 1) * (small ? 0.54 : 0.9)), duration: d }, 0));
        tl.set({}, {}, 1);
      }

      // Classic: from the classic top at the viewport bottom to its bottom at the top.
      qa('lesson-classic').forEach((classic, i) => {
        const [a, b] = CLASSIC_WINDOWS[i] || CLASSIC_WINDOWS[0];
        const overlay = q('lesson-overlay', classic.closest('[data-motion="lesson"]') || document);
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: classic, ...ix2Range(classic, true), scrub, invalidateOnRefresh: true },
        });
        tl.fromTo(els(classic, overlay), { backgroundColor: 'rgba(0, 0, 0, 0)' }, { backgroundColor: 'rgba(0, 0, 0, 1)', duration: b - a }, a);
        tl.set({}, {}, 1);
      });
    }
  );

  const demo = q('lesson-demo');
  if (demo) initLessonDemo(demo);
  lazyVideo(qa('lesson-video'));
  initLessonVisuals();
}

/**
 * Demo (easing): six states over the sticky block, as the live IX2 steps: one video visible and playing, the progress
 * line at 1/6 per state, tick i lit from state i, step titles 2 and 3 lit from states 2 and 4. No tweening, as live.
 */
function initLessonDemo(demo) {
  const videos = qa('demo-video', demo);
  const steps = qa('demo-step', demo);
  const ticks = qa('demo-tick', demo);
  const line = q('demo-line', demo);
  let state = -1;
  let inView = false;
  videos.forEach(guardVideo);

  const playActive = () =>
    videos.forEach((v, i) => {
      if (i === state && inView) playVideo(v);
      else pauseVideo(v);
    });
  const apply = (s) => {
    if (s === state) return;
    state = s;
    videos.forEach((v, i) => v.classList.toggle('is-active', i === s));
    steps.forEach((el, j) => el.classList.toggle('is-active', s >= 2 * j));
    ticks.forEach((el, j) => el.classList.toggle('is-on', s >= j));
    if (line) line.style.width = `${DEMO_LINE[s]}%`;
    if (videos[s + 1]) setVideoSrc(videos[s + 1]); // the next state is one step away
    playActive();
  };

  watchVideoBand();
  new IntersectionObserver(
    (entries, io) => entries.forEach((e) => e.isIntersecting && (setVideoSrc(videos[Math.max(state, 0)]), io.disconnect())),
    { rootMargin: '50% 0px' }
  ).observe(demo);
  new IntersectionObserver((entries) => {
    inView = entries.at(-1).isIntersecting;
    playActive();
  }).observe(demo);

  const at = (p) => DEMO_STEPS.filter((x) => p >= x).length;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: demo,
      ...ix2Range(demo, false, 0.2),
      scrub: reducedMotion() ? true : LESSONS_SCRUB,
      invalidateOnRefresh: true,
    },
    onUpdate: () => apply(at(tl.progress())),
  });
  tl.set({}, {}, 1);
  apply(0);
}

/**
 * Easing schemes slider (was Splide 2): the track slides by one circle + gap in 0.6 s on the Splide ease, the active
 * circle switches at once, the caption 0.4 s later. Arrows are disabled at the ends; a horizontal drag follows the
 * pointer and moves one scheme past 150 px or on a flick, as Splide did. One Lottie per scheme: the active one loops,
 * the rest hold frame 0 (the live site had two copies of each).
 */
export function initLessonSchemes() {
  const root = q('lesson-schemes');
  const track = root && q('schemes-track', root);
  if (!track) return;
  const schemes = qa('scheme', track);
  const prev = q('schemes-prev', root);
  const next = q('schemes-next', root);
  const text = q('schemes-text', root);
  const last = schemes.length - 1;
  if (last < 1) return;

  // One step from the layout: circle width + gap (377 / 377 / 252 px on the live site).
  const step = () => schemes[1].offsetLeft - schemes[0].offsetLeft;
  const ease = bez(0.42, 0.65, 0.27, 0.99);
  let index = 0;
  let caption = null;
  const anims = [];
  let inView = false;

  const runLotties = () =>
    anims.forEach((a, i) => {
      if (!a) return;
      if (i === index && inView && !reducedMotion()) a.play();
      else a.goToAndStop(0, true);
    });

  const go = (i, { instant = false } = {}) => {
    i = gsap.utils.clamp(0, last, i);
    const moved = i !== index;
    index = i;
    gsap.to(track, { x: -i * step(), duration: instant || reducedMotion() ? 0 : 0.6, ease, overwrite: true });
    schemes.forEach((s, j) => s.classList.toggle('is-active', j === i));
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === last;
    if (moved) {
      runLotties();
      caption?.kill();
      const swap = () => text && (text.textContent = schemes[i].dataset.text || '');
      caption = reducedMotion() ? (swap(), null) : gsap.delayedCall(0.4, swap);
    }
  };

  prev?.addEventListener('click', () => go(index - 1));
  next?.addEventListener('click', () => go(index + 1));

  // Drag: follows the pointer horizontally (vertical drags stay page scroll: touch-action pan-y in styles-rem).
  let base = 0;
  ScrollTrigger.observe({
    target: track,
    type: 'touch,pointer',
    lockAxis: true,
    dragMinimum: 5,
    onPress: () => (base = gsap.getProperty(track, 'x')),
    onDrag: (self) => self.axis === 'x' && gsap.set(track, { x: base + self.x - self.startX, overwrite: true }),
    onRelease: (self) => {
      if (self.axis !== 'x') return;
      const dx = self.x - self.startX;
      const flick = Math.abs(self.velocityX) > 600; // px/s; Splide 2: 0.6 px/ms
      if (Math.abs(dx) > 150 || flick) go(index - Math.sign(dx));
      else go(index);
    },
  });

  // The step changes with the band: keep the track on its scheme after every refresh (resize included).
  ScrollTrigger.addEventListener('refresh', () => go(index, { instant: true }));

  // Lotties: loaded one viewport ahead, the active one plays only while the slider is on screen.
  const near = new IntersectionObserver(
    async (entries, io) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const lottie = await loadLottie();
      schemes.forEach((s, i) => {
        const box = q('scheme-lottie', s);
        if (!box?.dataset.src) return;
        anims[i] = lottie.loadAnimation({ container: box, renderer: 'svg', loop: true, autoplay: false, path: box.dataset.src });
        anims[i].addEventListener('DOMLoaded', runLotties);
      });
    },
    { rootMargin: '100% 0px' }
  );
  near.observe(root);
  new IntersectionObserver((entries) => {
    inView = entries.at(-1).isIntersecting;
    runLotties();
  }).observe(root);

  go(0, { instant: true });
}

/* ---------- resources (script.v33 block E, IX2 e-664; docs/sections/resources.md «План анімації») ---------- */

const RESOURCES_SCRUB = 3;
// IX2 e-664 (≥992 only): smoothing 90, start 20 % before the pin top enters, keys 0 → 40 % of the progress.
const RES_CLOUDS_SCRUB = 1;
const RES_CLOUDS_Y = [1.2, 1, 2]; // rem: second, third, fourth cloud (the first one stands)
const RES_STACK_TURN = [0, -3, -6]; // deg, the rotation cycle of the images pushed onto the stack

/**
 * Resources: one pin over three phases, as the live block E (but created at once, not lazily when Lessons reach the
 * top). Phase lengths are the live whole percents of total = 1.5·vw + track shift + lists height: the shutters slide
 * right and uncover the words (stagger 1/4), the track runs left to the lists, the lists scroll up under the tabs.
 * The tab follows the list under the bottom of the tabs bar. Clouds above the section drift on ≥992 only.
 */
export function initResources() {
  const pin = q('res-pin');
  const track = pin && q('res-track', pin);
  const lists = pin && q('res-lists', pin);
  if (!track || !lists) return;
  const sec = pin.closest('section') || pin.parentElement;
  const shutters = qa('res-shutter', pin);
  const tabs = qa('res-tab', pin);
  const tabsBar = tabs[0]?.parentElement;
  const listEls = qa('res-list', lists);
  const rem = (v) => () => v * remPx();

  // Counters: the number of rows in each list (the markup carries a fallback).
  listEls.forEach((l, i) => {
    const count = tabs[i] && q('res-count', tabs[i]);
    if (count) count.textContent = qa('res-item', l).length;
  });

  let activeTab = 0;
  const setTab = (i) => {
    activeTab = i;
    tabs.forEach((t, j) => t.classList.toggle('is-active', j === i));
  };
  const syncTab = () => {
    if (!tabsBar) return;
    const edge = tabsBar.getBoundingClientRect().bottom;
    listEls.forEach((l, i) => {
      const r = l.getBoundingClientRect();
      if (edge >= r.top && edge < r.bottom && activeTab !== i) setTab(i);
    });
  };

  const mm = gsap.matchMedia();
  const setup = () =>
    mm.add(
      // Every band is listed: matchMedia() skips the callback when no condition matches.
      { large: '(min-width: 992px)', any: '(min-width: 0px)', mobile: '(max-width: 479px)', reduce: '(prefers-reduced-motion: reduce)' },
      ({ conditions: c }) => {
        // Measured once per build (a width change rebuilds, see below): the phase lengths are whole percents.
        const vw = innerWidth;
        const arrows = 1.5 * vw;
        const shift = Math.max(0, track.offsetWidth - vw);
        const listsH = lists.getBoundingClientRect().height;
        const total = arrows + shift + listsH;
        const pA = Math.trunc((arrows / total) * 100);
        const pT = Math.trunc((shift / total) * 100);
        const pL = Math.trunc(((2 * listsH) / total) * 100);

        gsap
          .timeline({
            defaults: { ease: 'none' },
            // On the timeline, not the trigger: the tab follows the scrubbed lists, which lag behind the scroll.
            onUpdate: syncTab,
            scrollTrigger: {
              trigger: pin,
              pin: true,
              anticipatePin: 1,
              start: 'top top',
              end: `+=${total}`,
              // Reduced motion: the pin stays (the track is reachable only through it), without the catch-up.
              scrub: c.reduce ? true : RESOURCES_SCRUB,
            },
          })
          .to(shutters, { x: (c.mobile ? 0.78 : 0.84) * vw, duration: pA, stagger: pA / 4 })
          .to(track, { x: -shift, duration: pT })
          .to(lists, { yPercent: -100, duration: pL });

        const clouds = qa('res-cloud', sec);
        if (c.large && !c.reduce && clouds.length) {
          // IX2 progress: 0 = pin top at 1.2·vh, 1 = pin bottom at the top; the keys end at 40 % of it.
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: sec,
              start: () => `top ${1.2 * innerHeight}px`,
              end: () => `top ${1.2 * innerHeight - 0.4 * (1.2 * innerHeight + pin.offsetHeight)}px`,
              scrub: RES_CLOUDS_SCRUB,
              invalidateOnRefresh: true,
            },
          });
          clouds.forEach((cloud, i) => RES_CLOUDS_Y[i] && tl.fromTo(cloud, { y: 0 }, { y: rem(RES_CLOUDS_Y[i]), duration: 1 }, 0));
        }
      }
    );
  setup();

  // The live script measured once at load; we rebuild when the width changes (a mobile toolbar only changes height).
  let width = innerWidth;
  let timer = 0;
  addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (innerWidth === width) return;
      width = innerWidth;
      mm.revert();
      setup();
      ScrollTrigger.refresh();
    }, 200);
  });

  initResourcesStack(pin, listEls);
}

/**
 * Hover stack: each row carries its own CMS image (so a row always shows its picture — the live images list was
 * reverse-sorted); they move into the stack here. Entering a row makes it active and pushes its image: rotation
 * 0 → −3 → −6 → 0 …, z-index +1, at most three images (the oldest fades out). Entering a row already in the stack
 * only lifts it. Switching lists starts a fresh stack (live indices were global across both lists). Mouse-out keeps
 * the state. Opacity 0.4 s and the name shift 0.4 / 0.2 s are the class transitions.
 */
function initResourcesStack(pin, listEls) {
  const stackEl = q('res-stack', pin);
  if (!stackEl) return;
  const rows = listEls.map((l) => qa('res-item', l));
  const images = rows.map((list) => list.map((row) => q('res-image', row)));
  images.flat().forEach((img) => img && stackEl.append(img));

  let stack = [];
  let turn = 0; // index into RES_STACK_TURN of the last pushed image
  let z = 1;
  let prevList = 0;
  const nameOf = (row) => q('res-name', row);

  const activate = (li, ri) => {
    rows.flat().forEach((r) => nameOf(r)?.classList.remove('is-active'));
    nameOf(rows[li][ri])?.classList.add('is-active');
    const img = images[li][ri];
    if (!img) return;
    if (li !== prevList) {
      stack.forEach((s) => s.classList.remove('is-active'));
      stack = [];
      turn = RES_STACK_TURN.length - 1; // the first image of a fresh stack stands straight
    }
    let push = true;
    if (stack.includes(img)) {
      stack.splice(stack.indexOf(img), 1);
      push = false;
    } else {
      turn = (turn + 1) % RES_STACK_TURN.length;
    }
    stack.push(img);
    z++;
    if (stack.length > 3) stack.shift().classList.remove('is-active');
    if (push) {
      gsap.set(img, { rotation: reducedMotion() ? 0 : RES_STACK_TURN[turn] });
      img.classList.add('is-active');
    }
    img.style.zIndex = z;
    prevList = li;
  };

  // Start: the first row and its image, straight.
  const first = images[0]?.[0];
  if (first) {
    first.classList.add('is-active');
    stack = [first];
  }
  if (rows[0]?.[0]) nameOf(rows[0][0])?.classList.add('is-active');
  if (reducedMotion()) images.flat().forEach((img) => img && (img.style.transition = 'none'));

  rows.forEach((list, li) => list.forEach((row, ri) => row.addEventListener('pointerenter', () => activate(li, ri))));
}

/* ---------- footer (live IX2 e-720 → a-126, docs/sections/footer.md «IX2 футера», «План анімації») ---------- */

// Same catch-up as Techniques: the footer trigger has IX2 smoothing 90.
const FOOTER_SCRUB = 1;
const FOOTER_CLOUDS_Y = [1.2, 1, 2]; // rem: second, third, fourth cloud (the first one is the footer's own top edge)
// Distance of the footer top from the viewport top at progress 0 (the live −15 % offset is of the footer height).
const footerSpan = (footer) => innerHeight + 0.15 * footer.offsetHeight;

/**
 * Footer: as it comes in, the overlay of Resources turns black (0 → 50 % of the progress) and the black clouds
 * fall behind the footer (0 → 72 %), on every band. Live progress: 0 = footer top at vh + 0.15·h (the −15 % offset
 * is of the footer height), 1 = footer top at the viewport top. The page end cuts it short (1440: max 0.556).
 */
export function initFooter() {
  const footer = q('footer');
  if (!footer) return;
  const overlay = q('res-overlay');
  const clouds = qa('ft-cloud', footer);
  const rem = (v) => () => v * remPx();

  gsap.matchMedia().add(
    // Every band is listed: matchMedia() skips the callback when no condition matches.
    { any: '(min-width: 0px)', reduce: '(prefers-reduced-motion: reduce)' },
    ({ conditions: c }) => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: footer,
          start: () => `top ${footerSpan(footer)}px`,
          end: 'top top',
          // Reduced motion: the overlay still darkens (it is colour, not motion), without the catch-up.
          scrub: c.reduce ? true : FOOTER_SCRUB,
          invalidateOnRefresh: true,
          // After the pin of Resources: a width change rebuilds that pin later than this trigger was created.
          refreshPriority: -1,
        },
      });
      // Positions and durations are fractions of the progress (the timeline is padded to 1 below).
      if (overlay) tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);
      if (!c.reduce) clouds.forEach((cloud, i) => FOOTER_CLOUDS_Y[i] && tl.fromTo(cloud, { y: 0 }, { y: rem(FOOTER_CLOUDS_Y[i]), duration: 0.72 }, 0));
      tl.set({}, {}, 1);
    }
  );
}

/* ---------- navigation (script.v33 blocks I / J, IX2 a-58 / a-88 / a-60 / a-61; docs/sections/navigation.md) ---------- */

const NAV_THEME_TIME = 0.4; // live: gsap.to defaults, i.e. power1.out
// Live IX2 a-58 / a-88, sampled on motion.zajno.com: every key is linear except the cards (easeInOut = power1.inOut).
const MENU = { fade: 0.2, cards: 0.6, cardsX: 4, label: 0.3, lines: 0.2, lineY: [0.02, -0.03] };
const NAV_CARD_RUN = 0.67; // live a-60 / a-61: hover plays the card Lottie to its end, out plays it back to 0, both linear
// The footer theme takes over when the overlay of Resources is half black: overlay = p / 0.5 in initFooter(), so p = 0.25.
// Agent's fix (session 25): on the live site the navbar darkened in the middle of the light Resources pin.
const FOOTER_THEME_AT = 0.25;

// Scheme under the navbar line ({ theme: dark | light | color, bg, crumb }) and the menu state; an open menu is always dark.
let navScheme = { theme: 'dark' };
let navMenuOpen = false;
const navEyes = new Map(); // logo eyes box → its Lottie

/**
 * Paints the navbar: two semantic variables on the root (pills, toggle lines and eye circles read them), the logo eyes
 * cross-fade (dark file on dark, the other one on light and colour), the crumb of the current lesson on colour.
 */
function paintNav(instant = false) {
  const root = q('nb');
  if (!root) return;
  const s = navMenuOpen ? { theme: 'dark' } : navScheme;
  const core = (n) => getComputedStyle(root).getPropertyValue(`--_core---neutral-${n}`).trim();
  const dark = core(1000);
  const light = core(0);
  const bg = s.theme === 'dark' ? dark : s.theme === 'light' ? light : s.bg;
  const fg = s.theme === 'dark' ? light : dark;
  const duration = instant || reducedMotion() ? 0 : NAV_THEME_TIME;
  const to = (target, vars) => gsap.to(target, { ...vars, duration, ease: 'power1.out', overwrite: 'auto' });

  to(root, { '--_semantic---bg': bg, '--_semantic---foreground': fg, '--_semantic---border': fg });
  const eyes = s.theme === 'dark' ? 'dark' : 'light';
  qa('nb-eyes', root).forEach((box) => {
    const on = box.dataset.eyes === eyes;
    const anim = navEyes.get(box);
    if (on && anim && !reducedMotion()) anim.play();
    // The hidden eyes stop once faded out.
    to(box, { opacity: +on, onComplete: () => !on && anim?.pause() });
  });
  qa('nb-crumb', root).forEach((c) => to(c, { opacity: +(s.theme === 'color' && c.dataset.crumb === s.crumb) }));
}

/**
 * Theme of the navbar by section: every [data-theme] gets a trigger over the navbar line (top + 1 px); the active one
 * is the deepest active (the dark demo inside the easing lesson wins over the lesson, the lesson is back after it),
 * among equals the later one (the footer over Resources). Between zones and after the last one the scheme stays.
 * Colour = the background of the section, the crumb of the lesson (its id without the transitional "-next").
 * Our pins have their spacers, so no manual offsets (the live resourcesPinLen).
 */
export function initTheme() {
  const root = q('nb');
  if (!root) return;
  const footer = q('footer');
  const depth = (el) => {
    let d = 0;
    for (let x = el; (x = x.parentElement); ) d++;
    return d;
  };
  const zones = [...document.querySelectorAll('[data-theme]')]
    .filter((el) => !root.contains(el))
    .map((el) => ({ el, depth: depth(el), theme: el.dataset.theme }));
  if (!zones.length) return;

  let painted = false;
  const pick = () => {
    // Trigger callbacks can fire while the triggers are still being created.
    const on = zones.filter((z) => z.st?.isActive);
    if (!on.length) return;
    const z = on.reduce((a, b) => (b.depth >= a.depth ? b : a));
    const next = {
      theme: z.theme,
      bg: z.theme === 'color' ? getComputedStyle(z.el).backgroundColor : null,
      crumb: z.theme === 'color' ? z.el.id.replace(/-next$/, '') : null,
    };
    if (painted && next.theme === navScheme.theme && next.bg === navScheme.bg && next.crumb === navScheme.crumb) return;
    navScheme = next;
    paintNav(!painted);
    painted = true;
  };

  zones.forEach((z) => {
    z.st = ScrollTrigger.create({
      trigger: z.el,
      start: z.el === footer ? () => `top ${(1 - FOOTER_THEME_AT) * footerSpan(footer)}px` : 'top top+=1',
      end: 'bottom top+=1',
      // After every pin above (Resources rebuilds its pin on a width change, later than these were created).
      refreshPriority: -1,
      onToggle: pick,
    });
  });
  ScrollTrigger.addEventListener('refresh', pick);
}

// Logo eyes: both Lotties load at once and loop (the live files, 7 s); the hidden one is paused by paintNav().
async function initNavLogo(root) {
  const boxes = qa('nb-eyes', root).filter((b) => b.dataset.src);
  if (!boxes.length) return;
  const lottie = await loadLottie();
  boxes.forEach((box) => {
    const anim = lottie.loadAnimation({ container: box, renderer: 'svg', loop: true, autoplay: false, path: box.dataset.src });
    navEyes.set(box, anim);
    anim.addEventListener('DOMLoaded', () => {
      if (+getComputedStyle(box).opacity > 0 && !reducedMotion()) anim.play();
    });
  });
}

/**
 * Menu: the toggle (a <button>, aria-expanded) opens the full-screen menu with the live a-58 / a-88 keys, locks the page
 * and paints the navbar dark; Esc and a card click close it. A card click then jumps to its section (our pin spacers are
 * in the DOM, so the target lands at the top; the live anchor missed on 375). The wheel over the open menu scrolls the
 * track sideways. Card Lotties load on the first intent to open (hover / focus of the toggle) and play on hover with a
 * mouse on ≥992. Reduced motion: the cards do not slide.
 */
export function initNav() {
  const root = q('nb');
  const toggle = root && q('nb-toggle', root);
  const menu = root && q('nb-menu', root);
  if (!toggle || !menu) return;
  const cards = q('nb-cards', menu);
  const track = q('nb-track', menu);
  const label = q('nb-toggle-label', toggle);
  const labels = label ? [...label.parentElement.children] : []; // "menu" and "close" move together
  const lineTop = q('nb-line-top', toggle);
  const lineBottom = q('nb-line-bottom', toggle);
  const links = cards ? [...cards.querySelectorAll('a[href^="#"]')] : [];
  const rem = (v) => () => v * remPx();

  initNavLogo(root);
  gsap.set(menu, { display: 'none', opacity: 0 });
  if (cards) gsap.set(cards, { x: reducedMotion() ? 0 : rem(MENU.cardsX) });

  // Card Lotties, once. All ten files are fetched at once, but the SVGs are built one per frame in card order: built together
  // they make one long task right in the middle of the opening slide.
  const players = new Map(); // link → { anim, head, last }
  let loading = null;
  const loadCards = () =>
    (loading ||= loadLottie().then(async (lottie) => {
      const files = links.map((link) => {
        const box = q('nb-card-lottie', link);
        return box?.dataset.src ? fetch(box.dataset.src).then((r) => r.json()).catch(() => null) : null;
      });
      for (const [i, link] of links.entries()) {
        const data = await files[i];
        if (!data) continue;
        await new Promise(requestAnimationFrame);
        const anim = lottie.loadAnimation({ container: q('nb-card-lottie', link), renderer: 'svg', loop: false, autoplay: false, animationData: data });
        players.set(link, { anim, head: { frame: 0 }, last: anim.totalFrames - 1 });
        anim.goToAndStop(0, true);
      }
    }));
  const hoverable = matchMedia('(min-width: 992px) and (pointer: fine)');
  // Constant duration whatever the distance, like the IX2 tweens: in from frame 0 to the end, out from where it is to 0.
  const playCard = (link, into) => {
    const p = players.get(link);
    if (!p) return;
    if (into) p.head.frame = 0;
    gsap.to(p.head, {
      frame: into ? p.last : 0,
      duration: NAV_CARD_RUN,
      ease: 'none',
      overwrite: true,
      onUpdate: () => p.anim.goToAndStop(p.head.frame, true),
    });
  };

  const html = document.documentElement;
  const setOpen = (open) => {
    if (open === navMenuOpen) return;
    navMenuOpen = open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    const slide = !reducedMotion();
    if (open) {
      loadCards();
      html.style.overflow = 'hidden';
      gsap.set(menu, { display: 'block' });
      // From the start state every time, as the first (instant) group of a-58.
      gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: MENU.fade, ease: 'none', overwrite: true });
      if (cards && slide) gsap.fromTo(cards, { x: rem(MENU.cardsX) }, { x: 0, duration: MENU.cards, ease: 'power1.inOut', overwrite: true });
    } else {
      html.style.removeProperty('overflow');
      gsap.to(menu, { opacity: 0, duration: MENU.fade, ease: 'none', overwrite: true, onComplete: () => gsap.set(menu, { display: 'none' }) });
      if (cards && slide) gsap.to(cards, { x: rem(MENU.cardsX), duration: MENU.cards, ease: 'power1.inOut', overwrite: true });
    }
    gsap.to(labels, { yPercent: open ? -104 : 0, duration: MENU.label, ease: 'none', overwrite: true });
    const line = (el, turn, y) =>
      el && gsap.to(el, { rotation: open ? turn : 0, y: open ? rem(y) : 0, duration: MENU.lines, ease: 'none', overwrite: true });
    line(lineTop, 45, MENU.lineY[0]);
    line(lineBottom, -45, MENU.lineY[1]);
    paintNav();
  };

  toggle.addEventListener('click', () => setOpen(!navMenuOpen));
  ['pointerenter', 'focus'].forEach((t) => toggle.addEventListener(t, loadCards, { once: true }));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !navMenuOpen) return;
    setOpen(false);
    toggle.focus();
  });

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      let target = null;
      try {
        target = document.querySelector(link.getAttribute('href'));
      } catch {}
      if (!target) return setOpen(false);
      // Webflow's own anchor scroll (delegated on document) would land the target below our fixed header, 80 px short.
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      scrollTo(0, target.getBoundingClientRect().top + scrollY);
    });
    link.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && hoverable.matches && playCard(link, true));
    link.addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && hoverable.matches && playCard(link, false));
  });

  // The open menu owns the input: the wheel scrolls the track sideways (deltaMode lines / pages scaled to px), and
  // neither the wheel nor touches reach the page's smooth scroll (the old Lenis, mobile normalizeScroll) underneath.
  root.addEventListener(
    'wheel',
    (e) => {
      if (!navMenuOpen) return;
      e.preventDefault();
      e.stopPropagation();
      if (!track) return;
      const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? track.clientWidth : 1;
      track.scrollLeft += (e.deltaX + e.deltaY) * k;
    },
    { passive: false }
  );
  ['touchstart', 'touchmove'].forEach((t) => root.addEventListener(t, (e) => navMenuOpen && e.stopPropagation(), { passive: true }));
}

/* ---------- boot ---------- */

// Transition only: the old script.v33 keeps its own GSAP + ScrollTrigger for the sections below ours.
// Our pins change the page height above them, so the old triggers are re-measured after every refresh of ours.
function syncLegacy() {
  const old = window.ScrollTrigger;
  if (!old || old === ScrollTrigger || typeof old.refresh !== 'function') return;
  let queued = false;
  ScrollTrigger.addEventListener('refresh', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      old.refresh();
    });
  });
}

async function init() {
  // Before the preloader: the logo eyes load while it runs, the navbar enters in its phase 3.
  initNav();
  await initPreloader();
  // Created in DOM order, so every trigger below a pin already knows its spacer.
  initHero();
  initIntro();
  initUi();
  initInteractive();
  initTechniques();
  initLessons();
  initLessonSchemes();
  initResources();
  initFooter();
  // Last: its triggers measure every pin above.
  initTheme();
  // Next passes: Sound, … then one refresh.
  syncLegacy();
  ScrollTrigger.refresh();
}

init();
