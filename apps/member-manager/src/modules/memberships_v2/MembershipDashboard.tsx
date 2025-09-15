import React from "react";
import { Box, Tab, Divider, useMediaQuery, Grid } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import { Title } from "react-admin";
import { Theme } from "@mui/material/styles";

import DashboardIcon from "@mui/icons-material/Dashboard";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import PersonIcon from "@mui/icons-material/Person";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PaidIcon from "@mui/icons-material/Paid";

import { useMembershipContext } from "./MembershipsContextProvider";
  import WaterSystemList from "./watersystem/WatersystemList";
import AssociateList from "./associate/AssociateList";
import MembershipFilters from "./componenets/MembershipFilters";
import MembershipsSummary from "./MembershipsSummary";
import MembershipList from "./memberships/MembershipsList";
import MembershipItemsList from "./membership-items/MembershipItemsList";
import InvoicesList from "../invoices/InvoicesList";
import MembershiphHeader from "./componenets/MembershipsHeader";
import { TabValue } from "./types/IMembershipContextProvider";
import { a11yTabPanelProps, a11yTabProps } from "../../helpers/TabFormatters";
import MembershipSettings from "./componenets/MembershipSettings";

const MembershipDashboard = () => {
  const { selectedTab, setSelectedTab, isSettingsOpen, isFilterSidebarOpen} =
    useMembershipContext();

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  const tabs = [
    {
      label: "Summary",
      value: "summary",
      icon: <DashboardIcon />,
    },
    {
      label: "Watersystems",
      value: "watersystems",
      icon: <MarkunreadMailboxIcon />,
    },
    {
      label: "Associates",
      value: "associates",
      icon: <PersonIcon />,
    },
    {
      label: "Memberships",
      value: "memberships",
      icon: <LoyaltyIcon />,
    },
    {
      label: "Items",
      value: "membership-items",
      icon: <AddShoppingCartIcon />,
    },
    {
      label: "Transactions",
      value: "invoices",
      icon: <PaidIcon />,
    },
  ];

  return (
    <Grid container spacing={0} maxWidth={'95vw'}>
      <Grid item xs={12} md={((isFilterSidebarOpen && !isSettingsOpen ) && selectedTab !== "summary") ? 10 : 12}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 10, mt: 3 }}>
          <Title title="Memberships" />
          <MembershiphHeader />
          {isSettingsOpen ? (
            <></>
          ) : (
            <Box sx={{ justifyContent: "center" }}>
              <TabContext value={selectedTab.toString()}>
                <TabList
                  variant="scrollable"
                  sx={{
                    backgroundColor: "#eee",
                    maxWidth: isSmall ? 320 : undefined,
                    overflow: "clip",
                  }}
                  onChange={(event: React.SyntheticEvent, tv) => {
                    setSelectedTab(tv as TabValue);
                  }}
                >
                  {tabs.map((tab, i) => (
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
              display: "flex",
              flexDirection: isSmall ? "column" : "row",
              flexGrow: 1,
              justifyContent: "start",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ overflow: "hidden", flexGrow: 1 }}>
              <Box sx={{ overflow: "scroll" }}>
                <TabContext value={selectedTab}>
                  <Box sx={{ backgroundColor: "#fff" }}>
                    <TabPanel value="summary" {...a11yTabPanelProps(0)}>
                      <MembershipsSummary />
                    </TabPanel>
                    <TabPanel value="watersystems" {...a11yTabPanelProps(1)}>
                      <WaterSystemList />
                    </TabPanel>
                    <TabPanel value="associates" {...a11yTabPanelProps(2)}>
                      <AssociateList />
                    </TabPanel>
                    <TabPanel value="memberships" {...a11yTabPanelProps(3)}>
                      <MembershipList />
                    </TabPanel>
                    <TabPanel
                      value="membership-items"
                      {...a11yTabPanelProps(4)}
                    >
                      <MembershipItemsList />
                    </TabPanel>
                    <TabPanel value="invoices" {...a11yTabPanelProps(5)}>
                      <InvoicesList filters={{ context: "membership-form" }} />
                    </TabPanel>
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
