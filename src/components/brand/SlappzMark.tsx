/**
 * SLAPPZ COMPACT MARK — PLACEHOLDER
 *
 * The square `S` used for map pins, the favicon and small avatars. Like the wordmark, this
 * reproduces the brand's construction (acid on black, hard keyline, violet block) without
 * imitating the custom letterform. Swap for the real icon when it arrives.
 */

export function SlappzMark({
  size = 28,
  active = false,
  className = '',
}: {
  size?: number;
  active?: boolean;
  className?: string;
}) {
  const fg = active ? '#000000' : '#96e60b';
  const bg = active ? '#96e60b' : '#000000';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Violet block-extrude, offset down-right — the wordmark's shadow logic at pin scale */}
      <rect x="4" y="4" width="26" height="26" rx="3" fill="#6e2bd9" />
      <rect
        x="1"
        y="1"
        width="26"
        height="26"
        rx="3"
        fill={bg}
        stroke="#96e60b"
        strokeWidth="1.75"
      />
      <text
        x="14"
        y="20.5"
        textAnchor="middle"
        fill={fg}
        fontSize="17"
        fontWeight="900"
        fontFamily="var(--font-display), 'Arial Black', sans-serif"
        // Skew about the glyph's own center rather than the SVG origin, matching the
        // wordmark's incline. Expressed as translate/skew/translate for wider SVG support
        // than transform-origin on a <text> element.
        transform="translate(14 16) skewX(-9) translate(-14 -16)"
        letterSpacing="-0.5"
      >
        S
      </text>
    </svg>
  );
}
