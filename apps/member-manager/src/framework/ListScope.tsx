import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import {
  Exporter,
  FilterContext,
  FilterForm,
  ListBase,
  ListParams,
  RaRecord,
  SavedQueriesList,
  SortPayload,
  useListContext,
  useStore,
} from 'react-admin';
import type { ListManifest, PageCtx } from './manifest';
import { usePageCtx, usePageManifest } from './PageContext';
import { DEFAULT_PER_PAGE, DEFAULT_SORT } from './prefetch';

interface ListScopeProps {
  list: ListManifest;
  storeKey: string;
  /** Static ctx (store/isSmall/can) used to resolve the permanent filter. */
  filterCtx: PageCtx;
  children: ReactNode;
}

/** RaStore key RA itself would use for a location-synced list (`prefetch.ts` reads the same). */
export const listParamsStoreKey = (storeKey: string) => `${storeKey}.listParams`;

const isEmpty = (o: Record<string, unknown> | undefined) =>
  !o || Object.keys(o).length === 0;

/**
 * RA 4.16 `useListParams` with `disableSyncWithLocation` keeps sort / page /
 * perPage / filter in React state and never touches RaStore, so every
 * dashboard-embedded list forgot its params on each mount. The framework owns
 * the one `ListBase` per resource tab, so it persists them here: this mirrors
 * `useListContext` into `${storeKey}.listParams` (RA's own `ListParams`
 * shape, which the prefs sync already carries) and `ListScope` feeds the saved
 * values back as `sort` / `perPage` / `filterDefaultValues` (+ page) on mount.
 */
const ListParamsPersistence = ({
  storeKey,
  savedPage,
}: {
  storeKey: string;
  savedPage: number;
}) => {
  const { sort, page, perPage, filterValues, displayedFilters, setPage, isLoading } =
    useListContext();
  const [, setSaved] = useStore<Partial<ListParams>>(
    listParamsStoreKey(storeKey),
    {}
  );
  // `ListBase` has no `page` prop: restore it once, and hold writes until the
  // controller reflects it so page 1 never overwrites the saved page.
  const pendingPage = useRef<number | null>(savedPage > 1 ? savedPage : null);
  const attempted = useRef(false);
  const last = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (pendingPage.current != null) {
      if (!attempted.current) {
        attempted.current = true;
        setPage(pendingPage.current);
        return;
      }
      if (page !== pendingPage.current) {
        // Still applying, or RA's out-of-range guard pushed it back to 1 —
        // either way stop holding once the fetch settles.
        if (isLoading) return;
      }
      pendingPage.current = null;
    }
    const next: Partial<ListParams> = {
      sort: sort?.field,
      order: sort?.order,
      page,
      perPage,
      filter: filterValues ?? {},
      displayedFilters: displayedFilters ?? {},
    };
    const json = JSON.stringify(next);
    if (last.current === json) return;
    last.current = json;
    setSaved(next);
  }, [
    sort?.field,
    sort?.order,
    page,
    perPage,
    filterValues,
    displayedFilters,
    isLoading,
    setPage,
    setSaved,
  ]);
  return null;
};

/**
 * ONE `ListBase` per resource tab shared by title-bar count / export /
 * columns / selection actions, the panel's grid and the Filters drawer body —
 * replaces the duplicated header `ListBase`s legacy dashboards mounted just
 * to read `total`.
 */
export const ListScope = ({
  list,
  storeKey,
  filterCtx,
  children,
}: ListScopeProps) => {
  // Snapshot the saved params once per mount (PageShell remounts the scope per
  // storeKey); later writes by ListParamsPersistence must not churn the props.
  const [savedParams] = useStore<Partial<ListParams>>(
    listParamsStoreKey(storeKey),
    {}
  );
  const [saved] = useState<Partial<ListParams>>(() => savedParams ?? {});
  const initialSort = useMemo<SortPayload>(
    () =>
      saved.sort
        ? { field: saved.sort, order: (saved.order as 'ASC' | 'DESC') ?? 'ASC' }
        : list.sort ?? DEFAULT_SORT,
    [saved, list.sort]
  );
  const initialPerPage = saved.perPage ?? list.perPage ?? DEFAULT_PER_PAGE;
  const initialFilter = isEmpty(saved.filter) ? undefined : saved.filter;

  const filter = useMemo(
    () =>
      (typeof list.filter === 'function'
        ? list.filter(filterCtx)
        : list.filter) ?? {},
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list, filterCtx]
  );

  const exporter = useMemo<Exporter | undefined>(
    () =>
      list.exporter
        ? (
            records: RaRecord[],
            fetchRelatedRecords: Parameters<Exporter>[1],
            dataProvider: Parameters<Exporter>[2],
            resource?: string
          ) =>
            list.exporter!(records, filterCtx, {
              fetchRelatedRecords,
              dataProvider,
              resource: resource ?? list.resource,
            }) as void | Promise<void>
        : undefined,
    [list, filterCtx]
  );

  const base = (
    <ListBase
      resource={list.resource}
      storeKey={storeKey}
      filter={filter}
      filterDefaultValues={initialFilter}
      sort={initialSort}
      perPage={initialPerPage}
      exporter={exporter ?? false}
      queryOptions={list.meta ? { meta: list.meta } : undefined}
      disableSyncWithLocation
    >
      <ListParamsPersistence storeKey={storeKey} savedPage={saved.page ?? 1} />
      {children}
    </ListBase>
  );

  return list.filters ? (
    <FilterContext.Provider value={list.filters}>{base}</FilterContext.Provider>
  ) : (
    base
  );
};

/** Default Filters drawer body: RA filter elements via FilterForm (+ saved queries). */
export const DefaultFiltersBody = () => {
  const { tab, page } = usePageManifest();
  const list = tab?.list ?? page.list;
  const { filterValues } = useListContext();
  if (!list) return null;
  if (list.filterBody) {
    const Body = list.filterBody;
    return <Body />;
  }
  return (
    <Box
      sx={{
        p: 2,
        '& .RaFilterForm-form': {
          flexDirection: 'column',
          alignItems: 'stretch',
        },
        '& .RaFilterFormInput-body, & .filter-field': { width: '100%' },
      }}
      data-filter-count={Object.keys(filterValues ?? {}).length}
    >
      <FilterForm />
      {list.savedQueries ? <SavedQueriesList /> : null}
    </Box>
  );
};

/** Optional header buttons in the Filters drawer. */
export const DefaultFiltersHeaderActions = () => {
  const { tab, page } = usePageManifest();
  const list = tab?.list ?? page.list;
  const Extra = list?.filterHeaderActions;
  return Extra ? <Extra /> : null;
};

/** Hook for panel bodies: the manifest of the list they render in. */
export const useListManifest = (): ListManifest | undefined => {
  const { tab, page } = usePageManifest();
  return tab?.list ?? page.list;
};

/** Convenience for bodies that need the resolved permanent filter. */
export const useResolvedListFilter = (): Record<string, unknown> => {
  const ctx = usePageCtx();
  const list = useListManifest();
  return useMemo(
    () =>
      (typeof list?.filter === 'function' ? list.filter(ctx) : list?.filter) ??
      {},
    [list, ctx]
  );
};
