import React from "react";
import { Card, CardContent, Checkbox, FormControlLabel } from "@mui/material";
import {
  FilterLiveSearch,
  Loading,
  useListFilterContext,
} from "react-admin";
import { useMembershipContext } from "../MembershipsContextProvider";
import SavedFilters from "../../_components/SavedFilters";

const InvoicesFilters = () => {
  const {
    setInvoicesFilters,
    savingQuery,
    setSavingQuery,
    selectedTab,
    hideMarkedPayments,
    setHideMarkedPayments,
  } = useMembershipContext();
  const { filterValues } = useListFilterContext();

  React.useEffect(() => {
    if (filterValues) setInvoicesFilters(filterValues);
  }, [filterValues]);

  return !filterValues ? (
    <Loading />
  ) : (
    <Card
      component={"div"}
      sx={{
        minWidth: 200,
        maxHeight: "70vh",
        overflow: "auto",
        position: "sticky",
      }}
    >
      <CardContent>
        <SavedFilters
          savingQuery={savingQuery}
          setSavingQuery={setSavingQuery}
          resource={selectedTab}
        />
        <FilterLiveSearch />
        {selectedTab === "invoices" && (
          <FormControlLabel
            control={
              <Checkbox
                checked={hideMarkedPayments}
                onChange={(event) =>
                  setHideMarkedPayments(event.target.checked)
                }
              />
            }
            label="Hide marked payments"
            sx={{
              mt: 1.5,
              mx: 0,
              width: "100%",
              cursor: "pointer",
              borderRadius: 1,
              px: 1,
              py: 0.5,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};
export default InvoicesFilters;
