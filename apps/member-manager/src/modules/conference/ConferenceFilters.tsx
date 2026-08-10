import React, { useEffect, useRef } from "react";
import { useConferenceContext } from "./ConferenceContext";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Favorite } from "@mui/icons-material";
import SavedFilters from "../_components/SavedFilters";
import { Loading, useListFilterContext, useListSortContext } from "react-admin";
import FilterSidebarShell from "../_components/FilterSidebarShell";
import {
  AttendeesFilter,
  ContestantsFilter,
  DefaultFilter,
  MultiConferenceFilter,
  SponsorshipFilter,
} from "./filters";
import RegistrationFilter from "./filters/RegistrationFilter";
import BoothFilter from "./filters/BoothFilters";
import {
  ensureConferenceInFilters,
  getFilterYear,
  mergeConferenceYearIntoAllTabs,
} from "./helpers/mergeConferenceAcrossTabFilters";
import {
  normalizeFiltersForListQuery,
  omitYearForListQuery,
  shouldOmitYearFromListQuery,
} from "./helpers/listQueryFilters";

// Helper function to deep compare objects
const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;

  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((val, idx) => deepEqual(val, obj2[idx]));
  }

  // Handle non-array objects
  if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
};

const ConferenceFilters = () => {
  const {
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    selectedTab,
    setSavingQuery,
    savingQuery,
    tickets,
    conferences,
    tabFilters,
    setTabFilters,
    tabSorts,
    setTabSorts,
    resource,
  } = useConferenceContext();

  const { filterValues, setFilters } = useListFilterContext();
  const { sort, setSort } = useListSortContext();

  // Get current tab's filters and sort
  const contextFilters = tabFilters[selectedTab] || {};
  const contextSort = tabSorts[selectedTab] || {};

  // Use refs to track if we're syncing to prevent circular updates
  const isSyncingFromContext = useRef(false);
  const previousTab = useRef(selectedTab);

  // When tab changes, load the shared filters
  useEffect(() => {
    if (previousTab.current !== selectedTab) {
      isSyncingFromContext.current = true;

      // For tickets/extras/addons tabs, convert conference to conferences array if needed
      const isMultiConferenceTab = ["tickets", "extras", "addons"].includes(
        selectedTab
      );
      let filtersToApply = ensureConferenceInFilters(
        { ...contextFilters },
        selectedTab
      );

      if (
        isMultiConferenceTab &&
        filtersToApply.conference &&
        !filtersToApply.conferences
      ) {
        // Convert conference single value to conferences array
        filtersToApply.conferences = [filtersToApply.conference];
        delete filtersToApply.conference;
      } else if (
        !isMultiConferenceTab &&
        filtersToApply.conferences &&
        !filtersToApply.conference
      ) {
        // Convert conferences array to conference single value for other tabs
        if (
          Array.isArray(filtersToApply.conferences) &&
          filtersToApply.conferences.length > 0
        ) {
          filtersToApply.conference = filtersToApply.conferences[0];
          delete filtersToApply.conferences;
        }
      }

      const listFilters = normalizeFiltersForListQuery(
        resource,
        filtersToApply,
        selectedTab
      );

      // Only update if the values are different
      if (
        !deepEqual(
          listFilters,
          normalizeFiltersForListQuery(resource, filterValues, selectedTab)
        )
      ) {
        setFilters(listFilters, filterValues, false);
      }
      if (!deepEqual(contextSort || {}, sort)) {
        setSort(contextSort || {});
      }
      previousTab.current = selectedTab;
      // Reset flag after a short delay to allow the update to complete
      setTimeout(() => {
        isSyncingFromContext.current = false;
      }, 100);
    }
  }, [
    selectedTab,
    contextFilters,
    contextSort,
    setFilters,
    setSort,
    filterValues,
    sort,
    resource,
  ]);

  useEffect(() => {
    // Only update context if we're not currently syncing from context
    // and the values have actually changed
    if (
      !isSyncingFromContext.current &&
      !deepEqual(
        omitYearForListQuery(resource, filterValues),
        omitYearForListQuery(resource, contextFilters)
      )
    ) {
      // For tickets/extras/addons tabs, keep conferences array format
      // For other tabs, normalize conferences array to conference single value for storage
      const isMultiConferenceTab = ["tickets", "extras", "addons"].includes(
        selectedTab
      );
      const normalizedFilters: Record<string, any> = { ...filterValues };

      let tabEntry: Record<string, any>;
      if (
        !isMultiConferenceTab &&
        normalizedFilters.conferences &&
        Array.isArray(normalizedFilters.conferences) &&
        normalizedFilters.conferences.length > 0
      ) {
        normalizedFilters.conference = normalizedFilters.conferences[0];
        const { conferences, ...rest } = normalizedFilters;
        tabEntry = rest;
      } else if (isMultiConferenceTab && normalizedFilters.conference) {
        const { conference, ...rest } = normalizedFilters;
        tabEntry = rest;
      } else {
        tabEntry = normalizedFilters;
      }

      if (
        shouldOmitYearFromListQuery(resource) &&
        getFilterYear(tabEntry) == null &&
        getFilterYear(contextFilters) != null
      ) {
        tabEntry = { ...tabEntry, year: getFilterYear(contextFilters) };
      }

      tabEntry = ensureConferenceInFilters(tabEntry, selectedTab);

      setTabFilters((prev) =>
        mergeConferenceYearIntoAllTabs(prev, selectedTab, tabEntry)
      );
    }
  }, [filterValues, contextFilters, selectedTab, setTabFilters, resource]);

  useEffect(() => {
    // Only update context if we're not currently syncing from context
    // and the values have actually changed
    if (!isSyncingFromContext.current && !deepEqual(sort, contextSort)) {
      setTabSorts((prev) => ({
        ...prev,
        [selectedTab]: sort,
      }));
    }
  }, [sort, contextSort, selectedTab, setTabSorts]);

  if (!filterValues) return <Loading />;

  // Render the appropriate filter component based on the selected tab
  const renderFilterComponent = () => {
    switch (selectedTab) {
      case "attendees":
        return (
          <AttendeesFilter
            filterValues={filterValues}
            conferences={conferences}
            tickets={tickets}
            selectedTab={selectedTab}
          />
        );
      case "contestants":
        return (
          <ContestantsFilter
            filterValues={filterValues}
            conferences={conferences}
            tickets={tickets}
            selectedTab={selectedTab}
          />
        );
      case "registrations":
        return (
          <RegistrationFilter
            selectedTab={selectedTab}
            filterValues={filterValues}
            conferences={conferences}
          />
        );
      case "booths":
        return (
          <BoothFilter
            filterValues={filterValues}
            conferences={conferences}
            selectedTab={selectedTab}
          />
        );
      case "tickets":
      case "extras":
      case "addons":
        return (
          <MultiConferenceFilter
            filterValues={filterValues}
            conferences={conferences}
            selectedTab={selectedTab}
            includeYear={false}
          />
        );
      case "sponsorships":
        return (
          <SponsorshipFilter
            filterValues={filterValues}
            conferences={conferences}
            includeSearch={true}
          />
        );
      case "edit":
        return (
          <DefaultFilter
            filterValues={filterValues}
            conferences={conferences}
            includeSearch={false}
            selectedTab={selectedTab}
            includeYear={false}
            disableDeselect={true}
          />
        );
      default:
        return (
          <DefaultFilter
            filterValues={filterValues}
            conferences={conferences}
            selectedTab={selectedTab}
          />
        );
    }
  };

  return (
    <FilterSidebarShell
      open={isFilterSidebarOpen}
      onClose={() => setIsFilterSidebarOpen(false)}
      headerActions={
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
      }
    >
      <Box sx={{ p: 2 }}>
        <SavedFilters
          resource={resource}
          savingQuery={savingQuery}
          setSavingQuery={setSavingQuery}
        />

        {renderFilterComponent()}
      </Box>
    </FilterSidebarShell>
  );
};

export default ConferenceFilters;
