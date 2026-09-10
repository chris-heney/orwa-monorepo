import SchoolIcon from "@mui/icons-material/School";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PrintIcon from "@mui/icons-material/Print";
import type {
  ActionManifest,
  ModuleManifest,
  ResourceDefinition,
} from "../../framework/manifest";
import { lazyPanel } from "../../framework/lazyPanel";
import { columnsAction, editRecordAction } from "../../framework/actions";
import { pageView, tabRedirect } from "../../framework/registry";
import ScholarshipEdit from "./components/ScholarshipEdit";
import ScholarshipShow, { applicantTitle } from "./components/ScholarshipShow";
import OrwefFilterSidebar from "./components/OrwefFilterSidebar";
import {
  PrintScholarshipRecordAction,
  PrintSelectedScholarshipsAction,
} from "./components/ScholarshipPrintActions";
import {
  ORWEF_STORE_KEYS,
  ORWEF_WATCH_KEYS,
  applicationFilterFromCtx,
} from "./helpers/orwefStore";

const DASHBOARD = "/orwef-scholarships/dashboard";

/* ---------- resource (react-admin <Resource> def, RBAC-guarded) ---------- */

export const scholarshipApplicationsResource: ResourceDefinition = {
  list: tabRedirect("scholarships.dashboard", "applications"),
  edit: ScholarshipEdit,
  show: pageView("scholarships.applicationShow"),
  icon: SchoolIcon,
  recordRepresentation: (record: {
    applicant_first_name?: string;
    applicant_last_name?: string;
  }) =>
    `${record.applicant_first_name || ""} ${record.applicant_last_name || ""}`.trim(),
};

/* ---------- actions ---------- */

/** Bulk print — only while applications are selected (AgDatagrid → RA selection). */
const printSelectedAction: ActionManifest = {
  id: "print-selected",
  label: "Print Selected",
  icon: PrintIcon,
  scope: "selection",
  requiresList: true,
  component: PrintSelectedScholarshipsAction,
  order: 75,
};

const printRecordAction: ActionManifest = {
  id: "print",
  label: "Print",
  icon: PrintIcon,
  scope: "record",
  component: PrintScholarshipRecordAction,
  order: 5,
};

/**
 * ORWEF Scholarships — proposal §5 step 6 ("rest").
 *
 * One `PageShell` over the legacy dashboard: search / year / region keep
 * their RaStore keys (read by the manifest through `ctx.store`, written by
 * the Filters drawer and the Summary year select), the Applications tab owns
 * ONE ListBase, and the application show page is a `kind: 'show'` page with
 * Print + Review + Back in the framework bar.
 */
export const scholarshipsModule: ModuleManifest = {
  id: "scholarships",
  title: "ORWEF Scholarships",
  icon: SchoolIcon,
  menu: { label: "ORWEF Scholarships", to: DASHBOARD },
  permissions: {
    pathPrefixes: ["/orwef-scholarships", "/scholarship-applications"],
    resources: ["scholarship-applications"],
  },
  resources: {
    "scholarship-applications": scholarshipApplicationsResource,
  },
  pages: [
    {
      id: "scholarships.dashboard",
      route: "orwef-scholarships/dashboard",
      kind: "dashboard",
      watchStoreKeys: ORWEF_WATCH_KEYS,
      titleBar: {
        title: "ORWEF Scholarships",
        // Legacy key so the user's last tab survives the migration.
        tabStoreKey: ORWEF_STORE_KEYS.tab,
        defaultTab: "summary",
        tabs: [
          {
            key: "summary",
            label: "Summary",
            icon: DashboardIcon,
            title: "Summary",
            panel: lazyPanel(() => import("./components/ScholarshipSummary")),
          },
          {
            key: "applications",
            label: "Applications",
            icon: SchoolIcon,
            title: "Applications",
            list: {
              resource: "scholarship-applications",
              // Legacy RA default store key (resource) → listParams survive.
              storeKey: "scholarship-applications",
              filter: applicationFilterFromCtx,
              sort: { field: "submission_date", order: "DESC" },
              perPage: 50,
              meta: { populate: "*", raw: true },
              filterBody: OrwefFilterSidebar,
            },
            actions: [printSelectedAction, columnsAction],
            panel: lazyPanel(
              () => import("./components/ScholarshipApplicationList")
            ),
          },
        ],
      },
    },
    {
      id: "scholarships.applicationShow",
      kind: "show",
      record: {
        resource: "scholarship-applications",
        queryOptions: { meta: { populate: "*", raw: true } },
      },
      titleBar: {
        title: (ctx) => applicantTitle(ctx.record),
        appBarTitle: "ORWEF Scholarship",
        back: DASHBOARD,
      },
      actions: [
        printRecordAction,
        editRecordAction("scholarship-applications", { label: "Review" }),
      ],
      body: ScholarshipShow,
    },
  ],
};

export default scholarshipsModule;
