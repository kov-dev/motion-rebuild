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
- [x] Чистка ассетів, хвиля 2: −64 файли / 38.6 MB, бібліотека 176 → 112, `Texture_01` лишився; staging 0 битих URL, Home 0 прапорців (2026-10-12, сесія 40)

## Етап 2 — Фундамент у копії 🟨

- [x] Шрифти копії перевірено: 4 woff2 під правильними іменами, заливка не потрібна (2026-10-09)
- [x] Змінні `core` / `semantic` / `type` створено й звірено, `White`/`Black` видалено (2026-10-09). Порожню `Base collection` видалити руками (API не вміє)
- [x] Текстові стилі (11 + `.body-sm.is-strong`) створено на змінних (2026-10-09)
- [x] MCP ставить режим колекції на клас/комбо — так (2026-10-09)
- [x] Ембед-компонент `styles-rem` (`src/styles-rem.html`), інстанс на Styleguide, знімок (2026-10-09)
- [x] Інстанс `styles-rem` на Home — першим у Body (2026-10-09). Старий `main-css` видалено (крок 4, сесія 31; звірка `main-css-diff.mjs` до/після)
- [ ] Перевірити tablet/mobile-режими `type` на staging (дозвіл на публікацію є, сесія 9)
- [ ] Структурні й базові класи (`btn`, `ball*`, `section-*` …) — у проходах секцій, не наперед
- [x] Чистка стилів: −425 невживаних класів старої збірки, бекап `reference/styles/copy-styles-2026-10-12.json` (сесія 38). `.body-wrap` видалено після заміни Body Home на `.body` (сесія 39); режим `dark` з `.body` знято, бо інвертував уроки й Resources
- [ ] Компоненти: ~~navbar~~ ✅ `site-nav` (сесія 26, код — сесія 27), ~~footer~~ ✅ `site-footer` (сесія 23), ~~sound~~ ✅ `site-sound` (сесія 28), ~~lesson-section~~ ✅ (сесія 18, + `lesson-card`; сесія 19: `lesson-schemes`, `lesson-examples`, `lesson-demo`, `lesson-classic`), lottie-card
- [x] Каркас `src/motion.js` (ES-module, GSAP 3.13.0 піновано) + `preloader-gate.js` + `preloader.css` (2026-10-09)
- [x] Підключення до Webflow, варіант 2 «поруч зі старим» (сесія 12): сніпети вставлені в Home → Custom code (усе в `<head>`: гейт + preloader.css + модуль), staging опубліковано 2026-10-10 07:39 UTC, перевірено `coexist-run --live` (1440 і 375)
- [ ] Збірка/мініфікація, версія в імені — перехідні костилі прибрано (сесія 31), Lenis підключено (сесія 32); можна робити (етап 5)
- [ ] Текстові стилі: звірити tablet/mobile lh/ls з лайвом (heading-xl, body-lg — сесія 8; text-shape, body-sm — сесія 9; display-lg, body-sm.is-strong — сесія 13; display-xl і body-lg (lh) — сесія 15; heading-md, body-md, heading-xl (точно) — сесія 18; heading-lg — сесія 19; heading-sm — сесія 22; лишився text-label)

## Етап 3 — Секції (кожна окремим проходом) 🟨

Порядок: Preloader → Hero → Introduction → Interactive → Techniques → Lessons (×8 через компонент) → Resources → Footer → Navigation → Sound. **Усі секції Home пройдено (сесія 28).** Далі — видалення старого за планом [docs/legacy-removal.md](docs/legacy-removal.md): крок 1 ✅ footer code Home порожній, `script.v33` і весь старий стек знято (сесія 29) → крок 2 ✅ 10 старих блоків видалено + `legacy-hide.css` знято (сесія 30) → крок 3 ✅ справжні id `hero` / `<урок>` / `resources` + картки меню (сесія 30, `3637a98`) → крок 4 ✅ `legacy-guard.js` / `syncLegacy()` / `guardVideo()` прибрано (`87ef446`), ембед `main-css` видалено (сесія 31) → крок 5 ✅ Lenis (етап 4, сесія 32, `bcebd8f`). **Далі — шаблони CMS (×3), Styleguide.** Сесія 33: правки за відгуком користувача (прелоадер, плашка Hero, тексти пігулок) — перед аудитом / чисткою стилів користувач хоче ще пройтись по видимих недоробках. Сесія 34: UI-слайдер за відео + одна кулька (`7fdf6af`). Сесія 35: `ui-run.mjs` під широку схему — усі смуги, iPad landscape і reduce 0 прапорців; відкрите питання — тач-множник ×3 на iPad. Сесія 36: тач ×1.5 на ≥992 (рішення користувача), шаблони CMS закрито (редирект `/lesson/*` → секція, deep-link на Home), `086130a`. Сесія 37: Styleguide перебудовано як довідник нової системи (`noindex`, `styleguide-check` 0). Сесія 38: чистка стилів — −425 невживаних (750 → 325, CSS 157 → 93 KB), Home 0 прапорців, `.body` у темному режимі ([docs/style-cleanup.md](docs/style-cleanup.md)). Сесія 39: Body Home → `.body` (користувач), режим `dark` з `.body` знято (інвертував уроки й Resources), `.body-wrap` видалено; хвиля 2 ассетів перевірена — 64 до видалення, `Texture_01` лишається. Сесія 40: хвиля 2 ассетів видалена (−64, 176 → 112), staging без битих URL, Home 0 прапорців. Сесія 41: посадка кульки — 3 відскоки вздовж першого рядка + дуга в крапку (`initIntroLanding()`, lead 3 → 4), доскрол слайдера до найближчої відкритої панелі (`initUiSnap()`, `snap-run.mjs`), `8688cbd`. Сесія 45: доскрол слайдера ковзає з поточної швидкості без ривків (`glide()`, `ui-jerk.mjs`), `501bebe`. **Далі — видимі правки користувача; етап 5 (збірка / мініфікація).**

Для кожної секції: структура → стилі (4 смуги) → анімація (IX3 або код) →
звірка з записом лайву → запис у CONVENTIONS.md.

| Секція | Figma | Аналіз | Верстка | Анімація | Звірка |
|---|---|---|---|---|---|
| Preloader | ✅ | ✅ [preloader.md](docs/sections/preloader.md) | ✅ зібрано, знімки фаз (2026-10-09) | ✅ `initPreloader()` підключено (сесія 12); сесія 33: кулька сама росте в перший диск, слова стартують повністю під краєм (`b898576`) | 🟨 `preloader-handover.mjs --live` 4 вʼюпорти — 0 прапорців (сесія 33); фази 2–3 проти лайву окремо не звіряли |
| Hero | ✅ | ✅ | ✅ `section-hero` (2026-10-09), звірено з лайвом 1–2 px, знімок Designer (сесія 9); старий Hero видалено (сесія 30) | ✅ вхід — `initPreloader()`, вихід ліній/кільця — `initHero()` (сесія 9, прогнано на staging-розмітці); у Webflow не підключено | ⬜ |
| Introduction | ✅ (1440 + UI-слайдер; 768/375 у Full design) | ✅ | ✅ `section-intro` зі сценою, шляхами й UI-слайдером (сесія 9), звірено з лайвом Δ 0–1 px; старий Intro видалено (сесія 30) | ✅ `initIntro()` (кулька по шляху, тексти, посадка) + хмари кодом — Δ ≤ 1 px на 3 смугах (сесія 10); ✅ `initUi()` (pin слайдера, передача кульки, відео) + ідл-похитування — 768 / 375 без розбіжностей з лайвом, 1440 — 2 очікувані (сесія 11); сесія 34: ≥992 слайдер за відео дизайнера (панелі 2/3, конвеєр крапок, третій слайд праворуч), одна кулька Intro → слайдер (`scrub: true`, посадка на заголовок), `7fdf6af` | 🟨 сесії 46–47: поява рядків заголовків від ударів кульки — спробували, користувач прибрав (код у `688f7b8`); лишилось: кулька падає й скаче по першому рядку обох заголовків (`initBallLanding`, `8ffa5bf`); intro-run (фікстура); `ui-run` переписано (сесія 35): ≥992 за розкадровкою відео + одна кулька на передачі, ≤991 проти лайву — 1440 / 1280 / iPad 1366 і 1194 / 768 / 375 + `--reduce` + `--live` — 0 прапорців; тач ≥992 ×1.5 (користувач, сесія 36): iPad 1366 — 11k px на блок, `--live` 0 |
| Interactive | ✅ `4611-22244` (4 кадри 1440) | ✅ [interactive.md](docs/sections/interactive.md) + лайв-заміри | ✅ `section-interactive` (сесія 13), звірено з лайвом на staging Δ ≤ 0.7 px на 1440/768/375; старий `#interactive` ще на сторінці | ✅ `initInteractive()` (pin + зсув Δ0 з лайвом), `sphere.js` (Matter.js 0.20, нахил гравітації), Lottie hover/tap (сесія 14) | 🟨 staging `--live` 1440/768/375 зелені; стара секція видалена (сесія 30); лишились: тач-скрол по сфері, hover-звук ✅ (сесія 28) |
| Techniques | ✅ `702:14385` + 6 кроків, 768/375 | ✅ [techniques.md](docs/sections/techniques.md) + лайв-заміри (IX2-ключі, sticky) | ✅ `section-techniques` (сесія 15), звірено з лайвом на staging Δ ≤ 0.2 px на 1440/768/375; старий `#techniques` ще на сторінці | ✅ `initTechniques()` (scrub слів/зірок/абзацу, scrub 1 під IX2 smoothing 90, сесія 16) | 🟨 staging `--live` 1440/768/375 — Δ ≤ 0.2 px до лайву/ключів; стара секція видалена (сесія 30) |
| Lessons ×8 | ✅ `4611-22250` (easing 1440) + 2–8 `1553:*` | ✅ [lessons.md](docs/sections/lessons.md) + лайв-заміри (геометрія 3 смуг, IX2-формула, слайдер, медіа, навбар); план компонента й анімації (сесія 17) | ✅ `section-lessons` + `lesson-section` ×8 і `lesson-card` (сесія 18); блоки easing `lesson-schemes` / `lesson-examples` / `lesson-demo` і `lesson-classic` ×2 у слотах (сесія 19); звірено з лайвом — 0 прапорців, 8 уроків × 4 смуги, повні висоти збігаються | ✅ `initLessons()` (Implementation ×8, examples, демо, фон classic, lazyVideo, ліниві Lottie) + `initLessonSchemes()` (GSAP-слайдер, drag) — сесія 20, підключено (`7afb11e`) | 🟨 статика ✅ (`lessons-compare`), анімація ✅ (`lessons-run` 4 смуги + `--live` 1440 / 375, 0 прапорців); демо easing переписано за відгуком (сесія 42): лінія плавно від скролу + доскрол до тиків, кросфейд відео — `demo-run` 3 смуги + `--reduce` + `--live` 0 (`ede9f37`); картки Implementation липнуть по центру екрана (сесія 43, `cards-center`); Firefox: відео буферизуються наперед, картинки Courses вантажаться за екран до піна (сесія 44, `d9480ca`); **CDN-відео без faststart — перезалити `media-faststart/` (docs/video-faststart.md)**; тема навбара ✅ (сесія 27), старі уроки видалені, id `easing` … `zoom` справжні (сесія 30); `guardVideo()` прибрано, `lessons-run --live` 0 (сесія 31) |
| Resources | ✅ `4616-22252` (17 кадрів 1440; 768/375 лише вхід) | ✅ [resources.md](docs/sections/resources.md) + лайв-заміри (pin 3 фази, CSS 3 смуг, хмари IX2, hover-стек, баги лайву); план секції й анімації (сесія 21) | ✅ `section-resources` (сесія 22): хмари, pin, шторки, student, стек, таби, 2 Collection List з картинкою в рядку; `resources-compare` 196/197 × 4 смуги, Δ ≤ 1 px | ✅ `initResources()` (pin 3 фази, хмари ≥992, таб, hover-стек) — сесія 22, підключено (`0b615c4`) | 🟨 `resources-run` 4 смуги + `--live` 1440 / 375 — 0 прапорців; порядок курсів ✅ (Sort користувача, сесія 23); Sources ✅ (Sort прибрано, сесія 25), але користувач прибрав Sort **і з courses** → `resources-compare` 196 / 197 (ORDER list1); **courses: повернути Sort Created On, Oldest first** (MCP не пише `created-on`; сесія 26 — ще `sort: []`); оверлей і чорні хмари ✅ (`initFooter()`, сесія 24), тема навбара ✅ (сесія 27), id `resources` ✅ (сесія 30); порядок courses перевіряє `resources-order.mjs` проти лайву |
| Footer | ✅ `795:39109` (1440) + tablet `891:27933`; 375 немає | ✅ [footer.md](docs/sections/footer.md) + лайв-заміри (DOM 3 смуг, IX2 `a-126` і формула прогресу, hover); план компонента й анімації (сесія 23) | ✅ компонент `site-footer` після `section-resources` (сесія 23); `footer-compare` 0 прапорців × 4 смуги, Δ 0 | ✅ `initFooter()` (оверлей opacity 0–50 %, хмари 0–72 %, scrub 1, reduced-motion) — сесія 24, підключено (`99028b6`) | 🟨 `footer-run` 4 смуги локально й `--live` — 0 прапорців (проти формули й живого IX2 старого футера), `--reduce` 0; Sound над футером ✅ (сесія 28); футер — край документа, `footer-run` обрізає точки за краєм (сесія 30); на Styleguide — інстанс на дошці (сесія 37), на шаблонах CMS не потрібен (сесія 36) |
| Navigation | ✅ меню `1221:34806` / `1738:23158` / `1738:23481` + символ `Header` (інстанси), часткові; секція `4616-22254` (сесія 26) | ✅ [navigation.md](docs/sections/navigation.md) + [navigation-figma.md](docs/sections/navigation-figma.md); лайв-заміри (структура 3 смуг, IX2 меню, тема по всій сторінці, край Resources → футер); план компонента `site-nav` і `initNav()` / `initTheme()` (сесія 25) | ✅ компонент `site-nav` (сесія 26): шапка, 8 крихт, `<button>`-тогл, меню з 10 карток-посилань, нижній рядок; старий `.navigation` схований (`legacy-hide.css`); `data-theme` на Resources / футері; `nav-compare` 53 / 53 × 4 смуги, Δ ≤ 0.1 px | ✅ `initNav()` (меню за ключами лайву, ліниві Lottie карток по одній на кадр, колесо, Esc, клік → ціль у top) + `initTheme()` (найглибший `[data-theme]`, футер з оверлею 50 %) — сесія 27, підключено (`81103de`) | 🟨 `nav-run` 1440 / 768 / 600 / 375 + `--reduce` + `--live` — 0 прапорців; лінія Sound ✅ (сесія 28), справжні якорі `#hero` / `#<урок>` / `#resources` ✅ (сесія 30, links `--live` 1440 / 375 — 0); на Styleguide — інстанс на дошці (сесія 37) |
| Sound btn | ✅ символ `675:12444` (у navigation-figma.md) | ✅ [sound.md](docs/sections/sound.md) + лайв-заміри (структура 3 смуг, в'їзд, IX2 `a-130` / `a-131`, тема по лінії bottom−90, звук і gtag) — сесія 28 | ✅ компонент `site-sound` третім у Body (сесія 28); старий `.fixed-bottom` схований (`legacy-hide.css`) | ✅ `initSound()` (тогл, фон / клік / hover mp3, gtag, ховання над футером) + тема на лінії Sound в `initTheme()` — сесія 28, підключено (`a82e952`) | 🟨 `sound-run` 1440 / 768 / 600 / 375 + `--reduce` + `--live` 1440 / 375 — 0 прапорців; 13 `<audio>` і `script.v33` знято (сесія 29, крок 1); старий `.fixed-bottom` видалено (сесія 30); на Styleguide — інстанс на дошці (сесія 37) |
| CMS templates ×3 | — (дизайну немає) | ✅ [cms-templates.md](docs/sections/cms-templates.md): усі 3 порожні в оригіналі й копії; лайв `/lesson/*` порожня сторінка, `/resources/*` і `/course-items/*` 404 (сесія 36) | ✅ верстати нічого; head шаблону Lessons — редирект на `/#<секція>` + `noindex` (рішення користувача, сесія 36) | ✅ deep-link на Home: `/#<секція>` без інтро, приземлення секції вгорі (`086130a`) | ✅ `deeplink-run` 4 смуги + `--reduce` + `--live` (з `/lesson/*`) — 0 прапорців |
| Styleguide | — (дизайну немає; подача — `_base/STYLEGUIDE-PAGE.md`) | ✅ [styleguide.md](docs/sections/styleguide.md): звірка лайв ↔ копія ↔ аудит, рішення (довідник системи, `noindex`, компоненти — інстанси на дошках, без живого «одягу») — сесія 37 | ✅ `sg-page`: Color (core + semantic light/dark), Typography (12 стилів + смуги через режим `type`), Shape, Components (`site-nav` / `site-sound` / `site-footer` на дошках), Rules; старе прибрано; `.body` на змінних (сесія 37) | — | ✅ `styleguide-check` 1440 / 768 / 600 / 375 — 0 прапорців; лишився перемикач «Sitemap indexing» (запуск); Body Home на `.body`, `.body-wrap` видалено (сесія 39) |

## Етап 4 — Код 🟨

- [ ] Один модуль, init по `data-motion` атрибутах, кожна секція — окрема функція з guard'ом «є в DOM?»
- [x] Фарбування слів h1 Hero на скрол (сесія 49, ідея користувача): `initHeroTitle()` SplitText words, сірі → білі в порядку читання, `title-paint-run.mjs`, `f483a06`
- [x] Контроль швидкості скролу (сесія 48): `limitWheel()` — стеля «запасу» Lenis 1 vh / 0.5 vh у піні / 0.25 vh на краях пінів, без `anticipatePin` під Lenis, плавні кроки слайдера ≥992 (`d241a3a`); `scroll-flick.mjs`. Далі (на вибір користувача): м'який пін геометрією, тач
- [x] Lenis + ScrollTrigger інтеграція, `prefers-reduced-motion` — `initLenis()` (сесія 32): lenis 1.3.26, параметри лайву, лише миша/трекпад, тач нативний без `normalizeScroll`, reduce без Lenis; меню `stop()/start()`, якорі меню й футера `scrollToSection()`; `lenis-run.mjs` — колесо 1:1 з лайвом
- [x] Звук (ті самі mp3), gtag-події sound_on/off — `initSound()` (сесія 28); gtag спрацює після перенесення GA4 (етап 6)
- [ ] Прибрати jQuery-залежності з нашого коду (Webflow сам його вантажить, але ми не спираємось)
- [ ] Пінити версії: GSAP (✅ одна, 3.15.0 — сесія 32), Lenis (✅ 1.3.26 — сесія 32), Matter.js (✅ 0.20.0, lottie-web 5.13.0 — сесія 14). Splide і будь-які інші слайдери — прибрати, замінити на GSAP/IX3

## Етап 5 — Перформанс і QA ⬜

- [ ] Lottie-дієта: заміна простих на SVG+GSAP, dotLottie для складних, `not_real_time` → відео або dotLottie
- [ ] Відео: постери, lazy, один формат, без дублів під смуги
- [ ] Шрифти: self-hosted, `font-display: swap`, preload
- [ ] Lighthouse копії vs лайву
- [ ] Усі 4 смуги, Safari/Chrome/Firefox, тач
- [ ] SEO: title/description/OG/JSON-LD як на оригіналі; слаги звірити

## Етап 6 — Запуск ⬜

- [ ] OG-картинку Home перепривʼязати з файлу оригіналу на ассет копії
- [ ] CMS Lessons: `video-link-2` уроку easing — посилання в бакет оригіналу (s3 `6384fe1e…/64215be1…_Fly - Dashboard_H.264.mp4`), перезалити або очистити (сесія 36)
- [ ] Styleguide: Page settings → SEO → вимкнути «Sitemap indexing» (прибрати `/styleguide` з sitemap; `noindex` уже в head — сесія 37)
- [ ] (опційно) 301 у Site settings для 4 слагів `/lesson/*`, що не збігаються з id секцій — замість JS-заглушки шаблону
- [ ] Ще 2 жорсткі URL на бакет оригіналу: 2 постери в ембедах уроку easing (`Texture_01.png` пішов разом з `main-css`, сесія 31) (docs/asset-cleanup.md, хвиля 2)

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
- ~~Чистити невживані ассети копії~~ — так (користувач). Видалено 203 (320.5 MB), див. docs/asset-cleanup.md. Друга хвиля — дозволено (сесія 9), повторно перевірено в сесії 39: 64 до видалення (`Texture_01` тепер вживається); `delete_asset` блокує класифікатор — потрібне правило дозволу.

- ~~Тач-множник піну UI-слайдера ×3 на ≥992 (iPad landscape)~~ — ×1.5 (користувач, сесія 36): 11 065 px на блок при 1366.
- Хто й як деплоїть на Amazon CDN студії (доступ, процес)?
- Site plan: купити на новий сайт і скасувати старий — хто узгоджує в студії?
- ~~Чи є After Effects-вихідники Lottie?~~ — не потрібні: прелоадер переробляємо в код, решту Lottie оцінюємо по записах.
- ~~Splide лишати?~~ — прибрати, усі слайдери на GSAP/IX3 (рішення 2026-10-09).
