import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/Groups';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import type { ModuleManifest, PageCtx } from '../../framework/manifest';
import { lazyPanel } from '../../framework/lazyPanel';
import { searchAction } from '../../framework/actions';
import { listParamsStoreKey } from '../../framework/ListScope';
import EventSettings from '../training/settings/EventSettings';
import UserFilters from '../human-resources/users/UserFilters';
import { USERS_LIST_PARAMS } from '../human-resources/users/UserList';
import NoSettingsAccess from './NoSettingsAccess';

const PAGE_ID = 'settings.dashboard';

/**
 * RaStore keys of the staff / instructor list scopes. The framework's
 * `ListScope` mirrors each list's params into `listParamsStoreKey(storeKey)`
 * and re-renders `list.filter(ctx)` when a `watchStoreKeys` entry changes — so
 * a search typed into the bar can be turned into a relation query below.
 */
const STAFF_STORE_KEY = `${PAGE_ID}.staff`;
const INSTRUCTORS_STORE_KEY = `${PAGE_ID}.training-instructors`;
const STAFF_PARAMS_KEY = listParamsStoreKey(STAFF_STORE_KEY);
const INSTRUCTORS_PARAMS_KEY = listParamsStoreKey(INSTRUCTORS_STORE_KEY);

/** Contact fields searched when the row's text lives on a related contact. */
const CONTACT_SEARCH_FIELDS = ['first', 'last', 'email', 'phone', 'title'] as const;

/**
 * Staff / instructor rows hold no text of their own — every searchable field
 * lives on the related contact — so Strapi's `_q` can never match. Translate
 * the search row's `q` into a `$or` of `$containsi` leaves on the relation and
 * blank `q` (RA merges the permanent filter over the user's, and `q: ''` never
 * reaches Strapi — same trick as Grant Manager's payout lists).
 */
const relationSearchFilter =
  (paramsKey: string, relation: string) =>
  (ctx: PageCtx): Record<string, unknown> => {
    const params = ctx.store<{ filter?: Record<string, unknown> }>(paramsKey, {});
    const q = params.filter?.q;
    const text = typeof q === 'string' ? q.trim() : '';
    if (!text) return {};
    return {
      q: '',
      $or: CONTACT_SEARCH_FIELDS.map((field) => ({
        [relation]: { [field]: { $containsi: text } },
      })),
    };
  };

/**
 * Settings — administrative directory of people/accounts: Users, Staff,
 * Instructors (list tabs) and Badges. Each tab is capability-gated exactly as
 * the legacy dashboard was; the first tab the role can see is the default.
 * (Personal profile + UI preferences live on the avatar menu → My Profile.)
 */
export const settingsModule: ModuleManifest = {
  id: 'settings',
  title: 'Settings',
  icon: SettingsIcon,
  menu: { label: 'Settings', to: '/admin/settings' },
  permissions: {
    pathPrefixes: ['/admin/settings', '/event/settings'],
    resources: [],
  },
  routes: [{ path: 'event/settings', element: <EventSettings /> }],
  pages: [
    {
      id: PAGE_ID,
      route: 'admin/settings',
      kind: 'dashboard',
      watchStoreKeys: [STAFF_PARAMS_KEY, INSTRUCTORS_PARAMS_KEY],
      // Shown only when the role can see no tab at all.
      body: NoSettingsAccess,
      titleBar: {
        title: 'Settings',
        infoTooltip:
          'Manage user accounts, staff, and instructors. Edit your own profile and preferences from the avatar menu (top right).',
        search: { placeholder: 'Search by name, email, phone, title, or ID…' },
        tabs: [
          {
            key: 'users',
            label: 'Users',
            icon: PeopleIcon,
            visible: (ctx) => ctx.can('find', 'users'),
            list: {
              resource: 'users',
              ...USERS_LIST_PARAMS,
              // users-permissions returns no pagination total → no "N Records".
              selectionCount: false,
              filterBody: UserFilters,
            },
            actions: [searchAction],
            panel: lazyPanel(() =>
              import('../human-resources/users/UserList').then((m) => ({
                default: m.UsersPanel,
              }))
            ),
          },
          {
            key: 'staff',
            label: 'Staff',
            icon: BadgeIcon,
            visible: (ctx) => ctx.can('find', 'staff'),
            list: {
              resource: 'staff',
              storeKey: STAFF_STORE_KEY,
              filter: relationSearchFilter(STAFF_PARAMS_KEY, 'contact'),
            },
            actions: [searchAction],
            panel: lazyPanel(() =>
              import('../human-resources/staff/StaffList').then((m) => ({
                default: m.StaffPanel,
              }))
            ),
          },
          {
            key: 'training-instructors',
            label: 'Instructors',
            icon: SchoolIcon,
            visible: (ctx) => ctx.can('find', 'training-instructors'),
            list: {
              resource: 'training-instructors',
              storeKey: INSTRUCTORS_STORE_KEY,
              filter: relationSearchFilter(INSTRUCTORS_PARAMS_KEY, 'instructor'),
            },
            actions: [searchAction],
            panel: lazyPanel(() =>
              import('../human-resources/instructors/InstructorList').then(
                (m) => ({ default: m.InstructorsPanel })
              )
            ),
          },
          {
            key: 'badges',
            label: 'Badges',
            icon: MilitaryTechIcon,
            // The panel (BadgeList) manages contact-badge records.
            visible: (ctx) => ctx.can('create', 'contact-badges'),
            panel: lazyPanel(() => import('./BadgesPanel')),
          },
        ],
      },
    },
  ],
};

export default settingsModule;
