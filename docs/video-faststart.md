# Відео на CDN: faststart (Firefox)

## Проблема

52 із 53 відео на `cdn.zajno.com/dev/motion/videos/` записані без faststart: індекс
`moov` лежить у кінці файлу (`ftyp → free → mdat → moov`). Chrome і Safari одразу
дотягують кінець файлу range-запитом. Firefox показує перший кадр лише після того,
як скачає більшу частину файлу (1–4 MB). Тому в Firefox відео в картках уроків,
у демо easing і в слайдері Intro з'являються із затримкою в кілька секунд.
Оригінал motion.zajno.com використовує ті самі файли, тож проблема є і на лайві.
Знайдено 2026-10-12 (сесія 44).

## Готові файли

`media-faststart/` (поза git, 76 MB) повторює шляхи CDN від кореня бакета
(`dev/motion/videos/...`), а список URL лежить у `media-faststart/files.txt`.
Файли перепаковано через `ffmpeg -map 0:v -map 0:a? -c copy -movflags +faststart`,
без перекодування. Відео й аудіо побітово ті самі; у 20 файлах прибрано порожню
службову доріжку (codec none). Перевірено: `moov` перед `mdat`, кількість кадрів,
розмір і тривалість збігаються з оригіналом.

`dimension_hevc.mov` уже мав faststart. VP9 `.webm` не чіпали: у WebM ця проблема не виникає.

## Заливка (робить користувач або студія)

Перезаписати файли за тими самими ключами в S3-бакеті за `cdn.zajno.com`, а потім
інвалідувати CloudFront. URL не змінюються, тож правки в Webflow не потрібні.

```sh
cd media-faststart
aws s3 sync dev s3://<bucket>/dev --exclude "*" --include "*.mp4" --content-type video/mp4
aws s3 sync dev s3://<bucket>/dev --exclude "*" --include "*.mov" --content-type video/quicktime
aws cloudfront create-invalidation --distribution-id <id> --paths "/dev/motion/videos/*"
```

Шляхи з `+` (`Flower+Delivery…`, `1_GYM+2x…`) S3 читає буквально (`%2B` дає 403),
`sync` це враховує сам.

## Код (module, той самий прохід)

- `setVideoSrc()` піднімає `preload` до `auto`, навіть коли `src` уже стоїть
  (раніше відео з `metadata` ніколи не буферизувалось наперед).
- `lazyVideo()` і демо одразу ставлять `preload="auto"` за пів екрана до появи.
- Картинки стеку Courses (`loading="lazy"`, `opacity: 0`) за екран до піна
  переходять на `eager`, бо Firefox вантажив їх лише тоді, коли пін ставав видимим.
