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
