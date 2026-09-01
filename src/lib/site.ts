/**
 * The canonical origin for this deployment.
 *
 * Resolved once, here, so metadata / sitemap / robots can never disagree about it.
 *
 * Two things this guards against, both learned the hard way:
 *
 *   1. EMPTY STRINGS. A host that imports env keys without values (Vercel does this when it
 *      reads .env.example) sets NEXT_PUBLIC_SITE_URL="". `?? fallback` does NOT catch that —
 *      `??` only fires on null/undefined — so `new URL('')` throws and the build dies with
 *      ERR_INVALID_URL. Anything blank or unparseable is treated as absent.
 *
 *   2. UNCONFIGURED DEPLOYS. If nothing is set, fall back to Vercel's own domain env vars so
 *      canonicals, sitemap and OG tags point at the real host instead of a placeholder.
 *      VERCEL_PROJECT_PRODUCTION_URL is the stable production domain;
 *      VERCEL_URL is per-deployment and only used if the former is missing.
 *
 * The fallback is the bare apex on purpose. SLAPPZ owns slappz.nyc through Porkbun and the
 * apex is the canonical form; www 308-redirects to it in Vercel rather than being served as a
 * second origin, or every page would end up with two indexable URLs.
 */

const FALLBACK = 'https://slappz.nyc';

/** Returns a normalised origin, or null if the value is blank or not a valid URL. */
function toOrigin(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

export const SITE_URL =
  toOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
  toOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  toOrigin(process.env.VERCEL_URL) ??
  FALLBACK;
