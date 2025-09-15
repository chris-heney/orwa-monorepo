import React from "react";
import BaseFilter from "./BaseFilter";
import { IConference } from "../types";

interface MultiConferenceFilterProps {
  filterValues: any;
  conferences: IConference[];
  selectedTab: string;
  includeYear?: boolean;
}

const MultiConferenceFilter: React.FC<MultiConferenceFilterProps> = ({
  filterValues,
  conferences,
  selectedTab,
  includeYear = false,
}) => {
  return (
    <BaseFilter 
      filterValues={filterValues}
      conferences={conferences}
      selectedTab={selectedTab}
      includeYear={includeYear}
      multipleConferenceSelection={true}
    />
  );
};

export default MultiConferenceFilter; 