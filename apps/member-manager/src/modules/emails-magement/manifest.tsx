import EmailIcon from '@mui/icons-material/Email';
import TaskIcon from '@mui/icons-material/Task';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import type { ModuleManifest } from '../../framework/manifest';
import { lazyPanel } from '../../framework/lazyPanel';
import { tabRedirect } from '../../framework/registry';
import { columnsAction, createAction } from '../../framework/actions';
import EmailsTemplates from './emails-templates';
import EmailTasks from './email-taks';
import EmailFilters from './emails-templates/EmailFilters';
import EmailTaskFilters from './email-taks/components/EmailTaskFilters';
import EmailLogFilters from './email-logs/EmailLogFilters';
import { SaveQueryHeaderAction } from '../_components/SavedFiltersSection';

/**
 * Email Management — the reference module manifest.
 *
 * Three list tabs over one PageShell: each tab owns ONE ListBase (count,
 * Columns, Add and the Filters drawer all read it), filter values persist as
 * RA `listParams` (RaStore → Strapi user_preferences) instead of the old
 * non-serialisable `ReactElement` store values.
 */
export const emailsModule: ModuleManifest = {
  id: 'emails',
  title: 'Email Management',
  icon: EmailIcon,
  menu: { label: 'Emails', to: '/email-management' },
  permissions: {
    pathPrefixes: [
      '/email-management',
      '/email-templates',
      '/scheduled-email-tasks',
    ],
    resources: ['email-templates', 'scheduled-email-tasks'],
  },
  resources: {
    'email-templates': {
      ...EmailsTemplates,
      list: tabRedirect('emails.dashboard', 'email-templates'),
    },
    'scheduled-email-tasks': {
      ...EmailTasks,
      list: tabRedirect('emails.dashboard', 'scheduled-email-tasks'),
    },
  },
  pages: [
    {
      id: 'emails.dashboard',
      route: 'email-management',
      kind: 'dashboard',
      titleBar: {
        title: 'Email Management',
        // Legacy key so the user's last tab survives the migration.
        tabStoreKey: 'email-management-tab-value',
        defaultTab: 'email-templates',
        tabs: [
          {
            key: 'email-templates',
            label: 'Emails',
            icon: EmailIcon,
            title: 'Email templates',
            list: {
              resource: 'email-templates',
              filterBody: EmailFilters,
              filterHeaderActions: SaveQueryHeaderAction,
            },
            actions: [createAction('email-templates'), columnsAction],
            panel: lazyPanel(() => import('./emails-templates/EmailInterface')),
          },
          {
            key: 'scheduled-email-tasks',
            label: 'Email Tasks',
            icon: TaskIcon,
            title: 'Scheduled email tasks',
            list: {
              resource: 'scheduled-email-tasks',
              filterBody: EmailTaskFilters,
              filterHeaderActions: SaveQueryHeaderAction,
            },
            actions: [createAction('scheduled-email-tasks'), columnsAction],
            panel: lazyPanel(() => import('./email-taks/ScheduledTaskList')),
          },
          {
            key: 'email-logs',
            label: 'Email Logs',
            icon: StorageOutlinedIcon,
            title: 'Email logs',
            list: {
              resource: 'email-logs',
              filterBody: EmailLogFilters,
              filterHeaderActions: SaveQueryHeaderAction,
            },
            actions: [columnsAction],
            panel: lazyPanel(() => import('./email-logs/EmailLogList')),
          },
        ],
      },
    },
  ],
};

export default emailsModule;
