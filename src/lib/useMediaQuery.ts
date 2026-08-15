'use client';

import { useSyncExternalStore } from 'react';

/**
 * Read a media query without breaking hydration.
 *
 * `useSyncExternalStore` is the right primitive here: it returns the server snapshot
 * (`false`) during SSR and the first client render, then the real value — so the markup
 * matches on both sides and there is no effect-driven setState to cascade.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
