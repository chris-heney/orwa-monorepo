import React from "react";
import { Box, Divider, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { Title } from "react-admin";
import { useAwardContext } from "./AwardContextProvider";
import AwardSummary from "./components/AwardSummary";
import AwardNominationList from "./components/AwardNominationList";
import AwardWinnerList from "./components/AwardWinnerList";
import AwardDashboardHeader from "./components/AwardDashboardHeader";
import AwardFilterSidebar from "./components/AwardFilterSidebar";
import { a11yTabPanelProps, a11yTabProps } from "../../helpers/TabFormatters";

const AwardDashboard = () => {
  const { selectedTab, setSelectedTab } = useAwardContext();

  return (
    <Box sx={{ display: "flex", flexDirection: "row", maxWidth: "96vw" }}>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 10, mt: 3 }}>
          <AwardDashboardHeader />
          <Title title="ORWA Awards" />
          <TabContext value={selectedTab}>
            <TabList
              variant="scrollable"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[900]
                    : theme.palette.grey[100],
                overflow: "clip",
              }}
              onChange={(_event, value) => setSelectedTab(value)}
            >
              <Tab
                icon={<DashboardIcon />}
                label="Summary"
                value="summary"
                {...a11yTabProps(0)}
              />
              <Tab
                icon={<EmojiEventsIcon />}
                label="Nominations"
                value="nominations"
                {...a11yTabProps(1)}
              />
              <Tab
                icon={<MilitaryTechIcon />}
                label="Winners"
                value="winners"
                {...a11yTabProps(2)}
              />
            </TabList>
            <Divider />
          </TabContext>
        </Box>
        <TabContext value={selectedTab}>
          <TabPanel value="summary" {...a11yTabPanelProps(0)} sx={{ p: 0, m: 0 }}>
            <AwardSummary />
          </TabPanel>
          <TabPanel value="nominations" {...a11yTabPanelProps(1)} sx={{ p: 0 }}>
            <AwardNominationList />
          </TabPanel>
          <TabPanel value="winners" {...a11yTabPanelProps(2)} sx={{ p: 0 }}>
            <AwardWinnerList />
          </TabPanel>
        </TabContext>
      </Box>
      <AwardFilterSidebar />
    </Box>
  );
};

export default AwardDashboard;
