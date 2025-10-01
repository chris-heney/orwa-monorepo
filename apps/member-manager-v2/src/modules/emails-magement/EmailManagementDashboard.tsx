import React from "react";
import {Box, Tab, Divider, useMediaQuery, Grid, useTheme} from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import { Title } from "react-admin";
import { Theme } from "@mui/material/styles";
import { a11yTabPanelProps, a11yTabProps } from "../../helpers/TabFormatters";
import { useEmailManagementContext } from "./EmailManagementContextProvider";
import EmailInterface from "./emails-templates/EmailInterface";
import ScheduledEmailTaskInterface from "./email-taks/ScheduledTaskList";
import { TabValue } from "./types";
import { Email, Task, StorageOutlined } from "@mui/icons-material";
import EmailManagemenHeader from "./EmailManagemenHeader";
import EmailLogsList from "./email-logs/EmailLogList";
import EmailManagementFilterSidebar from "./EmailManagamentFilterSidebar";

const EmailManagementDashboard = () => {
  const theme = useTheme();
  const { selectedTab, setSelectedTab, isSettingsOpen, isFilterSidebarOpen } =
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
    <Grid container spacing={0} maxWidth={'95vw'}>
      <Grid item xs={12} md={(isSettingsOpen || !isFilterSidebarOpen) ? 12 : 10}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 10, mt: 3 }}>
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
                    backgroundColor: theme.palette.background.paper,
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
              <Box sx={{ overflow: "scroll", backgroundColor: theme.palette.background.paper,
}}>
                <TabContext value={selectedTab}>
                    <TabPanel value="email-templates" {...a11yTabPanelProps(1)}>
                      <EmailInterface />
                    </TabPanel>
                    <TabPanel value="scheduled-email-tasks" {...a11yTabPanelProps(2)}>
                      <ScheduledEmailTaskInterface />
                    </TabPanel>     
                    <TabPanel value="email-logs" {...a11yTabPanelProps(2)}>
                      <EmailLogsList />
                    </TabPanel>               
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
