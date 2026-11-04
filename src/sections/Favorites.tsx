import { useRef } from "react";
import { gsap, NO_PREF, useGSAP } from "../lib/gsap";
import { useSectionIntro } from "../hooks/useSectionIntro";
import { useViewportKey } from "../hooks/useViewportKey";
import { formatIDR, menu } from "../data/menu";
import { CupArt } from "../components/CupArt";

const N = menu.length;
/** Scroll distance per drink while the scene is pinned. */
const PX_DESKTOP = 120;
const PX_PHONE = 90;
/** On phones the list is a window this many rows tall. On desktop the window is as tall as the screen allows. */
const PHONE_ROWS = 5;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Full menu, one item at a time. The section pins on every screen size and each scroll step brings the next item
 * to the stage and adds its row to the list. When the whole list does not fit the screen (phones, short windows),
 * the list is a window that slides up as new rows arrive.
 * Reduced motion: nothing pins; the stage shows the first item and the whole list is simply there.
 */
export function Favorites() {
  const root = useRef<HTMLElement>(null);
  useSectionIntro(root);
  const viewport = useViewportKey();

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

      const build = (compact: boolean) => {
        const phone = compact;
        const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", scope);
        const rows = gsap.utils.toArray<HTMLElement>("[data-row]", scope);
        const bars = gsap.utils.toArray<HTMLElement>("[data-bar]", scope);
        const count = scope.querySelector<HTMLElement>("[data-count]");
        const prog = scope.querySelector<HTMLElement>("[data-progress]");
        const win = scope.querySelector<HTMLElement>("[data-window]");
        const list = scope.querySelector<HTMLElement>("[data-list]");
        if (!count || !prog || !win || !list || slides.length !== N || rows.length !== N) return;
        const rowPx = rows[0].offsetHeight;
        // Rows that fit beside the stage. Everything fits when the screen is tall enough; otherwise the list slides.
        const room = scope.clientHeight - (phone ? 0 : 32);
        const visible = phone ? PHONE_ROWS : Math.max(5, Math.min(N, Math.floor(room / rowPx)));
        const slides_ = visible < N;

        // Resting state: first item on stage, first row in the list, everything else waiting.
        gsap.set(slides, { opacity: 0, yPercent: 10, scale: 0.94 });
        gsap.set(slides[0], { opacity: 1, yPercent: 0, scale: 1 });
        gsap.set(rows, { opacity: 0, x: 32 });
        gsap.set(rows[0], { opacity: 1, x: 0 });
        gsap.set(bars, { scaleY: 0 });
        gsap.set(bars[0], { scaleY: 1 });
        gsap.set(prog, { scaleX: 0, transformOrigin: "0% 50%" });
        if (slides_) gsap.set(win, { height: rowPx * visible, overflow: "hidden" });

        const total = N - 1 + 0.6;
        const state = { i: 0 };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: scope,
            start: "top 56px",
            end: `+=${Math.round(total * (compact ? PX_PHONE : PX_DESKTOP))}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            snap: {
              snapTo: 1 / total, // whole items
              inertia: false, // never throw past the step the user stopped at
              duration: { min: 0.2, max: 0.5 },
              delay: 0.12,
              ease: "power1.inOut",
            },
          },
        });

        // Each item finishes arriving exactly on a whole step, so the snap point always shows a complete state.
        for (let i = 1; i < N; i++) {
          const at = i - 0.6;
          tl.to(slides[i - 1], { opacity: 0, yPercent: -10, scale: 0.94, duration: 0.35 }, at)
            .to(slides[i], { opacity: 1, yPercent: 0, scale: 1, duration: 0.45, ease: "power2.out" }, at + 0.15)
            .to(rows[i], { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, at)
            .to(bars[i - 1], { scaleY: 0, duration: 0.3 }, at)
            .to(bars[i], { scaleY: 1, duration: 0.3 }, at + 0.3);
          if (slides_ && i >= visible) {
            tl.to(list, { y: -(i - visible + 1) * rowPx, duration: 0.6, ease: "power2.out" }, at);
          }
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
        tl.to({}, { duration: 0.6 }, N - 1); // short hold on the last item
      };

      mm.add(`(min-width: 768px) and ${NO_PREF}`, () => build(false));
      mm.add(`(max-width: 767px) and ${NO_PREF}`, () => build(true));

      return () => mm.revert();
    },
    { scope: root, dependencies: [viewport], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="menu" className="tone-light section relative scroll-mt-14 overflow-hidden !py-0">
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

      <div className="container-x relative grid h-[calc(100svh-56px)] grid-rows-[minmax(0,1fr)_auto] gap-3 py-4 md:grid-cols-[0.9fr_1.1fr] md:grid-rows-1 md:items-center md:gap-14 md:py-6">
        <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 md:max-h-[620px] md:gap-5">
          <div className="grid gap-2 md:gap-3">
            <h2 data-split className="display text-[clamp(26px,min(4vw,7svh),44px)]">
              MENU <span className="it">Kopi Sea</span>
            </h2>
            <p data-reveal className="hidden max-w-[44ch] text-muted md:block [@media(max-height:640px)]:!hidden">
              Scroll pelan-pelan. Satu per satu, {N} menu kami muncul di sini.
            </p>
          </div>

          {/* Stage: decorative, the list carries the same information. It takes whatever height is left. */}
          <div aria-hidden="true" className="relative min-h-0">
            <div className="absolute top-[2%] left-1/2 aspect-square h-[64%] -translate-x-1/2 rounded-full bg-accent opacity-[0.08]" />
            {menu.map((m, i) => (
              <div
                key={m.slug}
                data-slide
                className="absolute inset-0 grid grid-rows-[minmax(0,1fr)_auto] justify-items-center gap-1"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <div className="flex min-h-0 w-full justify-center">
                  <CupArt kind={m.kind} className="block h-full w-auto max-w-full" />
                </div>
                <div className="grid w-full justify-items-center gap-0.5 text-center">
                  <span className="mono-label">{m.category}</span>
                  <span className="display line-clamp-2 text-sm leading-tight md:text-lg">{m.name}</span>
                  <span className="font-mono text-sm text-muted">{formatIDR(m.price)}</span>
                </div>
              </div>
            ))}
          </div>

          <div aria-hidden="true" className="flex items-center gap-4 font-mono text-sm">
            <span>
              <span data-count>01</span> / {pad(N)}
            </span>
            <span className="relative h-px flex-1 bg-line">
              <span data-progress className="absolute inset-0 origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
            </span>
          </div>
        </div>

        <div data-window>
          <ol
            data-list
            className="grid [--row:56px] md:[--row:var(--row-md)]"
            style={{ ["--row-md" as string]: `clamp(32px, calc((100svh - 56px - 48px) / ${N}), 52px)` }}
          >
            {menu.map((m, i) => (
              <li
                key={m.slug}
                data-row
                className="relative flex h-[var(--row)] items-center gap-3 border-b border-line first:border-t"
              >
                <span data-bar aria-hidden="true" className="absolute inset-y-1 left-0 w-0.5 origin-center bg-accent" />
                <span
                  aria-hidden="true"
                  className="ml-2 grid h-[calc(var(--row)-8px)] aspect-[4/5] shrink-0 place-items-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] md:ml-3"
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
      </div>
    </section>
  );
}
