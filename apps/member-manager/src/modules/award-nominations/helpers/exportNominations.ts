import type { ConfigurableDatagridColumn, RaRecord } from "react-admin";
import type { PageCtx } from "../../../framework/manifest";
import { NOMINATION_SUBMITTED_FIELD } from "./listFilters";

export const NOMINATION_EXPORT_TITLE = "ORWA Award Nominations";

/** Columns-picker prefs the CSV honours (same keys AgDatagrid writes). */
export const nominationColumnPrefs = (ctx: PageCtx) => ({
  available: ctx.store<ConfigurableDatagridColumn[]>(
    "preferences.award-nominations.datagrid.availableColumns",
    []
  ),
  selected: ctx.store<string[]>(
    "preferences.award-nominations.datagrid.columns",
    []
  ),
});

/**
 * `submission_date` is a Strapi `datetime` (ISO instant). The grid shows it
 * through `DateField` — the browser's `toLocaleDateString()` — so the CSV
 * carries the same calendar date rather than the raw ISO string.
 */
export const formatSubmittedDate = (
  value: unknown,
  locale?: string
): string => {
  if (value == null || value === "") return "";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(locale);
};

/** Export rows: the grid's records with the submitted instant made readable. */
export const nominationExportRows = <T extends RaRecord>(
  records: T[],
  locale?: string
): T[] =>
  records.map((record) =>
    NOMINATION_SUBMITTED_FIELD in record
      ? {
          ...record,
          [NOMINATION_SUBMITTED_FIELD]: formatSubmittedDate(
            record[NOMINATION_SUBMITTED_FIELD],
            locale
          ),
        }
      : record
  );
