import { useEffect } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

interface Link {
  href: string;
  label: string;
}

interface Props {
  open: boolean;
  links: readonly Link[];
  onClose: () => void;
}

const EASE = [0.2, 0, 0, 1] as const;

/** Full-screen link list for phones. Motion owns this component. */
export function MobileMenu({ open, links, onClose }: Props) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <m.nav
          id="mobile-menu"
          aria-label="Menu utama"
          className="fixed inset-x-0 top-14 bottom-0 tone-dark z-40 flex flex-col justify-center gap-2 bg-surface px-6 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          {links.map((l, i) => (
            <m.a
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="display border-b border-line py-4 text-4xl text-on-surface"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.07 * i }}
            >
              {l.label}
            </m.a>
          ))}
        </m.nav>
      ) : null}
    </AnimatePresence>
  );
}
