import React from "react";
import { Box, Tab, Divider, useTheme } from "@mui/material";
import { Create, Edit, Loading, Show, SimpleForm, Title } from "react-admin";

import { TabContext, TabPanel, TabList } from "@mui/lab";

import EditIcon from "@mui/icons-material/Edit";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import PaidIcon from "@mui/icons-material/Paid";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TokenIcon from "@mui/icons-material/Token";

import { useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import GrantForm from "./grants/components/GrantForm";
import GrantApplicationList from "./grant-application/ApplicationList";
import GrantSummary from "./grants/components/GrantSummary";
import GrantsAccordionFilter from "./_components/GrantsAcoordionFilter";
import GrantManagementSettings from "./_components/GrantManagementSettings";

import ScoreList from "./scores/ScoreList";
import { TabValue } from "./types/IGrantContextProvider";
import { useGrantContext } from "./GrantContextProvider";
import GrantDashboardHeader from "./_components/GrantDashboardHeader";
import GrantManagementSidebars from "./GrantManagementSidebars";
import GrantScoringPublicKeyTokens from "./grants/components/GrantScoringTokens";
import { a11yTabPanelProps, a11yTabProps } from "../../helpers/TabFormatters";
import { Map } from "@mui/icons-material";
import ReimbursementPayoutsList from "./payouts/PayoutsList";
import AdministrativePayoutsList from "./payouts/AdministrativePayoutList";

const GrantDashboard = () => {
  const theme = useTheme();
  
  const {
    grants,
    grantId,
    selectedTab,
    setSelectedTab,
    dashboardContext,
    isSettingsOpen,
    setIsEmailSidebarOpen,
    isActivitySidebarOpen,
    isEmailSidebarOpen,
    isFilterSidebarOpen,
    setResource,
  } = useGrantContext();

  // @SEE: https://orwa.org/staff-dashboard/conference-summary-report/

  const tabs = [
    {
      label: "Summary",
      value: "summary",
      icon: <DashboardIcon />,
      context: "edit",
      resource: null,
    },
    {
      label: "Map",
      value: "map",
      icon: <Map />,
      context: "edit",
      resource: null,
    },
    {
      label: "Applications",
      value: "applications",
      icon: <MarkunreadMailboxIcon />,
      context: "edit",
      resource: "grant-application-finals",
    },
    {
      label: "Award Payouts",
      value: "payouts",
      icon: <PaidIcon />,
      context: "edit",
      resource: "grant-payouts",
    },
    {
      label: "Admin Payouts",
      value: "Admin Payouts",
      icon: <PaidIcon />,
      context: "edit",
      resource: "grant-payouts",
    },
    {
      label: "Scoresheets",
      value: "application scores",
      icon: <ListAltIcon />,
      context: "edit",
      resource: "grant-application-scores",
    },
    {
      label: "Edit",
      value: "edit",
      icon: <EditIcon />,
      context: "edit",
    },
    {
      label: "Tokens",
      value: "tokens",
      icon: <TokenIcon />,
      context: "edit",
    },
  ];
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  if (grants.length === 0) return <Loading />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isSmall ? "column" : "row", 
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 10, mt: 3 }}>
          {isSmall && <GrantsAccordionFilter />}
          <GrantDashboardHeader />
          <Title title={"Grant Manager"} />
          <Box sx={{ justifyContent: "center" }}>
            <TabContext value={selectedTab.toString()}>
              <TabList
                variant="scrollable"
                sx={{ backgroundColor: theme.palette.background.paper, overflow: "clip" }}
                onChange={(event: React.SyntheticEvent, tv) => {
                  setSelectedTab(tv as TabValue);
                  setResource(
                    tabs.find((tab) => tab.value === tv)?.resource || null
                  );
                  tv !== "summary" && setIsEmailSidebarOpen(false);
                }}
              >
                {tabs
                  .filter((tab) => tab.context.includes(dashboardContext))
                  .map((tab, i) => (
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
                <GrantManagementSettings />
              ) : (
                <Box
                  sx={{
                    maxWidth:
                      isActivitySidebarOpen ||
                      isEmailSidebarOpen ||
                      isFilterSidebarOpen
                        ? "90vw"
                        : "96vw",
                    overflow: "scroll",
                  }}
                >
                  <TabContext value={selectedTab.toString()}>
                    {dashboardContext === "edit" && (
                      <Box sx={{ backgroundColor: theme.palette.background.default }}>
                        <TabPanel
                          style={{ marginTop: -15 }}
                          value="summary"
                          {...a11yTabPanelProps(0)}
                        >
                          <Show
                            title={" "}
                            emptyWhileLoading
                            component={"div"}
                            id={grantId}
                            resource="grants"
                          >
                            <GrantSummary />
                          </Show>
                        </TabPanel>
                        <TabPanel value="edit" {...a11yTabPanelProps(1)}>
                          <Edit
                            sx={{ marginTop: -2 }}
                            redirect={false}
                            component={"div"}
                            title={" "}
                            id={grantId}
                            resource="grants"
                          >
                            <SimpleForm>
                              <GrantForm />
                            </SimpleForm>
                          </Edit>
                        </TabPanel>
                        <TabPanel
                          value="applications"
                          {...a11yTabPanelProps(2)}
                        >
                          <GrantApplicationList />
                        </TabPanel>
                        <TabPanel value="payouts" {...a11yTabPanelProps(3)}>
                          <ReimbursementPayoutsList/>
                        </TabPanel>
                        <TabPanel value="Admin Payouts" {...a11yTabPanelProps(3)}>
                          <AdministrativePayoutsList/>
                        </TabPanel>
                        <TabPanel
                          value="application scores"
                          {...a11yTabPanelProps(3)}
                        >
                          <ScoreList />
                        </TabPanel>
                        <TabPanel value="tokens" {...a11yTabPanelProps(3)}>
                          <GrantScoringPublicKeyTokens />
                        </TabPanel>
                        <TabPanel value="map" {...a11yTabPanelProps(3)}>
                          <iframe
                            src="https://orwa.org/gapp-map/"
                            title="GAPP Map"
                            width="100%"
                            height="600"
                            allowFullScreen
                          />
                        </TabPanel>
                      </Box>
                    )}
                  </TabContext>
                  {dashboardContext === "create" && (
                    <Create
                      title={" "}
                      component={"div"}
                      resource="grants"
                      redirect={"edit"}
                    >
                      <SimpleForm>
                        <GrantForm />
                      </SimpleForm>
                    </Create>
                  )}
                </Box>
              )}
            </Box>
          }
        </Box>
      </Box>

      {/* ASIDE COMPONENTS */}

      <GrantManagementSidebars />
    </Box>
  );
};

export default GrantDashboard;
