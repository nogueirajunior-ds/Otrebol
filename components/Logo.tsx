interface LogoProps {
  /** "light" = white wordmark (for dark backgrounds); "dark" = navy wordmark. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * OTREBOL wordmark with a gold mark: a roofline whose ridge doubles as the bow of a key.
 */
export function Logo({ tone = "light", className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        {/* roof */}
        <path d="M3 17 L17 5 L31 17" stroke="rgb(var(--gold))" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        {/* key: bow + shaft + teeth */}
        <circle cx="17" cy="15" r="3.2" stroke="rgb(var(--gold))" strokeWidth="2.2" />
        <path d="M17 18.2 V29 M17 24.5 h4 M17 28 h3" stroke="rgb(var(--gold))" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span
        className={`font-sans text-[1.15rem] font-semibold tracking-[0.32em] ${
          tone === "light" ? "text-white" : "text-navy"
        }`}
      >
        OTREBOL
      </span>
    </span>
  );
}
