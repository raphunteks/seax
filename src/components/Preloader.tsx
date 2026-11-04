import { useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { Wordmark } from "./Wordmark";

/** Under a second, never gates content: the page renders underneath it. */
export function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (!show) return;
    const id = window.setTimeout(() => setShow(false), 550);
    return () => window.clearTimeout(id);
  }, [show]);

  return (
    <AnimatePresence>
      {show && !reduce ? (
        <m.div
          key="preloader"
          aria-hidden="true"
          className="fixed inset-0 z-[100] grid place-items-center bg-ink"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        >
          <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}>
            <Wordmark className="text-6xl text-glow" />
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
