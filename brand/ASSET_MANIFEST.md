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
| `SlappzPerm.jpeg` | Strain sheet | **Supplied by SLAPPZ** | Master | 🟢 Yes | 1024 × 1536, 326KB |
| `Slappzbubba.jpeg` | Strain sheet | **Supplied by SLAPPZ** | Master | 🟢 Yes | 1024 × 1536, 333KB |
| `SlappzSour.jpeg` | Strain sheet | **Supplied by SLAPPZ** | Master | 🟢 Yes | 1024 × 1536, 309KB |
| `slappz-perm-marker-1g.webp` | Pack shot, cut out | Cut from `SlappzPerm.jpeg` | Product cards | 🟢 Yes | 881 × 236, 72KB |
| `slappz-bubba-kush-1g.webp` | Pack shot, cut out | Cut from `Slappzbubba.jpeg` | Product cards | 🟢 Yes | 881 × 215, 72KB |
| `slappz-sour-diesel-1g.webp` | Pack shot, cut out | Cut from `SlappzSour.jpeg` | Product cards | 🟢 Yes | 881 × 219, 70KB |

> **These are SLAPPZ's own now.** The cards previously used menu pack shots scraped from a stocking
> retailer's Dutchie listing — retailer framing, retailer lighting, shot on a white studio sweep. Request #3
> in § 9 asked SLAPPZ for their own product photography; these sheets are it, and the menu shots are gone.
>
> **How the pack shots are made.** `node scripts/extract-pack-shot.mjs <sheet.jpeg> <out.webp>`. Re-run it
> if a sheet is replaced; do not hand-crop.
>
> **Why it builds a silhouette instead of keying on colour.** Two earlier versions of this failed and the
> reasons are worth keeping:
>
> 1. *Feathering the crop edges* rather than removing anything, on the theory that dark smoke would melt
>    into a dark card. It did not — the green glow top-right and the purple down the left came through as
>    visible haze.
> 2. *Keying on colour.* The smoke is saturated (0.7–1.0) and the tube is neutral (0.00–0.18), which does
>    separate — but the tube's body is also BLACK, and so is much of the background around it, with no
>    luminance edge between them: down a column through the tube's top rim the values ramp smoothly from
>    dark purple through 0,0,0 into dark grey. Any rule dark enough to take that background takes the tube
>    with it. It went see-through and left the label floating.
>
> What works is marking the parts of the product that are NOT black — neutral greys, the bright label, the
> pre-roll's beige — taking the top and bottom of those in each column, and filling the span between. The
> tube's black body ends up inside that span and comes back opaque without ever being recognised on its own.
> A final pass clears smoke that got swept into the margins of the silhouette.
>
> **If you retune it, look at the output.** Every parameter in that script was set by looking at a render
> over both grey and the card's own #0b0b0c, and several plausible settings fail in ways the numbers do not
> show: too much head room admits the "GOOD FLOWERS GOOD PEOPLE" script, a blanket interior sweep punches
> holes through the skyline art, and an over-long run requirement clips the tube's top.

**Product data policy:** `src/data/products.ts` contains **only** SKUs evidenced publicly — Permanent Marker
(hybrid), Bubba Kush (indica) and Sour Diesel (sativa), each documented on SLAPPZ's own strain sheet.
Deliberately excluded: **price** (retailer-set and varies), **THC percentage** (batch-specific), and
**effects** (a compliance problem for a brand to assert). Strains are **not** attached to any retailer,
because per-retailer availability has not been verified. Do not populate `availableProducts` without a source.

> **The sheets carry an EFFECTS panel. It stays on the sheet.** Those are SLAPPZ's own words on SLAPPZ's own
> artwork, and that is where they are allowed to live. Typed into `products.ts` they would become the
> *site's* structured assertion about how a cannabis product makes you feel — which is the thing the policy
> above exists to prevent. Same for the strain-info paragraph.

> **Sour Diesel is sold out** as of 2026-09-25, per SLAPPZ. It is still listed, carrying `soldOut: true`, so
> the range reads correctly — but its card shows SOLD OUT, desaturates the pack shot, and drops the link to
> the locator rather than sending someone to search 25 shops for it. Clear the flag when it is back.

> **A 10-pack was removed on 2026-09-24.** It had been added on the strength of a retailer's menu listing.
> SLAPPZ confirmed they do not sell one, and SLAPPZ is the authoritative source for their own range — a
> retailer menu is evidence a SKU *might* exist, not that it does. Do not re-add it from a menu.

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

**SLAPPZ supplied 28 original photographs on 2026-09-25.** This section is no longer a
placeholder — the culture strip, the About page image and the wholesale proof strip are all
real SLAPPZ photography now.

| Asset | Source | Usage | Production ready |
| --- | --- | --- | --- |
| `slappz-midtown-night.webp` | **Supplied by SLAPPZ** | Homepage `WE'RE OUTSIDE` tile 01 | 🟢 Yes, 1100 × 1375, 71KB |
| `slappz-penn-station.webp` | **Supplied by SLAPPZ** | Homepage `WE'RE OUTSIDE` tile 02 | 🟢 Yes, 1100 × 1375, 183KB |
| `slappz-cannafamily-cab.webp` | **Supplied by SLAPPZ** | Homepage `WE'RE OUTSIDE` tile 03 | 🟢 Yes, 1100 × 1375, 174KB |
| `slappz-waterfront-table-wide.webp` | **Supplied by SLAPPZ** | `/about` — `OUT OF QUEENS` | 🟢 Yes, 1100 × 880, 155KB |
| `slappz-shelf-marble.webp` | **Supplied by SLAPPZ** | `/wholesale` — `WE SET IT UP IN YOUR SHOP` | 🟢 Yes, 1100 × 1375, 172KB |
| `slappz-shelf-woodroom.webp` | **Supplied by SLAPPZ** | `/wholesale` — same strip | 🟢 Yes, 1100 × 1375, 212KB |
| `slappz-shelf-blueroom.webp` | **Supplied by SLAPPZ** | `/wholesale` — same strip | 🟢 Yes, 1100 × 1375, 176KB |
| `slappz-stand.webp` | **Supplied by SLAPPZ** | On the bench — not currently placed | 🟢 Yes, 768 × 1024, 71KB |
| `wild-handball.webp`, `wild-marina.webp`, `wild-platform.webp` | **AI-generated** | **Retired.** Superseded by the real photographs above | ⚪ Unplaced — kept, not deleted |

### Where the originals live

The 28 originals are in **`/brand/source/lifestyle/`**, not in `/public`. They total ~17MB
and nothing references them, so serving them would ship 17MB of dead weight to every deploy.
`/brand` is documentation and is not served.

`scripts/prepare-lifestyle-photos.mjs` is the whole pipeline: it reads from
`/brand/source/lifestyle`, writes to `/public/brand/slappz/lifestyle`, and its `PICKS` array
records which original became which tile. **Re-run it rather than hand-editing an output**,
and add to `PICKS` rather than dropping a loose file into `/public`.

### The three rules these tiles follow

1. **Captions come off the frame.** A caption may only state what is legible in the
   photograph — a storefront sign, a subway entrance that names itself, a strain printed on
   the tube. Nothing is inferred about where or when a photo was taken. The About page's
   `OUT OF QUEENS` is the one caption that is about the BRAND rather than the frame, and it
   is SLAPPZ's documented home base, not a geotag.
2. **No retailer is named off a shelf shot.** The wholesale tiles show SLAPPZ set up inside
   licensed dispensaries, but the captions describe the setup, never the shop. Naming a
   retailer beside a photo would read as a claim about that retailer's current stock, which
   this site does not make (CLAUDE.md § RETAILER RULES). `slappz-cannafamily-cab.webp` is the
   exception and only because the storefront sign is legible *in the frame* — and
   Cannafamily is already a verified retailer in `src/data/retailers.ts`.
3. **People are not the subject.** The supplied set includes frames where staff, customers
   and members of the public are clearly identifiable. None of those were placed. The one
   crowd shot in use is cropped to its top 86% specifically to drop faces out of the frame.
   If SLAPPZ has permission from the people in the other shots, they can go in — that is
   SLAPPZ's call to make, not this repo's.

### Not used

The supplied set also contains promotional graphics rather than photographs (a rolling-tray
promo carrying IGNYTE branding, an illustrated yellow SSR, a logo-over-boat composite) and
two clean logo lockups. The graphics are busy and carry other parties' marks, so they are not
placed. The logo lockups are superseded by `/public/brand/slappz/logos/` — see § 1.

## 4. CAMPAIGN — `/public/brand/slappz/campaign/`

| Asset | Source | Usage | Production ready |
| --- | --- | --- | --- |
| `hero-ssr-el-night.webp` | **AI-generated** (Higgsfield, GPT Image 2.5) | Homepage hero + age-gate backdrop | 🟡 In use — generated, see note |
| `hero-queens-night.webp` | **AI-generated** (Recraft V4.1) | **Retired.** Superseded by the above | ⚪ Unplaced — kept, not deleted |
| `hero-loop.mp4` | **AI-generated** (Seedance 2.0) | **Retired.** Was generated from `hero-queens-night` | ⚪ Unplaced — kept, not deleted |
| Blacklight shark/jellyfish artwork | 📎 IG reference | Reference only | 📎 Reference only |
| Yellow-cab B2B graphic | 📎 IG reference | Future `/retailers` trade page | 🔴 Needed |
| 2-year anniversary graphic | 📎 IG reference | Reference only | 📎 Reference only |

> **`hero-ssr-el-night.webp` is generated imagery, not a photograph of anywhere real.** An
> outer-borough street under an elevated line at night: wet asphalt throwing acid-green and
> violet reflections, a train crossing the top with motion blur, and **SLAPPZ's yellow
> Chevrolet SSR** parked at the kerb, three-quarter rear. Generated on Higgsfield (GPT Image
> 2.5, 16:9, quality high, 2K) on 2026-09-25, job
> `cf2c9774-ac80-4181-947f-7f0113adec80`, prompted from SLAPPZ's own SSR graphic as the
> vehicle reference. Master of record: `/brand/source/generated/hero-ssr-el-night.webp`
> (2688 × 1520). Served copy optimised to 2400px via `scripts/optimize-brand-image.mjs`.
>
> **The SSR carries no SLAPPZ livery, and that is deliberate.** SLAPPZ's own SSR graphic has
> the wordmark across it; a generated vehicle wearing the real logo would be a fabricated
> SLAPPZ asset, which § NEVER forbids. The truck is recognisably theirs from the model and
> the colour without the site inventing branding for it.
>
> An earlier cab version of the same scene (job `97e12101-5392-463c-b444-e08f01441937`,
> master kept at `/brand/source/generated/hero-el-night.webp`) was live briefly before SLAPPZ
> asked for the SSR instead.
>
> **It clears the bar generated imagery has to clear here** (CLAUDE.md § NEVER): no text, no
> lettering, no logo, no packaging, no real retailer and no identifiable person — so it makes
> no claim on SLAPPZ's behalf. The prompt asked for a cab and an elevated line because the
> locator's subject *is* the city you are searching, and because the palette echoes SLAPPZ's
> own campaign graphics.
>
> **The left third of the frame is pure black in the source.** That is what lets the hero
> scrim be so much lighter than its predecessors: the headline sits on darkness the image
> itself provides rather than on a gradient painted over the top. If this asset is ever
> swapped, check that replacement before assuming the scrim still works.

> **A real photograph was tried in this slot first and rejected.** A cab's rear windshield
> carrying SLAPPZ's drip lettering, shot under an elevated line — real, on-brand, and wrong
> for a hero: it is a close-up, so at the hero's widest aspect it filled the frame with a
> giant wordmark that collided with the real logo the h1 renders over it. SLAPPZ asked for it
> to come off. The original is still
> `/brand/source/lifestyle/WhatsApp Image 2026-09-25 at 6.45.46 PM.jpeg` and the crop that
> was used is recorded in this file's history, so it is reproducible if wanted. It is a good
> photograph in a smaller slot — just not this one.

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

**25 licensed stores across 6 New York markets** — Queens (12), Brooklyn (5), Manhattan (3),
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
| **Terp Bros** | Not on the supplied list, but **retained** — Terp Bros publishes a dedicated SLAPPZ brand page, the strongest public evidence of any store here. Confirm before removing. |

### ✅ Questions closed on 2026-08-31

| Store | How it was settled |
| --- | --- |
| **Gaea's Garden** | SLAPPZ said Flushing and was right. An earlier build matched it to `Gaia Operations LLC` on Lefferts Blvd — the wrong business. Gaea's Garden holds a **microbusiness** licence (`OCM-MICR-24-000030`), which is why it never appeared in a retail-only registry query. Corrected to 134-24 Northern Blvd, Flushing. |
| **Emerald (2nd location)** | SLAPPZ said "Upper West Side", but the brand's only Manhattan store is the Upper **East** Side one at 1190 Lexington Ave — its own site and the registry agree, and no UWS Emerald exists. |
| **Kaya Bliss** | SLAPPZ said "Brooklyn Heights", but Kaya Bliss holds exactly one retail licence: 8412 3rd Ave, Bay Ridge. The Brooklyn Heights page on their site is a delivery service-area page, not a second store. |
| **Flynnstoned** | **Held out at SLAPPZ's instruction.** They run 12 licensed NY locations and it was not clear which stock SLAPPZ, so the Bay Ridge listing was removed rather than guessed at. Add back when SLAPPZ names the stores. |

### Stores with no menu link yet

`menuUrl` drives the SHOP STORE button and is only set where a real online menu was confirmed. **23 of
25 stores now have one.** The two that do not:

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
3. **The authoritative stockist list** with menu URLs — the single highest-value input to this product
4. Per-retailer product availability, if it can be verified
5. Permission status for the supplied photographs that show identifiable people — only
   SLAPPZ can say whether those are cleared to publish. Until then only the brand-forward
   frames are placed. See § 3.
6. **Real campaign or event photography wide enough to carry the homepage hero.** The hero is
   generated again, which is honest but is still a stand-in. What it needs is a WIDE frame with
   empty, dark space on one side for the headline — a street, a storefront at night, a table
   shot from far enough back. Close-ups cannot do this job, as § 4 records.

> Product photography is **closed** — SLAPPZ supplied the three strain sheets on 2026-09-25
> and the cards now run on pack shots cut from them. See § 2.
>
> Lifestyle photography is **closed** — SLAPPZ supplied 28 originals on 2026-09-25. The
> culture strip, the About page and the new wholesale proof strip all run on real
> photographs; the generated stand-ins are retired. See § 3.
