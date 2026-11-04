import { useRef } from "react";
import { gsap, NO_PREF, useGSAP } from "../lib/gsap";
import { useSectionIntro } from "../hooks/useSectionIntro";
import { bySlug, formatIDR } from "../data/menu";
import { site } from "../data/site";
import { CupArt } from "../components/CupArt";

/** Suggested drink per hour of the shop's opening window. Copy, not data: confirm the picks with the owner. */
const STOPS = [
  { at: 9, label: "09.00", slug: "kopi-aktif-aren-hot", line: "Mulai pagi dengan yang hangat." },
  { at: 12, label: "12.00", slug: "americano-ice", line: "Siang terik? Yang pekat dan dingin." },
  { at: 15, label: "15.00", slug: "lemon-honey", line: "Sore hari, yang segar dulu." },
  { at: 18, label: "18.00", slug: "kopi-aktif-aren", line: "Pulang kerja, ngopi bareng teman." },
  { at: 21, label: "21.00", slug: "kopi-sosial-ice", line: "Malam belum selesai. Tetap aktif." },
] as const;

const START = 9; // opening hour
const SPAN = 13; // 09.00 to 22.00
const DEFAULT_IDX = 3; // resting state (phones, reduced motion): 18.00
const CENTER = 200;

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const major = i % 5 === 0;
  const a = (i * 6 * Math.PI) / 180;
  const r1 = major ? 168 : 176;
  const r2 = 184;
  return {
    i,
    major,
    x1: CENTER + Math.sin(a) * r1,
    y1: CENTER - Math.cos(a) * r1,
    x2: CENTER + Math.sin(a) * r2,
    y2: CENTER - Math.cos(a) * r2,
  };
});
const NUMERALS = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1;
  const a = (n * 30 * Math.PI) / 180;
  return { n, x: CENTER + Math.sin(a) * 146, y: CENTER - Math.cos(a) * 146 };
});

const pad = (n: number) => String(n).padStart(2, "0");

export function TimeDial() {
  const root = useRef<HTMLElement>(null);
  useSectionIntro(root);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const hand = scope.querySelector<SVGLineElement>("[data-hand]");
      const readout = scope.querySelector<HTMLElement>("[data-readout]");
      const cups = gsap.utils.toArray<HTMLElement>("[data-cup]", scope);
      const caps = gsap.utils.toArray<HTMLElement>("[data-cap]", scope);
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", scope);
      if (!hand || !readout) return;

      const apply = (p: number) => {
        const hours = START + SPAN * p;
        gsap.set(hand, { rotation: hours * 30, svgOrigin: `${CENTER} ${CENTER}` });
        const h = Math.floor(hours) % 24;
        const m = Math.floor((hours % 1) * 60);
        readout.textContent = `${pad(h)}.${pad(m)}`;
        const idx = Math.min(STOPS.length - 1, Math.floor((hours - START) / 3));
        cups.forEach((el, i) => (el.style.opacity = i === idx ? "1" : "0"));
        caps.forEach((el, i) => (el.style.opacity = i === idx ? "1" : "0"));
        rows.forEach((el, i) => el.classList.toggle("text-accent", i === idx));
      };

      const mm = gsap.matchMedia();
      // Dial face draws itself in once: ticks and numerals, clockwise.
      mm.add(NO_PREF, () => {
        gsap.from("[data-tick]", {
          opacity: 0,
          duration: 0.4,
          ease: "none",
          stagger: { each: 0.014, from: "start" },
          scrollTrigger: { trigger: "[data-dial]", start: "top 85%", once: true },
        });
      });
      // Pinned and scrubbed through the opening window, on phones as well (shorter run, no list).
      mm.add(NO_PREF, () => {
        const state = { p: 0 };
        apply(0);
        gsap.to(state, {
          p: 1,
          ease: "none",
          onUpdate: () => apply(state.p),
          scrollTrigger: {
            trigger: scope,
            start: "top 56px",
            end: window.innerWidth < 768 ? "+=1300" : "+=2200",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });
      });
      // Reduced motion: still dial at 18.00, nothing pinned.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        apply((STOPS[DEFAULT_IDX].at - START) / SPAN);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const open = `${site.hours.openLabel}–${site.hours.closeLabel} ${site.hours.zoneLabel}`;

  return (
    <section ref={root} id="jam" className="tone-light section scroll-mt-14 !py-0">
      <div className="container-x grid min-h-[calc(100svh-56px)] items-center gap-8 py-6 md:grid-cols-2 md:gap-12 md:py-0">
        <div className="grid gap-8">
          <div className="grid gap-4">
            <h2 data-split className="display text-[clamp(32px,5.5vw,60px)]">
              SEPANJANG <span className="it">hari</span>
            </h2>
            <p data-reveal className="hidden text-muted md:block">
              Buka setiap hari, {open}. Ini yang kami sarankan tiap jamnya.
            </p>
          </div>

          <div className="relative min-h-[96px] md:min-h-[132px]" aria-live="off">
            {STOPS.map((s, i) => {
              const item = bySlug(s.slug);
              return (
                <div
                  key={s.slug}
                  data-cap
                  className="absolute inset-0 grid content-start gap-2 transition-opacity duration-200"
                  style={{ opacity: i === DEFAULT_IDX ? 1 : 0 }}
                >
                  <span className="mono-label text-accent">Saran minum {s.label}</span>
                  <p className="display text-2xl">{item?.name}</p>
                  <p className="text-muted">{s.line}</p>
                </div>
              );
            })}
          </div>

          <ol className="hidden gap-0 border-t border-line md:grid motion-reduce:grid">
            {STOPS.map((s) => {
              const item = bySlug(s.slug);
              return (
                <li
                  key={s.slug}
                  data-row
                  className="flex items-baseline justify-between gap-4 border-b border-line py-3 font-mono text-sm transition-colors duration-200"
                >
                  <span>{s.label}</span>
                  <span className="flex-1 text-right">{item?.name}</span>
                  <span className="w-[84px] text-right text-muted">{item ? formatIDR(item.price) : ""}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mx-auto grid w-full max-w-[min(460px,34svh)] gap-4 md:max-w-[460px]" data-reveal>
          <div data-dial className="relative aspect-square w-full">
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative w-[27%]">
              {STOPS.map((s, i) => {
                const item = bySlug(s.slug);
                return (
                  <div
                    key={s.slug}
                    data-cup
                    className="absolute inset-0 grid place-items-center transition-opacity duration-200"
                    style={{ opacity: i === DEFAULT_IDX ? 1 : 0 }}
                  >
                    {item ? <CupArt kind={item.kind} label={item.name} className="block w-full" /> : null}
                  </div>
                );
              })}
              <div className="invisible">
                <CupArt kind="aren" className="block w-full" />
              </div>
            </div>
          </div>
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" role="img" aria-label={`Jam analog, toko buka ${open}`}>
            <circle cx={CENTER} cy={CENTER} r="192" fill="none" stroke="var(--line)" strokeWidth="1" />
            {TICKS.map((t) => (
              <line
                key={t.i}
                data-tick
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={t.major ? "var(--on-surface)" : "var(--muted)"}
                strokeWidth={t.major ? 2 : 1}
              />
            ))}
            {NUMERALS.map((n) => (
              <text
                key={n.n}
                data-tick
                x={n.x}
                y={n.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize="18"
                fill="var(--on-surface)"
              >
                {n.n}
              </text>
            ))}
            <line
              data-hand
              x1={CENTER}
              y1={CENTER}
              x2={CENTER}
              y2={CENTER - 128}
              stroke="var(--accent)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx={CENTER} cy={CENTER} r="7" fill="var(--accent)" />
          </svg>
          </div>
          <div className="text-center">
            <span data-readout className="display text-3xl">
              18.00
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
