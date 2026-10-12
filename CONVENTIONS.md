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
| Копія: Styleguide | `6ac8e84728488a6bd334f2e9` — Body: `styles-rem` → `main.sg-page` `dfbc755b-40cc-35f5-666e-5ba1f1572584` (сесія 37, дерево й ID — docs/sections/styleguide.md); head = `src/webflow/styleguide-head.html` (`noindex`) |
| Копія: CMS templates | Lessons `6ac8e84728488a6bd334f2e7`, Resources `6ac8e84728488a6bd334f2e8`, Courses `6ac8e84728488a6bd334f2e6` |
| Копія: CMS collections | Courses `6ac8e84728488a6bd334f2f8` (10), Lessons `6ac8e84728488a6bd334f2f9` (8), Resources `6ac8e84728488a6bd334f2fa` (4); cmsLocaleId `6ac8e84728488a6bd334f2fc`. Картинки CMS уже в бакеті копії (`cdn.prod.website-files.com/6ac8e84728488a6bd334f2fb/…`) |
| Копія: Variables | `core` `collection-cd80b580-4fd2-62b4-d7d1-57eddb084b67` (1 режим) · `semantic` `collection-0955f3bd-7147-ca75-39d5-f418a8d07264` (Base mode = light, `dark` `mode-ddc1ad08-4ab7-f9d4-1eeb-25e3a26ab76a`) · `type` `collection-0e5cebe5-0907-8476-c9f6-588218361070` (Base mode = desktop, `tablet` `mode-3d1cb45c-aab6-c53d-6792-2247e767d6b4` авто на ≤991, `mobile` `mode-1791d012-a630-d7f0-e6c8-068fc958c1ab` авто на ≤479). Порожня `Base collection` `collection-2b410466-…` — видалити руками |
| Копія: компоненти | `styles-rem` `a9980c61-abfe-00d6-e200-dd0d361b35be` (група System), інстанси — перші в Body Styleguide і Home (`f968ef53-6a5f-a95f-36ad-0bdbb5b6b688`) · `lesson-section` `d5e7e221-35f7-91c5-dee2-9f546f061f62` і `lesson-card` `ced33071-48b2-67a1-9aa0-8c8ef29e9556` (група Lessons, сесія 18) · `lesson-schemes` `351eeca4-68ac-7398-7bde-b899033e7b95`, `lesson-examples` `9ddff661-a2e2-e75d-4cb9-525dcb9f2dcd`, `lesson-demo` `92eadc1c-5b69-d7bc-a693-ad3bc52ee46c` (слот Extras easing), `lesson-classic` `f42e65c0-edaa-a1e0-2c1d-ec0fecccf5d4` (слот After easing і delay; варіант delay `6e0b570a-f804-b832-c7ae-16cc31f718d8`) — сесія 19 · `site-footer` `4ecddcd8-b434-4aca-e41a-0503bfda4bd9` (група System, без пропсів) — сесія 23 · `site-nav` `daeb550f-d5e5-bb1e-57c2-ce20de27307f` (група System, без пропсів), інстанс на Home `59d41228-6445-8433-dfa4-e045e757e119` — другий у Body після `styles-rem` (сесія 26) · `site-sound` `4c8b61f7-7454-e271-9379-4149c1e6a6e9` (група System, без пропсів), інстанс на Home `8e7f1721-6349-c296-60c9-725f100c4019` — третій у Body, після `site-nav` (сесія 28) |
| Копія: Home, нові секції | `section-preloader` `ff274689-184c-625c-d2e5-4eceb58da2f9` (другий у Body, після `styles-rem`) · `section-hero` `1e2ce484-6c13-e35c-cb6f-99262c1d94e1` (перший у `main` `7a61b557-…15a5`; id `hero` — сесія 30, до того `hero-next`) · `section-intro` `d320b4f4-8f76-79fa-a9ef-f7d30f54e19d` (одразу після `section-hero`) · `section-interactive` `3095ad5f-48ed-2091-d3c6-2b60b3f2e45c` (одразу після `section-intro`) · `section-techniques` `73d76e61-75fc-00a8-3343-779a29468215` (одразу після `section-interactive`) · `section-lessons` `7ed4e6ea-6542-fa7a-6e65-0defdfa4304c` (одразу після `section-techniques`, 8 інстансів `lesson-section`, проп `Section id` = `easing` … `zoom` — сесія 30, до того `<урок>-next`; елементи інстансів `48f03689-…ed2b` easing, `6a61bba9-…a08a` delay, `a4efa8dd-…0ec3` fade, `68083031-…48da` morph, `eaef8e8e-…9191` masking, `116e890a-…d647` dimension, `0a9e7420-…c523` parallax, `7ff5a0db-…6543` zoom) · `section-resources` `3bac52ac-b16e-2485-d6be-b553324fcfc3` (одразу після `section-lessons`, id `resources` — сесія 30, до того `resources-next`; Collection List courses `898bc600-2573-264c-dec9-67b335000f9b`, sources `8b16de03-df05-b6ec-1acc-29ea5180e0eb`) · інстанс `site-footer` `0b1d1fec-de0e-2091-a1a9-e96419bad760` (одразу після `section-resources`) |
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
  `scrollerProxy`-костилів, `prefers-reduced-motion` вимикає smooth. ✅ сесія 32: lenis 1.3.26 + GSAP 3.15.0,
  лише миша/трекпад (тач — нативний скрол без `normalizeScroll`), параметри лайву (`duration 2`, expo-out).
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
- **Intro, анімація (сесія 10, агент):** (1) кулька Hero рухається по шляху через `motionPath.matrix`, порахований з
  розкладки (точка спокою кульки при відпущеному sticky), а не `align` у момент завантаження; (2) усі числа — функції,
  падіння й посадка — абсолютні `fromTo`, `invalidateOnRefresh`; (3) стани текстів і передачі кульки виводяться з
  `tl.time()` в `onUpdate`, не з колбеків окремих твінів; (4) паралакс хмар Intro — код (ScrollTrigger), не IX3.
  Деталі — intro.md «Анімація в коді».
- **UI-слайдер (сесія 11, агент):** (1) один таймлайн з pin на блок (лайвові 4 таймлайни на тому самому тригері злиті),
  одиниці лайву 32 / 30; (2) тач — `(hover: none) and (pointer: coarse)`, pin ×3 лише на тачі, вузьке вікно з мишею бере
  тач-розклад (на лайві там трек розходився з панелями); (3) ≤991 трек на крок позаду замість анімації `margin-left`;
  (4) кулька при передачі між блоками фінішує точно в центрі панелі (лайв — на 7 px нижче зі стрибком); (5) відео
  прогріваються на одну панель наперед; (6) ідл — власний таймер 4 с, лише коли слайдер у в'юпорті; (7) після кожного
  `ScrollTrigger.refresh()` стани (тексти, передачі, панелі) застосовуються заново з `tl.time()` — refresh затирає
  `gsap.set`, зроблені під час нього. Деталі — intro.md «UI-слайдер у коді».
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
| `display-xl` | display | `text-215` | 1.0 | −0.04em (tab **−0.0717em**, mob **−0.0393em**) | UP | `.list-item` (Techniques), `.scrolling-text.is-lessons`. ls tab/mob — з лайву `.list-item` (сесія 15) |
| `display-lg` | display | `text-160` | 1.0625 (tab **1**, mob **1.1**) | −0.04em (tab **−0.064em**) | UP | `.h2`. lh/ls tab/mob — з лайву (сесія 13) |
| `heading-xl` | display | `text-140` | 1.03 | −0.036em | UP | `.h3`, `.h3.white` |
| `heading-lg` | **accent** | `text-115` | 1.1 | −0.02em | | `.h2-secondary` |
| `heading-md` | display | `text-74` | 1.08 | −0.04em | UP | `.h4`, `.label-1` |
| `heading-sm` | display | `text-54` | 1.07 | 0 | UP | `.h5` |
| `body-lg` | display | `text-28` | **1.5714** (tab **1.5833**, mob **1.4545**) | 0 | | `.p1`. lh = `.p1` лайву 44/28, 38/24, 32/22 (сесія 15) |
| `body-md` | body | `text-18` | 1.78 | 0 | | `.p2`, `.slide-inner-label`, `.hero_wrap` |
| `body-sm` | display | `text-16` | 1.5 (tab **1.85**, mob **1.385**) | −0.02em | | `.p3` (51), `.btn-link` (25), `.resources-item__button` (14). lh tab/mob — з `.p3` лайву (сесія 9); `btn-link` / `resources-item__button` звірити у своїх проходах |
| `body-sm` + `is-strong` | body, 700 | 16 / **16** / 14 | 1.5 (mob 1.57) | −0.02em (сесія 13, лайв −0.3px) | | `.p3-bold`: підписи карток Interactive. Розмір tab/mob лишаємо як на лайві, тому комбо перевизначає й розмір |
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
| `body` | body | шрифт `font-display`, фон `core/neutral-1000`, текст `foreground`, **без режиму** (base; сесія 39 — режим `dark` інвертував уроки й Resources). Один клас для Home і Styleguide. **Ставиться руками** (WEBFLOW-BASE §3.4; MCP не міняє клас Body) | `.body-wrap` (видалено, сесія 39), `.body` |
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

**Interactive (створено, сесія 13):** `section-interactive` (режим `base`), `interactive-head`, `interactive-pin`,
`interactive-track`, `interactive-item`, `interactive-text`, `interactive-sphere`, `interactive-lottie`, `interactive-hover`.
Ролі `data-motion`: `interactive` (тригер), `interactive-pin`, `interactive-track`, `interactive-sphere`, `interactive-lottie`
(+ `data-src`), `interactive-hover`. Дерево — docs/sections/interactive.md «Збірка в копії».

**Techniques (створено, сесія 15):** `section-techniques` (режим `dark`), `techniques-words`, `techniques-word` (режим `base`; +
`is-first` / `is-second` / `is-third`), `techniques-divider`, `techniques-star` (+ `is-first` / `is-second`), `techniques-clouds`,
`techniques-text`. Ролі `data-motion`: `techniques-word` ×3, `techniques-star` ×2, `techniques-text`. Дерево — docs/sections/techniques.md
«Збірка в копії».

**Lessons (створено, сесія 18):** `section-lessons`, `lesson-section` (компонент, 8 варіантів), `lesson-hero`, `lesson-visual-row`,
`lesson-star` (+ `is-left` / `is-right`), `lesson-visual`, `lesson-head`, `lesson-heading`, `lesson-number`, `lesson-title`, `lesson-desc`,
`lesson-cases`, `lesson-cases-head`, `lesson-cases-pin`, `lesson-cases-track`, `lesson-cases-overlay`; картка (компонент `lesson-card`):
`lesson-card`, `lesson-card-media`, `lesson-card-video`, `lesson-card-poster`, `lesson-card-body`, `lesson-card-text`, `lesson-card-btn`,
`lesson-card-icon`. Ролі `data-motion`: `lesson` (+ `data-theme="color"`), `lesson-visual` (+ `data-src`, `data-kind`), `lesson-cases`,
`lesson-cases-head` (сесія 20), `lesson-track`, `lesson-card`, `lesson-video` (+ `data-src`), `lesson-overlay`. Дерево — docs/sections/lessons.md «Збірка в копії».

**Lessons: блоки easing і classic (створено, сесія 19):** схеми — `lesson-schemes`, `lesson-schemes-stage`, `lesson-schemes-track`,
`lesson-scheme` (+ `is-active`), `lesson-scheme-lottie`, `lesson-scheme-label`, `lesson-schemes-arrows`, `lesson-schemes-arrow`,
`lesson-schemes-icon`, `lesson-schemes-divider`, `lesson-schemes-caption`; examples — `lesson-examples`, `lesson-examples-sticky`,
`lesson-examples-stars`, `lesson-examples-star` (+ `is-even`), `lesson-examples-line`, `lesson-examples-title`; демо — `lesson-demo`,
`lesson-demo-sticky`, `lesson-demo-media`, `lesson-demo-video` (+ `is-active`), `lesson-demo-progress`, `lesson-demo-steps`, `lesson-demo-step`
(+ `is-active`), `lesson-demo-ticks`, `lesson-demo-tick` (+ `is-large` / `is-edge`), `lesson-demo-tick-fill` (+ `is-on`), `lesson-demo-line`,
`lesson-demo-line-fill`; classic — `lesson-classic`, `lesson-classic-mask`, `lesson-classic-film` (+ `is-left` / `is-right`), `lesson-classic-body`,
`lesson-classic-head`, `lesson-classic-title`, `lesson-classic-list`, `lesson-classic-media`, `lesson-classic-video`, `lesson-classic-poster`,
`lesson-classic-steps`, `lesson-classic-sticky`, `lesson-classic-step`, `lesson-classic-text`, `lesson-classic-link`, `lesson-classic-icon`.
Ролі `data-motion`: `lesson-schemes`, `schemes-track`, `scheme` (+ `data-text`), `scheme-lottie` (+ `data-src`), `schemes-prev` / `schemes-next`,
`schemes-text`; `lesson-examples`, `examples-star`, `examples-line`; `lesson-demo` (+ `data-theme="dark"`), `demo-video` (+ `data-src`,
`data-src-tablet`, `data-src-mobile`), `demo-step`, `demo-tick`, `demo-line`; `lesson-classic`, відео classic — спільна роль `lesson-video`.
Стани `is-active` / `is-on` — JS-маркери. Літерали поза стилями: `lesson-scheme-label` (Plain 18/32, tiny 14/24), `lesson-examples-title`
(lh 2.2rem, ls −0.09rem / tab −0.014rem), `lesson-classic-link` (16/24, tiny 13). Дерево — docs/sections/lessons.md «Збірка в копії:
блоки easing і classic».

**Resources (створено, сесія 22):** `section-resources`, `res-clouds`, `res-cloud` (+ `is-first` … `is-fourth`), `res-pin`, `res-track`,
`res-intro`, `res-titles`, `res-row`, `res-word`, `res-shutter`, `res-arrow`, `res-student`, `res-student-text`, `res-main`, `res-layout`,
`res-stack`, `res-image` (+ `is-active`), `res-content`, `res-tabs`, `res-tab` (+ `is-active`), `res-count`, `res-lists`, `res-list`, `res-item`,
`res-link`, `res-name` (+ `is-active`), `res-dot`, `res-text`, `res-view`, `res-icon`, `res-overlay`. Префікс `res-*`, бо старі `resources*`
читає блок E `script.v33`. Ролі `data-motion`: `resources`, `res-clouds`, `res-cloud`, `res-pin`, `res-track`, `res-shutter`, `res-stack`, `res-tab`,
`res-count`, `res-lists`, `res-list` (+ `data-list`), `res-item`, `res-name`, `res-image`, `res-overlay`. Дерево — docs/sections/resources.md «Збірка в копії».

**Styleguide (створено, сесія 37):** `sg-page`, `sg-cover`, `sg-section`, `sg-head`, `sg-muted`, `sg-divider`, `sg-group`, `sg-grid`, `sg-swatch`,
`sg-chip` (+ `is-neutral-0/800/1000`, `is-lesson-<урок>` ×8, `is-classic-easing/delay`, `is-bg/foreground/border` — фон = змінна), `sg-modes`,
`sg-mode` (+ `is-dark`), `sg-spec`, `sg-spec-meta`, `sg-sample`, `sg-bands`, `sg-band` (+ `is-tablet` / `is-mobile` — режим `type` на класі), `sg-shape`
(+ `is-radius-8` / `is-radius-full`), `sg-board` (`transform` тримає `position: fixed` кореня компонента, `semantic: dark`), `sg-rules`. Лише для
сторінки Styleguide. `.body` (Body Styleguide) переведено на змінні. Дерево — docs/sections/styleguide.md «Збірка в копії».

**Navigation (створено, сесія 26):** компонент `site-nav` — `site-nav` (режим `dark`), `nb-bar`, `nb-panel`, `nb-start`, `nb-logo`, `nb-eye-bg`
(+ `is-left` / `is-right`), `nb-eyes` (+ `is-light`), `nb-pill`, `nb-pill.nb-toggle`, `nb-crumbs`, `nb-crumb` (+ `is-easing` … `is-zoom`, кольори
`extra-lesson-*`), `nb-toggle-label-wrap`, `nb-toggle-label` (+ `is-close`), `nb-toggle-icon`, `nb-toggle-line`, `nb-menu`, `nb-scroller`, `nb-track`,
`nb-cards`, `nb-card`, `nb-card-lottie`, `nb-bottom`, `nb-credit`, `nb-link`, `nb-socials`, `nb-social`, `nb-social-icon`. Префікс `nb-*`, бо старі `.nav*`,
`.toggle-*`, `.breadcrumb-*` читає `script.v33`. Ролі `data-motion`: `nb`, `nav` (на `nb-panel`, в'їзд), `nb-eyes` (+ `data-eyes`, `data-src`), `nb-crumbs`,
`nb-crumb` (+ `data-crumb`), `nb-toggle`, `nb-toggle-label`, `nb-line-top` / `nb-line-bottom`, `nb-menu`, `nb-track`, `nb-cards`, `nb-card-lottie` (+ `data-src`).
Пілюлі — літерал у `nb-pill` (Plain 16/16, ls −.005rem), окремого текстового стилю немає. Дерево — docs/sections/navigation.md «Збірка в копії».

Префікси блоків: `hero-*`, `intro-*`, `ui-*`, `interactive-*`, `techniques-*`, `lesson-*`,
`res-*` (Resources), `ft-*` (футер), `nb-*` (навбар), `preloader-*`. Внутрішні класи кожного блока додаються в
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

### 2026-10-12 (сесія 40) — хвиля 2 ассетів видалена: −64, бібліотека 176 → 112

- **Звірка перед видаленням:** бібліотека копії — 176 ассетів, усі 64 зі списку `reference/asset-cleanup-deleted-2026-10-12-wave2.json`
  на місці, `Texture_01.png` `…f383` є.
- **Знімок «до»:** знімки s39b зі scratchpad сесії 39 зникли (тимчасові каталоги очищено), тому `main-css-diff` Home зняли наново
  як **s40a** з того самого білда до видалення.
- **Видалення:** `delete_asset` × 64 двома пакетами по 32. Класифікатор дозволів цього разу пропустив. **64 / 64**, після — 112 ассетів,
  рівно «до» мінус список.
- **Staging опубліковано агентом 1 раз** (задача `e1859072…`, 12:47 UTC, CSS `…shared.e555f3ccf.min.css`).
- **Перевірка:** новий `tools/record/asset-404.mjs <ids.json>` (HTML `/`, `/styleguide`, 3 × `/lesson/*`, 404 + CSS / JS / JSON, на які вони
  посилаються) — **135 URL ассетів, битих 0, посилань на видалені ID 0.** `main-css-diff` s40a → s40b — **0 прапорців** на 4 смугах (1205 елементів).
  `styleguide-check` 4 смуги — 0. Деталі — [docs/asset-cleanup.md](docs/asset-cleanup.md).
- **Пастка:** у назвах ассетів трапляються дужки (`… (1).webp`): регекс, що зупиняється на `(`, обрізає URL (хибний 403), а регекс, що дужки
  пропускає, захоплює хвіст CSS після `url(…)`. У скрипті дозволено лише `(цифри)`, голі домени `preconnect` пропускаються.

### 2026-10-12 (сесія 39) — Body Home на `.body`, режим `dark` знято, `.body-wrap` видалено; хвиля 2 ассетів перевірена

- **Body Home:** користувач замінив `body-wrap` на `body` у Designer. Staging опубліковано, знімок `main-css-diff` Home
  проти s38 дав **1689 прапорців на смугу.** Режим `semantic: dark` на `.body` успадкувало все дерево: тексти й тики
  8 уроків стали `#fdfcfa`, Resources інвертувався (фон, шторки, таби, крапки). Rect — 0 змін.
  **Пастка:** режим змінних, поставлений на Body, діє на всю сторінку. Висновок сесії 38 «`foreground` видимо нічого
  не змінить» перевіряли лише на Styleguide, де `sg-page` сам ставить `base`.
- **Виправлення:** `remove_style_variable_mode` на `.body`, фон = `core/neutral-1000`. Повторний знімок: **10 прапорців
  на смугу, усі очікувані** (`#333` → `#0c0b0b` у Body, `main`, `section-lessons`, ембеді `styles-rem` і його
  псевдоелементах; тексту там немає). Styleguide: лише Body і порожній ембед, `styleguide-check` 4 смуги — 0.
  `lessons-run` / `resources-run --live` 1440 / 375 — 0 прапорців, 0 page errors (lessons 375: разовий прапорець за
  таймінгом, повтор — 0). Опублікований `.body` = `background-color: var(--_core---neutral-1000)` + `font-display` + `foreground`.
- **`.body-wrap` видалено** (`remove_style`). У HTML `/`, `/styleguide`, `/lesson/*`, 404 і в `src/` — 0 входжень. Стилів 324.
- **Хвиля 2 ассетів** ([docs/asset-cleanup.md](docs/asset-cleanup.md)): 65 ID звірено з HTML staging, 34 CSS / JS / Lottie,
  `src/` і CMS (14 `fileId` + `video-link-2`). Контрольні ID знайдено. **`Texture_01.png` `…f383` тепер вживається**
  (шум у `styles-rem`) і лишається. До видалення 64 (38.6 MB), бекап метаданих —
  `reference/asset-cleanup-deleted-2026-10-12-wave2.json`. `delete_asset` знову заблокував класифікатор дозволів.
- **Staging опубліковано агентом 2 рази** (задачі `d0b57bf1…`, `3b4ab9e6…`; CSS `…shared.fb8c44ffd.min.css`).
- **Перевірки запускались** з копії `tools/record/` у scratchpad (`npm i playwright@1`). Знімки s38 лежали в scratchpad
  сесії 38 (`…/4fd80fb5…/scratchpad/s38/snap/`).

### 2026-10-12 (сесія 38) — чистка стилів копії: −425 невживаних класів, один клас Body

- **Інвентар** ([docs/style-cleanup.md](docs/style-cleanup.md)): 750 стилів (487 базових + 263 комбо). Вживання рахували
  так: опублікований HTML (`/`, `/styleguide`, `/lesson/*`, 404) + дерева Designer Home, Styleguide і **всіх 10 компонентів**
  (`scope_component_id`; елемент, прихований пропсом, у HTML не потрапляє). HTML і Designer збіглися. Комбо-стани, які ставить
  JS (`.res-image.is-active`, `.res-name.is-active`, `.snd-mute.is-on`), лишились. IX3 — 0, `data-w-id` на сторінках — 0;
  у `src/` невживані класи трапляються лише в коментарях. Невживаних **425** (245 + 180), усі — імена старої збірки, з нашої
  системи жодного. Звірка з styleguide-audit §5: 23 з 24 «мертвих» є в списку, 24-й (`overflow-hidden`) був лише комбо `.body.overflow-hidden`.
- **Бекап:** усі 750 стилів з властивостями (4 смуги + псевдостани) → `reference/styles/copy-styles-2026-10-12.json`.
- **Видалення:** `remove_style`, спершу комбо від найглибших, пакетами по 50. **Пастка:** приблизно після 55 дій за раз
  Webflow відповідає `429 Too Many Requests` (решта дій пакета падає) — пакети ≤ 50 і свіжий `get_styles` між ними;
  `remove_style` бере display-ім'я (`Text Span`, `Div Block 4`, `Image`, `Link`, `2`, `overflow hidden`), а не слаг селектора.
  Після: **325 стилів**, усі вживані живі, невживаних 0.
- **Перевірка:** `main-css-diff.mjs` доповнено `PAGE=<path>` (знімати не лише Home) і властивостями `font-family` / `font-weight`;
  контрольний повтор «до» — 0 (шуму немає). Опублікований CSS: 1613 → 954 правил, 157 → 93 KB; прибрано 659 правил, і кожне —
  лише для видалених класів, нових 0, змінилось 1 (`.body`). Знімок JS off «після»: Home 1205 елементів × 4 смуги — **0 прапорців**;
  Styleguide — лише Body і ембед `styles-rem` (успадкований колір), `sg-page` перекриває сторінку повністю. З JS `--live` 1440 / 375:
  nav, resources, footer, sound — **0 прапорців, 0 page errors**; `styleguide-check` 4 смуги — 0.
- **Body:** `.body` отримав режим `semantic: dark` → фон `#0c0b0b`, текст `#fdfcfa`, шрифт `font-display` — те саме, що дає Home
  `.body-wrap` (колір `#333` від тегу там успадковують лише 3 обгортки без тексту). **Пастка:** `set_style` на Body відповідає
  «This element doesn't support styles» — клас Body міняється лише руками в Designer. Home ще на `.body-wrap` → **користувач:**
  Home → Body → `body-wrap` замінити на `body`; потім агент знімає Home «після» і видаляє `.body-wrap`.
- **Staging опубліковано агентом 1 раз** (задача `df3941d7…`, новий CSS `…shared.e8826afe9.min.css`).

### 2026-10-12 (сесія 37) — Styleguide: звірка, рішення, перебудова як довідник системи

- **Звірка** лайв ↔ копія ↔ `docs/styleguide-audit.md`: копія = лайв + дубль rem-ембеда (перебивав точні значення `styles-rem`)
  + 2 тестові блоки сесії 6. Лайв `/styleguide` — 200, **без `noindex` і в sitemap** (sitemap лайву = `/` і `/styleguide`).
  Старі класи стайлгайда на новому Home не живе жоден. Розбір — [docs/sections/styleguide.md](docs/sections/styleguide.md).
- **Рішення агента (внутрішня сторінка):** живий довідник нової системи; URL лишається (200), у head `noindex`
  (`src/webflow/styleguide-head.html`); `site-nav` / `site-sound` / `site-footer` як «одяг» сторінки **не потрібні**
  (`motion.js` тут немає, на лайві їх теж нема) — замість цього інстанси на дошках `sg-board` у розділі Components
  (`transform` на дошці тримає `position: fixed` кореня всередині). Розділів Spacing / Icons / Motion немає — у Motion немає
  таких токенів.
- **Верстка:** `main.sg-page` — Color (core: 3 neutral, 8 уроків з текстом уроку = пара фон ↔ текст, 2 classic; semantic —
  панелі light / dark поруч), Typography (12 стилів зі специфікацією + 3 колонки смуг через режим `type` на класі), Shape,
  Components, Rules. 37 класів `sg-*` (кольори / радіуси / рамки — змінні), `.body` на змінних. Прибрано: дубль ембеда,
  тестові блоки, увесь `.styleguide-wrapper` (з OG-тримачем і стрілками Splide), комбо `sg-section.is-dark`. Ассет OG
  `6ac8e84728488a6bd334f430` лишився в бібліотеці (потрібен на етапі 6).
- **Нова перевірка** `tools/record/styleguide-check.mjs`: перший прогін — переповнення 7 px на 768 (`display-xl` поруч з
  описом у рядку типографіки) → рядок `sg-spec` стовпчиком з medium, а не з small. Підсумок 1440 / 768 / 600 / 375 — **0 прапорців**.
- **Staging опубліковано агентом 2 рази** (задачі `34eaee96…`, `5b8f1ed4…`).
- **Пастки:** (1) whtml з `class="a b"`, де `b` не існує як комбо `a`, створив би нове комбо — тому підписи `sg-muted`
  — обгорткою, а не другим класом; наявні комбо (`body-sm is-strong`, `sg-chip is-*`, створені заздалегідь) перевикористовуються.
  (2) `create_style` з порожнім `properties` створює комбо — так зроблено `sg-mode.is-dark`, `sg-band.is-*` під режими.
- **Відкрите:** перемикач Page settings → «Sitemap indexing» для `/styleguide` (MCP не пише) — етап 6; Body Home (`.body-wrap`)
  і Styleguide (`.body`) звести до одного класу в проході чистки стилів.

### 2026-10-12 (сесія 36) — тач ×1.5 на iPad, шаблони CMS: редирект `/lesson/*`, deep-link на Home

- **Тач-множник піну ≥992 (рішення користувача):** ×1.5 замість ×3 — константа `UI_TOUCH_WIDE` у `src/motion.js` (≤991 лишається
  лайвове ×3). iPad 1366: 11 065 px на блок (було 22 130), 1194: 9 672. `ui-run.mjs` читає константу з коду. Прогони: локально
  ipad / ipad11 / 768 / 375 — 0 прапорців; `--live` 1440 / ipad / 375 — 0.
- **Шаблони CMS:** верстати нічого — усі три порожні (лише Body) і в оригіналі, і в копії. Лайв: `/lesson/<slug>` = 200 і порожня
  сторінка, `/resources/*` і `/course-items/*` = 404 (сторінки колекцій вимкнені). Розбір — [docs/sections/cms-templates.md](docs/sections/cms-templates.md).
  **Рішення користувача:** `/lesson/<slug>` → `/#<секція>`; Resources / Courses лишаються 404. Head шаблону Lessons =
  `src/webflow/lesson-template-head.html` (`noindex`, `canonical /`, `location.replace` з мапою 4 слагів), записано через
  `set_page_freeform_code`, прочитано назад.
- **Deep-link на Home (видима зміна, погоджено разом із редиректом):** лайв ігнорував хеш. `deepLinkTarget()` + гілка `deep` в
  `initPreloader()`: без інтро, Hero одразу в кінцевому стані, заслін тримається inline до кінця `init()` (піни + шрифти), потім
  стрибок до секції й згасання 0.4 с. **Пастка:** Lenis обрізає `scrollTo` своїм закешованим `limit` (висота до пін-спейсерів) —
  `/#resources` раз сів на 49 083 замість 64 661 → `lenis.resize()` перед стрибком.
- **Нова перевірка** `tools/record/deeplink-run.mjs`: 1440 / ipad / 768 / 375 + `--reduce` + `--live` (з трьома `/lesson/*`) — 0
  прапорців. Регресія `--live`: preloader-handover, hero-intro-check 1440, nav-run 1440 / 375 — 0.
- **Webflow:** Home head → модуль `086130a` (через проміжний `4563d92`), head шаблону Lessons. **Staging опубліковано агентом 2 рази**
  (06:47 і 06:54 UTC), дійшло (curl: `motion-rebuild@086130a`, `/lesson/zoom` віддає заглушку).
- Відкрите для запуску: `video-link-2` уроку easing вказує в бакет оригіналу.

### 2026-10-11 (сесія 35) — `ui-run.mjs` під широку схему, причина «пін +0», iPad landscape і reduced motion

- **Причина «пін +0» на 768 / 375:** старий `ui-run.mjs` блокував запити старого стеку регуляркою з `lenis`, а з сесії 32 наш модуль сам
  імпортує `lenis@1.3.26` з jsDelivr → ESM-імпорт падав мовчки (не `pageerror`), модуль не стартував узагалі, пінів не було (на 1440 так само,
  просто там порівняння й так «розходилось»). Фікстура теж застаріла (секція вже на staging).
- **`tools/record/ui-run.mjs` переписано:** staging + локальний `src/*.js` через route jsDelivr (як `ui-handover.mjs`), `--live` — опублікований
  модуль; чекає кінця прелоадера й пінів; ловить `requestfailed` CDN (щоб мовчазний збій імпорту більше не ховався). **≥992:** розклад
  береться з `UI_UNITS` / `UI_UNIT_PX` у `src/motion.js`, а геометрія — з розкадровки відео (intro.md): сталі точки «rest» (крапка 5/6),
  «open i» (слайд 1/3 × 2/3, наступна крапка 5/6; останній — 2/3, попередня крапка 1/6), «move», «wide» (центр ½, ширина 1), «centre dot» /
  «final»; довжина піну = units × 0.12·vw × (тач 3 : 1); заголовок пішов; відео відкритої панелі видиме; на передачі між блоками **рівно одна
  кулька** в кожній точці й посадка на 5/6 без стрибка (≤ 12 px); назад на старт піну — усе закрито. **≤991:** панелі проти лайву на тих
  самих одиницях (±0.031 vw, лайв похитується ±0.015). Смуги `1440 1280 ipad (1366×1024) ipad11 (1194×834) 768 375`, `--reduce`.
- **Результат (локально):** 1440, 1280, ipad, ipad11, 768, 375 — 0 прапорців; `--reduce` 1440 / ipad / 375 — 0; `--live` 1440 / ipad — 0.
  768 / 375: пін 13248 / 6469 = лайв.
- **iPad landscape (≥992 + тач):** працює широка схема, пін ×3 — 22130 px на блок при 1366 (≈ 21.6 екрана, обидва блоки ≈ 42 екрани).
  Тач-множник ×3 узято з лайву для старої схеми; для широкої це, ймовірно, задовго → **питання користувачу** (див. «Наступна сесія»).
- **Reduced motion:** схема та сама (рух прив'язаний до скролу), розкриття / згортання миттєві (`k = 0`), Lenis вимкнено — без прапорців.
- Webflow не чіпали, staging не публікували.

### 2026-10-11 (сесія 34) — UI-слайдер за відео дизайнера + одна кулька від прелоадера до слайдера

Користувач додав відео `1_FULL ANIMATION.mp4` (корінь проєкту, у git не йде — `*.mp4` у `.gitignore`; файл обрізаний, декодується
до ~36.5 с із 52) і попросив: слайдер як у відео з 20-ї с і **одна кулька** від прелоадера до слайдера (на staging кулька після пігулок
відлітала вгору за екран, а праворуч з'являлась інша крапка).

- **Причина «другої кульки»:** інтро-таймлайн мав `scrub: 1` — кулька Hero відставала ~1 с, на старті піну блок ставав, документ
  їхав далі й ніс кульку вгору (компенсації `hero-ball-sticky y −pinLength` / `hero-ball-wrap x −50vw` цього не рятували), а передача
  на `ui-landing` спрацьовувала пізніше в іншому місці. **Стало:** `scrub: true` (згладжує Lenis), компенсації прибрано; кулька приходить у
  першу крапку рівно на старті піну й там стає нею (`handover.mjs`: 0 кадрів із двома кульками, стрибок ≤ 2 px на 1440 / 1280 / 768 / 375).
- **Посадка (≥992, за відео):** з кінця шляху кулька падає на верх заголовка (`power2.in`), відскакує дугою (апекс 0.12·vh) і м'яко
  сідає (`power1.inOut`) у крапку на 5/6 ширини праворуч від заголовка. 10 од. замість колишнього `bounce` 8.
- **Слайдер ≥992 (видима зміна, за відео/Figma, не за лайвом):** панелі **2/3 vw** (було 75/25), центри — один «конвеєр» із кроком ½ vw
  (`UI_WIDE`), ряд `ui-slides` з `margin-left −25vw` (перша крапка на 5/6). Пауза 3 од. → заголовок їде на −vw, крапка 5/6 → 1/3 і
  розкривається колом з центру; далі для кожного слайда: згортання в крапку → зсув ½ vw (нова крапка заїжджає справа) → розкриття;
  останній зсув — 1/6 vw (третій слайд на 2/3, попередня крапка зліва на 1/6), потім розширення до 100vw (ряд −¼ vw, панель x −1/12),
  згортання в центральну крапку, звідти — колишня передача `ui-ball` у блок 2 (кінець на його крапці 5/6). Останній слайд сторінки лишається
  відкритим. Одиниці `UI_UNITS`, 0.12·vw px на одиницю (×3 на тачі): 1440 → пін ≈ 7.3k px (було 6840). Розкриття 0.6 с / згортання 0.5 с
  за часом (≤991 — лайвові 0.7).
- **Баг кліпу:** CSS-крапка `circle(.09rem)` без `at 50% 50%` → GSAP тягнув позицію з 0 % і коло росло з лівого верхнього кута.
  Обидва кінці тепер з позицією (`dotClip()` / `openClip()` = півдіагональ в'юпорта).
- **≤991** — схема лайву без змін (код розкладено на гілки `wide` / narrow). Пін на staging 768 = 14272 спейсер (13248, як лайв).
- **Перевірки:** запис-порівняння з відео (`rec/local-rec.mjs`, кадри вперед і назад), `handover.mjs`; `--live` після публікації:
  hero-intro-check 1440/768/375, preloader-handover, interactive-run, nav-run, sound-run, footer-run 1440 + 375 — 0 прапорців.
  `ui-run.mjs` на 1440 тепер розходиться з лайвом навмисно; на 768/375 у локальному прогоні з фікстурою показує пін `+0` (замір до старту
  модуля) — переписати під нову схему.
- **Webflow:** Home head → модуль `7fdf6af` (`set_page_freeform_code`, прочитано назад). **Staging опубліковано агентом** 1 раз, дійшло (curl: `motion-rebuild@7fdf6af`).

### 2026-10-11 (сесія 33) — правки за відгуком користувача: прелоадер, плашка Hero, тексти пігулок Intro

Користувач подивився staging і попросив доробити чотири речі перед аудитом / чисткою стилів.

- **Прелоадер: кулька сама стає диском (видима зміна, за запитом користувача).** Було (і на лайві так само): на 5.0 с лоадер зникає миттєво,
  а перший диск росте з `circle(0)` у **центрі** екрана, тоді як кулька стрибала на ≈18 px вище (центр бокса 0.4 × 0.64 rem). Виглядало як ривок
  і «інша кулька». Стало (`b898576`): після 5.0 с лічильник і тінь гаснуть (0.25 с, `HANDOVER_FADE`), кулька доходить до верхньої точки
  (`bounceToApex()`: кінець петлі, y 0 / scale 1, щонайменше 0.25 с), і в тому самому кадрі, де ховається лоадер, перший диск стартує
  `circle(r кульки at центр кульки)` → `circle(R at центр екрана)`. Колір той самий (`neutral-1000`), тож підміни не видно. Фаза 2 починається
  ≈ на 5.3–5.5 с замість 5.0, решта таймінгів без змін.
- **Слова прелоадера визирали знизу:** старт `k·vh` з лайву (0.613 на desktop) менший за половину рядка, коли кегль cover-формули росте з
  висотою: на 1710×1060 верх слова стояв на 1018 px (вʼюпорт 1060), на 1440×750 — 720. Тепер `y = max(k·vh, vh/2 + висота рядка/2 + 2)`;
  кінець симетричний, момент перетину центру не змінюється (залежить лише від ease).
- **Плашка Hero до самої лінії:** `hero-plate` `bottom` 0.53rem (tiny 0.37) → **0** на всіх смугах (Figma стан 3: плашка 1440×149 закінчується
  рівно на осі). Раніше між верхом кільця й лінією була прозора смуга 53 / 37 px, і великий h1 Hero просвічував над лінією.
- **Тексти пігулок Intro:** на staging у всіх чотирьох `text-shape` стояв шаблон Webflow «This is some text inside of a div block.» (у Designer
  збірки сесії 9 тексти не лягли; `intro-run` ходив по фікстурі, тому не бачив). `set_text` на String-дитину → «It also» / «controls» /
  «your» / «attention» (як на лайві). Анімація відкриття вже була (`setText()` в `initIntro()`), тепер працює з правильними словами.
- **Перевірки (нові):** `tools/record/preloader-handover.mjs` — кожен кадр фаз 1→2 на 1440×750, 1710×1060, 768×1024, 375×812: кулька → диск
  Δr 0, Δцентру ≤ 1 px (стара версія — диск з 0 у центрі), слова стартують повністю під краєм; `--live` після публікації — те саме (Δц 1.04 px на
  1710 — кадр вибірки, кулька ще доходить до апексу). `tools/record/hero-intro-check.mjs` — плашка (геометрія: рядки h1 / P1 над лінією поза
  плашкою — 0 на 1440 / 768 / 375) і пігулки (слова + момент відкриття за `transform`, `--live` міряє motion.zajno.com): відкриваються по черзі,
  кулька на 1440 за 83 / 262 / 0 / 114 px від пігулки, на лайві 107 / 325 / 152 / 150 — тобто не раніше за лайв.
- **Webflow:** Home head → модуль `b898576` (`set_page_freeform_code`, прочитано назад); `hero-plate` (стиль `712c6fcc-…`) прочитано назад.
  **Staging опубліковано агентом** 1 раз (`eef6f3dc…`), дійшло (curl: `motion-rebuild@b898576`, `>It also<`).
- **Пастка:** `elementFromPoint` не бачить `pointer-events: none` (плашка) → перевіряти перекриття геометрією, а не хіт-тестом. `new DOMMatrix(transform).m42`
  — надійний спосіб читати зсув повернутого елемента (bbox повернутої пігулки «your» перекривається з маскою навіть при `yPercent 100`).

### 2026-10-11 (сесія 32) — етап 4: Lenis 1.3.26, GSAP 3.15.0, якорі, `lenis-run.mjs`

- **Версії (npm, 2026-10-11):** lenis `latest` 1.3.26 (2.0 лише `dev`), gsap `latest` 3.15.0 (4-та гілка — `3.0.0-beta` під тегом `next`, не чіпаємо).
  Обидві ESM з jsDelivr (`/+esm`, 200), GSAP піднято 3.13.0 → 3.15.0 в одному місці. Лайв тягне `gh/studio-freight/lenis@latest/bundled/lenis.js`
  = **lenis 1.0.29** з `duration: 2`, easing `min(1, 1.001 − 2^(−10t))`, `wheelMultiplier 1`, `smoothTouch false` (lerp вимикається сам, бо є
  duration). У 1.3.26 `duration` + `easing` мають пріоритет над `lerp` → ті самі опції дають ту саму криву.
- **Код (`bcebd8f`):** `initLenis()` у `motion.js` — `new Lenis(LENIS)`, `on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => raf(t*1000))`,
  `lagSmoothing(0)`, без `scrollerProxy`; інстанс створюється в `init()` до `initNav()` і йде в `initPreloader({ lenis })` (stop/start навколо
  прелоадера). Меню: `lenis.stop()/start()` замість `html overflow` (без Lenis — як було). Новий `scrollToSection()` для **карток меню і посилань
  футера** (`ft-link` `#hero…#resources` до цього обробляв Webflow-скрол, той самий, що недолітав на 80 px): Lenis — `lenis.scrollTo(target)` з
  тими самими 2 с / expo-out, нативно — стрибок.
- **Рішення агента:** (1) **Lenis вмикається за вказівником, а не за шириною ≥992:** лайв ключувався на десктопний UA, тож вузьке вікно з мишею
  там теж плавне; у нас `!(hover: none) and (pointer: coarse)` — той самий розподіл без UA-сніфінгу (на тачі 1.3.26 і так не згладжує).
  (2) **`normalizeScroll` на тачі не ставимо** — стрибок мобайла вже закрито порядком створення pin'ів (сесія 4 / 13); нативний скрол
  лишає інерцію й адресний рядок iOS як є. (3) **reduce → без Lenis узагалі** (не `respectReducedMotion`), створюється один раз на старті.
- **`styles-rem`:** Lenis-CSS синхронізовано з `dist/lenis.css` 1.3.26 1:1 (`.lenis:not(.lenis-autoToggle).lenis-stopped { overflow: clip }`,
  `[data-lenis-prevent*]`, `lenis-autoToggle`; правило `scroll-behavior` прибрано — 1.3 скролить з `behavior: 'instant'`). Ембед компонента
  `a9980c61-…` → `set_settings` `code` → прочитано назад, збіг. Head Home → модуль `bcebd8f` (`set_page_freeform_code`, прочитано назад);
  у гейті коментар «our Lenis» без «stage 4».
- **Staging опубліковано агентом** 1 раз (`17481d8e…`, 18:18 UTC), дійшло за ≤ 5 с (curl: sha `bcebd8f5` + `lenis-autoToggle`).
- **Новий `tools/record/lenis-run.mjs`:** `wheel` — однаковий ввід колеса на motion.zajno.com і staging, scrollY кожен кадр від події:
  **крок 100: 100 / 100 px, t50/t90/t99 184↔182 · 636↔634 · 1184↔1183 мс; крок 300: 187↔182 · 652↔651 · 1252↔1250; 5×100 через 60 мс:
  500 / 500, 385↔384 · 834↔834 · 1466↔1466** — швидкість колеса 1:1 з лайвом. `state` — `html.lenis` / `lenis-stopped` під прелоадером і меню,
  колесо в меню не рухає сторінку, після закриття +300 px; на 375 і з reduce — без `html.lenis`, меню тримає `overflow: hidden`; посилання
  футера `#delay` → ціль top 0. `nav-run.mjs`: лок меню = `overflow hidden` **або** `html.lenis-stopped`.
- **Перевірка `--live`** 1440 + 375 після publish: `coexist` (прелоадер тримає скрол, scrollY 0, без помилок), `nav` (links: 5 карток ±0.5 px під
  Lenis), `sound`, `footer`, `lessons`, `interactive` (shift Δ0), `techniques`, `resources`, `lenis` (+ 1440 reduce) — **0 прапорців, 0 page errors**,
  крім одного кадру `nav-375 close (toggle)` (t 0.195), двічі перепрогнано — 0 (на 375 Lenis немає, це джиттер кадру).
- **Пастка / джиттер тесту:** `lessons-run --part=splide` 1440 інколи дає ⚠ на першому семплі (наші 0.31–0.37 проти лайвових 0.294, поріг
  0.05): та сама картина з GSAP 3.13 і без `lagSmoothing(0)` — фаза кадру в момент кліку (GSAP-твін стартує в тому ж кадрі, Splide лайву —
  на кадр пізніше), не Lenis. `interactive-run` під Lenis недоїжджає до цілі на десятки px (допуск 30, інерція 2 с) — рядки інформаційні.
- **Resources Sort (courses):** `resources-order.mjs` — courses ✗ (зворотний), sources ✓. Досі чекає користувача.
- **Документи:** [docs/legacy-removal.md](docs/legacy-removal.md) (крок 5 ✅), [docs/script-map.md](docs/script-map.md) (блок A, баг 1),
  [docs/main-css.md](docs/main-css.md) (Lenis-рядок), PLAN.

### 2026-10-11 (сесія 31) — видалення старого, крок 4: код без перехідних костилів, ембед `main-css` видалено

- **Код (крок 4):** `src/legacy-guard.js` видалено; у `motion.js` прибрано його `import` і відновлення `window.gsap`, `syncLegacy()` + виклик
  в `init()`, `guardVideo()` / `wantedVideos` (у `playVideo` / `pauseVideo` / `lazyVideo` / `initLessonVisuals` / `initLessonDemo`); шапка
  модуля без «runs next to the old script». Коментарі «old script's Lenis, mobile normalizeScroll» → «our Lenis, stage 4» у `preloader-gate.js`
  (гейт лишається) і в `initNav()`; у `preloader.css` прибрано застаріле «Not connected to Webflow yet». Тести (`tools/record/*-run.mjs`,
  11 файлів) більше не підміняють `legacy-guard.js`. Коміт **`87ef446`** → jsDelivr 200 → head Home (`set_page_freeform_code`, увесь
  `src/webflow/home-head.html`, прочитано назад — збіг).
- **Staging опубліковано агентом** 2 рази: `4d482ca7…` (модуль `87ef446`), `9836afb4…` (без `main-css`, 17:14 UTC). Обидва дійшли
  за ≤ 20 с (curl по sha / за відсутністю `main-css w-embed`).
- **Перевірка коду `--live`** 1440 + 375: `coexist` (без помилок, `window.gsap undefined`), `nav` / `sound` / `footer` / `lessons` — **0 прапорців**;
  `lessons` media: відео на екрані грають, поза екраном 0 грають — `guardVideo()` справді більше не потрібен. `lessons-run.mjs` у сесії 30
  лишився з `#<урок>-next` (впав на `null.top`) → селектори на справжні id.
- **main-css:** `*-compare.mjs` для звірки вже не годяться (interactive / techniques / lessons / footer / nav порівнювали з **старою секцією
  на тій самій сторінці**, hero / intro — лайв проти локальної фікстури). Новий **`tools/record/main-css-diff.mjs`**: `inventory` — кожен
  селектор ембеду проти DOM staging з JS після прокрутки → збіги лише в `html` (rem, 3 смуги), `::-webkit-scrollbar`, `*`; жодне класове
  правило нічого не тримає. `snapshot before` (4 смуги, JS off, 1205 елементів: rect + 31 властивість + `::before/::after`, `html`, `body`)
  → `remove_element` `27a12260-…bf68` (дерево Body прочитано: `styles-rem` → `site-nav` → `site-sound` → `section-preloader` → `main`) →
  publish → `snapshot after` → `diff`. **768 / 600: лише `html overflow` auto → visible** (`overflow-y: overlay` ембеду; вʼюпорт скролиться
  так само). **1440 / 375: точність rem** — ембед стояв після `styles-rem` і перебивав його усіченими `6.94444vw` / `26.66666vw` (1rem =
  99.9999 px), тепер працює точний `calc(10000vw / 1440)` = 100 px: кожен елемент ≤ 0.05 px, накопичено до низу сторінки 1.4 px (1440) /
  1.8 px (375), висота документа +1 px. Рішення: прийнято (наш rem рівно макетний; на око й у тестах різниці немає).
- **Після видалення `--live`** 1440 + 375: `coexist`, `nav`, `sound`, `footer`, `lessons`, `interactive` (shift Δ0 з лайвом, сфера, Lottie),
  `techniques`, `resources` — **16 прогонів, 0 прапорців, 0 page errors**.
- **Побічно:** з `main-css` пішов жорсткий URL `Texture_01.png` на бакет оригіналу (шум у `styles-rem` уже з бакета копії) — лишилось 2 постери.
- **Resources Sort (courses):** `resources-order.mjs` — courses ✗ (зворотний), sources ✓. Досі чекає користувача.
- **Документи:** [docs/legacy-removal.md](docs/legacy-removal.md) (крок 4 ✅), [docs/main-css.md](docs/main-css.md) (позначка «видалено»), PLAN.

### 2026-10-11 (сесія 30) — видалення старого, кроки 2–3: старі блоки видалено, справжні id

- **Крок 2 виконано:** 10 `remove_element` по одному з читанням дерева після кожного — `.loader` `f79bcaeb-…4c43`, `.navigation` `72062d36-…7a3b`,
  7 обгорток у `main` (Hero `7a61b557-…15a6`, Intro `…15b7`, Interactive `…1613`, Techniques `…1639`, `#lessons` `…164c`, `#resources` `…18e1`,
  футер `f5e85485-…e47c`), `.fixed-bottom` `a3fe06d1-…4a01`. Body тепер: `styles-rem` → `site-nav` → `site-sound` → `section-preloader` →
  `main-css` → `main` (7 нових секцій). Head Home без `legacy-hide.css` (`set_page_freeform_code`, прочитано назад), `src/legacy-hide.css`
  видалено, `src/webflow/home-head.html` синхронізовано. CMS не чіпалось.
- **Перевірка кроку 2 `--live`** (копія `tools/record/` у scratchpad, Chrome): `coexist-run` 1440 / 375 — `old pins:` порожньо, `marks.oldHero null`,
  `no page errors`; `nav-run` 1440 / 375 (theme, menu, links) — 0; `sound-run` 1440 / 375 — 0; `footer-run` 375 — 0, 1440 — спершу 3 прапорці
  «asked 0.6 / 0.8 / 1, reached 0.556» при Δ 0 до моделі: наш футер тепер край документа (як на motion.zajno.com, max p ≈ 0.556 на 1440) —
  `footer-run.mjs` навчено обрізати точки за краєм сторінки (та сама логіка, що була для старого футера) → 0 прапорців.
- **Крок 3 виконано:** `set_dom_id` `section-hero` → `hero`, `section-resources` → `resources`; проп `Section id` на 8 інстансах `lesson-section`
  → `easing` … `zoom` (`set_component_instance_prop_values`, `values: [{ prop_id, type: "string", string_value }]`); 10 карток `nb-card`
  у компоненті `site-nav` → `#hero`, `#easing` … `#zoom`, `#resources` (`set_settings` `link` `static_link` зі `scope_component_id`; читати
  налаштування всередині компонента теж лише зі `scope_component_id`, інакше «Element not found»). Усе прочитано назад. `motion.js`:
  `initTheme()` крихта = `z.el.id` без `replace(/-next$/)`. Коміт **`3637a98`** → jsDelivr 200 одразу → модуль у head Home на новий sha
  (прочитано назад). `nav-run.mjs` / `sound-run.mjs`: ключ зони = id без `-next` (працює до й після кроку 3).
- **Staging опубліковано агентом** 2 рази (задачі `75edb820…` — крок 2, 16:28 UTC; `548cd975…` — крок 3). Обидві дійшли за ≤ 60 с
  (`cf-cache-status: MISS` із `?v=<ts>`). На сторінці 11 id (`hero`, 8 уроків, `resources`, `nb-menu`), 20 href-якорів без `-next`.
- **Перевірка кроку 3:** `nav-run --live` PART=links 1440 / 375 — **0 прапорців** (5 кліків по картках → ціль top ±0.5 px, крихти `easing` /
  `delay` / `dimension` зі справжніх id, схема секції); PART=theme 1440 — 0 (регресія крихти після прибирання `replace`), 0 page errors.
- **Resources Sort (courses) — досі не поставлено** (`get_settings` → `sort: []`, staging 196 / 197 ORDER list1 на старті сесії; MCP записати
  `created-on` не вміє — сесія 25). **Рішення агента:** крок 2 зроблено без Sort, бо еталон порядку — лайв: новий `tools/record/resources-order.mjs`
  порівнює обидва списки staging ↔ motion.zajno.com (скрипти заблоковано, природний DOM-порядок); зараз courses ✗ (зворотний), sources ✓.
  `resources-compare.mjs` ORDER-перевірка більше не працює (старого `#resources` на сторінці немає), решта його порівнянь — теж, бо
  вони проти старої секції на тій самій сторінці; статика Resources уже звірена (сесія 22). **Від користувача:** Designer → Collection List
  `res-list` (courses) → Sort → Created On, Oldest first → publish → `node resources-order.mjs` → 0 прапорців.
- **Документи:** [docs/legacy-removal.md](docs/legacy-removal.md) (кроки 2–3 ✅, історичні ID), таблиця ID вище (id секцій, елементи 8 інстансів),
  navigation.md / sound.md (згадки `legacy-hide.css` → історія).
- **Пастки:** (1) `data_sites_tool` не має статусу задачі публікації — перевіряти staging curl-ом по маркеру (sha модуля, id); (2) `query_elements`
  зі `style` шукає підрядком (`nav` ловить `f-navigation`) — для «що лишилось» зручніше запит за `element_id` кожного блоку; (3) у `data_element_tool`
  `scope_component_id` — усередині запиту (`queries[].scope_component_id`), не на дії; (4) `get_all_elements depth 1` не показує дітей `main` —
  для обгорток треба depth 2 або запит за ID.

### 2026-10-11 (сесія 29) — план видалення старого, крок 1: footer code Home порожній

- **План** — [docs/legacy-removal.md](docs/legacy-removal.md): інвентар footer code (13 позицій, кому потрібен, чим замінено), Designer ID
  10 старих блоків копії (`main-css` `27a12260-…bf68`, `.navigation` `72062d36-…7a3b`, `.loader` `f79bcaeb-…4c43`, 7 обгорток у `main`
  `7a61b557-…15a6` / `…15b7` / `…1613` / `…1639` / `…164c` / `…18e1` і `f5e85485-…e47c`, `.fixed-bottom` `a3fe06d1-…4a01`), що й коли
  прибирати в `src/` (`legacy-guard.js`, `syncLegacy()`, `guardVideo()`, `legacy-hide.css`, `-next`), порядок 4 кроків + Lenis окремо.
- **Крок 1 виконано:** footer code Home → один HTML-коментар (`set_page_freeform_code`, прочитано назад). Знято: GSAP 3.10/3.11 (5 файлів),
  Lenis `@latest`, Splide, `ifvisible`, Matter 0.18, `script.v33`, Finsweet autovideo, 6 inline-скриптів, 13 `<audio>`. Повна копія —
  `reference/home-footer-legacy-2026-10-11.html`. Head Home без змін (гейт, preloader.css, legacy-hide.css, модуль `a82e952`).
  `src/webflow/home-footer.html` = той самий коментар (раніше там був лише рядок модуля — сніпет для `coexist-run --cdn`, не дзеркало Webflow).
- **Staging опубліковано агентом** 1 раз (задача `c5dbe6e8…`, 10:39 UTC). Пастка: Cloudflare віддавав HIT ~5 хв; grep по `script.v33`
  ловив і коментарі — перевіряти по `script.v33.min.js` / `<audio`.
- **Перевірка `--live`:** `coexist-run --live` 1440 / 375 — preloader тримає скрол, `globals: window.gsap undefined`, `old pins:` порожньо, нові секції (hero / intro / ui) анімуються під колесом і тачем, `no page errors`; `nav-run --live` 1440 / 375 (theme, menu, links) — **0 прапорців**; `sound-run --live` 1440 / 375 (enter, theme, footer, toggle) — **0 прапорців, 0 page errors**, `legacy <audio> elements on the page: 0`. Скрипти запускались із копії `tools/record/` у scratchpad (`npm i playwright@1`, Chrome).
- **Наслідки кроку 1 (очікувані):** `window.gsap` / `window.ScrollTrigger` = `undefined` (наш модуль ESM); старі секції під нашим футером
  статичні; **на десктопі скрол нативний** — наш Lenis ще не підключений (етап 4, іде після кроку 4). Старі `.loader` / `.navigation` /
  `.fixed-bottom` ще в DOM (крок 2).
- **Resources Sort (courses):** `resources-compare` на staging — 196 / 197 на 1440 і 768, `ORDER list1` (курси досі у зворотному порядку) →
  Sort у Designer ще не поставлено. MCP sort не бачить (`query_settings` value_type `sort` → 0). **Чекає дії користувача; зробити до
  кроку 2** — після видалення старого `#resources` порівнювати порядок буде ні з чим (compare бере старий список на тій самій сторінці).

### 2026-10-11 (сесія 28) — Sound: лайв-зонд, компонент `site-sound`, `initSound()`, тема на двох лініях, підключення

- **Лайв-зонд** `tools/record/sound-probe.mjs` (новий: struct / enter / scan / footer / click, 1440 / 768 / 375) → `docs/sections/sound.md`.
  Знахідки: кнопка 48×44 на всіх смугах (Figma 768/375 — 40×34, ігноруємо), відступ 34 / 34 / 22; в'їзд scale 0 → 1 за 0.6 с разом із
  навбаром; ховання над футером (IX2 `a-130` / `a-131`, тригер — верх футера = низ в'юпорта): opacity 0.2 с + scale 0.4 с **лінійно**,
  display none після; тема по лінії `bottom−90px` — та сама послідовність, що в навбара (кнопка перемикається раніше); стартовий стан —
  **вимкнено** (`.sound-btn-mute.is-active`), фон кнопки при вмиканні не міняється (правило `.sound-icon-wrap.is-active` мертве); звук —
  13 `<audio>` з inline-скриптів: фон loop (pause без перемотки), клік `perc_click` на лого / motion.ed / тогл, hover карток
  `hover_1 2 3 8 5 6 7 4 9 10`, `1_NOT_REAL_TIME` на Not real-time; gtag `sound_on` / `sound_off` через dataLayer.
- **Верстка:** компонент **`site-sound`** `4c8b61f7-7454-e271-9379-4149c1e6a6e9` (System), інстанс третім у Body після `site-nav`:
  `div.site-sound[data-motion=snd]` (fixed right/bottom .34rem, ≤479 right .22rem, z 11, режим `semantic: dark`) → `button.snd-btn`
  (`data-motion=sound-btn`, `aria-pressed`) → HtmlEmbed `snd-icon` + `snd-mute[data-motion=sound-state]` з комбо `is-on` (opacity 0,
  transition .4 с). Класи зі змінними `semantic` / `border-1`, як у `nb-pill`. Старий `.fixed-bottom` — правило в `legacy-hide.css`.
  У `site-nav` додано ролі `nb-logo` / `nb-home` (клік-звуки).
- **Код** (`src/motion.js`): `initSound()` — тогл (`is-on`, `aria-pressed`, фон play / pause, gtag лише через глобальний `gtag()`),
  `playSound(name)` (ліниві `Audio`, клік з перемоткою, hover без), ховання над футером (`ScrollTrigger` `top bottom` / `bottom top`,
  `onToggle`); hover-звуки в `initNav()` (картки за лайвовим порядком) і `initInteractiveLottie()`; `soundOn()` читає `is-on` на
  `[data-motion=sound-state]` (сфера без змін). **Тема винесена в спільне:** `paintScheme(root, scheme)`; `initTheme()` будує тригери на
  **двох лініях** (`nav` top+1 з футером від прогресу 0.25; `sound` bottom−90) з однією вибіркою «найглибша активна зона».
  `heroHidden()` тепер ставить і `nav` yPercent −200 / `sound-btn` scale 0 під оверлеєм (лайв — стартові стани IX2).
- **Перевірка:** `tools/record/sound-run.mjs` (новий: enter / theme / footer / toggle) — 1440 / 768 / 600 / 375, `--reduce` 1440 / 375,
  `--live` 1440 / 375: **0 прапорців** (в'їзд разом із навбаром, 20 точок теми + твін ≈ 0.4 с, ховання / показ покадрово проти моделі
  `a-130` / `a-131` і межа ±20 px, тогл + gtag + 4 звуки + тиша при вимкненому). `nav-run --live` PART=theme 1440 — 0 (регресія теми).
- **Hостинг і Webflow:** коміт `a82e952` → jsDelivr (200 одразу); head Home: правило `.fixed-bottom` + модуль `a82e952`
  (`set_page_freeform_code`, прочитано назад), `src/webflow/home-head.html` / `home-footer.html` синхронізовано.
- **Staging опубліковано агентом** 2 рази (задачі `349f7267…` — розмітка, `d6a78ba4…` — модуль).
- **Рішення агента:** (1) аудіо не в DOM і не вантажаться до першого ввімкнення (лайв тягне metadata 13 файлів на старті); (2) стан звуку —
  комбо `is-on` на лінії-ембеді, читається всім модулем; (3) `aria-label` сталий, стан в `aria-pressed`; (4) hover-звук на будь-який
  `pointerenter`; (5) кнопка 48×44 на всіх смугах за лайвом.
- **Пастки:** (1) `element_builder` не вставляє «after» інстансу компонента (`Cannot insert elements directly into a component instance`) —
  вставляти «before» наступного елемента; (2) `settings.attributes` в `element_builder` не працює навіть для DOM — атрибути через
  `set_attributes`; (3) зонд лайву: `scrollToY` колесом із порогом 8 px під Lenis може не сходитись годинами — спершу нативний `scrollTo`,
  потім ≤ 20 підштовхувань; (4) у тестах мобільні смуги семплять ~30 fps — вікно моделі `[t−50, t+70]` мс; `display: none` читається як
  `transform: none` (scale 1); (5) footer code копії перевизначає `gtag()` на `dataLayer` — у тесті перехоплювати обидва.
- **Resources Sort:** courses — досі `sort: []` (не перевірялось цього разу). **Чекає дії користувача.**

### 2026-10-10 (сесія 27) — Navigation: `initNav()`, `initTheme()`, `nav-run.mjs`, підключення

- **Код** (`src/motion.js`): `initTheme()` — кожен `[data-theme]` → `ScrollTrigger` `top top+=1` / `bottom top+=1`, `refreshPriority -1`, активна =
  найглибша (серед рівних — пізніша в DOM); `paintNav()` твінить `--_semantic---bg/foreground/border` на `header.site-nav` (0.4 с `power1.out`),
  кросфейд очей `data-eyes`, крихта уроку (id без `-next`); футер темніє з прогресу 0.25 (оверлей 50 %, спільна `footerSpan()` з `initFooter()`).
  `initNav()` (до прелоадера) — лого 2 Lottie-луп (схована на паузі), меню за ключами лайву a-58 / a-88, `aria-expanded`, `html` overflow, Esc +
  фокус, колесо → `nb-track`, клік по картці → закрити + `scrollTo` цілі, hover-кадри ≥992 `pointer: fine`, reduced motion (картки не їдуть,
  тема без твіну). Деталі — navigation.md «Анімація в коді».
- **Лайв-семпли меню** (`nav-probe.mjs` PART=menu, 1440 / 375): усі ключі **лінійні**, крім карток `power1.inOut`; display none на закритті —
  0.2 с; hover 0 → 40 кадрів за 0.67 с; колесо 300 → 300. Підгонка в `nav-run.mjs` (`LIVE=`): open/close у межах одного тіку IX2.
- **Перевірка:** `tools/record/nav-run.mjs` (новий) — 1440 / 768 / 600 / 375, `--reduce` 1440 / 375, `--live` 1440 / 375: **0 прапорців**
  (21 точка теми + тривалість твіну, кожен кадр меню проти моделі, очі, ліниві картки 0 → 10, hover, колесо, Esc, 5 кліків по картках → top ±0.5 px).
  `footer-run --live` 1440 — 0.
- **Знайдено й виправлено в прогонах:** (1) `onToggle` спрацьовує ще всередині `ScrollTrigger.create` → `z.st?.isActive`; (2) **вбудований скрол
  Webflow до якорів** (делегований на `document`) віднімав висоту fixed-шапки → ціль на 80 px нижче top — `stopPropagation` на кліку картки;
  (3) 10 Lottie карток будували SVG разом у середині виїзду (ривок першого відкриття на 1440) → JSON вантажаться разом, SVG — по одному на кадр.
- **Webflow:** `section-hero` → id `hero-next`; перша картка `site-nav` → `#hero-next` (`#hero` на staging — старий Hero під нашим футером);
  обидва прочитано назад. Head Home: модуль → `81103de` (`set_page_freeform_code`, прочитано назад), `src/webflow/home-head.html` /
  `home-footer.html` — той самий sha.
- **Staging опубліковано агентом** 2 рази (задачі `173f63f5…`, `6ca2802e…`).
- **Рішення агента:** (1) Lottie карток вантажаться на перший намір (`pointerenter` / `focus` тогла) або перше відкриття, не eager;
  (2) колесо й тач перехоплюються на всьому `site-nav` при відкритому меню (на лайві колесо над шапкою крутило сторінку); (3) URL-хеш при кліку
  по картці не ставимо (перезавантаження з хешем стрибало б повз прелоадер).
- **Resources Sort:** courses — досі `sort: []` (MCP). **Чекає дії користувача.**

### 2026-10-10 (сесія 26) — Navigation: компонент `site-nav`, звірка

- **Resources Sort:** `get_settings` на courses — досі `sort: []`; staging заради цього не публікувався, `resources-compare` не проганявся.
  **Чекає дії користувача** (Designer → `res-list` courses → Sort → Created On, Oldest first).
- **Figma** (субагент sonnet): вузол користувача `4616:22254` — уся секція `menu` (5 кадрів 1440, 768, 375, кадр-перехід); намальовано 5 з 10
  карток, ховер-стани з кольоровою заливкою (на лайві це Lottie), «Made by» + spotify. Заміри лайву нічим не спростовані → дописано в
  navigation-figma.md, FIGMA.md; SVG — `reference/figma-nav/`. Кадр-перехід `1815:34902` аналога на лайві не має — не будуємо.
- **Верстка:** класи створено `data_style_tool` (лонгхенди бордерів і радіусів, змінні через `variable_as_value`, смуги `medium` / `tiny`), розмітку —
  `whtml_builder` без CSS, тогл — `element_builder` (DOM `button`), іконки — HtmlEmbed. Компонент `site-nav` (System) другим у Body. Дерево й
  відхилення від плану — navigation.md «Збірка в копії». `data-theme`: `section-resources` = light, `site-footer` = dark.
- **Head Home:** новий `<style>` з `src/legacy-hide.css` (`.navigation { display: none !important }`) після preloader.css; `set_page_freeform_code`,
  прочитано назад; `src/webflow/home-head.html` синхронізовано з Webflow (тепер разом із рядком модуля, sha `99028b6` без змін).
- **Звірка:** `tools/record/nav-compare.mjs` (новий) — 1440 / 768 / 600 / 375: **53 / 53, Δ ≤ 0.1 px, 0 прапорців**. Перший прогін: `nb-bottom` поза
  скролером (на 375 −272 px) і висота карток (Δ1.6 на 600) → виправлено.
- **Staging опубліковано агентом** 2 рази (задачі `30067ebc…`, `991fdd88…`).
- **Рішення агента:** (1) роль `nav` на внутрішній `nb-panel` (в'їзд −200 % від висоти панелі, як `.nav-panels`); (2) `data-eyes` замість
  `data-theme` на лого; (3) картка = `aspect-ratio 282/543` + `padding-bottom 7px` (лайв: inline SVG Lottie + зазор рядка); (4) пілюлі — літерал,
  без текстового стилю; (5) `nb-crumb` — окремий клас, не комбо на `nb-pill`.
- **Пастки MCP:** (1) `whtml_builder` перетворює `<button>` на **Link** (`<a type="button">`) — кнопку робити `element_builder` типу DOM з
  `dom_tag: button` (діти — DOM `span` з `set_text`); (2) `<a href="#…">` у `whtml_builder` стає Link **без** налаштування `link`, лише з атрибутом
  `href` — ставити `link` (`static_link` url `#…`) і чистити атрибут, як для зовнішніх; (3) `aspect-ratio` через `update_style` зберігається
  (`282 / 543`).
- **Стан staging:** новий навбар без коду — очей лого й Lottie карток немає, меню не відкривається, тема не перемикається (старий схований).
  Закривається `initNav()` / `initTheme()`.

### 2026-10-10 (сесія 25) — Resources Sort, прохід Navigation: Figma, лайв-зонд, план

- **Resources Sort:** MCP (`get_settings`) — `sort: []` **на обох** списках: користувач прибрав Sort і з Sources, і з courses. Staging
  опубліковано агентом (задача `29f85b8e…`), `resources-compare` — **196 / 197 × 4**, тепер ORDER **list1** (курси знову в порядку
  «нові спершу»), Sources ✅. Спроба повернути Sort на courses через MCP (`static_json` у форматі, що його читав `get_settings` у
  сесії 23: `[{fieldSlug: created-on, direction: ascending}]`) → «Unknown field 'created-on'» — **потрібна дія користувача:** Designer →
  Collection List `res-list` (courses) → Sort → Created On, Oldest first; Sources не чіпати.
- **Figma** (субагент sonnet) → `docs/sections/navigation-figma.md`: символ `Header` 1372×44 (mainComponent MCP не віддає; інстанси
  `788:28217`, `784:27394`, `1553:20702`, `1221:34843`), крихта — окремий шар `1553:20705`, меню намальоване частково (3 / 5 / 3 картки з
  10), Sound `675:12444`. Окремого посилання від користувача немає — узято кадри меню з таблиці Full design.
- **Лайв-зонд** `tools/record/nav-probe.mjs` (новий: struct / menu / scan / edge) + IX2 `a-58` / `a-88` / `a-60` / `a-61` з JSON →
  `docs/sections/navigation.md`. Знахідки: пілюлі — **Plain** 16/16 на всіх смугах (не Inktrap, `text-label` не підходить); уся картка
  меню — Lottie 280×546 (≤479 206×404), 40 кадрів, hover 0.67 с; меню: opacity 0.2 с, картки x 4rem → 0 0.6 с `power1.inOut`, лейбл
  −104 % 0.3 с, лінії ±45° 0.2 с; `logo-eye-menu` ніколи не показується; тема: dark (hero, intro, techniques, демо easing, футер) /
  light (interactive, resources) / color (уроки + крихта). **Баги лайву:** навбар темніє посеред світлого pin-а Resources (1440 ~39–44 %,
  768 ~96 %, 375 після pin-а) через ручний `resourcesPinLen`; на 375 клік по картці меню приземляється не туди.
- **План:** компонент `site-nav` (System, префікс `nb-*`, `<header>` + `<button>` тогл з `aria-expanded`, 8 крихт, 10 карток-посилань з
  `aria-label`), тема — твін двох змінних `semantic` на корені; код `initTheme()` (найглибший активний `[data-theme]`) + `initNav()`
  (меню, Lottie ліниво при першому відкритті, колесо, Esc, скрол до цілі). Старий `.navigation` на час переходу — `display:none` у head.
- **Рішення агента:** (1) тема футера стартує, коли `res-overlay` ≥ 50 %, на всіх смугах (виправлення бага, не 1:1 з лайвом);
  (2) `logo-eye-menu` не переносимо; (3) Lottie карток ліниво, не eager.
- Webflow не змінювався (лише публікація staging).

### 2026-10-10 (сесія 24) — Footer: `initFooter()`, `footer-run.mjs`, підключення

- **Код:** `initFooter()` (після `initResources()`): тригер `site-footer`, start `top (vh + 0.15·h)px`, end `top top`, scrub 1; `res-overlay`
  opacity 0 → 1 на 0–0.5, `ft-cloud` second / third / fourth y 0 → 1.2 / 1 / 2 rem на 0–0.72 (усі смуги); reduced-motion — оверлей без
  згладжування, хмари стоять. Деталі — footer.md «Анімація в коді».
- **Перевірка:** `tools/record/footer-run.mjs` (новий) — новий футер проти формули й проти **старого футера з живим IX2 `a-126` на тій самій
  сторінці** (лайв-еталон, обрізаний кінцем сторінки як на лайві). 1440 / 768 / 600 / 375 — локально й `--live`: **0 прапорців**, Δ opacity
  ≤ 0.001, Δ хмар ≤ 0.1 px; `--reduce` 1440 / 375 — 0; resize 1440 → 1280 — 0. `coexist-run --live` 1440 / 375 — старі pin-и Δ0.
- **Хостинг і Webflow:** коміт `99028b6` → jsDelivr (200); Home head оновлено через MCP (`set_page_freeform_code`, прочитано назад),
  `src/webflow/home-footer.html` — той самий sha.
- **Staging опубліковано агентом** 1 раз (задача `7b097d32…`) — для `--live`.
- **Рішення агента:** `refreshPriority: -1` на тригері футера — pin Resources перебудовується при зміні ширини вже після створення тригера
  футера (без цього футер міряв би старий spacer).
- **Пастка тестів:** старі ліниві pin-и (`script.v33`) міняють висоту сторінки під час довгого стрибка — прицілюватися ітеративно (до 5 разів,
  доки ціль не стоїть), а після стрибка > 3·vh чекати довше: згладжування IX2 стартує здалеку. Тест має перевіряти, що досягнутий p = заданому,
  інакше промах «у спокій» проходить тривіально.
- **Resources Sources:** `resources-compare` досі 196 / 197 × 4 (ORDER list2) — Sort на Sources ще не прибрано, **чекає дії користувача**.

### 2026-10-10 (сесія 23) — Footer: аналіз Figma, лайв-заміри, план, верстка `site-footer`, звірка

- **Сортування курсів:** користувач поставив у Designer «Created On, Oldest first» — **на обидва** списки. Після публікації курси зійшлися з
  лайвом, але **Sources тепер у зворотному порядку** (на лайві Sources без сортування = нові спершу). Прибрати сортування Sources через MCP
  (`sort: []`) не дав класифікатор дозволів. **Потрібна дія користувача:** Designer → Collection List `res-list` (sources) → Sort → прибрати.
  `resources-compare` зараз — 196 / 197 × 4 смуги (ORDER list2). Сортування **читається** через `get_settings` (`sort: [{fieldSlug: created-on,
  direction: ascending}]`), хоча записати `created-on` у сесії 22 не вдалося.
- **Figma** (субагент sonnet) → docs/sections/footer.md: справжній футер — символ `795:39109` (`795:38432` застарілий, без текстів), tablet
  `891:27933`, 375 немає; чорні хмари кінця Resources = `footer-cloud-item`.
- **Лайв-зонд** `tools/record/footer-probe.mjs` (новий: struct / scan / hover, 1440 / 768 / 375) + CSS лайву через curl, SVG іконок →
  `reference/footer-svgs.json`. Знахідки: футер 469 / 758 / 981, хмари висять над ним (`is-first` = власна шапка 659); IX2 `a-126`: оверлей
  0 → 50 %, хмари **вниз** на 1.2 / 1 / 2 rem на 0 → 72 % (усі смуги); **формула прогресу** `p = (vh + 0.15·h − top) / (vh + 0.15·h)` (офсет −15 % —
  від висоти елемента), Δ ≤ 0.1 px на 3 смугах; кінець сторінки обрізає прогрес (1440 max 0.556). Sound ховається над футером. Hover — лише
  підкреслення. Лайв ≠ Figma: Dimension (не Scale), Clutch (не Spotify), © 2024, «Made by Zajno», заголовок «Motion design principles» на всіх смугах.
- **Верстка:** компонент `site-footer` (System) після `section-resources`: 19 класів `ft-*` + 8 комбо, режим `semantic: dark` на корені,
  `<footer>` / `<nav>` / `<ul>`, іконки — HtmlEmbed (SVG лайву, `currentColor`, id clipPath з `-ft`). `res-overlay`: фон `neutral-1000`, `opacity 0`.
  Дерево — footer.md «Збірка в копії».
- **Звірка:** `tools/record/footer-compare.mjs` (новий) — 1440 / 768 / 600 / 375: **0 прапорців, Δ 0** (65 / 64 / 64 / 64 перевірок).
- **Staging опубліковано агентом** 3 рази (задачі `3cacd164…` — сортування користувача, `413b3c92…` — футер, `27e027ad…` — правки футера).
- **Рішення агента:** (1) префікс `ft-*` (IX2 `a-126` бере старі `.footer-cloud-item` за класом по всій сторінці); (2) футер — компонент, бо піде
  на шаблони CMS і Styleguide (на оригіналі це символ); (3) оверлей анімуємо `opacity` замість rgba-інтерполяції (Δ ≤ 3/255); (4) хмари футера
  рухаються на всіх смугах, як на лайві; (5) тексти 1:1 з лайвом, зокрема «Fade in Fade Out.» і «linkedin».
- **Пастки MCP:** (1) `whtml_builder` **відкидає `target`** і дублює `href` / `rel` власними атрибутами поряд із налаштуванням `link` — після
  збірки чистити `attributes` і ставити `link` (`static_link`, `open_in_new_tab`, `rel`); (2) inline `<svg>` у `whtml_builder` стає деревом
  DOM-вузлів `svg` / `path` — іконки робити HtmlEmbed (`element_builder` + `set_settings` `code`); (3) після `transform_element_to_component`
  елементи всередині мають нові id у компоненті — правити з `scope_component_id`; (4) публікація доходить на staging за ~30–60 с — чекати
  за вмістом сторінки (`until curl … | grep`), а не `sleep`.
- **Не зроблено:** `initFooter()` (оверлей + хмари) і `footer-run.mjs`; Sound / Navigation — свої проходи.

### 2026-10-10 (сесія 22) — Resources: верстка, звірка, код анімації, підключення

- **Верстка:** `section-resources` після `section-lessons` (id `resources-next`): хмари (SVG 3 смуг з ассетів копії), pin, 3 рядки зі шторками й
  стрілками (ембед SVG), student, стек, таби з лічильниками, 2 Collection List (Courses / Resources) з картинкою в рядку. 29 класів `res-*` + 6 комбо,
  значення з лайв-CSS. `heading-sm` = лайв `.h5` (lh 1.0741 / tab 1.3182 / mob 1.1765). Дерево й відступи від лайву — resources.md «Збірка в копії».
- **Звірка:** `tools/record/resources-compare.mjs` (новий) — 1440 / 768 / 600 / 375: 196/197, Δ ≤ 1 px; єдиний прапорець — порядок курсів (нижче).
- **Код:** `initResources()` + `initResourcesStack()` (pin одразу, 3 фази цілими відсотками, scrub 3, таб на таймлайні, хмари ≥992 за IX2 −20 % / 0–40 %,
  hover-стек без багів лайву). `tools/record/resources-run.mjs` (новий): 4 смуги — 0 прапорців, pin 4683 / 2945 / 2121 (лайв 4684 / 2944 / 2121);
  `--live` 1440 / 375 — 0; `coexist-run --live` 1440 / 375 — старі pin-и Δ0.
- **Хостинг і Webflow:** коміт `0b615c4` → jsDelivr (200); Home head оновлено через MCP (`set_page_freeform_code`, прочитано назад),
  `src/webflow/home-footer.html` — той самий sha.
- **Staging опубліковано агентом** 6 разів (задачі `4706df10…`, `1129ddc1…`, `85bbb176…`, `0ee61db3…`, `c7800a3c…`, `06ecc191…`)
  — для звірки й перевірки коду.
- **Рішення агента:** (1) заголовок — `div role=heading aria-level=2` + `aria-label` (div у h2 невалідний); (2) `res-clouds` — `overflow: clip visible`
  (хмара розширювала layout viewport мобільних до 984 px і ламала `innerWidth`); (3) таб синхронізується в `onUpdate` таймлайну; (4) перебудова
  pin при зміні ширини; (5) рядки й тексти списків порівнюються за посиланням, порядок — окремим прапорцем.
- **Пастки MCP:** (1) **сортування Collection List не пишеться**: `sort` з `created-on` / `slug` / `createdOn` — «Unknown field», з користувацьким
  полем — `[Conflict] … component map`; `curatedItemIds` приймається, але не зберігається (опублікований список порожній). (2) Порожній `sort` =
  «нові спершу». (3) Порядок запису: спершу `source`, потім інше (у тому ж виклику поле ще «невідоме»). (4) `settings` у `data_element_builder`
  працюють лише для DOM-елементів — Link / Image прив'язувати окремим `set_settings`. (5) Прив'язки CMS: Link → `link` binding, Paragraph → `text`,
  Image → `assetId`; атрибут `aria-label` — `value_binding` на поле. (6) `whtml_builder` створює Section / Block / Paragraph / Heading з атрибутами й
  комбо за наявними класами; `&` у тексті дає два String-вузли (невидимо).
- **Не зроблено / потрібно від користувача:** Designer → Collection List `res-list` (courses) → Sort: **Created On, Oldest first** (MCP не вміє,
  10 секунд руками). Оверлей і чорні хмари — прохід Footer; тема навбара — Navigation; `resources-next` → `resources` — з видаленням старих секцій.

### 2026-10-10 (сесія 21) — Resources: аналіз Figma, лайв-заміри, план секції й анімації

- **Figma** (обгортка від користувача `4616-22252`, субагент sonnet) → docs/sections/resources.md: 17 кадрів 1440 (вхід із хмарами,
  заголовки, трек 3182, списки, 4 стани hover-стеку, кінець із чорними хмарами — це хмари футера); 768 / 375 — лише вхід.
  Відкриті питання субагента закрито правилом «лайв — істина» (там же).
- **Лайв-зонд** `tools/record/resources-probe.mjs` (новий: struct / scan / hover, 1440 / 768 / 375) + CSS лайву через curl (68 правил).
  Знахідки: pin = `1.5·vw + (scrollWidth − vw) + listsH` (4684 / 2944 / 2121), `scrub 3`, фази за цілими відсотками (1440: стрілки
  0–48.6 %, трек –71.8 %, списки –100 %); **стрілка — шторка** на весь рядок, що відкриває слово; хмари `resources-clouds-list` рухає
  IX2 лише на ≥992 (1.2 / 1 / 2 rem); оверлей фарбує тригер футера; списків **10 + 4**, а не 14 + 14 (home-tree виправлено).
- **Баги лайву (не переносимо):** картинки курсів відсортовано навпаки до рядків (hover на «UX in Motion» показує School of Motion);
  глобальні індекси стеку повертають старі картинки після зміни списку; pin лінивий (баг 7 script-map).
- **План** (resources.md «План компонента» / «План анімації»): `section-resources` без компонента, внутрішні класи **`res-*`**
  (старі `resources*` читає блок E `script.v33`); картинка CMS — у рядку, код переносить її в стек; хмари переїжджають у
  `section-resources`; усе кодом `initResources()` (pin одразу, не ліниво); оверлей — прохід Footer, тема навбара — Navigation.
- **CMS копії:** поля Courses / Resources однакові — `course-image`, `name-in-list` (62 символи), `link`, `name`.
- Webflow не змінювали, staging не публікували.

### 2026-10-10 (сесія 20) — Lessons: код анімації, слайдер схем, медіа, підключення

- **`initLessons()`** (`src/motion.js`): порти IX2 — Implementation ×8 (scrub 1, `gsap.matchMedia` ≥992 / 768–991 / ≤767, tiny-ключі
  на 480–767 для всіх уроків), examples (рядок + зірки), демо (стан 0–5 за порогами → `is-active` / `is-on` / ширина лінії), фон
  classic + `lesson-overlay`; позиції — `ix2Range()` за формулою прогресу IX2. `lazyVideo()` (src за смугою, play у в'юпорті, зміна смуги
  міняє src), ліниві Lottie hero (`lottie_light`) і dimension-відео (HEVC + VP9). **`initLessonSchemes()`**: твін треку 0.6 с на кривій
  Splide, `is-active` одразу, текст через 0.4 с, drag через `ScrollTrigger.observe` (пороги Splide 2), `disabled` на крайніх, одна Lottie
  на схему. Деталі — docs/sections/lessons.md «Код анімації».
- **Роль `lesson-cases-head`** додано в компонент `lesson-section` (елемент `…f061f74`) через MCP, прочитано назад.
- **Перевірка:** `tools/record/lessons-run.mjs` (новий; impl на easing / fade / zoom, examples, демо, classic, слайдер, медіа) проти лайву
  й ключів IX2, 1440 / 768 / 600 / 375 — **0 прапорців**: Δ ≤ 0.5 px, scale ≤ 0.001, `x%` ≤ 0.1, alpha ≤ 0.004, стани демо = лайву;
  крива слайдера Δ ≤ 0.04 кроку, текст через 387–419 мс (лайв 409–415).
- **Хостинг і Webflow:** коміт `7afb11e` → jsDelivr (200). Home head оновлено через MCP (`set_page_freeform_code`, прочитано назад),
  `src/webflow/home-footer.html` — той самий sha. **Staging опубліковано агентом** 2 рази (задачі `7197021e…` — роль заголовка,
  `9c9be796…` — новий модуль). `--live`: lessons-run 1440 / 375 — 0 прапорців; coexist-run 1440 / 375 — прелоадер 14.1 / 13.2 с,
  старі pin-и Δ0 до й після проходу.
- **Рішення агента:** (1) Splide рушав на ~28 мс пізніше кліку (2 кадри) — затримку не відтворюємо, крива й тривалість 1:1; (2) пороги демо
  — середини 1 %-вікон IX2 (17 / 34.5 / 51 / 67.5 / 83.5 %); (3) вікна фону classic — за порядком у DOM (easing, delay), без нового атрибута;
  (4) reduced-motion: без згладжування й декоративних рухів, трек карток їде (несе картки 2–3 у кадр), відео — перший кадр; (5) усі медіа
  уроків грають лише в в'юпорті (на лайві 17 Lottie й усі 6 відео демо грали завжди).
- **Пастка:** Finsweet `autovideo` (старий, на сторінці) на старті бере **всі** `<video>` і запускає ті, що в в'юпорті, — зокрема наші
  стоси відео демо (на 768 / 600 грали всі 6). Тимчасовий `guardVideo()`: наше відео, яке код не просив грати, ставить себе на паузу.
  Побічно в консолі `play() request was interrupted` — необроблені проміси autovideo; зникне разом зі старим скриптом.
- **Не зроблено:** тема навбара за уроком (`data-theme`) — прохід Navigation; id `<урок>-next` → справжні — з видаленням старих уроків.

### 2026-10-10 (сесія 19) — Lessons: блоки easing (схеми, examples, демо) і classic у слоти, звірка

- **Компоненти** (група Lessons): `lesson-schemes`, `lesson-examples`, `lesson-demo` → слот Extras easing; `lesson-classic` (11 пропсів +
  варіант delay) → слот After easing і delay. 45 нових класів + 9 комбо. Splide замінено розміткою під код: трек, 5 кіл з однією Lottie,
  `<button>` зі стрілками, опис схеми в `data-text`. Дерево — docs/sections/lessons.md «Збірка в копії: блоки easing і classic».
- **`heading-lg` (глобально)** = `.h2-secondary` лайву на 3 смугах (1.0957 / −0.0174em · 1.1563 / −0.0313em · 1.1111 / −0.0222em). Пункт
  PLAN «heading-lg» закрито.
- **`styles-rem`** (`src/styles-rem.html` → ембед, прочитано назад): підкреслення активної схеми, `:disabled` стрілки, `touch-action` /
  `user-select` треку, Safari-маска для медіа classic, шум `::before` classic (Texture_01 з бакета копії, лише ≥992, без анімації при
  reduced-motion).
- **Звірка:** `tools/record/lessons-compare.mjs` розширено: бази блоків + токени перевірок (фон, sticky, src за смугою, видимий тег,
  прозорість, підкреслення). 8 уроків × 4 смуги (1440 / 768 / 600 / 375): **0 прапорців**, Δ ≤ 1 px (600: схеми ≤ 2.1 px — округлення
  Splide), повні висоти easing (11615 на 1440) і delay збігаються.
- **Staging опубліковано агентом** 2 рази (задачі `9a58852c…`, `fbf231c9…`) — для звірки.
- **Рішення агента:** (1) один `lesson-classic` на обидва уроки: крок 1 = текст (+ View, `Show link`), крок 2 = відео + примітка
  (`Show second`); (2) стартовий стан блоків у класах = кадр лайву при scrollY 0, далі комбо `is-active` / `is-on` ставить код;
  (3) фон обгортки classic прозорий, чорний дасть код; (4) рядок examples — літеральний клас, не `display-xl` (інший tracking);
  (5) відео демо — один тег на стан з трьома `data-src` за смугою (на лайві 18 тегів).
- **Пастки MCP:** (1) **атрибут з порожнім значенням Webflow викидає при публікації** (`disabled=""`, `muted=""`, `loop=""` зникли) —
  давати значення (`disabled="disabled"`, `muted="muted"`); (2) `set_text` на TextBlock у білдері знову не ліг — ставити на String-дитину;
  (3) після `transform_element_to_component` (replace) інстанс лишається на сторінці — видалити й вставити в слот `insert_in_slot`;
  (4) `query_styles` з 2-сегментним `name_path` не бачить 3-рівневих комбо (`.classic-anim_sideimg.is-left.is-easing` з tiny-картинкою
  `Film_mobile.svg`) — додатково читати скомпільований CSS staging; (5) ембед у кнопці: `HtmlEmbed` дитиною DOM-`button` працює,
  код — `set_settings` key `code`.
- **Не зроблено:** анімації й завантаження медіа — `initLessons()` / `initLessonSchemes()` (наступна сесія). Hover-підкреслення «View» у
  classic поставив станом класу; чи є воно на лайві — не перевірено.

### 2026-10-10 (сесія 18) — Lessons: компонент lesson-section, 8 уроків, звірка

- **Верстка:** `section-lessons` після `section-techniques`; компоненти `lesson-section` (18 пропсів + `Variant`, слоти Extras / After)
  і `lesson-card` (4 пропси: link, text, video src, poster), вкладений ×3 з прив'язкою до `Card N *` батька. 8 інстансів з даними лайву
  ([lessons-props.json](docs/sections/lessons-props.json)), 8 варіантів (колір + pt; zoom — 400vh, пін без −100vh). 25 нових класів, дерево
  — docs/sections/lessons.md «Збірка в копії».
- **Текстові стилі (глобально):** `heading-md` tab lh 1.35, mob 1.1111 / −0.0389em; `body-md` tab lh 1.7143; `heading-xl` = пропорції
  `.h3` (1.0286 / −0.0357em · 1.1282 / −0.0308em · 1.1 / −0.03em).
- **`styles-rem`** (`src/styles-rem.html` → ембед компонента, прочитано назад): підкреслення «View» на hover картки, Safari mask для
  медіа картки.
- **Звірка:** `tools/record/lessons-compare.mjs` (новий) — 8 уроків × 4 смуги (1440 / 768 / 600 / 375): **0 прапорців**, Δ ≤ 0.3 px
  (600 — ≤ 1 px, округлення). Повні висоти fade…zoom збігаються.
- **Staging опубліковано агентом** 5 разів (задачі `ff2ffdaf…`, `a2892adf…`, `46a7e865…`, `4172b855…`, `ef8cfc40…`) — для звірки.
- **Рішення агента:** (1) картка — окремий компонент (не 12 пропсів на голих елементах), вкладені пропси прив'язані до пропсів
  уроку; (2) відео — DOM `<video>` з `data-src` (src ставить код), постер — Image з image-пропом (`loading=lazy`); (3) поки старі
  уроки на сторінці, id інстансів `<урок>-next`; (4) номер і заголовок — обгортка з шириною + текстовий стиль усередині (без комбо
  на текстових стилях).
- **Пастки MCP:** (1) `TextBlock` у `data_element_builder` стає Block зі String, `set_text` треба давати на String-дитину; (2) слоти не
  перейменовуються через `update_prop` (тип slot), але ім'я береться з **display name** елемента слота (`set_display_name`);
  (3) у слот MCP кладе лише інстанси компонентів — блоки easing (схеми, examples, демо) і classic робити компонентами;
  (4) порожній слот рендерить `<div></div>`; (5) варіант інстансу ставиться як проп `Variant` (string = id варіанта);
  (6) IX2 щокадру переписує стартовий `transform` старих карток — звірка віднімає його, а не скидає.
- **Не зроблено:** слоти Extras / After порожні (блоки easing і classic — наступна сесія); анімація й Lottie/відео — `initLessons()`.

### 2026-10-10 (сесія 17) — Lessons: аналіз Figma, лайв-заміри, план компонента й анімації

- **Figma** (sonnet-субагент): обгортка користувача `4611:22250` = лише урок easing 1440 (довгий кадр `1553:20458` + 5 станів
  слайдера схем + 2 Examples + 6 станів демо); уроки 2–8 `1553:25009…27397` — порівняння з easing, лише відмінності →
  docs/sections/lessons.md. Блока classic і смуг 768/375 у Figma немає, тож еталон — лайв. Питання субагента закрито правилом «лайв —
  істина», від користувача нічого не потрібно.
- **Лайв-заміри:** `tools/record/lessons-probe.mjs` (новий: struct / scan / splide + тонкий скан `RANGE`), 3 смуги. Знайдено:
  **формула прогресу IX2** (старт `max(vh − h, 0)` або `vh` при startsEntering, кінець `−h·(1 − endOffset)`), підтверджена на 4
  тригерах × 3 смуги; усі sticky — CSS, pin-ів немає; слайдер Splide — крок 377 / 252, 600 мс, `cubic-bezier(.42,.65,.27,.99)`, текст
  міняється через 400 мс; 17 Lottie грають завжди; 46 відео грає Finsweet autovideo; навбар бере колір уроку з крихти.
- **Баги лайву (виправляємо):** на 480–767 картки уроків 2–8 не рухаються (IX2 лише на tiny); дві копії Lottie на кожну схему.
- **Рішення агента (карт-бланш):** (1) один компонент `lesson-section` з 8 варіантами (колір) + пропсами (id, тексти, 3 картки) +
  слотами «Extras» / «After» для одноразових блоків easing і classic; `lesson-classic` — окремий компонент ×2; (2) анімація вся в коді
  (`initLessons()`, `initLessonSchemes()`), IX3 — ні (той самий порядок тригерів після pin-ів, що в Techniques); (3) Splide → GSAP-твін +
  Observer; одна Lottie на схему; відео — один тег, `src` за смугою, play у в'юпорті власним кодом замість autovideo; (4) заголовок
  уроку — `h2` (на лайві `h4`), без зміни вигляду.
- Webflow не змінювався, staging не публікувався.

### 2026-10-10 (сесія 16) — Techniques: код анімації, підключення

- **`initTechniques()`** (`src/motion.js`): порт IX2 `e-632/634/633` — один scroll-scrub таймлайн на секцію (слово 2
  y 1→−2rem, слово 3 0→−5rem / −3rem ≤767, зірки scale 1→0.4 + y, абзац scale 1→0.6), `gsap.matchMedia` на смуги,
  старт `30% bottom` на ≤991, rem-функції, `invalidateOnRefresh`. Створюється після `initInteractive()` у тому самому
  ScrollTrigger. Кути плашок лишились у класах — GSAP зберігає їх при русі `y` (перевірено, Δ0).
- **Рішення агента:** (1) reduced-motion — без анімації, слова як без JS (не «кадр 0» з +1rem на слові 2); (2) `scrub: 1`
  — підібрано по `--lag` проти лайву (166 мс відставання / 1.2 с осідання у IX2, 153 мс / 1.22 с у нас).
- **Перевірка:** `tools/record/techniques-run.mjs` (новий) — 8 точок прогресу, наш код проти лайву й ключів IX2:
  1440 / 768 / 375 — Δ ≤ 0.2 px, 0 прапорців; режим `--lag` для підбору scrub.
- **Хостинг і Webflow:** коміт `b89c681` → jsDelivr (motion.js / legacy-guard.js / sphere.js — 200). Сніпет модуля в Home
  head оновлено **через MCP** (`set_page_freeform_code`, прочитано назад), `src/webflow/home-footer.html` — той самий sha.
  **Staging опубліковано агентом** 2026-10-10 ~08:55 UTC (task `2fe69508…`).
- **`--live` після публікації:** techniques-run 1440/768/375 — 0 прапорців, помилок немає; coexist-run 1440/375 — прелоадер
  12.6 / 11.5 с, кулька Hero → Intro → слайдер, старі pin-и Δ0 до й після проходу.
- **Пастка:** не запускати кілька Playwright-прогонів staging паралельно з coexist-run — сторінка вантажиться 60 с,
  запобіжник гейта (20 с) знімає прелоадер, і старі pin-и їдуть на Δ2000 (хибна тривога; поодинці — Δ0).
- **Не зроблено:** `id="techniques"` лишився на старій секції — переноситься з видаленням старого `#techniques`.

### 2026-10-10 (сесія 15) — Techniques: аналіз, лайв-заміри, верстка, план анімації

- **Webflow MCP працює** (`list_sites` бачить обидва сайти). Копію перед сесією хтось публікував о 08:21 UTC.
- **Аналіз Figma** (sonnet-субагент): огляд `702:14385`, 6 кроків `702:15306…15882`, 768 `869:20845`, 375 `918:28871` →
  docs/sections/techniques.md. Figma — стара версія (косий rect замість divider, зірки зникають, хмара шаром); береться лайв.
- **Лайв-заміри:** `tools/record/techniques-probe.mjs` + стилі старих класів через MCP. Слова й абзац — `sticky`, анімація —
  IX2 scroll-scrub (smoothing 90): слово 2 y 1→−2rem (0–50 %), слово 3 y 0→−5rem / −3rem ≤767 (0–60 %), зірки scale 1→0.4
  + y (0–26 %), абзац scale 1→0.6 (60–72 %); плашки **не обертаються**. На ≤991 старт зсунутий на 30 % висоти секції
  (`start: "30% bottom"`, виведено з трьох замірів на 768).
- **Верстка:** `section-techniques` після `section-interactive` (11 нових класів/комбо, кольори/обводка/радіус на змінних,
  плашки — режим `base` у темній секції). Злиття: `list-wrap` → `techniques-words` (ARIA heading), `content-wrap` +
  `text-wrap` → `techniques-clouds` / `techniques-text`.
- **Текстові стилі (глобально):** `display-xl` tab ls −0.0717em, mob −0.0393em; `body-lg` lh 1.5714 / 1.5833 / 1.4545 —
  точні співвідношення `.p1` лайву (Hero теж на `body-lg`, зміна ≤0.04 px на рядок, у бік лайву).
- **Звірка:** `tools/record/techniques-compare.mjs` — нова vs стара на staging, 14 елементів × 3 смуги: **Δ ≤ 0.2 px, 0 прапорців**.
- **Staging опубліковано агентом** двічі: після вставки секції (task `e6fc4daf…`) і після правки `body-lg` (task `a15274e7…`).
- **План анімації** — код (`initTechniques()`, ескіз у techniques.md): тригер у спільному ScrollTrigger після pin-ів
  Intro/Interactive, `gsap.matchMedia` на смуги, rem-функції. IX3 відкинуто через порядок/refresh тригерів.
- **Пастки:** (1) `getBoundingClientRect` повернутих плашок — bbox, для звірки брати ще `offsetWidth/Height`; (2) webflow.js
  (IX2) у скрипті звірки не блокується — інлайн-трансформи старої секції знімати перед замірами; (3) у Webflow
  комбо-клас найвищої специфічності на `main` перебиває медіа-правило бази (третя плашка: висоту на medium/tiny треба
  ставити в комбо, не в базі).

### 2026-10-10 (сесія 14) — Interactive: код (pin + зсув, сфера, Lottie), підключення

- **`initInteractive()`** (`src/motion.js`): pin `interactive-pin`, трек `interactive-track` їде на
  `x: −(padding-left pin + ширина треку − vw)`, `sine.out`, `scrub: 1`, `anticipatePin`, `invalidateOnRefresh`. Зсув
  **852 / 1224 / 827 px = лайв (Δ0)** на 1440 / 768 / 375, top кіл у pin 165 / 227 / 234 = лайв. Сфера й Lottie
  вантажаться ліниво на `top bottom` pin (once).
- **`src/sphere.js`** (порт блоку F, імпортується динамічно): Matter.js **0.20.0** ESM (лайв 0.18). Виправлено: неявні
  глобали, дубль `density`, `e.toElement` → `mouseleave` по колу (clip-path обмежує hit-test). Рішення агента (карт-бланш):
  (1) хак Windows 11 `timeScale 0.35` прибрано — він компенсував 120–144 Гц у 0.18, раннер 0.20 від частоти не залежить;
  (2) світ фіксованого розміру, canvas масштабується з колом і малюється з devicePixelRatio (на лайві ratio 1 — мило на
  retina); (3) симуляція спить поза в'юпортом; (4) тач: палець на кульці — тягне кульку, деінде — скролить сторінку
  (на лайві тач по колу блокував скрол); (5) **нахил гравітації відновлено**: `onUpdate` pin-тригера → `gravity.x =
  −direction/2`, `scrollEnd` → 0 (перевірено: центроїд куль −0.11…−0.13 під час скролу, назад після зупинки);
  (6) звук зіткнень — AudioContext створюється при першому звуці (`resume()`), стан звуку — `[data-motion=sound-state]`,
  поки що старий `.sound-btn-mute.is-active` (= вимкнено) — перехідний виняток, як `syncLegacy()`.
- **Lottie** (`initInteractiveLottie`): `lottie-web@5.13.0` light, лінивий імпорт. Поведінка з IX2 (не «out 100→0», як
  писали раніше): hover ≥992 — з 0 до кінця за 3.43 с; out — дограти до кінця від поточного кадру за 3.43 с і скинути на 0;
  тап ≤991 — один прохід і 0. Файл 206 кадрів @60 = 3.43 с, експресій немає (light-збірка годиться).
- **Перевірка:** `tools/record/interactive-run.mjs` (локальний код на опублікованій сторінці або `--live`) — зсув, трек по
  pin, canvas/ratio/кулі, нахил, Lottie hover/tap (повернення на кадр 0 — 0 % пікселів), старі pin-и Δ0, помилки.
  `tools/record/sphere-touch.mjs` — політика тачу на голій сторінці: порожнє місце → скрол 153 px, кулька → 0.
  На staging свайп з кульки теж скролить: старий `normalizeScroll` (мобайл) сам веде тач — зникне разом зі `script.v33`.
- **Хостинг і Webflow:** коміт `d96e9a4` → jsDelivr (motion.js, sphere.js, legacy-guard.js — 200). Сніпет модуля в Home
  head оновлено **через MCP** (`set_page_freeform_code`, прочитано назад), `src/webflow/home-footer.html` — той самий sha.
  **Staging опубліковано агентом** 2026-10-10 08:17 UTC (task `0bf6fb14…`).
- **`--live` після публікації:** interactive-run 1440/768/375 — усе як локально, помилок немає (крім старого
  `play() interrupted`); coexist-run 1440/375 — прелоадер ~11 с, скрол під ним стоїть, кулька Hero → Intro → слайдер,
  старі pin-и Δ0 до й після проходу.
- **Не зроблено:** `id="interactive"` лишився на старій секції (меню старого навбара веде туди) — переноситься разом
  із видаленням старого `#interactive`; hover-звук `#notrealtime` — етап 4 (звук).

### 2026-10-10 (сесія 13) — Interactive: аналіз, лайв-заміри, верстка

- **Webflow MCP працює** в цій сесії (`list_sites` бачить оригінал і копію) — збірка і публікація агентом.
- **Аналіз:** Figma `4611-22244` (4 кадри 1440 — розкадровка pin-скролу) — sonnet-субагент → docs/sections/interactive.md.
  Його 5 питань закрито без користувача: нахил гравітації — відновлюємо (сесія 4), ≤991 — лайв (сесія 5), решта — лайв-заміри.
- **Лайв-заміри** (`tools/record/interactive-probe.mjs`): заголовок на лайві **не зменшується** (у Figma — так), беремо лайв;
  pin `x: −(scrollWidth − vw)` sine.out scrub 1, зсув 852 / 1224 / 827 px; кола 5.7rem на 1440 **і 768**, 3.44rem на 375.
- **Верстка:** `section-interactive` після `section-intro` (9 нових класів, кольори/обводка на змінних). Злиття `track-flex` +
  `track-padding` → `interactive-track` (`max-content`). Lottie — `div[data-src]` під плеєр у коді.
- **Текстові стилі:** `display-lg` lh 1.0625, tab lh 1 / ls −0.064em, mob lh 1.1 / ls −0.04em; `body-sm.is-strong` ls −0.02em.
- **Звірка:** `tools/record/interactive-compare.mjs` — нова vs стара секція на одній staging-сторінці, 1440/768/375:
  Δ ≤ 0.7 px, 0 прапорців (перший прогін зловив ls заголовка на 768: 668 проти 641 px → виправлено).
- **Staging опубліковано агентом** двічі: 2026-10-10 ~07:5x UTC (task `45da67fc…`) і 07:57 UTC після правки `display-lg`
  (task `a890a2e0…`). Нова секція поки статична (без коду) між новим Intro і старими секціями; старі pin-и тримає `syncLegacy()`.
- **Пастки:** (1) `data_whtml_builder` з HTML без CSS **перевикористовує наявні класи** (`body-sm`, комбо `is-strong`) —
  дублів немає, але пробіл перед `<br>` у кінці рядка обрізає (невидимо). (2) `element_snapshot_tool` знову таймаут —
  звірка лише через staging + Playwright. (3) Скрипт звірки блокує код → прелоадер-оверлеї лишаються, для скриншотів ховати CSS.


### 2026-10-10 (сесія 12) — підключення «поруч зі старим» (варіант 2), підготовка

- **Питання користувача:** на staging прелоадер стоїть, кулька на скролі не рухається. Причина: новий код ще не
  підключено до Webflow, нові секції — статична верстка над старими (старий скрипт працює лише зі старими елементами).
- **Рішення користувача:** варіант 2 — новий код вмикається на нових секціях, старий `script.v33` лишається для решти
  сторінки, доки секції не переписані. Старі Preloader/Hero/Intro поки на сторінці (нижче нових).
- **Що ламалось разом зі старим скриптом** (новий прогін `tools/record/coexist-run.mjs`, старі скрипти НЕ заблоковані):
  (1) плагіни GSAP ESM під час імпорту реєструються на `window.gsap` (старий 3.10.4) — наш ScrollTrigger прив'язувався
  до старого ядра, `tl.scrollTrigger` = undefined → помилки й зламана кулька. Фікс: `src/legacy-guard.js` (перший
  імпорт `motion.js`) ховає `window.gsap`, `motion.js` повертає після `registerPlugin`. (2) Старий Lenis локальний, його
  не зупинити — колесо прокручувало сторінку під прелоадером. Фікс: гейт ловить `wheel`/`touchmove` capture-слухачами на
  `window` до Lenis, знімає їх на `motion:preloader-done`. (3) Наші pin-и змінюють висоту над старими секціями — фікс
  `syncLegacy()`: після кожного нашого refresh — `refresh()` старого ScrollTrigger. (4) Запобіжник гейта на 6 с від
  `<head>` знімав прелоадер на повільній сторінці (DOMContentLoaded на staging 2.5–23 с) — тепер DOMContentLoaded + 1 с
  і жорстка межа 20 с.
- **Перевірено** (1440 і 375-тач, опублікована розмітка staging, `--published --cdn` — рівно сніпети Webflow з jsDelivr):
  під прелоадером скрол стоїть, прелоадер ~11–12 с, кулька Hero → шлях Intro → слайдер, старі pin-и Δ0, старий
  слайдер нижче тримається; помилок сторінки немає (лише `play() interrupted` зі старого скрипта, рядок 481 без catch).
  Регресія: intro-run 1440 Δ ≤ 1 px, ui-run 1440 — ті самі 2 очікувані розбіжності.
- **Хостинг:** коміт `6817015` запушено; jsDelivr `gh/kov-dev/motion-rebuild@<sha>/src/motion.js` віддає 200.
  Канонічні сніпети: `src/webflow/home-head.html` (гейт + preloader.css), `src/webflow/home-footer.html` (модуль).
- **Staging** опубліковано 2026-10-10 06:41 UTC (не агентом) — там уже всі ролі `data-motion` сесій 10–11.
- **Webflow MCP не авторизований у цій сесії** — сніпети у Webflow ще не вставлено (вставить користувач руками або
  після `/mcp`). Публікацій агентом не було.

### 2026-10-10 (сесія 12, продовження) — сніпети у Webflow, перевірка staging

- **Webflow MCP** знову не авторизувався: сесія у VS Code неінтерактивна й не запускає OAuth, перезапуск не допоміг
  (авторизувати через `/mcp` у терміналі `claude`). Chrome-розширення теж не було підключене.
- **Вставив користувач руками** в Home → Custom code. Усе в **Inside `<head>`**: `home-head.html` (гейт + preloader.css),
  а за ним рядок модуля з `home-footer.html`. Модуль у `<head>` = те саме, що перед `</body>`: `type="module"` виконується
  після розбору сторінки, після старих sync-скриптів body (інших defer/module, крім Finsweet autovideo, немає).
  **Before `</body>`** не чіпали — там старий код (GSAP 3.10.4, script.v33 тощо). Staging опублікував користувач 07:39 UTC.
- **Перевірено** `tools/record/coexist-run.mjs --live --published` (новий прапор `--live`: сторінка як є, без підстановок),
  1440 і 375-тач: під прелоадером скрол стоїть, прелоадер ~14 с, кулька Hero → шлях Intro → слайдер, старі pin-и Δ0
  (і після проходу), старий слайдер нижче тримається (top 0); помилки лише `play() interrupted` зі старого скрипта.

### 2026-10-09 (сесія 11) — Intro: `initUi()` (pin слайдера), ідл-похитування

- **Відповіді користувача:** поля в промпті (хвиля 2 ассетів, прототип таймінгів hero) знову шаблонні — нових відповідей
  немає. Хвиля 2 не видалялась. **Змін у Webflow і публікацій у цій сесії не було** (звірка — на фікстурі).
- **`initUi()`** у `src/motion.js`: pin кожного `[data-motion=ui]` у порядку DOM, довжина `vw·k + vw·n·k + 0.5·vw·n +
  0.25·vw` (×3 на тачі), трек, панелі 25→75vw, `clip-path circle(.09rem → max(vw,vh))` 0.7 с, відео opacity 0.6 с +
  `play()/pause()`, передача `ui-ball` між блоками (`bounceSmall`), компенсація кульки Hero одним твіном
  `hero-ball-sticky` у pin. Усі числа — функції, `invalidateOnRefresh`. Стани — від `tl.time()`.
- **`initUiIdle()`** (блок B): власний таймер 4 с замість `ifvisible`, лише коли слайдер у в'юпорті.
- **Прогін** `tools/record/ui-run.mjs` + `ui-diff.py` (нові): 35–36 точок × 3 смуги проти лайву — 768 / 375 без
  розбіжностей, 1440 — 2 очікувані; довжини pin 1:1. Intro після підключення pin — кулька Δ ≤ 1 px (intro-run).
  Перевірено також reduced motion і зміну смуги 1440 → 768 → 1440 посеред pin. Кадри —
  `reference/snapshots/2026-10-09-ui-*-live-vs-new.png`.
- **Виправлено в `initIntro()`:** після refresh (зміна смуги) кулька Hero могла лишитись схованою — тепер стани
  застосовуються заново на подію `refresh` (пастка 3 нижче).
- **Пастки:** (1) `overwrite: true` на твіні clip-path панелі вбиває scrub-твіни ширини — `'auto'`; (2) GSAP читає
  CSS `translate(%)` як px — перед `x/yPercent` ставити `y: 0, yPercent: …`; (3) `ScrollTrigger.refresh()` відновлює
  інлайн-стилі matchMedia-анімацій після вимірювань і затирає `gsap.set` станів, зроблені під час нього; (4) тригер,
  створений до pin наступного блоку, не може брати `endTrigger` на цей блок — кінець виходив раніше за початок;
  (5) `preload="none"` дає ~0.5–1 с білої панелі — прогрівати відео наперед.

### 2026-10-09 (сесія 10) — Intro: `initIntro()`, паралакс хмар

- **Відповіді користувача** вже були в журналі сесії 9 (поля в промпті знову шаблонні): публікувати копію агенту можна,
  хвиля 2 — так (видалення досі чекає дозволу класифікатора), прототип hero — пізніше. **Публікацій у цій сесії не було.**
- **`initIntro()`** у `src/motion.js`: `MotionPathPlugin` з `gsap@3.13.0`, `bounce` / `bounceSmall` з лайву, кулька Hero
  падає в початок шляху `path[data-motion=intro-path][data-bp]`, іде 4 сегментами 7 / 18 / 14 / 27 (падіння 4 / 8),
  відкриває `intro-text` за `data-step`, на десктопі bounce у центр першої панелі; передача кульки `ui-landing`. Шлях —
  через `matrix` із розкладки (баг лайву з `align` при sticky виправлено), усі числа — функції, `invalidateOnRefresh`.
- **Хмари — кодом** (`initIntroClouds()`, IX2 a-127 / a-156 1:1), рішення й причини — intro.md.
- **Прогін** `tools/record/intro-run.mjs` (новий): staging + фікстура, старі скрипти заблоковані, 12 точок × 3 смуги
  проти лайву в тих самих точках — кулька Δ ≤ 1 px, шлях 0–1 px, тексти ті самі, хмари Δ ≤ 0.01 rem, посадка точна,
  повернення чисте. Кадри — `reference/snapshots/2026-10-09-intro-anim-*`.
- **Копія:** нові атрибути `data-motion` — `intro-art`, `intro-cloud` ×3 (+`data-layer="back"`), `ui-landing` ×2;
  прочитано назад. Фікстура оновлена тими самими ролями.
- **`initUi()` не починали** — окрема сесія (блок D ~350 рядків лайву, pin двох блоків, 6 відео, передача `ui-dot`).
  Підказка для неї (компенсація sticky одним твіном у pin) — intro.md.
- **Пастки:** (1) `gsap.matchMedia().add({…})` не кличе функцію, коли жодна умова не збіглась — перелічувати всі смуги;
  (2) `MotionPathPlugin` кешує `rawPath` на елементі шляху й трансформує його на місці — передавати `d` рядком, не
  елемент (інакше сегменти накопичують зсув); (3) масив RawPath як `path` плагін сприймає як масив точок — лише рядок
  або елемент; (4) у лайві DOM-порядок пігулок also / your / controls / attention — при замірах брати за `is-*`.

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
