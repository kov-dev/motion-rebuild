// preloader-gate.js — inline in the Home head, before the preloader.css style element.
// Canonical source: src/preloader-gate.js. Must run before first paint, so it cannot
// live in the deferred motion.js module.
(function () {
  var html = document.documentElement;
  html.classList.add('is-preloading');

  // overflow: hidden stops native scrolling only; a smooth-scroll library (the old script's
  // Lenis, mobile normalizeScroll) moves the page itself on wheel/touch. Registered here, before
  // any of them, as capture listeners on window, so they run first and swallow the input.
  var types = ['wheel', 'touchmove'];
  var swallow = function (e) {
    if (!html.classList.contains('is-preloading')) return release();
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  var release = function () {
    types.forEach(function (t) { window.removeEventListener(t, swallow, { capture: true }); });
  };
  types.forEach(function (t) { window.addEventListener(t, swallow, { capture: true, passive: false }); });
  document.addEventListener('motion:preloader-done', release);

  // Failsafe: the module never took over, so never trap the page behind the overlay.
  // A module script always runs before DOMContentLoaded, so check right after it; on a slow
  // page that can be 20+ s away (sync scripts in the body), hence also a hard cap.
  var bail = function () {
    if (window.__motionPreloader) return;
    html.classList.remove('is-preloading');
    release();
  };
  document.addEventListener('DOMContentLoaded', function () { setTimeout(bail, 1000); });
  setTimeout(bail, 20000);
})();
