# Hero

## Джерела
- Figma: секція `4608:23740` («home», 2984×14646), файл доступний (доступ є, блокер сесії 3 знято). Усередині 13 фреймів 1440×750(+): **5× «Home»** + **8× «Preloader(4..11)»**. Тільки десктоп 1440, фреймів 768/375 немає.
  - Hero-стани (3 фрейми):
    - `788:28207` «Home» 1440×750 — стан 1: лише кулька (Ellipse 30, 18px) у центрі; ні ліній, ні кільця, ні текстів.
    - `788:28237` «Home» 1440×750 — стан 2: кулька + кільце (Ellipse 292, 106px) + 2 лінії; без текстів.
    - `788:28268` «Home» 1440×1763 — стан 3 (скрол): ті ж лінії/кільце вже угорі (y=149), чорна плашка 1440×149 над ними, два тексти нижче.
  - Не Hero, лише позначено: `788:28300` і `788:28558` — початок Introduction (кільце, лінії по 178px по краях, ілюстрації `Group 631`; у `28558` кільця й ліній немає, лишається кулька y=370) — для проходу Intro. `Preloader(4)…(11)` — окрема секція Preloader (лічильник, кола, MOTION/DESIGN/PRINCIPLES з маскою/інверсією) — не розбирається.
  - У кожному Hero-фреймі також `Header` (34,34, 1372×44: 2 лого-очі, «motion.ed», «menu») і `Sound` (1358,672, 48×44) — це Navigation/Sound, не Hero.
- Лайв: `section#hero.section.is-hero` (14 вузлів, без Lottie/IX2/Splide). Записи: `reference/recordings/desktop/02-hero.mp4`, `mobile/02-hero.mp4` (+ `.sheet.png`).

## Структура (дерево з ролями)
- section#hero.section.is-hero (обгортка `.nav.nav-dark`)
  - div.anim-ball-sticky — sticky-контейнер кульки (JS рухає його `y`)
    - div.anim-ball-wrap
      - div.ball-divider.is-left — ліва лінія (1px)
      - div.anim-ball-border — кільце 106px
      - div#anim-ball.anim-ball.is-intro — білий диск 18px
      - div.ball-divider.is-right — права лінія
      - div.ball-bg.is-left — чорна плашка під лінією/текстом (у Figma = «Rectangle 12632» 1440×149 `BG`)
  - div.div-block-4 → div.text-wrap.is-hero → div.p1.white — «UI/UX animation emphasizes the details to which users should pay attention, helping them navigate the site.»
  - div.content-wrap.is-hero → div.h3.white — «Good animation also makes the whole user experience more memorable and exciting.»

## Токени, що зустрілись (Figma → значення)
- Кольори: `BG` = #0C0B0B (фон, чорна плашка, фон Sound/Header-піл); `White` = #FDFCFA (текст, лінії, кулька, обводки).
- `Desktop/H3` = PP Neue Machina Plain Regular, 140px / lh 144px / letter-spacing −4% (код Figma дає −5.6px), `uppercase`, `text-align:center`, ширина блоку 1174.
- `Desktop/P1` = PP Neue Machina Plain Regular, 28px / lh 44px / ls 0, центр, ширина 848, регістр як у тексті.
- `Desktop/Navigation` = PP Neue Machina Inktrap Regular, 16/16, ls −3% (−0.48px), lowercase — Header, не Hero.
- Радіуси/обводки: ring і піл-кнопки Header/Sound — 1px #FDFCFA, радіус 26 (піл). Лінії й кільце — stroke 1px.
- Відступи: у Hero немає авто-лейауту, усе absolute; змінних spacing/radius у фреймі немає.

## Розкладка (px макета 1440×750; 1rem=100px)
- 1440 (Figma). Центр кульки `x=720`. Стан 1/2: вісь `y=375`.
  - Кулька 18×18 (x711,y366). Кільце 106×106 (x667,y322), центр збігається з кулькою.
  - Ліва лінія: x1→668, w667. Права: x774→1439, w665, обидві h=0 (stroke 1px). Розрив під кільце = 106 (667…773).
  - Стан 3 (скрол): вісь піднята на `y=149` (кільце y96…202), тобто кулька «приклеєна» (sticky) на 149px від верху вʼюпорта; чорна плашка 1440×149 (x0,y0) закриває вміст під Header, але не кільце (кільце лежить над плашкою).
  - P1: центр x=720, верх y=354 (від початку секції 750; у фреймі 1763 текст стоїть на y354, тобто на ~205px нижче лінії), 2 рядки (ручний перенос після «users»), w848, h88.
  - H3: центр x=720, верх y=760, w1174, h=1152 (8 рядків по 144; у макеті переноситься на «GOOD / ANIMATION / ALSO MAKES / THE WHOLE USER / EXPERIENCE / MORE / MEMORABLE / AND EXCITING.»). Фрейм обрізано на 1763 (текст виходить за низ).
- 768 і 375: у Figma немає. З лайву (запис mobile): кільце ~65px (0.65rem), лінії на всю ширину, P1 переноситься на 5 рядків, H3 на 8 рядків ~0.6rem. Точні значення брати з Webflow-стилів лайву на проході збірки.

## Ассети
- Усе векторне, окремих растрів/Lottie/відео немає. Експортні SVG (Figma `get_design_context`, діють 7 днів): `Ellipse 30` (кулька), `Ellipse 292`/`Ellipse 293` (кільце — дублюється, шар 293 у стані 3 лежить під плашкою), `Vector 310`/`Vector 311` (лінії).
- Рекомендація: не експортувати. Кулька = `div` 0.18rem + `border-radius:50%`; кільце = `div` 1.06rem + `border:1px solid`; лінії = `div` height 1px (так і є на лайві, усе CSS). Header/Sound SVG (лого-очі, іконка звуку, бургер) — з Navigation/Sound, не Hero.

## Анімація
Станів у Figma 3; проміжки між ними й таймінги дизайнер не вказав (get_motion_context не викликали, без прототипу). Нижче: стани Figma + що робить лайв.
- Вхід (після прелоадера): кулька 18px з'являється → кільце + лінії розкриваються від центру до країв (Figma стани 1→2). На лайві це кінець прелоадера (IX2 PAGE_START: `.anim-ball-border.is-preloader` opacity/scale, `.ball-divider.is-preloader-left` size). Трактувати як частину секції Preloader/handoff; у Hero лишається стан «ring+лінії видимі». IX2 → код (GSAP, бо зв'язано з прелоадер-таймлайном).
- Скрол Hero: тригер = скрол сторінки; `anim-ball-sticky` прилипає, текст P1 і H3 йдуть знизу вгору під кулькою (Figma стан 3, записи лайву підтверджують: P1 з'являється під лінією, H3 заїжджає й проходить під кільцем). Властивості: нативний sticky + звичайний потік, без анімації → **CSS**, не IX3.
- Тригер `ScrollTrigger` на `.is-introduction`, start/end = `top-=<висота anim-ball-wrap> center`: onEnter — `.ball-divider.is-left/.is-right` scaleX 1→0 (1s, дефолтний `power1.out`, transform-origin: ліва `center right`, права `center left`, тобто лінії стискаються до кільця), потім `.anim-ball-border` scale 1→0 (0.5s, origin center). onEnterBack — зворотне: ring 0→1 (0.5s), потім лінії 0→1 (1s). → **GSAP у коді** (тригер від іншої секції, зв'язка з рухом кульки по SVG-шляху Intro, `overwrite:true`).
- Рух кульки з Hero по MotionPath (`#anim-ball` → Intro → Interactive, bounce-ease) і `x:-50vw` для `anim-ball-wrap` в Interactive — належить Intro/Interactive, у Hero лише початкова позиція (`resetHeroBallSticky`: sticky y:0).
- Лінк «Home» (#link1→#hero): `#anim-ball` x→0, 0.2s, delay 0.2 (код).
- Hover/клік у Hero немає.

## Розбіжності Figma ↔ лайв
- Лінії при переході до Intro: у Figma-фреймі `28300` лінії по 178px прижаті до **країв** (x1→179 і 1261→1439), на лайві скрипт стискає їх **до кільця** (scaleX→0, origin біля кільця). Лайв = істина; питання, чи дизайнер хотів інше.
- У `28558` кільця й ліній немає, лишається кулька (y=370), на лайві при цьому ring scale 0 — збігається, але кулька в Figma на 5px вище осі 375 (370 vs 366+9=375) — ігнорувати.
- Figma H3 `letter-spacing` у змінній −4 (px?) проти −5.6px у коді (−4% від 140). Брати −4% = −0.056rem; перевірити по лайву на етапі збірки.
- Figma H3 у 1174px і 8 рядків, 140px; на лайві desktop рядків менше (записи: «GOOD / ANIMATION / ALSO MAKES THE / WHOLE USER / EXPERIENCE / MORE / MEMORABLE / AND EXCITING.») — тобто ширина блоку/кегль на лайві інші; свериться по `.h3`/`.content-wrap.is-hero` у Webflow Styles при збірці. Лайв = істина.
- Figma показує лише 1440; планшет/мобайл береться з лайву (записи) і Webflow-стилів.
- Figma Hero-фрейми містять `Header` і `Sound` — на лайві це Navigation/Sound-button, окремі секції.
- Figma-шар «Ellipse 293» (дубль кільця під плашкою) — артефакт макета, не відтворювати.
- Figma стан 3: кільце над плашкою 149px — на лайві це `ball-bg.is-left` (чорна плашка) + sticky; точну висоту плашки на лайві не перевіряли.

## Питання до користувача
1. Лінії при виході з Hero: стискати до кільця (як на лайві) чи до країв (як у Figma `28300`)? За замовчуванням — як лайв.
2. Чи є прототип/Smart Animate у Figma для переходів 1→2→3 з таймінгами? Зараз беремо таймінги лайву (1s/0.5s).
3. Анімація входу кільця й ліній після прелоадера — розбирати в проході Preloader (мій варіант) чи в Hero?
