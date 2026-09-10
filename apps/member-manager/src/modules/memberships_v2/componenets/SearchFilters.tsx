import React from "react";
import { Box } from "@mui/material";
import { FilterLiveSearch, Loading, useListFilterContext } from "react-admin";
import { SavedFiltersSection } from "../../_components/SavedFiltersSection";

/**
 * Minimal Filters drawer body (saved queries + live search) for the
 * Memberships and Membership Items tabs — renders inside the tab's ListScope.
 */
const SearchFilters = () => {
  const { filterValues } = useListFilterContext();
  return !filterValues ? (
    <Loading />
  ) : (
    <Box sx={{ p: 2 }}>
      <SavedFiltersSection />
      <FilterLiveSearch />
    </Box>
  );
};

export default SearchFilters;
