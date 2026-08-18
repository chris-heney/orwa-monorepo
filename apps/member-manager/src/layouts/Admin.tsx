import React from 'react';
import clsx from 'clsx';
import {
  useState,
  ErrorInfo,
  ReactNode,
  ComponentType,
  HtmlHTMLAttributes,
} from 'react';
import { CoreLayoutProps } from 'ra-core';
import { ErrorBoundary } from 'react-error-boundary';
import { styled, SxProps } from '@mui/material/styles';
import { MultiLevelMenu, AppLocationContext } from '@react-admin/ra-navigation';
import InventoryIcon from '@mui/icons-material/Inventory';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import AdminAppBar from './components/AdminAppBar';
import TrainingIcon from '@mui/icons-material/ModelTraining';
import EventsIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MembersIcon from '@mui/icons-material/Diversity1';
import PeopleIcon from '@mui/icons-material/Groups';
import BusinessIcon from '@mui/icons-material/Business';
// import FavoriteIcon from '@mui/icons-material/Favorite';

import { Navigate, useLocation } from 'react-router-dom';
import {
  AppBarProps,
  Sidebar as DefaultSidebar,
  MenuProps,
  Error,
  ErrorProps,
  SkipNavigationButton,
  Inspector,
} from 'react-admin';
import { Box } from '@mui/material';
import DashboardAppBar from '../modules/dashboard/_components/DashboardBar';
import { Email, Gavel } from '@mui/icons-material';
import useCurrentUser from '../modules/_helpers/useCurrentUser';
import { useModuleAccess } from '../modules/rbac-manager/useModuleAccess';
import RolePreviewBanner from '../modules/rbac-manager/RolePreviewBanner';
import {
  APP_MODULES,
  AppModule,
  ModuleKey,
  firstAllowedPath,
} from '../config/modules';

// Auth pages are reachable regardless of module access.
const ALWAYS_ALLOWED_PATHS = ['/login', '/reset-password', '/forgot-password'];

/**
 * A path belongs to a prefix when it equals it, or continues past it with a
 * separator. Root ('/') is matched exactly — as a prefix it would own
 * everything.
 */
const ownsPath = (prefix: string, pathname: string) => {
  if (prefix === '/') {
    return pathname === '/';
  }

  return (
    pathname === prefix ||
    pathname.startsWith(`${prefix}/`) ||
    pathname.startsWith(`${prefix}?`)
  );
};

const modulePrefixes = (module: AppModule) => [
  ...module.pathPrefixes,
  // react-admin resource routes (/watersystems, /activity-relations, /upload,
  // …) are derived from the resource names, not just pathPrefixes.
  ...module.resources.map((resource) => `/${resource}`),
];

/**
 * Redirects away from paths owned by modules the current user's role does not
 * grant. This gating is cosmetic UX only — the API (`up_permissions`) enforces
 * reality — so unknown paths owned by NO module fail open, and while module
 * access is still loading we render children (redirecting during load caused
 * a post-login flash-redirect with the old Staff guard).
 */
const ModuleRouteGuard = ({ children }: { children: ReactNode }) => {
  const { modules, isLoading } = useModuleAccess();
  const location = useLocation();

  if (isLoading) {
    return <>{children}</>;
  }

  const { pathname } = location;

  // '/' is react-admin's root/dashboard redirect target — exact match only.
  if (
    pathname === '/' ||
    ALWAYS_ALLOWED_PATHS.some((path) => ownsPath(path, pathname))
  ) {
    return <>{children}</>;
  }

  const owningModules = APP_MODULES.filter((module) =>
    modulePrefixes(module).some((prefix) => ownsPath(prefix, pathname))
  );

  if (owningModules.length === 0) {
    // Unowned path (typo, future route): fail open — see docblock.
    return <>{children}</>;
  }

  if (owningModules.some((module) => modules.includes(module.key))) {
    return <>{children}</>;
  }

  return <Navigate to={firstAllowedPath(modules)} replace />;
};

const MyMenu = () => {
  const { user } = useCurrentUser();
  const { modules, isLoading } = useModuleAccess();

  // Render nothing until module access is known — the menu appears once
  // loaded, matching the existing !user behavior.
  if (!user || isLoading) {
    return null;
  }

  const has = (key: ModuleKey) => modules.includes(key);

  return (
    <MultiLevelMenu>
      {has('dashboard') && (
        <MultiLevelMenu.Item
          name="dashboard"
          to="/admin/dashboard"
          label="Dashboard"
          icon={<DashboardIcon />}
        />
      )}
      {has('emails') && (
        <MultiLevelMenu.Item
          name="email-management"
          to="/email-management"
          label="Emails"
          icon={<Email />}
        />
      )}
      {has('memberships') && (
        <MultiLevelMenu.Item
          name="membership-management"
          to="/membership-management"
          label="Memberships"
          icon={<MembersIcon />}
        />
      )}
      {has('contacts') && (
        <MultiLevelMenu.Item
          name="human-resources-dashboard"
          to="/human-resources/dashboard"
          label="Contacts"
          title="Contacts"
          icon={<PeopleIcon />}
        />
      )}
      {has('assets') && (
        <MultiLevelMenu.Item
          name="assets"
          to="/assets"
          label="Asset Manager"
          icon={<InventoryIcon />}
        />
      )}
      {has('media-library') && (
        <MultiLevelMenu.Item
          name="media-library"
          to="/media-library"
          label="Media Library"
          title="Media Library"
          icon={<PermMediaIcon />}
        />
      )}
      {has('training') && (
        <MultiLevelMenu.Item
          name="table"
          label="Training Manager"
          icon={<TrainingIcon />}
        >
          <MultiLevelMenu.Item
            name="training-dashboard"
            to="/training/dashboard"
            label="Training Dashboard"
          />
          <MultiLevelMenu.Item
            name="training-events"
            to="/training-events"
            label="Training Events"
          />
          <MultiLevelMenu.Item
            name="training-event-logs"
            to="/training-event-logs"
            label="Training History"
          />
          <MultiLevelMenu.Item
            name="training-settings"
            to="/training-settings/1/edit"
            label="Settings"
          />
        </MultiLevelMenu.Item>
      )}
      {has('conference') && (
        <MultiLevelMenu.Item
          name="conference-dashboard"
          to="/conference/dashboard"
          label="Conference Manager"
          title="Conference Manager"
          icon={<EventsIcon />}
        />
      )}
      {has('terms') && (
        <MultiLevelMenu.Item
          name="terms"
          to="/terms"
          label="Terms Manager"
          title="Terms Manager"
          icon={<Gavel />}
        />
      )}
      {has('grants') && (
        <MultiLevelMenu.Item
          name="grant-dashboard"
          to="/grant/dashboard"
          label="Grant Manager"
          title="Grant Manager"
          icon={<RequestPageIcon />}
        />
      )}
      {has('rbac') && (
        <MultiLevelMenu.Item
          name="rbac-dashboard"
          to="/rbac/dashboard"
          label="RBAC Manager"
          title="RBAC Manager"
          icon={<AdminPanelSettingsIcon />}
        />
      )}
      {/* <MultiLevelMenu.Item
        name="soonerwarn-dashboard"
        to="/soonerwarn/dashboard"
        label="SoonerWARN Manager"
        title="SoonerWARN Manager"
        icon={<FavoriteIcon />}
      /> */}
      <MultiLevelMenu.Item
        name="settings"
        to="/admin/settings"
        label="Settings"
        icon={<SettingsIcon />}
      />
    </MultiLevelMenu>
  );
};

const DashBoard = (props: LayoutProps) => {
  const {
    // appBar: AppBar = AdminAppBar,
    children,
    className,
    dashboard,
    error: errorComponent,
    menu: Menu = MyMenu,
    sidebar: Sidebar = DefaultSidebar,
    title,
    ...rest
  } = props;
  //const [open] = useSidebarState()
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>();

  const handleError = (error: Error, info: ErrorInfo) => {
    setErrorInfo(info);
  };

  const location = useLocation();
  const isDashboard = location.pathname === '/admin/dashboard';

  return (
    <AppLocationContext>
      <StyledLayout className={clsx('layout', className)} {...rest}>
        <SkipNavigationButton />
        <Box className={LayoutClasses.appFrame}>
          <RolePreviewBanner />
          {isDashboard ? <DashboardAppBar /> : <AdminAppBar />}
          <main className={LayoutClasses.contentWithSidebar}>
            <Sidebar>
              <Menu hasDashboard={!!dashboard} />
            </Sidebar>
            <Box id="main-content" className={LayoutClasses.content}>
              <ErrorBoundary
                onError={handleError}
                fallbackRender={({ error, resetErrorBoundary }) => (
                  <Error
                    error={error}
                    errorComponent={errorComponent}
                    errorInfo={errorInfo}
                    resetErrorBoundary={resetErrorBoundary}
                    title={title}
                  />
                )}
              >
                <ModuleRouteGuard>{children}</ModuleRouteGuard>
              </ErrorBoundary>
            </Box>
          </main>
          <Inspector />
        </Box>
      </StyledLayout>
    </AppLocationContext>
  );
};

export interface LayoutProps
  extends CoreLayoutProps,
    Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'> {
  appBar?: ComponentType<AppBarProps>;
  className?: string;
  error?: ComponentType<ErrorProps>;
  menu?: ComponentType<MenuProps>;
  sidebar?: ComponentType<{ children: ReactNode }>;
  sx?: SxProps;
}

export interface LayoutState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

const PREFIX = 'RaLayout';
export const LayoutClasses = {
  appFrame: `${PREFIX}-appFrame`,
  contentWithSidebar: `${PREFIX}-contentWithSidebar`,
  content: `${PREFIX}-content`,
};

const StyledLayout = styled('div', {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1,
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  minWidth: 'fit-content',
  width: '100%',
  color: theme.palette.getContrastText(theme.palette.background.default),

  [`& .${LayoutClasses.appFrame}`]: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginTop: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(7),
    },
  },
  [`& .${LayoutClasses.contentWithSidebar}`]: {
    display: 'flex',
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  [`& .${LayoutClasses.content}`]: {
    backgroundColor: theme.palette.background.default,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexBasis: 0,
    padding: 0,
    [theme.breakpoints.up('xs')]: {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(1),
    },
  },
}));
export default DashBoard;
