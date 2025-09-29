import React from "react";
import { FilterList, FilterListItem, FilterLiveSearch } from "react-admin";
import EventIcon from "@mui/icons-material/Event";
import { IConference } from "../types";

interface SponsorshipFilterProps {
  filterValues: any;
  conferences: IConference[];
  includeSearch?: boolean;
}

const SponsorshipFilter: React.FC<SponsorshipFilterProps> = ({
  filterValues,
  conferences,
  includeSearch = true,
}) => {
  // Helper to normalize IDs to numbers
  const normalizeId = (id: any) => typeof id === 'string' ? parseInt(id, 10) : id;

  return (
    <>
      {/* Search Filter */}
      {includeSearch && <FilterLiveSearch fullWidth />}

      {/* Conference Filter - using source_conference for sponsorships */}
      <FilterList label="Conference" icon={<EventIcon />}>
        {conferences?.map((conference: any) => {
          const conferenceId = normalizeId(conference.id);
          return (
            <FilterListItem
              key={`conference-${conference.id}`}
              label={conference.name}
              value={{
                ...filterValues,
                conference: filterValues.conference === conferenceId ? undefined : conferenceId
              }}
            />
          );
        })}
      </FilterList>
    </>
  );
};

export default SponsorshipFilter; 