'use client';

import Image from 'next/image';

import { Section } from './Section';
import { InstagramIcon } from '@/components/brand/Icons';
import { track } from '@/lib/analytics';

/**
 * SLAPPZ IN THE WILD — the culture strip.
 *
 * These are REAL SLAPPZ photographs, supplied by SLAPPZ. They replaced the generated
 * atmosphere tiles that stood here while the repo had no photography (see
 * /brand/ASSET_MANIFEST.md § 3 for what they were and why).
 *
 * Because they are real, two rules changed:
 *
 *   - They are CONTENT now, not decoration, so they carry real alt text instead of
 *     aria-hidden. A screen-reader user gets the same proof a sighted one does.
 *   - Every caption describes only what is VISIBLE IN THE FRAME — a readable storefront
 *     sign, a subway entrance that names itself, the crowd around the shot. Nothing is
 *     inferred about where a photo was taken or when. If a detail cannot be read off the
 *     photograph, it does not go in the caption.
 *   - The LINE is a place to stand, not a list of contents. An earlier version read
 *     "Bubba Kush, crowd, tower lit up." — accurate, and an inventory rather than a voice.
 *     The `place` label above already says where; the line should say what it feels like to
 *     be there, in the brand's own register (see CLAUDE.md § Writing section headings).
 *
 * Sources and crops: scripts/prepare-lifestyle-photos.mjs.
 */

const TILES = [
  {
    src: '/brand/slappz/lifestyle/slappz-midtown-night.webp',
    alt: 'A SLAPPZ 1g Bubba Kush pre-roll tube held up over a packed night-time street, a floodlit tower behind it.',
    place: 'MIDTOWN',
    line: 'A street fair, after dark.',
  },
  {
    src: '/brand/slappz/lifestyle/slappz-penn-station.webp',
    alt: 'A SLAPPZ 1g Perm Marker pre-roll tube held up in front of the 34 Street–Penn Station A, C, E subway entrance.',
    place: '34 ST · PENN STATION',
    line: 'At the A, C and E entrance.',
  },
  {
    src: '/brand/slappz/lifestyle/slappz-cannafamily-cab.webp',
    alt: 'A SLAPPZ t-shirt and tin laid out on the hood of a yellow cab outside the CannaFamily Dispensary storefront.',
    place: 'CANNAFAMILY',
    line: 'Parked right outside.',
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
                alt={tile.alt}
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
