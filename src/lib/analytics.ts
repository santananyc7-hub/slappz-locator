'use client';

/**
 * Analytics event layer.
 *
 * One place that defines what SLAPPZ measures, so no component invents its own event name.
 * The transport is deliberately pluggable and defaults to a no-op beyond `dataLayer` /
 * `gtag` / Plausible if they happen to exist — this repo does not ship a tracking script,
 * and adding one is a decision for SLAPPZ, not a default.
 *
 * Payloads must stay free of PII. UTM parameters are campaign attribution, not identity.
 */

export type AnalyticsEvent =
  | 'locator_search'
  | 'geolocation_requested'
  | 'geolocation_granted'
  | 'geolocation_denied'
  | 'retailer_view'
  | 'directions_click'
  | 'menu_click'
  | 'product_search'
  | 'no_results'
  | 'bring_slappz_here'
  | 'instagram_click';

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: AnalyticsPayload }) => void;
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

/**
 * Read UTM params once and keep them for the session, so attribution survives client-side
 * navigation to a store page. Campaign links like
 * `/find?utm_source=instagram&utm_campaign=slappz-drop` are a core distribution channel.
 */
let cachedUtm: Record<string, string> | null = null;

export function getUtm(): Record<string, string> {
  if (cachedUtm) return cachedUtm;
  if (typeof window === 'undefined') return {};

  const stored = sessionStorage.getItem('slappz:utm');
  if (stored) {
    try {
      cachedUtm = JSON.parse(stored) as Record<string, string>;
      return cachedUtm;
    } catch {
      /* fall through and re-read from the URL */
    }
  }

  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 120);
  }

  if (Object.keys(utm).length) {
    try {
      sessionStorage.setItem('slappz:utm', JSON.stringify(utm));
    } catch {
      /* private mode — attribution is best-effort, never a hard failure */
    }
  }

  cachedUtm = utm;
  return utm;
}

/**
 * Append current UTM params to an outbound URL so retailer clicks stay attributable.
 *
 * Reads `window.location`, so it is NOT safe to call during render — the server has no UTM
 * params and would emit a different href than the client, which React reports as a hydration
 * mismatch. Use `useAttributedHref` in components; this is the underlying primitive.
 */
export function withAttribution(url: string): string {
  try {
    const utm = getUtm();
    if (!Object.keys(utm).length) return url;
    const parsed = new URL(url);
    for (const [k, v] of Object.entries(utm)) {
      if (!parsed.searchParams.has(k)) parsed.searchParams.set(k, v);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export function track(event: AnalyticsEvent, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') return;

  const data = { ...payload, ...getUtm() };

  try {
    window.dataLayer?.push({ event, ...data });
    window.gtag?.('event', event, data);
    window.plausible?.(event, { props: data });
  } catch {
    /* analytics must never break the locator */
  }

  if (process.env.NODE_ENV === 'development') {
    console.debug('[slappz:analytics]', event, data);
  }
}
