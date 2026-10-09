# Дерево Home (оригінал `6384fe1e68c38ac8097a7e47`, Home `643fc55a8d5a6a31d4d2a4df`)

Джерела: `reference/live-home-2026-10-09.html` (парсинг скриптом) + Webflow MCP (лише читання: `get_all_elements` depth 3, `query_elements` HtmlEmbed, `get_page_freeform_code`). Нічого не змінювалось.

Позначення: `тег.клас1.клас2#id`; `(N)` — кількість вузлів у піддереві (включно з собою); `×N` — N однакових сусідніх вузлів згорнуто (однакова структура на 6 рівнів); `…` — глибше не розгорнуто; `[ix2]` — елемент має `data-w-id` (IX2-тригер/ціль); `[lottie: файл]`, `[video]`, `[embed]` (`w-embed`), `[svg]`, `[cms]` (`w-dyn-list`/`w-dyn-item`); `"текст"` — початок тексту.

**Designer ID.** Отримано (Designer підключений). `component` скрізь = `643fc55a8d5a6a31d4d2a4df` (ID сторінки); нижче наведено лише `element`. Body: `643fc55a8d5a6a1bdcd2a4e2`. Компонентів/символів на сторінці **0** (`component_filter` → 0 збігів), усі 98 ембедів — `HtmlEmbed`. Глибші ID (нижче 3-го рівня) не знімались — TODO за потреби (`query_elements` з `scope_element_id`).

**Структура верхнього рівня `body.body-wrap` (1545 вузлів):** `div.main-css.w-embed` → `div.navigation.w-nav` → `div.loader` → `div.main` (7 дітей) → `div.fixed-bottom` → 18 `<script>` → 13 `<audio>` → 2 `<script>`.


## Navigation (поза картою CONVENTIONS)

Designer: `NavbarWrapper.navigation` `72062d36-1cc9-8384-1290-b9cc4e917a3b`; `.nav-header` `…917a3c`; `.nav-menu` `…917a70`. Це фіксований навбар + повноекранне меню: логотип-Lottie, хлібні крихти (8 `breadcrumb-item`, для dimension клас `is-scale`, не `is-dimension`), бургер `#menu-toggle`, 10 `a.nav-link#link1..10` кожне з `div.lottie-card` (hover-Lottie, 10 шт.), соцмережі (5 ембедів SVG). 13 Lottie: 3 логотипи + 10 пунктів меню. Карта в CONVENTIONS цю секцію не містить, а `lottie-card` помилково віднесено до Techniques.

```
div.navigation.w-nav (109)
  - div.nav-header (41)
    - div.nav-panels (40)
      - div.nav-panel (39)
        - div.nav-logo (30)
          - div.logo-wrappers (12)
            - div.logo-sections-wrap (11)
              - a.sound_click.w-inline-block.w--current (7) …
              - a.sound_click.w-inline-block.w--current (3) …
          - div.breadcrumbs-wrap#breadcrumbs-wrap (17)
            - div.breadcrumb-item.is-easing (2)
              - div ["The Basics of easing"]
            - div.breadcrumb-item.is-delay (2)
              - div ["Offset and Delay"]
            - div.breadcrumb-item.is-fade (2)
              - div ["Fade in Fade Out"]
            - div.breadcrumb-item.is-morph (2)
              - div ["Transformation/Morph"]
            - div.breadcrumb-item.is-masking (2)
              - div ["Masking"]
            - div.breadcrumb-item.is-scale (2)
              - div ["Scale"]
            - div.breadcrumb-item.is-parallax (2)
              - div ["Parallax"]
            - div.breadcrumb-item.is-zoom (2)
              - div ["zoom"]
        - a.sound_click.w-inline-block (8)
          - div.nav-toggle#menu-toggle [ix2] (7)
            - div.toggle-label-wrap (3)
              - div.toggle-label ["menu"]
              - div.toggle-label.is-active ["close"]
            - div.toggle-icon-wrap (3)
              - div.toggle-span.is-top
              - div.toggle-span.is-bottom
  - div.nav-menu (67)
    - div.height-container.is-nav-links (66)
      - div.sticky-container.is-nav-links (65)
        - div.nav-track (23)
          - div.nav-links-wrap (22)
            - nav.nav-links.w-nav-menu (21)
              - a.nav-link.w-inline-block#link1 [ix2] ×10 (2) …
        - div.nav-absolute (41)
          - div (2)
            - a.link ["Zajno"]
          - div.navbar-socials-list (38)
            - a.nav-social-link.w-inline-block (8)
              - div.nav-social-icon.w-embed [embed] (7) …
            - a.nav-social-link.w-inline-block (4)
              - div.nav-social-icon.w-embed [embed] (3) …
            - a.nav-social-link.w-inline-block ×2 (8)
              - div.nav-social-icon.w-embed [embed] (7) …
            - a.nav-social-link.w-inline-block (9)
              - div.nav-social-icon.w-embed [embed] (8) …
```

**JS-залежності (з script-map):**
`#logo-wrap` ✓, `#menu-toggle` ✓, `#breadcrumbs-wrap` ✓, `#link1` ✓, `nav-menu` ✓, `nav-track` ✓, `nav-link` ✓, `toggle-span` ✓, `eye-bg-sections` ✓, `logo-eye-dark` ✓, `logo-eye-light` ✓, `breadcrumb-item` ✓, `sound_click` ✓


## 0. Preloader

Designer: `div.loader` `f79bcaeb-7490-de89-3371-7a9243d44c43`; `.loader-wrap` `…c44`; `.loader-lottie` `…c47`; `.loader-counter` `226cf63b-052b-d903-6287-b2f868a3efd2`; `.preloader_wrap` `…c4c`; `.relative.is-preloader-2` `…c4d`. 4 Lottie: 1 коло-лоадер + 3 під смуги (desktop/tablet/mobile). Лічильник 0→100 рахується inline-скриптом (`.loader-counter`), не script.v33.

```
div.loader (18)
  - div.loader-wrap (4)
    - div.loader-lottie (2)
      - div [ix2, lottie: 641c7e09ca6cf6ccccdc7960_preloader_2.json]
    - div.loader-counter ["1"]
  - div.preloader_wrap (13)
    - div.relative.is-preloader-2 (12)
      - div.preloader_lottie.is-desktop [ix2, lottie: 64382316f72b70030c313fd3_Preloader_lottie_circles_desktop.json]
      - div.preloader_lottie.is-tablet [ix2, lottie: 6437fc52706ae77e99e8bd29_Preloader_lottie_circles_tablet.json]
      - div.preloader_lottie.is-mobile [ix2, lottie: 64468b8597034fc7063e49d3_Preloader_lottie_circles_mobile.json]
      - div.anim-ball-wrap.is-preloader (8)
        - div.flex-display.is-preloader (5)
          - div.anim-ball-border.is-preloader (2)
            - div.anim-ball.is-preloader
          - div.ball-divider.is-preloader-left
          - div.ball-bg.is-left.is-preloader-left
        - div.text-wrap.is-preloader (2)
          - div.p1.white ["UI/UX animation emphasizes the"]
```

**JS-залежності (з script-map):**
`loader-wrap` ✓, `anim-ball-wrap` ✓, `anim-ball-border` ✓, `ball-divider` ✓. `.trigger` (IX2 click, ховає `.loader-wrap`) у DOM-класах відсутній — перевірити по `data-w-id`.


## 1. Hero

Обгортка `div.nav.nav-dark` `7a61b557-4dcd-92ad-1f18-47267d8315a6`; `section.is-hero#hero` `7a61b557-4dcd-92ad-1f18-47267d8315a7`. **Усього 14 вузлів, без Lottie/відео/ембедів/IX2.** Splide-слайдер у Hero **відсутній** (див. розбіжності).

```
div.nav.nav-dark (14)
  - section.section.is-hero#hero (13)
    - div.anim-ball-sticky (7)
      - div.anim-ball-wrap (6)
        - div.ball-divider.is-left
        - div.anim-ball-border
        - div.anim-ball.is-intro#anim-ball
        - div.ball-divider.is-right
        - div.ball-bg.is-left
    - div.div-block-4 (3)
      - div.text-wrap.is-hero (2)
        - div.p1.white ["UI/UX animation emphasizes the"]
    - div.content-wrap.is-hero (2)
      - div.h3.white ["Good animation also makes the "]
```

**JS-залежності (з script-map):**
`#hero` ✓, `#anim-ball` ✓, `anim-ball-sticky` ✓, `anim-ball-wrap` ✓, `anim-ball-border` ✓, `ball-divider` ✓, `is-left` ✓, `is-right` ✓


## 2. Introduction

Обгортка `7a61b557-4dcd-92ad-1f18-47267d8315b7`; `section.is-introduction#introduction` `…8315b8`. Ембеди: `embed-path` `…8315d4`, `_tablet` `…8315d5`, `_mobile` `…8315d6` (inline `<svg>` з `#vrtx`, `#vrtx-tablet`, `#vrtx-mobile`); 6× `section-slide-video` (`…8315e3, ea, f1, 831601, 08, 0f`). Тут же живе блок "UI-слайдер" (`ui-wrap` → 2× `.ui`), який у карті віднесено до Interactive. IX2: лише `div.div-2`. Відео в слайдах — по 1 `<video>` у кожному `section-slide-video` ([video ×6]).

```
div.nav.nav-dark (98)
  - section.section.is-introduction#introduction (97)
    - div.intro-wrap (30)
      - div.div-2 [ix2] (20)
        - div.bg-visual
        - div.bg-wrap.is-bottom (5)
          - div.bg-list.is-bottom (4)
            - div.bg-list-item.is-first
            - div.bg-list-item.is-second
            - div.bg-list-item.is-third
        - div.anim-smoke
        - div.anim-shape.is-also (3)
          - div.anim-text-wrap (2)
            - div.anim-text ["It also"]
        - div.anim-shape.is-your (3)
          - div.anim-text-wrap (2)
            - div.anim-text ["your"]
        - div.anim-shape.is-controls (3)
          - div.anim-text-wrap (2)
            - div.anim-text ["controls"]
        - div.anim-shape.is-attention (3)
          - div.anim-text-wrap (2)
            - div.anim-text ["attention"]
      - div.embed-path.w-embed [embed] (3)
        - svg [svg] (2)
      - div.embed-path_tablet.w-embed [embed] (3)
        - svg [svg] (2)
      - div.embed-path_mobile.w-embed [embed] (3)
        - svg [svg] (2)
    - div.ui-wrap (66)
      - div.ui.first (34)
        - div.ui-track (32)
          - div.section-track (31)
            - div.ui-text (3)
              - div.text-wrap.is-animation (2)
                - div.h6.white ["UI/UX animation captures the m"]
            - div.section-slider.ui-slider (27)
              - div.section-slide.ui-slide (8)
                - div.section-slide-wrap (7)
                  - div.section-slide-img-wrap (4) …
                  - div.section-slide-text (2) …
              - div.section-slide.ui-slide ×2 (9)
                - div.section-slide-wrap (8)
                  - div.section-slide-img-wrap (5) …
                  - div.section-slide-text (2) …
        - div.ui-ball
      - div.ui (31)
        - div.ui-track (30)
          - div.section-track (29)
            - div.ui-text (3)
              - div.text-wrap.is-animation (2)
                - div.h6.white ["Animation encourages interacti"]
            - div.section-slider.ui-slider (25)
              - div.section-slide.ui-slide ×3 (8)
                - div.section-slide-wrap (7)
                  - div.section-slide-img-wrap (4) …
                  - div.section-slide-text (2) …
```

**JS-залежності (з script-map):**
`#introduction` ✓, `intro-wrap` ✓, `embed-path` ✓, `embed-path_tablet` ✓, `embed-path_mobile` ✓, `#vrtx` ✓, `#vrtx-tablet` ✓, `#vrtx-mobile` ✓, `anim-shape` ✓, `anim-text` ✓, `is-also` ✓, `is-controls` ✓, `is-your` ✓, `is-attention` ✓, `ui` ✓, `ui-wrap` ✓, `ui-slider` ✓, `ui-track` ✓, `ui-slide` ✓, `ui-text` ✓, `ui-ball` ✓, `section-slide-wrap` ✓, `ui-path__circle` **немає**


## 3. Interactive

Обгортка `7a61b557-4dcd-92ad-1f18-47267d831613`; `section.is-interactive#interactive` `…831614`. 3 `horizontal-item`: (1) текстова картка, (2) Matter.js `#canvas`, (3) Lottie `not_real_time` + hover-зона `#notrealtime`. `ui-slider/ui-track/ui-slide/ui-ball` тут **немає** (вони в Introduction).

```
div.nav.nav-light (25)
  - section.section.is-interactive#interactive (24)
    - div.content-wrap.is-interactive (2)
      - h2.h2 ["Interactive"]
    - div.height-section.is-interactive (21)
      - div.track-flex.is-interactive (20)
        - div.track-padding.is-interactive (19)
          - div.horizontal-item (9)
            - div.h-item-content (8)
              - div.p3-bold (2)
                - br
              - div.p3 (3)
                - span.p3-bold ["Real-time"]
                - br
              - div.p3 (2)
                - span.p3-bold ["Not real-time"]
          - div.horizontal-item (4)
            - div.h-item-content (2)
              - div.p3 ["Real-time"]
            - div.item-canvas#canvas
          - div.horizontal-item (5)
            - div.h-item-content (2)
              - div.p3 ["Not real-time"]
            - div.h-item-lottie [ix2, lottie: 64187ee0d634cb715e836e02_not_real_time.json]
            - div.h-lottie-hover#notrealtime [ix2]
```

**JS-залежності (з script-map):**
`#interactive` ✓, `#canvas` ✓, `#notrealtime` ✓, `height-section` ✓, `is-interactive` ✓, `wf-section` **немає**, `sphere-canvas` **немає**. `canvas.sphere-canvas` створюється JS; `.wf-section` Webflow не віддає.


## 4. Techniques

Обгортка `7a61b557-4dcd-92ad-1f18-47267d831639`; `section.is-techniques#techniques` `…83163a`. Це три слова ("Interface / animation / techniques") + 2 зірки + текст, 7 IX2-цілей. **Карток `lottie-card` тут немає** (нема жодного Lottie).

```
div.nav.nav-dark (15)
  - section.section.is-techniques#techniques [ix2] (14)
    - div.list-wrap.is-techniques (7)
      - div.list-item.is-techniques.first [ix2] (2)
        - div ["Interface"]
      - div.list-item.is-techniques.second [ix2] (2)
        - div ["animation"]
      - div.list-item.is-techniques.third [ix2] (2)
        - div ["techniques"]
    - div.bg-divider.is-techniques
    - div.bg-image.is-star.first [ix2]
    - div.bg-image.is-star.second [ix2]
    - div.content-wrap.is-techniques (3)
      - div.text-wrap.is-techniques [ix2] (2)
        - div.p1.white ["Every interface animation draw"]
```

**JS-залежності (з script-map):**
Прямих залежностей script.v33 немає, крім загального `.nav.nav-dark`: `nav` ✓, `nav-dark` ✓


## 5. Lessons ×8 (обгортка `section.section.is-lessons#lessons`)

Designer: wrapper `7a61b557-4dcd-92ad-1f18-47267d83164c`. Діти: 8× `section.nav.nav-color` (тип Block, tag section): easing `…83164d`, delay `…83170d`, fade `…831768`, morph `…8317a6`, masking `…8317e4`, dimension `…831822`, parallax `…831860`, zoom `…83189e`; потім `div.resources-clouds-list` `…8318dc` (4 хмари). Уроки НЕ мають окремої `section.is-lessons` кожен — це одна секція-обгортка, а кожен урок = `section.nav.nav-color#<slug>` > `div.lesson.is-<slug>`.

### Повне дерево першого уроку (#easing)

```
section.nav.nav-color#easing (239)
  - div.lesson.is-easing (238)
    - div.lesson-list.is-easing (209)
      - div.lesson-item (64)
        - div.hero-animation (4)
          - div.bg-image.is-star-xs.is-left
          - div.hero-visual [ix2, lottie: 6437f51664f926cef5e65c8a_1_easing_visual.json]
          - div.bg-image.is-star-xs.is-right
        - div.hero-content (7)
          - div.flex-display.is-hero (4)
            - div.label-1.is-lesson ["1"]
            - div.hero-title (2)
              - h4.h4 ["THE BASICS OF EASING"]
          - div.text-wrap.is-hero-desc (2)
            - div.p2 ["In nature, the speed of moveme"]
        - div.splide-container (52)
          - div.hero_right (47)
            - div.splide.splide2 (45)
              - div.splide__track (27)
                - div.splide__list (26)
                  - div.splide__slide ×5 (5)
                    - div.slide-inner-label ["Linear"]
                    - div.slide-lottie.active [ix2, lottie: 63dbc8b62b483f54221ad660_linear.json]
                    - div.slide-lottie.not-active [ix2, lottie: 63dbc8b62b483f54221ad660_linear.json]
                    - div.text1 ["With linear easing, the object"]
              - div.splide__arrows (17)
                - div.embed.w-embed [embed] (8)
                  - button.splide__arrow.splide__arrow--prev (7)
                    - svg [svg] (6)
                - div.embed.w-embed [embed] (8)
                  - button.splide__arrow.splide__arrow--next (7)
                    - svg [svg] (6)
            - div.divider
          - div.hero_left (4)
            - div.hero_content (3)
              - div.hero_wrap (2)
                - div.hero_text ["With linear easing, the object"]
      - div.lesson-item.is-examples [ix2] (10)
        - div.sticky-container.is-examples (9)
          - div.imgs-wrap.is-anim-stars (6)
            - div.star-vector.odd
            - div.star-vector.even
            - div.star-vector.odd
            - div.star-vector.even
            - div.star-vector.odd
          - div.scrolling-text.is-lessons (2)
            - div.flex-shrink-none ["Let's look at an example"]
      - div.nav-inner.nav-dark [ix2] (74)
        - div.lesson-item.is-examples-2 (73)
          - div.sticky-container.is-examples-2 (72)
            - div.example-video-padding (44)
              - div.example-videos-desktop (43)
                - div.example-video-1.w-embed [embed] (7)
                  - video.is-desktop [video] (2)
                    - source
                  - video.is-tablet [video] (2)
                    - source
                  - video.is-mobile [video] (2)
                    - source
                - div.example-video-2.w-embed [embed] (7)
                  - video.is-desktop [video] (2)
                    - source
                  - video.is-tablet [video] (2)
                    - source
                  - video.is-mobile [video] (2)
                    - source
                - div.example-video-3.w-embed [embed] (7)
                  - video.is-desktop [video] (2)
                    - source
                  - video.is-tablet [video] (2)
                    - source
                  - video.is-mobile [video] (2)
                    - source
                - div.example-video-4.w-embed [embed] (7)
                  - video.is-desktop [video] (2)
                    - source
                  - video.is-tablet [video] (2)
                    - source
                  - video.is-mobile [video] (2)
                    - source
                - div.example-video-5.w-embed [embed] (7)
                  - video.is-desktop [video] (2)
                    - source
                  - video.is-tablet [video] (2)
                    - source
                  - video.is-mobile [video] (2)
                    - source
                - div.example-video-6.w-embed [embed] (7)
                  - video.is-desktop [video] (2)
                    - source
                  - video.is-tablet [video] (2)
                    - source
                  - video.is-mobile [video] (2)
                    - source
            - div.example-progress-bar (27)
              - div.progress-bar-list (24)
                - div.progress-bar-item (8)
                  - div.progress-bar_title-1 (2)
                    - div.progress-bar-title ["Missing easing & delay"]
                  - div.progress-bar_divider-line_hidden
                  - div.progress-bar_divider-wrap_small (2)
                    - div.progress-bar_divider-line_small [ix2]
                  - div.progress-bar_divider-wrap_large (2)
                    - div.progress-bar_divider-line_large [ix2]
                - div.progress-bar-item (8)
                  - div.progress-bar_title-2 (2)
                    - div.progress-bar-title ["Correct easing"]
                  - div.progress-bar_divider-line_hidden
                  - div.progress-bar_divider-wrap_small (2)
                    - div.progress-bar_divider-line_small [ix2]
                  - div.progress-bar_divider-wrap_large (2)
                    - div.progress-bar_divider-line_large [ix2]
                - div.progress-bar-item (7)
                  - div.progress-bar_title-3 (2)
                    - div.progress-bar-title ["Correct delay & animation"]
                  - div.progress-bar_divider-line_hidden
                  - div.progress-bar_divider-wrap_small (2)
                    - div.progress-bar_divider-line_small [ix2]
                  - div.progress-bar_divider-line_hidden
              - div.progress-bar_line-wrap (2)
                - div.progress-bar_line-active
      - div.lesson-item.is-implementation [ix2] (60)
        - div.title-wrap.is-implementation (2)
          - h3.h3 ["Implementation examples"]
        - div.sticky-container.is-implementation (56)
          - div.list-wrap.is-implementation (55)
            - a.card-link.w-inline-block (18)
              - div.card-video-item (5)
                - div.card-video.is-implementation.w-embed [embed] (3)
                  - video [video] (2)
                    - source
                - img.card-video-img
              - div.flex-display.is-implementation (12)
                - div.text-wrap.is-implementation (2)
                  - div.p3 ["Ease-in/ease-out can also be a"]
                - div.btn-link.is-implementation (9)
                  - div ["View"]
                  - div.btn-link-icon.w-embed [embed] (7)
                    - svg [svg] (6)
            - a.card-link.is-second.w-inline-block (18)
              - div.card-video-item (5)
                - div.card-video.is-implementation.w-embed [embed] (3)
                  - video [video] (2)
                    - source
                - img.card-video-img
              - div.flex-display.is-implementation (12)
                - div.text-wrap.is-implementation (2)
                  - div.p3 ["Wonder at how smoothly our tex"]
                - div.btn-link.is-implementation (9)
                  - div ["View"]
                  - div.btn-link-icon.w-embed [embed] (7)
                    - svg [svg] (6)
            - a.card-link.is-third.w-inline-block (18)
              - div.card-video-item (5)
                - div.card-video.is-implementation.w-embed [embed] (3)
                  - video [video] (2)
                    - source
                - img.card-video-img
              - div.flex-display.is-implementation (12)
                - div.text-wrap.is-implementation (2)
                  - div.p3 ["Here we see how the guide cont"]
                - div.btn-link.is-implementation (9)
                  - div ["View"]
                  - div.btn-link-icon.w-embed [embed] (7)
                    - svg [svg] (6)
        - div.overlay-bg [ix2]
    - div.classic-anim_wrap [ix2] (28)
      - div.classic-anim_musk (27)
        - div.classic-anim_sideimg.is-left.is-easing
        - div.classic-anim_container.is-easing (24)
          - div.classic-anim_content (9)
            - h2.h2-secondary ["An example from classic animat"]
            - div.a-lesson-list (7)
              - div.a-lesson-item (6)
                - div.a-lesson-item_overflow-hidden (5)
                  - div.a-lesson-video.w-embed [embed] (3)
                    - video [video] (2)
                      - source
                  - img.a-lesson-img
          - div.a-lesson-item_heigh.is-easing (14)
            - div.a-lesson-item_sticky (13)
              - div.a-lesson-item (4)
                - div.a-lesson-text-wrap (3)
                  - div.p3-bold ["Slow in and slow out"]
                  - div.p3 ["Think about how a car starts a"]
              - div.a-lesson-item.margin-40 (8)
                - div.a-lesson-item_overflow-hidden (5)
                  - div.a-lesson-video.w-embed [embed] (3)
                    - video [video] (2)
                      - source
                  - img.a-lesson-img
                - div.a-lesson-text-wrap (2)
                  - div.p3 ["In animation, this effect is a"]
        - div.classic-anim_sideimg.is-right.is-easing
```

### Відмінності решти

| # | id | Вузлів | `lesson-list` діти | hero-visual (Lottie / відео) | Splide-слайди | Example-відео (`example-video-N`) | Progress-bar | `classic-anim_wrap` | Усього: Lottie / video / embed / IX2 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | easing | 239 | li+li.is-examples+nav-inner+li.is-implementation | Lottie 6437f51664f926cef5e65c8a_1_easing_visual.json | 5 | 6 | 3 | так | 11 / 23 / 16 / 21 |
| 2 | delay | 107 | li+li.is-implementation | Lottie 6437e56d2465d377269a6362_delay.json | — | — | — | так | 1 / 4 / 8 / 4 |
| 3 | fade | 74 | li+li.is-implementation | Lottie 6437f579f6d8befce71c0821_Fade_in_out.json | — | — | — | — | 1 / 3 / 6 / 2 |
| 4 | morph | 74 | li+li.is-implementation | Lottie 6437f60c402bcd9822422ade_Morph.json | — | — | — | — | 1 / 3 / 6 / 2 |
| 5 | masking | 74 | li+li.is-implementation | Lottie 6437f633b6fe4837689c3665_Masking.json | — | — | — | — | 1 / 3 / 6 / 2 |
| 6 | dimension | 77 | li+li.is-implementation | embed → video dimension_hevc.mov | — | — | — | — | 0 / 4 / 7 / 1 |
| 7 | parallax | 74 | li+li.is-implementation | Lottie 6437f673402bcd3d37422ddc_Parallax.json | — | — | — | — | 1 / 3 / 6 / 2 |
| 8 | zoom | 74 | li+li.is-implementation.is-last | Lottie 6437f6ba8c5a77ad18dc8d7c_8_zoom.json | — | — | — | — | 1 / 3 / 6 / 2 |

Загальне для 2–8: `lesson-list` має лише `lesson-item` (hero) + `lesson-item.is-implementation` (3 `card-link` з відео+зображенням); немає `splide`, `is-examples`, `nav-inner.nav-dark`, example-відео, progress-bar. Тільки #easing та #delay мають `classic-anim_wrap` (+ IX2, + `::before` шум із main-css). Урок #dimension: hero-visual — ембед з `<video>` (`dimension_hevc.mov`), Lottie немає. Останній (#zoom) має `lesson-item.is-implementation.is-last`. `hero_text`/`splide2`/`text1` (JS-свап тексту) є **лише** в #easing.

Хмари в кінці: `div.resources-clouds-list` (4× `resources-cloud-item first|second|third|fourth`, без IX2).

**JS-залежності (з script-map):** `is-lessons` ✓, `nav` ✓, `nav-color` ✓, `nav-inner` ✓, `splide2` ✓, `hero_text` ✓, `resources-cloud-item` ✓. Колір уроку JS бере з `getComputedStyle(.breadcrumb-item)` (див. Navigation).


## 6. Resources

Обгортка/секція `section.nav.nav-light#resources` `7a61b557-4dcd-92ad-1f18-47267d8318e1` (Block, tag section); `div.resources` (Section, tag div) `…8318e2`. CMS: 2 `resources-images__list` (10+4 айтеми) і 2 `resources-list` (по 14 айтемів: `.resources-item`) — усього 28 `w-dyn-item` у DOM (CMS-шаблони `Courses`/`Resources`; назву колекції в HTML не видно). 3 стрілки (`resources-arrow-icon`, ембед SVG) + 14 `btn-link-icon` + інше SVG. IX2: тільки `div.resources`.

```
section.nav.nav-light#resources (288)
  - div.resources [ix2] (287)
    - div.resources-track (286)
      - div.resources-main (20)
        - div.resources-titles (19)
          - div.arrow-title-wrap ×3 (6)
            - div ["Useful"]
            - div.resources-arrow (4)
              - div.resources-arrow-icon.w-embed [embed] (3)
                - svg [svg] (2) …
      - div.resources-student (2)
        - div.text-block-3 ["You are always a student, neve"]
      - div.resources-full (263)
        - div.resources-wrapp (261)
          - div.resources-images (33)
            - div.resources-images__list.w-dyn-list [cms] (22)
              - div.w-dyn-items (21)
                - div.resources-images__item.w-dyn-item [cms] ×10 (2) …
            - div.resources-images__list.w-dyn-list [cms] (10)
              - div.w-dyn-items (9)
                - div.resources-images__item.w-dyn-item [cms] ×4 (2) …
          - div.resources-content (227)
            - div.resources-header (11)
              - div.resources-header__item ×2 (5)
                - div.resources-header__text (2) …
                - div.resources-header__count (2) …
            - div.resources-lists (215)
              - div.resources-list.w-dyn-list [cms] (152)
                - div.w-dyn-items (151) …
              - div.resources-list.w-dyn-list [cms] (62)
                - div.w-dyn-items (61) …
        - div.resources-overlay
```

**JS-залежності (з script-map):**
`#resources` ✓, `resources` ✓, `resources-track` ✓, `resources-arrow` ✓, `resources-lists` ✓, `resources-list` ✓, `resources-header` ✓, `resources-header__item` ✓, `resources-item` ✓, `resources-item__name` ✓, `resources-images__list` ✓, `resources-images__item` ✓, `resources-overlay` ✓


## 7. Footer

Обгортка `div.nav.nav-dark` `f5e85485-6c83-456f-70b1-376f3e07e47c`; `div.footer` `…e47d`. Ембеди: 10× `f-icon is-arrow` + 5× `f-icon is-social` (SVG). IX2: `div.footer` (одна ціль; scroll-progress для `footer-cloud-item` через `82669f55-…`).

```
div.nav.nav-dark (115)
  - div.footer [ix2] (114)
    - div.footer-clouds-list (5)
      - div.footer-cloud-item.is-first
      - div.footer-cloud-item.is-second
      - div.footer-cloud-item.is-third
      - div.footer-cloud-item.is-fourth
    - div.footer-content (108)
      - div.footer-list (101)
        - div.footer-item._1 (4)
          - h5.h5 (3)
            - br ×2
        - div.flex-display.is-footer (96)
          - div.footer-item._2 (54)
            - div.f-navigation (53)
              - div.f-label ["N."]
              - div.f-navigation-list.is-menu (51) …
          - div.footer-item (41)
            - div.f-navigation (40)
              - div.f-label.mobile-hidden ["S."]
              - div.f-navigation-list.is-social (38) …
      - div.footer-info (6)
        - div.f-info-container (5)
          - div.zajno-label.is-desktop (3)
            - a.zajno-link (2)
              - span.text-span ["Zajno"]
          - div ["© 2024. All rights reserved."]
```

**JS-залежності (з script-map):**
прямих залежностей script.v33 немає, крім `.nav.nav-dark`; `footer-cloud-item` ×4 — цілі IX2: `footer-cloud-item` ✓, `footer` ✓


## Sound button (поза нумерацією карти)

Designer: `div.fixed-bottom` `a3fe06d1-2cc8-4c3d-e0db-71c28ca84a01` > безіменний div `…a02` > `.sound-btn-wrap` `…a03`; ембеди `sound-btn-icon` `…a05`, `sound-btn-mute` `…a06`. 13 `<audio>` після скриптів (див. нижче).

```
div.fixed-bottom (14)
  - div (13)
    - div.sound-btn-wrap (12)
      - div.sound-icon-wrap (11)
        - div.sound-btn-icon.w-embed [embed] (3)
          - svg [svg] (2)
        - div.sound-btn-mute.w-embed [embed] (7)
          - svg [svg] (6)
```

**JS-залежності (з script-map):**
`sound-btn-wrap` ✓, `sound-icon-wrap` ✓, `sound-btn-mute` ✓, `sound_click` ✓


## Поза картою

- `div.main-css.w-embed` (HtmlEmbed `27a12260-ea1b-f958-9a7f-b0e7acbbbf68`) — глобальний `<style>`, див. `docs/main-css.md`.
- 13× `<audio>` (`#audio`, `#audioClick2`, `#audioHover…#audioHover11`) і 20 `<script>` у кінці body (Page footer code: GSAP 3.10.4/3.11.4 + ScrollTrigger/MotionPath/CustomEase/Observer, Lenis `@latest`, Splide 2.4.21, ifvisible, Matter 0.18.0, `script.v33.min.js`, finsweet autovideo, inline: lottie resize, лічильник лоадера, Splide init, `history.replaceState`, passive touch, аудіо, gtag sound). Site head custom code: preconnect assets + Twitter pixel `ocd0n`; site footer і page head — порожні.
- Hover-звуки прив'язані до `#link1…#link10` і `#notrealtime`: усі 11 id є в DOM.

## Підсумкова таблиця

Вузлів = елементів DOM у піддереві (включно з обгорткою). Embeds = `.w-embed` (у Designer їх 98 `HtmlEmbed` на сторінці; різниця до 110 в HTML — повторення CMS-шаблонів). IX2 = елементи з `data-w-id`.

| Секція | Вузлів | Lottie | Відео | Embeds | IX2 |
|---|---|---|---|---|---|
| main-css | 2 | 0 | 0 | 1 | 0 |
| Navigation | 109 | 13 | 0 | 5 | 24 |
| 0 Preloader | 18 | 4 | 0 | 0 | 4 |
| 1 Hero | 14 | 0 | 0 | 0 | 0 |
| 2 Introduction | 98 | 0 | 6 | 9 | 1 |
| 3 Interactive | 25 | 1 | 0 | 0 | 2 |
| 4 Techniques | 15 | 0 | 0 | 0 | 7 |
| 5.1 Lesson easing | 239 | 11 | 23 | 16 | 21 |
| 5.2 Lesson delay | 107 | 1 | 4 | 8 | 4 |
| 5.3 Lesson fade | 74 | 1 | 3 | 6 | 2 |
| 5.4 Lesson morph | 74 | 1 | 3 | 6 | 2 |
| 5.5 Lesson masking | 74 | 1 | 3 | 6 | 2 |
| 5.6 Lesson dimension | 77 | 0 | 4 | 7 | 1 |
| 5.7 Lesson parallax | 74 | 1 | 3 | 6 | 2 |
| 5.8 Lesson zoom | 74 | 1 | 3 | 6 | 2 |
| 5 Resources-clouds | 5 | 0 | 0 | 0 | 0 |
| 6 Resources | 288 | 0 | 0 | 17 | 1 |
| 7 Footer | 115 | 0 | 0 | 15 | 1 |
| Sound button | 14 | 0 | 0 | 2 | 0 |
| **Разом (body 1545 мінус скрипти/аудіо/body)** | 1496 | 35 | 52 | 110 | 76 |

Lessons разом (5.1–5.8 + хмари + обгортка): 799 вузлів, 17 Lottie, 46 відео, 61 embeds, 36 IX2.

## Розбіжності з картою CONVENTIONS.md

1. Hero: Splide `splide2` і `hero_text` — не в Hero, а в уроці #easing (`div.splide-container > div.hero_right > div.splide.splide2`).
2. Interactive: `ui-slider/ui-track/ui-slide/ui-ball` — в Introduction (`ui-wrap`), а в Interactive — `horizontal-item` ×3, `#canvas`, Lottie `not_real_time`.
3. Techniques: карток `lottie-card` немає; `lottie-card` — 10 hover-Lottie пунктів меню в Navigation.
4. Lessons: одна `section.section.is-lessons#lessons` з 8 вкладеними `section.nav.nav-color#slug`, а не 8 `section.is-lessons`. Крихта для dimension має клас `is-scale`.
5. Navigation (`div.navigation.w-nav`, 109 вузлів, 13 Lottie) у карті відсутній.
6. Класи зі script-map, яких немає в DOM: `ui-path__circle`, `wf-section`, `section-slide-speed` (мертвий код), `sphere-canvas` (створюється JS).
