import React from "react";
import { Box, Tab, Divider } from "@mui/material";
import { Title } from "react-admin";

import { TabContext, TabPanel, TabList } from "@mui/lab";

import DashboardIcon from "@mui/icons-material/Dashboard";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";

import { useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";

import { a11yTabPanelProps, a11yTabProps } from "../../helpers/TabFormatters";
import {
  SoonerwarnTabValue,
  useSoonerwarnContext,
} from "./SoonerwarnContextProvider";
import SoonerwarnDashboardHeader from "./components/SoonerwarnDashboardHeader";
import SoonerwarnManagementSidebars from "./components/SoonerwarnManagementSidebars";
import SoonerwarnList from "./SoonerwarnList";
import SoonerwarnManagementSettings from "./SoonerwarnManagementSettings";
import NeedsAssistanceList from "./NeedsAssistanceList";
import { Map } from "@mui/icons-material";

const SoonerwarnDashboard = () => {
  const {
    selectedTab,
    setSelectedTab,
    isSettingsOpen,
    setIsEmailSidebarOpen,
    isActivitySidebarOpen,
    isEmailSidebarOpen,
    setResource,
  } = useSoonerwarnContext();

  // @SEE: https://orwa.org/staff-dashboard/conference-summary-report/

  const tabs = [
    {
      label: "Map",
      value: "soonerwarn map",
      icon: <Map />,
      context: "edit",
      resource: null,
    },
    {
      label: "Applications",
      value: "soonerwarn applications",
      icon: <MarkunreadMailboxIcon />,
      context: "edit",
      resource: "soonerwarns",
    },
    {
      label: "Needs Assistance",
      value: "needs assistance",
      icon: <MarkunreadMailboxIcon />,
      context: "edit",
      resource: "soonerwarn-requests",
    },
    {
      label: "Volunteer",
      value: "volunteer",
      icon: <MarkunreadMailboxIcon />,
      context: "edit",
      resource: "soonerwarns",
    },
  ];
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isSmall ? "column" : "row",
        maxWidth:
          isActivitySidebarOpen || isEmailSidebarOpen ? "90vw" : "96vw",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 10, mt: 3 }}>
          {/* {isSmall && <GrantsAccordionFilter />} */}
          <SoonerwarnDashboardHeader />
          <Title title="SoonerWARN Manager" />
          <Box sx={{ justifyContent: "center" }}>
            <TabContext value={selectedTab.toString()}>
              <TabList
                variant="scrollable"
                sx={{ backgroundColor: "#eee", overflow: "clip" }}
                onChange={(event: React.SyntheticEvent, tv) => {
                  setSelectedTab(tv as SoonerwarnTabValue);
                  setResource(
                    tabs.find((tab) => tab.value === tv)?.resource || null
                  );
                  tv !== "summary" && setIsEmailSidebarOpen(false);
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
        </Box>

        <Box
          component={"main"}
          sx={{
            display: isSmall ? "flex-column" : "flex",
            flexGrow: 1,
            justifyContent: "start",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* ASIDE MOBILE Flex-Column DESKTOP FLEX-ROW make select buttons a dropdown */}
          {/* MAIN */}
          {
            <Box sx={{ pb: 2, overflow: "hidden", flexGrow: "1" }}>
              {isSettingsOpen ? (
                // <GrantManagementSettings />
                <SoonerwarnManagementSettings />
              ) : (
                <Box
                  sx={{
                    maxWidth:
                      isActivitySidebarOpen || isEmailSidebarOpen
                        ? "90vw"
                        : "96vw",
                    overflow: "scroll",
                  }}
                >
                  <TabContext value={selectedTab.toString()}>
                    <Box sx={{ backgroundColor: "#fff" }}>
                      <TabPanel
                        value="soonerwarn map"
                        {...a11yTabPanelProps(2)}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            maxWidth:
                              isActivitySidebarOpen || isEmailSidebarOpen
                                ? "90vw"
                                : "96vw",
                            overflow: "hidden",
                            mx: "auto", // Centering the iframe container
                            position: "relative",
                          }}
                        >
                          <iframe
                            src="https://orwa.org/soonerwarn-map/"
                            title="GAPP Map"
                            width="100%"
                            height="600"
                            allowFullScreen
                          />
                        </Box>
                      </TabPanel>
                      <TabPanel
                        value="soonerwarn applications"
                        {...a11yTabPanelProps(2)}
                      >
                        <SoonerwarnList />
                      </TabPanel>
                      <TabPanel
                        value="needs assistance"
                        {...a11yTabPanelProps(2)}
                      >
                        <NeedsAssistanceList />
                      </TabPanel>
                      <TabPanel value="volunteer" {...a11yTabPanelProps(2)}>
                        <SoonerwarnList />
                      </TabPanel>
                    </Box>
                  </TabContext>
                  {/* {dashboardContext === 'create' &&
                    <Create title={'Grant Manager'} component={'div'} resource='grants' redirect={'edit'}>
                      <SimpleForm>
                        <GrantForm />
                      </SimpleForm>
                    </Create>
                } */}
                </Box>
              )}
            </Box>
          }
        </Box>
      </Box>

      {/* ASIDE COMPONENTS */}

      <SoonerwarnManagementSidebars />
    </Box>
  );
};

export default SoonerwarnDashboard;
