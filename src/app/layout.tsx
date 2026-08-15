import type { Metadata, Viewport } from 'next';
import { Archivo, Inter } from 'next/font/google';

import { AgeGate } from '@/components/site/AgeGate';
import { SITE_URL } from '@/lib/site';
import './globals.css';

/**
 * Self-hosted via next/font — no external font request, which matters inside the Instagram
 * in-app browser where every extra connection is felt. Archivo carries the width axis used
 * for the condensed display voice; see /brand/SLAPPZ_DIGITAL_SYSTEM.md § 4.
 */
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  // Variable across both weight and width. The width axis is what produces the condensed
  // display voice (`font-variation-settings: 'wdth' 88` in the `display` utility), and
  // next/font only permits `axes` when the weight axis is left variable.
  axes: ['wdth'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'FIND SLAPPZ — Where to Buy SLAPPZ in NYC',
    template: '%s — SLAPPZ',
  },
  description:
    'Find the licensed New York dispensaries carrying SLAPPZ 1g pre-rolls. Search by ZIP, city or address and get directions to the nearest shop.',
  applicationName: 'SLAPPZ Locator',
  keywords: [
    'SLAPPZ',
    'SLAPPZ HQ',
    'where to buy SLAPPZ',
    'SLAPPZ NYC',
    'SLAPPZ Queens',
    'SLAPPZ Brooklyn',
    'SLAPPZ dispensary locator',
    'SLAPPZ pre-rolls',
  ],
  openGraph: {
    type: 'website',
    siteName: 'SLAPPZ',
    title: 'FIND SLAPPZ',
    description: 'Where to buy SLAPPZ right now. Licensed NY dispensaries, nearest first.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIND SLAPPZ',
    description: 'Where to buy SLAPPZ right now.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning is required, not cosmetic: the age-gate script below sets
    // `data-age-ok` on this element before React hydrates, so the client tree legitimately
    // differs from the server tree. Without this, React reports a mismatch on the ROOT
    // element, which is the worst place to have one.
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Runs before first paint. If this visitor already confirmed 21+ and the 30-day
          stamp hasn't lapsed, it marks <html> so CSS hides the age gate immediately —
          otherwise returning visitors would see the site flash behind a modal on every load.
          Kept tiny and inline on purpose: anything async is too late to prevent the flash.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var v=localStorage.getItem('slappz:age-verified');if(v&&Date.now()<+v){document.documentElement.setAttribute('data-age-ok','')}}catch(e){}`,
          }}
        />
        {/* Without JavaScript the gate could never be dismissed, so it is not shown at all. */}
        <noscript>
          <style>{`#age-gate{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="bg-ink text-paper antialiased">
        <a
          href="#locator"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-acid focus:px-4 focus:py-2 focus:text-ink focus:meta"
        >
          Skip to locator
        </a>

        {/* Wrapped so the age gate can mark everything behind it inert while it's up. */}
        <div id="site-root">{children}</div>

        <AgeGate />
      </body>
    </html>
  );
}
