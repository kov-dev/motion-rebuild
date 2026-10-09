/**
 * script.v33 — reconstructed, readable source of
 * https://cdn.zajno.com/dev/motion/script.v33.min.js (25 KB, minified only,
 * not obfuscated). Reconstructed 2026-10-09 from reference/script.v33.pretty.js.
 *
 * Behaviour is kept 1:1 with the minified build. Identifiers were renamed,
 * comments added, nothing else changed. Known bugs and dead code are marked
 * with `// NOTE:` — do NOT copy them into the rebuild (src/), fix them there.
 *
 * Globals expected at load: gsap, ScrollTrigger, MotionPathPlugin, CustomEase,
 * Observer, Lenis, ifvisible, Matter, jQuery ($).
 *
 * Section map (see docs/script-map.md):
 *   A. Boot / environment / smooth scroll
 *   B. Idle wiggle of interactive slides
 *   C. Hero ball → Introduction path → Interactive (MotionPath timeline)
 *   D. Interactive: pinned horizontal `.ui` sections with video slides
 *   E. Resources: pinned horizontal scroll + hover image stack
 *   F. Sphere: Matter.js physics ball + collision sounds
 *   G. Interactive horizontal "height-section" + sphere init trigger
 *   H. Video playback-speed buttons (dead: no `.section-slide-speed` in DOM)
 *   I. Navbar / sound-button colour system
 *   J. Menu toggle, nav links, wheel scroll in menu
 *   K. Page lifecycle (bfcache reload, fade-out on leave)
 */

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, CustomEase, Observer);

window.addEventListener("load", async function () {
  /* ───────────────────────── A. Boot / environment ───────────────────────── */

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  // NOTE: Safari match is computed and thrown away (dead expression).
  const isFirefox =
    (navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),
    !!navigator.userAgent.match(/Firefox/));

  // Force scroll to top shortly after load, then recalc ScrollTriggers.
  setTimeout(() => {
    window.scrollTo(0, 0);
    document.querySelector("body").scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, 100);

  // Viewport size is read ONCE at load; nothing below reacts to resize
  // (except the Matter.js canvas). All breakpoint logic uses these.
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const isDesktop = vw > 991; // Webflow desktop breakpoint
  const isMobileS = vw <= 479; // Webflow "Mobile portrait"

  /* ───────────────────── B. Idle wiggle of `.ui-slide` ───────────────────── */

  ifvisible.setIdleDuration(4); // seconds without input → "idle"
  const idleWiggle = gsap
    .timeline({ repeat: -1, paused: true })
    .to(".ui-slide", { x: "-1.5%", duration: 0.4, ease: "none" })
    .to(".ui-slide", { x: "0%", duration: 0.4, ease: "none" })
    .to(".ui-slide", { x: "1.5%", duration: 0.4, ease: "none" })
    .to(".ui-slide", { x: "0%", duration: 0.4, ease: "none" });
  ifvisible.on("idle", () => idleWiggle.restart());
  ifvisible.on("wakeup", () => idleWiggle.pause(0.8, false));

  /* ─────────────────────────── Smooth scroll ─────────────────────────────── */

  if (isMobile) {
    ScrollTrigger.normalizeScroll({ allowNestedScroll: true });
  }
  if (!isMobile && typeof Lenis !== "undefined") {
    // NOTE: instance is local (`lenis` global is never defined), so every
    // `typeof lenis !== "undefined" ? lenis.stop() : ...` below takes the
    // else-branch. Lenis is never stopped/started anywhere.
    const lenis = new Lenis({
      duration: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 1,
      infinite: false,
      normalizeWheel: false,
    });
    lenis.on("scroll", () => ScrollTrigger.update());
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    // NOTE: scrollerProxy on <body> — legacy integration hack. Modern Lenis
    // needs only `lenis.on('scroll', ScrollTrigger.update)` + ticker.
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) lenis.scroll = value;
        return lenis.scroll;
      },
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }),
    });
    ScrollTrigger.defaults({ scroller: document.body });
  }

  /* ──────────── C. Hero ball → Introduction path → Interactive ───────────── */

  const heroBall = document.querySelector("#anim-ball");
  const heroBallWrapH = document.querySelector(
    ".is-hero .anim-ball-wrap",
  ).clientHeight;

  // Custom eases used when the ball lands into the first interactive slide.
  CustomEase.create(
    "bounce",
    "M0,0 C0.05222,-0.59802 0.31828,-1.38625 0.55039,0 0.65208,-0.78892 0.94566,-0.58262 1,1",
  );
  CustomEase.create(
    "bounceSmall",
    "M0,0,C0.052,-0.598,0.246,-0.72,0.336,0,0.498,-0.502,0.792,-0.482,1,1",
  );

  // Height of the headline inside the first interactive block.
  const uiTextH = document
    .querySelector(".ui.first .ui-text")
    .getBoundingClientRect().height;

  // Layout fixes done in JS (should be CSS in the rebuild).
  if (isDesktop) {
    gsap.set(".ui-wrap", { marginTop: "+=" + uiTextH / 2 });
  } else {
    gsap.set(".ui-wrap", { marginTop: "" + (-1 * vh) / 2 });
    gsap.set(".ui-slide", { height: vh });
  }

  // SVG embed holding the intro path (one per breakpoint, hidden by CSS).
  const introPathEmbed = isDesktop
    ? document.querySelector(".embed-path")
    : isMobileS
      ? document.querySelector(".embed-path_mobile")
      : document.querySelector(".embed-path_tablet");

  // Hero: when the Introduction top reaches viewport centre (offset by the
  // ball-wrap height) collapse the two divider lines and the ball border.
  ScrollTrigger.create({
    trigger: ".is-introduction",
    start: `top-=${heroBallWrapH} center`,
    end: `top-=${heroBallWrapH} center`,
    onEnter: () => {
      gsap
        .timeline({ defaults: { overwrite: true } })
        .to(".ball-divider.is-left", {
          duration: 1,
          scaleX: 0,
          transformOrigin: "center right",
        })
        .to(
          ".ball-divider.is-right",
          { duration: 1, scaleX: 0, transformOrigin: "center left" },
          "<",
        )
        .to(".anim-ball-border", {
          scale: 0,
          duration: 0.5,
          transformOrigin: "center",
        });
    },
    onEnterBack: () => {
      gsap
        .timeline({ defaults: { overwrite: true } })
        .to(".anim-ball-border", {
          scale: 1,
          duration: 0.5,
          transformOrigin: "center",
        })
        .to(".ball-divider.is-left", {
          duration: 1,
          scaleX: 1,
          transformOrigin: "center right",
        })
        .to(
          ".ball-divider.is-right",
          { duration: 1, scaleX: 1, transformOrigin: "center left" },
          "<",
        );
    },
  });

  // Initial slide widths for the interactive track.
  if (isDesktop) gsap.set(".ui-slide", { width: "25vw" });
  else gsap.set(".ui-slider", { marginLeft: "-100vw" });

  // Where the ball must land at the end of the intro path: the centre of the
  // first `.ui-slide`, measured relative to the path embed.
  const ballR = () => heroBall.getBoundingClientRect().height; // ball size
  let landY, landX;
  if (isDesktop) {
    landY =
      document.querySelector(".ui-text").getBoundingClientRect().height / 2 +
      ballR() / 18;
    landX =
      document.querySelector(".ui-slide").getBoundingClientRect().x +
      document.querySelector(".ui-slide").getBoundingClientRect().width / 2 -
      introPathEmbed.getBoundingClientRect().x -
      ballR() / 18;
  } else {
    landY =
      document.querySelector(".ui-text").getBoundingClientRect().height / 2 +
      ballR() / 9;
    landX =
      document.querySelector(".ui-slide").getBoundingClientRect().x +
      document.querySelector(".ui-slide").getBoundingClientRect().width / 2 -
      introPathEmbed.getBoundingClientRect().x;
  }

  // Progress stops (0..1) along the SVG path where the four intro texts
  // (.is-also / .is-controls / .is-your / .is-attention) are revealed.
  const PATH_STOPS = {
    desktop: [0.1477, 0.43367, 0.61329, 1],
    tablet: [0.12336, 0.37553, 0.53228, 1],
    mobile: [0.13847, 0.348, 0.5061, 1],
  };
  let pathEl, stops;
  if (isDesktop) {
    pathEl = document.getElementById("vrtx");
    stops = PATH_STOPS.desktop;
  } else if (isMobileS) {
    pathEl = document.getElementById("vrtx-mobile");
    stops = PATH_STOPS.mobile;
  } else {
    pathEl = document.getElementById("vrtx-tablet");
    stops = PATH_STOPS.tablet;
  }

  // Vertical drop from the hero to the start of the path.
  const dropExtra = 0.033 * vw;
  const pathTop = introPathEmbed.offsetTop;
  const dropY = isDesktop ? dropExtra + pathTop : pathTop;

  // Reset the hero ball's sticky wrapper to its default position.
  function resetHeroBallSticky() {
    gsap.set("#hero .anim-ball-sticky", { y: 0, ease: "none", overwrite: true });
    gsap.set("#hero .anim-ball-wrap", {
      y: "50%",
      ease: "none",
      overwrite: true,
    });
  }

  // Scrubbed timeline: ball drops, follows the SVG path in 4 segments, each
  // segment end reveals the next intro text line (y: 100% → 0).
  const introTl = gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".intro-wrap",
        start: "top center",
        end: isDesktop ? `bottom+=${uiTextH / 2} center` : "bottom center",
        scrub: 1,
      },
      onEnter: resetHeroBallSticky,
      onEnterBack: resetHeroBallSticky,
      onComplete: () => {
        // Hand-over: hide the hero ball, show the first interactive slide.
        gsap.set(heroBall, { display: "none" });
        gsap.set(document.querySelector(".section-slide-wrap"), { alpha: 1 });
      },
    })
    .to(heroBall, {
      y: "+=" + dropY,
      duration: isDesktop ? 4 : 8,
      onComplete: () => {
        gsap.to(".is-also .anim-text", { y: 0, overwrite: true });
      },
    })
    .to(heroBall, {
      duration: 7,
      motionPath: {
        path: pathEl,
        align: pathEl,
        alignOrigin: [0.5, 0.5],
        start: 0,
        end: stops[0],
        immediateRender: true,
        curviness: 2,
      },
      onReverseComplete: () => {
        gsap.to(".is-also .anim-text", { y: "100%", overwrite: true });
      },
      onComplete: () => {
        gsap.to(".is-controls .anim-text", { y: 0, overwrite: true });
      },
    })
    .to(heroBall, {
      duration: 18,
      motionPath: {
        path: pathEl,
        align: pathEl,
        alignOrigin: [0.5, 0.5],
        start: stops[0],
        end: stops[1],
        immediateRender: true,
        curviness: 2,
      },
      onReverseComplete: () => {
        gsap.to(".is-controls .anim-text", { y: "100%", overwrite: true });
      },
      onComplete: () => {
        gsap.to(".is-your .anim-text", { y: 0, overwrite: true });
      },
    })
    .to(heroBall, {
      duration: 14,
      motionPath: {
        path: pathEl,
        align: pathEl,
        alignOrigin: [0.5, 0.5],
        start: stops[1],
        end: stops[2],
        immediateRender: true,
        curviness: 2,
      },
      onReverseComplete: () => {
        gsap.to(".is-your .anim-text", { y: "100%", overwrite: true });
      },
      onComplete: () => {
        gsap.to(".is-attention .anim-text", { y: 0, overwrite: true });
      },
    })
    .to(heroBall, {
      duration: 27,
      motionPath: {
        path: pathEl,
        align: pathEl,
        alignOrigin: [0.5, 0.5],
        start: stops[2],
        end: stops[3],
        immediateRender: true,
        curviness: 2,
      },
      onReverseComplete: () => {
        gsap.to(".is-attention .anim-text", { y: "100%", overwrite: true });
        resetHeroBallSticky();
      },
      onStart: resetHeroBallSticky,
    });

  // Desktop only: after the path, bounce down and slide right into the first
  // interactive slide.
  if (isDesktop) {
    introTl
      .to(heroBall, { duration: 8, ease: "bounce", y: `+=${landY}px` })
      .to(heroBall, { duration: 8, ease: "none", x: `+=${landX}px` }, "<");
  }

  /* ────────────── D. Interactive: pinned horizontal `.ui` blocks ─────────── */
  // Live DOM: 2 × `.ui` (first has `.first` and the only `.ui-ball`),
  // 3 × `.ui-slide` each, every slide = `.section-slide-wrap` with a <video>.

  const uiBlocks = document.querySelectorAll(".ui");
  const uiCount = uiBlocks.length;

  uiBlocks.forEach((ui, uiIndex, uiList) => {
    const slideCount = ui.querySelectorAll(".ui-slide").length;
    const k = isDesktop ? 0.75 : 1; // slide width as fraction of vw
    // Total scroll distance the block stays pinned for.
    let pinLength = vw * k + vw * slideCount * k + 0.5 * vw * slideCount + 0.25 * vw;
    if (isMobile) pinLength *= 3;

    const prevUi = uiIndex !== 0 ? uiList[uiIndex - 1] : null;
    const introSection = document.querySelector("#introduction");

    // Master timeline for this block: slides the track left slide by slide.
    const uiTl = gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ui,
          pin: true,
          anticipatePin: 1,
          start: "top top",
          end: () => "+" + pinLength, // NOTE: "+N" (not "+=N") — works, but typo-ish
          scrub: true,
          onLeaveBack: () => {
            gsap.to("#hero .anim-ball-sticky", {
              y: 0,
              ease: "none",
              duration: 0.4,
              overwrite: true,
            });
          },
          // Keep the hero ball visually glued to the end of the intro path
          // while the pinned block scrolls (manual sticky).
          onUpdate: () => {
            const base =
              introSection.offsetTop +
              introPathEmbed.offsetTop -
              window.pageYOffset +
              introPathEmbed.getBoundingClientRect().height -
              vh / 2;
            const y = isDesktop ? -1 * (base + uiTextH / 2) : -1 * base;
            gsap.to("#hero .anim-ball-sticky", {
              y: y + "px",
              ease: "none",
              duration: 0.02,
            });
          },
        },
        onStart: () => {
          if (prevUi) {
            gsap.set(prevUi.querySelector(".ui-ball"), { alpha: 0 });
            gsap.set(ui.querySelector(".section-slide-wrap"), { alpha: 1 });
          }
        },
        onReverseComplete: () => {
          if (uiIndex === 0) {
            gsap.set(heroBall, { display: "block" });
            gsap.set(document.querySelector(".section-slide-wrap"), {
              alpha: 0,
            });
          }
          if (prevUi) {
            gsap.set(prevUi.querySelector(".ui-ball"), { alpha: 1 });
            gsap.set(ui.querySelector(".section-slide-wrap"), { alpha: 0 });
          }
        },
      })
      // Step 0: move the track in and reveal the headline.
      .to(ui.querySelector(".ui-track"), {
        x: isDesktop ? "-75vw" : "-100vw",
        duration: 4,
        ease: "none",
      })
      .to(
        "#hero .anim-ball-wrap",
        { x: isDesktop ? "-=50vw" : "+=0", duration: 4, ease: "none" },
        "<",
      )
      .to(
        ui.querySelector(".ui-slider"),
        { marginLeft: 0, duration: 4, ease: "none" },
        "<",
      )
      .fromTo(
        ui.querySelector(".ui-text"),
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" },
        {
          x: isDesktop ? "0" : "100vw",
          y: isDesktop ? "0" : "-50%",
          clipPath: isDesktop
            ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
            : "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
          duration: 4,
          ease: "none",
        },
        "<",
      )
      // Dummy tween used purely as a hold (alpha already 1).
      .to(ui.querySelector(".ui-track"), {
        alpha: 1,
        duration: isMobile ? 6 : 4,
        ease: "none",
      });

    // Reveal a slide: circular clip-path grows, video fades in and plays.
    function revealSlide(slide) {
      const video = slide.querySelector("video");
      gsap.to(slide, {
        clipPath:
          vh > vw ? `circle(${vh}px at 50% 50%)` : `circle(${vw}px at 50% 50%)`,
        duration: 0.7,
        ease: "none",
      });
      video.currentTime = 0;
      gsap.to(video, {
        alpha: 1,
        delay: 0.1,
        duration: 0.6,
        ease: "none",
        onComplete: () => video.play(),
      });
    }
    // Hide a slide: clip-path shrinks to a dot, video fades out and pauses.
    function hideSlide(slide) {
      const video = slide.querySelector("video");
      gsap.to(slide, {
        clipPath: "circle(0.09rem at 50% 50%)",
        duration: 0.7,
        ease: "none",
      });
      gsap.to(video, {
        alpha: 0,
        duration: 0.7,
        ease: "none",
        onComplete: () => video.pause(),
      });
    }

    // Per-slide timelines share the same ScrollTrigger range as uiTl and
    // position themselves with absolute times (8 units per slide).
    ui.querySelectorAll(".ui-slide").forEach((slide, i) => {
      const startAt = isMobile ? 8 * i + 2 : 8 * i;
      let hold = isMobile
        ? 4 * (slideCount - 1 - i) * 2 + 4
        : 4 * (slideCount - 1 - i) * 2 + 4 + 4;
      if (i === slideCount - 2 || i === slideCount - 1) hold = 0;

      const slideTl = gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ui,
            start: "top top",
            end: () => "+" + pinLength,
            scrub: true,
          },
        })
        .to(
          slide,
          { width: isDesktop ? "75vw" : "100vw", duration: 4, ease: "none" },
          startAt,
        )
        .to(slide, {
          alpha: 1,
          duration: i !== slideCount - 1 || isMobile ? 4 : 8,
          ease: "none",
          onStart: () => revealSlide(slide),
          onComplete: () => {
            // Keep the very last slide of the last block visible.
            if (!(uiIndex === uiCount - 1 && i === slideCount - 1))
              hideSlide(slide);
          },
          onReverseComplete: () => hideSlide(slide),
        })
        .to(slide, {
          alpha: 1,
          duration: hold,
          ease: "none",
          onReverseComplete: () => revealSlide(slide),
        });

      if (i === slideCount - 2) {
        if (isDesktop) slideTl.to(slide, { width: "25vw", duration: 4, ease: "none" });
        else slideTl.to(slide, { alpha: 1, duration: 4, ease: "none" });
        slideTl.to(slide, { alpha: 1, duration: isMobile ? 8 : 12, ease: "none" });
      }

      // Advance the master track for middle slides.
      if (i > 0 && i !== slideCount - 1) {
        uiTl
          .to(ui.querySelector(".ui-track"), {
            x: isDesktop ? "-=75vw" : "-=100vw",
            duration: 4,
            ease: "none",
          })
          .to(ui.querySelector(".ui-track"), { alpha: 1, duration: 4, ease: "none" });
      }
      // Last slide: hold, then push the track out.
      if (i === slideCount - 1) {
        if (isDesktop) {
          uiTl
            .to(ui.querySelector(".ui-track"), {
              alpha: 1,
              duration: isMobile ? 8 : 12,
              ease: "none",
            })
            .to(ui.querySelector(".ui-track"), { x: "-=25vw", duration: 4, ease: "none" });
        } else {
          uiTl
            .to(ui.querySelector(".ui-track"), { x: "-=100vw", duration: 4, ease: "none" })
            .to(ui.querySelector(".ui-track"), { alpha: 1, duration: 8, ease: "none" });
        }
        slideTl.to(slide, { width: "100vw", duration: 4, ease: "none" });
      }
    });

    // Hand-over to the next `.ui` block: the `.ui-ball` drops from this
    // block's headline into the next block (desktop: drop + shift + bounce).
    if (uiIndex !== uiCount - 1) {
      const nextUi = uiList[uiIndex + 1];
      const ballDropY = isDesktop
        ? 0.5 * vh +
          (vh - ui.querySelector(".ui-text").getBoundingClientRect().height) / 2 +
          18
        : vh;
      const ballShiftX = 0.375 * vw;
      const uiBall = document.querySelector(".ui-ball");
      const ballBounceY =
        ui.querySelector(".ui-text").getBoundingClientRect().height / 2 -
        uiBall.getBoundingClientRect().height / 2 -
        uiBall.getBoundingClientRect().height / 9;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ui.querySelector(".ui-track"),
            start: `top+=${pinLength} top`,
            end: `top+=${pinLength + vh} top`,
            scrub: true,
            onEnterBack: () => {
              // NOTE: `.ui-path__circle` does not exist in the live DOM —
              // gsap.set on null is a no-op.
              gsap
                .timeline({ onComplete: () => {} })
                .set(nextUi.querySelector(".ui-path__circle"), { display: "block" })
                .set(nextUi.querySelector(".section-slide-wrap"), { opacity: 0 });
            },
          },
          onComplete: () => {
            gsap
              .timeline({
                onComplete: () => {
                  // NOTE: `lenis` global never exists → always sets overflow.
                  typeof lenis !== "undefined"
                    ? lenis.stop()
                    : gsap.set("html", { overflow: "overlay" });
                },
              })
              .set(nextUi.querySelector(".ui-path__circle"), { display: "none" })
              .set(nextUi.querySelector(".section-slide-wrap"), { opacity: 1 });
          },
        })
        .to(ui.querySelector(".ui-ball"), {
          ease: "none",
          duration: 0.45,
          y: ballDropY,
          overwrite: true,
          onStart: () => {
            gsap.set(ui.querySelector(".ui-track"), { alpha: 0 });
            gsap.set(ui.querySelector(".ui-ball"), { alpha: 1 });
          },
          onReverseComplete: () => {
            gsap.set(ui.querySelector(".ui-track"), { alpha: 1 });
            gsap.set(ui.querySelector(".ui-ball"), { alpha: 0 });
          },
        })
        .to(ui.querySelector(".ui-ball"), {
          duration: isDesktop ? 0.7 : 0,
          x: isDesktop ? "+=" + ballShiftX : 0,
          ease: "none",
        })
        .to(
          ui.querySelector(".ui-ball"),
          {
            duration: isDesktop ? 0.7 : 0,
            y: isDesktop ? "+=" + ballBounceY : 0,
            ease: "bounceSmall",
          },
          "<",
        );
    }
  });

  /* ──────────────── E. Resources: pinned horizontal scroll ───────────────── */

  // Initial "active" state: first item / name / image / header tab.
  document.querySelector(".resources-item").classList.add("active");
  document.querySelector(".resources-item__name").classList.add("active");
  document.querySelector(".resources-images__item").classList.add("active");
  document.querySelector(".resources-header__item").classList.add("active");

  // The resources pin is created LAZILY, once, when `.is-lessons` reaches the
  // top. NOTE: this is why section I below has to add the pin length to the
  // navbar triggers manually (they were created before this pin existed).
  ScrollTrigger.create({
    trigger: ".is-lessons",
    start: "top top",
    normalize: true,
    once: true,
    onEnter: () => {
      const arrowLen = 1.5 * vw; // phase 1: arrows fly right
      const resourcesW = document.querySelector(".resources").scrollWidth;
      const listsH = document
        .querySelector(".resources-lists")
        .getBoundingClientRect().height;
      const trackShift = resourcesW - vw; // phase 2: horizontal track
      const total = arrowLen + trackShift + listsH; // phase 3: lists scroll up
      const pArrows = parseInt((arrowLen / total) * 100);
      const pTrack = parseInt((trackShift / total) * 100);
      const pLists = parseInt(((2 * listsH) / total) * 100);
      const header = document.querySelector(".resources-header");
      const lists = document.querySelectorAll(".resources-list");
      let activeList = 0;

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".resources",
            pin: true,
            start: "top top",
            end: () => "+" + total,
            scrub: 3,
          },
        })
        .to(".resources-arrow", {
          x: isMobileS ? 0.78 * vw : 0.84 * vw,
          duration: pArrows,
          stagger: pArrows / 4,
        })
        .to(".resources-track", { x: -trackShift, duration: pTrack })
        .to(".resources-lists", {
          yPercent: -100,
          duration: pLists,
          // Sync the header tab with the list currently under the header.
          onUpdate: () => {
            const headerBottom =
              header.getBoundingClientRect().top +
              header.getBoundingClientRect().height;
            lists.forEach((list, idx) => {
              const top = list.getBoundingClientRect().top;
              const bottom = top + list.getBoundingClientRect().height;
              if (headerBottom >= top && headerBottom < bottom && activeList !== idx) {
                $(".resources-header__item").removeClass("active");
                $(".resources-header__item").eq(idx).addClass("active");
                activeList = idx;
              }
            });
          },
        });
      ScrollTrigger.refresh();
    },
  });

  // Hover state for the resources image stack (jQuery).
  let stackRotation = 0; // rotation of the last pushed image, deg
  let stackZ = 1; // z-index counter
  let stack = [0]; // indices of images currently shown (max 3)
  let hoverIndex = 0;
  let shouldRotate = true;
  let listIndex = 0;
  let prevListIndex = 0;

  /* ─────────────── F. Sphere: Matter.js ball pit + sounds ────────────────── */

  async function initSphere() {
    const canvasWrap = document.querySelector("#canvas");

    // Windows 11+ (UA-CH platformVersion ≥ 13) → slow the simulation down.
    let winMajor;
    if (navigator.userAgentData && navigator.userAgentData.platform === "Windows") {
      const hints = await navigator.userAgentData.getHighEntropyValues(["platformVersion"]);
      winMajor = parseInt(hints.platformVersion.split(".")[0]);
    }

    const size = canvasWrap.offsetWidth;
    const half = size / 2;
    const ballRadius = size / 15;
    const {
      Engine, Render, Runner, Body, Bodies, Common, Composite, World, Mouse,
      Events, MouseConstraint,
    } = Matter;

    const engine = Engine.create();
    const render = Render.create({
      element: canvasWrap,
      engine,
      options: {
        isSensor: true,
        width: canvasWrap.offsetWidth,
        height: canvasWrap.offsetHeight,
        background: "transparent",
        wireframes: false,
      },
    });
    if (winMajor >= 13) engine.timing.timeScale = 0.35;
    engine.gravity.y = 1;
    engine.gravity.x = 0;
    engine.gravity.scale = 0.0025;

    // Tilt gravity sideways with scroll direction inside the interactive
    // horizontal section; reset when scrolling stops.
    ScrollTrigger.create({
      trigger: ".is-interactive.wf-section",
      start: "top top",
      onEnter: () => {
        ScrollTrigger.create({
          trigger: ".height-section.is-interactive",
          start: "top top",
          end: "100% top",
          onUpdate: (self) => {
            engine.gravity.x = (-1 * self.direction) / 2;
          },
        });
      },
    });
    ScrollTrigger.addEventListener("scrollEnd", () => {
      engine.gravity.x = 0;
    });

    // 15 balls (thicker stroke, collide with each other) + 20 balls (thin
    // stroke, collide with the first group but not among themselves).
    // NOTE: `density` key is duplicated in the original; the second (0.05) wins.
    const balls = [];
    for (let i = 0; i < 15; i++) {
      balls.push(
        Bodies.circle(half, half, ballRadius, {
          restitution: 0.5,
          density: 0.05,
          collisionFilter: { category: 3, mask: 3 },
          render: { fillStyle: "#0C0B0B", strokeStyle: "white", lineWidth: 2 },
        }),
      );
    }
    for (let i = 0; i < 20; i++) {
      balls.push(
        Bodies.circle(half, half, ballRadius, {
          restitution: 0.5,
          density: 0.05,
          collisionFilter: { category: 4, mask: 5 },
          render: { fillStyle: "#0C0B0B", strokeStyle: "white", lineWidth: 1 },
        }),
      );
    }
    Composite.add(engine.world, balls);

    // Mouse: drag balls, and repel balls under the cursor on move.
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    // Let the page scroll over the canvas.
    mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
    mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);

    Events.on(mouseConstraint, "mousemove", (e) => {
      const hit = Matter.Query.point(balls, e.mouse.position);
      const dtScale = 1000 / 60 / engine.timing.lastDelta;
      for (const body of hit) {
        if (body.isStatic) continue;
        const f = 0.03 * body.mass * dtScale;
        Body.applyForce(body, body.position, {
          x: (f + Common.random() * f) * Common.choose([1, -1]),
          y: -f + Common.random() * -f,
        });
      }
    });
    Composite.add(engine.world, mouseConstraint);
    Render.run(render);

    // Invisible cage: 32 static rectangles arranged on a circle (radius =
    // half the canvas) so the balls stay inside the round clip.
    // NOTE: original leaks `i, r, parts, pegCount, TAU, segment, angle2, x2,
    // y2, cx2, cy2, rect, body` as implicit globals.
    const pegCount = 32;
    const TAU = 2 * Math.PI;
    const cageR = size / 2;
    for (let i = 0; i < pegCount; i++) {
      const segment = TAU / pegCount;
      const angle = (i / pegCount) * TAU + segment / 2;
      const cx = Math.cos(angle) * cageR + size / 2;
      const cy = Math.sin(angle) * cageR + size / 2;
      const peg = Bodies.rectangle(cx, cy, 0.01 * size, 0.4 * size, {
        angle,
        isStatic: true,
        density: 1,
        render: { fillStyle: "transparent", strokeStyle: "transparent", lineWidth: 0 },
      });
      World.add(engine.world, peg);
    }

    const runner = Runner.create();
    Runner.run(runner, engine);

    let isDragging = 0;
    Events.on(mouseConstraint, "startdrag", () => (isDragging = 1));
    Events.on(mouseConstraint, "enddrag", () => (isDragging = 0));

    const canvasEl = document.querySelector("#canvas canvas");
    canvasEl.classList.add("sphere-canvas");
    const sphereCanvas = document.querySelector(".sphere-canvas");
    sphereCanvas.style = "clip-path: circle(50%); overflow: hidden;";

    // Release a dragged ball when the cursor leaves the canvas.
    // NOTE: `e.toElement` is non-standard (undefined in Firefox → throws on
    // every mousemove). Use `e.target` in the rebuild.
    window.addEventListener("mousemove", (e) => {
      if (e.toElement.getAttribute("class") !== "sphere-canvas" && isDragging) {
        const ev = document.createEvent("MouseEvents");
        ev.initEvent("mouseup", true, true);
        sphereCanvas.dispatchEvent(ev);
      }
    });
    // Touch: if the finger leaves the circle, re-dispatch touchstart.
    canvasEl.addEventListener(
      "touchmove",
      function (e) {
        e.stopPropagation();
        const r = this.getBoundingClientRect();
        const tx = e.touches[0].clientX;
        const ty = e.touches[0].clientY;
        const cx = r.x + r.width / 2;
        const cy = r.y + r.height / 2;
        const rad = r.width / 2;
        if (!(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2) <= Math.pow(rad, 2))) {
          sphereCanvas.dispatchEvent(new Event("touchstart"));
        }
      },
      false,
    );
    window.addEventListener("resize", () => {
      render.bounds.max.x = canvasWrap.offsetWidth;
      render.bounds.max.y = canvasWrap.offsetHeight;
      render.options.width = canvasWrap.offsetWidth;
      render.options.height = canvasWrap.offsetHeight;
      render.canvas.width = canvasWrap.offsetWidth;
      render.canvas.height = canvasWrap.offsetHeight;
    });

    /* ── Collision sounds (Web Audio, panned by collision X) ── */

    let activeVoices = 0; // max 2 overlapping plays
    const bufferCache = {};
    const pendingFetch = {};
    const audioCtx = new AudioContext();
    let panX = 0; // -0.5..0.5, set from the collision position

    class Sound {
      constructor(src) {
        this.src = src;
        this.gain = new GainNode(audioCtx);
        this.panner = new PannerNode(audioCtx);
        this.panner.connect(this.gain);
        this.gain.connect(audioCtx.destination);
        this.load();
      }
      async load() {
        let buffer = bufferCache[this.src];
        if (!buffer) {
          let pending = pendingFetch[this.src];
          if (!pending) {
            pending = (async () => {
              const res = await fetch(this.src);
              const data = await res.arrayBuffer();
              delete pendingFetch[this.src];
              return data;
            })();
            pendingFetch[this.src] = pending;
          }
          const data = await pending;
          buffer = await audioCtx.decodeAudioData(data);
          bufferCache[this.src] = buffer;
        }
        this._buffer = buffer;
      }
      set volume(v) {
        this.gain.gain.value = v;
      }
      get volume() {
        return this.gain.gain.value || 0;
      }
      play() {
        if (!this._buffer) return;
        const node = new AudioBufferSourceNode(audioCtx, { buffer: this._buffer });
        // Louder collision → higher pitch (detune in cents, -600..0).
        node.detune.value = this.volume * this.volume * 600 - 600;
        node.onended = () => this._onEnd && this._onEnd();
        this.panner.positionX.value = panX;
        this.panner.positionZ.value = 0.5;
        node.connect(this.panner);
        node.start();
      }
      onEnd(cb) {
        this._onEnd = cb;
      }
    }

    // Object pool of Sound instances per src.
    const soundPool = {};
    function acquireSound(src) {
      const pool = soundPool[src];
      if (pool) {
        const s = pool.pop();
        if (s) return s;
      }
      const s = new Sound(src);
      s.onEnd(() => {
        (soundPool[s.src] || (soundPool[s.src] = [])).push(s);
      });
      return s;
    }

    // A channel picks a random src and plays it with a 100–500 ms cooldown.
    function Channel(srcs) {
      this.srcs = srcs;
    }
    Channel.prototype.play = function (volume) {
      if (activeVoices >= 2) return;
      ++activeVoices;
      const s = acquireSound(this.srcs[Math.floor(Math.random() * this.srcs.length)]);
      s.volume = volume;
      s.play();
      setTimeout(() => --activeVoices, 100 + Math.random() * 400);
    };
    // Round-robin over N channels.
    function MultiChannel(srcs, num) {
      this.channels = [];
      this.num = num;
      this.index = 0;
      for (let i = 0; i < num; i++) this.channels.push(new Channel(srcs));
    }
    MultiChannel.prototype.play = function (volume) {
      this.channels[this.index].play(volume);
      this.index++;
      if (this.index >= this.num) this.index = 0;
    };

    // NOTE: `musicCollision` and `diff` are implicit globals in the original;
    // `diff` is never used.
    const musicCollision = new MultiChannel(
      ["https://cdn.zajno.com/dev/motion/sounds/sound_2_filter-2-cut.mp3"],
      2,
    );

    // Sound is only produced while the global sound toggle is "is-active".
    let soundEnabled = false;
    Events.on(engine, "collisionStart", (e) => {
      if (!soundEnabled) return;
      const pairs = e.pairs;
      if (pairs.length === 0) return;
      const threshold = 1.5;
      let strongest = 0;
      pairs.forEach((pair) => {
        if (pair.bodyA.isStatic || pair.bodyB.isStatic) return;
        const depth = Matter.Vector.magnitude(pair.collision.penetration);
        if (depth > threshold && depth > strongest) {
          strongest = depth;
          panX = pair.bodyA.position.x + pair.bodyB.position.x;
        }
      });
      const volume = strongest > 0 ? Math.min(1, strongest / 10) : 0;
      if (volume > 0) {
        panX = (panX / size - 1) / 2; // map to -0.5..0.5
        musicCollision.play(volume);
      }
    });
    document.querySelector(".sound-icon-wrap").addEventListener("click", function () {
      soundEnabled = this.querySelector(".sound-btn-mute").classList.contains("is-active");
    });
  }

  /* ──────────── E (cont.): resources hover image stack (jQuery) ──────────── */

  $(".resources-item").mouseenter(function () {
    $(".resources-item").removeClass("active");
    $(".resources-item__name").removeClass("active");
    $(this).addClass("active");
    $(this).find(".resources-item__name").addClass("active");

    hoverIndex = $(this).closest(".resources-item").index();
    shouldRotate = true;
    listIndex = $(this).closest(".resources-list").index();

    // Switched list (Courses ↔ Resources): clear the stack.
    if (prevListIndex !== listIndex) {
      stack = [];
      $(".resources-images__item").removeClass("active");
      stackRotation = -6;
    }
    if (stack.includes(hoverIndex)) {
      // Already shown: move it to the top of the stack without re-rotating.
      stack.push(hoverIndex);
      stack.splice(stack.indexOf(hoverIndex), 1);
      shouldRotate = false;
    } else {
      stack.push(hoverIndex);
      stackRotation = stackRotation === -6 ? 0 : stackRotation - 3;
    }
    stackZ++;
    if (stack.length > 3) {
      $(".resources-images__item").eq(stack[0]).removeClass("active");
      stack.shift();
    }
    const img = $(".resources-images__list")
      .eq(listIndex)
      .find(".resources-images__item")
      .eq(hoverIndex);
    if (shouldRotate) {
      img.css("transform", `rotate(${stackRotation}deg)`);
      img.addClass("active");
    }
    img.css("z-index", stackZ);
    prevListIndex = $(this).closest(".resources-list").index();
  });

  /* ───────── H. Video playback-speed buttons (DEAD CODE on live) ─────────── */
  // NOTE: no `.section-slide-speed` / `data-speed` in the live DOM.
  document.querySelectorAll(".section-slide-wrap").forEach((wrap) => {
    const video = wrap.querySelector("video");
    wrap.querySelectorAll(".section-slide-speed").forEach((btn) => {
      btn.addEventListener("click", () => {
        video.playbackRate = btn.getAttribute("data-speed");
      });
    });
  });

  /* ──────── G. Interactive horizontal section + sphere init trigger ──────── */

  const interactiveShift =
    document.querySelector(".height-section.is-interactive").scrollWidth - vw;
  gsap.to(".height-section.is-interactive", {
    x: -1 * interactiveShift,
    ease: "sine.out",
    scrollTrigger: {
      trigger: ".height-section.is-interactive",
      pin: true,
      anticipatePin: 1,
      scrub: 1,
      start: "top top",
      end: () => "+=" + interactiveShift,
    },
  });
  ScrollTrigger.create({
    trigger: ".height-section.is-interactive",
    start: "top bottom",
    once: true,
    onEnter: () => initSphere(),
  });

  /* ──────────────── I. Navbar / sound-button colour system ───────────────── */
  // Wrappers `.nav.nav-dark|nav-light|nav-color` (and nested `.nav-inner`)
  // mark which colour scheme the fixed navbar and the fixed sound button
  // should take while that section is under them. Two trigger lines:
  //   navbar  → `top+=1px` (section top crosses the navbar)
  //   sound   → `bottom-=90px` (section crosses the sound button at the bottom)

  const COLOR_DARK = "#0C0B0B";
  const COLOR_LIGHT = "#FDFCFA";

  let navSection = document.querySelector(".nav"); // section under the navbar
  let navColorIndex = 0; // breadcrumb index for nav-color sections
  let soundSection = document.querySelector(".nav"); // section under the sound btn
  let soundColorIndex = 0;

  // Manual compensation for the resources pin (created lazily, see E).
  const resourcesSection = document.querySelector("#resources");
  let resourcesPinLen =
    resourcesSection.scrollWidth - vw +
    resourcesSection.scrollWidth - vw +
    document.querySelector(".resources-lists").getBoundingClientRect().height;
  if (!isDesktop) resourcesPinLen *= 2;
  let endOffset = 0;
  let startOffset = 0;

  function navDark() {
    gsap.to(".logo-eye-dark", { alpha: 1, duration: 0.4 });
    gsap.to(".logo-eye-light", { alpha: 0, duration: 0.4 });
    gsap.to("#logo-wrap", { borderColor: COLOR_LIGHT, backgroundColor: COLOR_DARK, color: COLOR_LIGHT, duration: 0.4 });
    gsap.to(".toggle-span", { backgroundColor: COLOR_LIGHT, duration: 0.4 });
    gsap.to("#menu-toggle", { borderColor: COLOR_LIGHT, backgroundColor: COLOR_DARK, color: COLOR_LIGHT, duration: 0.4 });
    gsap.to(".eye-bg-sections", { backgroundColor: COLOR_DARK, duration: 0.4 });
    gsap.to(".breadcrumbs-wrap", { alpha: 0, duration: 0.4 });
  }
  function navLight() {
    gsap.to(".logo-eye-light", { alpha: 1, duration: 0.4 });
    gsap.to(".logo-eye-dark", { alpha: 0, duration: 0.4 });
    gsap.to("#logo-wrap", { borderColor: COLOR_DARK, backgroundColor: COLOR_LIGHT, color: COLOR_DARK, duration: 0.4 });
    gsap.to(".toggle-span", { backgroundColor: COLOR_DARK, duration: 0.4 });
    gsap.to("#menu-toggle", { borderColor: COLOR_DARK, backgroundColor: COLOR_LIGHT, color: COLOR_DARK, duration: 0.4 });
    gsap.to(".eye-bg-sections", { backgroundColor: COLOR_LIGHT, duration: 0.4 });
    gsap.to(".breadcrumbs-wrap", { alpha: 0, duration: 0.4 });
  }
  // Lesson sections: navbar takes the lesson colour from the matching
  // breadcrumb item's background and shows the breadcrumbs.
  function navColor() {
    gsap.to(".logo-eye-light", { alpha: 1, duration: 0.4 });
    gsap.to(".logo-eye-dark", { alpha: 0, duration: 0.4 });
    gsap.to(".breadcrumbs-wrap", { alpha: 1, duration: 0.4 });
    gsap.to("#breadcrumbs-wrap .breadcrumb-item", { alpha: 0, duration: 0.4 });
    const crumb = document.querySelectorAll("#breadcrumbs-wrap .breadcrumb-item")[navColorIndex];
    const bg = getComputedStyle(crumb).backgroundColor;
    gsap.to(crumb, { alpha: 1, duration: 0.4, overwrite: true });
    gsap.to("#logo-wrap", { borderColor: COLOR_DARK, backgroundColor: bg, color: COLOR_DARK, duration: 0.4 });
    gsap.to(".toggle-span", { backgroundColor: COLOR_DARK, duration: 0.4 });
    gsap.to("#menu-toggle", { borderColor: COLOR_DARK, backgroundColor: bg, color: COLOR_DARK, duration: 0.4 });
    gsap.to(".eye-bg-sections", { backgroundColor: bg, duration: 0.4 });
  }
  function navRestore() {
    if (navSection.classList.contains("nav-dark")) navDark();
    else if (navSection.classList.contains("nav-light")) navLight();
    else if (navSection.classList.contains("nav-color")) navColor();
  }
  function soundDark() {
    gsap.to(".sound-icon-wrap", { borderColor: COLOR_LIGHT, backgroundColor: COLOR_DARK, color: COLOR_LIGHT, duration: 0.4 });
  }
  function soundLight() {
    gsap.to(".sound-icon-wrap", { borderColor: COLOR_DARK, backgroundColor: COLOR_LIGHT, color: COLOR_DARK, duration: 0.4 });
  }
  function soundColor() {
    const crumb = document.querySelectorAll("#breadcrumbs-wrap .breadcrumb-item")[soundColorIndex];
    gsap.to(".sound-icon-wrap", { borderColor: COLOR_DARK, backgroundColor: getComputedStyle(crumb).backgroundColor, color: COLOR_DARK, duration: 0.4 });
  }
  function soundRestore() {
    if (soundSection.classList.contains("nav-dark")) soundDark();
    else if (soundSection.classList.contains("nav-light")) soundLight();
    else if (soundSection.classList.contains("nav-color")) soundColor();
  }

  // Helper: two ScrollTriggers (navbar line + sound line) for one wrapper.
  function navTriggers(el, index, onNav, onSound, nested) {
    ScrollTrigger.create({
      trigger: el,
      start: `top+=${startOffset}px top+=1px`,
      end: `bottom+=${endOffset}px top+=1px`,
      invalidateOnRefresh: true,
      onEnter: () => { if (!nested) navSection = el; onNav(); },
      onEnterBack: () => { if (!nested) navSection = el; onNav(); },
      ...(nested ? { onLeave: navRestore, onLeaveBack: navRestore } : {}),
    });
    ScrollTrigger.create({
      trigger: el,
      start: `top+=${startOffset}px bottom-=90px`,
      end: `bottom+=${endOffset}px bottom-=90px`,
      invalidateOnRefresh: true,
      onEnter: () => { if (!nested) { soundSection = el; soundColorIndex = index; } onSound(); },
      onEnterBack: () => { if (!nested) { soundSection = el; soundColorIndex = index; } onSound(); },
      ...(nested ? { onLeave: soundRestore, onLeaveBack: soundRestore } : {}),
    });
  }

  document.querySelectorAll(".nav").forEach((nav, index) => {
    const cls = nav.classList;
    // The resources wrapper itself: extend its end by the pin length.
    if (nav.contains(resourcesSection)) endOffset += resourcesPinLen;
    if (cls.contains("nav-dark")) navTriggers(nav, index, navDark, soundDark, false);
    if (cls.contains("nav-light")) navTriggers(nav, index, navLight, soundLight, false);
    // Everything after resources: shift its start by the pin length.
    if (nav.contains(resourcesSection)) startOffset += resourcesPinLen;
    // Nested overrides inside a wrapper (live: one `.nav-inner.nav-dark`
    // inside a lesson) — restore the parent scheme on leave.
    nav.querySelectorAll(".nav-inner").forEach((inner) => {
      const c = inner.classList;
      if (c.contains("nav-dark")) navTriggers(inner, index, navDark, soundDark, true);
      if (c.contains("nav-light")) navTriggers(inner, index, navLight, soundLight, true);
    });
  });
  // Lesson wrappers (8): same two lines, no pin offsets, index = breadcrumb.
  document.querySelectorAll(".nav.nav-color").forEach((nav, index) => {
    ScrollTrigger.create({
      trigger: nav,
      start: "top top+=1px",
      end: "bottom top+=1px",
      invalidateOnRefresh: true,
      onEnter: () => { navSection = nav; navColorIndex = index; navColor(); },
      onEnterBack: () => { navSection = nav; navColorIndex = index; navColor(); },
    });
    ScrollTrigger.create({
      trigger: nav,
      start: "top bottom-=90px",
      end: "bottom bottom-=90px",
      invalidateOnRefresh: true,
      onEnter: () => { soundSection = nav; soundColorIndex = index; soundColor(); },
      onEnterBack: () => { soundSection = nav; soundColorIndex = index; soundColor(); },
    });
  });

  /* ──────────────── J. Menu toggle, nav links, wheel in menu ─────────────── */

  const navMenu = document.querySelector(".nav-menu");
  const navTrack = document.querySelector(".nav-track");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelectorAll(".nav-link");

  // Open/close is animated by IX2 (class toggle); JS only locks scroll and
  // forces the dark scheme while open, restoring the section scheme on close.
  menuToggle.addEventListener("click", function () {
    menuToggle.classList.toggle("opening");
    if (menuToggle.classList.contains("opening")) {
      // NOTE: `lenis` global never exists → html overflow hidden.
      typeof lenis !== "undefined" ? lenis.stop() : gsap.set("html", { overflow: "hidden" });
      navDark();
    } else {
      // NOTE: calls lenis.stop() (not start) in the never-taken branch.
      typeof lenis !== "undefined" ? lenis.stop() : gsap.set("html", { overflow: "overlay" });
      navRestore();
    }
  });
  navLinks.forEach((link) => link.addEventListener("click", () => menuToggle.click()));

  // Vertical wheel inside the open menu scrolls the horizontal track.
  navMenu.addEventListener("wheel", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dx = isFirefox && e.deltaX < 10 ? 10 * e.deltaX : e.deltaX;
    const dy = isFirefox && e.deltaY < 10 ? 10 * e.deltaY : e.deltaY;
    navTrack.scrollLeft = navTrack.scrollLeft + dx + dy;
  });

  // "Home" link (#link1 → #hero): put the hero ball back to x=0.
  document.querySelector("#link1").addEventListener("click", () => {
    gsap.to(heroBall, { x: 0, duration: 0.2, delay: 0.2, overwrite: true });
  });
});

/* ──────────────────────── K. Page lifecycle ─────────────────────────────── */

// Bust bfcache: a page restored from back/forward cache reloads.
window.addEventListener("pageshow", (e) => {
  if (e.persisted) window.location.reload();
});

// Fade the page out when leaving via a link (except mailto/tel).
// NOTE: throws if the active element has no href (swallowed by the browser).
window.onbeforeunload = function (e) {
  const href = e.target.activeElement.href;
  if (!href.includes("mailto") && !href.includes("tel")) {
    gsap.to("body", { opacity: 0, duration: 0.3 });
    window.scrollTo(0, 0);
  }
};
