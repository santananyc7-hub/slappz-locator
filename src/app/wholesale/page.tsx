import type { Metadata } from 'next';

import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { PageHero } from '@/components/site/PageHero';
import { InstagramIcon, PhoneIcon } from '@/components/brand/Icons';

export const metadata: Metadata = {
  title: 'Carry SLAPPZ — Wholesale for NY Dispensaries',
  description:
    'Get SLAPPZ 1g pre-rolls on your shelves. For licensed New York dispensary owners, buyers and budtenders.',
  alternates: { canonical: '/wholesale' },
  robots: { index: true, follow: true },
};

/**
 * CARRY SLAPPZ — the B2B page.
 *
 * The pillars, the pitch and the contact number are SLAPPZ's own trade copy, taken from
 * their public dispensary-outreach graphic ("ATTENTION DISPENSARY OWNERS, BUYERS &
 * BUDTENDERS" / 718-708-8430 / "LET'S GROW TOGETHER. LET'S SLAPPZ.").
 *
 * There is deliberately NO wholesale form here: this repo has no CRM, no inbox, and no
 * owner to route submissions to. A form that silently drops a retailer's enquiry would be
 * worse than sending them to the channels SLAPPZ actually monitors. Add one when there is a
 * real destination for it.
 */

const PILLARS = [
  ['PREMIUM FLOWER', 'Top quality.'],
  ['BOLD FLAVORS', 'Terps that hit.'],
  ['CONSISTENT QUALITY', 'Customers come back.'],
  ['SHELF APPEAL', 'Packaging that stands out.'],
];

const STEPS = [
  ['01', 'REACH OUT', 'DM @slappz_hq or call. Tell us your shop and where you are.'],
  ['02', 'WE PULL UP', 'We come to the store, meet the team and drop off samples.'],
  ['03', 'YOU STOCK IT', 'Get SLAPPZ 1g pre-rolls on the shelf and on your menu.'],
];

export default function WholesalePage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          kicker="FOR SHOP OWNERS, BUYERS & BUDTENDERS"
          title={
            <>
              PUT IT ON
              <br />
              <span className="text-acid">YOUR SHELF</span>
            </>
          }
          lead="We'll pull up to your shop, meet the team, drop off samples and talk about getting SLAPPZ 1g pre-rolls on your shelves."
        >
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="tel:7187088430"
              className="display block-press block-shadow flex h-14 items-center gap-2 bg-acid px-6 text-[16px] text-ink"
            >
              <PhoneIcon size={16} />
              718-708-8430
            </a>
            <a
              href="https://www.instagram.com/slappz_hq/"
              target="_blank"
              rel="noopener noreferrer"
              className="display flex h-14 items-center gap-2 border border-hairline-strong px-6 text-[16px] text-paper transition-colors hover:border-acid hover:text-acid"
            >
              <InstagramIcon size={16} />
              DM @SLAPPZ_HQ
            </a>
          </div>
        </PageHero>

        <section className="border-b border-hairline px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1400px]">
            <p className="meta text-acid">WHY IT MOVES</p>
            <h2 className="display mt-2 text-[30px] text-paper sm:text-[42px]">
              WHAT YOU&apos;RE PUTTING ON THE SHELF
            </h2>

            <ul className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map(([label, body]) => (
                <li key={label} className="border border-hairline bg-surface p-5">
                  <p className="meta text-acid">{label}</p>
                  <p className="mt-2 text-[13px] text-muted">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-hairline px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1400px]">
            <p className="meta text-acid">HOW IT WORKS</p>
            <h2 className="display mt-2 text-[30px] text-paper sm:text-[42px]">
              THREE STEPS
            </h2>

            <ol className="mt-8 grid gap-2.5 lg:grid-cols-3">
              {STEPS.map(([num, title, body]) => (
                <li key={num} className="grain border border-hairline bg-surface p-6">
                  <p
                    className="display text-[52px] leading-none text-acid"
                    style={{ textShadow: '3px 3px 0 var(--color-violet)' }}
                  >
                    {num}
                  </p>
                  <p className="display mt-5 text-[22px] text-paper">{title}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="grain bg-surface px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="display max-w-3xl text-[36px] leading-[0.9] text-paper sm:text-[58px]">
              LET&apos;S GROW TOGETHER.
              <br />
              <span className="text-acid">LET&apos;S SLAPPZ.</span>
            </h2>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="tel:7187088430"
                className="display block-press block-shadow flex h-14 items-center gap-2 bg-acid px-6 text-[16px] text-ink"
              >
                <PhoneIcon size={16} />
                CALL 718-708-8430
              </a>
              <a
                href="https://www.instagram.com/slappz_hq/"
                target="_blank"
                rel="noopener noreferrer"
                className="display flex h-14 items-center gap-2 border border-hairline-strong px-6 text-[16px] text-paper transition-colors hover:border-acid hover:text-acid"
              >
                <InstagramIcon size={16} />
                DM @SLAPPZ_HQ
              </a>
            </div>

            <p className="mt-8 max-w-2xl text-[12px] leading-relaxed text-muted">
              Wholesale enquiries are for licensed New York cannabis retailers only. SLAPPZ
              operates under a New York OCM Processor (Type 3) licence.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
