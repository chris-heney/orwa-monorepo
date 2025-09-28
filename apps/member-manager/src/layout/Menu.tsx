import {
    Business as BusinessIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
    import { Avatar, Typography } from '@mui/material';
import { SolarMenu } from '@react-admin/ra-navigation';
import { endOfYesterday } from 'date-fns';
import querystring from 'query-string';
import { ReactElement } from 'react';
import * as React from 'react';
import {
    useAuthProvider,
    useGetIdentity,
    useTranslate,
    useDataProvider,
} from 'react-admin';
import { useLocation } from 'react-router-dom';
import { ProfileSubMenu } from './ProfileSubMenu';
import { SearchSubMenu } from './SearchSubMenu';

import AnalyticsIcon from '@mui/icons-material/Analytics';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import BrushIcon from '@mui/icons-material/Brush';
import CampaignIcon from '@mui/icons-material/Campaign';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import DnsIcon from '@mui/icons-material/Dns';
import LanguageIcon from '@mui/icons-material/Language';
import LayersIcon from '@mui/icons-material/Layers';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SEOIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import SocialIcon from '@mui/icons-material/Share';
import StorageIcon from '@mui/icons-material/Storage';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AppsIcon from '@mui/icons-material/Apps';
import EventIcon from '@mui/icons-material/Event';

export const newCustomerFilter = querystring.stringify({
    filter: JSON.stringify({
        last_seen_gte: endOfYesterday().toISOString(),
    }),
});

export const visitorsFilter = querystring.stringify({
    filter: JSON.stringify({ nb_orders_lte: 0 }),
});

export const pendingReviewFilter = querystring.stringify({
    filter: JSON.stringify({ status: 'pending' }),
});

// const useResourceChangeCounter = (
//     resource: string,
//     appLocation: string
// ): number => {
//     const match = useAppLocationMatcher();
//     const location = useResourceAppLocation();
//     const [countEvent, setCountEvent] = useState(0);

//     useSubscribeToRecordList(({ payload }) => {
//         if (!payload || !payload.ids) {
//             return;
//         }

//         let count = payload.ids.length;

//         if (location && match(appLocation)) {
//             const { record } = location && (location.values || {});
//             if (!record || record.id == null) {
//                 return;
//             }

//             count = payload.ids.filter(id => id !== record.id).length;
//         }

//         if (count) {
//             setCountEvent(previous => previous + count);
//         }
//     }, resource);

//     useEffect(() => {
//         if (match(appLocation)) {
//             setCountEvent(0);
//         }
//     }, [match, appLocation]);

//     return countEvent;
// };

// const StyledBadgeForText = styled(Badge)(({ theme }) => ({
//     width: '100%',
//     display: 'unset',
//     badge: {
//         top: 13,
//         right: 13,
//         border: `1px solid ${theme.palette.background.paper}`,
//         padding: '0 4px',
//         width: '100%',
//     },
// }));

export const Menu = () => {

    const location = useLocation();

    return (
        <SolarMenu bottomToolbar={<CustomBottomToolbar />}>
            <SolarMenu.DashboardItem selected={location.pathname === '/'} />
            <SolarMenu.Item
                selected={location.pathname.startsWith('/organization')}
                name="organizations"
                icon={<BusinessIcon />}
                label="pos.menu.organizations"
                to="/organization"
            />
            <SolarMenu.Item
                selected={location.pathname.startsWith('/domain')}
                name="domains"
                icon={<LanguageIcon />}
                label="pos.menu.domains"
                to="/domain"
            />
            <SolarMenu.Item
                name="pub-sub-subscriber"
                to="/pub-sub-subscriber"
                icon={<EventIcon />}
                label="Subscriber Management"
            />
            <AssetManagerMenuItem />
            <SupportMenuItem />
            {/* <RBACDashboard /> */}
            {/* Solar Item */}
            <ReadySetGoMenu />
        </SolarMenu>
    );
};

// Asset Manager Menu Item
const AssetManagerMenuItem = (): ReactElement => {
    return (
        <SolarMenu.Item
            name="asset-manager"
            icon={<AssignmentIcon />}
            label="Asset Manager"
            subMenu={
                <>
                    <Typography variant="h6" gutterBottom ml={1}>
                        Asset Manager
                    </Typography>
                    <SolarMenu.List dense>
                        <SolarMenu.Item
                            name="asset-manager.dashboard"
                            to="/asset-manager"
                            icon={<DashboardIcon />}
                            label="Asset Dashboard"
                        />
                        <SolarMenu.Item
                            name="asset-manager.api-keys"
                            to="/api-key"
                            icon={<VpnKeyIcon />}
                            label="API Keys"
                        />
                        <SolarMenu.Item
                            name="asset-manager.software-licenses"
                            to="/software-license"
                            icon={<ArticleIcon />}
                            label="Software Licenses"
                        />
                        <SolarMenu.Item
                            name="asset-manager.servers"
                            to="/server"
                            icon={<StorageIcon />}
                            label="Servers"
                        />
                        <SolarMenu.Item
                            name="asset-manager.assets"
                            to="/asset"
                            icon={<ContentPasteIcon />}
                            label="Assets Manager"
                        />
                        <SolarMenu.Item
                            name="asset-manager.apps"
                            to="/app"
                            icon={<AppsIcon />}
                            label="Apps"
                        />
                    </SolarMenu.List>
                </>
            }
        />
    );
};

const ReadySetGoMenu = (): ReactElement => {
    const translate = useTranslate();
    return (
        <SolarMenu.Item
            name="configureSynapse"
            icon={<SettingsIcon />}
            label="Configure Synapse"
            subMenu={
                <>
                    <Typography variant="h6" gutterBottom ml={1}>
                        {translate(`pos.menu.configureSynapse`, {
                            smart_count: 1,
                        })}
                    </Typography>
                    <SolarMenu.List dense>
                        <SolarMenu.Item
                            name="coreServices"
                            to="/core-services"
                            icon={<DesignServicesIcon />}
                            label={translate(`pos.menu.coreServices`, {
                                smart_count: 1,
                            })}
                        />
                        <SolarMenu.Item
                            name="serviceContext"
                            to="/service-context"
                            icon={<DesignServicesIcon />}
                            label={translate(`pos.menu.serviceContext`, {
                                smart_count: 1,
                            })}
                        />
                        <SolarMenu.Item
                            name="platforms"
                            to="/platforms"
                            icon={<LayersIcon />}
                            label="Platforms"
                        />
                           <SolarMenu.Item
                            name="onboarding-deck"
                            icon={<ArticleIcon />}
                            label="Deck Management"
                            to="/onboarding-deck"
                        />
                        <SolarMenu.Item
                            name="onboarding-display-condition"
                            icon={<SettingsIcon />}
                            label="Display Conditions"
                            to="/onboarding-display-condition"
                        />
                        <SolarMenu.Item
                            name="website-template"
                            icon={<LanguageIcon />}
                            label="Website Templates"
                            to="/website-template"
                        />
                        <SolarMenu.Item
                            name="rbac"
                            icon={<ManageAccountsIcon />}
                            label="pos.menu.rbac"
                            to="/rbac"
                        />
                        
                        {/* rsg-decks */}
                     
                    </SolarMenu.List>
                </>
            }
        />
    );
};

const SupportMenuItem = (): ReactElement => {
    const translate = useTranslate();
    const location = useLocation();
    const isSelected = location.pathname.startsWith('/support');

    return (
        <SolarMenu.Item
            name="change-requests"
            icon={<ChangeCircleIcon />}
            label={translate('pos.menu.changeRequests')}
            selected={isSelected}
            subMenu={
                <>
                    <Typography variant="h6" gutterBottom ml={1}>
                        {translate('pos.menu.support', { smart_count: 1 })}
                    </Typography>
                    <SolarMenu.List dense>
                        <SolarMenu.Item
                            name="support.dns_change"
                            to="/support/dns-change"
                            icon={<DnsIcon />}
                            label={translate('pos.menu.dns_change')}
                        />
                        <SolarMenu.Item
                            name="support.design_change"
                            to="/support/design-change"
                            icon={<BrushIcon />}
                            label={translate('pos.menu.design_change')}
                        />
                        <SolarMenu.Item
                            name="support.seo_change"
                            to="/support/seo-change"
                            icon={<SEOIcon />}
                            label={translate('pos.menu.seo_change')}
                        />
                        <SolarMenu.Item
                            name="support.ppc_change"
                            to="/support/ppc-change"
                            icon={<CampaignIcon />}
                            label={translate('pos.menu.ppc_change')}
                        />
                        <SolarMenu.Item
                            name="support.social_change"
                            to="/support/social-change"
                            icon={<SocialIcon />}
                            label={translate('pos.menu.social_change')}
                        />
                        <SolarMenu.Item
                            name="support.content_change"
                            to="/support/content-change"
                            icon={<ContentPasteIcon />}
                            label={translate('pos.menu.content_change')}
                        />
                        <SolarMenu.Item
                            name="support.brand_change"
                            to="/support/brand-change"
                            icon={<BrandingWatermarkIcon />}
                            label={translate('pos.menu.brand_change')}
                        />
                        <SolarMenu.Item
                            name="support.analytics_change"
                            to="/support/analytics-change"
                            icon={<AnalyticsIcon />}
                            label={translate('pos.menu.analytics_change')}
                        />
                    </SolarMenu.List>
                </>
            }
        />
    );
};

// const usePersistedQueriesMenu = (
//     resource: string
// ): { label: string; to: string }[] => {
//     const [savedQueries] = useSavedQueries(resource);
//     const savedQueriesMenuItems = savedQueries.map(({ label, value }) => ({
//         label,
//         to: `/${resource}?${querystring.stringify({
//             filter: JSON.stringify(value.filter),
//             sort: value?.sort?.field,
//             order: value?.sort?.order,
//             page: 1,
//             perPage: value.perPage,
//             displayedFilters: value.displayedFilters,
//         })}`,
//     }));

//     return savedQueriesMenuItems;
// };

const CustomBottomToolbar = () => (
    <>
        <SearchMenuItem />
        <SolarMenu.LoadingIndicatorItem />
        <SolarMenuUserItem />
    </>
);

const SearchMenuItem = () => (
    <SolarMenu.Item
        icon={<SearchIcon />}
        label="pos.search"
        name="search"
        subMenu={<SearchSubMenu />}
        data-testid="search-button"
    />
);

const SolarMenuUserItem = () => {
    const { isPending, identity } = useGetIdentity();
    const authProvider = useAuthProvider();
    const dataProvider = useDataProvider();
    const [userAvatar, setUserAvatar] = React.useState<string | null>(null);

    // Load user's profile picture from the database
    React.useEffect(() => {
        const loadUserAvatar = async () => {
            try {
                const idToken = localStorage.getItem('id_token');
                if (!idToken) return;

                const user = await dataProvider.getList('user', {
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: { token: { "$eq": idToken } },
                    meta: {
                        populate: ['profilePicture'],
                        raw: true
                    }
                });

                if (user.data[0]?.profilePicture?.fileUrl) {
                    setUserAvatar(user.data[0].profilePicture.fileUrl);
                }
            } catch (error) {
                console.log('Could not load user avatar:', error);
            }
        };

        if (!isPending && authProvider) {
            loadUserAvatar();
        }
    }, [dataProvider, isPending, authProvider]);

    if (isPending) return null;
    const avatarSx = { maxWidth: '1.4em', maxHeight: '1.4em' };
    return (
        <SolarMenu.Item
            icon={
                authProvider ? (
                    (userAvatar || identity?.avatar) ? (
                        <Avatar
                            src={userAvatar || identity.avatar}
                            alt={identity.fullName}
                            sx={avatarSx}
                        />
                    ) : (
                        <Avatar sx={avatarSx}>
                            {identity?.fullName?.charAt(0)}
                        </Avatar>
                    )
                ) : (
                    <SettingsIcon />
                )
            }
            label={identity?.fullName || 'pos.profile'}
            name="profile"
            subMenu={<ProfileSubMenu />}
            data-testid="profile-button"
        />
    );
};