'use client';

import { useEffect, useState } from 'react';

import { CrosshairIcon, NavIcon } from '@/components/brand/Icons';
import { directionsUrl } from '@/lib/geo';
import { track } from '@/lib/analytics';
import type { Retailer, RetailerResult } from '@/lib/types';

/**
 * Mobile sticky CTA.
 *
 * Appears only once the hero search has scrolled away, so it never competes with the real
 * search box. Its label follows intent: before a shop is chosen it takes you back to search;
 * after, it becomes the single action that matters — directions.
 *
 * Mobile only; on desktop the split layout keeps both permanently in view.
 */
export function StickyCta({ target }: { target: Retailer | RetailerResult | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Watch the HERO, not the locator wrapper — the wrapper spans the whole page and only
    // leaves the viewport at the very bottom, which would keep this bar hidden forever.
    const hero = document.getElementById('locator-hero');
    if (!hero) return;

    // The hero's distance from the top of the document. Measured once and on resize rather
    // than on every scroll tick, so scrolling never forces a layout.
    let threshold = 0;
    const measure = () => {
      threshold = hero.getBoundingClientRect().bottom + window.scrollY;
      update();
    };
    const update = () => setVisible(window.scrollY > threshold);

    measure();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure);

    // The hero changes height when results arrive (the "showing spots near…" line appears),
    // so re-measure when it does.
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(hero);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', measure);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-ink/95 p-3 backdrop-blur-[2px] transition-transform duration-200 lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      aria-hidden={!visible}
      inert={!visible ? true : undefined}
    >
      {target ? (
        <a
          href={directionsUrl(target)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('directions_click', { retailer: target.slug, placement: 'sticky' })}
          className="display block-press block-shadow-sm flex h-14 items-center justify-center gap-2 bg-acid text-[17px] text-ink"
        >
          <NavIcon size={17} />
          GET DIRECTIONS — {target.name}
        </a>
      ) : (
        <a
          href="#locator"
          className="display block-press block-shadow-sm flex h-14 items-center justify-center gap-2 bg-acid text-[17px] text-ink"
        >
          <CrosshairIcon size={17} />
          FIND SLAPPZ NEAR ME
        </a>
      )}
    </div>
  );
}
