import CssBaseline from '@mui/material/CssBaseline';
import { Admin, buildI18nProvider } from '@react-admin/ra-enterprise';
import {
    raTreeLanguageEnglish,
    raTreeLanguageFrench,
} from '@react-admin/ra-tree';
import {
    CustomRoutes,
    Resource,
    StoreContextProvider,
    fetchUtils,
    mergeTranslations,
    useStore,
} from 'react-admin';
import { Route } from 'react-router';

import authProvider from './authProvider';
import englishMessages from './i18n/en';
import frenchMessages from './i18n/fr';
import { Layout } from './layout';
import {
    Asset,
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
    EmailManagement,
    SettingsDashboard,
} from './modules/dashboards';
import ScholarshipDashboard from './modules/programs/scholarship-application/ScholarshipDashboard';
import { ThemeName, themes } from './themes/themes';
import { createMirrorStore } from './store/mirrorStore';
import ResetPasswordPage from './pages/ResetPassword';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EventSettings from './modules/training/settings/EventSettings';
import { strapiDataProvider } from 'ra-strapi';
import { useCallback, useMemo } from 'react';
import { CookieStore } from './helpers/ra-strapi-data-provider';
import { LoginPage } from './pages';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const messages = {
    en: mergeTranslations(englishMessages, raTreeLanguageEnglish),
    fr: mergeTranslations(frenchMessages, raTreeLanguageFrench),
};

const i18nProvider = buildI18nProvider(messages, 'en', [
    { locale: 'en', name: 'English' },
    { locale: 'fr', name: 'Français' },
]);

const store = createMirrorStore('Config');

const App = () => {
    const [themeName] = useStore<ThemeName>('themeName', 'soft');
    const lightTheme = themes.find(theme => theme.name === themeName)?.light;
    const darkTheme = themes.find(theme => theme.name === themeName)?.dark;

    const httpClient = useCallback((url: string, options: { headers: Headers } = { headers: new Headers() }) => {
        const token = CookieStore.getCookie('token');

        if (!options.headers) {
            options.headers = new Headers({ Accept: 'application/json' });
        }

        // Add authorization header if token exists
        if (token) {
            options.headers.set('Authorization', `Bearer ${token}`);
        }

        return fetchUtils.fetchJson(url, options);
    }, []);

    // Memoize the dataProvider to prevent recreation on every render
    const dataProvider = useMemo(
        () =>
            strapiDataProvider({
                baseURL: `${import.meta.env.VITE_API_ENDPOINT}`,
                httpClient: httpClient,
            }),
        [httpClient]
    );

    return (
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="EN/en-us"
        >
            <Admin
                title=""
                store={store}
                dataProvider={dataProvider}
                authProvider={authProvider}
                dashboard={AdminDashboard}
                loginPage={LoginPage}
                layout={Layout}
                i18nProvider={i18nProvider}
                disableTelemetry
                lightTheme={lightTheme}
                darkTheme={darkTheme}
                defaultTheme="light"
                requireAuth
            >
                <CssBaseline />
                {/* --- Main Entities --- */}
                <Route path="/login" />

                {/* Reset Password */}

                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* SHARED */}
                <Resource name="upload/files" recordRepresentation="url" />
                <Resource name="shared.field-metas" />
                <Resource name="components_shared_field_metas" />

                {/* MANAGEMENT */}
                <Resource name="assets" {...Asset} />
                <Resource name="staff" {...Staff} />
                <Resource name="contacts" {...Contacts} />
                <Resource name="users" {...Users} />

                {/* MEMBERSHIP */}
                <Resource name="associates" {...Associate} />
                <Resource name="watersystems" {...Watersystem} />
                <Resource name="membership-items" {...MembershipItems} />
                <Resource name="memberships" {...Memberships} />
                <Resource name="invoices" {...Transactions} />

                {/* TRAINING */}
                <Resource name="training-events" {...TrainingEvent} />
                <Resource name="training-event-logs" {...TrainingHistory} />
                <Resource
                    name="training-event-registrations"
                    {...EventRegistration}
                />
                <Resource name="training-schedule-blocks" />
                <Resource name="training-instructors" {...Instructors} />
                <Resource name="training-topics" {...Topics} />
                <Resource name="training-settings" {...TrainingSettings} />
                <Resource
                    name="training-instructor-certifications"
                    {...TrainingInstructorCertification}
                />

                {/* NEW CONFERENCE */}

                <Resource name="conference-attendees" {...Attendees} />
                <Resource name="conference-extras" {...Extras} />
                <Resource
                    name="conference-sponsorships"
                    recordRepresentation="name"
                />
                <Resource name="conference-sponsors" {...Sponsors} />
                <Resource
                    name="conference-tickets"
                    recordRepresentation="name"
                />
                <Resource name="conference-booths" />
                <Resource name="conference-attendees" />
                <Resource name="conference-contestants" />
                <Resource name="conference-registrations" />
                <Resource
                    name="conference-schedules"
                    hasCreate={false}
                    recordRepresentation="name"
                />
                <Resource name="conferences" {...Conference} />
                {/* <Resource name="corporate-sponsors" {...CorporateSponsors} /> */}

                {/* GRANT */}
                <Resource name="grants" {...Grants} />
                <Resource name="grant-application-finals" {...Applicants} />
                <Resource name="grant-payouts" {...Payouts} />
                <Resource name="grant-statuses" />
                <Resource name="grant-sub-statuses" />

                {/* SOONERWARN */}

                {/* SHARED */}
                <Resource name="contacts" {...Contacts} />
                <Resource name="activities" {...ActivityFeed} />
                <Resource name="activity-relations" />

                {/* EMAILS */}
                <Resource name="email-templates" {...EmailsTemplates} />
                <Resource name="scheduled-email-tasks" {...EmailTasks} />

                {/* PROGRAMS */}
                <Resource name="scholarship-applications" {...ScholarshipApplications} />
                {/* <Resource name="awards" {...Awards} /> */}

                {/* --- MUI Pages--- */}
                <CustomRoutes>
                    {/* --- Settings Pages --- */}
                    <Route
                        path="admin/settings"
                        element={<SettingsDashboard />}
                    />
                    <Route path="event/settings" element={<EventSettings />} />
                    {/* @TODO: */}
                    {/* <Route path="conference/settings" element={<ConferenceSettings/>}  />
<Route path="training/settings" element={<TrainingSettings/>}  /> */}

                    {/* --- Dashboard Pages --- */}
                    <Route
                        path="admin/dashboard"
                        element={<AdminDashboard />}
                    />
                    <Route
                        path="scholarship/dashboard"
                        element={<ScholarshipDashboard />}
                    />
                    <Route
                        path="training/dashboard"
                        element={<TrainingDashboard />}
                    />
                    <Route
                        path="conference/dashboard"
                        element={<Conferences />}
                    />
                    <Route
                        path="human-resources/dashboard"
                        element={<HumanResources />}
                    />
                    <Route
                        path="grant/dashboard"
                        element={<GrantManagement />}
                    />
                    <Route
                        path="membership-management"
                        element={<MembershipManagement />}
                    />
                    <Route
                        path="soonerwarn/dashboard"
                        element={<SoonerwarnManagement />}
                    />

                    <Route
                        path="email-management"
                        element={<EmailManagement />}
                    />

                    {/* --- Other Pages --- */}
                    <Route
                        path="financial-audits/dashboard"
                        element={<FinancialAuditDashboard />}
                    />
                </CustomRoutes>

                {/* Custom Routes No Layout */}
                <CustomRoutes noLayout>
                    <Route
                        path="/reset-password"
                        element={<ResetPasswordPage />}
                    />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPasswordPage />}
                    />
                </CustomRoutes>

                <Resource name="upload" />
            </Admin>
        </LocalizationProvider>
    );
};

const AppWrapper = () => (
    <StoreContextProvider value={store}>
        <App />
    </StoreContextProvider>
);

export default AppWrapper;
