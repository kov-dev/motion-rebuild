# Ассети оригіналу — інвентаризація і кандидати на заміну (2026-10-09)

Read-only. Джерела: усі URL з `reference/live-home-2026-10-09.html` (img/srcset, video/audio
`<source>`, poster, Lottie `data-src`, script/link, url() в ембеді) + `url()` з CSS сайту +
MCP `list_assets` (379 ассетів, лише читання). Вага — `curl -sI` content-length (raw);
для текстових типів окремо **transfer** (br/gzip). Параметри відео/аудіо — `ffprobe` по URL.
Проби стиснення — на 3 відео, 4 картинках і 4 шрифтах у скретч-папці (у репо нічого не
завантажено). Класи/типографіка — у [styleguide-audit.md](styleguide-audit.md).

## 1. Підсумок по типах (унікальні файли, на які посилається Home)

| Тип | Файлів | Raw | Transfer | Хост | Коментар |
|---|---|---|---|---|---|
| **Відео** | 55 | **78.6 MB** | = raw | `cdn.zajno.com/dev/motion/videos/` | 52 `<video>`; з них tablet 6 (4.5 MB), mobile 6 (1.6 MB), 3 пари mov/webm |
| Звуки | 13 | 1.86 MB | = raw | `cdn.zajno.com/dev/motion/sounds/` | фон 1.62 MB, решта 12 ≈ 0.24 MB |
| JS | 14 | 1.55 MB | **475 KB** | різні CDN | webflow.js 168 KB br, gtag 177 KB br |
| Растр (png/webp/ico) | 51 | 1.42 MB | = raw | Webflow CDN | 23 постери карток (722 KB), 14 CMS-лого Resources + srcset (365 KB) |
| Lottie JSON | 30 | 1.34 MB | **131 KB** | Webflow CDN | 35 вставок; JSON стискається ×10 |
| SVG (CSS-фони) | 46 | 375 KB | 145 KB | Webflow CDN | desk 117 / tab 103 / mob 129 / **мертві селектори 72 KB** |
| Шрифти | 4 | 177 KB | = raw | Webflow CDN | woff2, повний гліф-сет |
| CSS | 1 | 96 KB | 18 KB | Webflow CDN | |
| HTML Home | 1 | 147 KB | 31 KB | | 69 inline SVG, 110 ембедів |
| **Разом** | **215** | **≈ 85.5 MB** | **≈ 83 MB** | | 94 % — відео |

Реалістичний десктопний максимум при повному прогортанні: ≈ 72 MB відео (мінус tablet/mobile-
варіанти і по одному файлу з пар mov/webm) + ≈ 4 MB решти. 46 відео мають `preload="none"`
(вантажить Finsweet autovideo у вʼюпорті), **6 — `autoplay` одразу** (2 з `autoplay="false"`,
що в HTML означає *увімкнено*; example-1 у 3 смугових копіях — усі три autoplay).

## 2. По секціях Home

| Секція | Відео (шт / MB) | Lottie (шт / raw KB) | Растр (шт / KB) | Інше |
|---|---|---|---|---|
| Navigation | — | 13 / 434 (3 лого + 10 карток меню) | — | 5 inline SVG соцмереж |
| Preloader | — | 4 / 118 (коло + **3 копії під смуги**) | — | |
| Hero | — | — | — | |
| Introduction | 8 / 9.6 (UI-слайдер, 6 слайдів) | — | — | SVG-шлях ×3 смуги (CSS) |
| Interactive | — | 1 / **665** (`not_real_time`) | — | |
| Techniques | — | — | — | `BG.svg`/`BG_mobile.svg`, зірки, divider (CSS) |
| Lessons: easing | 23 / 23.8 (18 examples = 6 × 3 смуги, 2 демо, 3 картки) | 11 вставок / 6 файлів (5 кривих ×2) | 9 / 388 | Splide |
| delay / fade / morph / masking | 4 / 8.5 · 3 / 5.0 · 3 / 10.2 · 3 / 6.8 | по 1 | 3–4 / 59–147 | |
| dimension / parallax / zoom | 5 / 4.0 · 3 / 5.8 · 3 / 4.9 | 0 / 1 / 1 | 2–3 / 49–107 | dimension: пара hevc/VP9 з альфою |
| Resources | — | — | 18 / 365 (CMS-лого @2x + srcset) | хмари SVG ×3 смуги |
| Footer | — | — | — | хмари SVG ×3 смуги |
| Глобально | — | — | texture 15 KB, favicon ×2 | 13 `<audio>` у кінці body, 14 скриптів |

## 3. Топ-15 найважчих (усі — відео)

| # | Файл | Секція | KB | Параметри |
|---|---|---|---|---|
| 1 | `lesson-2/IMA-HOME Early_desktop_H.264.mp4` | delay (картка) | 4101 | 936×534, 60 fps, **35.6 с** |
| 2 | `lesson-4/The Heritage Museum_desktop_H.264.mp4` | morph | 4039 | 936×534, 60 fps, 32.6 с |
| 3 | `lesson-4/Online Museum of Old_desktop_H.264.mp4` | morph | 3865 | 936×534, 60 fps, 31.9 с |
| 4 | `lesson-1/PalmPalm Website_desktop_H.264.mp4` | easing | 3816 | 936×534, 60 fps, 14.9 с, 2.1 Mbps |
| 5 | `lesson-1/Fly_Dashboard_desktop_H.264.mp4` | easing | 3128 | 936×534, 60 fps, 12.4 с, 2.1 Mbps |
| 6 | `lesson-7/The Ways We Work_desktop_H.264.mp4` | parallax | 2745 | 26.2 с |
| 7 | `lesson-4/Mobile House_desktop_H.264.mp4` | morph | 2576 | 23.2 с |
| 8 | `lesson-5/Design Conference Promo_desktop_H.264.mp4` | masking | 2564 | 22.7 с |
| 9 | `slider/optimise/3_House_og.mov` | introduction | 2563 | 1406×856, 60 fps, 5.6 с, **3.8 Mbps**, H.264 (не HEVC) |
| 10 | `lesson-7/milkinside_desktop_H.264.mp4` | parallax | 2511 | 20.2 с |
| 11 | `lesson-2/PlayStation 5 Promo_desktop_H.264.mp4` | delay | 2458 | 21.0 с |
| 12 | `lesson-5/Homepage Animation_desktop_H.264.mp4` | masking | 2410 | 20.2 с |
| 13 | `lesson-8/ Music Podcasts Website_desktop_H.264.mp4` | zoom | 2238 | 18.0 с (пробіл на початку імені) |
| 14 | `lesson-3/Siren Website Design_desktop_H.264.mp4` | fade | 2085 | 19.0 с |
| 15 | `lesson-5/Website animation_desktop_H.264.mp4` | masking | 1995 | 17.7 с |

Перший не-відео: `webflow.js` 665 KB raw / 168 KB br; `not_real_time.json` 665 KB raw / 60 KB br.

## 4. Деталі по типах

### 4.1 Відео (55 файлів, 78.6 MB)

| Група | Файлів | MB | Сумарно с | Специфіка |
|---|---|---|---|---|
| Картки «implementation» (3 на урок, посилання на Dribbble) | 24 | **52.6** | 424 | 936×534, **60 fps**, ~0.9–2.1 Mbps, 7–36 с; постер PNG окремим `<img>` |
| Examples (easing, 6 шт × desktop/tablet/mobile) | 18 | 13.9 | 83 | desk **2028×1000** 60 fps ~2.3 Mbps; tab 1376×790; mob 646×400 |
| UI-слайдер Introduction | 8 | 9.6 | 39 | 1406×856, 60 fps, до 3.8 Mbps; 2 слайди як пари `.mov` (`codecs="hvc1"`, а всередині H.264 **без альфи**) + VP9 webm |
| Демо уроків (CAR ×2, FLOWER, dimension ×2) | 5 | 2.5 | 16 | 1280×820 24 fps; dimension — справжня пара HEVC/VP9 **з альфою** |

Дублі: `Royal Caribbean_s Icon_desktop_H.264.mp4` лежить двічі (`lesson-3` і `lesson-6`,
1.9 MB кожен, різниця 0.02 с) — один контент. Постер `1_CAR_CURVE_DEMO_FULL` — і PNG
(`poster`, 115 KB), і WebP (`<img>`, 27 KB) одночасно; так само `1_CAR_EASING_COMPARISON`.
Імена з пробілами, `+`, кирилична «х» у `2х` (→ %D1%85 в URL).

### 4.2 Lottie (30 файлів, 35 вставок)

Усі векторні, вбудованих растрів немає. Transfer = br.

| Файл | Секція | Вставок | Raw KB | br KB | Канвас, fps, кадри |
|---|---|---|---|---|---|
| `not_real_time.json` | interactive | 1 | 665 | 59.6 | 567×567, 60, 206 (66 шарів) |
| `fade` / `morph` / `masking` / `intro_menu` / `sources` / `easing_menu` / `dimension` / `delay_menu` / `parallax` / `zoom` | Navigation (картки меню) | по 1 | 17–66 (∑ 390) | 2.3–5.4 (∑ 37) | 282×543, 60, 40 |
| `Preloader_lottie_circles_{desktop,tablet,mobile}` | Preloader | по 1 | 38 ×3 | 3.6 ×3 | 2086×1080 / 768×1024 / 430×932, 60, 192–231 — **один дизайн, 3 кадрування** |
| `preloader_2` | Preloader (коло) | 1 | 4 | 0.8 | 88×140, 24, 13 |
| `linear` / `ease` / `ease_in` / `ease_out` / `cubic` | easing (Splide) | **по 2** (active + not-active) | 8–28 (∑ 112) | 1.2–2.7 | 205×152, 60, 141 |
| `header_logo_{big_pupils,tech,menu}` | Navigation (лого-очі) | по 1 | 12–16 | 1.3–1.9 | 90×44, 30/60, 210–420 |
| `1_easing_visual` / `delay` / `Fade_in_out` / `Morph` / `Masking` / `Parallax` / `8_zoom` | hero-visual уроків | по 1 | 3–10 | 0.7–1.1 | 856×650, 30, 55–136 |

Висновок: за трафіком Lottie дешеві (131 KB br на всі). Ціна — **рантайм** lottie-web у
`webflow.js` і CPU: 35 плеєрів, більшість 60 fps; `not_real_time` — 66 шарів.

### 4.3 Растр (51 файл, 1.42 MB)

| Група | Шт | KB | Формат | Примітка |
|---|---|---|---|---|
| Постери карток `*_desktop_00000.png` | 23 (+1 дубль-URL) | 722 | PNG pal8 472×272 | 26 з 41 `<img>` — `loading="eager"` |
| Постери демо (CAR, FLOWER) | 5 + 2 srcset | ≈ 340 | 2 PNG (poster) + 3 WebP | PNG/WebP-дублі одного кадру |
| CMS-лого Resources `@2x.png` | 14 + 4 srcset `-p-500` | 365 | PNG pal8 1272×920 | лежать у **чужому** бакеті `63d28a87…` (AUDIT №10); у копії вже перенесено |
| Texture_01.png (зерно classic-anim) | 1 | 15 | PNG RGBA 100×100 | |
| Favicon .ico + 256 png | 2 | 7 | | |
| OG image (лише Styleguide/OG) | 1 + 3 srcset | — | PNG 1200w | |

### 4.4 SVG як CSS-фони (46 файлів)

Під кожну смугу окремий файл: хмари уроків `cloud_1…3` ×3 смуги, хмари Resources ×3,
футер (`Footer_*` 4 шари ×3 смуги), `BG`/`BG_mobile` (techniques), шлях intro
`path_mian_desktop` / `path_main_tablet` / `path_main_mobile` (+ мертві `path_main_.svg`,
`path_main_tablet.svg` старої версії на селекторах `.bg-wrap.is-main*`, яких немає в DOM).
`Footer_Cloud-3_mobile.svg` перевикористано як `cloud_3` уроку на mobile. Браузер вантажить
лише фон активної смуги; 72 KB мертвих — не вантажаться, але лежать у CSS.

### 4.5 Шрифти

4 woff2 (див. styleguide-audit §4): Plain 400 49 KB, Inktrap 400 50 KB, Inktrap 700 50 KB,
Magilio 400 28 KB — **177 KB**, повні гліф-сети (683 гліфи, кирилиця 95 — на сайті не потрібна).

### 4.6 Звуки (13 mp3, `<audio>` без `preload` → браузер вирішує сам, зазвичай метадані/весь файл)

| Файл | KB | Параметри |
|---|---|---|
| `motion_bg_low_vol.mp3` | 1662 | 64 с, **212 kbps** stereo 48 kHz, loop |
| `1_NOT_REAL_TIME.mp3` | 68 | 3.5 с, 158 kbps |
| `hover_1…10.mp3` | 176 разом | 0.4–0.8 с, ~270 kbps |
| `perc_click.mp3` | 2 | 0.19 с |

### 4.7 JS / CSS

| Файл | Raw KB | br KB | Доля в перезбірці |
|---|---|---|---|
| `webflow.bc78bd593.js` (IX2 + lottie-web) | 665 | 168 | лишається (Webflow), з IX3 зміниться |
| gtag `G-CP1VPL4VKN` | 528 | 177 | лишається (аналітика) |
| jQuery 3.5.1 | 87 | 30 | Webflow вантажить сам |
| matter.min.js 0.18.0 | 78 | 21 | лишається (сфера) |
| gsap 3.10.4 + ScrollTrigger 3.10.4 + MotionPath 3.11.4 + CustomEase 3.10.4 + Observer 3.11.4 | 139 | 52 | одна версія, пінована |
| lenis `@latest` (studio-freight, репо перейменоване) | 29 | 7 | пінувати |
| splide 2.4.21 | 28 | 11 | **прибрати** (рішення «без сторонніх слайдерів») |
| script.v33.min.js | 25 | 6 | замінюється модулем `src/` |
| autovideo (Finsweet) / ifvisible | 3 / 3 | 2 / 1 | замінити своїм IntersectionObserver / прибрати |
| CSS сайту | 96 | 18 | |

## 5. Бібліотека ассетів Webflow (MCP `list_assets`)

| | Шт | MB | Склад |
|---|---|---|---|
| Усього | 379 | 350.9 | |
| Вживаються (Home/Styleguide/CSS) | 49 | 1.2 | PNG 25, Lottie 13, шрифти 4, WebP 3, SVG 4 (решта SVG — inline-ембеди) |
| **Не вживаються** | 330 | **≈ 349.7** | **128 mp4 (309 MB, чернетки 2023-02…04)**, 40 Lottie (33 MB, до 10 MB кожен), 13 otf (1.5 MB), 108 SVG, 23 WebP, 5 JPG, 3 GIF, 1 mov |

Відео сайту давно живуть на `cdn.zajno.com`, а старі завантаження лишились у Webflow.
Дублювання сайту скопіювало їх і в копію. Чистити **лише в копії** і лише з дозволу
користувача (видалення через API незворотне).

## 6. Кандидати на заміну і економія

Проби: `ffmpeg libx264 -crf 24–26 -preset slow -movflags +faststart`, SSIM до оригіналу
**0.994–0.997** (на око без різниці); WebP `cwebp -q 80`; AVIF `libsvtav1 -crf 35`;
шрифти `fontTools.subset` (Latin + Latin-1 + типографські знаки).

| # | Що | Зараз | Пропозиція | Проба | Економія (орієнтовно) |
|---|---|---|---|---|---|
| 1 | **24 відео-картки** | 52.6 MB, 60 fps, до 36 с | перекодувати H.264 CRF 26 + faststart; лишити 60 fps (30 fps дає ~0) | IMA-HOME 4.10 → 1.67 MB (−60 %) | **−31 MB**. Якщо обрізати петлі до ~10 с (дизайн-рішення): 4.10 → 0.51 MB → **≈ −40 MB** |
| 2 | **Examples easing ×3 смуги** | 13.9 MB (18 файлів), desk 2028×1000 | один `<video>` + вибір src за `matchMedia` (лише активна смуга); desk → 1440w CRF 24 | example-5 1.59 → 0.81 MB (повна роздільність, −49 %), → 0.39 MB (1440w, −75 %) | −7…−10 MB файлів; на сторінку — не вантажити 2 зайві смуги (зараз example-1 autoplay ×3) |
| 3 | **UI-слайдер, пари .mov/.webm** | 9.6 MB, «hevc» насправді H.264 без альфи | 1 mp4 H.264 CRF 24 на слайд (6 файлів замість 8) | House .mov 2.56 → 1.22 MB (−53 %) | −6 MB файлів (≈ −3…−4 MB на завантаження, бо браузер бере один із пари) + мінус 2 файли; `dimension` (справжня альфа) лишити парою HEVC/VP9 |
| 4 | **Постери карток PNG** | 23 × PNG, 722 KB, eager | AVIF (fallback WebP) + `loading="lazy"`; або `poster` прямо на `<video>` | 59.7 KB → WebP 12.5 (−79 %) / AVIF 6.9 KB (−88 %); постер CAR 117 → 28 / 12 KB | **−570…−640 KB** + не вантажити до скролу |
| 5 | **Фоновий звук** | 1.62 MB, 212 kbps | mp3 96 kbps mono/joint або AAC 96; вантажити **лише після «sound on»** | розрахунок за бітрейтом | −0.9 MB файлу; 0 KB на першому завантаженні (13 `<audio>` → lazy) |
| 6 | Шрифти | 177 KB | subset Latin; Magilio — лише гліфи 2 фраз (або A–Z a–z) | Neue Machina 50 → 28 KB (×3); Magilio 28 → 8 KB | **−84 KB** (−47 %). Перевірити ліцензію Pangram Pangram на subset |
| 7 | Lottie прелоадера | 4 файли, 3 копії під смуги | GSAP/CSS (рішення вже є) | — | −117 KB raw / −11 KB br, −4 плеєри |
| 8 | Lottie кривих easing (5 файлів ×2 вставки) | 10 плеєрів 60 fps | SVG-крива + GSAP (CustomEase-path + MotionPath кульки) | — | −112 KB raw / −11 KB br, −10 плеєрів |
| 9 | Lottie карток меню (10) і лого-очей (3) | 13 плеєрів | лишити Lottie (IX3 керує) у форматі **dotLottie** або перемалювати SVG+GSAP при проході Navigation | dotLottie ≈ br-розмір | трафік ~0 (вже 37 KB br); виграш — CPU/рантайм |
| 10 | `not_real_time.json` | 665 KB raw / 60 KB br, 66 шарів | dotLottie, або відео з альфою, якщо не інтерактивне | — | трафік ~0; виграш у парсингу (665 KB JSON) |
| 11 | Дублі | Royal Caribbean ×2, постери PNG+WebP | один файл | — | −1.9 MB + ~220 KB |
| 12 | Splide, autovideo, ifvisible, 2-га версія GSAP | 34 KB raw | прибрати / одна версія | — | −15 KB br |
| 13 | CMS-лого Resources PNG pal8 | 365 KB | WebP lossless або лишити PNG (палітрові, стискаються погано) | 23.2 → 20.2 KB (−13 %), lossy WebP навіть більший | ~−45 KB — низький пріоритет |
| 14 | Мертві SVG у CSS, 330 невживаних ассетів | 72 KB у CSS; 350 MB у бібліотеці | видалити в копії | — | гігієна, на вагу сторінки не впливає |

**Разом по відео (п. 1–3, 11):** 78.6 → ≈ 34 MB без зміни тривалості (−57 %), ≈ 25 MB
(−68 %) з обрізанням петель карток до ~10 с. Решта ассетів (raw): ≈ 7 → ≈ 5 MB.

## 7. Несподіванки

- 94 % ваги — відео; 24 «картки» (посилання на Dribbble) — 52.6 MB, довші за пів хвилини.
- `.mov` у слайдері підписані `codecs="hvc1"`, а всередині H.264 без альфи — пари mov/webm
  там не потрібні. Справжня альфа лише в `dimension`.
- `autoplay="false"` вмикає autoplay (булевий атрибут); у двох відео ще й `widht` замість `width`.
- example-1 має autoplay у всіх трьох смугових копіях — ймовірно, вантажаться всі три
  (перевірити в DevTools → Network на копії).
- Lottie «важкі» лише в raw: `not_real_time` 665 KB → 60 KB br. Справжня ціна — рантайм.
- 13 `<audio>` (1.9 MB) без `preload="none"` при вимкненому за замовчуванням звуці.
- У бібліотеці Webflow 330 невживаних файлів на ≈ 350 MB (переїхали і в копію).
- Lenis тягнеться з `studio-freight/lenis@latest` — репозиторій перейменовано; працює, доки
  jsDelivr віддає старий шлях.
