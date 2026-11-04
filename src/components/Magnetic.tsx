import { useRef, type PointerEvent, type ReactNode } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";

interface Props {
  children: ReactNode;
  strength?: number;
}

/** Pulls its child a few pixels toward the pointer. Critically damped spring, no overshoot. */
export function Magnetic({ children, strength = 0.22 }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 300, damping: 30, mass: 0.5 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.div ref={ref} style={{ x: sx, y: sy, display: "inline-block" }} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </m.div>
  );
}
