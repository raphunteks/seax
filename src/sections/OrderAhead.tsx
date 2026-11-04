import { useRef, useState } from "react";
import { gsap, NO_PREF, useGSAP } from "../lib/gsap";
import { useSectionIntro } from "../hooks/useSectionIntro";
import { site } from "../data/site";
import { ReceiptCard } from "../components/ReceiptCard";

const STEPS = [
  "Pilih cabang tempat kamu mau ambil pesanan.",
  "Pindai kode QR di struk, atau tekan tombol di bawahnya.",
  "Lanjutkan pesananmu di aplikasi toko.",
] as const;

export function OrderAhead() {
  const root = useRef<HTMLElement>(null);
  useSectionIntro(root);
  const [branchId, setBranchId] = useState<string>(site.branches[0].id);
  const branch = site.branches.find((b) => b.id === branchId) ?? site.branches[0];

  // The slip prints from a slot, then settles with one small sway. Steps arrive one by one.
  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();
      mm.add(NO_PREF, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: "[data-print]", start: "top 75%", once: true },
        });
        tl.from("[data-slip]", { yPercent: -100, duration: 0.9, ease: "steps(8)" })
          .to("[data-slip]", { rotation: -1.4, duration: 0.25, ease: "sine.inOut", transformOrigin: "50% 0%" })
          .to("[data-slip]", { rotation: 1, duration: 0.3, ease: "sine.inOut" })
          .to("[data-slip]", { rotation: 0, duration: 0.3, ease: "sine.out" });

        gsap.from("[data-step]", {
          x: -24,
          opacity: 0,
          duration: 0.6,
          ease: "kopi",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-steps]", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="pesan" className="tone-dark section scroll-mt-14">
      <div className="container-x grid items-start gap-12 lg:grid-cols-2">
        <div className="grid gap-8">
          <div className="grid gap-4">
            <h2 data-split className="display text-[clamp(32px,5.5vw,64px)]">
              PESAN LANGSUNG, <span className="it">tanpa ribet.</span>
            </h2>
            <p data-reveal className="max-w-[46ch] text-steel">
              Tiap cabang punya kode QR sendiri. Kode dan tombolnya membuka aplikasi pesan milik cabang yang kamu pilih.
            </p>
          </div>

          <div role="group" aria-label="Pilih cabang" className="grid gap-2" data-reveal>
            {site.branches.map((b) => (
              <button
                key={b.id}
                type="button"
                aria-pressed={b.id === branch.id}
                onClick={() => setBranchId(b.id)}
                className={`grid gap-1 rounded-[20px] border p-4 text-left transition-colors duration-200 ${
                  b.id === branch.id ? "border-glow bg-night" : "border-line hover:border-steel"
                }`}
              >
                <span className="font-display text-base font-semibold">{b.name}</span>
                <span className="text-muted">{b.address}</span>
              </button>
            ))}
          </div>

          <ol data-steps className="grid gap-0 border-t border-line">
            {STEPS.map((s, i) => (
              <li key={s} data-step className="flex items-baseline gap-4 border-b border-line py-3">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div data-print className="mx-auto grid w-full max-w-[460px] gap-0">
          <div aria-hidden="true" className="relative z-10 h-3 rounded-full bg-night shadow-[inset_0_0_0_1px_#232a44]" />
          <div className="-mt-1 overflow-hidden px-3 pb-6">
            <div data-slip>
              <ReceiptCard branch={branch} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
