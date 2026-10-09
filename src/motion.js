/*
  motion.js — the single animation module of the Motion rebuild.
  Canonical source: src/motion.js. Not connected to Webflow yet (stage 3: preloader, hero exit, intro).

  Rules (CONVENTIONS.md):
  - DOM is bound only through data-motion="<role>" attributes, never through classes.
  - Every section is one init function with an "is it in the DOM?" guard.
  - Library versions are pinned. One GSAP for the whole site.
  - Numbers come from docs/sections/<section>.md; keep them 1:1 with the live site.
*/

// Pinned: re-check the latest 3.x before stage 4 and bump in one place.
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm';
import { CustomEase } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/CustomEase/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/ScrollTrigger/+esm';
import { MotionPathPlugin } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/MotionPathPlugin/+esm';

gsap.registerPlugin(CustomEase, ScrollTrigger, MotionPathPlugin);

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

// Natural (unpinned, untransformed) centre of an element inside a ui block, in document space.
function uiNaturalCentre(el, block) {
  const anchor = block.parentElement.classList.contains('pin-spacer') ? block.parentElement : block;
  const a = anchor.getBoundingClientRect();
  let x = el.offsetWidth / 2;
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
        ScrollTrigger.create({
          trigger: scene,
          start: 'top center',
          onEnter: () => handOver(true),
          onLeaveBack: () => handOver(false),
        });
        return;
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
        const target = uiNaturalCentre(q('ui-slide', block), block);
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
        onUpdate: () => {
          const t = tl.time();
          marks.forEach((m, i) => setText(i, t >= m));
          handOver(tl.progress() === 1);
        },
      });

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

/* ---------- boot ---------- */

async function init() {
  await initPreloader();
  initHero();
  initIntro();
  // Next passes: initUi(), initInteractive(), … created in DOM order, then one refresh.
  ScrollTrigger.refresh();
}

init();
