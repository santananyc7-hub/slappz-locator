/**
 * Primary navigation.
 *
 * Navigation labels prioritise CLARITY. Homepage section titles prioritise PERSONALITY.
 * They are deliberately different, and the homepage order deliberately does NOT mirror this
 * list — nav represents the site's destinations, the homepage follows the customer journey.
 * See CLAUDE.md § NAVIGATION VS HOMEPAGE.
 *
 *   nav LOCATIONS  ->  homepage "WHERE SLAPPZ HITS"
 *   nav PRODUCTS   ->  homepage "THE SLAPPZ"
 *   nav ABOUT      ->  homepage "THIS IS SLAPPZ"
 */

export type NavItem = {
  label: string;
  href: string;
  /** The loud one. Rendered as the acid CTA rather than a plain link. */
  emphasis?: boolean;
};

export const NAV: NavItem[] = [
  // Anchors to the locator rather than routing to /find: the locator IS the homepage, so a
  // separate route would be a second copy of the most important screen on the site.
  // /find still exists as a redirect for QR codes and packaging — see next.config.ts.
  { label: 'FIND SLAPPZ', href: '/#locator' },
  { label: 'PRODUCTS', href: '/products' },
  { label: 'LOCATIONS', href: '/where-to-buy-slappz' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CARRY SLAPPZ', href: '/wholesale', emphasis: true },
];
