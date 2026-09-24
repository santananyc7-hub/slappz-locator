import type { Metadata } from 'next';
import Link from 'next/link';

import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { PageHero } from '@/components/site/PageHero';
import { ProductCard } from '@/components/home/ProductCard';
import { ArrowIcon } from '@/components/brand/Icons';
import { products } from '@/data/products';
import { JsonLd } from '@/components/site/JsonLd';
import { productListLd, breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Products — SLAPPZ 1g Pre-Rolls',
  description:
    'SLAPPZ 1g pre-rolls, sold at licensed New York dispensaries. See the range and find the nearest shop carrying it.',
  alternates: { canonical: '/products' },
};

/**
 * PRODUCTS.
 *
 * Only SKUs with public evidence appear here. No potency figures, terpene profiles, effects
 * or award claims — none of that is verified, and inventing it on a cannabis brand's site is
 * both a compliance problem and a trust problem. See CLAUDE.md § RETAILER RULES.
 */
export default function ProductsPage() {
  return (
    <>
      <JsonLd data={productListLd(products, '/products')} />
      <JsonLd data={breadcrumbLd([{ name: 'Products', path: '/products' }])} />
      <Header />
      <main>
        <PageHero
          kicker="PRODUCTS"
          title={
            <>
              THE <span className="text-acid">LINEUP</span>
            </>
          }
          lead="Premium New York flower, rolled. Sold through licensed dispensaries across the city."
        >
          <Link
            href="/#locator"
            className="display block-press block-shadow mt-7 inline-flex h-14 items-center gap-2 bg-acid px-6 text-[16px] text-ink"
          >
            FIND A SHOP
            <ArrowIcon size={16} />
          </Link>
        </PageHero>

        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1400px]">
            {/* Two columns, not three. With two SKUs a three-column grid leaves a visibly empty
                third cell, which reads as a product that failed to load rather than a range
                of two. Restore lg:grid-cols-3 if a third SKU is ever confirmed. */}
            <div className="grid gap-2.5 sm:grid-cols-2">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-10 border-t border-hairline pt-8">
              <h2 className="display text-[26px] text-paper">A NOTE ON WHAT&apos;S LISTED</h2>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted">
                SLAPPZ products are made under a New York OCM Processor (Type 3) licence and
                tested under the state&apos;s regulated framework before they reach a shelf.
                Which SKUs a given shop has in stock is up to that shop and changes
                constantly — this page shows the range, not any single store&apos;s menu.
              </p>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted">
                Availability at a specific retailer is only shown on that retailer&apos;s page
                when it has actually been confirmed.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
