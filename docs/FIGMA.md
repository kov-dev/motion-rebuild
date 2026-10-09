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

⛔ **2026-10-09 (сесія 3):** Figma MCP (акаунт p.kovanov.p@gmail.com, команди
Landings pro / Projects) на `get_metadata` і `get_screenshot` для обох фреймів
відповідає «you don't have edit access to this file». Файл лежить в іншій
команді/воркспейсі. Потрібно дати цьому акаунту доступ (view достатньо) або
посилання на копію файлу в доступній команді. Потім перезапустити субагента
тим самим промптом.

| Секція | node-id | Посилання | Додано | Аналіз |
|---|---|---|---|---|
| Home (hero) | `4608-23740` | https://www.figma.com/design/KJQjG15P2P3SkXwrJJxLOp/Motion--DEV-?node-id=4608-23740&m=dev | 2026-10-09 | ⛔ немає доступу |
| Intro | `4608-23742` | https://www.figma.com/design/KJQjG15P2P3SkXwrJJxLOp/Motion--DEV-?node-id=4608-23742&m=dev | 2026-10-09 | ⛔ немає доступу |
| Interactive | — | TODO: користувач додасть | | |
| Techniques | — | TODO | | |
| Lessons | — | TODO | | |
| Resources | — | TODO | | |
| Footer | — | TODO | | |
| Preloader | — | TODO | | |
| Styleguide | — | TODO (якщо є) | | |
