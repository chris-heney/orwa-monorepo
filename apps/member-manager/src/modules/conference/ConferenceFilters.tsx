import React from "react";
import { Box } from "@mui/material";
import { Loading, useListFilterContext } from "react-admin";
import { SavedFiltersSection } from "../_components/SavedFiltersSection";
import { useConferenceContext } from "./ConferenceContext";
import {
  AttendeesFilter,
  ContestantsFilter,
  DefaultFilter,
  MultiConferenceFilter,
  SponsorshipFilter,
} from "./filters";
import RegistrationFilter from "./filters/RegistrationFilter";
import BoothFilter from "./filters/BoothFilters";

/** Tabs whose "list" only carries the conference / year scope (see manifest). */
export const SCOPE_ONLY_TABS = new Set<string>(["summary", "tools", "edit"]);

/**
 * Filters drawer body for every Conference Manager tab (renders inside the
 * tab's `ListScope`). Which filter set shows depends on the active tab; the
 * conference / year radios write the list filter, and `ConferenceListSync`
 * carries that selection to the other tabs. Saved queries come from the
 * shared `SavedFiltersSection` (+ `SaveQueryHeaderAction` in the header).
 */
const ConferenceFilters = () => {
  const { selectedTab, tickets, conferences } = useConferenceContext();
  const { filterValues } = useListFilterContext();

  if (!filterValues) return <Loading />;

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
      case "summary":
      case "tools":
        // Conference / year scope only — these tabs have no searchable list.
        return (
          <DefaultFilter
            filterValues={filterValues}
            conferences={conferences}
            includeSearch={false}
            selectedTab={selectedTab}
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

  // Summary / Tools / Edit only scope the conference; they have no list of
  // their own to save queries for.
  const hasSavedQueries = !SCOPE_ONLY_TABS.has(selectedTab);

  return (
    <Box sx={{ p: 2 }}>
      {hasSavedQueries ? <SavedFiltersSection /> : null}
      {renderFilterComponent()}
    </Box>
  );
};

export default ConferenceFilters;
