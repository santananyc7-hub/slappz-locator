import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Favicon built from the compact mark placeholder. Replace with the real icon asset. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          border: '4px solid #96e60b',
          color: '#96e60b',
          fontSize: 42,
          fontWeight: 900,
          fontFamily: 'sans-serif',
          textShadow: '3px 3px 0 #6e2bd9',
        }}
      >
        S
      </div>
    ),
    size,
  );
}
