import type { MetadataRoute } from 'next';

import { listActive } from '@/lib/repository/retailers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://slappz.nyc';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const retailers = await listActive();

  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/where-to-buy-slappz`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${SITE_URL}/products`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}/wholesale`, changeFrequency: 'monthly' as const, priority: 0.6 },
    ...retailers.map((r) => ({
      url: `${SITE_URL}/stores/${r.slug}`,
      lastModified: r.lastVerified ? new Date(r.lastVerified) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
