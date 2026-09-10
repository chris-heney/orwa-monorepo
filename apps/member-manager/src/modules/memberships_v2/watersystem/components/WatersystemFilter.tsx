import React from "react";
import { Box } from "@mui/material";
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  Loading,
  useListFilterContext,
} from "react-admin";
import BadgeIcon from "@mui/icons-material/Badge";
import MoneyIcon from "@mui/icons-material/AttachMoney";
import ShieldIcon from "@mui/icons-material/GppGood";
import RegionIcon from "@mui/icons-material/SouthAmerica";
import WorkmansCompIcon from "@mui/icons-material/MedicalInformation";
import {
  formatDate,
  getRollingOneYearAgoForFilters,
} from "../../helpers/activeOrInactiveMembership";
import DateRangeFilter from "./DateRangeFilter";
import { DateRangeIcon } from "@mui/x-date-pickers";
import { SavedFiltersSection } from "../../../_components/SavedFiltersSection";
import { isSelected, toggleFilter } from "../../../conference/helpers/selectFilters";

/** Filters drawer body for the Water Systems tab (renders inside the tab's ListScope). */
const WaterSystemFilter = () => {
  const { filterValues } = useListFilterContext();

  const rollingOneYearAgo = new Date();
  rollingOneYearAgo.setFullYear(rollingOneYearAgo.getFullYear() - 1);
  const oneYearAgoPlusOneMonth = new Date(rollingOneYearAgo);
  oneYearAgoPlusOneMonth.setMonth(oneYearAgoPlusOneMonth.getMonth() + 1);

  return !filterValues ? (
    <Loading />
  ) : (
    <Box sx={{ p: 2 }}>
        <SavedFiltersSection />
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
        {/* Align with list: active ≈ last payment within the past year + not null (simple model; overlap edge cases may still differ). */}
        <FilterList label="Member Status" icon={<BadgeIcon />}>
          <FilterListItem
            label="Member"
            value={{
              $and: [
                { payment_last_date: { $notNull: true } },
                {
                  payment_last_date: {
                    $gte: getRollingOneYearAgoForFilters(),
                  },
                },
              ],
            }}
          />
          <FilterListItem
            label="Non Member"
            value={{
              $or: [
                {
                  payment_last_date: {
                    $lt: getRollingOneYearAgoForFilters(),
                  },
                },
                { payment_last_date: { $null: true } },
              ],
            }}
          />
          <FilterListItem
            label="Expiring in 1 month"
            value={{
              payment_last_date: {
                $between: [
                  formatDate(rollingOneYearAgo),
                  formatDate(oneYearAgoPlusOneMonth),
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
    </Box>
  );
};
export default WaterSystemFilter;
