/*
  sphere.js — the "Real-time" ball pit of the Interactive section (script.v33 block F).
  Canonical source: src/sphere.js. Imported lazily by motion.js (initSphere), so Matter.js loads only near the section.

  Port of the live code with its bugs fixed (docs/script-map.md, «Баги й костилі» 2, 4, 5, 15):
  - no implicit globals, no duplicated `density`, no non-standard e.toElement;
  - Matter.js 0.20 (live 0.18): its runner is frame-rate independent, so the live Windows 11 slow-down
    (timeScale 0.35, a workaround for high refresh rates) is gone;
  - the world keeps the size it was built with and the canvas scales with the circle (rem and band changes),
    drawn at the device pixel ratio (live: ratio 1, blurry on retina);
  - the simulation sleeps while the circle is off screen;
  - touch: a finger on a ball drags it, anywhere else the page scrolls (live: the whole circle ate the swipe);
  - gravity tilt with the scroll direction works again: the caller drives setTilt() from the pin trigger.
*/

import Matter from 'https://cdn.jsdelivr.net/npm/matter-js@0.20.0/+esm';

const { Engine, Render, Runner, Body, Bodies, Common, Composite, Mouse, MouseConstraint, Events, Query, Vector } = Matter;

const INK = '#0C0B0B';
const COLLISION_SOUND = 'https://cdn.zajno.com/dev/motion/sounds/sound_2_filter-2-cut.mp3';

/**
 * Builds the ball pit inside `wrap` (a square box over the circle).
 * @param {HTMLElement} wrap
 * @param {{ soundOn?: () => boolean }} [options] soundOn is read on every collision
 * @returns {{ setTilt: (x: number) => void, destroy: () => void }}
 */
export function createSphere(wrap, { soundOn = () => false } = {}) {
  const size = wrap.offsetWidth; // world units for the lifetime of the sphere
  const half = size / 2;
  const ballRadius = size / 15;

  const engine = Engine.create();
  engine.gravity.x = 0;
  engine.gravity.y = 1;
  engine.gravity.scale = 0.0025;

  const render = Render.create({
    element: wrap,
    engine,
    options: { width: size, height: size, background: 'transparent', wireframes: false },
  });
  const canvas = render.canvas;
  // The round clip also limits hit testing, so mouseleave fires on the circle edge.
  Object.assign(canvas.style, { display: 'block', clipPath: 'circle(50%)' });

  // 15 balls with a thick stroke collide with each other; 20 thin ones collide only with the first group.
  const ball = (lineWidth, collisionFilter) =>
    Bodies.circle(half, half, ballRadius, {
      restitution: 0.5,
      density: 0.05,
      collisionFilter,
      render: { fillStyle: INK, strokeStyle: 'white', lineWidth },
    });
  const balls = [
    ...Array.from({ length: 15 }, () => ball(2, { category: 3, mask: 3 })),
    ...Array.from({ length: 20 }, () => ball(1, { category: 4, mask: 5 })),
  ];
  Composite.add(engine.world, balls);

  // Invisible cage: 32 static walls tangent to the circle.
  const PEGS = 32;
  const TAU = Math.PI * 2;
  for (let i = 0; i < PEGS; i++) {
    const angle = (i / PEGS) * TAU + TAU / PEGS / 2;
    Composite.add(
      engine.world,
      Bodies.rectangle(Math.cos(angle) * half + half, Math.sin(angle) * half + half, 0.01 * size, 0.4 * size, {
        angle,
        isStatic: true,
        density: 1,
        render: { visible: false },
      })
    );
  }

  /* ---------- pointer ---------- */

  const mouse = Mouse.create(canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, render: { visible: false } },
  });
  Composite.add(engine.world, mouseConstraint);

  // The page scrolls over the canvas: Matter's wheel and touch handlers call preventDefault.
  canvas.removeEventListener('wheel', mouse.mousewheel);
  canvas.removeEventListener('touchstart', mouse.mousedown);
  canvas.removeEventListener('touchmove', mouse.mousemove);
  canvas.removeEventListener('touchend', mouse.mouseup);

  const toWorld = (clientX, clientY) => {
    const r = canvas.getBoundingClientRect();
    const k = size / r.width;
    return { x: (clientX - r.left) * k, y: (clientY - r.top) * k };
  };
  const inCircle = ({ x, y }) => (x - half) ** 2 + (y - half) ** 2 <= half * half;

  // Touch: only a finger that lands on a ball takes the gesture (Matter's handlers then block the scroll).
  let touchDrag = false;
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchDrag = e.touches.length === 1 && Query.point(balls, toWorld(t.clientX, t.clientY)).length > 0;
    if (touchDrag) mouse.mousedown(e);
  };
  const onTouchMove = (e) => {
    if (!touchDrag) return;
    const t = e.changedTouches[0];
    if (inCircle(toWorld(t.clientX, t.clientY))) mouse.mousemove(e);
    else onTouchEnd(e); // the finger left the circle: drop the ball
  };
  const onTouchEnd = (e) => {
    if (!touchDrag) return;
    touchDrag = false;
    mouse.mouseup(e);
  };
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd, { passive: false });
  canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });

  // Mouse: drop a dragged ball when the cursor leaves the circle.
  let dragging = false;
  Events.on(mouseConstraint, 'startdrag', () => (dragging = true));
  Events.on(mouseConstraint, 'enddrag', () => (dragging = false));
  const onMouseLeave = (e) => dragging && mouse.mouseup(e);
  canvas.addEventListener('mouseleave', onMouseLeave);

  // Balls under the moving cursor get kicked up and sideways.
  Events.on(mouseConstraint, 'mousemove', (e) => {
    const dtScale = 1000 / 60 / (engine.timing.lastDelta || 1000 / 60);
    for (const body of Query.point(balls, e.mouse.position)) {
      const f = 0.03 * body.mass * dtScale;
      Body.applyForce(body, body.position, {
        x: (f + Common.random() * f) * Common.choose([1, -1]),
        y: -f + Common.random() * -f,
      });
    }
  });

  /* ---------- scale with the circle ---------- */

  // The world stays `size` wide; the canvas backing store follows the CSS size times the device pixel ratio.
  const fit = () => {
    const ratio = (wrap.offsetWidth / size) * (devicePixelRatio || 1);
    if (!ratio || ratio === render.options.pixelRatio) return;
    Render.setPixelRatio(render, ratio);
    Object.assign(canvas.style, { width: '100%', height: '100%' });
    mouse.pixelRatio = ratio; // Mouse reads data-pixel-ratio through parseInt, fractions would be lost
  };
  fit();
  const ro = new ResizeObserver(fit);
  ro.observe(wrap);

  /* ---------- run only while visible ---------- */

  const runner = Runner.create();
  let running = false;
  const run = (on) => {
    if (on === running) return;
    running = on;
    if (on) {
      Runner.run(runner, engine);
      Render.run(render);
    } else {
      Runner.stop(runner);
      Render.stop(render);
    }
  };
  const io = new IntersectionObserver(([entry]) => run(entry.isIntersecting));
  io.observe(wrap);
  run(true);

  /* ---------- collision sounds (Web Audio, panned by the collision x) ---------- */

  let audio = null; // created on the first sound, after the user has interacted with the page
  let voices = 0; // at most 2 overlapping plays
  const ensureAudio = () => {
    if (!audio) {
      const ctx = new AudioContext();
      audio = { ctx, buffer: null };
      fetch(COLLISION_SOUND)
        .then((r) => r.arrayBuffer())
        .then((data) => ctx.decodeAudioData(data))
        .then((buffer) => (audio.buffer = buffer))
        .catch(() => {});
    }
    if (audio.ctx.state === 'suspended') audio.ctx.resume().catch(() => {});
    return audio;
  };
  const playCollision = (volume, pan) => {
    const a = ensureAudio();
    if (!a.buffer || a.ctx.state !== 'running' || voices >= 2) return;
    voices++;
    setTimeout(() => voices--, 100 + Math.random() * 400);
    const node = new AudioBufferSourceNode(a.ctx, { buffer: a.buffer });
    node.detune.value = volume * volume * 600 - 600; // a harder hit sounds higher (-600..0 cents)
    const panner = new PannerNode(a.ctx, { positionX: pan, positionZ: 0.5 });
    node.connect(panner).connect(new GainNode(a.ctx, { gain: volume })).connect(a.ctx.destination);
    node.start();
  };
  Events.on(engine, 'collisionStart', ({ pairs }) => {
    if (!pairs.length || !soundOn()) return;
    let strongest = 0;
    let x = 0;
    for (const pair of pairs) {
      if (pair.bodyA.isStatic || pair.bodyB.isStatic) continue;
      const depth = Vector.magnitude(pair.collision.penetration);
      if (depth > 1.5 && depth > strongest) {
        strongest = depth;
        x = pair.bodyA.position.x + pair.bodyB.position.x;
      }
    }
    if (strongest > 0) playCollision(Math.min(1, strongest / 10), (x / size - 1) / 2); // pan -0.5..0.5
  });

  return {
    setTilt(x) {
      engine.gravity.x = x;
    },
    destroy() {
      run(false);
      io.disconnect();
      ro.disconnect();
      Events.off(engine);
      Events.off(mouseConstraint);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      canvas.remove();
      audio?.ctx.close();
    },
  };
}
