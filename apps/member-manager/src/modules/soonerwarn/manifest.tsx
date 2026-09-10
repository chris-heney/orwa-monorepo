import MapIcon from '@mui/icons-material/Map';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import type { ConfigurableDatagridColumn } from 'react-admin';
import type {
  ListManifest,
  PageCtx,
  PageManifest,
} from '../../framework/manifest';
import { lazyPanel } from '../../framework/lazyPanel';
import {
  columnsAction,
  exportAction,
  notificationsAction,
  settingsAction,
} from '../../framework/actions';
import CustomExportFunction from '../../helpers/custom-export-function';
import SoonerwarnContextProvider from './SoonerwarnContextProvider';
import {
  RequestStatusFilters,
  SoonerwarnStatusFilters,
} from './components/SoonerwarnFilters';
import {
  SoonerwarnNotificationsBody,
  addNewAction,
} from './components/SoonerwarnActions';

/**
 * SoonerWARN has no menu item and no ModuleKey of its own — `memberships`
 * owns the `soonerwarn/dashboard` route (see `config/modules.ts`). These
 * pages are therefore spread into the memberships manifest:
 *
 *   import { soonerwarnPages } from '../soonerwarn/manifest';
 *   pages: [..., ...soonerwarnPages],
 */
export const SOONERWARN_PAGE_ID = 'memberships.soonerwarn';
export const SOONERWARN_ROUTE = 'soonerwarn/dashboard';

/** Legacy tab keys — kept verbatim so the persisted `soonerwarn-tab-value` stays valid. */
export const SOONERWARN_TABS = {
  map: 'soonerwarn map',
  applications: 'soonerwarn applications',
  requests: 'needs assistance',
  volunteer: 'volunteer',
  settings: 'settings',
} as const;

/** DatagridConfigurable column prefs the CSV export honours. */
const columnPrefs = (resource: string, ctx: PageCtx) => ({
  available: ctx.store<ConfigurableDatagridColumn[]>(
    `preferences.${resource}.datagrid.availableColumns`,
    []
  ),
  selected: ctx.store<string[]>(`preferences.${resource}.datagrid.columns`, []),
});

const applicationsList: ListManifest = {
  resource: 'soonerwarns',
  perPage: 50,
  meta: { raw: true },
  filterBody: SoonerwarnStatusFilters,
  exporter: (records, ctx, { dataProvider }) => {
    const prefs = columnPrefs('soonerwarns', ctx);
    return CustomExportFunction(
      records,
      prefs.available,
      prefs.selected,
      'SoonerWARN Applications',
      dataProvider,
      { status: 'soonerwarn-statuses' }
    );
  },
};

const requestsList: ListManifest = {
  resource: 'soonerwarn-requests',
  perPage: 50,
  meta: { raw: true },
  filterBody: RequestStatusFilters,
  exporter: (records, ctx, { dataProvider }) => {
    const prefs = columnPrefs('soonerwarn-requests', ctx);
    return CustomExportFunction(
      records,
      prefs.available,
      prefs.selected,
      'SoonerWARN Requests',
      dataProvider,
      { status: 'request-statuses' }
    );
  },
};

const openSettings = settingsAction(
  (_ctx, api) => api.setTab(SOONERWARN_TABS.settings),
  { visible: (ctx) => ctx.tabKey !== SOONERWARN_TABS.settings }
);

const listActions = [addNewAction, exportAction, columnsAction];

export const soonerwarnDashboardPage: PageManifest = {
  id: SOONERWARN_PAGE_ID,
  route: SOONERWARN_ROUTE,
  kind: 'dashboard',
  provider: SoonerwarnContextProvider,
  actions: [openSettings],
  titleBar: {
    title: 'SoonerWARN Manager',
    // Legacy key so the user's last tab survives the migration.
    tabStoreKey: 'soonerwarn-tab-value',
    defaultTab: SOONERWARN_TABS.applications,
    tabs: [
      {
        key: SOONERWARN_TABS.map,
        label: 'Map',
        icon: MapIcon,
        panel: lazyPanel(() => import('./SoonerwarnMapPanel')),
      },
      {
        key: SOONERWARN_TABS.applications,
        label: 'Applications',
        icon: MarkunreadMailboxIcon,
        list: applicationsList,
        actions: [
          ...listActions,
          // After Filters, before Settings — the legacy bar order.
          notificationsAction('notifications', { scope: 'list', label: 'Email', order: 92 }),
        ],
        drawers: [
          {
            id: 'notifications',
            title: 'Notifications',
            icon: EmailIcon,
            context: 'list',
            body: SoonerwarnNotificationsBody,
          },
        ],
        panel: lazyPanel(() => import('./SoonerwarnList')),
      },
      {
        key: SOONERWARN_TABS.requests,
        label: 'Needs Assistance',
        icon: MarkunreadMailboxIcon,
        list: requestsList,
        actions: listActions,
        panel: lazyPanel(() => import('./NeedsAssistanceList')),
      },
      {
        key: SOONERWARN_TABS.volunteer,
        label: 'Volunteer',
        icon: MarkunreadMailboxIcon,
        list: applicationsList,
        actions: listActions,
        panel: lazyPanel(() => import('./SoonerwarnList')),
      },
      {
        key: SOONERWARN_TABS.settings,
        label: 'Settings',
        icon: SettingsIcon,
        divider: true,
        title: 'SoonerWARN Management Settings',
        panel: lazyPanel(() => import('./SoonerwarnManagementSettings')),
      },
    ],
  },
};

/** Spread into `membershipsModule.pages`. */
export const soonerwarnPages: PageManifest[] = [soonerwarnDashboardPage];

export default soonerwarnPages;
