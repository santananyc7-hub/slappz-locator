import Link from 'next/link';

import { ArrowIcon } from '@/components/brand/Icons';

/**
 * The homepage brand block.
 *
 * Written in the first person — "we", not "SLAPPZ is a brand that…". The brief asked for
 * personal, and a third-person company description is the thing that makes a small brand
 * read like a corporation.
 *
 * The factual spine is still only what SLAPPZ has said publicly: Queens, OCM Processor
 * Type 3, 1g pre-rolls, two years, the four pillars from the anniversary graphic, plus the
 * activations-and-education approach the client confirmed. No founder names, headcount,
 * funding or origin myth — none of that is established, so none of it is here.
 */

const HOW = [
  {
    label: 'ACTIVATIONS',
    body: 'Pop-ups, anniversaries, block events. We show up in person, with product in hand.',
  },
  {
    label: 'EDUCATION',
    body: 'We sit with budtenders and walk them through it, so the people selling it can actually speak on it.',
  },
  {
    label: 'AWARENESS',
    body: 'One shop and one conversation at a time. That is the whole growth strategy.',
  },
];

export function ThisIsSlappz() {
  return (
    <section className="grain border-t border-hairline px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="meta text-acid">ABOUT</p>
            <h2 className="display mt-2 text-[40px] leading-[0.9] text-paper sm:text-[68px]">
              WE&apos;RE FROM
              <br />
              <span className="text-acid">QUEENS</span>
            </h2>

            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-paper sm:text-[18px]">
              We started SLAPPZ because we wanted a pre-roll we&apos;d actually smoke
              ourselves — and we wanted it to come from here.
            </p>

            <div className="mt-4 max-w-lg space-y-3 text-[14px] leading-relaxed text-muted">
              <p>
                No billboards, no ad budget. We got on shelves by walking into shops, meeting
                the people behind the counter and leaving them something to try. Every store
                on our locator is somewhere we&apos;ve stood in.
              </p>
              <p>
                Two years later that is still how it works. If you see us, we&apos;re
                probably outside somewhere — at a pop-up, at an anniversary, handing out
                merch and talking to whoever pulls up.
              </p>
            </div>

            <Link
              href="/about"
              className="meta mt-7 inline-flex min-h-11 items-center gap-2 border border-hairline-strong px-5 text-paper transition-colors hover:border-acid hover:text-acid"
            >
              MORE ABOUT SLAPPZ
              <ArrowIcon size={13} />
            </Link>
          </div>

          <div className="lg:content-center">
            <p className="meta text-muted">HOW WE GROW</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {HOW.map((item) => (
                <li key={item.label} className="border-l-[3px] border-l-acid bg-surface p-5">
                  <p className="meta text-acid">{item.label}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
