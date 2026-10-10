/*
  legacy-guard.js — transition only (old script.v33 still on the page, PLAN «variant 2»).
  Canonical source: src/legacy-guard.js. Imported FIRST by motion.js.

  The old script loads GSAP 3.10 as the global window.gsap. Every GSAP ESM plugin registers
  itself on window.gsap while it is being imported, so our ScrollTrigger / CustomEase /
  MotionPathPlugin would bind to the old core and break. Hide the global while our imports
  evaluate; motion.js puts it back right after its own registerPlugin().
  Delete this file (and its import) together with script.v33.
*/
window.__legacyGsap = window.gsap;
window.gsap = undefined;
