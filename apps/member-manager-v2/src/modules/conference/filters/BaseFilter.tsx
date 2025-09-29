import React, { useEffect, useState } from "react";
import { FilterList, FilterListItem, FilterLiveSearch, useListFilterContext } from "react-admin";
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { IConference } from "../types";
import { toggleFilter, isSelected } from "../helpers/selectFilters";
import { useConferenceContext } from "../ConferenceContext";

interface BaseFilterProps {
  filterValues?: any; // Make optional since we're not using it directly
  conferences: IConference[];
  selectedTab: string;
  includeSearch?: boolean;
  includeYear?: boolean;
  multipleConferenceSelection?: boolean;
  disableDeselect?: boolean;
  includeSavedQueries?: boolean;  
}

const BaseFilter: React.FC<BaseFilterProps> = ({
  includeSearch = true,
  includeYear = true,
  multipleConferenceSelection = false,
  disableDeselect = false,
}) => {
  // Calculate years for filtering
  const currentYear = new Date().getFullYear();
  const conferenceYears = Array.from(
    { length: currentYear - 2023 + 2 },
    (_, i) => currentYear + 1 - i
  );

  const { selectedTab, conferences } = useConferenceContext();
  const { filterValues } = useListFilterContext();
  
  // Create a search state that will be used as a key to force re-render
  const [searchKey, setSearchKey] = useState(`search-${selectedTab}`);
  
  // Update the search key when the tab changes
  useEffect(() => {
    setSearchKey(`search-${selectedTab}-${Date.now()}`);
  }, [selectedTab]);

  // Helper to normalize IDs to numbers
  const normalizeId = (id: any) => typeof id === 'string' ? parseInt(id, 10) : id;

  // Define a custom toggle function for conference selection that enforces single/multi selection mode
  const conferenceToggleFilter = (val: any, filters: any) => {
    
    // For multi-selection mode
    if (multipleConferenceSelection) {
      return toggleFilter(val, filters, "conferences");
    }
    
    // For single-selection mode
    const conferenceId = typeof val === 'object' ? val.conference : val;
    
    // If we have disabled deselection and the current value matches the selected one, return unchanged filters
    if (disableDeselect && filters.conference === conferenceId) {
      return filters; // Return current filters unchanged to prevent deselection
    }
    
    // If disableDeselect is true and the conference is already selected, don't allow toggling off
    if (disableDeselect && filters.conference !== undefined && conferenceId !== filters.conference) {
      // Only allow switching to a different conference, not deselecting
      return {
        ...filters,
        conference: conferenceId
      };
    }
    
    // Otherwise, toggle the selection (clear if already selected, or set to the new value)
    return {
      ...filters,
      conference: filters.conference === conferenceId ? undefined : conferenceId
    };
  };

  return (
    <>
      {/* Search Filter - Using key to force re-render */}
      {includeSearch && (
        <FilterLiveSearch 
          key={searchKey}
          defaultValue={filterValues?.q || ''} 
          source="q" 
          fullWidth 
        />
      )}

      {/* Conference Filter */}
      <FilterList label="Conference" icon={<EventIcon />}>
        {conferences?.map((conference: any) => {
          const conferenceId = normalizeId(conference.id);
          return (
            <FilterListItem
              key={`conference-${conference.id}`}
              label={conference.name}
              value={multipleConferenceSelection ? conferenceId : { conference: conferenceId }}
              isSelected={disableDeselect ? undefined : (val, filters) => 
                multipleConferenceSelection
                  ? isSelected(val, filters, "conferences")
                  : isSelected({ conference: conferenceId }, filters)
              }
              toggleFilter={conferenceToggleFilter}
            />
          );
        })}
      </FilterList>

      {/* Year Filter */}
      {includeYear && (
        <FilterList label="Year" icon={<CalendarTodayIcon />}>
          {conferenceYears.map((y) => (
            <FilterListItem
              key={`year-${y}`}
              label={y.toString()}
              value={{ year: y }}
            />
          ))}
        </FilterList>
      )}
    </>
  );
};

export default BaseFilter; 