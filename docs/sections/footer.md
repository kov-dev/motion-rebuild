# Footer

Figma — субагент (sonnet), лайв-заміри й план — головна сесія 23, 2026-10-10. Усе в px макета (у Webflow → /100 rem).
Лайв — `div.nav.nav-dark > div.footer` (home-tree.md §7). **Еталон — лайв**: розділи «Розбіжності» і «Лайв-заміри» мають перевагу над Figma-розділами.

## Джерела
- Файл `KJQjG15P2P3SkXwrJJxLOp`.
- **Важливо:** `795:38432` (Footer 1440×709) — це **старий/спрощений** символ: у ньому лише хмарна «шапка» (Union) + прямокутник, **без текстів**. Реальний футер з текстами — символ `795:39109` (1440×659), він інстансується в кадрах кінця Resources. Для верстки брати `795:39109`.

| node-id | Назва | Розмір | Що в кадрі |
|---|---|---|---|
| `795:39109` | Footer (символ 1440, головний) | 1440×659 | Union (Cloud-1 + Cloud-2 + Rectangle 12637, чорний, біла обводка) + усі тексти |
| `795:38432` | Footer (старіша версія) | 1440×709 | Лише Union (висота 712) + Rectangle 12637 (y=234, 1504×478); текстів немає |
| `891:27933` | Footer (символ **Tablet**) | 770×1044 | Той самий Union зменшений + Rectangle 12679 (768×584, y=496) + тексти; стилі називаються `Tablet/*` |
| `795:31143` | 6. Courses&Sources(4) | 1440×750 | 3 чорні хмари входять знизу; футера в кадрі немає |
| `795:31368` | (4-1) | 1440×750 | Хмари угорі, Footer-інстанс `795:39196` y=201 |
| `795:31615` | (4-2) | 1440×750 | Footer-інстанс `795:39153` y=171, хмари ті самі |
| `795:31839` | (4-2) фінал | 1440×750 | Footer-інстанс `795:39110` y=92, хмари вище/Cloud-3 збільшена |
| `795:30914` | (3-1-3) Full | 1440×1767 | Довгий кадр, Footer `795:39109` y=1109 (1109+659=1768) |
| `795:38521` / `795:38520` / `795:38522` | Cloud-3 / Cloud-1 / Cloud-2 | 1038×488 / 878×540 / 1126×690 | Окремі контури хмар для експорту SVG (Cloud-1 — фрейм 878×540 з boolean-групою 878.2×539) |

768/375: символ `891:27933` — єдиний знайдений варіант. Батьківського кадру/інстансів «Footer 768/375» через `get_metadata` символу не видно (symbol лежить на дошці x=56689,y=2465, поза кадрами). Окремого 375-футера **не знайдено**; за FIGMA.md `891:27933` використовується і на 375 (в Figma підтвердження немає).

## Структура
Desktop `795:39109` (1440×659, bg `#0C0B0B`, overflow clip):
- Union (SVG) x=-139.99 y=0 1762.36×659 — хмарна верхня межа: Cloud-1 (x=-139.99 y=7.13 872×384.6), Cloud-2 (x=563 y=0 1059.4×483.4), Rectangle 12637 (x=-32 y=234 1504×425) — все boolean Union, чорна заливка + біла 1px обводка по контуру
- Заголовок (H5) x=34 y=207 w550: «Motion / design / principles» — 3 рядки (UP)
- Блок **N.** x=761: мітка «N.» y=207, список y=250 (w259, 10 рядків по 28)
  - Introduction · Easing · Delay · Fade in Fade Out. · Transform & Morph · Masking · Scale · Parallax · Zoom · Resources & Courses
  - у тексті-джерелі «Easing» і «Delay» розділені `<br>` в одному абзаці; в кінці порожній абзац (zero-width space) — артефакт
  - стрілок-іконок у пунктів **немає**
- Блок **S.** x=1155: мітка «S.» y=207, список y=250 (w80): Dribbble · Instagram · Twitter · linkedin (малими, як у макеті) · Spotify; іконок немає
- Нижній рядок: «Site by Zajno» x=34 y=582; «© 2023. All rights reserved.» x=1184 y=586 (w222, права межа 1406)
- Нічого іншого (кнопок, форм, лого, email) у футері немає.

Tablet `891:27933` (770×1044; Union виступає: x=-155 y=-41 1182×744.5):
- Rectangle 12679 x=2 y=496 768×584 (чорний `#0C0B0B`) — фон нижче хмар
- Заголовок x=26 y=304 w720: «Let’s get / the (designing) ball rolling now» (UP, 44/58) — **текст інший, ніж на desktop**
- N. (мітка x=26 y=518; список x=26 y=558 w368, 10 пунктів, крок 40) і S. (мітка x=474 y=518; список x=474 y=558 w122, 5 пунктів) — ті самі пункти
- «Site by Zajno» x=26 y=993 (весь рядок підкреслений), «© 2023. All rights reserved.» x=552 y=993 w194 (права межа 746)

## Токени
Кольори: BG `#0C0B0B` (фон футера, хмар), White `#FDFCFA` (весь текст, обводка хмар). Градієнтів/opacity немає.

Шрифт: PP Neue Machina (стилі Inktrap Regular / Inktrap Ultrabold / Plain Regular).

| Роль | Desktop | Tablet (`Tablet/*`) |
|---|---|---|
| Заголовок | Plain Regular 54, lh 58, ls 0, UP (`Desktop/H5`) | Plain Regular 44, lh 58, ls -4% (-1.76px), UP (`Tablet/H5`) |
| Мітки N. / S. | Inktrap Ultrabold 16, lh 32, ls 0 | те саме (`Tablet/F-2`) |
| Пункти навігації/соцмереж | Inktrap Regular 16, lh 28, ls -0.48 (-3%); у списку N. «Easing…Zoom» і «& Courses» — Plain Regular (непослідовність макета) | Inktrap Regular 24, lh 40, ls -0.72 (-3%) (`Tablet/F-1`), усі пункти однаковим стилем |
| Нижній рядок | Inktrap Regular 16, lh 28, ls -0.48; «Zajno» 18/lh 32, підкреслене (decoration from-font) | Inktrap Regular 14, lh 28, ls -0.42 (`Tablet/F-3`); «Site by Zajno» підкреслене цілком |

Відступи: бічне поле 34 (desktop) / 26 (tablet); гепи між пунктами списку = lh (28 / 40), жодних додаткових; мітка → список: 43 (207→250) desktop, 40 (518→558) tablet. Бордерів/ліній/радіусів у футері немає (лише біла обводка хмар ≈1px).

## Розкладка
**1440 (`795:39109`, 659 висоти):**
- Колонки: заголовок x=34…584 (w550); N. x=761 (w259); S. x=1155 (w80); нижній рядок x=34 / права межа 1406 (=1440−34).
- Вертикаль: хмарна шапка y=0…~250 (Rectangle починається y=234); заголовок y=207…381 (3×58); мітки y=207; списки y=250 (N.: 250…522, 10×28=280 з порожнім рядком; S.: 250…390); нижній рядок y=582–586…614; низ 659.
- Хмарна межа: нерівна, найнижча западина ≈ y=250, піки до y=0. SVG ширший за кадр (1762 vs 1440) і зміщений на −140 → обрізається `overflow: clip`.

**768 (`891:27933`, 770×1044, лише символ):** Union y=-41…703 (виходить за верх кадру); заголовок y=304 (3 рядки візуально: «LET’S GET / THE (DESIGNING) BALL ROLLING / NOW»); списки з y=558: N. закінчується ≈ y=953, S. ≈ y=758; нижній рядок y=993…1021. Дві колонки: x=26 і x=474 (відступ від правого краю 770−596=174 для S.).
**375:** макета не знайдено.

## Хмари (кінець Resources → Footer)
3 чорні хмари (boolean-union еліпсів; fill `#0C0B0B`, біла тонка обводка по зовнішньому контуру). Фон кадру `#FDFCFA` (кремовий) у всіх кадрах; хмари його «закривають», самого фону не темнішає — чорним стає лише область хмар/футера, що наїжджає. Заголовок і Menubar списку Resources у (4) ще на кремовому фоні; у (4-1)+ Image/список повністю перекриті хмарами й футером. Header (лого, motion.ed, menu) у (4-1…фінал) білий на чорному (інверсія кольору — видно зі скріншота; у (4) чорний). Sound-кнопка (x=1358 y=672 48×44) — теж інвертується, у фінальному кадрі її немає (замість неї футер).

Розміри/позиції (px у кадрі 1440×750):

| Кадр | Cloud-3 | Cloud-1 | Cloud-2 | Footer y |
|---|---|---|---|---|
| (4) `795:31143` | x=168.09 y=422, 1038.6×487.9 | x=-186.2 y=387.01, 878.2×539.0 | x=603 y=327, 1125.9×689.9 | (немає) |
| (4-1) `795:31368` | y=-85 | y=-119.99 | y=-180 | 201 |
| (4-2) `795:31615` | y=-85 | y=-119.99 | y=-180 | 171 |
| фінал `795:31839` | x=75.60 y=-242.46, **1155.5×542.8** | y=-149.99 | y=-230 | 92 |

Δy: (4)→(4-1): усі три −507 (хмари). (4-1)→(4-2): хмари 0; футер −30. (4-2)→фінал: Cloud-3 −157.46 і масштаб ×1.1126 (x 168.09→75.60, ширина 1038.6→1155.5, висота 487.9→542.8; всі еліпси масштабовані пропорційно), Cloud-1 −30, Cloud-2 −50; футер −79. Сумарно (4-1)→фінал футер −109 (201→92), Cloud-3 −157, Cloud-1 −30, Cloud-2 −50 (паралакс: різні швидкості).
Ліва/права межі: Cloud-1 x=-186…692 (виходить за лівий край), Cloud-2 x=603…1729 (виходить за правий), Cloud-3 по центру x=168…1207 (фінал 76…1231).

**Z-порядок** (порядок дітей у кадрі, нижній = вищий): Image/список/Menubar → Cloud-3 → Cloud-1 → Cloud-2 → **Footer** → Sound → Header. Тобто футер над усіма хмарами, хмари над списком Resources. У (4) чорні хмари над карткою IMA-HOME і списком.
Футер має власну хмарну верхню межу (Union), яка в кадрах 4-1/4-2 виглядає як друга лінія хмар з білою обводкою під чорними хмарами — виходить «подвійний» хмарний край. У фіналі видно: чорні хмари (їх обводка) у верхній частині 750, нижче — контур футера.
Фінал: Footer y=92…751 (659) — майже повністю заповнює viewport 750.

## Ассети
- Union футера desktop: SVG (`imgUnion`, 1762.36×659, вузол `795:31098`) — експортувати з Figma (кастомний контур; з Webflow-ассетів взяти існуючі `resources-clouds`/cloud SVG, якщо збігаються — на лайві не перевірено).
- Union tablet: SVG вузол `891:27887`, 1182×744.5 (інший масштаб еліпсів, ~0.64 від desktop; не однаковий контур — окремий експорт).
- Чорні хмари кінця Resources: 3 SVG — Cloud-3 `795:38521` 1038×488 (у фіналі ×1.1126, робити CSS-scale, не окремий SVG), Cloud-1 `795:38520` 878×540, Cloud-2 `795:38522` 1126×690. Корінь SVG width/height не міняти.
- Іконок (стрілки, соцмережі) немає, лише текст. Зображень немає.
- Шрифти: PP Neue Machina Inktrap Regular/Ultrabold, Plain Regular — уже в проєкті (design-system.md).

## Тексти
Заголовок desktop (UP через CSS): «Motion» / «design» / «principles» (3 рядки, `w550` → переноси природні/явні).
Заголовок tablet: «Let’s get » / «the (designing) ball rolling now» (апостроф типографський ’; UP; на 770 виходить 3 візуальних рядки).
N.: Introduction · Easing · Delay · Fade in Fade Out. · Transform & Morph · Masking · Scale · Parallax · Zoom · Resources & Courses
S.: Dribbble · Instagram · Twitter · linkedin · Spotify
Нижній рядок: «Site by Zajno» · «© 2023. All rights reserved.» (рік 2023 у макеті; дрібне: на лайві може бути інший).
Мітки: «N.» та «S.».
Поміченні потенційні помилки (виправляти за правилом): «Fade in Fade Out.» — дві назви зліплено в один пункт, у кінці крапка; «linkedin» з малої; пункти N. — це уроки (Easing…Zoom) без Interactive/Techniques — звірити з лайвом; «Resources & Courses» (на лайві Resources?).

## Анімація (розкадровка з Figma)
Тривалостей/ease у Figma немає; з кадрів:
- Тригер: скрол (кінець секції Resources, pin/скрабінг).
- (4)→(4-1): 3 чорні хмари піднімаються знизу вгору, Δy −507 (всі однаково), закриваючи картку/список; футер з'являється під ними з y=201 (з-під низу).
- (4-1)→(4-2): футер піднімається на 30 (201→171), хмари нерухомі.
- (4-2)→фінал: хмари продовжують підйом різною мірою (Cloud-3 −157 + scale 1.1126, Cloud-1 −30, Cloud-2 −50), футер −79 до y=92 (кадр 750 заповнено).
- Властивості: translateY, у Cloud-3 ще scale (origin умовно центр: x зсув −92.5, y −157 при приросту розміру +116.9×+54.9 → центр майже тримається).
- Hover/стани: у футері варіантів компонентів немає (пункти — просто текст); стану hover не показано. Підкреслено лише «Zajno».
- Header/Sound кольори інвертуються над чорним (білий контур/текст) — тригер, ймовірно, перетин із чорним.

## Розбіжності Figma ↔ лайв

Еталон — лайв (правило проєкту). Figma — лише підказка для станів.

| Що | Figma | Лайв (беремо) |
|---|---|---|
| Висота футера | символ `795:39109` 659 разом із хмарною шапкою | блок контенту **469** (1440) / 758 (768) / 981 (375); шапка — хмара `is-first` (Footer_desktop.svg = Union 659), що висить на −192 над ним |
| Заголовок 768 | «Let’s get the (designing) ball rolling now» (символ `891:27933`) | «Motion / design / principles» на всіх смугах |
| N., 7-й пункт | Scale | **Dimension** (`#dimension`) |
| S., 5-й пункт | Spotify | **Clutch** (clutch.co/profile/zajno) |
| © | 2023 | **© 2024. All rights reserved.** |
| Підпис | «Site by Zajno» | **«Made by Zajno»** |
| Стилі пунктів N. | мікс Inktrap / Plain | усі Inktrap (`f-link`) |
| Іконки | немає | ≤479: стрілка 24×24 праворуч у кожному пункті N., соцмережі — лише іконки 32×32 у рядок між двома лініями `rgba(253,252,250,.2)` |
| Хмари кінця Resources | Cloud-3 / Cloud-1 / Cloud-2 + Union | це `footer-cloud-item` `.is-fourth` / `.is-second` / `.is-third` + `.is-first` (розміри збігаються: 1038×488, 880×542, 1128×692, 1440×659) |
| Анімація хмар | хмари підіймаються швидше за футер, Cloud-3 масштабується | IX2: хмари їдуть разом із футером і **відстають донизу** на 1.2 / 1 / 2 rem (паралакс); масштабу немає |
| Header / Sound над чорним | інвертуються | навбар — прохід Navigation; Sound **ховається**, коли футер у в'юпорті (прохід Sound) |

## Лайв-заміри (сесія 23, `tools/record/footer-probe.mjs`)

Сирі дані — scratchpad сесії (`footer-struct-<vp>.json`, `footer-scan-<vp>.txt`, `footer-hover-1440.txt`) + CSS лайву через curl.
SVG іконок — [reference/footer-svgs.json](../../reference/footer-svgs.json).

### DOM і геометрія

`div.nav.nav-dark` (фон `#0C0B0B`; **перший `.nav-dark` на сторінці — навбар**, футер — батько `.footer`) одразу після `#resources`
(pin-spacer закінчується там, де починається футер: 1440 — 68889). `.footer` — relative, **z 13** (≤991 z 11), `overflow: clip visible`
(правило в `main-css`). Усередині:

```
div.footer  (relative, z13)
├─ div.footer-clouds-list  (relative, h 0)
│  └─ div.footer-cloud-item.is-first … is-fourth   абсолют, фон SVG cover (3 набори за смугою), y — IX2
└─ div.footer-content  (relative, z4, фон #0C0B0B, column, gap .6 / .4 / .5rem, p .24 .34 .45 / .24 .24 .2 / .24 .22 .43)
   ├─ div.footer-list  (row → column ≤991, gap .4 / .32)
   │  ├─ div.footer-item._1  (5.03rem, mr 2.24 → 0 ≤991, auto ≤479) > h5.h5  «Motion<br>design<br>principles»
   │  └─ div.flex-display.is-footer  (row; column ≤479, gap .32)
   │     ├─ div.footer-item._2 (2.59 → 3.68rem, mr 1.35 → .8 → 0) > f-navigation > f-label «N.» + f-navigation-list.is-menu > a.f-link ×10
   │     └─ div.footer-item > f-navigation > f-label.mobile-hidden «S.» + f-navigation-list.is-social > a.f-link ×5
   └─ div.footer-info > f-info-container (space-between; column center ≤479)
      ├─ div.zajno-label.is-desktop  «Made by » + a.zajno-link > span.text-span «Zajno» (underline)
      └─ div  «© 2024. All rights reserved.»
```

| | 1440 | 768 | 375 |
|---|---|---|---|
| футер h | 469 | 758 | 981 |
| заголовок `.h5` | 54 / 58, 503 × 174 (3 рядки) | 44 / 58 | 34 / 40, 331 × 120 |
| колонки | заголовок x 34 · N. x 761 (w 259) · S. x 1154.9 | заголовок y 24; N. x 24 (w 368) · S. x 472, y 238 | усе в колонку x 22 |
| пункт `.f-link` | Inktrap 16 / 28, ls −0.48px (−.0048rem), flex space-between | 24 / 40 | 16 / 24, gap .24rem, mt .08rem; стрілка 24×24 |
| соцмережі | текст | текст | лише іконки 32×32, row center, gap .32, py .32, бордери верх/низ 1px `rgba(253,252,250,.2)` |
| `.f-label` | Inktrap 700, 16 / 32 | — | «S.» прихована |
| нижній рядок | Plain 16 / 28; «Made by Zajno» x 34 y 396, © праворуч | 14 / 28 | 12 / 18, column center, gap .5rem: «Made by Zajno», нижче © |
| хмари (rem, top / left / w × h, z) | first −1.92 / 0 / 100% × 6.59 z4 (bg 50% 0) · second −4.87 / −1.3 / 8.8 × 5.42 z3 · third −5.47 / right −2.6 / 11.28 × 6.92 z2 (bg 0 0) · fourth −4.98 / 2.48 / 10.38 × 4.88 z1 | first −2.93 / 10.44 h · second −3.8 / −1.78 / 4.74 × 3.17 z2 · third −4.09 / right −2.16 / 6.77 × 4.18 z3 · fourth −2.23 / .51 / 3.7 × 1.72 z2 | first −1.91 / 11.78 h · second −2.49 / −1.22 / 2.52 × 1.72 · third −2.64 / right −1.23 / 3.62 × 2.22 · fourth −1.63 / 0 / 2.02 × .92 |

- Посилання N.: `#hero`, `#easing`, `#delay`, `#fade`, `#morph`, `#masking`, `#dimension`, `#parallax`, `#zoom`, `#resources` (на «Easing» — `w--current`,
  артефакт Webflow). S.: dribbble.com/zajno, instagram.com/zajno/?hl=en, twitter.com/zajnocrew?lang=en, linkedin.com/company/zajno,
  clutch.co/profile/zajno — `target=_blank` **без `rel`**. Zajno → https://zajno.com/ (`_blank`).
- **Hover**: лише `.f-link:hover { text-decoration: underline }`, без переходу (заміри 50–600 мс — однаково). Колір, іконки не рухаються.
- SVG хмар у копії (бакет `6ac8e847…f2fe`): `…f3cb_Footer_desktop`, `…f3c9_Footer_Cloud-1_desktop`, `…f3c7_Footer_Cloud-2_desktop`,
  `…f3c6_Footer_Cloud-3_desktop`, `…f3cc_Footer_tablet`, `…f3ca_Footer_Cloud-1_tablet`, `…f3cd_Footer_Cloud-2_tablet`, `…f3d0_Footer_Cloud-3_tablet`,
  `…f3d4_Footer_mobile`, `…f3ce_Footer_Cloud-1_mobile`, `…f3cf_Footer_Cloud-2_mobile`, `…f3d1_Footer_Cloud-3_mobile` (усі 12 є).

### IX2 футера (`e-720` → `a-126`, усі смуги; дубль `e-486` на символі футера)

- Тригер — `.footer`, SCROLLING_IN_VIEW, smoothing 90, `startsEntering` з офсетом −15 %, `endOffsetValue` 100 %.
- Ключі: **0 → 50 %** `.resources-overlay` `rgba(0,0,0,0)` → `rgb(12,11,11)`; **0 → 72 %** хмари `y`: first 0, second 0 → **1.2rem**,
  third 0 → **1rem**, fourth 0 → **2rem** (вниз, тобто хмари відстають від футера).
- **Формула прогресу (підігнано зі скану, Δ ≤ 0.1 px / 0.005 alpha на 3 смугах):**
  `p = (vh + 0.15·h − top) / (vh + 0.15·h)`, де `top` — верх `.footer` у в'юпорті, `h` — його висота. Тобто старт — верх футера на
  `vh + 0.15·h` (офсет −15 % — від висоти **елемента**), кінець — верх футера на 0. Перевірка: 1440 при top 769 → p 0.208 → alpha 0.416 ✓,
  second 34.5 ✓; 768 при top 1024 → p 0.100 → alpha 0.20 ✓; 375 — хмари доходять до 120 / 100 / 200 ✓.
- Кінець сторінки обрізає прогрес: 1440 — max p = (970 − 431) / 970 = **0.556** (оверлей чорний, хмари на 77 %: 92.6 / 77.1 / 154.3);
  768 — 0.77 (хмари дійшли); 375 — 1.
- Оверлей (`.resources-overlay`, лише на `resources-full`, 100% × 100vh, z 1) починає темніти, коли pin Resources ще триває (1440: за ~45 px
  до кінця pin), і далі їде вгору разом із секцією.
- **Sound** (`.sound-btn-wrap`): `display none` + opacity 0, щойно футер входить у в'юпорт (SCROLL_INTO_VIEW, офсет 0), назад — коли виходить
  (e-487 / e-488 на символі футера). Прохід Sound.
- Навбар над футером: 1440 темний уже на кінці pin; 768 — темний з кінця pin; 375 — світлий, темніє, коли верх футера вище за навбар.
  Прохід Navigation.

## План компонента

**Компонент `site-footer`** (група System): той самий футер треба буде ставити на шаблони CMS і Styleguide (на оригіналі це символ —
IX2 `e-486` висить на `64366fbe…|82669f55…`). На Home — інстанс одразу після `section-resources`.

**Імена.** Старий IX2 `a-126` бере цілі **за класом** (`.footer-cloud-item.is-*`, `.resources-overlay`) по всій сторінці, а `main-css` має
правило для `.footer`. Тому нові класи — з префіксом **`ft-*`**, корінь — `site-footer`. Старий футер лишається до видалення старих секцій.

```
footer.site-footer  data-motion="footer"  (relative, z 13 / ≤991 z 11, overflow clip visible, color fg-on-dark)
├─ div.ft-clouds  aria-hidden  data-motion="ft-clouds"           relative, h 0
│  └─ div.ft-cloud.is-first | is-second | is-third | is-fourth   абсолют, bg SVG cover за смугою (бакет копії); is-second…fourth: data-motion="ft-cloud"
└─ div.ft-content                                                  relative, z 4, фон semantic dark (#0C0B0B), column, gap/padding як лайв
   ├─ div.ft-main  (row → column ≤991)
   │  ├─ p.ft-title.heading-sm  «Motion<br>design<br>principles»   (w 5.03rem, mr 2.24; heading-sm = лайв .h5 на 3 смугах)
   │  └─ div.ft-navs  (row; column ≤479)
   │     ├─ nav.ft-nav.is-menu  aria-label="Lessons"  > div.ft-label «N.» + ul.ft-list > li > a.ft-link {текст + span.ft-arrow (embed SVG, ≤479)}
   │     └─ nav.ft-nav.is-social aria-label="Social"   > div.ft-label.is-hide-tiny «S.» + ul.ft-list.is-social > li > a.ft-link (target _blank,
   │                                                       rel noopener, aria-label) {span.ft-social-icon (embed SVG, ≤479) + span.ft-link-text (≤479 hidden)}
   └─ div.ft-info  (space-between; column center ≤479; Plain 16/28 → 14 → 12/18)
      ├─ p.ft-credit  «Made by » + a.ft-zajno «Zajno» (underline, _blank, rel noopener)
      └─ p.ft-copy  «© 2024. All rights reserved.»
```

- **Тексти й посилання 1:1 з лайвом** (таблиця вище), зокрема «Fade in Fade Out.» і «linkedin» — дизайн-зміни не робимо. Якорі — фінальні
  id (`#hero`, `#easing` …); поки нові секції мають `*-next`, на staging вони ведуть на старі секції — це очікувано.
- **Пропси компонента:** немає (футер однаковий скрізь). `w--current` не відтворюємо.
- **Типографіка:** заголовок — `heading-sm`; пункт — літерал `ft-link` (Inktrap 16 / 28, ls −0.03em; ≤991 24 / 40; ≤479 16 / 24) — `body-*`
  не збігаються (tracking / lh); мітка — літерал (Inktrap 700 16 / 32); інфо — літерал (Plain 16/28 → 14/28 → 12/18).
- **Кольори:** `semantic` dark-режим на `site-footer` (фон `bg` = #0C0B0B, текст `foreground` = #FDFCFA), бордер соцмереж — 20 % foreground.
- **Відступи від лайву (свідомі):** `<footer>` / `<nav>` / `<ul>` замість div-ів; `rel="noopener"` на зовнішніх; `aria-label` на іконкових
  посиланнях (на ≤479 текст прихований); рік — літерал 2024, як на лайві (оновлення — окреме рішення).

## План анімації

**Кодом, `initFooter()`** (після `initResources()`), не IX3: оверлей живе в іншій секції, а формула прогресу спільна з іншими IX2-портами.

| Що | Як | Числа |
|---|---|---|
| Прогрес | один scrub-таймлайн, `trigger: site-footer`, `start: () => top ${vh + 0.15·h}px`, `end: 'top top'`, `scrub: 1` (smoothing 90, як Techniques / Lessons), `invalidateOnRefresh` | кінець сторінки обрізає: 1440 max p 0.556 |
| Оверлей | `res-overlay` (у `section-resources`): фон `#0C0B0B` у класі, анімуємо **`opacity` 0 → 1** на 0 → 0.5 (композитор; різниця з інтерполяцією rgba ≤ 3/255) | 0 → 50 % |
| Хмари | `ft-cloud` second / third / fourth: `y` 0 → 1.2 / 1 / 2 rem на 0 → 0.72, усі смуги (на відміну від хмар Resources, ті лише ≥992) | 0 → 72 % |
| Sound | не тут — прохід Sound (ховати кнопку, поки футер у в'юпорті) | — |
| Тема навбара | не тут — прохід Navigation | — |
| Hover | CSS `:hover` underline (без переходу), як лайв | — |

- **reduced-motion:** оверлей лишається (це колір, а не рух), без згладжування (`scrub: true`); хмари стоять.
- **Без JS:** оверлей прозорий (opacity 0 у класі), футер і хмари на місці.
- **Перевірка:** `footer-compare.mjs` — статика нового футера проти старого на staging (1440 / 768 / 600 / 375): геометрія за індексом
  відносно кореня, шрифти, тексти, href/target, фони хмар (ім'я файлу), бордер соцмереж, видимість іконок/текстів за смугою.
  `footer-run.mjs` — після коду: оверлей і хмари в кількох точках проти формули й лайву (`--live`).

## Питання

Питання субагента закрито правилом «лайв — істина» (головна сесія 23):
1. Desktop-еталон — лайв; `795:39109` — найближчий символ Figma, `795:38432` застарілий.
2. Заголовок на всіх смугах — «Motion design principles» (лайв); tablet-текст Figma не беремо; 375 — лайв.
3. «Fade in Fade Out.» — один пункт, як на лайві; якорі й URL — з лайву (таблиця «Лайв-заміри»).
4. Стиль пунктів — один (Inktrap), як на лайві.
5. Рік — © 2024, як на лайві; актуалізація — дизайн-рішення користувача (не питаємо, поки не скаже).
6. Дві SVG: власна шапка футера = `is-first` (Footer_desktop.svg), чорні хмари = `is-second…fourth`; з хмарами Resources не спільні (інші файли).
7. Лайв: «**Made** by Zajno» (у Figma «Site by»), підкреслене лише «Zajno» на всіх смугах (16 / 14 / 12 px).
8. Навбар — прохід Navigation; Sound ховається над футером — прохід Sound.

Відкритих питань до користувача немає.

## Збірка в копії (сесія 23, 2026-10-10)

Компонент **`site-footer`** `4ecddcd8-b434-4aca-e41a-0503bfda4bd9` (група System, без пропсів). Інстанс на Home
`0b1d1fec-de0e-2091-a1a9-e96419bad760` — у `main` одразу після `section-resources`, перед старими секціями. Старий футер лишається
до видалення старих секцій.

```
footer.site-footer  data-motion="footer"                       relative, z 13 / ≤991 11, overflow clip visible, semantic: dark, color foreground
├─ div.ft-clouds  data-motion="ft-clouds" aria-hidden            relative, h 0, pointer-events none
│  └─ div.ft-cloud.is-first | is-second | is-third | is-fourth    фон SVG (бакет копії, 3 смуги; ті самі ассети, що в старих класах)
│     (is-second … is-fourth: data-motion="ft-cloud")
└─ div.ft-content                                                 relative, z 4, фон bg (dark = #0C0B0B), column, gap / padding як лайв
   ├─ div.ft-main  (row → column ≤991)
   │  ├─ p.heading-sm.ft-title  «Motion<br>design<br>principles»   w 5.03rem, mr 2.24 (≤991 0), align-self flex-start (≤479 stretch, w auto)
   │  └─ div.ft-navs  (row → column ≤479)
   │     ├─ nav.ft-nav.is-menu  aria-label="Lessons"  > div.ft-label «N.» + ul.ft-list.is-menu
   │     │     └─ li > a.ft-link {#hero … #resources} > div {текст} + embed.ft-arrow (SVG 24, лише ≤479)
   │     └─ nav.ft-nav  aria-label="Social"  > div.ft-label.is-hide-tiny «S.» + ul.ft-list.is-social (≤479 row, бордери 20 %)
   │           └─ li > a.ft-link (нова вкладка, rel noopener, aria-label) > embed.ft-social-icon (SVG 32, лише ≤479) + div.ft-link-text (≤479 hidden)
   └─ div.ft-info  (space-between; ≤479 column center)
      ├─ p.ft-credit  «Made by » + a.ft-zajno «Zajno» (underline, нова вкладка, rel noopener)
      └─ p.ft-copy  «© 2024. All rights reserved.»
```

- **Класи** (19 + комбо `ft-cloud.is-first…is-fourth`, `ft-nav.is-menu`, `ft-label.is-hide-tiny`, `ft-list.is-menu`, `ft-list.is-social`):
  значення 1:1 з лайв-CSS (таблиця «Лайв-заміри»), шрифти — `font-body` / `font-display`, вага — `weight-*`, кольори — `semantic`
  (режим dark на корені). Пункт — літерал (Inktrap 16 / 28, ls −0.0048rem; ≤991 24 / 40; ≤479 16 / 24), заголовок — `heading-sm`.
  Hover — `.ft-link:hover { text-decoration: underline }`. `footer-info` + `f-info-container` злиті в `ft-info`.
- **`res-overlay`** отримав фон `neutral-1000` і `opacity: 0` — під твін `initFooter()` (opacity 0 → 1). Без JS оверлей прозорий.
- **Звірка:** `tools/record/footer-compare.mjs` — новий vs старий футер на staging (старий скрипт і наш модуль заблоковано, IX2-трансформи
  старих хмар скинуто), 1440 / 768 / 600 / 375: геометрія відносно кореня, шрифт / колір / регістр / текст, фон, файли SVG хмар, бордери
  соцмереж, href + target, підкреслення Zajno, видимість іконок / текстів за смугою, hover першого пункту (1440). Результат: **65 / 64 / 64 / 64,
  0 прапорців, Δ 0**. Перший прогін зловив 2 мої помилки: «Site by» → «Made by» (з Figma) і заголовок, розтягнутий flex-рядком.
- **Не зроблено:** `initFooter()` (оверлей + хмари, план вище) і `footer-run.mjs`; Sound — прохід Sound; тема навбара — Navigation; футер на
  шаблонах CMS і Styleguide — з їхніми проходами.

## Анімація в коді (сесія 24, 2026-10-10)

`initFooter()` у `src/motion.js` (після `initResources()`), коміт `99028b6`:

- Один scrub-таймлайн: `trigger` = `[data-motion="footer"]`, `start: top (vh + 0.15·h)px`, `end: top top`, `scrub: 1`,
  `invalidateOnRefresh`, **`refreshPriority: -1`** — при зміні ширини Resources перебудовує свій pin пізніше, ніж створено тригер футера,
  а футер має переміряти позицію вже після нового spacer-а.
- `res-overlay` `opacity` 0 → 1 на 0 → 0.5; `ft-cloud` (second / third / fourth) `y` 0 → 1.2 / 1 / 2 rem на 0 → 0.72; таймлайн доповнено до 1.
- reduced-motion: оверлей іде за прогресом без згладжування (`scrub: true`), хмари стоять.

**Перевірка** — `tools/record/footer-run.mjs` (новий): точки p = 0.05 … 1 на новому футері проти моделі `p = (vh + 0.15·h − top) / (vh + 0.15·h)`
і ті самі точки на **старому футері зі справжнім IX2 `a-126`** на тій самій сторінці staging (лайв-еталон; кінець сторінки обрізає його так само,
як на motion.zajno.com: 1440 max 0.555, 768 0.766, 600 0.688). 1440 додатково — resize 1440 → 1280 (перебудова pin-а Resources) і повторна точка.
Результат: 1440 / 768 / 600 / 375, локальний модуль і `--live` — **0 прапорців, Δ opacity ≤ 0.001, Δ хмар ≤ 0.1 px**; `--reduce` 1440 / 375 — 0.
