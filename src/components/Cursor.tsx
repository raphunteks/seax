import { useRef } from "react";
import { gsap, NO_PREF, useGSAP } from "../lib/gsap";

/** Soft ring that follows a mouse and grows over interactive elements. Off for touch and reduced motion. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`(pointer: fine) and ${NO_PREF}`, () => {
        gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
        const xTo = gsap.quickTo(el, "x", { duration: 0.2, ease: "kopi" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.2, ease: "kopi" });
        const move = (e: PointerEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
          gsap.to(el, { opacity: 1, duration: 0.2, overwrite: "auto" });
        };
        const over = (e: PointerEvent) => {
          const hit = (e.target as Element | null)?.closest("a, button, [data-cursor]");
          gsap.to(el, { scale: hit ? 2.8 : 1, duration: 0.2, ease: "kopi", overwrite: "auto" });
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerover", over);
        return () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerover", over);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] h-4 w-4 rounded-full bg-white mix-blend-difference"
      style={{ opacity: 0 }}
    />
  );
}
