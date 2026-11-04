import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, NO_PREF, useGSAP } from "../lib/gsap";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

const LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#jam", label: "Jam" },
  { href: "#pesan", label: "Pesan" },
  { href: "#lokasi", label: "Lokasi" },
] as const;

export function Nav() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const [active, setActive] = useState<string>("");

  // Mark the link of the section in the middle of the screen.
  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
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
      <header ref={root} className="fixed inset-x-0 top-0 z-50 border-b border-[#232a44] bg-ink text-paper">
        <div className="mx-auto grid h-14 max-w-[1160px] grid-cols-[1fr_auto_1fr] items-center px-4">
          <nav aria-label="Menu utama" className="hidden gap-6 md:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} aria-current={active === l.href.slice(1) ? "true" : undefined} className="font-mono text-[11px] tracking-[0.1em] text-steel uppercase transition-colors duration-200 hover:text-paper aria-[current=true]:text-glow">
                {l.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className="justify-self-start font-mono text-[11px] tracking-[0.1em] text-steel uppercase md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Tutup" : "Menu"}
          </button>
          <a href="#top" aria-label="Kopi SEA, ke atas" className="text-3xl text-paper">
            <Wordmark />
          </a>
          <div className="flex items-center justify-self-end gap-3">
            <ThemeToggle />
            <a href="#pesan" className="hidden font-mono text-[11px] tracking-[0.1em] text-glow uppercase sm:inline">
              Order online
            </a>
          </div>
        </div>
        <span aria-hidden="true" data-read className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-glow" style={{ transform: "scaleX(0)" }} />
      </header>
      <MobileMenu open={open} links={LINKS} onClose={close} />
    </>
  );
}
