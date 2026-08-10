import React from "react";
import { ListBase } from "react-admin";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Favorite } from "@mui/icons-material";
import { useEmailManagementContext } from "./EmailManagementContextProvider";
import EmailFilters from "./emails-templates/EmailFilters";
import EmailLogFilters from "./email-logs/EmailLogFilters";
import EmailTaskFilters from "./email-taks/components/EmailTaskFilters";
import FilterSidebarShell from "../_components/FilterSidebarShell";

const EmailManagementFilterSidebar = () => {
  const {
    selectedTab,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    isLoading,
    setSavingQuery,
    emailFilters,
    emailLogFilters,
    emailTaskFilters,
  } = useEmailManagementContext();

  if (isLoading) {
    return null;
  }

  return (
    <FilterSidebarShell
      open={isFilterSidebarOpen}
      onClose={() => setIsFilterSidebarOpen(false)}
      headerActions={
        <Tooltip title="Save Current Filter">
          <IconButton
            onClick={() => setSavingQuery((prev) => !prev)}
            size="small"
            sx={{ color: "common.white" }}
            aria-label="Save current filter"
          >
            <Favorite fontSize="small" />
          </IconButton>
        </Tooltip>
      }
    >
      <Box sx={{ p: 2 }}>
        {selectedTab === "email-templates" && (
          <ListBase
            filterDefaultValues={emailFilters}
            disableSyncWithLocation
            resource={selectedTab}
          >
            <EmailFilters />
          </ListBase>
        )}
        {selectedTab === "email-logs" && (
          <ListBase
            filterDefaultValues={emailLogFilters}
            disableSyncWithLocation
            resource={selectedTab}
          >
            <EmailLogFilters />
          </ListBase>
        )}
        {selectedTab === "scheduled-email-tasks" && (
          <ListBase
            filterDefaultValues={emailTaskFilters}
            disableSyncWithLocation
            resource={selectedTab}
          >
            <EmailTaskFilters />
          </ListBase>
        )}
      </Box>
    </FilterSidebarShell>
  );
};

export default EmailManagementFilterSidebar;
