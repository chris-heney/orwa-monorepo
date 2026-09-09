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
  ErrorProps,
  SkipNavigationButton,
  Inspector,
} from 'react-admin';
import ErrorRecoveryFallback from './components/ErrorRecoveryFallback';
import { Box } from '@mui/material';
import { Email, EmojiEvents, Gavel, School } from '@mui/icons-material';
import useCurrentUser from '../modules/_helpers/useCurrentUser';
import { useModuleAccess } from '../modules/rbac-manager/useModuleAccess';
import {
  APP_MODULES,
  AppModule,
  ModuleKey,
  firstAllowedPath,
} from '../config/modules';
import { useActionLabels } from '../helpers/useActionLabels';
import {
  DrawerInsetProvider,
  useDrawerInset,
} from '../modules/_components/drawer/DrawerInsetContext';
import { getModule, isRegisteredModule } from '../framework/registry';
import type { ModuleManifest } from '../framework/manifest';

// Auth pages + the user's own profile are reachable regardless of module
// access — every signed-in user must be able to land somewhere safe.
const ALWAYS_ALLOWED_PATHS = [
  '/login',
  '/reset-password',
  '/forgot-password',
  '/profile',
];

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

  if (ALWAYS_ALLOWED_PATHS.some((path) => ownsPath(path, pathname))) {
    return <>{children}</>;
  }

  /**
   * Redirect, unless we would only land back here. `firstAllowedPath` falls
   * back to Settings for a role with no modules, and Settings is itself
   * module-owned — redirecting to a path this guard also rejects would spin.
   */
  const redirectAway = () => {
    const target = firstAllowedPath(modules);
    return target === pathname ? (
      <>{children}</>
    ) : (
      <Navigate to={target} replace />
    );
  };

  // '/' renders react-admin's dashboard, which loads data from across the
  // app. A role without the dashboard module cannot read most of that and
  // would get an error page, so send it somewhere it can actually use.
  if (pathname === '/') {
    return modules.includes('dashboard') ? <>{children}</> : redirectAway();
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

  return redirectAway();
};

/** Sidebar entry for a registry module (`ModuleManifest.menu`). */
const RegistryMenuItem = ({ module }: { module: ModuleManifest }) => {
  if (!module.menu) return null;
  const Icon = module.icon;
  const { label, to, children } = module.menu;
  if (children?.length) {
    return (
      <MultiLevelMenu.Item name={module.id} label={label} icon={<Icon />}>
        {children.map((child) => (
          <MultiLevelMenu.Item
            key={child.to}
            name={child.name ?? child.to.replace(/^\//, '').replace(/\//g, '-')}
            to={child.to}
            label={child.label}
          />
        ))}
      </MultiLevelMenu.Item>
    );
  }
  return (
    <MultiLevelMenu.Item
      name={module.id}
      to={to}
      label={label}
      title={label}
      icon={<Icon />}
    />
  );
};

const MyMenu = () => {
  const { user } = useCurrentUser();
  const { modules, isLoading } = useModuleAccess();

  // Render nothing until module access is known — the menu appears once
  // loaded, matching the existing !user behavior.
  if (!user || isLoading) {
    return null;
  }

  // Registered modules render from their manifest; the hand-written blocks
  // below only survive for modules that have not migrated yet. Menu order is
  // the APP_MODULES order either way.
  const has = (key: ModuleKey) =>
    modules.includes(key) && !isRegisteredModule(key);
  const registry = (key: ModuleKey) => {
    if (!modules.includes(key) || !isRegisteredModule(key)) return null;
    const module = getModule(key);
    return module ? <RegistryMenuItem key={key} module={module} /> : null;
  };

  return (
    <MultiLevelMenu>
      {registry('dashboard')}
      {has('dashboard') && (
        <MultiLevelMenu.Item
          name="dashboard"
          to="/admin/dashboard"
          label="Dashboard"
          icon={<DashboardIcon />}
        />
      )}
      {registry('emails')}
      {has('emails') && (
        <MultiLevelMenu.Item
          name="email-management"
          to="/email-management"
          label="Emails"
          icon={<Email />}
        />
      )}
      {registry('memberships')}
      {has('memberships') && (
        <MultiLevelMenu.Item
          name="membership-management"
          to="/membership-management"
          label="Memberships"
          icon={<MembersIcon />}
        />
      )}
      {registry('contacts')}
      {has('contacts') && (
        <MultiLevelMenu.Item
          name="human-resources-dashboard"
          to="/human-resources/dashboard"
          label="Contacts"
          title="Contacts"
          icon={<PeopleIcon />}
        />
      )}
      {registry('assets')}
      {has('assets') && (
        <MultiLevelMenu.Item
          name="assets"
          to="/assets"
          label="Asset Manager"
          icon={<InventoryIcon />}
        />
      )}
      {registry('media-library')}
      {has('media-library') && (
        <MultiLevelMenu.Item
          name="media-library"
          to="/media-library"
          label="Media Library"
          title="Media Library"
          icon={<PermMediaIcon />}
        />
      )}
      {registry('training')}
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
      {registry('conference')}
      {has('conference') && (
        <MultiLevelMenu.Item
          name="conference-dashboard"
          to="/conference/dashboard"
          label="Conference Manager"
          title="Conference Manager"
          icon={<EventsIcon />}
        />
      )}
      {registry('terms')}
      {has('terms') && (
        <MultiLevelMenu.Item
          name="terms"
          to="/terms"
          label="Terms Manager"
          title="Terms Manager"
          icon={<Gavel />}
        />
      )}
      {registry('grants')}
      {has('grants') && (
        <MultiLevelMenu.Item
          name="grant-dashboard"
          to="/grant/dashboard"
          label="Grant Manager"
          title="Grant Manager"
          icon={<RequestPageIcon />}
        />
      )}
      {registry('scholarships')}
      {has('scholarships') && (
        <MultiLevelMenu.Item
          name="orwef-scholarships"
          to="/orwef-scholarships/dashboard"
          label="ORWEF Scholarships"
          title="ORWEF Scholarships"
          icon={<School />}
        />
      )}
      {registry('awards')}
      {has('awards') && (
        <MultiLevelMenu.Item
          name="orwa-awards"
          to="/orwa-awards/dashboard"
          label="ORWA Awards"
          title="ORWA Awards"
          icon={<EmojiEvents />}
        />
      )}
      {registry('rbac')}
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
      {registry('settings')}
      {has('settings') && (
        <MultiLevelMenu.Item
          name="settings"
          to="/admin/settings"
          label="Settings"
          icon={<SettingsIcon />}
        />
      )}
    </MultiLevelMenu>
  );
};

/**
 * Content column. Open right drawers (`RightDrawer`) register their width in
 * DrawerInsetContext; reserving it here keeps heading-bar actions reachable
 * instead of hidden under the drawer paper.
 */
const MainContent = ({ children }: { children: ReactNode }) => {
  const inset = useDrawerInset();
  return (
    <Box
      id="main-content"
      className={LayoutClasses.content}
      sx={{
        paddingRight: `${inset}px !important`,
        transition: (theme) =>
          theme.transitions.create('padding-right', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      {children}
    </Box>
  );
};

const DashBoard = (props: LayoutProps) => {
  // `error` and `title` are pulled out only to keep them off the DOM element
  // that receives {...rest}; the error UI itself is ErrorRecoveryFallback.
  const {
    // appBar: AppBar = AdminAppBar,
    children,
    className,
    dashboard,
    error: _errorComponent,
    menu: Menu = MyMenu,
    sidebar: Sidebar = DefaultSidebar,
    title: _title,
    ...rest
  } = props;
  //const [open] = useSidebarState()
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>();
  const [showActionLabels] = useActionLabels();

  const handleError = (error: Error, info: ErrorInfo) => {
    setErrorInfo(info);
  };

  return (
    <AppLocationContext>
      <StyledLayout
        className={clsx('layout', className)}
        data-action-labels={showActionLabels ? 'on' : 'off'}
        {...rest}
      >
        <SkipNavigationButton />
        <Box className={LayoutClasses.appFrame}>
          {/* One app bar everywhere — the dashboard used to render its own
              copy with larger hardcoded text (WET). */}
          <AdminAppBar />
          <main className={LayoutClasses.contentWithSidebar}>
            <Sidebar>
              <Menu hasDashboard={!!dashboard} />
            </Sidebar>
            <DrawerInsetProvider>
              <MainContent>
                <ErrorBoundary
                  onError={handleError}
                  fallbackRender={({ error, resetErrorBoundary }) => (
                    <ErrorRecoveryFallback
                      error={error}
                      errorInfo={errorInfo}
                      resetErrorBoundary={resetErrorBoundary}
                    />
                  )}
                >
                  <ModuleRouteGuard>{children}</ModuleRouteGuard>
                </ErrorBoundary>
              </MainContent>
            </DrawerInsetProvider>
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
    // Allow flex shrink so full-width module content scrolls inside the
    // content area instead of widening the page.
    minWidth: 0,
    // Flush to the sidebar and window edge on every page. Modules must not
    // re-add their own horizontal gutters — content spans the full width.
    padding: 0,
  },
  // react-admin TopToolbar: MUI often emits only the generated
  // `css-*-MuiToolbar-root-RaTopToolbar-root` class, not a standalone
  // `RaTopToolbar-root`. Flush + pin to the viewport's right edge so
  // Add / Columns / Export stay visible when a wide list scrolls.
  '& [class*="RaTopToolbar-root"], & .heading-actions': {
    padding: '0 !important',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    position: 'sticky',
    right: 0,
    top: 0,
    zIndex: 11,
    minHeight: 'unset',
    backgroundColor: 'inherit',
  },
  // The right gutter lives on the toolbar (not the bar) so it survives the
  // sticky `right: 0` pin on pages whose content is wider than the viewport.
  '& [class*="RaTopToolbar-root"]': {
    marginRight: 0,
  },
  // "Show button labels" off → icon-only RA buttons in heading toolbars.
  // Record counts are Typography, not Button, so they stay visible. Buttons
  // that must keep their text (primary "next step" actions) opt out with
  // `HEADING_ACTION_LABELED_CLASS` (HeadingAction forceLabel sets it).
  '&[data-action-labels="off"] [class*="RaTopToolbar-root"] .MuiButton-root:not(.heading-action-labeled), &[data-action-labels="off"] .heading-actions .MuiButton-root:not(.heading-action-labeled)':
    {
      // Same 32px footprint as HeadingAction so the right-most heading icon
      // always lands under the app bar's account icon.
      fontSize: 0,
      minWidth: 0,
      width: 32,
      height: 32,
      lineHeight: 1,
      paddingLeft: 6,
      paddingRight: 6,
      '& .MuiButton-startIcon, & .MuiButton-endIcon': {
        margin: 0,
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1.25rem',
      },
    },
  // Create / edit / show pages: no RA 1em gutter, no rounded paper card.
  '& [class*="RaCreate-noActions"], & [class*="RaEdit-noActions"], & [class*="RaShow-noActions"]':
    {
      marginTop: '0 !important',
    },
  '& [class*="RaCreate-card"], & [class*="RaEdit-card"], & [class*="RaShow-card"]':
    {
      borderRadius: 0,
      boxShadow: 'none',
      margin: 0,
    },
  '& [class*="RaSimpleForm-root"]': {
    padding: '0 !important',
  },
  '& [class*="RaCreate-root"] .MuiCard-root, & [class*="RaEdit-root"] .MuiCard-root, & [class*="RaShow-root"] .MuiCard-root, & [class*="RaSimpleForm-root"] .MuiCard-root':
    {
      borderRadius: 0,
      boxShadow: 'none',
      margin: 0,
    },
}));
export default DashBoard;
