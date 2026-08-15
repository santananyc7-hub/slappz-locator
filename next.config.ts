import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The locator lives on the homepage, so /find is not a separate route — but it is a
      // short, memorable URL for QR codes, packaging and campaign links, so it stays valid.
      // Next preserves the query string, which keeps /find?q=11373&utm_source=packaging working.
      { source: '/find', destination: '/', permanent: false },
      // Older/alternate spellings of the locations page.
      { source: '/locations', destination: '/where-to-buy-slappz', permanent: false },
      { source: '/stores', destination: '/where-to-buy-slappz', permanent: false },
    ];
  },
};

export default nextConfig;
