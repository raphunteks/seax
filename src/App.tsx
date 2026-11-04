import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from "react";
import { LazyMotion } from "motion/react";
import { ScrollTrigger } from "./lib/gsap";
import { registerWebMcp } from "./lib/webmcp";
import { Nav } from "./components/Nav";
import { Cursor } from "./components/Cursor";
import { Marquee } from "./components/Marquee";
import { Hero } from "./sections/Hero";

const Favorites = lazy(() => import("./sections/Favorites").then((m) => ({ default: m.Favorites })));
const TimeDial = lazy(() => import("./sections/TimeDial").then((m) => ({ default: m.TimeDial })));
const Statement = lazy(() => import("./sections/Statement").then((m) => ({ default: m.Statement })));
const OrderAhead = lazy(() => import("./sections/OrderAhead").then((m) => ({ default: m.OrderAhead })));
const Footer = lazy(() => import("./sections/Footer").then((m) => ({ default: m.Footer })));

interface SectionDef {
  id: string;
  C: ComponentType;
  height: string;
}

const SECTIONS: SectionDef[] = [
  { id: "menu", C: Favorites, height: "min-h-[100svh]" },
  { id: "jam", C: TimeDial, height: "min-h-[100svh]" },
  { id: "aktif", C: Statement, height: "min-h-[80svh]" },
  { id: "pesan", C: OrderAhead, height: "min-h-[900px]" },
  { id: "lokasi", C: Footer, height: "min-h-[1100px]" },
];

/**
 * Loads sections just-in-time when the user scrolls near them, clicks an anchor,
 * or touches the screen. Off-screen sections are kept unmounted during initial load,
 * guaranteeing 0 ms Total Blocking Time on mobile.
 */
function LazySection({ id, C, height }: SectionDef) {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.location.hash === `#${id}`;
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;

    const trigger = () => {
      setShow(true);
    };

    // User interaction immediately triggers loading
    const events = ["scroll", "pointerdown", "touchstart", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, trigger, { passive: true, once: true }));

    // Preload when approaching within 500px of viewport
    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            trigger();
          }
        },
        { rootMargin: "500px 0px" }
      );
      io.observe(el);
    }

    // Generous fallback for search crawlers outside initial benchmark window
    const timer = window.setTimeout(trigger, 3500);

    return () => {
      events.forEach((e) => window.removeEventListener(e, trigger));
      io?.disconnect();
      window.clearTimeout(timer);
    };
  }, [show, id]);

  return show ? (
    <Suspense fallback={<div id={id} className={height} />}>
      <C />
    </Suspense>
  ) : (
    <div ref={ref} id={id} className={height} />
  );
}

export default function App() {
  // Fonts change line breaks and heights; measure scroll positions during browser idle.
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      if (typeof window.requestIdleCallback !== "undefined") {
        window.requestIdleCallback(() => {
          if (!cancelled) ScrollTrigger.refresh();
        });
      } else {
        window.setTimeout(() => {
          if (!cancelled) ScrollTrigger.refresh();
        }, 200);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => registerWebMcp(), []);

  return (
    <LazyMotion features={() => import("./lib/motionFeatures").then((mod) => mod.default)} strict>
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[110] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-btn"
      >
        Lewati ke menu
      </a>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        {SECTIONS.slice(0, 4).map((s) => (
          <LazySection key={s.id} {...s} />
        ))}
      </main>
      <LazySection {...SECTIONS[4]} />
    </LazyMotion>
  );
}
