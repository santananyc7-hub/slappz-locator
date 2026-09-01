import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { StoreActions } from '@/components/locator/StoreActions';
import { listActive, findBySlug } from '@/lib/repository/retailers';
import { productBySlug } from '@/data/products';
import { formatPhone } from '@/lib/geo';
import { JsonLd } from '@/components/site/JsonLd';
import { storePageLd, breadcrumbLd } from '@/lib/seo';

/**
 * Shareable retailer page.
 *
 * These exist so campaigns can point straight at a shop —
 * "SLAPPZ JUST LANDED IN MIDTOWN" → /stores/torches-nyc?utm_source=packaging — and so each
 * location is independently indexable for "SLAPPZ <neighborhood>" searches.
 */

export async function generateStaticParams() {
  const retailers = await listActive();
  return retailers.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const retailer = await findBySlug(slug);
  if (!retailer) return { title: 'Store not found' };

  const where = [retailer.neighborhood, retailer.borough ?? retailer.address.city]
    .filter(Boolean)
    .join(', ');

  return {
    title: `SLAPPZ at ${retailer.name} — ${where}`,
    description: `${retailer.name} in ${where} carries SLAPPZ. ${retailer.address.street}, ${retailer.address.city}, ${retailer.address.state} ${retailer.address.zip}. Get directions and shop the menu.`,
    alternates: { canonical: `/stores/${retailer.slug}` },
    openGraph: {
      title: `SLAPPZ at ${retailer.name}`,
      description: `Buy SLAPPZ in ${where}.`,
      url: `/stores/${retailer.slug}`,
      // Declaring `openGraph` at all replaces the card inherited from the root
      // `opengraph-image.tsx`, so these pages were shipping with no preview image — on the
      // most-shared pages on the site, the ones campaigns and DMs point straight at. Naming
      // the route explicitly puts it back.
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  };
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const retailer = await findBySlug(slug);

  if (!retailer || !retailer.active) notFound();

  const phone = formatPhone(retailer.phone);
  const where = [retailer.neighborhood, retailer.borough ?? retailer.address.city]
    .filter(Boolean)
    .join(' · ');

  const verifiedProducts = (retailer.availableProducts ?? [])
    .map((s) => productBySlug.get(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <JsonLd data={storePageLd(retailer)} />
      <JsonLd
        data={breadcrumbLd([
          { name: 'Locations', path: '/where-to-buy-slappz' },
          { name: retailer.name, path: `/stores/${retailer.slug}` },
        ])}
      />
      <Header />

      <main className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 sm:py-16">
        <Link href="/" className="meta text-muted transition-colors hover:text-acid">
          ← ALL SLAPPZ SPOTS
        </Link>

        <p className="meta mt-8 text-acid">SLAPPZ HERE</p>

        <h1 className="display mt-3 text-[48px] leading-[0.9] text-paper sm:text-[76px]">
          {retailer.name}
        </h1>

        <p className="meta mt-3 text-muted">{where}</p>

        <div className="mt-8 grain block-shadow border border-acid bg-surface p-5 sm:p-7">
          <p className="meta text-muted">ADDRESS</p>
          <address className="mt-2 text-[16px] leading-relaxed text-paper not-italic">
            {retailer.address.street}
            <br />
            {retailer.address.city}, {retailer.address.state} {retailer.address.zip}
          </address>

          <StoreActions retailer={retailer} />
        </div>

        <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-hairline pt-8 sm:grid-cols-2">
          {phone && (
            <div>
              <dt className="meta text-muted">PHONE</dt>
              <dd className="mt-1.5 text-[15px] text-paper">
                <a href={`tel:${retailer.phone}`} className="hover:text-acid">
                  {phone}
                </a>
              </dd>
            </div>
          )}

          {retailer.website && (
            <div>
              <dt className="meta text-muted">WEBSITE</dt>
              <dd className="mt-1.5 text-[15px] break-all text-paper">
                <a
                  href={retailer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-acid"
                >
                  {retailer.website.replace(/^https?:\/\//, '')}
                </a>
              </dd>
            </div>
          )}

          {retailer.licenseNumber && (
            <div>
              <dt className="meta text-muted">NY OCM LICENSE</dt>
              <dd className="mt-1.5 text-[15px] text-paper tabular">{retailer.licenseNumber}</dd>
            </div>
          )}

          {retailer.lastVerified && (
            <div>
              <dt className="meta text-muted">LAST VERIFIED</dt>
              <dd className="mt-1.5 text-[15px] text-paper tabular">
                {retailer.lastVerified.replaceAll('-', '.')}
              </dd>
            </div>
          )}
        </dl>

        {/* Products render only when availability was actually confirmed for this store. */}
        {verifiedProducts.length > 0 && (
          <section className="mt-10 border-t border-hairline pt-8">
            <h2 className="display text-[26px] text-paper">CONFIRMED HERE</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {verifiedProducts.map((p) => (
                <li
                  key={p.slug}
                  className="meta border border-hairline-strong px-3 py-2 text-paper"
                >
                  {p.name}
                  {p.format && <span className="ml-2 text-muted">{p.format}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 border-t border-hairline pt-6 text-[12px] leading-relaxed text-muted">
          SLAPPZ availability at {retailer.name} is verified periodically and does not reflect
          real-time inventory. Call ahead or check the store menu before you travel. 21+ only.
        </p>
      </main>

      <Footer />
    </>
  );
}
