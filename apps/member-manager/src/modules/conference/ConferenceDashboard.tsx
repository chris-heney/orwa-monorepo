import React, { useEffect } from "react";
import { Box } from "@mui/material";
import {
  ConfigurableDatagridColumn,
  ListBase,
  Loading,
  RaRecord,
  Title,
  useDataProvider,
  useStore,
} from "react-admin";

import { useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import ConferenceAccordionFilter from "./components/ConferenceAccordionFilter";
import { useConferenceContext } from "./ConferenceContext";
import ConferenceHeader from "./ConferenceHeader";
import ConferenceFilters from "./ConferenceFilters";
import CustomExportFunction from "../../helpers/custom-export-function";
import exportContestants from "./helpers/exportContestants";
import exportSchedule from "./helpers/exportSchedule";
import exportRegistrations from "./helpers/exportRegistrations";
import exportBooths from "./helpers/exportBooths";
import { TabContext } from "@mui/lab";
import {
  ConferenceTabList,
  ConferenceTabPanels,
} from "./components/ConferenceTabs";
import exportSponsors from "./helpers/exportSponsors";
import exportAttendees from "./helpers/exportAttendes";
import {
  getConferenceFilterId,
  getPrimaryConferenceId,
} from "./helpers/mergeConferenceAcrossTabFilters";
import {
  CONTESTANT_STATUS_VIEW_STORE_KEY,
  DEFAULT_CONTESTANT_STATUS_FILTER,
  normalizeFiltersForListQuery,
  preserveContestantStatusFilter,
} from "./helpers/listQueryFilters";
import type { ContestantStatusFilter } from "./helpers/listQueryFilters";

const ConferenceDashboard = () => {
  const {
    selectedTab,
    conferences,
    resource,
    tabFilters,
  } = useConferenceContext();

  const [contestantStatusView] = useStore<ContestantStatusFilter>(
    CONTESTANT_STATUS_VIEW_STORE_KEY,
    DEFAULT_CONTESTANT_STATUS_FILTER
  );

  const conferenceYears: number[] = [];

  for (let year = new Date().getFullYear(); year >= 2022; year--) {
    conferenceYears.push(year);
  }



  const dataProvider = useDataProvider();
  const formattedTitle =
    selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1);

  const preferenceKey = `${resource}.datagrid`;

  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  );

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  );

  const activeConferenceName =
    conferences.find(
      (c) =>
        getConferenceFilterId(c) ===
        getPrimaryConferenceId(tabFilters[selectedTab])
    )?.name || "";

  const exporter = (records: RaRecord[]) => {
    CustomExportFunction(
      records,
      availableColumns,
      columnIds,
      `${activeConferenceName} ${formattedTitle}-${new Date().toLocaleDateString()}`,
      dataProvider
    );
  };

  // Specialized export functions
  const boothExport = (records: RaRecord[]) => {
    exportBooths(
      records,
      availableColumns,
      columnIds,
      `${activeConferenceName} ${formattedTitle}-${new Date().toLocaleDateString()}`,
      dataProvider
    );
  };

  const registrationExport = (records: RaRecord[]) => {
    exportRegistrations(
      records,
      availableColumns,
      columnIds,
      `${activeConferenceName} ${formattedTitle}-${new Date().toLocaleDateString()}`,
      dataProvider
    );
  };

  const scheduleExport = (records: RaRecord[]) => {
    exportSchedule(
      records,
      availableColumns,
      columnIds,
      `${activeConferenceName} ${formattedTitle}-${new Date().toLocaleDateString()}`,
      dataProvider
    );
  };

  const contestantExport = (records: RaRecord[]) =>
    exportContestants(
      records,
      availableColumns,
      columnIds,
      `${activeConferenceName} ${formattedTitle}-${new Date().toLocaleDateString()}`,
      dataProvider
    );

  const sponsorExport = (records: RaRecord[]) => {
    exportSponsors(
      records,
      availableColumns,
      columnIds,
      `${activeConferenceName} ${formattedTitle}-${new Date().toLocaleDateString()}`,
      dataProvider
    );
  };
  // Use the same exporter function for attendees
  const attendeeExport = (records: RaRecord[]) => {
    exportAttendees(
      records,
      availableColumns,
      columnIds,
      `${activeConferenceName} ${formattedTitle}-${new Date().toLocaleDateString()}`,
      dataProvider
    );
  };

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  const listResource =
    resource.length > 0 ? resource : "conference-attendees";
  // Applies resource-specific query defaults, including active contestants.
  // Seeding the persisted contestant view here (rather than correcting it after
  // the list mounts) keeps the chosen view across the store-key changes that a
  // conference or year switch causes, without a second round trip.
  const listFilterDefaults = preserveContestantStatusFilter(
    listResource,
    { status: contestantStatusView },
    normalizeFiltersForListQuery(
      listResource,
      tabFilters[selectedTab],
      selectedTab
    )
  );

  // Determine which exporter to use based on the current resource
  const getCurrentExporter = () => {
    switch (resource) {
      case "conference-attendees":
        return attendeeExport;
      case "conference-booths":
        return boothExport;
      case "conference-registrations":
        return registrationExport;
      case "conference-schedules":
        return scheduleExport;
      case "conference-contestants":
        return contestantExport;
      case "conference-sponsors":
        return sponsorExport;
      default:
        return exporter;
    }
  };

  // Get the component based on the selected tab

  useEffect(() => {
    return () => {
      <Loading />
    };
  }, [selectedTab]);

  return (
    <Box sx={{ mt: 0 }}>
      <Title title="Conference Manager" />

      <ListBase
        // Remount on tab/resource change so tickets' `conferences` filter
        // cannot briefly fire against singular-`conference` resources.
        key={`${selectedTab}:${listResource}`}
        storeKey={`${selectedTab}-${JSON.stringify(tabFilters[selectedTab])}`}
        perPage={100}
        filterDefaultValues={listFilterDefaults}
        resource={listResource}
        disableSyncWithLocation
        exporter={getCurrentExporter()}
      >
        {/* No flex row / `gap` around the filters: the RightDrawer is out of
            flow (fixed paper + DrawerInsetProvider padding), so a gap here only
            produced a permanent 16px right gutter on the content column. */}
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <TabContext value={selectedTab.toString()}>
            <Box sx={{ position: "sticky", top: 0, zIndex: 10, mt: 0 }}>
              {isSmall && (
                <ConferenceAccordionFilter conferenceYears={conferenceYears} />
              )}
              <ConferenceHeader />
              <ConferenceTabList />
            </Box>
            <ConferenceTabPanels />
          </TabContext>
        </Box>

        {!isSmall && <ConferenceFilters />}
      </ListBase>
    </Box>
  );
};

export default ConferenceDashboard;