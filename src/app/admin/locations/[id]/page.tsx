import Link from 'next/link';
import { notFound } from 'next/navigation';

import { RetailerForm } from '@/components/admin/RetailerForm';
import { findById } from '@/lib/repository/retailers';

export const dynamic = 'force-dynamic';

export default async function EditRetailerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const retailer = await findById(decodeURIComponent(id));

  if (!retailer) notFound();

  return (
    <div>
      <Link href="/admin/locations" className="meta text-muted hover:text-acid">
        ← LOCATIONS
      </Link>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="display text-[36px] text-paper">{retailer.name}</h1>
        <a
          href={`/stores/${retailer.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="meta text-muted hover:text-acid"
        >
          VIEW PUBLIC PAGE ↗
        </a>
      </div>

      <div className="mt-8">
        <RetailerForm retailer={retailer} />
      </div>
    </div>
  );
}
