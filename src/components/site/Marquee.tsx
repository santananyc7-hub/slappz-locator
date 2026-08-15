/**
 * Drop-culture ticker strip.
 *
 * Uses SLAPPZ's own copy — the tagline and the four trade pillars. Duplicated once so the
 * CSS translate(-50%) loop is seamless; the copy is decorative, so the duplicate is hidden
 * from assistive tech and the whole strip carries a single accessible label.
 */

const ITEMS = [
  'THE BRAND THAT SLAPPZ',
  'PREMIUM FLOWER',
  'BOLD FLAVORS',
  'CONSISTENT QUALITY',
  'NYC INSPIRED',
  'CULTURE FOCUSED',
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden ? 'true' : undefined}>
      {ITEMS.map((item) => (
        <span key={item} className="meta flex items-center px-4 py-1.5 text-ink">
          {item}
          <span className="ml-4 text-violet" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div
      className="overflow-hidden border-y border-ink bg-acid"
      role="marquee"
      aria-label="THE BRAND THAT SLAPPZ — premium flower, bold flavors, consistent quality, NYC inspired, culture focused"
    >
      <div className="marquee-track">
        <Row hidden />
        <Row hidden />
      </div>
    </div>
  );
}
