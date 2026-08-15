import type { Metadata } from 'next';
import Link from 'next/link';

import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { PageHero } from '@/components/site/PageHero';
import { ArrowIcon } from '@/components/brand/Icons';
import { listActive } from '@/lib/repository/retailers';
import { buildMarkets } from '@/lib/markets';
import { formatPhone } from '@/lib/geo';

export const metadata: Metadata = {
  title: 'Where to Buy SLAPPZ — Licensed NYC Dispensaries',
  description:
    'Every licensed New York dispensary verified to carry SLAPPZ, grouped by borough and neighborhood. Get directions or search by ZIP.',
  alternates: { canonical: '/where-to-buy-slappz' },
};

export const dynamic = 'force-dynamic';

/**
 * LOCATIONS — the full directory.
 *
 * Nav calls this "LOCATIONS"; the page leads with the brand's own language. Grouped by
 * market with anchors matching the homepage's WHERE SLAPPZ HITS cards, so a click there
 * lands on the right group.
 */
export default async function WhereToBuyPage() {
  const retailers = await listActive();
  const markets = buildMarkets(retailers);

  return (
    <>
      <Header />
      <main>
        <PageHero
          kicker="LOCATIONS"
          title={
            <>
              BOROUGH BY <span className="text-acid">BOROUGH</span>
            </>
          }
          lead={`${retailers.length} verified licensed dispensaries across ${markets.length} New York ${
            markets.length === 1 ? 'market' : 'markets'
          }. Every one confirmed — nothing on this page is a guess.`}
        >
          <Link
            href="/#locator"
            className="display block-press block-shadow mt-7 inline-flex h-14 items-center gap-2 bg-acid px-6 text-[16px] text-ink"
          >
            SEARCH BY ZIP
            <ArrowIcon size={16} />
          </Link>
        </PageHero>

        {markets.map((market) => {
          const inMarket = retailers.filter(
            (r) => (r.borough ?? r.address.city) === market.name,
          );

          return (
            <section
              key={market.slug}
              id={market.slug}
              className="scroll-mt-20 border-b border-hairline px-4 py-10 sm:px-6 sm:py-14"
            >
              <div className="mx-auto max-w-[1400px]">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="display text-[34px] text-paper sm:text-[48px]">
                    {market.name}
                  </h2>
                  <p className="meta tabular text-acid">
                    {market.retailerCount} {market.retailerCount === 1 ? 'SHOP' : 'SHOPS'}
                  </p>
                </div>

                <p className="meta mt-2 text-muted">{market.neighborhoods.join(' · ')}</p>

                <ul className="mt-7 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {inMarket.map((retailer) => (
                    <li
                      key={retailer.id}
                      className="border-l-[3px] border-l-hairline bg-surface p-5 transition-colors hover:border-l-acid"
                    >
                      <Link href={`/stores/${retailer.slug}`} className="block">
                        <h3 className="display text-[24px] text-paper">{retailer.name}</h3>
                        <p className="meta mt-1.5 text-muted">{retailer.neighborhood}</p>
                        <p className="mt-3 text-[13px] leading-snug text-muted">
                          {retailer.address.street}
                          <br />
                          {retailer.address.city}, {retailer.address.state}{' '}
                          {retailer.address.zip}
                        </p>
                        {retailer.phone && (
                          <p className="mt-2 text-[13px] text-muted tabular">
                            {formatPhone(retailer.phone)}
                          </p>
                        )}
                        <p className="meta mt-4 flex items-center gap-1.5 text-acid">
                          VIEW STORE
                          <ArrowIcon size={12} />
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}

        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="display text-[30px] text-paper sm:text-[40px]">
              NOT SEEING YOUR AREA?
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted">
              This list only includes shops we have actually verified. If SLAPPZ hasn&apos;t
              landed near you yet, tell us where to pull up — naming a specific shop is the
              most useful thing you can do.
            </p>
            <Link
              href="/#pull-up"
              className="meta mt-6 inline-flex min-h-11 items-center gap-2 border border-hairline-strong px-5 text-paper transition-colors hover:border-acid hover:text-acid"
            >
              BRING SLAPPZ HERE
              <ArrowIcon size={13} />
            </Link>

            <p className="mt-8 border-t border-hairline pt-6 text-[12px] leading-relaxed text-muted">
              Listings are verified periodically and do not reflect real-time inventory. Stock
              and hours are set by each retailer — confirm before you travel. 21+ only.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
