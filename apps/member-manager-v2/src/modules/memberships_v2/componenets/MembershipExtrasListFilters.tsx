import React from "react";
import { Card, CardContent } from "@mui/material";
import {
  FilterLiveSearch,
  Loading,
  useListFilterContext,
} from "react-admin";
import { useMembershipContext } from "../MembershipsContextProvider";

const MembershipExtraListFilters = () => {
  const { setMembershipExtraFilters } = useMembershipContext();
  const { filterValues } = useListFilterContext();

  React.useEffect(() => {
    if (filterValues) setMembershipExtraFilters(filterValues);
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
export default MembershipExtraListFilters;
