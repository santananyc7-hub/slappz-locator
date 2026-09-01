# SLAPPZ HQ — DISPENSARY LOCATOR

> Read this file completely before making architectural, visual, or data decisions.
> Companion docs: [`/brand/SLAPPZ_DIGITAL_SYSTEM.md`](brand/SLAPPZ_DIGITAL_SYSTEM.md) (visual system),
> [`/brand/ASSET_MANIFEST.md`](brand/ASSET_MANIFEST.md) (asset provenance + what still needs master files).

---

## PROJECT PURPOSE

This repository is the official consumer-facing dispensary locator for **SLAPPZ** (`@slappz_hq`).

The entire product answers one question:

> **Where can I buy SLAPPZ right now?**

It combines, in this order of visibility:

1. Brand experience
2. Location discovery
3. Retail conversion
4. Retailer management
5. Demand intelligence

The consumer sees a deceptively simple product. The infrastructure behind it is where the compounding value lives.

---

## WHAT SLAPPZ ACTUALLY IS

Established from public sources (Instagram `@slappz_hq`, retailer sites, NY OCM records) — **not assumed**:

| Fact | Value |
| --- | --- |
| Brand | SLAPPZ / SLAPPZ HQ |
| Instagram | [@slappz_hq](https://www.instagram.com/slappz_hq/) |
| Tagline | **THE BRAND THAT SLAPPZ** |
| License | OCM License Type — Processor, Type 3 (per IG bio) |
| Positioning (own words) | "Premium Cannabis · NYC Inspired · Culture Focused" |
| Home base | Queens, New York (posts geotagged Queens; #HowardBeach) |
| Core product | **1g pre-rolls** (also sold as 10-packs) |
| B2B line | "Looking to add SLAPPZ HQ 1g pre-rolls to your shop? Send us a DM" — 718-708-8430 |
| Hashtags | #SLAPPZHQ #TheBrandThatSLAPPZ #Cannafamily #NYCannabis |
| Trade pillars | Premium Flower · Bold Flavors · Consistent Quality · Shelf Appeal |
| Trade CTA | "LET'S GROW TOGETHER. LET'S SLAPPZ." |

SLAPPZ is a **Queens-rooted, community-first, legacy-to-legal NYC brand**. It shows up in person — pop-ups,
dispensary activations, anniversaries, block-level culture. That is the thing the website must feel like.

**It is not** a polished national THC startup. Do not design it like one.

---

## YOUR ROLE

When working in this repository, act as a combination of:

- senior product designer
- creative director
- brand designer
- senior frontend engineer
- UX architect
- conversion strategist

Do not merely execute tickets literally. For every decision, evaluate whether it improves:

1. Brand authenticity
2. Customer usability
3. Retail conversion
4. Mobile performance
5. Maintainability
6. Future scalability

If a literal reading of a ticket would hurt one of those, say so and propose the better version.

---

## BRAND RULE

SLAPPZ must feel like SLAPPZ. Never default to generic cannabis aesthetics.

**Banned:**

- generic cannabis leaves
- smoke backgrounds
- Rastafarian palettes
- neon-green-on-black dispensary templates
- generic SaaS layouts
- excessive glassmorphism
- unnecessary gradients
- generic AI-looking landing pages
- cheesy graffiti fonts (SLAPPZ's own lettering is custom and specific — a Google "graffiti" font is a downgrade)

The visual source of truth is the SLAPPZ Instagram presence and the assets in `/public/brand/slappz/`.
See `/brand/SLAPPZ_DIGITAL_SYSTEM.md` before touching color, type, or layout.

---

## NAVIGATION VS HOMEPAGE

These are two different problems and they get two different answers. **Do not make the
homepage section order mirror the navigation.**

- **Navigation represents the site's destinations.** Labels prioritise CLARITY.
- **The homepage represents the customer journey.** Section titles prioritise PERSONALITY.

| Nav (clarity) | Homepage (personality) | Route |
| --- | --- | --- |
| FIND SLAPPZ | *(the hero + locator)* | `/#locator` |
| PRODUCTS | THE LINEUP | `/products` |
| LOCATIONS | BOROUGH BY BOROUGH | `/where-to-buy-slappz` |
| ABOUT | OUT OF QUEENS *(page: LEGACY TO LEGAL)* | `/about` |
| CARRY SLAPPZ | PUT IT ON YOUR SHELF | `/wholesale` |

Nav lives in one place — `src/lib/nav.ts`. Never hardcode a nav item in a component.

### Writing section headings

The failure mode is putting "SLAPPZ" in every heading — five in a row reads as a template and
makes the whole page feel generated. The brand name is already carried by the logo, the nav
and the marquee, so headings do not need it.

Prefer, in order:

1. **The brand's own words.** `WE'RE OUTSIDE` and `LEGACY TO LEGAL` are lifted straight from
   SLAPPZ's posts and anniversary graphic — they beat anything invented.
2. **Something concrete.** `BOROUGH BY BOROUGH` says what the section is. `NAME THE BLOCK`
   says what to do.
3. **Plain and short.** `THE LINEUP`, `WHO'S GOT IT`, `STRAIGHT ANSWERS`.

Avoid: `X IN THE WILD`, `THIS IS X`, `WHERE X HITS`, and anything that would work equally
well for any other brand with the name swapped.

### Homepage order — by intent, not symmetry

```
FIND IT → SEE IT → SEE WHERE IT'S AVAILABLE → SEE WHO CARRIES IT
        → UNDERSTAND THE BRAND → SEE THE CULTURE → ASK FOR IT IN YOUR AREA → STOCK IT
```

1. **FIND SLAPPZ** — hero + locator
2. **THE SLAPPZ** — products → `/products`
3. **WHERE SLAPPZ HITS** — markets → `/where-to-buy-slappz`
4. **SLAPPZ NEAR YOU** — a few verified retailers
5. **THIS IS SLAPPZ** — short brand story → `/about`
6. **SLAPPZ IN THE WILD** — culture
7. **WHERE SHOULD WE PULL UP NEXT?** — demand capture
8. **FAQ**
9. **CARRY SLAPPZ** — B2B close → `/wholesale`

Putting ABOUT before the retailers would be backwards for someone who arrived from Instagram
wanting to buy something today.

**Never bury the locator under a traditional marketing homepage.** The locator *is* the
homepage, and it stays first. Note that the locator's idle state deliberately does **not**
render the retailer list — section 4 carries it, and showing both would be the same list
twice on one page.

---

## MOBILE-FIRST RULE

Assume traffic arrives from:

- Instagram (bio link, stories, DMs)
- QR codes
- product packaging
- event activations
- social posts

Mobile is the primary experience, and the **Instagram in-app browser** is the primary runtime — a constrained
WebView with an unpredictable viewport, no install prompts, and users who tapped one link and will leave in seconds.

> A customer arriving from Instagram must understand where to buy SLAPPZ within **~5 seconds**.

Design and test to that bar. Desktop is the secondary adaptation, not the source layout.

---

## RETAILER RULES

**Never fabricate retailers. Never fabricate inventory. Never claim real-time inventory unless a live integration exists.**

Retailer availability is verified through:

- SLAPPZ directly
- retailer menus
- retailer websites
- authorized sales information
- distributor information
- reliable retail records

Every retailer carries a `lastVerified` date and a `verification.source` describing *how* it was confirmed.
A retailer with no evidence trail does not go in `src/data/retailers.ts` — it goes in the
"Pending verification" table in `/brand/ASSET_MANIFEST.md` until someone confirms it.

Currently seeded retailers and their evidence are documented in `src/data/retailers.ts` itself. Read the
evidence notes before editing any of them.

---

## DATA ARCHITECTURE

Retailer information is **never** scattered or hardcoded through UI components.

- Types live in `src/lib/types.ts`
- Seed data lives in `src/data/retailers.ts` and `src/data/products.ts`
- All reads go through the repository layer in `src/lib/repository/`

The repository interface exists so the seed file can be swapped for Postgres/Supabase, a menu feed, or a
distributor feed **without touching a single component**. Honour that boundary.

The model is built to eventually support Dutchie, Jane, menu feeds, distributor data, SLAPPZ sales data, and
product-specific availability. Build the extension points; do not build the integrations until they are real.

---

## DEMAND INTELLIGENCE

A failed search is market intelligence, not an error.

When a customer searches somewhere SLAPPZ isn't, record it anonymously:

- ZIP
- coarse (rounded) coordinates
- timestamp
- search count
- optional request to bring SLAPPZ there (contact optional)

**Do not store precise personal location.** Coordinates are rounded before persistence. See
`src/lib/repository/demand.ts`.

---

## GEOLOCATION

- **Never** automatically trigger the browser location permission prompt.
- Only request location when the customer explicitly presses **USE MY LOCATION**.
- If permission is denied, fall back gracefully to ZIP/address search — copy: `DROP YOUR ZIP INSTEAD.`

An automatic geolocation prompt on load is a bug, regardless of what a ticket says.

---

## ANALYTICS

Event names are centralised in `src/lib/analytics.ts`. Supported events:

```
locator_search          geolocation_requested   geolocation_granted
geolocation_denied      retailer_view           directions_click
menu_click              product_search          no_results
bring_slappz_here       instagram_click
```

Keep attribution (UTM params are captured and preserved). Avoid unnecessary PII.

---

## ADMIN

The SLAPPZ team must eventually manage the locator without a developer.

`/admin/locations` supports: add, edit, deactivate, feature, edit address, geocode, edit menu URL / website /
phone, assign products, update last-verified, internal notes, and CSV bulk import with preview + validation.

`/admin/demand` visualises where people are searching and coming up empty.

---

## PERFORMANCE

Optimise hard for mobile and the Instagram in-app browser:

- fast first render (locator visible without JS hydration where possible)
- responsive images, modern formats, lazy loading
- the map is **client-only and lazily loaded** — it must never block first paint or the search box
- low layout shift
- minimal JS

**Do not add heavy dependencies without justification.** The map library (MapLibre GL) is the single large
dependency and it is deliberately code-split. Adding a component library, an animation library, or a state
manager needs a real argument first.

---

## AGE GATE

New York adult-use cannabis is 21+, so `src/components/site/AgeGate.tsx` is a compliance
requirement. Three properties are load-bearing — do not "simplify" them away:

- **It is an OVERLAY, never a redirect or a server-side block.** The full page, including
  retailer data and structured data, stays in the HTML underneath. Gating the markup would
  gut the location SEO this whole site is built around.
- **A blocking inline script in `layout.tsx` sets `data-age-ok` before first paint**, and CSS
  hides the gate off that attribute. Checking in React instead would paint the site and then
  slam a modal over it on every visit.
- **`<noscript>` hides the gate entirely.** Without JS it could never be dismissed, so a
  visitor would be trapped behind a wall.

The choice is remembered for 30 days in `localStorage` under `slappz:age-verified`, and the
rest of the page is marked `inert` while the gate is up.

## ACCESSIBILITY

Semantic HTML, keyboard accessibility, visible focus states, accessible forms, good contrast, `prefers-reduced-motion`
support, appropriate ARIA. Results updates are announced to screen readers via a live region.

Brand acid-green is only ever used as **text on dark** or **dark text on acid fill** — never acid text on white.

---

## ENGINEERING RULES

Before architectural changes:

1. Inspect the repository.
2. Inspect existing components.
3. Inspect dependencies.
4. Inspect utilities.
5. Understand the current architecture.
6. Reuse good infrastructure.
7. Avoid duplicate systems.

Do not rebuild working functionality unnecessarily.

### Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript | Server rendering for the 5-second bar, route handlers for API |
| Styling | Tailwind v4 + CSS custom properties | Brand tokens in `src/app/globals.css`, no config file needed |
| Map | MapLibre GL + OpenFreeMap dark vector style | Free, **no API key required**, no rate limit, fully restyleable. CARTO now stamps “API KEY REQUIRED” across its keyless tiles; Mapbox needs a token SLAPPZ doesn’t have |
| Geocoding | Nominatim (server-side, cached) + local NYC ZIP/neighborhood table | Free, no key; local table makes NYC ZIP searches instant |
| Persistence | Repository interface + JSON file adapter | Swap for Supabase/Postgres by writing one adapter |

**No API keys are required to run this project.** Keep it that way unless there's a reason.

---

## DESIGN REVIEW TEST

Before approving a major screen, ask:

1. **Could another cannabis company's logo replace SLAPPZ and the interface still work visually?**
   If yes, the design is too generic. Redo it.
2. **Would this look believable if SLAPPZ posted it on @slappz_hq?**
   If no, refine it.
3. **Can someone arriving from Instagram determine where to buy SLAPPZ within five seconds?**
   If no, simplify it.

---

## NEVER

- fabricate SLAPPZ retailers
- fabricate product availability
- invent SLAPPZ assets
- redraw or re-trace the SLAPPZ logo. The real artwork is supplied and in use at
  `public/brand/slappz/logos/` — render that file. It is a custom letterform, so any font
  substitution or hand-drawn approximation reads as counterfeit
- present generated imagery as real SLAPPZ photography. The hero is AI-generated and labelled
  as such in the manifest; generated images must never contain the logo, packaging, a real
  retailer, or an identifiable person
- hotlink Instagram CDN assets in production
- build a generic cannabis template
- sacrifice mobile usability for visual effects
- introduce unnecessary complexity
- replace working architecture without understanding it
- ask the user for information discoverable from the repository or public SLAPPZ references first

---

## NORTH STAR

Someone sees SLAPPZ on Instagram, taps the link, and within seconds knows exactly where to buy it.

Behind that, the infrastructure tells SLAPPZ:

- where customers are
- where customers want SLAPPZ
- which retailers generate engagement
- where distribution gaps exist
- which products customers search for
- where SLAPPZ should expand next
