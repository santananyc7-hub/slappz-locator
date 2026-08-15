import type { Garment } from '@/components/home/MerchGarment';

/**
 * SLAPPZ MERCH
 * ============
 *
 * Items observed on SLAPPZ's own public posts. No prices and no "buy" flow, because there is
 * no SLAPPZ webstore — merch moves at pop-ups, activations and through DMs.
 *
 * WHAT IS SHOWN vs WHAT IS HELD BACK
 * ----------------------------------
 * Cards render a garment with the REAL wordmark asset composited on (see MerchGarment), so
 * a card is only truthful for pieces whose print actually IS the wordmark. Those are live.
 *
 * The NYC Tank and the Acid Wash Hoodie carry bespoke commissioned illustrations — a
 * full-colour graffiti piece and an airbrushed character. There is no way to show those
 * accurately without the artwork, and generating a lookalike would misrepresent SLAPPZ's own
 * designs. They are kept here with `active: false` so nothing is lost: set it to true the
 * moment the artwork or photography lands in /public/brand/slappz/merch/.
 *
 * `image` overrides the render entirely — set it and the card shows a real photo.
 */

export type MerchItem = {
  id: string;
  name: string;
  garment: Garment;
  /** What it is, plainly. */
  detail: string;
  /** The actual print, as observed on SLAPPZ's posts. */
  artwork: string;
  /** False while the real artwork can't be represented truthfully. */
  active: boolean;
  image?: string;
};

export const merch: MerchItem[] = [
  {
    id: 'mch_tee',
    name: 'THE TEE',
    garment: 'tee',
    detail: 'Black cotton tee',
    artwork: 'SLAPPZ HQ wordmark, chest print',
    active: true,
  },
  {
    id: 'mch_bucket',
    name: 'BUCKET HAT',
    garment: 'bucket',
    detail: 'Black bucket hat',
    artwork: 'SLAPPZ HQ mark, front panel',
    active: true,
  },
  {
    id: 'mch_cap',
    name: 'THE CAP',
    garment: 'cap',
    detail: 'Fitted cap, black and acid',
    artwork: 'SLAPPZ HQ mark, front panel',
    active: true,
  },

  // --- Held back until the real artwork exists in the repo ---
  {
    id: 'mch_tank',
    name: 'NYC TANK',
    garment: 'tank',
    detail: 'Black tank',
    artwork: 'Full-colour graffiti piece — pigeons, crown, skyline, BKLYN/QUEENS/MANHATTAN',
    active: false,
  },
  {
    id: 'mch_hoodie',
    name: 'ACID WASH HOODIE',
    garment: 'hoodie',
    detail: 'Heavyweight hoodie, stone-washed grey',
    artwork: 'Airbrushed character and hand prints with the SLAPPZ script',
    active: false,
  },
];

export const activeMerch = merch.filter((item) => item.active);
