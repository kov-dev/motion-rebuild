# Конвенції проєкту Motion

Базові правила — [../_base/WEBFLOW-BASE.md](../_base/WEBFLOW-BASE.md). Тут —
значення, ID, рішення й те, що відрізняється від бази. Правила поведінки
агентів — [CLAUDE.md](CLAUDE.md). Етапи й статус — [PLAN.md](PLAN.md).

**Кожна сесія наприкінці дописує сюди нові класи, рішення й пастки.**

## ID

| Що | Значення |
|---|---|
| **Оригінал (лайв, read-only)** | `Motion` — `6384fe1e68c38ac8097a7e47`, workspace `625742553e5c610181b0b0f0`, домен motion.zajno.com, остання публікація 2024-02-13 |
| Оригінал: Home | `643fc55a8d5a6a31d4d2a4df` (Body `643fc55a8d5a6a1bdcd2a4e2`) |
| Оригінал: Styleguide | `6434148c0a05bc2f947855dd` — `/styleguide` |
| Оригінал: CMS templates | Lessons `6434148c0a05bc010f7855d8` (`/lesson/*`), Resources `6434148c0a05bc83567855d9` (`/resources/*`), Courses `6434148c0a05bc89eb7855d7` (`/course-items/*`) |
| Оригінал: CMS collections | Courses `6434148c0a05bcc47b7855d2` (10), Lessons `6434148c0a05bc1c877855d3` (8), Resources `6434148c0a05bc63f47855d4` (4); primary cmsLocaleId `653ada98e882f528b36a90ff` |
| **Копія (робоча)** | `Motion rebuild` — **`6ac8e84728488a6bd334f2fe`**, staging `https://motion-9888c6-7b0bf3d1442cd845b427c83cc.webflow.io` (індексація вимкнена, створена 2026-10-09 з копіюванням hosting/SEO/integration settings) |
| Копія: Home | `6ac8e84728488a6bd334f2e5` |
| Копія: Styleguide | `6ac8e84728488a6bd334f2e9` |
| Копія: CMS templates | Lessons `6ac8e84728488a6bd334f2e7`, Resources `6ac8e84728488a6bd334f2e8`, Courses `6ac8e84728488a6bd334f2e6` |
| Копія: CMS collections | Courses `6ac8e84728488a6bd334f2f8` (10), Lessons `6ac8e84728488a6bd334f2f9` (8), Resources `6ac8e84728488a6bd334f2fa` (4); cmsLocaleId `6ac8e84728488a6bd334f2fc`. Картинки CMS уже в бакеті копії (`cdn.prod.website-files.com/6ac8e84728488a6bd334f2fb/…`) |
| Копія: Variables | `core` `collection-cd80b580-4fd2-62b4-d7d1-57eddb084b67` (1 режим) · `semantic` `collection-0955f3bd-7147-ca75-39d5-f418a8d07264` (Base mode = light, `dark` `mode-ddc1ad08-4ab7-f9d4-1eeb-25e3a26ab76a`) · `type` `collection-0e5cebe5-0907-8476-c9f6-588218361070` (Base mode = desktop, `tablet` `mode-3d1cb45c-aab6-c53d-6792-2247e767d6b4` авто на ≤991, `mobile` `mode-1791d012-a630-d7f0-e6c8-068fc958c1ab` авто на ≤479). Порожня `Base collection` `collection-2b410466-…` — видалити руками |
| Копія: компоненти | `styles-rem` `a9980c61-abfe-00d6-e200-dd0d361b35be` (група System), інстанси — перші в Body Styleguide і Home (`f968ef53-6a5f-a95f-36ad-0bdbb5b6b688`) |
| Копія: Home, нові секції | `section-preloader` `ff274689-184c-625c-d2e5-4eceb58da2f9` (другий у Body, після `styles-rem`) · `section-hero` `1e2ce484-6c13-e35c-cb6f-99262c1d94e1` (перший у `main` `7a61b557-…15a5`, перед старим Hero) · `section-intro` `d320b4f4-8f76-79fa-a9ef-f7d30f54e19d` (одразу після `section-hero`) |
| Копія: режими `semantic` | Base (light) = `base`, `dark` = `mode-ddc1ad08-…` (id `base` можна ставити явно, напр. на вкладений шар) |
| Копія: breakpoints | `main` (база) · `medium` ≤991 · `small` ≤767 · `tiny` ≤479 |
| Figma файл | `KJQjG15P2P3SkXwrJJxLOp` (`Motion (DEV)`) — фрейми посекційно, див. [docs/FIGMA.md](docs/FIGMA.md) |
| Аналітика (перенести) | GA4 `G-CP1VPL4VKN` (Site settings → Integrations), Twitter pixel `twq('config','ocd0n')` у site head |
| OG image | `642fed24bb99285affd212e5_Og image.png` (Home → Open Graph) |
| Зовнішній JS (старий) | `https://cdn.zajno.com/dev/motion/script.v33.min.js`, `…/ifvisible.min.js`; копії в `reference/` |
| Звуки | `https://cdn.zajno.com/dev/motion/sounds/*.mp3` (bg, click, hover_1…10, 1_NOT_REAL_TIME) |

## Рішення по проєкту (2026-10-09)

- **Працюємо в копії сайту.** Оригінал не чіпаємо взагалі; він і лайв, і бекап.
  Перед стартом користувач робить ручний бекап оригіналу (Cmd+Shift+S).
- **MCP підключений до обох сайтів.** Оригінал — лише для читання: ассети,
  структура, IX2, порівняння. Правило read-only — у CLAUDE.md §1.
- **Запуск:** на копію ставиться Site plan, домен motion.zajno.com переноситься
  зі старого сайту на новий (DNS не міняється). Старий сайт живе як архів
  щонайменше місяць. План Webflow між сайтами не переноситься — купується на
  новий, скасовується на старому (питання до студії).
- **URL зберігаються 1:1:** `/`, `/styleguide`, `/lesson/<slug>`,
  `/resources/<slug>`, `/course-items/<slug>`. Слаги CMS-айтемів ті самі.
- **Візуально 1:1 до лайву.** Міняємо лише те, що під капотом. Дизайн-зміни —
  окреме рішення користувача.
- **Анімації — гібрид:**
  - **IX3 (нові інтеракції Webflow, GSAP):** hover/click на картках і меню,
    scroll-reveal, прості scrub-анімації, Lottie-тригери, перемикання класів.
    Через MCP `data_interactions_tool` (click, hover, load, scroll зі scrub/pin,
    mouse-move, custom, splitText, wf:class). Не вміє: Initial Appearance
    (ставити resting-стан через клас), navbar/dropdown тригери.
  - **GSAP у коді:** interactive-секція (кулька/трек/слайдер), сфера на
    Matter.js, SVG-шлях в intro, прелоадер із лічильником, Lenis + ScrollTrigger
    інтеграція, звук, усе з залежностями між секціями.
  - Правило вибору: якщо анімацію може правити дизайнер у панелі без коду —
    IX3; якщо є обчислення, фізика, canvas, зв'язок кількох секцій — код.
- **Кастомний JS:** один ES-модуль у `src/`, прив'язка до DOM через
  `data-motion="<role>"` атрибути, **не через класи**. Версії бібліотек
  **пінити** (без `@latest`). Одна версія GSAP (зараз 3.10.4 + 3.11.4 упереміш).
  Хостинг на час розробки — GitHub користувача через jsDelivr
  (`cdn.jsdelivr.net/gh/<user>/<repo>@<tag>/…`), перед запуском — перенести на
  CDN студії (Amazon). Репо: `https://github.com/kov-dev/motion-rebuild` (public, бо jsDelivr роздає лише публічні; після переїзду на CDN студії можна закрити). Репо = уся папка `Projects/Motion`, `reference/recordings/` не комітиться. Коміти робить агент наприкінці сесії.
- **Lenis лишається.** Пінована версія, одна інтеграція зі ScrollTrigger
  (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`), без
  `scrollerProxy`-костилів, `prefers-reduced-motion` вимикає smooth.
- **Еталон анімацій:** агент сам записує лайв відео через Playwright +
  Google Chrome ([tools/record/](tools/record/)) у
  `reference/recordings/<desktop|mobile>/<NN-section>.mp4` (не комітиться).
  Індекс — [docs/recordings.md](docs/recordings.md). `gif_creator` — лише
  для швидких ілюстрацій, коли розширення підключене.
- **Figma:** макет нарізаний посекційно (дизайнер показував анімацію
  розкадровкою), цілісного фрейму сторінки немає. Користувач додає посилання
  на фрейми секцій по ходу. Аналіз — субагент на sonnet, результат у
  `docs/sections/`.
- **Карт-бланш на переписування (2026-10-09, користувач):** усе, що зібрано
  нелогічно, переписуємо без узгодження; узгоджуємо лише видимі дизайн-зміни.
  Користувач сам майже нічого не пам'ятає з оригінальної збірки (робилась
  довго, багато разів перероблялась) — джерело правди це лайв + записи.
- **Прелоадер — переробити з Lottie на код.** На лайві: Lottie-кулька над
  лічильником, потім Lottie-кола (3 копії під смуги) зі словами MOTION / DESIGN /
  PRINCIPLES, фінал — дубль Hero (кільце, кулька, лінія `ball-divider.is-preloader-left`
  розкривається; `ball-bg` прозорий і статичний — уточнено в сесії 7). Робимо GSAP/CSS
  без Lottie, звіряючи з записом. Вихідники After Effects не потрібні. Розбір і план —
  [docs/sections/preloader.md](docs/sections/preloader.md).
- **Прелоадер — рішення агента (сесія 7, карт-бланш):** (1) таймінг 1:1 з лайвом
  (5.0 + 3.23 + 1.7 = 9.93 с), лише фаза 1 чекає `document.fonts.ready`; (2) скрол під
  прелоадером блокується (`lenis.stop()`), на лайві він можливий; (3) інверсія — дубль
  слова всередині шару-диска з `clip-path: circle()`, кольори режимами `semantic`;
  (4) розмір слів — cover-формула лайву (`max(2.15rem, 28.7vh)` / `max(1.23rem, 12vh)` /
  `0.5rem`), а не фіксований `display-xl`; (5) **фаза 3 анімує справжні елементи Hero**,
  дубля Hero в прелоадері немає (без шва .8→1 і стрибка); (6) гейт `html.is-preloading`
  у page-level head: без JS прелоадера немає, у Designer секція — звичайний блок 100vh;
  стартові стани фази 2 — у гейті, а не в класах (виняток з правила нижче).
- **Hero і `main-css` (сесія 8, агент):** (1) спільного `container` немає, ширини тримає кожен блок; (2) `h1` = великий
  текст hero; (3) старий `main-css` на Home **лишається**: `styles-rem` покриває лише rem, scrollbar і Lenis, а в
  `main-css` ще живуть стилі старих секцій (`section-slide*` clip-path, `is-techniques` overflow, шум
  `classic-anim_wrap::before`, `video.is-*`, hover-и, звук, Splide). Прибирається правило за правилом у проходах цих
  секцій, ембед видаляється з останнім; (4) старий Hero і старий `loader` лишаються до підключення `motion.js`, бо
  на staging їх тягне `script.v33`.
- **Intro (сесія 9, агент):** (1) нові класи не можуть повторювати старі імена, які читає `script.v33` (`ui`, `ui-*`,
  `anim-*`, `embed-path*`), і нові ембеди не мають старих `id` (`vrtx*`): інакше staging зламається ще до підключення
  `motion.js`; (2) JS-розкладку лайву (marginTop, ширини слайдів) перенесено в CSS; (3) стартовий `y: 100%` текстів
  пігулок ставить код, а не клас (секція нижче першого екрана; без JS тексти видимі); (4) ілюстрації — фонові SVG з
  ассетів копії, як на лайві, по одному на смугу; (5) відео — `preload="none"`, без `autoplay`, реальні пропорції.
- **Hero (уточнено 2026-10-09, сесія 3):** сам Hero — це лише кулька на лінії
  й два тексти, без Splide. Зміна кольору фону й великого тексту, яку пам'ятає
  користувач, — це **фінал прелоадера**: слова MOTION / DESIGN / PRINCIPLES з
  колом та інверсією чорне↔біле. Інверсія зроблена в Lottie дублем слова під
  track matte кола (сесія 7, docs/sections/preloader.md), не `mix-blend-mode`.
  Splide `splide2` + своп `.hero_text` живуть в **уроці easing** (схеми
  linear/ease/ease-in) і переробляються на GSAP у проході Lessons.
- **Без сторонніх слайдерів (2026-10-09, користувач).** На лайві Splide (hero)
  і ще щось на кшталт Spline/Swiper — усе це прибираємо. Усі слайдери й
  каруселі робимо на GSAP (Observer/Draggable + timeline) або IX3, щоб була
  одна анімаційна бібліотека. Відкрите питання «Splide лишати?» закрито.
- **`data-motion` ролі** (таблиця в docs/script-map.md) — внутрішнє рішення
  агента, від користувача нічого не потрібно.
- **Одиниці:** на лайві вже rem-система (Splide `fixedWidth: "3.45rem"` =
  345px макета), тобто та сама база 1rem = 100px, що в WEBFLOW-BASE §1.
  Перевірити `html { font-size }` в ембеді `main-css` на етапі аудиту.

- **Гравітація сфери (2026-10-09, сесія 4, користувач):** нахил гравітації
  Matter.js за скролом **відновлюємо**. На лайві він мертвий через тригер
  `.wf-section` (script-map №15). У коді — ScrollTrigger на `data-motion` секції.
- **Стрибок скролу на мобайлі — підтверджено на реальному телефоні**
  (користувач, сесія 4). Це баг лайву, а не артефакт емуляції. Закривається
  створенням усіх pin'ів одразу в порядку DOM. Звірка після проходу Resources —
  обов'язково на телефоні.
- **Внутрішні рішення з Figma-аналізу (сесія 4, агент, карт-бланш):** лінії
  Hero на виході стискаються до кільця, як на лайві (у Figma — до країв).
  Вхід кільця й ліній після прелоадера розбираємо в проході Preloader.
  Ілюстрації Intro беремо з ассетів Webflow, Figma-SVG — лише для звірки.
  ≤991 будуємо з лайву. Уточнено в сесії 5: на дошці `Full design` фрейми 768/375 є,
  але це звірка, а не еталон (див. нижче).
- **Figma ↔ лайв (сесія 5, агент, карт-бланш):** за розбіжності береться лайв. Фрейми
  768/375 з `Full design` — звірка й підказка для станів, яких не видно на записі. Конкретно:
  UI-слайдер — слайди 75/25vw, розкриття з Ø18 (у Figma 66.7/33.3vw і Ø128). Блок 2 і ≤991
  слайдера — з лайву. Bold 700, а не Figma Ultrabold. `anim-shape` 400, а не Light 300.
  ls `.h3` −0.036em. `.p3-bold` mob .14/.22. Шкали відступів і колонок у Figma немає, тож
  драбина STYLEGUIDE + літерали лайву.
- **SEO/a11y без візуальних змін (сесія 4, агент):** на Home немає `<h1>`, у
  `<html>` немає `lang`, посилання-іконки без імені, порядок заголовків
  зламаний. У перезбірці виправляємо тегами й атрибутами, без зміни вигляду.
  Великий текст hero — кандидат в `h1`; вирішити в проході Hero.
- **Ассети:** відео 78.6 MB (94 % ваги), на старті вантажиться ~4.9 MB.
  Перекодування H.264 без видимої різниці (SSIM ≥0.994) і lazy-підвантаження —
  внутрішнє рішення. Обрізати петлі відео-карток і чистити 330 невживаних
  файлів бібліотеки копії — **тільки з дозволу користувача**.
  Деталі — [docs/assets.md](docs/assets.md).

## Карта Home (оригінал)

Виправлено 2026-10-09 (сесія 3) за деревом [docs/home-tree.md](docs/home-tree.md)
(1545 вузлів у body, Designer ID верхнього рівня) і записами лайву
[reference/recordings/](reference/recordings/) (див. [docs/recordings.md](docs/recordings.md)).

| # | Секція | id | Клас-обгортка | Що всередині (коротко) | Вузлів |
|---|---|---|---|---|---|
| — | Navigation | — | `navigation w-nav` | лого-очі, бургер `#menu-toggle`, меню з 10 hover-Lottie пунктами `lottie-card` у `nav-track` (горизонтальний скрол колесом), крихти `#breadcrumbs-wrap` | 109 (13 Lottie) |
| 0 | Preloader | — | `loader` → `loader-wrap`, `preloader_wrap` | Lottie-кола (3 копії під смуги) + лічильник 0→100; далі слова MOTION / DESIGN / PRINCIPLES з колом та інверсією чорне↔біле | 18 (4 Lottie) |
| 1 | Hero | `#hero` | `nav nav-dark` → `section is-hero` | `anim-ball-sticky` → `anim-ball-wrap` (кулька `#anim-ball`, лінії `ball-divider`, `anim-ball-border`), 2 тексти. **Без Splide, Lottie та IX2** | 14 |
| 2 | Introduction | `#introduction` | `nav nav-dark` → `section is-introduction` | SVG-шлях `embed-path` (+`_tablet`, `_mobile`, `#vrtx*`), лінійні ілюстрації, підписи `anim-shape`; **UI-слайдер `ui-wrap` → 2× `.ui`** (`ui-track`/`ui-slide`/`ui-ball`, 6 відео, розкриття `clip-path: circle()`) | 98 (6 відео) |
| 3 | Interactive | `#interactive` | `nav nav-light` → `section is-interactive` | заголовок, горизонтальний трек `height-section.is-interactive` з 3 `horizontal-item`, сфера Matter.js `#canvas`, Lottie `not_real_time` | 25 |
| 4 | Techniques | `#techniques` | `nav nav-dark` → `section is-techniques` | три слова-плашки (INTERFACE / ANIMATION / …), 2 зірки, текст. **Карток немає** | 15 |
| 5 | Lessons | `#lessons` → `#easing #delay #fade #morph #masking #dimension #parallax #zoom` | одна `section is-lessons` → 8× `section nav nav-color` + 4 хмари | урок: крихта з кольором, текст, Lottie/відео-приклади. **Splide `splide2` + `hero_text` — в уроці easing** (схеми linear/ease/ease-in). dimension: hero-відео замість Lottie, крихта `is-scale` | 799 (17 Lottie, 46 відео) |
| 6 | Resources | `#resources` | `nav nav-light` → `resources` | 28 CMS-айтемів (Courses + Resources), `resources-track`, pin + 3 фази | 288 |
| 7 | Footer | — | `nav nav-dark` → `footer` | хмари `footer-cloud-item` з IX2 scroll-progress | 115 |
| — | Sound button | — | `fixed-bottom` → `sound-btn-wrap` | аудіо, ховається над футером (IX2) | 14 |

Обгортки `nav nav-dark|nav-light|nav-color` — маркери для JS, що перемикає
колір навбара при скролі (`querySelectorAll(".nav")` у script.v33).
Компонентів/символів на сторінці 0, усі 98 ембедів — HtmlEmbed.

## Класи (нові) — чернетка етапу 2 (сесія 5, 2026-10-09)

**Статус (сесія 6):** Variables (`core` / `semantic` / `type`) і 11 текстових стилів +
`.body-sm.is-strong` **створено в копії й звірено**. Також створено службові `code-embed`
(`display: none`, WEBFLOW-BASE §9.10), `sg-section` + `is-dark` (Styleguide). Структурні й базові
класи нижче — ще чернетка, створюються в проходах секцій. Імена — за WEBFLOW-BASE §2–4 і
STYLEGUIDE §3–6, значення — [docs/sections/design-system.md](docs/sections/design-system.md) §8
(Figma) + [docs/styleguide-audit.md](docs/styleguide-audit.md) (лайв). Figma і лайв збігаються
майже повністю. Де ні — береться лайв (рішення «візуально 1:1»). Колекції закладаються повністю,
значення заливаються під секцію, яка перша їх використає (WEBFLOW-BASE §2). Числа нижче — px
макета відповідної смуги; у Webflow це /100 rem.

### Variables

**`core`** (1 режим)

| Змінна | Значення | Figma | Замінює на лайві |
|---|---|---|---|
| `neutral-0` | `#FDFCFA` | `White` | 42 літерали, `.white`-комбо |
| `neutral-1000` | `#0C0B0B` | `BG` | 51 літерал |
| `neutral-800` | `#3D3C3C` | — | `.progress-bar*` (4) |
| `extra-lesson-easing` · `-delay` · `-fade` · `-morph` · `-masking` · `-dimension` · `-parallax` · `-zoom` | `#C8CFE8` · `#D2C8E8` · `#E4E8C8` · `#C8E8E8` · `#E8C8E5` · `#E8C8C8` · `#D6E8C8` · `#C2D5D7` | `Easing`, `Offset`, `Fade in Fade Out`, `Transfor-mation`, `Masking`, `Skale`, `Parallax`, `Zoom` | `.lesson.is-*`, `.breadcrumb-item.is-*`, стрілка easing. Імена за id уроку, не за Figma |
| `extra-classic-easing` · `extra-classic-delay` | `#AAB8EB` · `#BDB1D7` | `Easing-Cl` · — | `classic-anim*` |
| `font-display` | `Pp-neuemachina-Plain` | PP Neue Machina Plain | body, заголовки |
| `font-body` | `Pp-neuemachina-Inktrap` | Inktrap | `p2`, навігація, футер |
| `font-accent` | `Magilio-400` | Magilio | `.h2-secondary`, `.resources-student` |
| `weight-regular` / `weight-bold` | 400 / 700 | Regular / Ultrabold 800 | лайв Bold 700 (woff2 800 немає) |
| `radius-8` | 8 | картка слайда | картки UI-слайдера (6) |
| `radius-full` | 999 | плашка r100, кулька | плашка Intro, кулька, кільце |
| `border-1` | 1px (не rem) | лінії, пілюлі | `ball-divider`, кільце, рамки |

**`semantic`** (light / dark), лише аліаси: `bg` = `neutral-0` / `neutral-1000`,
`foreground` = `neutral-1000` / `neutral-0`, `border` = `neutral-1000` / `neutral-0`.
Секції лайву `nav-light` / `nav-dark` стають режимом секції. Уроки фарбуються комбо `is-<урок>`
прямо в `extra-lesson-*`. Це відступ від STYLEGUIDE §3.2 («компоненти — лише semantic»): 8
режимів під 8 фонів не потрібні, текст на всіх уроках `neutral-1000`.
✅ **Перевірено (сесія 6): MCP ставить режим колекції на клас**, зокрема на комбо
(`data_style_tool` → `set_style_variable_mode`, читання — `get_style_variable_modes`). На
`.sg-section.is-dark` стоїть `semantic: dark`, і знімок показує інверсію. Отже секції отримують
режим `dark` комбо-класом, а запасний варіант із літералами з `core` не потрібен. Режим можна
ставити й по breakpoint/pseudo.

**`type`** (desktop / tablet / mobile). Ім'я за desktop-px. Другий токен з тим самим
розміром з'являється лише при іншій драбині смуг (STYLEGUIDE §4.7).

| Токен | 1440 / 768 / 375 | Стиль |
|---|---|---|
| `text-215` | 215 / 120 / 56 | `display-xl` (tab/mob — з Figma `H1`, звірити з `.list-item` лайву) |
| `text-160` | 160 / 100 / 50 | `display-lg` |
| `text-140` | 140 / 78 / 40 | `heading-xl` |
| `text-115` | 115 / 64 / 36 | `heading-lg` |
| `text-74` | 74 / 40 / 36 | `heading-md` |
| `text-64` | 64 / 28 / 19 | `text-shape` (tab/mob з Figma `H4-c`, звірити з лайвом) |
| `text-54` | 54 / 44 / 34 | `heading-sm` |
| `text-28` | 28 / 24 / 22 | `body-lg` |
| `text-18` | 18 / 14 / 14 | `body-md` |
| `text-16` | 16 / 13 / 13 | `body-sm` |
| `text-16-label` | 16 / 14 / 14 | `text-label` (Figma `Navigation`; лайв tab/mob зняти в проході Navigation) |

Не створюємо: старі змінні `White` / `Black` (незв'язані, видалити з копії на етапі 2).
`#000` (11 правил: фони під відео в `.lesson`, `.card-video*`, `.classic-anim*`) лишається
літералом до проходу Lessons, там вирішити 1:1. Також не створюємо `#fff` (лише SG), разові
rgba, Figma `H1-m`, `N2`, `GR` (на лайві 0–1 вживання → літерал). Шкали `space-*` / `container`
у Figma немає. Беремо драбину STYLEGUIDE §5, а значення лайву поза нею пишемо літералами. Чи
потрібен `container` узагалі, вирішується в проході Hero: секції Motion повноширинні, з
absolute-розкладкою.

### Текстові стилі (класи)

Колір не мають (STYLEGUIDE §3.4). Leading — множником, tracking — `em`, обидва прямо в стилі
(фіксовані пропорції). `UP` = uppercase.

| Клас | Шрифт | Розмір | lh | ls | | Замінює |
|---|---|---|---|---|---|---|
| `display-xl` | display | `text-215` | 1.0 | −0.04em | UP | `.list-item` (Intro), `.scrolling-text.is-lessons`. Кандидат у `h1` |
| `display-lg` | display | `text-160` | 1.06 | −0.04em | UP | `.h2` |
| `heading-xl` | display | `text-140` | 1.03 | −0.036em | UP | `.h3`, `.h3.white` |
| `heading-lg` | **accent** | `text-115` | 1.1 | −0.02em | | `.h2-secondary` |
| `heading-md` | display | `text-74` | 1.08 | −0.04em | UP | `.h4`, `.label-1` |
| `heading-sm` | display | `text-54` | 1.07 | 0 | UP | `.h5` |
| `body-lg` | display | `text-28` | 1.57 | 0 | | `.p1` |
| `body-md` | body | `text-18` | 1.78 | 0 | | `.p2`, `.slide-inner-label`, `.hero_wrap` |
| `body-sm` | display | `text-16` | 1.5 (tab **1.85**, mob **1.385**) | −0.02em | | `.p3` (51), `.btn-link` (25), `.resources-item__button` (14). lh tab/mob — з `.p3` лайву (сесія 9); `btn-link` / `resources-item__button` звірити у своїх проходах |
| `body-sm` + `is-strong` | body, 700 | 16 / **16** / 14 | 1.5 (mob 1.57) | 0 | | `.p3-bold`: підписи карток Interactive. Розмір tab/mob лишаємо як на лайві, тому комбо перевизначає й розмір |
| `text-label` | body | `text-16-label` | 1.0 | −0.03em | | `.breadcrumb-item`, `.nav-toggle`, `.logo-text-sections`, `.resources-header__count` |
| `text-shape` | **display** | `text-64` | 1.0 | **−0.007rem** | | `.anim-shape` (4, Intro). Вага 400, як на лайві (Light 300 немає). Сесія 9: шрифт і ls — з лайву (було Inktrap / −0.06em з Figma) |

Поза стилями, літералом у класі блока: `ui-title` (2× `.h6`, заголовки блоків UI-слайдера,
74/44/24, своя драбина, тож не `heading-md`), `resources-title` (1.95), `resources-student`
(Magilio 34), `loader-counter` (14/24). Футер і меню (`F-1`/`F-2`/`F-3`, `.nav-absolute`,
`.f-navigation-list`, `.f-label`) вирішуються в проході Navigation/Footer. У Figma там чотири
різні драбини смуг, тож спершу зняти лайв.

Шрифти (перевірено в сесії 6, `data_fonts_tool`): у копії **вже є 4 woff2 під правильними
CSS-іменами**, заливати нічого не треба: `Pp-neuemachina-Plain` 400, `Pp-neuemachina-Inktrap`
400 + 700, `Magilio-400` 400. Усі з `font-display: swap`. Plain є лише в 400, тож `is-strong` бере
Inktrap 700. 13 `.otf` не заливаємо.

**Як створено (сесія 6):** розмір — змінна `type`, сімейство — змінна `font-*`, вага — Number-змінна
`weight-*` (`font-weight` її приймає). lh і ls — літералами. У кожному стилі `margin-top/bottom: 0`,
щоб скинути дефолтні відступи тегів `h*`/`p` у Webflow. Відступи між текстами задає розкладка
(`grid-row-gap`), а не текстовий стиль. `.body-sm.is-strong`: Inktrap 700, ls 0, на `medium` 0.16rem,
на `tiny` 0.14rem / lh 1.57.

**CSS-імена змінних** (для `src/` і ембедів): `--_core---neutral-0`, `--_semantic---bg`,
`--_type---text-16` тощо, тобто `--_<колекція>---<змінна>`.

### Структура й базові класи

| Клас | Тег | Роль | Замінює |
|---|---|---|---|
| `body` | body | шрифт `font-display`, `bg`/`foreground`. **Ставиться руками** (WEBFLOW-BASE §3.4) | `.body-wrap`, `.body` |
| `styles-rem` | embed (компонент, клас `code-embed`) | ✅ створено: rem-правило 3 смуги + scrollbar + Lenis-CSS, канон [src/styles-rem.html](src/styles-rem.html). Noise `::before` і вибір `video.is-*` — у проході Lessons (прив'язані до блоків) | `main-css` (Home) + ембед Styleguide |
| `site-nav` | nav | навбар (компонент) | `navigation w-nav` |
| `section-preloader` · `section-hero` · `section-intro` · `section-interactive` · `section-techniques` · `section-lessons` | section | секції Home | `loader`, `section is-*` |
| `section-lesson` + `is-easing` … `is-zoom` | section | урок (компонент з пропсами, ×8) | `section nav nav-color` + `.lesson.is-*` |
| `section-resources` | section | Resources | `resources` |
| `site-footer` | footer | футер (компонент) | `footer` |
| `<block>-layout` | div | розкладка в секції, за потреби | — |
| `ball` + `is-hero` / `is-intro` / `is-preloader` | div | кулька 18, `radius-full` | `anim-ball*` |
| `ball-ring`, `ball-line` + `is-left` / `is-right` | div | кільце 106, лінії 1px | `anim-ball-border`, `ball-divider` |
| `btn` + `is-secondary` | a / button | пілюлі Menu / Sound / лого: 44 h, padding 14/16, radius 26 літералом (не з драбини, лише цей клас), `border-1` | `nav-toggle`, `sound-icon-wrap` |
| `btn` + `is-link` | a | текстова кнопка `body-sm`, підкреслення на hover | `btn-link` |
| `menu-card` | a | картка меню (×10) | `lottie-card` |
| ~~`ui`, `ui-track`, `ui-slide`, `ui-card`, `ui-ball`, `ui-text`~~ → `ui-stage`, `ui-block`, `ui-rail`, `ui-heading`, `ui-title`, `ui-slides`, `ui-panel`, `ui-panel-body`, `ui-media`, `ui-video`, `ui-caption`, `ui-dot` | div / h2 | UI-слайдер Intro (сесія 9: старі імена зайняті класами, які читає `script.v33`) | `ui*`, `section-slide*` |

**Прелоадер (створено, сесія 7):** `section-preloader`, `preloader-scene`, `preloader-step`
(+ `is-dark`), `preloader-disc` (+ `is-light`), `preloader-word`, `preloader-loader`,
`preloader-bounce`, `preloader-bounce-ball`, `preloader-bounce-shadow`, `preloader-counter`.
Значення й дерево — docs/sections/preloader.md «Збірка в копії». `section-preloader` — `div` з
`aria-hidden="true"`, а не `<section>`: це декоративний оверлей без змісту.

**Hero (створено, сесія 8):** `section-hero` (режим `dark`), `hero-sticky`, `hero-plate`, `hero-axis`, `hero-lead`,
`hero-text`, `hero-statement`; спільні `ball` (+ `is-hero`), `ball-ring`, `ball-line` (+ `is-left` / `is-right`,
лише `transform-origin`). Імена `hero-title` / `hero-content` / `hero-animation` / `hero-visual` зайняті старими
класами копії, їх не чіпаємо. Дерево й значення — docs/sections/hero.md «Збірка в копії».

**Intro (створено, сесія 9):** `section-intro` (режим `dark`), `intro-scene`, `intro-art`, `intro-illustration`,
`intro-clouds`, `intro-cloud` (+ `is-left` / `is-right` / `is-middle`), `intro-smoke`, `intro-shape` (режим `base`; +
`is-also` / `is-controls` / `is-your` / `is-attention`), `intro-shape-mask`, `intro-path` (+ `is-tablet` / `is-mobile`);
UI-слайдер — 12 класів `ui-*` вище + `ui-panel-body.is-first`. Фони ілюстрацій — `background-image: @img_<assetId>`
(формат API для ассета). Дерево — docs/sections/intro.md «Збірка в копії».

Префікси блоків: `hero-*`, `intro-*`, `ui-*`, `interactive-*`, `techniques-*`, `lesson-*`,
`resources-*`, `footer-*`, `nav-*`, `preloader-*`. Внутрішні класи кожного блока додаються в
проході його секції, а не заздалегідь.

**Стани й маркери:**

- Колір секції — режим `semantic` (див. вище), а не комбо `.white` на кожному тексті.
- JS-стани (`is-active`, `is-open`, `is-playing`) — комбо-маркери (WEBFLOW-BASE §10.3).
- Стартові стани анімацій (`clip-path: circle(0.09rem)`, `opacity: 0`) — у класі елемента.
- Прив'язка JS — лише `data-motion="<role>"` ([docs/script-map.md](docs/script-map.md)), тема
  навбара — `data-motion="theme"` + `data-theme`. Класи для JS не використовуються.
- Hover-и — станом Designer, не через ембед. Обводка картки — `box-shadow`, без зміни `border`.

**Викидаємо:** дублі `.label-1`, `.slide-inner-label` і `.hero_wrap` як типографічні класи,
`.h4-c`, `.h2-secondary.text-center`, `.p3.margin-top`, 24 мертві класи
(styleguide-audit §5), автоімена (`text-block-3`, `div-2`, `div-block-4`, `margin-40`,
`example-video-1…6`, `progress-bar_title-1…3`).

## Журнал

### 2026-10-09 (сесія 9) — прохід Intro: збірка, звірка, вихід Hero

- **Відповіді користувача (кінець сесії):** staging 17:53 і 18:16 публікував він; **агенту дозволено публікувати
  копію** (CLAUDE.md §2 оновлено); хвиля 2 чистки — так; прототип таймінгів hero — пізніше.
- **Публікація агентом:** копія → staging 18:59 UTC (лише webflow.io). На staging тепер є `section-intro`.
- **Хвиля 2:** аудит 65 ID на свіжому staging + CMS + стилях Designer — 0 збігів (docs/asset-cleanup.md). Видалення
  заблокував класифікатор дозволів Claude Code, чекає підтвердження. Знайдено 4 URL на бакет оригіналу (OG, шум,
  2 постери) — у PLAN, етап 6.

- **Знімок Hero в Designer вдався** — `reference/snapshots/2026-10-09-hero-designer.png`. Лінії й обводки на ньому
  товсті, але на staging лінія 1 px, кільце 106, кулька 18 (Playwright): це масштаб рендеру знімка, не стилі.
- **Staging перепубліковано ще раз — 18:16 UTC** (`lastPublished 2026-10-09T18:16:42Z`, до того 17:53). Агент не
  публікував. На staging є `section-hero`, нової Intro немає.
- **Intro зібрано** — `section-intro` після `section-hero`: сцена з ілюстраціями (фони SVG по смугах), 4 пігулки з
  текстами `intro-text` `data-step`, 3 невидимі SVG-шляхи `intro-path` `data-bp`, UI-слайдер (2 блоки × 3 панелі,
  відео-ембеди, `ui-dot`). 22 нові класи + 10 комбо, режими `semantic` dark / base, без літералів кольору. Канон
  ембедів — `src/intro/` (3 шляхи, 6 відео), прочитано назад, збігається. Дерево й рішення — intro.md «Збірка в копії».
- **Звірка з лайвом** — фікстура + `tools/record/intro-compare.mjs`, 1440 / 768 / 375: Δ 0–1 px для всієї розкладки;
  розбіжності лише в станах анімацій (деталі в intro.md). Знімки `reference/snapshots/2026-10-09-intro-*-live-vs-new.png`.
- **Текстові стилі за лайвом:** `text-shape` → Plain + ls −0.007rem (Figma-значення Inktrap/−0.06em на лайві не
  використовуються); `body-sm` lh tab 1.85 / mob 1.385, `is-strong` medium lh 1.5. Нові `ui-title` — літерали `.h6`.
- **`initHero()`** — вихід ліній і кільця при вході Intro (ScrollTrigger з `gsap@3.13.0`, точковий тригер). Прогнано на
  розмітці staging з фікстурою Intro (`tools/record/hero-exit-run.mjs`): вниз лінії → кільце, вгору навпаки, без помилок.
  Також `ScrollTrigger.refresh()` у `init()` після всіх модулів.
- **План `initIntro()`** (MotionPath, тексти, передача кульки в слайдер, хмари, reduced motion) — intro.md «План анімації».
- **Знахідки:** (1) хмари Intro на лайві мають scroll-паралакс IX2 (`a-127` / `a-156`: +3rem / +2rem → 0, середня → 1.3 /
  0.8rem), у сесії 3 його не помітили; (2) відео слайда 2 портретне (468×938); (3) на лайві `width`/`height="100%"` і
  `preload="none"` дають фолбек 300 px до метаданих.
- **Пастки:**
  1. `background-image` через API — значення `@img_<assetId>` (так його й читає `query_styles`); URL з ассетів копії
     брати зі старих класів копії, бо в бібліотеці багато тезок (`cloud_1_mobile.svg` ×4).
  2. `calc(1.6rem - 50vh)` і `circle(0.09rem at 50% 50%)` літералами зберігаються (проблема лише зі змінними всередині).
  3. Старі класи копії з тими ж іменами — пастка для staging: `script.v33` вибирає елементи за класами, тож перевіряти
     імена через `query_styles` перед створенням (так зроблено з `ui-*`).
- Відповідей користувача знову немає: поля в промпті (хто публікував staging і чи можна агенту публікувати копію, хвиля 2
  ассетів, прототип таймінгів hero) лишились шаблонними.

### 2026-10-09 (сесія 8) — знімок прелоадера, збірка Hero, каркас motion.js

- **Знімок прелоадера.** Designer (Bridge App) зняв фазу 1, потім **увесь міст Designer почав таймаутити**
  (`element_snapshot_tool`, `designer_tool` — 6 таймаутів підряд), а data-інструменти працювали. `preloader-loader`
  ховали й повернули (`set_visibility` true, підтверджено). Кроки слів звірено на staging через Playwright,
  числа й знімки — у preloader.md «Збірка в копії». Типографіка збігається з Figma і cover-формулою.
- **Staging копії вже опубліковано:** `Last Published: Fri Oct 09 2026 17:53:42 GMT`, і там є `section-preloader`.
  Агент не публікував, у журналі сесії 7 цього немає, тобто публікував користувач. Нагадування: GA4 `G-CP1VPL4VKN`
  на копії пише в продакшн-аналітику (див. «старт»).
- **Hero зібрано** — `section-hero` у `main` копії, 7 нових класів + `ball` / `ball-ring` / `ball-line` з комбо, ролі
  `data-motion` для фази 3 прелоадера, `h1`. Звірка з лайвом: 1–2 px у трьох смугах (hero.md «Збірка в копії»).
  Рішення по `container`, `h1`, `main-css` — у «Рішення по проєкту».
- **Текстові стилі виправлено по смугах:** `heading-xl` medium lh 1.13 / ls −0.03em, tiny lh 1.1; `body-lg` tiny
  lh 1.45. У сесії 6 стилі звіряли лише по desktop. **Решту стилів (`display-*`, `heading-lg/md/sm`, `body-md/sm`)
  треба так само звірити з tablet/mobile лайву** в проходах секцій, де вони вперше з'являються.
- **Каркас коду:** [src/motion.js](src/motion.js) (GSAP 3.13.0 + CustomEase з jsDelivr ESM, піновано; `initPreloader()`
  повністю за планом, `initHero()` — заглушка до Intro), [src/preloader-gate.js](src/preloader-gate.js),
  [src/preloader.css](src/preloader.css). До Webflow не підключено. **Прогнано** на розмітці staging (гейт вставлено в
  HTML у Playwright, [tools/record/preloader-run.mjs](tools/record/preloader-run.mjs)): фаза 1 (відскок, лічильник
  0→100 за 4 с), фаза 2 (диски з інверсією, три слова), фаза 3, клас знято. Кадр 6.4 с —
  `reference/snapshots/2026-10-09-preloader-run-6.4s.png`.
- **Пастки:**
  1. CSS для `<style>` у head не може містити в коментарях теги: `</style>` у коментарі закриває елемент, і решта CSS
     друкується на сторінці. Тому гейт-скрипт винесено в окремий `src/preloader-gate.js`.
  2. `gsap.set([null, …])` кидає `Cannot read properties of null (reading '_gsap')` (один `null` дає лише warning).
     У `motion.js` цілі збираються через `els()`, який відкидає відсутні елементи.
  3. Playwright `addInitScript` виконується до появи `<html>`, тож клас на `documentElement` так не поставити. Гейт
     вставляти в HTML через `page.route`.
  4. Designer-міст може «вмерти» посеред сесії, коли data-інструменти ще живі. Візуальну звірку тоді робити локально
     (CSS staging + значення класів) або на staging.
- Відкриті питання знову без відповіді: у промпті сесії поля (хвиля 2 ассетів, дозвіл на публікацію, прототип hero)
  лишились шаблонними.

### 2026-10-09 (сесія 7) — етап 3, прохід Preloader: аналіз, збірка, план анімації

- **Аналіз** (субагент sonnet) — [docs/sections/preloader.md](docs/sections/preloader.md): Figma
  (сторінка Preloader — лише фаза лічильника; слова — `Preloader(4..11)` і `Full design` 768/375),
  записи (desktop T0 ≈ 6.85 с запису, mobile ≈ 0.4 с), IX2 `a-161` (PAGE_START, 5 груп), 4 Lottie
  JSON розібрано пошарово. Прелоадер лайву фіктивний за часом: 9.93 с від PAGE_START, не залежить
  від `load`. `script.v33` прелоадера не чіпає, Lenis не зупиняє.
- **Інверсія** — у Lottie: кожне слово двічі, дубль протилежного кольору з track matte = копія кола.
  Кола — еліпси Ø25 зі scale 0 → ~95×, ease `(.65,0,.833,.833)`. Літери — шейпи, у нас текст.
- **Виправлено помилку в CONVENTIONS:** плашка `ball-bg.is-preloader-left` прозора й статична,
  ширину міняє лінія `ball-divider.is-preloader-left`. `.trigger` (IX2 клік) мертвий: елемента немає.
  `.loader` на ≤991 має фіксовані 768px — баг лайву, не переносимо.
- **Збірка в копії:** інстанс `styles-rem` першим у Body Home, за ним `section-preloader` з 17
  елементами (дерево й класи — в preloader.md). 10 нових класів + 2 комбо, кольори режимами
  `semantic` (`base` / `dark`), без літералів кольору. Старі `main-css` і `loader` поки на місці
  (дубль rem-правила з тими самими значеннями нешкідливий). Видаляються в проході анімації.
- **План анімації** — розділ «План анімації» в preloader.md: гейт `html.is-preloading` + failsafe
  6 с, 3 фази з тривалостями по 3 смугах, ролі `data-motion`, reduced-motion, фаза 3 = вхід
  справжнього Hero. Рішення — у «Рішення по проєкту» вище.
- **Пастки MCP:**
  1. `font-size: max(var(--_type---text-215), 28.7vh)` через `create_style` зберігся як **гола змінна**
     `text-215`, `max()` мовчки викинуто. Літерал `max(2.15rem, 28.7vh)` зберігається. CSS-функції зі
     змінними всередині через API не писати, завжди читати назад.
  2. `element_snapshot_tool` двічі впав (порожній статус, потім таймаут), а data-інструменти
     працювали. Візуальної звірки секції ще немає: зробити на початку наступного проходу з відкритим
     Designer на Home.
- Відповіді користувача знову не отримано: поля в промпті (хвиля 2 чистки ассетів, дозвіл на
  публікацію копії, прототип таймінгів hero) лишились шаблонними. Статус без змін.

### 2026-10-09 (сесія 6) — етап 2: Variables, текстові стилі, styles-rem

- **Шрифти копії** — 4 woff2 уже під правильними іменами, заливка не потрібна (деталі в «Класи
  (нові)»).
- **Режим колекції на клас — працює** через MCP, зокрема на комбо. Рішення `semantic` light/dark
  лишається як у чернетці, запасний варіант не потрібен.
- **Variables створено й звірено читанням назад:** `core` (13 кольорів, 3 шрифти, 2 ваги, `radius-8`,
  `radius-full` 9.99rem, `border-1` 1px), `semantic` (`bg` / `foreground` / `border`, аліаси на `core`,
  режим `dark`), `type` (11 токенів, режими `tablet` і `mobile` з авто-прив'язкою до `medium` /
  `tiny`). Усі значення збігаються з чернеткою. `White` / `Black` видалено (перед тим перевірено, що
  в стилях немає жодного `var(`). ID — у таблиці вище.
- **Текстові стилі:** `display-xl/lg`, `heading-xl/lg/md/sm`, `body-lg/md/sm`, `text-label`,
  `text-shape` + `.body-sm.is-strong`, усі на змінних. Імена були вільні.
- **`styles-rem`:** канон [src/styles-rem.html](src/styles-rem.html) → HtmlEmbed `code-embed` →
  компонент `styles-rem` (System) першим у Body Styleguide. Код прочитано назад, збігається
  байт у байт. На Home не вставлено: там поки живе `main-css`, заміна — у проході Hero. Site head
  поки не чіпали (питання етапу 0 про site-level code на webflow.io).
- **Styleguide копії:** додано блоки `sg-section` (типографіка, 12 зразків) і `sg-section is-dark`
  (демо режиму) перед старим `styleguide-wrapper`. Знімки:
  `reference/snapshots/2026-10-09-sg-typography.png`, `…-sg-dark-mode.png`. Шрифти, rem-шкала, Bold
  700 і інверсія — як очікувалось. Tablet/mobile-режими `type` знімком не перевірити (знімок лише
  desktop), тому перевірка — у Preview або на staging після дозволу на публікацію.
- **Пастки MCP:**
  1. `create_size_variable` з іменем `text-16` створив `text-16-2`, хоча дубля немає. Схоже, перевірку
     унікальності плутає префікс `text-160`. Лікується `rename_variable` → `text-16`. Після
     створення змінних завжди звіряти імена.
  2. Нова колекція отримує режим `Base mode`, а перейменувати режим чи видалити колекцію через API
     не можна. Тож `semantic` Base = light, `type` Base = desktop. Перейменувати руками за бажанням.
  3. `designer_tool` (`switch_page`, `get_current_page`) двічі впав по таймауту, а data-інструменти
     (builder, settings, components) і знімки працювали. Сторінку для збірки задає `pageId`,
     перемикати Designer не обов'язково.
  4. Код HtmlEmbed пишеться `data_element_settings_tool` → `set_settings`, ключ `code`
     (`static_text`). Читання — `get_settings` / `query_settings`.
- Старий ембед rem на Styleguide (`bddf9899…`, ті самі значення) лишено. Прибрати в проході
  Styleguide разом зі старими `h2…p3-bold`.
- Відповіді користувача знову не отримано: поля в промпті лишились шаблонними (хвиля 2 чистки
  ассетів; прототип таймінгів hero). Статус без змін.

### 2026-10-09 (сесія 5) — UI-слайдер, Design system, чернетка класів

- **UI-слайдер Intro** (`4609:22242`, субагент sonnet) — розділ «UI-слайдер» у
  [docs/sections/intro.md](docs/sections/intro.md). 9 кадрів 1440×750, лише блок 1 (3 слайди з
  6, мокапи замість відео). Слайд 960 + смуга 480, картка 700×425 r8, заголовок 74/80.
  `clip-path` на лайві: `circle(0.09rem)` → `circle(max(vw,vh))` за 0.7 с, відео 0.6 с
  із delay 0.1. Розкриття тільки GSAP + ScrollTrigger.
- **Design system** (`1301:36378`) — [docs/sections/design-system.md](docs/sections/design-system.md).
  3 стайлгайди (1440/768/375), 22 текстові стилі, 11 кольорових змінних. Лайв збігається з
  Figma майже повністю, зокрема tab/mob. Розбіжності закрито рішенням «Figma ↔ лайв» вище.
  Питання субагента в design-system §10 закрито ним же. Користувачу вони не потрібні.
- **Full design** — огляд у [docs/FIGMA.md](docs/FIGMA.md). Це дошка з ~400 розрізнених фреймів,
  а не цілісна Home. **Смуги 768/375 є** для Preloader, Intro, Interactive, Techniques,
  Resources і Menu (таблиця node-id). Висновок сесії 4 «768/375 немає» стосувався лише секцій
  користувача.
- **Чернетка словника** — розділ «Класи (нові)» вище: Variables (`core` / `semantic` / `type`),
  12 текстових стилів, структурні й базові класи. У копії нічого не створено.
- Виправлено: UI-слайдер зі слайдами `section-slide*` живе в `#introduction` (`ui-wrap`).
  Позначку «Interactive» у script-map (блоки B, D, числа pin) і main-css.md замінено.
- Пастка: `.h4` і `.h6` на 1440 однакові (74/80), але драбини смуг різні (40/36 і 44/24),
  тож одним стилем їх не звести. `.h6` — це лише заголовки UI-слайдера, і він стає класом
  `ui-title`.
- Відповіді користувача не отримано: поля у промпті сесії лишились шаблонними. Відкриті
  питання 2 (прототип таймінгів hero) і хвиля 2 чистки ассетів — без змін.

### 2026-10-09 (сесія 4) — Figma Hero/Intro, Lighthouse, styleguide, ассети

- **Figma розблоковано.** Доступ з'явився, блокер сесії 3 знято. Субагенти
  (sonnet) записали [docs/sections/hero.md](docs/sections/hero.md) і
  [docs/sections/intro.md](docs/sections/intro.md). У файлі є сторінки
  `Design system`, `Preloader`, `Full design`. Список з node-id —
  [docs/FIGMA.md](docs/FIGMA.md). **Макетів 768/375 немає**, лише 1440.
  Intro у Figma — один статичний стан без SVG-шляху, UI-слайдера й відео.
- **Токени з Figma:** BG `#0C0B0B`, White `#FDFCFA`. H3 — PP Neue Machina Plain
  140/144, −4 %, uppercase. P1 — 28/44. H4-c — Inktrap Light 64/64.
  Плашка — padding 24/40, radius 100. Кулька 18, кільце 106, лінії 1px.
- **Lighthouse лайву** — розділ у [docs/AUDIT.md](docs/AUDIT.md), звіти в
  `reference/lighthouse/`. Медіана з 3 прогонів: desktop 94/86/78/100, mobile
  93/86/79/100. Mobile TTI 7.0 с, webflow.js (IX2) виконується 2.1 с, вага
  6.9 MB. Бал оманливий: LCP — текст hero під прелоадером, а прелоадер іде
  9–15 с.
- **Styleguide** — [docs/styleguide-audit.md](docs/styleguide-audit.md).
  Сторінка майже порожня: заголовки h2–h6, p1–p3, жодних кольорів, кнопок і
  компонентів. На Home живуть 9 з 11 текстових класів, приблизно половина
  текстів має дублі-класи з тими самими значеннями. Змінні `White`/`Black` не
  підключені. Справжня палітра — літерали `#0c0b0b`, `#fdfcfa`, 8 кольорів
  уроків, `#3d3c3c`. Шрифти: 4 woff2, 177 KB.
- **Ассети** — [docs/assets.md](docs/assets.md). 215 файлів, ≈85.5 MB, з них
  відео 78.6 MB. Відео example-1 вантажиться в усіх трьох смугових копіях
  (підтвердили і Lighthouse, і аудит). Пари `.mov`/`.webm` у слайдері зайві
  (всередині H.264 без альфи). 13 `<audio>` без `preload="none"`. У бібліотеці
  330 невживаних файлів (≈350 MB), і в копії вони теж є.
- Користувач: гравітацію сфери відновлюємо, стрибок скролу на телефоні
  підтверджено. Обидва пункти внесено в рішення вище.
- **Чистка бібліотеки ассетів копії** (дозвіл користувача): попередній аудит
  перевіряв лише Home, Styleguide і CSS, тож субагент перевірив ширше —
  [docs/asset-cleanup.md](docs/asset-cleanup.md). **Видалено 203 файли
  (320.5 MB)**, у копії лишилось 176. Оригінал не змінено (379). Лишено за
  обережністю 65 (тезки, шрифти, файли після 2024-02-13) — друга хвиля після
  перевірки staging. ID ассетів у копії й оригіналі різні. Мапа ID — у скретчі
  сесії, список видалених — у `reference/`.
- **Знахідки чистки:** (1) OG-картинка Home у копії посилається на файл
  **оригіналу**. Перепривʼязати на `Og image.png` копії до запуску, інакше OG
  зламається, коли оригінал заархівують. (2) Шаблони Resources і Courses
  порожні, `/resources/*` і `/course-items/*` віддають 404. Шаблон Lessons теж
  порожній; `Fly - Dashboard_H.264.mp4` згадується лише в CMS-полі уроку easing.
- **Відео-картки не обрізаємо** (користувач). UI-слайдер Intro у Figma —
  `4609-22242` (docs/FIGMA.md), ще не розібраний.
- Пастка: у `autoplay="false"` атрибут присутній, тож autoplay **вмикається**.
  У перезбірці не ставити атрибут узагалі.

### 2026-10-09 (сесія 3) — аудит: записи лайву, дерево Home, main-css

- **Записи лайву** — `reference/recordings/{desktop,mobile}/` (15 кліпів по
  секціях + аркуші кадрів + `timeline.json`), меню — `desktop/16-nav-menu`.
  Індекс і опис — [docs/recordings.md](docs/recordings.md). Chrome-розширення
  не було підключене, тому записано **Playwright + Google Chrome**: справжнє
  відео з реальним таймінгом замість `gif_creator`. Це тепер стандарт еталона.
  Скрипти в [tools/record/](tools/record/).
- **Дерево Home** — [docs/home-tree.md](docs/home-tree.md) (субагент, read-only:
  HTML + MCP `get_all_elements`). 1545 вузлів, компонентів 0, 98 HtmlEmbed.
  **Карту Home вище переписано:** Splide живе в уроці easing, а не в Hero;
  UI-слайдер (`ui-wrap`) — в Introduction, а не в Interactive; `lottie-card` —
  це 10 карток меню навігації, а не Techniques; Lessons — одна секція з 8
  вкладеними; Navigation (109 вузлів, 13 Lottie) додано в карту.
- **main-css** — `reference/main-css.css` + [docs/main-css.md](docs/main-css.md).
  rem-правило збігається з базою (6.9444vw / 13.0208vw ≤991 / 26.6667vw ≤479),
  але без верхньої межі (на 1920 1rem = 133px) і зі стрибками на 991/479.
  `mix-blend-mode` немає; хаки `overflow-y: overlay`, `scrollbar-height`, Lenis-CSS.
- **Знахідки:** (1) зміна фону й великого тексту, яку пам'ятає користувач, —
  це фінал прелоадера (MOTION / DESIGN / PRINCIPLES з інверсією), а не hero;
  (2) нахил гравітації сфери за скролом на лайві мертвий — тригер
  `.is-interactive.wf-section`, а Webflow більше не ставить `wf-section`
  (script-map №15, питання користувачу); (3) на мобайлі скрол стрибає з
  Techniques назад у середину Intro (~6 700 px), імовірно через лінивий pin
  Resources (script-map №7).
- **Figma заблокована:** акаунт Figma MCP не має доступу до `Motion (DEV)`
  («you don't have edit access»). `docs/sections/hero.md` / `intro.md` не
  створено. Потрібен доступ від користувача.
- Пастка: швидко після старту `load` на мобайлі — 1.3 с, але прелоадер іде ~9 с
  (лічильник на таймері, не на завантаженні).

### 2026-10-09 (сесія 2) — ID копії, розшифровка скрипта

- MCP переавторизовано на обидва сайти; ID копії, сторінок і колекцій
  записано в таблицю вище. CMS у копії повна (10/8/4), картинки CMS уже в
  бакеті копії — костиль №10 з AUDIT закрито самим дублюванням.
- Немініфікованого `script.v33` у студії немає → розшифровано з мініфікованого:
  `reference/script.v33.src.js` (1:1 поведінка, читабельні імена, `NOTE:` на
  багах) + `reference/script.v33.pretty.js` (сирий prettier). Карта блоків A–K,
  DOM-залежності, числа для 1:1 і 14 багів/костилів — `docs/script-map.md`.
- Ключові знахідки: `lenis` глобала не існує (усі Lenis-гілки мертві, скрол
  блокується через `html overflow`); `vw/vh` читаються раз на load; resources
  pin створюється ліниво, тому нав-тригери мають ручні офсети; `e.toElement`
  кидає помилки у Firefox; блок кнопок швидкості відео — мертвий код.
- Запропонована таблиця `data-motion` ролей — у script-map.md, затвердити
  перед етапом 2.
- Пастка MCP: `webflow_guide_tool` повертає 88 KB — не читати, одразу робити
  `list_sites` із `session_id: start`.

### 2026-10-09 — старт

- Ознайомлення з оригіналом через MCP, витягнуто все в [docs/AUDIT.md](docs/AUDIT.md).
- Викачано `script.v33.min.js`, `ifvisible.min.js`, опублікований HTML Home,
  IX2 JSON (`reference/`), зведення IX2 — [docs/ix2-summary.md](docs/ix2-summary.md).
- Рішення вище. Користувач робить копію сайту й переавторизує MCP на обидва.
- Копія `Motion rebuild` створена (усі три опції Duplicate увімкнені). Пастка:
  GA4 `G-CP1VPL4VKN` скопійовано, тож публікації на webflow.io сипатимуть
  тестовий трафік у продакшн-аналітику — фільтрувати за hostname або тимчасово
  прибрати ID на копії.
- Чекаємо від користувача: переавторизацію MCP на обидва сайти, немініфікований
  `script.v33`, URL GitHub-репо, наступні Figma-фрейми.
