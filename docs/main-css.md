# main-css — розбір ембеду

Джерело: `div.main-css.w-embed` (Designer HtmlEmbed `27a12260-ea1b-f958-9a7f-b0e7acbbbf68`, перший child `body` Home), один `<style>`, ~190 рядків. Дослівно: `reference/main-css.css`. Інших `<style>`-ембедів у HTML Home немає. Site head: лише `preconnect`/`dns-prefetch` + Twitter pixel (без стилів); site footer і page head порожні; page footer — лише `<script>`/`<audio>` (стилів немає). Тож увесь кастомний CSS = цей ембед.

## `html { font-size }` по смугах

| Медіа | font-size | 1rem при ширині |
|---|---|---|
| default (>991px) | `6.94444vw` | 1440px → 100px ✓; 992px → 68.9px; 1920px → 133.3px |
| `max-width: 991px` | `13.0208333vw` | 768px → 100px ✓; 991px → 129px; 480px → 62.5px |
| `max-width: 479px` | `26.66666vw` | 375px → 100px ✓; 479px → 127.7px; 320px → 85.3px |

Висновок: база 1rem = 100px збігається на макетних ширинах 1440 / 768 / 375 (6.94444 = 100/1440·100; 13.0208 = 100/768·100; 26.6667 = 100/375·100). Брейкпоінти перемикання — **991 і 479**, не 768/375 (це лише ширини макета). Масштаб безперервний усередині смуги (зростає до верхньої межі: на 991 → 129px, на 479 → 127.7px), на межах стрибок: 992→991 дає 68.9→129px (x1.87), 480→479 дає 62.5→127.7px (x2.04). Це успадковане поведінка, у перезбірці вирішити: лишити 1:1 чи обмежити (clamp). Без верхньої межі на великих екранах (>1440 росте лінійно).

Додатково в медіа: `-webkit-tap-highlight-color: transparent` на 991 і 479.

## Глобальні правила та хаки

| Блок | Що робить | Перенос |
|---|---|---|
| `html { overflow-y: overlay }` | нестандартне (Chrome <114 deprecated, тепер = `auto`); script-map п.1: після закриття меню JS ставить `overflow: overlay` | прибрати; скрол-лок через `lenis.stop()/start()` |
| `::-webkit-scrollbar {height/width:0}` + `* {scrollbar-height:0}` | ховає скролбар у WebKit; `scrollbar-height` — неіснуюча властивість (мертве) | лишити `::-webkit-scrollbar` + додати `scrollbar-width: none` на `html`; `scrollbar-height` прибрати |
| `.lenis.lenis-smooth {scroll-behavior:auto}`, `html.lenis {height:auto}`, `.lenis.lenis-stopped {overflow:hidden}` | стандартні Lenis-класи; **у скрипті Lenis ставиться лише на десктопі**, мобайл — `normalizeScroll`; клас `lenis-stopped` фактично не використовується (див. script-map, баг 1) | лишити (це канонічний Lenis-CSS), підключити з пакета Lenis |
| `.w-nav-menu {display:flex !important}` | перебиває Webflow-навбар (меню завжди flex, видимість — IX2 `.nav-menu`) | прибрати, якщо меню буде без `w-nav`; інакше замінити класом |
| `.section.is-techniques {overflow-x:clip; overflow-y:visible !important}`; `.footer, .resources-clouds-list {overflow-y:visible; overflow-x:clip}` | обрізати горизонтальний виліт хмар/зірок, не ламаючи `position: sticky`/pin (на відміну від `overflow:hidden`) | перенести в класи секцій у Designer, `!important` прибрати |
| `.a-lesson-item_overflow-hidden, .card-video-item {-webkit-mask-image: -webkit-radial-gradient(white, black)}` | Safari-хак: border-radius + overflow на відео/трансформаціях | лишити (можна `isolation:isolate` + `transform: translateZ(0)`; перевірити в Safari) |
| `.a-lesson-video video, .card-video video {width/height:100%}` | розтягти ембед-відео | у клас відео |
| `.card-link {transition:.3s linear}`, `.card-link:hover {border:.02rem solid #0c0b0b}` | hover-обводка (зміна `border` зсуває layout на 2px) | перенести як Hover-стан Designer; border → `box-shadow`/`outline` |
| hover-підкреслення: `.card-link:hover .btn-link, .logo-text-sections:hover, .nav-toggle:hover .toggle-label, .splide__slide.is-active .slide-inner-label {text-decoration:underline}` | | у Hover-стани відповідних класів |
| `.embed-path .anim-ball.is-intro` (+ `_tablet`, `_mobile`): `position:absolute; top:3.3vw; left:35.7%; translate(-50%,-50%); z-index:2`; на ≤991: `top:0; left:35.5%` | позиція кульки інтро на SVG-шляху, прив'язана до `vw`, а не до rem | перенести в клас; значення залежать від MotionPath-координат, повторити 1:1 |
| `.section-slide {clip-path: circle(.09rem at 50% 50%)}` | стартовий стан слайдів Interactive (закриті) — те саме значення, що `circle(0.09rem)` у JS (script-map: «відео відкривається clip-path») | лишити як стартовий клас (див. баг 10: layout/start-state з JS у CSS) |
| `.section-slide-video video, .section-slide:first-child .section-slide-wrap, .splide__slide.is-active .slide-lottie.not-active {opacity:0}` | стартові стани прихованого; перше слайд-wrap невидимий до анімації | лишити як стартові класи |
| `.section-track {width:max-content}`, `.nav-links-wrap, .resources-track {width:max-content !important}` | горизонтальні треки | в класи, `!important` прибрати |
| `.overlay-bg, .resources-overlay {pointer-events:none}` | оверлеї не блокують кліки | лишити |
| `.sound-icon-wrap.is-active {background:#fdfcfa !important; border:1px solid #0c0b0b !important; color:#0c0b0b !important}`, `.sound-btn-mute.is-active {opacity:1}` | стан кнопки звуку; `.is-active` вмикає inline-скрипт (`$(".sound-btn-mute").addClass("is-active")`) | combo-клас/data-state; кольори — змінні `#fdfcfa`/`#0c0b0b` |
| `.classic-anim_wrap::before` — шум: `url(…Texture_01.png)`, opacity .2, `animation .2s infinite noise` (10 keyframes `background-position`), radius `.76rem`, `pointer-events:none`; `display:none` на ≤991 | **анімація зерна фільму** на блоці classic-anim (#easing, #delay) | лишити як клас; текстура — з бакета (файл перенесено дублюванням); `steps()` + `prefers-reduced-motion` |
| `.splide button:disabled {background:#c8cfe8; color:#0c0b0b}`, `.splide--draggable … .splide__slide {user-select:none}`, `.splide__slide.is-active .slide-lottie.active {display:block; opacity:1}` | кастом Splide 2.4.21 | якщо слайдер лишається — залишити; інакше замінити на власний/Swiper |
| `video.is-mobile, video.is-tablet {display:none}`; ≤991: `.is-tablet` block, `.is-desktop/.is-mobile` none; ≤479: лише `.is-mobile` | вибір джерела відео за смугою (три `<video>` на ембед → усі три присутні в DOM, `autovideo` ліниво вантажить) | замінити на `<picture>`-подібний вибір (`<source media>` або один `<video>` + JS по `matchMedia`) — економить 2/3 відео-вузлів |
| `.ui-text` (≤991): `margin-top:.18rem; align-self:center; transform: translateY(50%)` | позиція підпису UI-слайдера | в клас на tablet-смузі |

## Чого немає / що важливо

- **`mix-blend-mode` не використовується** (жодного входження); немає й власних шрифтів/кольорових змінних — лише литерали `#0c0b0b`, `#fdfcfa`, `#c8cfe8`.
- Lottie-стилів немає (Lottie ресайз — inline-скрипт `lottie.resize()` на `resize`).
- Усі селектори ембеду мають збіг у Home-DOM (перевірено вибірково: `.logo-text-sections`, `.card-video-item`, `.toggle-label` присутні).
- Правило `* { scrollbar-height:0 }` — універсальний селектор без ефекту.

## Що переносимо / прибираємо

**Переносимо:** rem-база (3 смуги, з рішенням щодо стрибка на межах), Lenis-CSS, scrollbar-hide, `overflow: clip` на секціях, Safari-mask, noise-анімацію, `pointer-events:none` на оверлеях, стартові стани (`clip-path`, `opacity:0`), вибір відео за смугою (в кращій реалізації).

**Прибираємо:** `overflow-y: overlay`, `scrollbar-height`, `!important` (w-nav-menu, overflow-y, max-content, sound-icon), `.w-nav-menu` хак (разом з w-nav), hover через ембед (в Designer states), дублікати `-webkit-transform`/`-ms-transform`.

**У Designer-класи, не в ембед:** усе, що прив'язане до одного класу (позиції, стартові стани, hover) — щоб ембед main-css скоротився до глобального: `html font-size`, scrollbar, Lenis, `::before` noise, `video.is-*`.
