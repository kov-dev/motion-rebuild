# Design system (Figma) — токени для етапу 2

Дата: 2026-10-09. Read-only. Figma `KJQjG15P2P3SkXwrJJxLOp`, сторінка `Design system` (`1301:36378`).
Лайв-звірка: [../styleguide-audit.md](../styleguide-audit.md), rem-правило: [../main-css.md](../main-css.md).
Одиниці: значення макета (px при 1440) / 100 = rem. Figma-трекінг у **%** розміру (`-4` = -4% = -0.04em).

## 1. Джерела

| node-id | Що | Розмір |
|---|---|---|
| `1301:36551` | `Styleguide` Desktop (1440): 22 текстові стилі + свотчі кольорів + компоненти | 4827×12912 |
| `1301:37092` | `Styleguide` Tablet (768): ті самі стилі, інші розміри | 4827×6902 |
| `1301:37256` | `Styleguide` Mobile (375): те саме | 4827×6541 |
| `1301:37398/37451/37508` | підкладки під три смуги, підписи `1440*750`, `768*1024`, `375*667` | — |
| `1908:27841` / `1908:28352` / `1979:39218` | Fav icon (16/32/96) / Og image 1200×627 / Og image 1200×1200 | — |

Дошка стайлгайда — лише презентація: колонки назва (x0) / приклад (x199) / розмір (x3663) / вага (x4259), геп рядків 67, поділ лінією. Це **не** сітка сайту. Розміри тексту на дошці = px макета відповідної смуги (H2 160 = лайв `.h2` 1.6rem).
Змінні: в файлі є **текстові стилі** (`Desktop/*`, `Tablet/*`, `Mobile/*`) і **кольорові змінні**; змінних під відступи/радіуси/тіні немає.
Копії стайлгайдів також у `Full design`: `857:17807` (1440), `905:31100` (768), `967:31946` (375) — не звіряв.

## 2. Кольори (Figma → hex → вживання)

Свотчі — прямокутники 1099.75×792, без радіуса, сітка 4×3, геп колонок 63, рядків 57.

| Figma (змінна) | Hex | Де вживається (за лайвом) |
|---|---|---|
| `BG` | `#0C0B0B` | темний текст/фон, `.styleguide-wrapper` |
| `White` | `#FDFCFA` | світлий фон/текст, плашки, кулька, рамки пілюль |
| `Easing` | `#C8CFE8` | урок easing, `.breadcrumb-item.is-easing`, стрілка слайдера |
| `Offset` | `#D2C8E8` | урок delay (підпис у Figma «offset») |
| `Fade in  Fade Out` | `#E4E8C8` | урок fade in/out |
| `Transfor-mation` | `#C8E8E8` | урок transformation/morph |
| `Masking` | `#E8C8E5` | урок masking |
| `Skale` | `#E8C8C8` | урок dimension (scale) |
| `Parallax` | `#D6E8C8` | урок parallax |
| `Zoom` | `#C2D5D7` | урок zoom |
| `Easing-Cl` | `#AAB8EB` | `classic-anim*` easing |

Немає у Figma, є на лайві: `#bdb1d7` (classic-anim delay), `#3d3c3c` (`.progress-bar*`), `#000` (11 правил), `#fff` (лише SG), `rgba(253,252,250,.2)` (мобільний footer).
Підписи hex на свотчах Easing та Easing-Cl в макеті помилково `#FDFCFA` (залишок білого), заливка і змінна правильні (`#C8CFE8`, `#AAB8EB`).

## 3. Типографіка

Родина: **PP Neue Machina** (Plain Regular; Inktrap Regular/Light/Ultrabold) і **Magilio Regular**. lh у px макета, ls у % (у дужках em).

### 3.1 Desktop (1440)

| Стиль Figma | Накреслення | size / lh / ls | Регістр | Лайв-клас |
|---|---|---|---|---|
| `N1` | Magilio Regular | 115 / 126 / -2% | — | `.h2-secondary` |
| `N2` | Magilio Regular | 34 / 100%(`normal`) / -2% | UP (на Home) | `.resources-student` (.34/.37) |
| `H1` | Plain Regular | 215 / normal / -4% | UP | **немає** (на Home жодного h1) |
| `H1-m` | Plain Regular | 195 / 190 / -4% | UP | немає |
| `H2` | Plain Regular | 160 / 170 / -4% | UP | `.h2` |
| `H3` | Plain Regular | 140 / 144 / -4% | UP | `.h3` |
| `H4` | Plain Regular | 74 / 80 / -4% | UP | `.h4` (=`.label-1`) |
| `H4-c` | Inktrap **Light 300** | 64 / 64 / -6% | — | `.h4-c` (мертвий), де-факто `.anim-shape` |
| `H5` | Plain Regular | 54 / 58 / 0 | UP | `.h5` |
| `H6` | Plain Regular | 74 / 80 / -4% | UP | `.h6` (на лайві ls -.04) |
| `P1` | Plain Regular | 28 / 44 / 0 | — | `.p1` |
| `P2` | Inktrap Regular | 18 / 32 / 0 | — | `.p2` |
| `P2 (Act)` | Inktrap Regular, underline | 18 / 32 / 0 | — | активне посилання; на лайві окремого класу нема |
| `P3` | Plain Regular | 16 / 24 / -2% | — | `.p3` |
| `P3(b)` (змінної нема) | Inktrap **Ultrabold 800** | 16 / 24 / 0 | — | `.p3-bold` (на лайві файл Bold 700) |
| `GR` | Inktrap Regular | 10 / 100%(`normal`) / 0 | — | немає |
| `F-1`, `F-3`, `F-3 (a)`, `N-F` | Inktrap Regular | 16 / 28 / -3% (a = underline) | — | `.nav-absolute`, `.f-navigation-list`, `.footer-info` |
| `F-2` | Inktrap Ultrabold 800 | 16 / 32 / 0 | — | `.f-label` (Bold 700 на лайві) |
| `Button-A` | Plain Regular | 16 / 24 / 0 | — | `.btn-link` |
| `Navigation` | Inktrap Regular | 16 / 16 / -3% | lowercase | `.breadcrumb-item`, `.nav-toggle`, `.logo-text-sections` |

### 3.2 Tablet (768) і Mobile (375) — size / lh / ls

| Стиль | Tablet | Mobile | Лайв tab / mob |
|---|---|---|---|
| `N1` | 64 / 74 / -2% | 36 / 40 / -2% | .64/.74 ; .36/.4 збіг |
| `N2` | 34 / normal / -2% | 28 / normal / -2% | — |
| `H1` | 120 / normal / -4% | 56 / normal / -4% | немає |
| `H1-m` | 105 / 100 / -4% | 44 / 48 / -4% | немає |
| `H2` | 100 / 100 / -4% | 50 / 55 / -4% | 1/1 ; .5/.55 збіг |
| `H3` | 78 / 88 / -3% | 40 / 44 / -3% | .78/.88 ; .4/.44 збіг |
| `H4` | 40 / 54 / -4% | 36 / 40 / -4% | .4/.54 ; .36/.4 збіг |
| `H4-c` | 28 / 28 / -6% | 19 / 19 / -6% | на лайві нема |
| `H5` | 44 / 58 / -4% | 34 / 40 / -4% | .44/.58 ; .34/.4 збіг |
| `H6` | 44 / 54 / -4% | 24 / 32 / -4% | .44/.54 ; .24/.32 збіг |
| `P1` | 24 / 38 / 0 | 22 / 32 / 0 | .24/.38 ; .22/.32 збіг |
| `P2` | 14 / 24 / 0 | 14 / 24 / 0 | .14/.24 збіг |
| `P3` | 13 / 24 / -2% | 13 / 18 / -2% | .13/.24 ; .13/.18 збіг |
| `P3-B` | 16 / 24 / 0 (Ultrabold) | 16 / 18 / 0 | tab .16 збіг; **mob лайв .14/.22 ≠ 16/18** |
| `GR` | 10 / normal | 6 / normal | — |
| `F-1` | 24 / 40 / -3% | 16 / 24 / -3% | — |
| `F-2` | 16 / 32 / 0 | 16 / 32 / 0 | — |
| `F-3`, `F-3 (a)` | 14 / 28 / -3% | 12 / 18 / -3% | — |
| `Button-A` | 13 / 24 / 0 | 13 / 24 / 0 | .13 збіг |
| `Navigation` | 14 / 14 / -3% | 14 / 14 / -3% | — |

Смуги в Figma: 768 і 375; у Webflow tab (≤991) і mob (≤479); ≤767 окремо не потрібен (лайв його не перевизначає).

### 3.3 Шрифтові файли (styleguide-audit §4)

| Figma | Файл (woff2, під іменем у CSS) | Стан |
|---|---|---|
| Plain Regular 400 | `PPNeueMachina-PlainRegular` → `Pp-neuemachina-Plain` | є |
| Inktrap Regular 400 | `PPNeueMachina-InktrapRegular` → `Pp-neuemachina-Inktrap` 400 | є |
| Inktrap Ultrabold 800 | **немає woff2**; на лайві `InktrapBold` 700 | розбіжність (див. §9) |
| Inktrap Light 300 | **немає woff2**; на лайві синтетична 400 | розбіжність |
| Magilio Regular | `644bf7bb…_font.woff2` → `Magilio-400` (28 KB) | є |

## 4. Відступи / сітка

- Токенів відступів, колонок, полів і гепів у Figma **немає**; сітки сторінки на дошці немає (лише 1440/768/375 як ширина).
- Відступи елементів — з компонентів: пілюля px16 / py14, геп 16 (§7); плашка інтро px40 / py24 (intro.md). Шкалу `space-*` будуємо з лайву на проходах секцій (WEBFLOW-BASE §2.1: токен лише від 2 вживань).

## 5. Радіуси, лінії, тіні

| Що | Значення | Де |
|---|---|---|
| Радіус пілюль (Menu, Sound, MOTION.ed) | 26px (висота 44 → не повне півколо) | компоненти §7 |
| Радіус плашки інтро | 100px (≈ full) | intro.md |
| Рамка пілюлі | 1px `#FDFCFA` (border, лишаємо px) | §7 |
| Розділювачі дошки | 1px лінії (`Line`/`Vector`) | лише презентація |
| Тіні, градієнти, blur | **немає** | — |

## 6. Прямокутники свотчів, іконки
Свотчі без радіуса й обведення. Іконки: burger 16×16 (в пілюлі Menu), `teenyicons:sound-on-solid` 16×16 (Sound), стрілка `Arrow` 32×32 (`2062:28768`, поза цією сторінкою).

## 7. Компоненти на сторінці (коротко)

| Компонент | Node | Параметри |
|---|---|---|
| Menu (пілюля) | `1301:36732` (Default), `36738` (Hover) | 106×44, bg `BG`, border 1px `White`, r26, px16 py14, геп 16; текст `Navigation` (lowercase) + burger 16 |
| Sound | `1301:36957/36958` | 48×44, bg `BG`, border 1px `White`, r26, px16 py14, іконка 16 |
| MOTION.ed (лого-пілюля) | `1301:36951/36954` | 110×44, текст 78×16 |
| CC (курсор «Drag») | `1301:36945/36947` | 162×162, колесо-SVG; текст `Button-A` 16/24 `#0C0B0B`, по центру; BG-коло 180 |
| Button-a | `1301:36937/36939` | 61×24, текст `Button-A`; стани Default/Hover |
| Introduction (підпис) | `1301:36949/36950` | 98×28 |
| Interactive_circle | `1301:36864`, `36909` | 570×570, коло ≈35 кульок 78×78; варіанти Realtime / Not real-time; примітки про курсор (UA/RU) |
| Easings | `1301:36744` | 2282×1554; 5 карток 385×750, у кожній 2 символи 345×345 (Default/Variant2) |

Стани Default / Hover / Interactive показані стовпчиками (x≈146 / 431 / 745). Анімація стану (ease, тривалість) у Figma не задана.

## 8. Зведена таблиця токенів для етапу 2

Колекції за STYLEGUIDE §1.4: `core` / `semantic`. Імена орієнтовні, остаточні — на проході секції. Значення: rem = px / 100.

| Токен (WEBFLOW-BASE) | Значення (px → rem) | Figma | Лайв / styleguide-audit | Примітка |
|---|---|---|---|---|
| `neutral-1000` (core) | `#0C0B0B` | `BG` | `#0c0b0b` ×51 | збіг |
| `neutral-0` (core) | `#FDFCFA` | `White` | `#fdfcfa` ×42 | збіг |
| `neutral-1000-alt` (не створювати) | `#000` | немає | `#000` ×11 | лишити літералом (1:1) або звести в `neutral-1000`; питання |
| `neutral-800` (core) | `#3D3C3C` | немає | `.progress-bar*` ×4 | лише лайв; назву за роллю — на проході Lessons |
| `lesson-easing` | `#C8CFE8` | `Easing` | ×2–3 + стрілка splide | збіг |
| `lesson-delay` | `#D2C8E8` | `Offset` | `.lesson.is-*` | збіг; Figma «Offset» = лайв delay |
| `lesson-fade` | `#E4E8C8` | `Fade in  Fade Out` | так | збіг |
| `lesson-transformation` | `#C8E8E8` | `Transfor-mation` | так | збіг |
| `lesson-masking` | `#E8C8E5` | `Masking` | так | збіг |
| `lesson-dimension` | `#E8C8C8` | `Skale` | так | збіг; Figma «Skale» (помилка в імені) |
| `lesson-parallax` | `#D6E8C8` | `Parallax` | так | збіг |
| `lesson-zoom` | `#C2D5D7` | `Zoom` | так | збіг |
| `classic-easing` | `#AAB8EB` | `Easing-Cl` | `classic-anim*` ×6 | збіг |
| `classic-delay` | `#BDB1D7` | немає | `classic-anim*` delay ×3 | лише лайв |
| `bg` / `foreground` (semantic, light↔dark) | `neutral-0`↔`neutral-1000` | `White`/`BG` | `nav-light`/`nav-dark` | `.white`-комбо → колір секції |
| `font-display` (core, string) | `Pp-neuemachina-Plain` | PP Neue Machina Plain | `Pp-neuemachina-Plain` | у CSS не `Ppneuemachina-*` |
| `font-body` (core, string) | `Pp-neuemachina-Inktrap` | Inktrap | `Pp-neuemachina-Inktrap` | тіло Home насправді Plain; уточнити на проході |
| `font-accent` (core, string) | `Magilio-400` | Magilio | `Magilio-400` | N1, N2 |
| `display-lg` / `.h2` | 1.6 / 1.7(1.06) / -0.04em | `H2` 160/170/-4% | `.h2` 1.6/1.7/-.064 | збіг |
| `heading-lg` / `.h2-secondary` | 1.15 / 1.26(1.10) / -0.02em | `N1` 115/126/-2% | 1.15/1.26/-.02 | збіг |
| `heading-xl` / `.h3` | 1.4 / 1.44(1.03) / **-0.04em** | `H3` 140/144/-4% | **-.05 (-3.6%)** | розбіжність ls; лайв істина → -0.036em |
| `heading-md` / `.h4` | .74 / .8(1.08) / -0.04em | `H4` 74/80/-4% | .74/.8/-.03 (-4.1%) | збіг (-.0296 ≈ -.03) |
| `heading-md` (= `.h6`) | .74 / .8 / -0.04em | `H6` 74/80/-4% | `.h6` ls -.04 | дубль `.h4`, одним стилем |
| `heading-sm` / `.h5` | .54 / .58(1.07) / 0 | `H5` 54/58/0 | .54/.58 | збіг |
| `body-lg` / `.p1` | .28 / .44(1.57) / 0 | `P1` | .28/.44 | збіг |
| `body-md` / `.p2` | .18 / .32(1.78) / 0, Inktrap | `P2` | .18/.32 | збіг (+ `.slide-inner-label`, `.hero_wrap`) |
| `body-sm` / `.p3` | .16 / .24(1.5) / -0.02em | `P3` 16/24/-2% | .16/.24/-.003 (-1.9%) | збіг; `.btn-link` (ls 0) = `Button-A` |
| `body-sm-bold` / `.p3-bold` | .16 / .24 / 0 | Inktrap **Ultrabold 800** | Inktrap Bold 700, ls -.003 | розбіжність накреслення/ls; лайв → Bold 700 |
| `text-label` | .16 / .16(1.0) / -0.03em, lowercase | `Navigation` | .16/.16/-.005 (-3.1%) | збіг; lowercase перевірити на лайві |
| `text-nav` | .16 / .28 / -0.03em | `F-1`/`F-3`/`N-F` | .16/.28/-.0048 | збіг |
| `text-nav-bold` | .16 / .32 / 0 | `F-2` Ultrabold | `.f-label` Bold 700 | Bold vs Ultrabold |
| `display-xl` | 2.15 / 2.15–2.2 / -0.04em | **немає** | `.list-item`, `.scrolling-text` | лише лайв |
| `shape-label` / `.anim-shape` | .64 / .64 / -0.06em, 300→400 | `H4-c` 64/64/-6% | `.anim-shape` .64/.64 (-.038) | збіг; вага 300 без файлу |
| `display-h1`, `display-h1-m` | 2.15 / 1.95 (lh 1.9) | `H1`, `H1-m` | **немає** | не створювати без h1 на сторінці; питання |
| `radius-pill` | 0.26rem | пілюлі r26 | лайв не знімав | перевірити `.nav-toggle`, `.sound-btn` |
| `radius-full` | 1rem (≥100px) | плашка r100 | — | intro.md |
| `border-1` | 1px (px) | пілюлі | — | виняток WEBFLOW-BASE §1 |

Брейкпоінтні значення tab/mob — у §3.2 (override-ом на відповідних смугах; значення збігаються з лайвом, окрім `P3-B` mob).

## 9. Розбіжності Figma ↔ лайв

| # | Що | Figma | Лайв | Пропозиція |
|---|---|---|---|---|
| 1 | `H3` letter-spacing desk | -4% (-.056) | -.05 | лайв (-0.036em) |
| 2 | Накреслення `p3-bold`, `f-label` | Inktrap Ultrabold 800 | Inktrap Bold 700 (файл) | лайв (немає woff2 Ultrabold; 13 .otf не підключені) |
| 3 | `P3-B` mobile | 16 / 18 | .14 / .22 | лайв; уточнити |
| 4 | `H4-c` / `.anim-shape` | Inktrap **Light 300** | файлу 300 нема, браузер бере 400 | лайв (400); якщо дизайн хоче Light — треба Light woff2 |
| 5 | `H1`, `H1-m` | є на 3 смугах | h1 на Home немає | не створювати до рішення |
| 6 | Підписи hex на свотчах Easing / Easing-Cl | `#FDFCFA` (помилка) | `#C8CFE8` / `#AAB8EB` | значення змінних |
| 7 | Імена: `Offset`, `Skale`, `Transfor-mation` | — | уроки delay / dimension / transformation | імена токенів за роллю урока, не з Figma |
| 8 | Кольори без Figma: `#BDB1D7`, `#3D3C3C`, `#000` | немає | є | значення лайву |
| 9 | Типографіка поза SG на лайві | немає (`display-xl` 2.15, `resources-titles` 1.95) | є | лайв |
| 10 | Копії стайлгайда в Full design | `857:17807` та ін. | — | не звіряв, ймовірно застарілі |

## 10. Питання до користувача (лише дизайн)

1. `Inktrap Ultrabold` (Figma) чи `Bold` (лайв) для `p3-bold`/`f-label`? За замовчуванням — лайв Bold 700.
2. `Inktrap Light` для `H4-c`/`anim-shape`: лишаємо де-факто Regular 400 з лайву?
3. `H1` і `H1-m` у стайлгайді є, на Home h1 немає: це заголовок для чого? (SEO-питання вже в styleguide-audit.)
4. `#000` на лайві (11 правил) — лишити чорним, чи звести в `#0C0B0B`?
5. Шкали відступів / колонок у Figma немає: будуємо з лайву по секціях — ок?
