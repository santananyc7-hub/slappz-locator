import type { Metadata } from 'next';
import Image from 'next/image';

import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { PageHero } from '@/components/site/PageHero';
import { InstagramIcon, MailIcon } from '@/components/brand/Icons';

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
 * BUDTENDERS" / "LET'S GROW TOGETHER. LET'S SLAPPZ.").
 *
 * The phone number was removed from this page on SLAPPZ's instruction — the trade routes are
 * email and Instagram DM. SLAPPZ's own cab-yellow trade graphic still prints the number, so
 * it is still a real line; it is just not the route this page offers. Do not re-add it from
 * the graphic or from CLAUDE.md's fact table.
 *
 * There is deliberately NO wholesale form here: this repo has no CRM, no inbox, and no
 * owner to route submissions to. A form that silently drops a retailer's enquiry would be
 * worse than sending them to the channels SLAPPZ actually monitors. Add one when there is a
 * real destination for it.
 */

/**
 * Real SLAPPZ activations in licensed New York shops, photographed by SLAPPZ.
 *
 * This is the one thing a buyer actually wants to see and the page had no imagery at all
 * before. Captions describe the SETUP, never the shop — none of these storefronts is named
 * in its own frame, and naming a retailer here would read as a claim about that retailer's
 * current stock, which this site does not make (CLAUDE.md § RETAILER RULES).
 */
const SHELF_SHOTS = [
  {
    src: '/brand/slappz/lifestyle/slappz-shelf-marble.webp',
    alt: 'A SLAPPZ HQ branded table set up on the sales floor of a licensed dispensary.',
    line: 'The full range on the sales floor.',
  },
  {
    src: '/brand/slappz/lifestyle/slappz-shelf-woodroom.webp',
    alt: 'A SLAPPZ HQ branded table laid out with pre-rolls in a wood-panelled dispensary.',
    line: 'Table, cloth and the whole range.',
  },
  {
    src: '/brand/slappz/lifestyle/slappz-shelf-blueroom.webp',
    alt: 'A SLAPPZ HQ branded table beside a stocked product wall in a licensed dispensary.',
    line: 'Front of house, beside the product wall.',
  },
];

const PILLARS = [
  ['PREMIUM FLOWER', 'Top quality.'],
  ['BOLD FLAVORS', 'Terps that hit.'],
  ['CONSISTENT QUALITY', 'Customers come back.'],
  ['SHELF APPEAL', 'Packaging that stands out.'],
];

const STEPS = [
  ['01', 'REACH OUT', 'Email us or DM @slappz_hq. Tell us your shop and where you are.'],
  ['02', 'WE COME TO YOU', 'We visit the store, meet the team and leave samples.'],
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
          lead="We'll visit your shop, meet the team, leave samples and talk about getting SLAPPZ 1g pre-rolls on your shelves."
        >
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:wholesale@slappz.nyc"
              className="display block-press block-shadow flex h-14 items-center gap-2 bg-acid px-6 text-[17px] text-ink"
            >
              <MailIcon size={16} />
              WHOLESALE@SLAPPZ.NYC
            </a>
            <a
              href="https://www.instagram.com/slappz_hq/"
              target="_blank"
              rel="noopener noreferrer"
              className="display flex h-14 items-center gap-2 border border-hairline-strong px-6 text-[17px] text-paper transition-colors hover:border-acid hover:text-acid"
            >
              <InstagramIcon size={16} />
              DM @SLAPPZ_HQ
            </a>
          </div>
        </PageHero>

        <section className="border-b border-hairline px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1400px]">
            <p className="meta text-acid">WHY IT MOVES</p>
            <h2 className="display mt-2 text-[34px] text-paper sm:text-[48px]">
              WHAT YOU&apos;RE PUTTING ON THE SHELF
            </h2>

            <ul className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map(([label, body]) => (
                <li key={label} className="border border-hairline bg-surface p-5">
                  <p className="meta text-acid">{label}</p>
                  <p className="mt-2 text-[15px] text-muted">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-hairline px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1400px]">
            <p className="meta text-acid">HOW IT WORKS</p>
            <h2 className="display mt-2 text-[34px] text-paper sm:text-[48px]">
              THREE STEPS
            </h2>

            <ol className="mt-8 grid gap-2.5 lg:grid-cols-3">
              {STEPS.map(([num, title, body]) => (
                <li key={num} className="grain border border-hairline bg-surface p-6">
                  <p
                    className="display text-[58px] leading-none text-acid"
                    style={{ textShadow: '3px 3px 0 var(--color-violet)' }}
                  >
                    {num}
                  </p>
                  <p className="display mt-5 text-[25px] text-paper">{title}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-hairline px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1400px]">
            <p className="meta text-acid">WHAT IT LOOKS LIKE</p>
            <h2 className="display mt-2 text-[34px] text-paper sm:text-[48px]">
              WE SET IT UP IN YOUR SHOP
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
              This is what a SLAPPZ activation looks like in a licensed New York dispensary:
              our table, our cloth and the full 1g range laid out.
            </p>

            <ul className="mt-8 grid gap-2.5 sm:grid-cols-3">
              {SHELF_SHOTS.map((shot) => (
                <li
                  key={shot.src}
                  className="relative overflow-hidden border border-hairline"
                >
                  <div className="relative aspect-4/5">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover"
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, #000 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0) 65%)',
                      }}
                    />
                  </div>
                  <p className="display absolute inset-x-0 bottom-0 p-5 text-[19px] text-paper">
                    {shot.line}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grain bg-surface px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="display max-w-3xl text-[40px] leading-[0.9] text-paper sm:text-[64px]">
              LET&apos;S GROW TOGETHER.
              <br />
              <span className="text-acid">LET&apos;S SLAPPZ.</span>
            </h2>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:wholesale@slappz.nyc"
                className="display block-press block-shadow flex h-14 items-center gap-2 bg-acid px-6 text-[17px] text-ink"
              >
                <MailIcon size={16} />
                WHOLESALE@SLAPPZ.NYC
              </a>
              <a
                href="https://www.instagram.com/slappz_hq/"
                target="_blank"
                rel="noopener noreferrer"
                className="display flex h-14 items-center gap-2 border border-hairline-strong px-6 text-[17px] text-paper transition-colors hover:border-acid hover:text-acid"
              >
                <InstagramIcon size={16} />
                DM @SLAPPZ_HQ
              </a>
            </div>

            <p className="mt-8 max-w-2xl text-[13px] leading-relaxed text-muted">
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
