import type { Retailer } from './types';

/**
 * CSV bulk import.
 *
 * Expected header (order-independent, extra columns ignored):
 *   store_name,address,city,state,zip,menu_url,website,phone,neighborhood,instagram
 *
 * Parsing is done here rather than with a dependency because the format is small and
 * well-defined, and a CSV parser is not worth a package on a locator's bundle budget. It
 * does handle the two things that actually break naive splitting: quoted fields containing
 * commas, and escaped double quotes.
 */

export type ParsedRow = {
  line: number;
  raw: Record<string, string>;
  /** Populated when the row is valid enough to import. */
  retailer?: Omit<Retailer, 'coordinates'> & { coordinates?: Retailer['coordinates'] };
  errors: string[];
  warnings: string[];
};

export type ParseReport = {
  rows: ParsedRow[];
  validCount: number;
  errorCount: number;
  missingHeaders: string[];
};

const REQUIRED_HEADERS = ['store_name', 'address', 'city', 'state', 'zip'];

/** RFC-4180-ish splitter: handles quoted fields, embedded commas, and "" escapes. */
function splitLine(line: string): string[] {
  const out: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      out.push(field);
      field = '';
    } else {
      field += ch;
    }
  }

  out.push(field);
  return out.map((f) => f.trim());
}

export function parseCsv(
  text: string,
  existing: Retailer[] = [],
  slugify: (s: string) => string = defaultSlugify,
): ParseReport {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { rows: [], validCount: 0, errorCount: 0, missingHeaders: REQUIRED_HEADERS };
  }

  const headers = splitLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, '_'));
  const missingHeaders = REQUIRED_HEADERS.filter((h) => !headers.includes(h));

  if (missingHeaders.length > 0) {
    return { rows: [], validCount: 0, errorCount: 0, missingHeaders };
  }

  const seenInFile = new Set<string>();
  const rows: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitLine(lines[i]);
    const raw: Record<string, string> = {};
    headers.forEach((h, idx) => {
      raw[h] = values[idx] ?? '';
    });

    const errors: string[] = [];
    const warnings: string[] = [];

    const name = raw.store_name;
    const street = raw.address;
    const city = raw.city;
    const state = raw.state?.toUpperCase();
    const zip = raw.zip;

    if (!name) errors.push('store_name is required');
    if (!street) errors.push('address is required');
    if (!city) errors.push('city is required');
    if (!state) errors.push('state is required');
    else if (!/^[A-Z]{2}$/.test(state)) errors.push('state must be a 2-letter code');
    if (!zip) errors.push('zip is required');
    else if (!/^\d{5}(-\d{4})?$/.test(zip)) errors.push('zip must be 5 digits');

    const phone = raw.phone?.replace(/\D/g, '');
    if (raw.phone && phone && phone.length !== 10) {
      warnings.push('phone is not 10 digits — it will be stored as given');
    }

    for (const key of ['menu_url', 'website'] as const) {
      const value = raw[key];
      if (value && !/^https?:\/\//i.test(value)) {
        errors.push(`${key} must start with http:// or https://`);
      }
    }

    const slug = name ? slugify(name) : '';

    if (slug) {
      if (existing.some((r) => r.slug === slug)) {
        warnings.push(`"${name}" already exists — importing will update it`);
      }
      if (seenInFile.has(slug)) {
        errors.push(`duplicate of an earlier row in this file ("${name}")`);
      }
      seenInFile.add(slug);
    }

    const row: ParsedRow = { line: i + 1, raw, errors, warnings };

    if (errors.length === 0) {
      row.retailer = {
        id: `ret_${slug.replace(/-/g, '_')}`,
        slug,
        name,
        address: { street, city, state, zip },
        neighborhood: raw.neighborhood || undefined,
        website: raw.website || undefined,
        menuUrl: raw.menu_url || undefined,
        phone: phone || undefined,
        instagram: raw.instagram || undefined,
        active: true,
        lastVerified: new Date().toISOString().slice(0, 10),
        verification: {
          source: 'CSV bulk import',
          confidence: 'medium',
        },
      };
      // Coordinates are intentionally absent — the import step geocodes them, so a bad
      // address surfaces as a geocode failure rather than a pin dropped in the ocean.
    }

    rows.push(row);
  }

  return {
    rows,
    validCount: rows.filter((r) => r.errors.length === 0).length,
    errorCount: rows.filter((r) => r.errors.length > 0).length,
    missingHeaders: [],
  };
}

function defaultSlugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const CSV_TEMPLATE =
  'store_name,address,city,state,zip,menu_url,website,phone,neighborhood,instagram\n' +
  'Example Dispensary,123 Example Street,Queens,NY,11373,https://example.com/menu,https://example.com,7185555555,Elmhurst,@example\n';
