import React, { ReactNode, useEffect, useRef, useState } from "react";
import { LinearProgress } from "@mui/material";
import { useListContext, useStore } from "react-admin";
import { usePageManifest } from "../../../framework/PageContext";
import { useConferenceContext, useConferenceSelection } from "../ConferenceContext";
import {
  CONFERENCE_SELECTION_STORE_KEY,
  ConferenceSelection,
  applySelectionToFilters,
  filtersEqual,
  sameSelection,
  selectionFromFilters,
} from "../helpers/conferenceSelection";
import {
  CONTESTANT_STATUS_VIEW_STORE_KEY,
  DEFAULT_CONTESTANT_STATUS_FILTER,
} from "../helpers/listQueryFilters";
import type { ContestantStatusFilter } from "../helpers/listQueryFilters";

/**
 * Keeps a tab's user filter values and the module-wide conference / year
 * selection (RaStore `conference.selection`) in step. Rendered around every
 * tab panel, inside the tab's `ListScope`.
 *
 * The QUERY is scoped by the manifest's permanent `list.filter` (read from the
 * same store), so it is right from the first render. This component mirrors
 * the selection into the user filter values — which is what the Filters
 * drawer radios, the panels' `useListContext().filterValues` readers and the
 * exports look at — and, when the operator changes conference / year in the
 * drawer, writes the new selection back to the store (every other tab, the
 * bar title and tab visibility follow through `watchStoreKeys`).
 *
 * - Mount / selection or contestant-view change elsewhere → SELECTION wins:
 *   filter values are rewritten (shape normalised for the resource, `year`
 *   dropped where Strapi rejects it, contestant `status` sentinel seeded).
 * - Operator edit here (filter values changed by the drawer) → LIST wins.
 *
 * Children render once the first mirror has been applied, so no panel ever
 * sees the empty local params react-admin 4 starts a list from.
 */
const ConferenceListSync = ({ children }: { children?: ReactNode }) => {
  const { tab } = usePageManifest();
  const { filterValues, setFilters, displayedFilters, resource } =
    useListContext();
  const selection = useConferenceSelection();
  const [storedSelection, setStoredSelection] = useStore<
    ConferenceSelection | undefined
  >(CONFERENCE_SELECTION_STORE_KEY, undefined);
  const [contestantView] = useStore<ContestantStatusFilter>(
    CONTESTANT_STATUS_VIEW_STORE_KEY,
    DEFAULT_CONTESTANT_STATUS_FILTER
  );
  const { setIsCreating } = useConferenceContext();
  const [ready, setReady] = useState(false);

  const tabKey = tab?.key ?? "";
  const listResource = resource ?? tab?.list?.resource ?? "";

  // Same reference ⇒ not an operator edit (mount, StrictMode re-run, or a
  // selection / view change elsewhere) ⇒ the selection is authoritative.
  const lastFilters = useRef<Record<string, any> | null | undefined>(null);

  // Every tab lands on its list, never on a half-filled "Add …" form.
  useEffect(() => {
    setIsCreating(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabKey]);

  useEffect(() => {
    if (!tab || !filterValues) return;
    const operatorEdit =
      lastFilters.current != null && lastFilters.current !== filterValues;
    lastFilters.current = filterValues;

    let effective = selection;
    if (operatorEdit) {
      const fromList = selectionFromFilters(
        filterValues,
        selection,
        tabKey,
        listResource
      );
      if (!sameSelection(fromList, selection)) {
        effective = fromList;
        setStoredSelection(fromList);
      }
    } else if (!storedSelection) {
      // First visit: persist the (legacy / default) selection so `ctx.store`
      // readers and other devices see the same conference.
      setStoredSelection(selection);
    }

    const target = applySelectionToFilters(
      filterValues,
      effective,
      tabKey,
      listResource,
      contestantView
    );
    if (filtersEqual(target, filterValues)) {
      setReady(true);
    } else {
      setFilters(target, displayedFilters, false);
    }
    // `displayedFilters` / `setFilters` are stable per list; `tab` per shell.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues, selection, contestantView, tabKey, listResource]);

  if (!ready) return <LinearProgress sx={{ m: 0 }} />;
  return <>{children}</>;
};

export default ConferenceListSync;
