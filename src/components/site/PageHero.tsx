/**
 * Shared masthead for the secondary pages.
 *
 * Deliberately quieter than the homepage hero — no background image, no locator. These pages
 * are destinations reached on purpose, so they lead with a clear title rather than an
 * attention-grab.
 */
export function PageHero({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: React.ReactNode;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="grain border-b border-hairline px-4 pt-10 pb-10 sm:px-6 sm:pt-16 sm:pb-14">
      <div className="mx-auto max-w-[1400px]">
        <p className="meta text-acid">{kicker}</p>
        <h1 className="display mt-3 max-w-4xl text-[50px] leading-[0.88] text-paper sm:text-[88px]">
          {title}
        </h1>
        {lead && (
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted sm:text-[18px]">
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
