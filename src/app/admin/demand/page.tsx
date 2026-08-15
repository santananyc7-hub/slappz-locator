import { aggregate, listSignals } from '@/lib/repository/demand';

export const dynamic = 'force-dynamic';

/**
 * WHERE PEOPLE WANT SLAPPZ.
 *
 * The output of every failed search. This is the screen that eventually tells the sales team
 * which ZIP to walk into next.
 */
export default async function DemandPage() {
  const [rows, signals] = await Promise.all([aggregate(), listSignals()]);

  const max = rows[0]?.count ?? 1;
  const totalRequests = rows.reduce((sum, r) => sum + r.requests, 0);
  const recent = [...signals].reverse().slice(0, 12);

  return (
    <div>
      <h1 className="display text-[36px] text-paper">WHERE PEOPLE WANT SLAPPZ</h1>
      <p className="meta mt-2 text-muted">
        {signals.length} SIGNALS · {rows.length} ZIPS · {totalRequests} DIRECT REQUESTS
      </p>

      {rows.length === 0 ? (
        <div className="mt-8 border border-hairline bg-surface p-8">
          <p className="display text-[24px] text-paper">NOTHING YET.</p>
          <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-muted">
            Every search that finds no SLAPPZ nearby lands here, along with anyone who submits
            BRING SLAPPZ HERE. Ranked by volume, it becomes a distribution map.
          </p>
        </div>
      ) : (
        <div className="mt-8 border border-hairline bg-surface p-5 sm:p-6">
          <ul className="flex flex-col gap-3.5">
            {rows.map((row) => (
              <li key={row.zip}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="display text-[20px] text-paper tabular">{row.zip}</span>
                  <span className="meta text-muted">
                    {row.label}
                    {row.requests > 0 && (
                      <span className="ml-3 text-acid">{row.requests} ASKED DIRECTLY</span>
                    )}
                  </span>
                  <span className="display text-[20px] text-acid tabular">{row.count}</span>
                </div>

                <div
                  className="mt-1.5 h-2.5 bg-ink"
                  role="img"
                  aria-label={`${row.count} searches from ${row.zip}`}
                >
                  <div
                    className="h-full bg-acid"
                    style={{ width: `${Math.max(4, (row.count / max) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recent.some((s) => s.contact) && (
        <section className="mt-8">
          <h2 className="display text-[24px] text-paper">RECENT REQUESTS WITH CONTACT</h2>
          <p className="mt-1.5 text-[12px] text-muted">
            Self-submitted through BRING SLAPPZ HERE. Treat as opt-in for launch news only.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {recent
              .filter((s) => s.contact)
              .map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border border-hairline bg-surface p-3.5"
                >
                  <span className="display text-[16px] text-paper tabular">{s.zip}</span>
                  <span className="text-[13px] text-acid">{s.contact}</span>
                  <span className="meta ml-auto text-muted">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      )}

      <p className="mt-8 border-t border-hairline pt-6 text-[12px] leading-relaxed text-muted">
        Signals are anonymous. Coordinates are rounded to roughly one kilometre before they are
        stored, and no IP address, device identifier or session is recorded. Contact details
        appear only when a customer typed them in themselves.
      </p>
    </div>
  );
}
