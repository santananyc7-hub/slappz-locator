import { SlappzWordmark } from '@/components/brand/SlappzWordmark';

/**
 * Compliance lives here: 21+, licensed-retailer language, and an honest statement that
 * inventory is not real-time. Present and unambiguous, but not visually overwhelming — a
 * wall of legal text at the bottom of a locator helps nobody.
 */
export function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <SlappzWordmark size="md" />
          <span className="display border-2 border-acid px-3 py-1.5 text-[20px] text-acid">
            21+
          </span>
        </div>

        <div className="mt-8 grid gap-6 border-t border-hairline pt-8 text-[12px] leading-relaxed text-muted sm:grid-cols-2">
          <p>
            For adults 21 and over. SLAPPZ products are sold exclusively through licensed New
            York State cannabis retailers. Please consume responsibly and keep out of reach of
            children and pets.
          </p>
          <p>
            Retailer listings are verified periodically and{' '}
            <strong className="text-paper">do not reflect real-time inventory</strong>. Stock,
            hours and pricing are set by each retailer and can change without notice — contact
            the shop to confirm availability before travelling.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
          <p className="meta text-muted">© {new Date().getFullYear()} SLAPPZ HQ · NYC</p>
          <a
            href="https://www.instagram.com/slappz_hq/"
            target="_blank"
            rel="noopener noreferrer"
            className="meta inline-flex min-h-11 items-center text-muted transition-colors hover:text-acid"
          >
            @SLAPPZ_HQ
          </a>
        </div>
      </div>
    </footer>
  );
}
