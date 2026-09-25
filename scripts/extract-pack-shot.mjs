/**
 * Cut the pack shot out of a SLAPPZ strain sheet.
 *
 * SLAPPZ supplies each SKU as a full 1024 × 1536 strain sheet — logo, strain name, the
 * product photograph, strain copy, effects, compliance badges. The product cards want just
 * the product: they render `object-contain` on the card surface, so a plain rectangular crop
 * would sit there as a visible box of someone else's background.
 *
 * So this crops the tube-and-pre-roll band and feathers its edges to transparent, which melts
 * the sheet's smoke into the card instead of ending at a hard line. It is NOT a background
 * removal: keying here would mean separating a glossy black tube from dark purple smoke, and
 * every threshold that takes the smoke also takes a bite out of the tube. Feathering keeps
 * every drawn pixel and just lets the frame fall away.
 *
 * The band is found rather than hardcoded — the three sheets place the product at slightly
 * different heights. The pre-roll is located by its warm beige against everything else, then
 * the tube is taken as the run of content above it, up to the gap under the "PRE-ROLL | 1G"
 * line.
 *
 * Usage: node scripts/extract-pack-shot.mjs <sheet.jpeg> <out.webp>
 */
import sharp from 'sharp';

const [, , input, output] = process.argv;

if (!input || !output) {
  console.error('Usage: node scripts/extract-pack-shot.mjs <sheet.jpeg> <out.webp>');
  process.exit(1);
}

/** Horizontal window to search in, skipping the sheet's smoky margins. */
const SEARCH = { x0: 40, x1: 990 };
/**
 * Head room is deliberately small. The detector already stops in the dark gap directly above
 * the tube, and the rows above that gap are not empty — they hold drifting smoke and the
 * "GOOD FLOWERS GOOD PEOPLE" script, which at 26px of head room came through as a legible
 * fragment floating over the top-right corner of the card.
 */
const HEAD_ROOM = 10;
const FOOT_ROOM = 10;
/** The product itself spans about this much of the sheet; the rest is background. */
const CROP = { x0: 45, x1: 985 };
/** Feather widths. Wider left/right because that is where the smoke is heaviest. */
const FEATHER = { x: 70, y: 20 };
const OUT_WIDTH = 1000;

const { data, info } = await sharp(input).raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const span = SEARCH.x1 - SEARCH.x0;

const at = (x, y) => {
  const i = (y * W + x) * C;
  return [data[i], data[i + 1], data[i + 2]];
};

// Row profiles: how much of each row is the pre-roll's beige, and how much is lit at all.
const tan = new Array(H).fill(0);
const lit = new Array(H).fill(0);
for (let y = 0; y < H; y++) {
  for (let x = SEARCH.x0; x < SEARCH.x1; x++) {
    const [r, g, b] = at(x, y);
    if (Math.max(r, g, b) > 70) lit[y]++;
    if (r > 130 && g > 110 && b > 70 && r > b + 25 && Math.abs(r - g) < 60) tan[y]++;
  }
}

// The pre-roll: the first run of rows that is substantially beige.
let rollTop = -1;
let rollBottom = -1;
for (let y = 0; y < H; y++) {
  if (tan[y] > span * 0.2) {
    if (rollTop < 0) rollTop = y;
    rollBottom = y;
  } else if (rollTop >= 0 && y - rollBottom > 25) {
    break;
  }
}
if (rollTop < 0) throw new Error(`no pre-roll found in ${input}`);

// The tube sits directly above it; walk up to the dark gap under the strain line.
let top = rollTop;
for (let y = rollTop; y > rollTop - 320 && y > 0; y--) {
  if (lit[y] < span * 0.12) {
    top = y;
    break;
  }
}
let bottom = rollBottom;
for (let y = rollBottom; y < rollBottom + 160 && y < H; y++) {
  if (lit[y] < span * 0.12) {
    bottom = y;
    break;
  }
}

const left = CROP.x0;
const width = CROP.x1 - CROP.x0;
const cropTop = Math.max(0, top - HEAD_ROOM);
const height = Math.min(H - cropTop, bottom - top + HEAD_ROOM + FOOT_ROOM);

const cropped = await sharp(input)
  .extract({ left, top: cropTop, width, height })
  .ensureAlpha()
  .raw()
  .toBuffer();

// Feather: a cosine ramp reads softer than a straight line and leaves no visible seam.
const ramp = (d, over) => {
  if (d >= over) return 1;
  return 0.5 - 0.5 * Math.cos((Math.max(0, d) / over) * Math.PI);
};

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const a =
      ramp(Math.min(x, width - 1 - x), FEATHER.x) * ramp(Math.min(y, height - 1 - y), FEATHER.y);
    const o = (y * width + x) * 4 + 3;
    cropped[o] = Math.round(cropped[o] * a);
  }
}

await sharp(cropped, { raw: { width, height, channels: 4 } })
  .resize({ width: OUT_WIDTH, withoutEnlargement: true })
  .webp({ quality: 88, alphaQuality: 100 })
  .toFile(output);

console.log(
  `${input}: pre-roll ${rollTop}-${rollBottom}, band ${top}-${bottom} → crop ${width}×${height} → ${output}`,
);
