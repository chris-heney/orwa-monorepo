import React from "react";
import BaseFilter from "./BaseFilter";
import { IConference } from "../types";

interface DefaultFilterProps {
  filterValues: any;
  conferences: IConference[];
  selectedTab: string;
  includeYear?: boolean;
  disableDeselect?: boolean;
  includeSearch?: boolean;
  includeSavedQueries?: boolean;
}

const DefaultFilter: React.FC<DefaultFilterProps> = ({
  filterValues,
  conferences,
  selectedTab,
  includeSearch = true,
  includeYear = true,
  disableDeselect = false
}) => {
  // If we're in the edit tab, force disableDeselect to be true
  const shouldDisableDeselect = selectedTab === 'edit' || disableDeselect;
  
  return (
    <BaseFilter 
      filterValues={filterValues}
      conferences={conferences}
      selectedTab={selectedTab}
      includeYear={includeYear}
      disableDeselect={shouldDisableDeselect}
      includeSearch={includeSearch}
      multipleConferenceSelection={false}
    />
  );
};

export default DefaultFilter; 