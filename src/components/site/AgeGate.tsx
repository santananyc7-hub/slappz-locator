'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { SlappzWordmark } from '@/components/brand/SlappzWordmark';
import { ArrowIcon } from '@/components/brand/Icons';

/**
 * 21+ AGE GATE
 *
 * New York adult-use cannabis is 21+, so this is a compliance requirement, not a design
 * flourish. Three things make it behave properly rather than just look right:
 *
 *   1. NO FLASH FOR RETURNING VISITORS. The gate is present in the server HTML and hidden by
 *      CSS the instant `data-age-ok` appears on <html> — set by a tiny blocking script in
 *      layout.tsx that runs before first paint. A React-only check would paint the site,
 *      then slam a modal over it.
 *
 *   2. SEO IS UNTOUCHED. This is an overlay, never a redirect or a server-side block, so the
 *      full page — copy, retailers, structured data — is in the HTML underneath for
 *      crawlers. Gating the markup itself would gut the location SEO this site is built for.
 *
 *   3. NO-JS ESCAPE HATCH. A <noscript> rule in globals.css hides the gate entirely, so a
 *      visitor without JavaScript isn't trapped behind a wall they can't dismiss.
 *
 * The choice is remembered for 30 days. Declining is a real state, not a dead end.
 */

const STORAGE_KEY = 'slappz:age-verified';
const REMEMBER_DAYS = 30;

/**
 * Has the blocking script in layout.tsx already cleared this visitor?
 *
 * `data-age-ok` is the single source of truth for "confirmed and not expired" — the script
 * sets it before paint and CSS hides the gate off it. React has to read the SAME signal, or
 * the two disagree: the gate goes invisible while the component still believes it is up and
 * holds `inert` on the whole site. That shipped, and it made every visit after the first
 * render a perfect page where nothing could be clicked or focused.
 *
 * `useSyncExternalStore` rather than an effect + setState: the server cannot know the
 * attribute, so it returns false there and the gate is in the server HTML as intended, and
 * React swaps to the client value during hydration without a mismatch or a cascading render.
 * Nothing needs to subscribe — the only thing that sets this attribute after load is
 * `confirm()` below, which updates React state in the same breath.
 */
const NO_OP = () => () => {};
const readAgeOk = () => document.documentElement.hasAttribute('data-age-ok');
const SERVER_AGE_OK = () => false;

export function AgeGate() {
  const [declined, setDeclined] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  const alreadyVerified = useSyncExternalStore(NO_OP, readAgeOk, SERVER_AGE_OK);
  const open = !dismissed && !alreadyVerified;

  // While the gate is up, take the rest of the page out of the tab order entirely.
  // `open`, not `!dismissed` — a returning visitor's gate is already hidden by CSS, and
  // marking the site inert behind an invisible gate is exactly the bug described above.
  useEffect(() => {
    if (!open) return;
    const root = document.getElementById('site-root');
    root?.setAttribute('inert', '');
    confirmRef.current?.focus();
    return () => root?.removeAttribute('inert');
  }, [open]);

  function confirm() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        String(Date.now() + REMEMBER_DAYS * 24 * 60 * 60 * 1000),
      );
    } catch {
      /* private mode — the gate simply reappears next visit */
    }
    document.documentElement.setAttribute('data-age-ok', '');
    setDismissed(true);
  }

  if (!open) return null;

  return (
    <div
      id="age-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="grain fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink px-5 py-10"
    >
      {/* Same frame as the hero, pushed right back so the type stays the subject */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/brand/slappz/campaign/hero-queens-night.webp')" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.9) 60%, #000 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg text-center">
        <SlappzWordmark size="lg" className="mx-auto" />

        {declined ? (
          <>
            <h2
              id="age-gate-title"
              className="display mt-9 text-[44px] leading-[0.9] text-paper sm:text-[64px]"
            >
              COME BACK
              <br />
              <span className="text-magenta">AT 21.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-sm text-[14px] leading-relaxed text-muted">
              No hard feelings. SLAPPZ is an adult-use cannabis brand and New York law puts
              the line at 21.
            </p>
            <button
              type="button"
              onClick={() => setDeclined(false)}
              className="meta mt-8 min-h-11 border border-hairline-strong px-5 text-muted transition-colors hover:border-acid hover:text-acid"
            >
              ← GO BACK
            </button>
          </>
        ) : (
          <>
            {/* The number is the hero here — acid on the violet extrude, the wordmark's
                own construction at display scale. */}
            <p
              className="display mt-8 text-[104px] leading-[0.8] text-acid sm:text-[144px]"
              style={{ textShadow: '6px 6px 0 var(--color-violet)' }}
              aria-hidden="true"
            >
              21+
            </p>

            <h2
              id="age-gate-title"
              className="display mt-6 text-[30px] leading-[0.95] text-paper sm:text-[40px]"
            >
              ARE YOU 21 OR OLDER?
            </h2>

            <p className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-muted">
              You have to be 21+ to be here. We&apos;ll remember you for 30 days.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
              <button
                ref={confirmRef}
                type="button"
                onClick={confirm}
                className="display block-press block-shadow flex h-14 items-center justify-center gap-2 bg-acid px-8 text-[17px] text-ink"
              >
                YES, I&apos;M 21+
                <ArrowIcon size={16} />
              </button>
              <button
                type="button"
                onClick={() => setDeclined(true)}
                className="display flex h-14 items-center justify-center border border-hairline-strong px-8 text-[17px] text-paper transition-colors hover:border-magenta hover:text-magenta"
              >
                NO
              </button>
            </div>

            <p className="mt-8 text-[11px] leading-relaxed text-muted">
              SLAPPZ products are sold only through licensed New York State cannabis
              retailers. Keep out of reach of children and pets.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
