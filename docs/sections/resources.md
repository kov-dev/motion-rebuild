# Resources («6. Courses&Sources»)

## Джерела
- Figma: файл `KJQjG15P2P3SkXwrJJxLOp`. Обгортка користувача `4616:22252` (section «courses», 13959×8494) — **лише смуга 1440**, 768/375 у ній немає. Координати нижче — всередині кадру (px макета).
- 768 / 375 — окремі кадри поза обгорткою (з FIGMA.md): `886:25095` (768×1024) і `951:30268` (375×667). Це **лише вхід у секцію** (хмари + заголовок «Useful / resources / &courses»), станів списків 768/375 не знайдено (сусідні кадри кластера не шукав, `get_metadata` сторінки заборонено).
- Лайв: `section.nav.nav-light#resources` (288 вузлів), CMS 2×images + 2×list (див. home-tree.md §6). Запису в reference/recordings не перевіряв.
- Тексти нотаток дизайнера в Figma (російською, поза кадрами, y=3170–3220): «Дефолтная карточка 0o», «Работает по скроллу», «Работает по клику?», «Поворт карточки 3o», «Поворт карточки 6o», «Поворт карточки 0o + 1 карточка пропадает» — це розкадровка hover/scroll стеку картинок (кадри `795:38891` → `794:29453`/`795:30411` → `795:30572` → `795:30736`).

| node-id | Назва | Розмір | Стан |
|---|---|---|---|
| `784:27387` | 6. Courses&Sources(1) | 1440×750 | Вхід: 2 картки Lessons (`2`, `3` 727×546, x=-80 / x=679, y=102) виїжджають вгору, знизу 3 білі хмари + BG-блоб (хмари Lessons → Resources, див. «Хмари») |
| `795:29962` | (1-2 Full) | 1440×1540 | Той самий вхід довгим кадром: BG-блоб 1443×3251 (y=314), під ним 3 заголовки + 3 стрілки (`resources` y=830, `Useful` y=624, `&courses` y=1036, стрілки x=1209) |
| `794:29297` | (2) | 1440×750 | **Заголовки на екрані**: `Useful` y=118, `courses` y=324 (w902), `&Sources` y=530, стрілки x=1207 (y=118/324/530), Header, Sound, Item_scroll (над кадром y=-96) |
| `795:30242` | (3-1 Full) | 3182×750 | **Горизонтальний трек цілком**: [0…1440] заголовки (`resources` замість `courses`, `&courses` замість `&Sources` — текст інший, див. розбіжності) → student-панель 130×752 x=1526 → картка 636×460 x=1733 + Menubar/список x=2459 (зсув треку ≈ −1739 для картки і −1719 для списку) |
| `794:29453` | (3-1) | 1440×750 | Після треку: ліворуч картка UX in Motion 636×460 (x=34,y=152), праворуч Menubar «resources»/«courses» + список 10 (Frame 69 x=760,y=244, Vector 142 y=210) |
| `784:27626` | (3-2 | 1440×750 | Список 2 (Sources): Frame 70 (курси) y=-153 вийшов вгору, Frame 69 (4 пункти) y=417 під ним; картка Medium «Creating Usability…» |
| `795:38891` | (3-1-2) Principle | 1440×750 | Hover-стан 0°: одна картка (стопки нема), список 10 пунктів y=244 |
| `795:30411` | (3-1-2) Principle | 1440×750 | Hover: стек 2 картки, верхня «UX/UI Animation» (Projector) повернута −3.05° |
| `795:30572` | (3-1-3) Principle | 1440×750 | Hover: стек 3 картки, верхня «Modern Motion Design» −6.26°; список Sources, Frame 70 y=-153 |
| `795:30736` | (3-1-3) Principle | 1440×750 | Hover: 3 картки, верхня повернута назад на 0° — «UI Animations and Interactions» (Udemy/Ae), стек −3°/−6° позаду |
| `795:30914` | (3-1-3) Full | 1440×1767 | Довгий кадр: Image-стек (y=96) + Menubar + список + Footer (`795:39109`, y=1109) |
| `795:31143` | (4) | 1440×750 | Кінець: 3 чорні хмари входять знизу (Cloud-3 y=422, Cloud-1 y=387, Cloud-2 y=327), картка IMA-HOME, список «Resources» 10 пунктів |
| `795:31368` | (4-1) | 1440×750 | Хмари піднялись (Cloud-3 y=-85, Cloud-1 y=-120, Cloud-2 y=-180), під ними Footer y=201 |
| `795:31615` | (4-2) | 1440×750 | Footer y=171, хмари ті самі |
| `795:31839` | (4-2) | 1440×750 | Фінал: Footer y=92, Cloud-3 y=-242 (1155.5×542.8), Cloud-1 y=-150, Cloud-2 y=-230 |
| `795:38521` / `795:38520` / `795:38522` | Cloud-3 / Cloud-1 / Cloud-2 | 1038×488 / 878×540 / 1126×690 | Окремі контури хмар (чорні, експорт SVG) |
| `795:38432` | Footer | 1440×709 | Символ футера (поза секцією) |
| `795:29947` | Menubar | 646×220 | Символ шапки списку (tab + лічильник) |
| `794:29288` | Arrow | 199×190 | Символ стрілки |
| `795:29746` | Item (Active / Variant2) | 686×108 (2 варіанти 646×24) | Символ рядка списку |
| `886:25095` | 768 вхід | 768×1024 | Хмари + 3 заголовки внизу |
| `951:30268` | 375 вхід | 375×667 | Хмари + «Implementation examples» + 2 Card_ex + 3 заголовки внизу |

Кадри-копії станів 3-1-2 (`795:38891` та `795:30411`) мають однакову назву — розрізняти за id.

## Структура (дерево з ролями) ↔ лайв
```
Figma кадр (1440×750, bg #FDFCFA)                      лайв
├─ Header (лого + motion.ed + menu), Sound, Item_scroll   навбар сайту (fixed) — не секція
├─ Заголовки: Useful / courses / &Sources + 3 Arrow       div.resources-titles > div.arrow-title-wrap ×3
│    текст 195/190 ls -7.8 UP, Arrow 199×190 справа          > div["Useful"], div.resources-arrow > .resources-arrow-icon (embed svg)
├─ Student-панель 130×752 з вертикальним текстом           div.resources-student > .text-block-3
├─ Image-стек (картки 636×460 r24) ліворуч                 div.resources-images > .resources-images__list ×2 (CMS 10+4) > __item
├─ Menubar ×2 (таб + лічильник) і Frame 69/70 (список)     div.resources-content
│   Menubar 646×220                                          > div.resources-header > .resources-header__item ×2 (__text + __count)
│   Item 646×24 + Line 645×1, gap 16                         > div.resources-lists > .resources-list ×2 (CMS) > .resources-item
│   Item: Dot 12 + Point (текст 531 ellipsis) + Button-a    .resources-item__name, .resources-item__button, btn-link-icon
└─ Хмари наприкінці (чорні) + Footer                       div.resources-overlay (хмари/затемнення) + #footer
```
Обгортки лайву `resources` > `resources-track` > `resources-main` (titles), `resources-student`, `resources-full` > `resources-wrapp` > (`images` + `content`) — у Figma відповідає горизонтальному треку 3182 (кадр `795:30242`): main 0–1440 → student x=1526 → картка x=1733 → список x=2459.

## Токени
**Кольори**
| Hex | Де | Змінна |
|---|---|---|
| `#FDFCFA` | фон секції, фон Item/BG, Menubar BG, student-панель, лічильник (текст) | `neutral-0` |
| `#0C0B0B` | текст, Line, Dot, бордери, лічильник (коло), хмари в кінці | `neutral-1000` |
| `#222222` | картки в стеку (fill і border) і текст/лінії на білих картках | **нова** (немає в `core`; літерал або `neutral-900`-подібна) |
| `#FDFCFA` | текст/контури на темних картках | `neutral-0` |
| фон кадру 1 (вхід) | блакитно-сірий, візуально `extra-lesson-zoom` `#C2D5D7` (hex не знімав) | `extra-lesson-zoom` |

**Типографіка** (1440 / 768 / 375)
| Елемент | Шрифт | Кегль/lh/ls (макет) | Наш стиль |
|---|---|---|---|
| Заголовки Useful/courses/&Sources | PP Neue Machina Plain, UP | **195 / 190 / −7.8px** (Figma `H1-m`: 195/190/−4%); 768: **105 / 100 / −4.2** (`Tablet/H1-m`); 375: **44 / 48 / −1.76** (`Mobile/H1-m`) | **новий** (≠ `display-xl` 215, ≠ `display-lg` 160). Літерал `resources-title` (CONVENTIONS: 1.95rem, у списку «поза стилями») |
| Таб (Menubar текст) | Plain, UP | 54 / 58 / 0 (`Desktop/H5`) | `heading-sm` (54, lh 1.07 = 57.8 ✓) |
| Лічильник | Plain | 16 / 24 / 0, центр, #FDFCFA у колі 38 | `text-label`(лайв, lh 1) або `body-sm` без ls — звірити з лайвом |
| Назва Item | Plain | 16 / 24 / −0.32 (`Desktop/P3`, −2%) | `body-sm` ✓ |
| «View» | Plain | 16 / 24 / 0 (`Button-A`) | `btn is-link` / `body-sm` (ls 0 — відрізняється від −2%) |
| Заголовок картки у стеку | Plain, UP | 44 / normal / −1.76px | **новий** (літерал, lh normal ≈ 1.2; не `heading-md` 74) |
| Student-текст | Magilio Regular | 34 / normal / −0.68 (`N2`: 34/100/−2%), вертикально (rotate 90°) | `font-accent`, літерал `resources-student` ✓ (34) |
| Header-пілюлі | Inktrap | 16 / 16 / −0.48, lowercase | `text-label` (навбар, поза секцією) |

**Розміри / радіуси / бордери**
- Картка: 636×460, radius **24**, border 1px (`#0C0B0B` на дефолтних рамках, `#222` на темних), padding тексту 40.
- Student-панель: 130×752, border 1px `#0C0B0B`, bg `#FDFCFA`.
- Item: 646×24; Dot 12×12 (y=5/6); Point (BG) 619×24, текст w531 (ellipsis, nowrap); Button-a x=585, gap 8, іконка 12×24; Line 645×1; gap між Item і Line 16 → крок рядка 57 (24+16+1+16).
- Menubar: 646×220, лінія внизу y=220 (1px), заголовок прив'язаний до низу (y=220, w583, lh 58), лічильник 38×38 (x=607, y=172), число x=625.5 y=180.
- Arrow: 199×190 (1440) · 104×100 (768) · 51×48 (375).
- Лінія-розділювач `Vector 142` 645×0 x=760 (y=170 у станах hover, y=210/220 у 3-1/2).

## Розкладка
**1440** (абсолютна в Figma → flex у Webflow)
- Ліва колонка (картки): x=34, y=152, 636×460 (стек: бекграунд-картки зсунуті, див. анімацію).
- Права колонка: x=760, w=646 (до x=1406 = 1440−34). Menubar y=0 → 220; список Frame 69 y=96 (4/…) або 244 (3-1).
- Поля: 34 зліва/справа. Header 34/34 (h44).
- Заголовки: x=34, крок по y 206 (118 → 324 → 530), висота 190, стрілки x=1207 (до 1406), стрілка вирівняна по y з рядком.
- Видима частина списку ≈ 8 Item (y=96…620 у кадрі), решта обрізана; Menubar закриває список зверху (BG #FDFCFA).

**768** (`886:25095`, лише вхід)
- Заголовки x=22, y=762/872/982 (крок 110, h100); `Useful` w378, `resources` w611, `&courses` w575; стрілки x=640 (104×100).
- Хмари: Cloud-3 x=-180 y=324 473×316; Cloud-2 x=50 y=485 369×170; Cloud-1 x=307 y=295 677×418; BG-блоб x=-2 y=321 770×1101.
- 2 картки (Lessons) `1`/`2` 600×520 x=-494 / 141, y=157. Sound 40×34 x=704 y=966.

**375** (`951:30268`, лише вхід)
- Заголовки (Group 665 331×150 x=22 y=507): `Useful` y=507, `resources` y=558, `&courses` y=609, крок 51 (h48); стрілки x=302 (51×48); `Useful` w159, `resources` w256, `&courses` w241.
- «Implementation examples» (text 357×80 x=10 y=100) і 2 `Card_ex` 331×364 (x=22 / x=-317, y=192) — це кінець Lessons (картки), хмари: Cloud-3 x=-121 y=272 250×170, Cloud-2 x=0 y=358 200×90, Cloud-1 x=137 y=257 360×220, BG `Cloud` 669×573 x=-167 y=329+.
- Sound 40×34 x=313 y=517.
- Списків/стеку 768/375 у Figma немає — база лайву (≤991 / ≤479).

## Хмари
- **Вхід (кінець Lessons → Resources), 1440, кадр `784:27387`** — білі хмари (fill `#FDFCFA`, контур 1px `#0C0B0B`), векторні boolean-групи з еліпсів:
  - Cloud-3: x=-181 y=264 805.9×537.7
  - Cloud-2: x=206 y=488.5 667.9×385.5
  - Cloud-1: x=649.4 y=215 1152.2×710.6
  - BG (блоб + прямокутник): x=-2 y=314 1443×1273 (Rectangle 12606 y=433 1443×840, під ним union-блоб x=-175…1846, h740). У `1-2 Full` BG розтягнутий до 3251 висоти.
  - Разом **3 хмари + BG-фон = 4 шари** → співпадає з `resources-clouds-list` (4 хмари). Позиції по відношенню до секції: хмари стоять нижче карток Lessons, заходять на нижню половину кадру.
- **Кінець (Resources → Footer), 1440** — **чорні** хмари (fill `#0C0B0B`, контур білий): Cloud-3 1038.6×487.8, Cloud-1 878.2×538.9, Cloud-2 1125.9×689.9. Позиції: (4) x=168/-186/603, y=422/387/327; (4-1) y=-85/-120/-180; (4-2) те саме; фінал y=-242 (Cloud-3 стає 1155.5×542.8 x=75.6) / -150 / -230. Підйом (4)→(4-1): Δy=-507 / -507 / -507.
- 768 / 375: хмари входу описані вище; кінцевих хмар для 768/375 немає.

## Ассети
- Стрілка заголовка: `Arrow` символ `794:29288`, експорт SVG 199×190 (root width/height не міняти), 3 копії; 768 — 104×100, 375 — 51×48 (окремі SVG).
- Іконка «View»: SVG `Frame 88` 12×24 (btn-link-icon); Dot 12×12 SVG; Line SVG 645×1.
- Хмари: векторні (boolean-union еліпсів) → 4 SVG (Cloud-1/2/3 + BG) для входу, 3 SVG (`795:38520/38521/38522`) для кінця. Експорт SVG.
- Картки-стек: растр Rectangle 208/209/210 (по 3 PNG на стек) + вмонтований контент карток (логотипи UX in Motion, Medium, Projector, Motion Design School, IMA-HOME, Udemy/Ae; `image 86/87/91/92`) — **у лайві це CMS-картинки (images__item); у Figma картки зверстані вручну, брати з CMS/Webflow assets, не з Figma**.
- Student: текст Magilio (шрифт `Magilio-400` вже в копії).
- Header-іконки (teenyicons sound-on 16×16, menu 14×8, лого-очі) — навбар, поза секцією.

## Тексти
- Заголовки (UP): **«Useful»** · **«courses»** · **«&Sources»** (кадр `794:29297`, 3 рядки). У кадрах 1-2 Full і 3-1 Full: «Useful» · **«resources»** · **«&courses»** (на 768/375 те саме). Лайв — 3 `arrow-title-wrap`, перший «Useful».
- Student: «You are always a student, never a master» (вертикально, повернуто 90°, Magilio 34).
- Таби (Menubar): «courses» і «resources» (UP на екрані: COURSES / SOURCES або RESOURCES — у різних кадрах); лічильники: courses **10**, resources/sources **4**.
- Заголовки карток стеку: «Accelerate your product design career» (UX in Motion, `uxinmotion.com`), «Creating Usability with Motion: The UX in Motion Manifesto» (medium.com), «UX/UI Animation» (prjctr.com), «Modern Motion Design» (motiondesign.school), «UI Animations and Interactions with After Effects» (udemy.com).

**Список Courses (10 у Figma; лайв 14)** — Item: назва (повна, в UI обрізається ellipsis до 531), кнопка «View →»:
1. UX in Motion. Courses focused on UI animation in After Effect. (активний, з Dot)
2. UI / UX animation. The course from the Ukrainian online institute Projector.
3. UI Animation. A Complete Guide For Beginners, a short guide to ui/ux animation in text format with examples.
4. Motion design school. Courses dedicated to different types of animation, including UI animation.
5. UI Animations and Interactions with After Effects. An inexpensive course on UI animation in the After Effects from a Canadian product designer.
6. Complete guide to Prototyping & UI Animations in Principle. Prototyping course in Principle on the Awwwards platform.
7. Millionframes. Courses on both creating interfaces and prototyping them in Principle
8. Domestika. This platform has a large number of courses on 2D and 3D animation, motion design and illustration creation.
9. Ben Marriot. Course on animation in After Effects from the popular Australian motion designer Ben Marriott
10. School of Motion. A platform with a large number of courses on motion design and creating illustrations for subsequent animation.

**Список Sources/Resources (у Figma 4 «справжні» + плейсхолдер; лічильник 4)**:
1. Creating Usability with Motion: The UX in Motion Manifesto. Manifesto by Issara Willenskomer, product designer and UX in Motion educator. (активний)
2. Understand Disney's 12 principles of animation.
3. How Motion Design Applies to UI Design. A short guide on how motion design is used in interface design.
4. Animation in UI: How to Create Motion Design. Guide to motion design in the interface and its basic principles.

**Додатковий (відео-)список «Resources» у кадрах (4)/(4-1)/(4-2), 10 рядків — схоже на плейсхолдер (відео, не про моушн; лічильник теж «4»)**: My Favourite Clips Of Jeremy Clarkson · Pet pigeon puts himself to bed · NEW Quest 2 Update with HIDDEN Features? V37 Is HERE (активний) · These Paradoxes Keep Scientists Awake At Night! No Solutions! · Peter Parker vs Flash - School Fight Scene - Spider-Man (2002) Movie Clip HD · ENGAGE VR - Virtual Communications Made Real · Jack Black Impersonates The Rock · Job Simulator Gameplay - Auto Mechanic - HTC Vive · Animation in UI/UX · These Paradoxes Keep Scientists Awake At Night! No Solutions!
Автор/тип у айтемів немає — тільки назва (+ «View»). Посилань/іконок типу немає.

## Анімація (розкадровка з Figma)
1. **Вхід** (`784:27387` → `795:29962`): картки Lessons 727×546 і хмари; хмари + BG піднімаються і накривають кадр; під BG (y=314→) стоять 3 заголовки, що виїжджають у видиму зону (`1-2 Full`: `Useful` y=624, `resources` y=830, `&courses` y=1036 у BG; кадр 2 `794:29297`: y=118/324/530 у вікні 750).
2. **Pin + горизонтальний трек** (`794:29297` → `795:30242`, 3182): контент зсувається вліво: заголовки x=34 і стрілки x=1207 → вилітають; student-панель 130 на x=1526…1656 (текст Magilio посередині x≈1611–1648) → картка x=1733…2369 (UX in Motion) → список/Menubar x=2459…3105. Тобто трек ≈ 3182 = 1440 + 1742 (довжина прокрутки по X ≈ 1719–1739 px між заголовками і списком).
3. **Список з'являється**: у `794:29453` картка (x=34) і список (x=760) вже на місці, Menubar «resources» (цього кадру: «courses» 10), Vector 142 y=210.
4. **Перемикання списку** (`784:27626`): Frame 70 (Courses, 10) виїжджає вгору (y=-153…401), Frame 69 (Sources, 4 пункти) йде за ним (y=417); Menubar змінюється на «SOURCES»/«4»; картка міняється на «Creating Usability…» (medium). Тобто 2 списки стоять один під одним, scroll-linked зсув списків вгору, Menubar з BG перекриває верх.
5. **Hover/активація айтема і стек картинок** (`795:38891` → `795:30411` → `795:30572` → `795:30736`, нотатки дизайнера):
   - дефолт: картка 636×460 без повороту (0°);
   - наведення: з-під неї «виходять» 2 картки-тіні: перша −3° (Rectangle 208, bbox 659×493, x=22.4), друга −6° (Rectangle 209, bbox 681×524, x=11.7), обидві 636×460 r24, бордер 1px, зсув позаду основної;
   - у кадрі `795:30411`: верхня картка повернута −3.05°; у `795:30572`: верхня −6.26°; у `795:30736`: верхня повернулась назад до 0° і стоїть поверх двох повернутих (−3°/−6°) — це «стопка карт» (3 штуки), яка при зміні активного айтема тасується; анотація «1 карточка пропадает» (одна картка зникає при перемиканні);
   - «Работает по скроллу» / «Работает по клику?» — у дизайнера не вирішено, чи перемикання по скролу чи по кліку (відкрите питання).
   - Зміна картки відбувається при переході активного пункту (Dot 12 з'являється біля активного, текст зсувається на 27).
6. **Active item**: Dot (чорне коло 12×12) зліва, назва зсунута на x=27 (Point BG left 27, w619), решта пунктів без Dot, x=0. Hover-кольору/підкреслення у Figma окремо нема (Item має лише 2 варіанти: Active / Variant2 = без Dot); у лайві підкреслення «View» — CSS.
7. **Кінець**: 3 чорні хмари піднімаються знизу (`795:31143` y=422/387/327 → `795:31368` -85/-120/-180, Δ≈−507), закривають список і картку; за ними з'являється Footer (y=201 → 171 → 92). Тривалості/ease у Figma немає.

## Розбіжності Figma ↔ лайв
- Лайв: 28 CMS-айтемів (2 списки по 14 + картинки 10+4); Figma: 10 курсів + 4 джерела (+ 10 плейсхолдер-відео). Лічильники Figma 10 і 4, лайв — фактична кількість CMS.
- Заголовки: Figma `794:29297` — «Useful / courses / &Sources»; `795:30242` і 768/375 — «Useful / resources / &courses». Лайв — перший рядок «Useful», решту звірити (в home-tree показано один «Useful»).
- Заголовки 195/190 (1440) ≠ текстові стилі `display-xl` 215 / `display-lg` 160 → у CONVENTIONS уже це `resources-title` 1.95 (літерал). Підтверджено числами: 195/190 · 105/100 · 44/48.
- Student в Figma — окрема панель 130 з бордером і білим фоном; на лайві `.resources-student` + Magilio 34 (збігається по розміру).
- Картки стеку в Figma — зверстані вручну 636×460; на лайві — CMS-картинки (`resources-images__item`), тож картка не включає заголовок/лого окремо.
- Hover-стек (3 картки, повороти) — Figma; на лайві з home-tree не видно, як зроблено (IX2 тільки на `.resources`, решта JS: `resources-item` / `images__list`).
- Menubar в Figma — символ з BG, що перекриває список зверху; на лайві `resources-header` (2 таби) — таб не змінюється як символ, а перемикається scroll'ом (звірити).
- 768/375 списки і картки в Figma не знайдено.
- `Arrow` символ один, а на лайві 3 вбудовані SVG (`resources-arrow-icon`) — ок.

## Питання до користувача
1. Заголовки: «Useful / courses / &Sources» (кадр 2) чи «Useful / resources / &courses» (кадр Full)? Лайв — істина; підтвердити, що брати з лайву.
2. Hover-стек: перемикання по скролу чи по кліку (нотатка дизайнера без відповіді)? Скільки карток у стеку (3) і що значить «1 карточка пропадает»? Звіряти з лайвом (запис).
3. Кадрів 768/375 для списку/стеку/Menubar у Figma немає — брати базу лайву (≤991 / ≤479)?
4. Колір `#222222` карток — додати змінну чи літерал (тільки в Resources)?

## Відповіді на питання аналізу (головна сесія, сесія 21)

Правило «лайв — істина» закриває всі 4 питання, тож користувача не питаємо:
1. Заголовки: лайв — **«Useful» / «courses» / «&Sources»** (= кадр `794:29297`). Таби — «COURSES 10» / «SOURCES 4».
2. Стек картинок працює **на hover** (`mouseenter` айтема; на тачі — тап). Скрол стек не міняє. «1 карточка пропадає» означає, що в
   стеку максимум 3 картинки, а найстаріша гасне. Деталі — «Лайв-заміри → Hover-стек».
3. 768/375: база лайву (CSS нижче).
4. `#222` у лайві немає. Картки стеку — CMS-картинки з уже намальованою рамкою, тож нова змінна не потрібна.

Виправлення до аналізу вище: на лайві **10 + 4** CMS-айтеми (Courses, Resources), а не 14 + 14. 28 `w-dyn-item` = 10 + 4 картинки
+ 10 + 4 рядки. Те саме виправлено й у home-tree.md.

## Лайв-заміри (сесія 21, `tools/record/resources-probe.mjs`)

Сирі дані лежать у scratchpad сесії: `resources-struct-<vp>.json`, `resources-scan-<vp>.txt`, `resources-hover-1440.txt` і
`resources-css.txt` (68 правил із `motion-9888c6.webflow.*.css`). Сторінка зі стилями крос-доменна, тому CSS забрано через curl.

### Pin (script.v33, блок E; pin лінивий, `once` на `.is-lessons`)

| | 1440×900 | 768×1024 | 375×812 |
|---|---|---|---|
| `resources.scrollWidth` | 3010 | 1666 | 832 |
| зсув треку (`scrollWidth − vw`) | **1570** | **898** | **457** |
| `listsH` | 953 | 894 | 1101 |
| довжина pin = `1.5·vw + зсув + listsH` | 4684 | 2944 | 2121 |
| стрілки, кінцевий `x` | 1209.6 (0.84·vw) | 645.1 (0.84·vw) | 292.5 (**0.78·vw**, ≤479) |
| списки, кінець | `yPercent −100` (−953) | −894 | −1101 |

- Таймлайн `ease: none`, **`scrub: 3`**. Тривалості — цілі відсотки: `pA = int(1.5vw/total·100)`, `pT = int(зсув/total·100)`,
  `pL = int(2·listsH/total·100)`. Стрілки: кожна `pA`, stagger `pA/4`, тож фаза триває `1.5·pA`. Далі трек `pT`, потім списки `pL`.
  На 1440: 46 / 33 / 40 → стрілки 0–48.6 % pin, трек 48.6–71.8 %, списки 71.8–100 %. Скан збігається з цим із запізненням scrub.
- **Стрілка — це шторка.** `.resources-arrow` = абсолютний блок на весь рядок (1440×195, фон `#FDFCFA`) з іконкою зліва. Блок
  накриває слово і, рушаючи на `x = 0.84·vw`, відкриває його. Іконка доїжджає до x 1209.6 (Figma 1207).
- **Таб**: `active` перемикається, коли низ хедера перетинає верх 2-го списку (1440: при 82 % проходу списків).
  `.resources-header__item` має `opacity` з переходом 0.2 с.
- **Оверлей** `.resources-overlay` (лише на `resources-full`, z 1) — IX2 футера `e-720` (`a-126`, усі смуги): 0 → 50 % =
  `rgba(0,0,0,0)` → `rgb(12,11,11)`, smoothing 90, старт `startsEntering` −15 %, кінець +100 %. На лайві темніє вже на останніх
  ~5 % pin і після нього. **Це межа з Footer**: оверлей ставимо в Resources, а твін — у прохід Footer, разом із хмарами футера
  (чорні хмари з кадрів Figma (4)–(4-2) = `footer-cloud-item`).
- Навбар (лого/меню): світлий на pin, темний на 1440 з ~44 % pin, на 768 — з ~96 %, на 375 — після pin. Це прохід Navigation.

### Хмари на межі Lessons → Resources (`.resources-clouds-list`)

- Стоять наприкінці обгортки Lessons (h 0, `bottom: 0`, z 9), фон — SVG у `background-image` (окремі файли на 3 смуги). Відносно
  верху `#resources` (1440): first 0 / −192 1440×659 z4 · second −130 / −487 880×542 z3 · third 572 / −547 1128×692 z2 ·
  fourth 248 / −498 1038×488 z1. 768 і 375 — у CSS нижче (tablet/mobile SVG).
- IX2 `e-664` (`a-150`) — **лише `main` (≥992)**. Тригер `div.resources`, smoothing 90, старт `startsEntering` −20 %, без
  кінцевого офсету. Кадр 0 → 40: `y` second 0 → 1.2rem, third 0 → 1rem, fourth 0 → 2rem, first стоїть. Замір 1440: 120 / 100 /
  200 px, далі хмари стоять. На ≤991 хмари нерухомі.
- **В section-lessons хмар немає** (сесія 18 їх не верстала). Беремо їх у `section-resources`: абсолютний шар над верхом секції.

### Розкладка (лайв CSS; rem = /100 px макета)

| Клас | 1440 (база) | ≤991 | ≤479 |
|---|---|---|---|
| `.resources` | 100vh, фон `#FDFCFA`, z 10, overflow hidden | — | — |
| `.resources-track` | flex, align center, `width: max-content` | — | — |
| `.resources-main` | 100vw × 100%, overflow hidden | overflow visible | — |
| `.resources-titles` | column, pt 0.8rem, **1.95 / 1.95rem**, UP, `#0C0B0B` (на 900: верх 118, висота 665) | 1.05 / 1.05rem | 0.44 / 0.48rem, pt 0, pl 0.22rem |
| `.resources-arrow-icon` | 1.86 × 1.9rem (SVG 199×190) | 1.04 × 1rem | 0.51 × 0.48rem |
| `.resources-student` | 1.3rem × 100%, бордери L/R 1px, Magilio 0.34 / 0.37rem, UP; текст `rotate(90deg)` | — | 0.82rem, 0.28 / 0.31rem |
| `.resources-full` | 100% висоти, pt 1.6rem | pt 1rem | — |
| `.resources-wrapp` | 100vw, flex row, gap 0.9rem, px 0.34rem | column, gap 0.88rem | gap 0.16rem, px 0.22rem |
| `.resources-images` | 6.36rem × 100%, z 1 | 6.46 × 4.68rem | 3.31 × 2.4rem |
| `.resources-images__item` | абсолют, 6.36rem, r 0.24rem, opacity 0 → `.active` 1, **перехід opacity 0.4 с** | 6.46rem | 3.31rem |
| `.resources-content` | 6.46rem, overflow hidden | — | 3.31rem |
| `.resources-header` | 0.6rem, фон `#FDFCFA`, z 1; `__item` абсолют, space-between | — | — |
| таб `h5.h5` | 54 / 58 | — | 34 / 40 (порівняти з `heading-sm`) |
| `.resources-header__count` | 0.38rem коло `#0C0B0B`, текст `#FDFCFA` 0.16 / 0.16rem, pt 0.04rem | — | — |
| `.resources-lists` | column, gap 1rem | gap 0.4rem | gap 0.8rem |
| `.resources-item` | бордер низ 1px `#0C0B0B`, py 0.16rem, space-between (h 61) | — | h 73 (текст у 2 рядки) |
| `__name` | flex, gap 0.15rem, `translateX(−0.2rem)`, перехід 0.4 с; `.active` → 0, перехід 0.2 с | — | — |
| `__dot` | 0.12rem коло `#0C0B0B` (неактивну крапку ховає overflow `content`) | — | flex none |
| текст | `.p3` 16 / 24 / −0.3px (= `body-sm`); ≤479 13 / 18 | — | — |
| `__button` | «View» + `btn-link-icon` 12×24, gap 0.08rem, 0.16 / 0.24rem | — | 0.13rem |
| `.resources-overlay` | абсолют 100% × 100vh, z 1, `pointer-events: none` | — | — |

Посилання айтема (`a.resources-link`, `target=_blank`) — на зовнішні сайти з CMS. Картинки CMS (`*@2.png`, у Figma 636×460) мають
`loading=lazy`. srcset є лише в частини: `sizes` 44vw / 84vw / 88vw.

### Hover-стек (1440, кадри через 50 мс)

- Старт: `.active` на першому айтемі, назві, картинці й табі. Перша картинка стоїть без повороту.
- `mouseenter` айтема робить його `.active` (крапка виїжджає, текст зсувається на 0.2rem). Нова картинка отримує `.active`
  (opacity 0 → 1 за 0.4 с, лінійно), `rotate` і `z-index` на 1 більший за попередній. Поворот іде по колу **0 → −3 → −6 → 0 …**
  (перша наведена після старту має −3). У стеку максимум 3 картинки: найстаріша втрачає `.active` і гасне за ті самі 0.4 с.
  Повторне наведення на картинку, яка вже є в стеку, лише піднімає її z-index, поворот лишається.
- Перехід в інший список (Courses ↔ Sources) знімає `.active` з усіх картинок, далі стек будується з нуля.
- Mouse out нічого не змінює: останній стан лишається.
- **Баги лайву (не переносимо):** (1) список картинок курсів відсортовано **навпаки** до списку рядків. Наведення на «UX in
  Motion» показує School of Motion, «School of Motion» показує UX in Motion. У Sources порядок збігається. (2) Індекси стеку
  глобальні (`.eq()` по обох списках), тому після повернення в Courses спливають старі картинки. (3) Колір посилання `rgb(0,0,238)`
  успадковується від `a` і не видний лише тому, що текст має свій колір.

### Тексти (лайв)

Заголовки «Useful» / «courses» / «&Sources». Student: «You are always a student, never a master». Таби: «courses» + 10,
«Sources» + 4 (UP через CSS). Рядки — CMS-назва (повний текст поля). На 1440 / 768 вміщується в 1 рядок (h 61), на 375 — 2 (h 73).
Порядок:
- Courses: UX in Motion · UI / UX animation (Projector) · UI Animation (careerfoundry) · Motion design school · UI Animations and
  Interactions with After Effects (Udemy) · Complete guide … Principle (Awwwards) · Millionframes · Domestika · Ben Marriot ·
  School of Motion.
- Sources: Animation in UI (aelaschool) · How Motion Design Applies to UI Design (infinum) · Understand Disney's 12 principles
  (creativebloq) · Creating Usability with Motion (medium).

## План компонента

**Межа.** Секція одноразова, тож компонент не потрібен. Повторюються лише рядок списку й картинка, а їх дає CMS. Будуємо
`section-resources` зі звичайних елементів + 2 Collection List (Courses `6ac8e847…f2f8`, Resources `6ac8e847…f2fa`).

**Імена.** Блок E `script.v33` (на сторінці до видалення старої секції) шукає класи `resources`, `resources-track`,
`resources-arrow`, `resources-lists`, `resources-list`, `resources-header`, `resources-header__item`, `resources-item`,
`resources-item__name`, `resources-images__list`, `resources-images__item`, `resources-overlay` і `#resources`. Щоб старий
код не зачепив нову секцію, усі внутрішні класи беремо з префіксом **`res-*`**. Сама секція — `section-resources`, як інші.

```
section-resources  (<section>, id resources-next поки є старий; data-motion="resources")
  res-clouds              (абсолют над верхом секції, h 0, z 9; data-motion="res-clouds")
    res-cloud ×4          (is-first … is-fourth; фон SVG — 3 набори за смугами, як на лайві)
  res-pin                 (100vh, overflow hidden, фон bg, z 10; data-motion="res-pin") — елемент, що пінимо
    res-track             (flex, max-content; data-motion="res-track")
      res-intro           (100vw × 100%, overflow hidden; ≤991 visible)
        res-titles (h2)   (column, pt 0.8rem; 3 рядки)
          res-row ×3      (relative)
            res-word      «Useful» / «courses» / «&Sources» — літерал 1.95 / 1.05 / 0.44rem
            res-shutter   (абсолют на весь рядок, фон bg; data-motion="res-shutter") > res-arrow (embed SVG 199×190)
      res-student         (вертикальна плашка, бордери L/R) > res-student-text (Magilio, rotate 90°)
      res-main            (100vw × 100%, pt 1.6rem; relative)
        res-layout        (row, gap 0.9rem, px 0.34rem → column ≤991)
          res-stack       (картинки; data-motion="res-stack")
          res-content     (overflow hidden)
            res-tabs      (h 0.6rem, фон bg, z 1)
              res-tab ×2  (абсолют, space-between; data-motion="res-tab") > h3.heading-sm + res-count (коло, text-label)
            res-lists     (column, gap 1rem; data-motion="res-lists")
              Collection List Courses → res-list (data-motion="res-list")
                res-item  (a, href = CMS link, target _blank, rel noopener; data-motion="res-item")
                  res-name > res-dot + body-sm {name}
                  res-view  «View» + btn-link-icon
                  res-image (img CMS image, прихована; код переносить у res-stack)
              Collection List Resources → те саме
        res-overlay       (абсолют на res-main, pointer-events none; data-motion="res-overlay")
```

- **Картинка в рядку, а не окремим списком.** Це прибирає баг (1): картинка завжди належить своєму рядку. На старті
  `initResources()` переносить `res-image` кожного рядка в `res-stack` (з `data-list` / `data-index`). Без JS стек порожній, а
  список і посилання працюють.
- **Лічильник**: число в розмітці (10 / 4) — запасне. Код ставить `textContent` = кількість рядків списку.
- **Поля CMS** (перевірено в сесії 21, однакові в Courses і Resources): `course-image` (Image) → `res-image`, `name-in-list`
  (PlainText, рівно 62 символи — текст рядка) → `res-name`, `link` (Link) → `href` рядка, `name` (повна назва) → `title` /
  `aria-label` посилання. Сортування обох Collection List однакове з лайвом списків (порядок рядків вище).
- **Текстові стилі**: таб — `heading-sm` (54 / 58 = 1.07 ✓; mob лайв 34 / 40 — звірити драбину `heading-sm`, вона ще в списку
  PLAN); рядок — `body-sm` (лайв `.p3`, ≤479 13 / 18 — звірити з tiny `body-sm`); лічильник — `text-label`; заголовки — літерал
  `res-word` (1.95 / 1.05 / 0.44rem, lh 1 / 1 / 0.48rem); student — літерал (Magilio 0.34 / 0.37, ≤479 0.28 / 0.31).
- **Семантика**: заголовок секції — один `h2` з 3 рядками, таби — `h3`, student — `p` з `aria-hidden="true"` (декор).

## План анімації

**Усе кодом (`initResources()`), IX3 не беремо** — як у Lessons: pin, а тригери нижче інших pin-ів.

| Що | Як у коді | Числа |
|---|---|---|
| Pin + 3 фази | `ScrollTrigger` на `res-pin`, `pin: true`, `start: top top`, `end: +total`, **`scrub: 3`**, таймлайн `ease: none`, `invalidateOnRefresh`. Створюється одразу в порядку DOM, після `initLessons()`, не ліниво (виправлення бага 7 script-map) | `total = 1.5·vw + (track.scrollWidth − vw) + listsH`; тривалості `pA`, `pT`, `pL` — ті самі цілі відсотки, що на лайві, щоб фази збіглися |
| Шторки-стрілки | `to(shutters, { x: 0.84·vw, duration: pA, stagger: pA/4 })` | 0.78·vw на ≤479 |
| Трек | `to(track, { x: −(scrollWidth − vw), duration: pT })` | 1570 / 898 / 457 |
| Списки | `to(lists, { yPercent: −100, duration: pL })`; таб в `onUpdate`: активний той список, чий верх вище низу табів | — |
| Хмари | окремий scrub-таймлайн лише ≥992 (`gsap.matchMedia`), тригер `res-pin`, діапазон IX2 (старт `top bottom` + 0.2·vh) 0–40 % → y second 1.2rem, third 1rem, fourth 2rem; `scrub: 1` (smoothing 90) | на ≤991 нерухомі (як лайв) |
| Hover-стек | `pointerenter` на `res-item` (і тап): клас `is-active` на рядку; картинка `is-active` + `rotate` за колом 0 / −3 / −6 (лічильник стартує з 0 на першій картинці, тож перша наведена отримує −3) + `zIndex++`; FIFO на 3; зміна списку — очистити стек. Opacity 0.4 с і зсув назви 0.4 / 0.2 с — CSS-переходи класів, як на лайві | — |
| Оверлей | не тут — прохід Footer (тригер футера) | — |
| Тема навбара | не тут — прохід Navigation (`data-theme`) | — |

- **reduced-motion**: pin лишається (без нього трек недоступний), але без згладжування (`scrub: true`); хмари стоять; стек без
  поворотів, opacity без переходу.
- **Перевірка**: `resources-compare.mjs` (статика нової секції проти старої на staging, 1440 / 768 / 600 / 375) і
  `resources-run.mjs` (точки pin 0 / 25 / 48.6 / 60 / 71.8 / 85 / 100 % проти моделі й лайву; hover-послідовність проти правил вище,
  без багів лайву).
