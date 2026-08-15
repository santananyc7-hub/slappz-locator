'use client';

import { useMediaQuery } from '@/lib/useMediaQuery';

/**
 * Hero background loop.
 *
 * A 5-second ambient clip of the hero frame — rain falling, neon rippling on wet asphalt.
 * Generated from the exact still used as the poster, so frame one matches the static image
 * and the swap is invisible.
 *
 * Three deliberate constraints, because this product's primary runtime is a phone inside the
 * Instagram in-app browser:
 *
 *   1. DESKTOP ONLY. 146KB is nothing on wifi and real weight on cell data, and the mobile
 *      hero is short enough that the motion barely reads anyway. Mobile keeps the still.
 *   2. NEVER on `prefers-reduced-motion: reduce`. The element is not rendered at all, rather
 *      than hidden — a hidden <video> still downloads and decodes.
 *   3. It mounts AFTER hydration and sits on top of the static <Image>, so it can never
 *      delay LCP. The image is the thing that paints; this is decoration on top of it.
 */
export function HeroVideo({ poster }: { poster: string }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  if (!isDesktop || prefersReducedMotion) return null;

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover object-center motion-safe:animate-[slappz-fade-in_700ms_ease-out_both]"
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src="/brand/slappz/campaign/hero-loop.mp4" type="video/mp4" />
    </video>
  );
}
