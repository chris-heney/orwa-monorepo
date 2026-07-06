import React from "react";
import { FilterList, FilterListItem } from "react-admin";
import GroupIcon from "@mui/icons-material/Group";
import BaseFilter from "./BaseFilter";
import { IConference } from "../types";
import IConferenceTicket from "../types/IConferenceTicket";
import { isSelected } from "../helpers/selectFilters";
import { getPrimaryConferenceId } from "../helpers/mergeConferenceAcrossTabFilters";

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
      
      {/* Contestant Type Filter - only for Fall Conference (ID 3) */}
      {filterConferenceId === 3 && (
        <FilterList label="Contestant Type" icon={<GroupIcon />}>
          {tickets
            ?.filter((ticket) =>
              filterConferenceId != null
                ? (ticket.conferences as IConference[]).some(
                    (c) => c.id === filterConferenceId
                  ) &&
                  (ticket.name === "Golfer" || ticket.name === "Fisher")
                : true
            )
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