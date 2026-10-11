# Sound — кнопка звуку й звук сайту

Сесія 28 (2026-10-11). **Еталон — лайв** (`div.fixed-bottom` → `.sound-btn-wrap` → `.sound-icon-wrap`, home-tree.md «Sound button»).
Figma — довідка: символ `Sound` `675:12444` (48×44, `#0C0B0B`, border 1px `#FDFCFA`, radius 26, padding 14/16, іконка 16×16;
кольорових варіантів у макеті немає — navigation-figma.md «Sound»). Лайв-зонд — `tools/record/sound-probe.mjs` (struct / enter /
scan / footer / click), IX2 — `reference/ix2-interactions.json` (`a-130` hidden, `a-131` visible на тригері `footer`
SCROLL_INTO_VIEW / OUT_OF_VIEW, `a-161` в'їзд), звук і gtag — inline-скрипти Home footer лайву (`reference/live-home-2026-10-09.html`),
тема — `script.v33` блок I (лінія `bottom-=90px`).

## Розбіжності Figma ↔ лайв (переважає лайв)

| Що | Figma | Лайв |
|---|---|---|
| Кольори | завжди чорний з білою обводкою | тема за секцією під лінією `bottom−90px`: dark / light / колір уроку (як навбар) |
| Стан «вимкнено» | немає | діагональна лінія 18×18 поверх динаміка (`.sound-btn-mute`, opacity 1 = вимкнено, transition .4 с); фон кнопки **не** міняється (правило `.sound-icon-wrap.is-active` з `main-css` ніколи не спрацьовує — клас ставиться на `.sound-btn-mute`, а не на `.sound-icon-wrap`) |
| 768 / 375 | 40×34 (768 `869:19256`, 375 `918:26484`) | **48×44 на всіх смугах**; відступ від краю 34 / 34 / 22 |
| Над футером | у фіналі Resources немає | ховається, щойно футер входить у в'юпорт |

## Лайв-заміри

### Структура (однакова на 1440 / 768 / 375)

```
div.fixed-bottom          fixed, left/right 0, bottom .34rem, z 11, flex, justify flex-end, padding 0 .34rem (≤479 .22rem)
└─ div                    (без класу)
   └─ div.sound-btn-wrap  IX2-ціль: inline transform scale3d(0,0,1) на старті; в'їзд, ховання
      └─ div.sound-icon-wrap  .48 × .44rem, flex center, bg #0C0B0B, color #FDFCFA, border 1px #FDFCFA, radius .26rem, cursor pointer
         ├─ div.sound-btn-icon.w-embed   .16rem, svg 16×16 динамік `fill currentColor`
         └─ div.sound-btn-mute.w-embed   absolute (центр через flex-static), .18rem, z 1, opacity 0, transition opacity .4s;
                                         `.is-active` → opacity 1 (= вимкнено); svg 18×18 лінія `stroke currentColor` 2px
```

Бокс кнопки: 1440 — (1358, 822) 48×44; 768 — (686, 946) 48×44; 375 — див. `sound-struct-375.json` (x = 375 − 22 − 48 = 305).
Стартовий стан сторінки: `.sound-btn-mute.is-active` (звук **вимкнено**), inline-скрипт ставить клас одразу.

### В'їзд (IX2 `a-161`, PAGE_START)

`scale 0 → 1` за **0.6 с**, `(.17,.17,.29,1)`, стартує разом із навбаром (`.nav-panels` y −200 % → 0): 1440 — обидва з +7.45 с після
load, 768 — з +8.06 с; кінець 1440 +8.04 с (591 мс). У коді вже є: `heroEntrance()` бере роль `sound-btn` (сесія 9), стартовий `scale 0`
ставить `heroHidden()` під оверлеєм (сесія 28).

### Ховання над футером (IX2 `a-130` / `a-131`, тригер — символ футера, офсет 0)

| Ключ | Ховання (футер увійшов у в'юпорт) | Показ (вийшов) |
|---|---|---|
| `.sound-btn-wrap` opacity | 1 → 0, **0.2 с**, лінійно | 0 → 1, 0.2 с |
| `.sound-btn-wrap` scale | 1 → 0, **0.4 с**, лінійно | 0 → 1, 0.4 с (display block першим) |
| display | none після обох (≈ +0.41–0.44 с) | block одразу |

Межа: верх футера = низ в'юпорта (1440: footTop 900 → shown, 880 → hide). Семпли кожні ~27 мс — `sound-footer-1440.txt`: opacity
1 → 0.83 → 0.67 … 0 за 191 мс, scale 0.917 → … → 0 за 411 мс, display none на +440 мс; показ дзеркально. Кінець сторінки на 1440:
футер 469 px < vh, тож на max scroll кнопки немає.

### Тема по лінії `bottom − 90px` (scan vh/4, 1440; 768 / 375 — та сама послідовність)

| y (1440) | Секція під лінією Sound | Кнопка (фон / рамка+іконка) | Навбар у цей момент |
|---|---|---|---|
| 0 | hero dark | `#0C0B0B` / `#FDFCFA` | dark |
| 20700 | interactive light | `#FDFCFA` / `#0C0B0B` | ще intro dark |
| 22950 | techniques dark | | interactive light |
| 25200 | easing color `#C8CFE8` | колір уроку / `#0C0B0B` | techniques dark |
| 28125 | демо easing (`.nav-inner.nav-dark`) dark | `#0C0B0B` / `#FDFCFA` | easing color |
| 31725 | easing color (після демо) | | демо dark |
| 36675 … 58275 | delay … zoom color | колір уроку | попередній урок |
| 62550 | resources light | `#FDFCFA` / `#0C0B0B` | zoom color |
| далі | футер — кнопка схована | | resources light → dark від оверлею 50 % |

Перехід 0.4 с (`gsap.to` за замовчуванням). Та сама логіка, що для навбара, лише лінія інша: кнопка міняє тему **раніше** за навбар
(лінія на 810 px нижче), тому в один момент вони часто різних тем — так і на лайві.

### Звук (inline-скрипти лайву, 13 `<audio>` у footer code, `preload="metadata"`)

| Що | Файл `cdn.zajno.com/dev/motion/sounds/` | Коли |
|---|---|---|
| Фон | `motion_bg_low_vol.mp3`, `loop` | клік по кнопці: `play()` / `pause()` (без перемотки — продовжує з місця паузи) |
| Клік | `perc_click.mp3` | клік по `.sound_click` (3: лого, `motion.ed`, тогл меню), `currentTime = 0` перед `play()` |
| Hover карток меню | `hover_1 … hover_10.mp3`; порядок **1 2 3 8 5 6 7 4 9 10** для `#link1 … #link10` | `mouseenter` картки, `play()` без перемотки |
| Hover Not real-time | `1_NOT_REAL_TIME.mp3` | `mouseenter` `#notrealtime` (Interactive) |
| Зіткнення сфери | `sound_2_filter-2-cut.mp3` (Web Audio) | `sphere.js`, читає `soundOn()` |

Усе грає лише коли `playing` (фон увімкнено). gtag: `sound_on` / `sound_off` (`event_category: Sound`, `event_label: Sound On|Off`) при
кожному кліку, через `dataLayer`. Зонд `sound-click-1440.txt`: клік 1 → `is-active` знято, фон грає, `dl: sound_on`; hover `#link2` →
`audioHover2` грає; клік 2 → пауза, `sound_off`.

## План компонента

**Компонент `site-sound`** (група System; піде на шаблони CMS і Styleguide разом з `site-nav` / `site-footer`). Префікс класів
**`snd-*`**: старі `.sound-btn-wrap` / `.sound-icon-wrap` / `.sound-btn-mute` читають inline-скрипти лайву й блок I `script.v33`.

```
div.site-sound  data-motion="snd"                fixed right/bottom .34rem (≤479 right .22rem), z 11, semantic: dark (на класі), color foreground
└─ button.snd-btn  type=button data-motion="sound-btn" aria-label="Sound" aria-pressed="false"
   │                                                .48 × .44rem, flex center, padding 0, border border-1 + semantic border, bg semantic bg,
   │                                                color semantic foreground, radius .26rem, cursor pointer, position relative
   ├─ HtmlEmbed.snd-icon                            .16rem, svg динаміка лайву (`aria-hidden`)
   └─ HtmlEmbed.snd-mute  data-motion="sound-state"  absolute, .18rem, z 1, opacity 1, transition opacity .4s; комбо `is-on` → opacity 0
```

- **Стан звуку — у DOM:** `is-on` на `snd-mute` (`[data-motion="sound-state"]`) = звук грає; `soundOn()` у `motion.js` читає саме це
  (сфера, hover-звуки). Назва комбо — за WEBFLOW-BASE §10.3 (`is-*` маркери JS-станів). Без JS лінія видима (= вимкнено), як на лайві.
- **Тема через ті самі змінні `semantic`,** що й навбар: `paintScheme(root, scheme)` тепер спільна (винесена з `paintNav()`), код твінить
  `--_semantic---bg / foreground / border` на `div.site-sound`.
- Повноширинного `fixed-bottom` немає: корінь — лише бокс кнопки в правому нижньому куті (ті самі координати).
- `<button>` замість `div` з курсором; `aria-pressed` відображає стан. `type="button"` щоб не сабмітити форми шаблонів.
- Старий `.fixed-bottom` до сесії 30 ховався правилом `legacy-hide.css` у head Home, видалений у кроці 2 [legacy-removal.md](../legacy-removal.md) (тоді елементи лишались: їх читали inline-скрипти лайву,
  `playing` там назавжди `false`, тож старі `<audio>` мовчать).

## План анімації (код)

| Що | Як | Числа |
|---|---|---|
| В'їзд | `heroHidden()` ставить `scale 0` під оверлеєм; `heroEntrance()` → `scale 1` разом із навбаром | 0.6 с, delay 0.2, `(.17,.17,.29,1)` |
| Тема | `initTheme()` — **дві лінії**: `nav` (`top top+=1`, футер від прогресу 0.25) і `sound` (`top bottom-=90px` / `bottom bottom-=90px`); одна й та сама вибірка «найглибша активна зона», своя схема на лінію; `paintSound()` → `paintScheme(div.site-sound)` | 0.4 с `power1.out`; reduced motion — без твіну |
| Ховання над футером | `initSound()`: `ScrollTrigger` на `site-footer` `top bottom` / `bottom top`, `onToggle` → hide / show кнопки (`scale` + `opacity`, display none після) | opacity 0.2 с, scale 0.4 с, лінійно; reduced motion — миттєво |
| Клік | `is-on` на лінії, `aria-pressed`, фон `play()` / `pause()`, gtag `sound_on` / `sound_off` (лише якщо `window.gtag` є) | лінія — CSS transition .4 с |
| Ефекти | `playSound(name)`: клік — `nb-logo`, `nb-home`, `nb-toggle` (`perc_click`, з перемоткою); hover карток меню `hover_i` за лайвовим порядком; `interactive-hover` → `1_NOT_REAL_TIME`; усе лише при `soundOn()` | `<audio>` створюються ліниво при першому зверненні, `preload auto` |
| Сфера | без змін — `createSphere(wrap, { soundOn })` | |

**Рішення агента (карт-бланш):** (1) аудіо не вставляються в DOM і не вантажаться до першого ввімкнення (лайв тягне metadata 13
файлів на старті); (2) `aria-label` сталий «Sound», стан — `aria-pressed`; (3) hover-звук грає на будь-який `pointerenter` (лайв —
`mouseenter`, що на тачі спрацьовує при тапі так само); (4) gtag — лише через глобальний `gtag()` (на копії GA4 ще немає — етап 6).

## Перевірка

`tools/record/sound-run.mjs` (PART=enter,theme,footer,toggle; `--live`, `--reduce`): в'їзд (scale 0 під оверлеєм, старт разом з навбаром
±50 мс, 0.6 с), тема по лінії `bottom−90` для всіх зон + демо + середина pin-а Resources + назад, довжина твіну; ховання / показ над футером
покадрово проти моделі `a-130` / `a-131` і межа ±20 px; тогл — `is-on`, `aria-pressed`, фон play / pause, gtag (перехоплюються `gtag()` і
`dataLayer.push`), hover карток 2 → `hover_2`, 4 → `hover_8`, клік тогла → `perc_click`, Not real-time → `1_NOT_REAL_TIME`, тиша при
вимкненому. Результати — CONVENTIONS.md, журнал сесії 28.
