'use client';

import Image from 'next/image';

import { Section } from './Section';
import { InstagramIcon } from '@/components/brand/Icons';
import { track } from '@/lib/analytics';

/**
 * SLAPPZ IN THE WILD — the culture strip.
 *
 * ⚠️ These are GENERATED atmosphere images standing in for real SLAPPZ event, activation and
 * drop photography, which the repo does not have yet. They are placeholders on purpose:
 *
 *   - none of them depict a real event, retailer, product, logo or identifiable person
 *   - none of them carry text
 *   - the captions describe the PLACE, never a claim that SLAPPZ did something there
 *
 * That keeps the section honest while it waits for the real thing. Replace with approved
 * photography and the captions can become actual event copy — see
 * /brand/ASSET_MANIFEST.md § 3.
 */

const TILES = [
  {
    src: '/brand/slappz/lifestyle/wild-handball.webp',
    place: 'THE HANDBALL WALL',
    line: 'Where the summer actually happens.',
  },
  {
    src: '/brand/slappz/lifestyle/wild-platform.webp',
    place: 'THE ELEVATED LINE',
    line: 'Queens moves above the street.',
  },
  {
    src: '/brand/slappz/lifestyle/wild-marina.webp',
    place: 'HOWARD BEACH',
    line: 'Water on one side, the city on the other.',
  },
];

export function InTheWild() {
  return (
    <Section
      kicker="THE CULTURE"
      // The brand's own phrase. Beats any invented "in the wild" framing.
      title="WE'RE OUTSIDE"
      lead="Drops, activations and the city it all comes out of. The full run lives on Instagram."
    >
      <div className="grid gap-2.5 sm:grid-cols-3">
        {TILES.map((tile, i) => (
          <figure key={tile.src} className="relative overflow-hidden border border-hairline">
            <div className="relative aspect-4/5">
              <Image
                src={tile.src}
                alt=""
                aria-hidden="true"
                fill
                loading="lazy"
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, #000 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0) 65%)',
                }}
              />
            </div>

            <figcaption className="absolute inset-x-0 bottom-0 p-5">
              <p className="meta text-acid">
                {String(i + 1).padStart(2, '0')} · {tile.place}
              </p>
              <p className="display mt-1.5 text-[20px] text-paper">{tile.line}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <a
        href="https://www.instagram.com/slappz_hq/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('instagram_click', { placement: 'in-the-wild' })}
        className="meta mt-6 inline-flex min-h-11 items-center gap-2 border border-hairline-strong px-5 text-paper transition-colors hover:border-acid hover:text-acid"
      >
        <InstagramIcon size={14} />
        SEE IT ALL ON @SLAPPZ_HQ
      </a>
    </Section>
  );
}
