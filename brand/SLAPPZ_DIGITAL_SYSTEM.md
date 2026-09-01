# SLAPPZ — DIGITAL VISUAL SYSTEM

**Source of truth:** [@slappz_hq](https://www.instagram.com/slappz_hq/) (295 posts, reviewed August 2026),
retailer sites, and NY OCM records.

**Method note — read this before trusting a number.** Everything below was observed across *multiple* public
posts, not extrapolated from one image. Where a value was measured by eye from a screenshot rather than taken
from a master file, it is marked **(sampled)**. Sampled values are good enough to build with and must be
confirmed against SLAPPZ's real brand files before anything goes to print. Nothing here is invented; where the
brand hasn't defined something, this document says so and makes a *recommendation* clearly labelled as such.

---

## 1. BRAND SNAPSHOT

| | |
| --- | --- |
| Name | SLAPPZ / SLAPPZ HQ |
| Tagline | **THE BRAND THAT SLAPPZ** |
| Self-description | "Premium Cannabis · NYC Inspired · Culture Focused" |
| Home | Queens, New York |
| License | OCM Processor, Type 3 |
| Product | 1g pre-rolls (singles and 10-packs) |
| Attitude | Legacy-to-legal, community-first, event-driven, unmistakably NYC |

The brand's own anniversary graphic states its four pillars as: **BUILT ON COMMUNITY · TRUSTED SINCE DAY 1 ·
LOYAL CUSTOMERS · LEGACY TO LEGAL.** That is the emotional spine of the identity — not "premium wellness."

---

## 2. LOGO SYSTEM

### Primary logo — the SLAPPZ wordmark

A **custom drawn letterform**. Characteristics observed consistently across posts, packaging, merch and vehicle wraps:

- All caps, `SLAPPZ`, set on a slight **upward-right italic incline** (roughly 8–12°)
- Heavy, rounded-but-angular strokes — closer to a **sign-painter / bubble-graffiti hybrid** than to any
  off-the-shelf font. The `S` and `Z` terminals are cut on sharp diagonals; the `A` has a flat apex.
- Fill in **acid green**, wrapped in a **hard black keyline**
- A solid **violet 3D extrude / block-shadow** dropping down-right behind the black keyline
- Often a second outer keyline in white or acid green when placed on busy photography

`HQ` is a **lockup element, not part of the wordmark**: smaller, set to the lower-right, tucked under the `PZ`,
rendered in violet with an acid-green keyline (an inversion of the main wordmark's color logic).

### Alternate treatments observed

| Treatment | Where seen | Notes |
| --- | --- | --- |
| Wordmark + `HQ` lockup on black | Profile avatar, campaign graphics | The default "logo" |
| Wordmark alone, acid on black | Pre-roll tube, merch | Drops `HQ` when space is tight |
| Wordmark in **taxi yellow** with black keyline | B2B / dispensary-outreach graphic (yellow cab wrap) | A deliberate NYC-cab colorway, used for trade communications |
| Wordmark in **white/chrome outline** | Neon-sign and event photography | Photographic, not a reproducible asset |
| Hand-lettered / caricature versions | Artist collabs (e.g. `@art_vila_`) | One-off, never use as the mark |

### Spacing and background

- The mark is essentially **always on black or on dark photography**. There is no observed light-background
  lockup. Until one exists, do not invent one — put the mark in a black container instead.
- Clear space observed is generous: roughly **the height of the `S`** on all sides.
- The violet extrude means the mark has an **optical center below and left of its bounding box** — center it
  optically, not mathematically.

### ✅ Logo status

**The real artwork is supplied and in use.** `SlappzWordmark` renders
`public/brand/slappz/logos/slappz-wordmark.png` — no font substitution, no redraw.

Two caveats, both handled in the component and documented in `ASSET_MANIFEST.md` § 1:

- the delivered file is an avatar export with the **Instagram story ring baked into the edges**, which is
  masked off with an ellipse matching the ring's inner boundary
- it is **opaque on near-black**, not transparent, so it is black-surfaces-only for now — which matches the
  brand's actual usage, since no light lockup exists

**Still needed from SLAPPZ:** a full-resolution `SVG` (the supplied PNG is 188×137, which caps display size),
a genuinely transparent ring-free export, and a square `S` icon for map pins and the favicon.

---

## 3. COLOR

Sampled from repeated appearances across packaging, campaign art, merch and signage.

### Primary

| Token | HEX | Notes |
| --- | --- | --- |
| **SLAPPZ Acid** | `#96E60B` **(sampled)** | The wordmark green. Yellow-leaning chartreuse, very high chroma. The single most identifying color. |
| **SLAPPZ Violet** | `#6E2BD9` **(sampled)** | The 3D extrude and `HQ`. Blue-leaning purple, *not* magenta. |
| **True Black** | `#000000` | Packaging is matte black; the feed is black. This is a real brand color, not just a background. |

### Secondary / accent

| Token | HEX | Notes |
| --- | --- | --- |
| **Neon Magenta** | `#FF2FA0` **(sampled)** | Recurs in event neon signage and blacklight campaign art. Accent only. |
| **Cab Yellow** | `#FFC20E` **(sampled)** | NYC taxi yellow. Used in trade/B2B graphics and the vehicle wrap. Reserve for "outside / on the move" moments. |

### Neutrals (digital, recommended)

| Token | HEX | Use |
| --- | --- | --- |
| Ink | `#000000` | Page ground |
| Surface | `#0B0B0C` | Cards, sheets |
| Surface raised | `#161618` | Hover / elevated |
| Hairline | `#26262A` | Borders, dividers |
| Muted text | `#8A8A93` | Meta, timestamps |
| Paper | `#FFFFFF` | Text on dark, and the rare inverted chip |

### Digital usage rules

- **Black is the default ground.** Not dark grey, not near-black gradients. Black.
- **Acid is an accent and an action color, never a wash.** Large acid fields turn the brand into the exact
  neon-green dispensary template the brand rules ban. Acid earns its impact by being rationed.
- **Acid + violet must touch.** The wordmark's whole idea is acid against violet. Any moment that wants to feel
  most-SLAPPZ (the primary CTA, the active map pin, the "SLAPPZ HERE" badge) should use both.
- **Contrast:** acid-on-black ≈ 14:1 and black-on-acid ≈ 14:1 — both pass AAA. **Acid on white fails.** Never
  do it. Violet-on-black is only ~3.5:1, so violet is for shape and shadow, not body text.
- Magenta and cab-yellow are **seasoning**. If more than one appears on a screen, cut one.

---

## 4. TYPOGRAPHY

### What SLAPPZ actually uses

- **Display:** the custom SLAPPZ letterform (logo only) plus, in campaign graphics, a **heavy condensed
  italic sans** for headlines like `ATTENTION DISPENSARY OWNERS, BUYERS & BUDTENDERS` and `WE'RE OUTSIDE TOMORROW!`.
  Set in **all caps, tight tracking, tight leading**, frequently with a keyline or drop shadow, and frequently
  with one word colored acid for emphasis inside an otherwise white sentence.
- **Secondary:** a **plain, wide-ish grotesque** for supporting lines (`THE BRAND THAT SLAPPZ`, event details,
  the four trade pillars) — often letterspaced *out* in small caps, the opposite of the headline treatment.
- **Body:** minimal. SLAPPZ writes in captions, not paragraphs.

The exact typefaces are **not publicly determinable** from Instagram raster graphics, and this document does
not guess at names.

### Web recommendation (clearly a recommendation, not the real typeface)

| Role | Recommended | Rationale |
| --- | --- | --- |
| Display / headline | **Archivo Expanded / Archivo Black**, italic-skewed via CSS | Free (OFL), variable, has the density and squared shoulders of the campaign headlines |
| UI / body | **Inter** | Neutral, ships with Next.js font pipeline, excellent at small sizes in WebViews |
| Numerics | Inter with `font-variant-numeric: tabular-nums` | Distances must not jitter as results update |

Implemented in `src/app/layout.tsx` via `next/font` (self-hosted, no external request).

### Styling rules

- Headlines: **ALL CAPS**, tracking `-0.02em` to `-0.04em`, leading `0.9–0.95`
- Labels/meta: **ALL CAPS**, tracking `+0.12em` to `+0.18em`, small (11–12px)
- Sentence case is reserved for genuine body copy and legal text
- Never set the SLAPPZ wordmark in a web font and call it the logo

---

## 5. GRAPHIC LANGUAGE

Recurring motifs, in rough order of how often they appear:

- **Blacklight / airbrush illustration.** The strongest and most distinctive motif. Deep violet grounds, acid
  and magenta glow, hand-airbrushed subjects — sharks, jellyfish, sea creatures, wings, crowns — rendered like
  a **1990s boardwalk airbrushed t-shirt or a blacklight poster**. Product tubes are composited into these
  scenes glowing.
- **NYC iconography, literal and specific.** Yellow cab, handball wall, Knicks references, Statue of Liberty,
  Howard Beach, marinas and boats, block parties. Not "urban" as a vibe — actual named Queens places.
- **Hard keylines and block shadows.** Almost every piece of type has an outline and an offset solid shadow.
  Nothing is soft. There are **no blurs and no glassmorphism** in the brand's own work.
- **Sticker/patch density.** Layered die-cut stickers, laptop-sticker collages, logo patches.
- **Photography over graphics.** Real event photos with type stamped over them, not stock.
- **Product cards:** the black tube shot on a dark or illustrated ground, lit from the side so the acid label
  glows. Product is never on a white studio sweep.

### What is *absent* (equally important)

No cannabis leaves as decoration. No smoke. No green/red/gold. No gradients-as-background. No frosted glass.
No rounded-corner SaaS cards floating on grey.

---

## 6. PHOTOGRAPHY

| Attribute | Observation |
| --- | --- |
| Lighting | Available light, mostly night or interior. Colored practicals (neon signs, LED walls) are a feature, not a problem to correct. |
| Grading | Contrasty, slightly crushed blacks, saturated. Not filtered or faded. |
| Composition | Candid, close, people-centric. Group shots, hands holding product, budtenders behind counters. |
| Cropping | Tight. Faces and product fill the frame. |
| Backgrounds | Real dispensaries, real streets, real boats. Never a studio. |
| Product | Held, in-hand, in-pocket, on a boat deck — in use. Rarely isolated. |
| Lifestyle | The people *are* the brand. Merch on real customers, not models. |

**Web treatment:** keep the grade as-is; do not add overlays beyond a black gradient scrim for text legibility.
Serve as AVIF/WebP, and never place acid-green text directly on an unscrimmed photo.

---

## 7. VOICE

Observed copy, verbatim:

- `THE BRAND THAT SLAPPZ`
- `WE'RE OUTSIDE TOMORROW!`
- `LET'S GROW TOGETHER. LET'S SLAPPZ.`
- `GOOD VIBES / GREAT PEOPLE / FIRE FLOWER`
- `Nothing beats seeing the community show love`
- `More events, more vibes, more SLAPPZ coming soon`
- `Premium Flower — Top quality.` / `Bold Flavors — Terps that hit.` / `Consistent Quality — Customers come back.`

### Rules derived from it

- **Headlines are short, capitalised, declarative.** Two to five words. Often a command or an announcement.
- **Body is warm and plain.** The brand thanks people constantly. It is not aloof or luxury-cold.
- **Slang is light and real** — "outside," "pull up," "slappz." It is used the way the people actually talk,
  sparingly and never explained.
- **The pun is used, but not milked.** "The brand that SLAPPZ" and "Let's SLAPPZ" exist; the brand does not
  build every sentence around it. **Do not caricature this.** One wordplay moment per screen, maximum.
- **No exclamation-mark stacking, no emoji soup in headlines**, though emoji appear naturally in captions.
- Never adopt corporate-wellness cannabis voice ("elevate your experience," "curated wellness journey").

### Locator-specific voice

| Moment | Copy |
| --- | --- |
| Primary heading | `FIND SLAPPZ` |
| Search placeholder | `ZIP, CITY, OR ADDRESS` |
| Primary CTA | `FIND SLAPPZ` |
| Secondary CTA | `USE MY LOCATION` |
| Geolocation denied | `DROP YOUR ZIP INSTEAD.` |
| Retailer badge | `SLAPPZ HERE` |
| Zero results | `DAMN. NOT THERE YET.` |
| Zero-results CTA | `TELL US WHERE TO PULL UP` → `BRING SLAPPZ HERE` |

---

## 8. DIGITAL APPLICATION

How the system translates to interface. These are binding for this repo.

### Map pins

- Default pin: black rounded-square tag with a **1.5px acid keyline** and the compact `S` mark in acid, sitting
  on a violet block-shadow — the logo's own construction logic, reduced to 28px.
- Active/selected: the fill inverts to acid, mark goes black, shadow stays violet, pin scales ~1.15×.
- The user's own location is a **violet dot with a soft violet halo** — deliberately *not* acid, so "you" never
  competes with "SLAPPZ is here."
- Basemap is OpenFreeMap’s dark vector style, further desaturated so pins are the only saturated thing on screen.

### Search form

- Full-width, 56px min height on mobile (thumb target), black field, hairline border that turns **acid on focus**.
- The submit button is the loudest thing on the page: **acid fill, black caps text, violet block-shadow offset
  4px down-right** — the wordmark's shadow logic as a button.
- `USE MY LOCATION` is a ghost button: transparent, hairline border, white caps. Clearly secondary.

### Buttons

| Level | Treatment |
| --- | --- |
| Primary | Acid fill, black text, violet offset shadow, square-ish (4px radius) |
| Secondary | Transparent, hairline border, white caps text |
| Tertiary / link | Acid text, underline on hover, no box |

Shadows are **hard offsets, never blurs.** Radii stay small (0–6px); this brand is not soft.

### Retailer cards

Black surface, hairline border, sharp corners. Name in condensed caps. Neighborhood + distance as
letterspaced acid meta. `SLAPPZ HERE` badge as a small acid chip with black text. Actions as a row of
bordered buttons. On hover/selection the left edge gets a 3px acid rule and the border lightens — the card
"lights up" rather than lifting.

### Product cards

Black ground, product image bled to the edges, name in caps, format as meta. Only rendered when availability is
verified — see the retailer rules in `CLAUDE.md`.

### Header

Minimal: wordmark left, `@SLAPPZ_HQ` right. No nav bar on mobile. It should read like a sticker on black.

### Mobile navigation

There is effectively none, by design. One screen, one job. A sticky bottom CTA appears on scroll
(`FIND SLAPPZ NEAR ME`, becoming `GET DIRECTIONS` once a retailer is selected).

### Alerts & empty states

Empty states are **branded moments, not errors**. Big caps headline, one line of plain body, one loud CTA. The
zero-results state is the most important screen in the product after the search itself — it is where demand
intelligence is captured.

### Admin UI

Same tokens, lower volume. Black ground, acid used *only* for primary actions and active states. Admin is a
tool, not a campaign: denser type, more grey, no illustration. It should still be obviously the same product.

### Animation

- Entrance: wordmark fades + rises 8px, once, 240ms.
- Map pins: 180ms scale on select. A short bounce on the nearest result only.
- Cards: 120ms border/background transition. No sliding, no stagger cascades.
- Everything respects `prefers-reduced-motion: reduce` by collapsing to opacity-only or nothing.

Motion is **snappy and mechanical** (`cubic-bezier(0.2, 0, 0, 1)`), matching the hard-edged graphic language.
Nothing floats, drifts, or eases slowly.
