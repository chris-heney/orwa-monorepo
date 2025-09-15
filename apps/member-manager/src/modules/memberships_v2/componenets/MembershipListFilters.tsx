import React from "react";
import { Card, CardContent } from "@mui/material";
import {
  FilterLiveSearch,
  Loading,
  useListFilterContext,
} from "react-admin";
import { useMembershipContext } from "../MembershipsContextProvider";

const MembershipListFilters = () => {
  const { setMembershipFilters } = useMembershipContext();
  const { filterValues } = useListFilterContext();

  React.useEffect(() => {
    if (filterValues) setMembershipFilters(filterValues);
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
        <FilterLiveSearch />
      </CardContent>
    </Card>
  );
};
export default MembershipListFilters;
