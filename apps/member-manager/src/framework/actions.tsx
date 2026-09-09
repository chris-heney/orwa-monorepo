import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import { useRedirect } from 'react-admin';
import {
  ColumnsAction,
  CreateAction,
  ExportAction,
} from '../modules/_components/heading/HeadingActions';
import type { ActionManifest, PageCtx, TitleBarApi } from './manifest';

type ActionComponent = React.ComponentType<{ ctx: PageCtx; api: TitleBarApi }>;

/* ---------- component wrappers (read the ListScope's ListContext) ---------- */

export const ExportActionComponent: ActionComponent = () => <ExportAction />;
export const ColumnsActionComponent: ActionComponent = () => <ColumnsAction />;

/** RA CreateButton for the list resource (RBAC-gated by `can`). */
export const createActionComponent = (
  resource: string,
  label?: string
): ActionComponent => {
  const Component: ActionComponent = () => (
    <CreateAction resource={resource} label={label} />
  );
  Component.displayName = `CreateAction(${resource})`;
  return Component;
};

/* ---------- manifest presets ---------- */

/** documentId of the record page's focus ('' on list pages). */
export const recordId = (ctx: PageCtx): string =>
  ctx.focus?.kind === 'record' ? String(ctx.focus.id) : '';

/** Export the current list (uses the ListScope exporter). */
export const exportAction: ActionManifest = {
  id: 'export',
  label: 'Export',
  icon: FileDownloadIcon,
  scope: 'list',
  component: ExportActionComponent,
  order: 70,
};

/** DatagridConfigurable column chooser. */
export const columnsAction: ActionManifest = {
  id: 'columns',
  label: 'Columns',
  icon: ViewWeekIcon,
  scope: 'list',
  component: ColumnsActionComponent,
  order: 80,
};

/** RBAC-gated "Add" → the resource's create route. */
export const createAction = (
  resource: string,
  overrides: Partial<ActionManifest> = {}
): ActionManifest => ({
  id: `create-${resource}`,
  label: 'Add New',
  icon: AddIcon,
  scope: 'list',
  can: ['create', resource],
  component: createActionComponent(resource, overrides.label),
  order: 60,
  ...overrides,
});

/** Toggle the collapsible search row (needs `titleBar.search`). */
export const searchAction: ActionManifest = {
  id: 'search',
  label: 'Search',
  icon: SearchIcon,
  scope: 'list',
  togglesSearch: true,
  order: 50,
};

export const refreshAction = (
  onClick: ActionManifest['onClick'],
  overrides: Partial<ActionManifest> = {}
): ActionManifest => ({
  id: 'refresh',
  label: 'Refresh',
  icon: RefreshIcon,
  scope: 'list',
  onClick,
  order: 95,
  ...overrides,
});

export const settingsAction = (
  onClick: ActionManifest['onClick'],
  overrides: Partial<ActionManifest> = {}
): ActionManifest => ({
  id: 'settings',
  label: 'Settings',
  icon: SettingsIcon,
  scope: 'list',
  onClick,
  order: 99,
  ...overrides,
});

/** Record page: link to the resource's edit route (RBAC `update`). */
export const editRecordAction = (
  resource: string,
  overrides: Partial<ActionManifest> = {}
): ActionManifest => ({
  id: 'edit',
  label: 'Edit',
  icon: EditIcon,
  scope: 'record',
  can: ['update', resource],
  onClick: (ctx, api) => api.navigate(`/${resource}/${recordId(ctx)}`),
  order: 10,
  ...overrides,
});

/** Edit page: link back to the resource's show route. */
export const showRecordAction = (
  resource: string,
  overrides: Partial<ActionManifest> = {}
): ActionManifest => ({
  id: 'show',
  label: 'Show',
  icon: VisibilityIcon,
  scope: 'record',
  onClick: (ctx, api) => api.navigate(`/${resource}/${recordId(ctx)}/show`),
  order: 10,
  ...overrides,
});

/** Toggle a `notifications` drawer (EmailSidebar body). */
export const notificationsAction = (
  drawerId = 'notifications',
  overrides: Partial<ActionManifest> = {}
): ActionManifest => ({
  id: drawerId,
  label: 'Notifications',
  icon: EmailIcon,
  scope: 'record',
  togglesDrawer: drawerId,
  order: 20,
  ...overrides,
});

/** Toggle an `activity` drawer (ActivityFeed body). */
export const activityAction = (
  scope: ActionManifest['scope'] = 'record',
  drawerId = 'activity',
  overrides: Partial<ActionManifest> = {}
): ActionManifest => ({
  id: drawerId,
  label: 'Activity Feed',
  icon: MarkunreadMailboxIcon,
  scope,
  togglesDrawer: drawerId,
  order: 30,
  ...overrides,
});

/** For bodies that need RA's redirect with the resource of the page. */
export const useRedirectTo = () => {
  const redirect = useRedirect();
  return (to: string) => redirect(to);
};
