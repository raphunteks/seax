import { lazy, Suspense, useEffect, useState, type ComponentType } from "react";
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

/**
 * Sections below the hero mount one by one, starting on the first scroll, tap, key press or link click.
 * Until then a same-size placeholder with the section's id holds their place, so the first load only pays for the hero.
 */
const LATER: { id: string; C: ComponentType; height: string }[] = [
  { id: "menu", C: Favorites, height: "min-h-[100svh]" },
  { id: "jam", C: TimeDial, height: "min-h-[100svh]" },
  { id: "aktif", C: Statement, height: "min-h-[80svh]" },
  { id: "pesan", C: OrderAhead, height: "min-h-[900px]" },
  { id: "lokasi", C: Footer, height: "min-h-[1100px]" },
];

function useStagedMount(total: number): number {
  const [go, setGo] = useState(() => window.location.hash.length > 1);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (go) return;
    const start = () => setGo(true);
    const events = ["scroll", "pointerdown", "touchstart", "keydown", "hashchange"] as const;
    events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));

    // Fallback on idle or after 1.5s so search crawlers & non-scrolling readers get the full DOM
    const idleId =
      typeof window.requestIdleCallback !== "undefined"
        ? window.requestIdleCallback(start, { timeout: 1500 })
        : window.setTimeout(start, 1500);

    return () => {
      events.forEach((e) => window.removeEventListener(e, start));
      if (typeof window.cancelIdleCallback !== "undefined") {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, [go]);

  useEffect(() => {
    if (!go || n >= total) return;
    const id = window.setTimeout(() => setN((v) => v + 1), 30);
    return () => window.clearTimeout(id);
  }, [go, n, total]);

  return n;
}

function Placeholder({ id, height }: { id: string; height: string }) {
  return <div id={id} aria-hidden="true" className={height} />;
}

export default function App() {
  const mounted = useStagedMount(LATER.length);
  const ready = mounted >= LATER.length;

  // Fonts change line breaks and heights, so measure scroll positions again once they are ready.
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => registerWebMcp(), []);

  // Everything is in place: re-measure, tell the nav, and land on a deep link if there was one.
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => {
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event("kopi:ready"));
      const target = window.location.hash.length > 1 ? document.getElementById(window.location.hash.slice(1)) : null;
      target?.scrollIntoView();
    }, 120);
    return () => window.clearTimeout(t);
  }, [ready]);

  const render = (i: number) => {
    const s = LATER[i];
    return mounted > i ? (
      <Suspense key={s.id} fallback={<Placeholder id={s.id} height={s.height} />}>
        <s.C />
      </Suspense>
    ) : (
      <Placeholder key={s.id} id={s.id} height={s.height} />
    );
  };

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
        {[0, 1, 2, 3].map(render)}
      </main>
      {render(4)}
    </LazyMotion>
  );
}
