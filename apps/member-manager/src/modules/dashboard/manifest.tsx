import DashboardIcon from '@mui/icons-material/Dashboard';
import type { ModuleManifest } from '../../framework/manifest';
import Dashboard from './Dashboard';
import ProfilePage from '../profile/ProfilePage';

/** Home dashboard — the module every role sees first. */
export const dashboardModule: ModuleManifest = {
  id: 'dashboard',
  title: 'Dashboard',
  icon: DashboardIcon,
  menu: { label: 'Dashboard', to: '/admin/dashboard' },
  permissions: { pathPrefixes: ['/admin/dashboard'], resources: [] },
  pages: [
    {
      id: 'dashboard.home',
      route: 'admin/dashboard',
      kind: 'dashboard',
      titleBar: {
        title: 'Dashboard',
        infoTooltip:
          'People, assets, memberships, the next conference and recent activity at a glance.',
      },
      body: Dashboard,
    },
    {
      // "My Profile" (app-bar avatar menu). `/profile` is in Admin.tsx's
      // ALWAYS_ALLOWED_PATHS, so hosting it here does not gate it on the
      // dashboard module — it just needs a home once legacyWiring goes.
      id: 'dashboard.profile',
      route: 'profile',
      kind: 'custom',
      titleBar: {
        title: 'My Profile',
        infoTooltip:
          'Your linked contact details and personal UI preferences. Changes apply only to your account.',
      },
      body: ProfilePage,
    },
  ],
};

export default dashboardModule;
