'use client';

import Link from 'next/link';

import { Section } from './Section';
import { BagIcon, NavIcon } from '@/components/brand/Icons';
import { directionsUrl } from '@/lib/geo';
import { track } from '@/lib/analytics';
import { useAttributedHref } from '@/lib/useAttributedHref';
import type { Retailer } from '@/lib/types';

/**
 * SLAPPZ NEAR YOU — a short, curated set of verified shops.
 *
 * Deliberately NOT another directory: it shows a handful, leads with the flagship
 * relationships, and every route out of it points back at the locator or at a specific
 * store. The full list lives at /where-to-buy-slappz.
 */
export function SlappzNearYou({ retailers }: { retailers: Retailer[] }) {
  // Flagships first, then whatever else is verified. Capped — this is a taste of the list.
  const featured = [...retailers]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 3);

  return (
    <Section
      kicker="VERIFIED RETAILERS"
      title="WHO'S GOT IT"
      lead="A few of the shops keeping it on the shelf. Drop your ZIP in the locator above for the ones closest to you."
      cta={{ label: 'SEARCH BY ZIP', href: '/#locator' }}
    >
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((retailer) => (
          <ShopCard key={retailer.id} retailer={retailer} />
        ))}
      </div>
    </Section>
  );
}

function ShopCard({ retailer }: { retailer: Retailer }) {
  const menuHref = useAttributedHref(retailer.menuUrl);

  return (
    <article className="flex flex-col justify-between border-l-[3px] border-l-hairline bg-surface p-5 transition-colors hover:border-l-acid">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="display text-[26px] text-paper">{retailer.name}</h3>
          {retailer.featured && (
            <span className="meta shrink-0 border border-violet px-2 py-1 text-[9px] text-violet">
              FLAGSHIP
            </span>
          )}
        </div>

        <p className="meta mt-2 text-muted">
          {[retailer.neighborhood, retailer.borough ?? retailer.address.city]
            .filter(Boolean)
            .join(' · ')}
        </p>

        <p className="mt-3 text-[13px] leading-snug text-muted">
          {retailer.address.street}, {retailer.address.city}, {retailer.address.state}{' '}
          {retailer.address.zip}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={directionsUrl(retailer)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('directions_click', { retailer: retailer.slug, placement: 'home-near-you' })}
          className="meta flex min-h-11 items-center gap-1.5 border border-hairline-strong px-3 text-paper transition-colors hover:border-acid hover:text-acid"
        >
          <NavIcon size={13} />
          DIRECTIONS
        </a>

        {menuHref && (
          <a
            href={menuHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('menu_click', { retailer: retailer.slug, placement: 'home-near-you' })}
            className="meta flex min-h-11 items-center gap-1.5 border border-hairline-strong px-3 text-paper transition-colors hover:border-acid hover:text-acid"
          >
            <BagIcon size={13} />
            SHOP
          </a>
        )}

        <Link
          href={`/stores/${retailer.slug}`}
          className="meta flex min-h-11 items-center px-1 text-muted underline underline-offset-4 transition-colors hover:text-acid"
        >
          DETAILS
        </Link>
      </div>
    </article>
  );
}
