import { useRef, useState } from "react";
import { gsap, NO_PREF, SplitText, useGSAP } from "../lib/gsap";
import { featured } from "../data/menu";
import { site } from "../data/site";
import { useOpenNow } from "../hooks/useOpenNow";
import { CupArt } from "../components/CupArt";
import { HeroCupSwap } from "../components/HeroCupSwap";
import { FeaturedTag } from "../components/FeaturedTag";
import { Magnetic } from "../components/Magnetic";
import { navigateTo } from "../lib/router";

/** Drinks the visitor can flip through in the hero (first three featured). */
const HERO_ITEMS = featured.slice(0, 3);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const item = HERO_ITEMS[idx];
  const open = useOpenNow();

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();

      // Entrance: headline lines, copy, buttons, product rises, tag last.
      mm.add(NO_PREF, () => {
        const title = scope.querySelector<HTMLElement>("[data-hero-title]");
        let split: SplitText | undefined;
        let cancelled = false;
        if (title) {
          document.fonts.ready.then(() => {
            if (cancelled) return;
            if (window.innerWidth >= 768) {
              split = SplitText.create(title, { type: "lines", mask: "lines" });
              gsap.from(split.lines, {
                yPercent: 110,
                duration: 0.6,
                stagger: 0.05,
                ease: "kopi",
              });
            } else {
              gsap.from(title, {
                y: 16,
                opacity: 0,
                duration: 0.5,
                ease: "kopi",
              });
            }
          });
        }

        const tl = gsap.timeline({ delay: 0.05, defaults: { ease: "kopi" } });
        tl.from("[data-hero-chip]", { opacity: 0, duration: 0.3 }, 0)
          .from("[data-hero-sub]", { y: 12, opacity: 0.2, duration: 0.5 }, 0.1)
          .from("[data-hero-cta]", { y: 12, opacity: 0, duration: 0.5 }, 0.15)
          .from("[data-rise]", { y: 40, opacity: 0, duration: 0.6, stagger: 0.05 }, 0.1)
          .from("[data-hero-tag]", { opacity: 0, duration: 0.4 }, 0.5);

        return () => {
          cancelled = true;
          split?.revert();
          if (title) gsap.set(title, { clearProps: "visibility,opacity" });
        };
      });

      // As the hero scrolls away, the product stack drifts slower than the copy (depth by scroll).
      mm.add(NO_PREF, () => {
        const trigger = { trigger: scope, start: "top top", end: "bottom top", scrub: true } as const;
        gsap.to("[data-hero-stack]", { yPercent: -14, scale: 0.94, ease: "none", scrollTrigger: trigger });
        gsap.to("[data-hero-copy]", { yPercent: 8, opacity: 0.35, ease: "none", scrollTrigger: trigger });
      });

      // Three-layer mouse parallax, mouse only.
      mm.add(`(hover: hover) and (pointer: fine) and ${NO_PREF}`, () => {
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", scope).map((el) => ({
          amp: Number(el.dataset.depth),
          x: gsap.quickTo(el, "x", { duration: 0.6, ease: "kopi" }),
          y: gsap.quickTo(el, "y", { duration: 0.6, ease: "kopi" }),
        }));
        const move = (e: PointerEvent) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          layers.forEach((l) => {
            l.x(nx * l.amp);
            l.y(ny * l.amp);
          });
        };
        scope.addEventListener("pointermove", move);
        return () => scope.removeEventListener("pointermove", move);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="tone-light section relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container-x grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div data-hero-copy className="grid gap-8">
          <div data-hero-chip className="mono-label inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-2">
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${open ? "bg-accent" : "bg-muted"}`} />
            {open ? "Buka sekarang" : "Tutup"} · {site.hours.openLabel}–{site.hours.closeLabel} {site.hours.zoneLabel}
          </div>
          <h1 data-hero-title className="display text-[clamp(36px,min(6.6vw,12svh),80px)]">
            KOPI AKTIF <span className="it">Aren</span>
          </h1>
          <p data-hero-sub className="max-w-[46ch] text-lg text-muted">
            Es kopi gula aren andalan Toko Kopi Sea. {site.tagline}
          </p>
          <div data-hero-cta className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="/pesan"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("/pesan");
                }}
                className="btn"
              >
                Pesan sekarang
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="/menu"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("/menu");
                }}
                className="btn btn-ghost"
              >
                Lihat menu
              </a>
            </Magnetic>
          </div>
          <div role="group" aria-label="Pilih minuman di hero" className="flex flex-wrap gap-2">
            {HERO_ITEMS.map((m, i) => (
              <button
                key={m.slug}
                type="button"
                aria-pressed={i === idx}
                onClick={() => setIdx(i)}
                className={`mono-label rounded-full border px-3 py-2 transition-colors duration-200 ${
                  i === idx ? "border-accent bg-accent text-on-btn" : "border-line text-muted hover:text-on-surface"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <div data-hero-stack className="relative mx-auto aspect-[4/5] w-full max-w-[460px]" aria-live="polite">
          <div data-depth="10" className="absolute inset-0 grid place-items-center">
            <div data-rise className="aspect-square w-[88%] rounded-full bg-[var(--band-bg)]" />
          </div>
          <div data-depth="22" className="absolute top-[18%] left-[-4%] w-[34%] -rotate-[8deg]">
            <div data-rise>
              <CupArt kind="peach" className="block w-full opacity-95" />
            </div>
          </div>
          <div data-depth="22" className="absolute top-[26%] right-[-4%] w-[32%] rotate-[9deg]">
            <div data-rise>
              <CupArt kind="matcha" className="block w-full opacity-95" />
            </div>
          </div>
          <div data-depth="38" className="absolute inset-x-[22%] top-[6%]">
            <div data-rise>
              <div data-float className="animate-float">
                <HeroCupSwap kind={item.kind} label={`${item.name}, gelas es kopi`} />
              </div>
            </div>
          </div>
          <div data-hero-tag className="absolute bottom-0 left-0">
            <FeaturedTag item={item} />
          </div>
        </div>
      </div>
    </section>
  );
}
