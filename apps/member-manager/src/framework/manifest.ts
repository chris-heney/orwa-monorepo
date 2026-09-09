/**
 * Module / page / tab / action / drawer manifests — the declarative layer the
 * layout framework reads (see README.md in this folder).
 *
 * Manifests are plain objects: icon *components* (not JSX), react-admin filter
 * *elements* where RA's own vocabulary is the right one, and component
 * references for bodies. `App.tsx`, `layouts/Admin.tsx` and the RBAC route
 * guard consume the registry built from them (`registry.tsx`).
 */
import type {
  ComponentType,
  LazyExoticComponent,
  ReactElement,
  ReactNode,
} from 'react';
import type { SvgIconProps } from '@mui/material';
import type { Identifier, RaRecord, SortPayload } from 'react-admin';
import type { QueryClient } from 'react-query';
import type { ModuleKey } from '../config/modules';
import type { CrudAction } from '../modules/rbac-manager/useCan';
import type { DrawerContextValue } from '../modules/_components/drawer';

/** Icon component reference (config stays JSX-free). */
export type Icon = ComponentType<SvgIconProps>;

/**
 * What every `visible()` / `title()` / `filter()` / `prefetch()` receives.
 * Built by `PageShell` from the current route, tab, list and record.
 */
export interface PageCtx {
  moduleId: ModuleKey;
  pageId: string;
  tabKey?: string;
  /** The drawer-context union doubles as THE page focus: record page or list page. */
  focus?: DrawerContextValue;
  /** Convenience mirror of `focus.record` on record pages. */
  record?: RaRecord;
  selectedIds: Identifier[];
  total?: number;
  /** RBAC by react-admin resource name (`useCan().canOnResource`). */
  can: (action: CrudAction, resource: string) => boolean;
  /** RaStore read (subscribe via `PageManifest.watchStoreKeys`). */
  store: <T>(key: string, fallback: T) => T;
  isSmall: boolean;
}

/** Imperative surface handed to action handlers (`useTitleBar()`). */
export interface TitleBarApi {
  setTab: (key: string) => void;
  openDrawer: (id: string) => void;
  closeDrawers: () => void;
  toggleDrawer: (id: string) => void;
  isDrawerOpen: (id: string) => boolean;
  toggleSearch: () => void;
  navigate: (to: string | number) => void;
}

export type ActionScope = 'list' | 'selection' | 'record';

export interface ActionManifest {
  id: string;
  label: string;
  icon: Icon;
  /**
   * `list`: about the current list (Filters, Export, Columns, Add).
   * `selection`: only while rows are selected (bulk actions) — rendered in the
   *   title bar next to "N selected".
   * `record`: about the current record (show/edit pages: Edit, Notifications).
   */
  scope: ActionScope;
  /** RBAC: [crudAction, resource] → hidden unless `useCan().canOnResource` passes. */
  can?: [CrudAction, string];
  visible?: (ctx: PageCtx) => boolean;
  /** Custom renderer (existing presets such as ExportAction / ColumnsAction). */
  component?: ComponentType<{ ctx: PageCtx; api: TitleBarApi }>;
  /** Plain handler — the framework renders a 32px HeadingAction. */
  onClick?: (ctx: PageCtx, api: TitleBarApi) => void;
  /** Toggle actions: mirror this drawer's open state as `active`, click toggles it. */
  togglesDrawer?: string;
  /** Toggle the collapsible search row (`titleBar.search`). */
  togglesSearch?: boolean;
  placement?: 'bar' | 'overflow';
  /** Lower = further left. Back is always last. Default 100. */
  order?: number;
  /** Keep the text label even when the user has labels off (primary actions). */
  forceLabel?: boolean;
  color?: 'inherit' | 'primary' | 'secondary' | 'warning' | 'error';
}

export interface DrawerManifest {
  /** Group key — one drawer per page open at a time; also the `togglesDrawer` target. */
  id: string;
  title: string;
  icon: Icon;
  /** Which DrawerContext the body receives (built by the framework). */
  context: 'list' | 'record';
  width?: number;
  /** Body reads `useDrawerContext()` / `useListContext()` / `useRecordContext()`. */
  body: ComponentType;
  headerActions?: ComponentType;
  visible?: (ctx: PageCtx) => boolean;
}

/** `panel: lazyPanel(() => import('./Panel'))` — React.lazy + a preloader for `setTab()`. */
export interface LazyPanel {
  component: LazyExoticComponent<ComponentType<any>>;
  preload: () => Promise<unknown>;
}
export type PanelSpec = ComponentType<any> | LazyPanel;

export interface ListManifest {
  resource: string;
  /** Permanent filter merged over the user's filter values (same as ListBase `filter`). */
  filter?: Record<string, unknown> | ((ctx: PageCtx) => Record<string, unknown>);
  sort?: SortPayload;
  perPage?: number;
  meta?: Record<string, unknown>;
  /** RaStore key for list params/selection. Default `${pageId}.${tabKey}`. */
  storeKey?: string;
  exporter?: (records: RaRecord[], ctx: PageCtx) => void | Promise<void>;
  /** RA filter *elements* (TextInput, ReferenceInput …) → Filters drawer via FilterForm. */
  filters?: ReactElement[];
  /** Custom Filters drawer body (FilterList-style sidebars). Wins over `filters`. */
  filterBody?: ComponentType;
  /** Extra header buttons in the Filters drawer (e.g. save current query). */
  filterHeaderActions?: ComponentType;
  savedQueries?: boolean;
  /** `false` disables the auto-generated Filters action + drawer. */
  filtersDrawer?: boolean;
  /** Show "N selected" in the bar while rows are selected (default true when selection actions exist). */
  selectionCount?: boolean;
}

export interface TabManifest {
  key: string;
  label: string;
  icon: Icon;
  /** Optional primary list → ONE ListBase around bar + panel + drawers. */
  list?: ListManifest;
  /** Bar title while this tab is active. Default: `${page title} : ${label}`. */
  title?: string | ((ctx: PageCtx) => ReactNode);
  actions?: ActionManifest[];
  drawers?: DrawerManifest[];
  visible?: (ctx: PageCtx) => boolean;
  /** Draw a separator before this tab. */
  divider?: boolean;
  /** Custom prefetch on `setTab()` / hover; default prefetches `list`. */
  prefetch?: (qc: QueryClient, ctx: PageCtx, tools: PrefetchTools) => Promise<unknown>;
  panel: PanelSpec;
  /** Keep the panel mounted (hidden) when inactive — form drafts, heavy charts. */
  keepMounted?: boolean;
}

export interface PrefetchTools {
  prefetchList: (tab: TabManifest, ctx: PageCtx) => Promise<unknown>;
  prefetchOne: (
    resource: string,
    id: Identifier | undefined | null,
    meta?: Record<string, unknown>
  ) => Promise<unknown>;
  prefetchQuery: QueryClient['prefetchQuery'];
}

export type PageKind = 'dashboard' | 'list' | 'show' | 'edit' | 'create' | 'custom';

export interface TitleBarManifest {
  /** Bar title. Also emitted as the app-bar `<Title>` when a string (see `appBarTitle`). */
  title: string | ((ctx: PageCtx) => ReactNode);
  /** App-bar (black) title. Default: string `title`, else the module title. */
  appBarTitle?: string;
  /** ⓘ tooltip beside the title (RBAC Manager / Training History pattern). */
  infoTooltip?: string;
  /** Collapsible search row under the bar → list filter `source` (default `q`). */
  search?: { placeholder?: string; source?: string };
  tabs?: TabManifest[];
  defaultTab?: string;
  /** RaStore key for the active tab. Default `${pageId}.tab`. */
  tabStoreKey?: string;
  /** Show/edit: Back target (path, or `-1` for history) → far-right arrow. */
  back?: string | number | ((ctx: PageCtx) => string | number);
  backLabel?: string;
  /** Tab-less pages may still show the record count when they have a list. */
  showCount?: boolean;
}

export interface PageManifest {
  /** `${moduleId}.${name}` */
  id: string;
  /** CustomRoutes path (no leading slash), e.g. `grant/dashboard`. Omit for pages mounted via `resources` views. */
  route?: string;
  kind: PageKind;
  titleBar: TitleBarManifest;
  /** Page-level actions — merged before tab actions. */
  actions?: ActionManifest[];
  drawers?: DrawerManifest[];
  /** Body when the page has no tabs. */
  body?: ComponentType;
  /** Tab-less list page: the single implicit list scope. */
  list?: ListManifest;
  /** Record pages: wrap in ShowBase / EditBase (id from the route). */
  record?: {
    resource: string;
    queryOptions?: Record<string, unknown>;
    mutationMode?: 'pessimistic' | 'optimistic' | 'undoable';
  };
  /** RaStore keys whose changes must re-render titles / visibility (`ctx.store`). */
  watchStoreKeys?: string[];
  /** Optional wrapper (legacy module context providers) around the whole shell. */
  provider?: ComponentType<{ children: ReactNode }>;
}

/** react-admin `<Resource>` definition (`{ list, edit, create, show, recordRepresentation, … }`). */
export type ResourceDefinition = Record<string, unknown>;

export interface MenuManifest {
  label: string;
  to: string;
  /** Sub-items → MultiLevelMenu group. */
  children?: { name?: string; label: string; to: string }[];
}

export interface ModuleManifest {
  id: ModuleKey;
  title: string;
  icon: Icon;
  menu: MenuManifest | false;
  /** Modules whose pages this one `extends` or whose bodies it reuses. */
  dependencies?: ModuleKey[];
  /** RBAC seed: route prefixes + resources this module owns (config/modules.ts contract). */
  permissions: { pathPrefixes: string[]; resources: string[] };
  /** react-admin `<Resource>`s this module owns. */
  resources?: Record<string, ResourceDefinition>;
  pages: PageManifest[];
  /** Odoo "inherit": contributions to OTHER modules' pages. */
  extends?: PageExtension[];
  /** Extra non-layout routes (settings pages, wizards) rendered as CustomRoutes. */
  routes?: { path: string; element: ReactElement; noLayout?: boolean }[];
}

export interface PageExtension {
  pageId: string;
  tabs?: (TabManifest & { after?: string })[];
  /** `tab` omitted → page-level. */
  actions?: (ActionManifest & { tab?: string })[];
  drawers?: (DrawerManifest & { tab?: string })[];
  removeTabs?: string[];
}
