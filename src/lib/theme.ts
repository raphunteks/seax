export type ThemeId = "siang" | "malam" | "aren" | "pandan" | "sunrise";
export type ThemePref = ThemeId | "auto";

export const STORAGE_KEY = "kopisea-theme";

/** Swatch colors mirror the tokens in index.css (base surface, accent, alternate band). */
export const THEMES: { id: ThemeId; label: string; note: string; surface: string; accent: string; band: string }[] = [
  { id: "siang", label: "Siang", note: "Krem dan kobalt", surface: "#FDFBF5", accent: "#0F3BB4", band: "#0A0D18" },
  { id: "malam", label: "Malam", note: "Navy pekat", surface: "#0F1426", accent: "#7C97FF", band: "#0A0D18" },
  { id: "aren", label: "Aren", note: "Karamel dan espresso", surface: "#F4E8D6", accent: "#A34E0C", band: "#2B1710" },
  { id: "pandan", label: "Pandan", note: "Hijau segar", surface: "#EAF3EA", accent: "#17694A", band: "#0F2A1E" },
  { id: "sunrise", label: "Sunrise", note: "Jingga dan plum", surface: "#FFE9DA", accent: "#B8310C", band: "#2A1030" },
];

const IDS = THEMES.map((t) => t.id as string);

/** Hour of day (0-23) in the shop's time zone (WITA = UTC+8). */
export function shopHour(now = new Date()): number {
  return (now.getUTCHours() + 8) % 24;
}

/** "Ikut Jam": the page follows the day, in step with the time dial. */
export function themeForHour(h: number): ThemeId {
  if (h >= 9 && h < 12) return "sunrise";
  if (h >= 12 && h < 16) return "siang";
  if (h >= 16 && h < 19) return "aren";
  return "malam";
}

export function readPref(): ThemePref {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const v = raw === "light" ? "siang" : raw === "dark" ? "malam" : raw;
    if (v && IDS.includes(v)) return v as ThemeId;
  } catch {
    /* storage can be blocked */
  }
  return "auto";
}

export function resolve(pref: ThemePref): ThemeId {
  return pref === "auto" ? themeForHour(shopHour()) : pref;
}

function paint(pref: ThemePref): void {
  const root = document.documentElement;
  const id = resolve(pref);
  root.dataset.theme = id;
  root.dataset.themePref = pref;
  const band = THEMES.find((t) => t.id === id)?.band;
  if (band) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", band);
}

/** Applies and stores a choice. With an origin the new colors spread from that point as a circle. */
export function applyTheme(pref: ThemePref, origin?: { x: number; y: number }): void {
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* the choice then lasts for this visit only */
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!origin || reduce || typeof document.startViewTransition !== "function") {
    paint(pref);
    return;
  }
  const radius = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
  const t = document.startViewTransition(() => paint(pref));
  t.ready
    .then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${radius}px at ${origin.x}px ${origin.y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.2, 0, 0, 1)", pseudoElement: "::view-transition-new(root)" },
      ),
    )
    .catch(() => undefined);
}

/** Re-resolves "Ikut Jam" without storing anything; call on a timer. */
export function refreshAuto(): void {
  if (readPref() === "auto") paint("auto");
}
