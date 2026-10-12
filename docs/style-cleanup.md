# Чистка стилів копії (сесія 38, 2026-10-12)

Копія `Motion rebuild` (`6ac8e847…f2fe`). Мета — прибрати зі стилів сайту все, що лишилось від старої збірки й не
вживається на жодній сторінці. Оригінал не чіпали.

## Підсумок

| | До | Після |
|---|---|---|
| Стилів у Webflow (базові + комбо) | 750 (487 + 263) | **325** (242 + 83) |
| Правил в опублікованому `webflow.shared.*.css` | 1613 | **954** |
| Розмір CSS | 157 KB | **93 KB** (−41 %) |

Видалено **425** стилів (245 базових + 180 комбо). Усі вони — імена старої збірки. Жоден клас нової системи не
виявився невживаним.

## Як рахували «не вживається»

1. **Інвентар:** `get_styles` (усі 750, з `selector` і `isComboClass`).
2. **Вживання:** класи з опублікованого HTML staging (`/`, `/styleguide`, `/lesson/<slug>`, сторінка 404) **плюс**
   дерева Designer: `get_all_elements` Home і Styleguide, а також **усіх 10 компонентів** через `scope_component_id`.
   Дерева компонентів потрібні тому, що елемент, прихований пропсом visibility, не потрапляє в HTML. Тут HTML і
   Designer збіглися повністю, прихованих елементів немає. Body обох сторінок читали з HTML, бо MCP не показує
   клас Body.
3. **Комбо** вважається вживаним, якщо хоч один елемент має весь його ланцюжок класів. Комбо-стани, які ставить JS
   (`classList.toggle('is-active' | 'is-on')` у `src/motion.js`), зараховано окремо: `.res-image.is-active`,
   `.res-name.is-active`, `.snd-mute.is-on` — **лишаються**.
4. **Інше, що могло тримати клас:** IX3-інтеракцій 0; на опублікованих сторінках немає жодного `data-w-id` (IX2 не
   прив'язаний ніде); у `src/` невживані класи трапляються лише в коментарях (`sound_click` у `motion.js`,
   `classic-anim_wrap` у `styles-rem.html`). Шаблони CMS (×3) порожні, шаблон Lessons — лише Body.
5. **Звірка з [styleguide-audit.md](styleguide-audit.md) §5:** з 24 «мертвих» класів оригіналу 23 є в списку;
   `overflow-hidden` у копії існував лише як комбо `.body.overflow-hidden`, яке теж видалено.

## Як видаляли й перевіряли

- **Бекап до видалення:** усі 750 стилів з властивостями (4 смуги, псевдостани) —
  `reference/styles/copy-styles-2026-10-12.json`. З нього можна відновити будь-який клас через `create_style`.
- **Знімок «до»:** `tools/record/main-css-diff.mjs snapshot` на staging, JS off, 1440 / 768 / 600 / 375: Home
  (1205 елементів) і Styleguide (`PAGE=styleguide`, 550). У властивості додано `font-family` і `font-weight`
  (успадковуються від Body). Контрольний повторний знімок без змін — 0 прапорців, тобто шуму немає.
- **Видалення:** `remove_style`, спершу комбо від найглибших, потім базові. Пакети по 50. Ліміт API — близько
  55 запитів за раз, далі `429 Too Many Requests`; ті, що впали, пройшли наступним пакетом. Display-імена, що
  відрізняються від селектора (`Text Span`, `Div Block 4`, `Image`, `Link`, `2`, `overflow hidden`), бралися з
  інвентаря.
- **Після:** свіжий `get_styles` — 325 стилів; усі 325 вживаних живі, з 425 невживаних не лишилось жодного.
  Опубліковано staging.
- **CSS-звірка:** правила опублікованого CSS до / після. Прибрано 659 правил, і кожне стосується лише видалених
  класів. Нових правил 0. Змінилось одне правило — `.body` (режим, див. нижче).
- **Знімок «після»:** Home — **0 прапорців** на всіх 4 смугах. Styleguide — лише Body (темний режим) і порожній
  ембед `styles-rem`, який успадковує колір Body. Під `sg-page` не змінилось жодного елемента, а `sg-page`
  перекриває сторінку від краю до краю на всю висоту (1440 і 375), тож Body ніде не видно.
- **З JS (`--live`):** див. журнал сесії 38 у CONVENTIONS.md.

## Body: один клас `.body` для Home і Styleguide

- Було: Home — `.body-wrap` (фон `#0c0b0b` і шрифт Plain літералами, `overflow: visible`, колір тексту успадкований
  від тегу `body` — `#333`); Styleguide — `.body` на змінних (`bg`, `foreground`, `font-display`, світлий режим).
- Зроблено: на `.body` поставлено режим `semantic: dark` (смуга main). Тепер `.body` = фон `#0c0b0b`, текст
  `#fdfcfa`, шрифт `font-display`. На Styleguide це не видно, бо `sg-page` сам ставить режим `base`, свій фон і колір.
  Колір `#333` на Home успадковують лише 3 обгортки без власного тексту (`main`, `section-lessons`, ембед), тож
  `foreground` видимо нічого не змінить.
- **Лишилось (руками, MCP не вміє):** `set_style` на елементі Body відповідає «This element doesn't support
  styles». Designer → Home → Navigator → **Body** → у Selector замінити `body-wrap` на `body`. Після цього
  агент знімає «після»-знімок Home і видаляє `.body-wrap`.

## Що видалено (425)

Повний перелік з ID — у бекапі (`reference/styles/copy-styles-2026-10-12.json`). Нижче — за родинами.

### Типографіка старого стайлгайда — 48 (27 базових, 21 комбо)

`._2` · `.arrow-title-wrap` · `.h2` · `.h2-secondary` · `.h2-secondary.text-center` · `.h2-wrap` · `.h3` · `.h3.white` · `.h4` · `.h4-c` · `.h5` · `.h6` · `.h6.white` · `.label-1` · `.label-1.is-lesson` · `.link` · `.list-item` · `.list-item.is-techniques` · `.list-item.is-techniques.first` · `.list-item.is-techniques.second` · `.list-item.is-techniques.third` · `.p1` · `.p1.white` · `.p2` · `.p3` · `.p3-bold` · `.p3.margin-top` · `.scrolling-text` · `.scrolling-text.is-lessons` · `.slide-inner-label` · `.slide-inner-label.active` · `.slide-inner-label.is--active` · `.text-block-3` · `.text-hidden` · `.text-span` · `.text-wrap` · `.text-wrap.is-animation` · `.text-wrap.is-hero` · `.text-wrap.is-hero-desc` · `.text-wrap.is-implementation` · `.text-wrap.is-preloader` · `.text-wrap.is-techniques` · `.text1` · `.title-wrap` · `.title-wrap.is-implementation` · `.zajno-label` · `.zajno-label.is-desktop` · `.zajno-link`

### Сторінка Styleguide (стара) — 9 (8 базових, 1 комбо)

`.body.overflow-hidden` · `.colors-wrap` · `.headings-wrap` · `.og-image` · `.og-image-wrap` · `.paragraphs-wrap` · `.styleguide-divider` · `.styleguide-wrapper` · `.symbols-wrap`

### Splide — 12 (7 базових, 5 комбо)

`.splide` · `.splide-container` · `.splide.slider1` · `.splide.splide2` · `.splide__arrow` · `.splide__arrow.splide__arrow--next` · `.splide__arrow.splide__arrow--prev` · `.splide__arrows` · `.splide__list` · `.splide__slide` · `.splide__slide.is-active` · `.splide__track`

### Прелоадер / loader — 14 (11 базових, 3 комбо)

`.loader` · `.loader-counter` · `.loader-lottie` · `.loader-number` · `.loader-number-value` · `.loader-relative` · `.loader-wrap` · `.loader-wrapper` · `.preloader` · `.preloader_lottie` · `.preloader_lottie.is-desktop` · `.preloader_lottie.is-mobile` · `.preloader_lottie.is-tablet` · `.preloader_wrap`

### Hero — 49 (21 базових, 28 комбо)

`.anim-ball` · `.anim-ball-border` · `.anim-ball-border.is-preloader` · `.anim-ball-sticky` · `.anim-ball-wrap` · `.anim-ball-wrap.is-preloader` · `.anim-ball.is-intro` · `.anim-ball.is-preloader` · `.ball-bg` · `.ball-bg.is-left` · `.ball-bg.is-left.is-preloader-left` · `.ball-bg.is-right` · `.ball-bg.is-right.is-preloader-right` · `.ball-divider` · `.ball-divider.is-left` · `.ball-divider.is-preloader-left` · `.ball-divider.is-right` · `.bg-divider` · `.bg-divider.is-techniques` · `.bg-image` · `.bg-image.is-star` · `.bg-image.is-star-xs` · `.bg-image.is-star-xs.is-left` · `.bg-image.is-star-xs.is-right` · `.bg-image.is-star.first` · `.bg-image.is-star.second` · `.bg-list` · `.bg-list-item` · `.bg-list-item.is-first` · `.bg-list-item.is-second` · `.bg-list-item.is-third` · `.bg-list.is-bottom` · `.bg-visual` · `.bg-wrap` · `.bg-wrap.is-bottom` · `.bg-wrap.is-main` · `.bg-wrap.is-main.desktop` · `.bg-wrap.is-main.mobile` · `.bg-wrap.is-main.tablet` · `.bg-wrap.is-techniques` · `.hero-animation` · `.hero-content` · `.hero-title` · `.hero-visual` · `.hero_content` · `.hero_left` · `.hero_right` · `.hero_text` · `.hero_wrap`

### Intro / UI-слайдер — 43 (29 базових, 14 комбо)

`.anim-shape` · `.anim-shape.is-also` · `.anim-shape.is-attention` · `.anim-shape.is-controls` · `.anim-shape.is-your` · `.anim-smoke` · `.anim-text` · `.anim-text-wrap` · `.anim-text-wrap.active` · `.embed` · `.embed-path` · `.embed-path_mobile` · `.embed-path_tablet` · `.h-item-content` · `.h-item-lottie` · `.h-lottie-hover` · `.horizontal-item` · `.horizontal-item._2` · `.horizontal-item._3` · `.intro-wrap` · `.item-canvas` · `.section-slide` · `.section-slide-img-wrap` · `.section-slide-text` · `.section-slide-video` · `.section-slide-wrap` · `.section-slide.ui-slide` · `.section-slider` · `.section-slider.ui-slider` · `.section-track` · `.slide-lottie` · `.slide-lottie.active` · `.slide-lottie.not-active` · `.track-flex` · `.track-flex.is-interactive` · `.track-padding` · `.track-padding.is-interactive` · `.ui` · `.ui-ball` · `.ui-text` · `.ui-track` · `.ui-wrap` · `.ui.first`

### Lessons — 97 (52 базових, 45 комбо)

`.a-lesson-img` · `.a-lesson-item` · `.a-lesson-item.margin-40` · `.a-lesson-item_heigh` · `.a-lesson-item_heigh.is-delay` · `.a-lesson-item_heigh.is-easing` · `.a-lesson-item_overflow-hidden` · `.a-lesson-item_sticky` · `.a-lesson-list` · `.a-lesson-text-wrap` · `.a-lesson-video` · `.card-link` · `.card-link.is-second` · `.card-link.is-third` · `.card-video` · `.card-video-img` · `.card-video-item` · `.card-video.is-implementation` · `.classic-anim_container` · `.classic-anim_container.is-delay` · `.classic-anim_container.is-easing` · `.classic-anim_content` · `.classic-anim_musk` · `.classic-anim_sideimg` · `.classic-anim_sideimg.is-left` · `.classic-anim_sideimg.is-left.is-delay` · `.classic-anim_sideimg.is-left.is-easing` · `.classic-anim_sideimg.is-right` · `.classic-anim_sideimg.is-right.is-delay` · `.classic-anim_sideimg.is-right.is-easing` · `.classic-anim_wrap` · `.content-wrap` · `.content-wrap.is-hero` · `.content-wrap.is-interactive` · `.content-wrap.is-techniques` · `.divider` · `.example-progress-bar` · `.example-video-1` · `.example-video-2` · `.example-video-3` · `.example-video-4` · `.example-video-5` · `.example-video-6` · `.example-video-padding` · `.example-videos-desktop` · `.height-container` · `.height-container.is-nav-links` · `.height-section` · `.height-section.is-interactive` · `.image` · `.imgs-wrap` · `.imgs-wrap.is-anim-stars` · `.imgs-wrap.is-easing-classic` · `.lesson` · `.lesson-item` · `.lesson-item.is-examples` · `.lesson-item.is-examples-2` · `.lesson-item.is-implementation` · `.lesson-item.is-implementation.is-last` · `.lesson-list` · `.lesson-list.is-easing` · `.lesson.is-delay` · `.lesson.is-dimension` · `.lesson.is-easing` · `.lesson.is-fade` · `.lesson.is-masking` · `.lesson.is-morph` · `.lesson.is-parallax` · `.lesson.is-zoom` · `.list-wrap` · `.list-wrap.is-implementation` · `.list-wrap.is-techniques` · `.overlay-bg` · `.progress-bar-item` · `.progress-bar-list` · `.progress-bar-title` · `.progress-bar_divider-line_hidden` · `.progress-bar_divider-line_large` · `.progress-bar_divider-line_small` · `.progress-bar_divider-wrap_large` · `.progress-bar_divider-wrap_small` · `.progress-bar_line-active` · `.progress-bar_line-wrap` · `.progress-bar_title-1` · `.progress-bar_title-2` · `.progress-bar_title-3` · `.star-vector` · `.star-vector.even` · `.star-vector.odd` · `.sticky-container` · `.sticky-container.is-delay-classic` · `.sticky-container.is-easing-classic` · `.sticky-container.is-examples` · `.sticky-container.is-examples-2` · `.sticky-container.is-implementation` · `.sticky-container.is-implementation.is-last` · `.sticky-container.is-nav-links`

### Resources — 39 (28 базових, 11 комбо)

`.resources` · `.resources-arrow` · `.resources-arrow-icon` · `.resources-cloud-item` · `.resources-cloud-item.first` · `.resources-cloud-item.fourth` · `.resources-cloud-item.second` · `.resources-cloud-item.third` · `.resources-clouds-list` · `.resources-content` · `.resources-full` · `.resources-header` · `.resources-header__count` · `.resources-header__item` · `.resources-header__item.active` · `.resources-header__item.hidden` · `.resources-header__text` · `.resources-images` · `.resources-images__item` · `.resources-images__item.active` · `.resources-images__list` · `.resources-item` · `.resources-item__button` · `.resources-item__dot` · `.resources-item__dot.active` · `.resources-item__name` · `.resources-item__name.active` · `.resources-item__text` · `.resources-item__text.active` · `.resources-link` · `.resources-list` · `.resources-lists` · `.resources-main` · `.resources-overlay` · `.resources-student` · `.resources-titles` · `.resources-track` · `.resources-wrapp` · `.resources.nav-light`

### Footer — 24 (13 базових, 11 комбо)

`.f-icon` · `.f-icon.is-arrow` · `.f-icon.is-social` · `.f-info-container` · `.f-label` · `.f-label.mobile-hidden` · `.f-link` · `.f-navigation` · `.f-navigation-list` · `.f-navigation-list.is-menu` · `.f-navigation-list.is-social` · `.footer` · `.footer-cloud-item` · `.footer-cloud-item.is-first` · `.footer-cloud-item.is-fourth` · `.footer-cloud-item.is-second` · `.footer-cloud-item.is-third` · `.footer-clouds-list` · `.footer-content` · `.footer-info` · `.footer-item` · `.footer-item._1` · `.footer-item._2` · `.footer-list`

### Навбар і меню — 58 (32 базових, 26 комбо)

`.breadcrumb-item` · `.breadcrumb-item.is-delay` · `.breadcrumb-item.is-easing` · `.breadcrumb-item.is-easing.active` · `.breadcrumb-item.is-fade` · `.breadcrumb-item.is-masking` · `.breadcrumb-item.is-morph` · `.breadcrumb-item.is-parallax` · `.breadcrumb-item.is-scale` · `.breadcrumb-item.is-zoom` · `.breadcrumbs-wrap` · `.eye-bg-sections` · `.eye-bg-sections.is-left` · `.eye-bg-sections.is-right` · `.logo-eye-dark` · `.logo-eye-light` · `.logo-eye-menu` · `.logo-sections-wrap` · `.logo-text-sections` · `.logo-wrappers` · `.lottie-card` · `.menu` · `.nav` · `.nav-absolute` · `.nav-header` · `.nav-inner` · `.nav-inner.nav-color` · `.nav-inner.nav-dark` · `.nav-inner.nav-light` · `.nav-link` · `.nav-links` · `.nav-links-wrap` · `.nav-links.active` · `.nav-logo` · `.nav-menu` · `.nav-menu.active` · `.nav-panel` · `.nav-panels` · `.nav-social-icon` · `.nav-social-link` · `.nav-toggle` · `.nav-toggle.is-close` · `.nav-toggle.is-dark` · `.nav-toggle.is-light` · `.nav-track` · `.nav.nav-color` · `.nav.nav-dark` · `.nav.nav-light` · `.navbar-socials-list` · `.navigation` · `.toggle-icon-wrap` · `.toggle-label` · `.toggle-label-wrap` · `.toggle-label.is-active` · `.toggle-span` · `.toggle-span.is-bottom` · `.toggle-span.is-light` · `.toggle-span.is-top`

### Sound — 7 (6 базових, 1 комбо)

`.fixed-bottom` · `.sound-btn-icon` · `.sound-btn-mute` · `.sound-btn-mute.is-active` · `.sound-btn-wrap` · `.sound-icon-wrap` · `.sound_click`

### Службові / автоімена / утиліти — 25 (11 базових, 14 комбо)

`.btn-link` · `.btn-link-icon` · `.btn-link.is-delay` · `.btn-link.is-implementation` · `.div-2` · `.div-block-4` · `.flex-display` · `.flex-display.is-footer` · `.flex-display.is-hero` · `.flex-display.is-implementation` · `.flex-display.is-preloader` · `.flex-shrink-none` · `.main-css` · `.relative` · `.relative.is-preloader-2` · `.section` · `.section.is-hero` · `.section.is-interactive` · `.section.is-introduction` · `.section.is-lessons` · `.section.is-techniques` · `.section.is-techniques.dark` · `.section.is-techniques.nav-dark` · `.trigger` · `.trigger2`

