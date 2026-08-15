import type { Metadata } from 'next';

import { SlappzWordmark } from '@/components/brand/SlappzWordmark';

export const metadata: Metadata = {
  title: 'SLAPPZ Admin',
  robots: { index: false, follow: false },
};

/**
 * Admin chrome. Same tokens as the consumer site, lower volume — denser type, more grey,
 * acid reserved for primary actions. It should be obviously the same product without
 * shouting (see /brand/SLAPPZ_DIGITAL_SYSTEM.md § 8).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-ink">
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <SlappzWordmark size="sm" withHq={false} />
            <span className="meta border border-hairline-strong px-2 py-1 text-muted">
              ADMIN
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-1">
            {[
              { href: '/admin/locations', label: 'LOCATIONS' },
              { href: '/admin/locations/import', label: 'IMPORT' },
              { href: '/admin/demand', label: 'DEMAND' },
              { href: '/', label: 'VIEW SITE ↗' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="meta px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-acid"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
