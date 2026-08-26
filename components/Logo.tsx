/**
 * JP Logo — inline SVG for pixel-perfect rendering everywhere.
 *
 * Variants:
 *  - "full"  → icon + text (header / footer / invoice)
 *  - "mark"  → icon only (small spaces)
 *
 * The SVG uses currentColor so it inherits text colour from its parent,
 * making light/dark/print modes effortless.
 */

interface LogoProps {
  variant?: "full" | "mark";
  /** Override the text beside the icon (defaults to brandLine). */
  text?: string;
  /** Override sub-text (defaults to "by Jordan Peters"). */
  subtext?: string;
  /** Size of the icon square in px. */
  iconSize?: number;
  /** Extra class on the outer wrapper. */
  className?: string;
}

// ── The JP monogram mark ────────────────────────────────────────────────────
function Mark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Rounded square background */}
      <rect width="64" height="64" rx="14" fill="currentColor" />

      {/* J */}
      <path
        d="M20 18v20c0 4.418 3.582 8 8 8h1.5c1.381 0 2.5-1.119 2.5-2.5v-7c0-1.381-1.119-2.5-2.5-2.5H28V18H20z"
        className="fill-white dark:fill-[#070D17]"
      />

      {/* P */}
      <path
        d="M34 18h9c4.418 0 8 3.582 8 8v2c0 4.418-3.582 8-8 8h-7v16h-8V18h16zm8 14c2.21 0 4-1.79 4-4v-2c0-2.21-1.79-4-4-4h-4v10h4z"
        className="fill-white dark:fill-[#070D17]"
      />

      {/* Accent bar */}
      <rect x="8" y="52" width="48" height="4" rx="2" className="fill-orange-500" />
    </svg>
  );
}

export default function Logo({
  variant = "full",
  text = "Jordan Peters Coder Freelancing",
  subtext = "by Jordan Peters",
  iconSize = 40,
  className = "",
}: LogoProps) {
  if (variant === "mark") {
    return <Mark size={iconSize} />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Mark size={iconSize} />
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-tight">{text}</span>
        <span className="text-xs opacity-60 font-medium">{subtext}</span>
      </div>
    </div>
  );
}

/** Pure SVG string — safe for <img> src, email templates, and print. */
export function logoSvgString(fill = "#0a1628"): string {
  return `<svg width="200" height="48" viewBox="0 0 200 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="${fill}"/><path d="M15 14v15c0 3.313 2.687 6 6 6h1.125c1.036 0 1.875-.84 1.875-1.875v-5.25c0-1.036-.84-1.875-1.875-1.875H21V14H15zm12 14c1.657 0 3-1.343 3-3v-1.5c0-1.657-1.343-3-3-3H24v7.5h3z" fill="white"/><path d="M30 14h6.75c3.313 0 6 2.687 6 6v1.5c0 3.313-2.687 6-6 6H33v12H27V14h12zm6 10.5c1.657 0 3-1.343 3-3v-1.5c0-1.657-1.343-3-3-3h-3v7.5h3z" fill="white"/><rect x="6" y="39" width="36" height="3" rx="1.5" fill="#f97316"/><text x="56" y="30" font-family="system-ui,sans-serif" font-size="16" font-weight="700" fill="${fill}">Jordan Peters</text><text x="56" y="44" font-family="system-ui,sans-serif" font-size="9" fill="${fill}" opacity="0.6">Coder Freelancing</text></svg>`;
}
