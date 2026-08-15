'use client';

import Link from 'next/link';

import { SlappzWordmark } from '@/components/brand/SlappzWordmark';
import { InstagramIcon } from '@/components/brand/Icons';
import { track } from '@/lib/analytics';
import { NAV } from '@/lib/nav';

/**
 * Primary navigation.
 *
 * Desktop lays the five destinations out inline. Mobile collapses them into a native
 * `<details>` disclosure — accessible and keyboard-operable with zero JavaScript, which
 * matters when the runtime is the Instagram in-app browser.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-ink/95 backdrop-blur-[2px]">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        {/* min-h-11 keeps the tap area at 44px — the lockup itself is only 26px tall. */}
        <Link
          href="/"
          aria-label="SLAPPZ home"
          className="flex min-h-11 shrink-0 items-center"
        >
          <SlappzWordmark size="sm" />
        </Link>

        {/* ---------- desktop ---------- */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) =>
            item.emphasis ? (
              <Link
                key={item.href}
                href={item.href}
                className="meta ml-2 bg-acid px-4 py-2.5 text-ink transition-transform hover:-translate-y-px"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="meta px-3 py-2.5 text-muted transition-colors hover:text-acid"
              >
                {item.label}
              </Link>
            ),
          )}
          <a
            href="https://www.instagram.com/slappz_hq/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('instagram_click', { placement: 'header' })}
            aria-label="SLAPPZ on Instagram"
            className="ml-2 p-2 text-muted transition-colors hover:text-acid"
          >
            <InstagramIcon size={16} />
          </a>
        </nav>

        {/* ---------- mobile ---------- */}
        <details className="group relative lg:hidden">
          <summary className="meta flex min-h-11 cursor-pointer list-none items-center gap-2 border border-hairline-strong px-3 text-paper group-open:border-acid group-open:text-acid [&::-webkit-details-marker]:hidden">
            MENU
            <span
              aria-hidden="true"
              className="block h-1.5 w-1.5 rotate-45 border-r border-b border-current transition-transform group-open:-rotate-135"
            />
          </summary>

          <nav
            aria-label="Primary"
            className="absolute right-0 z-50 mt-2 flex w-56 flex-col border border-hairline-strong bg-surface"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`meta border-b border-hairline px-4 py-4 last:border-b-0 ${
                  item.emphasis ? 'bg-acid text-ink' : 'text-paper hover:text-acid'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://www.instagram.com/slappz_hq/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('instagram_click', { placement: 'header-mobile' })}
              className="meta flex items-center gap-2 border-t border-hairline px-4 py-4 text-muted hover:text-acid"
            >
              <InstagramIcon size={14} />
              @SLAPPZ_HQ
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
