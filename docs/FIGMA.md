# Figma — фрейми по секціях

Файл: `Motion (DEV)` — `KJQjG15P2P3SkXwrJJxLOp`.
Макет нарізаний посекційно; цілісного фрейму сторінки немає. Дизайнер
розкадровував анімацію, тому у фреймі секції можуть бути кілька станів.

**Правило:** головна сесія фрейми не читає. Аналіз робить субагент
(`Agent`, `model: sonnet`, `subagent_type: general-purpose`) за шаблоном
[sections/README.md](sections/README.md), один фрейм за прохід, результат у
`docs/sections/<section>.md`. Перед `get_design_context` — скіл
`figma:figma-design-to-code`; дивитись оцінку токенів (`get_metadata`), понад
~10k — дробити на дочірні вузли.

✅ **2026-10-09 (сесія 4):** доступ є (той самий акаунт MCP). Блокер сесії 3 знято.

Сторінки файлу (`get_metadata` без nodeId): `0:1` Cover · `1301:36378` **Design system** ·
`2122:30430` Dribbble · `1955:26377` Awwards · `2441:2827` Case study ·
`2425:1985` European Design Awards · `1301:33520` **Preloader** · `1301:33919` **1. Home** ·
`675:11687` **Full design** · `2125:31570` Codepen · `1966:38869` Card · `1790:27751` TRASH.
Сторінки `Design system` (токени для етапу 2), `Preloader` і `Full design` (можливо, цілісний
макет сторінки) ще не розібрані. Перевірити їх у відповідних проходах.

**Макетів 768/375 у фреймах Hero та Intro немає**, є лише 1440. Мобайл і планшет
беремо з лайву, записів і стилів Webflow.

| Секція | node-id | Посилання | Додано | Аналіз |
|---|---|---|---|---|
| Home (hero) | `4608-23740` | https://www.figma.com/design/KJQjG15P2P3SkXwrJJxLOp/Motion--DEV-?node-id=4608-23740&m=dev | 2026-10-09 | ✅ [sections/hero.md](sections/hero.md): 13 фреймів 1440×750, з них 5 Home (3 стани hero + 2 початок Intro) і 8 Preloader(4..11) |
| Intro | `4608-23742` | https://www.figma.com/design/KJQjG15P2P3SkXwrJJxLOp/Motion--DEV-?node-id=4608-23742&m=dev | 2026-10-09 | ✅ [sections/intro.md](sections/intro.md): фрейм `869:18299` 1440×3810, один статичний стан, без SVG-шляху, UI-слайдера й відео |
| Interactive | — | TODO: користувач додасть | | |
| Techniques | — | TODO | | |
| Lessons | — | TODO | | |
| Resources | — | TODO | | |
| Footer | — | TODO | | |
| Preloader | `4608-23740` (Preloader(4..11)) + сторінка `1301:33520` | — | 2026-10-09 | ⬜ розібрати в проході Preloader |
| Styleguide | — | TODO (якщо є) | | |
