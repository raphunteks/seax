import { useEffect, useRef, useState } from "react";
import { applyTheme, readPref, refreshAuto, resolve, THEMES, type ThemePref } from "../lib/theme";

/** Palette button in the header. Opens a small radio list: "Ikut Jam" plus five themes. */
export function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [pref, setPref] = useState<ThemePref>(readPref);
  const box = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const current = THEMES.find((t) => t.id === resolve(pref)) ?? THEMES[0];

  // "Ikut Jam" changes as the day moves on.
  useEffect(() => {
    const id = window.setInterval(refreshAuto, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(next: ThemePref, el: HTMLElement) {
    const r = el.getBoundingClientRect();
    applyTheme(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setPref(next);
  }

  const row = "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors duration-200 hover:bg-panel aria-checked:bg-panel";

  return (
    <div ref={box} className="relative">
      <button
        ref={btn}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Ganti tema warna, sekarang ${pref === "auto" ? "Ikut Jam, " : ""}${current.label}`}
        onClick={() => setOpen((v) => !v)}
        className="grid h-9 w-9 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--line)] transition-colors duration-200 hover:bg-panel"
      >
        <span
          aria-hidden="true"
          className="h-4 w-4 rounded-full"
          style={{ background: `linear-gradient(135deg, ${current.surface} 50%, ${current.accent} 50%)`, boxShadow: "0 0 0 1px var(--line)" }}
        />
      </button>
      {open ? (
        <div
          role="radiogroup"
          aria-label="Tema warna"
          className="theme-pop absolute right-0 top-11 z-[60] grid w-64 gap-1 rounded-2xl border border-line bg-surface p-2 shadow-2xl"
        >
          <button type="button" role="radio" aria-checked={pref === "auto"} onClick={(e) => choose("auto", e.currentTarget)} className={row}>
            <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full border border-line font-mono text-[10px]">
              24
            </span>
            <span className="grid">
              <span className="text-sm font-semibold">Ikut Jam</span>
              <span className="text-xs text-muted">Berganti sepanjang hari (WITA)</span>
            </span>
          </button>
          {THEMES.map((t) => (
            <button key={t.id} type="button" role="radio" aria-checked={pref === t.id} onClick={(e) => choose(t.id, e.currentTarget)} className={row}>
              <span
                aria-hidden="true"
                className="h-6 w-6 shrink-0 rounded-full"
                style={{ background: `linear-gradient(135deg, ${t.surface} 50%, ${t.accent} 50%)`, boxShadow: "0 0 0 1px var(--line)" }}
              />
              <span className="grid">
                <span className="text-sm font-semibold">{t.label}</span>
                <span className="text-xs text-muted">{t.note}</span>
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
