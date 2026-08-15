'use client';

import { useEffect } from 'react';

import { BagIcon, NavIcon, PhoneIcon } from '@/components/brand/Icons';
import { directionsUrl } from '@/lib/geo';
import { track } from '@/lib/analytics';
import { useAttributedHref } from '@/lib/useAttributedHref';
import type { Retailer } from '@/lib/types';

/**
 * Client island for the store page — the page itself stays a server component so it renders
 * instantly from a QR code or packaging scan. This handles only the tracked actions.
 */
export function StoreActions({ retailer }: { retailer: Retailer }) {
  const menuHref = useAttributedHref(retailer.menuUrl);

  useEffect(() => {
    track('retailer_view', { retailer: retailer.slug, placement: 'store-page' });
  }, [retailer.slug]);

  return (
    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
      <a
        href={directionsUrl(retailer)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('directions_click', { retailer: retailer.slug, placement: 'store-page' })}
        className="display block-press block-shadow-sm flex items-center justify-center gap-2 bg-acid px-6 py-3.5 text-[16px] text-ink"
      >
        <NavIcon size={16} />
        GET DIRECTIONS
      </a>

      {menuHref && (
        <a
          href={menuHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('menu_click', { retailer: retailer.slug, placement: 'store-page' })}
          className="display flex items-center justify-center gap-2 border border-hairline-strong px-6 py-3.5 text-[16px] text-paper transition-colors hover:border-acid hover:text-acid"
        >
          <BagIcon size={16} />
          SHOP STORE
        </a>
      )}

      {retailer.phone && (
        <a
          href={`tel:${retailer.phone}`}
          className="display flex items-center justify-center gap-2 border border-hairline-strong px-6 py-3.5 text-[16px] text-paper transition-colors hover:border-acid hover:text-acid"
        >
          <PhoneIcon size={16} />
          CALL
        </a>
      )}
    </div>
  );
}
