import Link from 'next/link';

import { ArrowIcon } from '@/components/brand/Icons';

/**
 * CARRY SLAPPZ — the B2B close.
 *
 * Last thing on the page, and the only section addressed to shop owners rather than
 * customers. The four pillars and the "LET'S GROW TOGETHER. LET'S SLAPPZ." line are SLAPPZ's
 * own trade copy, lifted from their dispensary-outreach graphic.
 */

const PILLARS = [
  ['PREMIUM FLOWER', 'Top quality.'],
  ['BOLD FLAVORS', 'Terps that hit.'],
  ['CONSISTENT QUALITY', 'Customers come back.'],
  ['SHELF APPEAL', 'Packaging that stands out.'],
];

export function CarrySlappz() {
  return (
    <section className="grain border-t border-hairline bg-surface px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1400px]">
        <p className="meta text-cab">FOR SHOP OWNERS, BUYERS &amp; BUDTENDERS</p>

        <h2 className="display mt-3 max-w-4xl text-[40px] leading-[0.9] text-paper sm:text-[68px]">
          PUT IT ON
          <br />
          <span className="text-acid">YOUR SHELF</span>
        </h2>

        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
          We&apos;ll pull up to your shop, meet the team, drop off samples and talk about
          getting SLAPPZ 1g pre-rolls on your shelves.
        </p>

        <ul className="mt-9 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(([label, body]) => (
            <li key={label} className="border border-hairline bg-ink p-5">
              <p className="meta text-acid">{label}</p>
              <p className="mt-2 text-[13px] text-muted">{body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/wholesale"
            className="display block-press block-shadow flex h-14 items-center justify-center gap-2 bg-acid px-7 text-[17px] text-ink"
          >
            CARRY SLAPPZ
            <ArrowIcon size={16} />
          </Link>

          <p className="display text-[20px] text-paper">
            LET&apos;S GROW TOGETHER. <span className="text-acid">LET&apos;S SLAPPZ.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
