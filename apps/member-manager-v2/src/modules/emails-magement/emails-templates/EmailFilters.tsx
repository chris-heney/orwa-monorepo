import React from "react";
import { Card, CardContent } from "@mui/material";
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  Loading,
  useListFilterContext,
} from "react-admin";
import MoneyIcon from "@mui/icons-material/AttachMoney";
import { useEmailManagementContext } from "../EmailManagementContextProvider";
import SavedFilters from "../../_components/SavedFilters";


const EmailFilters = () => {
  const { setEmailFilters, savingQuery, setSavingQuery, selectedTab } = useEmailManagementContext();
  const { filterValues } = useListFilterContext();

  React.useEffect(() => {
    if (filterValues) setEmailFilters(filterValues);
  }, [filterValues]);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Subtract one year from one month ago (for "Expires in 30 days" filter)
  const oneYearAgoMinusOneMonth = new Date();
  oneYearAgoMinusOneMonth.setFullYear(
    oneYearAgoMinusOneMonth.getFullYear() - 1
  );
  oneYearAgoMinusOneMonth.setMonth(oneYearAgoMinusOneMonth.getMonth() + 1);

  return !filterValues ? (
    <Loading />
  ) : (
    <Card
      component={"div"}
      sx={{
        minWidth: 200,
        maxHeight: "70vh",
        overflow: "auto",
        position: "sticky",
        borderRadius: 0,
      }}
    >
      <CardContent>
        <SavedFilters
          resource={selectedTab}
          savingQuery={savingQuery}
          setSavingQuery={setSavingQuery}
        />
        <FilterLiveSearch />
        <FilterList label="Module" icon={<MoneyIcon />}>
          <FilterListItem
            label="Memberships"
            value={{ module: "memberships" }}
          />
          <FilterListItem
            label="Grant Management"
            value={{ module: "Grant Management" }}
          />
          <FilterListItem label="Training" value={{ module: "Training" }} />
          <FilterListItem label="Contacts" value={{ module: "Contacts" }} />
          <FilterListItem label="Conference" value={{ module: "Conference" }} />
        </FilterList>
      </CardContent>
    </Card>
  );
};
export default EmailFilters;
