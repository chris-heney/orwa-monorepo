import React, { useMemo } from 'react';
import { Box, Divider, Tab, Tabs } from '@mui/material';
import { Title } from 'react-admin';
import { TabContext, TabPanel } from '@mui/lab';
import PeopleIcon from '@mui/icons-material/Groups';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PageHeadingBar from '../_components/PageHeadingBar';
import HumanResourcesContextProvider from '../human-resources/HumanResourcesContext';
import RolesContextProvider from '../../context/RolesContextProvider';
import StaffList from '../human-resources/staff/StaffList';
import InstructorsList from '../human-resources/instructors/InstructorList';
import UserList from '../human-resources/users/UserList';
import BadgeList from '../human-resources/contacts/badges/BadgeList';
import { useCan } from '../rbac-manager/useCan';

type SettingsTab = 'users' | 'staff' | 'training-instructors' | 'badges';

/**
 * Settings — administrative directory of people/accounts, laid out like the
 * Contacts page but for config entities: Users, Staff, Instructors. Each tab
 * is capability-gated; the first tab the role can see is selected by default.
 * (Personal profile + UI preferences live on the avatar menu → My Profile.)
 */
const SettingsDashboardInner = () => {
  const { can, canAction, canOnResource } = useCan();

  const tabs = useMemo(
    () =>
      [
        canAction('plugin::users-permissions.user.find') && {
          label: 'Users',
          value: 'users' as const,
          icon: <PeopleIcon />,
        },
        canOnResource('find', 'staff') && {
          label: 'Staff',
          value: 'staff' as const,
          icon: <BadgeIcon />,
        },
        canOnResource('find', 'training-instructors') && {
          label: 'Instructors',
          value: 'training-instructors' as const,
          icon: <SchoolIcon />,
        },
        can('create', 'contact-badge') && {
          label: 'Badges',
          value: 'badges' as const,
          icon: <MilitaryTechIcon />,
        },
      ].filter(Boolean) as { label: string; value: SettingsTab; icon: JSX.Element }[],
    [can, canAction, canOnResource]
  );

  const [selected, setSelected] = React.useState<SettingsTab | ''>('');
  const active: SettingsTab | '' =
    selected && tabs.some((t) => t.value === selected)
      ? selected
      : tabs[0]?.value ?? '';

  return (
    <Box>
      <Title title="Settings" />
      <Box sx={{ width: 1, minWidth: 0 }}>
        <PageHeadingBar
          title="Settings"
          info="Manage user accounts, staff, and instructors. Edit your own profile and preferences from the avatar menu (top right)."
          sx={{ mb: 0 }}
        />
        {tabs.length === 0 ? (
          <Box sx={{ p: 3, color: 'text.secondary' }}>
            You don&apos;t have access to any settings sections.
          </Box>
        ) : (
          <TabContext value={active}>
            <Tabs
              value={active}
              onChange={(_e, v) => setSelected(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? theme.palette.grey[900]
                    : theme.palette.grey[100],
              }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                  icon={tab.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>
            <Divider />
            <Box sx={{ backgroundColor: 'background.paper' }}>
              <TabPanel value="users" sx={{ p: 0 }}>
                <RolesContextProvider>
                  <UserList />
                </RolesContextProvider>
              </TabPanel>
              <TabPanel value="staff" sx={{ p: 0 }}>
                <StaffList title=" " />
              </TabPanel>
              <TabPanel value="training-instructors" sx={{ p: 0 }}>
                <InstructorsList title=" " />
              </TabPanel>
              <TabPanel value="badges" sx={{ p: 2 }}>
                <BadgeList />
              </TabPanel>
            </Box>
          </TabContext>
        )}
      </Box>
    </Box>
  );
};

const SettingsDashboard = () => (
  <HumanResourcesContextProvider>
    <SettingsDashboardInner />
  </HumanResourcesContextProvider>
);

export default SettingsDashboard;
