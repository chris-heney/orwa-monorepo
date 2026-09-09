import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useEffect } from "react";
import { ListContextProvider, ListControllerResult } from "react-admin";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import SummaryRangeSelection from "./_components/SummaryRangeSelect";
import LegendToggleFilter from "./_components/LegendToggleFilter";
import PayoutStatusFilter from "./_components/PayoutStatusFilter";
import ActivityFeed from "../activity/ActivityFeed";
import { useGrantContext } from "./GrantContextProvider";
import SelectFiscalYearRange from "./_components/SelectFiscalYearRange";
import { getRelationFilterId } from "./helpers/getRelationFilterId";
import FilterSidebarShell from "../_components/FilterSidebarShell";
import { RightDrawer, listDrawerContext } from "../_components/drawer";

const GrantManagementSidebars = () => {
  const {
    isFilterSidebarOpen,
    isActivitySidebarOpen,
    selectedTab,
    grantIndex,
    setGrantIndex,
    setGrantId,
    setGrantFilterId,
    grantFilterId,
    grants,
    resource,
    isSettingsOpen,
    setIsFilterSidebarOpen,
    setIsEmailSidebarOpen,
    setIsActivitySidebarOpen,
    setIsSettingsOpen,
  } = useGrantContext();

  // What the Filters drawer is about: the current tab's list, scoped to the
  // selected grant (the full per-tab filter lives in GrantDashboardHeader).
  const filterDrawerContext = listDrawerContext({
    resource: resource ?? "grant-application-finals",
    filter: grantFilterId != null ? { grant: grantFilterId } : undefined,
  });

  const selectGrant = (index: number) => {
    const grant = grants?.[index];
    setGrantIndex(index);
    if (grant?.id != null) setGrantId(grant.id);
    const filterId = getRelationFilterId(grant);
    if (filterId != null) setGrantFilterId(filterId);
  };

  useEffect(() => {
    if (isSettingsOpen) {
      setIsFilterSidebarOpen(false);
      setIsEmailSidebarOpen(false);
      setIsActivitySidebarOpen(false);
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
        context={filterDrawerContext}
      >
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
                onChange={(e) => selectGrant(parseInt(e.target.value, 10))}
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
        {selectedTab === "summary" && <SummaryRangeSelection />}
        {selectedTab === "applications" && <LegendToggleFilter />}
        {(selectedTab === "payouts" || selectedTab === "Admin Payouts") && (
          <PayoutStatusFilter />
        )}
        {(selectedTab === "Admin Payouts" ||
          selectedTab === "payouts" ||
          selectedTab === "summary" ||
          selectedTab === "applications" ||
          selectedTab === "application scores") && <SelectFiscalYearRange />}
      </FilterSidebarShell>

      <RightDrawer
        open={isActivitySidebarOpen}
        onClose={() => setIsActivitySidebarOpen(false)}
        title="Activity Feed"
        icon={<MarkunreadMailboxIcon fontSize="small" />}
        context={listDrawerContext({ resource: "grants" })}
      >
        <ActivityFeed entity="grant" title=" " frame="plain" />
      </RightDrawer>
    </>
  );
};

export default GrantManagementSidebars;
