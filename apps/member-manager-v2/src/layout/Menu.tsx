import {
    Search as SearchIcon,
    Dashboard as DashboardIcon,
    Email as EmailIcon,
    Diversity1 as MembersIcon,
    Groups as PeopleIcon,
    Inventory as InventoryIcon,
    ModelTraining as TrainingIcon,
    CalendarMonth as EventsIcon,
    RequestPage as RequestPageIcon,
    Settings as SettingsIcon,
    StarsOutlined,
    School as SchoolIcon,
    EmojiEvents,
} from '@mui/icons-material';
import { Avatar, Typography } from '@mui/material';
import { SolarMenu } from '@react-admin/ra-navigation';
import { ReactElement } from 'react';
import * as React from 'react';
import { useAuthProvider, useGetIdentity, useDataProvider } from 'react-admin';
import { useLocation } from 'react-router-dom';
import { ProfileSubMenu } from './ProfileSubMenu';
import { SearchSubMenu } from './SearchSubMenu';

export const Menu = () => {
    const location = useLocation();
    // You can add user role logic here similar to Admin.tsx
    // const {user} = useCurrentUser();

    return (
        <SolarMenu bottomToolbar={<CustomBottomToolbar />}>
            {/* Dashboard */}
            <SolarMenu.Item
                selected={location.pathname === '/admin/dashboard'}
                name="dashboard"
                to="/admin/dashboard"
                label="Dashboard"
                icon={<DashboardIcon />}
            />

            {/* Email Management */}
            <SolarMenu.Item
                selected={location.pathname.startsWith('/email-management')}
                name="email-management"
                to="/email-management"
                label="Emails"
                icon={<EmailIcon />}
            />

            {/* Membership Management */}
            <SolarMenu.Item
                selected={location.pathname.startsWith(
                    '/membership-management'
                )}
                name="membership-management"
                to="/membership-management"
                label="Memberships"
                icon={<MembersIcon />}
            />

            {/* Human Resources / Contacts */}
            <SolarMenu.Item
                selected={location.pathname.startsWith('/human-resources')}
                name="human-resources-dashboard"
                to="/human-resources/dashboard"
                label="Contacts"
                title="Contacts"
                icon={<PeopleIcon />}
            />

            {/* Asset Manager */}
            <SolarMenu.Item
                selected={location.pathname.startsWith('/assets')}
                name="assets"
                to="/assets"
                label="Asset Manager"
                icon={<InventoryIcon />}
            />

            {/* Training Manager - with submenu */}
            <TrainingManagerMenuItem />

            {/* Program Manager */}
            <ProgramMenuItem />

            {/* Conference Manager */}
            <SolarMenu.Item
                selected={location.pathname.startsWith('/conference')}
                name="conference-dashboard"
                to="/conference/dashboard"
                label="Conference Manager"
                title="Conference Manager"
                icon={<EventsIcon />}
            />

            {/* Grant Manager */}
            <SolarMenu.Item
                selected={location.pathname.startsWith('/grant')}
                name="grant-dashboard"
                to="/grant/dashboard"
                label="Grant Manager"
                title="Grant Manager"
                icon={<RequestPageIcon />}
            />
            {/* Settings */}
            <SolarMenu.Item
                selected={location.pathname.startsWith('/admin/settings')}
                name="settings"
                to="/admin/settings"
                label="Settings"
                icon={<SettingsIcon />}
            />
        </SolarMenu>
    );
};

// Subitems will be scholarships and awards

const ProgramMenuItem = (): ReactElement => {
    const location = useLocation();
    const isSelected = location.pathname.startsWith('/program');
    return (
        <SolarMenu.Item
            name="programs"
            label="Programs Manager"
            icon={<StarsOutlined />}
            selected={isSelected}
            subMenu={
                <>
                    <Typography variant="h6" gutterBottom ml={1}>
                        Programs Manager
                    </Typography>
                    <SolarMenu.List dense>
                        {/* Scholarship Applications */}
                        <SolarMenu.Item
                            selected={location.pathname.startsWith(
                                '/scholarship'
                            )}
                            name="scholarship-dashboard"
                            to="/scholarship/dashboard"
                            label="Scholarship Applications"
                            title="Scholarship Applications"
                            icon={<SchoolIcon />}
                        />
                        <SolarMenu.Item
                            name="awards"
                            to="/awards"
                            label="Awards"
                            selected={location.pathname.startsWith('/awards')}
                            icon={<EmojiEvents />}
                        />
                    </SolarMenu.List>
                </>
            }
        />
    );
};

// Training Manager Menu Item with submenu
const TrainingManagerMenuItem = (): ReactElement => {
    const location = useLocation();
    const isSelected = location.pathname.startsWith('/training');

    return (
        <SolarMenu.Item
            name="training"
            label="Training Manager"
            icon={<TrainingIcon />}
            selected={isSelected}
            subMenu={
                <>
                    <Typography variant="h6" gutterBottom ml={1}>
                        Training Manager
                    </Typography>
                    <SolarMenu.List dense>
                        <SolarMenu.Item
                            name="training-dashboard"
                            to="/training/dashboard"
                            label="Training Dashboard"
                            selected={location.pathname.startsWith('/training')}
                        />
                        <SolarMenu.Item
                            name="training-events"
                            to="/training-events"
                            label="Training Events"
                            selected={location.pathname.startsWith(
                                '/training-events'
                            )}
                        />
                        <SolarMenu.Item
                            name="training-event-logs"
                            to="/training-event-logs"
                            label="Training History"
                            selected={location.pathname.startsWith(
                                '/training-event-logs'
                            )}
                        />
                        <SolarMenu.Item
                            name="training-settings"
                            to="/training-settings/1/edit"
                            label="Settings"
                            selected={location.pathname.startsWith(
                                '/training-settings'
                            )}
                        />
                    </SolarMenu.List>
                </>
            }
        />
    );
};

// Keep the bottom toolbar with search and user profile
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
        label="Search"
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
                    filter: { token: { $eq: idToken } },
                    meta: {
                        populate: ['profilePicture'],
                        raw: true,
                    },
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
                    userAvatar || identity?.avatar ? (
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
            label={identity?.fullName || 'Profile'}
            name="profile"
            subMenu={<ProfileSubMenu />}
            data-testid="profile-button"
        />
    );
};
