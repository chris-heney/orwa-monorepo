import React from "react";
import { ListBase } from "react-admin";
import { Grid, IconButton, Paper, Tooltip } from "@mui/material";
import { Favorite } from "@mui/icons-material";
import { useEmailManagementContext } from "./EmailManagementContextProvider";
import CustomHeader from "../_components/CustomHeader";
import EmailFilters from "./emails-templates/EmailFilters";
import EmailLogFilters from "./email-logs/EmailLogFilters";
import EmailTaskFilters from "./email-taks/components/EmailTaskFilters";
    
const EmailManagementFilterSidebar = () => {
  const {
    selectedTab,
    isFilterSidebarOpen,
    isLoading,
    setSavingQuery,
    emailFilters,
    emailLogFilters,
    emailTaskFilters
  } = useEmailManagementContext();

  return !isFilterSidebarOpen || isLoading ? (
    <></>
  ) : (
    <Grid
      item
      xs={12}
      md={2}
      sx={{
        flexGrow: 1,
        position: "relative",
      }}
    >
      <Paper
        component={"aside"}
        sx={{
          mt: 3,
          ml: 2,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <CustomHeader
          title="Filters"
          Component={() => {
            return (
              <Tooltip title="Save Current Filter">
                <IconButton onClick={() => setSavingQuery((prev) => !prev)} color="primary">
                  <Favorite
                    fontSize="small"
                    sx={{
                      color: "white",
                    }}
                  />
                </IconButton>
              </Tooltip>
            );
          }}
        />
        {selectedTab === "email-templates" && (
          <ListBase
            filterDefaultValues={emailFilters}
            disableSyncWithLocation
            resource={selectedTab}
          >
            <EmailFilters/>
          </ListBase>
        )}
        {selectedTab === "email-logs" && (
          <ListBase
            filterDefaultValues={emailLogFilters}
            disableSyncWithLocation
            resource={selectedTab}
          >
            <EmailLogFilters/>
            </ListBase>
        )}
        {selectedTab === "scheduled-email-tasks" && (
          <ListBase
            filterDefaultValues={emailTaskFilters}
            disableSyncWithLocation
            resource={selectedTab}
          >
            <EmailTaskFilters/>
          </ListBase>
        )}
      </Paper>
    </Grid>
  );
};

export default EmailManagementFilterSidebar;
