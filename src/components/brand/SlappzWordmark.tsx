import Image from "next/image";

/**
 * SLAPPZ WORDMARK — the real artwork
 *
 * Renders the mark SLAPPZ supplied (`logos/SlappzLogo.jpeg`, 1024²), cropped to its content
 * bounds and with the black plate keyed out, by `scripts/build-wordmark.mjs`. Rebuild with:
 *
 *     node scripts/build-wordmark.mjs
 *
 * Two pieces of machinery went away when the real master arrived, replacing an Instagram
 * avatar export that was 188 × 137 with the platform story ring baked into the edges:
 *
 *   - the elliptical mask that used to cut the story ring off, and
 *   - the crop offsets that positioned a larger source behind a smaller window.
 *
 * The file is now exactly the mark, so the component is just an image. Anything reintroducing
 * a mask or offset here is almost certainly working around a bad source file instead of
 * fixing it.
 *
 * The source is a PNG on purpose. Next's image optimiser silently flattens alpha when the
 * source file is WebP, which put an opaque black rectangle over the hero photograph. From a
 * PNG it keeps the transparency. The browser never downloads this PNG — Next re-encodes it
 * per size — so its file size costs nothing at runtime. Do not swap it for a .webp source.
 *
 * Because the plate is gone the mark now sits on any surface, dark or light. A true vector
 * master is still the outstanding ask in /brand/ASSET_MANIFEST.md § 1.
 */

const SRC = '/brand/slappz/logos/slappz-wordmark.png';
const NATURAL = { w: 892, h: 436 };

type Size = 'sm' | 'md' | 'lg' | 'hero' | 'fluid';

/**
 * Rendered heights. At 436px of source height every size below downscales, which is what
 * keeps the mark crisp — the old 137px source had to be upscaled and looked soft.
 * `fluid` fills its container's width and takes height from the aspect ratio; it is used
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
      className={`relative block shrink-0 ${HEIGHTS[size]} ${className}`}
      style={{ aspectRatio: `${NATURAL.w} / ${NATURAL.h}` }}
      {...(decorative
        ? { 'aria-hidden': true as const }
        : { role: 'img', 'aria-label': 'SLAPPZ HQ' })}
    >
      <Image
        src={SRC}
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 1024px) 260px, 200px"
        priority={size === 'hero'}
        className="object-contain"
      />
    </span>
  );
}
