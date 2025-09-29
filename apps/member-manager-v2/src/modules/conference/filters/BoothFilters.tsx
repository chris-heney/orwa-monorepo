import React from "react";
import { FilterList, FilterListItem, useGetList } from "react-admin";
import GroupIcon from "@mui/icons-material/Group";
import BaseFilter from "./BaseFilter";
import { IConference } from "../types";
import IConferenceTicket from "../types/IConferenceTicket";
import { toggleFilter } from "../helpers/selectFilters";
import { isSelected } from "../helpers/selectFilters";

interface AttendeesFilterProps {
  filterValues: any;
  conferences: IConference[];
  selectedTab: string;
}

const BoothFilter: React.FC<AttendeesFilterProps> = ({
  filterValues,
  conferences,
  selectedTab,
}) => {
  // Check if we're in the edit tab where deselection should be disabled
  const disableDeselect = selectedTab === "edit";

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
    
      <FilterList label="Booth Extras" icon={<GroupIcon />}>
        {extras
          ?.filter(
            (extra) =>
              extra.context === "Booth"
          )
          .map((extra) => {
            return (
              <FilterListItem
                key={`extra-${extra.id}`}
                label={`${extra.name}`}
                value={{ "items][item": extra.id }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
              />
            );
          })}
      </FilterList>
    </>
  );
};

export default BoothFilter;
