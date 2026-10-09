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
- **Прелоадер — переробити з Lottie на код.** На лайві: Lottie-кола (3 копії
  під смуги), лічильник, кулька `anim-ball.is-preloader` стрибає, плашка
  `ball-bg.is-preloader-left` міняє ширину. Робимо те саме GSAP/CSS без Lottie,
  звіряючи з записом. Вихідники After Effects не потрібні.
- **Hero (уточнено 2026-10-09, сесія 3):** сам Hero — це лише кулька на лінії
  й два тексти, без Splide. Зміна кольору фону й великого тексту, яку пам'ятає
  користувач, — це **фінал прелоадера**: слова MOTION / DESIGN / PRINCIPLES з
  колом та інверсією чорне↔біле. У `main-css` `mix-blend-mode` немає, тож
  інверсія, ймовірно, в Lottie або в IX2 (перевірити при проході прелоадера).
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
  ≤991 будуємо з лайву, бо у Figma лише 1440.
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

## Класи (нові) — `TODO` заповнюється під час збірки

## Журнал

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
