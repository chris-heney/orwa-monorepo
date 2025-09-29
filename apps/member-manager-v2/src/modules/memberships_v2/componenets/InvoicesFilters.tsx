import React from "react";
import { Card, CardContent } from "@mui/material";
import {
  FilterLiveSearch,
  Loading,
  useListFilterContext,
} from "react-admin";
import { useMembershipContext } from "../MembershipsContextProvider";
import SavedFilters from "../../_components/SavedFilters";

// type TWaterSystem = {
//   region: string;
// };

// type TFilters = {
//   region: string[];
// };

const InvoicesFilters = () => {
  const { setInvoicesFilters, savingQuery, setSavingQuery, selectedTab } = useMembershipContext();
  const { filterValues } = useListFilterContext();

  React.useEffect(() => {
    if (filterValues) setInvoicesFilters(filterValues);
  }, [filterValues]);

  return !filterValues ? <Loading/> : (
    <Card
      component={"div"}
      sx={{
        minWidth: 200,
        maxHeight: "70vh",
        overflow: "auto",
        position: "sticky",
      }}
    >
      <CardContent>
        {/* <SavedQueriesList /> */}
        <SavedFilters
          savingQuery={savingQuery}
          setSavingQuery={setSavingQuery}
          resource={selectedTab}
         />
        <FilterLiveSearch />
      </CardContent>
    </Card>
  );
};
export default InvoicesFilters;
