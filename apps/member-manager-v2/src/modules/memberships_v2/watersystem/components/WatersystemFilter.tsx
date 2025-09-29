import React from "react";
import { Card, CardContent } from "@mui/material";
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  Loading,
  useListFilterContext,
} from "react-admin";
// import { SavedQueriesList } from '../../../_components/CustomSavedQueryList'
import BadgeIcon from "@mui/icons-material/Badge";
import MoneyIcon from "@mui/icons-material/AttachMoney";
import ShieldIcon from "@mui/icons-material/GppGood";
import RegionIcon from "@mui/icons-material/SouthAmerica";
import WorkmansCompIcon from "@mui/icons-material/MedicalInformation";
import { useMembershipContext } from "../../../memberships_v2/MembershipsContextProvider";
import { formatDate } from "../../../memberships_v2/helpers/activeOrInactiveMembership";
import DateRangeFilter from "./DateRangeFilter";
import { DateRangeIcon } from "@mui/x-date-pickers";
import SavedFilters from "../../../_components/SavedFilters";
import { isSelected, toggleFilter } from "../../../conference/helpers/selectFilters";

const WaterSystemFilter = () => {
  const {
    setWatersystemFilters,
    selectedTab,
    savingQuery,
    setSavingQuery,
  } = useMembershipContext();
  const { filterValues } = useListFilterContext();

  React.useEffect(() => {
    if (filterValues)
      setWatersystemFilters({  ...filterValues });
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
      }}
    >
      <CardContent>
        <SavedFilters
          resource={selectedTab}
          savingQuery={savingQuery}
          setSavingQuery={setSavingQuery}
        />
        <FilterLiveSearch />
        <FilterList label="Date" icon={<DateRangeIcon />}>
          <DateRangeFilter
            fields={[
              "payment_last_date",
              "application_date",
              "directory_sent_date",
              "payment_previous_date",
            ]}
          />
        </FilterList>
        <FilterList label="Member Status" icon={<BadgeIcon />}>
          <FilterListItem
            label="Member"
            value={{
              payment_last_date: {
                $gt: formatDate(oneYearAgo),
              },
            }}
          />
          <FilterListItem
            label="Non Member"
            value={{
              $or: [
                { payment_last_date: { $lt: formatDate(oneYearAgo) } },
                { payment_last_date: { $null: true } },
              ],
            }}
          />
          <FilterListItem
            label="Expiring in 1 month"
            value={{
              payment_last_date: {
                $between: [
                  formatDate(oneYearAgo),
                  formatDate(oneYearAgoMinusOneMonth),
                ],
              },
            }}
          />
        </FilterList>
        <FilterList label="RD Funded" icon={<MoneyIcon />}>
          <FilterListItem label="Yes" value={{ funding: true }} />
          <FilterListItem label="No" value={{ funding: false }} />
        </FilterList>
        <FilterList label="ORWAAG Member" icon={<ShieldIcon />}>
          <FilterListItem label="Yes" value={{ orwaag: true }} />
          <FilterListItem label="No" value={{ orwaag: false }} />
        </FilterList>
        <FilterList label="Workman's Comp" icon={<WorkmansCompIcon />}>
          <FilterListItem label="Yes" value={{ workmans_comp: true }} />
          <FilterListItem label="No" value={{ workmans_comp: false }} />
        </FilterList>
        <FilterList label="Region" icon={<RegionIcon />}>
          <FilterListItem
            label="Region 1"
            value={{ region: "Region 1" }}
            isSelected={isSelected}
            toggleFilter={toggleFilter}
          />
          <FilterListItem
            label="Region 2"
            value={{ region: "Region 2" }}
            isSelected={isSelected}
            toggleFilter={toggleFilter}
          />
          <FilterListItem
            label="Region 3"
            value={{ region: "Region 3" }}
            isSelected={isSelected}
            toggleFilter={toggleFilter}
          />
          <FilterListItem
            label="Region 4"
            value={{ region: "Region 4" }}
            isSelected={isSelected}
            toggleFilter={toggleFilter}
          />
        </FilterList>
      </CardContent>
    </Card>
  );
};
export default WaterSystemFilter;
