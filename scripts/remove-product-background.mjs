/**
 * Knock the white studio background out of a product shot.
 *
 *   node scripts/remove-product-background.mjs <input> <output.webp> [threshold=232]
 *
 * Menu pack shots arrive on a white sweep. This site is black, so a white square would read
 * as a broken image. This makes the sweep transparent.
 *
 * Deliberately a FLOOD FILL from the border rather than a global "delete light pixels":
 * a global threshold would also punch holes through the pale pre-roll and the white
 * compliance label on the tube. Only background connected to the edge is removed, so
 * anything enclosed by the product survives.
 *
 * The alpha channel is then blurred very slightly to feather the cut and keep the soft
 * contact shadow from turning into a hard jagged edge.
 *
 * `sharp` ships with Next.js, so this is a standalone script rather than part of the build.
 */

import path from 'node:path';

const [, , input, output, thresholdArg = '232'] = process.argv;

if (!input || !output) {
  console.error(
    'Usage: node scripts/remove-product-background.mjs <input> <output.webp> [threshold]',
  );
  process.exit(1);
}

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.error('sharp is unavailable. Run `npm install` first.');
  process.exit(1);
}

const THRESHOLD = Number(thresholdArg);

// Read the real geometry off the decoded buffer rather than assuming it. A JPEG decodes to
// 3 channels, and indexing it as if it were 4 shears every row against the next — which
// looks like horizontal banding, not like an obviously wrong result.
const { data, info } = await sharp(path.resolve(input))
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

/**
 * A pixel counts as background if it is light AND colour-neutral.
 *
 * Lightness alone is not enough: these sweeps are gradients, so any single cutoff either
 * leaves grey patches behind or eats into the pre-roll. Neutrality is the reliable
 * discriminator — the sweep is grey (R≈G≈B) while the rolling paper is tan and the flower
 * is olive, both of which carry a channel spread well above this tolerance.
 */
const NEUTRAL_TOLERANCE = 10;

/**
 * Two tiers, because the sweep is not uniformly neutral: the contact shadow directly under
 * the pre-roll picks up a warm cast from it. The second tier catches those pixels by
 * demanding they be much brighter instead — brighter than any part of the rolling paper, so
 * the product itself can never qualify.
 */
const WARM_FLOOR = 230;
const WARM_TOLERANCE = 30;

const isLight = (i) => {
  const o = i * channels;
  const r = data[o];
  const g = data[o + 1];
  const b = data[o + 2];
  const max = Math.max(r, g, b);
  const spread = max - Math.min(r, g, b);
  return (
    (max >= THRESHOLD && spread <= NEUTRAL_TOLERANCE) ||
    (max >= WARM_FLOOR && spread <= WARM_TOLERANCE)
  );
};

// Flood fill inward from every border pixel that is light.
const background = new Uint8Array(width * height);
const queue = [];

for (let x = 0; x < width; x++) {
  queue.push(x, (height - 1) * width + x);
}
for (let y = 0; y < height; y++) {
  queue.push(y * width, y * width + width - 1);
}

while (queue.length) {
  const i = queue.pop();
  if (background[i] || !isLight(i)) continue;
  background[i] = 1;

  const x = i % width;
  const y = (i / width) | 0;
  if (x > 0) queue.push(i - 1);
  if (x < width - 1) queue.push(i + 1);
  if (y > 0) queue.push(i - width);
  if (y < height - 1) queue.push(i + width);
}

/**
 * Drop small opaque islands.
 *
 * Lighting artefacts in the corners of a sweep — a hotspot, a seam — survive the flood fill
 * because they are not connected to the border run. They show up as stray white patches
 * floating next to the product. Anything smaller than a fraction of the frame is not the
 * product, so it goes.
 */
const MIN_ISLAND_FRACTION = 0.01;
const minIsland = width * height * MIN_ISLAND_FRACTION;
const visited = new Uint8Array(width * height);

for (let seed = 0; seed < width * height; seed++) {
  if (background[seed] || visited[seed]) continue;

  const island = [];
  const stack = [seed];
  visited[seed] = 1;

  while (stack.length) {
    const i = stack.pop();
    island.push(i);

    const x = i % width;
    const y = (i / width) | 0;
    const neighbours = [];
    if (x > 0) neighbours.push(i - 1);
    if (x < width - 1) neighbours.push(i + 1);
    if (y > 0) neighbours.push(i - width);
    if (y < height - 1) neighbours.push(i + width);

    for (const n of neighbours) {
      if (!visited[n] && !background[n]) {
        visited[n] = 1;
        stack.push(n);
      }
    }
  }

  if (island.length < minIsland) {
    for (const i of island) background[i] = 1;
  }
}

// Build an alpha mask: opaque for the product, transparent for background.
const alpha = Buffer.alloc(width * height);
let removed = 0;
for (let i = 0; i < width * height; i++) {
  if (background[i]) removed++;
  alpha[i] = background[i] ? 0 : 255;
}

/**
 * Feather the mask with a small separable box blur, written out by hand.
 *
 * Round-tripping a 1-channel raw buffer through sharp's blur() does not reliably come back
 * as 1 channel, and the resulting stride mismatch stripes the alpha channel into horizontal
 * bands. Doing it here keeps the buffer exactly width×height.
 */
function boxBlur(source, w, h, radius) {
  const horizontal = new Uint8Array(w * h);
  const out = new Uint8Array(w * h);
  const span = radius * 2 + 1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let k = -radius; k <= radius; k++) {
        sum += source[y * w + Math.min(w - 1, Math.max(0, x + k))];
      }
      horizontal[y * w + x] = sum / span;
    }
  }

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let sum = 0;
      for (let k = -radius; k <= radius; k++) {
        sum += horizontal[Math.min(h - 1, Math.max(0, y + k)) * w + x];
      }
      out[y * w + x] = sum / span;
    }
  }

  return out;
}

const feathered = boxBlur(alpha, width, height, 1);

// Rebuild explicitly as RGBA rather than mutating a buffer whose channel count varies.
const rgba = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  const s = i * channels;
  const d = i * 4;
  rgba[d] = data[s];
  rgba[d + 1] = data[s + 1];
  rgba[d + 2] = data[s + 2];
  rgba[d + 3] = feathered[i];
}

const out = await sharp(rgba, { raw: { width, height, channels: 4 } })
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(path.resolve(output));

console.log(
  `${output} — ${out.width}×${out.height}, ${Math.round(out.size / 1024)}KB, ` +
    `${Math.round((removed / (width * height)) * 100)}% background removed`,
);
