import { NextResponse } from 'next/server';

import * as demand from '@/lib/repository/demand';

/**
 * BRING SLAPPZ HERE — explicit demand capture.
 *
 * Distinct from the passive signal recorded by /api/search: this one the customer actively
 * submitted, so it carries `requested: true` and may include an optional contact they typed
 * themselves. Nothing else about them is stored — no IP, no user agent, no session id.
 */

const MAX_CONTACT_LENGTH = 160;
const MAX_NOTE_LENGTH = 160;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { zip, latitude, longitude, label, contact, note, utm } = (body ?? {}) as {
    zip?: string;
    latitude?: number;
    longitude?: number;
    label?: string;
    contact?: string;
    note?: string;
    utm?: Record<string, string>;
  };

  const cleanZip = typeof zip === 'string' ? zip.trim().slice(0, 10) : undefined;

  if (!cleanZip && typeof latitude !== 'number') {
    return NextResponse.json({ error: 'ZIP required' }, { status: 400 });
  }

  if (cleanZip && !/^\d{5}(-\d{4})?$/.test(cleanZip)) {
    return NextResponse.json({ error: 'Enter a valid 5-digit ZIP' }, { status: 400 });
  }

  await demand.record({
    zip: cleanZip,
    latitude,
    longitude,
    label: typeof label === 'string' ? label.slice(0, MAX_NOTE_LENGTH) : undefined,
    requested: true,
    contact: typeof contact === 'string' ? contact.slice(0, MAX_CONTACT_LENGTH) : undefined,
    note: typeof note === 'string' ? note.slice(0, MAX_NOTE_LENGTH) : undefined,
    utm,
  });

  return NextResponse.json({ ok: true });
}
