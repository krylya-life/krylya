/*
 * optimize-images.mjs — генерирует WebP-версии фотографий в public/assets.
 *
 * Зачем: фото кейсов и статей лежат в public/ и отдаются «как есть» —
 * Astro их не оптимизирует. JPEG по 0,5–1,3 МБ тормозят загрузку страниц
 * (LCP), особенно на мобильном интернете. WebP при том же качестве
 * весит в 3–5 раз меньше.
 *
 * Что делает: для каждого .jpg/.jpeg/.png рядом кладёт два файла —
 *   name.webp      — полный размер (до 2000 px по длинной стороне), q78
 *                    → обложки кейсов и статей, лайтбокс
 *   name-640.webp  — уменьшенный, q72
 *                    → миниатюры галереи, карточки превью
 * Оригиналы не трогает: они остаются фоллбэком в <picture> для браузеров
 * без поддержки WebP и источником для повторной конвертации.
 *
 * Побочно пишет src/data/image-manifest.json — фактические ширины версий.
 * Их читает компонент Picture.astro, чтобы честно проставить srcset
 * и браузер выбирал нужный размер, а не «на глаз».
 *
 * Запуск: node scripts/optimize-images.mjs
 * Идемпотентен — уже сделанные и не изменившиеся файлы пропускает.
 */
import { readdir, stat, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
// Папки с фотографиями: кейсы и статьи в assets/, портреты команды в team/
const SOURCE_DIRS = [path.join(PUBLIC, "assets"), path.join(PUBLIC, "team")];
const MANIFEST = path.join(ROOT, "src", "data", "image-manifest.json");

const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png"]);
const FULL_MAX_WIDTH = 2000;
const THUMB_WIDTH = 640;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

/** Существует ли актуальная версия (есть и не старее исходника). */
async function isFresh(target, sourceMtime) {
  try {
    const s = await stat(target);
    return s.mtimeMs >= sourceMtime;
  } catch {
    return false;
  }
}

const kb = (bytes) => Math.round(bytes / 1024);

async function main() {
  let converted = 0;
  let skipped = 0;
  let sourceBytes = 0;
  let webpBytes = 0;
  /** { "/assets/cases/slug/cover.jpg": { full: 2000, thumb: 640 } } — ключ = URL оригинала */
  const manifest = {};

  for (const dir of SOURCE_DIRS) {
    for await (const file of walk(dir)) {
      const ext = path.extname(file).toLowerCase();
      if (!SOURCE_EXT.has(ext)) continue;

      const source = await stat(file);
      const base = file.slice(0, -ext.length);
      const fullOut = `${base}.webp`;
      const thumbOut = `${base}-${THUMB_WIDTH}.webp`;
      const url = "/" + path.relative(PUBLIC, file).split(path.sep).join("/");

      sourceBytes += source.size;

      const fresh =
        (await isFresh(fullOut, source.mtimeMs)) && (await isFresh(thumbOut, source.mtimeMs));

      if (fresh) {
        skipped += 1;
        webpBytes += (await stat(fullOut)).size + (await stat(thumbOut)).size;
        manifest[url] = {
          full: (await sharp(fullOut).metadata()).width,
          thumb: (await sharp(thumbOut).metadata()).width,
        };
        continue;
      }

      const image = sharp(file, { failOn: "none" }).rotate(); // rotate() применяет EXIF-поворот
      const { width = 0 } = await image.metadata();

      const fullWidth = Math.min(width || FULL_MAX_WIDTH, FULL_MAX_WIDTH);
      const thumbWidth = Math.min(width || THUMB_WIDTH, THUMB_WIDTH);

      await image
        .clone()
        .resize({ width: fullWidth, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(fullOut);

      await image
        .clone()
        .resize({ width: thumbWidth, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toFile(thumbOut);

      manifest[url] = { full: fullWidth, thumb: thumbWidth };
      webpBytes += (await stat(fullOut)).size + (await stat(thumbOut)).size;
      converted += 1;
      console.log(
        `  ${path.relative(PUBLIC, file)}: ${kb(source.size)} КБ → ` +
          `${kb((await stat(fullOut)).size)} КБ + ${kb((await stat(thumbOut)).size)} КБ (мини)`,
      );
    }
  }

  await mkdir(path.dirname(MANIFEST), { recursive: true });
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n", "utf8");

  console.log(
    `\nГотово: сконвертировано ${converted}, пропущено (уже актуальны) ${skipped}.\n` +
      `Исходники: ${kb(sourceBytes)} КБ → WebP (обе версии): ${kb(webpBytes)} КБ.\n` +
      `Манифест: ${path.relative(ROOT, MANIFEST)} (${Object.keys(sorted).length} файлов).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
