# Figma — фрейми по секціях

Файл: `Motion (DEV)` — `KJQjG15P2P3SkXwrJJxLOp`.
Макет нарізаний посекційно; цілісного фрейму сторінки немає. Дизайнер
розкадровував анімацію, тому у фреймі секції можуть бути кілька станів.

**Правило:** головна сесія фрейми не читає. Аналіз робить субагент
(`Agent`, `model: sonnet`, `subagent_type: general-purpose`) за шаблоном
[sections/README.md](sections/README.md), один фрейм за прохід, результат у
`docs/sections/<section>.md`. Перед `get_design_context` — скіл
`figma:figma-design-to-code`; дивитись оцінку токенів (`get_metadata`), понад
~10k — дробити на дочірні вузли.

✅ **2026-10-09 (сесія 4):** доступ є (той самий акаунт MCP). Блокер сесії 3 знято.

Сторінки файлу (`get_metadata` без nodeId): `0:1` Cover · `1301:36378` **Design system** ·
`2122:30430` Dribbble · `1955:26377` Awwards · `2441:2827` Case study ·
`2425:1985` European Design Awards · `1301:33520` **Preloader** · `1301:33919` **1. Home** ·
`675:11687` **Full design** · `2125:31570` Codepen · `1966:38869` Card · `1790:27751` TRASH.
Сторінка `Design system` розібрана: [sections/design-system.md](sections/design-system.md) (токени для етапу 2).
`Full design` — огляд нижче (розрізнені фрейми, не цілісна сторінка). `Preloader` розібрана: [sections/preloader.md](sections/preloader.md).

## Сторінка Full design (огляд, 2026-10-09)

Read-only, `get_metadata` (2.1 MB XML) + аналіз у скрипті; детально не розбирався.

- **Не цілісний макет Home**, а велика дошка (~150 000×48 000 px) з ~400 розрізнених фреймів верхнього рівня, розкиданих по осі X. Підписи-мітки (`1_Home`, `2_Introduction`, `4_Interactive`, `5_Techniques…`, `6_Courses&Sources`, `7. menu`) стоять над кластерами.
- Є **усі три смуги**: 1440 (кластери x −47k…+16k), **768** (x +24k…+60k, фрейми 768×1024 / 768×N) і **375** (x +70k…+97k, фрейми 375×667 / 375×N). Брейкпоінтні макети **існують**, на відміну від того, що казали hero.md/intro.md (там розбирались лише 1440).
- Кластери: Preloader (1440/768/375), Home/Hero, Introduction, 3_Animation and Navigation (= Lessons-хаб), 4_Interactive, 5_Techniques (5.1–5.8: easing, delay, fade, morph, masking, dimension, parallax, zoom — по 1440/768/375 + «Examples»), 6_Courses&Sources (= Resources), 7.Menu, Footer (`795:38432`, symbol `891:27933`), Navbar, окремі символи (Sound, Cloud, CC, Button-a, Film, Interactive_circle).
- У `Full design` лежать **старі копії стайлгайда** (`857:17807`, `905:31100`, `967:31946`) і Og image/Fav icon — актуальний стайлгайд на сторінці `Design system`.
- На дошці є Section-обгортки, додані користувачем: `4608:23740` (home, 2984×14646), `4608:23742` (introduction, 2984×5021), `4609:22242` (Section 130, 7252×8240, фрейми «3_Animation and Navigation» 1440×750).
- Інші 1440-фрейми поза секціями (старіші версії) можуть не збігатися з секціями — для проходу брати секції користувача, а ці як довідку.

| Секція | node-id фрейму | Розмір |
|---|---|---|
| Preloader 1440 (3 стани) | `795:38525`, `795:38622`, `795:38653` | 1440×750 |
| Preloader 1440 (4–11, у секції home) | `795:38675` … `795:38861` | 1440×750 |
| Hero/Home 1440 (у секції home) | `788:28207`, `788:28237`, `788:28268`, `788:28300`, `788:28558` | 1440×750 (`788:28268` 1440×1763) |
| Introduction 1440 | `869:18299` | 1440×3810 |
| Introduction 768 / 375 | `869:18631` / `918:25700` | 768×2382 / 375×1572 |
| Lessons-хаб (3_Animation and Navigation) 1440 | `1106:31128` та ін. (див. Section 130) | 1440×750 |
| Interactive 1440 | `702:13803`, `702:13849`, `702:14171`, `702:14279` | 1440×750 |
| Interactive 768 / 375 | `869:19256` … / `918:26484` … | 768×1024 / 375×667 |
| Techniques 1440 | `702:14385` (огляд), `702:15306`…`15882` (кроки) | 1440×2491 / 1440×750 |
| Techniques 768 / 375 | `869:20845` / `918:28871` | 768×2368 / 375×1400 |
| Lessons (5.1–5.8 уроки) 1440 | `1553:20458`, `1553:25009`, `1553:25410`, `1553:25740`, `1553:26064`, `1553:26391`, `1553:27065`, `1553:27397` | 1440×2000–3826 |
| Resources (6. Courses&Sources) 1440 | `784:27387` … `795:31839` | 1440×750 |
| Resources 768 / 375 | `886:25095` … / `951:30268` … | 768×1024 / 375×667 |
| Menu 1440 / 768 / 375 | `1221:34806` / `1738:23158` / `1738:23481` | 1440×750 / 768×1024 / 375×667 |
| Footer 1440 | `795:38432` (symbol `891:27933`, 770×1044 у 768/375) | 1440×709 |

node-id у таблиці — перший/репрезентативний; повний перелік кадрів кожної секції знімати в її проході. Відповідність «Lessons = 5.x» і «Resources = 6.» — за назвами, не підтверджена користувачем.

**768/375:** у секціях користувача (Hero, Intro, UI-слайдер) лише 1440, але на дошці
`Full design` смуги 768/375 **є** (таблиця вище, напр. Intro `869:18631` / `918:25700`).
Правило (сесія 5): еталон ≤991 — лайв (записи + стилі Webflow); фрейми 768/375 з
`Full design` — звірка й підказка для станів, яких не видно на записі. При розбіжності — лайв.

| Секція | node-id | Посилання | Додано | Аналіз |
|---|---|---|---|---|
| Home (hero) | `4608-23740` | https://www.figma.com/design/KJQjG15P2P3SkXwrJJxLOp/Motion--DEV-?node-id=4608-23740&m=dev | 2026-10-09 | ✅ [sections/hero.md](sections/hero.md): 13 фреймів 1440×750, з них 5 Home (3 стани hero + 2 початок Intro) і 8 Preloader(4..11) |
| Intro | `4608-23742` | https://www.figma.com/design/KJQjG15P2P3SkXwrJJxLOp/Motion--DEV-?node-id=4608-23742&m=dev | 2026-10-09 | ✅ [sections/intro.md](sections/intro.md): фрейм `869:18299` 1440×3810, один статичний стан, без SVG-шляху, UI-слайдера й відео |
| Intro: UI-слайдер | `4609-22242` | https://www.figma.com/design/KJQjG15P2P3SkXwrJJxLOp/Motion--DEV-?node-id=4609-22242&m=dev | 2026-10-09 | ⬜ субагент → дописати в sections/intro.md (розділ «UI-слайдер») |
| Interactive | `4611-22244` | https://www.figma.com/design/KJQjG15P2P3SkXwrJJxLOp/Motion--DEV-?node-id=4611-22244&m=dev | 2026-10-10 | ✅ [sections/interactive.md](sections/interactive.md): 4 кадри 1440×750 (розкадровка pin-скролу) + символ `Interactive_circle`; 768/375 немає — еталон лайв |
| Techniques | `702:14385` (огляд) + `702:15306…15882` (6 кроків), 768 `869:20845`, 375 `918:28871` | обгортка `4611:22246` | 2026-10-10 | ✅ [sections/techniques.md](sections/techniques.md): огляд 1440×2491 + 6 кадрів 1440×750; 768/375 — довгі кадри + кроки. Стара версія анімації — еталон лайв |
| Lessons | `4611-22250` (лише урок easing, 15 кадрів 1440) + уроки 2–8 `1553:25009…27397` | https://www.figma.com/design/KJQjG15P2P3SkXwrJJxLOp/Motion--DEV-?node-id=4611-22250&m=dev | 2026-10-10 | ✅ [sections/lessons.md](sections/lessons.md): довгий кадр `1553:20458` + 5 станів слайдера схем + 2 Examples + 6 станів демо; 2–8 — лише відмінності; classic-блока й 768/375 у Figma немає, еталон — лайв |
| Resources | `4616-22252` | https://www.figma.com/design/KJQjG15P2P3SkXwrJJxLOp/Motion--DEV-?node-id=4616-22252&m=dev | 2026-10-10 | ✅ [sections/resources.md](sections/resources.md): 17 кадрів 1440 (вхід, заголовки, трек 3182, списки, 4 стани стеку, 4 кадри кінця з хмарами футера) + 768 `886:25095` / 375 `951:30268` лише вхід; еталон — лайв |
| Menu (навігація) | `4616-22254` | https://www.figma.com/design/KJQjG15P2P3SkXwrJJxLOp/Motion--DEV-?node-id=4616-22254&m=dev | 2026-10-10 | ✅ [sections/navigation-figma.md](sections/navigation-figma.md) «Вузол 4616:22254»: секція 4789×3976 — 5 кадрів 1440 (Introduction активна, hover Easing `#C8CFE8`, hover Offset `#D2C8E8`, кадр-перехід з точкою) + 768 / 375; 5 карток із 10, соцмережі Group 8687, SVG-експорти в `reference/figma-nav/`; еталон — лайв |
| Footer | `795:39109` (символ з текстами, 1440) + `891:27933` (tablet) + кадри Resources (4)–(4-2) | — (знайдено за node-id з таблиці вище) | 2026-10-10 | ✅ [sections/footer.md](sections/footer.md): `795:38432` — застарілий символ без текстів; 375 немає; чорні хмари = `footer-cloud-item`; еталон — лайв |
| Preloader | `4608-23740` (Preloader(4..11)) + сторінка `1301:33520` | — | 2026-10-09 | ✅ [sections/preloader.md](sections/preloader.md): сторінка Preloader — лише фаза лічильника (3 стани × 3 смуги); слова — Preloader(4..11) + Full design 768/375; кадри `1057:46616`, `1063:29105`, `1063:29726` з назвою «Preloader» — це Intro |
| Navigation | `1221:34806` / `1738:23158` / `1738:23481` (меню 1440/768/375) + інстанси символа `Header` (`788:28217`, `784:27394`, `1553:20702`, `1221:34843`), крихта `1553:20705`, Sound `675:12444` | — (з таблиці Full design, окремого посилання від користувача немає) | 2026-10-10 | ✅ [sections/navigation-figma.md](sections/navigation-figma.md) → план у [sections/navigation.md](sections/navigation.md); mainComponent `Header` MCP не віддає; меню намальоване частково (3/5/3 картки з 10); еталон — лайв |
| Styleguide | — | TODO (якщо є) | | |
