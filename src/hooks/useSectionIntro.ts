import type { RefObject } from "react";
import { gsap, NO_PREF, SplitText, useGSAP } from "../lib/gsap";

/**
 * One-time entrance per section (thesis: 700 ms, 70 ms stagger, ease kopi).
 * [data-split]  headline lines rise through a mask
 * [data-reveal] block fades up
 * Under reduced motion nothing is hidden or moved.
 */
export function useSectionIntro(scope: RefObject<HTMLElement | null>): void {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(
        NO_PREF,
        () => {
          gsap.utils.toArray<HTMLElement>("[data-split]", root).forEach((el) => {
            SplitText.create(el, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit(self) {
                return gsap.from(self.lines, {
                  yPercent: 110,
                  duration: 0.7,
                  ease: "kopi",
                  stagger: 0.07,
                  scrollTrigger: { trigger: el, start: "top 88%", once: true },
                });
              },
            });
          });
          gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el) => {
            gsap.from(el, {
              y: 24,
              opacity: 0,
              duration: 0.7,
              ease: "kopi",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            });
          });
        },
        root,
      );
      // Reduced motion: no travel, only a short cross-fade.
      mm.add(
        "(prefers-reduced-motion: reduce)",
        () => {
          gsap.utils.toArray<HTMLElement>("[data-split], [data-reveal]", root).forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              duration: 0.4,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            });
          });
        },
        root,
      );
      return () => mm.revert();
    },
    { scope },
  );
}
