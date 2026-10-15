import { useStore } from "react-admin";
import type { PageCtx } from "../../../framework/manifest";
import type { SubmittedDateRange } from "../../../helpers/submittedDateRange";
import { buildAwardListFilter, nominationCycleYear } from "./listFilters";

export type AwardYear = number | "all";

/**
 * RaStore keys the legacy `AwardContextProvider` owned. Names are preserved
 * verbatim so users' saved prefs (year, filters, last tab) survive the move
 * onto the layout framework; tab / drawer state is the framework's.
 */
export const AWARD_STORE_KEYS = {
  tab: "orwa-awards-tab-value",
  year: "orwa-awards-cycle-year",
  search: "orwa-awards-nomination-search",
  region: "orwa-awards-nomination-region",
  awardType: "orwa-awards-nomination-award-type",
  /** Filters drawer "Submitted" range (`YYYY-MM-DD` or ""). */
  submittedFrom: "orwa-awards-nomination-submitted-from",
  submittedTo: "orwa-awards-nomination-submitted-to",
  /** Filters drawer Status multi-select (`nomination_status` enum values, [] = all). */
  status: "orwa-awards-nomination-status",
} as const;

export const AWARD_WATCH_KEYS = [
  AWARD_STORE_KEYS.year,
  AWARD_STORE_KEYS.search,
  AWARD_STORE_KEYS.region,
  AWARD_STORE_KEYS.awardType,
  AWARD_STORE_KEYS.submittedFrom,
  AWARD_STORE_KEYS.submittedTo,
  AWARD_STORE_KEYS.status,
];

const NO_STATUSES: string[] = [];

export const useAwardYear = () =>
  useStore<AwardYear>(AWARD_STORE_KEYS.year, nominationCycleYear());
export const useAwardSearch = () => useStore(AWARD_STORE_KEYS.search, "");
export const useAwardRegion = () => useStore(AWARD_STORE_KEYS.region, "all");
export const useAwardType = () => useStore(AWARD_STORE_KEYS.awardType, "all");
export const useAwardSubmittedFrom = () =>
  useStore(AWARD_STORE_KEYS.submittedFrom, "");
export const useAwardSubmittedTo = () =>
  useStore(AWARD_STORE_KEYS.submittedTo, "");
export const useAwardStatuses = () =>
  useStore<string[]>(AWARD_STORE_KEYS.status, NO_STATUSES);

const submittedRangeFromCtx = (ctx: PageCtx): SubmittedDateRange => ({
  from: ctx.store(AWARD_STORE_KEYS.submittedFrom, ""),
  to: ctx.store(AWARD_STORE_KEYS.submittedTo, ""),
});

export const awardYearLabel = (year: AwardYear) =>
  year === "all" ? "All Years" : String(year);

/* ---------- manifest-side readers (PageCtx.store) ---------- */

export const awardYearFromCtx = (ctx: PageCtx): AwardYear =>
  ctx.store<AwardYear>(AWARD_STORE_KEYS.year, nominationCycleYear());

/** Permanent filter of the Nominations tab (search / year / region / type / submitted range / status). */
export const nominationFilterFromCtx = (ctx: PageCtx) =>
  buildAwardListFilter(
    ctx.store(AWARD_STORE_KEYS.search, ""),
    awardYearFromCtx(ctx),
    ctx.store(AWARD_STORE_KEYS.region, "all"),
    ctx.store(AWARD_STORE_KEYS.awardType, "all"),
    submittedRangeFromCtx(ctx),
    ctx.store<string[]>(AWARD_STORE_KEYS.status, NO_STATUSES)
  );

/** Permanent filter of the Winners tab (year only). */
export const winnerFilterFromCtx = (ctx: PageCtx) => {
  const year = awardYearFromCtx(ctx);
  return year === "all" ? {} : { award_year: year };
};
