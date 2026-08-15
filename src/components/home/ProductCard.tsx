import Image from 'next/image';
import Link from 'next/link';

import { ArrowIcon } from '@/components/brand/Icons';
import type { Product } from '@/lib/types';

/**
 * Product card.
 *
 * Renders a real pack shot when `product.image` is set, and falls back to a TYPOGRAPHIC
 * treatment when it isn't — the format number blown up and given the wordmark's violet
 * block-shadow.
 *
 * The fallback exists because there is still no SLAPPZ product photography in the repo, and
 * inventing a render of the packaging is off the table (CLAUDE.md § NEVER). Dropping a file
 * into /public/brand/slappz/product/ and setting `image` on the product is all that is
 * needed to switch a card over — no layout changes. See /brand/ASSET_MANIFEST.md § 2.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="grain group flex flex-col justify-between border border-hairline bg-surface p-5 transition-colors hover:border-hairline-strong sm:min-h-[300px] sm:p-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="meta text-muted">{product.category?.replace('-', ' ')}</p>
          {product.strainType && (
            <span className="meta border border-hairline-strong px-2 py-1 text-[9px] text-acid">
              {product.strainType}
            </span>
          )}
        </div>

        {product.image ? (
          <div className="relative mt-4 aspect-4/3 w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
        ) : (
          <p
            className="display mt-6 text-[64px] leading-[0.85] text-acid sm:text-[80px]"
            style={{ textShadow: '4px 4px 0 var(--color-violet)' }}
            aria-hidden="true"
          >
            {product.format}
          </p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="display text-[24px] text-paper sm:text-[28px]">{product.name}</h3>
        {product.tagline && (
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{product.tagline}</p>
        )}

        <Link
          href="/#locator"
          className="meta mt-5 flex min-h-11 w-full items-center justify-center gap-2 bg-acid text-ink transition-transform hover:-translate-y-px"
        >
          FIND THIS
          <ArrowIcon size={13} />
        </Link>
      </div>
    </article>
  );
}
