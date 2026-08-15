'use client';

import { useState } from 'react';

import { ArrowIcon, CheckIcon, SpinnerIcon } from '@/components/brand/Icons';
import { getUtm, track } from '@/lib/analytics';

/**
 * WHERE SHOULD WE PULL UP NEXT? — homepage demand capture.
 *
 * The zero-results state already captures failed searches passively; this is the version a
 * customer reaches for deliberately, so it asks for a little more: the area, and optionally
 * the shop they actually want it in. That last field is the useful one — a named store the
 * sales team can walk into beats a ZIP.
 *
 * Same privacy rules as everywhere else: ZIP granularity, nothing about the device, and
 * contact only when typed in by hand.
 */
export function PullUpNext() {
  const [zip, setZip] = useState('');
  const [area, setArea] = useState('');
  const [shop, setShop] = useState('');
  const [contact, setContact] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
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
          label: area.trim() || undefined,
          note: shop.trim() || undefined,
          contact: contact.trim() || undefined,
          utm: getUtm(),
        }),
      });
      if (!res.ok) throw new Error('failed');

      track('bring_slappz_here', {
        zip: zip.trim(),
        placement: 'homepage',
        named_shop: Boolean(shop.trim()),
      });
      setState('done');
    } catch {
      setState('idle');
      setError('Something went wrong. Try again in a sec.');
    }
  }

  return (
    <section className="grain border-t border-hairline px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="meta text-magenta">DEMAND</p>
            <h2 className="display mt-2 text-[38px] leading-[0.9] text-paper sm:text-[60px]">
              NAME THE
              <br />
              <span className="text-acid">BLOCK</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              SLAPPZ moves shop by shop. Tell us where you are and which spot you want it in —
              that&apos;s how the next market gets picked.
            </p>
          </div>

          {state === 'done' ? (
            <div className="flex items-start gap-3 self-start border border-acid bg-surface p-6">
              <CheckIcon size={20} className="mt-0.5 shrink-0 text-acid" />
              <div>
                <p className="display text-[24px] text-acid">GOT IT. WE HEARD YOU.</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {zip} is on the list{shop.trim() ? `, and so is ${shop.trim()}` : ''}. New
                  spots get announced on{' '}
                  <a
                    href="https://www.instagram.com/slappz_hq/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('instagram_click', { placement: 'pull-up-success' })}
                    className="text-paper underline underline-offset-4 hover:text-acid"
                  >
                    @slappz_hq
                  </a>{' '}
                  first.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="self-start">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  id="pull-zip"
                  label="ZIP CODE"
                  required
                  value={zip}
                  onChange={setZip}
                  placeholder="11373"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  invalid={Boolean(error)}
                />
                <Field
                  id="pull-area"
                  label="NEIGHBORHOOD OR CITY"
                  value={area}
                  onChange={setArea}
                  placeholder="Elmhurst"
                />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field
                  id="pull-shop"
                  label="A SHOP THAT SHOULD CARRY IT"
                  value={shop}
                  onChange={setShop}
                  placeholder="Your local dispensary"
                />
                <Field
                  id="pull-contact"
                  label="EMAIL OR PHONE"
                  optional
                  value={contact}
                  onChange={setContact}
                  placeholder="so we can tell you"
                  autoComplete="email"
                />
              </div>

              {error && (
                <p role="alert" className="meta mt-3 text-magenta">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'sending'}
                className="display block-press block-shadow mt-5 flex h-14 w-full items-center justify-center gap-2 bg-acid px-6 text-[17px] text-ink disabled:opacity-60 sm:w-auto"
              >
                {state === 'sending' ? <SpinnerIcon size={16} /> : <ArrowIcon size={16} />}
                BRING SLAPPZ HERE
              </button>

              <p className="mt-3 text-[11px] leading-relaxed text-muted">
                We store your ZIP and whatever you type here. No precise location, no tracking.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  optional,
  inputMode,
  autoComplete,
  invalid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  inputMode?: 'numeric' | 'text';
  autoComplete?: string;
  invalid?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="meta text-muted">
        {label}
        {required && <span className="ml-1 text-magenta">*</span>}
        {optional && <span className="ml-1 normal-case">(optional)</span>}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={invalid ? 'true' : undefined}
        className="meta mt-1.5 h-14 w-full border border-hairline-strong bg-ink px-4 text-[13px] text-paper placeholder:text-muted placeholder:normal-case focus:border-acid focus:outline-none"
      />
    </div>
  );
}
