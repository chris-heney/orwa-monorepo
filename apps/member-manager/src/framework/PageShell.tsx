import React, {
  ComponentType,
  Fragment,
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, LinearProgress, Theme, useMediaQuery } from '@mui/material';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  EditBase,
  ShowBase,
  Title,
  useDataProvider,
  useListContext,
  useStore,
  useStoreContext,
} from 'react-admin';
import { useQueryClient } from 'react-query';
import type {
  LazyPanel,
  ModuleManifest,
  PageCtx,
  PageManifest,
  PanelSpec,
  TabManifest,
  TitleBarApi,
} from './manifest';
import {
  PageCtxProvider,
  PageManifestProvider,
  TitleBarApiProvider,
  usePageManifest,
  useStoreVersion,
} from './PageContext';
import { moduleOfPage } from './registry';
import { ListScope } from './ListScope';
import { TitleBar } from './TitleBar';
import { TabStrip, panelId, tabId } from './TabStrip';
import { Drawers } from './Drawers';
import { listStoreKey, prefetchList, prefetchTools } from './prefetch';
import { STICKY_BAR_TOP, STICKY_BAR_Z_INDEX } from './layoutTokens';
import { useDrawerGroup } from '../modules/_components/drawer';
import { useCan } from '../modules/rbac-manager/useCan';
import CollapsibleSearchBar from '../modules/_components/CollapsibleSearchBar';

/* ---------- helpers ---------- */

const isLazyPanel = (panel: PanelSpec): panel is LazyPanel =>
  typeof panel === 'object' && panel !== null && 'component' in panel;

const panelComponent = (panel: PanelSpec): ComponentType<any> =>
  isLazyPanel(panel) ? panel.component : panel;

/** RaStore keys the framework introduces (documented for the prefs sync allow-list). */
export const tabStoreKeyFor = (page: PageManifest) =>
  page.titleBar.tabStoreKey ?? `${page.id}.tab`;
export const drawerStoreKeyFor = (page: PageManifest) => `${page.id}.drawer`;
export const searchStoreKeyFor = (page: PageManifest) => `${page.id}.search`;

/**
 * Static ctx (no list / record data) used before the ListScope exists: tab
 * visibility, the permanent list filter, drawer visibility.
 */
const useStaticCtx = (
  module: ModuleManifest,
  page: PageManifest,
  tabKey?: string
): PageCtx => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  const { canOnResource } = useCan();
  const store = useStoreContext();
  const version = useStoreVersion(page.watchStoreKeys);
  return useMemo<PageCtx>(
    () => ({
      moduleId: module.id,
      pageId: page.id,
      tabKey,
      selectedIds: [],
      can: canOnResource,
      store: (key, fallback) => store.getItem(key, fallback),
      isSmall,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [module.id, page.id, tabKey, canOnResource, store, isSmall, version]
  );
};

/** Active tab: URL `?tab=` wins, then RaStore, then `defaultTab` (proposal §6.3). */
const useTabState = (page: PageManifest, tabs: TabManifest[]) => {
  const hasTabs = tabs.length > 0;
  const fallback = page.titleBar.defaultTab ?? tabs[0]?.key;
  const [stored, setStored] = useStore<string | undefined>(
    tabStoreKeyFor(page),
    fallback
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const valid = useCallback(
    (key: string | null | undefined): key is string =>
      Boolean(key) && tabs.some((t) => t.key === key),
    [tabs]
  );

  const key = valid(urlTab) ? urlTab : valid(stored) ? stored : fallback;

  // Mirror the effective tab into both places (replace → no history spam).
  useEffect(() => {
    if (!hasTabs || !key) return;
    if (urlTab !== key) {
      setSearchParams(
        (prev) => {
          prev.set('tab', key);
          return prev;
        },
        { replace: true }
      );
    }
    if (stored !== key) setStored(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTabs, key, urlTab, stored]);

  const setTab = useCallback(
    (next: string) => {
      if (!valid(next)) return;
      setStored(next);
      setSearchParams(
        (prev) => {
          prev.set('tab', next);
          return prev;
        },
        { replace: true }
      );
    },
    [valid, setStored, setSearchParams]
  );

  return { key, setTab };
};

/* ---------- scopes ---------- */

const RecordScope = ({
  page,
  children,
}: {
  page: PageManifest;
  children: ReactNode;
}) => {
  const { id } = useParams();
  const record = page.record!;
  if (page.kind === 'edit') {
    return (
      <EditBase
        resource={record.resource}
        id={id}
        mutationMode={record.mutationMode ?? 'pessimistic'}
        queryOptions={record.queryOptions}
        redirect={false}
      >
        {children}
      </EditBase>
    );
  }
  return (
    <ShowBase resource={record.resource} id={id} queryOptions={record.queryOptions}>
      <>{children}</>
    </ShowBase>
  );
};

/** Collapsible search row → list filter `q` (or `search.source`). */
const SearchRow = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { page } = usePageManifest();
  const { filterValues, setFilters, displayedFilters } = useListContext();
  const source = page.titleBar.search?.source ?? 'q';
  const value = String((filterValues ?? {})[source] ?? '');
  return (
    <CollapsibleSearchBar
      open={open}
      value={value}
      placeholder={page.titleBar.search?.placeholder}
      onChange={(next) => {
        const rest = { ...(filterValues ?? {}) };
        if (next) rest[source] = next;
        else delete rest[source];
        setFilters(rest, displayedFilters, false);
      }}
      onClose={() => {
        const rest = { ...(filterValues ?? {}) };
        delete rest[source];
        setFilters(rest, displayedFilters, false);
        onClose();
      }}
    />
  );
};

const PanelFallback = () => <LinearProgress sx={{ m: 0 }} />;

/* ---------- shell ---------- */

interface ShellProps {
  page: PageManifest;
}

const PageShellInner = ({ page, module }: ShellProps & { module: ModuleManifest }) => {
  const allTabs = page.titleBar.tabs ?? [];
  const staticCtx = useStaticCtx(module, page);
  const tabs = useMemo(
    () => allTabs.filter((t) => (t.visible ? t.visible(staticCtx) : true)),
    [allTabs, staticCtx]
  );
  const { key: tabKey, setTab: setTabRaw } = useTabState(page, tabs);
  const tab = tabs.find((t) => t.key === tabKey) ?? tabs[0];
  const tabCtx = useStaticCtx(module, page, tab?.key);

  const list = tab?.list ?? page.list;
  const hasList = Boolean(list);
  const hasRecord = Boolean(page.record);
  const storeKey = tab
    ? listStoreKey(tab, page.id)
    : page.list?.storeKey ?? `${page.id}.list`;

  const drawers = useDrawerGroup<string>(drawerStoreKeyFor(page));
  const [searchOpen, setSearchOpen] = useStore<boolean>(
    searchStoreKeyFor(page),
    false
  );

  const qc = useQueryClient();
  const dp = useDataProvider();
  const store = useStoreContext();
  const navigate = useNavigate();
  const prefetched = useRef<Set<string>>(new Set());

  const prefetchTab = useCallback(
    (next: TabManifest) => {
      const ctx = { ...tabCtx, tabKey: next.key };
      const tools = prefetchTools(qc, dp, store);
      if (isLazyPanel(next.panel)) void next.panel.preload();
      if (prefetched.current.has(next.key)) return;
      prefetched.current.add(next.key);
      // Cheap: react-query dedupes + staleTime 60s; clear the mark after a
      // minute so a later hover re-warms the cache.
      window.setTimeout(() => prefetched.current.delete(next.key), 60_000);
      const p = next.prefetch
        ? next.prefetch(qc, ctx, tools)
        : next.list
        ? prefetchList(qc, dp, store, next, ctx)
        : undefined;
      p?.catch(() => undefined);
    },
    [qc, dp, store, tabCtx]
  );

  const setTab = useCallback(
    (next: string) => {
      const target = tabs.find((t) => t.key === next);
      if (!target || target.key === tab?.key) return;
      // Drawers are per-tab: a stale Filters body would show the wrong resource.
      drawers.close();
      prefetchTab(target);
      setTabRaw(next);
    },
    [tabs, tab?.key, drawers, prefetchTab, setTabRaw]
  );

  const api = useMemo<TitleBarApi>(
    () => ({
      setTab,
      openDrawer: drawers.open,
      closeDrawers: drawers.close,
      toggleDrawer: drawers.toggle,
      isDrawerOpen: drawers.isOpen,
      toggleSearch: () => setSearchOpen(!searchOpen),
      navigate: (to) => (typeof to === 'number' ? navigate(to) : navigate(to)),
    }),
    [setTab, drawers, searchOpen, setSearchOpen, navigate]
  );

  // Warm the initial tab's neighbours lazily? No — only on intent (hover/click).

  const appBarTitle =
    page.titleBar.appBarTitle ??
    (typeof page.titleBar.title === 'string' ? page.titleBar.title : module.title);

  const Body = page.body;
  const showSearch = Boolean(page.titleBar.search) && hasList;
  const SubBar = page.titleBar.subBar;

  const panels = (
    <Box
      sx={{
        p: 0,
        m: 0,
        width: '100%',
        minWidth: 0,
        bgcolor: 'background.paper',
      }}
    >
      <Suspense fallback={<PanelFallback />}>
        {tabs.length > 0
          ? tabs.map((t) => {
              const active = t.key === tab?.key;
              if (!active && !t.keepMounted) return null;
              const Panel = panelComponent(t.panel);
              return (
                <Box
                  key={t.key}
                  role="tabpanel"
                  id={panelId(page.id, t.key)}
                  aria-labelledby={tabId(page.id, t.key)}
                  hidden={!active}
                  sx={{ p: 0, m: 0, minWidth: 0 }}
                >
                  <Panel />
                </Box>
              );
            })
          : Body && <Body />}
      </Suspense>
    </Box>
  );

  const content = (
    <PageCtxProvider
      module={module}
      page={page}
      tab={tab}
      hasList={hasList}
      hasRecord={hasRecord}
    >
      <Title title={appBarTitle} />
      <Box sx={{ width: '100%', minWidth: 0, m: 0, p: 0 }}>
        {/* THE sticky wrapper — pages never add their own. */}
        <Box
          data-framework="sticky"
          sx={{
            position: 'sticky',
            top: STICKY_BAR_TOP,
            zIndex: STICKY_BAR_Z_INDEX,
            m: 0,
            p: 0,
          }}
        >
          <TitleBar searchOpen={searchOpen} hasList={hasList} />
          {SubBar ? <SubBar /> : null}
          {showSearch ? (
            <SearchRow open={searchOpen} onClose={() => setSearchOpen(false)} />
          ) : null}
          {tabs.length > 0 && tab ? (
            <TabStrip
              tabs={tabs}
              value={tab.key}
              onChange={setTab}
              onIntent={(k) => {
                const t = tabs.find((x) => x.key === k);
                if (t) prefetchTab(t);
              }}
            />
          ) : null}
        </Box>
        {panels}
        <Drawers />
      </Box>
    </PageCtxProvider>
  );

  const scoped = list ? (
    <ListScope key={storeKey} list={list} storeKey={storeKey} filterCtx={tabCtx}>
      {content}
    </ListScope>
  ) : (
    content
  );

  const withRecord = hasRecord ? (
    <RecordScope page={page}>{scoped}</RecordScope>
  ) : (
    scoped
  );

  return (
    <PageManifestProvider value={{ module, page, tabs, tab }}>
      <TitleBarApiProvider value={api}>{withRecord}</TitleBarApiProvider>
    </PageManifestProvider>
  );
};

/**
 * THE page shell. Correct by construction: 0 outer margin, one sticky
 * heading (TitleBar + search + TabStrip), `p: 0` panels with only the active
 * tab mounted (React.lazy), one ListBase per list tab shared by bar / panel /
 * drawers, right drawers fed by DrawerContext.
 */
export const PageShell = ({ page }: ShellProps) => {
  const module = moduleOfPage(page);
  const Provider = page.provider ?? Fragment;
  return (
    <Provider>
      <PageShellInner page={page} module={module} />
    </Provider>
  );
};

export default PageShell;
