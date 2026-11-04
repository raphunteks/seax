import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, NO_PREF, useGSAP } from "../lib/gsap";
import { Wordmark } from "./Wordmark";
import { ThemePicker } from "./ThemePicker";
import { MobileMenu } from "./MobileMenu";
import { navigateTo } from "../lib/router";

export const LINKS = [
  { href: "/menu", id: "menu", label: "Menu" },
  { href: "/jam", id: "jam", label: "Jam" },
  { href: "/pesan", id: "pesan", label: "Pesan" },
  { href: "/lokasi", id: "lokasi", label: "Lokasi" },
] as const;

export function Nav() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const [active, setActive] = useState<string>("");

  // Mark the link of the section crossing the middle of the screen during user scroll.
  // Deferred so it never triggers forced reflows during the initial load window.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      if (window.scrollY < 120) {
        setActive("");
        if (window.location.pathname !== "/") {
          window.history.replaceState(null, "", "/");
        }
        return;
      }
      const mid = window.innerHeight * 0.45;
      let current = "";
      for (const l of LINKS) {
        const el = document.getElementById(l.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) current = l.id;
      }
      setActive(current);
      if (current && window.location.pathname !== `/${current}`) {
        window.history.replaceState(null, "", `/${current}`);
      }
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // The nav arrives last, after the hero has settled. A hairline fills as the page is read.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_PREF, () => {
        gsap.from(root.current, { opacity: 0, duration: 0.4, delay: 0.1, ease: "kopi" });
        gsap.to("[data-read]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <>
      <header ref={root} className="tone-dark fixed inset-x-0 top-0 z-50 border-b border-line bg-surface text-on-surface">
        <div className="mx-auto grid h-14 max-w-[1160px] grid-cols-[1fr_auto_1fr] items-center px-4">
          <nav aria-label="Menu utama" className="hidden gap-6 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={active === l.id ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(l.href);
                }}
                className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase transition-colors duration-200 hover:text-on-surface aria-[current=true]:text-accent"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className="justify-self-start font-mono text-[11px] tracking-[0.1em] text-muted uppercase md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Tutup" : "Menu"}
          </button>
          <a
            href="/"
            aria-label="Kopi SEA, ke atas"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("/");
            }}
            className="text-3xl text-on-surface"
          >
            <Wordmark />
          </a>
          <div className="flex items-center justify-self-end gap-3">
            <ThemePicker />
            <a
              href="/pesan"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/pesan");
              }}
              className="hidden font-mono text-[11px] tracking-[0.1em] text-accent uppercase sm:inline"
            >
              Order online
            </a>
          </div>
        </div>
        <span aria-hidden="true" data-read className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </header>
      <MobileMenu open={open} links={LINKS} onClose={close} />
    </>
  );
}
