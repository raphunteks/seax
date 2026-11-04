import { SEA_BOX, SEA_PATH } from "./logoPaths";

interface Props {
  className?: string;
}

/** The "sea" wordmark from the owner's logo. Fills with the current text color; size it with the font size. */
export function Wordmark({ className = "" }: Props) {
  return (
    <svg viewBox={SEA_BOX} role="img" aria-label="Kopi SEA" className={`inline-block h-[0.62em] w-auto align-middle ${className}`}>
      <path d={SEA_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
