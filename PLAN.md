# План перезбірки Motion

Статус: ⬜ не почато · 🟨 в роботі · ✅ готово · ⛔ заблоковано

## Етап 0 — Підготовка 🟨

- [ ] Користувач: ручний бекап оригіналу в Designer (Cmd+Shift+S)
- [x] Користувач: Duplicate site у воркспейсі → копія `Motion rebuild` (2026-10-09)
- [x] Користувач: переавторизувати Webflow MCP на оригінал + копію (2026-10-09)
- [x] Агент: `list_sites` → ID копії в CONVENTIONS.md (2026-10-09)
- [x] Користувач: репо на GitHub → `kov-dev/motion-rebuild` (2026-10-09)
- [x] ~~Немініфікований `script.v33`~~ — не знайдено; розшифровано з мініфікованого → `reference/script.v33.src.js` (2026-10-09)
- [x] Копію опубліковано на staging (17:53 і 18:16 UTC — користувач; 18:59 UTC — агент). Агент може публікувати копію сам (дозвіл користувача, сесія 9)
- [ ] Перевірити: чи публікується site-level custom code на webflow.io без Site plan
      (якщо ні — на час розробки тримати код у page-level footer Home)

## Етап 1 — Аудит ✅ (2026-10-09; хвиля 2 чистки ассетів — після перевірки staging)

Результат — `docs/AUDIT.md` (факти) + `docs/sections/<section>.md` (по секції).

- [x] Записати анімації лайву по секціях → `reference/recordings/` (desktop + mobile + меню), індекс [docs/recordings.md](docs/recordings.md) (2026-10-09). Лишилось: tablet 768, hover-стани Resources/карток, повільні кліпи pin-секцій — у проходах секцій
- [x] Повне дерево Home по секціях → [docs/home-tree.md](docs/home-tree.md) (2026-10-09). Designer ID — лише верхній рівень і секції, глибші — TODO у проході секції
- [x] Розібрати `script.v33`: карта функцій → секції → DOM-залежності → `docs/script-map.md` (2026-10-09)
- [x] Ембед `main-css` → `reference/main-css.css` + розбір [docs/main-css.md](docs/main-css.md) (2026-10-09)
- [x] Styleguide-сторінка → [docs/styleguide-audit.md](docs/styleguide-audit.md) (2026-10-09)
- [x] Ассети: список, вага, формати, кандидати на заміну → [docs/assets.md](docs/assets.md) (2026-10-09)
- [x] Lighthouse лайву (desktop/mobile) → розділ у [docs/AUDIT.md](docs/AUDIT.md), звіти `reference/lighthouse/` (2026-10-09)
- [x] Figma: Hero і Intro → [docs/sections/hero.md](docs/sections/hero.md), [intro.md](docs/sections/intro.md) (2026-10-09). Доступ є
- [x] Figma: `Design system` → [docs/sections/design-system.md](docs/sections/design-system.md); `Full design` — огляд у docs/FIGMA.md (768/375 є) (2026-10-09)

- [x] Чистка бібліотеки ассетів копії, хвиля 1: −203 файли / 320.5 MB (2026-10-09)
- [x] Figma: UI-слайдер Intro `4609-22242` → розділ у docs/sections/intro.md (2026-10-09)
- [ ] Чистка ассетів, хвиля 2 (65 файлів) — дозвіл є (сесія 9), перевірка на staging пройдена (0 збігів), **видалення чекає підтвердження** (заблоковано класифікатором дозволів)

## Етап 2 — Фундамент у копії 🟨

- [x] Шрифти копії перевірено: 4 woff2 під правильними іменами, заливка не потрібна (2026-10-09)
- [x] Змінні `core` / `semantic` / `type` створено й звірено, `White`/`Black` видалено (2026-10-09). Порожню `Base collection` видалити руками (API не вміє)
- [x] Текстові стилі (11 + `.body-sm.is-strong`) створено на змінних (2026-10-09)
- [x] MCP ставить режим колекції на клас/комбо — так (2026-10-09)
- [x] Ембед-компонент `styles-rem` (`src/styles-rem.html`), інстанс на Styleguide, знімок (2026-10-09)
- [x] Інстанс `styles-rem` на Home — першим у Body (2026-10-09). Старий `main-css` лишається до останньої старої секції (рішення сесії 8)
- [ ] Перевірити tablet/mobile-режими `type` на staging (дозвіл на публікацію є, сесія 9)
- [ ] Структурні й базові класи (`btn`, `ball*`, `section-*` …) — у проходах секцій, не наперед
- [ ] Компоненти: navbar, ~~footer~~ ✅ `site-footer` (сесія 23), ~~lesson-section~~ ✅ (сесія 18, + `lesson-card`; сесія 19: `lesson-schemes`, `lesson-examples`, `lesson-demo`, `lesson-classic`), lottie-card
- [x] Каркас `src/motion.js` (ES-module, GSAP 3.13.0 піновано) + `preloader-gate.js` + `preloader.css` (2026-10-09)
- [x] Підключення до Webflow, варіант 2 «поруч зі старим» (сесія 12): сніпети вставлені в Home → Custom code (усе в `<head>`: гейт + preloader.css + модуль), staging опубліковано 2026-10-10 07:39 UTC, перевірено `coexist-run --live` (1440 і 375)
- [ ] Збірка/мініфікація, версія в імені — разом із видаленням старих `loader`, Hero, Intro і `script.v33` (тоді ж прибрати `legacy-guard.js` і `syncLegacy()`)
- [ ] Текстові стилі: звірити tablet/mobile lh/ls з лайвом (heading-xl, body-lg — сесія 8; text-shape, body-sm — сесія 9; display-lg, body-sm.is-strong — сесія 13; display-xl і body-lg (lh) — сесія 15; heading-md, body-md, heading-xl (точно) — сесія 18; heading-lg — сесія 19; heading-sm — сесія 22; лишився text-label)

## Етап 3 — Секції (кожна окремим проходом) 🟨

Порядок: Preloader → Hero → Introduction → Interactive → Techniques → Lessons (×8 через компонент) → Resources → Footer → Sound.

Для кожної секції: структура → стилі (4 смуги) → анімація (IX3 або код) →
звірка з записом лайву → запис у CONVENTIONS.md.

| Секція | Figma | Аналіз | Верстка | Анімація | Звірка |
|---|---|---|---|---|---|
| Preloader | ✅ | ✅ [preloader.md](docs/sections/preloader.md) | ✅ зібрано, знімки фаз (2026-10-09) | 🟨 `initPreloader()` написано й прогнано на staging-розмітці, у Webflow не підключено | ⬜ |
| Hero | ✅ | ✅ | ✅ `section-hero` (2026-10-09), звірено з лайвом 1–2 px, знімок Designer (сесія 9); старий Hero ще на сторінці | ✅ вхід — `initPreloader()`, вихід ліній/кільця — `initHero()` (сесія 9, прогнано на staging-розмітці); у Webflow не підключено | ⬜ |
| Introduction | ✅ (1440 + UI-слайдер; 768/375 у Full design) | ✅ | ✅ `section-intro` зі сценою, шляхами й UI-слайдером (сесія 9), звірено з лайвом Δ 0–1 px; старий Intro ще на сторінці | ✅ `initIntro()` (кулька по шляху, тексти, посадка) + хмари кодом — Δ ≤ 1 px на 3 смугах (сесія 10); ✅ `initUi()` (pin слайдера, передача кульки, відео) + ідл-похитування — 768 / 375 без розбіжностей з лайвом, 1440 — 2 очікувані (сесія 11) | 🟨 уся секція звірена на staging-розмітці з фікстурою (intro-run, ui-run); у Webflow код не підключено |
| Interactive | ✅ `4611-22244` (4 кадри 1440) | ✅ [interactive.md](docs/sections/interactive.md) + лайв-заміри | ✅ `section-interactive` (сесія 13), звірено з лайвом на staging Δ ≤ 0.7 px на 1440/768/375; старий `#interactive` ще на сторінці | ✅ `initInteractive()` (pin + зсув Δ0 з лайвом), `sphere.js` (Matter.js 0.20, нахил гравітації), Lottie hover/tap (сесія 14) | 🟨 staging `--live` 1440/768/375 зелені; лишились: перенос `id="interactive"` і видалення старої секції, тач-скрол по сфері — після `script.v33`, hover-звук — етап 4 |
| Techniques | ✅ `702:14385` + 6 кроків, 768/375 | ✅ [techniques.md](docs/sections/techniques.md) + лайв-заміри (IX2-ключі, sticky) | ✅ `section-techniques` (сесія 15), звірено з лайвом на staging Δ ≤ 0.2 px на 1440/768/375; старий `#techniques` ще на сторінці | ✅ `initTechniques()` (scrub слів/зірок/абзацу, scrub 1 під IX2 smoothing 90, сесія 16) | 🟨 staging `--live` 1440/768/375 — Δ ≤ 0.2 px до лайву/ключів; лишились перенос `id="techniques"` і видалення старої секції |
| Lessons ×8 | ✅ `4611-22250` (easing 1440) + 2–8 `1553:*` | ✅ [lessons.md](docs/sections/lessons.md) + лайв-заміри (геометрія 3 смуг, IX2-формула, слайдер, медіа, навбар); план компонента й анімації (сесія 17) | ✅ `section-lessons` + `lesson-section` ×8 і `lesson-card` (сесія 18); блоки easing `lesson-schemes` / `lesson-examples` / `lesson-demo` і `lesson-classic` ×2 у слотах (сесія 19); звірено з лайвом — 0 прапорців, 8 уроків × 4 смуги, повні висоти збігаються | ✅ `initLessons()` (Implementation ×8, examples, демо, фон classic, lazyVideo, ліниві Lottie) + `initLessonSchemes()` (GSAP-слайдер, drag) — сесія 20, підключено (`7afb11e`) | 🟨 статика ✅ (`lessons-compare`), анімація ✅ (`lessons-run` 4 смуги + `--live` 1440 / 375, 0 прапорців); лишились тема навбара (прохід Navigation), id `<урок>-next` → справжні й видалення старих уроків (тоді ж прибрати `guardVideo()` і autovideo) |
| Resources | ✅ `4616-22252` (17 кадрів 1440; 768/375 лише вхід) | ✅ [resources.md](docs/sections/resources.md) + лайв-заміри (pin 3 фази, CSS 3 смуг, хмари IX2, hover-стек, баги лайву); план секції й анімації (сесія 21) | ✅ `section-resources` (сесія 22): хмари, pin, шторки, student, стек, таби, 2 Collection List з картинкою в рядку; `resources-compare` 196/197 × 4 смуги, Δ ≤ 1 px | ✅ `initResources()` (pin 3 фази, хмари ≥992, таб, hover-стек) — сесія 22, підключено (`0b615c4`) | 🟨 `resources-run` 4 смуги + `--live` 1440 / 375 — 0 прапорців; порядок курсів ✅ (Sort користувача, сесія 23); **Sources — прибрати Sort руками в Designer** (користувач поставив і на нього, тепер ORDER list2); оверлей і чорні хмари — `initFooter()`, тема навбара (Navigation), id `resources-next` → `resources` |
| Footer | ✅ `795:39109` (1440) + tablet `891:27933`; 375 немає | ✅ [footer.md](docs/sections/footer.md) + лайв-заміри (DOM 3 смуг, IX2 `a-126` і формула прогресу, hover); план компонента й анімації (сесія 23) | ✅ компонент `site-footer` після `section-resources` (сесія 23); `footer-compare` 0 прапорців × 4 смуги, Δ 0 | ⬜ `initFooter()`: оверлей `res-overlay` opacity 0 → 1 на 0–50 %, хмари y 1.2 / 1 / 2 rem на 0–72 %, scrub 1 | ⬜ `footer-run.mjs`; Sound ховати над футером (прохід Sound); футер на шаблонах CMS / Styleguide |
| Sound btn | — | ⬜ | ⬜ | ⬜ | ⬜ |
| CMS templates ×3 | ⬜ | ⬜ | ⬜ | — | ⬜ |
| Styleguide | ⬜ | ⬜ | ⬜ | — | ⬜ |

## Етап 4 — Код ⬜

- [ ] Один модуль, init по `data-motion` атрибутах, кожна секція — окрема функція з guard'ом «є в DOM?»
- [ ] Lenis + ScrollTrigger інтеграція, `prefers-reduced-motion`
- [ ] Звук (ті самі mp3), gtag-події sound_on/off
- [ ] Прибрати jQuery-залежності з нашого коду (Webflow сам його вантажить, але ми не спираємось)
- [ ] Пінити версії: GSAP (одна), Lenis, Matter.js (✅ 0.20.0, lottie-web 5.13.0 — сесія 14). Splide і будь-які інші слайдери — прибрати, замінити на GSAP/IX3

## Етап 5 — Перформанс і QA ⬜

- [ ] Lottie-дієта: заміна простих на SVG+GSAP, dotLottie для складних, `not_real_time` → відео або dotLottie
- [ ] Відео: постери, lazy, один формат, без дублів під смуги
- [ ] Шрифти: self-hosted, `font-display: swap`, preload
- [ ] Lighthouse копії vs лайву
- [ ] Усі 4 смуги, Safari/Chrome/Firefox, тач
- [ ] SEO: title/description/OG/JSON-LD як на оригіналі; слаги звірити

## Етап 6 — Запуск ⬜

- [ ] OG-картинку Home перепривʼязати з файлу оригіналу на ассет копії
- [ ] Ще 3 жорсткі URL на бакет оригіналу: `Texture_01.png` у `main-css`, 2 постери в ембедах уроку easing (docs/asset-cleanup.md, хвиля 2)

- [ ] GA4 + Twitter pixel на копії
- [ ] JS перенесено на CDN студії, версії пінованi
- [ ] Site plan на копії; домен переноситься; SSL
- [ ] Старий сайт — архів (не видаляти ≥1 місяць)

## Відкриті питання

- ~~Доступ Figma MCP~~ — є (сесія 4).
- ~~Нахил гравітації сфери~~ — відновлюємо (користувач, сесія 4).
- ~~Стрибок скролу на мобайлі~~ — підтверджено на телефоні, фіксимо (сесія 4).
- ~~Дизайнер: макети 768/375~~ — знайдено на дошці `Full design` (сесія 5), еталон ≤991 лишається лайв.
- Дизайнер: чи є прототип із таймінгами станів hero? — користувач надішле пізніше (сесія 9); поки беремо записи й script-map
- ~~Обрізати петлі відео-карток до ~10 с~~ — ні, не обрізаємо (користувач, сесія 4). Лише перекодування без видимої різниці.
- ~~Чистити невживані ассети копії~~ — так (користувач). Видалено 203 (320.5 MB), див. docs/asset-cleanup.md. Друга хвиля (65) — дозволено (сесія 9), перевірено, видалення чекає підтвердження.

- Хто й як деплоїть на Amazon CDN студії (доступ, процес)?
- Site plan: купити на новий сайт і скасувати старий — хто узгоджує в студії?
- ~~Чи є After Effects-вихідники Lottie?~~ — не потрібні: прелоадер переробляємо в код, решту Lottie оцінюємо по записах.
- ~~Splide лишати?~~ — прибрати, усі слайдери на GSAP/IX3 (рішення 2026-10-09).
