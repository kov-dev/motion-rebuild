// preloader-gate.js — inline in the Home head, before the preloader.css style element.
// Canonical source: src/preloader-gate.js. Must run before first paint, so it cannot
// live in the deferred motion.js module.
document.documentElement.classList.add('is-preloading');
// Failsafe: the module never took over, so never trap the page behind the overlay.
setTimeout(function () {
  if (!window.__motionPreloader) document.documentElement.classList.remove('is-preloading');
}, 6000);
