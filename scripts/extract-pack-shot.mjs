/**
 * Cut the pack shot out of a SLAPPZ strain sheet.
 *
 * SLAPPZ supplies each SKU as a full 1024 × 1536 strain sheet — logo, strain name, the
 * product photograph, strain copy, effects, compliance badges. The cards want just the
 * product on transparency, because they render `object-contain` on the card surface.
 *
 * WHY THIS IS NOT A COLOUR KEY
 * Two earlier attempts failed, and both failures are worth keeping written down:
 *
 *   1. Feathering the crop edges instead of removing anything. The theory was that dark smoke
 *      would melt into a dark card. It did not — the green glow top-right and the purple down
 *      the left came through as visible haze.
 *   2. Keying on colour. The sheet's smoke is saturated (0.7–1.0) and the tube is neutral
 *      (0.00–0.18), so that part separates cleanly — but the tube's body is also BLACK, and
 *      so is much of the background around it, with no luminance edge between them at all:
 *      down a column through the tube's top rim the values ramp smoothly from dark purple
 *      through 0,0,0 into dark grey. Any rule dark enough to take that background takes the
 *      tube with it, which is exactly what happened — the tube went see-through and left the
 *      label floating.
 *
 * SO: BUILD THE SILHOUETTE INSTEAD
 * The product is two simple shapes — a horizontal capsule and a cone — and every part of it
 * that ISN'T black is unambiguous: neutral greys (body, caps, the lit rim), the bright
 * saturated label, and the pre-roll's desaturated beige. Mark those, then take the top and
 * bottom of them in each column and fill the span between. The tube's black body is inside
 * that span and comes back opaque without ever having to be recognised on its own.
 *
 * The envelopes are median-filtered across columns before filling, so a stray wisp of bright
 * smoke cannot drag one column's silhouette up on its own.
 *
 * The bias is deliberate: including a little extra near-black is free, because the card
 * surface is #0b0b0c and it simply does not show. Making product transparent is not.
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
 * Tight. The rows above the product hold the "PRE-ROLL | 1G" line, which is neutral white and
 * would otherwise be read as product and pull the silhouette up over it.
 */
const HEAD_ROOM = 4;
const FOOT_ROOM = 12;

/** Neutral enough to be the tube rather than smoke, and lit enough to be seen at all. */
const NEUTRAL_CHROMA = 28;
const NEUTRAL_MIN = 35;
/** Bright AND strongly coloured: label art. */
const LABEL_MIN = 200;
const LABEL_CHROMA = 120;
/** Upper bound on the pre-roll's warmth, which is what separates it from orange smoke. */
const TAN_MAX_CHROMA = 90;
/**
 * Horizontal window kept from the sheet.
 *
 * Detecting the product's own x-extent does not work here and it is worth saying why: the
 * sheets put bright, saturated, vertically continuous smoke hard against both margins, and by
 * every measure tried — colour, brightness, longest unbroken run — those columns look exactly
 * like product. The far-left purple column scores a longer run than most of the tube.
 *
 * So the window is fixed. It is inset far enough to drop the marginal smoke on all three
 * sheets, which costs perhaps fifteen pixels off each of the tube's rounded end caps —
 * invisible at card size, and a straight trade for no smoke at all.
 */
const CLIP = { x0: 72, x1: 948 };
/** Median window for smoothing the silhouette's top and bottom edges, in columns. */
const SMOOTH = 31;
/** A column needs at least this many product pixels to count as covered by the product. */
const MIN_HITS = 3;
/**
 * How many consecutive product pixels an edge must start, in rows.
 *
 * The tube's edge is a continuous wall; smoke at the margins is wisps and specks. Some of
 * those specks are grey enough to pass the neutrality test on their own — (138,123,146) has a
 * chroma of 23 and reads as tube — so taking the topmost single product pixel in a column let
 * them drag the silhouette up over the smoke. Requiring a run ignores them.
 */
const RUN_MIN = 3;
/**
 * How far a single column's own edge may reach past the smoothed envelope, in pixels.
 *
 * This is what keeps the "PRE-ROLL | 1G" line out. That text is neutral white, so it reads as
 * product, and it sits about 30px clear of the tube — without a cap on the outlier it drags
 * those columns' silhouettes straight up over it.
 */
const EDGE_TOLERANCE = 6;
/** How deep from the silhouette's top and bottom the interior sweep reaches, in rows. */
const SWEEP_EDGE = 10;
/** Inside that margin, colour this strong belongs to the background, not the tube. */
const SWEEP_MIN = 70;
const SWEEP_CHROMA = 45;
const SOFTEN = 2;
const OUT_WIDTH = 1000;

const { data, info } = await sharp(input).raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const span = SEARCH.x1 - SEARCH.x0;

const at = (x, y) => {
  const i = (y * W + x) * C;
  return [data[i], data[i + 1], data[i + 2]];
};

// ---- 1. Find the product band ----------------------------------------------------------------
const tanRow = new Array(H).fill(0);
const lit = new Array(H).fill(0);
for (let y = 0; y < H; y++) {
  for (let x = SEARCH.x0; x < SEARCH.x1; x++) {
    const [r, g, b] = at(x, y);
    if (Math.max(r, g, b) > 70) lit[y]++;
    if (r > 130 && g > 110 && b > 70 && r > b + 25 && Math.abs(r - g) < 60) tanRow[y]++;
  }
}

let rollTop = -1;
let rollBottom = -1;
for (let y = 0; y < H; y++) {
  if (tanRow[y] > span * 0.2) {
    if (rollTop < 0) rollTop = y;
    rollBottom = y;
  } else if (rollTop >= 0 && y - rollBottom > 25) {
    break;
  }
}
if (rollTop < 0) throw new Error(`no pre-roll found in ${input}`);

let bandTop = rollTop;
for (let y = rollTop; y > rollTop - 320 && y > 0; y--) {
  if (lit[y] < span * 0.12) {
    bandTop = y;
    break;
  }
}
let bandBottom = rollBottom;
for (let y = rollBottom; y < rollBottom + 160 && y < H; y++) {
  if (lit[y] < span * 0.12) {
    bandBottom = y;
    break;
  }
}

const top = Math.max(0, bandTop - HEAD_ROOM);
const height = Math.min(H - top, bandBottom - bandTop + HEAD_ROOM + FOOT_ROOM);
const band = await sharp(input)
  .extract({ left: 0, top, width: W, height })
  .raw()
  .toBuffer();

const BW = W;
const BH = height;

// ---- 2. Mark the parts of the product that are not black --------------------------------------
const isProduct = (i) => {
  const r = band[i * 3];
  const g = band[i * 3 + 1];
  const b = band[i * 3 + 2];
  const max = Math.max(r, g, b);
  if (max < NEUTRAL_MIN) return false; // black — recovered by the fill, not by this test

  // Absolute chroma, not ratio saturation. Ratio is unstable at the extremes and the sheets
  // are full of bright pastel smoke: (255,194,255) computes to saturation 0.24 and sails
  // through a neutrality test, while its chroma of 61 gives it away immediately.
  const chroma = max - Math.min(r, g, b);
  if (chroma < NEUTRAL_CHROMA) return true; // tube body, caps, lit rim
  // Label art, but NOT a warm ramp. The label is acid green (green-dominant) or magenta
  // (red and blue high, green low); neither has red ≥ green ≥ blue. The Bubba sheet's orange
  // smoke does, and at (200,120,40) it is bright and strongly coloured enough to pass as
  // label otherwise — which is exactly the glow that was still sitting behind that tube.
  if (max >= LABEL_MIN && chroma >= LABEL_CHROMA && !(r >= g && g >= b)) return true;
  // The pre-roll is warm with MODERATE chroma; the orange smoke on the Bubba sheet is warm
  // and vivid, so the upper bound is what separates them.
  return r >= g && g >= b && r - b > 18 && r - b < TAN_MAX_CHROMA && max > 90;
};

// ---- 3. Column envelopes, smoothed, then filled -------------------------------------------------
const rawTop = new Int32Array(BW).fill(-1);
const rawBottom = new Int32Array(BW).fill(-1);
for (let x = 0; x < BW; x++) {
  let hits = 0;
  let first = -1;
  let last = -1;
  let run = 0;
  for (let y = 0; y < BH; y++) {
    if (isProduct(y * BW + x)) {
      hits++;
      run++;
      // Only count an edge once the run proves itself, then date it back to where it started.
      if (run >= RUN_MIN) {
        if (first < 0) first = y - RUN_MIN + 1;
        last = y;
      }
    } else {
      run = 0;
    }
  }
  if (hits >= MIN_HITS && first >= 0) {
    rawTop[x] = first;
    rawBottom[x] = last;
  }
}

const median = (values) => {
  const v = values.slice().sort((a, b) => a - b);
  return v[(v.length / 2) | 0];
};
const smooth = (arr) => {
  const out = new Int32Array(BW).fill(-1);
  const half = (SMOOTH / 2) | 0;
  for (let x = 0; x < BW; x++) {
    const window = [];
    for (let k = -half; k <= half; k++) {
      const xx = x + k;
      if (xx >= 0 && xx < BW && arr[xx] >= 0) window.push(arr[xx]);
    }
    if (window.length) out[x] = median(window);
  }
  return out;
};
const topEdge = smooth(rawTop);
const bottomEdge = smooth(rawBottom);

let alpha = new Float32Array(BW * BH);
const fillTop = new Int32Array(BW).fill(-1);
const fillBottom = new Int32Array(BW).fill(-1);
for (let x = CLIP.x0; x <= Math.min(CLIP.x1, BW - 1); x++) {
  if (rawTop[x] < 0 || topEdge[x] < 0) continue;
  // Follow the column's OWN edge, and use the smoothed envelope only as a floor against
  // outliers. Taking the higher of the two instead — which this did at first — inflates every
  // column to the tallest part of the tube, so the rounded end caps got filled up to the
  // height of the middle and the smoke sitting behind them came along with it. That was the
  // faint green and orange glow still visible behind the tube ends.
  const t = Math.max(rawTop[x], topEdge[x] - EDGE_TOLERANCE);
  const b = Math.min(rawBottom[x], bottomEdge[x] + EDGE_TOLERANCE);
  fillTop[x] = t;
  fillBottom[x] = b;
  for (let y = t; y <= b; y++) alpha[y * BW + x] = 255;
}

// Clean up inside the silhouette. Filling a column top-to-bottom brings back the tube's black
// body, which is the point — but it also sweeps in whatever background sat between the tube
// and the envelope, and the sheets put a pale glow right against the tube's top edge. That
// glow is bright and barely coloured, so it passes the neutrality test and cannot be excluded
// when the edges are found. It can be excluded here: anything inside the mask that was not
// itself recognised as product, and carries real colour, is background that got swept up.
// The tube's own interior is black — chroma in the single digits — so it is never touched.
for (let x = 0; x < BW; x++) {
  if (fillTop[x] < 0) continue;
  for (let y = fillTop[x]; y <= fillBottom[x]; y++) {
    // Margins only. Run over the whole silhouette and it eats the label: the skyline art's
    // darker magenta is strongly coloured but not bright enough to register as label, so a
    // blanket sweep punches holes straight through the middle of the tube.
    if (y - fillTop[x] >= SWEEP_EDGE && fillBottom[x] - y >= SWEEP_EDGE) continue;
    const i = y * BW + x;
    if (alpha[i] === 0 || isProduct(i)) continue;
    const r = band[i * 3];
    const g = band[i * 3 + 1];
    const b = band[i * 3 + 2];
    const max = Math.max(r, g, b);
    if (max > SWEEP_MIN && max - Math.min(r, g, b) > SWEEP_CHROMA) alpha[i] = 0;
  }
}

for (let pass = 0; pass < SOFTEN; pass++) {
  const next = new Float32Array(BW * BH);
  for (let y = 0; y < BH; y++) {
    for (let x = 0; x < BW; x++) {
      let sum = 0;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= BH) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= BW) continue;
          sum += alpha[yy * BW + xx];
          n++;
        }
      }
      next[y * BW + x] = sum / n;
    }
  }
  alpha = next;
}

// ---- 4. Trim to the silhouette and write --------------------------------------------------------
let x0 = BW;
let y0 = BH;
let x1 = -1;
let y1 = -1;
for (let y = 0; y < BH; y++) {
  for (let x = 0; x < BW; x++) {
    if (alpha[y * BW + x] > 8) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}
const outW = x1 - x0 + 1;
const outH = y1 - y0 + 1;

const rgba = Buffer.alloc(outW * outH * 4);
for (let y = 0; y < outH; y++) {
  for (let x = 0; x < outW; x++) {
    const src = (y + y0) * BW + (x + x0);
    const dst = (y * outW + x) * 4;
    rgba[dst] = band[src * 3];
    rgba[dst + 1] = band[src * 3 + 1];
    rgba[dst + 2] = band[src * 3 + 2];
    rgba[dst + 3] = Math.max(0, Math.min(255, Math.round(alpha[src])));
  }
}

await sharp(rgba, { raw: { width: outW, height: outH, channels: 4 } })
  .resize({ width: OUT_WIDTH, withoutEnlargement: true })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(output);

console.log(`${input}: band ${bandTop}-${bandBottom} → silhouette ${outW}×${outH} → ${output}`);
