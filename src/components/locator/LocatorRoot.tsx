'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { SlappzWordmark } from '@/components/brand/SlappzWordmark';
import { CheckIcon } from '@/components/brand/Icons';
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
      setGeoError('Enter your ZIP instead.');
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
        setGeoError('Enter your ZIP instead.');
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
  const trustPoints = [
    `${allRetailers.length} LICENSED SHOPS`,
    markets.join(' · ').toUpperCase(),
  ];

  return (
    <div id="locator">
      {/* ---------------------------------------------------------------- HERO */}
      <section
        id="locator-hero"
        className="grain isolate overflow-hidden border-b border-hairline px-4 pt-9 pb-8 sm:px-6 sm:pt-14 sm:pb-11 lg:pt-12 lg:pb-10"
      >
        {/* Generated atmosphere, NOT a photograph of anywhere real — an outer-borough
            street under an elevated line, wet asphalt throwing acid-green and violet light,
            a cab waiting mid-frame. Labelled as generated in /brand/ASSET_MANIFEST.md § 4.

            It carries no text, no logo, no packaging, no real retailer and no identifiable
            person, so it makes no claim on SLAPPZ's behalf — that is the bar generated
            imagery has to clear here (CLAUDE.md § NEVER). The locator's subject IS the city
            you are searching, which is why atmosphere works in this slot where a close-up
            product photograph did not.

            The left third of the frame is already pure black in the source, which is why the
            scrim below can be far lighter than the one the cab photograph needed: the
            headline sits on darkness the image itself provides rather than on a gradient
            painted over the top of it. */}
        <div className="absolute inset-0 -z-10">
          {/* ART DIRECTION, not just a resize. The hero box runs from 0.62 on a phone to 3.9
              on a wide monitor. A single landscape frame cover-cropped into a portrait box
              can only ever slide SIDEWAYS — the vertical framing is fixed once the height
              fits — so the truck sat stranded behind the search box on a phone and no
              object-position could lift it out. The phone gets its own portrait cut, framed
              so the truck lands in the empty space beside the wordmark: measured at x
              165-326 in a 390px viewport, where the wordmark ends at 167.

              Plain <picture> rather than two next/image elements, because two <Image>s
              toggled with `hidden`/`block` both download — and this is the LCP element on
              the page that has to clear a five-second bar over cell data. A <picture>
              fetches exactly one. That costs next/image's automatic srcset, which is a fair
              trade when there are only two hand-cut sources to begin with. */}
          <picture>
            <source
              media="(min-width: 640px)"
              srcSet="/brand/slappz/campaign/hero-ssr-el-night.webp"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/slappz/campaign/hero-ssr-el-night-tall.webp"
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </picture>

          {/* Scrim. Much lighter than the one the cab photograph needed, because this frame
              brings its own darkness — the left third is black in the source and the whole
              image is a night scene. The job here is only to deepen the bottom into the
              results section with no seam, and to take enough heat out of the neon that the
              muted sub-line and the trust row stay readable over it.

              Mobile keeps its own variant: the hero is 0.67 there, so object-cover crops to a
              narrow vertical slice and the type runs the full width rather than sitting in a
              dark left column. It needs an even wash instead of a left-to-right one. */}
          <div
            className="absolute inset-0 lg:hidden"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.78) 72%, #000 100%)',
            }}
          />
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              background:
                'linear-gradient(to right, #000 0%, rgba(0,0,0,0.82) 22%, rgba(0,0,0,0.3) 48%, rgba(0,0,0,0.12) 100%), linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.08) 45%, #000 100%)',
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
          {/* CATEGORY LINE. "FIND SLAPPZ" tells a stranger nothing — it is a brand name and
              a verb, and someone arriving cold from an Instagram link has no idea what is
              being sold. This states the category and the format before the headline does
              anything else, which is what CLAUDE.md § MOBILE-FIRST's five-second bar
              actually requires.

              It is TYPE, not an icon, on purpose. The obvious way to say "cannabis" in a
              hero is a leaf or a wisp of smoke, and § BRAND RULE bans both outright — along
              with Rasta palettes and neon-green-on-black dispensary templates. The honest
              signals available to this brand are the words and the product itself. */}
          <p className="meta rise mb-3 text-acid">NEW YORK CANNABIS · 1G PRE-ROLLS</p>

          <h1 className="rise">
            {/* Desktop is the LARGEST step, not a step down. This used to read
                70 / 98 / 88 — the headline shrank going from tablet to desktop while the
                wordmark beneath it grew to 112px, so the two halves of the same h1 were
                scaling in opposite directions. Matching FIND to the mark's height pairs
                them. */}
            <span className="display block text-[70px] leading-[0.85] text-paper sm:text-[98px] lg:text-[112px]">
              FIND
            </span>
            <SlappzWordmark size="hero" alt="SLAPPZ" className="mt-2 sm:mt-3" />
          </h1>

          {/* Sentence case, not `meta`. SLAPPZ_DIGITAL_SYSTEM.md § 4 puts supporting lines
              in letterspaced small caps, and that is right for a SHORT label — "THE BRAND
              THAT SLAPPZ", a date, a badge. Applying it to a full sentence was a
              misreading: caps plus 0.16em tracking flattens the word shapes a reader scans
              by, and this is the first line anyone reads under the headline. */}
          {/* text-paper, not text-muted. Everywhere else on the site muted grey sits on a
              flat black or surface panel and reads fine; here it sits on a night PHOTOGRAPH,
              where a mid grey has almost nothing to separate it from the image behind. The
              hero is the one place the secondary text has to be as bright as the primary. */}
          <p className="rise rise-1 mt-4 max-w-2xl text-[17px] leading-relaxed text-paper/90 sm:text-[19px]">
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
            that IS real and verifiable: licensed shops and markets covered. Both are
            derived from the retailer data, so they can never drift.

            A third point carried the last-verified date. SLAPPZ asked for it off the hero
            on 2026-09-25 — do not put it back here. The dates are NOT gone: every retailer
            still carries `lastVerified`, and it is still shown on the retailer cards and the
            store pages, which is where someone actually checking a specific shop will look.
          */}
          {/* items-start, not items-center. The borough list wraps to three lines on a
              phone, and centring left its tick floating beside the middle line. */}
          <ul className="rise rise-3 mt-6 flex flex-wrap items-start gap-x-5 gap-y-2">
            {trustPoints.map((point) => (
              <li key={point} className="meta flex items-start gap-1.5 text-paper/75">
                <CheckIcon size={13} className="mt-0.5 shrink-0 text-acid" />
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
            <p className="display text-[32px] text-paper">
              COULDN&apos;T FIND <span className="text-magenta">{query}</span>
            </p>
            <p className="mt-2 text-[15px] text-muted">
              Try a 5-digit ZIP, a neighborhood, or a full street address.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="border-b border-hairline px-4 py-8 sm:px-6">
            <p className="display text-[32px] text-paper">SOMETHING BROKE.</p>
            <p className="mt-2 text-[15px] text-muted">
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

            {/* --- 2. Map ---
                The IDLE height is deliberately smaller than the results height. Before a
                search the map is orientation, not the task — it shows the customer this is a
                New York thing and roughly where the shops cluster. It used to run 46vh/54vh,
                which put a tall touch-capturing surface directly under the hero on the one
                gesture every visitor makes: the first scroll. Shrinking it moves the fold up
                and gives the thumb somewhere safe to land. The real fix is upstream in
                MapView's cooperative gestures; this is the half that stops the map dominating
                a screen the customer has not asked it to dominate yet. */}
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
                    : 'h-[32vh] min-h-[220px] border-b border-hairline lg:h-[44vh]'
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
                <h2 className="display text-[27px] text-paper sm:text-[34px]">MORE NEARBY</h2>
                <span className="meta tabular text-muted">
                  {rest.length} {rest.length === 1 ? 'SHOP' : 'SHOPS'}
                </span>
              </div>

              {rest.length === 0 ? (
                <p className="text-[15px] text-muted">
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

              <p className="mt-6 text-[14px] leading-relaxed text-muted">
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
