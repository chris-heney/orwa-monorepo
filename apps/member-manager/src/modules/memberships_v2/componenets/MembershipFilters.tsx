import React from "react";
import { useMembershipContext } from "../MembershipsContextProvider";
import { ListBase } from "react-admin";
import WaterSystemFilter from "../watersystem/components/WatersystemFilter";
import AssociateListFilterSidebar from "../associate/components/AssociateListFilterSidebar";
import { Box, IconButton, Tooltip } from "@mui/material";
import InvoicesFilters from "./InvoicesFilters";
import { Favorite } from "@mui/icons-material";
import useCurrentUser from "../../_helpers/useCurrentUser";
import FilterSidebarShell from "../../_components/FilterSidebarShell";

const MembershipFilters = () => {
  const {
    selectedTab,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    isLoading,
    associateFilters,
    watersystemFilters,
    invoicesFilters,
    membershipExtraFilters,
    membershipFilters,
    setSavingQuery,
  } = useMembershipContext();
  const { role } = useCurrentUser();

  if (selectedTab === "summary" || isLoading) {
    return null;
  }

  return (
    <FilterSidebarShell
      open={isFilterSidebarOpen}
      onClose={() => setIsFilterSidebarOpen(false)}
      headerActions={
        role === "Staff" ? undefined : (
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
        )
      }
    >
      <Box sx={{ p: 2 }}>
        {selectedTab === "watersystems" && (
          <ListBase
            filterDefaultValues={watersystemFilters ?? null}
            disableSyncWithLocation
            resource={"watersystems"}
          >
            <WaterSystemFilter />
          </ListBase>
        )}
        {selectedTab === "associates" && (
          <ListBase
            filterDefaultValues={associateFilters ?? null}
            disableSyncWithLocation
            resource={"associates"}
          >
            <AssociateListFilterSidebar />
          </ListBase>
        )}
        {selectedTab === "invoices" && (
          <ListBase
            filterDefaultValues={invoicesFilters ?? null}
            disableSyncWithLocation
            resource={"invoices"}
          >
            <InvoicesFilters />
          </ListBase>
        )}
        {selectedTab === "memberships" && (
          <ListBase
            filterDefaultValues={membershipFilters ?? null}
            disableSyncWithLocation
            resource={"memberships"}
          >
            <InvoicesFilters />
          </ListBase>
        )}
        {selectedTab === "membership-items" && (
          <ListBase
            filterDefaultValues={membershipExtraFilters ?? null}
            disableSyncWithLocation
            resource={"membership-items"}
          >
            <InvoicesFilters />
          </ListBase>
        )}
      </Box>
    </FilterSidebarShell>
  );
};

export default MembershipFilters;
