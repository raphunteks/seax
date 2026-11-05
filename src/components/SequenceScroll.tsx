import { useCallback, useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";

/**
 * Frame URLs come from /sequence (ezgif-frame-001.jpg ... NNN.jpg).
 * Zero-padded names sort correctly, and the frame count is read from the folder,
 * so adding or removing frames needs no code change.
 */
const FRAME_URLS = Object.values(
  import.meta.glob("/sequence/*.jpg", { query: "?url", import: "default", eager: true }),
) as string[];

const COUNT = FRAME_URLS.length;
const CONCURRENCY = 6;
/** Longest canvas edge in device pixels; the source frames are 1920 wide, so more only wastes memory. */
const MAX_CANVAS_W = 1920;

interface Caption {
  from: number;
  to: number;
  title: string;
  body: string;
}

const CAPTIONS: Caption[] = [
  { from: 0.04, to: 0.3, title: "Satu pusaran.", body: "Kopi, susu, dan es bertemu di satu gelas." },
  { from: 0.42, to: 0.72, title: "Satu gelas.", body: "Dingin, creamy, seimbang. Itu SEA." },
];

function CaptionBlock({ c, progress }: { c: Caption; progress: ReturnType<typeof useSpring> }) {
  const fade = 0.06;
  const opacity = useTransform(progress, [c.from, c.from + fade, c.to - fade, c.to], [0, 1, 1, 0]);
  const y = useTransform(progress, [c.from, c.from + fade, c.to - fade, c.to], [24, 0, 0, -24]);
  return (
    <m.div style={{ opacity, y }} className="absolute inset-x-0 bottom-[8svh] mx-auto max-w-xl rounded-2xl bg-[#e9d9bf]/70 px-6 py-4 text-center backdrop-blur-sm md:inset-x-auto md:bottom-auto md:left-[6vw] md:top-1/2 md:mx-0 md:max-w-sm md:-translate-y-1/2 md:bg-transparent md:p-0 md:text-left md:backdrop-blur-none">
      <h2 className="font-display text-[clamp(1.75rem,5vw,3.25rem)] leading-[1.05] tracking-tight text-[#2a1a0c]">
        {c.title}
      </h2>
      <p className="mt-3 text-[clamp(0.9rem,1.6vw,1.1rem)] text-[#4a3220]">{c.body}</p>
    </m.div>
  );
}

/** Draws the image with object-fit: cover semantics, centered. */
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number) {
  const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const w = img.naturalWidth * s;
  const h = img.naturalHeight * s;
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
}

export function SequenceScroll() {
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | undefined)[]>([]);
  const current = useRef(0);
  const raf = useRef(0);

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  // The spring removes the stair-stepping of wheel ticks. Critically damped, so no overshoot.
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.25, restDelta: 0.0005 });

  const paint = useCallback(() => {
    raf.current = 0;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    // Nearest loaded frame, so the picture never blanks while frames are still arriving.
    const i = current.current;
    let img = frames.current[i];
    for (let d = 1; !img && d < COUNT; d++) img = frames.current[i - d] ?? frames.current[i + d];
    if (!img) return;
    ctx.clearRect(0, 0, el.width, el.height);
    drawCover(ctx, img, el.width, el.height);
  }, []);

  const schedule = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(paint);
  }, [paint]);

  useMotionValueEvent(smooth, "change", (v) => {
    const next = Math.min(COUNT - 1, Math.max(0, Math.round(v * (COUNT - 1))));
    if (next === current.current) return;
    current.current = next;
    schedule();
  });

  // Size the canvas to its box (DPR aware, capped) and redraw.
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.min(MAX_CANVAS_W, Math.round(el.clientWidth * dpr));
      const h = Math.round((w / el.clientWidth) * el.clientHeight);
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
      }
      schedule();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [schedule]);

  // Preload with limited concurrency. Reduced motion only needs the last frame.
  useEffect(() => {
    if (COUNT === 0) return;
    let dead = false;
    const order = reduce ? [COUNT - 1] : Array.from({ length: COUNT }, (_, i) => i);
    if (reduce) current.current = COUNT - 1;
    let cursor = 0;

    const worker = async () => {
      while (!dead && cursor < order.length) {
        const i = order[cursor++];
        const img = new Image();
        img.decoding = "async";
        img.src = FRAME_URLS[i];
        try {
          await img.decode();
        } catch {
          continue;
        }
        if (dead) return;
        frames.current[i] = img;
        if (i === current.current || i < 2) schedule();
      }
    };
    for (let k = 0; k < CONCURRENCY; k++) void worker();
    return () => {
      dead = true;
    };
  }, [reduce, schedule]);

  if (COUNT === 0) return null;

  return (
    <section
      id="sea"
      ref={track}
      aria-label="Proses satu gelas SEA"
      className={reduce ? "relative h-[100svh]" : "relative h-[400vh]"}
      style={{ background: "#e9d9bf" }}
    >
      <canvas
        ref={canvas}
        role="img"
        aria-label="Pusaran kopi susu berubah menjadi segelas es kopi susu SEA"
        className="sticky top-0 block h-screen w-full"
      />
      {!reduce && (
        <div className="pointer-events-none sticky top-0 -mt-[100vh] h-screen w-full overflow-hidden">
          {CAPTIONS.map((c) => (
            <CaptionBlock key={c.title} c={c} progress={smooth} />
          ))}
        </div>
      )}
    </section>
  );
}
