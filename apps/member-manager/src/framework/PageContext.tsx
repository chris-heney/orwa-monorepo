import { useParams } from 'react-router-dom';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Theme, useMediaQuery } from '@mui/material';
import {
  useListContext,
  useRecordContext,
  useStoreContext,
} from 'react-admin';
import type {
  ModuleManifest,
  PageCtx,
  PageManifest,
  TabManifest,
  TitleBarApi,
} from './manifest';
import { useCan } from '../modules/rbac-manager/useCan';
import {
  listDrawerContext,
  recordDrawerContext,
} from '../modules/_components/drawer';

/* ---------- static page manifest context ---------- */

export interface PageManifestContextValue {
  module: ModuleManifest;
  page: PageManifest;
  tabs: TabManifest[];
  tab?: TabManifest;
}

const PageManifestContext = createContext<PageManifestContextValue | null>(null);

export const PageManifestProvider = ({
  value,
  children,
}: {
  value: PageManifestContextValue;
  children: ReactNode;
}) => (
  <PageManifestContext.Provider value={value}>
    {children}
  </PageManifestContext.Provider>
);

export const usePageManifest = (): PageManifestContextValue => {
  const ctx = useContext(PageManifestContext);
  if (!ctx) throw new Error('framework: usePageManifest outside PageShell');
  return ctx;
};

/** Undefined outside a PageShell (legacy pages). */
export const usePageManifestOptional = () => useContext(PageManifestContext);

export const useTabManifest = (): TabManifest | undefined =>
  usePageManifest().tab;

/* ---------- api context ---------- */

const TitleBarApiContext = createContext<TitleBarApi | null>(null);

export const TitleBarApiProvider = ({
  value,
  children,
}: {
  value: TitleBarApi;
  children: ReactNode;
}) => (
  <TitleBarApiContext.Provider value={value}>
    {children}
  </TitleBarApiContext.Provider>
);

export const useTitleBar = (): TitleBarApi => {
  const api = useContext(TitleBarApiContext);
  if (!api) throw new Error('framework: useTitleBar outside PageShell');
  return api;
};

/* ---------- live page ctx ---------- */

const PageCtxContext = createContext<PageCtx | null>(null);

export const usePageCtx = (): PageCtx => {
  const ctx = useContext(PageCtxContext);
  if (!ctx) throw new Error('framework: usePageCtx outside PageShell');
  return ctx;
};

export const usePageCtxOptional = () => useContext(PageCtxContext);

/**
 * Subscribe to the RaStore keys a page declares in `watchStoreKeys` and bump
 * a version so `ctx.store()` readers (titles, filters, visibility) re-render.
 */
export const useStoreVersion = (keys: string[] | undefined) => {
  const store = useStoreContext();
  const [version, setVersion] = useState(0);
  const joined = (keys ?? []).join('|');
  useEffect(() => {
    if (!keys?.length) return;
    const unsubs = keys.map((key) =>
      store.subscribe(key, () => setVersion((v) => v + 1))
    );
    return () => unsubs.forEach((u) => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, joined]);
  return version;
};

interface BuildProps {
  module: ModuleManifest;
  page: PageManifest;
  tab?: TabManifest;
  /** true when rendered inside the framework's ListScope */
  hasList: boolean;
  /** true when rendered inside ShowBase / EditBase */
  hasRecord: boolean;
  children: ReactNode;
}

/**
 * Builds the `PageCtx` from whatever react-admin contexts surround it.
 * Rendered by PageShell *inside* ListScope / RecordScope so `useListContext`
 * and `useRecordContext` see the page's own list / record.
 */
export const PageCtxProvider = ({
  module,
  page,
  tab,
  hasList,
  hasRecord,
  children,
}: BuildProps) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  const { canOnResource } = useCan();
  const store = useStoreContext();
  const version = useStoreVersion(page.watchStoreKeys);
  const params = useParams();

  // Both hooks are safe without providers (react-admin returns empty defaults).
  const list = useListContext();
  const record = useRecordContext();

  const listResource = tab?.list?.resource ?? page.list?.resource;
  const recordResource = page.record?.resource;

  const selectedIds = hasList ? list.selectedIds ?? [] : [];
  const total = hasList ? list.total : undefined;
  const filterValues = hasList ? list.filterValues : undefined;
  const sort = hasList ? list.sort : undefined;

  const value = useMemo<PageCtx>(() => {
    const focus = hasRecord
      ? recordDrawerContext(record, recordResource ?? '')
      : hasList && listResource
      ? listDrawerContext({
          resource: listResource,
          filter: filterValues,
          sort,
          selectedIds,
          total,
        })
      : undefined;
    return {
      moduleId: module.id,
      pageId: page.id,
      tabKey: tab?.key,
      focus,
      record: hasRecord ? record : undefined,
      selectedIds,
      total,
      can: canOnResource,
      store: (key, fallback) => store.getItem(key, fallback),
      params,
      isSmall,
    };
    // `version` is a dependency on purpose: store writes rebuild the ctx.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    module.id,
    page.id,
    tab?.key,
    hasRecord,
    hasList,
    record,
    recordResource,
    listResource,
    filterValues,
    sort,
    selectedIds,
    total,
    canOnResource,
    store,
    params,
    isSmall,
    version,
  ]);

  return (
    <PageCtxContext.Provider value={value}>{children}</PageCtxContext.Provider>
  );
};
