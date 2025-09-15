import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Theme,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect } from "react";
import CustomHeader from "../_components/CustomHeader";
import { ListContextProvider, ListControllerResult } from "react-admin";
import SummaryRangeSelection from "./_components/SummaryRangeSelect";
import LegendToggleFilter from "./_components/LegendToggleFilter";
import PayoutStatusFilter from "./_components/PayoutStatusFilter";
import ActivityFeed from "../activity/ActivityFeed";
import { useGrantContext } from "./GrantContextProvider";
import SelectFiscalYearRange from "./_components/SelectFiscalYearRange";

const GrantManagementSidebars = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  const {
    isFilterSidebarOpen,
    isActivitySidebarOpen,
    selectedTab,
    grantIndex,
    setGrantIndex,
    grants,
    isSettingsOpen,
    setIsFilterSidebarOpen,
    setIsEmailSidebarOpen,
    setIsActivitySidebarOpen,
    setIsSettingsOpen,
  } = useGrantContext();

  useEffect(() => {
    if (isSettingsOpen) {
      setIsFilterSidebarOpen(false);
      setIsEmailSidebarOpen(false);
      setIsActivitySidebarOpen(false);
    }
  }, [isSettingsOpen]);

  ////based on active sidebar set the rest to false so two sidebars are not open at the same time

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
      {isFilterSidebarOpen && !isSmall && (
        <Box
          sx={{
            flexGrow: 1,
            position: "relative",
            maxWidth: 300,
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
            <CustomHeader title="Filter" />
            <Box sx={{ p: 2 }}>
              <FormControl>
                <FormLabel>Grants</FormLabel>
                <ListContextProvider
                  value={
                    { resource: "grant-applications" } as ListControllerResult
                  }
                >
                  <RadioGroup
                    value={grantIndex}
                    onChange={(e) => setGrantIndex(parseInt(e.target.value))}
                  >
                    {grants?.map((grant, i) => {
                      return (
                        <FormControlLabel
                          key={`conference-${i}`}
                          sx={{ whiteSpace: "nowrap" }}
                          value={i}
                          control={<Radio checked={i === grantIndex} />}
                          label={grant.name}
                        />
                      );
                    })}
                  </RadioGroup>
                </ListContextProvider>
              </FormControl>
            </Box>
            {/* Date Ranges for the Summary */}
            {selectedTab === "summary" && <SummaryRangeSelection />}
            {selectedTab === "applications" && <LegendToggleFilter />}
            {(selectedTab === "payouts" || selectedTab === "Admin Payouts") && <PayoutStatusFilter />}
            {( selectedTab === "Admin Payouts" || selectedTab === "payouts" || selectedTab === "summary") && <SelectFiscalYearRange />}
          </Paper>
        </Box>
      )}

      {/* Email Sidebar */}

      {isActivitySidebarOpen && (
        <ActivityFeed
          title=" "
          entity="grant"
          sx={{
            maxWidth: 350,
            height: 500,
            mt: 3,
            ml: 2,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
          listSx={{ maxHeight: "100vh" }}
        />
      )}
    </>
  );
};

export default GrantManagementSidebars;
