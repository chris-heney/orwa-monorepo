import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import PersonIcon from '@mui/icons-material/Person';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import GridViewIcon from '@mui/icons-material/GridView';
import type {
  ActionManifest,
  ModuleManifest,
  PageCtx,
  PageManifest,
} from '../../framework/manifest';
import { lazyPanel } from '../../framework/lazyPanel';
import {
  columnsAction,
  createAction,
  editRecordAction,
  exportAction,
} from '../../framework/actions';
import Associate from './associate';
import Watersystem from './watersystem';
import Memberships from './memberships';
import MembershipItems from './membership-items';
import Transactions from '../invoices';
import WaterSystemFilter from './watersystem/components/WatersystemFilter';
import AssociateListFilterSidebar from './associate/components/AssociateListFilterSidebar';
import InvoicesFilters, {
  HIDE_MARKED_PAYMENTS_KEY,
} from './componenets/InvoicesFilters';
import SearchFilters from './componenets/SearchFilters';
import { CustomSelectColumnsButton } from './componenets/CustomSelectColumnsButton';
import { MembershipExportAction } from './componenets/MembershipExportAction';
import { GridViewToggleAction } from './componenets/GridViewToggleAction';
import MembershipShow from './memberships/MembershipShow';
import MembershipItemShow from './membership-items/MembershipItemShow';
import AssociateShow from './associate/AssociateShow';
import FinancialAuditDashboard from './FinancialAuditDashboard';
import { soonerwarnPages } from '../soonerwarn/manifest';

/* ---------- module-specific bar actions ---------- */

/** Columns picker with Select/Unselect all + drag ordering (legacy `MembershipsHeader`). */
const membershipColumnsAction: ActionManifest = {
  id: 'columns',
  label: 'Columns',
  icon: ViewWeekIcon,
  scope: 'list',
  component: () => <CustomSelectColumnsButton />,
  order: 80,
};

/** Default / Naylor export dropdown (Water Systems + Associates only). */
const membershipExportAction: ActionManifest = {
  id: 'export',
  label: 'Export',
  icon: FileDownloadIcon,
  scope: 'list',
  component: () => <MembershipExportAction />,
  order: 70,
};

/** Associates: datagrid ⇄ card grid (RaStore `associate-grid-view`). */
const gridViewAction: ActionManifest = {
  id: 'grid-view',
  label: 'Grid View',
  icon: GridViewIcon,
  scope: 'list',
  component: () => <GridViewToggleAction />,
  order: 85,
};

/** List → show → Back restores the prior location; deep links fall back to the dashboard. */
const backToDashboard = () =>
  window.history.length > 1 ? -1 : '/membership-management';

const recordName = (fallback: string) => (ctx: PageCtx) =>
  ctx.record?.name ? String(ctx.record.name) : fallback;

/* ---------- pages ---------- */

const dashboard: PageManifest = {
  id: 'memberships.dashboard',
  route: 'membership-management',
  kind: 'dashboard',
  // The Transactions tab's permanent filter reads this preference.
  watchStoreKeys: [HIDE_MARKED_PAYMENTS_KEY],
  titleBar: {
    title: 'Memberships',
    // Legacy key so the user's last tab survives the migration.
    tabStoreKey: 'membership-tab-value',
    defaultTab: 'summary',
    tabs: [
      {
        key: 'summary',
        label: 'Summary',
        icon: DashboardIcon,
        title: 'Summary',
        visible: (ctx) => ctx.can('find', 'memberships'),
        panel: lazyPanel(() => import('./MembershipsSummary')),
      },
      {
        key: 'watersystems',
        label: 'Water Systems',
        icon: MarkunreadMailboxIcon,
        title: 'Water Systems',
        visible: (ctx) => ctx.can('find', 'watersystems'),
        list: {
          resource: 'watersystems',
          // Legacy react-admin default storeKey (= resource) so saved list params survive.
          storeKey: 'watersystems',
          perPage: 100,
          sort: { field: 'id', order: 'ASC' },
          meta: { raw: true, populate: ['contacts'] },
          filterBody: WaterSystemFilter,
        },
        actions: [
          createAction('watersystems', { label: 'Add Watersystem' }),
          membershipColumnsAction,
          membershipExportAction,
        ],
        panel: lazyPanel(() => import('./watersystem/WatersystemList')),
      },
      {
        key: 'associates',
        label: 'Associates',
        icon: PersonIcon,
        title: 'Associates',
        visible: (ctx) => ctx.can('find', 'associates'),
        list: {
          resource: 'associates',
          storeKey: 'associates',
          perPage: 100,
          sort: { field: 'id', order: 'ASC' },
          filterBody: AssociateListFilterSidebar,
        },
        actions: [
          createAction('associates', { label: 'Add Associate' }),
          membershipColumnsAction,
          membershipExportAction,
          gridViewAction,
        ],
        panel: lazyPanel(() => import('./associate/AssociateList')),
      },
      {
        key: 'memberships',
        label: 'Memberships',
        icon: LoyaltyIcon,
        title: 'Memberships',
        visible: (ctx) => ctx.can('find', 'memberships'),
        list: {
          resource: 'memberships',
          storeKey: 'memberships',
          perPage: 10,
          sort: { field: 'id', order: 'ASC' },
          filterBody: SearchFilters,
        },
        actions: [
          createAction('memberships', { label: 'Add Membership' }),
          exportAction,
          columnsAction,
        ],
        panel: lazyPanel(() => import('./memberships/MembershipsList')),
      },
      {
        key: 'membership-items',
        label: 'Items',
        icon: AddShoppingCartIcon,
        title: 'Membership Items',
        visible: (ctx) => ctx.can('find', 'membership-items'),
        list: {
          resource: 'membership-items',
          storeKey: 'membership-items',
          perPage: 10,
          sort: { field: 'id', order: 'ASC' },
          filterBody: SearchFilters,
        },
        actions: [
          createAction('membership-items', { label: 'Add Item' }),
          exportAction,
          columnsAction,
        ],
        panel: lazyPanel(() => import('./membership-items/MembershipItemsList')),
      },
      {
        key: 'invoices',
        label: 'Transactions',
        icon: PaidIcon,
        title: 'Transactions',
        visible: (ctx) => ctx.can('find', 'invoices'),
        list: {
          resource: 'invoices',
          storeKey: 'invoices',
          perPage: 10,
          sort: { field: 'id', order: 'ASC' },
          // Membership-form invoices only; "Hide marked payments" (default on)
          // narrows to invoices still waiting for a payment date, so the bar
          // count, the grid and the export agree.
          filter: (ctx) => ({
            context: 'membership-form',
            ...(ctx.store<boolean>(HIDE_MARKED_PAYMENTS_KEY, true) !== false
              ? { payment_date: { $null: true } }
              : {}),
          }),
          filterBody: InvoicesFilters,
        },
        actions: [exportAction, columnsAction],
        panel: lazyPanel(() => import('./transactions/TransactionsPanel')),
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: SettingsIcon,
        title: 'Settings',
        divider: true,
        visible: (ctx) => ctx.can('find', 'email-templates'),
        panel: lazyPanel(() => import('./componenets/MembershipSettings')),
      },
    ],
  },
};

const membershipShow: PageManifest = {
  id: 'memberships.membershipShow',
  kind: 'show',
  record: { resource: 'memberships' },
  titleBar: {
    title: recordName('View Membership'),
    appBarTitle: 'Memberships',
    back: backToDashboard,
  },
  actions: [editRecordAction('memberships')],
  body: MembershipShow,
};

const membershipItemShow: PageManifest = {
  id: 'memberships.membershipItemShow',
  kind: 'show',
  record: { resource: 'membership-items' },
  titleBar: {
    title: recordName('View Membership Item'),
    appBarTitle: 'Memberships',
    back: backToDashboard,
  },
  actions: [editRecordAction('membership-items')],
  body: MembershipItemShow,
};

const associateShow: PageManifest = {
  id: 'memberships.associateShow',
  kind: 'show',
  record: { resource: 'associates' },
  titleBar: {
    title: recordName('View Associate'),
    appBarTitle: 'Memberships',
    back: backToDashboard,
  },
  actions: [editRecordAction('associates')],
  body: AssociateShow,
};

/* ---------- module ---------- */

/**
 * Memberships — water systems, associates, membership levels / items and the
 * membership-form transactions, on the layout framework (proposal §5 step 1).
 *
 * Also owns the SoonerWARN pages (`../soonerwarn/manifest`) and the
 * standalone Financial Audit page.
 */
/** Standalone `/financial-audits/dashboard` (the same widget is embedded in the Summary tab). */
const financialAudits: PageManifest = {
  id: 'memberships.financialAudits',
  route: 'financial-audits/dashboard',
  kind: 'custom',
  titleBar: {
    title: 'Financial Audit',
    infoTooltip:
      'Unearned membership dues as of a chosen date — the deferred-revenue figure auditors ask for.',
    back: '/membership-management',
  },
  body: FinancialAuditDashboard,
};

export const membershipsModule: ModuleManifest = {
  id: 'memberships',
  title: 'Memberships',
  icon: LoyaltyIcon,
  menu: { label: 'Memberships', to: '/membership-management' },
  permissions: {
    pathPrefixes: [
      '/membership-management',
      '/watersystems',
      '/associates',
      '/memberships',
      '/membership-items',
      '/invoices',
      '/financial-audits/dashboard',
      // SoonerWARN has no menu item of its own; its pages live in
      // `../soonerwarn/manifest` and are registered under memberships.
      '/soonerwarn/dashboard',
    ],
    resources: [
      'watersystems',
      'associates',
      'memberships',
      'membership-items',
      'invoices',
    ],
  },
  resources: {
    associates: Associate,
    watersystems: Watersystem,
    'membership-items': MembershipItems,
    memberships: Memberships,
    invoices: Transactions,
  },
  pages: [
    dashboard,
    membershipShow,
    membershipItemShow,
    associateShow,
    financialAudits,
    ...soonerwarnPages,
  ],
};

export default membershipsModule;
