'use client';

import Image from 'next/image';

import { SlappzWordmark } from '@/components/brand/SlappzWordmark';

/**
 * Merch garment renderer.
 *
 * A photoreal BLANK garment with the REAL SLAPPZ wordmark composited onto the print area.
 *
 * The garments are generated product shots — blank black tee, bucket hat and fitted cap,
 * all shot front-on under matching light on the same near-black ground so the three read as
 * one set. Only the garment is generated. The print is the actual logo asset, the same file
 * the header uses, so the design itself is never synthesised.
 *
 * That split is the whole point: an AI-generated *logo* would be a subtly wrong SLAPPZ mark,
 * which is the one thing this repo must not produce. An AI-generated *blank tee* is just a
 * tee. See /brand/ASSET_MANIFEST.md § 2b.
 *
 * Pieces carrying bespoke illustrations (the NYC tank, the acid-wash hoodie) are held back
 * in src/data/merch.ts rather than shown with the wordmark standing in for their artwork.
 */

export type Garment = 'tee' | 'tank' | 'hoodie' | 'bucket' | 'cap';

const PHOTO: Partial<Record<Garment, string>> = {
  tee: '/brand/slappz/merch/tee.webp',
  bucket: '/brand/slappz/merch/bucket.webp',
  cap: '/brand/slappz/merch/cap.webp',
};

/**
 * Where the print sits on each garment, as a percentage of the square frame — measured off
 * the actual renders, not guessed.
 */
const PRINT: Partial<Record<Garment, { top: string; width: string }>> = {
  tee: { top: '39%', width: '27%' },
  bucket: { top: '42%', width: '23%' },
  cap: { top: '41%', width: '24%' },
};

export function MerchGarment({ garment, label }: { garment: Garment; label: string }) {
  const photo = PHOTO[garment];
  const print = PRINT[garment];

  if (!photo || !print) return null;

  return (
    <div className="relative aspect-square w-full overflow-hidden">
      <Image
        src={photo}
        alt={label}
        fill
        loading="lazy"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
      />

      {/*
        `screen` blending is what makes this read as a print rather than a sticker: the
        wordmark asset carries an opaque near-black backing, and screening it over dark
        fabric leaves the backing effectively invisible while the acid green stays bright.
        Slightly under full opacity so the fabric's texture and folds show through it.
      */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          top: print.top,
          width: print.width,
          mixBlendMode: 'screen',
          opacity: 0.94,
        }}
      >
        <SlappzWordmark size="fluid" decorative />
      </div>
    </div>
  );
}
