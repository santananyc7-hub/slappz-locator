import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Minimal JSON-document store.
 *
 * This is the swap point for a real database. Everything above it (retailers.ts, demand.ts)
 * talks to this interface, so moving to Supabase/Postgres means writing one new adapter —
 * no component or route changes. See CLAUDE.md § DATA ARCHITECTURE.
 *
 * The file adapter is fine for the MVP: retailer edits are rare and human-driven, and demand
 * signals are append-only and low-volume. It is NOT safe for horizontal scaling or for
 * Vercel's read-only filesystem in production — that is precisely when you write the
 * Postgres adapter.
 */
export interface DocumentStore {
  read<T>(key: string, fallback: T): Promise<T>;
  write<T>(key: string, value: T): Promise<void>;
}

const DATA_DIR = path.join(process.cwd(), '.data');

class FileStore implements DocumentStore {
  private locks = new Map<string, Promise<unknown>>();

  private file(key: string) {
    return path.join(DATA_DIR, `${key}.json`);
  }

  async read<T>(key: string, fallback: T): Promise<T> {
    try {
      const raw = await fs.readFile(this.file(key), 'utf8');
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  async write<T>(key: string, value: T): Promise<void> {
    // Serialize writes per key so concurrent requests can't interleave a read-modify-write.
    const previous = this.locks.get(key) ?? Promise.resolve();
    const next = previous.then(async () => {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const tmp = `${this.file(key)}.${process.pid}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
      await fs.rename(tmp, this.file(key));
    });
    this.locks.set(
      key,
      next.catch(() => undefined),
    );
    await next;
  }
}

/**
 * In-memory fallback for read-only filesystems (e.g. Vercel serverless). Data does not
 * survive a cold start — acceptable for a demo, not for production. Set up the Postgres
 * adapter before relying on admin edits or demand capture in production.
 */
class MemoryStore implements DocumentStore {
  private map = new Map<string, unknown>();
  async read<T>(key: string, fallback: T): Promise<T> {
    return (this.map.get(key) as T) ?? fallback;
  }
  async write<T>(key: string, value: T): Promise<void> {
    this.map.set(key, value);
  }
}

let store: DocumentStore | null = null;

/**
 * Serverless hosts (Vercel, Netlify, Lambda) give you a read-only filesystem outside /tmp,
 * so the file adapter would throw on the first admin save or demand submission. Detecting
 * that here means a deploy works out of the box instead of 500-ing on the first write.
 *
 * MemoryStore does NOT survive a cold start — it is correct for a preview deploy, and the
 * signal that it is time to write the Postgres/Supabase adapter before this carries real
 * traffic. Set SLAPPZ_STORE explicitly to override the detection either way.
 */
function isServerless(): boolean {
  return Boolean(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

export function getStore(): DocumentStore {
  if (store) return store;

  const configured = process.env.SLAPPZ_STORE;
  if (configured === 'memory') store = new MemoryStore();
  else if (configured === 'file') store = new FileStore();
  else store = isServerless() ? new MemoryStore() : new FileStore();

  return store;
}
