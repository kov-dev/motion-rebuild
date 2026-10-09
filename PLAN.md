# План перезбірки Motion

Статус: ⬜ не почато · 🟨 в роботі · ✅ готово · ⛔ заблоковано

## Етап 0 — Підготовка 🟨

- [ ] Користувач: ручний бекап оригіналу в Designer (Cmd+Shift+S)
- [x] Користувач: Duplicate site у воркспейсі → копія `Motion rebuild` (2026-10-09)
- [x] Користувач: переавторизувати Webflow MCP на оригінал + копію (2026-10-09)
- [x] Агент: `list_sites` → ID копії в CONVENTIONS.md (2026-10-09)
- [x] Користувач: репо на GitHub → `kov-dev/motion-rebuild` (2026-10-09)
- [x] ~~Немініфікований `script.v33`~~ — не знайдено; розшифровано з мініфікованого → `reference/script.v33.src.js` (2026-10-09)
- [x] Копію опубліковано на staging (2026-10-09 17:53 UTC, не агентом; дозволу на подальші публікації агентом немає)
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
- [ ] Чистка ассетів, хвиля 2 (65 файлів) — після перевірки staging, з дозволу користувача

## Етап 2 — Фундамент у копії 🟨

- [x] Шрифти копії перевірено: 4 woff2 під правильними іменами, заливка не потрібна (2026-10-09)
- [x] Змінні `core` / `semantic` / `type` створено й звірено, `White`/`Black` видалено (2026-10-09). Порожню `Base collection` видалити руками (API не вміє)
- [x] Текстові стилі (11 + `.body-sm.is-strong`) створено на змінних (2026-10-09)
- [x] MCP ставить режим колекції на клас/комбо — так (2026-10-09)
- [x] Ембед-компонент `styles-rem` (`src/styles-rem.html`), інстанс на Styleguide, знімок (2026-10-09)
- [x] Інстанс `styles-rem` на Home — першим у Body (2026-10-09). Старий `main-css` лишається до останньої старої секції (рішення сесії 8)
- [ ] Перевірити tablet/mobile-режими `type` у Preview або на staging (потрібен дозвіл на публікацію копії)
- [ ] Структурні й базові класи (`btn`, `ball*`, `section-*` …) — у проходах секцій, не наперед
- [ ] Компоненти: navbar, footer, lesson-section (8 уроків → 1 компонент з пропсами), lottie-card
- [x] Каркас `src/motion.js` (ES-module, GSAP 3.13.0 піновано) + `preloader-gate.js` + `preloader.css` (2026-10-09)
- [ ] Збірка/мініфікація, версія в імені, підключення до Webflow (jsDelivr) — разом із видаленням старих `loader` і Hero
- [ ] Текстові стилі: звірити tablet/mobile lh/ls з лайвом (heading-xl і body-lg виправлено в сесії 8)

## Етап 3 — Секції (кожна окремим проходом) 🟨

Порядок: Preloader → Hero → Introduction → Interactive → Techniques → Lessons (×8 через компонент) → Resources → Footer → Sound.

Для кожної секції: структура → стилі (4 смуги) → анімація (IX3 або код) →
звірка з записом лайву → запис у CONVENTIONS.md.

| Секція | Figma | Аналіз | Верстка | Анімація | Звірка |
|---|---|---|---|---|---|
| Preloader | ✅ | ✅ [preloader.md](docs/sections/preloader.md) | ✅ зібрано, знімки фаз (2026-10-09) | 🟨 `initPreloader()` написано й прогнано на staging-розмітці, у Webflow не підключено | ⬜ |
| Hero | ✅ | ✅ | ✅ `section-hero` (2026-10-09), звірено з лайвом 1–2 px; старий Hero ще на сторінці | 🟨 вхід — у `initPreloader()`; вихід ліній — у проході Intro | ⬜ |
| Introduction | ✅ (1440 + UI-слайдер; 768/375 у Full design) | ✅ | ⬜ | ⬜ | ⬜ |
| Interactive | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Techniques | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Lessons ×8 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Resources | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Footer | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Sound btn | — | ⬜ | ⬜ | ⬜ | ⬜ |
| CMS templates ×3 | ⬜ | ⬜ | ⬜ | — | ⬜ |
| Styleguide | ⬜ | ⬜ | ⬜ | — | ⬜ |

## Етап 4 — Код ⬜

- [ ] Один модуль, init по `data-motion` атрибутах, кожна секція — окрема функція з guard'ом «є в DOM?»
- [ ] Lenis + ScrollTrigger інтеграція, `prefers-reduced-motion`
- [ ] Звук (ті самі mp3), gtag-події sound_on/off
- [ ] Прибрати jQuery-залежності з нашого коду (Webflow сам його вантажить, але ми не спираємось)
- [ ] Пінити версії: GSAP (одна), Lenis, Matter.js. Splide і будь-які інші слайдери — прибрати, замінити на GSAP/IX3

## Етап 5 — Перформанс і QA ⬜

- [ ] Lottie-дієта: заміна простих на SVG+GSAP, dotLottie для складних, `not_real_time` → відео або dotLottie
- [ ] Відео: постери, lazy, один формат, без дублів під смуги
- [ ] Шрифти: self-hosted, `font-display: swap`, preload
- [ ] Lighthouse копії vs лайву
- [ ] Усі 4 смуги, Safari/Chrome/Firefox, тач
- [ ] SEO: title/description/OG/JSON-LD як на оригіналі; слаги звірити

## Етап 6 — Запуск ⬜

- [ ] OG-картинку Home перепривʼязати з файлу оригіналу на ассет копії

- [ ] GA4 + Twitter pixel на копії
- [ ] JS перенесено на CDN студії, версії пінованi
- [ ] Site plan на копії; домен переноситься; SSL
- [ ] Старий сайт — архів (не видаляти ≥1 місяць)

## Відкриті питання

- ~~Доступ Figma MCP~~ — є (сесія 4).
- ~~Нахил гравітації сфери~~ — відновлюємо (користувач, сесія 4).
- ~~Стрибок скролу на мобайлі~~ — підтверджено на телефоні, фіксимо (сесія 4).
- ~~Дизайнер: макети 768/375~~ — знайдено на дошці `Full design` (сесія 5), еталон ≤991 лишається лайв.
- Дизайнер: чи є прототип із таймінгами станів hero? (не критично — таймінги є в записах і script-map)
- ~~Обрізати петлі відео-карток до ~10 с~~ — ні, не обрізаємо (користувач, сесія 4). Лише перекодування без видимої різниці.
- ~~Чистити невживані ассети копії~~ — так (користувач). Видалено 203 (320.5 MB), див. docs/asset-cleanup.md. Друга хвиля (65) — після перевірки staging.

- Хто й як деплоїть на Amazon CDN студії (доступ, процес)?
- Site plan: купити на новий сайт і скасувати старий — хто узгоджує в студії?
- ~~Чи є After Effects-вихідники Lottie?~~ — не потрібні: прелоадер переробляємо в код, решту Lottie оцінюємо по записах.
- ~~Splide лишати?~~ — прибрати, усі слайдери на GSAP/IX3 (рішення 2026-10-09).
