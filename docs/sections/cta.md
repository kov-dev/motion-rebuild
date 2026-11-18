# CTA — заявка студії (сесія 50, 2026-11-18)

Запит арт-директора: посилання «Made by Zajno» на сайті непомітні, тож відвідувача треба вести до заявки
прямо з Motion. Дизайну у Figma немає — зібрано в мові сайту (пілюлі, `heading-*`, тонкі лінії), рішення агента;
видимі зміни чекають відгуку користувача й арт-директора.

## Що додано

| Точка | Де | Розмітка |
|---|---|---|
| Бабл «made by zajno» | `site-nav` → `nb-panel`, перед тоглом меню; ≥768 | `div.nb-cta` > `button.nb-pill.is-invert` (`cta-open`, source `nav`) > `span.nb-cta-label-wrap` > `span.nb-cta-label` (`cta-label`) «made by zajno» + `.is-alt` «let’s talk» (hover — лейбл їде вгору, як menu / close) |
| Той самий бабл ≤767 | `site-sound` (схема лінії Sound), fixed ліворуч унизу | `div.cta-float` (`cta-float`) > `button.nb-pill.is-invert` (source `float`); ховається над футером разом із кнопкою звуку |
| Заклик у меню | `site-nav` → `nb-cards`, після 10-ї картки | `div.nb-end` (`nb-end`) > `p.heading-sm` + `p.body-md.nb-end-text` + кнопка (source `menu`); з'являється, коли трек довозить його у вікно |
| Заклик над футером | `site-footer` → `ft-content`, першим (під хмарами, над `ft-main`) | `div.ft-cta` > `p.heading-md.ft-cta-title` + `div.ft-cta-side` > `p.body-md` + кнопка (source `footer`). Шари хмар не чіпали |
| Модалка | компонент **`site-cta`** `95860475-3ddf-60d4-62c9-b14c09d62291` (System), інстанс останнім у Body Home `84d4078e-7221-3564-9429-ae4ac71d9a74` | `div.cta-modal` (`cta-modal`, role dialog) > `cta-backdrop` + `cta-panel` (`data-lenis-prevent`, semantic: base = світла) > `cta-head` (підпис + `button.nb-pill` `cta-close`) · `h2#cta-title.heading-sm.cta-title` · `p.body-md.cta-text` · форма |

Форма — **нативна Webflow** «Project request» (`form#cta-form.cta-form`, `cta-form`, method post): `cta-row` (Name*, Email*) ·
Company or website · About the project* (`cta-field` > `label.text-label.cta-label` + `cta-input` / `.is-area`) · ембед з прихованим
`Source` (`cta-source`: nav / float / menu / footer) і пасткою `Check` (`cta-trap`) · `input.nb-pill.is-invert` «send request».
Успіх — `cta-done` («Thank you!»), помилка — `cta-fail`. Заявки лежать у Webflow → Forms копії.

Нові класи: `nb-pill.is-invert` (схема навиворіт), `nb-cta`, `nb-cta-label-wrap`, `nb-cta-label` (+ `is-alt`), `cta-float`, `nb-end`,
`body-md.nb-end-text`, `ft-cta`, `heading-md.ft-cta-title`, `ft-cta-side`, `cta-modal`, `cta-backdrop`, `cta-panel`, `cta-head`,
`heading-sm.cta-title`, `body-md.cta-text`, `cta-form-block`, `cta-form`, `cta-row`, `cta-field`, `text-label.cta-label`, `cta-input`
(+ `is-area`, `:focus`, `::placeholder`), `cta-done`, `heading-sm.cta-done-title`, `cta-fail`. `nb-pill` отримав `cursor: pointer`.
Значення — [tools/record/fixtures/cta/proto.css](../../tools/record/fixtures/cta/proto.css) (прототип, 1:1 з класами).

## Код — `initCta()` у `src/motion.js`

- Криві студії: `EASE.enter` (0.17, 0.17, 0.43, 1), `EASE.exit` (0.57, 0, 0.83, 0.83), `EASE.move` (0.57, 0, 0.43, 1).
- Відкриття: фон 0 → 0.6 (0.36 с), лист справа (`xPercent 105 → 0`, 0.6 с; ≤479 — знизу), блоки листа по черзі; закриття 0.3 с.
- Сторінка замкнена (`lenis.stop()` / `html overflow`), меню під модалкою лишається відкритим і тримає замок; Esc спершу закриває модалку.
- Фокус: на `pointer: fine` — перше поле, на тачі — лист (клавіатура не вискакує); Tab у межах листа; після закриття — назад на кнопку.
- `Source` = `data-cta-source` кнопки; gtag `cta_open` / `cta_submit` (label = джерело; персональних даних у подіях немає).
- Захист від ботів до webflow.js (capture): довірена подія, порожня пастка, ≥ 1.5 с після відкриття.
- Дефолтний плейсхолдер Webflow «Example Text» знімається кодом (налаштування в MCP немає, атрибут `placeholder` MCP відхиляє).
- Після успішної відправки заголовок і текст запрошення ховаються (спостерігач за `style` форми).

## Перевірка

`tools/record/cta-run.mjs <root> <out> [1440|768|600|375] [--proto] [--live] [--reduce]` — бабл (місце, крихта уроку не налазить),
модалка з трьох джерел, замок сторінки, Tab, Esc, меню під модалкою, футер, відправка **із заглушкою `jQuery.ajax`** (жодна заявка з
тесту не йде): пастка → 0 запитів, недовірений submit → 0, справжній → 1 із `Source`, стан успіху. Сесія 50: 4 смуги + `--reduce` + `--live`
1440 / 375 — 0 прапорців; `nav-run`, `footer-run`, `sound-run` 1440 / 375 — 0.

## Відкрите

- Куди йдуть заявки: Site settings → Forms копії (пошта сповіщень, Bot protection / spam filtering) — крок користувача / студії.
- Тексти (заголовок, кнопки, поля) і сам вигляд — на відгук арт-директора; згода на обробку даних / посилання на політику — питання до студії.
- Футер виріс на ~3 rem: на низьких вікнах (≈2:1) останній екран починається з другого рядка заклику.
- `site-cta` стоїть лише на Home; на Styleguide бабли є (інстанси `site-nav` / `site-sound`), але без модуля нічого не відкривають.
