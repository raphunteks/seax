import { useRef } from "react";
import { gsap, NO_PREF, ScrollTrigger, useGSAP } from "../lib/gsap";
import { site } from "../data/site";

const ITEMS = [
  "Kopi Aktif",
  "#BersamaSea",
  site.tagline.replace(/\.$/, ""),
  `${site.hours.openLabel}–${site.hours.closeLabel} ${site.hours.zoneLabel}`,
  `${site.branches.length} cabang`,
] as const;

function Group({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((t) => (
        <li key={t} className="flex items-center gap-[0.6em] pr-[0.6em]">
          <span>{t}</span>
          <span aria-hidden="true" className="inline-block h-[0.28em] w-[0.28em] rounded-full bg-[var(--band-fg)] opacity-60" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Ticker band. Runs steadily, speeds up with scroll velocity and reverses when the user scrolls up.
 * Reduced motion: it stays still.
 */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();
      // Desktop: velocity-sensitive ticker
      mm.add(`(min-width: 768px) and ${NO_PREF}`, () => {
        const loop = gsap.to("[data-track]", { xPercent: -50, ease: "none", duration: 32, repeat: -1 });
        let dir = 1;
        let boost = 1;
        let ts = 1;
        const vel = ScrollTrigger.create({
          onUpdate: (self) => {
            dir = self.direction;
            boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 5);
          },
        });
        const tick = () => {
          boost += (1 - boost) * 0.05;
          ts += (dir * boost - ts) * 0.1;
          loop.timeScale(ts);
        };
        // Idle while off screen.
        const vis = ScrollTrigger.create({
          trigger: scope,
          onToggle: (self) => {
            if (self.isActive) {
              loop.resume();
              gsap.ticker.add(tick);
            } else {
              loop.pause();
              gsap.ticker.remove(tick);
            }
          },
        });
        return () => {
          gsap.ticker.remove(tick);
          vel.kill();
          vis.kill();
          loop.kill();
        };
      });

      // Mobile: lightweight steady loop, zero ticker CPU overhead
      mm.add(`(max-width: 767px) and ${NO_PREF}`, () => {
        const loop = gsap.to("[data-track]", { xPercent: -50, ease: "none", duration: 32, repeat: -1 });
        const vis = ScrollTrigger.create({
          trigger: scope,
          onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()),
        });
        return () => {
          vis.kill();
          loop.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="overflow-hidden bg-[var(--band-bg)] py-4 text-[var(--band-fg)] md:py-5">
      <div data-track className="display flex w-max text-[clamp(22px,4vw,44px)] leading-none">
        <Group />
        <Group hidden />
      </div>
    </div>
  );
}
