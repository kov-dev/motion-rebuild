# План перезбірки Motion

Статус: ⬜ не почато · 🟨 в роботі · ✅ готово · ⛔ заблоковано

## Етап 0 — Підготовка 🟨

- [ ] Користувач: ручний бекап оригіналу в Designer (Cmd+Shift+S)
- [x] Користувач: Duplicate site у воркспейсі → копія `Motion rebuild` (2026-10-09)
- [x] Користувач: переавторизувати Webflow MCP на оригінал + копію (2026-10-09)
- [x] Агент: `list_sites` → ID копії в CONVENTIONS.md (2026-10-09)
- [x] Користувач: репо на GitHub → `kov-dev/motion-rebuild` (2026-10-09)
- [x] ~~Немініфікований `script.v33`~~ — не знайдено; розшифровано з мініфікованого → `reference/script.v33.src.js` (2026-10-09)
- [ ] Перевірити: чи публікується site-level custom code на webflow.io без Site plan
      (якщо ні — на час розробки тримати код у page-level footer Home)

## Етап 1 — Аудит 🟨 (лишилась Figma Design system / Full design)

Результат — `docs/AUDIT.md` (факти) + `docs/sections/<section>.md` (по секції).

- [x] Записати анімації лайву по секціях → `reference/recordings/` (desktop + mobile + меню), індекс [docs/recordings.md](docs/recordings.md) (2026-10-09). Лишилось: tablet 768, hover-стани Resources/карток, повільні кліпи pin-секцій — у проходах секцій
- [x] Повне дерево Home по секціях → [docs/home-tree.md](docs/home-tree.md) (2026-10-09). Designer ID — лише верхній рівень і секції, глибші — TODO у проході секції
- [x] Розібрати `script.v33`: карта функцій → секції → DOM-залежності → `docs/script-map.md` (2026-10-09)
- [x] Ембед `main-css` → `reference/main-css.css` + розбір [docs/main-css.md](docs/main-css.md) (2026-10-09)
- [x] Styleguide-сторінка → [docs/styleguide-audit.md](docs/styleguide-audit.md) (2026-10-09)
- [x] Ассети: список, вага, формати, кандидати на заміну → [docs/assets.md](docs/assets.md) (2026-10-09)
- [x] Lighthouse лайву (desktop/mobile) → розділ у [docs/AUDIT.md](docs/AUDIT.md), звіти `reference/lighthouse/` (2026-10-09)
- [x] Figma: Hero і Intro → [docs/sections/hero.md](docs/sections/hero.md), [intro.md](docs/sections/intro.md) (2026-10-09). Доступ є
- [ ] Figma: сторінки `Design system` (токени для етапу 2) і `Full design` — субагент, перед етапом 2

## Етап 2 — Фундамент у копії ⬜

- [ ] Змінні: кольори, шрифти, відступи, радіуси (з макета + styleguide)
- [ ] Типографіка й базовий словник класів (WEBFLOW-BASE §3) → CONVENTIONS.md
- [ ] Ембед-компонент `styles-rem` (або перевикористати `main-css`)
- [ ] Компоненти: navbar, footer, lesson-section (8 уроків → 1 компонент з пропсами), lottie-card
- [ ] Каркас `src/`: `motion.js` (ES-module), `motion.css`, збірка/мініфікація, версія в імені

## Етап 3 — Секції (кожна окремим проходом) ⬜

Порядок: Preloader → Hero → Introduction → Interactive → Techniques → Lessons (×8 через компонент) → Resources → Footer → Sound.

Для кожної секції: структура → стилі (4 смуги) → анімація (IX3 або код) →
звірка з записом лайву → запис у CONVENTIONS.md.

| Секція | Figma | Аналіз | Верстка | Анімація | Звірка |
|---|---|---|---|---|---|
| Preloader | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Hero | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| Introduction | ✅ (лише 1440, статика) | ✅ | ⬜ | ⬜ | ⬜ |
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

- [ ] GA4 + Twitter pixel на копії
- [ ] JS перенесено на CDN студії, версії пінованi
- [ ] Site plan на копії; домен переноситься; SSL
- [ ] Старий сайт — архів (не видаляти ≥1 місяць)

## Відкриті питання

- ~~Доступ Figma MCP~~ — є (сесія 4).
- ~~Нахил гравітації сфери~~ — відновлюємо (користувач, сесія 4).
- ~~Стрибок скролу на мобайлі~~ — підтверджено на телефоні, фіксимо (сесія 4).
- Дизайнер: чи є у Figma фрейми UI-слайдера Intro і макети 768/375? Чи є прототип із таймінгами станів hero?
- Обрізати петлі 24 відео-карток уроків до ~10 с (≈−9 MB понад перекодування)? Видима зміна, рішення користувача.
- Чистити 330 невживаних файлів (~350 MB) з бібліотеки ассетів **копії**? Незворотно, лише з дозволу.

- Хто й як деплоїть на Amazon CDN студії (доступ, процес)?
- Site plan: купити на новий сайт і скасувати старий — хто узгоджує в студії?
- ~~Чи є After Effects-вихідники Lottie?~~ — не потрібні: прелоадер переробляємо в код, решту Lottie оцінюємо по записах.
- ~~Splide лишати?~~ — прибрати, усі слайдери на GSAP/IX3 (рішення 2026-10-09).
