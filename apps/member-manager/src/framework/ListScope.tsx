import React, { ReactNode, useMemo } from 'react';
import { Box } from '@mui/material';
import {
  Exporter,
  FilterContext,
  FilterForm,
  ListBase,
  RaRecord,
  SavedQueriesList,
  useListContext,
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
      sort={list.sort ?? DEFAULT_SORT}
      perPage={list.perPage ?? DEFAULT_PER_PAGE}
      exporter={exporter ?? false}
      queryOptions={list.meta ? { meta: list.meta } : undefined}
      disableSyncWithLocation
    >
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
