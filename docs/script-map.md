# Карта `script.v33` — що робить, від чого залежить, куди йде в перезбірці

Джерело: [reference/script.v33.src.js](../reference/script.v33.src.js) —
розшифрована з мініфікованого (немініфікованого в студії не знайшлось).
Поведінка 1:1, перейменовано змінні, додано коментарі, баги позначено `NOTE:`.
Літери блоків (A–K) збігаються з коментарями у файлі.

## Зведення

| Блок | Що робить | Секція | Куди в перезбірці |
|---|---|---|---|
| A | Детект mobile/Firefox, scrollTo(0,0) через 100 мс, Lenis (десктоп) або `normalizeScroll` (мобайл), `scrollerProxy` на body | глобально | **Код**: Lenis пінований, інтеграція без scrollerProxy, `matchMedia` замість одноразового `innerWidth` |
| B | Idle 4 с (`ifvisible`) → нескінченне похитування `.ui-slide` ±1.5% | Introduction (UI-слайдер) | **Код** (3 рядки), `ifvisible` замінити на власний idle-таймер або `Observer` |
| C | Кулька hero → падіння → MotionPath по SVG (`#vrtx*`) у 4 сегменти, кожен відкриває рядок інтро-тексту; на десктопі фінальний bounce у перший слайд | Hero + Introduction | **Код** (MotionPath, обчислення координат) |
| D | 2 × `.ui`: pin, трек їде вліво, слайди розширюються 25→75vw, відео відкривається `clip-path: circle()`, передача кульки `.ui-ball` між блоками | Introduction (UI-слайдер) | **Код** (найскладніший блок, ~350 рядків) |
| E | Resources: pin + 3 фази (стрілки → трек → списки), синхронізація табів хедера; hover на айтемах — стек із 3 картинок з поворотом (jQuery) | Resources | pin/scrub — **код**; hover-стек — **код** (є стан, jQuery прибрати); `active` на першому айтемі — **CSS/клас у Designer** |
| F | Matter.js: 35 куль у невидимій круглій клітці з 32 статичних пегів, відштовхування від курсора, drag, гравітація за напрямком скролу, звук зіткнень через Web Audio з панорамою | Interactive («Real-time» картка) | **Код**, окремий модуль `sphere.js`, lazy-init при першому вході |
| G | `.height-section.is-interactive`: pin + горизонтальний зсув на `scrollWidth − vw`; тригер `once` → `initSphere()` | Interactive | **Код** (або IX3 scroll-scrub, якщо зсув задати в vw — перевірити) |
| H | Кнопки швидкості відео `.section-slide-speed[data-speed]` | — | **Мертвий код**, таких елементів у DOM немає. Не переносити |
| I | Колір навбара/саунд-кнопки за обгортками `.nav.nav-dark/light/color` + `.nav-inner`; для уроків колір береться з `getComputedStyle` breadcrumb-айтема | усі | **Код**, спростити (див. нижче) |
| J | Бургер: lock scroll + темна схема при відкритті; `.nav-link` закриває меню; wheel у меню скролить `.nav-track` горизонтально; `#link1` скидає x кульки | Nav | lock/scheme — **код**; саме відкриття/закриття меню — IX2 → **IX3** |
| K | `pageshow` persisted → reload; `beforeunload` → fade body + scrollTo(0,0) | глобально | reload лишити (bfcache ламає pin-стани); fade — **прибрати або виправити** (кидає помилку, якщо `activeElement` без href) |

## DOM-залежності (ID та класи, які код шукає)

ID: `#anim-ball`, `#hero`, `#introduction`, `#resources`, `#canvas`, `#vrtx`,
`#vrtx-tablet`, `#vrtx-mobile`, `#logo-wrap`, `#menu-toggle`,
`#breadcrumbs-wrap`, `#link1`.

Класи (49), по блоках:

- **C/D**: `.is-hero .anim-ball-wrap`, `.anim-ball-sticky`, `.anim-ball-border`,
  `.ball-divider.is-left/.is-right`, `.is-introduction`, `.intro-wrap`,
  `.embed-path` / `_tablet` / `_mobile`, `.anim-shape.is-also/.is-controls/.is-your/.is-attention` → `.anim-text`,
  `.ui`, `.ui.first`, `.ui-wrap`, `.ui-slider`, `.ui-track`, `.ui-slide`,
  `.ui-text`, `.ui-ball`, `.section-slide-wrap` (+ `video`), `.ui-path__circle` (**немає в DOM**).
- **E**: `.is-lessons` (тригер ліниво створити pin), `.resources`, `.resources-track`,
  `.resources-arrow`, `.resources-lists`, `.resources-list`, `.resources-header`,
  `.resources-header__item`, `.resources-item`, `.resources-item__name`,
  `.resources-images__list`, `.resources-images__item`.
- **F/G**: `.is-interactive.wf-section`, `.height-section.is-interactive`,
  `#canvas` → `canvas.sphere-canvas`, `.sound-icon-wrap`, `.sound-btn-mute.is-active`.
- **I/J**: `.nav`, `.nav-dark`, `.nav-light`, `.nav-color`, `.nav-inner`,
  `.logo-eye-dark`, `.logo-eye-light`, `.toggle-span`, `.eye-bg-sections`,
  `.breadcrumbs-wrap`, `.breadcrumb-item`, `.nav-menu`, `.nav-track`, `.nav-link`.

У перезбірці все це стає `data-motion="…"` (CONVENTIONS, «Кастомний JS»).
Пропозиція ролей — у таблиці нижче, затвердити перед етапом 2.

| Старий селектор | `data-motion` |
|---|---|
| `#anim-ball` | `hero-ball` |
| `.anim-ball-sticky` / `.anim-ball-wrap` / `.anim-ball-border` | `hero-ball-sticky` / `hero-ball-wrap` / `hero-ball-border` |
| `.ball-divider.is-left/right` | `hero-divider` + `data-side` |
| `.embed-path*`, `#vrtx*` | `intro-path` + `data-bp="desktop|tablet|mobile"` — на `<path>`, ✅ у копії (сесія 9) |
| `.anim-shape.is-*` | `intro-text` + `data-step="0..3"` — на рухомому тексті, ✅ у копії (сесія 9) |
| `.ui` / `.ui-track` / `.ui-slide` / `.ui-text` / `.ui-ball` | `ui` / `ui-track` / `ui-slide` / `ui-text` / `ui-ball` + `ui-slides` (ряд панелей), `ui-video` (на `<video>`) — ✅ у копії (сесія 9) |
| `.is-introduction` / `.intro-wrap` | `intro` (на `intro-scene`) — ✅ у копії (сесія 9) |
| `.height-section.is-interactive` | `interactive-track` |
| `#canvas` | `sphere` |
| `.loader*`, `.preloader_*`, `*.is-preloader*` (IX2 + Lottie, не script.v33) | `preloader`, `preloader-loader`, `preloader-bounce-ball`, `preloader-bounce-shadow`, `preloader-counter`, `preloader-scene`, `preloader-step`, `preloader-disc`, `preloader-word` (сесія 7, docs/sections/preloader.md) |
| `.text-wrap.is-hero` | `hero-text` (вхід після прелоадера) — ✅ у копії (сесія 8), усі ролі Hero стоять на `section-hero` |
| `.resources*` | `resources`, `resources-track`, `resources-arrow`, `resources-lists`, `resources-list`, `resources-header-item`, `resources-item`, `resources-image` |
| `.nav.nav-*`, `.nav-inner` | `theme` + `data-theme="dark|light|color"` (+ `data-color-index` для уроків) |
| nav-елементи | `nav-logo`, `nav-toggle`, `nav-menu`, `nav-track`, `nav-link`, `breadcrumbs`, `breadcrumb` |
| `.sound-icon-wrap` / `.sound-btn-mute` | `sound-btn` / `sound-state` |

## Числа, які треба зберегти (візуально 1:1)

- Lenis: `duration: 2`, easing `1.001 − 2^(−10t)`.
- Idle: 4 с; похитування ±1.5% по 0.4 с.
- Hero divider/border: 1 с scaleX, 0.5 с scale; тригер `top − heroBallWrapH center`.
- Intro timeline: `scrub: 1`; тривалості сегментів 4(8 мобайл) / 7 / 18 / 14 / 27, десктоп + 8 + 8 (bounce + зсув).
  Зупинки шляху: desktop `[0.1477, 0.43367, 0.61329, 1]`, tablet `[0.12336, 0.37553, 0.53228, 1]`, mobile `[0.13847, 0.348, 0.5061, 1]`.
  CustomEase `bounce` і `bounceSmall` — рядки в src.js.
- UI-слайдер Intro (блок D; на лайві це `#introduction`, не `#interactive`): довжина pin = `vw·k + vw·n·k + 0.5·vw·n + 0.25·vw` (k = 0.75 десктоп / 1 мобайл, n = слайдів, ×3 на мобайлі); слайди 25vw → 75vw → (передостанній) 25vw, останній 100vw; відео `clip-path circle(max(vw,vh)) ↔ circle(0.09rem)` по 0.7 с.
- Resources: `scrub: 3`; стрілки `x = 0.84·vw` (0.78 на ≤479) зі stagger; стек картинок: поворот 0, −3, −6…, макс 3 штуки.
- Sphere: 15 + 20 куль, радіус `size/15`, restitution 0.5, density 0.05, gravity scale 0.0025, gravity.x = −direction/2 при скролі; Windows 11 → `timeScale 0.35`; звук: максимум 2 голоси, cooldown 100–500 мс, detune `v²·600 − 600`, panner X за місцем зіткнення.
- Nav: 0.4 с на всі переходи; лінія навбара `top+=1px`, лінія саунд-кнопки `bottom−90px`; кольори `#0C0B0B` / `#FDFCFA`.

## Баги й костилі оригіналу (виправити в перезбірці, не копіювати)

1. **`lenis` глобал не існує** — інстанс локальний. Усі `typeof lenis !== "undefined" ? lenis.stop() : …` ідуть у else-гілку: меню блокує скрол через `html { overflow: hidden }`, а не через Lenis. Після закриття ставиться `overflow: overlay` (нестандартне значення). У новому коді — `lenis.stop()/start()`.
2. **`e.toElement`** у `mousemove` (сфера) — нестандартне, у Firefox `undefined` → TypeError на кожен рух миші. Замінити на `e.target`.
3. **`beforeunload`** читає `activeElement.href` без перевірки → помилка, якщо фокус не на посиланні. Плюс fade-out тіла при переході — сумнівна фіча, бо `pageshow` потім робить reload.
4. **Неявні глобали** у сфері: `i, r, parts, pegCount, TAU, segment, angle2, x2, y2, cx2, cy2, rect, body, musicCollision, diff`. `diff` не використовується.
5. **Дубль ключа `density`** (1e-5, потім 0.05) — працює 0.05.
6. **`vw`/`vh` читаються один раз на load** — ресайз/поворот ламає всі обчислення (крім canvas). У новому коді — `gsap.matchMedia()` + `invalidateOnRefresh` + функції-обчислювачі.
7. **Resources pin створюється ліниво** (`once` на `.is-lessons`), тому нав-тригери, створені раніше, не знають про pin-spacer і отримують ручні `startOffset/endOffset` з формулою `2·(scrollWidth − vw) + listsH` (на мобайлі ×2), яка ще й не збігається з реальною довжиною pin (`1.5·vw + (scrollWidth − vw) + listsH`). У новому коді створювати всі pin'и одразу, в порядку DOM — ScrollTrigger сам врахує spacer'и, офсети не потрібні. **Імовірно, саме це на мобайлі кидає скрол назад з Techniques у середину Intro (~6 700 px), див. [recordings.md](recordings.md#️-баг-лайву-стрибок-скролу-назад-на-мобайлі).**
8. **Колір уроків через `getComputedStyle(breadcrumb)`** — колір секції береться з фону хлібної крихти. У новому коді — `data-theme-color` на секції або CSS-змінна.
9. **Мертвий код**: блок H (`.section-slide-speed`), `.ui-path__circle`, вираз із Safari-regex, `diff`, порожній `onComplete: () => {}`.
10. **Layout у JS**: `marginTop` для `.ui-wrap`, `height: vh` для `.ui-slide`, `width: 25vw`, `marginLeft: -100vw` — перенести в CSS (стартовий стан класом, бо IX3 не вміє Initial Appearance через API).
11. **`end: "+" + N`** замість `"+=N"` — ScrollTrigger це парсить, але в новому коді писати `+=`.
12. **jQuery** лише у блоці E (hover-стек) і синхронізації табів — замінити на нативний DOM.
13. `ifvisible` (3 KB, 2014 рік) заради одного idle-таймера — замінити на `Observer` або 10 рядків власного коду.
14. `#link1` → `gsap.to(heroBall, {x: 0})` — хак для повернення на hero з меню; у новому коді — частина `navigate-to-top` логіки.
15. **Нахил гравітації сфери за скролом на лайві мертвий** (знайдено 2026-10-09, сесія 3). Тригер `.is-interactive.wf-section` (src.js ~775) нічого не знаходить: Webflow перестав додавати клас `wf-section` до секцій, а сайт перепубліковано 2024-02. Через це вкладений ScrollTrigger з `gravity.x = −direction/2` не створюється, і кулі завжди падають вертикально. На записі `reference/recordings/desktop/04-interactive.mp4` сфера працює, але без нахилу. Пропозиція: у перезбірці відновити задуману поведінку (тригер `data-motion="interactive-track"`). Але це видима відмінність від лайву, тому рішення за користувачем.

## Що лишається в inline-скриптах Home (не в script.v33) — перенести в модуль

Lottie resize, лічильник прелоадера 0→100 (4 с), Splide init + swap `.hero_text`,
`history.replaceState` на кожен клік по `<a>`, passive touch listeners,
13 `<audio>` + hover-звуки `#link1…#link10` / `#notrealtime`, sound toggle + gtag.
Див. docs/AUDIT.md, «Скрипти на Home», п. 11.
