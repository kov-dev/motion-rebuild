# Lessons (8 уроків)

## Джерела
- Figma: файл `KJQjG15P2P3SkXwrJJxLOp`. Обгортка користувача `4611:22250` (section «lesson-easing», 11591×4283) містить **лише урок 1 (easing)**, лише смуга **1440** (15 фреймів, 768/375 немає). Уроки 2–8 — окремі фрейми 1440 з FIGMA.md (поза обгорткою).
- Лайв: `#lessons` (`section.section.is-lessons`, 8× `section.nav.nav-color`), записи `reference/recordings/desktop/06…13-lesson-*`.

| node-id | Що | Розмір |
|---|---|---|
| `1553:20458` | 5.1 Easings — **довгий кадр** (hero + «Let's look» + блок Ex/Progress + Implementation) | 1440×3826 |
| `1553:21218` | 5.1 hero, стан Linear (підпис + риска під колом) | 1440×750 |
| `1553:21472` | hero, стан Ease (Easings x=-125) | 1440×750 |
| `1553:21726` | hero, стан Ease-in (x=-500) | 1440×750 |
| `1553:21980` | hero, стан Ease-out (x=-878) | 1440×750 |
| `1553:22234` | hero, стан Ease-in-out/«Cubic» (x=-1258) | 1440×750 |
| `1553:22523` | «Let's look at an example» (Easings 2), зірки + текст внизу | 1440×750 |
| `1553:22657` | те саме, текст зсунуто (x=-1429) — кінець скрол-тексту | 1440×750 |
| `1889:29421` / `1889:29450` | «Missing easing & delay» 1-0 / 1-1 (1-1 = + бабл About) | 1440×750 |
| `1889:29480` / `1889:29509` | «Correct easing» 2-0 / 2-1 | 1440×750 |
| `1889:29539` / `1889:29568` | «Correct delay & animation» 3-0 / 3-1 | 1440×750 |
| `2062:28778` | Ellipse 379 (службовий, 42×42, поза кадрами) | 42×42 |
| `1553:25009` / `25410` / `25740` / `26064` / `26391` / `27065` / `27397` | Уроки 2–8 (delay, fade, morph, masking, dimension, parallax, zoom) | 1440 × 2077 / 2166 / 2055 / 2021 / 2031 / 2023 / 2227 |

Токен-імена кадрів: «Offset and Delay», «Fade in Fade Out.», «Transformation/Morph.», «Masking», «Dimension», «Parallax», «Zoom».

## Спільна структура уроку (дерево з ролями)
Довгий кадр уроку = колонка 1440 (фон = колір уроку), абсолютне позиціонування, зверху вниз:
- `lesson` (bg = токен уроку) — спільне для 8:
  - Header (fixed-елементи кадру, ті самі що на всіх секціях): лого-«очі» 2×(44×46) x=34 + пілюлі `motion.ed` (x=132) і `Menu` (x=1300, 1266 від 34) — bg кольору уроку; пілюля-крихта поточного уроку x=250 y=34 (h44, назва уроку lowercase); прихована темна пілюля «Animation and navigation» y=-96 x≈605 (над кадром, bg #0C0B0B, border #FDFCFA); `Scroll down` x=34 y=672 (h44, іконка 12×12 + текст); `Sound` x=1358 y=672 (48×44, іконка 16×16).
  - **hero-animation**: 2 зірки `Star 5/6` 80×80 x=-40 і x=1400 (напів-обрізані по краях); по центру — ілюстрація (див. нижче; в easing — карусель кіл).
  - **hero-content**: номер (`label-1.is-lesson`) x=132; заголовок H4 x=250, w490; опис P2 x=820, w488 — усі три на одному y (easing y=486 у довгому кадрі; 2–8 y=516).
  - (лише easing) splide / Examples / progress — див. нижче
  - **Implementation examples**: H3 по центру (x=103, w1235, h288, 2 рядки «Implementation / examples»), 3 картки-інстанси 727×546.
  - 3 картки: x=34 / 793 / 1552 (ступінь 759), y зі зсувом (хвиля): easing 3222/3372/3097; в уроках 2–8 картки 1 і 2 зсунуті, 3-тя завжди y=1761 (дублює реальну позицію в кадрі).
- Hero-ілюстрація — окрема в кожному уроці (easing: 5 кіл; 2–8: геометрична фігура/групи чорним #0C0B0B).
- Поверхневі елементи кадру, що **не** є частиною секції (Header, Sound, Scroll down, крихта) — навігація сайту; на лайві це fixed `nav`.

## Урок 1: easing

### Hero (довгий кадр y=0…~1150; стани 750-кадрів)
- Фон `lesson-easing` `#C8CFE8`. Номер «1» (x=132), заголовок «THE BASICS OF EASING» (uppercase, x=250, w490, 2 рядки, 74/80, ls -2.96), опис x=820 w488 (P2 18/32): «In nature, the speed of movement is never linear: objects gain speed as they begin to move, and slow as they come to a halt. Easing is the technique that allows us to convey this.» Верх тексту y=486 (довгий кадр, = 10%+103); в 750-кадрі y=23.
- Зірки 80×80 на x=-40 / x=1400, y=217 (довгий кадр) / 13.
- Груп `GR` 273×218 x=583 y=148 (довгий кадр) — декор над заголовком (вектор Vector 294, 273×215); у 750-кадрах відсутній.
- **Схеми easing («Easings»)** `1553:22800`: flex row, gap 32, 5 кіл 345×345, x=250 y=686 (довгий) / y=223 (750), повна ширина 1853. Коло: border 1 #0C0B0B, radius 1000, без заливки. Всередині: підпис знизу (P2 Inktrap 18/32, центр, у 5 кіл: Linear, Ease, Ease-in, Ease-out, Ease-in-out); `GR` крива (inset 29.28% / 24.93% / 31.3%) + чорна крапка-ellipse (ім'я Ellipse 280). Лінійне коло в стані 1 має осі (x/t, кружечок-початок) і лінію 45°; інші — лише крива.
  - Порядок кіл у DOM Figma-компонента: Linear, Ease, Ease-in (`EaseIn2`), Ease-out (`EaseIn1`), Ease-in-out (`EaseIn`).
- **Стрілки каруселі**: `Group 8695` (ліва, 84×84 x=118 y=353) і `Group 8694` (права, x=1322 y=353); коло 84, права — чорне коло з білою стрілкою (активна), ліва — контур зі стрілкою.
- **Підпис вибраного**: P2 w570 x=250 y=624 під колом; риска `Vector 306` 2×32 x=422 y=568 (зʼєднує коло з текстом). 5 текстів:
  1. Linear: «With linear easing, the object travels at a constant speed, without acceleration or deceleration.»
  2. Ease: «Here the object accelerates slightly at the beginning and decelerates slightly at the end»
  3. Ease-in: «Starts its movement slowly, but accelerates as it continues.»
  4. Ease-out: «The opposite of ease-in - starts moving quickly and then slows down smoothly at the end.»
  5. Ease-in-out («Cubic»): «Cubic is similar to ease, but due to longer periods of acceleration and deceleration, the middle part of the path appears to pass more quickly.»
- Стани каруселі (кадри 21218…22234): активне коло має товсту обводку (≈2px, підпис підкреслений) на x=250 (лівий слот), решта 1px; `Easings` зсувається вліво: x=223→-125 (Δ-348)→-500→-878→-1258 (крок ≈ 377 = 345+32, окремі кроки ≠ рівні: 348/375/378/380 — не видно, чи інтерпретація Figma, чи ручне вирівнювання).

### «Let's look at an example»
- Рядок scrolling-text: H1 215px (lh normal, ls -8.6, uppercase), центр на x=1451.5, w≈2835 (виходить за кадр, обрізається) y=1531 (довгий) / 482 (кадр 22523). Текст «Let's look at an example».
- Над ним ряд з 5 контурних зірок-«ромбів» `Star` frame 1371×364 x=34 y=1151: 5 векторів 274×274, x=34/309/583/857/1131, y зигзаг 1425/1515 (чергування odd/even зсув ≈ 90). Контур 1px #0C0B0B, без заливки.
- Кадр 22523: зірки y=94, текст y=482; у кадрі 22657 текст зсунуто на x=-1429 (скрол горизонтально ≈ 1429 за секцію).

### Example-відео + progress (темний блок)
- Фон блоку: прямокутник 1440×750 #0C0B0B (y=1784 у довгому). У ньому:
  - `Ex` (макет сайту «ART GALLERY») 940×500, x=250 y≈1904 (120 у 750-кадрі), bg `#FDFCFA`, radius 24. Це мокап (nav 10px, адреса, лого, лінія-«змійка» з іменами художників під кутами, великий заголовок «ART GALLERY» 120/110 Light, ls -2.4, стрілки 45×85 по боках). У лайві це `example-video-1…6` (відео ×3 вʼюпорти) — Figma показує лише мокап-кадр.
  - `Progress` 1174×54 x=133 y=2446 (662 в 750-кадрі): 3 заголовки P3 16/24 ls -0.32, центр (#514F4F у компоненті на світлому; у темному стані — білий/сірий): «Missing easing & delay», «Correct easing», «Correct delay & animation»; під ними лінія `Union` (шкала з мітками). Активний пункт світлий, решта приглушені.
  - `About` бабл 147×147 x=1117 y=169 (над правим верхнім кутом мокапу, накладається): кругле, bg `Easing-Cl` `#AAB8EB` (стан 1-1 для 2-го: інший колір), іконка 39×32 зверху + P (13/17, ls -0.26, центр) знизу.
- Стани (6 кадрів): 
  - 1-0 `1889:29421`: Progress 1-й пункт активний, лінія заповнена до ~1/4 (≈ 220px), бабл відсутній; мокап світлий (`#FDFCFA`, внутрішні блоки `#E4E8F5`-подібні — не видно точний).
  - 1-1 `1889:29450`: бабл «Bad animation, objects move too linearly.» + мініграфік лінійної залежності; мокап **без** easing.
  - 2-0 `1889:29480`: 2-й пункт активний.
  - 2-1 `1889:29509`: бабл «Objects have dynamics and weight.» (іконка easing-крива).
  - 3-0 `1889:29539`: 3-й пункт; 3-1 `1889:29568`: бабл «Delay separates blocks from each other» (бабл фіолетовий #D2C8E8-подібний, іконка «гамбургер» 3 смуги; колір на скріншоті ≈ `lesson-delay`).
  - Кольорова вставка мокапу: у стані 1 — блакитна (`lesson-easing`), у стані 3 — ліловa (`lesson-delay`) — тобто теми мокапу змінюються разом зі станом.

### Implementation examples
- H3 «IMPLEMENTATION / EXAMPLES» 140/144, ls -5.6, uppercase, центр x=720.5, w1235, 2 рядки (Implementation, examples). y=2734 (довгий).
- 3 картки 727×546 (`.card-link`): зовнішній контур border 1 #0C0B0B radius 19; медіа-блок: inset 7.69% 6.19% 25.81% 6.19% (≈ 633×≈ 300, радіус 12 у 1-й, у 2/3-й радіус не видно), border 1; текст P3 16/24 ls -0.32 inset 79.66% 18.29% 12.14% 6.19% (w≈548); кнопка `Button-a` справа: «View» 16/24 + стрілка 12×24, gap 8, inset 79.66% 6.4% 16.24% 85.21%.
- Підписи easing: (1) «Ease-in/ease-out can also be applied to camera movements and transformation of interface objects.» (2) «Wonder at how smoothly our text content glides into view!» (3) «Here, we can see how the guide will be used in the appearance of content, in the animation of icons, and the animation of visuals.» (2 рядки, фіксований розрив після «appearance »).
- Позиції (довгий кадр): 1: x=34 y=3222; 2: x=793 y=3372; 3: x=1552 y=3097 (виходить за правий край 1440 — картка №3 за кадром, горизонтальний скрол/«list-wrap»).

### An example from classic animation
- **У Figma-фреймі 1553:20458 відсутній** (кадр закінчується Implementation). Лише лайв (home-tree: `classic-anim_wrap` з H2 «An example from classic animation», sideimg left/right, `a-lesson-item` ×3, текст «Slow in and slow out»). Дизайн-референс — не знайдено.

## Уроки 2–8: відмінності
Спільне для всіх: bg = токен уроку (хедер/Sound/Scroll-down/крихта беруть той самий bg), чорні #0C0B0B контури, шрифти як в easing (H4 74/80 заголовок, P2 18/32 опис, H3 140/144 Implementation, P3 16/24 підписи). Блоків Splide/Examples/Progress немає.

| # | node | Колір (токен) | Номер / заголовок (у кадрі) | Опис (P2, x=820 w488) | Ілюстрація hero | Висота | y заголовка | Implementation H3 y |
|---|---|---|---|---|---|---|---|---|
| 2 | `1553:25009` | `#D2C8E8` (lesson-delay; в Figma «Offset») | «2» / «Offset and Delay» (2 рядки: «Offset » / «and Delay») | «A slight delay between two or more objects creates a feeling of softness and multi-layered movement. This technique also helps to direct the user's attention, indicating an objects's place within a hierarchy of elements.» | 3 горизонтальні чорні пілюлі 200×40 radius 100, x=620 (вертикально 3 шт, `Group 566` 200×168, x=620 y=173) | 2077 | 516 | 806 |
| 3 | `1553:25410` | `#E4E8C8` (lesson-fade) | «3» / «Fade in Fade Out» (2 рядки) | «Fade-in, fade-out is the appearance and disappearance of an object via a transition from transparency to opacity. The most widespread and versatile technique … Where several objects appear on a single screen, it is best also to add some delay.» (2 абзаци, w488 h320) | 3 прямокутники 155×198 radius 32 `EX` (x=463/642/821, y=158): 1 і 3 контур, 2 залита #0C0B0B | 2166 | 516 | 934 |
| 4 | `1553:25740` | `#C8E8E8` (lesson-transformation; Figma «Transfor-mation») | «4» / «Transform & Morph» (2 рядки; нав-пілюля «Transformation / Morph») | «A technique for transforming one object (say, a round icon) into another (for example, a large square picture). This creates continuity and holds the viewer's attention on a key object from one screen to another – particularly effective for storytelling.» | чорне коло 64×64 (radius 500) x=688 y=225 | 2055 | 516 | 838 |
| 5 | `1553:26064` | `#E8C8E5` (lesson-masking) | «5» / «Masking» (1 рядок, h80) | «Similar to morph, masking lets us use the morphic object as a mask for photography. The photo in the mask can scale, move, or spin – creating a feeling of softness and spaciousness in movement.» | чорне коло 64×64 (border 0.75) x=688 y=222 всередині контурного прямокутника 346×198 radius 32 x=547 y=155 | 2021 | 516 | 806 |
| 6 | `1553:26391` | `#E8C8C8` (lesson-dimension; Figma «Skale») | «6» / «Dimension» | «Of the various ways we can convey volume, the most popular is Floating Dimensionality. This technique makes interaction with objects intuitive and narrative, enriching the experience of using the site or application.» | `Frame 104` 346×198 radius 32 (overflow clip, контур) з 3 чорними плитками 133×165 radius 30, x=-40/106/252 (кроки 146; крайні виходять за кадр) | 2031 | 516 | 806 |
| 7 | `1553:27065` | `#D6E8C8` (lesson-parallax) | «7» / «Parallax» | «Arranged in layers, several objects pass simultaneously through x and y axes: the farther the object, the less it passes. The result is a feeling of space.» | `Group 657` 284×130 (x=578 y=195): 3 квадрати (130 центральний, 104×104 по боках) + 2 кола 43×43 — векторна група (експорт SVG Group 655) | 2023 | 516 | 774 |
| 8 | `1553:27397` | `#C2D5D7` (lesson-zoom) | «8» / «zoom» (нижній регістр у макеті; uppercase стиль) | «This technique brings continuity to narrative and lets us achieve a smooth transition between interface, objects, and destinations. / Zoom also adds depth and informs users about additional content that is out of sight.» (перенос рядка) | чорний ромб-квадрат 90×90 radius 24, повернутий -45° (bbox 127×127, x=656 y=257) | 2227 | 516 | 1037 |

Підписи 3 карток (ліва, середня, права). Права (3) в усіх: «Here, we can see how the guide will be used in the appearance of content, in the animation of icons, and the animation of visuals.» — **плейсхолдер/однаковий у всіх 8**.
| # | Картка 1 | Картка 2 |
|---|---|---|
| 2 delay | «Here, content elements appear one by one, adding softness to the movement and creating the impression of viscosity.» | «Having the visual elements arrive one at a time gives each of them a chance to shine and makes the whole effect more engaging.» |
| 3 fade | «Here we see text appearing under a mask before fading out and disappearing.» | «Here, a fade-in, fade-out animation of both opacity and position brings life to a text box.» |
| 4 morph | «Here, the photo container smoothly changes its shape.» | «Here, two combinations of transformation and masking, as the small photo expands into the larger one.» |
| 5 masking | «Here, masking causes the photo to slightly shift within its container. The technique works well in tandem with transformation.» | «Here, once again, a photo gently shifts within its container.» |
| 6 dimension | «Here, an animation of a ship sailing away into the distance creates an illusion of space. Reinforcing this, the text follows in the ship's wake.» | «Here, the ability to leaf through a box of records is used to create a feeling of depth.» |
| 7 parallax | «As the matte translucent object with the chart and other information moves upwards, the cards underneath it subtly shift position. This 'parallax effect' supports the main 3D visualization.» | «A classic use of parallax sees an in-focus foreground move in relation to the out-of-focus scenery beyond – just like the view the runner sees.» |
| 8 zoom | «Zoom lets us communicate depth, lends continuity to narrative, and helps immerse the viewer in the site.» | «Here we get the feeling not of moving page to page, but of a smooth, continuous experience.» |

Нотатки:
- Позиції карток: у 2–8 дві картки зсунуті по y унікально для кожного кадру (1: y=H3+488; 2: +150 від 1-ї; 3: завжди 1761); хвилеподібне розташування по вертикалі, w727 крок 759, 3-тя виходить за правий край (x=1552 > 1440).
- Картка 1 в easing та morph має `rounded-[12px]` на медіа-блоці (overflow hidden) — решта без радіуса: непослідовно, ймовірно артефакт Figma.
- У 4 (morph) 1-ша картка має порожній 2-й абзац (зайвий перенос).
- Hero-ілюстрація 2–8 — тільки статичний кадр-стан; лайв використовує Lottie (`hero-visual`), у 6 — відео dimension_hevc.mov.
- Усі 7 фреймів: немає блока «An example from classic animation» (ні для delay) — лише лайв.
- Висота кадру ≈ hero(≈ 900) + H3 + картки; відрізняється через y H3 (залежить від висоти опису: 160 → 806, fade 320 → 934).

## Токени, що зустрілись
- Кольори уроків: `lesson-easing #C8CFE8`, `lesson-delay #D2C8E8` («Offset»), `lesson-fade #E4E8C8`, `lesson-transformation #C8E8E8`, `lesson-masking #E8C8E5`, `lesson-dimension #E8C8C8` («Skale»), `lesson-parallax #D6E8C8`, `lesson-zoom #C2D5D7` — збіг із design-system §8. Чорний `BG #0C0B0B` (= tex/контур), `White #FDFCFA` (мокап Ex, пілюля крихти в темному блоці).
- Новий (лише в мокапі/баблі): `Easing-Cl #AAB8EB` (бабл About), `#514F4F` (Progress заголовки у світлому варіанті компонента). Прогрес-бар темна лінія: `neutral-800` `#3D3C3C` — на лайві; у Figma-кадрі лінія світліша/сіра, точне значення не видно.
- Текстові стилі: Desktop/H1 215/lh100/ls-4 (Let's look); H3 140/144 (Implementation); H4 74/80 (заголовок і номер); P2 Inktrap 18/32 (опис, підписи кіл); P3 16/24 ls -2% (картки, progress); Button-A 16/24 (View); Navigation Inktrap 16/16 (пілюлі, lowercase). Фактичний ls у px: H1 -8.6, H3 -5.6, H4 -2.96, P3 -0.32, Navigation -0.48.
- Радіуси: картка 19, медіа 12, Ex 24, пілюлі 25.5/26, кола 1000/500, плитки dimension 30, фігури hero 24/32.

## Розкладка (1440 / 768 / 375)
- 1440: колонка 1440, абсолютне позиціонування в Figma → в Webflow flex/grid. Ліва колонка тексту: номер x=132, заголовок x=250 (w490), опис x=820 (w488), відступи ≈ 570 між заголовком і описом. Hero-схеми: row з 5×345 кіл gap 32 (ширина 1853), на екрані видно ≈ 3.5 кола. Картки Implementation: 727×546, крок 759, зсув по y.
- 768 / 375: **в обгортці `4611:22250` відсутні** (лише 1440). У FIGMA.md заявлено «по 1440/768/375», але для уроків 768/375 тут не знято; еталон ≤991 — лайв.

## Ассети
- SVG у Figma (експорт не робили): зірка `Star 5` 80×80 (+ `Star` ряд 1371×364 з 5 ромбів), `GR` 273×218 (декор над заголовком easing), криві easing `Vector 294–298` + крапка `Ellipse 280` (5 кіл), стрілки `Group 8694/8695` 84×84, іконки пілюль (teenyicons sound-on 16×16, `Group 634` меню 14×8, `Vector 9` стрілка 12×12), лого очі `Group 547/548` 44×46, `Frame 88` стрілка «View» 12×24, мокап `Ex`: `Union`/`logo`/`Vector 472–478`/`Frame 117–118`, `Progress` `Union` (шкала), `About` фон `Property1=Variant2` + `GR`.
- Lottie/відео/зображення у Figma — немає (лише статика). У лайві: 8 hero-Lottie, 5 Splide-Lottie (linear.json…), 6 example-відео ×3 вʼюпорти, відео карток (3×8) + постери, classic-anim відео (easing, delay). Усе беремо з Webflow assets (home-tree.md).

## Анімація (розкадровка з Figma)
- Hero easing (5 кадрів 21218…22234): карусель кіл `Easings` зсувається вліво на ≈ 348→375→378→380 px/крок; активне коло завжди зліва (x=250), товстіша обводка + підкреслений підпис + риска-зʼєднувач 2×32 + текст-пояснення під ним. Стрілки: права (чорна заповнена) активна; лівa — контурна (на першому слайді). Яка саме стрілка заповнена на інших кадрах — не видно.
- Перехід hero → «Let's look» (22523 → 22657): зірки y=94 нерухомі, великий H1-текст їде горизонтально вліво на 1429 px (x: 34→-1429) — scroll-linked scrolling-text.
- Example (1-0…3-1): Progress-пункт активується послідовно, шкала заповнюється; бабл `About` зʼявляється в стані x-1; мокап «ART GALLERY» (відео) змінює «погану» анімацію → «з easing» → «з delay». Тривалості/ease не видно.
- Implementation: картки заходять знизу з хвилею (різні y) — лише статика; рух не видно.
- 2–8: hero — один статичний кадр на урок.

## Розбіжності Figma ↔ лайв (за home-tree.md; лайв — істина)
- Figma-фрейм easing не містить `classic-anim_wrap` (An example from classic animation) — лише лайв; delay теж.
- Example-блок на лайві = 6 відео (`example-video-1…6`) і 3 пункти progress; у Figma 6 станів 1-0…3-1 (по 2 на пункт) — збігається по кількості (пункт × 2 стани), але відео мокап одного вигляду.
- Splide: у лайві 5 слайдів ×(label + 2 Lottie active/not-active + text1), `hero_left/hero_text` дублює опис — у Figma окрема схема: підпис під колом + риска; кола — чисті вектори, Lottie немає.
- Стрілки: на лайві `splide__arrow` кнопки в `splide__arrows`; у Figma — окремі 84×84 SVG-групи (чорна/контурна).
- Hero-ілюстрація 2–8 у Figma статична (фігури); на лайві Lottie `hero-visual` (у 6 — відео mov).
- Картки: у лайві `card-video` + `img.card-video-img` (постер); Figma — порожня рамка 633×~300 (без прев'ю).
- Текст картки 3 в усіх уроках — однаковий плейсхолдер (у лайві перевірити фактичні тексти; не звірено).
- Заголовок delay: Figma «Offset and Delay», fade: «Fade in Fade Out», morph: «Transform & Morph» (крихта «Transformation / Morph»), dimension «Dimension» — звірити з лайвом `h4` (у home-tree обрізано).
- У таблиці дизайн-системи колір delay має Figma-ім'я «Offset», dimension — «Skale»; в нашому токен-неймінгу беремо `lesson-delay`/`lesson-dimension`.

## Питання до користувача

Питань немає. Ті, що поставив субагент, закриває правило «за розбіжності береться лайв» (CONVENTIONS, сесія 5), а лайв-заміри
нижче відповідають на решту (сесія 17, агент):
1. 768/375 уроків — з лайву (у Figma їх для уроків немає).
2. «An example from classic animation» — з лайву (у Figma блока немає).
3. Мокап «ART GALLERY» міняється разом зі станом, бо це **6 різних відео** (`example-1…6.mp4`, по 2 на пункт progress), а не анімація.
4. Тексти 3-ї картки — з лайву: там вони різні в кожному уроці, у Figma стоїть плейсхолдер.
5. Стрілки слайдера схем — як на лайві: коло 84 / 54 / 40 (1440 / 768 / 375), неактивна має колір уроку з темною стрілкою, активна темна зі стрілкою кольору уроку.

## Лайв-заміри

Зонд `tools/record/lessons-probe.mjs` (сесія 17) має частини struct / scan / splide і режим `RANGE` для тонкого скану. Лайв
motion.zajno.com, смуги 1440×900, 768×1024 і 375×812 (мобільні з iPhone UA). Сирі файли лежать у scratchpad і не комітяться:
`lessons-struct-<vp>.json` (дерево стилів усіх 8 уроків), `lessons-scan-<vp>.txt` (крок vh/3), `lessons-splide-<vp>.txt`.

### Геометрія (висота уроку, px)

| | easing | delay | fade | morph | masking | dimension | parallax | zoom | `#lessons` |
|---|---|---|---|---|---|---|---|---|---|
| 1440 | 11615 | 4809 | 3475 | 3347 | 3315 | 3347 | 3315 | 4247 | top 25836, h 37469 |
| 768 | 9044 | 3820 | 2735 | 2663 | 2615 | 2639 | 2591 | 4687 | top 37088, h 30794 |
| 375 | 8090 | 4102 | 3123 | 3027 | 2963 | 2963 | 2915 | 3775 | top 20264, h 30958 |

- Урок = `section.nav.nav-color#<id>` > `.lesson.is-<id>`. Фон береться з `extra-lesson-*`, padding-top 118 у easing і 88 в решти
  (1440). Уроки йдуть один за одним, без перекриття. Хмари `resources-clouds-list` стоять наприкінці і мають h 0.
- **Hero уроку** (`lesson-item`): `hero-animation` (flex space-between, h 278 / 300 / 180) = зірка 80 (виходить за край на −40) +
  `hero-visual` 1280×200 / 688×200 / 327×200 + зірка. Далі `hero-content` з margin-top 120 / 58 / 58 і padding 0 132 / 0 59 / 0 22.
  У ньому номер (`label-1`) 74/80 −3px · 40/54 −1.6px · 36/40 −1.4px, заголовок h4 тим самим стилем (w 490 / 248 / 248, mr 80 на
  1440) і опис `p2` 18/32 Inktrap (x 820, w 488 на 1440). На 375 hero-content стає колонкою, опис з padding-left 34.
- **Схеми easing** (`splide-container`, лише easing): margin-top 74 / 60 / 32, padding-left 250 / 56 / 56, overflow hidden. Кола
  345 / 345 / 228, крок 377 / 377 / 252 (gap 32 / 32 / 24). Риска 2×32 під активним колом (margin-left 174 на 1440). Текст
  `hero_wrap` w 570 / 650 / 298. Стрілки — `splide__arrows` absolute (top 130 на 1440), space-between, padding 0 34 / 0 32 / 0 22.
- **Examples** (easing): `lesson-item.is-examples` h 1800 / 511 / 427, у ньому `sticky-container` sticky top 0 (h 702 / 471, на
  375 **не sticky**). Там ряд 5 зірок 274 / 180 / 165 (парні з margin-top 90) і рядок «Let's look at an example» 215/220 −9px
  (`display-xl`), ширина 2816 на 1440.
- **Демо** (easing): `nav-inner.nav-dark` фон `#0C0B0B`, h 3600 / 4096 / 3248. У ньому sticky top 0 на весь в'юпорт, мокап-відео
  1014×500 / 688×395 / 323×200, під ним `example-progress-bar` (3 пункти + лінія `#3D3C3C` 1px). Відео — 6 ембедів × 3 теги
  (`is-desktop/tablet/mobile`, перемикаються CSS у `main-css`).
- **Implementation** (усі 8): `lesson-item.is-implementation` h 2700 / 2048 / 2436 (у zoom `is-last` 3600 на 1440). Його
  `sticky top 0` нічого не дає, бо це останній блок списку. Далі `title-wrap` (padding 180/0/60 · 340/0/60 · 200/0/40) з h3 140/144
  −5px · 78/88 −2.4px · 40/44 −1.2px. Головне — `sticky-container` sticky top **102 / 194 / 160** з margin-bottom −vh, що дає pin
  карток на 1800 / 1517 / 2071 px. Картка `card-link` 532×515 / 424×431 / 316×364: padding 32/32/0 · 24/24/0 · 20, r19, рамка 1px
  `#0C0B0B`, медіа 468×267 r16 (рамка 1px). Gap 55 / 40 / 20. Стартові зсуви — у CSS лайву: картка 2 y 150, картка 3 y 300
  (лише 1440).
- **Classic** (easing, delay): `classic-anim_wrap` h 2272 / 1462 (1440). Бічні «кіноплівки» `classic-anim_sideimg` 162×vh sticky
  top 0 (50 px на 375, радіус 76 / 32), центр 1116 з фоном `extra-classic-*` (`#AAB8EB` easing, `#BDB1D7` delay). Заголовок h2
  Magilio 115/126 · 64/74 · 36/40, 2–3 пари відео 640×410 r24 і текст у `a-lesson-item_sticky` (sticky top 60 / 60 / 100). Шум
  `::before` (Texture_01.png, opacity .2, keyframes `noise` 0.2 с) лише на 1440.

### Медіа

- **Lottie** (Webflow, svg-рендерер, усі `autoplay` + `loop`, грають завжди, навіть поза екраном). 7 hero-ілюстрацій
  (`1_easing_visual` 100 кадрів / 30 fps, `delay` 55, `Fade_in_out` 75, `Morph` 105, `Masking` 136, `Parallax` 100, `8_zoom` 100) +
  **10 у слайдері схем**: на кожну схему 2 копії одного json (`linear`, `ease`, `ease_in`, `ease_out`, `cubic`; 140–141 кадр / 60 fps).
  `.active` (loop) видно на активному слайді, `.not-active` (на паузі, кадр 0) — на решті. Перемикає CSS `main-css`.
- **Dimension**: замість Lottie — ембед `<video>` `dimension_hevc.mov`, loop і muted, без preload.
- **Відео**: 46 тегів. 24 у картках (3×8, `preload="none"`, без autoplay, loop і muted), 18 у демо (6×3 смуги, `preload` metadata
  або none), 3 у classic і 1 у dimension. Грає їх Finsweet `autovideo` (у в'юпорті — play, поза ним — pause). Постери є лише в
  classic, у картках поверх відео стоїть `img.card-video-img`. Ширина відео карток 471×268 (1440).
- **Посилання карток** ведуть на Dribbble/YouTube (24 штуки, `href` у struct-json), не на сторінки сайту.

### Тексти (лайв, звірено)

Номер / h4 / крихта: 1 THE BASICS OF EASING / «The Basics of easing» · 2 OFFSET AND DELAY (h4 з розривом) / «Offset and Delay» ·
3 FADE-IN FADE-OUT / «Fade in Fade Out» · 4 TRANSFORM & MORPH / «Transformation/Morph» · 5 MASKING / «Masking» · 6 DIMENSION /
«Scale» · 7 PARALLAX / «Parallax» · 8 ZOOM / «zoom». Тексти карток узято з лайву (Figma: картка 3 — плейсхолдер), повністю —
у struct-json. Їх буде перенесено в пропси під час верстки.

### Слайдер схем (Splide 2.4.21 → замінюємо)

- Конфіг лайву: `perPage 3, perMove 1, fixedWidth 3.45rem, gap 0.32rem, focus 0, type slide, speed 600, trimSpace false`. На ≤991
  perPage 2, на ≤479 ширина 2.28rem і gap 0.24rem. Свайп мишею й пальцем (`draggable`).
- Клік «next» зсуває список на −377 px (−252 на 375) за 600 мс. Крива — дефолт Splide 2 `cubic-bezier(.42,.65,.27,.99)`: за 211 мс
  59 %, за 315 мс 85 %, за 421 мс 96 %. Клас `is-active` перемикається одразу, Lottie active / not-active теж (opacity, без
  переходу). Текст `.hero_text` міняється **миттєво через 400 мс** (setTimeout, jQuery `.text()`).
- 4 кроки до кінця (x 0 → −1508). На останньому `next` disabled, ліворуч від треку видно попередні кола (overflow контейнера —
  лише по краю секції). Неактивна стрілка: фон кольору уроку, іконка темна.

### Скрол-анімації (IX2, усі `smoothing 90`)

Прогрес IX2 через верх тригера `top` (px від верху в'юпорта): **старт** — `top = vh`, якщо `startsEntering`, інакше
`top = max(vh − h, 0)`. **Кінець** — `top = −h·(1 − endOffset/100)`, якщо `addEndOffset`, інакше `top = −h`. Формулу перевірено на
трьох смугах (marquee, demo, implementation, classic): розбіжність ≤ 1 % прогресу.

| Тригер | Події (смуги) | Старт / кінець | Ключі |
|---|---|---|---|
| `lesson-item.is-examples` | e-668 (main, medium) · e-669 (small, tiny) | entering ні, end 80 / 50 | 1440/768: рядок x 0 → −104 % (0–80 %), зірки odd y 0 → 0.9rem, even → −0.9rem. ≤767: x → −130 %, зірки ±0.54rem (0–100 %). На 1440 рядок проїжджає всього за ~290 px скролу (h 1800, кінець 80 % → −360), далі sticky ще ~800 px стоїть |
| `nav-inner.nav-dark` (демо) | e-670 (усі) | entering ні, end 20 | 6 відео: opacity-сходинки на 16–18 / 34–36 / 51–52 / 67–69 / 83–84 %. Лінія `progress-bar_line-active` 16.7 → 33.3 → 50 → 66.6 → 83.4 → 100 % (стрибками в тих самих точках). Мітки поділок h 0 → 100 %. Заголовки пунктів `#3D3C3C` → `#FDFCFA` на 34–36 і 67–69 % |
| `lesson-item.is-implementation` | e-672 / 680 / 686 / … (main) | entering так, end 26 | title scale 1 → 0.6 (23–32 %). Картка 2 y 1.5rem → 0 (32–42 %), картка 3 y 3rem → 0 (38–48 %; стартові значення — у CSS). Список x 0 → −40 % (50–84 %) |
| те саме | e-671 / 678 / … (medium) | entering ні, end 50 | title 1 → 0.6 (0–24 %), картка 2 y 1.5rem → 0 (24–50 %), список x 0 → −122 % (45–100 %) |
| те саме | e-673 (easing: small + tiny) · e-679 / 687 / … (2–8: **лише tiny**) | entering так, end 26 | title 1 → 0.6 (23–30 %), картка 2 y 1.5rem → 0 (30–44 %), список x 0 → −178 % (48–74 %). **Баг лайву:** на 480–767 у уроках 2–8 карток не рухає ніщо, тож трек стоїть |
| `classic-anim_wrap` | e-674 (easing) · e-681 (delay) | entering так, без end | фон обгортки й `overlay-bg` (над implementation) прозорий → `#000`: easing 18–24 %, delay 24–30 %. Так кадр «кіноплівки» опиняється на чорному |

- **Sticky — лише CSS** (ScrollTrigger-pin-ів в уроках немає): examples, демо, контейнер карток, кіноплівки, текст classic.
- **Навбар** (блок I `script.v33`): на вході уроку (`top top+1px`) лого й `menu` фарбуються в колір уроку (`getComputedStyle`
  крихти), крихти видно, видно одну — з індексом уроку. На демо (`nav-inner.nav-dark`) навбар темніє й крихти ховаються, після
  виходу колір уроку повертається. Звукова кнопка перемикається на лінії `bottom−90px`. Переходи 0.4 с. На 375 крихти не видно
  (0×0).
- **Hover карток** (CSS у `main-css`): `.card-link` з рамкою 0.02rem `#0C0B0B` (transition 0.3s linear) і підкресленням «View».

## План компонента lesson-section

**Межа компонента.** Спільне для 8 уроків: hero (номер, заголовок, опис, ілюстрація, 2 зірки) і Implementation (h3, 3 картки).
Блоки easing (схеми, examples, демо) й classic (easing, delay) — одноразові. Тому вони йдуть у **слоти**, а не в пропси з
перемикачами видимості. MCP уміє все потрібне: `data_component_props_tool` (типи `id`, `string`, `textContent`, `richText`,
`image`, `link`, `boolean`), `data_component_variants_tool` (стилі на варіант) і `data_component_builder` (`insert_in_slot`).

```
lesson-section  (компонент; <section> + id-проп; data-motion="lesson" data-theme="color")
  lesson-hero
    lesson-visual         ×1  data-motion="lesson-visual" data-src={visual src} data-kind={lottie|video}
    lesson-star  ×2       (is-left / is-right)
    lesson-head
      lesson-number       {Number}       heading-md
      lesson-title (h2)   {Title}        heading-md
      lesson-desc         {Description}  body-md (rich text: у fade 2 абзаци)
  slot «Extras»           easing: lesson-schemes, lesson-examples, lesson-demo
  lesson-cases            data-motion="lesson-cases"
    lesson-cases-title (h3)  heading-xl (статичний текст «Implementation examples»)
    lesson-cases-pin      (sticky top 102 / 194 / 160)
      lesson-cases-track  data-motion="lesson-track"
        lesson-card ×3    (a, {Card N link}, + is-second / is-third)
          lesson-card-media  data-motion="lesson-video" data-src={Card N video}; img {Card N poster}
          lesson-card-text   {Card N text}  body-sm
          btn is-link        «View» + іконка
  slot «After»            easing, delay: lesson-classic
```

- **Варіанти (8)**: `easing` (база), `delay`, `fade`, `morph`, `masking`, `dimension`, `parallax`, `zoom`. Варіант задає
  `background-color: extra-lesson-<id>` на корені. У zoom варіант ще змінює висоту `lesson-cases` (лайв `is-last`: 3600 і без
  margin-bottom −vh у пін-контейнері). Колір навбар бере з фону секції, тож крихта не потрібна.
- **Пропси** (`id` + 15): `Section id`, `Number`, `Title`, `Description` (rich), `Visual src`, `Visual kind`, для кожної з 3 карток
  `link`, `text`, `video src` і `poster` (image). Атрибути `data-src` / `data-kind` прив'язуються до string-пропсів. Якщо прив'язка
  атрибута до пропа через MCP не працює, запасний варіант такий: ці атрибути ставить код за `id` уроку з таблиці в `motion.js`.
- **Відео**: замість трьох `<video>` на смугу — один тег, `src` вибирає код через `matchMedia` (`data-src`, `data-src-tablet`,
  `data-src-mobile` у демо). Програвання в в'юпорті — власний IntersectionObserver замість Finsweet `autovideo`. Lottie
  вантажиться ліниво (`lottie-web` 5.13.0, як в Interactive) і грає лише в в'юпорті.
- **Блоки-слоти** — звичайні елементи, не компоненти (по одному вживанню). Винятки: `lesson-classic` (×2: easing, delay) робимо
  компонентом з варіантом кольору й пропсами (заголовок, 2–3 тексти, 3 відео з постерами).
- **Класи** (префікс `lesson-*`, нові імена; старі `lesson`, `lesson-item`, `card-link`, `hero-*` зайняті й живуть на старій
  секції, читає їх `script.v33`, тож не чіпаємо): `section-lessons` (обгортка всіх 8 + хмари), `lesson-section`, `lesson-hero`,
  `lesson-visual`, `lesson-star`, `lesson-head`, `lesson-number`, `lesson-title`, `lesson-desc`, `lesson-cases*`, `lesson-card*`,
  `lesson-schemes*`, `lesson-examples*`, `lesson-demo*`, `lesson-classic*`. Текстові стилі вже є (`heading-md` = h4 74,
  `heading-xl` = h3 140, `heading-lg` = h2 Magilio, `display-xl` = рядок 215, `body-md`, `body-sm`). Tab/mob lh/ls `heading-md`,
  `heading-lg` і `body-md` звірити з лайвом під час верстки (вони ще в списку PLAN).
- **Семантика**: на лайві уроки — `h4`/`h3`/`h2` впереміш. У нас заголовок уроку — `h2`, «Implementation examples» і «Let's look
  at an example» — `h3`, заголовок classic — `h3`. Вигляд не міняється.
- **Порядок верстки**: (1) `section-lessons` після `section-techniques` + компонент з hero й cases на прикладі easing, звірка з
  лайвом; (2) 7 інстансів з пропсами й варіантами; (3) слоти easing (схеми, examples, демо); (4) `lesson-classic` ×2. Звірка —
  `lessons-compare.mjs` за зразком techniques-compare (нова секція проти старої на staging, 3 смуги). Це щонайменше 2 сесії.

## План анімації

**Усе на коді (`initLessons()` у `src/motion.js`), IX3 не беремо.** Причина та сама, що в Techniques (сесія 15): тригери стоять
нижче pin-ів Intro, Interactive і Resources, а IX3 рахує позиції окремо від нашого ScrollTrigger і після refresh pin-spacer-ів
з'їжджає. Hover карток лишається станом Designer (рамка, підкреслення), не IX3.

| Що | Як у коді | Числа |
|---|---|---|
| Implementation ×8 | один builder на `[data-motion=lesson-cases]`, `gsap.matchMedia` (≥992 / 480–991 / ≤479), таймлайн зі `scrub: 1` (smoothing 90, як у Techniques). Старт і кінець — функції за формулою IX2 вище | ключі з таблиці. На 480–767 беремо tiny-ключі для всіх 8 уроків (виправлення бага лайву) |
| Examples (easing) | scrub-таймлайн рядка й зірок | старт `max(vh − h, 0)`, кінець `−h·0.2` (≥768) / `−h·0.5` (≤767). Короткий проїзд 1440 лишаємо 1:1 |
| Демо (easing) | ScrollTrigger на `lesson-demo` з `onUpdate` → індекс стану 0–5 за порогами 17 / 35 / 51 / 68 / 84 % (кінець `−h·0.8`): видно одне відео, лінія прогресу й заголовки — клас-стан, CSS-перехід 0. Грає лише активне відео, решта на паузі | пороги з IX2. Сходинки 1:1, без плавності |
| Classic фон (easing, delay) | scrub-твін `backgroundColor` обгортки й `overlay` у `lesson-cases` | 18–24 % / 24–30 % від `top bottom` до `bottom top` |
| Слайдер схем | `initLessonSchemes()`: GSAP-твін `x` треку на `−i·(ширина + gap)` (з розкладки), 0.6 с, `CustomEase` з `.42,.65,.27,.99`. Стан `is-active` — одразу, текст — через 0.4 с. Свайп — `Observer` (pointer/touch, поріг 60° як `dragAngleThreshold`). Кнопки — `<button>` з `disabled` | крок 377 / 377 / 252, 5 слайдів, 4 кроки |
| Lottie слайдера | одна Lottie на схему замість двох. Активна грає (loop), неактивна стоїть на кадрі 0 — те саме, що дві копії на лайві, але вдвічі менше SVG | 5 json з лайву |
| Lottie hero ×7 + відео dimension | ліниве завантаження за ~1 vh до в'юпорта, play/pause за IntersectionObserver | — |
| Відео карток, демо, classic | спільний `lazyVideo()`: `src` за смугою, `preload="none"`, play у в'юпорті, pause поза ним | — |
| Тема навбара | не тут: `data-motion="theme"` + `data-theme="color"` на `lesson-section` і `data-theme="dark"` на `lesson-demo`. Колір бере код навбара з фону секції (прохід Navigation) | лінії `top+1px` / `bottom−90px`, 0.4 с |

- **reduced-motion**: scrub-и вимкнені (картки й рядок у кінцевому стані, демо перемикається станами без анімації), слайдер без
  твіна, Lottie на першому кадрі.
- **Перевірка**: `lessons-run.mjs` за зразком techniques-run — точки прогресу на implementation (3 уроки), examples, демо, classic
  проти лайву й моделі IX2, 3 смуги. Плюс таймінг кліку слайдера (кадри через 50 мс) проти `lessons-splide-*.txt`.

## Збірка в копії (сесія 18, 2026-10-10, головна сесія)

Home копії, `main` → **`section-lessons`** (`7ed4e6ea-6542-fa7a-6e65-0defdfa4304c`, `div`) одразу після `section-techniques`,
перед старими секціями. У ній 8 інстансів компонента **`lesson-section`** (`d5e7e221-35f7-91c5-dee2-9f546f061f62`, група
Lessons) з варіантами easing (база) … zoom. Старий `#lessons` лишається до видалення старих секцій. Тому інстанси мають
тимчасові id `<урок>-next` (проп `Section id`), справжні `easing` … `zoom` переходять разом із видаленням старих уроків.

```
section.lesson-section   id={Section id}  data-motion="lesson" data-theme="color"   variant → bg extra-lesson-*, pt
├─ div.lesson-hero
│  ├─ div.lesson-visual-row  aria-hidden                     flex space-between, overflow hidden, h 2.78 / 3 / 1.8
│  │  ├─ div.lesson-star.is-left                              .8 / .4 / .24, left −.4 / −.2 / −.12, star-lesson.svg
│  │  ├─ div.lesson-visual  data-motion="lesson-visual" data-src={Visual src} data-kind={Visual kind}   100% × 2rem
│  │  └─ div.lesson-star.is-right
│  └─ div.lesson-head                                         flex, mt 1.2 / .58, px 1.32 / .59 / .22; tiny column gap .16
│     ├─ div.lesson-heading                                   flex
│     │  ├─ div.lesson-number > div.heading-md {Number}       w 1.18 / .42 / .34
│     │  └─ div.lesson-title > h2.heading-md {Title}          w 4.9 / 2.48, mr .8 / .5
│     └─ div.lesson-desc > p.body-md {Description}            tiny pl .34
├─ slot «Extras»  (порожній; easing: схеми, examples, демо — лише компонентами)
├─ div.lesson-cases  data-motion="lesson-cases"              flex column, h 300vh / 200vh / 300vh (zoom: 400vh)
│  ├─ div.lesson-cases-head > h3.heading-xl «Implementation examples»   pt 1.8 / 3.4 / 2, pb .6 / .6 / .4
│  ├─ div.lesson-cases-pin                                    sticky top 1.02 / 1.94 / 1.6, h 100vh / auto, mb −100vh
│  │  │                                                         (zoom: mb 0), pb 0 / 1 / .01, overflow hidden
│  │  └─ div.lesson-cases-track  data-motion="lesson-track"   flex, ml .34 / .24, gap .55 / .4 / .2
│  │     └─ lesson-card ×3 (компонент, пропси прив'язані до Card N *)
│  └─ div.lesson-cases-overlay  data-motion="lesson-overlay" aria-hidden   abs inset 0 (для фону classic)
└─ slot «After»  (порожній; easing, delay: lesson-classic)
```

**`lesson-card`** (`ced33071-48b2-67a1-9aa0-8c8ef29e9556`): `a.lesson-card` {Link, нова вкладка} `data-motion="lesson-card"` →
`div.lesson-card-media` (`video.lesson-card-video` `data-motion="lesson-video"` `data-src`={Video src}, muted loop playsinline
preload=none, + `img.lesson-card-poster` {Poster}, alt "") → `div.lesson-card-body` (`div.lesson-card-text > p.body-sm` {Text},
`div.lesson-card-btn` «View» + `lesson-card-icon` (ембед SVG стрілки, `currentColor`)). Hover — `box-shadow inset .01rem`
(рамка 2 px, як на лайві), підкреслення «View» — правило в `styles-rem`.

- **Пропси `lesson-section`** (18): `Section id` (id), `Number`, `Title`, `Description` (textContent, multiline; `\n` → `<br>`),
  `Visual src`, `Visual kind` (`lottie` | `video` — лише dimension), `Card 1–3 link / text / video / poster`. Плюс `Variant`.
  Дані всіх 8 уроків (з лайву) — [lessons-props.json](lessons-props.json). Атрибути `data-src` / `data-kind` прив'язано до
  string-пропсів через `set_settings` → `attributes` з `value_binding`, тож запасний варіант (атрибути кодом) не знадобився.
- **Варіанти**: база `easing` (pt 1.18 / .75 / 1), решта 7 — `background-color` + pt .88 на всіх смугах; `zoom` ще `lesson-cases`
  400vh і `lesson-cases-pin` mb 0 (лайв `is-last`).
- **Тексти з лайву 1:1**, зокрема картка 3 у delay веде на PalmPalm, як на лайві. Заголовки в title case з uppercase-стилем,
  delay — `Offset \nand Delay` (пробіл перед `<br>`, щоб скрінрідер не злив слова).
- **Текстові стилі (глобально):** `heading-md` tab lh **1.35**, mob lh **1.1111** / ls **−0.0389em**; `body-md` tab lh **1.7143**;
  `heading-xl` = точні пропорції `.h3`: **1.0286 / −0.0357em**, tab **1.1282 / −0.0308em**, mob **1.1 / −0.03em** (було 1.03 /
  −0.036em, 1.13 / −0.03em — Δ 0.2–0.4 px; Hero теж на `heading-xl`, зміна в бік лайву).
- **Звірка:** `tools/record/lessons-compare.mjs` — 8 нових інстансів проти старих уроків на staging, 39–40 елементів × 4 смуги
  (1440 / 768 / 600 / 375): **0 прапорців**, Δ ≤ 0.3 px (600 — ≤ 1 px, округлення offset). Стартовий зсув карток IX2 (y 1.5 /
  3rem) віднімається — у нас його ставить код.
- **Без коду** hero-візуал порожній (Lottie вантажить `initLessons()`), відео карток стоять на постері.

## Збірка в копії: блоки easing і classic (сесія 19, 2026-10-10)

MCP кладе в слот лише інстанси компонентів, тож одноразові блоки — теж компоненти (група Lessons). Збирали деревом на
сторінці → `transform_element_to_component` → тимчасовий інстанс видалити → `insert_in_slot`. Значення — зі старих класів копії
(`query_styles`, 4 смуги) і лайв-зонда сесії 17 (`lessons-struct-*.json`), розбіжності між ними розв'язував лайв.

| Компонент | ID | Слот | Пропси |
|---|---|---|---|
| `lesson-schemes` | `351eeca4-68ac-7398-7bde-b899033e7b95` | easing → Extras (1) | — (статичний вміст) |
| `lesson-examples` | `9ddff661-a2e2-e75d-4cb9-525dcb9f2dcd` | easing → Extras (2) | — |
| `lesson-demo` | `92eadc1c-5b69-d7bc-a693-ad3bc52ee46c` | easing → Extras (3) | — |
| `lesson-classic` | `f42e65c0-edaa-a1e0-2c1d-ec0fecccf5d4` | easing → After, delay → After | 11 + `Variant` (easing = база, delay `6e0b570a-…`) |

```
div.lesson-schemes  data-motion="lesson-schemes"            relative, flex column, overflow hidden, mt .74/.6/.32, pl 2.5/.56
├─ div.lesson-schemes-stage                                  tiny pl .19
│  ├─ div.lesson-schemes-track  data-motion="schemes-track"  flex, gap .32 / tiny .24, cursor grab (touch-action, user-select — styles-rem)
│  │  └─ div.lesson-scheme(.is-active)  data-motion="scheme" data-text="<опис схеми>"  ×5   коло 3.45 / tiny 2.28, рамка 1px (активна 2px)
│  │     ├─ div.lesson-scheme-lottie  data-motion="scheme-lottie" data-src=<json копії> aria-hidden   1.834 × 1.36 (одна Lottie на схему)
│  │     └─ div.lesson-scheme-label  «Linear» …                   abs bottom .16, Plain .18/.32 · tiny .14/.24; підкреслення активної — styles-rem
│  ├─ div.lesson-schemes-arrows                               abs top 1.3/1.45/.94, space-between, px .34/.32/.22
│  │  └─ button.lesson-schemes-arrow  data-motion="schemes-prev|next" type=button aria-label (prev: disabled)   .84/.54/.4, svg-ембед
│  └─ div.lesson-schemes-divider  aria-hidden                 .02 × .32, ml 1.74 / tiny 1.14, mb .24
└─ div.lesson-schemes-caption > p.body-md  data-motion="schemes-text" aria-live=polite   w 5.7/6.5/2.98, h .91

div.lesson-examples  data-motion="lesson-examples"          h 200vh / auto (pb .4) / auto (pb 0)
└─ div.lesson-examples-sticky                                 sticky top 0, pt .94 pl .34, gap .24; md pt .88 justify end; tiny relative, p .88/.22/.4
   ├─ div.lesson-examples-stars aria-hidden > div.lesson-examples-star(.is-even) data-motion="examples-star" ×5   2.74/1.8/1.65, even mt .9/.59/.54
   └─ div.lesson-examples-line  data-motion="examples-line" > h3.lesson-examples-title «Let's look at an example»

div.lesson-demo  data-motion="lesson-demo" data-theme="dark"   h 400vh, bg neutral-1000
└─ div.lesson-demo-sticky                                     sticky, 100vh, flex column center, p 1.1/1.33/.4 · md 1.95/0/2.13/.6 · tiny 1.08/0/1.06/.38
   ├─ div.lesson-demo-media                                   10.14×5 (max 71vh), ml 1.17 · 6.88×3.95 · 3.23×2
   │  └─ video.lesson-demo-video(.is-active) data-motion="demo-video" data-src / data-src-tablet / data-src-mobile, muted loop playsinline preload=none aria-hidden  ×6
   └─ div.lesson-demo-progress                                md pr .6, tiny pr .38
      ├─ div.lesson-demo-steps (grid 3, h .25 / tiny .72) > div.lesson-demo-step(.is-active) data-motion="demo-step" > p.body-sm  ×3
      ├─ div.lesson-demo-ticks aria-hidden (flex between, h .3/.16/.08) > div.lesson-demo-tick(.is-edge/.is-large) > div.lesson-demo-tick-fill(.is-on) data-motion="demo-tick"   ×7 (крайні — is-edge, без заливки)
      └─ div.lesson-demo-line aria-hidden > div.lesson-demo-line-fill data-motion="demo-line"   1px, заливка 16.7 % (стан 0)

div.lesson-classic  data-motion="lesson-classic"            relative z1 flex; ::before — шум (styles-rem, лише ≥992)
└─ div.lesson-classic-mask                                    radius .76 / tiny .32
   ├─ div.lesson-classic-film.is-left aria-hidden             sticky 100vh, mb −100vh, 1.62/1.32/.5, Film_right.svg (tiny Film_mobile.svg), колір classic
   ├─ div.lesson-classic-body                                 flex column center, gap .8 / tiny .24, колір classic
   │  ├─ div.lesson-classic-head                              pt 1.4 px 1 · md px 0 · tiny pt 1, gap .4/.16
   │  │  ├─ div.lesson-classic-title > h3.heading-lg {Title}
   │  │  └─ div.lesson-classic-list > div.lesson-classic-media > video.lesson-classic-video data-src={Video 1} + img.lesson-classic-poster {Poster 1}
   │  └─ div.lesson-classic-steps                             h 150vh/60vh/80vh (delay: 60/50/90vh)
   │     └─ div.lesson-classic-sticky                         sticky top .6 / tiny 1, w 6.4/4.08/2.3, mb −100vh
   │        ├─ div.lesson-classic-step > div.lesson-classic-text (p.body-sm.is-strong {Step title}, p.body-sm {Step text})
   │        │                          + a.lesson-classic-link {Link} «View» + icon   (видимість = {Show link})
   │        └─ div.lesson-classic-step (видимість = {Show second}) > media (video {Video 2} + poster {Poster 2}) + p.body-sm {Note}
   └─ div.lesson-classic-film.is-right
```

- **Пропси `lesson-classic`:** `Title`, `Video 1`, `Poster 1`, `Step title`, `Step text` (multiline, `\n\n` → два `<br>`), `Show link`, `Link`,
  `Show second`, `Video 2`, `Poster 2`, `Note`. Дефолти = easing. Delay: `Show link` on, `Show second` off, flower-відео й постер.
  Одна структура покриває обидва уроки: на лайві easing = текст → (відео + примітка), delay = (текст + View).
- **Стартовий стан у класах = кадр лайву при scrollY 0:** активна перша схема, перше відео демо, перший заголовок прогресу,
  перша мітка й заливка лінії 16.7 %. Код перемикає комбо `is-active` / `is-on` і ширину заливки.
- **Фон обгортки classic прозорий** (на лайві клас чорний, IX2 стартує з прозорого). Чорний на 18–24 % / 24–30 % дасть код
  разом з `lesson-cases-overlay`.
- **`heading-lg` (глобально) = точні пропорції `.h2-secondary`:** 1.0957 / −0.0174em · tab 1.1563 / −0.0313em · mob 1.1111 / −0.0222em.
- **Рядок examples — літеральний клас**, а не `display-xl`: lh 2.2rem і ls −0.09rem / tab −0.014rem (у Techniques `display-xl`
  має інший tracking). Розмір — змінна `text-215`.
- **Звірка:** `lessons-compare.mjs` розширено (бази schemes / examples / demo / classic, 66 нових рядків, токени перевірок): 8 уроків
  × 4 смуги — **0 прапорців**, повні висоти easing і delay збігаються. Відео демо 2–6 звіряються лише за src (старі `preload=none`
  без CSS-розміру дають дефолтні 300 px), на 600 рядки схем мають допуск 2.5 px (Splide округлює ширину слайда).

## Код анімації (сесія 20, 2026-10-10)

`src/motion.js`: `initLessons()` + `initLessonSchemes()`, створюються після `initTechniques()` (порядок DOM). Перевірка —
`tools/record/lessons-run.mjs` (частини impl / examples / demo / classic / splide / media), смуги 1440 / 768 / 600 / 375.

| Що | Як | Звірка (лайв і ключі IX2) |
|---|---|---|
| Implementation ×8 | один scrub-таймлайн на `lesson-cases` (scrub 1 = smoothing 90), `gsap.matchMedia` ≥992 / 768–991 / ≤767, позиції — `ix2Range()` (формула IX2: старт `top bottom` або `top max(vh−h,0)px`, кінець `bottom h·endOffset px`). Заголовок — нова роль **`lesson-cases-head`** (додано в компонент через MCP); трек — `xPercent` | easing / fade / zoom × 7 точок: Δ ≤ 0.5 px, scale Δ ≤ 0.001, `x%` Δ ≤ 0.1 на всіх смугах. 600: уроки 2–8 тепер рухаються за tiny-ключами (на лайві стояли) |
| Examples | scrub рядка (`xPercent` −104 / −130) і зірок (непарні вниз, парні вгору, 0.9 / 0.54rem) | 4 точки: Δ ≤ 0.2 % / 0.2 px |
| Демо | scrub-таймлайн-«проксі» (scrub 1) → стан 0–5 за порогами 17 / 34.5 / 51 / 67.5 / 83.5 % (кінець `bottom 0.2h`): `is-active` на відео, `is-on` на мітці i від стану i, `is-active` на заголовку 2 / 3 від станів 2 / 4, ширина лінії 16.7 … 100 % | 6 точок: стан, лінія, мітки й заголовки = лайву; грає лише активне відео (на лайві — усі 6) |
| Classic | `backgroundColor` прозорий → чорний на `lesson-classic` і `lesson-overlay` свого уроку; вікна 18–24 % / 24–30 % за порядком у DOM (easing, delay) | alpha Δ ≤ 0.005 |
| Слайдер схем | твін `x` на −i·крок (крок з розкладки: `offsetLeft` 2-го кола − 1-го), 0.6 с, `bez(.42,.65,.27,.99)`; `is-active` одразу, текст `data-text` через `delayedCall(0.4)`; `disabled` на крайніх кнопках; drag — `ScrollTrigger.observe` (pointer + touch, `lockAxis`), трек іде за пальцем, крок при |dx| > 150 px або швидкості > 600 px/с (пороги Splide 2), інакше повертається. Після кожного refresh трек стає на свою схему | 4 × next + prev на 4 смугах: крива Δ ≤ 0.04 кроку, текст через 387–419 мс (лайв 409–415), disabled однакові. Splide починає рух на ~28 мс пізніше (2 кадри після кліку) — штучну затримку **не** додаємо, звіряємо від першого кадру руху |
| Lottie схем | одна на схему, вантажаться за 1 vh до слайдера; активна грає (loop) лише в в'юпорті, решта — кадр 0 | — |
| Hero-візуал | Lottie (`lottie_light` 5.13.0, у файлах уроків немає expressions) за 1 vh до в'юпорта, play / pause за IntersectionObserver; dimension — `<video>` з парою HEVC `.mov` + `_VP9.webm` (як лайв-ембед) | media: Lottie рухається на екрані, dimension грає webm у Chrome, поза екраном на паузі |
| Відео карток і classic | `lazyVideo()`: `src` за смугою за пів vh (preload metadata, постер лишається під відео), play на екрані, pause поза ним; зміна смуги міняє `src` уже завантаженим | media: на екрані — `src/playing`, поза екраном грає 0 |

- **Finsweet `autovideo` (старий, ще на сторінці)** на старті бере всі `<video>`, зокрема наші, і запускає їх у в'юпорті. Тимчасовий
  запобіжник `guardVideo()`: наше відео, яке код не просив грати, ставить себе на паузу. Прибрати разом зі старим скриптом.
- **reduced-motion:** без згладжування й без декоративних рухів (заголовок, підйом карток, рядок і зірки examples); трек карток їде
  (несе картки 2–3 у кадр), фон classic і стани демо перемикаються; слайдер без твіна, текст одразу; Lottie на кадрі 0; відео — лише
  перший кадр.
- **Не зроблено тут:** тема навбара (`data-theme`) — у проході Navigation; hover-звук — етап 4.
