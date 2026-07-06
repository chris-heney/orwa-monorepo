import React from "react";
import { useMembershipContext } from "../MembershipsContextProvider";
import { ListBase } from "react-admin";
import WaterSystemFilter from "../watersystem/components/WatersystemFilter";
import AssociateListFilterSidebar from "../associate/components/AssociateListFilterSidebar";
import { Grid, IconButton, Paper, Tooltip } from "@mui/material";
import CustomHeader from "../../_components/CustomHeader";
import InvoicesFilters from "./InvoicesFilters";
import { Favorite } from "@mui/icons-material";
import useCurrentUser from "../../_helpers/useCurrentUser";

const MembershipFilters = () => {
  const {
    selectedTab,
    isFilterSidebarOpen,
    isLoading,
    associateFilters,
    watersystemFilters,
    invoicesFilters,
    membershipExtraFilters,
    membershipFilters,
    setSavingQuery,
  } = useMembershipContext();
  const { role } = useCurrentUser();

  return selectedTab === "summary" || !isFilterSidebarOpen || isLoading ? (
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
          Component={role === "Staff" ? undefined : () => {
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
      </Paper>
    </Grid>
  );
};

export default MembershipFilters;
