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
  disableDeselect: _disableDeselect = false,
}) => {
  // Conference is always radio (BaseFilter); disableDeselect retained for callers.
  return (
    <BaseFilter 
      filterValues={filterValues}
      conferences={conferences}
      selectedTab={selectedTab}
      includeYear={includeYear}
      disableDeselect={true}
      includeSearch={includeSearch}
      multipleConferenceSelection={false}
    />
  );
};

export default DefaultFilter; 