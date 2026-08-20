import React from 'react';
import { Route } from 'react-router-dom';
import {
  AuthProvider,
  StrapiRestDataProviderFactory,
} from './helpers/ra-strapi-data-provider';
import { Admin, CustomRoutes, Resource } from 'react-admin';
import { AdminLayout } from './layouts';
import { userPreferencesStore } from './helpers/userPreferencesStore';
import UserPreferencesSync from './components/UserPreferencesSync';
import { queryClient } from './helpers/queryClient';
import { darkTheme, lightTheme } from './theme';
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
  AwardWinners,
} from './modules';
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
  RbacDashboard,
  OrwefManagement,
  AwardManagement,
} from './modules/dashboards';
import { guardResource } from './modules/rbac-manager/guardResource';
import { LoginPage } from './pages';
import EventSettings from './modules/training/settings/EventSettings';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ResetPasswordPage from './pages/ResetPassword';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

dayjs.extend(utc);
dayjs.extend(timezone);

// Create/edit pages are capability-guarded from server truth (the role's
// Strapi permissions), so every role — Staff included — is gated by what the
// RBAC Manager grants it.
const resourceProps = guardResource;

export const App = () => {
  const dataProvider = new StrapiRestDataProviderFactory({
    endpoint: `${import.meta.env.VITE_API_ENDPOINT}/api`,
    type: 'rest',
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
          <Resource name="assets" {...resourceProps(Asset)} />
          <Resource name="staff" {...resourceProps(Staff)} />
          <Resource name="contacts" {...resourceProps(Contacts)} />
          <Resource name="users" {...resourceProps(Users)} />

          {/* MEMBERSHIP */}
          <Resource name="associates" {...resourceProps(Associate)} />
          <Resource name="watersystems" {...resourceProps(Watersystem)} />
          <Resource
            name="membership-items"
            {...resourceProps(MembershipItems)}
          />
          <Resource name="memberships" {...resourceProps(Memberships)} />
          <Resource name="invoices" {...resourceProps(Transactions)} />

          {/* TRAINING */}
          <Resource name="training-events" {...resourceProps(TrainingEvent)} />
          <Resource
            name="training-event-logs"
            {...resourceProps(TrainingHistory)}
          />
          <Resource
            name="training-event-registrations"
            {...resourceProps(EventRegistration)}
          />
          <Resource name="training-schedule-blocks" />
          <Resource
            name="training-instructors"
            {...resourceProps(Instructors)}
          />
          <Resource name="training-topics" {...resourceProps(Topics)} />
          <Resource
            name="training-settings"
            {...resourceProps(TrainingSettings)}
          />
          <Resource
            name="training-instructor-certifications"
            {...resourceProps(TrainingInstructorCertification)}
          />

          {/* NEW CONFERENCE */}

          <Resource name="conference-attendees" {...resourceProps(Attendees)} />
          <Resource name="conference-extras" {...resourceProps(Extras)} />
          <Resource
            name="conference-sponsorships"
            recordRepresentation="name"
          />
          <Resource name="conference-sponsors" {...resourceProps(Sponsors)} />
          <Resource name="conference-tickets" recordRepresentation="name" />
          <Resource name="conference-booths" />
          <Resource name="conference-contestants" />
          <Resource name="conference-registrations" />
          <Resource
            name="conference-schedules"
            hasCreate={false}
            recordRepresentation="name"
          />
          <Resource name="conferences" {...resourceProps(Conference)} />
          {/* <Resource name="corporate-sponsors" {...CorporateSponsors} /> */}

          {/* GRANT */}
          <Resource name="grants" {...resourceProps(Grants)} />
          <Resource
            name="grant-application-finals"
            {...resourceProps(Applicants)}
          />
          <Resource name="grant-payouts" {...resourceProps(Payouts)} />
          <Resource name="grant-statuses" />
          <Resource name="grant-sub-statuses" />

          {/* SOONERWARN */}

          {/* SHARED */}
          <Resource name="activities" {...resourceProps(ActivityFeed)} />
          <Resource name="activity-relations" />

          {/* EMAILS */}
          <Resource
            name="email-templates"
            {...resourceProps(EmailsTemplates)}
          />
          <Resource
            name="scheduled-email-tasks"
            {...resourceProps(EmailTasks)}
          />
          <Resource name="terms" {...resourceProps(Terms)} />
          <Resource
            name="scholarship-applications"
            {...resourceProps(ScholarshipApplications)}
          />
          <Resource
            name="award-nominations"
            {...resourceProps(AwardNominations)}
          />
          <Resource name="award-winners" {...resourceProps(AwardWinners)} />

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
            <Route path="rbac/dashboard" element={<RbacDashboard />} />
            <Route
              path="orwef-scholarships/dashboard"
              element={<OrwefManagement />}
            />
            <Route path="orwa-awards/dashboard" element={<AwardManagement />} />
            <Route
              path="membership-management"
              element={<MembershipManagement />}
            />
            <Route
              path="soonerwarn/dashboard"
              element={<SoonerwarnManagement />}
            />

            <Route path="email-management" element={<EmailManagement />} />
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
      </Admin>
    </LocalizationProvider>
  );
};
