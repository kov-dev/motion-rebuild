# Navigation — навбар + повноекранне меню

Сесія 25 (2026-10-10). **Еталон — лайв** (`div.navigation.w-nav`, home-tree.md «Navigation»). Figma — довідка:
[navigation-figma.md](navigation-figma.md) (субагент sonnet: символ `Header` 1372×44, меню `1221:34806` / `1738:23158` /
`1738:23481`, Sound `675:12444`). Лайв-зонд — `tools/record/nav-probe.mjs` (struct / menu / scan / edge), IX2 — з
`reference/ix2-interactions.json` (`a-58` open, `a-88` close, `a-60` / `a-61` hover карток), логіка теми — `script.v33` блоки I / J
(`reference/script.v33.src.js` ~1122–1300).

## Розбіжності Figma ↔ лайв (переважає лайв)

| Що | Figma | Лайв |
|---|---|---|
| Шрифт пілюль (`motion.ed`, крихта, `menu`) | Inktrap 16/16, ls −0.48 | **Plain** 16/16, ls −0.5px; на 768 теж **16** (Figma tablet 14/14, padding 10/12 — на лайві 14/16 як desktop) |
| Картки меню | 3 / 5 / 3 намальовані, ілюстрації статичні, «активна» з radius 24 | 10 карток, **уся картка (рамка, номер, заголовок, ілюстрація) — Lottie** 280×546 (≤479: 206×404); стану «активна» немає, hover грає Lottie |
| Нижній рядок меню | 1440 «Site by Zajno» без соцмереж; 768/375 «Made by» + 5 іконок (spotify) | «Site by **Zajno**» + 5 іконок (dribbble, instagram, twitter, linkedin, **clutch**) на всіх смугах; ≤479 — колонкою, іконки над підписом |
| Лого у відкритому меню | окрема версія «очі з зірочками» | файл `header_logo_menu.json` є (`.logo-eye-menu`), але **ніколи не показується** (opacity 0, код його не чіпає) |
| Тогл ≤479 | 40×34, лише хрестик | 56×46 (padding .1rem .2rem, висота 100 %), лише іконка; лейбл `menu`/`close` прихований |
| Тема над Resources | кольорова `#C2D5D7` | **світла** (`.nav-light`), `#C2D5D7` — колір лише уроку zoom |

## Лайв-заміри

### Структура й геометрія (закрито)

Навбар `div.navigation` — `position: sticky; top 0; margin-bottom −1rem; z 14`, висота 1rem; усередині `nav-header` (padding-top /
бокові **.34rem** 1440, **.24rem** ≤991, **.22rem** ≤479) → `nav-panels` (роль `nav` для в'їзду з прелоадера: y −200 % → 0) → `nav-panel`
(flex, space-between).

| Елемент | 1440 | 768 | 375 | Стиль |
|---|---|---|---|---|
| Лого-очі (`a` → `/`) | 34,34 · 90×44 | 24,24 | 22,22 (`symbols-wrap` h 35) | 2 Lottie автоплей-луп 7 с (`header_logo_big_pupils` — на темній, `header_logo_tech` — на світлій/кольоровій) + 2 кола-підкладки `eye-bg-sections` Ø.4rem (фон = фон теми) |
| `motion.ed` (`a` → `/`) | 132,34 · 110.6×46 | 122,24 | 120,22 | пілюля: border 1px, radius .26rem, padding .14rem .16rem, Plain 16/16 ls −.005rem |
| Крихта уроку | 250.5,34 · 188.5×46 (easing) | 240.6,24 | **немає** (`display none`) | 8 `breadcrumb-item` одна над одною (absolute, крім першої), фон — колір уроку, border/текст `#0C0B0B`, lowercase; ширина за текстом |
| `menu` (`a` + `#menu-toggle`) | 1300.9,34 · 105×46 | 638.8,24 | 297,22 · **56×46** | пілюля + gap .16rem: лейбл-вікно (overflow hidden, `menu`, під ним `close` на top 104 %) + іконка 14×8: 2 лінії 14×3 radius 2, gap 2 |

Тексти крихт: «The Basics of easing», «Offset and Delay», «Fade in Fade Out», «Transformation/Morph», «Masking», **«Scale»**
(dimension, клас `is-scale`), «Parallax», «zoom». Кольори = `extra-lesson-*`: `#C8CFE8` `#D2C8E8` `#E4E8C8` `#C8E8E8` `#E8C8E5`
`#E8C8C8` `#D6E8C8` `#C2D5D7`.

### Меню (відкрито)

| | 1440 | 768 | 375 |
|---|---|---|---|
| `nav-menu` | fixed, 100 % × 100vh, `#0C0B0B`, z 1 (під шапкою, z 2) | те саме | те саме |
| Розкладка | `sticky-container` 100vh, flex row, center → трек 562 по центру (y 169) | трек y 231 | **колонка**, padding-top .8rem, gap .4rem; трек y 80 |
| Трек | `nav-track` overflow auto (горизонтальний), `nav-links-wrap` padding .16rem .34rem 0, scrollWidth 3228 | 3228 | 2389, padding-left .25rem |
| Картки | 10 × `a.nav-link` 2.8rem × 546, gap .4rem, x 34 + 320·i | те саме | 2.06rem × 404, gap .3rem |
| Нижній рядок | `nav-absolute`: absolute bottom .34rem, row space-between, padding 0 .34rem; Inktrap 16/28 ls −.0048rem; «Site by Zajno» (`a` zajno.com) ліворуч, 5 іконок 24×24 gap .16rem праворуч | те саме | у потоці, column-reverse, center, gap .24rem |

Посилання карток: `#hero #easing #delay #fade #morph #masking #dimension #parallax #zoom #resources`. Lottie карток (eager, 10 шт.):
`intro_menu`, `easing_menu`, `delay_menu`, `fade`, `morph`, `masking`, `dimension`, `parallax`, `zoom`, `sources` — 40 кадрів.
Соцмережі: dribbble.com/zajno, instagram.com/zajno, twitter.com/zajnocrew, linkedin.com/company/zajno, clutch.co/profile/zajno.

### Анімація меню (IX2 `a-58` / `a-88`, заміри кожні ~30 мс на 1440)

| Ключ | Відкриття | Закриття |
|---|---|---|
| `.nav-menu` display | block одразу | none через 0.2 с |
| `.nav-menu` opacity | 0 → 1, **0.2 с** (на 107 мс — 0.5) | 1 → 0, 0.2 с |
| `.nav-links` x | **4rem → 0, 0.6 с, easeInOut** (заміри лягають на `power1.inOut`: t .45 → .405, t .73 → .84) | → 4rem, 0.6 с (невидимо після 0.2 с) |
| `.toggle-label` y | 0 → **−104 %**, 0.3 с (`menu` іде вгору, `close` заходить) | → 0, 0.3 с |
| `.toggle-span.is-top` | rotate 45°, y +.02rem, 0.2 с | → 0 |
| `.toggle-span.is-bottom` | rotate −45°, y −.03rem, 0.2 с | → 0 |
| Код (блок J) | `html { overflow: hidden }` + `navDark()` | `overflow: overlay` (= auto) + тема секції |

- Hover картки (`a-60` / `a-61`, лише миша): Lottie кадр 0 → 40 за **0.67 с** (лінійно: 3 кадри / 50 мс), out — назад до 0 за 0.67 с з
  поточного кадру.
- Колесо над меню (≥768): `deltaY` + `deltaX` → `nav-track.scrollLeft` (300 → 300 px), сторінка не скролиться. ≤479 — нативний
  горизонтальний скрол треку пальцем.
- Клік по картці закриває меню (`menuToggle.click()`) і стрибає на якір. **Баг лайву:** на 375 клік «Offset and Delay» приземлився в
  Introduction (scrollY 14589 при цілі 13765 px нижче) — ліниві pin-и й `normalizeScroll` збивають якір. 1440 — точно (top −0.3).
- `#link1` (Introduction → `#hero`) ще й повертає кульку hero в x 0 (хак блоку J).

### Тема навбара по сторінці (скан кожні vh/4; 1440 / 768 / 375 — однакова послідовність)

Лінія навбара — `top+1px`, лінія Sound — `bottom−90px`; перехід 0.4 с (GSAP за замовчуванням, `power1.out`).

| Під навбаром | Тема | Пілюлі (фон / рамка+текст) | Лого | Крихта |
|---|---|---|---|---|
| Hero, Introduction | dark | `#0C0B0B` / `#FDFCFA` | big_pupils | сховано |
| Interactive | light | `#FDFCFA` / `#0C0B0B` | tech | сховано |
| Techniques | dark | | big_pupils | сховано |
| Урок 1–8 | color | колір уроку / `#0C0B0B` | tech | видно, лише крихта уроку |
| Демо easing (`nav-inner.nav-dark` у easing) | dark (вкладена; на виході — знову color) | | big_pupils | сховано |
| Resources | light | | tech | сховано |
| Футер (`.nav.nav-dark`) | dark | | big_pupils | — |

- **Resources → футер (баг лайву):** тема футера стартує зі зсувом на «довжину pin», порахованою вручну (`resourcesPinLen`) уже
  після лінивого pin-а, тому навбар темніє посеред **світлого** pin-а: 1440 — на 1838 px pin-а з ~4673 (~39–44 %, Sound — на
  1020 px), 768 — з ~96 %, 375 — після pin-а (resources.md). Футер у цей момент ще на 3700 px нижче.
- **375:** та сама послідовність тем (крихти сховані `display none`, але opacity перемикається). Навбар темніє лише в самому кінці
  сторінки (y 54329 з max ≈ 54330): верх футера вже під навбаром, а тема ще світла (зсув `resourcesPinLen` діє й тут).

## План компонента

**Компонент `site-nav`** (група System) — той самий навбар піде на шаблони CMS і Styleguide (на оригіналі — символ). На Home — інстанс
першим у Body після `styles-rem` (перед `section-preloader`: прелоадер z 1000 його накриває). Префікс класів **`nb-*`**: старі `.nav*`,
`.toggle-span`, `.breadcrumb-item`, `.logo-eye-*`, `.eye-bg-sections` читає `script.v33` (блоки I / J) по всій сторінці.

```
header.site-nav  data-motion="nb"  semantic: dark (на класі)   fixed top 0, w 100 %, z 14, pointer-events none (діти — auto)
├─ div.nb-bar  data-motion="nav"   padding .34 / .24 / .22rem; flex space-between, align start
│  ├─ div.nb-start  flex gap .08rem
│  │  ├─ a.nb-logo  href="/" aria-label="Motion — home"   90×44 (≤479 h 35), radius .24rem
│  │  │  ├─ div.nb-eye-bg.is-left / .is-right  Ø.4rem, top/left|right .02rem, bg var(semantic bg)
│  │  │  ├─ div.nb-eyes  data-motion="nb-eyes" data-theme="dark"  data-src=header_logo_big_pupils.json
│  │  │  └─ div.nb-eyes  data-motion="nb-eyes" data-theme="light" data-src=header_logo_tech.json   (absolute, opacity 0)
│  │  ├─ a.nb-pill  href="/"  «motion.ed»
│  │  └─ div.nb-crumbs  data-motion="nb-crumbs"  opacity 0; ≤479 none
│  │     └─ div.nb-pill.nb-crumb.is-<lesson>  data-motion="nb-crumb" data-crumb="<lesson>" ×8  (2–8 absolute, opacity 0)
│  └─ button.nb-pill.nb-toggle  data-motion="nb-toggle" aria-expanded="false" aria-controls="nb-menu"
│     ├─ span.nb-toggle-label-wrap  (overflow hidden; ≤479 none)
│     │  ├─ span.nb-toggle-label  data-motion="nb-toggle-label"  «menu»
│     │  └─ span.nb-toggle-label.is-close  «close»  (absolute top 104 %)
│     └─ span.nb-toggle-icon  14×8, column, gap .02rem
│        ├─ span.nb-toggle-line  data-motion="nb-line-top"     14×3, radius .02rem, bg currentColor
│        └─ span.nb-toggle-line  data-motion="nb-line-bottom"
└─ div.nb-menu  id="nb-menu" data-motion="nb-menu"  fixed inset 0, 100vh, bg neutral-1000, display none, z −1 відносно шапки
   ├─ div.nb-scroller  100vh, flex row center (≤479 column, pt .8rem, gap .4rem), overflow auto
   │  └─ div.nb-track  data-motion="nb-track"  overflow-x auto, scrollbar сховано
   │     └─ nav.nb-cards  data-motion="nb-cards" aria-label="Lessons"   flex gap .4rem (≤479 .3rem), padding .16rem .34rem 0 (≤479 left .25rem)
   │        └─ a.nb-card  href="#…" aria-label="<назва>" ×10   2.8rem × 5.46rem (≤479 2.06 × 4.04)
   │           └─ div.nb-card-lottie  data-motion="nb-card-lottie" data-src=<…_menu.json>
   └─ div.nb-bottom  absolute bottom .34rem, row space-between, padding 0 .34rem (≤479 у потоці, column-reverse, center, gap .24rem)
      ├─ div.nb-credit  «Site by » + a.nb-link «Zajno» (zajno.com, new tab)     Inktrap 16/28, ls −.0048rem
      └─ ul.nb-socials  gap .16rem > li > a.nb-social (aria-label) > HtmlEmbed SVG 24×24 (ті самі SVG, що у футері, `currentColor`)
```

- **Тема через змінні, а не 7 твінів:** пілюлі, лінії тогла й кола під очима пофарбовані змінними `semantic` (`bg` / `fg`; точні
  CSS-імена — `--_semantic---…`, звірити при збірці). Код твінить ці дві custom properties на `header.site-nav` — один `gsap.to`
  на тему. Режим `dark` на корені — те, що видно в Designer.
- **Крихти** лишаються 8 елементами (кросфейд за шириною тексту — як на лайві); фон — комбо `is-<lesson>` зі змінною
  `extra-lesson-<lesson>`. `data-crumb` = id уроку без `-next`.
- **Шрифт пілюль:** Plain 16/16, ls −0.5px (≈ −0.031em) на всіх смугах. Наявний `text-label` (Inktrap, `text-16-label` 16/14/14)
  **не підходить** — окремий стиль `text-nav` (Plain, 16 на всіх смугах, lh 1, ls −0.031em) або літерал у `nb-pill`; вирішити при збірці.
- `logo-eye-menu` **не переносимо** (на лайві ніколи не видно) — мінус один eager-Lottie.
- Картки — посилання з `aria-label` (на лайві в картці немає тексту, лише SVG Lottie).
- **Перехід «поруч зі старим»:** старий `.navigation` ховаємо CSS-правилом у head-сніпеті (`.navigation{display:none}`) — елементи
  лишаються в DOM, тож блок J `script.v33` не падає. Посилання карток поки на `#<урок>-next` / `#resources-next` / hero; на справжні
  id — разом із видаленням старих секцій.
- `data-theme` додати: `section-resources` → `light`, `site-footer` → `dark` (див. нижче — старт теми футера).

## План анімації (код, `initNav()` + `initTheme()`)

| Що | Як | Числа |
|---|---|---|
| Тема | `initTheme()`: усі `[data-theme]` (секції, уроки, демо, resources, футер) → по одному `ScrollTrigger` з `start: 'top top+=1'`, `end: 'bottom top+=1'`, `onToggle` → активна = **найглибша** активна (демо в easing перекриває урок, на виході — знову урок). Pin-и наші, з `pinSpacing`, тож без ручних зсувів | 0.4 с, `power1.out` |
| Застосування | dark → bg `neutral-1000`, fg `neutral-0`, очі dark; light — навпаки, очі light; color → bg = `getComputedStyle(секції).backgroundColor`, fg dark, очі light, крихти opacity 1 і лише `data-crumb` = id уроку | 0.4 с |
| Resources → футер | **Рішення агента (виправлення бага):** світла тема на весь pin Resources; темна — коли оверлей `res-overlay` ≥ 50 % (прогрес тригера футера 0.25: окремий тригер з тією ж формулою старту, що в `initFooter()`). Однаково на всіх смугах | |
| Лінія Sound | той самий механізм з лінією `bottom−=90px` → прохід Sound (`applyTheme(target, theme)` спільний) | |
| В'їзд | уже є: `heroEntrance()` бере роль `nav` (y −200 % → 0, 0.6 с, delay 0.2, `(.17,.17,.29,1)`) | |
| Відкриття меню | таймлайн: `nb-menu` display block → opacity 0 → 1 (0.2 с); `nb-cards` x 4rem → 0 (0.6 с, `power1.inOut`); лейбл y 0 → −104 % (0.3 с); лінії ±45° і y +.02 / −.03rem (0.2 с); `html` overflow hidden; тема → dark; `aria-expanded` | точні ease opacity / лейбла — підібрати в `nav-run.mjs` проти семплів лайву (`nav-menu-*.txt`) |
| Закриття | opacity → 0 (0.2 с) → display none; лейбл, лінії назад; cards x → 4rem після ховання; overflow відновити; тема секції | |
| Esc, клік по картці | закрити меню; клік — потім скрол до цілі (`target.getBoundingClientRect().top + scrollY`, наші pin-spacer-и в DOM — якір влучає; виправляє баг 375) | |
| Hover карток | ліниве завантаження 10 Lottie (lottie-web 5.13.0, як Interactive) **при першому відкритті меню**, не eager; hover ≥992 і `pointer: fine`: кадр → кінець за 0.67 с `none`, out — назад до 0 за 0.67 с | 40 кадрів |
| Колесо | над меню `wheel` → `nb-track.scrollLeft += deltaX + deltaY` (passive false), без Firefox-множника (за `deltaMode`) | |
| Лого | 2 Lottie автоплей-луп (lottie-web), кросфейд opacity за темою | 0.4 с |
| Reduced motion | меню без зсуву карток (лише opacity), тема без твіну | |
| Звуки кліків (`sound_click`) | етап 4 / прохід Sound | |

## Перевірка (наступна сесія)

- `nav-compare.mjs`: статика `site-nav` проти старого `.navigation` на тій самій staging-сторінці (закрито й відкрито, 4 смуги).
- `nav-run.mjs`: тема по секціях (послідовність таблиці вище, нові секції на staging), семпли меню проти `nav-menu-*.txt`, hover-кадри,
  колесо, Esc, клік по картці → ціль у top ±2 px.
