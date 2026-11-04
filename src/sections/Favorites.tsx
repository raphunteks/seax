import { useRef } from "react";
import { gsap, NO_PREF, ScrollTrigger, useGSAP } from "../lib/gsap";
import { useSectionIntro } from "../hooks/useSectionIntro";
import { formatIDR, menu } from "../data/menu";
import { CupArt } from "../components/CupArt";

const N = menu.length;
/** Scroll distance per drink while the scene is pinned. */
const PX_PER_ITEM = 120;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Full menu, one drink at a time.
 * Desktop: the section pins and every scroll step brings the next drink to the stage and adds its row to the list.
 * Phones and reduced motion: nothing pins; the list is simply there (phones reveal rows one by one as they scroll in).
 */
export function Favorites() {
  const root = useRef<HTMLElement>(null);
  useSectionIntro(root);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();

      // Faint wave shape drifts against the scroll (parallax).
      mm.add(NO_PREF, () => {
        gsap.fromTo(
          "[data-wave]",
          { yPercent: 12 },
          {
            yPercent: -18,
            ease: "none",
            scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      // Desktop: pinned scene, drinks arrive one by one.
      mm.add(`(min-width: 768px) and ${NO_PREF}`, () => {
        const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", scope);
        const rows = gsap.utils.toArray<HTMLElement>("[data-row]", scope);
        const bars = gsap.utils.toArray<HTMLElement>("[data-bar]", scope);
        const count = scope.querySelector<HTMLElement>("[data-count]");
        const prog = scope.querySelector<HTMLElement>("[data-progress]");
        if (!count || !prog || slides.length !== N || rows.length !== N) return;

        // Resting state: first drink on stage, first row in the list, everything else waiting.
        gsap.set(slides, { opacity: 0, yPercent: 10, scale: 0.94 });
        gsap.set(slides[0], { opacity: 1, yPercent: 0, scale: 1 });
        gsap.set(rows, { opacity: 0, x: 32 });
        gsap.set(rows[0], { opacity: 1, x: 0 });
        gsap.set(bars, { scaleY: 0 });
        gsap.set(bars[0], { scaleY: 1 });
        gsap.set(prog, { scaleX: 0, transformOrigin: "0% 50%" });

        const total = N - 1 + 0.6;
        const state = { i: 0 };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: scope,
            start: "top 56px",
            end: `+=${Math.round(total * PX_PER_ITEM)}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            // Settle on a whole drink when the user stops scrolling; the tail after the last drink is free.
            snap: {
              snapTo: 1 / total, // whole drinks
              inertia: false, // never throw past the step the user stopped at
              duration: { min: 0.2, max: 0.5 },
              delay: 0.12,
              ease: "power1.inOut",
            },
          },
        });

        // Each drink finishes arriving exactly on a whole step, so the snap point always shows a complete state.
        for (let i = 1; i < N; i++) {
          const at = i - 0.6;
          tl.to(slides[i - 1], { opacity: 0, yPercent: -10, scale: 0.94, duration: 0.35 }, at)
            .to(slides[i], { opacity: 1, yPercent: 0, scale: 1, duration: 0.45, ease: "power2.out" }, at + 0.15)
            .to(rows[i], { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, at)
            .to(bars[i - 1], { scaleY: 0, duration: 0.3 }, at)
            .to(bars[i], { scaleY: 1, duration: 0.3 }, at + 0.3);
        }
        tl.to(
          state,
          {
            i: N - 1,
            duration: N - 1,
            snap: { i: 1 },
            onUpdate: () => {
              count.textContent = pad(Math.round(state.i) + 1);
            },
          },
          0,
        ).to(prog, { scaleX: 1, duration: N - 1 }, 0);
        tl.to({}, { duration: 0.6 }, N - 1); // short hold on the last drink
      });

      // Phones: rows reveal one by one as they enter.
      mm.add(`(max-width: 767px) and ${NO_PREF}`, () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-row]", scope);
        gsap.set(rows, { opacity: 0, y: 24 });
        ScrollTrigger.batch(rows, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: "kopi", stagger: 0.08, overwrite: true }),
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="menu" className="tone-light section relative scroll-mt-14 overflow-hidden md:!py-0">
      <svg
        data-wave
        aria-hidden="true"
        viewBox="0 0 800 400"
        className="pointer-events-none absolute -right-24 top-24 w-[900px] max-w-none text-accent opacity-[0.07]"
      >
        <path
          d="M-20 220 C100 60 200 60 300 220 S500 380 600 220 S760 80 820 180"
          fill="none"
          stroke="currentColor"
          strokeWidth="96"
          strokeLinecap="round"
        />
      </svg>

      <div className="container-x relative grid gap-10 md:min-h-[calc(100svh-56px)] md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-14">
        <div className="grid gap-6">
          <div className="grid gap-4">
            <h2 data-split className="display text-[clamp(32px,5vw,60px)]">
              MENU <span className="it">Kopi Sea</span>
            </h2>
            <p data-reveal className="max-w-[44ch] text-muted">
              Scroll pelan-pelan. Satu per satu, {N} menu kami muncul di sini.
            </p>
          </div>

          {/* Stage: decorative, the list on the right carries the same information. */}
          <div aria-hidden="true" className="hidden gap-4 md:grid">
            <div className="relative aspect-square h-[min(38svh,360px)]">
              <div className="absolute inset-[6%] rounded-full bg-accent opacity-[0.08]" />
              {menu.map((m, i) => (
                <div
                  key={m.slug}
                  data-slide
                  className="absolute inset-0 grid grid-rows-[1fr_auto] justify-items-center gap-2"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <div className="grid w-[34%] place-items-center">
                    <CupArt kind={m.kind} className="block w-full" />
                  </div>
                  <div className="grid justify-items-center gap-1 text-center">
                    <span className="mono-label">{m.category}</span>
                    <span className="display text-xl">{m.name}</span>
                    <span className="font-mono text-sm text-muted">{formatIDR(m.price)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 font-mono text-sm">
              <span>
                <span data-count>01</span> / {pad(N)}
              </span>
              <span className="relative h-px flex-1 bg-line">
                <span data-progress className="absolute inset-0 origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
              </span>
            </div>
          </div>
        </div>

        <ol className="grid" style={{ ["--row" as string]: `clamp(28px, calc((100svh - 56px - 72px) / ${N}), 54px)` }}>
          {menu.map((m, i) => (
            <li
              key={m.slug}
              data-row
              className="relative flex items-center gap-3 border-b border-line py-2.5 first:border-t md:h-[var(--row)] md:py-0"
            >
              <span data-bar aria-hidden="true" className="absolute inset-y-1 left-0 hidden w-0.5 origin-center bg-accent md:block" />
              <span
                aria-hidden="true"
                className="grid h-12 w-10 shrink-0 place-items-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] md:ml-3 md:h-[calc(var(--row)-8px)] md:w-auto md:aspect-[4/5]"
              >
                <CupArt kind={m.kind} className="h-[78%] w-auto" />
              </span>
              <span className="grid min-w-0 flex-1">
                <span className="truncate">{m.name}</span>
                <span className="mono-label text-[10px] md:hidden">{m.category}</span>
              </span>
              {i === 0 ? <span className="mono-label hidden text-accent xl:inline">Paling direkomendasikan</span> : null}
              <span className="mono-label hidden w-[88px] text-right lg:inline">{m.category}</span>
              <span className="w-[76px] text-right font-mono text-sm whitespace-nowrap text-muted">{formatIDR(m.price)}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
