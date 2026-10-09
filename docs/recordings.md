# Записи лайву — еталон анімацій

Записано 2026-10-09 (сесія 3) з https://motion.zajno.com/. Файли лежать у
`reference/recordings/` і **не комітяться** (`.gitignore`). Щоб відтворити,
перезапиши їх скриптами нижче.

## Як записано

Chrome-розширення не було підключене, тому записи зроблено через **Playwright +
справжній Google Chrome** (`channel: 'chrome'`, бо в Chromium без
пропрієтарних кодеків mp4-відео сайту не грають). Це не `gif_creator`, а
справжнє відео з реальним таймінгом. Як еталон таймінгу воно краще.

- Рекордер `record.mjs <desktop|mobile> <px за крок>`. Він відкриває сторінку
  й чекає 8 с на hero (прелоадер у кадрі), потім скролить колесом, по кроку
  кожні 50 мс, і логує момент, коли верх кожної секції перетинає середину
  в'юпорта. Мобільний режим: 375×812, `isMobile`, `hasTouch`, iPhone UA, тож
  скрипт сайту йде мобільною гілкою (`normalizeScroll`, без Lenis).
- `cut.py <mode>` ріже `full.webm` на кліпи по секціях (H.264, CRF 26, ±0.5 с)
  і робить контактний аркуш `*.sheet.png` (до 30 кадрів, 6 у ряд).
- Скрипти: [tools/record/](../tools/record/). Запуск: `npm i playwright@1` у
  будь-якій тимчасовій папці, скопіювати туди скрипти, `node record.mjs desktop 40`.
  У `cut.py` шлях призначення жорстко вказує на `reference/recordings/<mode>`.
- Швидкість: десктоп 40 px / 50 мс ≈ 800 px/с, мобайл 30 px / 50 мс ≈ 600 px/с.
  Для pin-секцій (Intro, Interactive, Resources) цього достатньо, щоб бачити
  фази. Для покадрового розбору конкретної анімації краще писати окремий
  повільний кліп.

## Desktop 1440×900 — `reference/recordings/desktop/`

Повний прохід 207 с. `load` на 15.2 с (стільки висить прелоадер).

| Кліп | Від–до, с | Що видно |
|---|---|---|
| `01-preloader` | 0–18 | біла сцена → кулька стрибає над лічильником 0→100 → слова MOTION / DESIGN / PRINCIPLES: велике коло на кожному слові та інверсія фону чорне↔біле → вихід у темний hero |
| `02-hero` | 15–30 | темний фон, горизонтальна лінія з кулькою в кільці по центру, текст «UI/UX animation emphasizes…», потім великий «Good animation also makes the whole user experience more memorable and exciting.» |
| `03-introduction` | 29–78 | кулька падає й котиться SVG-шляхом крізь лінійні ілюстрації (труба, драбина, хмари, рослина); плашки-підписи «It also / controls / your / attention» вилітають по ходу; великі тексти «UI/UX animation captures the mood…», «…encourages interaction…»; **UI-слайдер**: біле коло розростається в картку зі скріншотом (fitness, game app, architects studio, light-hub, «Principles of animation»), картки розширюються/стискаються, кулька передається між блоками |
| `04-interactive` | 77–85 | світла секція, заголовок INTERACTIVE, горизонтальний трек з трьома колами; у колах сфера Matter.js (чорні кулі), «Real-time / Not real-time»; вихід — плашки INTERFACE / ANIMATION |
| `05-techniques` | 84–91 | слова-плашки, зірки, текст |
| `06…13-lesson-*` | 90–187 | 8 уроків: кольорові фони, крихта в навбарі, Lottie-схеми, відео-приклади. У easing — Splide зі схемами linear/ease/ease-in і стрілками, «Let's look at an example» з біжучим рядком, Art gallery з таймлайном, «Implementation examples» (горизонтальна стрічка карток), «An example from classic animation» (кіноплівка й машинки) |
| `14-resources` | 186–200 | pin: стрілки → трек → списки CMS |
| `15-footer` | 199–207 | хмари футера, IX2 scroll-progress |

| `16-nav-menu` | окремий запис | меню: відкриття (`#menu-toggle`), темна сцена з 10 картками-ілюстраціями (Introduction, Easing, Offset and delay, Fade in/out, Transformation/morph, Masking, Dimension, Parallax, Zoom, Courses & sources). На hover картка заливається кольором уроку, лінійна Lottie-ілюстрація грає; трек їде горизонтально. Внизу «Site by Zajno» й соцмережі. Закриття повертає hero |

`timeline.json` поруч з кліпами містить сирі таймкоди й межі кліпів. У меню
таймкоди лежать окремо, у `16-nav-menu.timeline.json`.

## Mobile 375×812 — `reference/recordings/mobile/`

Повний прохід 210 с. `load` на 1.3 с, але прелоадер (лічильник ~5 с → слова
MOTION / DESIGN / PRINCIPLES) іде до ~9 с. Кліпи названо так само, як на
десктопі (`01-preloader` … `15-footer`).

Що відрізняється від десктопу:
- немає Lenis, скрол нативний + `normalizeScroll`;
- Intro довше (y 1231 → 16861), SVG-шлях `_mobile`;
- бургер замість «menu», Techniques — плашки по діагоналі над хмарами.

### ⚠️ Баг лайву: стрибок скролу назад на мобайлі

`bug-scroll-jump.mp4` (67–76 с запису). На вході в Techniques (y ≈ 18 870)
сторінка стрибає назад на y ≈ 12 145, у середину Intro: чорний екран із
кулькою. Після цього користувач ще раз прокручує ~6 700 px. Відтворилось двічі
однаково (прогони до й після перепідключення мережі). На десктопі такого
немає.

Імовірна причина — баг №7 з [script-map.md](script-map.md): pin Resources
створюється ліниво на вході в `.is-lessons`, а створення pin + `refresh` під
`normalizeScroll` збиває позицію. Записано в емуляції (Playwright, iPhone UA,
синтетичне колесо), тому треба перевірити на реальному телефоні. У перезбірці
це закривається тим, що всі pin'и створюються одразу, у порядку DOM.

## Що ще не записано

- Hover-стани: стек картинок у Resources, картки «Implementation examples»,
  саунд-кнопка (зі звуком — записується без аудіо).
- Tablet 768 (окремі Lottie й SVG-шлях `_tablet`).
- Повільні кліпи pin-секцій для покадрового розбору — робимо в проході секції.
