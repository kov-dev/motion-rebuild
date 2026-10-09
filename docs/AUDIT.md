# Аудит оригіналу Motion — факти (2026-10-09)

Джерела: Webflow MCP (оригінал), опублікований `https://motion.zajno.com/`
(`reference/live-home-2026-10-09.html`), `webflow.bc78bd593.js`,
`reference/script.v33.min.js`.

## Сайт

- Workspace Zajno, таймзона Europe/Kiev, створений 2022-11-28, опублікований
  востаннє 2024-02-13, `lastUpdated` 2026-10-09 (відкрили в Designer).
- Сторінки: Home `/`, Styleguide `/styleguide`, 3 CMS templates. Усі
  `canBranch: true`, але page branching — Enterprise-фіча, не покладаємось.
- Компонентів **0**, змінних **2** (`White`, `Black`), класів **~428**
  (список у виводі `get_styles`; перелік буде в `docs/classes-original.md`
  на етапі аудиту).
- Смуги: Desktop (base), Tablet ≤991, Mobile L ≤767, Mobile ≤479.
- Агент-інструкцій на сайті немає. IX3-інтеракцій **0**.

## Опублікована сторінка Home

| Метрика | Значення |
|---|---|
| HTML | 147 KB |
| `webflow.js` | 681 KB, з них IX2 JSON 153 KB |
| CSS | `motion-9888c6.webflow.05a3c92fc.min.css` |
| `data-w-id` (елементи з IX2) | 76 |
| Lottie | 35 вставок, 30 унікальних файлів (список `reference/lottie-urls.txt`) |
| `<video>` | 52 |
| `<img>` | 41 |
| inline `<svg>` | 69 |
| `w-embed` | 110 |

Найважчі Lottie: `not_real_time.json` **681 KB**, `fade` 68 KB, `morph` 64 KB,
`masking` 58 KB, `intro_menu` 42 KB, прелоадер ×3 по 39 KB (desktop/tablet/mobile —
однакові за вагою, ймовірно дублі).

## Скрипти на Home (порядок завантаження)

1. gtag `G-CP1VPL4VKN`
2. jQuery 3.5.1 (Webflow)
3. `webflow.js` (IX2 runtime + Lottie + Splide-незалежний)
4. GSAP **3.10.4** core, ScrollTrigger 3.10.4, **MotionPathPlugin 3.11.4**, CustomEase 3.10.4, **Observer 3.11.4** — дві версії впереміш
5. Lenis `studio-freight/lenis@latest` — **не пінована**
6. Splide 2.4.21
7. `ifvisible.min.js` (idle-детектор, 3 KB) — для «idle»-похитування `.ui-slide`
8. Matter.js 0.18.0
9. `script.v33.min.js` (25 KB) — основна логіка
10. Finsweet `attributes-autovideo@1`
11. інлайн: lottie resize on resize; loader counter 0→100 за 4 с (IntersectionObserver + setInterval 50 мс); Splide init + swap тексту `.hero_text` з активного слайду; «clear anchor» (`history.replaceState` на кожен клік по `<a>`); passive touch listeners для jQuery; 13 `<audio>` + обробники hover по `#link1…#link10`, `#notrealtime`; sound toggle + gtag `sound_on/off`.

Site head: preconnect до assets.website-files.com, Twitter pixel `ocd0n`. Site footer порожній.

## `script.v33.min.js` — що робить (перший розбір)

- `gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, CustomEase, Observer)`, усе на `window.load`.
- Детект мобільного по UA; на мобільному `ScrollTrigger.normalizeScroll`, на десктопі Lenis (duration 2, custom easing) + `ScrollTrigger.scrollerProxy(document.body)` + `gsap.ticker`.
- `ifvisible` idle 4 с → нескінченний timeline похитування `.ui-slide`.
- Секція **interactive**: `.ui-slider / .ui-track / .ui-ball / .ui-slide / .ui-text / .ui-path__circle` — найбільший шматок, 11+9 звернень до `.ui-track`/`.ui-ball`.
- **Intro**: `.embed-path`, `.embed-path_tablet`, `.embed-path_mobile`, `.intro-wrap`, `.breadcrumbs-wrap .breadcrumb-item` — MotionPath по SVG.
- **Hero**: `.is-hero .anim-ball-wrap`, `.anim-ball-border`, `.ball-divider`, `.sphere-canvas` (Matter.js).
- **Nav**: `.nav`, `.nav.nav-color`, `.nav-inner`, `.nav-link`, `.nav-menu`, `.nav-track`, `.logo-eye-dark/.logo-eye-light`, `.eye-bg-sections`, `.toggle-span` — перемикання кольору навбара за секціями.
- **Resources**: `.resources*` (track, header, item, images, lists, arrow) — горизонтальний скрол/лічильник.
- **Interactive (ще)**: `.section-slide-wrap` (слайди з відео всередині `.ui`), `.height-section.is-interactive` (горизонтальна секція, тут же `#canvas` сфери). `.section-slide-speed` — мертвий код, у DOM немає.
- **Introduction (тексти)**: `.anim-shape.is-also/.is-controls/.is-your/.is-attention` → `.anim-text` — чотири рядки, що відкриваються по ходу кульки.
- **Sound**: `.sound-btn-mute`, `.sound-icon-wrap`.
- Разом залежить від **49 класів + 12 ID** — повний список, карта блоків A–K і вердикти (код / IX3 / прибрати) у [script-map.md](script-map.md). Розшифрований код — `reference/script.v33.src.js` (2026-10-09, з мініфікованого; немініфікованого в студії не знайшлось).
- jQuery використовується (16 `$(`).

## IX2 (legacy interactions)

112 подій / 26 action lists / 15 continuous (scroll-progress). Розподіл:
SCROLLING_IN_VIEW 37, MOUSE_OVER 31, MOUSE_OUT 31, MOUSE_CLICK 5,
MOUSE_SECOND_CLICK 3, SCROLL_INTO_VIEW 2, SCROLL_OUT_OF_VIEW 2, PAGE_START 1.
Деталі по кожній — [ix2-summary.md](ix2-summary.md). Основні групи:

- hover на `lottie-card` (techniques) — Lottie play 1→99 / назад;
- hover на nav-посиланнях / lesson-айтемах;
- click `.trigger` → ховає `.loader-wrap`; click toggle → `.nav-menu` + бургер `.toggle-span`;
- scroll-progress: `.footer-cloud-item.is-first…fourth`, `.resources-overlay` bg, хмари в resources, паралакси в lessons;
- scroll into/out `.sound-btn-wrap` (ховати над футером);
- PAGE_START — прелоадер.

## CMS

- **Lessons** (8): `order` (PlainText!), `description`, `video-link` (Link), `video-link-2` (VideoLink), name, slug. Відео є лише в «The basics of easing». Порядок: easing, delay, fade, morph, masking, dimension, parallax, zoom.
- **Courses** (10) і **Resources** (4): однакова схема — `course-image`, `name-in-list` (PlainText, **min=max=62 символи** — костиль під фіксовану ширину), `link`, name, slug. Картинки лежать у чужому сайті `63d28a87a842c31fc5041dff` (uploads-ssl) — при перенесенні перезалити.
- Шаблони колекцій мають порожні SEO.

## Відомі костилі (кандидати на виправлення)

1. Дві версії GSAP; Lenis без версії; `scrollerProxy` на body замість нативної інтеграції Lenis.
2. Логіка розкидана: IX2 + 4 інлайн-скрипти + зовнішній файл + 110 ембедів.
3. Прив'язка JS до класів (49) → будь-яке перейменування ламає анімацію.
4. 13 `<audio>` у футер-коді, 11 окремих обробників замість одного делегованого.
5. `history.replaceState` на кожен клік по будь-якому `<a>`.
6. `window.onresize` клікає «next» у Splide на десктопі (хак для перерахунку).
7. Lottie-прелоадер у трьох копіях під смуги; `not_real_time` 681 KB.
8. 8 lesson-секцій — ручні копії без компонента; `order` як текст.
9. `name-in-list` з жорстким 62-символьним лімітом замість CSS-обрізання.
10. Картинки CMS з іншого сайту.

## Lighthouse лайву — базова точка (2026-10-09, сесія 4)

Lighthouse 12.8.2 з CLI (`npx lighthouse@12`), headless Google Chrome, по 3
прогони на кожен режим. В таблиці медіана, повні звіти медіанних прогонів
лежать у `reference/lighthouse/live-{desktop,mobile}-2026-10-09.json.gz`
(відкриваються в https://googlechrome.github.io/lighthouse/viewer/).
Desktop — `--preset=desktop` (RTT 40 мс, 10 Мбіт/с, CPU ×1). Mobile — дефолт
(Moto G Power, RTT 150 мс, ~1.6 Мбіт/с, CPU ×4). Обидва з simulate-тротлінгом.

| | Desktop | Mobile |
|---|---|---|
| **Performance** (3 прогони) | **94** (90 / 95 / 94) | **93** (93 / 94 / 93) |
| Accessibility | 86 | 86 |
| Best Practices | 78 | 79 |
| SEO | 100 | 100 |
| FCP | 0.6 с | 1.9 с |
| LCP | 1.1 с | 2.2 с |
| TBT | 0 мс | 27 мс |
| CLS | 0 | 0.012 |
| Speed Index | 2.1 с | 5.4 с |
| TTI | 1.1 с | 7.0 с |
| Вага сторінки | 6.9 MB, 132 запити | 6.8 MB, 128 запитів |
| DOM | 3 087 елементів | 3 087 |
| Main thread / JS bootup | 1.0 с / 0.4 с | 3.9 с / 1.9 с |

**Чому високий бал оманливий.** LCP-елемент — текст hero
`section#hero .text-wrap .p1`. Lighthouse рахує його, щойно він з'являється в
DOM під прелоадером, а прелоадер триває 9 с на мобайлі й 15 с на десктопі
(лічильник іде на таймері, див. recordings.md). Lighthouse цього не бачить.
Реальна «перша корисна взаємодія» = кінець прелоадера. Тому порівнювати
копію з лайвом треба і за Lighthouse, і за часом до кінця прелоадера на записі.

**Вага за типами (desktop):** Media 4.9 MB · Image 1.1 MB · Script 0.5 MB ·
Font 179 KB · XHR (Lottie JSON) 145 KB · CSS 19 KB · HTML 31 KB.

**Найважче на старті, хоча воно далеко під фолдом:**

| KB | Що | Де |
|---|---|---|
| 1 881 | `slider/optimise/3_House_og_VP9.webm` | UI-слайдер Intro |
| 1 139 | `examples/example-1.mp4` | урок easing, «Implementation examples» |
| 580 | `slider/optimise/2_Game-hevc_VP9.webm` | UI-слайдер Intro |
| 386–547 | `examples/tablet/example-1-tablet.mp4` (**двічі**) | те саме, tablet-версія |
| 261 | `Lessons/lesson-6/dimension_VP9.webm` | урок dimension |
| 168–232 | `examples/mobile/example-1-mobile.mp4` | те саме, mobile-версія |
| 176 | gtag.js | GA4 |
| 168 | webflow.js (IX2) | — |
| 115 + 106 | PNG `1_CAR_CURVE_DEMO_FULL`, `1_CAR_EASING_COMPARISON` | урок easing |
| 60 | `not_real_time.json` (Lottie) | Interactive |

Головні висновки для перезбірки:
1. **Відео грузяться одразу, і всі три версії разом (desktop, tablet, mobile).**
   Це ~4.9 MB на першому завантаженні. У перезбірці: `preload="none"` + постер,
   підвантаження через IntersectionObserver, одна версія на брейкпоінт
   (`<source media>` або вибір у JS). Виграш ~4.5 MB.
2. **webflow.js (IX2) — найдорожчий скрипт на мобайлі:** 2.1 с виконання, з
   них 1.4 с скриптинг. Причини: 1 545 вузлів і багато IX2-тригерів. Перехід на
   IX3 + один модуль GSAP має прибрати більшу частину.
3. Рендер блокує CSS Webflow, але це неминуче: на мобайлі 0.9 с, на десктопі 0.3 с.
4. Картинки: PNG → WebP/AVIF дає ~630 KB економії (`modern-image-formats`).
   У 31 ресурсу короткий кеш, найбільше на `cdn.zajno.com`, ~3.5 MB.
   Перевірити, чи CDN студії віддає `Cache-Control`.
5. Легасі: jQuery 3.5.1 (Webflow), 137 KB невикористаного JS, пасивних
   слухачів скролу немає (`uses-passive-event-listeners`). Це Lenis/script.v33.
6. **Accessibility 86:** у `<html>` немає `lang`, у 7 посилань (mobile) немає
   імені (іконки соцмереж/бургер), порушено порядок заголовків (4), 2 контрасти.
   Виправити в перезбірці, бо візуально це нічого не міняє.
7. **Best Practices 78:** 7 сторонніх cookies (Twitter pixel, GA), issues у
   DevTools.

Цілі для копії: Performance ≥ лайву (93/94). Вага на старті < 2 MB, на мобайлі
TTI < 4 с, JS bootup < 1 с, Accessibility ≥ 95. Час прелоадера — 1:1 з лайвом
(це дизайн, а не продуктивність).
