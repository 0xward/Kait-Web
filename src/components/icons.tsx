// Small shared icon set, kept as plain inline SVG (no icon library)
// so every glyph stays on-brand and license-free.

export function IconSpark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0c.6 4.8 2.2 8 6 9.5-3.8 1.5-5.4 4.7-6 9.5-.6-4.8-2.2-8-6-9.5 3.8-1.5 5.4-4.7 6-9.5z" />
    </svg>
  );
}

export function IconArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 12L12 4M5 4h7v7" strokeLinecap="square" />
    </svg>
  );
}

export function IconBracket({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 3H3v3M11 3h2v3M5 13H3v-3M11 13h2v-3" strokeLinecap="square" />
    </svg>
  );
}

export function IconCopy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <rect x="5" y="5" width="8" height="8" />
      <path d="M3 11V3h8" />
    </svg>
  );
}

export function IconHexagon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M16 3l12 7v12l-12 7-12-7V10z" />
    </svg>
  );
}

export function IconNestedSquares({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <rect x="3" y="3" width="26" height="26" />
      <rect x="10" y="10" width="12" height="12" />
    </svg>
  );
}

export function IconAsterisk({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M16 4v24M5 10l22 12M27 10L5 22" />
    </svg>
  );
}

export function IconTarget({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M4 4h6M4 4v6M28 4h-6M28 4v6M4 28h6M4 28v-6M28 28h-6M28 28v-6" strokeLinecap="square" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  );
}

export function IconDotGrid({ className = "" }: { className?: string }) {
  const dots = [];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      dots.push(<circle key={`${x}-${y}`} cx={6 + x * 10} cy={6 + y * 10} r="2" />);
    }
  }
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      {dots}
    </svg>
  );
}

export function IconGlobe({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 4 5.7 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.7-4-9s1.5-6.5 4-9z" />
    </svg>
  );
}

export function IconPlus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M8 2v12M2 8h12" strokeLinecap="square" />
    </svg>
  );
}

export function IconDoc({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <path d="M9 4h10l5 5v19H9z" />
      <path d="M19 4v5h5M13 16h8M13 21h8M13 26h5" />
    </svg>
  );
}

export function IconCloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <path d="M9 22a5 5 0 010-10 7 7 0 0113.4-2A5.5 5.5 0 0123 22z" />
      <path d="M12 26l-1.5 4M16 26l-1.5 4M20 26l-1.5 4" />
    </svg>
  );
}

export function IconAperture({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <circle cx="16" cy="16" r="13" />
      <path d="M16 6v8l7 4M9 22l5-3M23 22l-5-3" />
    </svg>
  );
}

export function IconChat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <path d="M5 6h22v14H14l-6 6v-6H5z" />
      <path d="M10 11h12M10 15h8" />
    </svg>
  );
}
