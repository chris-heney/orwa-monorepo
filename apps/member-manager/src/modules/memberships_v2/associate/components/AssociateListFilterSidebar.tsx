import React from "react";
import { Card, CardContent } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";
import BadgeIcon from "@mui/icons-material/Badge";
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  Loading,
  useListFilterContext,
  useGetList,
} from "react-admin";
import { useMembershipContext } from "../../MembershipsContextProvider";
import {
  formatDate,
  oneYearAgoFormatted,
} from "../../helpers/activeOrInactiveMembership";
import { DateRangeIcon } from "@mui/x-date-pickers";
import SavedFilters from "../../../_components/SavedFilters";
import DateRangeFilter from "../../watersystem/components/DateRangeFilter";

const AssociateListFilterSidebar = () => {
  const {
    setAssociateFilters,
    selectedTab,
    savingQuery,
    setSavingQuery,
  } = useMembershipContext();
  const { filterValues } = useListFilterContext();

  // Fetch memberships for dynamic filter options
  const { data: memberships, isLoading: isMembershipsLoading } = useGetList('memberships', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'name', order: 'ASC' },
  });

  React.useEffect(() => {
    setAssociateFilters({ ...filterValues });
  }, [filterValues]);

  // Multi-select filter functions for memberships
  const isMembershipSelected = (value: any, filters: any) => {
    const memberships = filters.membership || [];
    return Array.isArray(memberships) 
      ? memberships.includes(value.membership)
      : memberships === value.membership;
  };

  const toggleMembershipFilter = (value: any, filters: any) => {
    const memberships = filters.membership || [];
    const membershipId = value.membership;
    
    // Always treat as array for multi-select
    const isSelected = memberships.includes(membershipId);
    
    return {
      ...filters,
      membership: isSelected
        ? memberships.filter((id: any) => id !== membershipId)
        : [...memberships, membershipId]
    };
  };

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
              "payment_previous_date",
              "directory_sent_date",
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
                { payment_last_date: { $lt: oneYearAgoFormatted } },
                { payment_last_date: { $null: true } },
              ],
            }}
          />
          <FilterListItem
            label="Expires in 1 month"
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
        <FilterList label="Level" icon={<InsightsIcon />}>
          {isMembershipsLoading ? (
            <Loading />
          ) : (
            memberships?.filter((membership) => membership.context === "Associate").sort((a, b) => a.price - b.price).map((membership) => (
              <FilterListItem
                key={membership.id}
                label={membership.name}
                value={{
                  membership: membership.id
                }}
                isSelected={isMembershipSelected}
                toggleFilter={toggleMembershipFilter}
              />
            ))
          )}
        </FilterList>
        {/* TODO Export Button Later */}
      </CardContent>
    </Card>
  );
};
export default AssociateListFilterSidebar;
