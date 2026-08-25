import React from "react";
import { Box, Tab, Divider, useMediaQuery, Grid } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import { Title } from "react-admin";
import { Theme } from "@mui/material/styles";
import { a11yTabPanelProps, a11yTabProps } from "../../helpers/TabFormatters";
import { dashboardTabListSx } from "../../css/formLayout";
import { useEmailManagementContext } from "./EmailManagementContextProvider";
import EmailInterface from "./emails-templates/EmailInterface";
import ScheduledEmailTaskInterface from "./email-taks/ScheduledTaskList";
import { TabValue } from "./types";
import { Email, Task, StorageOutlined } from "@mui/icons-material";
import EmailManagemenHeader from "./EmailManagemenHeader";
import EmailLogsList from "./email-logs/EmailLogList";
import EmailManagementFilterSidebar from "./EmailManagamentFilterSidebar";

const EmailManagementDashboard = () => {
  const { selectedTab, setSelectedTab, isSettingsOpen } =
    useEmailManagementContext();
  // const { role, isLoading } = useUserRoleContext();

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  const tabs = [
    {
      label: "Emails",
      value: "email-templates",
      icon: <Email />,
    },
    {
      label: "Email Tasks",
      value: "scheduled-email-tasks",
      icon: <Task />,
    },
    {
      label: "Email Logs",
      value: "email-logs",
      icon: <StorageOutlined />,
    }
  ];

  return (
    <Grid container spacing={0} sx={{ width: 1, maxWidth: '100%', minWidth: 0 }}>
      <Grid item xs={12} md={12}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 10, mt: 0 }}>
          <Title title="Email Management" />
          <EmailManagemenHeader/>
          {isSettingsOpen ? (
            <></>
          ) : (
            <Box sx={{ justifyContent: "center" }}>
              <TabContext value={selectedTab.toString()}>
                <TabList
                  variant="scrollable"
                  sx={{
                    ...dashboardTabListSx,
                    maxWidth: isSmall ? 320 : undefined,
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
                  <Box sx={{ backgroundColor: "background.paper" }}>
                    <TabPanel value="email-templates" {...a11yTabPanelProps(1)}>
                      <EmailInterface />
                    </TabPanel>
                    <TabPanel value="scheduled-email-tasks" {...a11yTabPanelProps(2)}>
                      <ScheduledEmailTaskInterface />
                    </TabPanel>     
                    <TabPanel value="email-logs" {...a11yTabPanelProps(2)}>
                      <EmailLogsList />
                    </TabPanel>               
                  </Box>
                </TabContext>
              </Box>
            </Box>
          </Box>
      </Grid>
      {!isSettingsOpen && <EmailManagementFilterSidebar/>}
    </Grid>
  );
};

export default EmailManagementDashboard;
