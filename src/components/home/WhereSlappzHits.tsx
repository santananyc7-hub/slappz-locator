import Link from 'next/link';

import { Section } from './Section';
import { PinIcon } from '@/components/brand/Icons';
import { buildMarkets } from '@/lib/markets';
import type { Retailer } from '@/lib/types';

/**
 * WHERE SLAPPZ HITS — geographic discovery.
 *
 * Nav calls this "LOCATIONS" for clarity; the page gets the brand's language. Markets are
 * derived from verified retailers, so this can never claim a borough SLAPPZ hasn't reached.
 */
export function WhereSlappzHits({ retailers }: { retailers: Retailer[] }) {
  const markets = buildMarkets(retailers);

  return (
    <Section
      id="where-slappz-hits"
      kicker="LOCATIONS"
      title="BOROUGH BY BOROUGH"
      lead="Where it's landed so far. New York only — when that changes, this list changes with it."
      cta={{ label: 'VIEW ALL LOCATIONS', href: '/where-to-buy-slappz' }}
    >
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {markets.map((market) => (
          <Link
            key={market.slug}
            href={`/where-to-buy-slappz#${market.slug}`}
            className="group flex flex-col justify-between border border-hairline bg-surface p-5 transition-colors hover:border-acid sm:min-h-[190px]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="display text-[30px] text-paper transition-colors group-hover:text-acid sm:text-[36px]">
                {market.name}
              </h3>
              <PinIcon size={18} className="mt-1 shrink-0 text-violet" />
            </div>

            <div className="mt-6">
              <p className="text-[13px] leading-relaxed text-muted">
                {market.neighborhoods.join(' · ')}
              </p>
              <p className="meta tabular mt-3 text-acid">
                {market.retailerCount} {market.retailerCount === 1 ? 'SHOP' : 'SHOPS'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
