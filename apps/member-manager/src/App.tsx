import React from 'react';
import { Route } from 'react-router-dom';
import {
  AuthProvider,
  StrapiRestDataProviderFactory,
} from './helpers/ra-strapi-data-provider';
import { Admin, CustomRoutes, Resource } from 'react-admin';
import { AdminLayout } from './layouts';
import { userPreferencesStore } from './helpers/userPreferencesStore';
import { queryClient } from './helpers/queryClient';
import { darkTheme, lightTheme } from './theme';
import { guardResource } from './modules/rbac-manager/guardResource';
import { LoginPage } from './pages';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ResetPasswordPage from './pages/ResetPassword';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
// Registers every ModuleManifest (framework/modules.ts) before render.
import './framework/modules';
import {
  customRoutes,
  noLayoutRoutes,
  pageView,
  resourceElements,
} from './framework/registry';
import { legacyResources, legacyRoutes } from './legacyWiring';

/** `/` renders the same registered home page as `/admin/dashboard`. */
const HomeDashboard = pageView('dashboard.home');

dayjs.extend(utc);
dayjs.extend(timezone);

// Create/edit pages are capability-guarded from server truth (the role's
// Strapi permissions), so every role — Staff included — is gated by what the
// RBAC Manager grants it. The registry applies the same guard.
const resourceProps = guardResource;

export const App = () => {
  const dataProvider = new StrapiRestDataProviderFactory({
    endpoint: `${import.meta.env.VITE_API_ENDPOINT}/api`,
    type: 'rest',
  }).init();

  // Registry output comes first so it wins over any legacy duplicate; the
  // legacy lists are already filtered against the registry (legacyWiring.tsx).
  const registryResources = resourceElements();
  const registryRoutes = customRoutes();
  const registryNoLayoutRoutes = noLayoutRoutes();
  const legacyResourceList = legacyResources();
  const legacyRouteList = legacyRoutes();

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
        dashboard={HomeDashboard}
        // Providing both themes enables the AppBar theme toggle; react-admin
        // persists the choice and follows the OS preference by default.
        theme={lightTheme}
        darkTheme={darkTheme}
        requireAuth
        disableTelemetry
      >
        <>
          <Route path="/login" />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* --- Module registry: <Resource>s --- */}
          {registryResources.map(({ name, def }) => (
            <Resource key={name} name={name} {...def} />
          ))}

          {/* --- Legacy <Resource>s (shadowed as modules migrate) --- */}
          {legacyResourceList.map(({ name, def, props }) => (
            <Resource
              key={name}
              name={name}
              {...(def ? resourceProps(def) : {})}
              {...(props ?? {})}
            />
          ))}

          {/* --- Pages (registry PageShells first, then legacy dashboards) --- */}
          <CustomRoutes>
            {registryRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            {legacyRouteList.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </CustomRoutes>

          <CustomRoutes noLayout>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            {registryNoLayoutRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </CustomRoutes>
        </>
      </Admin>
    </LocalizationProvider>
  );
};
