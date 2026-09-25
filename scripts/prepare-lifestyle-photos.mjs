/**
 * Prepares SLAPPZ's supplied event/retail photography for the site.
 *
 *   node scripts/prepare-lifestyle-photos.mjs
 *
 * The originals are WhatsApp exports — mixed cameras, mixed sizes, 80KB to 3MB, and
 * filenames that carry no meaning. This turns the selected ones into named, uniformly
 * cropped WebP tiles so the sections they land in read as one set rather than a phone roll.
 *
 * Three things are deliberately uniform, because that is what makes them "flow":
 *
 *   - ASPECT. Every tile is 4:5. The sources are all 3:4, so this trims ~6% off the height
 *     and nothing else — no source is ever stretched or letterbox-padded.
 *   - GRADE. A very light, identical lift (saturation +4%, contrast +3%). Enough to stop a
 *     dim shop interior sitting next to a bright marina and looking broken; not enough to
 *     restyle anyone's photograph. Real photos, lightly matched — not filtered.
 *   - ENCODE. WebP q82, same as scripts/optimize-brand-image.mjs.
 *
 * The 28 originals live in /brand/source/lifestyle, NOT in /public. They are ~17MB and
 * nothing references them, so serving them would ship 17MB of dead weight to every Vercel
 * deploy. /brand is documentation, not a served directory — same place the rest of the
 * provenance lives.
 *
 * `sharp` is not a declared dependency — it ships with Next.js. Same arrangement as the
 * other scripts in here.
 */

import path from 'node:path';

const SRC = 'brand/source/lifestyle';
const OUT = 'public/brand/slappz/lifestyle';
const CAMPAIGN = 'public/brand/slappz/campaign';
const ASPECT = 4 / 5;
const WIDTH = 1100;
const QUALITY = 82;

/**
 * Per-pick overrides:
 *
 *   aspect  — defaults to 4:5. The About page's image slot is landscape, so that one tile
 *             is cut wide from the original rather than letting object-cover slice a
 *             portrait crop and behead the wordmark on the table cloth.
 *   band    — [top, bottom] as fractions of the source height, applied BEFORE the resize.
 *             Used to steer what survives the crop: dropping a crowd out of the bottom of
 *             one frame, keeping a full table in another.
 */

/**
 * Selections from the 28 supplied frames. `note` records what is actually visible in the
 * frame — captions on the site are written from these and never from anything inferred,
 * so no tile makes a claim the photograph does not itself support.
 */
const PICKS = [
  {
    from: 'WhatsApp Image 2026-09-25 at 6.45.46 PM (9).jpeg',
    to: 'slappz-midtown-night.webp',
    note: '1g tube held up on a packed street, tower lit blue and orange behind.',
    // Street-fair crowd fills the bottom of the frame. Keeping the top 86% holds the tube
    // and the skyline and drops most of the faces — nobody in a crowd shot signed up to be
    // the subject of a tile.
    band: [0, 0.86],
  },
  {
    from: 'WhatsApp Image 2026-09-25 at 6.45.47 PM (7).jpeg',
    to: 'slappz-cannafamily-cab.webp',
    note: 'SLAPPZ tee and tin on a yellow cab, CannaFamily Dispensary storefront behind.',
  },
  {
    from: 'WhatsApp Image 2026-09-25 at 6.45.47 PM.jpeg',
    to: 'slappz-penn-station.webp',
    note: '1g tube held up at the 34 St–Penn Station A/C/E entrance.',
  },
  {
    from: 'WhatsApp Image 2026-09-25 at 6.45.46 PM (2).jpeg',
    to: 'slappz-waterfront-table-wide.webp',
    note: 'The same waterfront setup, cut landscape for the About page slot.',
    // 5:4 to match the measured container, and banded so the table cloth's wordmark lands
    // whole with water still above it. A centre crop of the portrait version cut the
    // wordmark in half.
    // Measured off the source: water 33-45%, product on the table 52-65%, the wordmark on
    // the cloth 72-90%. A 0.60 band is exactly 5:4 at this source width, so this crop is
    // the final framing — sharp never has to trim it again and nothing drifts.
    aspect: 5 / 4,
    band: [0.33, 0.93],
  },
  {
    from: 'WhatsApp Image 2026-09-25 at 6.45.45 PM (1).jpeg',
    to: 'slappz-shelf-marble.webp',
    note: 'SLAPPZ HQ table on the floor of a licensed dispensary, marble floor.',
  },
  {
    from: 'WhatsApp Image 2026-09-25 at 6.45.47 PM (3).jpeg',
    to: 'slappz-shelf-woodroom.webp',
    note: 'SLAPPZ HQ table laid out in a wood-panelled dispensary.',
  },
  {
    from: 'WhatsApp Image 2026-09-25 at 6.45.46 PM (6).jpeg',
    to: 'slappz-shelf-blueroom.webp',
    note: 'SLAPPZ HQ table beside a full product wall in a licensed shop.',
  },
];

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.error('sharp is unavailable — try `npm install` first.');
  process.exit(1);
}

for (const pick of PICKS) {
  let pipeline = sharp(path.resolve(SRC, pick.from));

  if (pick.letterbox) {
    const { width, height } = await pipeline.metadata();
    const [top, bottom] = pick.letterbox;
    pipeline = await sharp(
      await pipeline
        .extract({ left: 0, top, width, height: height - top - bottom })
        .png()
        .toBuffer(),
    );
  }

  if (pick.band) {
    const { width, height } = await pipeline.metadata();
    const [from, to] = pick.band;
    pipeline = pipeline.extract({
      left: 0,
      top: Math.round(height * from),
      width,
      height: Math.round(height * (to - from)),
    });
  }

  const width = pick.width ?? WIDTH;
  pipeline = pipeline
    .resize({
      width,
      height: Math.round(width / (pick.aspect ?? ASPECT)),
      fit: 'cover',
      position: 'centre',
      withoutEnlargement: false,
    })
    .modulate({ saturation: 1.04 })
    .linear(1.03, -4);

  if (pick.sharpen) pipeline = pipeline.sharpen({ sigma: 1, m1: 0.6, m2: 0.4 });

  const info = await pipeline
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(path.resolve(pick.dir ?? OUT, pick.to));

  console.log(`${pick.to.padEnd(32)} ${info.width}x${info.height}  ${String(Math.round(info.size / 1024)).padStart(4)}KB`);
}
