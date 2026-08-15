/**
 * Core domain model for the SLAPPZ locator.
 *
 * These types are the contract between data sources (seed file today; Dutchie / Jane /
 * distributor feeds / Supabase later) and the UI. Components import types from here and
 * read data through `src/lib/repository` — never from a data file directly.
 */

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

/**
 * How a retailer's SLAPPZ availability was confirmed. Required — a retailer without an
 * evidence trail does not belong in the app. See CLAUDE.md § RETAILER RULES.
 */
export type Verification = {
  /** Where confirmation came from, e.g. "Retailer website — dedicated SLAPPZ brand page". */
  source: string;
  /** How much we trust that SLAPPZ is actually on the shelf. */
  confidence: 'high' | 'medium' | 'low';
  /** Public URL backing the claim, when one exists. */
  url?: string;
};

export type Retailer = {
  id: string;
  slug: string;
  name: string;

  address: Address;
  coordinates: Coordinates;
  neighborhood?: string;
  /** Borough / region grouping, used for SEO landing copy. */
  borough?: string;

  website?: string;
  /** Only set when a real, verified online menu exists. Drives the SHOP STORE button. */
  menuUrl?: string;
  phone?: string;
  instagram?: string;

  /**
   * Product slugs confirmed available at this retailer. Empty means "not verified",
   * NOT "not stocked" — the UI must never render an absence as a claim.
   */
  availableProducts?: string[];

  featured?: boolean;
  active: boolean;

  /** ISO date (YYYY-MM-DD) the listing was last confirmed. */
  lastVerified?: string;
  verification?: Verification;

  /** Internal-only. Never rendered on the consumer site. */
  notes?: string;

  hours?: string;
  licenseNumber?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category?: 'pre-roll' | 'flower' | 'multi-pack';
  /** Pack format, e.g. "1g" or "10 × 1g". */
  format?: string;
  /** Strain classification as printed on the pack. Never a potency or effect claim. */
  strainType?: 'HYBRID' | 'INDICA' | 'SATIVA';
  image?: string;
  /**
   * Short descriptive line. Must describe only what the format IS — never invent potency,
   * terpenes, effects or awards. See CLAUDE.md § RETAILER RULES.
   */
  tagline?: string;
  /** Only true for SKUs evidenced publicly. */
  verified: boolean;
};

/** A retailer plus derived, request-specific fields. */
export type RetailerResult = Retailer & {
  /** Straight-line distance in miles from the searched origin. */
  distanceMiles: number;
};

export type GeocodeResult = {
  latitude: number;
  longitude: number;
  /** Human-readable echo of what we matched, e.g. "Astoria, Queens, NY". */
  label: string;
  zip?: string;
  /** Where the match came from — local table is instant, remote is a network call. */
  source: 'zip-table' | 'place-table' | 'nominatim' | 'device';
};

/**
 * An anonymous record that someone looked for SLAPPZ somewhere it isn't.
 * Coordinates are rounded before persistence — see repository/demand.ts.
 */
export type DemandSignal = {
  id: string;
  zip?: string;
  /** Rounded to ~1km. Never store precise device location. */
  approxLatitude?: number;
  approxLongitude?: number;
  label?: string;
  createdAt: string;
  /** Set when the customer explicitly asked us to bring SLAPPZ there. */
  requested?: boolean;
  /** Optional, self-submitted, only via the BRING SLAPPZ HERE form. */
  contact?: string;
  /** Optional shop the customer wants SLAPPZ stocked in. Self-submitted, free text. */
  note?: string;
  /** Campaign attribution, when present. */
  utm?: Record<string, string>;
};

export type DemandAggregate = {
  zip: string;
  label?: string;
  count: number;
  requests: number;
  lastSeen: string;
};
