import type { QueryClient } from 'react-query';
import type {
  DataProvider,
  GetListParams,
  Identifier,
  ListParams,
  SortPayload,
} from 'react-admin';
import type { Store } from 'ra-core';
import type { PageCtx, PrefetchTools, TabManifest } from './manifest';

/**
 * Query-key construction for react-admin 4.16 / react-query 3 — isolated here
 * (proposal §6.8) and covered by `prefetch.spec.ts`, so an RA upgrade that
 * changes the key shape fails loudly instead of silently double-fetching.
 *
 * Verified against `ra-core/src/dataProvider/useGetList.ts`:
 *   [resource, 'getList', { pagination, sort, filter, meta }]
 * and `useGetOne.ts`:
 *   [resource, 'getOne', { id: String(id), meta }]
 */
export const listQueryKey = (resource: string, p: GetListParams) =>
  [
    resource,
    'getList',
    { pagination: p.pagination, sort: p.sort, filter: p.filter, meta: p.meta },
  ] as const;

export const oneQueryKey = (
  resource: string,
  id: Identifier,
  meta?: Record<string, unknown>
) => [resource, 'getOne', { id: String(id), meta }] as const;

export const listStoreKey = (tab: TabManifest, pageId: string) =>
  tab.list?.storeKey ?? `${pageId}.${tab.key}`;

export const DEFAULT_SORT: SortPayload = { field: 'id', order: 'DESC' };
export const DEFAULT_PER_PAGE = 25;

export const resolveListFilter = (
  tab: TabManifest,
  ctx: PageCtx
): Record<string, unknown> => {
  const f = tab.list?.filter;
  return (typeof f === 'function' ? f(ctx) : f) ?? {};
};

/**
 * The exact `GetListParams` `useListController` will ask for once the tab
 * mounts: saved list params (RaStore `${storeKey}.listParams`) merged with the
 * manifest's permanent filter — same merge order as ra-core.
 */
export const listParamsForTab = (
  store: Store,
  tab: TabManifest,
  ctx: PageCtx
): GetListParams => {
  const list = tab.list!;
  const saved = store.getItem<Partial<ListParams>>(
    `${listStoreKey(tab, ctx.pageId)}.listParams`,
    {}
  );
  const sort: SortPayload = saved.sort
    ? { field: saved.sort, order: (saved.order as 'ASC' | 'DESC') ?? 'ASC' }
    : list.sort ?? DEFAULT_SORT;
  return {
    pagination: {
      page: saved.page ?? 1,
      perPage: saved.perPage ?? list.perPage ?? DEFAULT_PER_PAGE,
    },
    sort,
    filter: { ...(saved.filter ?? {}), ...resolveListFilter(tab, ctx) },
    meta: list.meta,
  };
};

export const STALE_TIME = 60_000;

export const prefetchList = async (
  qc: QueryClient,
  dp: DataProvider,
  store: Store,
  tab: TabManifest,
  ctx: PageCtx
) => {
  if (!tab.list) return;
  const params = listParamsForTab(store, tab, ctx);
  const resource = tab.list.resource;
  await qc.prefetchQuery(
    listQueryKey(resource, params),
    () =>
      dp
        .getList(resource, params)
        .then(({ data, total, pageInfo }) => ({ data, total, pageInfo })),
    { staleTime: STALE_TIME }
  );
};

export const prefetchOne = async (
  qc: QueryClient,
  dp: DataProvider,
  resource: string,
  id: Identifier | undefined | null,
  meta?: Record<string, unknown>
) => {
  if (id == null || id === '' || id === 0) return;
  await qc.prefetchQuery(
    oneQueryKey(resource, id, meta),
    () => dp.getOne(resource, { id, meta }).then((r) => r.data),
    { staleTime: STALE_TIME }
  );
};

export const prefetchTools = (
  qc: QueryClient,
  dp: DataProvider,
  store: Store
): PrefetchTools => ({
  prefetchList: (tab, ctx) => prefetchList(qc, dp, store, tab, ctx),
  prefetchOne: (resource, id, meta) => prefetchOne(qc, dp, resource, id, meta),
  prefetchQuery: qc.prefetchQuery.bind(qc),
});
