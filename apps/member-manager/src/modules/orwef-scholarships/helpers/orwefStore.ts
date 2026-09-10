import { useStore } from "react-admin";
import type { PageCtx } from "../../../framework/manifest";
import { buildScholarshipListFilter } from "./listFilters";

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
} as const;

export const ORWEF_WATCH_KEYS = [
  ORWEF_STORE_KEYS.year,
  ORWEF_STORE_KEYS.search,
  ORWEF_STORE_KEYS.region,
];

export const defaultScholarshipYear = (): ScholarshipYear =>
  new Date().getFullYear();

export const useScholarshipYear = () =>
  useStore<ScholarshipYear>(ORWEF_STORE_KEYS.year, defaultScholarshipYear());
export const useScholarshipSearch = () =>
  useStore(ORWEF_STORE_KEYS.search, "");
export const useScholarshipRegion = () =>
  useStore(ORWEF_STORE_KEYS.region, "all");

/** Permanent filter of the Applications tab (search / year / region). */
export const applicationFilterFromCtx = (ctx: PageCtx) =>
  buildScholarshipListFilter(
    ctx.store(ORWEF_STORE_KEYS.search, ""),
    ctx.store<ScholarshipYear>(ORWEF_STORE_KEYS.year, defaultScholarshipYear()),
    ctx.store(ORWEF_STORE_KEYS.region, "all")
  );
