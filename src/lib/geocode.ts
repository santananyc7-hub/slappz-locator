import 'server-only';

import { normalizePlace, placeAliases, zipCentroids } from '@/data/nyc-places';
import type { GeocodeResult } from './types';

/**
 * Server-side geocoding.
 *
 * Strategy, cheapest first:
 *   1. 5-digit ZIP  -> local centroid table (instant, offline)
 *   2. Known place  -> local alias table   (instant, offline)
 *   3. Anything else -> Nominatim, biased to the NY metro area
 *
 * Steps 1 and 2 cover the overwhelming majority of real searches, which matters because the
 * primary runtime is a phone on cell data inside the Instagram browser.
 */

const NY_VIEWBOX = '-74.35,40.45,-73.65,40.95';

const memoryCache = new Map<string, { value: GeocodeResult | null; expires: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

export async function geocode(rawQuery: string): Promise<GeocodeResult | null> {
  const query = rawQuery.trim();
  if (!query) return null;

  const cacheKey = query.toLowerCase();
  const cached = memoryCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.value;

  const result = await resolve(query);

  memoryCache.set(cacheKey, { value: result, expires: Date.now() + CACHE_TTL_MS });
  return result;
}

async function resolve(query: string): Promise<GeocodeResult | null> {
  // 1. Bare ZIP
  const zipMatch = query.match(/^\s*(\d{5})(?:-\d{4})?\s*$/);
  if (zipMatch) {
    const zip = zipMatch[1];
    const hit = zipCentroids[zip];
    if (hit) {
      return { latitude: hit.lat, longitude: hit.lon, label: hit.label, zip, source: 'zip-table' };
    }
    // A valid-looking ZIP we don't have locally is still worth resolving remotely — that's
    // exactly the "SLAPPZ isn't here yet" case we want to capture as demand.
    return nominatim(zip, zip);
  }

  // 2. Known neighborhood / borough / alias
  const normalized = normalizePlace(query);
  const alias = placeAliases[normalized];
  if (alias) {
    return {
      latitude: alias.lat,
      longitude: alias.lon,
      label: alias.label,
      zip: alias.zip,
      source: 'place-table',
    };
  }

  // 3. Full address or out-of-area place
  return nominatim(query);
}

async function nominatim(query: string, zipHint?: string): Promise<GeocodeResult | null> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'us');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('viewbox', NY_VIEWBOX);
  url.searchParams.set('q', query);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'slappz-locator/1.0 (+https://slappz.nyc)',
        'Accept-Language': 'en-US',
      },
      // Cache at the fetch layer so repeated searches for the same place are free.
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
      address?: { postcode?: string };
    }>;

    const first = json[0];
    if (!first) return null;

    return {
      latitude: Number(first.lat),
      longitude: Number(first.lon),
      label: shortLabel(first.display_name),
      zip: zipHint ?? first.address?.postcode,
      source: 'nominatim',
    };
  } catch {
    // Never let a geocoder outage take the page down — the caller renders a graceful message.
    return null;
  }
}

/** Nominatim returns very long display names. Keep the first three meaningful parts. */
function shortLabel(displayName: string): string {
  const parts = displayName.split(',').map((p) => p.trim());
  if (parts.length <= 3) return parts.join(', ');
  const state = parts.find((p) => /^(New York|NY|New Jersey|NJ|Connecticut|CT)$/i.test(p));
  const head = parts.slice(0, 2);
  return [...head, state].filter(Boolean).join(', ');
}
