import type { Retailer } from '@/lib/types';

/**
 * SEEDED SLAPPZ RETAILERS
 * =======================
 *
 * Every entry here is a real, licensed New York dispensary with a documented link to SLAPPZ.
 * Nothing in this file is invented. Read CLAUDE.md § RETAILER RULES before editing.
 *
 * Rules for adding a retailer:
 *   1. There must be public evidence SLAPPZ is (or was) carried there — record it in `verification`.
 *   2. Coordinates must be geocoded from the verified street address, never estimated.
 *   3. `menuUrl` is only set when a real online menu exists. It drives the SHOP STORE button,
 *      and a dead menu link is worse than no button.
 *   4. `availableProducts` stays empty unless per-SKU availability was actually confirmed.
 *      Empty means "unverified", not "out of stock" — the UI never renders it as a claim.
 *   5. Update `lastVerified` whenever you re-check.
 *
 * Retailers named on SLAPPZ's Instagram but NOT confirmed as stockists are intentionally
 * excluded. See the "Pending verification" table in /brand/ASSET_MANIFEST.md.
 *
 * Coordinates geocoded 2026-08-14 via OpenStreetMap/Nominatim from the addresses below.
 */
export const retailers: Retailer[] = [
  {
    id: 'ret_terp_bros_ozone_park',
    slug: 'terp-bros-ozone-park',
    name: 'Terp Bros',
    address: {
      street: '135-26 Cross Bay Blvd',
      city: 'Ozone Park',
      state: 'NY',
      zip: '11417',
    },
    coordinates: { latitude: 40.672937, longitude: -73.8436897 },
    neighborhood: 'Ozone Park',
    borough: 'Queens',
    website: 'https://terpbrosnyc.com',
    menuUrl: 'https://terpbrosnyc.com/brands/slappz',
    phone: '7183083600',
    licenseNumber: 'OCM-CAURD-25-000294',
    featured: true,
    active: true,
    lastVerified: '2026-08-14',
    verification: {
      source: 'Retailer maintains a dedicated SLAPPZ brand page; retailer account engages with SLAPPZ posts',
      confidence: 'high',
      url: 'https://terpbrosnyc.com/brands/slappz',
    },
    notes: 'Strongest documented relationship. Terp Bros lists SLAPPZ 10-pack 1g pre-rolls by name.',
  },
  {
    id: 'ret_weedside',
    slug: 'weedside',
    name: 'Weedside',
    address: {
      street: '50-22 72nd St',
      city: 'Woodside',
      state: 'NY',
      zip: '11377',
    },
    coordinates: { latitude: 40.7438752, longitude: -73.8932431 },
    neighborhood: 'Woodside',
    borough: 'Queens',
    website: 'https://weedsideny.com',
    menuUrl: 'https://weedsideny.com/pages/shop',
    phone: '8454783585',
    featured: true,
    active: true,
    lastVerified: '2026-08-14',
    verification: {
      source: 'SLAPPZ HQ hosted its first pop-up here ("SLAPPZ HQ FIRST POP UP AT WEEDSIDE"); multiple in-store posts',
      confidence: 'high',
      url: 'https://weedsideny.com/',
    },
  },
  {
    id: 'ret_ignyte_whitestone',
    slug: 'ignyte-whitestone',
    name: 'IGNYTE',
    address: {
      street: '145-18 14th Ave',
      city: 'Whitestone',
      state: 'NY',
      zip: '11357',
    },
    coordinates: { latitude: 40.7867947, longitude: -73.8216617 },
    neighborhood: 'Whitestone',
    borough: 'Queens',
    website: 'https://ignyteny.com',
    menuUrl: 'https://ignyteny.com',
    phone: '9296500420',
    active: true,
    lastVerified: '2026-08-14',
    verification: {
      source: 'SLAPPZ pop-up at IGNYTE 2nd anniversary event ("WE\'RE OUTSIDE TOMORROW — IGNYTE")',
      confidence: 'high',
      url: 'https://ignyteny.com/',
    },
    notes: "Whitestone's first licensed cannabis retailer.",
  },
  {
    id: 'ret_greencup',
    slug: 'greencup',
    name: 'GreenCup',
    address: {
      street: '95-38 Queens Blvd',
      city: 'Rego Park',
      state: 'NY',
      zip: '11374',
    },
    coordinates: { latitude: 40.7300685, longitude: -73.8634536 },
    neighborhood: 'Rego Park',
    borough: 'Queens',
    website: 'https://greencup.nyc',
    menuUrl: 'https://greencup.nyc/menu',
    phone: '3478080026',
    licenseNumber: 'OCM-CAURD-24-000174',
    active: true,
    lastVerified: '2026-08-14',
    verification: {
      source: 'Branded GreenCup activation featured in SLAPPZ HQ event coverage',
      confidence: 'medium',
      url: 'https://greencup.nyc/',
    },
    notes: 'Confirm current shelf status with SLAPPZ before featuring.',
  },
  {
    id: 'ret_torches_nyc',
    slug: 'torches-nyc',
    name: 'Torches NYC',
    address: {
      street: '12 E 42nd St',
      city: 'New York',
      state: 'NY',
      zip: '10017',
    },
    coordinates: { latitude: 40.7532273, longitude: -73.9805127 },
    neighborhood: 'Midtown',
    borough: 'Manhattan',
    website: 'https://torches.nyc',
    menuUrl: 'https://torches.nyc',
    phone: '6464774110',
    licenseNumber: 'OCM-CAURD-24-000077',
    active: true,
    lastVerified: '2026-08-14',
    verification: {
      source: 'Torches shopping bag featured in SLAPPZ HQ post',
      confidence: 'medium',
      url: 'https://torches.nyc/',
    },
    notes: 'Only Manhattan location seeded. Confirm shelf status with SLAPPZ.',
  },
];
