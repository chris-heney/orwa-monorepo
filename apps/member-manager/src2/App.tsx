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
    mergeTranslations,
    useStore,
} from 'react-admin';
import { Route } from 'react-router';

import authProvider from './authProvider/authProvider';
import Configuration from './configuration/Configuration';
import { Dashboard } from './dashboard';
import ciwsDataProvider from './dataProvider/ciWebServices';
import englishMessages from './i18n/en';
import frenchMessages from './i18n/fr';
import { Layout, Login } from './layout';
import {
    // Module Resources
    apps,
    assets,
    decks,
    displayConditions,
    domains,
    organizations,
    users,
    websiteTemplates,
    pubSubTopics,
    pubSubSubscribers,
    pubSubEvents,
    pubSubDeliveries,
    // Asset Manager
    AssetManagerDashboard,
    apiKeys,
    servers,
    softwareLicenses,
    // Core Services
    CoreServiceDashboard,
    addonGroups,
    addons,
    coreServices,
    features,
    packageGroupFeatures,
    packageGroups,
    packages,
    // Service Context
    ServiceContextDashboard,
    industries,
    serviceContexts,
    services,
    trades,
    // Platforms
    PlatformDashboard,
    platformGroups,
    platforms,
    // Support Pages
    AnalyticsChangePage,
    BrandChangePage,
    ContentChangePage,
    DNSChangePage,
    DesignChangePage,
    PPCChangePage,
    SEOChangePage,
    SocialChangePage,
    // Specific Components
    ContactsTab,
} from './modules';
import RBACDashboard from './rbac/RBACDashboard';
import { ThemeName, themes } from './themes/themes';
import { createMirrorStore } from './store/mirrorStore';

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

    return (
        <Admin
            title=""
            store={store}
            dataProvider={ciwsDataProvider}
            authProvider={authProvider}
            dashboard={Dashboard}
            loginPage={Login}
            layout={Layout}
            i18nProvider={i18nProvider}
            disableTelemetry
            lightTheme={lightTheme}
            darkTheme={darkTheme}
            defaultTheme="light"
            requireAuth
        >
            <CssBaseline />
            <CustomRoutes>
                <Route path="/configuration" element={<Configuration />} />
                <Route path="/support/dns-change" element={<DNSChangePage />} />
                <Route
                    path="/support/design-change"
                    element={<DesignChangePage />}
                />
                <Route path="/support/seo-change" element={<SEOChangePage />} />
                <Route path="/support/ppc-change" element={<PPCChangePage />} />
                <Route
                    path="/support/social-change"
                    element={<SocialChangePage />}
                />
                <Route
                    path="/support/content-change"
                    element={<ContentChangePage />}
                />
                <Route
                    path="/support/brand-change"
                    element={<BrandChangePage />}
                />
                <Route
                    path="/support/analytics-change"
                    element={<AnalyticsChangePage />}
                />
                <Route
                    path="/core-services"
                    element={<CoreServiceDashboard />}
                />
                <Route path="/organizations" element={<organizations.list />} />
                <Route
                    path="/service-context"
                    element={<ServiceContextDashboard />}
                />
                <Route path="/platforms" element={<PlatformDashboard />} />
                <Route path="/organization-contact" element={<ContactsTab />} />
                <Route path="/rbac" element={<RBACDashboard />} />
                <Route
                    path="/asset-manager"
                    element={<AssetManagerDashboard />}
                />
            </CustomRoutes>
            <Resource name="domain" {...domains} />
            <Resource name="onboarding-deck" {...decks} />
            <Resource name="onboarding-display-condition" {...displayConditions} />
            <Resource name="website-template" {...websiteTemplates} />
            {/* <Resource name="" {...hostingProvider} /> */}
            <Resource name="app" {...apps} />
            <Resource name="core-service" {...coreServices} />
            <Resource name="organization" {...organizations} />
            <Resource name="organization-locations" />
            <Resource name="addon-group" {...addonGroups} />
            <Resource name="package-group" {...packageGroups} />
            <Resource name="package" {...packages} />
            <Resource name="addon" {...addons} />
            <Resource name="feature" {...features} />
            <Resource name="package-group-feature" {...packageGroupFeatures} />
            <Resource name="service-context" {...serviceContexts} />
            <Resource name="service" {...services} />
            <Resource name="trade" {...trades} />
            <Resource name="industry" {...industries} />
            <Resource name="platform-group" {...platformGroups} />
            <Resource name="platform" {...platforms} />
            <Resource name="api-key" {...apiKeys} />
            <Resource name="software-license" {...softwareLicenses} />
            <Resource name="server" {...servers} />
            <Resource name="asset" {...assets} />
            <Resource name="user" {...users} />
            <Resource name="pub-sub-topic" {...pubSubTopics} />
            <Resource name="pub-sub-subscriber" {...pubSubSubscribers} />
            <Resource name="pub-sub-event" {...pubSubEvents} />
            <Resource name="pub-sub-delivery" {...pubSubDeliveries} />
        </Admin>
    );
};

const AppWrapper = () => (
    <StoreContextProvider value={store}>
        <App />
    </StoreContextProvider>
);

export default AppWrapper;
