'use client';

import { useActionState, useState } from 'react';

import { importCsv, type ImportState } from '@/lib/actions';
import { CSV_TEMPLATE, parseCsv, type ParseReport } from '@/lib/csv';
import type { Retailer } from '@/lib/types';

/**
 * CSV bulk import with a mandatory preview step.
 *
 * Parsing and validation run in the browser so the operator sees exactly what will happen
 * before anything is written. The commit re-parses server-side — client validation is a
 * convenience, never the gate.
 */
export function CsvImport({ existing }: { existing: Retailer[] }) {
  const [text, setText] = useState('');
  const [report, setReport] = useState<ParseReport | null>(null);
  const [state, action, pending] = useActionState<ImportState, FormData>(importCsv, null);

  function preview(value: string) {
    setText(value);
    setReport(value.trim() ? parseCsv(value, existing) : null);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    preview(await file.text());
  }

  return (
    <div className="max-w-4xl">
      <div className="border border-hairline bg-surface p-5">
        <p className="meta text-acid">1 — PASTE OR UPLOAD</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={onFile}
            className="meta text-muted file:mr-3 file:border file:border-hairline-strong file:bg-ink file:px-3 file:py-2 file:text-paper hover:file:border-acid"
          />
          <button
            type="button"
            onClick={() => preview(CSV_TEMPLATE)}
            className="meta border border-hairline-strong px-3 py-2 text-muted transition-colors hover:border-acid hover:text-acid"
          >
            LOAD TEMPLATE
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => preview(e.target.value)}
          rows={8}
          spellCheck={false}
          placeholder={CSV_TEMPLATE}
          className="mt-4 w-full border border-hairline-strong bg-ink px-3 py-2.5 font-mono text-[12px] text-paper placeholder:text-muted focus:border-acid focus:outline-none"
        />
      </div>

      {report && (
        <div className="mt-4 border border-hairline bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="meta text-acid">2 — PREVIEW</p>
            <p className="meta text-muted">
              <span className="text-acid">{report.validCount} OK</span>
              {report.errorCount > 0 && (
                <span className="ml-3 text-magenta">{report.errorCount} BLOCKED</span>
              )}
            </p>
          </div>

          {report.missingHeaders.length > 0 ? (
            <p className="meta mt-4 border border-magenta p-4 text-magenta">
              MISSING COLUMNS: {report.missingHeaders.join(', ')}
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-hairline">
                    {['LINE', 'STORE', 'ADDRESS', 'STATUS'].map((h) => (
                      <th key={h} className="meta py-2 pr-4 text-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((row) => (
                    <tr key={row.line} className="border-b border-hairline align-top">
                      <td className="py-2.5 pr-4 text-[12px] text-muted tabular">{row.line}</td>
                      <td className="py-2.5 pr-4 text-[13px] text-paper">
                        {row.raw.store_name || <span className="text-muted">—</span>}
                      </td>
                      <td className="py-2.5 pr-4 text-[12px] text-muted">
                        {[row.raw.address, row.raw.city, row.raw.state, row.raw.zip]
                          .filter(Boolean)
                          .join(', ')}
                      </td>
                      <td className="py-2.5 text-[12px]">
                        {row.errors.length > 0 ? (
                          <ul className="text-magenta">
                            {row.errors.map((err) => (
                              <li key={err}>{err}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-acid">READY</span>
                        )}
                        {row.warnings.map((w) => (
                          <p key={w} className="text-cab">
                            {w}
                          </p>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-4 text-[11px] leading-relaxed text-muted">
            Rows with errors are skipped. Every valid row is geocoded during import — any
            address that can&apos;t be resolved is reported back by name rather than being
            dropped on the map at the wrong spot.
          </p>
        </div>
      )}

      <form action={action} className="mt-4">
        <input type="hidden" name="csv" value={text} />
        <button
          type="submit"
          disabled={pending || !report || report.validCount === 0}
          className="display block-press block-shadow-sm bg-acid px-6 py-3.5 text-[16px] text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending
            ? 'IMPORTING…'
            : `IMPORT ${report?.validCount ?? 0} RETAILER${report?.validCount === 1 ? '' : 'S'}`}
        </button>
      </form>

      {state && (
        <div
          role="status"
          className={`mt-4 border p-5 ${state.ok ? 'border-acid' : 'border-magenta'}`}
        >
          <p className={`meta ${state.ok ? 'text-acid' : 'text-magenta'}`}>{state.message}</p>
          {state.failed && state.failed.length > 0 && (
            <ul className="mt-3 text-[12px] text-cab">
              {state.failed.map((f) => (
                <li key={f.name}>
                  {f.name} — {f.reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
