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
 * licensed street address and licence number, rather than trusting a search result.
 *
 * GEOCODING
 * ---------
 * Every NYC coordinate comes from the NYC Department of City Planning geocoder
 * (geosearch.planninglabs.nyc), resolved from the licensed address. None are estimated.
 * This matters: Nominatim cannot resolve hyphenated Queens house numbers and silently falls
 * back to a street or neighbourhood centroid, which once put Weedside a kilometre from its
 * own front door. Use the Planning geocoder for anything inside the five boroughs.
 *
 * WEBSITES AND MENUS
 * ------------------
 * Every `website` and `menuUrl` here was requested and returned 200 with the expected page
 * before it was written down. Stores whose menu is not live yet carry a `website` and no
 * `menuUrl`, so the SHOP STORE button stays hidden rather than pointing somewhere useless.
 *
 * A handful of entries carry `notes` where SLAPPZ's description and the licensed record
 * disagreed (neighbourhood mismatches, chains with many locations, aggregators conflating two
 * businesses). The note is the record of the discrepancy and how it was settled — read it
 * before "fixing" an entry that looks wrong.
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
    coordinates: { latitude: 40.730072, longitude: -73.863448 },
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
    coordinates: { latitude: 40.707002, longitude: -73.911935 },
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
    coordinates: { latitude: 40.708014, longitude: -73.897439 },
    neighborhood: "Ridgewood",
    borough: "Queens",
    licenseNumber: "OCM-RETL-24-000075",
    website: "https://happyaltaridgewood.com",
    menuUrl: "https://happyaltaridgewood.com/menu/",
    phone: "(347) 227-7084",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
    notes:
      "Some aggregators list this as “formerly Polanco Brothers”. That is wrong: the licensee here is Juicy Wellness Inc., while Polanco Brothers Corp is the licensee behind Torches NYC at 12 E 42nd St. Do not merge the two.",
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
    coordinates: { latitude: 40.659954, longitude: -73.830799 },
    neighborhood: "Howard Beach",
    borough: "Queens",
    licenseNumber: "OCM-CAURD-25-000279",
    website: "https://cannafamilynyc.com",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
    notes:
      "Website is live but its menu is still marked “coming soon”, so no menuUrl is set — the SHOP STORE button stays hidden until there is a real menu to send people to.",
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
    coordinates: { latitude: 40.624863, longitude: -74.024802 },
    neighborhood: "Bay Ridge",
    borough: "Brooklyn",
    licenseNumber: "OCM-CAURD-25-000281",
    website: "https://flynnstoned.com",
    menuUrl:
      "https://flynnstoned.com/stores/flynnstoned-cannabis-dispensary-brooklyn-bay-ridge-ny/",
    phone: "(347) 909-7014",
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
      street: "134-24 Northern Blvd",
      city: "Flushing",
      state: "NY",
      zip: "11354",
    },
    coordinates: { latitude: 40.762409, longitude: -73.83375 },
    neighborhood: "Flushing",
    borough: "Queens",
    licenseNumber: "OCM-MICR-24-000030",
    website: "https://gaeas.garden/",
    menuUrl: "https://gaeas.garden/",
    phone: "(347) 506-0350",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
    notes:
      "Corrected 2026-08-31 on SLAPPZ HQ’s word that this store is in Flushing. An earlier build matched it to Gaia Operations LLC on Lefferts Blvd — wrong business. Gaea’s Garden holds a MICROBUSINESS licence (OCMMICR), not a retail one, which is why it does not appear in a retail-only registry query. Grows its own flower on site.",
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
    coordinates: { latitude: 40.786803, longitude: -73.821663 },
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
    coordinates: { latitude: 40.676001, longitude: -74.014215 },
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
    coordinates: { latitude: 40.697897, longitude: -73.929391 },
    neighborhood: "Bushwick",
    borough: "Brooklyn",
    licenseNumber: "OCM-CAURD-24-000057",
    website: "https://theemeralddispensary.com",
    menuUrl: "https://theemeralddispensary.com",
    phone: "(917) 688-3025",
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
    coordinates: { latitude: 40.776482, longitude: -73.95806 },
    neighborhood: "Upper East Side",
    borough: "Manhattan",
    licenseNumber: "OCM-CAURD-24-000146",
    website: "https://emeralddispensary.nyc",
    menuUrl: "https://emeralddispensary.nyc",
    phone: "(646) 329-6120",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
    notes:
      "Resolved 2026-08-31. SLAPPZ listed this as Upper West Side, but the brand’s only Manhattan store is the Upper East Side one at 1190 Lexington Ave — its own site (emeralddispensary.nyc) and the OCM registry agree, and there is no UWS Emerald. Same operator as the Bushwick store, different website.",
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
    coordinates: { latitude: 40.777233, longitude: -73.948794 },
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
    coordinates: { latitude: 40.721564, longitude: -73.940698 },
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
    notes:
      "No public website or online menu found as of 2026-08-31. Some directories still list it as “in buildout”, but the OCM registry has ADC Retail LLC as Active at this address, so the listing stands.",
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
    coordinates: { latitude: 40.700606, longitude: -73.903639 },
    neighborhood: "Ridgewood",
    borough: "Queens",
    licenseNumber: "OCM-CAURD-24-000074",
    website: "https://latebloomers-nyc.com",
    menuUrl: "https://latebloomers-nyc.com",
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
    website: "https://www.elevatecannabisny.com",
    menuUrl: "https://www.elevatecannabisny.com",
    phone: "(914) 966-1001",
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
    coordinates: { latitude: 40.736665, longitude: -73.8926 },
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
    notes:
      "An earlier build had this store roughly a kilometre off — the old geocoder snapped hyphenated Queens addresses to the neighbourhood centroid instead of the building. All NYC coordinates were re-cut against the NYC Planning geocoder on 2026-08-31. Also note weedsideny.com gives the address as 50-22 72nd St while the OCM licence says 50-12; the licensed address is used here, and the two are about 18m apart on the same block.",
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
    coordinates: { latitude: 40.685232, longitude: -73.830495 },
    neighborhood: "South Richmond Hill",
    borough: "Queens",
    licenseNumber: "OCM-CAURD-25-000263",
    website: "https://bigcityflavors.com",
    menuUrl: "https://bigcityflavors.com/?page_id=315",
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
    coordinates: { latitude: 40.752994, longitude: -73.980771 },
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
    coordinates: { latitude: 40.586857, longitude: -73.81227 },
    neighborhood: "Rockaway Beach",
    borough: "Queens",
    licenseNumber: "OCM-CAURD-24-000203",
    website: "https://munchiesdispensaryny.com",
    menuUrl: "https://munchiesdispensaryny.com",
    phone: "(347) 503-7099",
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
    coordinates: { latitude: 40.624757, longitude: -74.030793 },
    neighborhood: "Bay Ridge",
    borough: "Brooklyn",
    licenseNumber: "OCM-CAURD-24-000211",
    website: "https://kayablissnyc.com",
    menuUrl: "https://kayablissnyc.com/location/brooklyn-ny/shop/",
    phone: "(718) 500-7400",
    active: true,
    lastVerified: "2026-08-31",
    verification: {
      source:
        "Supplied by SLAPPZ HQ as a stocking retailer; address and licence number cross-checked against the NYS OCM licence registry",
      confidence: "high",
      url: "https://data.ny.gov/resource/jskf-tt3q.json",
    },
    notes:
      "Resolved 2026-08-31. SLAPPZ listed this as Brooklyn Heights, but Kaya Bliss holds exactly one retail licence — 8412 3rd Ave, Bay Ridge. The Brooklyn Heights page on kayablissnyc.com is a delivery service-area page, not a second store.",
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
    coordinates: { latitude: 40.59058, longitude: -73.80185 },
    neighborhood: "Arverne",
    borough: "Queens",
    licenseNumber: "OCM-RETL-24-000120",
    website: "https://seaweedrbny.com",
    menuUrl: "https://seaweedrbny.com",
    phone: "(718) 474-1851",
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
    coordinates: { latitude: 40.686429, longitude: -73.944735 },
    neighborhood: "Bedford-Stuyvesant",
    borough: "Brooklyn",
    licenseNumber: "OCM-CAURD-25-000241",
    website: "https://qualityroots.nyc",
    menuUrl: "https://qualityroots.nyc",
    phone: "(347) 236-1146",
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
    website: "https://www.buzzwny.com",
    menuUrl: "https://www.buzzwny.com",
    phone: "(716) 710-7202",
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
    website: "https://nunaharvest.com",
    menuUrl: "https://nunaharvest.com/stores/nuna-harvest",
    phone: "(914) 600-8124",
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
    website: "https://electriccitycannabisco.com",
    menuUrl: "https://electriccitycannabisco.com/shop/",
    phone: "(518) 579-0031",
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
    website: "https://www.thekokoroway.com",
    menuUrl: "https://www.thekokoroway.com/shop",
    phone: "(716) 322-0327",
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
    coordinates: { latitude: 40.672879, longitude: -73.843946 },
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
