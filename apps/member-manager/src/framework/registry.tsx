import React, { ReactElement } from 'react';
import { APP_MODULES, AppModule, ModuleKey } from '../config/modules';
import { guardResource } from '../modules/rbac-manager/guardResource';
import type {
  ModuleManifest,
  PageManifest,
  ResourceDefinition,
  TabManifest,
} from './manifest';
import { PageShell } from './PageShell';

/**
 * Module registry — `App.tsx` / `layouts/Admin.tsx` / the RBAC guard read the
 * result of `finalizeRegistry()` instead of hand-written `<Resource>`,
 * `<Route>` and menu blocks.
 *
 * Proposal §6.1: modules are passed as an explicit list (no import-order
 * side effects). `finalizeRegistry` is idempotent for the same list.
 */
export interface Registry {
  modules: ModuleManifest[];
  pages: Map<string, PageManifest>;
  moduleKeys: Set<ModuleKey>;
  resourceNames: Set<string>;
  routePaths: Set<string>;
}

let current: Registry | null = null;

const topoSort = (modules: ModuleManifest[]): ModuleManifest[] => {
  const byId = new Map(modules.map((m) => [m.id, m]));
  const seen = new Set<ModuleKey>();
  const visiting = new Set<ModuleKey>();
  const out: ModuleManifest[] = [];
  const visit = (m: ModuleManifest) => {
    if (seen.has(m.id)) return;
    if (visiting.has(m.id)) {
      throw new Error(`framework: dependency cycle at module "${m.id}"`);
    }
    visiting.add(m.id);
    for (const dep of m.dependencies ?? []) {
      const d = byId.get(dep);
      // A dependency that is not (yet) registered is tolerated during the
      // incremental migration — the module simply cannot extend its pages.
      if (d) visit(d);
    }
    visiting.delete(m.id);
    seen.add(m.id);
    out.push(m);
  };
  modules.forEach(visit);
  return out;
};

const insertAfter = <T extends { key: string }>(
  list: T[],
  item: T,
  after?: string
) => {
  const idx = after ? list.findIndex((t) => t.key === after) : -1;
  if (idx === -1) list.push(item);
  else list.splice(idx + 1, 0, item);
};

const tabByKey = (tabs: TabManifest[], key: string, pageId: string) => {
  const tab = tabs.find((t) => t.key === key);
  if (!tab) throw new Error(`framework: page "${pageId}" has no tab "${key}"`);
  return tab;
};

/** Reflect a registered module's permissions into the RBAC seed table. */
const syncAppModules = (modules: ModuleManifest[]) => {
  for (const m of modules) {
    const entry: AppModule | undefined = APP_MODULES.find((a) => a.key === m.id);
    const next: AppModule = {
      key: m.id,
      label: m.title,
      to: m.menu ? m.menu.to : '/admin/settings',
      pathPrefixes: [...m.permissions.pathPrefixes],
      resources: [...m.permissions.resources],
    };
    if (entry) Object.assign(entry, next);
    else APP_MODULES.push(next);
  }
};

export function finalizeRegistry(list: ModuleManifest[]): Registry {
  const modules = new Map<ModuleKey, ModuleManifest>();
  const pages = new Map<string, PageManifest>();

  for (const m of list) {
    if (modules.has(m.id)) {
      throw new Error(`framework: module "${m.id}" registered twice`);
    }
    modules.set(m.id, m);
    for (const p of m.pages) {
      if (pages.has(p.id)) {
        throw new Error(`framework: page "${p.id}" registered twice`);
      }
      if (!p.id.startsWith(`${m.id}.`)) {
        throw new Error(
          `framework: page id "${p.id}" must be prefixed with its module id "${m.id}."`
        );
      }
      pages.set(p.id, p);
    }
  }

  // Apply `extends` in dependency order so contributors never edit host files.
  for (const m of topoSort(Array.from(modules.values()))) {
    for (const ext of m.extends ?? []) {
      const page = pages.get(ext.pageId);
      if (!page) {
        // Host not migrated yet: skip silently, the extension applies once it is.
        if (import.meta.env.DEV) {
          console.warn(
            `framework: "${m.id}" extends unknown page "${ext.pageId}" (skipped)`
          );
        }
        continue;
      }
      const tabs = page.titleBar.tabs ?? [];
      ext.tabs?.forEach(({ after, ...tab }) => insertAfter(tabs, tab, after));
      ext.actions?.forEach(({ tab, ...action }) => {
        const target = tab ? tabByKey(tabs, tab, page.id) : page;
        (target.actions ??= []).push(action);
      });
      ext.drawers?.forEach(({ tab, ...drawer }) => {
        const target = tab ? tabByKey(tabs, tab, page.id) : page;
        (target.drawers ??= []).push(drawer);
      });
      ext.removeTabs?.forEach((key) => {
        const idx = tabs.findIndex((t) => t.key === key);
        if (idx !== -1) tabs.splice(idx, 1);
      });
      if (tabs.length) page.titleBar.tabs = tabs;
    }
  }

  const ordered = Array.from(modules.values());
  syncAppModules(ordered);

  current = {
    modules: ordered,
    pages,
    moduleKeys: new Set(ordered.map((m) => m.id)),
    resourceNames: new Set(
      ordered.flatMap((m) => Object.keys(m.resources ?? {}))
    ),
    routePaths: new Set(
      Array.from(pages.values())
        .map((p) => p.route)
        .filter((r): r is string => Boolean(r))
        .concat(ordered.flatMap((m) => (m.routes ?? []).map((r) => r.path)))
    ),
  };
  return current;
}

export const getRegistry = (): Registry => {
  if (!current) {
    throw new Error('framework: finalizeRegistry() has not run yet');
  }
  return current;
};

export const getPage = (pageId: string): PageManifest => {
  const page = getRegistry().pages.get(pageId);
  if (!page) throw new Error(`framework: unknown page "${pageId}"`);
  return page;
};

export const getModule = (id: ModuleKey): ModuleManifest | undefined =>
  getRegistry().modules.find((m) => m.id === id);

export const moduleOfPage = (page: PageManifest): ModuleManifest => {
  const mod = getRegistry().modules.find((m) => m.pages.includes(page));
  if (!mod) throw new Error(`framework: page "${page.id}" has no module`);
  return mod;
};

/* ---------- derived views for App.tsx / Admin.tsx ---------- */

/** `<Resource>` props for every module-owned resource (create/edit RBAC-guarded). */
export const resourceElements = (): { name: string; def: ResourceDefinition }[] =>
  getRegistry().modules.flatMap((m) =>
    Object.entries(m.resources ?? {}).map(([name, def]) => ({
      name,
      def: guardResource(def),
    }))
  );

/** CustomRoutes (inside the layout) for every routed page + module extra routes. */
export const customRoutes = (): { path: string; element: ReactElement }[] => {
  const reg = getRegistry();
  const pageRoutes = Array.from(reg.pages.values())
    .filter((p): p is PageManifest & { route: string } => Boolean(p.route))
    .map((p) => ({ path: p.route, element: <PageShell page={p} /> }));
  const extra = reg.modules.flatMap((m) =>
    (m.routes ?? []).filter((r) => !r.noLayout)
  );
  return [...pageRoutes, ...extra];
};

export const noLayoutRoutes = (): { path: string; element: ReactElement }[] =>
  getRegistry().modules.flatMap((m) =>
    (m.routes ?? []).filter((r) => r.noLayout)
  );

/** Drop-in for `APP_MODULES` for registered modules only. */
export const appModules = (): AppModule[] =>
  getRegistry().modules.map((m) => ({
    key: m.id,
    label: m.title,
    to: m.menu ? m.menu.to : '/admin/settings',
    pathPrefixes: m.permissions.pathPrefixes,
    resources: m.permissions.resources,
  }));

export const isRegisteredModule = (key: ModuleKey) =>
  current?.moduleKeys.has(key) ?? false;
export const isRegisteredResource = (name: string) =>
  current?.resourceNames.has(name) ?? false;
export const isRegisteredRoute = (path: string) =>
  current?.routePaths.has(path.replace(/^\//, '')) ?? false;

/**
 * Component that renders a registered page — for `resources[x].list/show/edit`
 * views so record/list pages get the same shell as routed dashboards.
 */
export const pageView = (pageId: string) => {
  const View = () => <PageShell page={getPage(pageId)} />;
  View.displayName = `PageView(${pageId})`;
  return View;
};
