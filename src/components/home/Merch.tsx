'use client';

import Image from 'next/image';

import { Section } from './Section';
import { MerchGarment } from './MerchGarment';
import { InstagramIcon } from '@/components/brand/Icons';
import { track } from '@/lib/analytics';
import { activeMerch } from '@/data/merch';

/**
 * MERCH.
 *
 * There is no SLAPPZ webstore, so this is a showcase, not a shop — the honest CTA is the
 * one that actually works: catch it at a pop-up or DM them. No prices, no cart, no
 * "sold out" theatre.
 *
 * Cards fall back to a typographic treatment until real merch photography lands. See
 * src/data/merch.ts.
 */
export function Merch() {
  return (
    <Section
      kicker="MERCH"
      title="WEAR IT"
      lead="The staples — tee and headwear, wordmark on black. Made in small runs and handed out at pop-ups, not sold in a webstore."
    >
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {activeMerch.map((item) => (
          <article
            key={item.id}
            className="grain flex flex-col justify-between border border-hairline bg-surface transition-colors hover:border-hairline-strong"
          >
            {/* A real photograph of the actual piece wins if one exists; otherwise the
                blank-garment render carries the real wordmark. */}
            <div className="relative w-full overflow-hidden">
              {item.image ? (
                <div className="relative aspect-square w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <MerchGarment garment={item.garment} label={item.name} />
              )}
            </div>

            <div className="border-t border-hairline p-4">
              <h3 className="display text-[18px] text-paper">{item.name}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{item.detail}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                <span className="text-acid">PRINT · </span>
                {item.artwork}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <a
          href="https://www.instagram.com/slappz_hq/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('instagram_click', { placement: 'merch' })}
          className="meta flex min-h-11 items-center gap-2 bg-acid px-5 text-ink transition-transform hover:-translate-y-px"
        >
          <InstagramIcon size={14} />
          DM FOR DROPS
        </a>
        <p className="text-[13px] text-muted">
          Drops get announced on Instagram first, and land at pop-ups before anywhere else.
        </p>
      </div>
    </Section>
  );
}
