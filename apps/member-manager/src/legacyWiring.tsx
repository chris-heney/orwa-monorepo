import React, { ReactElement } from 'react';
import type { ModuleKey } from './config/modules';
import {
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
  ScholarshipApplications,
  AwardNominations,
  AwardWinners,
  AwardTypes,
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
  SettingsDashboard,
  MediaLibraryPage,
  RbacDashboard,
  OrwefManagement,
  AwardManagement,
} from './modules/dashboards';
import EventSettings from './modules/training/settings/EventSettings';
import ProfilePage from './modules/profile/ProfilePage';
import {
  isRegisteredModule,
  isRegisteredResource,
  isRegisteredRoute,
} from './framework/registry';

/**
 * Hand-written wiring for modules that have NOT yet moved to a
 * `ModuleManifest`. Every entry is shadowed automatically the moment the
 * registry owns the same resource / route / module key, so a module
 * migration never has to touch App.tsx or Admin.tsx. This file is deleted
 * in the last migration step.
 */

export interface LegacyResource {
  name: string;
  /** `{ list, edit, create, show, … }` or plain props (recordRepresentation …). */
  def?: Record<string, unknown>;
  /** Plain `<Resource>` props that must NOT go through guardResource. */
  props?: Record<string, unknown>;
}

const LEGACY_RESOURCES: LegacyResource[] = [
  // SHARED
  { name: 'upload/files', props: { recordRepresentation: 'url' } },
  // MANAGEMENT
  { name: 'staff', def: Staff },
  { name: 'contacts', def: Contacts },
  { name: 'users', def: Users },
  // MEMBERSHIP
  { name: 'associates', def: Associate },
  { name: 'watersystems', def: Watersystem },
  { name: 'membership-items', def: MembershipItems },
  { name: 'memberships', def: Memberships },
  { name: 'invoices', def: Transactions },
  // TRAINING
  { name: 'training-events', def: TrainingEvent },
  { name: 'training-event-logs', def: TrainingHistory },
  { name: 'training-event-registrations', def: EventRegistration },
  { name: 'training-schedule-blocks' },
  { name: 'training-instructors', def: Instructors },
  { name: 'training-topics', def: Topics },
  { name: 'training-settings', def: TrainingSettings },
  {
    name: 'training-instructor-certifications',
    def: TrainingInstructorCertification,
  },
  // CONFERENCE
  { name: 'conference-attendees', def: Attendees },
  { name: 'conference-extras', def: Extras },
  { name: 'conference-sponsorships', props: { recordRepresentation: 'name' } },
  { name: 'conference-sponsors', def: Sponsors },
  { name: 'conference-tickets', props: { recordRepresentation: 'name' } },
  { name: 'conference-booths' },
  { name: 'conference-contestants' },
  { name: 'conference-registrations' },
  {
    name: 'conference-schedules',
    props: { hasCreate: false, recordRepresentation: 'name' },
  },
  { name: 'conferences', def: Conference },
  // GRANT
  { name: 'grants', def: Grants },
  { name: 'grant-application-finals', def: Applicants },
  { name: 'grant-payouts', def: Payouts },
  { name: 'grant-statuses' },
  { name: 'grant-sub-statuses' },
  // SHARED
  { name: 'activities', def: ActivityFeed },
  { name: 'activity-relations' },
  // EMAILS
  { name: 'email-templates', def: EmailsTemplates },
  { name: 'scheduled-email-tasks', def: EmailTasks },
  { name: 'scholarship-applications', def: ScholarshipApplications },
  { name: 'award-nominations', def: AwardNominations },
  { name: 'award-winners', def: AwardWinners },
  { name: 'award-types', def: AwardTypes },
  { name: 'upload' },
];

export interface LegacyRoute {
  path: string;
  element: ReactElement;
  /** Owning module (documentation only — shadowing is by exact path). */
  module?: ModuleKey;
}

const LEGACY_ROUTES: LegacyRoute[] = [
  { path: 'profile', element: <ProfilePage /> },
  { path: 'admin/settings', element: <SettingsDashboard />, module: 'settings' },
  { path: 'event/settings', element: <EventSettings />, module: 'settings' },
  { path: 'admin/dashboard', element: <AdminDashboard />, module: 'dashboard' },
  { path: 'training/dashboard', element: <TrainingDashboard />, module: 'training' },
  { path: 'conference/dashboard', element: <Conferences />, module: 'conference' },
  {
    path: 'human-resources/dashboard',
    element: <HumanResources />,
    module: 'contacts',
  },
  { path: 'grant/dashboard', element: <GrantManagement />, module: 'grants' },
  { path: 'rbac/dashboard', element: <RbacDashboard />, module: 'rbac' },
  {
    path: 'orwef-scholarships/dashboard',
    element: <OrwefManagement />,
    module: 'scholarships',
  },
  { path: 'orwa-awards/dashboard', element: <AwardManagement />, module: 'awards' },
  {
    path: 'membership-management',
    element: <MembershipManagement />,
    module: 'memberships',
  },
  {
    path: 'soonerwarn/dashboard',
    element: <SoonerwarnManagement />,
    module: 'memberships',
  },
  { path: 'media-library', element: <MediaLibraryPage />, module: 'media-library' },
  {
    path: 'financial-audits/dashboard',
    element: <FinancialAuditDashboard />,
    module: 'memberships',
  },
];

/** Legacy resources the registry does not own yet. */
export const legacyResources = (): LegacyResource[] =>
  LEGACY_RESOURCES.filter((r) => !isRegisteredResource(r.name));

/** Legacy routes the registry does not own yet (exact path match). */
export const legacyRoutes = (): LegacyRoute[] =>
  LEGACY_ROUTES.filter((r) => !isRegisteredRoute(r.path));

/** Menu blocks in Admin.tsx render only for modules the registry lacks. */
export const isLegacyMenuModule = (key: ModuleKey) => !isRegisteredModule(key);
