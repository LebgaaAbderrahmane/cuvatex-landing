// Hand-rolled monoline social icons — lucide-react ships no brand icons.
// Geometric abstractions, not traced logos; `aria-hidden` since the
// accessible label lives on the link in Footer.jsx, not here.

const commonProps = {
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

export function InstagramIcon({ size = 18, style, ...props }) {
  return (
    <svg width={size} height={size} style={style} {...commonProps} {...props}>
      <rect x="3" y="3" width="14" height="14" rx="4" />
      <circle cx="10" cy="10" r="3.2" />
      <circle cx="14.1" cy="5.9" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon({ size = 18, style, ...props }) {
  return (
    <svg width={size} height={size} style={style} {...commonProps} {...props}>
      <rect x="3" y="3" width="14" height="14" rx="4" />
      <circle cx="7" cy="7.2" r="0.6" fill="currentColor" stroke="none" />
      <line x1="7" y1="9.8" x2="7" y2="14.3" />
      <path d="M10.2 14.3V10.6c0-1 .8-1.6 1.7-1.6s1.7.6 1.7 1.6v3.7" />
    </svg>
  );
}

export function GithubIcon({ size = 18, style, ...props }) {
  return (
    <svg width={size} height={size} style={style} {...commonProps} {...props}>
      <rect x="3" y="3" width="14" height="14" rx="4" />
      <path d="M8.2 7.2 5.6 10l2.6 2.8" />
      <path d="M11.8 7.2 14.4 10l-2.6 2.8" />
    </svg>
  );
}

export function XIcon({ size = 18, style, ...props }) {
  return (
    <svg width={size} height={size} style={style} {...commonProps} {...props}>
      <rect x="3" y="3" width="14" height="14" rx="4" />
      <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" />
      <line x1="13.5" y1="6.5" x2="6.5" y2="13.5" />
    </svg>
  );
}
