import React from "react";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import {
  FilterLiveSearch,
  Loading,
  useListFilterContext,
  useStore,
} from "react-admin";
import { SavedFiltersSection } from "../../_components/SavedFiltersSection";

/**
 * RaStore key (legacy, preserved) for the Transactions tab's "Hide marked
 * payments" preference. The manifest folds it into the tab's permanent list
 * filter (`payment_date: { $null: true }`) so the count, grid and export all
 * agree; this body only owns the checkbox.
 */
export const HIDE_MARKED_PAYMENTS_KEY = "invoices-hide-marked-payments";

/** Filters drawer body for the Transactions tab (renders inside the tab's ListScope). */
const InvoicesFilters = () => {
  const { filterValues } = useListFilterContext();
  const [hideMarkedPayments, setHideMarkedPayments] = useStore<boolean>(
    HIDE_MARKED_PAYMENTS_KEY,
    true
  );

  return !filterValues ? (
    <Loading />
  ) : (
    <Box sx={{ p: 2 }}>
      <SavedFiltersSection />
      <FilterLiveSearch />
      <FormControlLabel
        control={
          <Checkbox
            checked={hideMarkedPayments !== false}
            onChange={(event) => setHideMarkedPayments(event.target.checked)}
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
    </Box>
  );
};
export default InvoicesFilters;
