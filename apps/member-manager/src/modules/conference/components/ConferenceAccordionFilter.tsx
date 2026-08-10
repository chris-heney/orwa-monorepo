import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  FormLabel,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect } from "react";
import { useConferenceContext } from "../ConferenceContext";
import { IConference } from "../types";
import { FilterList, FilterListItem, useListFilterContext } from "react-admin";
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";
import { isSelected, toggleFilter } from "../helpers/selectFilters";
import {
  ensureConferenceInFilters,
  getConferenceFilterId,
  getFilterYear,
  getPrimaryConferenceId,
  mergeConferenceYearIntoAllTabs,
} from "../helpers/mergeConferenceAcrossTabFilters";
import { omitYearForListQuery, shouldOmitYearFromListQuery } from "../helpers/listQueryFilters";
import { getFilterRelationValue } from "../../../helpers/strapiIds";

const ConferenceAccordionFilter = ({
  conferenceYears,
}: {
  conferenceYears: number[];
}) => {
  const { selectedTab, resource, tickets, conferences, tabFilters, setTabFilters } =
    useConferenceContext();

  const { filterValues, setFilters } = useListFilterContext();
  const filterConferenceId = getPrimaryConferenceId(filterValues);

  // When tab changes, load the filters for that tab
  useEffect(() => {
    // Get the stored filters for the newly selected tab, or use empty object as default
    let filtersForTab = ensureConferenceInFilters(
      { ...(tabFilters[selectedTab] || {}) },
      selectedTab
    );

    // For tickets/extras/addons tabs, convert conference to conferences array if needed
    const isMultiConferenceTab = ["tickets", "extras", "addons"].includes(selectedTab);
    if (isMultiConferenceTab && filtersForTab.conference && !filtersForTab.conferences) {
      filtersForTab.conferences = [filtersForTab.conference];
      delete filtersForTab.conference;
    } else if (!isMultiConferenceTab && filtersForTab.conferences && !filtersForTab.conference) {
      // Convert conferences array to conference single value for other tabs
      if (Array.isArray(filtersForTab.conferences) && filtersForTab.conferences.length > 0) {
        filtersForTab.conference = filtersForTab.conferences[0];
        delete filtersForTab.conferences;
      }
    }

    // Apply these filters (omit `year` for resources Strapi does not support)
    setFilters(omitYearForListQuery(resource, filtersForTab), filterValues, false);
  }, [selectedTab, resource, setFilters]);

  // Conference radio: restore default if list filters ever lose the selection.
  useEffect(() => {
    if (getPrimaryConferenceId(filterValues) != null) return;
    setFilters(
      omitYearForListQuery(
        resource,
        ensureConferenceInFilters(filterValues, selectedTab)
      ),
      filterValues,
      false
    );
  }, [filterValues, selectedTab, resource, setFilters]);

  useEffect(() => {
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
      getFilterYear(tabFilters[selectedTab] || {}) != null
    ) {
      tabEntry = { ...tabEntry, year: getFilterYear(tabFilters[selectedTab] || {}) };
    }

    tabEntry = ensureConferenceInFilters(tabEntry, selectedTab);

    setTabFilters((prev) =>
      mergeConferenceYearIntoAllTabs(prev, selectedTab, tabEntry)
    );
  }, [filterValues, selectedTab, setTabFilters, resource, tabFilters]);

  // Custom toggle function that enforces single selection for ticket filters
  const singleSelectionToggle = (value: any, filters: any) => {
    // Get the key (should be conference_ticket)
    const key = Object.keys(value)[0];

    // Check if the value is already selected
    const isValueSelected = isSelected(value, filters);

    // If already selected, remove it, otherwise set it as a single value (not array)
    return {
      ...filters,
      [key]: isValueSelected ? undefined : value[key],
    };
  };

  return (
    <Accordion
      disableGutters
      sx={{
        "& root.Mui-expanded": {
          minHeight: 20,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
        aria-controls="panel1a-content"
        sx={{
          backgroundColor: "#262626",
          maxHeight: 20,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            alignItems: "center",
            textAlign: "left",
            color: "white",
            backgroundColor: "#262626",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Filter
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Conference Filter */}
        <Box sx={{ p: 2 }}>
          <FormControl>
            <FormLabel>Conference</FormLabel>
            <FilterList label="" icon={<EventIcon />}>
              {conferences?.map((conference: IConference & { entityId?: number }) => {
                // For tickets/extras/addons tabs, use conferences array format
                const isMultiConferenceTab = ["tickets", "extras", "addons"].includes(selectedTab);
                const conferenceId = getConferenceFilterId(conference);
                if (conferenceId == null) return null;

                return (
                  <FilterListItem
                    key={`conference-${conferenceId}`}
                    label={conference.name}
                    value={
                      isMultiConferenceTab
                        ? { conferences: [conferenceId] }
                        : { conference: conferenceId }
                    }
                    isSelected={(val, filters) => {
                      const current = getPrimaryConferenceId(filters);
                      const id = isMultiConferenceTab
                        ? val?.conferences?.[0]
                        : val?.conference;
                      return (
                        current != null &&
                        id != null &&
                        Number(current) === Number(id)
                      );
                    }}
                    toggleFilter={(val, filters) => {
                      const id = isMultiConferenceTab
                        ? val?.conferences?.[0]
                        : val?.conference;
                      const current = getPrimaryConferenceId(filters);
                      if (
                        id == null ||
                        Number.isNaN(Number(id)) ||
                        (current != null && Number(current) === Number(id))
                      ) {
                        return filters;
                      }
                      if (isMultiConferenceTab) {
                        const { conference, ...rest } = filters;
                        return { ...rest, conferences: [Number(id)] };
                      }
                      const { conferences: _c, ...rest } = filters;
                      return { ...rest, conference: Number(id) };
                    }}
                  />
                );
              })}
            </FilterList>
          </FormControl>
        </Box>

        {/* Year Filter */}
        {!["tickets", "extras", "sponsorships"].includes(selectedTab) && (
          <Box sx={{ p: 2 }}>
            <FormControl>
              <FormLabel>Conference Year</FormLabel>
              <FilterList label="" icon={<CalendarTodayIcon />}>
                {conferenceYears.map((y) => (
                  <FilterListItem
                    key={`year-${y}`}
                    label={y.toString()}
                    value={{ year: y }}
                    isSelected={isSelected}
                    toggleFilter={(val, filters) =>
                      toggleFilter(val, filters, undefined, false)
                    }
                  />
                ))}
              </FilterList>
            </FormControl>
          </Box>
        )}

        {/* Ticket Type Filter for Attendees */}
        {selectedTab === "attendees" && (
          <Box sx={{ p: 2 }}>
            <FormControl>
              <FormLabel>Attendee Type</FormLabel>
              <FilterList label="" icon={<GroupIcon />}>
                {tickets
                  ?.filter((ticket) =>
                    filterConferenceId != null
                      ? (ticket.conferences as IConference[]).some(
                          (c) =>
                            getConferenceFilterId(c) === filterConferenceId
                        ) &&
                        ticket.name !== "Golfer" &&
                        ticket.name !== "Fisher"
                      : true
                  )
                  .map((ticket) => {
                    const ticketId = getFilterRelationValue(ticket);
                    if (ticketId == null) return null;

                    return (
                      <FilterListItem
                        key={`ticket-${ticket.id}`}
                        label={`${ticket.name} ${
                          filterConferenceId == null
                            ? (ticket.conferences[0] as IConference).name
                            : ""
                        }`}
                        value={{ conference_ticket: ticketId }}
                        isSelected={isSelected}
                        toggleFilter={singleSelectionToggle}
                      />
                    );
                  })}
              </FilterList>
            </FormControl>
          </Box>
        )}

        {/* Attendee Options Filter */}
        {selectedTab === "attendees" && (
          <Box sx={{ p: 2 }}>
            <FormControl>
              <FormLabel>Attendee Options</FormLabel>
              <FilterList label="" icon={<GroupIcon />}>
                <FilterListItem
                  label="Speaker"
                  value={{ speaker: true }}
                  isSelected={isSelected}
                  toggleFilter={toggleFilter}
                />
                <FilterListItem
                  label="Promotional Emails"
                  value={{ promotional_emails: true }}
                  isSelected={isSelected}
                  toggleFilter={toggleFilter}
                />
              </FilterList>
            </FormControl>
          </Box>
        )}

        {/* Contestant Type Filter */}
        {selectedTab === "contestants" && filterConferenceId === 3 && (
          <Box sx={{ p: 2 }}>
            <FormControl>
              <FormLabel>Contestant Type</FormLabel>
              <FilterList label="" icon={<GroupIcon />}>
                {tickets
                  ?.filter((ticket) =>
                    filterConferenceId != null
                      ? (ticket.conferences as IConference[]).some(
                          (c) =>
                            getConferenceFilterId(c) === filterConferenceId
                        ) &&
                        (ticket.name === "Golfer" || ticket.name === "Fisher")
                      : true
                  )
                  .map((ticket) => {
                    const ticketId = getFilterRelationValue(ticket);
                    if (ticketId == null) return null;

                    return (
                      <FilterListItem
                        key={`ticket-${ticket.id}`}
                        label={ticket.name}
                        value={{ conference_ticket: ticketId }}
                        isSelected={isSelected}
                        toggleFilter={singleSelectionToggle}
                      />
                    );
                  })}
              </FilterList>
            </FormControl>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ConferenceAccordionFilter;