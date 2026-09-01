# SLAPPZ — ASSET MANIFEST

Living record of every brand asset the product depends on, where it came from, and whether it is
production-ready. **Update this file whenever an asset is added, replaced, or requested.**

Last updated: 2026-08-31

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
| `SlappzLogo.jpeg` | JPEG (artwork on solid black) | **Supplied by SLAPPZ** | Master, kept untouched | 1024 × 1024, 66KB | 🟢 Yes | — |
| `slappz-wordmark.png` | PNG (RGBA, transparent) | Built from the above by `scripts/build-wordmark.mjs` | **In use** — header, hero, footer, garments, admin | 892 × 436, 588KB | 🟢 Yes | Vector still wanted |
| `SlappzMark` (React component, compact `S`) | Inline SVG | Built in-repo | Map pins, favicon | 28–512px | 🟡 Placeholder | **Yes — icon SVG** |
| Cab-yellow colorway wordmark | SVG | — | Trade/B2B pages | — | 🔴 Needed | Optional |

> **The real wordmark is in use at full quality.** SLAPPZ supplied a 1024² master, which replaced an
> Instagram avatar export that was 188 × 137 with the platform's story ring baked into the edges. Two
> pieces of machinery went away with it: the elliptical mask that used to cut the ring off, and the crop
> offsets that positioned a larger source behind a smaller window. The component is now just an image.
>
> **The build is one reproducible step.** `node scripts/build-wordmark.mjs` crops the master to the mark's
> content bounds and keys out its black plate. Nothing is redrawn or re-traced — every drawn pixel passes
> through untouched, which is the rule in `CLAUDE.md` § NEVER.
>
> **Why the plate had to go.** The artwork sits on solid black. That is invisible on the black surfaces
> the brand uses everywhere else, but the hero puts the mark over a photograph, where an opaque black
> rectangle reads as a mistake. The mark now sits on any surface, dark or light.
>
> **Why a flood fill and not a threshold.** The letterforms carry a heavy black keyline. "Make all black
> transparent" would eat it and leave the green floating. The fill runs inwards from the border and only
> takes black *connected* to the outside; the artwork's purple rim seals the keyline off from the plate.
> On the supplied master the plate is 27.5% of the image while black overall is 48.7% — that gap is the
> keyline being preserved.
>
> **Why the source is a PNG and not a WebP.** Next's image optimiser silently flattens alpha when the
> source file is WebP, which put the black rectangle straight back over the hero. From a PNG it keeps the
> transparency. The browser never downloads this PNG — Next re-encodes it per size — so the file size
> costs nothing at runtime. Do not "optimise" it to a `.webp` source.
>
> **Sharpness is no longer a concern.** At 436px of source height every rendered size downscales, and
> downscaling is sharp. The old 188px source had to be upscaled, which is what made it look soft.
>
> The compact `S` used on map pins is still built in-repo — the full wordmark is illegible at 28px, so a
> proper square icon remains a separate asset request.

### 🔴 Request from SLAPPZ

1. **Primary wordmark as vector** — `SVG` (outlined paths) preferred, plus `AI`/`EPS` source. The supplied
   1024² raster is enough for every current surface; vector is what makes print and large-format safe.
2. **Compact `S` mark / icon** — `SVG`, square-safe, legible at 24px (map pins, favicon, app icon).
3. Confirmation of the **exact brand hex values** (this repo's are sampled from screenshots — see
   `SLAPPZ_DIGITAL_SYSTEM.md` §3).
4. The **display typeface name/licence** used in campaign graphics.

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

| `slappz-stand.webp` | **Supplied by SLAPPZ** | On the bench — not currently placed | 🟢 Yes, 768 × 1024, 71KB |

Currently the `FROM SLAPPZ HQ` section renders **brand-built graphic tiles**, not photography, precisely so
that no Instagram CDN URL is ever hotlinked. Swap to real imagery when originals arrive.

> **`slappz-stand.webp` is a real SLAPPZ photograph** — the branded display stand, tubes and tray. It was
> briefly placed at the head of the culture strip and SLAPPZ asked for the generated tile back, so it is
> kept here rather than deleted. It is the only real product-in-situ photo the repo has; reach for it first
> if that section ever moves to photography.

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

Not brand assets, but held to the same evidence standard. Live in `src/data/retailers.ts`.

**26 licensed stores across 6 New York markets** — Queens (12), Brooklyn (6), Manhattan (3),
Westchester (2), Western New York (2), Capital Region (1).

### How this list was built

1. **SLAPPZ HQ supplied the store list.** For its own distribution, the brand is the authoritative
   source — this is the strongest verification tier in `CLAUDE.md` § RETAILER RULES.
2. **Every store was cross-checked against the NYS OCM licence registry**
   ([`jskf-tt3q`](https://data.ny.gov/resource/jskf-tt3q.json) on data.ny.gov) to confirm the licensed
   street address and licence number — rather than trusting a search result or a menu aggregator.
3. **Every NYC coordinate comes from the NYC Department of City Planning geocoder**
   ([geosearch.planninglabs.nyc](https://geosearch.planninglabs.nyc)), resolved from that licensed
   address. None are estimated.
4. **Every `website` and `menuUrl` was requested and returned 200** with the expected page before it
   was written down.

That is why each entry carries a real `licenseNumber`: it is the state's record, not ours.

> **Use the Planning geocoder for anything inside the five boroughs.** Nominatim cannot resolve
> hyphenated Queens house numbers and silently falls back to a street or neighbourhood centroid. That
> is not a rounding error — it once put Weedside a full kilometre from its own front door. Every NYC
> coordinate was re-cut on 2026-08-31; the largest correction was 1,070m, and eight more moved by
> 5–130m.

### 🟠 Open questions for SLAPPZ

These are in the app with a `notes` field recording the discrepancy. They are **not** errors to quietly
"fix" — each needs a human answer.

| Store | Question |
| --- | --- |
| **Flynnstoned** | Operates **12** licensed NY locations. Currently listed as the Brooklyn store (8112 5th Ave, Bay Ridge). Which location(s) actually stock SLAPPZ? |
| **Terp Bros** | Not on the supplied list, but **retained** — Terp Bros publishes a dedicated SLAPPZ brand page, the strongest public evidence of any store here. Confirm before removing. |

### ✅ Questions closed on 2026-08-31

| Store | How it was settled |
| --- | --- |
| **Gaea's Garden** | SLAPPZ said Flushing and was right. An earlier build matched it to `Gaia Operations LLC` on Lefferts Blvd — the wrong business. Gaea's Garden holds a **microbusiness** licence (`OCM-MICR-24-000030`), which is why it never appeared in a retail-only registry query. Corrected to 134-24 Northern Blvd, Flushing. |
| **Emerald (2nd location)** | SLAPPZ said "Upper West Side", but the brand's only Manhattan store is the Upper **East** Side one at 1190 Lexington Ave — its own site and the registry agree, and no UWS Emerald exists. |
| **Kaya Bliss** | SLAPPZ said "Brooklyn Heights", but Kaya Bliss holds exactly one retail licence: 8412 3rd Ave, Bay Ridge. The Brooklyn Heights page on their site is a delivery service-area page, not a second store. |

### Stores with no menu link yet

`menuUrl` drives the SHOP STORE button and is only set where a real online menu was confirmed. **24 of
26 stores now have one.** The two that do not:

| Store | Why |
| --- | --- |
| **Cannafamily** | Website is live, but its menu is still marked "coming soon". |
| **Brooklyn Urban** | No public website or menu found. Some directories still call it "in buildout"; the OCM registry has it Active, so the listing stands. |

The button simply is not rendered for those two, because a dead link is worse than no button.

### Previously pending — now resolved

The earlier "pending verification" list (Quality Roots, The Emerald, Late Bloomers, Big City Flav's)
was confirmed by SLAPPZ and is now live. `Indoor NYC`, `Swan Marina`, `Flywlkr`, `Kushia`, `Handball`,
`OG Anunoby` and `Fanatics NYC` were **not** on the supplied list — they appear to be events, collabs
or merch drops rather than stockists, and remain out of the app.

> **Note on Happy Alta:** an earlier instruction excluded it. SLAPPZ has since asked for it to be
> included, so it is live at 66-33 Fresh Pond Rd, Ridgewood (OCM-RETL-24-000075). The earlier exclusion
> no longer applies. Some aggregators call it "formerly Polanco Brothers" — that is wrong. Its licensee
> is Juicy Wellness Inc.; Polanco Brothers Corp is the licensee behind **Torches NYC**. Do not merge them.

---
## 9. OPEN REQUESTS — SUMMARY FOR SLAPPZ

1. Logo master files (SVG/AI/EPS/PNG) — **blocks production launch**
2. Confirmed brand hex values and display typeface licence
3. Clean product photography (1g tube, 10-pack) on transparent or black
4. 6–10 approved lifestyle/campaign images for the `FROM SLAPPZ HQ` strip
5. **The authoritative stockist list** with menu URLs — the single highest-value input to this product
6. Per-retailer product availability, if it can be verified
