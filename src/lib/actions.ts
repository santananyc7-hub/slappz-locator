'use server';

import { revalidatePath } from 'next/cache';

import * as repo from '@/lib/repository/retailers';
import { geocode } from '@/lib/geocode';
import { parseCsv } from '@/lib/csv';
import type { Retailer } from '@/lib/types';

/**
 * Admin server actions.
 *
 * All writes go through the retailer repository, so switching the storage adapter never
 * touches this file. Access is gated by src/middleware.ts before any of this runs.
 */

function str(form: FormData, key: string): string | undefined {
  const value = form.get(key);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

function revalidate(slug?: string) {
  revalidatePath('/');
  revalidatePath('/admin/locations');
  revalidatePath('/sitemap.xml');
  if (slug) revalidatePath(`/stores/${slug}`);
}

export type ActionState = { ok: boolean; message: string } | null;

export async function saveRetailer(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const id = str(form, 'id');
  const name = str(form, 'name');
  const street = str(form, 'street');
  const city = str(form, 'city');
  const state = str(form, 'state')?.toUpperCase();
  const zip = str(form, 'zip');

  if (!name || !street || !city || !state || !zip) {
    return { ok: false, message: 'Name, street, city, state and ZIP are all required.' };
  }

  const existing = id ? await repo.findById(id) : undefined;
  const slug = str(form, 'slug') ?? repo.slugify(name);

  // Re-geocode when the address changed (or when there are no coordinates yet).
  const addressChanged =
    !existing ||
    existing.address.street !== street ||
    existing.address.city !== city ||
    existing.address.zip !== zip;

  let coordinates = existing?.coordinates;

  if (addressChanged || !coordinates) {
    const hit = await geocode(`${street}, ${city}, ${state} ${zip}`);
    if (!hit) {
      return {
        ok: false,
        message:
          'Could not geocode that address. Check the street and ZIP, or set coordinates manually.',
      };
    }
    coordinates = { latitude: hit.latitude, longitude: hit.longitude };
  }

  const manualLat = Number(str(form, 'latitude'));
  const manualLon = Number(str(form, 'longitude'));
  if (Number.isFinite(manualLat) && Number.isFinite(manualLon) && !addressChanged) {
    coordinates = { latitude: manualLat, longitude: manualLon };
  }

  const products = str(form, 'availableProducts')
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const retailer: Retailer = {
    id: id ?? `ret_${slug.replace(/-/g, '_')}`,
    slug,
    name,
    address: { street, city, state, zip },
    coordinates,
    neighborhood: str(form, 'neighborhood'),
    borough: str(form, 'borough'),
    website: str(form, 'website'),
    menuUrl: str(form, 'menuUrl'),
    phone: str(form, 'phone')?.replace(/\D/g, ''),
    instagram: str(form, 'instagram'),
    availableProducts: products?.length ? products : undefined,
    featured: form.get('featured') === 'on',
    active: form.get('active') === 'on',
    lastVerified: str(form, 'lastVerified'),
    notes: str(form, 'notes'),
    hours: str(form, 'hours'),
    licenseNumber: str(form, 'licenseNumber'),
    verification: {
      source: str(form, 'verificationSource') ?? 'Entered via admin',
      confidence: (str(form, 'verificationConfidence') as 'high' | 'medium' | 'low') ?? 'medium',
      url: str(form, 'verificationUrl'),
    },
  };

  await repo.upsert(retailer);
  revalidate(slug);

  return { ok: true, message: `Saved ${name}.` };
}

export async function toggleActive(id: string, active: boolean) {
  await repo.setActive(id, active);
  revalidate();
}

export async function toggleFeatured(id: string, featured: boolean) {
  await repo.setFeatured(id, featured);
  revalidate();
}

export async function deleteRetailer(id: string) {
  await repo.remove(id);
  revalidate();
}

export type ImportState = {
  ok: boolean;
  message: string;
  imported?: number;
  failed?: { name: string; reason: string }[];
} | null;

/**
 * Commit a previously previewed CSV.
 *
 * Every row is geocoded here rather than at parse time, so a bad address fails loudly with
 * the store's name attached instead of silently dropping a pin somewhere wrong.
 */
export async function importCsv(_prev: ImportState, form: FormData): Promise<ImportState> {
  const text = str(form, 'csv');
  if (!text) return { ok: false, message: 'Nothing to import.' };

  const existing = await repo.listAll();
  const report = parseCsv(text, existing, repo.slugify);

  if (report.missingHeaders.length > 0) {
    return { ok: false, message: `Missing columns: ${report.missingHeaders.join(', ')}` };
  }

  let imported = 0;
  const failed: { name: string; reason: string }[] = [];

  for (const row of report.rows) {
    if (!row.retailer) continue;

    const { address, name } = row.retailer;
    const hit = await geocode(
      `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
    );

    if (!hit) {
      failed.push({ name, reason: 'address could not be geocoded' });
      continue;
    }

    await repo.upsert({
      ...row.retailer,
      coordinates: { latitude: hit.latitude, longitude: hit.longitude },
    });
    imported += 1;
  }

  revalidate();

  return {
    ok: imported > 0,
    message:
      imported > 0
        ? `Imported ${imported} retailer${imported === 1 ? '' : 's'}.`
        : 'Nothing was imported.',
    imported,
    failed,
  };
}
