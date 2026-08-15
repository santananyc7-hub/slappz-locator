'use client';

import { useSyncExternalStore } from 'react';

import { withAttribution } from './analytics';

/** No-op subscribe: mount state never changes after the first client render. */
const noopSubscribe = () => () => {};

/**
 * Returns an outbound URL with the session's UTM parameters appended, without breaking
 * hydration.
 *
 * The server has no access to the browser's query string, so appending attribution during
 * render produces a different href on server and client. `useSyncExternalStore` is the
 * hydration-safe way to ask "am I on the client yet?": it returns the server snapshot for
 * the server render and the initial client render, then the client snapshot — with no
 * effect, no extra state, and no cascading render.
 *
 * The plain URL is a perfectly good fallback: the link works without JavaScript and copies
 * correctly from the context menu — it just loses campaign attribution, which is the right
 * thing to trade away.
 */
export function useAttributedHref(url: string | undefined): string | undefined {
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  if (!url) return undefined;
  return isClient ? withAttribution(url) : url;
}
