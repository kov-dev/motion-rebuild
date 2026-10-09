# Introduction

Доступ до Figma відновлено (сесія 4): get_metadata, get_screenshot, get_variable_defs, get_design_context працюють (сесійний ⛔ у docs/FIGMA.md застарів).

## Джерела
- Figma: `4608:23742` (секція `introduction`, 2984×5021). Усередині:
  - **`869:18299` «1.Introduction» 1440×3810** — єдиний кадр макета: статична композиція **одного стану** («кінцевий» вигляд, усі 4 плашки видимі одночасно, кулька на старті шляху). Розкадрування анімації НЕ намальоване.
  - 4 окремі плашки-варіанти `1`/`2`/`3`/`4` (x 694…2020, y 320, висота 112) — довідка розмірів плашок «It also» 273, «controls» 317, «your» 212, «attention» 343.
  - `Ellipse 378` 36×36 (`2062:28776`) + `Vector 523` 67×0 (`2062:28777`) — біла? кулька/кружок з рискою праворуч поза кадром (схоже на «ui-ball»/курсор-індикатор, у кадрі не використано; роль не підтверджена).
- Станів: **1** у цьому фреймі (UI-слайдер намальований в окремій секції `4609:22242` — див. розділ «UI-слайдер»; тут немає ні UI-слайдера, ні великих текстів «UI/UX animation…», ні 6 відео, ні станів падіння кульки). Є лише 1440-макет; **768 і 375 у Figma немає**.
- Лайв: `#introduction`, записи `reference/recordings/desktop/03-introduction.*` (29–78 с) і `mobile/…`.
- Приховані (`hidden`) шари в кадрі — чернетки: `Group 122` (41 концентричне коло 317→1665, розкриття-«чорний»), `черный` ellipse 1755, `Group 710` (старий варіант ілюстрацій, у ньому лише `Vector 302` 321×0 і `Group 623/627/621/624/626/116` видимі, але вся група hidden), `Sound`, `Item_scroll`. Не переносити.

## Структура (дерево з ролями; координати відносно кадру 1440×3810)
- Frame `1.Introduction` (bg `BG` #0C0B0B) ↔ `section.is-introduction` / `.intro-wrap`
  - `Header` (instance 1372×44 @34,34) — навбар (логотип-очі + «motion.ed» + «menu»), НЕ частина секції (Navigation)
  - `Ellipse 30` 18×18 @619,283 — кулька (`#anim-ball`/`.anim-ball.is-intro`), біла #FDFCFA
  - `Group 711` (`1076:29760`, 2513×3269 @-592,191) — **лінійні ілюстрації** (stroke ~1px, білі, без заливки/з заливкою BG для перекриття):
    - `Group 663` @-592,191: `sign` (труба `tube` 586×231 + вивіска `Vector` 840×360 @-32,436 з двома стійками, у лайві `.bg-visual`), `cloud-1` 1119×665 @-592,278
    - `stairs` 664×1019 @-92,808 (драбина в чаші)
    - `Group 661` @-410,2107: `balcony-2` 610×1288 @-299,2107 (будинок із замковою щілиною `key-hole` 191×434 + `eye` 102×102), `cloud-3` 812×421 @-410,3039
    - `hand` 1191×902 @-540,1439 (рука/палець)
    - `Group 712` @876,592: `balcony-1` 936×1849 (будинок: `balcony`, `star`, `door` 272×674) + `smoke` 382×398 @876,1122 («image 67 Traced» — чорний «сплеск»-ореол під плашкою controls)
    - `cloud-2` 671×400 @1227,1988
    - `flower-hole` 799×999 @759,2454: `hole` 799×659, `flower` 576×883 (стебло, 2 листки, око-«Intersect» 576×272 над квіткою)
  - Плашки `anim-shape` (bg #FDFCFA, rounded 100, px 40/py 24, текст 64/64):
    - `1` «It also» 273×112 @527,490
    - `2` «controls» 317×112 @901,1143 (всередині `smoke`)
    - `13` «your» ~240×203 bbox @462,1856 — **повернена ~+30° (по діагоналі пальця)**, текст 146×121 bbox; плашка 212×112 до повороту
    - `14` «attention» 343×112 @924,2534 (всередині ока `flower`)
  - `Group 36430` (`4608:23736`, 2211×770 @-410,3040) — **нижній ряд хмар** `cloud-3` / `Cloud-2` / `Cloud-1` / `Cloud-3` як boolean-union кіл (низ кадру, y 3040…3810), заливка BG + контур
  - `Item_scroll` hidden

## Токени, що зустрілись (Figma → значення)
- `BG` = `#0C0B0B` (фон кадру, заливка хмар/«чорних» перекриттів)
- `White` = `#FDFCFA` (плашки, кулька, лінії)
- `Desktop/H4-c` = PP Neue Machina **Inktrap Light** (300), 64px, line-height 64px, letter-spacing «-6» (Figma-%) = **-3.84px (-0.06em)**, колір #0C0B0B на плашці
- `Desktop/Navigation` = PP Neue Machina Inktrap Regular 16/16, ls -3% (Header; не секція)
- Плашка: padding **24 / 40**, radius **100**, fill White, `display:flex center`
- Кулька: 18×18, circle, White. Ліній-stroke: ≈1px, колір White (точна товщина/opacity з get_design_context не знімалась — вектори віддаються як SVG-ассети)
- Градієнтів, тіней, ефектів у видимих шарах немає

## Розкладка (px макета, rem = px/100)
- Один кадр **1440 × 3810**, `overflow` обрізає ілюстрації: ліві (cloud-1 x -592, hand x -540, cloud-3 x -410) і праві (balcony-1 до x 1921, cloud-2 до 1898) виходять за кадр — на лайві обрізаються краями секції (`overflow: hidden`/clip).
- Шлях кульки у Figma **не намальований** (є лише стартова точка 619,283 та ілюстрації уздовж діагоналі зигзагом: труба → драбина → рука → замок → будинок-«controls» → квітка). Реальний шлях — SVG `#vrtx` з лайву.
- Орієнтири відхилення від лайву: на лайві стартова позиція кульки `.embed-path .anim-ball.is-intro`: `top 3.3vw; left 35.7%` (desktop), `top 0; left 35.5%` (≤991). У макеті (619+9)/1440 = **43.6%** по X, y 283+9 = 292 (≈20vw) — **відрізняється**, але на лайві кулька приходить з Hero, тож береться лайв.
- **1440**: усе вище. **768 / 375**: макета немає. Лайв-запис mobile показує вертикальну композицію з тими самими ілюстраціями, меншого масштабу (html font-size 13.02vw ≤991 → 1rem = 13.02vw; 375 → 48.8px), плашки менші, шлях `embed-path_mobile`, «UI»-текст центрований по низу. Для ≤991 потрібні окремі макети або правило «масштаб від 1440 за vw» — питання нижче.

## Ассети
- Лінійні ілюстрації — **вектори Figma, експортуються як SVG** (get_design_context дає `…/asset/<id>.svg` для `balcony-1`, `image 67 (Traced)`, `Ellipse 30` тощо; 7 днів). Кандидати на окремі SVG-файли: `sign`(tube+вивіска), `cloud-1`, `stairs`, `balcony-2`(+key-hole+eye), `cloud-3`, `hand`, `balcony-1`, `smoke`, `cloud-2`, `flower-hole`(hole+flower), нижній ряд хмар `Group 36430`.
- **Але на лайві ілюстрації — не SVG-ассети Figma у нашому розумінні:** вони в `div.bg-visual`, `bg-wrap.is-bottom > bg-list-item.is-first/second/third` (хмари знизу), `anim-smoke` — це CSS-фони/картинки Webflow (треба підтягнути оригінальні ассети з Webflow, лайв = істина; Figma-експорт лише як резерв/звірка).
- **SVG-шлях кульки (`embed-path`, `_tablet`, `_mobile`, `#vrtx*`) — у Figma ВІДСУТНІЙ**, береться дослівно з Webflow-ембедів (`embed-path` `…8315d4/d5/d6`). Зупинки: desktop `[0.1477, 0.43367, 0.61329, 1]`, tablet `[0.12336, 0.37553, 0.53228, 1]`, mobile `[0.13847, 0.348, 0.5061, 1]` (script-map).
- Відео ×6 (`section-slide-video`), картинки слайдів UI — у Figma немає; з Webflow assets.
- Приховані концентричні кола `Group 122` — ймовірно прототип розкриття «чорне коло» (лайв робить `clip-path: circle()` на відео), як ассет не потрібні.

## Анімація (розкадровка Figma + лайв)
У Figma анімація **не розкадрована** (1 стан). Нижче — лайв (script.v33 блок C/D, GSAP+MotionPath), Figma дає лише кінцеві позиції плашок.
1. Скрол-вхід (тригер: прокрут Hero → `#introduction`, `scrub: 1`) → `#anim-ball` → MotionPath по `#vrtx*` у 4 сегменти (тривалості 4(8 мобайл)/7/18/14/27 + 8+8 bounce) → x/y по шляху. **Код** (MotionPath/обчислення, IX3 не вміє path-scrub).
2. Кулька торкається плашки по черзі → `.is-also/.is-controls/.is-your/.is-attention .anim-text` → `y: "100%" → 0` (`overwrite:true`; зворотний хід при скролі назад) → плашка «викочується» (на записі спершу порожня біла капсула, потім з’являється текст). Маска — `anim-text-wrap` overflow hidden. **Код** (прив’язано до позиції кульки на шляху; вхід у Figma показаний лише в фінальному стані). Тривалість/ease — частина scrub-таймлайну; окремого ease немає (scrub 1).
3. «your» повернена ~30° — сталий rotate на `.anim-shape.is-your` (CSS), не анімується.
4. Далі (UI-слайдер; у `4608:23742` НЕ показано, розкадровка є в `4609:22242` — див. розділ «UI-слайдер»): тексти `ui-text` h6 white («UI/UX animation captures the mood…», «Animation encourages interaction…»), 2× `.ui` pin, біле коло розростається в картку (`clip-path: circle(0.09rem → max(vw,vh))`, 0.7 с), слайди 25vw → 75vw, `.ui-ball` передача між блоками, idle-похитування ±1.5% (блок B, 4 с). **Код** (блок D).
5. Нижні хмари `bg-list-item` (is-first/second/third) — плавають/з’їжджають у `div.div-2` (єдиний IX2 секції) → **IX3 або код** (потрібне зчитування `ix2-summary.md`; у Figma руху немає).

## Розбіжності Figma ↔ лайв (лайв = істина)
- Figma `4608:23742`: 1 статичний кадр; лайв: таймлайн зі скролом, UI-слайдер, великі тексти, 6 відео — у цьому фреймі немає; UI-блок намальований окремо в `4609:22242` (див. розділ «UI-слайдер»).
- Шляху кульки (SVG `#vrtx*`) у Figma немає; стартова позиція кульки в макеті 43.6% / y 292, на лайві `35.7%` / `3.3vw`.
- Letter-spacing: у змінній `-6` (%) → -3.84px; не плутати з px.
- Макет лише 1440; 768/375 не намальовані.
- Плашки у Figma всі видимі одразу; на лайві з’являються по черзі (текст `y:100%` → 0), за вигляду «порожня капсула» до приходу кульки.
- Іменування: Figma `sign/tube/stairs/hand/balcony-1/2/cloud-1/2/3/flower-hole` ↔ лайв `bg-visual/bg-list-item.is-first|second|third/anim-smoke` — прямої відповідності немає, потрібна ручна розкладка.
- `Group 122` / `черный` / `Group 710` / `Sound` / `Item_scroll` — hidden чернетки; Header — зі секції Navigation.

## Питання до користувача
1. (Частково закрито: UI-слайдер є в `4609:22242`, див. розділ «UI-слайдер»; для 768/375 макета досі немає) Чи є окремий Figma-фрейм для UI-слайдера (`ui-wrap`: 2× `.ui`, 6 слайдів, великі тексти) і для 768/375? У `4608:23742` їх немає.
2. Ілюстрації брати з Webflow-ассетів (лайв) чи перевекторизувати з Figma (SVG-експорт з `get_design_context`)? Рекомендація: Webflow-ассети, Figma — звірка.
3. `Ellipse 378` 36×36 + `Vector 523` 67×0 поза кадром (x 2275 / 2353) — що це (ui-ball? індикатор скролу «⌖—»)?
4. Для ≤991: масштабувати ілюстрації від 1440 за vw (як лайв з rem=13.02vw) чи чекати окремі макети?

## UI-слайдер

### Джерела
- Figma: файл `KJQjG15P2P3SkXwrJJxLOp`, секція `4609:22242` («Section 130», 7252×8240) — 9 кадрів **1440×750** (десктоп; 768/375 немає). Усі кадри мають тіло «3_Animation and Navigation»; Header (1372×44 @34,34) і Sound (48×44 @1358,672, radius 26) — з Navigation, не частина слайдера.
- Розкадровка, 9 станів (порядок за сценарієм):
  1. `1106:31979` (@696,1884) — хмари знизу, кулька 18 @518,593; тексту ще нема.
  2. `1106:32404` (@696,2916) — хмари піднялись угору (кадр `Group 711` y -3225 — ілюстрації Intro), заголовок «UI/UX animation…» виїжджає знизу (текст y 511, обрізається краєм), кулька @518,336.
  3. `1106:32830` (@696,4034) — заголовок y 396 (повністю, 4 рядки), кулька @518,203.
  4. `1106:33256` (@696,5092) — заголовок на місці x 34; кулька 18 @1219,297 (літить праворуч).
  5. `1106:33573` (@2311,5092) — заголовок x -111 (поїхав ліворуч); кулька @1189,366.
  6. `1106:33889` (@3953,5092) — заголовок x -433; **біле коло Ø128 @812,311 (центр 876,375)** + друга кулька 18 @1328,366.
  7. `1609:23172` «-1» (@5595,5092) — слайд 1 «Gymlight/fitness» (білий 960×750 @0,0) + чорна смуга 480×750 @960; кулька у смузі.
  8. `1609:23526` «-2» (@5592,6039) — слайд 2 «game app / Paladin» (960×750 @0,0) + смуга 480 @960.
  9. `1057:45271` «-3» (@5592,6986) — слайд 3 «architects studio» (960×750 @480,0) + чорна смуга 480×750 @0 ліворуч; кулька в лівій смузі.
- Слайдів у макеті **3 із 6**; **блок 2 (`.ui` №2 з текстом «Animation encourages interaction…», слайди 4–6) не намальований**.
- Фрейми 7–9 містять скритий/позаекранний шар `Group 122` (41 концентричне коло 317→1665, `hidden`) і, у 7 і 9, `Group 121` 2463×3395 (повтор ілюстрацій Intro поза кадром) та старий текст «UI/UX animation helps convey the mood…» @x -1033 (за кадром, не переносити).

### Структура (дерево з ролями) і зіставлення з лайвом
- Кадр 1440×750, bg `BG` #0C0B0B ↔ viewport під pin (`.ui`, `height: 100vh`)
  - Заголовок (text 1064×320 @34,396, H6 74/80) ↔ `.ui-text > .text-wrap.is-animation > .h6.white`
  - Слайд (frame 960×750, fill White #FDFCFA, `overflow:clip`) ↔ `.ui-slide > .section-slide-wrap`
    - Підпис (text 628 × 24/48, центр 480, y 628 [слайд 2: 649]) ↔ `.section-slide-text > .p3`
    - Картка/відео 700×425 @130,163 (слайд 1: radius 8, border 1px black) ↔ `.section-slide-img-wrap > .section-slide-video > video`
  - Чорна смуга (frame 480×750) ↔ частина `.ui-slide`/сусідній згорнутий слайд (clip-path-крапка) і фон `.ui`
  - Кулька 18×18 White ↔ `.ui-ball` (єдиний, в `.ui.first`) / `#anim-ball`
  - Біле коло Ø128 (кадр 6) ↔ стан розкриття `clip-path: circle()` першого слайда
  - `ui-wrap`, `ui-track`, `ui-slider`, `section-track` — у Figma окремих шарів не мають (чистий розкадрований результат)

### Стани: що змінюється
| Кадри | Що змінюється |
|---|---|
| 1→3 | заголовок виїжджає знизу (y 511→396, обрізання краєм кадру); хмари-ілюстрації піднімаються; кулька 18 стоїть на x 518 (centre 527), y 602→345→212 |
| 3→4 | кулька на x 1219 (centre 1228, 306): перелітає праворуч до майбутнього слайда |
| 4→6 | трек їде ліворуч: заголовок x 34 → -111 → -433 (кроки -145, -322); кулька 18 → центр (1198,375) → (1337,375); у кадрі 6 коло Ø128 з центром (876,375) |
| 6→7 | коло розростається в слайд 1 (білий 960×750 @0,0), праворуч лишається чорна смуга 480; кулька в центрі смуги (≈1203,375) |
| 7→8 | слайд 2 замінює слайд 1 у тому самому місці (відео/підпис інші), смуга й кулька без змін |
| 8→9 | слайд 3 зсунутий на x 480, смуга 480 переходить ліворуч; кулька в центрі смуги (≈237,375) |
- Активний слайд завжди **960 = 2/3 vw**, сусід-смуга **480 = 1/3 vw**. Проміжних станів розкриття (радіус між Ø128 і повним) нема.

### Розміри (px макета; у Webflow /100 rem)
- Viewport/кадр 1440×750; слайд 960×750 (ширина 66.7vw, висота = viewport); смуга 480×750.
- Картка/відео 700×425 (співвідношення 1.647) @130,163 у слайді; підпис 628 завширшки, центр по x слайда, top 628 (слайд 2: 649); відступ підпис→низ 98 (кадр 750).
- Phone-мокап слайда 2: 232×467 @364,142 (контент відео, не верстається).
- Кулька 18×18 (0.18rem); коло розкриття у Figma Ø128 (r 64); центр кулі в смузі = центр смуги (x ±240 від краю), y 375 (50%).
- Заголовок: 1064×320 (4 рядки × 80), x 34 (0.34rem), нижній край 716 (кадр 750 → 34 від низу); текст виходить за ліву межу кадру при русі.
- Гепів/радіусів між слайдами немає (слайди встик). Radius: картка слайда 1 — 8; коло-кулька — 50%.
- Слайд має bg #FDFCFA; контент-відео має власну білу рамку/картку (частина відео).

### Розкриття `clip-path`
- Figma: стан лише один — біле коло Ø128 із центром (876,375) у кадрі 6 (= центр майбутнього слайда на 25-ти-%-ширині), потім миттєво повний слайд 960×750 (кадр 7). Проміжні радіуси не показано, easing не вказано.
- Лайв (script.v33, блок D): початок `.section-slide { clip-path: circle(0.09rem at 50% 50%) }` (CSS; r = 9 px при 1rem = 100px, тобто Ø18 = розмір кульки); кінець `circle(max(vw,vh)px at 50% 50%)` (при 1440×900 → 1440px), `duration 0.7`, `ease: none` (`revealSlide`); зворотне `hideSlide` — назад до `circle(0.09rem)` за 0.7 с. Відео: `alpha 0→1`, delay 0.1, 0.6 с, потім `video.play()`; при hide — 0.7 с до 0, `pause()`. Центр — завжди `50% 50%` слайда. Відео стартує з `opacity:0`.

### Відео
- 6 слайдів на лайві (`section-slide-video` ×6, CDN `cdn.zajno.com/dev/motion/videos/slider/optimise/`): `1_GYM+2x_H.264.mp4`, `2_Game-hevc-1.mov` (+`2_Game-hevc_VP9.webm`), `3_House_og.mov` (+`3_House_og_VP9.webm`), `4_Recycle_og_H.264.mp4`, `5_Music_og_H.264.mp4`, `6_Eyeloader_og_H.264.mp4`. Розмір кадру 1406×856 (1.642), 60 fps, до 3.8 Mbps (docs/assets.md). Слайди 1–3 у блоці 1, слайди 4–6 у блоці 2 (за home-tree: 1+2 і 3 — перевірити порядок у DOM).
- У Figma замість відео стоять **намальовані мокапи**: слайд 1 — сайт Gymlight (700×425, вектори/текст), слайд 2 — телефон «Paladin», слайд 3 — сайт «architects studio». Слайди 4–6 не намальовані. Підписи слайдів 1–3 збігаються з лайвом (тексти `p3`); слайди 4–6 — лише з лайву (дослівно): «Animation lets us hint at how to use sliders and other navigation elements.», «Animation guides the eye from one key visual element to the next.», «Animation unpacks all the visual information that the user sees on the screen.»
- Заголовки: лайв блок 1 «UI/UX animation captures the mood of a brand or product and conveys it to a target audience» (у Figma кінцева крапка є, на лайві немає); блок 2 «Animation encourages interaction by enticing users to explore» (у Figma немає).

### Токени
- `BG` #0C0B0B; `White` #FDFCFA.
- Заголовок: `Desktop/H6` — PP Neue Machina **Plain Regular** 400, 74/80, ls -4% (= -2.96px), uppercase, #FDFCFA. (лайв: клас `h6 white`)
- Підпис слайда: `Desktop/P3` — PP Neue Machina Plain Regular 16/24, ls -2% (-0.32px), center, #0C0B0B на білому (лайв: `p3`).
- Навігація (Header/Sound): `Desktop/Navigation` Inktrap Regular 16/16, ls -3%; border 1px #FDFCFA, radius 26, padding 14/16.
- Шрифти всередині мокапів (Inktrap Ultrabold 12, Plain 8, 11, 39…) — частина відео, не токени.

### Анімація
Рішення проєкту: слайдери — тільки GSAP/IX3, без сторонніх бібліотек; розрахунки — код. Весь блок = **код (GSAP+ScrollTrigger scrub)**, IX3 не підходить (scrub-pin з обчисленнями vw/vh і handoff кульки).
| Тригер | Ціль | Властивість | Тривалість / ease | Примітка |
|---|---|---|---|---|
| ScrollTrigger на кожному `.ui` (`top top`, `end +pinLength`, `pin`, `scrub:true`) | `.ui-track` | `x → -75vw` (≤991: -100vw) | 4 од., none | вхід треку; одночасно `.ui-slider marginLeft → 0`, `#hero .anim-ball-wrap x -=50vw` (desktop), `.ui-text` clipPath/сліди |
| той самий | кожен `.ui-slide` i | `width 25vw → 75vw` (мобайл 100vw), `alpha`, `revealSlide`/`hideSlide` | 4 од. scrub; reveal 0.7 с none; відео 0.6 с | початок `8·i` (мобайл `8·i+2`); передостанній слайд знову `→ 25vw` |
| middle-слайди | `.ui-track` | `x -= 75vw` (≤991: 100vw) | 4 од. + 4 пауза | крок на кожен слайд; останній: пауза 12 (8 мобайл), далі `x -= 25vw` |
| кінець блоку 1 (`top+=pinLength … +vh`, scrub) | `.ui-ball` | `y → ballDropY` (0.5vh+…+18), далі `x += 0.375vw`, `y += ballBounceY` (ease `bounceSmall`) | 0.45 / 0.7 / 0.7, none | кулька «падає» у блок 2 |
| Idle (блок B) | `.ui-slide` | `x ±1.5%` | 0.4 с ×4, none | підказка після 4 с бездіяльності |
- `pinLength` (desktop, k=.75, n слайдів) = `vw·k + vw·n·k + 0.5·vw·n + 0.25·vw` (n=3: 4.75vw ≈ 6840px при 1440; ×3 на мобайлі).
- Стартові стани слід перенести в CSS (`.ui-slide{width:25vw;height:100vh}`, `.ui-slider` margin, `.ui-wrap` margin-top) — у лайві їх ставить JS (script-map п.10).
- Макет не задає ні easing, ні тривалості (лише кінцеві стани) — все береться з лайву.

### Розбіжності Figma ↔ лайв (лайв = істина)
- Ширина активного слайда: Figma **960 (66.7vw)**, смуга 480 (33.3vw); лайв **75vw** активний, **25vw** згорнуті (при 1440: 1080 / 360).
- Початок розкриття: Figma показує коло Ø128; лайв стартує з r=0.09rem (Ø18, розмір кульки) — макет показує проміжний кадр, не старт.
- Блок 2 (слайди 4–6, заголовок «Animation encourages interaction…») у Figma немає; слайди 4–6 і всі 6 відео — лише на лайві.
- Крапка наприкінці заголовка блоку 1 є у Figma, немає на лайві; у Figma 4 рядки по 1064, на лайві ширина `ui-text` контейнера — уточнити по DOM.
- У Figma заголовок «поїхав» на x -433, лайв ця позиція = `-75vw` треку (−1080 при 1440); крок -145/-322/… у макеті — лише ілюстрація.
- Кулька в смузі: Figma — центр смуги 480 (x≈1203 / 237); лайв — центр першого `.ui-slide`/`.ui-ball` (формули landX, landY) — числа можуть відрізнятися.
- Макет тільки 1440; лайв ≤991 — слайд 100vw, track -100vw, пін ×3 — макета нема.

### Питання до користувача
1. Чи потрібен макет блоку 2 (слайди 4–6, заголовок «Animation encourages interaction…») і мобільні/планшетні стани, чи робимо за лайвом та масштабом від 1440?
2. Ширина слайда 66.7vw (Figma 960/480) чи 75vw/25vw (лайв)? Рекомендація: лайв (75/25), Figma — як ескіз.

## Збірка в копії (сесія 9, 2026-10-09, головна сесія)

Home копії, `main` → **`section-intro`** (`d320b4f4-8f76-79fa-a9ef-f7d30f54e19d`) одразу після `section-hero`, перед
старими Hero й Introduction. Старий `#introduction` лишається, поки на staging його тягне `script.v33`. `id` секції
поки не ставимо (дубль `introduction` неможливий), він переходить разом із підключенням `motion.js`.

```
section.section-intro          data-motion="theme" data-theme="dark"     semantic: dark (на класі)
├─ div.intro-scene             data-motion="intro"      relative; тригер Intro для initHero/initIntro
│  ├─ div.intro-art            aria-hidden              relative, margin-bottom −30.81 / −19.08 / −11.54rem
│  │  ├─ div.intro-illustration                         100% × 32.7 / 20.59 / 12.45rem, фон path_main_* (3 SVG)
│  │  ├─ div.intro-clouds                               abs bottom 0 / −.72rem
│  │  │  └─ div.intro-cloud + is-left / is-right / is-middle    фони cloud_1/2/3 (+_tablet, _mobile, Footer_Cloud-3_mobile)
│  │  ├─ div.intro-smoke                                фон smoke.svg
│  │  └─ div.intro-shape + is-also / is-controls / is-your / is-attention   semantic: base (біла пігулка)
│  │     └─ div.intro-shape-mask (overflow hidden)
│  │        └─ div.text-shape  data-motion="intro-text" data-step="0..3"   «It also» / «controls» / «your» / «attention»
│  ├─ HtmlEmbed.intro-path                  ┐ невидимий SVG-шлях, задає висоту сцени (5.03 × 34.98rem)
│  ├─ HtmlEmbed.intro-path.is-tablet        │ path[data-motion="intro-path"][data-bp="desktop|tablet|mobile"]
│  └─ HtmlEmbed.intro-path.is-mobile        ┘ канон src/intro/path-{desktop,tablet,mobile}.html
└─ div.ui-stage                                         margin-top calc(1.6rem − 50vh) / −50vh, overflow hidden
   └─ div.ui-block ×2          data-motion="ui"         relative, 100% × max 100vh (pin)
      ├─ div.ui-rail           data-motion="ui-track"   flex, max-content, align center / flex-start
      │  ├─ div.ui-heading     data-motion="ui-text"    75vw, pl .32rem / 100vw центр, translateY(50%)
      │  │  └─ h2.ui-title                              74/80, 44/54, 24/32, uppercase (літерали)
      │  └─ div.ui-slides      data-motion="ui-slides"  flex / margin-left −100vw
      │     └─ div.ui-panel ×3 data-motion="ui-slide"   25vw / 100vw, clip-path circle(.09rem)
      │        └─ div.ui-panel-body (+ is-first: opacity 0)   100vh, flex column, gap .4rem, semantic: base
      │           ├─ div.ui-media > HtmlEmbed.ui-video        4.25 / 2.01rem; <video data-motion="ui-video">
      │           └─ div.ui-caption > p.body-sm               6.4rem / auto / px .4rem
      └─ div.ui-dot            data-motion="ui-ball"    лише в першому блоці, opacity 0
```

**Рішення (агент, карт-бланш):**
- **Імена `ui-*` інші, ніж у чернетці** (`ui-stage`, `ui-block`, `ui-rail`, `ui-heading`, `ui-slides`, `ui-panel`,
  `ui-panel-body`, `ui-media`, `ui-video`, `ui-caption`, `ui-dot`). Причина: `ui`, `ui-wrap`, `ui-track`, `ui-text`,
  `ui-ball`, combo `ui-slide` / `ui-slider` уже є в копії, і `script.v33` на staging шукає їх селекторами. Перейменування
  в чернеткові імена можливе після видалення старої секції, але не обов'язкове.
- **`ui-track` + `section-track` злиті в `ui-rail`**, `ui-text` + `text-wrap.is-animation` — у `ui-heading`, `bg-wrap` +
  `bg-list` — в `intro-clouds`. Розкладка та сама (перевірено).
- **JS-розкладку лайву перенесено в CSS** (script-map баг 10): `ui-wrap` marginTop (+½ висоти заголовка = 1.6rem на
  десктопі), слайди 25vw, `ui-slider` margin-left −100vw на ≤991. Стартові стани — у класах: `clip-path` панелей,
  `opacity 0` першої панелі блоку і кульки.
- **Тексти пігулок видимі без JS і в Designer**: стан `y: 100%` ставить `initIntro()` (`gsap.set`), а не клас. Секція
  під першим екраном, тож блимання немає. Виняток з правила «стартові стани — у класі», як і гейт прелоадера.
- **SVG-шляхи без `id="vrtx*"`**: `getElementById` старого скрипта знайшов би наш шлях першим у DOM. Прив'язка — лише
  `data-motion` + `data-bp`. `stroke="currentColor"`, `opacity: 0` інлайн, як на лайві.
- **Відео**: `preload="none"`, без `autoplay` (на лайві `autoplay="false"` вмикав автоплей), `width`/`height` — реальні
  пропорції (1406×856, слайд 2 — портрет 468×938), `opacity: 0` інлайн. Джерела 1:1 з лайвом (`cdn.zajno.com`), пари
  `.mov`/`.webm` лишаються до перекодування на етапі 5. Канон — `src/intro/ui-videos.html`.
- **Заголовки слайдера — `h2`** (після `h1` у Hero), вигляд не змінився.
- **Текстові стилі виправлено за лайвом:** `text-shape` → шрифт `font-display` (Plain, як на лайві; Inktrap був з
  Figma), ls `−0.007rem` (−0.7px у всіх смугах, як на лайві; було −0.06em з Figma); `body-sm` lh medium **1.85**
  (24/13), tiny **1.385** (18/13); `body-sm.is-strong` medium lh **1.5**, щоб не успадкувати 1.85.

**Звірка.** Staging без нової секції (публікувати не можна), тож як у Hero: локальна фікстура
[tools/record/fixtures/intro.html](../../tools/record/fixtures/intro.html) (CSS staging + значення класів, прочитані
назад) проти лайву, [tools/record/intro-compare.mjs](../../tools/record/intro-compare.mjs), 1440 / 768 / 375. Сцена,
пігулки, шлях, заголовок, панель, підпис — Δ 0–1 px. Очікувані розбіжності: висота секції (pin-spacer'и лайву), тексти
пігулок (на лайві стартовий `y: 100%`), хмари (на лайві стартовий стан паралаксу IX2, +3rem / +2rem), ширина відео до
`loadedmetadata` на лайві (300 px — фолбек браузера; після метаданих 698×425 / 330×201, як у нас). Знімки:
`reference/snapshots/2026-10-09-intro-{1440,768,375}-live-vs-new.png`.

## План анімації (сесія 9) — `initIntro()`

Усе в коді (MotionPath і pin із обчисленнями — не IX3). Числа з script-map блок C/D і IX2 `a-127`/`a-156`.

**1. Вихід Hero** — ✅ `initHero()` у `src/motion.js`: точковий ScrollTrigger на `[data-motion=intro]`,
`start = end = top−(висота hero-axis) center`; вниз лінії `scaleX 0` 1 с → кільце `scale 0` 0.5 с; вгору навпаки;
ease за замовчуванням (power1.out), `overwrite: true`. Прогнано на розмітці staging з фікстурою
([tools/record/hero-exit-run.mjs](../../tools/record/hero-exit-run.mjs)).

**2. Кулька по шляху (MotionPath)** — ✅ `initIntro()` (сесія 10), див. «Анімація в коді» нижче. План сесії 9:
- Плагін `MotionPathPlugin` з того ж `gsap@3.13.0` (піновано). Кулька — `[data-motion=hero-ball]` (у Hero); `align: path`
  переносить її в координати шляху незалежно від DOM.
- Шлях — `path[data-motion=intro-path][data-bp=band()]`, бокс — його `<svg>`-обгортка (`intro-path`). Зупинки:
  desktop `[0.1477, 0.43367, 0.61329, 1]`, tablet `[0.12336, 0.37553, 0.53228, 1]`, mobile `[0.13847, 0.348, 0.5061, 1]`.
- Тексти: `gsap.set([data-motion=intro-text], { yPercent: 100 })` на старті; кінець сегмента i → `yPercent: 0` текст
  `data-step=i`, зворотний хід — назад до 100 (`overwrite: true`), як на лайві.
- Таймлайн: `scrollTrigger { trigger: intro, start: 'top center', end: desktop ? 'bottom+=<½ ui-heading> center' :
  'bottom center', scrub: 1, invalidateOnRefresh: true }`, `ease: 'none'`. Сегменти: падіння `y += dropY` (4 / 8 моб),
  далі шлях 7 / 18 / 14 / 27 (`curviness: 2`, `alignOrigin [.5,.5]`). `dropY` = desktop `0.033·vw + pathTop`, інакше
  `pathTop` (`pathTop` = `offsetTop` боксу шляху в `intro-scene`).
- Desktop: + 8 од. bounce (`CustomEase bounce` з src.js) `y += landY` і одночасно `x += landX` у центр першої
  `ui-panel`. Усі `landX/landY/dropY` — функції (баг 6 лайву: числа читались раз на load).
- Передача: `onComplete` ховає кульку Hero й показує `ui-panel-body.is-first` першого блоку; `onReverseComplete` навпаки.
- Скидання sticky Hero (`hero-ball-sticky y 0`, `hero-ball-wrap y 50%`) на вході/виході — як `resetHeroBallSticky`.

**3. UI-слайдер (блок D)** — окремий прохід `initUi()` після MotionPath: pin на кожен `ui-block` у порядку DOM (баг 7),
довжина `vw·k + vw·n·k + 0.5·vw·n + 0.25·vw` (k .75 / 1, ×3 моб), трек `x −75vw / −100vw`, панелі 25→75vw з
`clip-path circle(.09rem → max(vw,vh))` 0.7 с і відео `opacity` 0.6 с + `play()/pause()`, кулька `ui-dot` між блоками
(`bounceSmall`). «Ручний sticky» кульки Hero в `onUpdate` лайву (новий `gsap.to` на кожен кадр) замінити одним
`gsap.quickSetter` або `ScrollTrigger` з `scrub`. Idle-похитування (блок B): власний таймер 4 с замість `ifvisible`.

**4. Хмари (паралакс IX2)** — ✅ **кодом** у `initIntroClouds()` (сесія 10). План сесії 9: `intro-cloud` `y` від `+3rem` (tiny `+2rem`) до `0` (середня — до `1.3rem` / `0.8rem`) на
відрізку 78→100 % проходу `intro-art` через в'юпорт (IX2 «scrolling in view», smoothing 80). Без обчислень, тож **IX3**
(scroll scrub) або 1 рядок ScrollTrigger у `initIntro()` — вирішити в проході анімації; на користь коду — одна система
з MotionPath.

**5. Reduced motion:** кулька одразу в кінці шляху, тексти видимі, хмари без руху, pin слайдера лишається (контент).

## Анімація в коді (сесія 10) — `initIntro()` + `initIntroClouds()`

Канон — [src/motion.js](../../src/motion.js). Прогін — [tools/record/intro-run.mjs](../../tools/record/intro-run.mjs):
staging з фікстурою замість `section-intro`, старі `script.v33` / Lenis / GSAP 3.10 заблоковані, 12 точок прогресу
таймлайна на 1440 / 768 / 375, ті самі точки на лайві.

**Результат звірки:** кулька Δ ≤ 1 px від лайву в усіх 36 точках, від шляху 0–1 px; тексти відкриваються в тих самих
точках; хмари Δ ≤ 0.01 rem; посадка точно в центр першої панелі (1440: 1260,450; ≤991 — кінець шляху = центр панелі),
там кулька Hero ховається, крапка панелі з'являється; скрол назад — тексти закриті, кулька на осі Hero. Помилок модуля
немає (`Splide is not defined` — інлайн-скрипт staging, бо Splide заблоковано). Кадри:
`reference/snapshots/2026-10-09-intro-anim-{1440-p30,375-p15}-live-vs-new.png` (ліворуч лайв).
Звірка з записом `03-introduction.mp4` замінена детермінованими кадрами лайву в тих самих точках прогресу (запис іде
з Lenis-інерцією, точного скролу на кадр у ньому немає).

**Рішення (агент, карт-бланш):**
- **Шлях без `align`.** Лайв вирівнював шлях до кульки один раз при завантаженні, коли sticky Hero стояв на іншому місці
  (працювало лише тому, що сторінка стартувала зі scrollTo(0,0)). У нас `motionPath.matrix` = `getScreenCTM()` шляху
  мінус «точка спокою» кульки: центр кульки без власного transform, коли sticky вже відпущений на дні `section-hero`.
  Рахується з розкладки, не залежить від поточного скролу; перераховується на кожен refresh (`invalidateOnRefresh`).
- **Падіння й посадка — абсолютні `fromTo`, не `+=`:** на refresh посеред секції відносні значення накопичувались би.
  Падіння = в початок шляху (на десктопі це той самий `0.033·vw + pathTop`), посадка = центр першої `ui-slide`
  (природна позиція: pin-spacer / офсети, без transform треку і pin).
- **Кінець таймлайна** — `endTrigger: перший ui-block, end: 'top top'`, тобто рівно старт pin слайдера на всіх смугах
  (на лайві дві різні формули давали те саме).
- **Тексти й передача кульки — від `tl.time()` в `onUpdate`**, а не `onComplete`/`onReverseComplete` окремих твінів:
  стрибок скролу, перезавантаження посеред секції чи refresh не лишають «застряглих» текстів. Анімація тексту як на
  лайві: `yPercent 100 ↔ 0`, дефолтні 0.5 с / power1.out, `overwrite`.
- **Передача:** кулька Hero `visibility: hidden` (opacity належить входу прелоадера), `ui-landing` (тіло першої панелі
  блоку, клас `is-first`) `opacity 1`.
- **Хмари — код, не IX3:** один ScrollTrigger на `intro-art` (`top bottom → bottom top`, як IX2 «scrolling in view»),
  таймлайн 100 од. з порожніми 0–78 і рухом 78–100, `scrub: 1` замість smoothing 80; +3rem → 0 (задня → 1.3rem), ≤767:
  +2rem → 0 (0.8rem). Причини: IX3 підвантажує власний рантайм GSAP заради одного ефекту, не вміє стартовий стан через
  API, reduced motion у коді вже є.
- `gsap.matchMedia()` по смугах: desktop ≥992 / tablet 480–991 / mobile ≤479 — кожна смуга має свій шлях, зупинки й
  тривалість падіння (4 / 8). Reduced motion: тексти видимі, кулька передається одразу на `top center`, хмари стоять.

**Нові ролі в копії** (прочитано назад): `intro-art` на `intro-art`, `intro-cloud` на 3 хмарах (`data-layer="back"` на
`is-middle`), `ui-landing` на двох `ui-panel-body.is-first`.

**Пастка:** `gsap.matchMedia().add({умови}, fn)` не викликає `fn`, якщо **жодна** умова не збіглась — перелічувати всі
смуги (у хмарах спершу була лише `small` + `reduce`, і на десктопі нічого не рухалось).

**Для `initUi()`:** після посадки (playhead scrub: 1 відстає від скролу до ~1 с) pin слайдера вже йде. Лайв тримав
кульку «ручним sticky» — новий `gsap.to` на кожен `onUpdate`. У нас: у таймлайні pin одним твіном
`hero-ball-sticky y: 0 → −pinLength` (scrub: true, лінійно) — компенсує скрол точно, без лагу.
