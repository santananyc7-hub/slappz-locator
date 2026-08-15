import { NextResponse } from 'next/server';

import { geocode } from '@/lib/geocode';
import { nearest } from '@/lib/repository/retailers';
import * as demand from '@/lib/repository/demand';
import type { GeocodeResult } from '@/lib/types';

/**
 * Locator search.
 *
 * Accepts either free text (`q`) or device coordinates (`lat`/`lon` from USE MY LOCATION),
 * and returns retailers ranked by proximity.
 *
 * Anything beyond MAX_RESULT_MILES is treated as "not there yet" — a real answer, and the
 * moment we record a demand signal. Returning a dispensary 40 miles away would be a worse
 * lie than saying no.
 */

const MAX_RESULT_MILES = 25;
const RESULT_LIMIT = 12;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim() ?? '';
  const rawLat = url.searchParams.get('lat');
  const rawLon = url.searchParams.get('lon');

  // Parse only when both params are actually present: Number(null) is 0, so a plain
  // `?q=` search would otherwise look like valid coordinates at (0, 0) in the Atlantic
  // and skip geocoding entirely.
  const lat = rawLat === null ? NaN : Number(rawLat);
  const lon = rawLon === null ? NaN : Number(rawLon);

  const hasCoords =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180;

  if (!q && !hasCoords) {
    return NextResponse.json({ error: 'Provide q or lat/lon' }, { status: 400 });
  }

  let origin: GeocodeResult | null;

  if (hasCoords) {
    origin = { latitude: lat, longitude: lon, label: 'Your location', source: 'device' };
  } else {
    origin = await geocode(q);
  }

  if (!origin) {
    return NextResponse.json(
      { status: 'unresolved', query: q, results: [] },
      { status: 200 },
    );
  }

  const ranked = await nearest({ latitude: origin.latitude, longitude: origin.longitude });
  const inRange = ranked.filter((r) => r.distanceMiles <= MAX_RESULT_MILES);

  if (inRange.length === 0) {
    // A failed search is market intelligence, not an error. Record it, coarsely.
    await demand.record({
      zip: origin.zip,
      latitude: origin.latitude,
      longitude: origin.longitude,
      label: origin.label,
      utm: collectUtm(url),
    });

    return NextResponse.json({
      status: 'no-results',
      origin,
      // The closest shop overall, so the empty state can still offer something real.
      closest: ranked[0] ?? null,
      results: [],
    });
  }

  return NextResponse.json({
    status: 'ok',
    origin,
    results: inRange.slice(0, RESULT_LIMIT),
  });
}

function collectUtm(url: URL): Record<string, string> {
  const utm: Record<string, string> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const value = url.searchParams.get(key);
    if (value) utm[key] = value.slice(0, 120);
  }
  return utm;
}
