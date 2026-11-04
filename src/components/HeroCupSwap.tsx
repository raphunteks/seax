import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { DrinkKind } from "../data/menu";
import { CupArt } from "./CupArt";

/** Cross-fades the hero cup when the visitor picks another drink. Motion owns this component. */
export function HeroCupSwap({ kind, label }: { kind: DrinkKind; label: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="grid">
      <AnimatePresence initial={false}>
        <m.div
          key={kind}
          className="col-start-1 row-start-1"
          initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
        >
          <CupArt kind={kind} label={label} className="block w-full" />
        </m.div>
      </AnimatePresence>
    </div>
  );
}
