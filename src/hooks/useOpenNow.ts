import { useEffect, useState } from "react";
import { site } from "../data/site";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Minutes since midnight in the shop's own time zone. */
function shopMinutes(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

/** The shop opens in the afternoon and closes after midnight, so the window wraps. */
export function isOpenAt(now: Date): boolean {
  const t = shopMinutes(now);
  const open = toMinutes(site.hours.open);
  const close = toMinutes(site.hours.close);
  return open <= close ? t >= open && t < close : t >= open || t < close;
}

export function useOpenNow(): boolean {
  const [open, setOpen] = useState(() => isOpenAt(new Date()));
  useEffect(() => {
    const id = window.setInterval(() => setOpen(isOpenAt(new Date())), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return open;
}
