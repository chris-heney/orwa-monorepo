import React from "react";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import AddIcon from "@mui/icons-material/Add";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MapIcon from "@mui/icons-material/Map";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import PaidIcon from "@mui/icons-material/Paid";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EditIcon from "@mui/icons-material/Edit";
import TokenIcon from "@mui/icons-material/Token";
import SettingsIcon from "@mui/icons-material/Settings";
import EmailIcon from "@mui/icons-material/Email";
import type { Identifier } from "react-admin";
import type {
  ActionManifest,
  DrawerManifest,
  ModuleManifest,
  PageCtx,
} from "../../framework/manifest";
import { lazyPanel } from "../../framework/lazyPanel";
import {
  activityAction,
  columnsAction,
  editRecordAction,
  exportAction,
  notificationsAction,
  searchAction,
  settingsAction,
} from "../../framework/actions";
import { filtersAction, filtersDrawer } from "../../framework/Drawers";
import { pageView, tabRedirect } from "../../framework/registry";
import Grants from "./grants";
import Applicants from "./grant-application";
import Payouts from "./payouts";
import GrantContextProvider, {
  GRANT_STORE_KEYS,
  defaultFiscalYearEnd,
  defaultFiscalYearStart,
} from "./GrantContextProvider";
import GrantFilters from "./_components/GrantFilters";
import {
  GrantExportAction,
  NewPayoutAction,
  SelectedGrantTitle,
} from "./_components/GrantActions";
import {
  buildApplicationListFilter,
  buildScoreFiscalYearFilter,
} from "./helpers/fiscalYearFilters";
import { sanitizeNumericFilterIds } from "./helpers/getRelationFilterId";
import ActivityFeed from "../activity/ActivityFeed";
import GrantApplicationDetails from "./grant-application/components/GrantApplicationDetails";
import {
  GrantApplicationActivityBody,
  GrantApplicationNotificationsBody,
} from "./grant-application/components/GrantApplicationDrawers";

/* ---------- store-derived filter pieces (same keys the provider owns) ---------- */

const grantFilterId = (ctx: PageCtx) =>
  ctx.store<Identifier>(GRANT_STORE_KEYS.grantFilterId, 0);

const fiscalYear = (ctx: PageCtx) => ({
  start: ctx.store<string | null>(
    GRANT_STORE_KEYS.fiscalYearStart,
    defaultFiscalYearStart()
  ),
  end: ctx.store<string | null>(
    GRANT_STORE_KEYS.fiscalYearEnd,
    defaultFiscalYearEnd()
  ),
});

const payoutStatusId = (ctx: PageCtx) =>
  ctx.store<Identifier>(GRANT_STORE_KEYS.payoutStatusId, 1);

const applicationStatuses = (ctx: PageCtx) =>
  sanitizeNumericFilterIds(
    ctx.store<string[]>(GRANT_STORE_KEYS.applicationStatuses, [])
  );

/**
 * The payout / score lists search by application name or ID through a Strapi
 * `$or` (see `useSearchOrMirror`). `q: ''` wins the react-admin merge over the
 * search row's `q`, so it never reaches Strapi as `_q` on those resources.
 */
const NO_FULLTEXT = { q: "" };

const applicationsFilter = (ctx: PageCtx) => {
  const fy = fiscalYear(ctx);
  return buildApplicationListFilter(
    grantFilterId(ctx),
    applicationStatuses(ctx),
    fy.start,
    fy.end
  );
};

// Financial reporting: reimbursement payouts are attributed to the fiscal
// year their application was approved (committee date); administrative
// payouts have no application, so they keep the transaction date.
const payoutsFilter = (ctx: PageCtx) => {
  const fy = fiscalYear(ctx);
  const status = payoutStatusId(ctx);
  return {
    grant: grantFilterId(ctx),
    type: "Reimbursement",
    ...(status ? { payout_status: status } : {}),
    ...(fy.start && fy.end
      ? { application: { committee_date: { $between: [fy.start, fy.end] } } }
      : {}),
    ...NO_FULLTEXT,
  };
};

const adminPayoutsFilter = (ctx: PageCtx) => {
  const fy = fiscalYear(ctx);
  const status = payoutStatusId(ctx);
  return {
    grant: grantFilterId(ctx),
    type: "Administrative",
    ...(status ? { payout_status: status } : {}),
    ...(fy.start && fy.end
      ? { transaction_date: { $between: [fy.start, fy.end] } }
      : {}),
    ...NO_FULLTEXT,
  };
};

const scoresFilter = (ctx: PageCtx) => {
  const fy = fiscalYear(ctx);
  return { ...(buildScoreFiscalYearFilter(fy.start, fy.end) ?? {}), ...NO_FULLTEXT };
};

/* ---------- actions / drawers ---------- */

/** Per-tab exporters (column prefs + related records) instead of the RA default. */
const grantExportAction: ActionManifest = {
  ...exportAction,
  component: GrantExportAction,
};

/** Search sits after Export / Columns, as in the legacy bar. */
const grantSearchAction: ActionManifest = { ...searchAction, order: 85 };

const newPayoutAction: ActionManifest = {
  id: "new-payout",
  label: "Payout",
  icon: AddIcon,
  scope: "list",
  can: ["create", "grant-payouts"],
  component: NewPayoutAction,
  order: 82,
};

/** Filters drawer for tabs WITHOUT a list (grant selector + range pickers). */
const grantFiltersDrawer: DrawerManifest = { ...filtersDrawer, body: GrantFilters };
const grantFiltersAction: ActionManifest = filtersAction;

const GrantActivityBody = () => (
  <ActivityFeed entity="grant" title=" " frame="plain" />
);

const grantActivityDrawer: DrawerManifest = {
  id: "activity",
  title: "Activity Feed",
  icon: MarkunreadMailboxIcon,
  context: "list",
  body: GrantActivityBody,
};

const openSettings = settingsAction((_ctx, api) => api.setTab("settings"), {
  visible: (ctx) => ctx.tabKey !== "settings",
});

/**
 * Grant Manager — proposal §3.1 / §5 step 2.
 *
 * One `PageShell` over the legacy dashboard: the shrunk `GrantContextProvider`
 * keeps grant selection + fiscal year + Filters-drawer values (all RaStore
 * keys preserved verbatim), every list tab owns ONE ListBase whose permanent
 * filter is derived from those keys, the collapsible search is
 * `titleBar.search`, and the application show page is a `kind: 'show'` page
 * whose Notifications / Activity drawers reuse the existing bodies.
 */
export const grantsModule: ModuleManifest = {
  id: "grants",
  title: "Grant Manager",
  icon: RequestPageIcon,
  menu: { label: "Grant Manager", to: "/grant/dashboard" },
  dependencies: ["emails"],
  permissions: {
    pathPrefixes: [
      "/grant/dashboard",
      "/grants",
      "/grant-application-finals",
      "/grant-payouts",
      "/grant-statuses",
      "/grant-sub-statuses",
    ],
    resources: [
      "grants",
      "grant-application-finals",
      "grant-payouts",
      "grant-statuses",
      "grant-sub-statuses",
    ],
  },
  resources: {
    grants: Grants,
    "grant-application-finals": {
      ...Applicants,
      list: tabRedirect("grants.dashboard", "applications"),
      show: pageView("grants.applicationShow"),
    },
    "grant-payouts": { ...Payouts, list: tabRedirect("grants.dashboard", "payouts") },
    "grant-statuses": {},
    "grant-sub-statuses": {},
  },
  pages: [
    {
      id: "grants.dashboard",
      route: "grant/dashboard",
      kind: "dashboard",
      provider: GrantContextProvider,
      watchStoreKeys: [
        GRANT_STORE_KEYS.grantFilterId,
        GRANT_STORE_KEYS.fiscalYearStart,
        GRANT_STORE_KEYS.fiscalYearEnd,
        GRANT_STORE_KEYS.payoutStatusId,
        GRANT_STORE_KEYS.applicationStatuses,
      ],
      actions: [openSettings],
      titleBar: {
        // `${grant.name} : ${tab}` — the framework appends the tab label.
        title: () => <SelectedGrantTitle />,
        appBarTitle: "Grant Manager",
        search: { placeholder: "Search by name or ID" },
        // Legacy key (and legacy tab keys) so the user's last tab survives.
        tabStoreKey: GRANT_STORE_KEYS.tab,
        defaultTab: "applications",
        tabs: [
          {
            key: "summary",
            label: "Summary",
            icon: DashboardIcon,
            actions: [grantFiltersAction, activityAction("list")],
            drawers: [grantFiltersDrawer, grantActivityDrawer],
            panel: lazyPanel(() => import("./grants/components/GrantSummaryTab")),
          },
          {
            key: "map",
            label: "Map",
            icon: MapIcon,
            actions: [grantFiltersAction],
            drawers: [grantFiltersDrawer],
            panel: lazyPanel(() => import("./_components/GrantMapEmbed")),
          },
          {
            key: "applications",
            label: "Applications",
            icon: MarkunreadMailboxIcon,
            list: {
              resource: "grant-application-finals",
              perPage: 50,
              sort: { field: "application_date", order: "DESC" },
              meta: { raw: true },
              filter: applicationsFilter,
              filterBody: GrantFilters,
            },
            actions: [grantExportAction, columnsAction, grantSearchAction],
            panel: lazyPanel(() => import("./grant-application/ApplicationPanel")),
          },
          {
            key: "payouts",
            label: "Award Payouts",
            icon: PaidIcon,
            list: {
              resource: "grant-payouts",
              perPage: 50,
              sort: { field: "id", order: "ASC" },
              meta: { raw: true, populate: true },
              filter: payoutsFilter,
              filterBody: GrantFilters,
            },
            actions: [grantExportAction, columnsAction, newPayoutAction, grantSearchAction],
            panel: lazyPanel(() => import("./payouts/PayoutsPanel")),
          },
          {
            key: "Admin Payouts",
            label: "Admin Payouts",
            icon: PaidIcon,
            list: {
              resource: "grant-payouts",
              perPage: 50,
              sort: { field: "transaction_date", order: "ASC" },
              meta: { raw: true, populate: true },
              filter: adminPayoutsFilter,
              filterBody: GrantFilters,
            },
            actions: [grantExportAction, columnsAction, newPayoutAction, grantSearchAction],
            panel: lazyPanel(() => import("./payouts/AdministrativePayoutsPanel")),
          },
          {
            key: "application scores",
            label: "Scoresheets",
            icon: ListAltIcon,
            list: {
              resource: "grant-application-scores",
              perPage: 10,
              sort: { field: "date", order: "DESC" },
              filter: scoresFilter,
              filterBody: GrantFilters,
            },
            actions: [grantExportAction, columnsAction, grantSearchAction],
            panel: lazyPanel(() => import("./scores/ScorePanel")),
          },
          {
            key: "edit",
            label: "Edit",
            icon: EditIcon,
            visible: (ctx) => ctx.can("update", "grants"),
            actions: [grantFiltersAction],
            drawers: [grantFiltersDrawer],
            panel: lazyPanel(() => import("./grants/components/GrantEditTab")),
          },
          {
            key: "tokens",
            label: "Tokens",
            icon: TokenIcon,
            actions: [grantFiltersAction],
            drawers: [grantFiltersDrawer],
            panel: lazyPanel(() => import("./grants/components/GrantScoringTokens")),
          },
          {
            key: "settings",
            label: "Settings",
            icon: SettingsIcon,
            divider: true,
            title: "Grant Management Settings",
            panel: lazyPanel(() => import("./_components/GrantManagementSettings")),
          },
        ],
      },
    },
    {
      id: "grants.applicationShow",
      kind: "show",
      record: {
        resource: "grant-application-finals",
        queryOptions: { meta: { raw: true, populate: true } },
      },
      titleBar: {
        title: (ctx) => ctx.record?.legal_entity_name ?? "Grant Application",
        appBarTitle: "Grant Application Details",
        // Prefer history so list → show → Back restores the dashboard state;
        // fall back to the dashboard for deep links.
        back: () => (window.history.length > 1 ? -1 : "/grant/dashboard"),
      },
      actions: [
        editRecordAction("grant-application-finals"),
        notificationsAction(),
        activityAction("record"),
      ],
      drawers: [
        {
          id: "notifications",
          title: "Notifications",
          icon: EmailIcon,
          context: "record",
          body: GrantApplicationNotificationsBody,
        },
        {
          id: "activity",
          title: "Activity Feed",
          icon: MarkunreadMailboxIcon,
          context: "record",
          body: GrantApplicationActivityBody,
        },
      ],
      body: GrantApplicationDetails,
    },
  ],
};

export default grantsModule;
