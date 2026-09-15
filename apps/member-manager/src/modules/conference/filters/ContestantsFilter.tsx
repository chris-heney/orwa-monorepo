import React from "react";
import { FilterList, FilterListItem, useStore } from "react-admin";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BaseFilter from "./BaseFilter";
import { IConference } from "../types";
import IConferenceTicket from "../types/IConferenceTicket";
import { isSelected, toggleFilter } from "../helpers/selectFilters";
import {
  getConferenceFilterId,
  getPrimaryConferenceId,
} from "../helpers/mergeConferenceAcrossTabFilters";
import { getFilterRelationValue } from "../../../helpers/strapiIds";
import {
  applyContestantStatusFilter,
  contestantStatusFromFilters,
  CONTESTANT_STATUS_VIEW_STORE_KEY,
  DEFAULT_CONTESTANT_STATUS_FILTER,
} from "../helpers/listQueryFilters";
import type { ContestantStatusFilter } from "../helpers/listQueryFilters";

const CONTESTANT_STATUS_CHOICES: {
  value: ContestantStatusFilter;
  label: string;
}[] = [
  { value: "active", label: "Active" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All" },
];

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

  // The list store is keyed on the current tab filters, so it is rebuilt
  // whenever the conference or year changes. Persisting the view separately
  // keeps the operator's choice through those remounts.
  const [, setStoredStatus] = useStore<ContestantStatusFilter>(
    CONTESTANT_STATUS_VIEW_STORE_KEY,
    DEFAULT_CONTESTANT_STATUS_FILTER
  );

  /** Radio: the list always shows one view, so re-click / X is a no-op. */
  const statusIsSelected = (val: any, filters: any) =>
    contestantStatusFromFilters(filters) === val?.status;

  const statusToggleFilter = (val: any, filters: any) => {
    const next = val?.status as ContestantStatusFilter | undefined;
    if (!next || contestantStatusFromFilters(filters) === next) return filters;

    setStoredStatus(next);
    return applyContestantStatusFilter(filters, next);
  };

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

      {/* Active / Cancelled / All is a list filter like Conference and
          Ticket, so it lives in the drawer alongside them rather than as a
          separate control above the table. */}
      <FilterList label="Status" icon={<CheckCircleOutlineIcon />}>
        {CONTESTANT_STATUS_CHOICES.map(({ value, label }) => (
          <FilterListItem
            key={`contestant-status-${value}`}
            label={label}
            value={{ status: value }}
            isSelected={statusIsSelected}
            toggleFilter={statusToggleFilter}
          />
        ))}
      </FilterList>

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
