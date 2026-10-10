# Interactive

## Джерела
- Figma: файл `KJQjG15P2P3SkXwrJJxLOp`, секція-обгортка `4611:22244` («Section 130», 5543×4881). Усередині **4 кадри 1440×750** (десктоп, розкадровка скролу; одна й та сама назва «4-Interaction with the interface.(1…4)») і символ-компонент `Interactive_circle` (`702:14031`, 1758×570, поза кадрами, x 2757 y 637):
  1. `702:13803` (@541,547) — старт: великий заголовок, кола визирають знизу
  2. `702:13849` (@541,1484) — заголовок зменшений і вгорі, кола піднялись
  3. `702:14171` (@541,2421) — заголовок зник, ряд кіл по центру по висоті
  4. `702:14279` (@541,3358) — ряд зсунутий ліворуч на 386, видно 2-ге й 3-тє коло повністю
- **768 і 375 в обгортці немає.** На дошці Full design є: 768 `869:19256` (768×1024), 375 `918:26484` (375×667) — **лише один початковий кадр** кожного (заголовок + вершечок першого кола); розкадровки скролу для ≤991 нема. Еталон ≤991 — лайв-запис mobile (правило сесії 5).
- Лайв: `section.is-interactive#interactive` (`nav nav-light`), запис `reference/recordings/desktop/04-interactive.*` (77–85 с) і `mobile/04-interactive.*`. DOM: `docs/home-tree.md` §3.
- Спільне з Navigation (НЕ частина секції): `Header` 1372×44 @34,34/36, `Sound` 48×44 @1358,672 (radius 26), `Item_scroll` («scroll down») 148×44 @34,672; другий `Item_scroll` 231×54 @605,-96 — поза кадром угорі, не переносити.
- Дивний шар у кадрі 1: `Rectangle 12578` (`702:13927`) 605×605 @3738,-388 — далеко за межами кадру, без вмісту ролі; **ігнорувати**.

## Структура (ролі; координати відносно кадру 1440×750)
- `section-interactive` (`section is-interactive#interactive`, bg White `#FDFCFA`, nav-light) — фон секції на лайві світлий, не `BG`
  - `interactive-head` — `content-wrap.is-interactive`: **заголовок «Interactive»** (`702:13848` кадр 1: 1159×170 @141,295; `702:14101` кадр 2: 385×58 @528,176), text-align center, uppercase. `data-motion="interactive-title"`
  - `interactive-pin` (`height-section.is-interactive`, `data-motion="interactive-track"`) — pin-контейнер із висотою скролу; всередині `interactive-track-flex` → `interactive-track` (`track-padding`) — горизонтальна стрічка
    - `interactive-item.is-intro` (`horizontal-item` №1) — коло Ø570 «Head» (`I702:14032;702:13887`): тло-коло `BG` (SVG `…13888`), текстовий блок `…885:24024`
      - `interactive-text` — 2 абзаци по центру: жирний «There are two types of interactive interfaces:», далі «**Real-time** respond as users interact with them.» і «**Not real-time** respond after the interaction has taken place.» (порожні рядки-розділювачі між ними = відступ 24 → `margin`)
    - `interactive-item.is-realtime` (№2) — коло Ø570 (`…702:13986`): тло-коло (SVG повернутий 90°, `…13891`), підпис «Real-time» (`…13892`, по центру), `interactive-sphere` = `#canvas` (`data-motion="interactive-sphere"`; у Figma — статична картинка куль `Circle` `…13984`, 487×~482 @ inset 13.86/34.41/0.18/34.41 %)
    - `interactive-item.is-notrealtime` (№3) — коло Ø570 (`…702:13987`): тло, підпис «Not real-time» (`…13989`), `interactive-lottie` (`h-item-lottie`, `data-motion="interactive-lottie"`, у Figma `Circle` `…13990`, inset 7.02/2.1/3.33/69.91 %), `interactive-lottie-hover` (`#notrealtime`, hover-зона)
  - Навігація (`Header`, `Sound`, `Item_scroll`) — окремі секції/компоненти, тут не будуються

## Токени (Figma → значення; зараз з `get_variable_defs` 4611:22244)
- Кольори: `BG` `#0C0B0B` (текст, лінії кіл, кулі), `White` `#FDFCFA` (фон кадру, світла секція).
- `Desktop/H2` = PP Neue Machina Plain Regular 160/170, ls -4 (= -0.04em, -6.4px), UPPERCASE, колір #0C0B0B → **`display-lg`** (`text-160`, lh 1.06, ls −0.04em, UP) ✓ збігається.
- `Desktop/P3` = Plain Regular 16/24, ls -2 (−0.02em) → **`body-sm`** (підписи «Real-time»/«Not real-time» і звичайні шматки тексту, ls -0.32px = −0.02em ✓).
- Жирні шматки («There are two…», «Real-time», «Not real-time») = Inktrap **Ultrabold** 16/24 → **`body-sm` + `is-strong`** (Inktrap 700, ls 0 — звірити, що Ultrabold = 700 у шрифті проєкту; CONVENTIONS каже `.p3-bold` = `is-strong`).
- Заголовок у кадрі 2 (385 ширини): 385/1159 ≈ 0.332 → ≈ 53 px при тих самих ls/регістрі. Це **той самий текст у масштабі ~0.33**, а не окремий стиль: або `font-size` анімується 160→~53, або `scale`. Лайв-запис показує, що заголовок зменшується й їде вгору. `heading-sm` (54, ls 0) за ls **не збігається** (на макеті ls -0.04em) → не брати; варіант — анімувати `scale` на `display-lg`. Потрібно звірити на лайві (див. питання).
- Розміри: коло **570×570** (діаметр; stroke ~1px чорний, без заливки; лише контур), гап між колами **24**, 3 кола = 1758 (570·3+24·2); першу колонку починає x=34 (поле 34 = gutter сторінки). Крок між центрами 594.
- Тіні/градієнти/радіуси: немає. Кулі — чорні кола Ø≈55 (≈0.0965 від діаметра кола), у контакті з білою обводкою ~1px (видно на макеті світла лінія між кулями).

## Розкладка (px макета; rem = px/100)
- **1440**: фрейм 1440×750, pin 100vh. Ряд кіл `Interactive_circle` 1758×570 з початком x=34. По вертикалі (top кіл): кадр 1 y=629 (видно 121 px знизу, під заголовком), кадр 2 y=296, кадр 3–4 y=102 (кола центровані: 102..672, поля 102 згори, 78 знизу до нижнього краю 750; Navigation-елементи на 672–716). Тобто **вертикальний зсув 629→296→102** — рух ряду вгору при вході, потім стоїть.
- Горизонтальний зсув: кадр 3 x=34 → кадр 4 x=-352 (Δ 386). У макеті показано лише часткову (до моменту, коли третє коло повністю в кадрі: правий край 1406 = 1440−34). Повний шлях (до виходу з секції) у макеті **не намальований** — на лайві `scrollWidth − vw` (script-map G).
- Заголовок: кадр 1 — центрований, y 295..465 (на відстані ~165 від верху кіл), по центру 720.5; кадр 2 — центр y≈205, ширина 385; кадр 3–4 — немає (виїхав угору/сховався).
- Текстовий блок у першому колі: бокс ≈ 372 ширини (inset 5.63 % / 73.15 % від 1758 → x 99..472 в межах 570-кола), по центру, вертикально центрований (inset 33.16 %): 4 + 2 + 2 рядки = ≈ 8×24 = 192 px висоти.
- Підписи «Real-time»/«Not real-time» — по центру кола (inset 47.89 % зверху/знизу → центр по y 285 у колі).
- **768** (`869:19256`, лише 1 кадр): ряд кіл `Interactive_circle` той самий 1758×570 @104,761 (кола **НЕ масштабуються** на макеті 768, Ø570 лишається, видно лише верх першого кола знизу), заголовок 672×100 @48,447 (display-lg на 768, ≈ 100 висоти → розмір шрифта ≈ 96–100, звірити зі стилем `text-160` tab), Sound 40×34 @704,966. Сафарі-хедер/навбар — з Navigation.
- **375** (`918:26484`): лише заголовок 336×55 @20,306 (шрифт ≈ 55-ліній, `display-lg` mob), Sound 40×34 @313,517; кіл у кадрі взагалі нема (вони нижче).
- **Лайв mobile (еталон ≤991)** (sheet 2160×1564): заголовок спочатку по центру-низу, поступово виїжджає вгору й **зменшується**; кола ~0.9 vw діаметром (≈ 306–340 px на 375), текстове коло та «Real-time»/«Not real-time» ідуть рядом по горизонталі, пін на екрані по центру; на 768 лайв-запису окремо нема (використати tablet-стилі Webflow).

## Ассети
- `Interactive_circle` (символ, `702:14031` / інстанси `702:14032` 1440 кадр 1, `702:14102`, `702:14176`, `702:14283`) — 3 кола. Внутрішні SVG: `BG` (Head `702:13888`, Realtime ×2 `702:13891` / `…13988` — повернуті 90°), `Circle` (кулі Realtime `…13984` і Not-real-time `…13990`). Усе — вектори, 7 днів на сервері Figma. **Не завантажувались** (за завданням).
- Лайв: контури кіл на лайві — це не картинки Figma, а фон `item-canvas`/`h-item-lottie` (CSS border-radius 50% + border 1px, або SVG-фон; звірити в Webflow-стилях). Кулі:
  - Real-time: **Matter.js** у `#canvas` → `canvas.sphere-canvas` (JS-створений), 35 куль (15+20), радіус `size/15`, чорні; модуль `sphere.js` (блок F).
  - Not real-time: **Lottie** `64187ee0d634cb715e836e02_not_real_time.json` у `div.h-item-lottie`; ix2 hover по `#notrealtime` грає кадри/звук.
- Звукові файли hover (`#notrealtime` → `<audio>`), sound toggle — з Navigation/script-map (13 `<audio>`).
- Figma-статичні картинки куль — довідка станів (положення куль у кадрах 2–4 різні: у Real-time купа на дні, у Not real-time — розсип по колу «петля») → у коді НЕ використовувати.

## Анімація (розкадровка → лайв)
Кадри — стани одного pin-скролу. IX3 тут не годиться (pin + горизонтальний зсув за scrollWidth, ініціалізація Matter.js, звук) → **код** `motion.js` (GSAP ScrollTrigger), прив'язка `data-motion="interactive-track"`.
1. **Вхід (кадр 1→2)**: тригер — секція входить у viewport (світла `nav-light`), скрол без pin. Ціль `interactive-title`: `scale/font-size` 160→≈53, `y` вгору (центр 380→205 в px макета); `interactive-track` піднімається `y` 629→296. Ease: на лайві scrub (ймовірно `none`/scrub:1) — звірити з кодом.
2. **Pin + підйом (кадр 2→3)**: `interactive-pin` `position:sticky/pin`, ряд піднімається `y` 296→102 (кола центруються), заголовок зникає (виїжджає вгору/opacity 0 — звірити).
3. **Горизонтальний зсув (кадр 3→4→…)**: ScrollTrigger `scrub`, `x` від 0 до `−(scrollWidth − vw)` (макет показує проміжок −386). Довжина pin = ширина стрічки (1758 + 2·34 − 1440 = 386 у макеті 1440; **на лайві більше**, бо є додаткові поля/відступ виходу — звірити). Є `once` → `initSphere()` при першому вході (блок G).
4. **Сфера Matter.js** (блок F, `interactive-sphere`): 35 куль у невидимій круглій клітці з 32 статичних пегів, відштовхування від курсора, drag, гравітація scale 0.0025, звук зіткнень (Web Audio, panner за місцем зіткнення, ≤2 голоси). Кулі при першому відкритті падають на дно (у Figma кадр 2–4 — купа на дні).
5. **Нахил гравітації за скролом** (`gravity.x = −direction/2`) — **на лайві мертвий** (script-map п. 15; тригер `.is-interactive.wf-section` не спрацьовує). Рішення за користувачем (див. питання).
6. **Lottie not_real_time** (`interactive-lottie`): грає на hover по `#notrealtime` (ix2 `PLUGIN_LOTTIE`) + звук. На лайві — пересмикування анімації кульок «петлею». У Figma кадр 4 показує «розсип куль по колу» — це кадр Lottie, не рух по скролу.
7. **Вихід**: після останнього кола — виїзд до Techniques (плашки INTERFACE/ANIMATION, чорна секція): на записі desktop 04-interactive та mobile; у цьому макеті не намальований (належить Techniques).

## Розбіжності Figma ↔ лайв (лайв = істина)
- Figma: 4 кадри скролу 1440, жодного pin-довжини/зсуву до кінця; лайв — повний горизонтальний трек і вихід у Techniques.
- Figma: кулі статичні картинки; лайв: Matter.js (Real-time) + Lottie (Not real-time).
- Figma кадр 4 (x −352) — лише початок зсуву; на лайві стрічка їде далі до виходу.
- Заголовок: Figma кадр 2 → ≈ 53px вгорі; на лайві заголовок «зменшується й залишається» тільки поки видно кола — звірити фінальний розмір (на 04-interactive.sheet.png desktop кадр 4 — заголовок вгорі, обрізаний 1/3).
- Figma `Sound` 48×44 radius 26 з'являється лише у кадрах 3–4 (у 1–2 його нема — прихований/іншого стану); на лайві Sound є завжди (Navigation).
- На лайві тло секції `#FDFCFA` і `nav-light`; кадри Figma білі — збігається. У фреймі 1 під colour `BG` тільки текст/контури.
- Просвіт між першим і другим колом 24 (Figma) vs лайв: звіряти по `track-padding` (у лайв-sheet кола майже торкаються контуром при 1440 — підтвердити).
- Нахил гравітації за скролом: лайв не працює (мертвий код), кадри Figma цього не показують → вирішується окремо.
- ≤991: Figma 768/375 малюють лише першу композицію (кола 1758×570 не масштабовано!), лайв-mobile має кола ≈ 0.9vw; брати лайв.
- Іменування: Figma `Interactive_circle/Head/Realtime/Circle/BG` ↔ лайв `horizontal-item/h-item-content/item-canvas/h-item-lottie/h-lottie-hover`.

## Питання до користувача
1. Нахил гравітації кіл за скролом (`gravity.x = −direction/2`): відновити задуману поведінку чи лишити, як на лайві (мертвий)? (знайдено в script-map п. 15)
2. Заголовок «Interactive» зменшується з ≈160 до ≈53: анімувати `font-size` чи `scale`? Фінальний стан на лайві (ловити з відео вручну) — вгорі чи зникає?
3. Для 768/375: брати лайв (кола ≈ 0.9vw) чи будувати за Figma (Ø570 без масштабування)? Рекомендація — лайв.
4. Ширина pin-скролу: взяти формулу лайву (`scrollWidth − vw`) чи фіксувати у `vw`, щоб міг працювати IX3 scroll-scrub?
5. Звук: чи лишається hover-звук `#notrealtime` і звук зіткнень сфери (залежить від глобального Sound toggle з Navigation)?

## Що треба від головної сесії
- Рішення по п. 1 (нахил гравітації) і п. 3 (≤991 за лайвом).
- Підтвердити, що Lottie `64187ee0d634cb715e836e02_not_real_time.json` і Matter.js-код (`sphere.js`, блок F) беруться з копії/src без змін, а Figma-картинки куль не використовуються.
- Підтвердити токени: `display-lg` для заголовка, `body-sm` / `body-sm.is-strong` для текстів (нових текстових стилів не потрібно; `interactive-title` для зменшеного стану — анімація scale, не новий стиль).
- Дані, яких нема у Figma і треба зняти з лайву/Webflow: точні тривалості/ease (скрол-таймлайн), `track-padding` / фінальна довжина pin, стилі контурів кіл (CSS/SVG), tab/mob розміри кіл і заголовка.
- Узгодити, чи секція Interactive будується одразу з Techniques (спільний вихід), бо кінець треку й чорні плашки на лайві йдуть безперервно.

## Лайв-заміри (сесія 13, головна сесія) — закривають питання вище

`tools/record/interactive-probe.mjs` (лайв, колесо → Lenis, 1440×900 / 768×1024 / 375×812 тач):

- **Заголовок НЕ зменшується.** `h2` весь час `transform: none`, 160 / 100 / 50 px, просто їде вгору зі скролом. Зменшення
  (кадр 2 Figma) — лише розкадровка дизайнера, на лайві його немає. Беремо лайв: **анімації заголовка немає** (п. 2 закрито).
- **Pin:** `height-section` 100vh, pin `top top`, `x: −(scrollWidth − vw)`, `ease: sine.out`, `scrub: 1`,
  `end: +=shift`, `anticipatePin: 1` (script-map G). Зсув: **852 / 1224 / 827 px** = 34 (pl) + ширина треку − vw.
  Трек = 3 кола + 2 гепи + `padding-right` **5 / 2 / 1rem** (запас, щоб останнє коло доїхало до середини).
- **Кола:** Ø **5.7rem** на 1440 і 768 (на 768 НЕ масштабуються, як і у Figma 768), **3.44rem** на 375; геп .24rem;
  поле .34 / .22rem; по вертикалі центр у pin (top 165 / 227 / 234). Обводка 1px #0C0B0B, radius 50%, overflow hidden.
- **Тексти:** `.p3` 16/24 → tab 13/24 → mob 13/18 (`body-sm` ✓); `.p3-bold` Inktrap 700 16/24 → tab 16/24 → mob 14/22,
  ls −0.3px (`body-sm.is-strong`, ls виправлено на −0.02em). Блок тексту 3.72 / 2.52rem, геп .24 / .16rem.
- **Hover-зона** `#notrealtime` 5rem, по центру кола (на 375 більша за коло, обрізається). Lottie: ассет копії
  `6ac8e84728488a6bd334f393_not_real_time.json`; IX2: hover 0→100, out 100→0, click 0→100→0 (ix2-summary).
- **Сфера:** `initSphere()` на `top bottom` (once) — 35 куль, клітка 32 пегів; нахил гравітації за скролом відновлюємо
  (рішення користувача, сесія 4), п. 1 закрито. ≤991 — за лайвом (сесія 5), п. 3 закрито. Довжина pin — кодом (п. 4).
  Звуки — як на лайві, етап 4 (п. 5).

## Збірка в копії (сесія 13, 2026-10-10, головна сесія)

Home копії, `main` → **`section-interactive`** (`3095ad5f-48ed-2091-d3c6-2b60b3f2e45c`) одразу після `section-intro`,
перед старими секціями. Старий `#interactive` лишається, поки його тягне `script.v33`; `id="interactive"` переходить на нову
секцію разом із підключенням коду (дубль id неможливий).

```
section.section-interactive   data-motion="theme" data-theme="light"   semantic: base (на класі); bg/foreground змінними
├─ div.interactive-head       data-motion="interactive"                 flex column center; padding-top секції 2.95rem
│  └─ h2.display-lg "Interactive"
└─ div.interactive-pin        data-motion="interactive-pin"             100vh, px .34 / .22rem — pin + зсув x
   └─ div.interactive-track   data-motion="interactive-track"           flex, max-content, center, gap .24rem, pr 5 / 2 / 1rem
      ├─ div.interactive-item                                           5.7 / 3.44rem, border-1 + semantic border, 50%
      │  └─ div.interactive-text                                        3.72 / 2.52rem, gap .24 / .16rem
      │     ├─ p.body-sm.is-strong  "There are two types of <br>interactive interfaces:"
      │     ├─ p.body-sm  <span.body-sm.is-strong>Real-time</span> respond as users interact <br>with them.
      │     └─ p.body-sm  <span.body-sm.is-strong>Not real-time</span> respond after the interaction has taken place.
      ├─ div.interactive-item > div.interactive-text > p.body-sm "Real-time"
      │  └─ div.interactive-sphere  data-motion="interactive-sphere"    abs inset 0 (сюди canvas Matter.js)
      └─ div.interactive-item > div.interactive-text > p.body-sm "Not real-time"
         ├─ div.interactive-lottie  data-motion="interactive-lottie" data-src="…f393_not_real_time.json" aria-hidden
         └─ div.interactive-hover   data-motion="interactive-hover"     abs 5rem по центру (translate −50%), z 1
```

- **Злиття (карт-бланш):** `height-section` → `interactive-pin`; `track-flex` + `track-padding` → `interactive-track`
  (`width: max-content` замість переповнення фіксованого `track-flex`); `horizontal-item` → `interactive-item`,
  `h-item-content` → `interactive-text`, `#canvas` → `interactive-sphere`, Webflow-Lottie → `div` з `data-src` (плеєр
  кодом), `#notrealtime` → `interactive-hover` (центрування `translate`, а не випадкова статична позиція flex).
- **Текстові стилі:** `display-lg` — lh **1.0625** (= 170 px, було 1.06 → 169.6), tab lh 1 і ls **−0.064em** (лайв `.h2`
  на 768 тримає −6.4px), mob lh 1.1 / ls −0.04em. `body-sm.is-strong` — ls −0.02em (було 0).
- **Звірка:** `tools/record/interactive-compare.mjs` — нова і стара секції на одній staging-сторінці (код заблоковано,
  статична розкладка), 16 елементів × 3 смуги: **Δ ≤ 0.7 px, 0 прапорців** (шрифти, кольори тексту, обводки, фон).
  Скриншоти 1440 нова/стара ідентичні.
- **Далі (код):** `initInteractive()` — pin + `x` (формула вище, `invalidateOnRefresh`), `syncLegacy()`; `initSphere()` —
  порт блоку F з фіксами (`e.target` замість `e.toElement`, без неявних глобалів, нахил гравітації на
  `data-motion="interactive-pin"`), Matter.js пінований, lazy; Lottie-плеєр (пінований `lottie-web`, lazy) на hover/click.
