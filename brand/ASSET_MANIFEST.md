# SLAPPZ — ASSET MANIFEST

Living record of every brand asset the product depends on, where it came from, and whether it is
production-ready. **Update this file whenever an asset is added, replaced, or requested.**

Last updated: 2026-08-14

---

## STATUS LEGEND

| Status | Meaning |
| --- | --- |
| ✅ Production ready | Owned/licensed master file, correct format and resolution |
| 🟡 Placeholder | Deliberate stand-in built in-repo. Functional, honest, replaceable |
| 🔴 Needed | Required for launch, not yet available |
| 📎 Reference only | Public reference used for design research. **Never deployed.** |

---

## 1. LOGOS — `/public/brand/slappz/logos/`

| Asset | Type | Source | Usage | Approx. dimensions | Production ready | Master needed |
| --- | --- | --- | --- | --- | --- | --- |
| `Slappz Logo.png` | PNG (RGBA, opaque) | **Supplied by SLAPPZ** | Original as delivered — kept untouched | 188 × 137 | 🟡 Low-res | Higher-res master |
| `slappz-wordmark.png` | PNG | Copy of the above under a URL-safe name | Archival / fallback | 188 × 137 | 🟡 Low-res | Higher-res master |
| `slappz-wordmark@4x.webp` | WebP q95 | Lanczos3 resample of the above | **In use** — header, hero, footer, admin | 752 × 548, 45KB | 🟡 Resampled | Higher-res master |
| `SlappzMark` (React component, compact `S`) | Inline SVG | Built in-repo | Map pins, favicon | 28–512px | 🟡 Placeholder | **Yes — icon SVG** |
| Wordmark, true transparent, ring-free | SVG/PNG | — | Any non-black surface | — | 🔴 Needed | **Yes** |
| Cab-yellow colorway wordmark | SVG | — | Trade/B2B pages | — | 🔴 Needed | Optional |

> **The real wordmark is now in use.** `SlappzWordmark` renders the supplied artwork rather than a typographic
> stand-in. Two properties of the delivered file are handled in the component and are worth knowing about:
>
> 1. **The Instagram story ring is baked into the edges.** It is a platform artefact, not brand. The ring is an
>    ellipse that cuts *inside* the wordmark's bounding box at the corners, so no rectangular crop can remove it
>    without clipping the `S` — the component masks it off with a matching ellipse instead.
> 2. **The file is fully opaque on a near-black ground (`#0c1014`), not transparent.** Invisible against this
>    product's black surfaces, but it means the mark cannot currently be placed on a light background. The brand
>    has no light lockup anyway (see `SLAPPZ_DIGITAL_SYSTEM.md` § 2), so nothing is blocked today.
>
> **Sharpness.** At hero size the browser was upscaling the 188px source ~1.5× with bilinear filtering, which is
> what made it look soft. The asset actually served is now `@4x` — a Lanczos3 resample with a light unsharp pass —
> so the browser always *downscales* it. Downscaling is sharp; upscaling never is.
>
> That is better resampling, **not new detail**. It is deliberately not an AI upscale: super-resolution on a
> custom letterform invents edge detail and produces a subtly wrong logo, which is the one thing this repo must
> not do. A genuine high-resolution master is still the real fix — it is request #1 below.
>
> The compact `S` used on map pins is still built in-repo — the full wordmark is illegible at 28px, so a proper
> square icon is a separate asset request.

### 🔴 Request from SLAPPZ

1. **Primary wordmark at full resolution** — `SVG` (outlined paths) preferred, plus `AI`/`EPS` source.
   The supplied 188×137 PNG works for the header but caps how large the mark can ever be shown.
2. **A version with a real alpha channel and no story ring** — the delivered file is an avatar export.
3. **Compact `S` mark / icon** — `SVG`, square-safe, legible at 24px (map pins, favicon, app icon).
4. Confirmation of the **exact brand hex values** (this repo's are sampled from screenshots — see
   `SLAPPZ_DIGITAL_SYSTEM.md` §3).
5. The **display typeface name/licence** used in campaign graphics.

---

## 2. PRODUCT — `/public/brand/slappz/product/`

| Asset | Type | Source | Usage | Production ready | Notes |
| --- | --- | --- | --- | --- | --- |
| `slappz-perm-marker-1g.webp` | Photo, cut out | Torches NYC product listing (Dutchie CDN) | Product cards | 🟡 Menu shot | 600×600, 24KB, background keyed to transparent |
| `slappz-bubba-kush-1g.webp` | Photo, cut out | Torches NYC product listing (Dutchie CDN) | Product cards | 🟡 Menu shot | 600×600, 22KB, background keyed to transparent |
| 10-pack box | Photo | — | Product cards | 🔴 Needed | Card falls back to a typographic treatment |

> **Where these came from.** Both are the menu pack shots a verified stocking retailer publishes for these
> SKUs. They arrived on a white studio sweep, which would read as a broken white square on this site, so the
> background was keyed out with `scripts/remove-product-background.mjs` — a border flood-fill that only removes
> background *connected to the edge*, so the pale pre-roll and the compliance label survive.
>
> They are good enough to ship and clearly show the real packaging. They are still **menu photography, not
> brand photography** — the framing and lighting are the retailer's, not SLAPPZ's. Replace with SLAPPZ's own
> pack shots when available.

**Product data policy:** `src/data/products.ts` contains **only** SKUs evidenced publicly — Perm Marker
(hybrid) and Bubba Kush (indica) are both listed by name at a verified stocking retailer, plus the 10-pack.
Deliberately excluded: **price** (retailer-set and varies), **THC percentage** (batch-specific), and
**effects** (a compliance problem for a brand to assert). Strains are **not** attached to any retailer,
because per-retailer availability has not been verified. Do not populate `availableProducts` without a source.

---

## 2b. MERCH — `/public/brand/slappz/merch/`

| Asset | Type | Real print | Status |
| --- | --- | --- | --- |
| `tee.webp` | Generated blank garment, 900², 16KB | SLAPPZ HQ wordmark, chest | ✅ Live |
| `bucket.webp` | Generated blank garment, 900², 30KB | SLAPPZ HQ mark, front panel | ✅ Live |
| `cap.webp` | Generated blank garment, 900², 27KB | SLAPPZ HQ mark, front panel | ✅ Live |
| NYC Tank | — | Full-colour graffiti: pigeons, crown, skyline, BKLYN/QUEENS/MANHATTAN | ⛔ Held back |
| Acid Wash Hoodie | — | Airbrushed character + hand prints with SLAPPZ script | ⛔ Held back |

> **How the cards are built — and where the line sits.** The GARMENTS are generated product shots: blank black
> tee, bucket hat and fitted cap, all front-on under matching light on the same near-black ground so the three
> read as one set. The PRINT is the real wordmark asset — the same file the header uses — composited on with
> `mix-blend-mode: screen`, which drops the logo's near-black backing into the fabric and lets the weave and
> folds show through, so it reads as printed rather than pasted on.
>
> That split is deliberate. An AI-generated *logo* would be a subtly wrong SLAPPZ mark, which is the one thing
> this repo must never produce. An AI-generated *blank tee* is just a tee.
>
> **Held back:** the tank and hoodie carry bespoke commissioned illustrations. There is no honest way to show
> those without the artwork, and a generated lookalike would misrepresent SLAPPZ's own designs — so they sit in
> `src/data/merch.ts` with `active: false`. Flip that to `true` once the artwork or photography exists. (The
> hoodie character also appears to reference a third-party cartoon, which is a second reason not to reproduce it.)
>
> **Real photography wins:** set `image` on a merch item and the card shows the photo instead of the render, no
> layout change. Drop files into `/public/brand/slappz/merch/`.
>
> The section has **no prices and no cart**, on purpose: there is no SLAPPZ webstore. Merch moves at pop-ups
> and through DMs, so that is what the CTA says.

## 3. LIFESTYLE — `/public/brand/slappz/lifestyle/`

| Asset | Source | Usage | Production ready |
| --- | --- | --- | --- |
| Dispensary activation photos | 📎 IG reference | `FROM SLAPPZ HQ` strip | 🔴 Needed — request originals |
| Merch on customers (tees, bucket hats) | 📎 IG reference | Brand strip | 🔴 Needed |
| Boat / marina content | 📎 IG reference | Brand strip | 🔴 Needed |

Currently the `FROM SLAPPZ HQ` section renders **brand-built graphic tiles**, not photography, precisely so
that no Instagram CDN URL is ever hotlinked. Swap to real imagery when originals arrive.

---

## 4. CAMPAIGN — `/public/brand/slappz/campaign/`

| Asset | Source | Usage | Production ready |
| --- | --- | --- | --- |
| `hero-queens-night.webp` | **AI-generated** (Higgsfield / Recraft V4.1) | Homepage hero background | 🟡 Placeholder — see note |
| `hero-loop.mp4` | **AI-generated** (Seedance 2.0, image-to-video from the still above) | Hero ambient loop, desktop only | 🟡 Placeholder — 5s, 1280×720, 146KB |
| Blacklight shark/jellyfish artwork | 📎 IG reference | Reference only | 📎 Reference only |
| Yellow-cab B2B graphic | 📎 IG reference | Future `/retailers` trade page | 🔴 Needed |
| 2-year anniversary graphic | 📎 IG reference | Reference only | 📎 Reference only |

> **`hero-queens-night.webp` is generated imagery, not a photograph of anything real.** A nocturnal NYC street
> under an elevated line — wet asphalt, a motion-blurred yellow cab, acid-green and violet storefront light.
> Chosen because the locator's subject *is* the city you're searching, and because the cab and the palette echo
> SLAPPZ's own campaign graphics.
>
> It depicts no real location, no real retailer, no product and no identifiable person, and carries no text or
> logo — so it makes no claim on SLAPPZ's behalf. It is still a stand-in: **replace it with real SLAPPZ campaign
> or event photography** when available. Source: Recraft V4.1, 2688×1536, job `02d5dda7-6ae6-4640-a449-4a94968cb8da`.
> Optimised to 2400px WebP via `scripts/optimize-brand-image.mjs` (6.35MB → 209KB).
>
> **`hero-loop.mp4`** is that same still animated — rain falling, neon rippling on the wet asphalt, locked-off
> camera so it loops. Generated image-to-video from the exact frame, so the still doubles as the poster and the
> handover is invisible. Encoded 1.7MB → **146KB** (`ffmpeg`, H.264 CRF 32, 24fps, audio stripped). VP9/WebM
> came out larger at this length, so the MP4 ships alone.
>
> It is **desktop-only and never plays under `prefers-reduced-motion`** — see `HeroVideo`. Mobile keeps the
> still, because the primary runtime is a phone in the Instagram in-app browser and the mobile hero is too
> short for the motion to earn its bytes.

---

## 5. TEXTURES — `/public/brand/slappz/textures/`

| Asset | Source | Usage | Production ready |
| --- | --- | --- | --- |
| `grain.svg` | Built in-repo (SVG turbulence filter) | Subtle noise over black grounds | ✅ Production ready |
| Halftone / print texture | — | Optional | 🔴 Needed |

---

## 6. ICONS — `/public/brand/slappz/icons/`

| Asset | Source | Usage | Production ready |
| --- | --- | --- | --- |
| `favicon` / app icons | Built in-repo from `SlappzMark` | Browser tab, PWA | 🟡 Placeholder |
| UI icons (pin, directions, phone, cart, arrow) | Built in-repo, inline SVG | Buttons, cards | ✅ Production ready |

No icon library is installed — icons are ~12 inline SVG paths, which is far cheaper than a dependency and
keeps the stroke weight matched to the brand's hard-edged language.

---

## 7. SOCIAL REFERENCE — `/public/brand/slappz/social-reference/`

📎 **Reference only. Nothing in this section is deployed or hotlinked.**

Public posts reviewed for the visual system (Instagram `@slappz_hq`):

| Reference | What it established |
| --- | --- |
| Profile avatar | Primary logo construction: acid fill, black keyline, violet extrude, `HQ` lockup |
| "WE'RE OUTSIDE TOMORROW — IGNYTE 2nd Anniversary" | Tagline `THE BRAND THAT SLAPPZ`; event/pop-up model; IGNYTE partnership |
| "ATTENTION DISPENSARY OWNERS, BUYERS & BUDTENDERS" (yellow cab) | Trade voice, four brand pillars, cab-yellow colorway, phone 718-708-8430 |
| Blacklight shark + jellyfish "BUBBA KUSH PREROLL" | The airbrush/blacklight illustration motif; violet+acid+magenta palette; strain name |
| "SLAPPZ HQ FIRST POP UP AT WEEDSIDE" | Weedside retail relationship; Woodside NY |
| Caricature post ([`/p/Daq9XbqOkYX/`](https://www.instagram.com/p/Daq9XbqOkYX/)) | Voice sample; hashtags; Queens geotag; Terp Bros engagement |
| Anniversary pillars graphic | `BUILT ON COMMUNITY · TRUSTED SINCE DAY 1 · LOYAL CUSTOMERS · LEGACY TO LEGAL` |
| Merch posts (hoodie, tank, bucket hat) | Airbrush graphic language on apparel |

**Access note:** the `@slappz_hq` profile is age-restricted and requires a logged-in session. Research was
conducted through an authorised, already-signed-in browser session; no access control was bypassed and no
private content was accessed. Because Instagram CDN URLs are signed and expiring, **no image URLs are recorded
or referenced here** — only what each post established. Originals must come from SLAPPZ directly.

---

## 8. RETAILER DATA PROVENANCE

Not brand assets, but held to the same evidence standard. Seeded in `src/data/retailers.ts`.

| Retailer | Address | SLAPPZ evidence | Address/licence source | Confidence |
| --- | --- | --- | --- | --- |
| Terp Bros — Ozone Park | 135-26 Cross Bay Blvd, Ozone Park, NY 11417 | Dedicated SLAPPZ brand page on retailer site; retailer comments on SLAPPZ posts | [terpbrosnyc.com/brands/slappz](https://terpbrosnyc.com/brands/slappz) · OCM-CAURD-25-000294 | **High** |
| Weedside | 50-22 72nd St, Woodside, NY 11377 | SLAPPZ HQ "FIRST POP UP AT WEEDSIDE" post; store visit posts | [weedsideny.com](https://weedsideny.com/) | **High** |
| IGNYTE | 145-18 14th Ave, Whitestone, NY 11357 | SLAPPZ pop-up at IGNYTE 2nd anniversary post | [ignyteny.com](https://ignyteny.com/) · [QNS coverage](https://qns.com/2024/07/whitestone-first-licensed-cannabis-retailer-preparing-open/) | **High** |
| GreenCup | 95-38 Queens Blvd, Rego Park, NY 11374 | Branded GreenCup activation in SLAPPZ posts | [greencup.nyc](https://greencup.nyc/) · OCM-CAURD-24-000174 | **Medium** |
| Torches NYC | 12 E 42nd St, New York, NY 10017 | Torches shopping bag featured in SLAPPZ post | [torches.nyc](https://torches.nyc/) · OCM-CAURD-24-000077 | **Medium** |

Coordinates for all five were geocoded from their verified street addresses (OpenStreetMap/Nominatim), not estimated.

### 🟡 Pending verification — **not** in the app

Named in SLAPPZ story highlights but **not confirmed** as stocking retailers. They are recorded here and
deliberately excluded from `retailers.ts` until SLAPPZ or the retailer confirms.

`Indoor NYC` · `Quality Roots` · `The Emerald` · `Late Bloomers` · `Swan Marina` · `Flywlkr` · `Kushia` ·
`Big City Flav's` · `Fanatics NYC`

### ⛔ Explicitly excluded

**Happy Hits** — appears in the background of SLAPPZ post imagery. **Do not add it as a retailer.** Excluded
at the client's instruction, not for lack of evidence, so do not "correct" this in a future session.

Some of these are almost certainly events, collabs, or merch drops rather than stockists — "Handball", "OG
Anunoby" and "Fanatics NYC" in the same highlight list make clear the highlights mix retail with culture.
**Ask SLAPPZ which are stockists** rather than guessing.

---

## 9. OPEN REQUESTS — SUMMARY FOR SLAPPZ

1. Logo master files (SVG/AI/EPS/PNG) — **blocks production launch**
2. Confirmed brand hex values and display typeface licence
3. Clean product photography (1g tube, 10-pack) on transparent or black
4. 6–10 approved lifestyle/campaign images for the `FROM SLAPPZ HQ` strip
5. **The authoritative stockist list** with menu URLs — the single highest-value input to this product
6. Per-retailer product availability, if it can be verified
