# Styleguide — прохід сесії 37 (2026-10-12)

## Звірка: лайв ↔ копія ↔ аудит

| | Лайв `/styleguide` | Копія `6ac8e84728488a6bd334f2e9` до сесії 37 |
|---|---|---|
| Статус | 200, `<title>Styleguide</title>`, **без `noindex`**, **є в sitemap.xml** (sitemap лайву = лише `/` і `/styleguide`); robots.txt — 404 | 200 на staging |
| Body | клас `.body` (`#fdfcfa`, шрифт `Ppneuemachina-Plain` — такого немає → fallback) | те саме |
| rem | `div.w-embed` — копія rem-правила з `main-css` (обрізані vw) | `styles-rem` (сесія 6) **+ той самий старий ембед** (`bddf9899…`), який перебиває точні значення `styles-rem` |
| Зміст | `.styleguide-wrapper`: `h2`, `h2-secondary`, `h3`, `h4`, `h4-c`, `h5`, `h6`, `p1`–`p3-bold`, порожній `colors-wrap`, `splide__arrows`, `og-image-wrap` | те саме + 2 тестові блоки сесії 6 (`sg-section` з 12 стилями, `sg-section.is-dark`) |
| Код | GA4 + Twitter pixel (site head) | те саме |

Аудит ([../styleguide-audit.md](../styleguide-audit.md)) підтверджено: старий стайлгайд показує старі класи, з яких на новому Home
не живе жоден (Home зібрано на `display-*` / `heading-*` / `body-*` / `text-*`), кольорів немає, компонентів немає.

## Рішення (агент, сесія 37)

Сторінка — **живий довідник нової системи** для того, хто відкриє Designer: токени й стилі, прив'язані до Variables,
і компоненти-інстанси. Не публічна сторінка з навігацією.

1. **URL лишається** (`/styleguide`, 200 — правило «URL 1:1»), але **`noindex`** у head сторінки. Сторінка робоча, у пошуку їй
   робити нічого. Прибрати з sitemap може лише перемикач Page settings → SEO «Sitemap indexing» (MCP не пише) — на етапі запуску.
2. **`site-nav` / `site-sound` / `site-footer` як живий «одяг» сторінки — не потрібні:** `motion.js` тут не підключено, навігувати
   нема куди, на лайві їх тут теж немає. Натомість — **інстанси на дошках розділу Components**: дошка `sg-board` має
   `transform`, тож `position: fixed` кореня (`site-nav`, `site-sound`) прив'язується до дошки, а не до вікна. Без коду
   компоненти показують статичний стан (меню `display: none`, очі лого без Lottie). Цього досить для довідника: правка компонента
   одразу видна тут.
3. **Прибрати старе:** дубль rem-ембеда, увесь `.styleguide-wrapper` (разом з OG-тримачем і стрілками Splide), тестові блоки
   сесії 6. Після цього старі класи (`h2`…`p3-bold`, `styleguide-*`, `*-wrap`, `og-image*`, `splide__*`) не вживаються ніде →
   їх прибирає окремий прохід чистки стилів (не тут). Ассет OG `6ac8e84728488a6bd334f430` **лишається** в бібліотеці: він
   потрібен для OG Home (етап 6), видалення елемента ассет не чіпає.
4. **Body:** клас `.body` виправити (`font-display`, `bg`, `foreground` зі змінних замість зламаного шрифту й літерала). Home
   поки на старому `.body-wrap` — звести обидві сторінки до одного класу в проході чистки стилів.
5. Подача — за [_base/STYLEGUIDE-PAGE.md](../../../_base/STYLEGUIDE-PAGE.md), лише розділи, для яких у Motion є токени:
   немає шкали `space-*` / `container`, іконок і motion-токенів (рух — код), тож ці розділи не робимо.

## Каркас

```
Body (.body)
├─ styles-rem                         компонент (вже є)
└─ main.sg-page                       semantic light, padding 0.8rem, gap 1.2rem
   ├─ header.sg-cover                 h1 heading-xl «Motion», body-md підзаголовок, body-sm примітка
   ├─ section.sg-section #color
   │  ├─ sg-head                      eyebrow text-label «01 · Color» (.sg-muted), h2 heading-md, sg-divider
   │  ├─ sg-group «core · neutral»    sg-grid → sg-swatch × 3 (sg-chip + is-<token>, ім'я body-sm is-strong, hex body-sm sg-muted)
   │  ├─ sg-group «core · lessons»    sg-grid → sg-swatch × 8, у чипі текст уроку (пара фон ↔ текст = як на сайті)
   │  ├─ sg-group «core · classic»    sg-grid → sg-swatch × 2
   │  └─ sg-group «semantic»          sg-modes → sg-mode (light) | sg-mode.is-dark: чипи bg / foreground / border + текст
   ├─ section.sg-section #typography
   │  ├─ sg-head «02 · Typography»
   │  ├─ sg-spec × 12                 сітка 2.4rem | 1fr: ім'я + специфікація | живий зразок зі стилем
   │  └─ sg-bands                     3 колонки: sg-band / is-tablet / is-mobile (режим `type` на класі) — розміри смуг поруч
   ├─ section.sg-section #shape
   │  ├─ sg-head «03 · Shape»
   │  └─ sg-grid → sg-shape × 3       radius-8, radius-full, border-1
   ├─ section.sg-section #components
   │  ├─ sg-head «04 · Components»
   │  └─ sg-board × 3                 підпис + інстанс: site-nav, site-sound, site-footer
   └─ section.sg-section #rules
      ├─ sg-head «05 · Rules»
      └─ sg-rules                     коротко: префікси блоків, data-motion, стани is-*, режими secton, де канон коду
```

Класи — префікс `sg-*`, кольори чипів — комбо `sg-chip.is-<token>` з `background-color` = змінна (жодного літерала).
Підписи hex пишуться руками (STYLEGUIDE-PAGE §0: ім'я обов'язкове, значення — за бажанням).

**Відхилення від STYLEGUIDE-PAGE:** таблиця смуг показує лише **розміри** (`type` у режимі tablet / mobile на класі колонки);
lh / ls смуг задані перевизначеннями класів на breakpoint-ах, режимом їх не ввімкнути — їх видно, якщо звузити вікно.
Будівельні блоки (`swatch`, `spec-row`) — не компоненти: Webflow-проп не може нести клас чи змінну кольору, а варіант на кожен
токен важчий за комбо.

## Збірка в копії (сесія 37)

**Body:** `styles-rem` → `main.sg-page` `dfbc755b-40cc-35f5-666e-5ba1f1572584`. Розділи (`section.sg-section`, id на елементі):
`#color` (у тому ж whtml-дереві, що й `sg-page`), `#typography` `62787c4d-8a7e-967e-9aaa-7d9703a3c2cb`, `#shape`
`76a1ea3a-5418-4041-3c65-77f28ff69f41`, `#components` `29046477-98f4-c233-74e2-fe2cd445fa4f`, `#rules`
`2ee569c0-5495-7754-6007-0c735d22c263`. Інстанси на дошках: `site-nav` `342cca70-1858-2a79-139b-4044df967744`,
`site-sound` `57844669-f770-bc92-99c3-fe24a18a8e90`, `site-footer` `3cd5659b-2da0-f0cc-123b-13e19fc7dd0b`.

**Класи** (`data_style_tool`, кольори / радіуси / рамки — `variable_as_value`, розмітка — `whtml_builder` без CSS, існуючі
класи й комбо перевикористано, дублів немає):

| Клас | Що | Режим / смуги |
|---|---|---|
| `sg-page` | `main`: колонка, gap 1.2, padding 0.8, `bg` / `foreground` | `semantic: base`; medium padding 0.4 / gap 0.8; tiny 0.2 / 0.6 |
| `sg-cover`, `sg-head`, `sg-group` | колонки з gap 0.16 / 0.12 / 0.16 | |
| `sg-section` | колонка, gap 0.4, width 100 % (клас сесії 6, перероблено; комбо `is-dark` видалено) | |
| `sg-muted` | opacity 0.6 — обгортка підписів (два класи на одному тезі whtml зробив би комбо) | |
| `sg-divider` | висота `border-1`, фон `border` | |
| `sg-grid`, `sg-swatch` | flex-wrap gap 0.24 / 0.32; зразок 1.6 rem (tiny 1.5) | |
| `sg-chip` + 16 комбо | `is-neutral-0/800/1000`, `is-lesson-<8>`, `is-classic-easing/delay`, `is-bg/foreground/border` — фон = змінна; рамка `border-1` / `border`, радіус `radius-8` | |
| `sg-modes`, `sg-mode` (+ `is-dark`) | дві панелі поруч | `semantic: base` / `dark`; tiny — колонка |
| `sg-spec`, `sg-spec-meta`, `sg-sample` | рядок «2.4 rem опис | зразок», нижня лінія | medium — стовпчиком (на 768 `display-xl` не влазив поруч з описом, переповнення 7 px) |
| `sg-bands`, `sg-band` (+ `is-tablet` / `is-mobile`) | три колонки зразків | `type: base` / `tablet` / `mobile` на класі; small — колонка |
| `sg-shape` (+ `is-radius-8` / `is-radius-full`) | квадрат 0.8 з рамкою `border-1` | |
| `sg-board` | дошка компонента: `relative`, `transform: translate(0)` (тримає `position: fixed` кореня), overflow hidden, min-h 1.4, радіус `radius-8` | `semantic: dark` |
| `sg-rules` | колонка правил, max-w 8 rem | medium — без обмеження |
| `.body` (старий клас Body цієї сторінки) | `font-display`, `bg`, `foreground` зі змінних замість `Ppneuemachina-Plain` / `#fdfcfa` | |

**Прибрано:** дубль rem-ембеда `bddf9899…`, тестові блоки сесії 6, `.styleguide-wrapper` з усім старим (`h2`…`p3-bold`,
`colors-wrap`, `splide__arrows`, `og-image-wrap`). Старі класи тепер не вживаються ніде — для проходу чистки стилів.

**Head сторінки:** [src/webflow/styleguide-head.html](../../src/webflow/styleguide-head.html) — `<meta name="robots" content="noindex">`,
`set_page_freeform_code`, прочитано назад.

**Перевірка** — [tools/record/styleguide-check.mjs](../../tools/record/styleguide-check.mjs) (staging, 1440 / 768 / 600 / 375):
`noindex`, немає старої розмітки, у Body один ембед (`styles-rem`), rem = смуга, 13 чипів = hex токенів, панелі light / dark
інвертуються, колонки смуг дають `display-xl` 2.15 / 1.2 / 0.56 rem, корені компонентів усередині дошок, немає горизонтального
скролу, один `h1`, без помилок сторінки. Підсумок — **0 прапорців** на всіх 4 смугах.

**Лишилось:** перемикач Page settings → SEO «Sitemap indexing» (прибрати `/styleguide` з sitemap; MCP не пише) — на запуску;
звести Body Home (`.body-wrap`) і Styleguide (`.body`) до одного класу — у проході чистки стилів.
