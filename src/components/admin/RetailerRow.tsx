'use client';

import Link from 'next/link';

import { useTransition } from 'react';

import { deleteRetailer, toggleActive, toggleFeatured } from '@/lib/actions';
import type { Retailer } from '@/lib/types';

const CONFIDENCE_COLOR = {
  high: 'text-acid',
  medium: 'text-cab',
  low: 'text-magenta',
} as const;

export function RetailerRow({ retailer }: { retailer: Retailer }) {
  const [pending, start] = useTransition();

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-3 border border-hairline bg-surface p-4 transition-opacity ${
        pending ? 'opacity-50' : ''
      } ${retailer.active ? '' : 'opacity-60'}`}
    >
      <div className="min-w-[220px] flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="display text-[20px] text-paper">{retailer.name}</h2>
          {!retailer.active && (
            <span className="meta border border-magenta px-1.5 py-0.5 text-[9px] text-magenta">
              INACTIVE
            </span>
          )}
          {retailer.featured && (
            <span className="meta border border-violet px-1.5 py-0.5 text-[9px] text-violet">
              FEATURED
            </span>
          )}
        </div>

        <p className="mt-1 text-[12px] text-muted">
          {retailer.address.street}, {retailer.address.city}, {retailer.address.state}{' '}
          {retailer.address.zip}
        </p>

        <p className="meta mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted">
          <span>{retailer.slug}</span>
          {retailer.lastVerified && <span>VERIFIED {retailer.lastVerified}</span>}
          {retailer.verification && (
            <span className={CONFIDENCE_COLOR[retailer.verification.confidence]}>
              {retailer.verification.confidence.toUpperCase()} CONFIDENCE
            </span>
          )}
          {!retailer.menuUrl && <span className="text-cab">NO MENU URL</span>}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={`/admin/locations/${encodeURIComponent(retailer.id)}`}
          className="meta border border-hairline-strong px-3 py-2 text-paper transition-colors hover:border-acid hover:text-acid"
        >
          EDIT
        </Link>

        <button
          type="button"
          disabled={pending}
          onClick={() => start(() => toggleFeatured(retailer.id, !retailer.featured))}
          className="meta border border-hairline-strong px-3 py-2 text-paper transition-colors hover:border-violet hover:text-violet"
        >
          {retailer.featured ? 'UNFEATURE' : 'FEATURE'}
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={() => start(() => toggleActive(retailer.id, !retailer.active))}
          className="meta border border-hairline-strong px-3 py-2 text-paper transition-colors hover:border-acid hover:text-acid"
        >
          {retailer.active ? 'DEACTIVATE' : 'ACTIVATE'}
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm(`Remove ${retailer.name}? Seeded retailers are deactivated instead.`)) {
              start(() => deleteRetailer(retailer.id));
            }
          }}
          className="meta border border-hairline-strong px-3 py-2 text-muted transition-colors hover:border-magenta hover:text-magenta"
        >
          DELETE
        </button>
      </div>
    </div>
  );
}
