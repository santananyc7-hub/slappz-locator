import { ImageResponse } from 'next/og';

export const alt = 'FIND SLAPPZ — where to buy SLAPPZ in NYC';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Social card. Uses the brand's construction logic — acid on black with a violet block
 * extrude — rather than the real wordmark, which is still a placeholder here. Regenerate
 * from the master logo once it arrives (/brand/ASSET_MANIFEST.md).
 */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#000000',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 6,
            color: '#8a8a93',
            fontWeight: 700,
          }}
        >
          LICENSED NEW YORK DISPENSARIES
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 24,
            fontSize: 190,
            lineHeight: 0.85,
            fontWeight: 900,
            letterSpacing: -6,
            color: '#ffffff',
          }}
        >
          <span>FIND</span>
          <span style={{ color: '#96e60b', textShadow: '10px 10px 0 #6e2bd9' }}>SLAPPZ</span>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 48,
            alignSelf: 'flex-start',
            background: '#96e60b',
            color: '#000000',
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 3,
            padding: '18px 30px',
            boxShadow: '8px 8px 0 #6e2bd9',
          }}
        >
          THE BRAND THAT SLAPPZ
        </div>
      </div>
    ),
    size,
  );
}
