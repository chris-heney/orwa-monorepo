import { Box } from "@mui/material";
import React, { useEffect } from "react";
import ActivityFeed from "../../activity/ActivityFeed";
import { useSoonerwarnContext } from "../SoonerwarnContextProvider";
import SoonerwarnStatusFilter from "./SoonerwarnStatusFilter";
import SoonerwarnEmailSideBar from "../../emails-magement/SoonerwarnEmailSidebar";
import FilterSidebarShell from "../../_components/FilterSidebarShell";
import { RightDrawer, listDrawerContext } from "../../_components/drawer";
import EmailIcon from "@mui/icons-material/Email";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";

const SoonerwarnManagementSidebars = () => {
  const {
    isFilterSidebarOpen,
    isActivitySidebarOpen,
    isEmailSidebarOpen,
    selectedTab,
    isSettingsOpen,
    setIsFilterSidebarOpen,
    setIsEmailSidebarOpen,
    setIsActivitySidebarOpen,
    setIsSettingsOpen,
    selectedStatuses,
    setSelectedStatuses,
    selectedRequestedStatuses,
    setSelectedRequestedStatuses,
  } = useSoonerwarnContext();

  useEffect(() => {
    //when switching tabs set all button states to default
    setIsFilterSidebarOpen(false);
    setIsEmailSidebarOpen(false);
    setIsSettingsOpen(false);
    setIsActivitySidebarOpen(false);
  }, [selectedTab]);

  useEffect(() => {
    if (isSettingsOpen) {
      setIsFilterSidebarOpen(false);
      setIsEmailSidebarOpen(false);
      setIsActivitySidebarOpen(false);
    }
  }, [isSettingsOpen]);

  ////based on active sidebar set the rest to false so two sidebars are not open at the same time

  useEffect(() => {
    if (isEmailSidebarOpen) {
      setIsSettingsOpen(false);
      setIsActivitySidebarOpen(false);
      setIsFilterSidebarOpen(false);
    }
  }, [isEmailSidebarOpen]);

  useEffect(() => {
    if (isSettingsOpen) {
      setIsEmailSidebarOpen(false);
      setIsActivitySidebarOpen(false);
      setIsFilterSidebarOpen(false);
    }
  }, [isSettingsOpen]);

  useEffect(() => {
    if (isActivitySidebarOpen) {
      setIsEmailSidebarOpen(false);
      setIsSettingsOpen(false);
      setIsFilterSidebarOpen(false);
    }
  }, [isActivitySidebarOpen]);

  useEffect(() => {
    if (isFilterSidebarOpen) {
      setIsEmailSidebarOpen(false);
      setIsSettingsOpen(false);
      setIsActivitySidebarOpen(false);
    }
  }, [isFilterSidebarOpen]);

  return (
    <>
      <FilterSidebarShell
        open={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        title="Filter"
        context={listDrawerContext({
          resource:
            selectedTab === "needs assistance"
              ? "request-statuses"
              : "soonerwarn-applications",
        })}
      >
        <Box sx={{ p: 2 }}>
          {selectedTab === "soonerwarn applications" && (
            <SoonerwarnStatusFilter
              selectedStatuses={selectedStatuses}
              setSelectedStatuses={setSelectedStatuses}
              resource={"soonerwarn-statuses"}
            />
          )}
          {selectedTab === "needs assistance" && (
            <SoonerwarnStatusFilter
              selectedStatuses={selectedRequestedStatuses}
              setSelectedStatuses={setSelectedRequestedStatuses}
              resource={"request-statuses"}
            />
          )}
        </Box>
      </FilterSidebarShell>

      <RightDrawer
        open={isActivitySidebarOpen}
        onClose={() => setIsActivitySidebarOpen(false)}
        title="Activity Feed"
        icon={<MarkunreadMailboxIcon fontSize="small" />}
        context={listDrawerContext({ resource: "soonerwarn-applications" })}
      >
        <ActivityFeed title=" " entity="soonerwarn-application" frame="plain" />
      </RightDrawer>

      <RightDrawer
        open={isEmailSidebarOpen && selectedTab === "soonerwarn applications"}
        onClose={() => setIsEmailSidebarOpen(false)}
        title="Notifications"
        icon={<EmailIcon fontSize="small" />}
        context={listDrawerContext({ resource: "soonerwarn-applications" })}
      >
        <SoonerwarnEmailSideBar module={"Soonerwarn Managment"} />
      </RightDrawer>
    </>
  );
};

export default SoonerwarnManagementSidebars;
