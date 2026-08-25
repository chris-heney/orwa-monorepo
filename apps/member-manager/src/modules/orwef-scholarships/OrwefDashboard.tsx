import React from "react";
import { Box, Divider, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import { Title } from "react-admin";
import { useOrwefContext } from "./OrwefContextProvider";
import ScholarshipSummary from "./components/ScholarshipSummary";
import ScholarshipApplicationList from "./components/ScholarshipApplicationList";
import OrwefDashboardHeader from "./components/OrwefDashboardHeader";
import OrwefFilterSidebar from "./components/OrwefFilterSidebar";
import { a11yTabPanelProps, a11yTabProps } from "../../helpers/TabFormatters";
import { dashboardTabListSx } from "../../css/formLayout";

const OrwefDashboard = () => {
  const { selectedTab, setSelectedTab } = useOrwefContext();

  return (
    <Box sx={{ display: "flex", flexDirection: "row", maxWidth: "96vw" }}>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 10, mt: 0 }}>
          <OrwefDashboardHeader />
          <Title title="ORWEF Scholarships" />
          <TabContext value={selectedTab}>
            <TabList
              variant="scrollable"
              sx={dashboardTabListSx}
              onChange={(_event, value) => setSelectedTab(value)}
            >
              <Tab
                icon={<DashboardIcon />}
                label="Summary"
                value="summary"
                {...a11yTabProps(0)}
              />
              <Tab
                icon={<SchoolIcon />}
                label="Applications"
                value="applications"
                {...a11yTabProps(1)}
              />
            </TabList>
            <Divider />
          </TabContext>
        </Box>
        <TabContext value={selectedTab}>
          <TabPanel value="summary" {...a11yTabPanelProps(0)} sx={{ p: 0, m: 0 }}>
            <ScholarshipSummary />
          </TabPanel>
          <TabPanel value="applications" {...a11yTabPanelProps(1)} sx={{ p: 0 }}>
            <ScholarshipApplicationList />
          </TabPanel>
        </TabContext>
      </Box>
      <OrwefFilterSidebar />
    </Box>
  );
};

export default OrwefDashboard;
