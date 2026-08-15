/**
 * Brand image optimizer.
 *
 *   node scripts/optimize-brand-image.mjs <input> <output.webp> [maxWidth=2400] [quality=82]
 *
 * Campaign and lifestyle photography arrives as huge PNGs/JPEGs. Anything committed to
 * /public/brand must be resized and re-encoded first — the Instagram in-app browser is the
 * primary runtime and a 6MB hero is not acceptable there (see CLAUDE.md § PERFORMANCE).
 *
 * next/image still resizes per device at request time; this just keeps the SOURCE sane so
 * the repo doesn't carry multi-megabyte originals.
 *
 * `sharp` is not a declared dependency — it ships with Next.js, which is why this is a
 * standalone script rather than part of the build.
 */

import path from 'node:path';

const [, , input, output, maxWidth = '2400', quality = '82'] = process.argv;

if (!input || !output) {
  console.error('Usage: node scripts/optimize-brand-image.mjs <input> <output.webp> [maxWidth] [quality]');
  process.exit(1);
}

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.error(
    'sharp is unavailable. It normally ships with Next.js — try `npm install` first, ' +
      'or `npm install --no-save sharp` for a one-off run.',
  );
  process.exit(1);
}

const info = await sharp(path.resolve(input))
  .resize({ width: Number(maxWidth), withoutEnlargement: true })
  .webp({ quality: Number(quality), effort: 5 })
  .toFile(path.resolve(output));

console.log(
  `${output} — ${info.width}×${info.height}, ${Math.round(info.size / 1024)}KB`,
);
