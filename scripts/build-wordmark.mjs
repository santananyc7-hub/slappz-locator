/**
 * Build the SLAPPZ wordmark from the master SLAPPZ supplied.
 *
 *   public/brand/slappz/logos/SlappzLogo.jpeg   (1024², artwork on solid black)
 *        ↓  crop to the mark's content bounds
 *        ↓  key the black plate out
 *   public/brand/slappz/logos/slappz-wordmark.png   (891 × 436, transparent)
 *
 * Nothing here redraws or re-traces the mark — see CLAUDE.md § NEVER. Every drawn pixel is
 * passed through untouched; only background is removed.
 *
 * WHY A FLOOD FILL, NOT A THRESHOLD
 * The letterforms carry a heavy black keyline. 'Make all black transparent' would eat it and
 * leave the green floating. A flood fill inwards from the border only takes black CONNECTED
 * to the outside, and the artwork's purple rim seals the keyline off from the plate. On the
 * supplied master the plate is 27.5% of the image while black overall is 48.7% — that gap is
 * the keyline this preserves.
 *
 * WHY PNG AND NOT WEBP
 * Next's image optimiser silently flattens alpha when the SOURCE file is WebP; from a PNG it
 * keeps it. The browser never downloads this PNG — Next re-encodes it per size — so the file
 * being large costs nothing at runtime. Do not 'optimise' this to a .webp source: the black
 * plate comes straight back over the hero photograph.
 *
 * Run: node scripts/build-wordmark.mjs
 */
import sharp from 'sharp';

const SRC = 'public/brand/slappz/logos/SlappzLogo.jpeg';
const OUT = 'public/brand/slappz/logos/slappz-wordmark.png';

/** Max channel value still considered plate black. Deliberately tight. */
const BLACK = 20;
/** Brightness at which an edge pixel becomes fully opaque. */
const OPAQUE_AT = 64;
/** Padding kept around the detected content bounds. */
const PAD = 6;

const full = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const FW = full.info.width;
const FH = full.info.height;
const bright = (buf, w, x, y) => {
  const i = (y * w + x) * 3;
  return Math.max(buf[i], buf[i + 1], buf[i + 2]);
};

// 1. Content bounds — the tightest box holding anything brighter than the plate.
let x0 = FW;
let y0 = FH;
let x1 = -1;
let y1 = -1;
for (let y = 0; y < FH; y++) {
  for (let x = 0; x < FW; x++) {
    if (bright(full.data, FW, x, y) >= BLACK) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}
const left = Math.max(0, x0 - PAD);
const top = Math.max(0, y0 - PAD);
const width = Math.min(FW - left, x1 - x0 + 1 + PAD * 2);
const height = Math.min(FH - top, y1 - y0 + 1 + PAD * 2);

const { data, info } = await sharp(SRC)
  .extract({ left, top, width, height })
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const maxChan = (i) => Math.max(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);

// 2. Flood fill the plate inwards from the border.
const plate = new Uint8Array(W * H);
const queue = [];
const seed = (i) => {
  if (!plate[i] && maxChan(i) < BLACK) {
    plate[i] = 1;
    queue.push(i);
  }
};
for (let x = 0; x < W; x++) {
  seed(x);
  seed((H - 1) * W + x);
}
for (let y = 0; y < H; y++) {
  seed(y * W);
  seed(y * W + W - 1);
}
for (let head = 0; head < queue.length; head++) {
  const i = queue[head];
  const x = i % W;
  const y = (i / W) | 0;
  if (x > 0) seed(i - 1);
  if (x < W - 1) seed(i + 1);
  if (y > 0) seed(i - W);
  if (y < H - 1) seed(i + W);
}

// 3. Compose RGBA, feathering only the pixels that touch the plate.
const out = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    if (plate[i]) continue; // leaves 0,0,0,0

    const touchesPlate =
      (x > 0 && plate[i - 1]) ||
      (x < W - 1 && plate[i + 1]) ||
      (y > 0 && plate[i - W]) ||
      (y < H - 1 && plate[i + W]);

    const a = touchesPlate
      ? Math.min(255, Math.round((maxChan(i) / OPAQUE_AT) * 255))
      : 255;
    // Unpremultiply, so a half-transparent rim keeps the letter's real colour instead of
    // leaving a dark halo.
    const scale = a > 0 ? 255 / a : 0;
    const o = i * 4;
    for (let c = 0; c < 3; c++)
      out[o + c] = Math.min(255, Math.round(data[i * 3 + c] * scale));
    out[o + 3] = a;
  }
}

await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const keyed = plate.reduce((n, v) => n + v, 0);
console.log(
  `${SRC} ${FW}×${FH} → crop ${left},${top} ${W}×${H} → keyed ${((100 * keyed) / (W * H)).toFixed(1)}% → ${OUT}`,
);
