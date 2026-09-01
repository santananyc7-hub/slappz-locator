import type { Retailer } from "@/lib/types";

/**
 * SLAPPZ STOCKING RETAILERS
 * =========================
 *
 * Every entry is a real, licensed New York dispensary. Nothing here is invented.
 * Read CLAUDE.md § RETAILER RULES before editing.
 *
 * PROVENANCE
 * ----------
 * The store list was supplied by SLAPPZ HQ, which is the authoritative source for its own
 * distribution. Each store was then cross-checked against the New York State Office of
 * Cannabis Management licence registry (dataset `jskf-tt3q` on data.ny.gov) to confirm the
 * licensed street address and licence number, rather than trusting a search result. Every
 * coordinate was geocoded from that confirmed address — none are estimated.
 *
 * A handful of entries carry `notes` where SLAPPZ's description and the licensed record
 * disagree (neighbourhood mismatches, chains with many locations). Those are open questions
 * for SLAPPZ, not errors to quietly "fix" — the note is the record of the discrepancy.
 *
 * RULES FOR ADDING A RETAILER
 * ---------------------------
 *   1. Confirm SLAPPZ is actually carried there, and record how in `verification`.
 *   2. Cross-check the address against the OCM registry; geocode from that address.
 *   3. `menuUrl` only when a real online menu exists — it drives SHOP STORE, and a dead
 *      link is worse than no button. Most stores here have none on file yet.
 *   4. `availableProducts` stays empty unless per-SKU availability was confirmed. Empty
 *      means "unverified", not "out of stock" — the UI never renders it as a claim.
 *   5. Update `lastVerified` whenever you re-check.
 */
export const retailers: Retailer[] = [
  {
    id: "ret_greencup",
    slug: "greencup",
    name: "GreenCup",
    address: {
      street: "95-38 Queens Blvd",
      city: "Rego Park",
      state: "NY",
      zip: "11374",
    },
    coordinates: { latitude: 40.730069, longitude: -73.863454 },
    neighborhood: "Rego Park",
    borough: "Queens",
    website: "https://greencup.nyc",
    menuUrl: "https://greencup.nyc/menu",
    phone: "3478080026",
    licenseNumber: "OCM-CAURD-24-000174",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_herbarium",
    slug: "herbarium",
    name: "Herbarium",
    address: {
      street: "465 Onderdonk Ave",
      city: "Ridgewood",
      state: "NY",
      zip: "11385",
    },
    coordinates: { latitude: 40.706992, longitude: -73.911936 },
    neighborhood: "Ridgewood",
    borough: "Queens",
    website: "https://herbarium.co",
    menuUrl: "https://herbarium.co/pages/new-york",
    licenseNumber: "OCM-RETL-24-000078",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_happy_alta",
    slug: "happy-alta",
    name: "Happy Alta",
    address: {
      street: "66-33 Fresh Pond Rd",
      city: "Ridgewood",
      state: "NY",
      zip: "11385",
    },
    coordinates: { latitude: 40.707991, longitude: -73.897463 },
    neighborhood: "Ridgewood",
    borough: "Queens",
    licenseNumber: "OCM-RETL-24-000075",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_cannafamily",
    slug: "cannafamily",
    name: "Cannafamily",
    address: {
      street: "102-15 159th Rd",
      city: "Howard Beach",
      state: "NY",
      zip: "11414",
    },
    coordinates: { latitude: 40.659952, longitude: -73.830781 },
    neighborhood: "Howard Beach",
    borough: "Queens",
    licenseNumber: "OCM-CAURD-25-000279",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_flynnstoned_bay_ridge",
    slug: "flynnstoned-bay-ridge",
    name: "Flynnstoned",
    address: {
      street: "8112 5th Ave",
      city: "Brooklyn",
      state: "NY",
      zip: "11209",
    },
    coordinates: { latitude: 40.624862, longitude: -74.024821 },
    neighborhood: "Bay Ridge",
    borough: "Brooklyn",
    licenseNumber: "OCM-CAURD-25-000281",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
    notes:
      "Flynnstoned operates 12 licensed NY locations. This is the Brooklyn store — confirm which location(s) actually stock SLAPPZ.",
  },
  {
    id: "ret_gaeas_garden",
    slug: "gaeas-garden",
    name: "Gaea’s Garden",
    address: {
      street: "104-12 Lefferts Blvd",
      city: "South Richmond Hill",
      state: "NY",
      zip: "11419",
    },
    coordinates: { latitude: 40.685764, longitude: -73.824239 },
    neighborhood: "South Richmond Hill",
    borough: "Queens",
    licenseNumber: "OCM-CAURD-26-000326",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
    notes:
      "Matched to Gaia Operations LLC in the OCM registry, which carries no DBA on file. Confirm this is the intended Gaea’s Garden.",
  },
  {
    id: "ret_ignyte_whitestone",
    slug: "ignyte-whitestone",
    name: "IGNYTE Whitestone",
    address: {
      street: "145-18 14th Ave",
      city: "Whitestone",
      state: "NY",
      zip: "11357",
    },
    coordinates: { latitude: 40.786795, longitude: -73.821662 },
    neighborhood: "Whitestone",
    borough: "Queens",
    website: "https://ignyteny.com",
    menuUrl: "https://ignyteny.com",
    phone: "9296500420",
    licenseNumber: "OCM-RETL-24-000077",
    featured: true,
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_ignyte_red_hook",
    slug: "ignyte-red-hook",
    name: "IGNYTE Red Hook",
    address: {
      street: "387 Van Brunt St",
      city: "Brooklyn",
      state: "NY",
      zip: "11231",
    },
    coordinates: { latitude: 40.675993, longitude: -74.014213 },
    neighborhood: "Red Hook",
    borough: "Brooklyn",
    website: "https://ignyteny.com",
    menuUrl: "https://ignyteny.com",
    phone: "3472895555",
    licenseNumber: "OCM-RETL-24-000033",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_emerald_bushwick",
    slug: "emerald-bushwick",
    name: "The Emerald Bushwick",
    address: {
      street: "85 Suydam St",
      city: "Brooklyn",
      state: "NY",
      zip: "11221",
    },
    coordinates: { latitude: 40.697889, longitude: -73.92939 },
    neighborhood: "Bushwick",
    borough: "Brooklyn",
    licenseNumber: "OCM-CAURD-24-000057",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_emerald_uptown",
    slug: "emerald-uptown",
    name: "Emerald Dispensary Uptown",
    address: {
      street: "1190 Lexington Ave",
      city: "New York",
      state: "NY",
      zip: "10028",
    },
    coordinates: { latitude: 40.776441, longitude: -73.957988 },
    neighborhood: "Upper East Side",
    borough: "Manhattan",
    licenseNumber: "OCM-CAURD-24-000146",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
    notes:
      "SLAPPZ listed this as Upper West Side; the licensed address is on Lexington Ave, which is the Upper East Side. Confirm.",
  },
  {
    id: "ret_sweetlife",
    slug: "sweetlife",
    name: "Sweetlife",
    address: {
      street: "1662 1st Ave",
      city: "New York",
      state: "NY",
      zip: "10028",
    },
    coordinates: { latitude: 40.777225, longitude: -73.948792 },
    neighborhood: "Yorkville",
    borough: "Manhattan",
    website: "https://www.sweetlife.nyc",
    menuUrl: "https://www.sweetlife.nyc/stores/sweet-life-nyc",
    phone: "6466784357",
    licenseNumber: "OCM-RETL-24-000107",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_brooklyn_urban",
    slug: "brooklyn-urban",
    name: "Brooklyn Urban",
    address: {
      street: "148 Kingsland Ave",
      city: "Brooklyn",
      state: "NY",
      zip: "11222",
    },
    coordinates: { latitude: 40.721559, longitude: -73.940684 },
    neighborhood: "Greenpoint",
    borough: "Brooklyn",
    licenseNumber: "OCM-CAURD-26-000325",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_late_bloomers",
    slug: "late-bloomers",
    name: "Late Bloomers",
    address: {
      street: "57-01 Myrtle Ave",
      city: "Ridgewood",
      state: "NY",
      zip: "11385",
    },
    coordinates: { latitude: 40.700654, longitude: -73.903611 },
    neighborhood: "Ridgewood",
    borough: "Queens",
    licenseNumber: "OCM-CAURD-24-000074",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_elevate_mount_vernon",
    slug: "elevate-mount-vernon",
    name: "Elevate Cannabis",
    address: {
      street: "127 S Terrace Ave",
      city: "Mount Vernon",
      state: "NY",
      zip: "10550",
    },
    coordinates: { latitude: 40.909307, longitude: -73.849987 },
    neighborhood: "Mount Vernon",
    borough: "Westchester",
    licenseNumber: "OCM-CAURD-23-000030",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_weedside",
    slug: "weedside",
    name: "Weedside",
    address: {
      street: "50-12 72nd St",
      city: "Woodside",
      state: "NY",
      zip: "11377",
    },
    coordinates: { latitude: 40.746261, longitude: -73.893512 },
    neighborhood: "Woodside",
    borough: "Queens",
    website: "https://weedsideny.com",
    menuUrl: "https://weedsideny.com/pages/shop",
    phone: "8454783585",
    licenseNumber: "OCM-RETL-24-000046",
    featured: true,
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_big_city_flavors",
    slug: "big-city-flavors",
    name: "Big City Flavors",
    address: {
      street: "111-19 Liberty Ave",
      city: "South Richmond Hill",
      state: "NY",
      zip: "11419",
    },
    coordinates: { latitude: 40.685192, longitude: -73.830479 },
    neighborhood: "South Richmond Hill",
    borough: "Queens",
    licenseNumber: "OCM-CAURD-25-000263",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_torches_nyc",
    slug: "torches-nyc",
    name: "Torches NYC",
    address: {
      street: "12 E 42nd St",
      city: "New York",
      state: "NY",
      zip: "10017",
    },
    coordinates: { latitude: 40.753227, longitude: -73.980513 },
    neighborhood: "Midtown",
    borough: "Manhattan",
    website: "https://torches.nyc",
    menuUrl: "https://torches.nyc",
    phone: "6464774110",
    licenseNumber: "OCM-CAURD-24-000077",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_munchies",
    slug: "munchies",
    name: "Munchies",
    address: {
      street: "87-01 Rockaway Beach Blvd",
      city: "Rockaway Beach",
      state: "NY",
      zip: "11693",
    },
    coordinates: { latitude: 40.587142, longitude: -73.813727 },
    neighborhood: "Rockaway Beach",
    borough: "Queens",
    licenseNumber: "OCM-CAURD-24-000203",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_kaya_bliss",
    slug: "kaya-bliss",
    name: "Kaya Bliss",
    address: {
      street: "8412 3rd Ave",
      city: "Brooklyn",
      state: "NY",
      zip: "11209",
    },
    coordinates: { latitude: 40.624749, longitude: -74.030791 },
    neighborhood: "Bay Ridge",
    borough: "Brooklyn",
    licenseNumber: "OCM-CAURD-24-000211",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
    notes:
      "SLAPPZ listed this as Brooklyn Heights; the licensed address is 3rd Ave in Bay Ridge. Confirm.",
  },
  {
    id: "ret_seaweed_rockaway",
    slug: "seaweed-rockaway",
    name: "Seaweed",
    address: {
      street: "73-13 Beach Channel Dr",
      city: "Arverne",
      state: "NY",
      zip: "11692",
    },
    coordinates: { latitude: 40.590646, longitude: -73.801735 },
    neighborhood: "Arverne",
    borough: "Queens",
    licenseNumber: "OCM-RETL-24-000120",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_quality_roots",
    slug: "quality-roots",
    name: "Quality Roots",
    address: {
      street: "330 Tompkins Ave",
      city: "Brooklyn",
      state: "NY",
      zip: "11216",
    },
    coordinates: { latitude: 40.68642, longitude: -73.944733 },
    neighborhood: "Bedford-Stuyvesant",
    borough: "Brooklyn",
    licenseNumber: "OCM-CAURD-25-000241",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_buzz_wny",
    slug: "buzz-wny",
    name: "Buzz WNY",
    address: {
      street: "34 Scott St",
      city: "Jamestown",
      state: "NY",
      zip: "14701",
    },
    coordinates: { latitude: 42.099939, longitude: -79.228122 },
    neighborhood: "Jamestown",
    borough: "Western New York",
    licenseNumber: "OCM-RETL-25-000410",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_nuna_harvest",
    slug: "nuna-harvest",
    name: "Nuna Harvest",
    address: {
      street: "696 Locust St",
      city: "Mount Vernon",
      state: "NY",
      zip: "10552",
    },
    coordinates: { latitude: 40.926342, longitude: -73.839261 },
    neighborhood: "Mount Vernon",
    borough: "Westchester",
    licenseNumber: "OCM-CAURD-24-000140",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_electric_city",
    slug: "electric-city",
    name: "Electric City Cannabis",
    address: {
      street: "1354 Lower Broadway",
      city: "Schenectady",
      state: "NY",
      zip: "12306",
    },
    coordinates: { latitude: 42.803611, longitude: -73.954399 },
    neighborhood: "Schenectady",
    borough: "Capital Region",
    licenseNumber: "OCM-RETL-24-000130",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_kokoro_way",
    slug: "kokoro-way",
    name: "The Kokoro Way",
    address: {
      street: "2454 Elmwood Ave",
      city: "Kenmore",
      state: "NY",
      zip: "14217",
    },
    coordinates: { latitude: 42.964087, longitude: -78.879167 },
    neighborhood: "Kenmore",
    borough: "Western New York",
    licenseNumber: "OCM-RETL-24-000135",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
  },
  {
    id: "ret_terp_bros_ozone_park",
    slug: "terp-bros-ozone-park",
    name: "Terp Bros",
    address: {
      street: "135-26 Cross Bay Blvd",
      city: "Ozone Park",
      state: "NY",
      zip: "11417",
    },
    coordinates: { latitude: 40.672937, longitude: -73.84369 },
    neighborhood: "Ozone Park",
    borough: "Queens",
    website: "https://terpbrosnyc.com",
    menuUrl: "https://terpbrosnyc.com/brands/slappz",
    phone: "7183083600",
    licenseNumber: "OCM-CAURD-25-000294",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
    notes:
      "Not on the list SLAPPZ supplied, but retained: Terp Bros publishes a dedicated SLAPPZ brand page, the strongest public evidence of any listing here. Confirm before removing.",
  },
];
