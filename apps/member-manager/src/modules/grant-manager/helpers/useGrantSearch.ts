import { useEffect, useRef } from "react";
import { useListContext, useStore } from "react-admin";
import { usePageManifest } from "../../../framework/PageContext";
import { searchStoreKeyFor } from "../../../framework/PageShell";
import { extractOrSearchText } from "./searchBarTabs";

type OrFilter = { $or: unknown[] };

/**
 * Bridge between the framework's collapsible search row (which writes the
 * list filter `q`) and the Strapi `$or` filters the payout / score lists need
 * (`q` becomes Strapi `_q`, a full-text search over the payout's OWN fields —
 * useless for "search by application name / ID").
 *
 * The tab's permanent `list.filter` neutralises `q` (`{ q: '' }` wins the RA
 * merge and the data provider drops empty values); this hook mirrors the text
 * into `$or` and strips the legacy dual-field keys, exactly as the removed
 * `GrantOrLiveSearch` did. A `$or` persisted by the legacy UI (no `q`) seeds
 * the search box once on mount so the old search stays visible.
 */
export const useSearchOrMirror = (
  buildOr: (value: string) => OrFilter | null,
  legacyKeys: readonly string[] = []
) => {
  const { filterValues, setFilters, displayedFilters } = useListContext();
  const seeded = useRef(false);

  useEffect(() => {
    const fv = (filterValues ?? {}) as Record<string, unknown>;
    const text = typeof fv.q === "string" ? fv.q.trim() : "";
    const current = extractOrSearchText(fv);
    const hasLegacy = legacyKeys.some((key) => fv[key] != null);

    if (!seeded.current) {
      seeded.current = true;
      if (!("q" in fv) && current) {
        setFilters({ ...fv, q: current }, displayedFilters, false);
        return;
      }
    }

    if (text === current && !hasLegacy) return;
    const next: Record<string, unknown> = { ...fv };
    delete next.$or;
    legacyKeys.forEach((key) => delete next[key]);
    const built = buildOr(text);
    if (built) Object.assign(next, built);
    setFilters(next, displayedFilters, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues]);
};

/**
 * Open the framework search row when the list already carries a search
 * (persisted `q`), so a filtered list never looks unfiltered.
 */
export const useAutoOpenSearch = () => {
  const { page } = usePageManifest();
  const [open, setOpen] = useStore<boolean>(searchStoreKeyFor(page), false);
  const { filterValues } = useListContext();
  useEffect(() => {
    const fv = (filterValues ?? {}) as Record<string, unknown>;
    const has =
      (typeof fv.q === "string" && fv.q.trim().length > 0) ||
      Boolean(extractOrSearchText(fv));
    if (has && !open) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);
};
