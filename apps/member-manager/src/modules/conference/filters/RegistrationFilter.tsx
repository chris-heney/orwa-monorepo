import React from "react";
import { FilterList, FilterListItem, useGetList } from "react-admin";
import GroupIcon from "@mui/icons-material/Group";
import BaseFilter from "./BaseFilter";
import { IConference } from "../types";
import IConferenceTicket from "../types/IConferenceTicket";
import { isSelected, toggleFilter } from "../helpers/selectFilters";
import { getPrimaryConferenceId } from "../helpers/mergeConferenceAcrossTabFilters";

interface RegistrationFilterProps {
  filterValues: any;
  conferences: IConference[];
  selectedTab: string;
}

const RegistrationFilter: React.FC<RegistrationFilterProps> = ({
  filterValues,
  conferences,
  selectedTab,
}) => {
  // Check if we're in the edit tab where deselection should be disabled
  const disableDeselect = selectedTab === 'edit';

  const filterConferenceId = getPrimaryConferenceId(filterValues);

  const { data: extras } = useGetList<IConferenceTicket>("conference-extras", {
    filter: filterConferenceId != null ? { conferences: [filterConferenceId] } : {},
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
      
      <FilterList label="Registration Type" icon={<GroupIcon />}>
        {["Attendee", "Vendor", "Contestant"].map((type) => (
          <FilterListItem
            key={`type-${type}`}
            label={type}
            value={{ type }}
            isSelected={isSelected}
            toggleFilter={toggleFilter}
          />
        ))}
      </FilterList>

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

export default RegistrationFilter; 