import React from "react";
import { FilterList, FilterListItem, useGetList } from "react-admin";
import GroupIcon from "@mui/icons-material/Group";
import BaseFilter from "./BaseFilter";
import { IConference } from "../types";
import IConferenceTicket from "../types/IConferenceTicket";
import { isSelected, toggleFilter } from "../helpers/selectFilters";

interface ContestantsFilterProps {
  filterValues: any;
  conferences: IConference[];
  selectedTab: string;
}

const ContestantsFilter: React.FC<ContestantsFilterProps> = ({
  filterValues,
  conferences,
  selectedTab,
}) => {
  // Check if we're in the edit tab where deselection should be disabled
  const disableDeselect = selectedTab === 'edit';

  // Custom toggle function that enforces single selection

  const { data: extras } = useGetList<IConferenceTicket>("conference-extras", {
    filter: filterValues.conference ? {
        conferences: filterValues.conference,
    } : {},
    meta: {
      populate: true,
    },
  });

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
        <FilterList label="Registration Extras" icon={<GroupIcon />}>
          {extras 
            ?.filter((extra) => extra.context === "Registration")
            .map((extra) => {
              const extraId = typeof extra.id === "string"
                ? parseInt(extra.id, 10)
                : extra.id;
              
              return (
                <FilterListItem
                  key={`extra-${extra.id}`}
                  label={extra.name}
                  value={{
                    "items][item": extraId
                  }}
                  isSelected={isSelected}
                  toggleFilter={toggleFilter}
                />
              );
            })}
        </FilterList>
    </>
  );
};

export default ContestantsFilter; 