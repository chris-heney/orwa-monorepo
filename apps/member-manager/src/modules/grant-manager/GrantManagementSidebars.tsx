import {
  Box,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import React, { useEffect } from "react";
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
      {/* Filters live in a collapsible right-hand drawer so the content
          area keeps its full width. */}
      <Drawer
        anchor="right"
        variant="persistent"
        open={isFilterSidebarOpen && !isSmall}
        sx={{
          "& .MuiDrawer-paper": {
            width: 320,
            top: 48,
            height: "calc(100% - 48px)",
            borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: "-8px 0 24px rgba(0,0,0,0.18)",
            backgroundImage: "none",
          },
        }}
      >
        {/* Black heading bar matches the app-bar motif in both modes. */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
            bgcolor: "common.black",
            color: "common.white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TuneRoundedIcon fontSize="small" />
            <Typography sx={{ fontWeight: 600 }}>Filters</Typography>
          </Box>
          <Tooltip title="Collapse filters">
            <IconButton
              size="small"
              sx={{ color: "common.white" }}
              onClick={() => setIsFilterSidebarOpen(false)}
              aria-label="Collapse filters"
            >
              <KeyboardDoubleArrowRightRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ overflowY: "auto" }}>
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
        </Box>
      </Drawer>

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
