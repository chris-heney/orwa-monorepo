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

/** `/` renders the same registered home page as `/admin/dashboard`. */
const HomeDashboard = pageView('dashboard.home');

dayjs.extend(utc);
dayjs.extend(timezone);

export const App = () => {
  const dataProvider = new StrapiRestDataProviderFactory({
    endpoint: `${import.meta.env.VITE_API_ENDPOINT}/api`,
    type: 'rest',
  }).init();

  // Everything below comes from the module registry (framework/modules.ts):
  // <Resource>s are capability-guarded (guardResource) so every role — Staff
  // included — is gated by what the RBAC Manager grants it.
  const registryResources = resourceElements();
  const registryRoutes = customRoutes();
  const registryNoLayoutRoutes = noLayoutRoutes();

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

          {/* --- Module registry: routed pages (PageShells) --- */}
          <CustomRoutes>
            {registryRoutes.map(({ path, element }) => (
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
