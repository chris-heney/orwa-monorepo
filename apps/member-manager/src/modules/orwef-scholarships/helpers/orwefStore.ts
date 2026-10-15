import { useStore } from "react-admin";
import type { PageCtx } from "../../../framework/manifest";
import type { SubmittedDateRange } from "../../../helpers/submittedDateRange";
import { buildScholarshipListFilter, scholarshipCycleYear } from "./listFilters";

export type ScholarshipYear = number | "all";

/**
 * RaStore keys the legacy `OrwefContextProvider` owned. Names are preserved
 * verbatim so users' saved prefs (year, filters, last tab) survive the move
 * onto the layout framework; tab / drawer state is the framework's.
 */
export const ORWEF_STORE_KEYS = {
  tab: "orwef-tab-value",
  year: "orwef-year-filter",
  search: "orwef-application-search",
  region: "orwef-scholarships-region",
  /** Filters drawer "Submitted" range (`YYYY-MM-DD` or ""). */
  submittedFrom: "orwef-application-submitted-from",
  submittedTo: "orwef-application-submitted-to",
} as const;

export const ORWEF_WATCH_KEYS = [
  ORWEF_STORE_KEYS.year,
  ORWEF_STORE_KEYS.search,
  ORWEF_STORE_KEYS.region,
  ORWEF_STORE_KEYS.submittedFrom,
  ORWEF_STORE_KEYS.submittedTo,
];

/**
 * Default year = the upcoming conference cycle — the `scholarship_year` the
 * public form stamps on new applications — so fresh submissions land on the
 * default view (same rule as the Awards module).
 */
export const defaultScholarshipYear = (): ScholarshipYear =>
  scholarshipCycleYear();

export const useScholarshipYear = () =>
  useStore<ScholarshipYear>(ORWEF_STORE_KEYS.year, defaultScholarshipYear());
export const useScholarshipSearch = () =>
  useStore(ORWEF_STORE_KEYS.search, "");
export const useScholarshipRegion = () =>
  useStore(ORWEF_STORE_KEYS.region, "all");
export const useScholarshipSubmittedFrom = () =>
  useStore(ORWEF_STORE_KEYS.submittedFrom, "");
export const useScholarshipSubmittedTo = () =>
  useStore(ORWEF_STORE_KEYS.submittedTo, "");

const submittedRangeFromCtx = (ctx: PageCtx): SubmittedDateRange => ({
  from: ctx.store(ORWEF_STORE_KEYS.submittedFrom, ""),
  to: ctx.store(ORWEF_STORE_KEYS.submittedTo, ""),
});

/** Permanent filter of the Applications tab (search / year / region / submitted range). */
export const applicationFilterFromCtx = (ctx: PageCtx) =>
  buildScholarshipListFilter(
    ctx.store(ORWEF_STORE_KEYS.search, ""),
    ctx.store<ScholarshipYear>(ORWEF_STORE_KEYS.year, defaultScholarshipYear()),
    ctx.store(ORWEF_STORE_KEYS.region, "all"),
    submittedRangeFromCtx(ctx)
  );
