/**
 * Module registry — the single source of truth mapping RBAC module keys to
 * navigation and routing. Every menu item in `src/layouts/Admin.tsx`, every
 * CustomRoute path, and every react-admin `<Resource>` in `src/App.tsx` must
 * belong to exactly one module.
 *
 * NOTE: the backend seed list `MODULE_KEYS` in `apps/strapi/src/index.ts`
 * must stay in sync with the `ModuleKey` union below.
 *
 * Icons stay in the menu component (`src/layouts/Admin.tsx`) — JSX does not
 * belong in config.
 */

export type ModuleKey =
  | 'dashboard'
  | 'emails'
  | 'memberships'
  | 'contacts'
  | 'assets'
  | 'media-library'
  | 'training'
  | 'conference'
  | 'terms'
  | 'grants'
  | 'scholarships'
  | 'awards'
  | 'rbac'
  | 'settings';

export interface AppModule {
  key: ModuleKey;
  /** Menu label, e.g. "Asset Manager" */
  label: string;
  /** Primary route the menu item links to, e.g. "/assets" */
  to: string;
  /** Route prefixes owned by the module, matched by the route guard */
  pathPrefixes: string[];
  /** react-admin resource names owned by the module */
  resources: string[];
}

export const APP_MODULES: AppModule[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    to: '/admin/dashboard',
    pathPrefixes: ['/admin/dashboard'],
    resources: [],
  },
  {
    key: 'emails',
    label: 'Emails',
    to: '/email-management',
    pathPrefixes: [
      '/email-management',
      '/email-templates',
      '/scheduled-email-tasks',
    ],
    resources: ['email-templates', 'scheduled-email-tasks'],
  },
  {
    key: 'memberships',
    label: 'Memberships',
    to: '/membership-management',
    pathPrefixes: [
      '/membership-management',
      '/watersystems',
      '/associates',
      '/memberships',
      '/membership-items',
      '/invoices',
      '/financial-audits/dashboard',
      // SoonerWARN's menu item is commented out in Admin.tsx; its dashboard
      // route still exists, so memberships owns it until it becomes a module.
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
  {
    key: 'contacts',
    label: 'Contacts',
    to: '/human-resources/dashboard',
    pathPrefixes: [
      '/human-resources',
      '/contacts',
      '/staff',
      '/users',
      '/activities',
    ],
    resources: [
      'contacts',
      'staff',
      'users',
      'activities',
      'activity-relations',
    ],
  },
  {
    key: 'assets',
    label: 'Asset Manager',
    to: '/assets',
    pathPrefixes: ['/assets'],
    resources: [
      'assets',
      'shared.field-metas',
      'components_shared_field_metas',
    ],
  },
  {
    key: 'media-library',
    label: 'Media Library',
    to: '/media-library',
    pathPrefixes: ['/media-library', '/upload/files'],
    resources: ['upload/files', 'upload'],
  },
  {
    key: 'training',
    label: 'Training Manager',
    to: '/training/dashboard',
    pathPrefixes: [
      '/training/dashboard',
      '/training-events',
      '/training-event-logs',
      '/training-settings',
      '/training-event-registrations',
      '/training-schedule-blocks',
      '/training-instructors',
      '/training-topics',
      '/training-instructor-certifications',
    ],
    resources: [
      'training-events',
      'training-event-logs',
      'training-event-registrations',
      'training-schedule-blocks',
      'training-instructors',
      'training-topics',
      'training-settings',
      'training-instructor-certifications',
    ],
  },
  {
    key: 'conference',
    label: 'Conference Manager',
    to: '/conference/dashboard',
    pathPrefixes: [
      '/conference/dashboard',
      '/conferences',
      '/conference-attendees',
      '/conference-extras',
      '/conference-sponsorships',
      '/conference-sponsors',
      '/conference-tickets',
      '/conference-booths',
      '/conference-contestants',
      '/conference-registrations',
      '/conference-schedules',
    ],
    resources: [
      'conferences',
      'conference-attendees',
      'conference-extras',
      'conference-sponsorships',
      'conference-sponsors',
      'conference-tickets',
      'conference-booths',
      'conference-contestants',
      'conference-registrations',
      'conference-schedules',
    ],
  },
  {
    key: 'terms',
    label: 'Terms Manager',
    to: '/terms',
    pathPrefixes: ['/terms'],
    resources: ['terms'],
  },
  {
    key: 'grants',
    label: 'Grant Manager',
    to: '/grant/dashboard',
    pathPrefixes: [
      '/grant/dashboard',
      '/grants',
      '/grant-application-finals',
      '/grant-payouts',
      '/grant-statuses',
      '/grant-sub-statuses',
    ],
    resources: [
      'grants',
      'grant-application-finals',
      'grant-payouts',
      'grant-statuses',
      'grant-sub-statuses',
    ],
  },
  {
    key: 'scholarships',
    label: 'ORWEF Scholarships',
    to: '/orwef-scholarships/dashboard',
    pathPrefixes: ['/orwef-scholarships', '/scholarship-applications'],
    resources: ['scholarship-applications'],
  },
  {
    key: 'awards',
    label: 'ORWA Awards',
    to: '/orwa-awards/dashboard',
    pathPrefixes: ['/orwa-awards', '/award-nominations'],
    resources: ['award-nominations'],
  },
  {
    key: 'rbac',
    label: 'RBAC Manager',
    to: '/rbac/dashboard',
    pathPrefixes: ['/rbac'],
    resources: [],
  },
  {
    key: 'settings',
    label: 'Settings',
    to: '/admin/settings',
    pathPrefixes: ['/admin/settings', '/event/settings'],
    resources: [],
  },
];

export const ALL_MODULE_KEYS: ModuleKey[] = APP_MODULES.map(
  (module) => module.key
);

/**
 * Primary route of the first `APP_MODULES` entry the user has access to —
 * used as the post-login landing page and as the route-guard redirect target.
 * Falls back to Settings, which every user can reach.
 */
export const firstAllowedPath = (
  modules: readonly ModuleKey[] | null | undefined
): string => {
  const first = APP_MODULES.find((module) => modules?.includes(module.key));
  return first?.to ?? '/admin/settings';
};
