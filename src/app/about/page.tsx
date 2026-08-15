import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { PageHero } from '@/components/site/PageHero';
import { ArrowIcon, InstagramIcon } from '@/components/brand/Icons';

export const metadata: Metadata = {
  title: 'About SLAPPZ — NYC Cannabis, Queens Born',
  description:
    'SLAPPZ is a licensed New York cannabis brand out of Queens making 1g pre-rolls. Built through activations, budtender education and showing up in person.',
  alternates: { canonical: '/about' },
};

/**
 * ABOUT.
 *
 * Written in the first person on purpose — this is a small Queens brand, and third-person
 * company copy is what makes small brands sound like corporations.
 *
 * Factual spine, all from SLAPPZ's public materials or confirmed by the client: Queens,
 * OCM Processor Type 3, 1g pre-rolls, two years, the four anniversary pillars, and the
 * activations-and-education approach. Deliberately absent: founder names, team size,
 * funding, revenue, origin story. None of that is established, so none of it is invented.
 */

const HOW = [
  {
    num: '01',
    label: 'ACTIVATIONS',
    body: 'Pop-ups at dispensaries, anniversary events, block-level activations. We bring product, merch and the team, and we stay for the day. It is the fastest way to turn a shelf into a relationship.',
  },
  {
    num: '02',
    label: 'EDUCATION',
    body: 'Budtenders are the ones actually recommending product. So we sit with them — what is in it, how it smokes, who it suits. A budtender who can speak on it will always outsell a shelf tag.',
  },
  {
    num: '03',
    label: 'AWARENESS',
    body: 'No ad budget, no billboards. Awareness gets built one shop, one event and one conversation at a time, and it compounds. People ask for it by name because someone they trust put it in their hand.',
  },
];

const PILLARS = [
  {
    label: 'BUILT ON COMMUNITY',
    body: 'The first shelves came from relationships, not a media plan.',
  },
  {
    label: 'TRUSTED SINCE DAY 1',
    body: 'Same product every time. In a market this new, consistency is the reputation.',
  },
  {
    label: 'LOYAL CUSTOMERS',
    body: 'Bought once, came back, asked for it by name. That decides where we go next.',
  },
  {
    label: 'LEGACY TO LEGAL',
    body: 'Licensed New York, without pretending the culture started there.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          kicker="ABOUT"
          title={
            <>
              LEGACY TO <span className="text-acid">LEGAL</span>
            </>
          }
          lead="We're a 1g pre-roll brand out of Queens, licensed by the New York Office of Cannabis Management. This is how we actually got on shelves."
        />

        <section className="border-b border-hairline px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <h2 className="display text-[30px] text-paper sm:text-[42px]">
                WE STARTED THIS BECAUSE WE WANTED IT
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted sm:text-[16px]">
                <p>
                  <span className="text-paper">
                    SLAPPZ started with a pretty simple idea: make a pre-roll we&apos;d
                    actually smoke ourselves, and make it come from here.
                  </span>{' '}
                  Queens. Not &ldquo;New York&rdquo; as a marketing angle — the handball wall,
                  the elevated line, Howard Beach, the cab.
                </p>
                <p>
                  We didn&apos;t have an ad budget and we still don&apos;t. What we had was
                  time and a car. We walked into shops, introduced ourselves to the people
                  behind the counter, and left them something to try. Some said no. Enough
                  said yes.
                </p>
                <p>
                  Every store on our locator is somewhere we have physically stood in. That
                  is not a marketing line — it is just how the list got built, and it is why
                  we can tell you it is accurate.
                </p>
                <p>
                  Two years in, that hasn&apos;t changed. If you see us, we&apos;re probably
                  outside somewhere — at a pop-up, at a shop&apos;s anniversary, giving away
                  merch and talking to whoever pulls up. That is the job.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#locator"
                  className="display block-press block-shadow flex h-14 items-center gap-2 bg-acid px-6 text-[16px] text-ink"
                >
                  FIND SLAPPZ
                  <ArrowIcon size={16} />
                </Link>
                <a
                  href="https://www.instagram.com/slappz_hq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta flex min-h-11 items-center gap-2 border border-hairline-strong px-5 text-paper transition-colors hover:border-acid hover:text-acid"
                >
                  <InstagramIcon size={14} />
                  @SLAPPZ_HQ
                </a>
              </div>
            </div>

            <div className="relative min-h-[280px] overflow-hidden border border-hairline lg:min-h-full">
              <Image
                src="/brand/slappz/lifestyle/wild-marina.webp"
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, #000 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
                }}
              />
              <p className="meta absolute bottom-5 left-5 text-acid">QUEENS, NEW YORK</p>
            </div>
          </div>
        </section>

        {/* Activations + education — the actual growth engine */}
        <section className="border-b border-hairline px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1400px]">
            <p className="meta text-acid">HOW WE GROW</p>
            <h2 className="display mt-2 max-w-3xl text-[30px] leading-[0.95] text-paper sm:text-[46px]">
              ACTIVATIONS AND EDUCATION, NOT ADVERTISING
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
              Awareness for a brand like ours doesn&apos;t come from spend. It comes from
              being in the room.
            </p>

            <ol className="mt-9 grid gap-2.5 lg:grid-cols-3">
              {HOW.map((item) => (
                <li key={item.num} className="grain border border-hairline bg-surface p-6">
                  <p
                    className="display text-[46px] leading-none text-acid"
                    style={{ textShadow: '3px 3px 0 var(--color-violet)' }}
                  >
                    {item.num}
                  </p>
                  <p className="display mt-5 text-[22px] text-paper">{item.label}</p>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-hairline px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1400px]">
            <p className="meta text-acid">WHAT IT STANDS ON</p>
            <h2 className="display mt-2 text-[30px] text-paper sm:text-[42px]">
              TWO YEARS OF THIS
            </h2>

            <ul className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map((pillar) => (
                <li key={pillar.label} className="border border-hairline bg-surface p-5">
                  <p className="meta text-acid">{pillar.label}</p>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{pillar.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="display text-[30px] text-paper sm:text-[42px]">
              WANT IT ON YOUR SHELF?
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted">
              We work directly with licensed New York retailers — and we&apos;ll come to you.
            </p>
            <Link
              href="/wholesale"
              className="meta mt-6 inline-flex min-h-11 items-center gap-2 border border-hairline-strong px-5 text-paper transition-colors hover:border-acid hover:text-acid"
            >
              CARRY SLAPPZ
              <ArrowIcon size={13} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
