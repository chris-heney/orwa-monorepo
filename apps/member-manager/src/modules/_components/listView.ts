import { useCallback } from 'react';
import { useListContext, useStore } from 'react-admin';
import { usePageManifest } from '../../framework/PageContext';

/**
 * Everything a saved query restores *besides* the filter values: sort, page
 * size, which optional filter inputs are showing, and the visible columns in
 * their chosen order.
 *
 * Deliberately RA's own `ListParams` vocabulary (the shape
 * `ListParamsPersistence` already mirrors into RaStore) so there is one
 * spelling of "a list view" in the app.
 */
export interface SavedListView {
  sort?: { field: string; order: 'ASC' | 'DESC' };
  perPage?: number;
  displayedFilters?: Record<string, boolean>;
  /**
   * Ordered ids of the *shown* columns — RA's
   * `preferences.<key>.columns`, which encodes selection and order in one
   * array. `DatagridConfigurable` and our `AgDatagrid` both read it, so no
   * per-grid special-casing is needed.
   */
  columns?: string[];
  /** Which preference key `columns` came from — guards against cross-list restores. */
  columnsKey?: string;
}

/** RaStore key holding a list's visible-column ids. */
export const columnsPreferenceKeyFor = (
  manifestKey: string | undefined,
  resource: string | undefined
) => manifestKey ?? `${resource ?? ''}.datagrid`;

/** Full RaStore path for the column ids (what `useStore` is given). */
export const columnsStorePath = (columnsKey: string) =>
  `preferences.${columnsKey}.columns`;

/** Normalise a live list into the persisted shape. Pure — see the spec. */
export const buildListView = (input: {
  sort?: { field?: string; order?: string };
  perPage?: number;
  displayedFilters?: Record<string, boolean>;
  columns?: string[];
  columnsKey: string;
}): SavedListView => ({
  // A list with no explicit sort must not persist a half-built sort object.
  sort: input.sort?.field
    ? {
        field: input.sort.field,
        order: input.sort.order === 'DESC' ? 'DESC' : 'ASC',
      }
    : undefined,
  perPage: input.perPage,
  displayedFilters: input.displayedFilters ?? {},
  columns: input.columns,
  columnsKey: input.columnsKey,
});

/**
 * Whether a saved view's columns may be written to this list's preferences.
 * A view saved on another resource would otherwise reorder — or blank — the
 * current grid. Views saved before `columnsKey` existed are trusted, since
 * saved queries are already scoped to one resource.
 */
export const canRestoreColumns = (
  view: SavedListView | undefined,
  columnsKey: string
): boolean =>
  Boolean(
    view?.columns?.length &&
      (!view.columnsKey || view.columnsKey === columnsKey)
  );

/**
 * RaStore key holding the visible-column ids for the current list.
 * `ListManifest.columnsPreferenceKey` overrides it for lists whose grid was
 * mounted with a non-default `preferenceKey`.
 */
export const useColumnsPreferenceKey = (): string => {
  const { tab, page } = usePageManifest();
  const list = tab?.list ?? page.list;
  const { resource } = useListContext();
  return columnsPreferenceKeyFor(
    list?.columnsPreferenceKey,
    list?.resource ?? resource
  );
};

/** Snapshot the current list view — pair with `useApplyListView`. */
export const useCaptureListView = (): (() => SavedListView) => {
  const { sort, perPage, displayedFilters } = useListContext();
  const columnsKey = useColumnsPreferenceKey();
  const [columns] = useStore<string[] | undefined>(
    columnsStorePath(columnsKey),
    undefined
  );

  return useCallback(
    () =>
      buildListView({
        sort,
        perPage,
        displayedFilters,
        columns,
        columnsKey,
      }),
    [sort, perPage, displayedFilters, columns, columnsKey]
  );
};

/**
 * Restore a saved view. Every part is optional so rows saved before the view
 * existed (filters only) still apply cleanly.
 */
export const useApplyListView = (): ((view: SavedListView | undefined) => void) => {
  const { setSort, setPerPage, setPage } = useListContext();
  const columnsKey = useColumnsPreferenceKey();
  const [, setColumns] = useStore<string[] | undefined>(
    columnsStorePath(columnsKey),
    undefined
  );

  return useCallback(
    (view) => {
      if (!view) return;
      if (view.sort?.field) setSort(view.sort);
      if (view.perPage) setPerPage(view.perPage);
      if (canRestoreColumns(view, columnsKey)) setColumns(view.columns);
      // The saved page number belongs to the old result set, not this one.
      setPage(1);
    },
    [setSort, setPerPage, setPage, setColumns, columnsKey]
  );
};
