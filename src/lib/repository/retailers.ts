import 'server-only';

import { retailers as seed } from '@/data/retailers';
import type { Coordinates, Retailer, RetailerResult } from '@/lib/types';
import { rankByProximity } from '@/lib/geo';
import { getStore } from './storage';

/**
 * Retailer repository.
 *
 * Reads merge the committed seed file with admin overrides from the document store, so the
 * SLAPPZ team can edit a retailer without a deploy while the seed file stays the reviewable
 * source of record. Overrides are keyed by retailer id; anything the admin creates lives
 * only in the store.
 *
 * Every consumer of retailer data goes through here. Do not import `@/data/retailers`
 * directly from a component or route.
 */

const KEY = 'retailer-overrides';

type OverrideDoc = {
  /** Partial patches applied on top of a seeded retailer. */
  patches: Record<string, Partial<Retailer>>;
  /** Retailers created entirely through the admin UI. */
  created: Retailer[];
};

const EMPTY: OverrideDoc = { patches: {}, created: [] };

async function doc(): Promise<OverrideDoc> {
  const value = await getStore().read<OverrideDoc>(KEY, EMPTY);
  return { patches: value.patches ?? {}, created: value.created ?? [] };
}

/** Every retailer, active or not. Admin surfaces use this. */
export async function listAll(): Promise<Retailer[]> {
  const { patches, created } = await doc();
  const merged = seed.map((r) => (patches[r.id] ? { ...r, ...patches[r.id], id: r.id } : r));
  return [...merged, ...created];
}

/** Active retailers only. Everything consumer-facing uses this. */
export async function listActive(): Promise<Retailer[]> {
  return (await listAll()).filter((r) => r.active);
}

export async function findBySlug(slug: string): Promise<Retailer | undefined> {
  return (await listAll()).find((r) => r.slug === slug);
}

export async function findById(id: string): Promise<Retailer | undefined> {
  return (await listAll()).find((r) => r.id === id);
}

/** Active retailers ranked by distance from an origin. */
export async function nearest(origin: Coordinates, limit?: number): Promise<RetailerResult[]> {
  const ranked = rankByProximity(await listActive(), origin);
  return typeof limit === 'number' ? ranked.slice(0, limit) : ranked;
}

export async function upsert(retailer: Retailer): Promise<void> {
  const current = await doc();
  const isSeeded = seed.some((r) => r.id === retailer.id);

  if (isSeeded) {
    current.patches[retailer.id] = retailer;
  } else {
    const idx = current.created.findIndex((r) => r.id === retailer.id);
    if (idx >= 0) current.created[idx] = retailer;
    else current.created.push(retailer);
  }

  await getStore().write(KEY, current);
}

export async function setActive(id: string, active: boolean): Promise<void> {
  const existing = await findById(id);
  if (!existing) return;
  await upsert({ ...existing, active });
}

export async function setFeatured(id: string, featured: boolean): Promise<void> {
  const existing = await findById(id);
  if (!existing) return;
  await upsert({ ...existing, featured });
}

/** Admin-created retailers can be removed outright; seeded ones are deactivated instead. */
export async function remove(id: string): Promise<void> {
  const current = await doc();
  if (seed.some((r) => r.id === id)) {
    await setActive(id, false);
    return;
  }
  current.created = current.created.filter((r) => r.id !== id);
  delete current.patches[id];
  await getStore().write(KEY, current);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
