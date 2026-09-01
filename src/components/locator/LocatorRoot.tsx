'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { SlappzWordmark } from '@/components/brand/SlappzWordmark';
import { CheckIcon } from '@/components/brand/Icons';
import { HeroVideo } from './HeroVideo';
import { NearestCard } from './NearestCard';
import { RetailerCard } from './RetailerCard';
import { SearchPanel } from './SearchPanel';
import { StickyCta } from './StickyCta';
import { ZeroResults } from './ZeroResults';
import { track } from '@/lib/analytics';
import type { Coordinates, GeocodeResult, Retailer, RetailerResult } from '@/lib/types';

/**
 * MapLibre is the only heavy dependency in the project. Loading it client-side after first
 * paint keeps the search box interactive immediately, which is the whole point on a phone
 * inside the Instagram browser.
 */
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="grain h-full w-full bg-surface" aria-hidden="true">
      <div className="flex h-full items-center justify-center">
        <span className="meta text-muted">LOADING MAP…</span>
      </div>
    </div>
  ),
});

type Status = 'idle' | 'searching' | 'ok' | 'no-results' | 'unresolved' | 'error';

type SearchResponse = {
  status: 'ok' | 'no-results' | 'unresolved';
  origin?: GeocodeResult;
  results: RetailerResult[];
  closest?: RetailerResult | null;
};

export function LocatorRoot({
  allRetailers,
  initialQuery = '',
  initialResults = null,
  initialOrigin = null,
  initialStatus = 'idle',
  initialClosest = null,
}: {
  /** Every active retailer, rendered before any search so the page answers the question on arrival. */
  allRetailers: Retailer[];
  initialQuery?: string;
  initialResults?: RetailerResult[] | null;
  initialOrigin?: GeocodeResult | null;
  initialStatus?: Status;
  initialClosest?: RetailerResult | null;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [results, setResults] = useState<RetailerResult[] | null>(initialResults);
  const [origin, setOrigin] = useState<GeocodeResult | null>(initialOrigin);
  const [closest, setClosest] = useState<RetailerResult | null>(initialClosest);
  const [selected, setSelected] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);

  // Featured first when nothing has been searched yet; distance order once it has.
  const listed: (Retailer | RetailerResult)[] =
    results ??
    [...allRetailers].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  const nearest = results?.[0] ?? null;
  const rest = results ? results.slice(1) : listed;

  const run = useCallback(
    async (params: URLSearchParams, meta: { query?: string; method: 'text' | 'device' }) => {
      const id = ++requestId.current;
      setStatus('searching');
      setGeoError(null);

      try {
        const res = await fetch(`/api/search?${params.toString()}`);
        if (!res.ok) throw new Error('search failed');

        const data = (await res.json()) as SearchResponse;
        if (id !== requestId.current) return; // a newer search already landed

        setOrigin(data.origin ?? null);
        setClosest(data.closest ?? null);
        setSelected(null);

        if (data.status === 'unresolved') {
          setResults(null);
          setStatus('unresolved');
          track('no_results', { reason: 'unresolved', query: meta.query });
          return;
        }

        if (data.status === 'no-results') {
          setResults([]);
          setStatus('no-results');
          track('no_results', {
            reason: 'out-of-range',
            query: meta.query,
            zip: data.origin?.zip,
          });
          return;
        }

        setResults(data.results);
        setStatus('ok');
        track('locator_search', {
          method: meta.method,
          query: meta.query,
          zip: data.origin?.zip,
          result_count: data.results.length,
        });
      } catch {
        if (id !== requestId.current) return;
        setStatus('error');
      }
    },
    [],
  );

  const search = useCallback(
    (value: string) => {
      const q = value.trim();
      if (!q) return;
      void run(new URLSearchParams({ q }), { query: q, method: 'text' });
    },
    [run],
  );

  /**
   * USE MY LOCATION.
   *
   * This is the ONLY path that touches the Geolocation API. It never runs on mount — see
   * CLAUDE.md § GEOLOCATION. A denial falls back to ZIP entry with the brand's own copy.
   */
  const useMyLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeoError('DROP YOUR ZIP INSTEAD.');
      return;
    }

    setLocating(true);
    setGeoError(null);
    track('geolocation_requested');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        track('geolocation_granted');
        setQuery('');
        void run(
          new URLSearchParams({
            lat: String(position.coords.latitude),
            lon: String(position.coords.longitude),
          }),
          { method: 'device' },
        );
      },
      (err) => {
        setLocating(false);
        track('geolocation_denied', { code: err.code });
        setGeoError('DROP YOUR ZIP INSTEAD.');
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
    );
  }, [run]);

  // Scroll results into view after a search that came from user input, not on first paint.
  const hasSearched = status === 'ok' || status === 'no-results' || status === 'unresolved';
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (hasSearched) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hasSearched, status]);

  const onSelect = useCallback((slug: string) => {
    setSelected(slug);
    track('retailer_view', { retailer: slug, placement: 'locator' });
  }, []);

  /**
   * Memoised on the coordinates themselves, not on `origin`.
   *
   * This used to build a fresh object literal on every render, and MapView keys its "frame
   * the map" effect on it — so every render re-ran fitBounds and yanked the camera back to
   * the whole result set. It fought the ease that centres a selected shop, and it clipped the
   * detail card by resetting the view out from under it. A new object that is deeply equal to
   * the last one is still a changed dependency.
   *
   * Keyed on `origin` itself, which is state and therefore only changes when a search
   * actually sets it — exactly when the map SHOULD reframe.
   */
  const mapOrigin: Coordinates | null = useMemo(
    () => (origin ? { latitude: origin.latitude, longitude: origin.longitude } : null),
    [origin],
  );

  const mapRetailers = results && results.length > 0 ? results : allRetailers;

  /**
   * Hero proof points, derived from the retailer data rather than written by hand — so they
   * stay true as the list grows and can never overstate coverage.
   */
  const markets = [
    ...new Set(allRetailers.map((r) => r.borough ?? r.address.city)),
  ];
  const lastVerified = allRetailers
    .map((r) => r.lastVerified)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);

  const trustPoints = [
    `${allRetailers.length} LICENSED SHOPS`,
    markets.join(' · ').toUpperCase(),
    lastVerified ? `VERIFIED ${lastVerified.replaceAll('-', '.')}` : 'VERIFIED LISTINGS',
  ];

  return (
    <div id="locator">
      {/* ---------------------------------------------------------------- HERO */}
      <section
        id="locator-hero"
        className="grain isolate overflow-hidden border-b border-hairline px-4 pt-9 pb-8 sm:px-6 sm:pt-14 sm:pb-11 lg:pt-12 lg:pb-10"
      >
        {/* Queens at night — the city you're actually searching. Sits behind the headline;
            the source frame is deliberately dark on the left so the type stays legible
            without leaning on a heavy overlay. */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/brand/slappz/campaign/hero-queens-night.webp"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_center] lg:object-center"
          />

          {/* Ambient loop on top of the still. Desktop only, never on reduced-motion — see
              HeroVideo. Poster is the same still, so the handover is invisible. */}
          <HeroVideo poster="/brand/slappz/campaign/hero-queens-night.webp" />
          {/* Scrim: hard on the left where the type sits, fading to black at the bottom so
              the hero meets the results section with no visible seam.

              Two variants, because object-cover crops the source's dark left third away on
              a narrow viewport — the headline would otherwise sit straight on the neon. */}
          <div
            className="absolute inset-0 lg:hidden"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.7) 42%, rgba(0,0,0,0.86) 72%, #000 100%)',
            }}
          />
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              background:
                'linear-gradient(to right, #000 0%, rgba(0,0,0,0.92) 26%, rgba(0,0,0,0.62) 55%, rgba(0,0,0,0.5) 100%), linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 45%, #000 100%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-[1400px]">
          {/* "SLAPPZ" is the REAL logo artwork, not type. Setting the brand name in a web
              font next to a custom-drawn mark always reads as an imitation of it — using the
              actual lockup is both more correct and a stronger brand signal.

              The heading is built from exactly two pieces, each contributing one word: the
              text "FIND", and the mark's alt text "SLAPPZ". An earlier version added a
              third — an sr-only "Find SLAPPZ" with the rest hidden — which made the h1 of
              the most important page on the site read "Find SLAPPZFIND" to anything
              crawling text content. Do not reintroduce a hidden duplicate here: the visible
              word and the alt already say it once each. */}
          <h1 className="rise">
            <span className="display block text-[64px] leading-[0.85] text-paper sm:text-[92px] lg:text-[80px]">
              FIND
            </span>
            <SlappzWordmark size="hero" alt="SLAPPZ" className="mt-2 sm:mt-3" />
          </h1>

          <p className="meta rise rise-1 mt-4 max-w-lg text-muted">
            Licensed New York dispensaries carrying SLAPPZ. Nearest first.
          </p>

          <div className="rise rise-2 mt-7 max-w-3xl">
            <SearchPanel
              query={query}
              onQueryChange={setQuery}
              onSearch={search}
              onUseLocation={useMyLocation}
              busy={status === 'searching'}
              locating={locating}
              geoError={geoError}
            />
          </div>

          {origin && status === 'ok' && (
            <p className="meta mt-4 text-muted" role="status">
              SHOWING SPOTS NEAR <span className="text-acid">{origin.label}</span>
            </p>
          )}

          {/*
            Trust strip. Every hero-section framework puts proof directly under the CTA —
            usually a star rating. SLAPPZ has no review corpus, and inventing one on a
            cannabis brand's site is not a trade-off worth making, so this carries the proof
            that IS real and verifiable: licensed shops, markets covered, last verified.
            All three are derived from the retailer data, so they can never drift.
          */}
          <ul className="rise rise-3 mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            {trustPoints.map((point) => (
              <li key={point} className="meta flex items-center gap-1.5 text-muted">
                <CheckIcon size={13} className="text-acid" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------- RESULTS + MAP SPLIT */}
      <div ref={resultsRef} className="mx-auto max-w-[1400px] scroll-mt-16">
        {/* Screen-reader announcement for every state change */}
        <p className="sr-only" role="status" aria-live="polite">
          {status === 'searching' && 'Searching for SLAPPZ retailers.'}
          {status === 'ok' &&
            `${results?.length ?? 0} SLAPPZ retailers found near ${origin?.label ?? 'you'}.`}
          {status === 'no-results' && 'No SLAPPZ retailers found nearby.'}
          {status === 'unresolved' && 'That location could not be found.'}
          {status === 'error' && 'Search failed.'}
        </p>

        {status === 'unresolved' && (
          <div className="border-b border-hairline px-4 py-8 sm:px-6">
            <p className="display text-[28px] text-paper">
              COULDN&apos;T FIND <span className="text-magenta">{query}</span>
            </p>
            <p className="mt-2 text-[14px] text-muted">
              Try a 5-digit ZIP, a neighborhood, or a full street address.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="border-b border-hairline px-4 py-8 sm:px-6">
            <p className="display text-[28px] text-paper">SOMETHING BROKE.</p>
            <p className="mt-2 text-[14px] text-muted">
              Try that search again in a second.
            </p>
          </div>
        )}

        {status === 'no-results' ? (
          <div className="px-4 py-8 sm:px-6">
            <ZeroResults origin={origin} closest={closest} />
          </div>
        ) : (
          /* Three blocks, ordered differently per breakpoint.
             Mobile stacks them in the order the customer needs them — the answer, then
             where it is, then the alternatives. Desktop pins the map down the right-hand
             column across both rows.

             Before a search there is no list and no nearest card, so the split would leave
             an empty half — the map goes full-bleed instead. */
          <div className={results ? 'grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]' : ''}>
            {/* --- 1. The answer --- */}
            {nearest && (
              <div className="order-1 px-4 pt-8 sm:px-6 lg:pt-10">
                <NearestCard retailer={nearest} />
              </div>
            )}

            {/* --- 2. Map --- */}
            <div
              className={
                results
                  ? 'order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:border-l lg:border-hairline'
                  : 'order-2'
              }
            >
              <div
                className={
                  results
                    ? 'sticky top-14 my-8 h-[40vh] min-h-[280px] border-y border-hairline sm:top-16 lg:my-0 lg:h-[calc(100dvh-4rem)] lg:border-y-0'
                    : 'h-[46vh] min-h-[300px] border-b border-hairline lg:h-[54vh]'
                }
              >
                <MapView
                  retailers={mapRetailers}
                  origin={mapOrigin}
                  selectedSlug={selected}
                  onSelect={onSelect}
                />
              </div>
            </div>

            {/* --- 3. Everything else nearby ---
                Only rendered once a search has run. Before that, the homepage's own
                "SLAPPZ NEAR YOU" section carries the retailer list — showing the full
                directory here as well would just be the same list twice on one page. */}
            <div
              className={`order-3 px-4 pb-8 sm:px-6 lg:col-start-1 lg:pb-10 ${
                results ? 'pt-8' : 'hidden'
              }`}
            >
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="display text-[24px] text-paper sm:text-[30px]">MORE NEARBY</h2>
                <span className="meta tabular text-muted">
                  {rest.length} {rest.length === 1 ? 'SHOP' : 'SHOPS'}
                </span>
              </div>

              {rest.length === 0 ? (
                <p className="text-[14px] text-muted">
                  That&apos;s the only spot in range right now.
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {rest.map((retailer, i) => (
                    <RetailerCard
                      key={retailer.slug}
                      retailer={retailer}
                      rank={results ? i + 2 : i + 1}
                      selected={selected === retailer.slug}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              )}

              <p className="mt-6 text-[11px] leading-relaxed text-muted">
                Availability is verified periodically, not in real time. Confirm with the shop
                before you travel.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* The sticky bar points at whatever the customer is most likely to act on next:
          an explicitly selected shop, otherwise the nearest one. */}
      <StickyCta
        target={
          (selected ? listed.find((r) => r.slug === selected) : null) ?? nearest ?? null
        }
      />
    </div>
  );
}
