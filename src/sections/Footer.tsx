import { useRef, useState } from "react";
import { gsap, NO_PREF, useGSAP } from "../lib/gsap";
import { Wordmark } from "../components/Wordmark";
import { useSectionIntro } from "../hooks/useSectionIntro";
import { site, mapsUrl } from "../data/site";
import { navigateTo } from "../lib/router";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  useSectionIntro(root);
  const [branchId, setBranchId] = useState<string>(site.branches[0].id);
  const branch = site.branches.find((b) => b.id === branchId) ?? site.branches[0];
  const year = new Date().getFullYear();

  // Giant wordmark rises through a mask. Branch cards arrive in sequence.
  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();
      mm.add(NO_PREF, () => {
        const logo = scope.querySelector<SVGElement>("[data-word] svg");
        if (logo) {
          gsap.from(logo, {
            yPercent: 105,
            duration: 1,
            ease: "kopi",
            scrollTrigger: { trigger: "[data-word]", start: "top 92%", once: true },
          });
        }
        gsap.from("[data-branch]", {
          x: -24,
          opacity: 0,
          duration: 0.6,
          ease: "kopi",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-branches]", start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} id="lokasi" className="tone-dark section scroll-mt-14 !pb-10">
      <div className="container-x grid gap-16">
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-6">
            <h2 data-split className="display text-[clamp(28px,4.4vw,52px)]">
              MAMPIR <span className="it">ke cabang terdekat.</span>
            </h2>
            <div role="group" aria-label="Pilih cabang" className="grid gap-2" data-branches>
              {site.branches.map((b) => (
                <button
                  key={b.id}
                  data-branch
                  type="button"
                  aria-pressed={b.id === branch.id}
                  onClick={() => setBranchId(b.id)}
                  className={`grid gap-1 rounded-[20px] border p-4 text-left transition-colors duration-200 ${
                    b.id === branch.id ? "border-accent bg-panel" : "border-line hover:border-muted"
                  }`}
                >
                  <span className="font-display text-base font-semibold">{b.name}</span>
                  <span className="text-muted">{b.address}</span>
                </button>
              ))}
            </div>
            <a className="btn btn-ghost w-fit" href={mapsUrl(branch)} target="_blank" rel="noreferrer">
              Buka di Google Maps
            </a>
          </div>

          <div data-reveal className="frame overflow-hidden">
            <iframe
              key={branch.id}
              title={`Peta ${branch.name}`}
              src={branch.embedUrl}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="block aspect-[4/3] w-full border-0 lg:aspect-auto lg:h-[460px]"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6">
          <div data-word aria-hidden="true" className="overflow-hidden leading-none">
            <Wordmark className="!block !h-auto !w-full" />
          </div>
          <p
            data-reveal
            className="text-center font-display text-[clamp(13px,2vw,20px)] font-semibold tracking-[0.02em] text-muted"
          >
            Dibuat untuk yang aktif dan suka berkumpul.
          </p>
        </div>

        <div className="grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
          <div data-reveal className="grid content-start gap-3">
            <h3 className="mono-label">Menu</h3>
            <a
              className="hover:text-accent"
              href="/menu"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/menu");
              }}
            >
              Favorit dan daftar lengkap
            </a>
            <a
              className="hover:text-accent"
              href="/jam"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/jam");
              }}
            >
              Saran minum per jam
            </a>
            <a
              className="hover:text-accent"
              href="/pesan"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/pesan");
              }}
            >
              Pesan langsung
            </a>
          </div>
          <div data-reveal className="grid content-start gap-3">
            <h3 className="mono-label">Jam buka</h3>
            <p className="font-mono text-lg">
              {site.hours.openLabel}–{site.hours.closeLabel} {site.hours.zoneLabel}
            </p>
            <p className="text-muted">Setiap hari</p>
          </div>
          <div data-reveal className="grid content-start gap-3">
            <h3 className="mono-label">Ikuti</h3>
            <a className="hover:text-accent" href={site.instagram.url} target="_blank" rel="noreferrer">
              Instagram @{site.instagram.handle}
            </a>
            <p className="text-muted">{site.tagline}</p>
          </div>
        </div>

        <p className="mono-label !normal-case">
          © {year} {site.storeName}
        </p>
      </div>
    </footer>
  );
}
