# Видалення старого з Home копії — план (сесія 29, 2026-10-11)

Стан на старті: усі секції Home перезібрано й підключено (`a82e952`). Нові секції стоять **перед** старими
в `main`, старий навбар і Sound сховані через `legacy-hide.css`, `script.v33` + увесь старий стек ще в
footer code Home, `main-css` ще перший ембед у Body. Інвентар залежностей `script.v33` — [script-map.md](script-map.md)
(блоки A–K, 49 класів + 12 ID). Старі секції нічого нового не дають: кожна роль `data-motion` уже в копії.

## Інвентар: що саме прибираємо

### Footer code Home (сторінковий, `set_page_freeform_code` footer) — знято 2026-10-11, повна копія в [reference/home-footer-legacy-2026-10-11.html](../reference/home-footer-legacy-2026-10-11.html)

| # | Рядок | Кому потрібен | Вердикт |
|---|---|---|---|
| 1 | GSAP 3.10.4 core + ScrollTrigger, MotionPathPlugin 3.11.4, CustomEase 3.10.4, Observer 3.11.4 (глобали `window.gsap`) | лише `script.v33` | прибрати; наш модуль — ESM `gsap@3.13.0` (піновано), глобалу не потребує |
| 2 | Lenis `@latest` (bundled) | `script.v33` (десктоп) | прибрати; **наш Lenis ще не підключений** (етап 4) — після кроку 1 на десктопі скрол нативний, це тимчасова видима різниця |
| 3 | Splide 2.4.21 + inline-ініт `.splide2` + своп `.hero_text` | старий урок easing | прибрати разом (без бібліотеки inline кидає `Splide is not defined`); схеми easing — `initLessonSchemes()` |
| 4 | `ifvisible.min.js` | блок B (ідл) | прибрати; `initUiIdle()` |
| 5 | Matter.js 0.18.0 (глобал) | блок F (сфера) | прибрати; `sphere.js` імпортує `matter-js@0.20.0` |
| 6 | `script.v33.min.js` | старі секції (A–K) | прибрати |
| 7 | Finsweet `attributes-autovideo@1` | відео старих секцій | прибрати; ліниві відео — `lazyVideo()`; з ним іде `guardVideo()` (крок 4) |
| 8 | inline «lottie resize» (`Webflow.require("lottie").lottie.resize()`) | Webflow-Lottie старих секцій | прибрати; нові Lottie — `lottie-web@5.13.0` у модулі, ресайз свій |
| 9 | inline «Loader» (`.loader-counter` 0→100 за 4 с) | старий `loader` | прибрати; `initPreloader()` |
| 10 | inline «Clear anchor link» (`history.replaceState` на кожен `<a>`) | костиль лайву (AUDIT п.5) | прибрати; хеш ми не ставимо (рішення сесії 27) |
| 11 | inline «Passive event listeners» (jQuery touchstart/touchmove) | jQuery-хендлери старого коду | прибрати; наш код jQuery не використовує |
| 12 | 13 `<audio>` + inline hover/click-обробники `#link1…#link10`, `#notrealtime`, `.sound_click`, `.sound-btn-wrap` | старий Sound | прибрати; `initSound()` + `playSound()` (ліниві `Audio`) |
| 13 | inline sound toggle + `gtag('event','sound_on/off')` | старий Sound | прибрати; `initSound()` шле gtag через глобальний `gtag()` |

Після кроку 1 footer code Home **порожній**. Head Home лишається: гейт, `preloader.css`, `legacy-hide.css`,
`<script type="module">` (jsDelivr). Site-level код не чіпаємо (preconnect, Twitter pixel).

Пастка: `src/webflow/home-footer.html` у репо містив лише рядок модуля — це був **сніпет для `coexist-run --cdn`**,
а не дзеркало Webflow (модуль фактично живе в head). Після кроку 1 файл = порожній footer, і `coexist-run --cdn`
бере модуль із `home-head.html`.

### Старі елементи Home (Designer ID копії; `component` = сторінка `6ac8e84728488a6bd334f2e5`) — 10 блоків видалено 2026-10-11 (сесія 30, крок 2)

Порядок у Body був: `styles-rem` → `site-nav` → `site-sound` → `section-preloader` → **`main-css`** → **`.navigation`** →
**`.loader`** → `main` → **`.fixed-bottom`**. Після кроку 2: `styles-rem` → `site-nav` → `site-sound` → `section-preloader` →
`main-css` → `main` (7 нових секцій, останній — `site-footer`); після кроку 4 (сесія 31) — без `main-css`. ID нижче — історичні (елементів уже немає).

| Блок | Клас | element id | Що всередині | Замінено |
|---|---|---|---|---|
| ембед CSS | `main-css` | `27a12260-ea1b-f958-9a7f-b0e7acbbbf68` | `reference/main-css.css` (розбір [main-css.md](main-css.md)) | `styles-rem` + класи секцій; видалено останнім (крок 4, сесія 31) |
| навбар | `navigation w-nav` | `72062d36-1cc9-8384-1290-b9cc4e917a3b` | лого-Lottie, крихти, бургер, меню 10 `lottie-card` | `site-nav` |
| прелоадер | `loader` | `f79bcaeb-7490-de89-3371-7a9243d44c43` | 4 Lottie + лічильник | `section-preloader` |
| Hero | `nav nav-dark` → `section.is-hero#hero` | `7a61b557-4dcd-92ad-1f18-47267d8315a6` | кулька, лінії, 2 тексти | `section-hero` (`#hero-next`) |
| Intro | `nav nav-dark` → `section.is-introduction#introduction` | `7a61b557-4dcd-92ad-1f18-47267d8315b7` | SVG-шлях, ілюстрації, UI-слайдер, 6 відео | `section-intro` |
| Interactive | `nav nav-light` → `section.is-interactive#interactive` | `7a61b557-4dcd-92ad-1f18-47267d831613` | трек, `#canvas`, Lottie `not_real_time` | `section-interactive` |
| Techniques | `nav nav-dark` → `section.is-techniques#techniques` | `7a61b557-4dcd-92ad-1f18-47267d831639` | плашки, зірки | `section-techniques` |
| Lessons ×8 | `section.is-lessons#lessons` (+ `#easing … #zoom`, `resources-clouds-list`) | `7a61b557-4dcd-92ad-1f18-47267d83164c` | 799 вузлів, 17 Lottie, 46 відео, Splide | `section-lessons` (`#<урок>-next`) |
| Resources | `nav nav-light#resources` → `.resources` | `7a61b557-4dcd-92ad-1f18-47267d8318e1` | 2 Collection List, трек | `section-resources` (`#resources-next`) |
| Footer | `nav nav-dark` → `.footer` | `f5e85485-6c83-456f-70b1-376f3e07e47c` | хмари, IX2 `a-126` | `site-footer` |
| Sound | `fixed-bottom` → `sound-btn-wrap` | `a3fe06d1-2cc8-4c3d-e0db-71c28ca84a01` | кнопка, IX2 `a-130/131` | `site-sound` |

Усередині старих секцій — 98 HtmlEmbed, IX2-тригери (`data-w-id`), Webflow-Lottie, `<video>` з 3 джерелами. Усе йде
разом з обгортками (`remove_element` на обгортку). CMS-колекції й айтеми не чіпаємо (Collection List старого
Resources — лише елемент сторінки).

### У коді (`src/`)

| Що | Де | Навіщо було | Коли прибрати |
|---|---|---|---|
| `legacy-guard.js` + `import` + відновлення `window.gsap` (рядки 14, 23–26) | `motion.js` | ховати старий глобальний GSAP 3.10 на час імпорту наших ESM-плагінів | крок 4 (після кроку 1 нешкідливий: `window.gsap` просто `undefined`) |
| `syncLegacy()` + виклик в `init()` | `motion.js` ~1889, 1920 | перераховувати старі pin'и після наших refresh | крок 4 (guard `old === ScrollTrigger` робить її no-op уже після кроку 1) |
| `guardVideo()` + `wantedVideos` (виклики в `playVideo`, `lazyVideo`, `initLessonVisuals`, ще 2) | `motion.js` ~953–965, 1000, 1023, 1145 | Finsweet autovideo запускав і наші відео | крок 4 |
| `legacy-hide.css` (`.navigation`, `.fixed-bottom`) | head Home + `src/` | ховати старий навбар і Sound | крок 2 (разом з елементами) |
| `-next` у `initTheme()` (`z.el.id.replace(/-next$/, '')`) і коментар ~1572 | `motion.js` 1624 | крихта уроку з id секції | крок 3 (лишити `replace` можна, але прибрати — чистіше) |
| `heroHidden()` / коментарі про «old script's Lenis» у `preloader-gate.js` | `src/preloader-gate.js`, `motion.js` ~1777 | гейт проти старого Lenis / normalizeScroll | коментарі оновити в кроці 4; сам гейт лишається (він і проти нашого Lenis) |

### Тести (`tools/record/`)

- `coexist-run.mjs`: рядки «old pins», «old .ui at +600», `marks.oldHero` — після кроку 2 порожні / `null`; гілка old-ui
  просто не виконується. `--cdn` бере footer з `home-footer.html` (стане порожнім) — модуль у head, тож ок.
- `nav-run.mjs` `links`: кліки по картках → ціль ±2 px по id картки. Після кроку 3 ціль та сама секція з новим id — міняти
  нічого, якщо тест бере `href` з картки (перевірити при кроці 3).
- `*-compare.mjs` порівнюють лайв ↔ staging по `data-motion`, старих секцій не торкаються.

## Порядок кроків (кожен — окремо на staging, після кожного `coexist-run` / `nav-run` / `sound-run --live` 1440 + 375)

1. **Footer code Home → порожній** (п. 1–13 таблиці вище). Нічого в DOM не міняється. Очікувано: старі секції під
   нашим футером стають статичними (без pin'ів/анімацій), на десктопі зникає smooth scroll (Lenis — етап 4), у
   консолі не має бути помилок від старих inline-скриптів. ✅ виконано 2026-10-11 (сесія 29), див. журнал.
2. **Видалити старі елементи**: `.loader`, `.navigation`, 7 обгорток у `main` (Hero … footer), `.fixed-bottom`
   (10 `remove_element`, по одному, з читанням `get_all_elements depth 1` після). Потім прибрати `legacy-hide.css` з
   head Home і з `src/`. Очікувано: сторінка закінчується нашим футером; `coexist-run` показує `old pins:` порожньо,
   `marks.oldHero null`. Перевірити також `footer-run --live` (край футера = край документа). ✅ виконано 2026-10-11 (сесія 30):
   10 `remove_element`, head без `legacy-hide.css`, `src/legacy-hide.css` видалено; `coexist` / `nav` / `sound` / `footer --live`
   1440 + 375 — 0 прапорців (`footer-run` навчено обрізати точки за краєм сторінки: max p 0.556 на 1440, як на лайві).
   Порядок courses тепер перевіряє `resources-order.mjs` проти лайву (старого `#resources` на сторінці більше немає).
3. **Справжні id**: `section-hero` `hero-next` → `hero`; 8 `lesson-section` `<урок>-next` → `<урок>`; `section-resources`
   `resources-next` → `resources`; старий `#lessons` не потрібен (на лайві на нього ніхто не посилається — перевірити
   `nav-link` старого меню: там `#link1…` без href-якорів). Картки `site-nav` (`nb-card` ×10, компонент
   `daeb550f-…307f`) → ті самі id без `-next`. У `motion.js` прибрати `replace(/-next$/, '')`. Інтро-картка веде на
   `#hero` (як на лайві `#link1` → верх). `nav-run --live` PART=links 1440 / 375. ✅ виконано 2026-10-11 (сесія 30): `set_dom_id`
   на `section-hero` / `section-resources`, проп `Section id` на 8 інстансах (`set_component_instance_prop_values`, `type: string`),
   10 карток `set_settings` `link` зі `scope_component_id`; `motion.js` без `replace(/-next$/)` (коміт `3637a98`, модуль у head).
4. **Чистка коду й `main-css`**: прибрати `legacy-guard.js`, `syncLegacy()`, `guardVideo()`/`wantedVideos`, оновити
   коментарі; видалити ембед `main-css` (`27a12260-…bf68`) **після** звірки, що жодне правило не тримає нову секцію
   (кандидати з [main-css.md](main-css.md): `html font-size` — покрито `styles-rem`; scrollbar — покрито; noise
   `classic-anim_wrap::before` — у `styles-rem` як `lesson-noise`; `video.is-*` — нові відео одні на смугу;
   `.w-nav-menu` — йде з `w-nav`). Метод: `*-compare.mjs` ×4 смуги до й після видалення ембеда, Δ 0. Новий коміт →
   модуль у head на новий sha → publish → усі `*-run --live`.
   ✅ виконано 2026-10-11 (сесія 31). **Код:** `legacy-guard.js` видалено, `import` і відновлення `window.gsap` прибрано, `syncLegacy()`,
   `guardVideo()` / `wantedVideos` (5 викликів) прибрано, коментарі гейта й `initNav()` — «our Lenis, stage 4»; тести більше не підміняють
   `legacy-guard.js`. Коміт `87ef446` → модуль у head → publish → `coexist` / `nav` / `sound` / `footer` / `lessons --live` 1440 + 375 — 0.
   **main-css:** `*-compare.mjs` уже не годились (порівнювали нову секцію зі старою на тій самій сторінці; hero / intro — лайв проти
   локальної фікстури, ембеда staging не бачать) → новий `tools/record/main-css-diff.mjs`: `inventory` (кожен селектор ембеду проти DOM
   staging з JS після прокрутки) — збіги лише в глобальних `html` (rem ×3 смуги), `::-webkit-scrollbar`, `*`; `snapshot` / `diff` (JS off,
   rect + 31 обчислена властивість 1205 елементів і `::before/::after`, 4 смуги) до й після `remove_element`. Δ: 768 / 600 — лише `html
   overflow` auto → visible (`overflow-y: overlay` ембеду; скрол вʼюпорта той самий); 1440 / 375 — точність rem: ембед стояв після
   `styles-rem` і перебивав його усіченими `6.94444vw` / `26.66666vw` (99.9999 px), тепер точний `calc(10000vw / 1440)` = 100 px →
   кожен елемент ≤ 0.05 px, накопичено до низу сторінки 1.4 px (1440) / 1.8 px (375). Класові правила ембеду не тримали нічого.
5. Потім (окремо, етап 4): Lenis у `motion.js` (пінована версія, `lenis.on('scroll', ScrollTrigger.update)`,
   `gsap.ticker`, `prefers-reduced-motion` вимикає), `initPreloader({ lenis })` уже приймає інстанс.
