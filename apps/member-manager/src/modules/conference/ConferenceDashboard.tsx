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
import { ConferenceContext, useConferenceContext } from "./ConferenceContext";
import ConferenceHeader from "./ConferenceHeader";
import ConferenceFilters from "./ConferenceFilters";
import CustomExportFunction from "../../helpers/custom-export-function";
import exportContestants from "./helpers/exportContestants";
import exportSchedule from "./helpers/exportSchedule";
import exportRegistrations from "./helpers/exportRegistrations";
import exportBooths from "./helpers/exportBooths";
import ConferenceTabs from "./components/ConferenceTabs";
import exportSponsors from "./helpers/exportSponsors";
import exportAttendees from "./helpers/exportAttendes";
import {
  ensureConferenceInFilters,
  getConferenceFilterId,
  getPrimaryConferenceId,
} from "./helpers/mergeConferenceAcrossTabFilters";
import { omitYearForListQuery } from "./helpers/listQueryFilters";

const ConferenceDashboard = () => {
  const {
    selectedTab,
    conferences,
    resource,
    isFilterSidebarOpen,
    tabFilters,
  } = useConferenceContext();

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
      `${activeConferenceName} ${formattedTitle}-${new Date().toLocaleDateString()}`
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
  const listFilterDefaults = omitYearForListQuery(
    listResource,
    ensureConferenceInFilters(tabFilters[selectedTab], selectedTab)
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
    <Box sx={{ mt: 2 }}>
      <Title title="Conference Manager" />

      <Box
        sx={{
          display: isSmall ? "flex-column" : "flex",
          flexGrow: 1,
          justifyContent: "start",
          alignItems: "",
          gap: 2,
          overflow: "scroll",
        }}
      >
        <ListBase
          storeKey={`${selectedTab}-${JSON.stringify(tabFilters[selectedTab])}`}
          perPage={100}
          filterDefaultValues={listFilterDefaults}
          resource={listResource}
          disableSyncWithLocation
          exporter={getCurrentExporter()}
        >
          {/* MAIN */}

          <Box
            sx={{
              pb: 2,
              overflow: "hidden",
              flexGrow: "1",
              backgroundColor: "transparent",
              maxWidth: isSmall || isFilterSidebarOpen ? "95vw" : "80vw",
            }}
          >
            {/* Header */}

            {isSmall && (
              <ConferenceAccordionFilter conferenceYears={conferenceYears} />
            )}

            <ConferenceHeader />

            <ConferenceTabs />
          </Box>


          {/* ASIDE MOBILE Flex-Column DESKTOP FLEX-ROW make select buttons a dropdown */}
          {!isSmall && (
            <ConferenceFilters />
          )}
        </ListBase>
      </Box>
    </Box>
  );
};

export default ConferenceDashboard;