import Link from 'next/link';
import { RetailerForm } from '@/components/admin/RetailerForm';

export default function NewRetailerPage() {
  return (
    <div>
      <Link href="/admin/locations" className="meta text-muted hover:text-acid">
        ← LOCATIONS
      </Link>
      <h1 className="display mt-6 text-[40px] text-paper">ADD RETAILER</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
        Only add a shop once you can point to evidence that it carries SLAPPZ. Record that
        evidence in the verification section — it is what keeps the locator trustworthy.
      </p>

      <div className="mt-8">
        <RetailerForm />
      </div>
    </div>
  );
}
