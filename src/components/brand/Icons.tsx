/**
 * Inline icon set.
 *
 * Twelve hand-written paths instead of an icon dependency — smaller, and the stroke weight
 * is tuned to match the brand's hard-edged graphic language (2px, square caps, no rounding).
 */

type IconProps = {
  size?: number;
  className?: string;
};

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
  className,
  'aria-hidden': true,
  focusable: 'false' as const,
});

export const PinIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const NavIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M3 11 21 3l-8 18-2-7-8-3Z" />
  </svg>
);

export const CrosshairIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="12" r="7" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);

export const SearchIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 5 5" />
  </svg>
);

export const PhoneIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </svg>
);

export const BagIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M4 7h16l-1.2 13H5.2L4 7Z" />
    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
  </svg>
);

export const ArrowIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const CheckIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="m4 12 5 5L20 6" />
  </svg>
);

export const CloseIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="m5 5 14 14M19 5 5 19" />
  </svg>
);

export const InstagramIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const GlobeIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
  </svg>
);

export const SpinnerIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)} className={`animate-spin ${className ?? ''}`}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);
