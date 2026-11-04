import { categories, formatIDR, menu } from "../data/menu";
import { mapsUrl, site } from "../data/site";
import { isOpenAt } from "../hooks/useOpenNow";

const SECTIONS = ["menu", "jam", "pesan", "lokasi"] as const;

interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: Record<string, boolean>;
  execute: (input: Record<string, unknown>) => Promise<string>;
}
interface ModelContext {
  registerTool: (tool: Tool, options?: { signal?: AbortSignal }) => unknown;
}

/** Hours and branches are read-only facts, so every tool here only reads or scrolls. */
const TOOLS: Tool[] = [
  {
    name: "get_menu",
    description: "List the menu of Toko Kopi Sea with prices in rupiah. Optionally filter by category.",
    inputSchema: {
      type: "object",
      properties: { category: { type: "string", enum: [...categories], description: "Menu category" } },
    },
    annotations: { readOnlyHint: true },
    execute: async ({ category }) => {
      const items = menu
        .filter((m) => !category || m.category === category)
        .map((m) => ({ name: m.name, category: m.category, price: m.price, priceLabel: formatIDR(m.price) }));
      return JSON.stringify(items);
    },
  },
  {
    name: "get_branches",
    description: "List the three branches with address, map link, opening hours, whether it is open now, and the link to order directly.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () =>
      JSON.stringify({
        hours: `${site.hours.openLabel}-${site.hours.closeLabel} ${site.hours.zoneLabel}, every day`,
        openNow: isOpenAt(new Date()),
        branches: site.branches.map((b) => ({ name: b.name, address: b.address, map: mapsUrl(b), orderUrl: b.orderUrl })),
      }),
  },
  {
    name: "go_to_section",
    description: "Scroll the page to a section: menu, jam (opening hours), pesan (order), or lokasi (locations).",
    inputSchema: {
      type: "object",
      properties: { section: { type: "string", enum: [...SECTIONS] } },
      required: ["section"],
    },
    execute: async ({ section }) => {
      if (typeof section !== "string" || !(SECTIONS as readonly string[]).includes(section)) return "Unknown section.";
      window.location.hash = section;
      return `Scrolled to ${section}.`;
    },
  },
];

/** Registers the page's tools with the browser's WebMCP API when it exists. Returns a cleanup function. */
export function registerWebMcp(): () => void {
  const doc = document as unknown as { modelContext?: ModelContext };
  const nav = navigator as unknown as { modelContext?: ModelContext };
  const mc = doc.modelContext ?? nav.modelContext;
  if (!mc) return () => undefined;
  const ctl = new AbortController();
  for (const tool of TOOLS) {
    try {
      void Promise.resolve(mc.registerTool(tool, { signal: ctl.signal })).catch(() => undefined);
    } catch {
      /* the API is still changing; a failed registration must never break the page */
    }
  }
  return () => ctl.abort();
}
