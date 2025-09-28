import {
    Business as BusinessIcon,
    Search as SearchIcon,
    Dashboard as DashboardIcon,
    School as SchoolIcon,
    Groups as GroupsIcon,
    AccountBalance as AccountBalanceIcon,
    Email as EmailIcon,
    Settings as SettingsIcon,
    People as PeopleIcon,
    Event as EventIcon,
    Assessment as AssessmentIcon,
    Payment as PaymentIcon,
    ContactMail as ContactMailIcon,
    Work as WorkIcon,
    Timeline as TimelineIcon,
} from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { SolarMenu } from '@react-admin/ra-navigation';
import { ReactElement } from 'react';
import * as React from 'react';
import {
    useAuthProvider,
    useGetIdentity,
    useTranslate,
} from 'react-admin';
import { useLocation } from 'react-router-dom';

export const Menu = () => {
    const location = useLocation();

    return (
        <SolarMenu bottomToolbar={<CustomBottomToolbar />}>
            <SolarMenu.DashboardItem selected={location.pathname === '/'} />
            
            {/* Organizations/Associates */}
            <SolarMenu.Item
                selected={location.pathname.startsWith('/associates')}
                name="associates"
                icon={<BusinessIcon />}
                label="Associates"
                to="/associates"
            />
            
            {/* Training Management */}
            <TrainingMenuItem />
            
            {/* Conference Management */}
            <ConferenceMenuItem />
            
            {/* Grant Management */}
            <GrantMenuItem />
            
            {/* Membership Management */}
            <MembershipMenuItem />
            
            {/* Human Resources */}
            <HumanResourcesMenuItem />
            
            {/* Email Management */}
            <EmailMenuItem />
            
            {/* Settings */}
            <SettingsMenuItem />
        </SolarMenu>
    );
};

// Training Management Menu Item
const TrainingMenuItem = (): ReactElement => {
    const translate = useTranslate();
    const location = useLocation();
    const isSelected = location.pathname.startsWith('/training');

    return (
        <SolarMenu.Item
            name="training"
            icon={<SchoolIcon />}
            label="Training Management"
            selected={isSelected}
            subMenu={
                <>
                    <SolarMenu.List dense>
                        <SolarMenu.Item
                            name="training.dashboard"
                            to="/training/dashboard"
                            icon={<DashboardIcon />}
                            label="Training Dashboard"
                        />
                        <SolarMenu.Item
                            name="training.events"
                            to="/training-events"
                            icon={<EventIcon />}
                            label="Training Events"
                        />
                        <SolarMenu.Item
                            name="training.instructors"
                            to="/training-instructors"
                            icon={<PeopleIcon />}
                            label="Instructors"
                        />
                        <SolarMenu.Item
                            name="training.topics"
                            to="/training-topics"
                            icon={<WorkIcon />}
                            label="Training Topics"
                        />
                        <SolarMenu.Item
                            name="training.settings"
                            to="/event/settings"
                            icon={<SettingsIcon />}
                            label="Event Settings"
                        />
                    </SolarMenu.List>
                </>
            }
        />
    );
};

// Conference Management Menu Item
const ConferenceMenuItem = (): ReactElement => {
    const translate = useTranslate();
    const location = useLocation();
    const isSelected = location.pathname.startsWith('/conference');

    return (
        <SolarMenu.Item
            name="conference"
            icon={<GroupsIcon />}
            label="Conference Management"
            selected={isSelected}
            subMenu={
                <>
                    <SolarMenu.List dense>
                        <SolarMenu.Item
                            name="conference.dashboard"
                            to="/conference/dashboard"
                            icon={<DashboardIcon />}
                            label="Conference Dashboard"
                        />
                        <SolarMenu.Item
                            name="conference.conferences"
                            to="/conferences"
                            icon={<EventIcon />}
                            label="Conferences"
                        />
                        <SolarMenu.Item
                            name="conference.attendees"
                            to="/conference-attendees"
                            icon={<PeopleIcon />}
                            label="Attendees"
                        />
                        <SolarMenu.Item
                            name="conference.sponsors"
                            to="/conference-sponsors"
                            icon={<AccountBalanceIcon />}
                            label="Sponsors"
                        />
                        <SolarMenu.Item
                            name="conference.extras"
                            to="/conference-extras"
                            icon={<WorkIcon />}
                            label="Extras"
                        />
                    </SolarMenu.List>
                </>
            }
        />
    );
};

// Grant Management Menu Item
const GrantMenuItem = (): ReactElement => {
    const translate = useTranslate();
    const location = useLocation();
    const isSelected = location.pathname.startsWith('/grant');

    return (
        <SolarMenu.Item
            name="grant"
            icon={<AccountBalanceIcon />}
            label="Grant Management"
            selected={isSelected}
            subMenu={
                <>
                    <SolarMenu.List dense>
                        <SolarMenu.Item
                            name="grant.dashboard"
                            to="/grant/dashboard"
                            icon={<DashboardIcon />}
                            label="Grant Dashboard"
                        />
                        <SolarMenu.Item
                            name="grant.grants"
                            to="/grants"
                            icon={<WorkIcon />}
                            label="Grants"
                        />
                        <SolarMenu.Item
                            name="grant.applicants"
                            to="/grant-application-finals"
                            icon={<PeopleIcon />}
                            label="Applicants"
                        />
                        <SolarMenu.Item
                            name="grant.payouts"
                            to="/grant-payouts"
                            icon={<PaymentIcon />}
                            label="Payouts"
                        />
                    </SolarMenu.List>
                </>
            }
        />
    );
};

// Membership Management Menu Item
const MembershipMenuItem = (): ReactElement => {
    const translate = useTranslate();
    const location = useLocation();
    const isSelected = location.pathname.startsWith('/membership') || 
                      location.pathname.startsWith('/associates') ||
                      location.pathname.startsWith('/watersystems');

    return (
        <SolarMenu.Item
            name="membership"
            icon={<GroupsIcon />}
            label="Membership Management"
            selected={isSelected}
            subMenu={
                <>
                    <SolarMenu.List dense>
                        <SolarMenu.Item
                            name="membership.dashboard"
                            to="/membership-management"
                            icon={<DashboardIcon />}
                            label="Membership Dashboard"
                        />
                        <SolarMenu.Item
                            name="membership.associates"
                            to="/associates"
                            icon={<BusinessIcon />}
                            label="Associates"
                        />
                        <SolarMenu.Item
                            name="membership.watersystems"
                            to="/watersystems"
                            icon={<WorkIcon />}
                            label="Water Systems"
                        />
                        <SolarMenu.Item
                            name="membership.memberships"
                            to="/memberships"
                            icon={<GroupsIcon />}
                            label="Memberships"
                        />
                        <SolarMenu.Item
                            name="membership.items"
                            to="/membership-items"
                            icon={<WorkIcon />}
                            label="Membership Items"
                        />
                        <SolarMenu.Item
                            name="membership.transactions"
                            to="/invoices"
                            icon={<PaymentIcon />}
                            label="Transactions"
                        />
                    </SolarMenu.List>
                </>
            }
        />
    );
};

// Human Resources Menu Item
const HumanResourcesMenuItem = (): ReactElement => {
    const translate = useTranslate();
    const location = useLocation();
    const isSelected = location.pathname.startsWith('/human-resources') ||
                      location.pathname.startsWith('/staff') ||
                      location.pathname.startsWith('/users');

    return (
        <SolarMenu.Item
            name="human-resources"
            icon={<PeopleIcon />}
            label="Human Resources"
            selected={isSelected}
            subMenu={
                <>
                    <SolarMenu.List dense>
                        <SolarMenu.Item
                            name="hr.dashboard"
                            to="/human-resources/dashboard"
                            icon={<DashboardIcon />}
                            label="HR Dashboard"
                        />
                        <SolarMenu.Item
                            name="hr.staff"
                            to="/staff"
                            icon={<PeopleIcon />}
                            label="Staff"
                        />
                        <SolarMenu.Item
                            name="hr.users"
                            to="/users"
                            icon={<PeopleIcon />}
                            label="Users"
                        />
                        <SolarMenu.Item
                            name="hr.contacts"
                            to="/contacts"
                            icon={<ContactMailIcon />}
                            label="Contacts"
                        />
                    </SolarMenu.List>
                </>
            }
        />
    );
};

// Email Management Menu Item
const EmailMenuItem = (): ReactElement => {
    const translate = useTranslate();
    const location = useLocation();
    const isSelected = location.pathname.startsWith('/email');

    return (
        <SolarMenu.Item
            name="email"
            icon={<EmailIcon />}
            label="Email Management"
            selected={isSelected}
            subMenu={
                <>
                    <SolarMenu.List dense>
                        <SolarMenu.Item
                            name="email.dashboard"
                            to="/email-management"
                            icon={<DashboardIcon />}
                            label="Email Dashboard"
                        />
                        <SolarMenu.Item
                            name="email.templates"
                            to="/email-templates"
                            icon={<EmailIcon />}
                            label="Email Templates"
                        />
                        <SolarMenu.Item
                            name="email.tasks"
                            to="/scheduled-email-tasks"
                            icon={<TimelineIcon />}
                            label="Scheduled Tasks"
                        />
                    </SolarMenu.List>
                </>
            }
        />
    );
};

// Settings Menu Item
const SettingsMenuItem = (): ReactElement => {
    const translate = useTranslate();
    const location = useLocation();
    const isSelected = location.pathname.startsWith('/admin/settings') ||
                      location.pathname.startsWith('/financial-audits');

    return (
        <SolarMenu.Item
            name="settings"
            icon={<SettingsIcon />}
            label="Settings & Reports"
            selected={isSelected}
            subMenu={
                <>
                    <SolarMenu.List dense>
                        <SolarMenu.Item
                            name="settings.admin"
                            to="/admin/settings"
                            icon={<SettingsIcon />}
                            label="Admin Settings"
                        />
                        <SolarMenu.Item
                            name="settings.financial"
                            to="/financial-audits/dashboard"
                            icon={<AssessmentIcon />}
                            label="Financial Audits"
                        />
                        <SolarMenu.Item
                            name="settings.soonerwarn"
                            to="/soonerwarn/dashboard"
                            icon={<WorkIcon />}
                            label="Soonerwarn Management"
                        />
                    </SolarMenu.List>
                </>
            }
        />
    );
};

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
        data-testid="search-button"
    />
);

const SolarMenuUserItem = () => {
    const { isPending, identity } = useGetIdentity();
    const authProvider = useAuthProvider();

    if (isPending) return null;
    const avatarSx = { maxWidth: '1.4em', maxHeight: '1.4em' };
    return (
        <SolarMenu.Item
            icon={
                authProvider ? (
                    identity?.avatar ? (
                        <Avatar
                            src={identity.avatar}
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
            data-testid="profile-button"
        />
    );
};