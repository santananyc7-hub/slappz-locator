import type { Product } from '@/lib/types';

/**
 * SLAPPZ PRODUCTS
 * ===============
 *
 * Only SKUs with public evidence. All three are documented on SLAPPZ's own strain sheets,
 * which is also where the pack shots are cut from — see /brand/ASSET_MANIFEST.md § 2.
 *
 * What is deliberately NOT here:
 *   - PRICE. Set by each retailer, varies by shop, and stale pricing on a brand site is
 *     worse than none.
 *   - THC PERCENTAGE. Batch-specific and measured by the retailer's supplier, not a fixed
 *     property of the SKU.
 *   - EFFECTS. Retailers list these; a brand asserting them is a compliance problem.
 *
 * Strain type is included because it is printed on the pack itself.
 *
 * The strain sheets carry an EFFECTS panel and a strain-info paragraph. Those are SLAPPZ's
 * own words on SLAPPZ's own artwork, and they are deliberately NOT lifted into this data:
 * the moment they are typed in here they become the SITE's structured assertion about how a
 * cannabis product makes you feel, which is the compliance problem the rule above describes.
 *
 * Do NOT add strains from generic cannabis databases — a strain existing in the world is
 * not evidence that SLAPPZ sells it. See CLAUDE.md § RETAILER RULES.
 *
 * There is NO 10-pack. One was listed here on the strength of a retailer's menu; SLAPPZ has
 * since confirmed they do not sell one, and SLAPPZ is the authoritative source for their own
 * range. A retailer listing is evidence a SKU might exist, not that it does — do not add it
 * back from a menu.
 */
export const products: Product[] = [
  {
    id: 'prd_perm_marker_1g',
    slug: 'perm-marker-1g',
    name: 'Perm Marker',
    category: 'pre-roll',
    format: '1g',
    strainType: 'HYBRID',
    image: '/brand/slappz/product/slappz-perm-marker-1g.webp',
    tagline: 'One full gram, rolled and ready.',
    verified: true,
  },
  {
    id: 'prd_bubba_kush_1g',
    slug: 'bubba-kush-1g',
    name: 'Bubba Kush',
    category: 'pre-roll',
    format: '1g',
    strainType: 'INDICA',
    image: '/brand/slappz/product/slappz-bubba-kush-1g.webp',
    tagline: 'The one off the campaign art. Same gram, heavier lean.',
    verified: true,
  },
  {
    id: 'prd_sour_diesel_1g',
    slug: 'sour-diesel-1g',
    name: 'Sour Diesel',
    category: 'pre-roll',
    format: '1g',
    strainType: 'SATIVA',
    image: '/brand/slappz/product/slappz-sour-diesel-1g.webp',
    tagline: 'The legacy sativa. Same gram, other end of the range.',
    // SLAPPZ says this one is out. Kept listed rather than deleted so the range still reads
    // correctly and so it comes back by flipping one flag — but the card will not send
    // anyone to the locator hunting for it. Remove this line when it is back in production.
    soldOut: true,
    verified: true,
  },
];

export const productBySlug = new Map(products.map((p) => [p.slug, p]));
