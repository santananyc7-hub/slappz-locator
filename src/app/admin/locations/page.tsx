import Link from 'next/link';
import { listAll } from '@/lib/repository/retailers';
import { RetailerRow } from '@/components/admin/RetailerRow';

export const dynamic = 'force-dynamic';

export default async function LocationsPage() {
  const retailers = await listAll();
  const active = retailers.filter((r) => r.active).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[36px] text-paper">LOCATIONS</h1>
          <p className="meta mt-2 text-muted">
            {active} ACTIVE · {retailers.length} TOTAL
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/locations/import"
            className="meta border border-hairline-strong px-4 py-3 text-paper transition-colors hover:border-acid hover:text-acid"
          >
            BULK IMPORT
          </Link>
          <Link href="/admin/locations/new"
            className="meta block-press block-shadow-sm bg-acid px-4 py-3 text-ink"
          >
            + ADD RETAILER
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        {retailers.length === 0 ? (
          <p className="border border-hairline bg-surface p-6 text-[14px] text-muted">
            No retailers yet. Add one, or bulk import a CSV.
          </p>
        ) : (
          retailers.map((retailer) => <RetailerRow key={retailer.id} retailer={retailer} />)
        )}
      </div>

      <p className="mt-8 border-t border-hairline pt-6 text-[12px] leading-relaxed text-muted">
        Retailers seeded in the repository are deactivated rather than deleted, so their
        verification history survives. Only retailers created here can be removed outright.
      </p>
    </div>
  );
}
