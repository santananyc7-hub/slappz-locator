import Link from 'next/link';

import { ArrowIcon } from '@/components/brand/Icons';

/**
 * Shared shell for the homepage's stacked sections.
 *
 * Homepage section titles carry the brand's PERSONALITY ("WHERE SLAPPZ HITS"); the
 * navigation carries CLARITY ("LOCATIONS"). The `kicker` bridges the two so a customer who
 * arrived via the nav still recognises where they landed.
 */
export function Section({
  id,
  kicker,
  title,
  lead,
  cta,
  children,
  className = '',
  bordered = true,
}: {
  id?: string;
  kicker?: string;
  title: string;
  lead?: string;
  cta?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={`px-4 py-12 sm:px-6 sm:py-16 ${bordered ? 'border-t border-hairline' : ''} ${className}`}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="max-w-2xl">
            {kicker && <p className="meta text-acid">{kicker}</p>}
            <h2 className="display mt-2 text-[34px] text-paper sm:text-[52px]">{title}</h2>
            {lead && (
              <p className="mt-3 text-[14px] leading-relaxed text-muted sm:text-[15px]">{lead}</p>
            )}
          </div>

          {cta && (
            <Link
              href={cta.href}
              className="meta flex min-h-11 shrink-0 items-center gap-2 border border-hairline-strong px-4 text-paper transition-colors hover:border-acid hover:text-acid"
            >
              {cta.label}
              <ArrowIcon size={13} />
            </Link>
          )}
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
