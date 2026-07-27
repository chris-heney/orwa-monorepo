/**
 * Design tokens for the ORWA Grant Map.
 *
 * Ported from the member-manager Grant Manager financial summary
 * (grant-manager/grants/components/summary/tokens.ts): the duotone
 * "water ledger" palette anchored in the RIG logo blue. Money moves through
 * a stage gradient: blue (requests) -> amber (commitments) -> green (money
 * moved). Red is reserved for deficits and exits.
 *
 * grant-map is a standalone public app, so unlike member-manager the night
 * ledger is the one and only canvas — no MUI palette-mode switching.
 */
export interface SummaryTokens {
  ink: string; // page canvas
  panel: string; // widget surface
  panelSoft: string; // raised surface / hover
  line: string; // hairline dividers

  water: string; // RIG blue — requests / neutral emphasis
  deepWater: string;
  committed: string; // amber — approved / committed money
  inflow: string; // green — money moved / available
  exit: string; // red — deficits, denials, exits
  violet: string; // administrative

  textHi: string;
  textLo: string;
  textFaint: string;

  hoverShadow: string;

  /** Dollar-lifecycle stage ramp (blue -> amber -> green, plus off-ramps). */
  stage: {
    received: string;
    review: string;
    approved: string;
    signed: string;
    disbursed: string;
    paid: string;
    closed: string;
    awaiting: string;
    declined: string;
    cor: string;
  };
}

export const T: SummaryTokens = {
  ink: "#0D141B",
  panel: "#151F29",
  panelSoft: "#1C2936",
  line: "rgba(142, 176, 201, 0.14)",

  water: "#3FB3E4",
  deepWater: "#12729B",
  committed: "#F5B841",
  inflow: "#43D18B",
  exit: "#F16A5D",
  violet: "#9D7BE0",

  textHi: "#EAF3FA",
  textLo: "#8AA1B3",
  textFaint: "#5C7285",

  hoverShadow: "0 8px 24px rgba(0,0,0,0.35)",

  stage: {
    received: "#3FB3E4",
    review: "#7CC7EC",
    approved: "#F5B841",
    signed: "#F09A4C",
    disbursed: "#43D18B",
    paid: "#2BAE71",
    closed: "#12729B",
    awaiting: "#3FB3E4",
    declined: "#F16A5D",
    cor: "#9D7BE0",
  },
};

export const display = {
  fontFamily: "'Barlow Semi Condensed', 'Roboto Condensed', sans-serif",
} as const;

export const money = (value: number, compact = false): string => {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (compact && abs >= 1_000) {
    // Below the switch point the thousands figure would round to "1000K".
    const millions = abs >= 999_500;
    const scaled = abs / (millions ? 1_000_000 : 1_000);
    // Keep a decimal while it still changes the figure ($1.5K, never $2K for
    // $1,500) and drop it once the magnitude makes it noise ($124K).
    const text = scaled.toFixed(scaled < 10 ? 1 : 0).replace(/\.0$/, "");
    return `${sign}$${text}${millions ? "M" : "K"}`;
  }
  return `${sign}$${Math.round(abs).toLocaleString()}`;
};
