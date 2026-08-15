import Image from 'next/image';

/**
 * SLAPPZ WORDMARK — the real artwork
 *
 * Renders the supplied SLAPPZ logo file rather than a typographic stand-in. The source is
 * `/public/brand/slappz/logos/slappz-wordmark.png` (a copy of "Slappz Logo.png" under a
 * URL-safe name — the space in the original filename becomes %20 in every request).
 *
 * The file is a 188×137 avatar crop, so two things are handled here:
 *
 *   1. It has the Instagram STORY RING baked into the edges. That ring is a platform
 *      artefact, not brand, so it is masked off — the ring is an ellipse that cuts *inside*
 *      the wordmark's bounding box at the corners, so no rectangular crop can remove it
 *      without clipping the S.
 *   2. It is fully opaque on a near-black ground (#0c1014), not transparent. That is
 *      invisible against this product's black surfaces but means the mark cannot be placed
 *      on a light background. The brand has no light lockup anyway (see
 *      /brand/SLAPPZ_DIGITAL_SYSTEM.md § 2), so this is not currently a limitation.
 *
 * Geometry is expressed in percentages of the cropped box rather than pixels, so the mark
 * scales from a 26px header lockup to the hero with one aspect-ratio box.
 *
 * SHARPNESS: the delivered file is 188×137, so at hero size the browser was upscaling it
 * ~1.5× with bilinear filtering — which is what made it look soft. It is now pre-resampled
 * to 4× (752×548) with a Lanczos3 kernel and a light unsharp pass, so the browser always
 * DOWNSCALES it instead. Downscaling is sharp; upscaling never is.
 *
 * That is a resampling improvement, not new detail — deliberately not an AI upscale, which
 * would invent letterform detail and quietly produce a subtly wrong logo. A true
 * high-resolution master is still the real fix; see /brand/ASSET_MANIFEST.md § 1.
 */

const SRC = '/brand/slappz/logos/slappz-wordmark@4x.webp';

/**
 * Measured content box of the wordmark, in the 4× asset's coordinate space.
 * Originally measured on the 188×137 source as (12, 32, 158×75) and scaled by 4 — CROP and
 * NATURAL must stay in the SAME space, because every value below is derived as a ratio
 * between them.
 */
const CROP = { x: 48, y: 128, w: 632, h: 300 };
const NATURAL = { w: 752, h: 548 };

/**
 * Ring inner ellipse in source pixels: centre (94, 68.5), radii ~(84, 61), expressed as
 * percentages of the cropped box. Everything it masks away is background, not letterform.
 */
const RING_MASK =
  'radial-gradient(ellipse 53.2% 81.3% at 51.9% 48.7%, #000 96%, transparent 100%)';

const pct = (n: number) => `${n * 100}%`;

type Size = 'sm' | 'md' | 'lg' | 'hero' | 'fluid';

/**
 * Rendered heights. `hero` is the largest the source can carry before it visibly softens.
 * `fluid` fills its container's width and takes its height from the aspect ratio — used
 * where the mark is a print on something else, like a garment.
 */
const HEIGHTS: Record<Size, string> = {
  sm: 'h-[26px]',
  md: 'h-[42px]',
  lg: 'h-[64px] sm:h-[78px]',
  hero: 'h-[74px] sm:h-[100px] lg:h-[112px]',
  fluid: 'w-full',
};

export function SlappzWordmark({
  size = 'md',
  withHq = true,
  className = '',
  decorative = false,
}: {
  size?: Size;
  /** Retained for API compatibility — `HQ` is part of the supplied artwork and cannot be split out. */
  withHq?: boolean;
  className?: string;
  /** Set when an ancestor already conveys the name (e.g. an h1 with its own accessible text). */
  decorative?: boolean;
}) {
  void withHq;

  return (
    <span
      className={`relative block shrink-0 overflow-hidden ${HEIGHTS[size]} ${className}`}
      style={{
        aspectRatio: `${CROP.w} / ${CROP.h}`,
        maskImage: RING_MASK,
        WebkitMaskImage: RING_MASK,
      }}
      {...(decorative
        ? { 'aria-hidden': true as const }
        : { role: 'img', 'aria-label': 'SLAPPZ HQ' })}
    >
      <Image
        src={SRC}
        alt=""
        aria-hidden="true"
        width={NATURAL.w}
        height={NATURAL.h}
        priority={size === 'hero'}
        unoptimized
        style={{
          position: 'absolute',
          width: pct(NATURAL.w / CROP.w),
          height: pct(NATURAL.h / CROP.h),
          left: pct(-CROP.x / CROP.w),
          top: pct(-CROP.y / CROP.h),
          maxWidth: 'none',
        }}
      />
    </span>
  );
}
