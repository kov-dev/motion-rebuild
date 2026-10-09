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
  CDN студії (Amazon). URL репо: `TODO:repo`.
- **Lenis лишається.** Пінована версія, одна інтеграція зі ScrollTrigger
  (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`), без
  `scrollerProxy`-костилів, `prefers-reduced-motion` вимикає smooth.
- **Еталон анімацій:** агент сам записує кожну секцію лайву в Chrome
  (`gif_creator`) у `reference/recordings/<section>.gif` на етапі аудиту.
- **Figma:** макет нарізаний посекційно (дизайнер показував анімацію
  розкадровкою), цілісного фрейму сторінки немає. Користувач додає посилання
  на фрейми секцій по ходу. Аналіз — субагент на sonnet, результат у
  `docs/sections/`.
- **Карт-бланш на переписування (2026-10-09, користувач):** усе, що зібрано
  нелогічно, переписуємо без узгодження; узгоджуємо лише видимі дизайн-зміни.
  Користувач сам майже нічого не пам'ятає з оригінальної збірки (робилась
  довго, багато разів перероблялась) — джерело правди це лайв + записи.
- **Прелоадер — переробити з Lottie на код.** На лайві: Lottie-кола (3 копії
  під смуги), лічильник, кулька `anim-ball.is-preloader` стрибає, плашка
  `ball-bg.is-preloader-left` міняє ширину. Робимо те саме GSAP/CSS без Lottie,
  звіряючи з записом. Вихідники After Effects не потрібні.
- **Hero:** Splide-слайдер `splide2` зі слайдами-Lottie (Linear тощо) і свопом
  `.hero_text`; користувач пам'ятає зміну кольору фону й великого тексту та
  `mix-blend-mode`. Деталі — після запису й дерева секції; кандидат на
  переробку без Splide.
- **`data-motion` ролі** (таблиця в docs/script-map.md) — внутрішнє рішення
  агента, від користувача нічого не потрібно.
- **Одиниці:** на лайві вже rem-система (Splide `fixedWidth: "3.45rem"` =
  345px макета), тобто та сама база 1rem = 100px, що в WEBFLOW-BASE §1.
  Перевірити `html { font-size }` в ембеді `main-css` на етапі аудиту.

## Карта Home (оригінал)

| # | Секція | id | Клас-обгортка | Що всередині (коротко) |
|---|---|---|---|---|
| 0 | Preloader | — | `loader` → `loader-wrap`, `preloader_wrap` | Lottie кола (3 варіанти під смуги) + лічильник 0→100 (JS) |
| 1 | Hero | `#hero` | `nav nav-dark` → `section is-hero` | Splide слайдер `splide2`, `anim-ball-wrap`, hero text swap |
| 2 | Introduction | `#introduction` | `nav nav-dark` → `section is-introduction` | SVG-шлях `embed-path` (+`_tablet`, `_mobile`), MotionPath |
| 3 | Interactive | `#interactive` | `nav nav-light` → `section is-interactive` | `ui-slider` / `ui-track` / `ui-ball` / `ui-slide` — повністю в коді |
| 4 | Techniques | `#techniques` | `nav nav-dark` → `section is-techniques` | картки `lottie-card` з hover-Lottie (IX2) |
| 5 | Lessons ×8 | `#easing #delay #fade #morph #masking #dimension #parallax #zoom` | `section is-lessons` → `nav nav-color` ×8 | кожен урок: текст + Lottie/відео приклади; `resources-clouds-list` в кінці |
| 6 | Resources | `#resources` | `nav nav-light` → `resources` | CMS Courses/Resources, `resources-track`, overlay з IX2 scroll |
| 7 | Footer | — | `nav nav-dark` → `footer` | хмари `footer-cloud-item` з IX2 scroll-progress |
| — | Sound button | — | `fixed-bottom` → `sound-btn-wrap` | аудіо, ховається при скролі в footer (IX2) |

Обгортки `nav nav-dark|nav-light|nav-color` — маркери для JS, що перемикає
колір навбара при скролі (`querySelectorAll(".nav")` у script.v33).

## Класи (нові) — `TODO` заповнюється під час збірки

## Журнал

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
