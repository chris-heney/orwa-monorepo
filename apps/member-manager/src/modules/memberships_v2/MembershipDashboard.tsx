import React, { useEffect } from 'react';
import { Box, Tab, Divider, useMediaQuery, Grid } from '@mui/material';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import { Title } from 'react-admin';
import { Theme } from '@mui/material/styles';

import DashboardIcon from '@mui/icons-material/Dashboard';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import PersonIcon from '@mui/icons-material/Person';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';

import { useMembershipContext } from './MembershipsContextProvider';
import WaterSystemList from './watersystem/WatersystemList';
import AssociateList from './associate/AssociateList';
import MembershipFilters from './componenets/MembershipFilters';
import MembershipsSummary from './MembershipsSummary';
import MembershipList from './memberships/MembershipsList';
import MembershipItemsList from './membership-items/MembershipItemsList';
import InvoicesList from '../invoices/InvoicesList';
import MembershiphHeader from './componenets/MembershipsHeader';
import { TabValue } from './types/IMembershipContextProvider';
import { a11yTabPanelProps, a11yTabProps } from '../../helpers/TabFormatters';
import MembershipSettings from './componenets/MembershipSettings';
import { useCan } from '../rbac-manager/useCan';

const MembershipDashboard = () => {
  const { selectedTab, setSelectedTab, isSettingsOpen } =
    useMembershipContext();
  const { can, isLoading } = useCan();

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  const tabs = [
    {
      label: 'Summary',
      value: 'summary',
      icon: <DashboardIcon />,
      visible: can('find', 'membership'),
    },
    {
      label: 'Watersystems',
      value: 'watersystems',
      icon: <MarkunreadMailboxIcon />,
      visible: can('find', 'watersystem'),
    },
    {
      label: 'Associates',
      value: 'associates',
      icon: <PersonIcon />,
      visible: can('find', 'associate'),
    },
    {
      label: 'Memberships',
      value: 'memberships',
      icon: <LoyaltyIcon />,
      visible: can('find', 'membership'),
    },
    {
      label: 'Items',
      value: 'membership-items',
      icon: <AddShoppingCartIcon />,
      visible: can('find', 'membership-item'),
    },
    {
      label: 'Transactions',
      value: 'invoices',
      icon: <PaidIcon />,
      visible: can('find', 'invoice'),
    },
  ];
  const visibleTabs = tabs.filter((tab) => tab.visible);

  useEffect(() => {
    if (isLoading || visibleTabs.length === 0) return;
    if (!visibleTabs.some((tab) => tab.value === selectedTab)) {
      setSelectedTab(visibleTabs[0].value as TabValue);
    }
    // visibleTabs derives solely from `can`, which is memoized.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, can, selectedTab, setSelectedTab]);

  return (
    <Grid container spacing={0} sx={{ width: 1, maxWidth: '100%', minWidth: 0 }}>
      <Grid item xs={12} md={12}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 10, mt: 0 }}>
          <Title title="Memberships" />
          <MembershiphHeader />
          {isSettingsOpen ? (
            <></>
          ) : (
            <Box sx={{ justifyContent: 'center' }}>
              <TabContext value={selectedTab.toString()}>
                <TabList
                  variant="scrollable"
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? theme.palette.grey[900]
                        : theme.palette.grey[100],
                    maxWidth: isSmall ? 320 : undefined,
                    overflow: 'clip',
                    '& .MuiTab-root': {
                      color: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.85)'
                          : 'rgba(0, 0, 0, 0.7)',
                      opacity: 1,
                      '&.Mui-selected': {
                        color: 'primary.main',
                      },
                    },
                  }}
                  onChange={(event: React.SyntheticEvent, tv) => {
                    setSelectedTab(tv as TabValue);
                  }}
                >
                  {visibleTabs.map((tab, i) => (
                    <Tab
                      key={`tab-${i}`}
                      label={tab.label}
                      {...a11yTabProps(i)}
                      value={tab.value}
                      icon={tab.icon}
                    />
                  ))}
                </TabList>
              </TabContext>
              <Divider />
            </Box>
          )}
        </Box>

        {isSettingsOpen ? (
          <MembershipSettings />
        ) : (
          <Box
            component="main"
            sx={{
              display: 'flex',
              flexDirection: isSmall ? 'column' : 'row',
              flexGrow: 1,
              justifyContent: 'start',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
              <Box sx={{ overflow: 'scroll' }}>
                <TabContext value={selectedTab}>
                  <Box
                    sx={{
                      backgroundColor:
                        selectedTab === 'summary'
                          ? 'transparent'
                          : 'background.paper',
                    }}
                  >
                    {can('find', 'membership') && (
                      <TabPanel
                        value="summary"
                        {...a11yTabPanelProps(0)}
                        sx={{ p: 0 }}
                      >
                        <MembershipsSummary />
                      </TabPanel>
                    )}
                    <TabPanel value="watersystems" {...a11yTabPanelProps(1)}>
                      <WaterSystemList />
                    </TabPanel>
                    <TabPanel value="associates" {...a11yTabPanelProps(2)}>
                      <AssociateList />
                    </TabPanel>
                    {can('find', 'membership') && (
                      <TabPanel value="memberships" {...a11yTabPanelProps(3)}>
                        <MembershipList />
                      </TabPanel>
                    )}
                    {can('find', 'membership-item') && (
                      <TabPanel
                        value="membership-items"
                        {...a11yTabPanelProps(4)}
                      >
                        <MembershipItemsList />
                      </TabPanel>
                    )}
                    {can('find', 'invoice') && (
                      <TabPanel value="invoices" {...a11yTabPanelProps(5)}>
                        <InvoicesList
                          filters={{ context: 'membership-form' }}
                        />
                      </TabPanel>
                    )}
                    {/* {role === "Super Admin" && (
                      <TabPanel value="logs" {...a11yTabPanelProps(6)}>
                        <FormLogsList />
                      </TabPanel>
                    )} */}
                  </Box>
                </TabContext>
              </Box>
            </Box>
          </Box>
        )}
      </Grid>
      {!isSettingsOpen && <MembershipFilters />}
    </Grid>
  );
};

export default MembershipDashboard;
