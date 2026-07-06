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
  getRollingOneYearAgoForFilters,
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

  const rollingOneYearAgo = new Date();
  rollingOneYearAgo.setFullYear(rollingOneYearAgo.getFullYear() - 1);
  const oneYearAgoPlusOneMonth = new Date(rollingOneYearAgo);
  oneYearAgoPlusOneMonth.setMonth(oneYearAgoPlusOneMonth.getMonth() + 1);

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

        {/* Align with list: active ≈ last payment within the past year + not null. */}
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
            label="Expires in 1 month"
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
