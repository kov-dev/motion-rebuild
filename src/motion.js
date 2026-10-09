/*
  motion.js — the single animation module of the Motion rebuild.
  Canonical source: src/motion.js. Not connected to Webflow yet (stage 3 skeleton).

  Rules (CONVENTIONS.md):
  - DOM is bound only through data-motion="<role>" attributes, never through classes.
  - Every section is one init function with an "is it in the DOM?" guard.
  - Library versions are pinned. One GSAP for the whole site.
  - Numbers come from docs/sections/<section>.md; keep them 1:1 with the live site.
*/

// Pinned: re-check the latest 3.x before stage 4 and bump in one place.
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm';
import { CustomEase } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/CustomEase/+esm';

gsap.registerPlugin(CustomEase);

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

// Exit of the lines and ring when Intro enters (docs/sections/hero.md) needs
// ScrollTrigger and the Intro section; it is written in the Intro pass.
export function initHero() {
  if (!q('hero-ball-sticky')) return;
}

/* ---------- boot ---------- */

async function init() {
  await initPreloader();
  initHero();
  // Next passes: initIntro(), initInteractive(), … then ScrollTrigger.refresh().
}

init();
