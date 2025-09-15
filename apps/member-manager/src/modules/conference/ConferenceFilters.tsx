import React, { useEffect } from "react";
import { useConferenceContext } from "./ConferenceContext";
import {
  Card,
  CardContent,
  IconButton,
  Tooltip,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { Favorite } from "@mui/icons-material";
import SavedFilters from "../_components/SavedFilters";
import { Loading, useListFilterContext, useListSortContext } from "react-admin";
import CustomHeader from "../_components/CustomHeader";
import {
  AttendeesFilter,
  ContestantsFilter,
  DefaultFilter,
  MultiConferenceFilter,
  SponsorshipFilter,
} from "./filters";
import RegistrationFilter from "./filters/RegistrationFilter";
import BoothFilter from "./filters/BoothFilters";

const ConferenceFilters = () => {
  // Keep conferences from context for UI display
  const {
    isFilterSidebarOpen,
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

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  const { filterValues, setFilters } = useListFilterContext();
  const { sort, setSort } = useListSortContext();

  // When tab changes, load the filters for that tab
  useEffect(() => {
    // Get the stored filters for the newly selected tab, or use empty object as default
    const filtersForTab = tabFilters[selectedTab] || {};

    setFilters(filtersForTab, filterValues, false);
    setSort(tabSorts[selectedTab] || {});
  }, [selectedTab]);

  useEffect(() => {
    // Store the current filter values for the current tab
    setTabFilters((prev) => ({
      ...prev,
      [selectedTab]: filterValues,
    }));
  }, [filterValues]);

  useEffect(() => {
    // Store the current sort values for the current tab
    setTabSorts((prev) => ({
      ...prev,
      [selectedTab]: sort,
    }));
  }, [sort]);

  if (isFilterSidebarOpen || isSmall) return null;

  if (!filterValues) return <Loading />;

  // Get the current filters for the selected tab
  const currentTabFilters = tabFilters[selectedTab] || {};

  // Render the appropriate filter component based on the selected tab
  const renderFilterComponent = () => {
    switch (selectedTab) {
      case "attendees":
        return (
          <AttendeesFilter
            filterValues={currentTabFilters}
            conferences={conferences}
            tickets={tickets}
            selectedTab={selectedTab}
          />
        );
      case "contestants":
        return (
          <ContestantsFilter
            filterValues={currentTabFilters}
            conferences={conferences}
            tickets={tickets}
            selectedTab={selectedTab}
          />
        );
      case "registrations":
        return (
          <RegistrationFilter
            selectedTab={selectedTab}
            filterValues={currentTabFilters}
            conferences={conferences}
          />
        );
      case "booths":
        return (
          <BoothFilter
            filterValues={currentTabFilters}
            conferences={conferences}
            selectedTab={selectedTab}
          />
        );
      case "tickets":
      case "extras":
      case "addons":
        return (
          <MultiConferenceFilter
            filterValues={currentTabFilters}
            conferences={conferences}
            selectedTab={selectedTab}
            includeYear={false}
          />
        );
      case "sponsorships":
        return (
          <SponsorshipFilter
            filterValues={currentTabFilters}
            conferences={conferences}
            includeSearch={true}
          />
        );
      case "edit":
        return (
          <DefaultFilter
            filterValues={currentTabFilters}
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
            filterValues={currentTabFilters}
            conferences={conferences}
            selectedTab={selectedTab}
          />
        );
    }
  };

  return (
    <Card sx={{ pb: 2 }}>
      {/* <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p>{"Sort values: " + (sort ? JSON.stringify(sort) : "none")}</p>
        <p>{"Context values: " + JSON.stringify(filterValues)}</p>
        <p style={{ whiteSpace: "wrap", maxWidth: "100px" }}>
          {"Tab Filters: " + JSON.stringify(tabFilters)}
        </p>
        <p style={{ whiteSpace: "wrap", maxWidth: "100px" }}>
          {"Tab Sorts: " + JSON.stringify(tabSorts)}
        </p>
      </div> */}
      <CustomHeader
        title="Filters"
        Component={() => {
          return (
            <Tooltip title="Save Current Filter">
              <IconButton
                onClick={() => setSavingQuery((prev) => !prev)}
                color="primary"
              >
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

      <CardContent>
        <SavedFilters
          resource={resource}
          savingQuery={savingQuery}
          setSavingQuery={setSavingQuery}
        />

        {renderFilterComponent()}
      </CardContent>
    </Card>
  );
};

export default ConferenceFilters;
