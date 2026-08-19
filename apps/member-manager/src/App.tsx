import React from "react";
import { Route } from "react-router-dom";
import {
  AuthProvider,
  StrapiRestDataProviderFactory,
} from "./helpers/ra-strapi-data-provider";
import {
  Admin,
  CustomRoutes,
  Resource,
} from "react-admin";
import { AdminLayout } from "./layouts";
import { userPreferencesStore } from "./helpers/userPreferencesStore";
import UserPreferencesSync from "./components/UserPreferencesSync";
import { queryClient } from "./helpers/queryClient";
import { darkTheme, lightTheme } from "./theme";
import {
  Asset,
  Associate,
  TrainingEvent,
  TrainingHistory,
  Watersystem,
  Contacts,
  Grants,
  Applicants,
  Topics,
  ActivityFeed,
  TrainingSettings,
  Conference,
  Instructors,
  EventRegistration,
  TrainingInstructorCertification,
  Staff,
  Payouts,
  Memberships,
  MembershipItems,
  Users,
  Transactions,
  Sponsors,
  Extras,
  Attendees,
  EmailsTemplates,
  EmailTasks,
  Terms,
  ScholarshipApplications,
  AwardNominations,
} from "./modules";
import {
  AdminDashboard,
  HumanResources,
  TrainingDashboard,
  FinancialAuditDashboard,
  GrantManagement,
  MembershipManagement,
  SoonerwarnManagement,
  Conferences,
  EmailManagement,
  SettingsDashboard,
  MediaLibraryPage,
  OrwefManagement,
  AwardManagement,
} from "./modules/dashboards";
import { LoginPage } from "./pages";
import EventSettings from "./modules/training/settings/EventSettings";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ResetPasswordPage from "./pages/ResetPassword";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

dayjs.extend(utc);
dayjs.extend(timezone);

const makeReadOnlyResource = <T extends Record<string, any>>(resource: T): T => {
  const { create, edit, ...readOnlyResource } = resource;

  return readOnlyResource as T;
};

type ResourcePermission = {
  resource?: string;
  action?: string | string[];
};

const permissionActions = (permission: ResourcePermission) =>
  Array.isArray(permission.action) ? permission.action : [permission.action];

const hasPermission = (
  permissions: ResourcePermission[] | undefined,
  resource: string,
  action: string
) =>
  permissions?.some(
    (permission) =>
      permission.resource === resource && permissionActions(permission).includes(action)
  ) ?? false;

const isStaffPermissionSet = (permissions: ResourcePermission[] | undefined) =>
  hasPermission(permissions, "watersystems", "export") &&
  !hasPermission(permissions, "*", "*");

const getResourceProps = (isStaff: boolean) =>
  isStaff ? makeReadOnlyResource : (resource: Record<string, any>) => resource;


export const App = () => {
  const dataProvider = new StrapiRestDataProviderFactory({
    endpoint: `${import.meta.env.VITE_API_ENDPOINT}/api`,
    type: "rest",
  }).init();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="EN/en-us">
      <Admin
        title="ORWA Admin"
        loginPage={LoginPage}
        layout={AdminLayout}
        dataProvider={dataProvider}
        authProvider={AuthProvider}
        store={userPreferencesStore}
        queryClient={queryClient}
        dashboard={AdminDashboard}
        // Providing both themes enables the AppBar theme toggle; react-admin
        // persists the choice and follows the OS preference by default.
        theme={lightTheme}
        darkTheme={darkTheme}
        requireAuth
        disableTelemetry
      >
        {(permissions: ResourcePermission[]) => {
          const isStaff = isStaffPermissionSet(permissions);
          const resourceProps = getResourceProps(isStaff);

          return (
            <>
          <UserPreferencesSync />
          {/* --- Main Entities --- */}
          <Route path="/login" />

          {/* Reset Password */}

          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* SHARED */}
          <Resource name="upload/files" recordRepresentation="url" />
          <Resource name="shared.field-metas" />
          <Resource name="components_shared_field_metas" />

          {/* MANAGEMENT */}
          <Resource name="assets" {...Asset} />
          <Resource name="staff" {...Staff} />
          <Resource name="contacts" {...Contacts} />
          <Resource name="users" {...Users} />

          {/* MEMBERSHIP */}
          <Resource name="associates" {...resourceProps(Associate)} />
          <Resource name="watersystems" {...resourceProps(Watersystem)} />
          <Resource name="membership-items" {...resourceProps(MembershipItems)} />
          <Resource name="memberships" {...resourceProps(Memberships)} />
          <Resource name="invoices" {...resourceProps(Transactions)} />

          {/* TRAINING */}
          <Resource name="training-events" {...TrainingEvent} />
          <Resource name="training-event-logs" {...TrainingHistory} />
          <Resource
            name="training-event-registrations"
            {...EventRegistration}
          />
          <Resource name="training-schedule-blocks" />
          <Resource name="training-instructors" {...Instructors} />
          <Resource name="training-topics" {...Topics} />
          <Resource name="training-settings" {...TrainingSettings} />
          <Resource
            name="training-instructor-certifications"
            {...TrainingInstructorCertification}
          />

          {/* NEW CONFERENCE */}

          <Resource name="conference-attendees" {...Attendees} />
          <Resource name="conference-extras" {...Extras} />
          <Resource
            name="conference-sponsorships"
            recordRepresentation="name"
          />
          <Resource name="conference-sponsors" {...Sponsors} />
          <Resource name="conference-tickets" recordRepresentation="name" />
          <Resource name="conference-booths" />
          <Resource name="conference-attendees" />
          <Resource name="conference-contestants" />
          <Resource name="conference-registrations" />
          <Resource
            name="conference-schedules"
            hasCreate={false}
            recordRepresentation="name"
          />
          <Resource name="conferences" {...Conference} />
          {/* <Resource name="corporate-sponsors" {...CorporateSponsors} /> */}

          {/* GRANT */}
          <Resource name="grants" {...Grants} />
          <Resource name="grant-application-finals" {...Applicants} />
          <Resource name="grant-payouts" {...Payouts} />
          <Resource name="grant-statuses" />
          <Resource name="grant-sub-statuses" />

          {/* SOONERWARN */}

          {/* SHARED */}
          <Resource name="contacts" {...Contacts} />
          <Resource name="activities" {...ActivityFeed} />
          <Resource name="activity-relations" />

          {/* EMAILS */}
          <Resource name="email-templates" {...EmailsTemplates} />
          <Resource name="scheduled-email-tasks" {...EmailTasks} />
          <Resource name="terms" {...Terms} />
          <Resource
            name="scholarship-applications"
            {...ScholarshipApplications}
          />
          <Resource name="award-nominations" {...AwardNominations} />

          {/* --- MUI Pages--- */}
          <CustomRoutes>
            {/* --- Settings Pages --- */}
            <Route path="admin/settings" element={<SettingsDashboard />} />
            <Route path="event/settings" element={<EventSettings />} />
            {/* @TODO: */}
            {/* <Route path="conference/settings" element={<ConferenceSettings/>}  />
        <Route path="training/settings" element={<TrainingSettings/>}  /> */}

            {/* --- Dashboard Pages --- */}
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="training/dashboard" element={<TrainingDashboard />} />
            <Route path="conference/dashboard" element={<Conferences />} />
            <Route
              path="human-resources/dashboard"
              element={<HumanResources />}
            />
            <Route path="grant/dashboard" element={<GrantManagement />} />
            <Route
              path="orwef-scholarships/dashboard"
              element={<OrwefManagement />}
            />
            <Route
              path="orwa-awards/dashboard"
              element={<AwardManagement />}
            />
            <Route
              path="membership-management"
              element={<MembershipManagement />}
            />
            <Route
              path="soonerwarn/dashboard"
              element={<SoonerwarnManagement />}
            />

            <Route
              path="email-management"
              element={<EmailManagement />}
            />
            <Route path="media-library" element={<MediaLibraryPage />} />

            {/* --- Other Pages --- */}
            <Route
              path="financial-audits/dashboard"
              element={<FinancialAuditDashboard />}
            />
          </CustomRoutes>

          {/* Custom Routes No Layout */}
          <CustomRoutes noLayout>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </CustomRoutes>

          <Resource name="upload" />
            </>
          );
        }}
      </Admin>
    </LocalizationProvider>
  );
};
