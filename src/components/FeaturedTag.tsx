import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { formatIDR, type MenuItem } from "../data/menu";

/** Pill that names the drink currently shown in the hero. Motion owns this component. */
export function FeaturedTag({ item }: { item: MenuItem }) {
  const reduce = useReducedMotion();
  return (
    <div className="inline-flex min-h-9 items-center rounded-full border border-line bg-panel px-4 py-2" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={item.slug}
          className="font-mono text-[12px] tracking-[0.06em] whitespace-nowrap text-on-surface uppercase"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
        >
          {item.name} <span className="text-accent">{formatIDR(item.price)}</span>
        </m.span>
      </AnimatePresence>
    </div>
  );
}
