# Чистка бібліотеки ассетів копії — перевірений список

Дата: 2026-10-09. Сайт: **копія** `6ac8e84728488a6bd334f2fe` (видалення — окремим кроком, лише з дозволу).
Оригінал `6384fe1e68c38ac8097a7e47` лише читався. Нічого не видалено, нічого не опубліковано.

Дані: `scratchpad/copy-assets.json` (379 ассетів копії), `scratchpad/delete-candidates.json`
(кандидати), `scratchpad/cleanup/usage-result.json` (статус + де знайдено для кожного ассета),
`scratchpad/cleanup/id-map.json` (мапа ID), скрипт `scratchpad/cleanup/usage2.py`.

## Метод

1. `list_assets` копії (4 сторінки) → 379 шт. Звірено з оригіналом за `displayName + size + createdOn`:
   **379/379 зіставлено однозначно, жоден ID не збігається** (у копії всі ID нові, `createdOn` збережено).
   Додатково: у **271 ассета оригіналу file-ID у URL ≠ asset ID** (оригінал сам був клоном у квітні 2023,
   файли лишились зі старими префіксами `6421…`, `6433…`, `642f…`). Тому для кожного ассета шукалися
   **4 ключі**: ID копії, ID оригіналу, file-ID з `originalFileName`/`hostedUrl` оригіналу, плюс ім'я файлу.
2. Ассет «вживається», якщо будь-який ID-ключ є хоч в одному джерелі. Якщо ID ніде немає, але є збіг
   **за іменем** (точне `displayName`, також URL-decoded, і похідні `-poster`/`-transcode`/`-p-`) — «лишити».
3. Обережність: усе з `createdOn` після останньої публікації оригіналу (2024-02-13 07:58) — «лишити»;
   усі шрифтові файли, не підключені як Fonts, — «лишити».

## Джерела перевірки

| Джерело | Що саме |
|---|---|
| Опублікований HTML оригіналу (motion.zajno.com) | `/`, `/styleguide`, 8 × `/lesson/<slug>`; `/resources/*` (4) і `/course-items/*` (10) віддають 404 (шаблони не публікуються), 404-сторінка стандартна, `/401` немає |
| Опублікований HTML **копії** (staging webflow.io, публікація 2026-10-09 13:52) | ті самі 26 URL — це знімок **Designer-стану** після дублювання, тобто включає й неопубліковані з 2024 зміни оригіналу |
| CSS | `motion-9888c6.webflow.05a3c92fc.min.css` (оригінал), `…webflow.shared.0f2db7a20.min.css` (копія), `reference/main-css.css` |
| JS / IX2 | `webflow.bc78bd593.js` (оригінал, з IX2), 4 чанки `webflow.*.js` копії, `reference/ix2-interactions.json`, `reference/script.v33.src.js/.min.js`, `ifvisible.min.js` |
| Lottie | усі 60 JSON, на які посилається HTML, — усередині немає посилань на картинки |
| Designer-дерево копії (`get_all_elements`) | Home (29 Image з `assetId`), Styleguide (`og-image`), 3 CMS-шаблони — порожній Body |
| Метадані сторінок копії | OG Home = URL **оригіналу** `642fed24…_Og image.png` (не ассет копії); решта сторінок без OG |
| Favicon / webclip | з `<link rel="shortcut icon"/"apple-touch-icon">` усіх сторінок обох сайтів |
| CMS копії (Courses 10, Lessons 8, Resources 4) | `course-image` (14 fileId), Lessons `video-link-2` (URL файлу оригіналу `64215be1…_Fly - Dashboard_H.264.mp4`) |
| Кастомний код копії | site head/footer, page head/footer усіх 5 сторінок, registered scripts (0) — посилань на ассети Webflow немає (лише cdnjs/jsdelivr/cdn.zajno.com) |
| Fonts (`list_fonts`, обидва сайти) | 4 шрифти: Magilio-400, PP Neue Machina Plain 400, Inktrap 400/700 — файли `…f4bb/f4be/f4bf/f4c0` (woff2) |
| Знімок попереднього аудиту | `reference/live-home-2026-10-09.html`, `live-styleguide-…`, `lottie-urls.txt` |

## Підсумок

| Група | Шт | MB | Розбивка (шт, MB) |
|---|---|---|---|
| **Вживаються** | 111 | 8.7 | mp4 1 (5.85), Lottie json 30 (1.40), png 26 (0.80), svg 46 (0.38), woff2 4 (0.18), webp 3 (0.08), ico 1 (0.00) |
| **Лишити за обережністю** | 65 | 38.6 | Lottie json 20 (33.68), mp4 1 (2.54), otf 13 (1.59), gif 3 (0.32), jpg 1 (0.22), svg 24 (0.22), png 2 (0.07), woff2 1 (0.01) |
| **До видалення** | 203 | 320.5 | mp4 126 (316.11), jpg 4 (1.86), mov 1 (1.44), webp 23 (0.47), svg 42 (0.37), png 4 (0.20), Lottie json 3 (0.09) |
| Разом | 379 | 367.9 | |

MB тут десяткові (10⁶ B); у `assets.md` §5 ті самі 379 файлів = 350.9 MiB. Кандидати = 305.7 MiB.

Чому «вживаються» 111, а не 49 як у `assets.md` §5: тепер враховано file-ID оригіналу, усі SVG із CSS
(включно з «мертвими» правилами — посилання в стилях є, видаляти не можна), Designer-стан копії,
favicon/OG і CMS. Усі 126 mp4 кандидатів — старі завантаження; сайт бере відео з `cdn.zajno.com`.

Несподіванки:
- **`Fly - Dashboard_H.264.mp4` (5.9 MB) вживається лише в CMS** — Lessons → «The basics of easing» →
  `video-link-2`, причому URL веде в бакет **оригіналу**, а шаблон уроку порожній (ніде не рендериться).
- OG Home у копії посилається на файл **оригіналу**; ассет копії `Og image.png` вживається лише як
  `<img class="og-image">` на Styleguide. Після видалення/архівації оригіналу OG зламається — перепривʼязати.
- Жоден ассет не вживається виключно на CMS-сторінках (шаблони порожні; CMS-картинки рендеряться на Home).
- 5 ассетів додано 2024-06-21 — **після** останньої публікації (Home в оригіналі змінено 2025-02-10 без публікації).

## Лишити за обережністю (65 шт, 38.6 MB)

Підсумок причин: **45 тезок** (той самий `displayName`, що й у вживаного файлу, але інший ID; переважно
старі важкі Lottie 2023-01, 33.7 MB) · **14 шрифтів** (13 otf PP Neue Machina + `Magilio-Regular.woff2`;
у Fonts і `@font-face` їх немає, але лишено за правилом) · **5 після публікації** · **1 хибний збіг імені**
(`2.mp4` ⊂ `example-2.mp4` з cdn.zajno.com). Тезки й шрифти — кандидати на «другу хвилю» після
візуальної перевірки копії: за ID вони ніде не знайдені.

| Файл | Тип | KB | Створено | Причина | ID копії |
|---|---|---|---|---|---|
| Motion_Webflow.png | png | 16 | 2024-06-21 | додано після останньої публікації оригіналу (2024-02-13) | `6ac8e84728488a6bd334f4ca` |
| Cover_2.jpg | jpg | 216 | 2024-06-21 | додано після останньої публікації оригіналу (2024-02-13) | `6ac8e84728488a6bd334f4c9` |
| Motion_Webflow_gif+(1).gif | gif | 34 | 2024-06-21 | додано після останньої публікації оригіналу (2024-02-13) | `6ac8e84728488a6bd334f4c8` |
| Motion_Webflow_gif.gif | gif | 169 | 2024-06-21 | додано після останньої публікації оригіналу (2024-02-13) | `6ac8e84728488a6bd334f4c7` |
| Motion_Webflow_gif.gif | gif | 106 | 2024-06-21 | додано після останньої публікації оригіналу (2024-02-13) | `6ac8e84728488a6bd334f4c6` |
| PPNeueMachina-InktrapBold.otf | otf | 121 | 2023-04-28 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f4ba` |
| Preloader_lottie_circles_mobile.json | Lottie json | 38 | 2023-04-13 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f46e` |
| 2.mp4 | mp4 | 2483 | 2023-04-05 | ім'я трапляється в джерелах без збігу ID | `6ac8e84728488a6bd334f40c` |
| cloud_1_mobile.svg | svg | 15 | 2023-03-27 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3c2` |
| cloud_2_mobile.svg | svg | 8 | 2023-03-27 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3c3` |
| cloud_3_mobile.svg | svg | 7 | 2023-03-27 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3bf` |
| cloud_1_mobile.svg | svg | 15 | 2023-03-27 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3c4` |
| cloud_4_mobile.svg | svg | 8 | 2023-03-27 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3bc` |
| cloud_3_mobile.svg | svg | 8 | 2023-03-27 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3c0` |
| cloud_1_tablet.svg | svg | 14 | 2023-03-27 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3ba` |
| cloud_4_tablet.svg | svg | 7 | 2023-03-27 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3bb` |
| cloud_2_tablet.svg | svg | 8 | 2023-03-27 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3b9` |
| cloud_3_tablet.svg | svg | 7 | 2023-03-27 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3b8` |
| sources.json | Lottie json | 36 | 2023-03-27 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3b5` |
| cloud_2.svg | svg | 8 | 2023-03-24 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3ad` |
| cloud_2.svg | svg | 8 | 2023-03-24 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3a9` |
| cloud_1.svg | svg | 9 | 2023-03-24 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f39d` |
| cloud_3.svg | svg | 8 | 2023-03-24 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f39b` |
| cloud_2.svg | svg | 6 | 2023-03-24 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f39a` |
| not_real_time.json | Lottie json | 789 | 2023-03-17 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f39c` |
| header_logo_tech.json | Lottie json | 15 | 2023-03-16 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f3a1` |
| header_logo_big_pupils.json | Lottie json | 15 | 2023-03-16 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f395` |
| not_real_time.json | Lottie json | 790 | 2023-03-16 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f398` |
| cloud_3_mobile.svg | svg | 7 | 2023-03-15 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f392` |
| cloud_2_mobile.svg | svg | 8 | 2023-03-15 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f391` |
| cloud_1_mobile.svg | svg | 8 | 2023-03-15 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f397` |
| path_main_mobile.svg | svg | 17 | 2023-02-19 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f389` |
| path_main_.svg | svg | 16 | 2023-02-17 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f38e` |
| path_main_.svg | svg | 16 | 2023-02-17 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f38b` |
| header_logo_tech.json | Lottie json | 15 | 2023-02-13 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f384` |
| header_logo_big_pupils.json | Lottie json | 15 | 2023-02-13 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f382` |
| Film_mobile.svg | svg | 1 | 2023-02-13 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f37f` |
| Texture_01.png | png | 55 | 2023-02-13 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f383` |
| Film_right.svg | svg | 1 | 2023-02-13 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f385` |
| section-divider.svg | svg | 0 | 2023-02-11 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f379` |
| not_real_time.json | Lottie json | 760 | 2023-01-31 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f36d` |
| not_real_time.json | Lottie json | 760 | 2023-01-31 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f342` |
| header_logo_menu.json | Lottie json | 12 | 2023-01-31 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f33d` |
| zoom.json | Lottie json | 17 | 2023-01-30 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f353` |
| parallax.json | Lottie json | 22 | 2023-01-30 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f352` |
| intro_menu.json | Lottie json | 41 | 2023-01-30 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f356` |
| zoom.json | Lottie json | 8372 | 2023-01-23 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f343` |
| parallax.json | Lottie json | 2028 | 2023-01-23 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f33e` |
| dimension.json | Lottie json | 10495 | 2023-01-23 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f34a` |
| masking.json | Lottie json | 3332 | 2023-01-23 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f340` |
| morph.json | Lottie json | 1565 | 2023-01-23 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f33b` |
| fade_in_out.json | Lottie json | 3777 | 2023-01-23 | тезка: файл з таким самим іменем, але іншим ID, вживається | `6ac8e84728488a6bd334f341` |
| Magilio-Regular.woff2 | woff2 | 7 | 2023-01-22 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f33c` |
| PPNeueMachina-PlainUltraboldItalic.otf | otf | 120 | 2023-01-13 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f334` |
| PPNeueMachina-PlainUltrabold.otf | otf | 120 | 2023-01-13 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f322` |
| PPNeueMachina-PlainRegularItalic.otf | otf | 119 | 2023-01-13 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f319` |
| PPNeueMachina-PlainRegular.otf | otf | 117 | 2023-01-13 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f333` |
| PPNeueMachina-PlainLightItalic.otf | otf | 119 | 2023-01-13 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f31d` |
| PPNeueMachina-PlainLight.otf | otf | 116 | 2023-01-13 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f315` |
| PPNeueMachina-InktrapUltraboldItalic.otf | otf | 121 | 2023-01-13 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f316` |
| PPNeueMachina-InktrapUltrabold.otf | otf | 121 | 2023-01-13 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f31b` |
| PPNeueMachina-InktrapRegularItalic.otf | otf | 120 | 2023-01-13 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f31a` |
| PPNeueMachina-InktrapRegular.otf | otf | 118 | 2023-01-13 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f30d` |
| PPNeueMachina-InktrapLightItalic.otf | otf | 119 | 2023-01-13 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f31c` |
| PPNeueMachina-InktrapLight.otf | otf | 118 | 2023-01-13 | шрифтовий файл (обережність) | `6ac8e84728488a6bd334f317` |

## Кандидати на видалення (203 шт, 320.5 MB)

Жоден ID-ключ і жодне ім'я не знайдені в жодному джерелі; усі створені до 2024-02-13; шрифтів немає.
Повний перелік з `copy_id` — `scratchpad/delete-candidates.json`. Нижче: назва (KB).

**mp4** — 126 шт, 316.11 MB  
The Heritage Museum_H.264.mp4 (10729); _Music Podcasts Website_H.264.mp4 (10578);  2_Animation_easing_(2)-1_H.264.mp4 (5866); “4”.mp4 (5735); “__”.mp4 (5735); PalmPalm Website_desktop-1_H.264.mp4 (5735); Fly - Dashboard_H_tablet.264.mp4 (5717); The Heritage Museum_H.264 (1).mp4 (5489);  3_Animation_easing_(2)-1_H.264.mp4 (5485);  1_Animation_linear_(2)-1_H.264.mp4 (5415); 1_CAR_EASING_COMPARISON_2x_H.264.mp4 (4956); 1_FLOWER_FULL_DEMO_2x_H.264.mp4 (4934); IMA-HOME Early_desktop-1_H.264.mp4 (4877); The Heritage Museum.mp4 (4745); "The Heritage Museum_desktop-1_H.264".mp4 (4745); The Heritage Museum_desktop-1_H.264.mp4 (4745); Fly_Dashboard_desktop-1_H.264.mp4 (4736); "IMA-HOME Early Concept_H.264".mp4 (4716); Online Museum of Old Games_H.264.mp4 (4577); Online Museum of Old.mp4 (4567); "Online Museum of Old_desktop-1_H.264".mp4 (4567); Online Museum of Old_desktop-1_H.264.mp4 (4567); "PalmPalm Website Animation_H.264".mp4 (4465);  2_Animation_easing_(1)-1_H.264.mp4 (4169); PalmPalm Website.mp4 (4168); "___".mp4 (4168);  3_Animation_easing_(1)-1_H.264.mp4 (4120);  1_Animation_linear_(1)-1_H.264.mp4 (3966); "IMA-HOME Early_mob-1_H.264".mp4 (3857); 1_FLOWER_FULL_DEMO2-1_H.264.mp4 (3787); Royal Caribbean_s Icon_H.264.mp4 (3641); Mobile House Website Animation_H.264.mp4 (3378); The Ways We Work.mp4 (3262); The Ways We Work_desktop-1_H.264.mp4 (3262); Mobile House.mp4 (3027); "Mobile House_desktop-1_H.264".mp4 (3027); Mobile House_desktop-1_H.264.mp4 (3027); 1_CAR_CURVE_DEMO_FULL_2x_H.264.mp4 (3013); milkinside.mp4 (2985); milkinside_desktop-1_H.264.mp4 (2985); PlayStation 5 Promo_desktop-1_H.264.mp4 (2952); Design Conference Promo.mp4 (2904); Design Conference Promo_desktop-1_H.264.mp4 (2904); Homepage Animation.mp4 (2828); Homepage Animation_desktop-1_H.264.mp4 (2828); 1_CAR_CURVE_DEMO_FULL_H.264.mp4 (2807);  Music Podcasts Website.mp4 (2630); _Music Podcasts Website_desktop-1_H.264.mp4 (2630); Siren Website Design_desktop-1_H.264.mp4 (2523); PlayStation 5 Promo.mp4 (2522); "PlayStation 5 Promo_desktop-1_H.264".mp4 (2522); “_”.mp4 (2483); Keep Website_desktop-1_H.264.mp4 (2483); "PlayStation 5 Promo_H.264".mp4 (2382); Royal Caribbean.mp4 (2352); Royal Caribbean_s Icon_desktop-1_H.264.mp4 (2352); Royal Caribbean's Icon_desktop-1_H.264.mp4 (2352); Fly_Dashboard.mp4 (2327); "_".mp4 (2327); IMA-HOME Early.mp4 (2295); "IMA-HOME Early_desktop-1_H.264".mp4 (2295); Website animation.mp4 (2272); Website animation_desktop-1_H.264.mp4 (2272); "tablet".mp4 (2251); Royal Caribbean_s Icon_mob-1_H.264.mp4 (1989); Flower Delivery_desktop-1_H.264.mp4 (1878); 1_FLOWER_FULL_DEMO-1_H.264.mp4 (1864); 1_CAR_CURVE_DEMO_H.264.mp4 (1769); Landing page concept.mp4 (1736); Landing page concept_desktop-1_H.264.mp4 (1736); "PlayStation 5 Promo_mob-1_H.264".mp4 (1611);  3_Animation_easing_(1)_H.264.mp4 (1549); Bike Shop Interaction.mp4 (1514); Bike Shop Interaction_desktop-1_H.264.mp4 (1514);  2_Animation_easing_(1)_H.264.mp4 (1508); "PalmPalm Website_mob-1_H.264".mp4 (1453); “___”.mp4 (1333);  3_Animation_easing_(2)_H.264.mp4 (1291);  2_Animation_easing_(2)_H.264.mp4 (1282); OpenColony Website_desktop-1_H.264.mp4 (1214); Flower Delivery.mp4 (1214); "Flower Delivery_desktop-1_H.264".mp4 (1214);  1_Animation_linear_(1)_H.264.mp4 (1195); "Fly_Dashboard_mob-1_H.264".mp4 (1188); Fly_Dashboard_mob-1_H.264.mp4 (1188); Siren Website Design.mp4 (1147); "Siren Website Design_desktop-1_H.264".mp4 (1147); "Flower Delivery_H.264".mp4 (1124);  1_Animation_linear_(2)_H.264.mp4 (1071); OpenColony Website.mp4 (1063); "OpenColony Website_desktop-1_H.264".mp4 (1063); Siren Website Design_H.264.mp4 (1031); Crappy Explanation.mp4 (1013); Crappy Explanation_desktop-1_H.264.mp4 (1013); Social Network Feed.mp4 (1002); Social Network Feed_desktop-1_H.264.mp4 (1002); OpenColony Website_H.264.mp4 (970);  3_TAB_Animation_delay_(1)_H.264.mp4 (925); "1_CAR_EASING_COMPARISON_2х_H.264".mp4 (914);  2_TAB_Animation_easing_(1)_H.264.mp4 (901); "Flower Delivery_mob-1_H.264".mp4 (867); Siren Website Design_mob-1_H.264.mp4 (867);  3_TAB_Animation_delay_(2)_H.264.mp4 (755);  2_TAB_Animation_easing_(2)_H.264.mp4 (751); breathtaking.mp4 (730); breathtaking_desktop-1_H.264.mp4 (730); "1_CAR_CURVE_DEMO_FULL_2х_H.264".mp4 (715); OpenColony Website_mob-1_H.264.mp4 (693);  1_TAB_Animation_linear_(1)_H.264.mp4 (658);  1_TAB_Animation_linear_(2)_H.264.mp4 (652); 1_linear_H.264.mp4 (626); "1_FLOWER_FULL_DEMO_2x_H.264".mp4 (620); 3_easing_and_delay_H.264.mp4 (584); “_____”.mp4 (510); 2_ease_H.264.mp4 (502); “____”.mp4 (468); "Keep Website.mp4_H.264".mp4 (448); Keep Website.mp4 (446); "__".mp4 (446);  3_MOB_Animation_delay_(1)_H.264.mp4 (343);  2_MOB_Animation_easing_(1)_H.264.mp4 (332); "Keep Website_mob-1_H.264".mp4 (325);  3_MOB_Animation_delay_(2)_H.264.mp4 (286);  2_MOB_Animation_easing_(2)_H.264.mp4 (265);  1_MOB_Animation_linear_(1)_H.264.mp4 (232);  1_MOB_Animation_linear_(2)_H.264.mp4 (210)

**jpg** — 4 шт, 1.86 MB  
Main+image_1600x1200@2x.jpg (1215); Cover_2.jpg (222); Cover_2.jpg (216); Cover_2.jpg (165)

**mov** — 1 шт, 1.44 MB  
1_CAR_CURVE_DEMO_.mov (1407)

**webp** — 23 шт, 0.47 MB  
lesson-6-3@2x.webp (54); lesson-4-3@2x.webp (46); lesson-5-2@2x.webp (26); lesson-7-2@2x.webp (25); lesson-1-3@2x.webp (23); lesson-8-3@2x.webp (23); lesson-5-3@2x.webp (22); lesson-8-2@2x.webp (21); lesson-2-3@2x.webp (21); lesson-5-1@2x.webp (21); lesson-4-1@2x.webp (20); lesson-1-2@2x.webp (17); lesson-1-1@2x.webp (16); lesson-4-2@2x.webp (16); lesson-7-3@2x.webp (15); lesson-3-2@2x.webp (14); lesson-7-1@2x.webp (14); lesson-6-1@2x.webp (13); lesson-8-1@2x.webp (13); lesson-6-2@2x.webp (12); flower-shor@2x.webp (12); lesson-2-2@2x.webp (10); lesson-3-3@2x.webp (9)

**svg** — 42 шт, 0.37 MB  
clouds-2.svg (23); clouds-group-visual.svg (23); clouds-group-visual_mobile.svg (23); clouds-group-visual_tablet.svg (23); footer-head-cloud-2.svg (20); bg_cloud.svg (15); bg_cloud.svg (15); clouds.svg (14); cloud_main_mobile.svg (14); bg_cloud_tablet.svg (14); cloud_main_mobile.svg (14); bg_cloud_mobile.svg (14); footer-head-cloud.svg (13); Cloud-main.svg (10); clouds-1.svg (10); left-visual.svg (9); menu_intro.svg (9); Cloud-1.svg (8); left_tablet.svg (8); Cloud-2.svg (8); menu_intro.svg (8); left_mobile.svg (8); Cloud-3.svg (8); cloud_4.svg (7); smoke_tablet.svg (5); right_tablet.svg (5); right_mobile.svg (5); right-visuals.svg (5); menu_easing.svg (4); logo-menu.svg (2); Film_main.svg (2); Film_main.svg (2); Film_main.svg (1); Film_tablet.svg (1); Film_main.svg (1); Film.svg (1); Film.svg (1); Film_left.svg (1); lesson-star-svg.svg (0); rotate_divider.svg (0); arrow-right-down.svg (0); linear.svg (0)

**png** — 4 шт, 0.20 MB  
Texture_Noise.png (178); Texture_01(100).png (15); favicon_256px.png (3); favicon_32px.png (0)

**Lottie json** — 3 шт, 0.09 MB  
preloader_circles.json (38); preloader_circles.json (38); preloader.json (14)

## Перед видаленням

- Видаляти лише в копії, за `copy_id` з `delete-candidates.json`, після явного «так» від користувача
  (`delete_asset` незворотний, API відновлення немає).
- Після видалення: переглянути staging копії (Home, Styleguide) і Designer на биті картинки/фони.

## Виконано (2026-10-09, сесія 4)

- Користувач дозволив видалити невживані файли з бібліотеки **копії**. Перевірка на
  staging після публікації — потім, за його рішенням.
- Головна сесія незалежно перевірила кандидатів перед видаленням. Свіжий HTML і
  CSS staging копії й лайву, `ix2-interactions.json` і `main-css.css` дали 0 збігів
  за ID та іменами. Усі 203 ID належать лише копії: в оригіналі збігів 0, бакет
  `6ac8e847…f2fe`.
- **Видалено 203 файли (320.5 MB)** через `data_assets_tool.delete_asset`. Це soft
  delete, API для відновлення немає. Ассетів у копії було 379, стало 176.
  В оригіналі 379, без змін.
- Список видалених із `copy_id`: `reference/asset-cleanup-deleted-2026-10-09.json`.
- Друга хвиля (45 тезок, 14 шрифтів, 5 файлів 2024-06-21) — лише після перевірки
  staging очима.
