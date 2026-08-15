import type { Retailer } from './types';

/**
 * Geographic rollup of where SLAPPZ is actually stocked.
 *
 * Derived from the verified retailer list, never hand-maintained — a market only exists
 * because a confirmed retailer is in it. That keeps "WHERE SLAPPZ HITS" honest: it can
 * never claim a borough SLAPPZ hasn't reached.
 */

export type Market = {
  /** Borough or region, e.g. "Queens". */
  name: string;
  slug: string;
  /** Neighborhoods within it that have at least one verified retailer. */
  neighborhoods: string[];
  retailerCount: number;
};

export function buildMarkets(retailers: Retailer[]): Market[] {
  const byRegion = new Map<string, { neighborhoods: Set<string>; count: number }>();

  for (const r of retailers) {
    if (!r.active) continue;
    const region = r.borough ?? r.address.city;
    const entry = byRegion.get(region) ?? { neighborhoods: new Set<string>(), count: 0 };
    entry.count += 1;
    if (r.neighborhood) entry.neighborhoods.add(r.neighborhood);
    byRegion.set(region, entry);
  }

  return [...byRegion.entries()]
    .map(([name, { neighborhoods, count }]) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      neighborhoods: [...neighborhoods].sort(),
      retailerCount: count,
    }))
    .sort((a, b) => b.retailerCount - a.retailerCount || a.name.localeCompare(b.name));
}
