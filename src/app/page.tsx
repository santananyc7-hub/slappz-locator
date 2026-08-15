import type { Metadata } from 'next';

import { Header } from '@/components/site/Header';
import { Marquee } from '@/components/site/Marquee';
import { Footer } from '@/components/site/Footer';
import { LocatorRoot } from '@/components/locator/LocatorRoot';
import { Section } from '@/components/home/Section';
import { ProductCard } from '@/components/home/ProductCard';
import { WhereSlappzHits } from '@/components/home/WhereSlappzHits';
import { SlappzNearYou } from '@/components/home/SlappzNearYou';
import { ThisIsSlappz } from '@/components/home/ThisIsSlappz';
import { InTheWild } from '@/components/home/InTheWild';
import { Merch } from '@/components/home/Merch';
import { PullUpNext } from '@/components/home/PullUpNext';
import { Faq } from '@/components/home/Faq';
import { CarrySlappz } from '@/components/home/CarrySlappz';
import { geocode } from '@/lib/geocode';
import { listActive, nearest } from '@/lib/repository/retailers';
import { products } from '@/data/products';
import type { GeocodeResult, RetailerResult } from '@/lib/types';

export const metadata: Metadata = {
  title: 'FIND SLAPPZ — Where to Buy SLAPPZ in NYC',
  alternates: { canonical: '/' },
};

const MAX_RESULT_MILES = 25;

/**
 * The homepage is ordered by CUSTOMER JOURNEY, not by the navigation.
 *
 *   FIND IT  →  SEE IT  →  SEE WHERE IT'S AVAILABLE  →  SEE WHO CARRIES IT
 *            →  UNDERSTAND THE BRAND  →  SEE THE CULTURE  →  ASK FOR IT HERE  →  STOCK IT
 *
 * Mirroring the nav order would put ABOUT before the retailers, which is backwards for
 * someone who arrived from Instagram wanting to buy something today. See CLAUDE.md.
 *
 * A `?q=` param is resolved on the server so campaign links render real results in the
 * first response — no client round-trip, no spinner, still indexable.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.q ?? params.zip;
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? '';

  const allRetailers = await listActive();

  let initialOrigin: GeocodeResult | null = null;
  let initialResults: RetailerResult[] | null = null;
  let initialClosest: RetailerResult | null = null;
  let initialStatus: 'idle' | 'ok' | 'no-results' | 'unresolved' = 'idle';

  if (query) {
    initialOrigin = await geocode(query);

    if (!initialOrigin) {
      initialStatus = 'unresolved';
    } else {
      const ranked = await nearest({
        latitude: initialOrigin.latitude,
        longitude: initialOrigin.longitude,
      });
      const inRange = ranked.filter((r) => r.distanceMiles <= MAX_RESULT_MILES);

      if (inRange.length > 0) {
        initialResults = inRange.slice(0, 12);
        initialStatus = 'ok';
      } else {
        initialResults = [];
        initialClosest = ranked[0] ?? null;
        initialStatus = 'no-results';
      }
    }
  }

  return (
    <>
      <JsonLd retailerCount={allRetailers.length} />
      <Header />
      <Marquee />

      <main>
        {/* 1 — FIND IT */}
        <LocatorRoot
          allRetailers={allRetailers}
          initialQuery={query}
          initialResults={initialResults}
          initialOrigin={initialOrigin}
          initialClosest={initialClosest}
          initialStatus={initialStatus}
        />

        {/* 2 — SEE IT */}
        <Section
          kicker="PRODUCTS"
          title="THE LINEUP"
          lead="1g pre-rolls, singles and 10-packs. Pick the one you want, then find who has it."
          cta={{ label: 'VIEW ALL', href: '/products' }}
        >
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>

        {/* 3 — SEE WHERE IT'S AVAILABLE */}
        <WhereSlappzHits retailers={allRetailers} />

        {/* 4 — SEE WHO CARRIES IT */}
        <SlappzNearYou retailers={allRetailers} />

        {/* 5 — UNDERSTAND THE BRAND */}
        <ThisIsSlappz />

        {/* 6 — SEE THE CULTURE */}
        <InTheWild />

        {/* 6b — WEAR IT. Sits with the culture block rather than next to products: merch is
            brand depth, not part of the find-it/buy-it path, and shouldn't compete with it. */}
        <Merch />

        {/* 7 — ASK FOR IT HERE */}
        <div id="pull-up">
          <PullUpNext />
        </div>

        {/* 8 — ANSWER THE OBJECTIONS */}
        <Faq />

        {/* 9 — STOCK IT */}
        <CarrySlappz />
      </main>

      <Footer />
    </>
  );
}

/**
 * Structured data. Describes the brand and its licensed availability — not fabricated
 * ratings, prices, or inventory.
 */
function JsonLd({ retailerCount }: { retailerCount: number }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: 'SLAPPZ',
    alternateName: 'SLAPPZ HQ',
    slogan: 'The brand that SLAPPZ',
    description: `SLAPPZ is an NYC cannabis brand producing 1g pre-rolls, available at ${retailerCount} licensed New York dispensaries.`,
    sameAs: ['https://www.instagram.com/slappz_hq/'],
    areaServed: { '@type': 'City', name: 'New York City' },
  };

  return (
    <script
      type="application/ld+json"
      // Static, developer-authored object — no user input reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
