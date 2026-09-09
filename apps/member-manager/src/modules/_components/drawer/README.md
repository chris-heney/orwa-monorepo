# Right drawers & heading bars — the one way

Every right-side panel in member-manager is a `RightDrawer`; every grey page
sub-heading is a `PageHeadingBar`. Do not add parallel primitives.

## RightDrawer (`_components/drawer`)

```tsx
import { RightDrawer, useDrawerGroup, useCurrentRecordDrawerContext } from '../_components/drawer';

const drawers = useDrawerGroup<'notifications' | 'activity'>('grant-application-show-drawer');
const context = useCurrentRecordDrawerContext();          // show / edit page

<RightDrawer open={drawers.isOpen('activity')} onClose={drawers.close}
             title="Activity Feed" icon={<MarkunreadMailboxIcon fontSize="small" />}
             context={context}>
  <ActivityFeed entity="grant-application" frame="plain" />
</RightDrawer>
```

- Persistent MUI `Drawer anchor="right"`, pinned under the 48px app bar, black
  header, collapse chevron. `FilterSidebarShell` is the same component with the
  Tune icon and a "Filters" title — list filter drawers and record drawers are
  visually identical.
- **Open state**: `useDrawerGroup(storeKey)` — one RaStore key per page, at most
  one drawer open. Legacy modules that already store `is*SidebarOpen` in their
  module context may keep doing so; the store mechanism (RaStore) is the same.

## Drawer context (`DrawerContext.tsx`)

A drawer is about either the **current record** or the **current record list**:

| kind     | fields                                                     | build with                                        |
|----------|------------------------------------------------------------|---------------------------------------------------|
| `record` | `resource`, `id` (documentId), `entityId` (numeric PK), `record` | `useCurrentRecordDrawerContext()` / `recordDrawerContext(record, resource)` |
| `list`   | `resource`, `filter`, `sort`, `selectedIds`, `total`       | `listDrawerContext({ resource, filter, … })`      |

Pass it as `<RightDrawer context={…}>`; bodies read it with
`useDrawerContext()`, `useRecordDrawerContext()` or `useListDrawerContext()`.
Bodies should fall back to react-admin's `useRecordContext()` when rendered
outside a drawer (e.g. `ActivityFeed` embedded on Contact / Asset show pages).

`id` vs `entityId`: the data provider remaps `id` → Strapi documentId and keeps
the numeric PK as `entityId`. Numeric-only APIs (`activity-relations.entity_id`)
must use `entityId`; never `Number(record.id)` (→ `NaN`).

## PageHeadingBar (`_components/PageHeadingBar.tsx`)

One component decides title, right actions and Back placement:

```tsx
<PageHeadingBar title={record.name} onBack={handleBack}
  actions={<><EditAction onClick={…} /><NotificationsAction active onClick={…} /></>} />
```

- Right actions are `HeadingAction` presets from `_components/heading/HeadingActions.tsx`
  (Add, Filter, Search, Columns, Export, Edit, Show, Settings, Notifications,
  Activity, Refresh). They are all 32px icon buttons, so the right-most icon's
  centre sits 28px from the viewport edge — exactly under the app bar's account
  icon (`HEADING_BAR_RIGHT_GUTTER`).
- `onBack` renders the Back arrow as the **right-most** action on show / edit
  pages. Never place Back on the left.
- The bar owns `m: 0`; pages must not wrap it in padded boxes (no `py`, `mt`).
