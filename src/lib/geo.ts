import type { Coordinates, Retailer, RetailerResult } from './types';

const EARTH_RADIUS_MILES = 3958.8;

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance in miles. Straight-line, not driving distance — the UI says "away", not "drive". */
export function distanceMiles(a: Coordinates, b: Coordinates): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h));
}

/**
 * Display distance. Deliberately imprecise: "0.7 MI" reads as a human estimate,
 * "0.72847 MI" reads as a machine pretending to know something it doesn't.
 */
export function formatDistance(miles: number): string {
  if (miles < 0.1) return '< 0.1 MI';
  if (miles < 10) return `${miles.toFixed(1)} MI`;
  return `${Math.round(miles)} MI`;
}

/** Sort active retailers by proximity to an origin. Featured status never overrides distance. */
export function rankByProximity(
  retailers: Retailer[],
  origin: Coordinates,
): RetailerResult[] {
  return retailers
    .filter((r) => r.active)
    .map((r) => ({ ...r, distanceMiles: distanceMiles(origin, r.coordinates) }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
}

/**
 * Round coordinates to ~1km before persisting a demand signal.
 * Two decimal places of latitude is roughly 1.1km — enough to see a ZIP-level pattern,
 * not enough to locate a person. See CLAUDE.md § DEMAND INTELLIGENCE.
 */
export function coarsen(coords: Coordinates): Coordinates {
  return {
    latitude: Math.round(coords.latitude * 100) / 100,
    longitude: Math.round(coords.longitude * 100) / 100,
  };
}

/** Bounding box that fits every point plus the origin, with padding. Used to frame the map. */
export function boundsFor(points: Coordinates[]): [[number, number], [number, number]] | null {
  if (points.length === 0) return null;
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;
  for (const p of points) {
    minLat = Math.min(minLat, p.latitude);
    maxLat = Math.max(maxLat, p.latitude);
    minLon = Math.min(minLon, p.longitude);
    maxLon = Math.max(maxLon, p.longitude);
  }
  return [
    [minLon, minLat],
    [maxLon, maxLat],
  ];
}

export const DIRECTIONS_BASE = 'https://www.google.com/maps/dir/?api=1&destination=';

/** Maps deep link. Works on iOS, Android and desktop, and doesn't require the origin. */
export function directionsUrl(retailer: Retailer): string {
  const q = `${retailer.name}, ${retailer.address.street}, ${retailer.address.city}, ${retailer.address.state} ${retailer.address.zip}`;
  return `${DIRECTIONS_BASE}${encodeURIComponent(q)}`;
}

export function formatPhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  const d = phone.replace(/\D/g, '');
  if (d.length !== 10) return phone;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
