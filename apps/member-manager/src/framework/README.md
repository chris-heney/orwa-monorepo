# member-manager layout framework

Declarative, Odoo-style module manifests → one `PageShell` that is correct by
construction: 0 outer margin, one sticky heading (`TitleBar` + search row +
`TabStrip`), `p: 0` panels with only the active tab mounted (`React.lazy`),
**one `ListBase` per list tab** shared by the bar's count / export / columns /
selection actions, the panel's grid and the Filters drawer, and right drawers
fed by `DrawerContext`. Presentation stays in `modules/_components`
(`PageHeadingBar`, `heading/*`, `drawer/*`, `CollapsibleSearchBar`).

Design document: `tmp/member-manager-layout-framework-proposal.md`.

## Files

| file | role |
|---|---|
| `layoutTokens.ts` | every shared number (bar height/padding, 32px actions, 12px right gutter, drawer width, sticky top) |
| `themeTokens.ts` | `palette.headingBar` (bg/fg/muted/activeBg/hoverBg) + `MuiTabPanel` p:0 override |
| `manifest.ts` | `ModuleManifest` / `PageManifest` / `TabManifest` / `ActionManifest` / `DrawerManifest` types |
| `registry.tsx` | `finalizeRegistry(list)` (deps topo-sort, `extends`), derived `resourceElements()` / `customRoutes()` / `appModules()` |
| `modules.ts` | **the explicit module list** — add your manifest here |
| `PageShell.tsx` | the shell; tab state (URL `?tab=` → RaStore → default), prefetch, drawers, search |
| `TitleBar.tsx` | manifests → `PageHeadingBar` (RBAC filter, scopes, overflow ⋯, Back far right) |
| `TabStrip.tsx` | MUI `Tabs`, hover-intent prefetch |
| `ListScope.tsx` | the single `ListBase` (+ `FilterContext`), default Filters body |
| `Drawers.tsx` | `RightDrawer` per manifest, auto Filters drawer/action |
| `prefetch.ts` | RA 4 query keys (`prefetch.spec.ts` guards the shape) |
| `actions.tsx` | presets: `exportAction`, `columnsAction`, `createAction(res)`, `searchAction`, `editRecordAction`, … |
| `lazyPanel.ts` | `panel: lazyPanel(() => import('./Panel'))` |

## Writing a module

```tsx
// modules/<name>/manifest.tsx
export const emailsModule: ModuleManifest = {
  id: 'emails', title: 'Email Management', icon: EmailIcon,
  menu: { label: 'Emails', to: '/email-management' },
  permissions: { pathPrefixes: [...], resources: [...] },   // config/modules.ts contract
  resources: { 'email-templates': EmailsTemplates },        // <Resource> defs (RBAC-guarded)
  pages: [{
    id: 'emails.dashboard', route: 'email-management', kind: 'dashboard',
    titleBar: { title: 'Email Management', defaultTab: 'email-templates', tabs: [
      { key: 'email-templates', label: 'Emails', icon: EmailIcon,
        list: { resource: 'email-templates', filterBody: EmailFilters },   // Filters drawer auto-added
        actions: [createAction('email-templates'), columnsAction],
        panel: lazyPanel(() => import('./emails-templates/EmailPanel')) },
    ] },
  }],
};
```
Then add it to `MODULES` in `framework/modules.ts`. Its `<Resource>`s, route
and menu entry replace the legacy blocks in `legacyWiring.tsx` /
`layouts/Admin.tsx` automatically.

### Panels

A panel renders **inside** the tab's `ListBase`: use `<ListView actions={false} title=" ">`
(or `Datagrid` + `Pagination`) — never a second `<List>`. Read the list with
`useListContext()`; read the manifest with `useListManifest()` /
`usePageManifest()`; imperative bar API with `useTitleBar()`
(`setTab`, `openDrawer`, `toggleDrawer`, `closeDrawers`, `toggleSearch`, `navigate`).

### Actions

`scope: 'list' | 'selection' | 'record'`. `selection` actions appear only while
rows are selected (the count becomes "N selected"); `record` actions only on
record pages. Either `component` (existing presets) or `onClick(ctx, api)`;
`togglesDrawer: '<drawer id>'` renders the pressed state. `can: ['update', res]`
hides the action unless `useCan().canOnResource` passes. More than 7 bar actions
fold into "⋯".

### Drawers

`DrawerManifest.context` is `'list'` (built from the ListScope) or `'record'`
(from `ShowBase`/`EditBase`). Bodies read `useDrawerContext()` /
`useRecordDrawerContext()` / `useListDrawerContext()`. One drawer per page is
open at a time (RaStore `${pageId}.drawer`).

### Record pages

`kind: 'show' | 'edit'` + `record: { resource }` wraps the body in
`ShowBase`/`EditBase`; `titleBar.back` renders the far-right Back arrow;
`titleBar.title` may be `(ctx) => ctx.record?.name`. Mount them from
`resources[x].show = pageView('module.page')` (no extra route needed).

### Extending another module's page (Odoo inherit)

```ts
extends: [{ pageId: 'grants.applicationShow',
            actions: [activityAction('record')],
            drawers: [{ id: 'activity', title: 'Activity Feed', icon: MarkunreadMailboxIcon,
                        context: 'record', body: GrantActivityBody }] }]
```
Applied by `finalizeRegistry` after `dependencies` — the host file is never edited.

### Sub-bar (stepper under the bar)

`titleBar.subBar: StepperComponent` renders directly under the bar inside the
sticky wrapper (Training's event-pipeline stepper). It receives no props.

## RaStore keys the framework writes

| key | value |
|---|---|
| `${pageId}.tab` (or `titleBar.tabStoreKey`) | active tab key |
| `${pageId}.drawer` | open drawer id or `null` |
| `${pageId}.search` | search row open |
| `${pageId}.${tabKey}.listParams` / `.selectedIds` (or `list.storeKey`) | RA list params (RA writes these) |

## Layout contract (enforced)

0 outer margin · sticky heading at `STICKY_BAR_TOP` · bar 48px / `py` 8 / `px` 12 ·
32px actions · right gutter 12px (icon centre under the account icon) · Back
far right · panel `p: 0` · only the active panel mounted · drawers outside any
flex row (inset via `DrawerInsetProvider`).
