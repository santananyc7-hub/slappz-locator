'use client';

import { BagIcon, NavIcon, PhoneIcon } from '@/components/brand/Icons';
import { SlappzMark } from '@/components/brand/SlappzMark';
import { directionsUrl, formatDistance, formatPhone } from '@/lib/geo';
import { track } from '@/lib/analytics';
import { useAttributedHref } from '@/lib/useAttributedHref';
import type { RetailerResult } from '@/lib/types';

/**
 * THE ANSWER.
 *
 * This card is the whole product: a customer arriving from Instagram should be able to read
 * the shop name, how far it is, and tap DIRECTIONS without scrolling or thinking. Everything
 * else on the page is secondary to it, and it is styled accordingly — the only element that
 * gets both the acid border and the violet block-extrude.
 */
export function NearestCard({ retailer }: { retailer: RetailerResult }) {
  const phone = formatPhone(retailer.phone);
  const menuHref = useAttributedHref(retailer.menuUrl);

  return (
    <section
      className="block-shadow relative border border-acid bg-surface p-5 sm:p-7"
      aria-labelledby="nearest-name"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="meta text-acid">NEAREST SLAPPZ</p>
        <SlappzMark size={26} />
      </div>

      <h2 id="nearest-name" className="display mt-3 text-[38px] text-paper sm:text-[54px]">
        {retailer.name}
      </h2>

      <p className="meta mt-2 text-muted">
        {[retailer.neighborhood, retailer.borough ?? retailer.address.city]
          .filter(Boolean)
          .join(' · ')}
      </p>

      <p className="display mt-4 text-[30px] text-acid tabular sm:text-[38px]">
        {formatDistance(retailer.distanceMiles)}{' '}
        <span className="text-paper">AWAY</span>
      </p>

      <p className="mt-3 text-[13px] leading-snug text-muted">
        {retailer.address.street}, {retailer.address.city}, {retailer.address.state}{' '}
        {retailer.address.zip}
      </p>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <a
          href={directionsUrl(retailer)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('directions_click', { retailer: retailer.slug, placement: 'nearest' })}
          className="display block-press block-shadow-sm flex h-13 items-center justify-center gap-2 bg-acid px-6 py-3.5 text-[16px] text-ink"
        >
          <NavIcon size={16} />
          GET DIRECTIONS
        </a>

        {menuHref && (
          <a
            href={menuHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('menu_click', { retailer: retailer.slug, placement: 'nearest' })}
            className="display flex items-center justify-center gap-2 border border-hairline-strong px-6 py-3.5 text-[16px] text-paper transition-colors hover:border-acid hover:text-acid"
          >
            <BagIcon size={16} />
            SHOP STORE
          </a>
        )}

        {phone && (
          <a
            href={`tel:${retailer.phone}`}
            className="display flex items-center justify-center gap-2 border border-hairline-strong px-6 py-3.5 text-[16px] text-paper transition-colors hover:border-acid hover:text-acid sm:hidden"
          >
            <PhoneIcon size={16} />
            CALL
          </a>
        )}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-muted">
        Stock changes. Call ahead or check the store menu to confirm SLAPPZ is on the shelf
        today.
      </p>
    </section>
  );
}
