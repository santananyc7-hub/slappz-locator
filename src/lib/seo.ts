import { SITE_URL } from '@/lib/site';
import type { Product, Retailer } from '@/lib/types';

/**
 * Structured data builders.
 *
 * One module so every page describes SLAPPZ the same way and the shapes stay reviewable in
 * one place. Each returns a plain object; render it with `<JsonLd data={…} />`.
 *
 * THE RULE HERE IS THE SAME AS EVERYWHERE ELSE IN THIS REPO: never assert anything that is
 * not verified. Specifically absent, and absent on purpose:
 *
 *   - `aggregateRating` / `review` — SLAPPZ has no review corpus. Fabricating one is the
 *     single most common way a site earns a manual action.
 *   - `offers` / `price` / `availability` — prices are set per-retailer and change; this site
 *     has no feed. A stale price in schema is a lie a customer arrives holding.
 *   - `openingHoursSpecification` — hours are not on file for most stores.
 *
 * If a feed ever supplies those, add them here and nowhere else.
 */

const absolute = (path: string) => new URL(path, SITE_URL).toString();

/** The brand itself. Paired with the Organization below — Brand is the product mark, Organization is the company. */
export function brandLd(retailerCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    '@id': `${SITE_URL}/#brand`,
    name: 'SLAPPZ',
    alternateName: 'SLAPPZ HQ',
    slogan: 'The brand that SLAPPZ',
    description: `SLAPPZ is an NYC cannabis brand producing 1g pre-rolls, available at ${retailerCount} licensed New York dispensaries.`,
    url: SITE_URL,
    logo: absolute('/brand/slappz/logos/slappz-wordmark.png'),
    sameAs: ['https://www.instagram.com/slappz_hq/'],
    areaServed: { '@type': 'City', name: 'New York City' },
  };
}

/**
 * The company. `Organization` is what search engines use for the knowledge panel and for
 * associating the Instagram account with the site, which `Brand` alone does not do.
 */
export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'SLAPPZ HQ',
    url: SITE_URL,
    logo: absolute('/brand/slappz/logos/slappz-wordmark.png'),
    description:
      'SLAPPZ is a licensed New York cannabis brand out of Queens, producing 1g pre-rolls sold through licensed New York dispensaries.',
    sameAs: ['https://www.instagram.com/slappz_hq/'],
    areaServed: { '@type': 'State', name: 'New York' },
    // The B2B line SLAPPZ publishes itself. Not a consumer support number — labelled as sales.
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '+1-718-708-8430',
      areaServed: 'US',
      availableLanguage: 'English',
    },
  };
}

/**
 * One stocking retailer.
 *
 * `Store`, not `LocalBusiness`: these are third-party shops SLAPPZ does not own. `url` points
 * at our own page for the store rather than the retailer's site, because that is the page
 * this markup describes — the retailer's own site goes in `sameAs`.
 */
export function storeLd(retailer: Retailer) {
  const where = [retailer.neighborhood, retailer.borough ?? retailer.address.city]
    .filter(Boolean)
    .join(', ');

  return {
    '@type': 'Store',
    '@id': absolute(`/stores/${retailer.slug}#store`),
    name: retailer.name,
    description: `${retailer.name} in ${where} is a licensed New York dispensary carrying SLAPPZ.`,
    url: absolute(`/stores/${retailer.slug}`),
    address: {
      '@type': 'PostalAddress',
      streetAddress: retailer.address.street,
      addressLocality: retailer.address.city,
      addressRegion: retailer.address.state,
      postalCode: retailer.address.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: retailer.coordinates.latitude,
      longitude: retailer.coordinates.longitude,
    },
    ...(retailer.phone ? { telephone: retailer.phone } : {}),
    ...(retailer.website ? { sameAs: [retailer.website] } : {}),
  };
}

/** A store page's Store node, promoted to a standalone document with its brand relationship. */
export function storePageLd(retailer: Retailer) {
  return {
    '@context': 'https://schema.org',
    ...storeLd(retailer),
    brand: { '@id': `${SITE_URL}/#brand` },
  };
}

/**
 * The full directory as an ordered list.
 *
 * This is the one that earns the locations page its keep: it tells a crawler the page is a
 * directory of N specific, addressed, geocoded shops rather than a wall of text.
 */
export function storeListLd(retailers: Retailer[], name: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url: absolute(path),
    numberOfItems: retailers.length,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    itemListElement: retailers.map((retailer, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: storeLd(retailer),
    })),
  };
}

/**
 * The product range.
 *
 * No `offers` block — see the note at the top of this file. Without it these will not win a
 * product rich result, and that is the correct trade: SLAPPZ does not sell direct, so a price
 * here would be invented.
 */
export function productListLd(items: Product[], path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'SLAPPZ products',
    url: absolute(path),
    numberOfItems: items.length,
    itemListElement: items.map((product, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        ...(product.format ? { size: product.format } : {}),
        ...(product.image ? { image: absolute(product.image) } : {}),
        category: product.category ?? 'pre-roll',
        brand: { '@id': `${SITE_URL}/#brand` },
      },
    })),
  };
}

/**
 * FAQ rich result.
 *
 * Answers are passed as plain strings rather than derived from the rendered JSX: schema
 * answers must match what the page says, and stripping tags out of React nodes would silently
 * drift the moment someone edits the markup. Keeping both in one place makes the pairing
 * visible — see src/components/home/Faq.tsx.
 */
export function faqLd(faqs: { q: string; plain: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.plain },
    })),
  };
}

/** Trail for a subpage. Home is always the first crumb. */
export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}
