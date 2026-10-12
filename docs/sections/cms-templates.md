# Шаблони CMS (×3) — прохід сесії 36 (2026-10-12)

## Що є насправді

Верстати нічого: **усі три шаблони порожні** — і в оригіналі, і в копії лише `Body` (перевірено `get_all_elements`).
Figma для шаблонів немає. Колекційні рядки на Home ведуть на зовнішні `link` (Resources / Courses) або на секції Home
(уроки), на сторінки шаблонів не посилається ніщо. Sitemap лайву: лише `/` і `/styleguide`.

| Шаблон | Копія (page id) | Лайв | Staging до сесії 36 |
|---|---|---|---|
| Lessons `/lesson/<slug>` | `6ac8e84728488a6bd334f2e7` | 200, **порожня біла сторінка** (head: GA4, Twitter pixel, `webflow.js`; без навбара, футера, Sound, SEO, `noindex`) | так само |
| Resources `/resources/<slug>` | `6ac8e84728488a6bd334f2e8` | 404 (сторінки колекції вимкнені) | 404 |
| Courses `/course-items/<slug>` | `6ac8e84728488a6bd334f2e6` | 404 | 404 |

Слаги уроків ≠ id секцій: `the-basics-of-easing` → `easing`, `offset-and-delay` → `delay`, `fade-in-fade-out` → `fade`,
`transform-morph` → `morph`; `masking`, `dimension`, `parallax`, `zoom` збігаються.

Навбар / футер / Sound на шаблонах — **не потрібні** (на лайві їх там немає; Lessons тепер одразу веде на Home).

## Рішення (користувач, сесія 36)

- **Lessons → редирект на секцію Home:** `/lesson/zoom` → `/#zoom`. URL живі (правило «URL 1:1»), але ведуть до уроку.
  Head шаблону = [src/webflow/lesson-template-head.html](../../src/webflow/lesson-template-head.html): `noindex`,
  `canonical /`, `location.replace('/#<id>')` з мапою слагів. Новий урок зі слагом = id секції працює без правок.
  Справжній 301 у Site settings → Publishing → 301 Redirects був би чистішим, але MCP його не пише, а для правила з
  мапою потрібні 4 окремі рядки — можна додати руками на етапі запуску (тоді заглушка стане запасною).
- **Resources / Courses — лишаються 404**, як на лайві.

## Deep-link на Home (`src/motion.js`)

Лайв хеш ігнорував (`/#zoom` → прелоадер → Hero). Тепер `deepLinkTarget()` бере id з хешу (крім `hero` і елементів
навбара): прелоадера немає — Hero одразу в кінцевому стані, заслін (`section-preloader`, лічильник 100) тримається
inline-стилями, поки всі секції створюють піни (і `document.fonts.ready`), потім `lenis.resize()` +
`scrollTo(immediate)` (без Lenis — нативний), `ScrollTrigger.update()` і згасання заслону 0.4 с. Без хешу — повний
прелоадер, як раніше.

Перевірка — [tools/record/deeplink-run.mjs](../../tools/record/deeplink-run.mjs): `/#easing`, `/#fade`, `/#zoom`,
`/#resources` (+ з `--live` три `/lesson/<slug>`), ціль ≤ 2 px від верху, заслін знято ≤ 1.5 с після `load`, `/` —
прелоадер ще йде на 3 с.

## Що лишилось для запуску

- Поле `video-link-2` уроку easing вказує в бакет оригіналу (`s3…/6384fe1e…/64215be1…_Fly - Dashboard_H.264.mp4`); на
  сторінках не виводиться, але при архівації оригіналу посилання помре — перезалити або очистити (етап 6).
- SEO шаблонів порожнє — з `noindex` і редиректом не потрібне.
