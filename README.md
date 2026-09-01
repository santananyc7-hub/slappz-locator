# SLAPPZ — DISPENSARY LOCATOR

The official consumer-facing locator for [SLAPPZ](https://www.instagram.com/slappz_hq/).
One question, answered fast:

> **Where can I buy SLAPPZ right now?**

---

## Run it

```bash
npm install && npm run dev
```

Open <http://localhost:3000>. **No API keys or environment variables are required** — the map
uses a key-free basemap and geocoding falls back to a bundled NYC table. See
[`.env.example`](.env.example) for the optional settings.

---

## Documentation

| Doc | What's in it |
| --- | --- |
| [`CLAUDE.md`](CLAUDE.md) | Project rules, brand rules, data rules, architecture. **Read first.** |
| [`brand/SLAPPZ_DIGITAL_SYSTEM.md`](brand/SLAPPZ_DIGITAL_SYSTEM.md) | The visual system, researched from the real brand |
| [`brand/ASSET_MANIFEST.md`](brand/ASSET_MANIFEST.md) | Every asset, its provenance, and what still needs a master file |

---

## Routes

| Route | Purpose |
| --- | --- |
| `/` | The locator + the full customer journey. Accepts `?q=` so campaign links render results server-side |
| `/products` | The range. Verified SKUs only |
| `/where-to-buy-slappz` | Full retailer directory, grouped by market |
| `/about` | Brand story |
| `/wholesale` | B2B — for licensed NY retailers |
| `/find` | Redirects to `/`, preserving query. Short URL for QR codes and packaging |
| `/stores/[slug]` | Shareable retailer page, statically generated, independently indexable |
| `/admin/locations` | Add / edit / feature / deactivate retailers |
| `/admin/locations/import` | CSV bulk import with validation and preview |
| `/admin/demand` | Where people searched and found nothing |
| `/api/search` | `?q=` or `?lat=&lon=` → retailers ranked by proximity |
| `/api/demand` | `BRING SLAPPZ HERE` submissions |

---

## Architecture

```
src/
  app/                 routes, API handlers, sitemap/robots/OG
  components/
    brand/             wordmark, mark, icons  (logo placeholders — see ASSET_MANIFEST)
    locator/           search, results, map, zero-results
    site/              header, marquee, footer
    admin/             retailer form, row, CSV import
  data/                retailers.ts, products.ts, nyc-places.ts   ← the seed
  lib/
    repository/        the ONLY way anything reads or writes retailer/demand data
    geo.ts             distance, ranking, formatting
    geocode.ts         local ZIP/place table → Nominatim fallback
    analytics.ts       event names + UTM attribution
```

**The repository boundary is the important one.** Components never import `data/` directly.
Swapping the seed file for Supabase/Postgres, a Dutchie feed, or distributor data means
writing one adapter in `lib/repository/storage.ts` — no component changes.

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 App Router + TypeScript | Server rendering for the five-second bar |
| Styling | Tailwind v4 + CSS custom properties | Brand tokens live in `app/globals.css` |
| Map | MapLibre GL + OpenFreeMap dark vector | Free, **no API key**, no rate limit, fully restyleable, code-split |
| Geocoding | Local NYC ZIP/place table → Nominatim | Instant for the common case, free, no key |
| Storage | Repository + JSON file adapter | One file to swap for a real database |

---

## Ground rules

These are enforced in code and in review — see `CLAUDE.md` for the full set.

- **Never fabricate a retailer or product availability.** Every seeded retailer in
  `src/data/retailers.ts` carries a `verification` block naming the evidence. Shops named on
  Instagram but unconfirmed are parked in `ASSET_MANIFEST.md`, not shipped.
- **Inventory is never presented as real-time.** The UI says so, in the footer and on every
  store page.
- **Geolocation only fires from an explicit `USE MY LOCATION` press.** Never on load.
- **Demand data is anonymous.** Coordinates are rounded to ~1km before persistence; no IP,
  user agent or session is stored. Contact details only exist when typed in by hand.
- **No Instagram CDN hotlinks.** Brand-built tiles stand in until master assets arrive.

---

## Before production

1. **Get the logo master files.** The wordmark and mark are honest placeholders built in the
   brand's colors and construction, not a traced imitation. `ASSET_MANIFEST.md` § 1 lists
   exactly what to request.
2. **Replace admin Basic auth** (`src/proxy.ts`) with real accounts.
3. **Write the Postgres/Supabase adapter** in `lib/repository/storage.ts` — the JSON file
   adapter will not survive a read-only or multi-instance host.
4. **Confirm the stockist list with SLAPPZ.** Five retailers are seeded from public evidence;
   the authoritative list is the single highest-value input to this product.
5. **Decide on an analytics transport.** `lib/analytics.ts` defines the events and emits to
   `dataLayer`/`gtag`/Plausible if present; this repo ships no tracking script by choice.
