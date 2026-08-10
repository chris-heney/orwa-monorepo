import React from "react";
import { FilterList, FilterListItem } from "react-admin";
import GroupIcon from "@mui/icons-material/Group";
import BaseFilter from "./BaseFilter";
import { IConference } from "../types";
import IConferenceTicket from "../types/IConferenceTicket";
import { isSelected, toggleFilter } from "../helpers/selectFilters";
import {
  getConferenceFilterId,
  getPrimaryConferenceId,
} from "../helpers/mergeConferenceAcrossTabFilters";
import { getFilterRelationValue } from "../../../helpers/strapiIds";

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
  const disableDeselect = selectedTab === "edit";
  const filterConferenceId = getPrimaryConferenceId(filterValues);

  const isContestantTicket = (ticket: IConferenceTicket) =>
    ticket.context === "Contestant" ||
    (!ticket.context &&
      ["Golfer", "Fisher", "Contestant"].includes(ticket.name));

  const contestantTickets = (tickets ?? []).filter(
    (ticket) =>
      isContestantTicket(ticket) &&
      (filterConferenceId == null ||
        (ticket.conferences as IConference[]).some(
          (c) => getConferenceFilterId(c) === filterConferenceId
        ))
  );

  return (
    <>
      <BaseFilter
        filterValues={filterValues}
        conferences={conferences}
        selectedTab={selectedTab}
        multipleConferenceSelection={false}
        disableDeselect={disableDeselect}
      />

      {/* Multi-select Contestant Ticket filter ($in / OR) so e.g. Golfer +
          Golfer - Contestant Only can be selected together. */}
      {contestantTickets.length > 0 && (
        <FilterList label="Contestant Ticket" icon={<GroupIcon />}>
          {contestantTickets.map((ticket) => {
            const ticketId = getFilterRelationValue(ticket);
            if (ticketId == null) return null;

            return (
              <FilterListItem
                key={`ticket-${ticket.id}`}
                label={ticket.name}
                value={{ conference_ticket: ticketId }}
                isSelected={isSelected}
                toggleFilter={(val, filters) =>
                  toggleFilter(val, filters, undefined, disableDeselect)
                }
              />
            );
          })}
        </FilterList>
      )}
    </>
  );
};

export default ContestantsFilter;
