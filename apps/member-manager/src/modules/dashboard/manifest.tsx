import DashboardIcon from '@mui/icons-material/Dashboard';
import type { ModuleManifest } from '../../framework/manifest';
import Dashboard from './Dashboard';

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
  ],
};

export default dashboardModule;
