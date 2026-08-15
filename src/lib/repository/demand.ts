import 'server-only';

import { coarsen } from '@/lib/geo';
import type { DemandAggregate, DemandSignal } from '@/lib/types';
import { getStore } from './storage';

/**
 * Demand intelligence repository.
 *
 * A search that finds nothing is the most valuable event in this product: it tells SLAPPZ
 * where distribution should go next. We record it, deliberately coarsely.
 *
 * Privacy rules (enforced here, not left to callers):
 *   - coordinates are rounded to ~1km before persistence
 *   - no IP, user agent, device id or session id is ever stored
 *   - contact details are only stored when explicitly typed into BRING SLAPPZ HERE
 */

const KEY = 'demand-signals';
const MAX_SIGNALS = 20_000;

export async function record(input: {
  zip?: string;
  latitude?: number;
  longitude?: number;
  label?: string;
  requested?: boolean;
  contact?: string;
  note?: string;
  utm?: Record<string, string>;
}): Promise<void> {
  const store = getStore();
  const signals = await store.read<DemandSignal[]>(KEY, []);

  const coarse =
    typeof input.latitude === 'number' && typeof input.longitude === 'number'
      ? coarsen({ latitude: input.latitude, longitude: input.longitude })
      : undefined;

  const signal: DemandSignal = {
    id: `dmd_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    zip: input.zip,
    approxLatitude: coarse?.latitude,
    approxLongitude: coarse?.longitude,
    label: input.label,
    createdAt: new Date().toISOString(),
    requested: input.requested || undefined,
    contact: input.contact?.trim() || undefined,
    note: input.note?.trim() || undefined,
    utm: input.utm && Object.keys(input.utm).length ? input.utm : undefined,
  };

  signals.push(signal);

  // Keep the file bounded. Oldest-first trim; aggregate reporting is what matters long-term.
  const trimmed = signals.length > MAX_SIGNALS ? signals.slice(-MAX_SIGNALS) : signals;
  await store.write(KEY, trimmed);
}

export async function listSignals(): Promise<DemandSignal[]> {
  return getStore().read<DemandSignal[]>(KEY, []);
}

/** Roll signals up by ZIP, most-wanted first. This is the view the sales team cares about. */
export async function aggregate(): Promise<DemandAggregate[]> {
  const signals = await listSignals();
  const byZip = new Map<string, DemandAggregate>();

  for (const s of signals) {
    const zip = s.zip ?? 'unknown';
    const existing = byZip.get(zip);
    if (existing) {
      existing.count += 1;
      if (s.requested) existing.requests += 1;
      if (s.createdAt > existing.lastSeen) existing.lastSeen = s.createdAt;
      if (!existing.label && s.label) existing.label = s.label;
    } else {
      byZip.set(zip, {
        zip,
        label: s.label,
        count: 1,
        requests: s.requested ? 1 : 0,
        lastSeen: s.createdAt,
      });
    }
  }

  return [...byZip.values()].sort((a, b) => b.count - a.count || b.requests - a.requests);
}
