export const ROUTES = [
  { id: "menu", path: "/menu", label: "Menu" },
  { id: "jam", path: "/jam", label: "Jam" },
  { id: "pesan", path: "/pesan", label: "Pesan" },
  { id: "lokasi", path: "/lokasi", label: "Lokasi" },
] as const;

export type RouteId = (typeof ROUTES)[number]["id"];

/** Smoothly scrolls to a section and updates the browser URL without hash fragment. */
export function navigateTo(target: string) {
  if (typeof window === "undefined") return;
  const clean = target.startsWith("/") ? target.slice(1) : target.replace(/^#/, "");
  const path = clean ? `/${clean}` : "/";

  if (window.location.pathname !== path) {
    window.history.pushState(null, "", path);
  }

  if (!clean) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const el = document.getElementById(clean);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }

  // Notify components (e.g. lazy-loaded sections) to mount if not yet active
  window.dispatchEvent(new CustomEvent("route-navigate", { detail: { id: clean } }));
}

