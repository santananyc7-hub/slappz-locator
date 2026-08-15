'use client';

import { useId, useRef } from 'react';

import { CrosshairIcon, SearchIcon, SpinnerIcon } from '@/components/brand/Icons';

/**
 * The one interaction that matters.
 *
 * Rules baked in here (see CLAUDE.md):
 *   - the geolocation prompt only fires from an explicit USE MY LOCATION press
 *   - the field is 56px+ on mobile, because this is a thumb target inside an in-app browser
 *   - inputMode/autocomplete are set so phones surface the right keyboard immediately
 */
export function SearchPanel({
  query,
  onQueryChange,
  onSearch,
  onUseLocation,
  busy,
  locating,
  geoError,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  onSearch: (q: string) => void;
  onUseLocation: () => void;
  busy: boolean;
  locating: boolean;
  geoError: string | null;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          inputRef.current?.blur();
          onSearch(query);
        }}
        className="flex flex-col gap-2.5 sm:flex-row"
        role="search"
      >
        <label htmlFor={id} className="sr-only">
          Search by ZIP code, city, or address
        </label>

        <div className="relative flex-1">
          <SearchIcon
            size={18}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
          />
          <input
            ref={inputRef}
            id={id}
            name="q"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="ZIP, CITY, OR ADDRESS"
            autoComplete="postal-code"
            inputMode="text"
            enterKeyHint="search"
            spellCheck={false}
            className="meta h-14 w-full border border-hairline-strong bg-surface pr-4 pl-11 text-[13px] text-paper placeholder:text-muted focus:border-acid focus:outline-none sm:h-[58px]"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="display block-press block-shadow flex h-14 items-center justify-center gap-2 bg-acid px-7 text-[17px] text-ink disabled:opacity-60 sm:h-[58px]"
        >
          {busy ? <SpinnerIcon size={18} /> : null}
          FIND SLAPPZ
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={onUseLocation}
          disabled={locating}
          // min-h-11 keeps this at a 44px touch target — it is a thumb action on a phone,
          // even though it is visually the secondary control.
          className="meta flex min-h-11 items-center gap-2 border border-hairline-strong px-4 py-3 text-paper transition-colors hover:border-acid hover:text-acid disabled:opacity-60"
        >
          {locating ? <SpinnerIcon size={14} /> : <CrosshairIcon size={14} />}
          {locating ? 'LOCATING…' : 'USE MY LOCATION'}
        </button>

        {geoError && (
          <p className="meta text-magenta" role="status">
            {geoError}
          </p>
        )}
      </div>
    </div>
  );
}
