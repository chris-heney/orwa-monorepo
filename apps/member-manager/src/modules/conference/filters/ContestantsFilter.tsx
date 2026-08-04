import React from "react";
import { FilterList, FilterListItem } from "react-admin";
import GroupIcon from "@mui/icons-material/Group";
import BaseFilter from "./BaseFilter";
import { IConference } from "../types";
import IConferenceTicket from "../types/IConferenceTicket";
import { isSelected } from "../helpers/selectFilters";
import {
  getConferenceFilterId,
  getPrimaryConferenceId,
} from "../helpers/mergeConferenceAcrossTabFilters";

interface ContestantsFilterProps {
  filterValues: any;
  conferences: IConference[];
  tickets: IConferenceTicket[];
  selectedTab: string;
}

const ContestantsFilter: React.FC<ContestantsFilterProps> = ({
  filterValues,
  conferences,
  tickets,
  selectedTab,
}) => {
  // Check if we're in the edit tab where deselection should be disabled
  const disableDeselect = selectedTab === 'edit';
  const filterConferenceId = getPrimaryConferenceId(filterValues);

  const isContestantTicket = (ticket: IConferenceTicket) =>
    ticket.context === "Contestant" ||
    (!ticket.context && ["Golfer", "Fisher", "Contestant"].includes(ticket.name));

  const contestantTickets = (tickets ?? []).filter(
    (ticket) =>
      isContestantTicket(ticket) &&
      (filterConferenceId == null ||
        (ticket.conferences as IConference[]).some(
          (c) => getConferenceFilterId(c) === filterConferenceId
        ))
  );

  // Custom toggle function that enforces single selection
  const singleSelectionToggle = (value: any, filters: any) => {
    // Get the key (should be conference_ticket)
    const key = Object.keys(value)[0];
    
    // Check if the value is already selected
    const isValueSelected = isSelected(value, filters);
    
    // If disableDeselect is true and this value is selected, prevent deselection
    if (disableDeselect && isValueSelected) {
      return filters;
    }
    
    // If already selected, remove it, otherwise set it as a single value (not array)
    return {
      ...filters,
      [key]: isValueSelected ? undefined : value[key]
    };
  };

  return (
    <>
      <BaseFilter 
        filterValues={filterValues}
        conferences={conferences}
        selectedTab={selectedTab}
        multipleConferenceSelection={false}
        disableDeselect={disableDeselect}
      />
      
      {/* Contestant Ticket filter — built from the conference's contestant
          tickets (context "Contestant", or legacy Golfer/Fisher rows with no
          context) so new tournaments (e.g. fishing-only) appear without code
          changes. */}
      {contestantTickets.length > 0 && (
        <FilterList label="Contestant Ticket" icon={<GroupIcon />}>
          {contestantTickets
            .map((ticket) => {
              const ticketId = typeof ticket.id === "string"
                ? parseInt(ticket.id, 10)
                : ticket.id;
              
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
      )}
    </>
  );
};

export default ContestantsFilter; 