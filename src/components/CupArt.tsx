import { useId } from "react";
import type { DrinkKind } from "../data/menu";

interface Stop {
  o: number;
  c: string;
}

/** Drink colors are the beverages themselves, not brand tokens. Stops run top to bottom. */
/** Open or lidded paper cups. The value is the coffee surface seen through the rim (null = lidded). */
const HOT = { sosialHot: null, arenHot: "#b07c45", hotAmericano: "#3a2012" } as const;
type HotKind = keyof typeof HOT;
type StandaloneKind = "keripikPisang" | "keripikDampo" | "keripikSeblak" | "literan" | "air" | "shot" | "creamy";
const isHot = (k: DrinkKind): k is HotKind => k in HOT;

const CHIPS: Record<"keripikPisang" | "keripikDampo" | "keripikSeblak", { fill: string; chip: string }> = {
  keripikPisang: { fill: "#d9c24a", chip: "#ecd96e" },
  keripikDampo: { fill: "#34331f", chip: "#55532f" },
  keripikSeblak: { fill: "#d2742a", chip: "#e89a4f" },
};

/** Packaged goods and add-ons, drawn flat in the same 220 x 400 box as the cups. */
function standalone(kind: StandaloneKind, uid: string) {
  switch (kind) {
    case "keripikPisang":
    case "keripikDampo":
    case "keripikSeblak": {
      const { fill, chip } = CHIPS[kind];
      const clip = `${uid}-bag`;
      const body = "M50 112 L170 112 L176 360 Q176 372 164 372 L56 372 Q44 372 44 360 Z";
      return (
        <>
          <defs>
            <clipPath id={clip}>
              <path d={body} />
            </clipPath>
          </defs>
          <path d={body} fill="#eef1f9" />
          <g clipPath={`url(#${clip})`}>
            <rect x="40" y="170" width="140" height="210" fill={fill} />
            <g fill={chip}>
              <rect x="58" y="184" width="40" height="22" rx="10" transform="rotate(-18 78 195)" />
              <rect x="112" y="196" width="44" height="22" rx="10" transform="rotate(14 134 207)" />
              <rect x="62" y="330" width="46" height="22" rx="10" transform="rotate(10 85 341)" />
              <rect x="116" y="318" width="40" height="22" rx="10" transform="rotate(-24 136 329)" />
            </g>
            <rect x="58" y="120" width="10" height="250" fill="#ffffff" fillOpacity="0.25" />
          </g>
          <circle cx="110" cy="262" r="28" fill="#c8402a" />
          <circle cx="110" cy="262" r="22" fill="none" stroke="#fdfbf5" strokeWidth="2" />
          <rect x="46" y="94" width="128" height="22" rx="4" fill="#d9dfef" />
          <path d="M50 100 h120 M50 106 h120" stroke="#b9c2da" strokeWidth="2" />
        </>
      );
    }
    case "literan":
      return (
        <>
          <rect x="90" y="36" width="40" height="28" rx="6" fill="#0f3bb4" />
          <path d="M96 64 L124 64 L126 94 Q152 108 152 140 L152 360 Q152 372 140 372 L80 372 Q68 372 68 360 L68 140 Q68 108 94 94 Z" fill="#eef1f9" />
          <path d="M68 150 L152 150 L152 360 Q152 372 140 372 L80 372 Q68 372 68 360 Z" fill="#b9814a" />
          <rect x="68" y="196" width="84" height="116" fill="#0f3bb4" />
          <text x="110" y="268" textAnchor="middle" fontFamily='"Unbounded Variable", "Arial Black", sans-serif' fontWeight={900} fontSize="34" fill="#fdfbf5">
            sea
          </text>
          <rect x="80" y="110" width="9" height="240" fill="#ffffff" fillOpacity="0.3" />
        </>
      );
    case "air":
      return (
        <>
          <rect x="94" y="48" width="32" height="22" rx="5" fill="#6f4aa8" />
          <path d="M98 70 L122 70 L124 92 Q146 104 146 130 L146 360 Q146 372 134 372 L86 372 Q74 372 74 360 L74 130 Q74 104 96 92 Z" fill="#d6ebf8" />
          <rect x="74" y="190" width="72" height="80" fill="#7a55b5" />
          <rect x="88" y="214" width="44" height="6" rx="3" fill="#fdfbf5" fillOpacity="0.85" />
          <rect x="94" y="230" width="32" height="6" rx="3" fill="#fdfbf5" fillOpacity="0.6" />
          <rect x="84" y="110" width="8" height="240" fill="#ffffff" fillOpacity="0.5" />
        </>
      );
    case "shot":
      return (
        <>
          <path d="M68 230 L152 230 L144 360 Q143 372 131 372 L89 372 Q77 372 76 360 Z" fill="#2a160a" />
          <rect x="68" y="230" width="84" height="22" fill="#b8792e" />
          <path d="M68 230 L152 230 L144 360 Q143 372 131 372 L89 372 Q77 372 76 360 Z" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="3" />
          <rect x="84" y="240" width="8" height="118" fill="#ffffff" fillOpacity="0.25" />
        </>
      );
    case "creamy":
      return (
        <>
          <path d="M44 296 Q110 190 176 296 Z" fill="#f4f1ea" />
          <path d="M44 296 Q110 270 176 296" fill="none" stroke="#e1dccf" strokeWidth="3" />
          <path d="M32 296 L188 296 Q188 372 110 372 Q32 372 32 296 Z" fill="#b88a5a" />
          <path d="M60 310 Q70 352 100 358" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="5" strokeLinecap="round" />
        </>
      );
  }
}

const LIQUID: Record<Exclude<DrinkKind, HotKind | StandaloneKind>, { stops: Stop[]; cap?: string }> = {
  pandan: {
    stops: [
      { o: 0, c: "#5a3a1e" },
      { o: 0.34, c: "#7a5a2a" },
      { o: 0.5, c: "#9cc27a" },
      { o: 1, c: "#d3e6ae" },
    ],
  },
  aren: {
    stops: [
      { o: 0, c: "#4b2a12" },
      { o: 0.4, c: "#8a5a2e" },
      { o: 0.52, c: "#e9d6b4" },
      { o: 1, c: "#f4ecdc" },
    ],
  },
  arenPremium: {
    stops: [
      { o: 0, c: "#2f1a0b" },
      { o: 0.42, c: "#7b4a22" },
      { o: 0.54, c: "#d9bf93" },
      { o: 1, c: "#eedfc0" },
    ],
    cap: "#f3e9d6",
  },
  sosial: {
    stops: [
      { o: 0, c: "#c9a06a" },
      { o: 0.35, c: "#b07c45" },
      { o: 0.62, c: "#d8bd90" },
      { o: 1, c: "#f1e4c9" },
    ],
  },
  americano: {
    stops: [
      { o: 0, c: "#3a2012" },
      { o: 1, c: "#1b0e08" },
    ],
  },
  // Same dark body as americano, with a lighter crema band on top.
  americanoSpecial: {
    stops: [
      { o: 0, c: "#8a5428" },
      { o: 0.1, c: "#3a2012" },
      { o: 1, c: "#170b06" },
    ],
  },
  butterscotch: {
    stops: [
      { o: 0, c: "#f3e3bd" },
      { o: 0.2, c: "#ecc887" },
      { o: 0.5, c: "#d19a4a" },
      { o: 1, c: "#a8651f" },
    ],
    cap: "#f6ecd2",
  },
  // Espresso floating on orange, dark on top.
  sunrise: {
    stops: [
      { o: 0, c: "#2a160a" },
      { o: 0.3, c: "#4a2a12" },
      { o: 0.5, c: "#c9792a" },
      { o: 1, c: "#f0a23a" },
    ],
  },
  avocado: {
    stops: [
      { o: 0, c: "#3a2012" },
      { o: 0.3, c: "#5a3a22" },
      { o: 0.42, c: "#9fb55a" },
      { o: 1, c: "#c4d27a" },
    ],
  },
  chocolate: {
    stops: [
      { o: 0, c: "#6b3f2e" },
      { o: 0.45, c: "#966250" },
      { o: 0.56, c: "#f0e4d0" },
      { o: 1, c: "#f7efe0" },
    ],
    cap: "#f3e9d6",
  },
  peach: {
    stops: [
      { o: 0, c: "#f6efe2" },
      { o: 0.16, c: "#f6efe2" },
      { o: 0.3, c: "#8a5a2e" },
      { o: 0.5, c: "#f0a63a" },
      { o: 1, c: "#f6c26a" },
    ],
    cap: "#f6efe2",
  },
  matcha: {
    stops: [
      { o: 0, c: "#7fa63a" },
      { o: 0.5, c: "#a9c766" },
      { o: 0.6, c: "#f1ecdd" },
      { o: 1, c: "#f7f3e8" },
    ],
  },
  lemon: {
    stops: [
      { o: 0, c: "#f3c93c" },
      { o: 1, c: "#fbe8a0" },
    ],
  },
};

const BODY = "M36 76 L56 352 Q57 362 67 362 L153 362 Q163 362 164 352 L184 76 Z";

interface Props {
  kind: DrinkKind;
  className?: string;
  /** Accessible name. Omit for purely decorative use. */
  label?: string;
}

/** Original vector cup, standing in for product photography until real photos are added. */
export function CupArt({ kind, className, label }: Props) {
  const uid = useId().replace(/:/g, "");
  const a11y = label ? { role: "img" as const, "aria-label": label } : { "aria-hidden": true as const };

  if (isHot(kind)) {
    const coffee = HOT[kind];
    const open = coffee !== null;
    return (
      <svg viewBox="0 0 220 400" className={className} {...a11y}>
        <path d="M44 110 L62 366 Q63 374 71 374 L149 374 Q157 374 158 366 L176 110 Z" fill="#f3f5fb" />
        <rect x="38" y="86" width="144" height="26" rx="10" fill="#e4e9f5" />
        {open ? (
          <>
            {/* open cup: coffee surface seen through the rim */}
            <ellipse cx="110" cy="92" rx="72" ry="14" fill="#e4e9f5" />
            <ellipse cx="110" cy="94" rx="64" ry="10" fill={coffee ?? "#b07c45"} />
            <ellipse cx="102" cy="92" rx="30" ry="4" fill="#d8bd90" opacity="0.7" />
          </>
        ) : (
          <path d="M46 86 Q46 62 110 58 Q174 62 174 86 Z" fill="#d6ddee" />
        )}
        <text
          x="110"
          y="258"
          textAnchor="middle"
          fontFamily='"Unbounded Variable", "Arial Black", sans-serif'
          fontWeight={900}
          fontSize="44"
          fill="#0f3bb4"
        >
          sea
        </text>
      </svg>
    );
  }

  if (kind === "keripikPisang" || kind === "keripikDampo" || kind === "keripikSeblak" || kind === "literan" || kind === "air" || kind === "shot" || kind === "creamy") {
    return (
      <svg viewBox="0 0 220 400" className={className} {...a11y}>
        {standalone(kind, uid)}
      </svg>
    );
  }

  const { stops, cap } = LIQUID[kind];
  const grad = `${uid}-g`;
  const clip = `${uid}-c`;
  return (
    <svg viewBox="0 0 220 400" className={className} {...a11y}>
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
          {stops.map((s) => (
            <stop key={s.o + s.c} offset={s.o} stopColor={s.c} />
          ))}
        </linearGradient>
        <clipPath id={clip}>
          <path d={BODY} />
        </clipPath>
      </defs>
      {/* straw sits behind the glass front */}
      <path d="M128 16 L142 16 L124 250 L110 250 Z" fill="#f3f5fb" opacity="0.95" />
      <g clipPath={`url(#${clip})`}>
        <rect x="30" y="98" width="160" height="270" fill={`url(#${grad})`} />
        {cap ? <rect x="30" y="98" width="160" height="14" fill={cap} /> : null}
        <g fill="#ffffff" fillOpacity="0.28">
          <rect x="70" y="116" width="40" height="40" rx="9" transform="rotate(-12 90 136)" />
          <rect x="116" y="130" width="38" height="38" rx="9" transform="rotate(10 135 149)" />
          <rect x="84" y="170" width="34" height="34" rx="8" transform="rotate(6 101 187)" />
        </g>
        <rect x="52" y="90" width="12" height="270" fill="#ffffff" fillOpacity="0.22" />
      </g>
      <path d={BODY} fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" />
      <text
        x="110"
        y="262"
        textAnchor="middle"
        fontFamily='"Unbounded Variable", "Arial Black", sans-serif'
        fontWeight={900}
        fontSize="48"
        fill="#0f3bb4"
        stroke="#f3f5fb"
        strokeWidth="1.4"
        strokeOpacity="0.6"
        paintOrder="stroke"
      >
        sea
      </text>
      <path d="M34 76 Q34 48 110 44 Q186 48 186 76 Z" fill="#ffffff" fillOpacity="0.38" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" />
      <rect x="30" y="70" width="160" height="10" rx="5" fill="#f3f5fb" fillOpacity="0.8" />
    </svg>
  );
}
