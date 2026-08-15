import Link from 'next/link';

import { CsvImport } from '@/components/admin/CsvImport';
import { listAll } from '@/lib/repository/retailers';

export const dynamic = 'force-dynamic';

export default async function ImportPage() {
  const existing = await listAll();

  return (
    <div>
      <Link href="/admin/locations" className="meta text-muted hover:text-acid">
        ← LOCATIONS
      </Link>

      <h1 className="display mt-6 text-[36px] text-paper">BULK IMPORT</h1>
      <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted">
        Required columns: <span className="text-paper">store_name, address, city, state, zip</span>.
        Optional: menu_url, website, phone, neighborhood, instagram. Existing shops matched by
        name are updated rather than duplicated.
      </p>

      <div className="mt-8">
        <CsvImport existing={existing} />
      </div>
    </div>
  );
}
