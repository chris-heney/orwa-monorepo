import React from "react";
import { Box } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import SettingsIcon from "@mui/icons-material/Settings";
import CategoryIcon from "@mui/icons-material/Category";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PrintIcon from "@mui/icons-material/Print";
import type {
  ActionManifest,
  ModuleManifest,
  PageCtx,
  ResourceDefinition,
} from "../../framework/manifest";
import { lazyPanel } from "../../framework/lazyPanel";
import {
  columnsAction,
  createAction,
  editRecordAction,
  exportAction,
} from "../../framework/actions";
import { pageView, tabRedirect } from "../../framework/registry";
import { bulkDeleteAction } from "../../framework/BulkDeleteAction";
import CustomExportFunction from "../../helpers/custom-export-function";
import AwardEdit from "./components/AwardEdit";
import AwardWinnerEdit from "./components/AwardWinnerEdit";
import AwardWinnerCreate from "./components/AwardWinnerCreate";
import AwardTypeCreate from "./components/AwardTypeCreate";
import AwardTypeEdit from "./components/AwardTypeEdit";
import AwardShow, { nomineeTitle } from "./components/AwardShow";
import AwardFilterSidebar from "./components/AwardFilterSidebar";
import { AwardYearSelectAction } from "./components/AwardYearSelect";
import {
  AwardPrintRecordAction,
  AwardPrintSelectedButton,
} from "./components/AwardPrintButton";
import { NOMINATION_LIST_POPULATE } from "./components/AwardNominationList";
import { WINNER_LIST_POPULATE } from "./components/AwardWinnerList";
import {
  AWARD_STORE_KEYS,
  AWARD_WATCH_KEYS,
  awardYearFromCtx,
  awardYearLabel,
  nominationFilterFromCtx,
  winnerFilterFromCtx,
} from "./helpers/awardStore";
import { nominationBulkDeleteWarnings } from "./helpers/bulkDeleteWarnings";
import {
  NOMINATION_EXPORT_TITLE,
  nominationColumnPrefs,
  nominationExportRows,
} from "./helpers/exportNominations";

const DASHBOARD = "/orwa-awards/dashboard";

/* ---------- resources (react-admin <Resource> defs, RBAC-guarded) ---------- */

export const awardNominationsResource: ResourceDefinition = {
  list: tabRedirect("awards.dashboard", "nominations"),
  edit: AwardEdit,
  show: pageView("awards.nominationShow"),
  icon: EmojiEventsIcon,
  recordRepresentation: "nominee_name",
};

export const awardWinnersResource: ResourceDefinition = {
  list: tabRedirect("awards.dashboard", "winners"),
  edit: AwardWinnerEdit,
  create: AwardWinnerCreate,
  icon: EmojiEventsIcon,
  recordRepresentation: "title",
};

export const awardTypesResource: ResourceDefinition = {
  list: tabRedirect("awards.dashboard", "settings"),
  create: AwardTypeCreate,
  edit: AwardTypeEdit,
  icon: CategoryIcon,
  recordRepresentation: "name",
};

/* ---------- titles / actions ---------- */

/** `<Tab label> · <year label>` — the year comes from the watched RaStore key. */
const tabTitle = (label: string) => (ctx: PageCtx) => (
  <>
    {label}
    <Box component="span" sx={{ fontWeight: 500, opacity: 0.85 }}>
      {` · ${awardYearLabel(awardYearFromCtx(ctx))}`}
    </Box>
  </>
);

/** Page-level year select (hidden on Settings — award types are global). */
const yearSelectAction: ActionManifest = {
  id: "award-year",
  label: "Award year",
  icon: CalendarMonthIcon,
  scope: "list",
  component: AwardYearSelectAction,
  visible: (ctx) => ctx.tabKey !== "settings",
  order: 85,
};

const PrintSelectedComponent = () => <AwardPrintSelectedButton />;

/** Bulk print — only while nominations are selected (AgDatagrid → RA selection). */
const printSelectedAction: ActionManifest = {
  id: "print-selected",
  label: "Print Selected",
  icon: PrintIcon,
  scope: "selection",
  requiresList: true,
  component: PrintSelectedComponent,
  order: 95,
};

/** Bulk delete — selection-scoped, RBAC `delete` on award-nominations. */
const deleteSelectedAction = bulkDeleteAction("award-nominations", {
  noun: "award nomination",
  warnings: nominationBulkDeleteWarnings,
});

/**
 * ORWA Awards — proposal §5 step 6 ("rest").
 *
 * One `PageShell` over the legacy dashboard: the year / search / region /
 * award-type filters keep their RaStore keys (read by the manifest through
 * `ctx.store`, written by the bar's year select and the Filters drawer), each
 * list tab owns ONE ListBase, and the nomination show page is a
 * `kind: 'show'` page with Review + Back in the framework bar.
 */
export const awardsModule: ModuleManifest = {
  id: "awards",
  title: "ORWA Awards",
  icon: EmojiEventsIcon,
  menu: { label: "ORWA Awards", to: DASHBOARD },
  permissions: {
    pathPrefixes: [
      "/orwa-awards",
      "/award-nominations",
      "/award-winners",
      "/award-types",
    ],
    // `award-types` is edited from the Settings tab (and /award-types/* create
    // / edit routes); listing it here puts those routes and RequireCan
    // fallbacks under the awards module permission.
    resources: ["award-nominations", "award-winners", "award-types"],
  },
  resources: {
    "award-nominations": awardNominationsResource,
    "award-winners": awardWinnersResource,
    "award-types": awardTypesResource,
  },
  pages: [
    {
      id: "awards.dashboard",
      route: "orwa-awards/dashboard",
      kind: "dashboard",
      watchStoreKeys: AWARD_WATCH_KEYS,
      actions: [yearSelectAction],
      titleBar: {
        title: "ORWA Awards",
        // Legacy key so the user's last tab survives the migration.
        tabStoreKey: AWARD_STORE_KEYS.tab,
        defaultTab: "summary",
        tabs: [
          {
            key: "summary",
            label: "Summary",
            icon: DashboardIcon,
            title: tabTitle("Summary"),
            panel: lazyPanel(() => import("./components/AwardSummary")),
          },
          {
            key: "nominations",
            label: "Nominations",
            icon: EmojiEventsIcon,
            title: tabTitle("Nominations"),
            list: {
              resource: "award-nominations",
              // Legacy RA default store key (resource) → listParams survive.
              storeKey: "award-nominations",
              filter: nominationFilterFromCtx,
              sort: { field: "award_year", order: "DESC" },
              perPage: 50,
              meta: { populate: NOMINATION_LIST_POPULATE, raw: true },
              filterBody: AwardFilterSidebar,
              // Without an exporter ListScope hands ExportButton `false` and
              // the bar's Export silently did nothing. CSV follows the
              // Columns picker (incl. Submitted, rendered as a date).
              exporter: (records, ctx, { dataProvider }) => {
                const prefs = nominationColumnPrefs(ctx);
                return CustomExportFunction(
                  nominationExportRows(records),
                  prefs.available,
                  prefs.selected,
                  NOMINATION_EXPORT_TITLE,
                  dataProvider
                );
              },
            },
            actions: [
              exportAction,
              columnsAction,
              printSelectedAction,
              deleteSelectedAction,
            ],
            panel: lazyPanel(() => import("./components/AwardNominationList")),
          },
          {
            key: "winners",
            label: "Winners",
            icon: MilitaryTechIcon,
            title: tabTitle("Winners"),
            list: {
              resource: "award-winners",
              storeKey: "award-winners",
              filter: winnerFilterFromCtx,
              sort: { field: "award_year", order: "DESC" },
              perPage: 50,
              meta: { populate: WINNER_LIST_POPULATE, raw: true },
              filterBody: AwardFilterSidebar,
            },
            actions: [createAction("award-winners", { label: "Add Winner" })],
            panel: lazyPanel(() => import("./components/AwardWinnerList")),
          },
          {
            key: "settings",
            label: "Settings",
            icon: SettingsIcon,
            title: "Settings",
            panel: lazyPanel(() => import("./components/AwardTypeSettings")),
          },
        ],
      },
    },
    {
      id: "awards.nominationShow",
      kind: "show",
      record: {
        resource: "award-nominations",
        queryOptions: { meta: { populate: "*", raw: true } },
      },
      titleBar: {
        title: (ctx) => nomineeTitle(ctx.record),
        appBarTitle: "ORWA Award Nomination",
        back: DASHBOARD,
      },
      actions: [
        // Print this nomination's packet — same generator as Print Selected.
        {
          id: "print",
          label: "Print",
          icon: PrintIcon,
          scope: "record",
          component: AwardPrintRecordAction,
          order: 5,
        },
        editRecordAction("award-nominations", { label: "Review" }),
      ],
      body: AwardShow,
    },
  ],
};

export default awardsModule;
