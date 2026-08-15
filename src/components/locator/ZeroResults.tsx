'use client';

import { useState } from 'react';

import { ArrowIcon, CheckIcon, NavIcon, SpinnerIcon } from '@/components/brand/Icons';
import { directionsUrl, formatDistance } from '@/lib/geo';
import { getUtm, track } from '@/lib/analytics';
import type { GeocodeResult, RetailerResult } from '@/lib/types';

/**
 * The most valuable screen in the product after the search itself.
 *
 * "SLAPPZ isn't there yet" is a real answer, so it gets a real design rather than an error
 * state — and it is where distribution demand gets captured. We still offer the closest shop
 * overall, because someone willing to travel is a customer we shouldn't turn away.
 */
export function ZeroResults({
  origin,
  closest,
}: {
  origin: GeocodeResult | null;
  closest: RetailerResult | null;
}) {
  const [zip, setZip] = useState(origin?.zip ?? '');
  const [contact, setContact] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{5}(-\d{4})?$/.test(zip.trim())) {
      setError('Enter a valid 5-digit ZIP.');
      return;
    }

    setError(null);
    setState('sending');

    try {
      const res = await fetch('/api/demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zip: zip.trim(),
          latitude: origin?.latitude,
          longitude: origin?.longitude,
          label: origin?.label,
          contact: contact.trim() || undefined,
          utm: getUtm(),
        }),
      });

      if (!res.ok) throw new Error('request failed');

      track('bring_slappz_here', { zip: zip.trim(), with_contact: Boolean(contact.trim()) });
      setState('done');
    } catch {
      setState('error');
      setError('Something went wrong. Try again in a sec.');
    }
  }

  return (
    <section className="grain border border-hairline-strong bg-surface p-6 sm:p-9">
      <p className="meta text-magenta">NO SLAPPZ NEARBY</p>

      <h2 className="display mt-3 text-[42px] text-paper sm:text-[64px]">
        DAMN.
        <br />
        <span className="text-acid">NOT THERE YET.</span>
      </h2>

      <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
        SLAPPZ hasn&apos;t landed
        {origin?.label ? (
          <>
            {' '}
            near <span className="text-paper">{origin.label}</span>
          </>
        ) : (
          ' near you'
        )}{' '}
        yet. Tell us where to pull up and we&apos;ll work on it.
      </p>

      {state === 'done' ? (
        <div className="mt-6 flex items-start gap-3 border border-acid bg-ink p-5">
          <CheckIcon size={20} className="mt-0.5 shrink-0 text-acid" />
          <div>
            <p className="display text-[20px] text-acid">GOT IT. WE HEARD YOU.</p>
            <p className="mt-1.5 text-[13px] text-muted">
              {zip} is on the list. Keep an eye on{' '}
              <a
                href="https://www.instagram.com/slappz_hq/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('instagram_click', { placement: 'zero-results-success' })}
                className="text-paper underline underline-offset-4 hover:text-acid"
              >
                @slappz_hq
              </a>{' '}
              — we announce new spots there first.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 max-w-lg">
          <p className="display text-[22px] text-paper">TELL US WHERE TO PULL UP</p>

          <div className="mt-3 flex flex-col gap-2.5">
            <div>
              <label htmlFor="demand-zip" className="meta text-muted">
                ZIP CODE <span className="text-magenta">*</span>
              </label>
              <input
                id="demand-zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
                inputMode="numeric"
                autoComplete="postal-code"
                pattern="\d{5}(-\d{4})?"
                placeholder="11373"
                aria-describedby={error ? 'demand-error' : undefined}
                aria-invalid={error ? 'true' : undefined}
                className="meta mt-1.5 h-14 w-full border border-hairline-strong bg-ink px-4 text-[13px] text-paper placeholder:text-muted focus:border-acid focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="demand-contact" className="meta text-muted">
                EMAIL OR PHONE <span className="normal-case">(optional)</span>
              </label>
              <input
                id="demand-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                autoComplete="email"
                placeholder="so we can tell you when it lands"
                className="meta mt-1.5 h-14 w-full border border-hairline-strong bg-ink px-4 text-[13px] text-paper placeholder:text-muted placeholder:normal-case focus:border-acid focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p id="demand-error" role="alert" className="meta mt-2.5 text-magenta">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={state === 'sending'}
            className="display block-press block-shadow mt-4 flex h-14 w-full items-center justify-center gap-2 bg-acid px-6 text-[17px] text-ink disabled:opacity-60 sm:w-auto"
          >
            {state === 'sending' ? <SpinnerIcon size={16} /> : <ArrowIcon size={16} />}
            BRING SLAPPZ HERE
          </button>

          <p className="mt-3 text-[11px] leading-relaxed text-muted">
            We only store your ZIP and, if you give it, your contact. No precise location is
            saved.
          </p>
        </form>
      )}

      {closest && (
        <div className="mt-8 border-t border-hairline pt-6">
          <p className="meta text-muted">CLOSEST SLAPPZ ANYWHERE</p>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="display text-[26px] text-paper">{closest.name}</h3>
            <span className="meta tabular text-acid">
              {formatDistance(closest.distanceMiles)} AWAY
            </span>
          </div>
          <p className="mt-1.5 text-[13px] text-muted">
            {closest.address.street}, {closest.address.city}, {closest.address.state}
          </p>
          <a
            href={directionsUrl(closest)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track('directions_click', { retailer: closest.slug, placement: 'zero-results' })
            }
            className="meta mt-3 inline-flex items-center gap-1.5 border border-hairline-strong px-4 py-2.5 text-paper transition-colors hover:border-acid hover:text-acid"
          >
            <NavIcon size={13} />
            GET DIRECTIONS
          </a>
        </div>
      )}
    </section>
  );
}
