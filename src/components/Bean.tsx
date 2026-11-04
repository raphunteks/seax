interface Props {
  className?: string;
}

/** One roasted coffee bean, drawn flat. */
export function Bean({ className }: Props) {
  return (
    <svg viewBox="0 0 40 56" className={className} aria-hidden="true">
      <ellipse cx="20" cy="28" rx="17" ry="25" fill="#3a2012" />
      <ellipse cx="14" cy="20" rx="5" ry="10" fill="#ffffff" fillOpacity="0.1" />
      <path d="M20 4 C10 18 30 38 20 52" fill="none" stroke="#1b0e08" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
