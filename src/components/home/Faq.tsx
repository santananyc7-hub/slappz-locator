import Link from 'next/link';

/**
 * FAQ.
 *
 * Six questions, all answerable from verified facts. Every answer that touches stock,
 * legality or availability is written to be accurate rather than reassuring — this is the
 * section most likely to create a false impression if it overreaches.
 *
 * Native <details> so it works without JavaScript and stays keyboard-accessible.
 */

/**
 * Each entry carries BOTH the rendered answer and a plain-text twin.
 *
 * `a` is what the page shows; `plain` is what goes into the FAQPage structured data in
 * `src/lib/seo.ts`. Google requires the schema answer to match the visible answer, and
 * flattening React nodes to a string at runtime would silently drift the first time someone
 * edits the markup. Keeping the pair adjacent makes a mismatch obvious in review — if you
 * change one, change the other.
 */
export const FAQS: { q: string; a: React.ReactNode; plain: string }[] = [
  {
    q: 'Where can I buy SLAPPZ?',
    a: (
      <>
        At licensed New York dispensaries. Use the{' '}
        <Link href="/#locator" className="text-acid underline underline-offset-4">
          locator
        </Link>{' '}
        to find the closest one to you, or browse every verified market on the{' '}
        <Link href="/where-to-buy-slappz" className="text-acid underline underline-offset-4">
          locations page
        </Link>
        .
      </>
    ),
    plain:
      'At licensed New York dispensaries. Use the locator to find the closest one to you, or browse every verified market on the locations page.',
  },
  {
    q: 'Is the stock shown here live?',
    a: (
      <>
        No. Listings are verified periodically and <strong className="text-paper">do not
        reflect real-time inventory</strong>. Stock, hours and pricing are set by each
        retailer and can change without notice — call ahead or check the shop&apos;s own menu
        before you travel.
      </>
    ),
    plain:
      'No. Listings are verified periodically and do not reflect real-time inventory. Stock, hours and pricing are set by each retailer and can change without notice — call ahead or check the shop’s own menu before you travel.',
  },
  {
    q: 'Can I buy SLAPPZ directly from this site?',
    a: (
      <>
        No. SLAPPZ is sold exclusively through licensed New York retailers. This site helps
        you find them and links straight to their menus where one exists.
      </>
    ),
    plain:
      'No. SLAPPZ is sold exclusively through licensed New York retailers. This site helps you find them and links straight to their menus where one exists.',
  },
  {
    q: 'What does SLAPPZ actually make?',
    a: (
      <>
        1g pre-rolls, sold as singles and in 10-packs. See{' '}
        <Link href="/products" className="text-acid underline underline-offset-4">
          products
        </Link>
        . SLAPPZ holds a New York OCM Processor (Type 3) licence.
      </>
    ),
    plain:
      '1g pre-rolls, sold as singles and in 10-packs. SLAPPZ holds a New York OCM Processor (Type 3) licence.',
  },
  {
    q: 'Do I need to be 21?',
    a: (
      <>
        Yes. Adult-use cannabis in New York is 21+, and every retailer listed here will ask
        for valid government-issued ID.
      </>
    ),
    plain:
      'Yes. Adult-use cannabis in New York is 21+, and every retailer listed here will ask for valid government-issued ID.',
  },
  {
    q: 'SLAPPZ isn’t near me. What now?',
    a: (
      <>
        Tell us where you are. The{' '}
        <Link href="#pull-up" className="text-acid underline underline-offset-4">
          demand form
        </Link>{' '}
        above feeds directly into how the next market gets picked — naming a specific shop
        helps most.
      </>
    ),
    plain:
      'Tell us where you are. The demand form on the homepage feeds directly into how the next market gets picked — naming a specific shop helps most.',
  },
];

export function Faq() {
  return (
    <section className="border-t border-hairline px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-[900px]">
        <p className="meta text-acid">QUESTIONS</p>
        <h2 className="display mt-2 text-[34px] text-paper sm:text-[52px]">STRAIGHT ANSWERS</h2>

        <div className="mt-8 border-t border-hairline">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group border-b border-hairline">
              <summary className="meta flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-paper transition-colors hover:text-acid [&::-webkit-details-marker]:hidden">
                <span>{faq.q}</span>
                <span
                  aria-hidden="true"
                  className="relative block h-3 w-3 shrink-0 text-acid before:absolute before:top-1/2 before:left-0 before:h-px before:w-3 before:-translate-y-1/2 before:bg-current after:absolute after:top-0 after:left-1/2 after:h-3 after:w-px after:-translate-x-1/2 after:bg-current after:transition-transform group-open:after:scale-y-0"
                />
              </summary>
              <div className="pb-5 text-[14px] leading-relaxed text-muted">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
