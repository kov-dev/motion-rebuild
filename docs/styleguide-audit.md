# Styleguide оригіналу — аудит (2026-10-09)

Read-only. Джерела: опублікована сторінка `/styleguide` (`6434148c0a05bc2f947855dd`) →
[reference/live-styleguide-2026-10-09.html](../reference/live-styleguide-2026-10-09.html);
CSS сайту `motion-9888c6.webflow.05a3c92fc.min.css` (98 KB, розібрано скриптом, 668 правил
після Webflow-бази); DOM Home `reference/live-home-2026-10-09.html`; MCP (лише читання):
`list_fonts`, `get_variable_collections`, `get_variables`. Ассети — окремо в [assets.md](assets.md).

Значення — у rem (1rem = 100px макета на смузі: 1440 / 768 / 375, див. [main-css.md](main-css.md)).
Смуги: desk = база, tab = ≤991, mob = ≤479 (≤767 для цих класів не перевизначено).

## 1. Що на сторінці Styleguide

| Блок | Вміст | Стан |
|---|---|---|
| `div.w-embed` (перший у body) | rem-правило (`html {font-size}` 3 смуги) — **копія** з `main-css`, не компонент | дубль; у перезбірці — компонент-ембед (WEBFLOW-BASE §1.1) |
| `.headings-wrap` | `h2.h2`, `h2.h2-secondary`, `h3.h3`, `h4.h4`, `h4.h4-c`, `h5.h5`, `h6.h6` між `.styleguide-divider` | основне |
| `.paragraphs-wrap` | `div.p1`, `.p2`, `.p3`, `.p3-bold` | основне |
| `.colors-wrap` | grid 3 колонки з **одним порожнім div** | **порожньо** — кольорів у стайлгайді немає |
| `.splide__arrows` | дві стрілки Splide (prev/next) | демо стрілок слайдера easing |
| `.og-image-wrap` → `img.og-image` | `642fed24…_Og image.png` (1200w + srcset) | тримач OG-картинки, без стилів |

**Немає:** кнопок, посилань, форм, компонентів, кольорових свотчів, відступів, іконок, `h1`.
Body сторінки — клас `.body` (на Home — інший клас `.body-wrap`).

## 2. Типографіка зі стайлгайда → вживання на Home

Колір у всіх, де задано, `#0c0b0b`. `UP` = uppercase. Шрифт без позначки = успадкований
від body (`Pp-neuemachina-Plain` 400 на Home). lh / ls у дужках — множник / em (для етапу 2,
STYLEGUIDE §4.4–4.5).

| Клас | Шрифт / вага | desk size / lh / ls | tab | mob | Home | Примітка |
|---|---|---|---|---|---|---|
| `.h2` | Plain 400, UP | 1.6 / 1.7 / −.064 (1.06 / −0.04em) | 1 / 1 | .5 / .55, ls −.02 | **1** (h2) | дисплей секції |
| `.h2-secondary` | **Magilio-400**, center | 1.15 / 1.26 / −.02 (1.10 / −0.017em) | .64 / .74 | .36 / .4, ls −.008 | **2** (h2) | «An example from classic animation» |
| `.h2-secondary.text-center` | Times New Roman 700 | — | — | — | 0 | **мертвий** combo |
| `.h3` | inherit, UP | 1.4 / 1.44 / −.05 (1.03 / −0.036em) | .78 / .88, −.024 | .4 / .44, −.012 | **9** (8×h3 + 1×`div.h3.white`) | |
| `.h3.white` | колір `#fdfcfa` | — | — | — | 1 | combo-колір |
| `.h4` | inherit, UP | .74 / .8 / −.03 (1.08 / −0.041em) | .4 / .54, −.016 | .36 / .4, −.014 | **8** (h4) | **дубль: `.label-1`** (8 на Home) — ідентичний на desk, але без tab/mob-перевизначень |
| `.h4-c` | **`Ppneuemachina-Inktrap`** (такого шрифту немає) / **300** (файлу немає) | .64 / .64 / −.038 | — | — | **0** | **мертвий + зламаний шрифт** → системний fallback. Той самий розмір .64/.64 має `.anim-shape` (4 на Home, вага 300 → синтетична) |
| `.h5` | inherit, UP | .54 / .58 (1.07) | .44 / .58 | .34 / .4 | **3** (h5) | |
| `.h6` | inherit, UP | .74 / .8 / −.04 | .44 / .54 | .24 / .32, −.0096 | **2** (лише `div.h6.white`) | на desk = `.h4` крім ls (−.04 vs −.03) → дубль |
| `.h6.white` | `#fdfcfa` | — | ls −.018 | ls −.001 | 2 | combo |
| `.p1` | inherit | .28 / .44 (1.57) | .24 / .38 | .22 / .32 | **3** (усі `p1.white`) | |
| `.p1.white` | `#fdfcfa` | — | — | — | 3 | |
| `.p2` | **Inktrap 400** | .18 / .32 (1.78) | .14 / .24 | (= tab) | **8** | **дублі:** `.slide-inner-label` (5), `.hero_wrap` (1) — ті самі .18/.32 |
| `.p3` | inherit | .16 / .24 / −.003 (1.5 / −0.019em) | .13 / .24, −.0026 | .13 / .18 | **51** | базовий текст. **Майже-дублі:** `.btn-link` (25), `.resources-item__button` (14) — .16/.24 без ls |
| `.p3.margin-top` | +margin-top .24 | — | — | — | 0 | **мертвий** combo (утилітарний) |
| `.p3-bold` | **Inktrap 700** | .16 / .24 / −.003 | **без перевизначення** (.16, хоча `.p3` → .13) | .14 / .22 | **5** | непослідовність tab |

Службові класи стайлгайда: `.styleguide-wrapper` (фон `#0c0b0b`, padding .4), `.headings-wrap`
(flex column, gap .4), `.paragraphs-wrap` (mt 1), `.colors-wrap` (grid 3×), `.styleguide-divider`
(h .02rem, **`#fff`** — єдине вживання `#fff`) — **0 на Home**, потрібні лише сторінці Styleguide.
`.splide__arrows` / `.splide__arrow` — на Home 1 / 2 (слайдер easing), колір стрілки `#c8cfe8` = колір уроку easing.

### 2.1 Типографіка Home поза стайлгайдом

| Група (desk size / lh) | Класи (к-сть на Home) | Висновок |
|---|---|---|
| Display 2.15 / 2.15–2.2, UP | `.list-item` (3, ls −.086), `.scrolling-text.is-lessons` (1, ls −.09) | окремий стиль `display-xl`, у SG відсутній |
| Display 1.95 / 1.95, UP | `.resources-titles` (1) | разовий — літерал |
| .64 / .64, вага 300 | `.anim-shape` (4) | те, чим мав бути `.h4-c` |
| .34 / .37 Magilio UP | `.resources-student` (1) | разовий |
| .16 / .16, ls −.005 | `.breadcrumb-item` (8), `.nav-toggle` (1), `.logo-text-sections` (1), `.resources-header__count` (2) | **немає в SG** → один стиль `text-label` |
| .16 / .28, ls −.0048 | `.nav-absolute` (1), `.f-navigation-list` (2), `.footer-info` (1); `.f-label` .16/.32 Inktrap 700 (2) | варіант `.p3` з більшим lh |
| .16 / .24 | `.btn-link` (25), `.resources-item__button` (14), `.loader-number` (0, мертвий) | = `.p3` |
| .18 / .32 | `.slide-inner-label` (5), `.hero_wrap` (1) | = `.p2` |
| .14 / .24 | `.loader-counter` (1) | разовий |

**Висновок по типографіці:** зі стайлгайда реально живуть 9 з 11 текстових класів (`h4-c` і
`h2-secondary.text-center` мертві). Але кожен другий текст на Home стилізований **власним
класом** з тими самими значеннями — SG не був джерелом істини.

## 3. Кольори і Variables

**Variables (MCP, `Base collection`, 1 режим):** `White` = `white` (`--white`), `Black` = `black`
(`--black`). **Жодне правило CSS на них не посилається** (`var(--…)` — 0 входжень) і значення не
збігаються з реальною палітрою → «незв'язані токени» (STYLEGUIDE §1.4). Не переносимо.

Реальна палітра — літерали в CSS (к-сть правил):

| Колір | Правил | Де | Кандидат у токен |
|---|---|---|---|
| `#0c0b0b` | 51 | текст, фони, рамки | так — темний (`neutral-1000` за значенням Motion) |
| `#fdfcfa` | 42 | світлий фон/текст, `.white`-комбо | так — світлий (`neutral-0`) |
| `#000` | 11 | `.lesson`, `.card-video*`, `.classic-anim*`, `.resources-student`, `.text-block-3` | перевірити, чи не мав бути `#0c0b0b` (рішення 1:1 — лишити) |
| `#c8cfe8` / `#d2c8e8` / `#e4e8c8` / `#c8e8e8` / `#e8c8e5` / `#e8c8c8` / `#d6e8c8` / `#c2d5d7` | по 2–3 | `.lesson.is-<урок>` + `.breadcrumb-item.is-<урок>` (+ `.splide__arrow` для easing) | так — 8 кольорів уроків (кожен ≥2 вживань) |
| `#aab8eb` | 6 | `classic-anim*` easing | так (classic-anim easing) |
| `#bdb1d7` | 3 | `classic-anim*` delay | так (classic-anim delay) |
| `#3d3c3c` | 4 | `.progress-bar*` | так |
| `#fff` | 1 | `.styleguide-divider` | ні (лише SG) |
| `rgba(253,252,250,.2)` | 1 | `.f-navigation-list.is-social` (mob) | літерал |
| `main-css`: `#c8cfe8` (splide disabled), `#fdfcfa`/`#0c0b0b` (sound active) | — | ембед | замінити на токени |

## 4. Шрифти

| Family (як у CSS) | Файл | Формат | Вага | Розмір | Де на Home |
|---|---|---|---|---|---|
| `Pp-neuemachina-Plain` | `6458a671…_PPNeueMachina-PlainRegular.woff2` | woff2 | 400 | 49 KB | body (`.body-wrap`), `.h2` |
| `Pp-neuemachina-Inktrap` | `6458a722…_PPNeueMachina-InktrapRegular.woff2` | woff2 | 400 | 50 KB | `.p2`, `.hero_wrap`, `.nav-absolute`, `.f-link` |
| `Pp-neuemachina-Inktrap` | `6458a79a…_PPNeueMachina-InktrapBold.woff2` | woff2 | 700 | 50 KB | `.p3-bold` (5), `.f-label` (2) |
| `Magilio-400` | `644bf7bb…_font.woff2` | woff2 | 400 | 28 KB | `.h2-secondary` (2), `.resources-student` (1) — 2 фрази |

- Усі 4 — `font-display: swap`, по 683 гліфи (PP Neue Machina має 95 кириличних), повний набір.
- **Зламані імена в CSS:** `Ppneuemachina-Plain` (`.body`, лише Styleguide) і
  `Ppneuemachina-Inktrap` (`.h4-c`, `.f-navigation-list`) — шрифтів із такими іменами немає.
  На Home шкоди немає (`.f-link` всередині перебиває), але це пастка WEBFLOW-BASE §2.3.
- Вага 300 вказана в `.h4-c` і `.anim-shape`, файлу 300 немає → браузер бере 400.
- У бібліотеці ассетів ще 13 `.otf` PP Neue Machina (Light/Ultrabold/Italic, ~1.5 MB) і
  `Magilio-Regular.woff2` (7 KB) — **не підключені**.

## 5. Класи сайту загалом (з CSS)

| Метрика | Значення |
|---|---|
| Унікальних імен класів у CSS сайту (без `w-*`) | 317 (Webflow рахує combo окремо → ~428 в AUDIT) |
| Вживаються на Home | 286 |
| Лише на Styleguide | 7 (`body`, `styleguide-wrapper`, `styleguide-divider`, `headings-wrap`, `paragraphs-wrap`, `colors-wrap`, `h4-c`) |
| **Мертві** (ні Home, ні Styleguide; CMS-шаблони порожні — `/lesson/*` віддає лише скрипти) | 24: `overflow-hidden`, `h2-wrap`, `margin-top`, `menu`, `text-center`, `loader-number`, `loader-relative`, `trigger`, `slider1`, `is--active`, `loader-wrapper`, `trigger2`, `is-preloader-right`, `is-main`, `desktop`, `tablet`, `mobile`, `is-easing-classic`, `is-delay-classic`, `is-dark`, `is-light`, `is-close`, `preloader`, `hidden` |
| Мертві з посиланням у IX2 | `trigger` — IX2 click «сховати `.loader-wrap`» вішається на елемент, якого немає |
| Класи на Home без жодного CSS-правила (JS-гачки/обгортки) | 13: `embed`, `f-navigation`, `hero_content`, `hero_left`, `hero_text`, `is-top`, `main-css`, `nav-color`, `resources-list`, `sound-btn-wrap`, `splide__arrow--next/--prev`, `ui-slider` |
| Автоімена / номери на Home (STYLEGUIDE §2.2) | `text-block-3`, `div-2`, `div-block-4`, `label-1`, `margin-40`, `is-examples-2`, `is-preloader-2`, `example-video-1…6`, `progress-bar_title-1…3` |
| Фонові SVG у CSS на мертвих селекторах | `.bg-wrap.is-main(.desktop/.tablet/.mobile)` → `path_main_.svg`, `path_main_tablet.svg` (стара версія шляху) |

## 6. Висновок — що беремо в етап 2

**Беремо (значення 1:1, імена — за STYLEGUIDE.md):**

| Що | Як |
|---|---|
| Палітра | `core`: темний `#0c0b0b`, світлий `#fdfcfa`, 8 кольорів уроків, 2 classic-anim, `#3d3c3c`; `semantic`: `bg`/`foreground` (light↔dark секції `nav-dark`/`nav-light`) |
| Шрифти | 3 файли PP Neue Machina + Magilio, залити під правильними іменами (без `Ppneuemachina-*`); subset — див. assets.md |
| Текстові стилі | `display-xl` ← `list-item`/`scrolling-text` (2.15); `display-lg` ← `.h2` (1.6); `heading-xl` ← `.h3` (1.4); `heading-lg` ← `.h2-secondary` (Magilio 1.15); `heading-md` ← `.h4`=`.label-1`=`.h6`; `heading-sm` ← `.h5`; `body-lg` ← `.p1`; `body-md` ← `.p2` (Inktrap); `body-sm` ← `.p3` (+ `.btn-link`, `.resources-item__button`); `text-label` ← `.breadcrumb-item`/`.nav-toggle`/`.logo-text-sections` (.16/.16) — імена орієнтовні, остаточна мапа при першому проході секції |
| Варіанти кольору | `.white`-комбо → не клас, а семантичний колір секції (успадкування `foreground`) |
| rem-ембед | один компонент на всі сторінки (зараз 2 копії: main-css на Home + ембед на Styleguide) |
| Сторінка Styleguide | перебудувати за [_base/STYLEGUIDE-PAGE.md](../../_base/STYLEGUIDE-PAGE.md): додати свотчі кольорів (зараз порожньо), кнопку/посилання; OG-тримач прибрати (OG задається в Page settings) |

**Викидаємо:** Variables `White`/`Black`; `.h4-c` (замінити стилем для `.anim-shape`);
`.h2-secondary.text-center`, `.p3.margin-top`, `.body` + `.body.overflow-hidden`; 24 мертві класи
(§5); дублі `.label-1`, `.h6` (desk), `.slide-inner-label`/`.hero_wrap` як типографічні класи;
фонові SVG мертвих `.bg-wrap.is-main*`; 13 непідключених `.otf`.

**Несподіванки:** на Home **немає жодного `<h1>`** (SEO — питання користувачу);
стайлгайд не покриває ~половину текстів Home; `.p3-bold` на tablet більший за `.p3`.
