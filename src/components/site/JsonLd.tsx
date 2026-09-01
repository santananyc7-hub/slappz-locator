/**
 * Renders one structured-data block.
 *
 * `dangerouslySetInnerHTML` is the documented way to emit JSON-LD in React, and it is safe
 * here because every object comes from `src/lib/seo.ts` — developer-authored shapes over
 * repository data, never user input. Nothing from a search box or form reaches this string.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
