'use client';

import Link from 'next/link';

import { BagIcon, NavIcon, PhoneIcon } from '@/components/brand/Icons';
import { directionsUrl, formatDistance, formatPhone } from '@/lib/geo';
import { track } from '@/lib/analytics';
import { useAttributedHref } from '@/lib/useAttributedHref';
import type { Retailer, RetailerResult } from '@/lib/types';

function isResult(r: Retailer | RetailerResult): r is RetailerResult {
  return typeof (r as RetailerResult).distanceMiles === 'number';
}

/**
 * Retailer card.
 *
 * Selection lights the card up (left acid rule + lifted border) rather than raising it on a
 * shadow — this brand has hard edges, nothing floats.
 *
 * SHOP STORE only renders when a verified `menuUrl` exists. CALL only when a phone exists.
 * Product chips only render for products actually confirmed at that store.
 */
export function RetailerCard({
  retailer,
  selected,
  onSelect,
  rank,
}: {
  retailer: Retailer | RetailerResult;
  selected?: boolean;
  onSelect?: (slug: string) => void;
  rank?: number;
}) {
  const distance = isResult(retailer) ? formatDistance(retailer.distanceMiles) : null;
  const phone = formatPhone(retailer.phone);
  const menuHref = useAttributedHref(retailer.menuUrl);

  return (
    <article
      onClick={() => onSelect?.(retailer.slug)}
      className={`group relative border-l-[3px] bg-surface p-4 transition-colors sm:p-5 ${
        selected
          ? 'border-l-acid bg-raised ring-1 ring-hairline-strong'
          : 'border-l-hairline hover:border-l-acid hover:bg-raised'
      } ${onSelect ? 'cursor-pointer' : ''}`}
      aria-current={selected ? 'true' : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="display text-[22px] text-paper sm:text-[26px]">
            {typeof rank === 'number' && (
              <span className="mr-2 text-muted tabular">{String(rank).padStart(2, '0')}</span>
            )}
            {retailer.name}
          </h3>

          <p className="meta mt-1.5 text-muted">
            {[retailer.neighborhood, retailer.borough ?? retailer.address.city]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>

        {distance && (
          <span className="meta tabular shrink-0 text-acid" aria-label={`${distance} away`}>
            {distance}
          </span>
        )}
      </div>

      <p className="mt-3 text-[13px] leading-snug text-muted">
        {retailer.address.street}, {retailer.address.city}, {retailer.address.state}{' '}
        {retailer.address.zip}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="meta inline-block bg-acid px-2 py-1 text-[10px] text-ink">
          SLAPPZ HERE
        </span>
        {retailer.featured && (
          <span className="meta inline-block border border-violet px-2 py-1 text-[10px] text-violet">
            FLAGSHIP
          </span>
        )}
        {retailer.lastVerified && (
          <span className="meta text-[10px] text-muted">
            VERIFIED {retailer.lastVerified.replaceAll('-', '.')}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={directionsUrl(retailer)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            track('directions_click', { retailer: retailer.slug, placement: 'card' });
          }}
          className="meta flex items-center gap-1.5 border border-hairline-strong px-3 py-2.5 text-paper transition-colors hover:border-acid hover:text-acid"
        >
          <NavIcon size={13} />
          DIRECTIONS
        </a>

        {menuHref && (
          <a
            href={menuHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              track('menu_click', { retailer: retailer.slug, placement: 'card' });
            }}
            className="meta flex items-center gap-1.5 border border-hairline-strong px-3 py-2.5 text-paper transition-colors hover:border-acid hover:text-acid"
          >
            <BagIcon size={13} />
            SHOP STORE
          </a>
        )}

        {phone && (
          <a
            href={`tel:${retailer.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="meta flex items-center gap-1.5 border border-hairline-strong px-3 py-2.5 text-paper transition-colors hover:border-acid hover:text-acid"
          >
            <PhoneIcon size={13} />
            CALL
          </a>
        )}

        <Link href={`/stores/${retailer.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="meta flex items-center px-1 py-2.5 text-muted underline underline-offset-4 transition-colors hover:text-acid"
        >
          DETAILS
        </Link>
      </div>
    </article>
  );
}
