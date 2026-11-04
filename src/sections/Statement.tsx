import { Fragment, useRef } from "react";
import { gsap, NO_PREF, useGSAP } from "../lib/gsap";
import { menu } from "../data/menu";
import { site } from "../data/site";
import { Bean } from "../components/Bean";

/** Floating beans: position in %, size in px, parallax distance in px, resting rotation in deg. */
const BEANS = [
  { x: 6, y: 10, s: 34, d: 140, r: -20 },
  { x: 18, y: 72, s: 26, d: 60, r: 35 },
  { x: 27, y: 28, s: 22, d: 200, r: 10 },
  { x: 38, y: 86, s: 38, d: 120, r: -50 },
  { x: 46, y: 6, s: 24, d: 90, r: 60 },
  { x: 55, y: 62, s: 30, d: 170, r: -15 },
  { x: 63, y: 18, s: 40, d: 70, r: 25 },
  { x: 71, y: 80, s: 22, d: 220, r: -70 },
  { x: 79, y: 40, s: 28, d: 110, r: 45 },
  { x: 86, y: 8, s: 32, d: 150, r: -30 },
  { x: 92, y: 66, s: 36, d: 80, r: 15 },
  { x: 12, y: 46, s: 20, d: 240, r: 80 },
  { x: 34, y: 54, s: 18, d: 260, r: -40 },
  { x: 58, y: 92, s: 26, d: 100, r: 55 },
] as const;

const hoursPerDay = Number(site.hours.close.slice(0, 2)) - Number(site.hours.open.slice(0, 2));
/** Real numbers only: they come from the same data files as the rest of the page. */
const STATS = [
  { value: site.branches.length, label: "Cabang" },
  { value: menu.length, label: "Menu" },
  { value: hoursPerDay, label: "Jam buka per hari" },
] as const;

const WORDS = ["SELALU", "AKTIF.", "BERSAMA", "SEA."] as const;

export function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();
      mm.add(NO_PREF, () => {
        // Word-by-word reveal tied to scroll.
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.45 },
          {
            opacity: 1,
            ease: "none",
            stagger: 1,
            scrollTrigger: { trigger: "[data-words]", start: "top 80%", end: "bottom 45%", scrub: 0.6 },
          },
        );
        // Numbers count up once when they scroll into view.
        gsap.utils.toArray<HTMLElement>("[data-stat]", scope).forEach((el) => {
          const target = Number(el.dataset.stat);
          const state = { v: 0 };
          el.textContent = "0";
          gsap.to(state, {
            v: target,
            duration: 1.4,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => {
              el.textContent = String(state.v);
            },
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
        gsap.from("[data-stat-item]", {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "kopi",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-stats]", start: "top 90%", once: true },
        });
        // Beans drift at different speeds.
        gsap.utils.toArray<HTMLElement>("[data-bean]", scope).forEach((el) => {
          const d = Number(el.dataset.d);
          gsap.fromTo(
            el,
            { y: d * 0.5, rotation: Number(el.dataset.r) - 12 },
            {
              y: -d * 0.5,
              rotation: Number(el.dataset.r) + 12,
              ease: "none",
              scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: 0.6 },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="aktif" className="tone-dark section relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {BEANS.map((b, i) => (
          <div
            key={i}
            data-bean
            data-d={b.d}
            data-r={b.r}
            className="absolute"
            style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.s, transform: `rotate(${b.r}deg)` }}
          >
            <Bean className="block w-full" />
          </div>
        ))}
      </div>
      <div className="container-x relative grid min-h-[70svh] content-center gap-10">
        <h2 data-words className="display text-[clamp(44px,11vw,150px)] leading-[0.98]">
          {WORDS.map((w, i) => (
            <Fragment key={w}>
              {i > 0 ? " " : null}
              <span data-word className="inline-block">
                {w}
              </span>
            </Fragment>
          ))}
        </h2>
        <p className="max-w-[44ch] text-lg text-steel">
          Seperti kopi yang perlu proses untuk jadi <em className="it">nikmat</em>. Kami buka dari pagi sampai malam supaya
          ngopinya tidak perlu buru-buru.
        </p>
        <dl data-stats className="grid max-w-[640px] grid-cols-3 gap-6 border-t border-line pt-8">
          {STATS.map((st) => (
            <div key={st.label} data-stat-item className="grid gap-2">
              <dt className="mono-label order-2">{st.label}</dt>
              <dd data-stat={st.value} className="display order-1 text-[clamp(32px,6vw,64px)] leading-none">
                {st.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
