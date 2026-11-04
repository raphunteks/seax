import { useEffect } from "react";
import { LazyMotion } from "motion/react";
import { ScrollTrigger } from "./lib/gsap";
import { Nav } from "./components/Nav";
import { Cursor } from "./components/Cursor";
import { JsonLd } from "./components/JsonLd";
import { Marquee } from "./components/Marquee";
import { Hero } from "./sections/Hero";
import { Favorites } from "./sections/Favorites";
import { TimeDial } from "./sections/TimeDial";
import { Statement } from "./sections/Statement";
import { OrderAhead } from "./sections/OrderAhead";
import { Footer } from "./sections/Footer";

export default function App() {
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

  return (
    <LazyMotion features={() => import("./lib/motionFeatures").then((mod) => mod.default)} strict>
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[110] focus:rounded-full focus:bg-glow focus:px-4 focus:py-2 focus:text-ink"
      >
        Lewati ke menu
      </a>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Favorites />
        <TimeDial />
        <Statement />
        <OrderAhead />
      </main>
      <Footer />
      <JsonLd />
    </LazyMotion>
  );
}
