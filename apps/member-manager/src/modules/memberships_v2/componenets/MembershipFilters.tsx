import React from "react";
import { useMembershipContext } from "../MembershipsContextProvider";
import { ListBase } from "react-admin";
import WaterSystemFilter from "../watersystem/components/WatersystemFilter";
import AssociateListFilterSidebar from "../associate/components/AssociateListFilterSidebar";
import { Box } from "@mui/material";
import InvoicesFilters from "./InvoicesFilters";
import { Favorite } from "@mui/icons-material";
import FilterSidebarShell from "../../_components/FilterSidebarShell";
import { listDrawerContext } from "../../_components/drawer";
import HeadingAction from "../../_components/heading/HeadingAction";
import { useCan } from "../../rbac-manager/useCan";

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
  const { can } = useCan();

  if (selectedTab === "summary" || isLoading) {
    return null;
  }

  const activeFilter =
    selectedTab === "watersystems"
      ? watersystemFilters
      : selectedTab === "associates"
      ? associateFilters
      : selectedTab === "invoices"
      ? invoicesFilters
      : selectedTab === "memberships"
      ? membershipFilters
      : selectedTab === "membership-items"
      ? membershipExtraFilters
      : undefined;

  return (
    <FilterSidebarShell
      open={isFilterSidebarOpen}
      onClose={() => setIsFilterSidebarOpen(false)}
      context={listDrawerContext({
        resource: selectedTab,
        filter: activeFilter ?? undefined,
      })}
      headerActions={
        !can("create", "saved-query") ? undefined : (
          <HeadingAction
            icon={<Favorite fontSize="small" />}
            label="Save Current Filter"
            onClick={() => setSavingQuery((prev) => !prev)}
          />
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
