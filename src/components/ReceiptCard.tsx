import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { Branch } from "../data/site";
import { site } from "../data/site";
import { Magnetic } from "./Magnetic";

interface Props {
  branch: Branch;
}

/** Order slip: the selected branch's QR code and a direct link to its shop app. Motion owns this component. */
export function ReceiptCard({ branch }: Props) {
  const reduce = useReducedMotion();
  const hours = `${site.hours.openLabel}–${site.hours.closeLabel} ${site.hours.zoneLabel}`;

  return (
    <div className="grid gap-6 rounded-[20px] bg-paper p-6 text-ink md:p-8">
      <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[#c9d1e6] pb-4">
        <span className="font-display text-lg font-semibold">Toko Kopi Sea</span>
        <span className="font-mono text-[11px] tracking-[0.08em] text-[#4a5575] uppercase">Pesan langsung</span>
      </div>

      <div aria-live="polite" className="min-h-[300px]">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={branch.id}
            className="grid justify-items-center gap-4 text-center"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <div className="grid gap-1">
              <p className="font-display text-base font-semibold">{branch.name}</p>
              <p className="text-sm text-[#4a5575]">{branch.address}</p>
            </div>
            <img
              src={branch.qr}
              width={176}
              height={176}
              loading="lazy"
              decoding="async"
              alt={`Kode QR pemesanan ${branch.name}`}
              className="h-44 w-44 rounded-xl border border-[#c9d1e6] bg-white p-2"
            />
            <p className="max-w-[28ch] text-sm text-[#4a5575]">Pindai dengan kamera HP, atau tekan tombol di bawah.</p>
          </m.div>
        </AnimatePresence>
      </div>

      <div className="flex items-baseline justify-between gap-4 border-t border-dashed border-[#c9d1e6] pt-4">
        <span className="font-mono text-[11px] tracking-[0.08em] uppercase">Jam buka</span>
        <span className="font-mono text-sm">{hours}</span>
      </div>

      <Magnetic>
        <a href={branch.orderUrl} target="_blank" rel="noreferrer noopener" className="btn !bg-cobalt !text-white">
          Buka aplikasi pesan
        </a>
      </Magnetic>
    </div>
  );
}
