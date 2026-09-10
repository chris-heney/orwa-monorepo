import React from "react";
import EventIcon from "@mui/icons-material/Event";
import EditIcon from "@mui/icons-material/Edit";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BoothIcon from "@mui/icons-material/Store";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import AttendeeIcon from "@mui/icons-material/Groups";
import ScheduleIcon from "@mui/icons-material/AccessTimeFilled";
import SponsorIcon from "@mui/icons-material/Redeem";
import TicketIcon from "@mui/icons-material/BookOnline";
import ExtrasIcon from "@mui/icons-material/AddShoppingCart";
import GivingIcon from "@mui/icons-material/VolunteerActivism";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import TextsmsIcon from "@mui/icons-material/Textsms";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import type {
  ActionManifest,
  ListManifest,
  ModuleManifest,
  PageCtx,
  TabManifest,
} from "../../framework/manifest";
import { columnsAction, createAction } from "../../framework/actions";
import { SaveQueryHeaderAction } from "../_components/SavedFiltersSection";
import Conference from "./index";
import Attendees from "./attendees";
import Extras from "./extras";
import Sponsors from "./sponsors";
import ConferenceContextProvider from "./ConferenceContext";
import ConferenceFilters from "./ConferenceFilters";
import ConferenceTitle from "./components/ConferenceTitle";
import VendorAttendeeExportButton from "./components/VendorAttendeeExportButton";
import { conferencePanel } from "./components/conferencePanel";
import { inlineAddAction } from "./components/ConferenceAddAction";
import { conferenceExportAction } from "./components/ConferenceExportAction";
import {
  CONFERENCE_SELECTION_STORE_KEY,
  conferenceScopeFilter,
  readConferenceSelection,
} from "./helpers/conferenceSelection";
import { CONTESTANT_STATUS_VIEW_STORE_KEY } from "./helpers/listQueryFilters";

/* ---------- selection-driven visibility (legacy ConferenceTabList rules) ---------- */

const selectedConference = (ctx: PageCtx) =>
  readConferenceSelection(ctx.store).conference;

/** Hide the tab while one of these conferences (numeric PK) is selected. */
const hiddenFor =
  (...conferenceIds: number[]) =>
  (ctx: PageCtx) =>
    !conferenceIds.includes(selectedConference(ctx));

/* ---------- list presets ---------- */

/**
 * Legacy defaults: 100 rows, ascending id. The permanent `filter` is the
 * selected conference / year (+ contestant view) from RaStore — `ctx.store`
 * re-reads it through `watchStoreKeys` — so the first query of a tab is
 * already scoped; `ConferenceListSync` mirrors the same selection into the
 * user filter values for the drawer radios and the panels.
 */
const list = (
  tabKey: string,
  resource: string,
  extra: Partial<ListManifest> = {}
): ListManifest => ({
  resource,
  perPage: 100,
  sort: { field: "id", order: "ASC" },
  filter: (ctx) => conferenceScopeFilter(ctx.store, tabKey, resource),
  filterBody: ConferenceFilters,
  filterHeaderActions: SaveQueryHeaderAction,
  ...extra,
});

/**
 * Summary / Tools / Edit have no list of their own, but their panels and the
 * Filters drawer read the conference / year from the tab's list filter (as
 * the legacy dashboard's shared `ListBase` did). A 1-row attendees scope is
 * that filter container: no count, no columns / export.
 */
const scopeOnlyList = (tabKey: string): ListManifest =>
  list(tabKey, "conference-attendees", { perPage: 1, selectionCount: false });

const vendorExportAction: ActionManifest = {
  id: "export-vendors",
  label: "Export vendors",
  icon: FileDownloadIcon,
  scope: "list",
  component: VendorAttendeeExportButton,
  order: 75,
};

const gridActions = (resource: string, addLabel?: string): ActionManifest[] => [
  ...(addLabel ? [inlineAddAction(resource, addLabel)] : []),
  columnsAction,
  conferenceExportAction,
];

/* ---------- tabs (keys = legacy `conference-tab-value` values) ---------- */

const tabs: TabManifest[] = [
  {
    key: "tools",
    label: "Tools",
    icon: BuildCircleIcon,
    list: scopeOnlyList("tools"),
    panel: conferencePanel(() => import("./components/ConferenceTools")),
  },
  {
    key: "summary",
    label: "Summary",
    icon: DashboardIcon,
    list: scopeOnlyList("summary"),
    panel: conferencePanel(() => import("./components/ConferenceSummary")),
  },
  {
    key: "registrations",
    label: "Registrations",
    icon: HowToRegIcon,
    divider: true,
    list: list("registrations", "conference-registrations"),
    actions: gridActions("conference-registrations", "Add Registration"),
    panel: conferencePanel(() => import("./components/ConferenceRegistrations")),
  },
  {
    key: "attendees",
    label: "Attendees",
    icon: AttendeeIcon,
    list: list("attendees", "conference-attendees"),
    actions: [
      ...gridActions("conference-attendees", "Add Attendee"),
      vendorExportAction,
    ],
    panel: conferencePanel(() => import("./attendees/AttendeeList")),
  },
  {
    key: "booths",
    label: "Booths",
    icon: BoothIcon,
    list: list("booths", "conference-booths"),
    actions: gridActions("conference-booths", "Add Booth"),
    panel: conferencePanel(() => import("./components/ConferenceBooths")),
  },
  {
    key: "contestants",
    label: "Contestants",
    icon: PersonPinIcon,
    visible: hiddenFor(1, 2),
    list: list("contestants", "conference-contestants"),
    actions: gridActions("conference-contestants", "Add Contestant"),
    panel: conferencePanel(() => import("./components/ConferenceContestants")),
  },
  {
    key: "teams",
    label: "Teams",
    icon: Diversity3Icon,
    visible: hiddenFor(1, 2),
    list: list("teams", "conference-teams"),
    actions: gridActions("conference-teams", "Add Team"),
    panel: conferencePanel(() => import("./components/ConferenceTeams")),
  },
  {
    key: "taste test",
    label: "Taste Test",
    icon: WaterDropIcon,
    visible: hiddenFor(2, 3),
    list: list("taste test", "taste-test-contestants"),
    actions: gridActions("taste-test-contestants", "Add Taste Test"),
    panel: conferencePanel(() => import("./components/TasteTestContestants")),
  },
  {
    key: "sponsors",
    label: "Sponsors",
    icon: SponsorIcon,
    list: list("sponsors", "conference-sponsors"),
    // Sponsors have a full create page rather than an inline form.
    actions: [
      createAction("conference-sponsors", { label: "Add Sponsor" }),
      columnsAction,
      conferenceExportAction,
    ],
    panel: conferencePanel(() => import("./sponsors/SponsorsList")),
  },
  {
    key: "edit",
    label: "Edit",
    icon: EditIcon,
    divider: true,
    list: scopeOnlyList("edit"),
    panel: conferencePanel(() => import("./ConferenceEdit")),
  },
  {
    key: "schedule",
    label: "Schedule",
    icon: ScheduleIcon,
    list: list("schedule", "conference-schedules"),
    actions: gridActions("conference-schedules", "Add Schedule"),
    panel: conferencePanel(() => import("./components/ConferenceSchedules")),
  },
  {
    key: "tickets",
    label: "Tickets",
    icon: TicketIcon,
    divider: true,
    list: list("tickets", "conference-tickets"),
    actions: gridActions("conference-tickets", "Add Ticket"),
    panel: conferencePanel(() => import("./components/ConferenceTickets")),
  },
  {
    key: "extras",
    label: "Extras",
    icon: ExtrasIcon,
    list: list("extras", "conference-extras"),
    actions: gridActions("conference-extras", "Add Extra"),
    panel: conferencePanel(() => import("./extras/ConferenceExtras")),
  },
  {
    key: "addons",
    label: "Addons",
    icon: ExtrasIcon,
    list: list("addons", "registration-addons"),
    actions: gridActions("registration-addons", "Add Addon"),
    panel: conferencePanel(() => import("./components/RegistrationAddons")),
  },
  {
    key: "sponsorships",
    label: "Sponsorships",
    icon: GivingIcon,
    list: list("sponsorships", "conference-sponsorships"),
    actions: gridActions("conference-sponsorships", "Add Sponsorship"),
    panel: conferencePanel(() => import("./components/ConferenceGiving")),
  },
  {
    key: "feedback",
    label: "Feedback",
    icon: TextsmsIcon,
    list: list("feedback", "conference-feedbacks"),
    actions: gridActions("conference-feedbacks"),
    panel: conferencePanel(() => import("./components/FeedbackList")),
  },
];

/* ---------- module ---------- */

export const conferenceModule: ModuleManifest = {
  id: "conference",
  title: "Conference Manager",
  icon: EventIcon,
  menu: { label: "Conference Manager", to: "/conference/dashboard" },
  permissions: {
    pathPrefixes: [
      "/conference/dashboard",
      "/conferences",
      "/conference-attendees",
      "/conference-extras",
      "/conference-sponsorships",
      "/conference-sponsors",
      "/conference-tickets",
      "/conference-booths",
      "/conference-contestants",
      "/conference-registrations",
      "/conference-schedules",
    ],
    resources: [
      "conferences",
      "conference-attendees",
      "conference-extras",
      "conference-sponsorships",
      "conference-sponsors",
      "conference-tickets",
      "conference-booths",
      "conference-contestants",
      "conference-registrations",
      "conference-schedules",
    ],
  },
  resources: {
    "conference-attendees": Attendees,
    "conference-extras": Extras,
    "conference-sponsorships": { recordRepresentation: "name" },
    "conference-sponsors": Sponsors,
    "conference-tickets": { recordRepresentation: "name" },
    "conference-booths": {},
    "conference-contestants": {},
    "conference-registrations": {},
    "conference-schedules": { hasCreate: false, recordRepresentation: "name" },
    conferences: Conference,
  },
  pages: [
    {
      id: "conference.dashboard",
      route: "conference/dashboard",
      kind: "dashboard",
      provider: ConferenceContextProvider,
      // Tab visibility, bar title and every tab's permanent list filter follow
      // the selected conference; the contestant view feeds that filter too.
      watchStoreKeys: [
        CONFERENCE_SELECTION_STORE_KEY,
        CONTESTANT_STATUS_VIEW_STORE_KEY,
      ],
      titleBar: {
        title: () => <ConferenceTitle />,
        appBarTitle: "Conference Manager",
        // Legacy key so the operator's last tab survives the migration.
        tabStoreKey: "conference-tab-value",
        defaultTab: "summary",
        tabs,
      },
    },
  ],
};

export default conferenceModule;
