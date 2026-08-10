import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  ListBase,
  useListFilterContext,
  Loading,
} from "react-admin";
import { Divider } from "@mui/material";
import { useHumanResourcesContext } from "../HumanResourcesContext";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import { Favorite } from "@mui/icons-material";
import RolesContextProvider, {
  useRolesContext,
} from "../../../context/RolesContextProvider";
import SavedFilters from "../../_components/SavedFilters";
import FilterSidebarShell from "../../_components/FilterSidebarShell";

const ContactFilters = () => {
  const { setContactFilters, selectedTab, isSavingQuery, setSavingQuery } =
    useHumanResourcesContext();

  const { filterValues } = useListFilterContext();

  React.useEffect(() => {
    if (filterValues) {
      setContactFilters({ ...filterValues });
    }
  }, [filterValues]);

  return !filterValues ? (
    <Loading />
  ) : (
    <>
      <SavedFilters
        resource={selectedTab}
        savingQuery={isSavingQuery}
        setSavingQuery={setSavingQuery}
      />
      <Divider sx={{ mt: 2, mb: 2 }} />

      <FilterLiveSearch />

      <FilterList label="Contact Filters" icon={<EmailIcon />}>
        <FilterListItem
          label="Valid Emails"
          value={{
            $and: [
              { email: { $notContains: "anonymous" } },
              { email: { $notNull: true } },
            ],
          }}
        />
        <FilterListItem
          label="Invalid Emails"
          value={{
            $or: [
              { email: { $contains: "anonymous" } },
              { email: { $null: true } },
            ],
          }}
        />

      </FilterList>
    </>
  );
};

const StaffFilters = () => {
  const { setStaffFilters, selectedTab, isSavingQuery, setSavingQuery } =
    useHumanResourcesContext();

  const { filterValues } = useListFilterContext();

  React.useEffect(() => {
    if (filterValues) {
      setStaffFilters({ ...filterValues });
    }
  }, [filterValues]);

  return !filterValues ? (
    <Loading />
  ) : (
    <>
      <SavedFilters
        resource={selectedTab}
        savingQuery={isSavingQuery}
        setSavingQuery={setSavingQuery}
      />
      <Divider sx={{ mt: 2, mb: 2 }} />

      <FilterLiveSearch />

      {/* <FilterList label="Status" icon={<BadgeIcon />}>
        <FilterListItem
          label="Active Staff"
          value={{
            is_active: true,
          }}
        />
        <FilterListItem
          label="Inactive Staff"
          value={{
            is_active: false,
          }}
        />
      </FilterList> */}

      {/* <FilterList label="Date" icon={<DateRangeIcon />}>
        <FilterListItem
          label="Added This Month"
          value={{
            created_at_gte: new Date(new Date().setDate(1))
              .toISOString()
              .split("T")[0],
          }}
        />
        <FilterListItem
          label="Added This Year"
          value={{
            created_at_gte: new Date(new Date().getFullYear(), 0, 1)
              .toISOString()
              .split("T")[0],
          }}
        />
      </FilterList> */}
    </>
  );
};

const InstructorFilters = () => {
  const { setInstructorFilters, selectedTab, isSavingQuery, setSavingQuery } =
    useHumanResourcesContext();

  const { filterValues } = useListFilterContext();

  React.useEffect(() => {
    if (filterValues) {
      setInstructorFilters({ ...filterValues });
    }
  }, [filterValues]);

  return !filterValues ? (
    <Loading />
  ) : (
    <>
      <SavedFilters
        resource={selectedTab}
        savingQuery={isSavingQuery}
        setSavingQuery={setSavingQuery}
      />
      <Divider sx={{ mt: 2, mb: 2 }} />

      <FilterLiveSearch />

      {/* <FilterList label="Status" icon={<BadgeIcon />}>
        <FilterListItem
          label="Active Instructors"
          value={{
            is_active: true,
          }}
        />
        <FilterListItem
          label="Inactive Instructors"
          value={{
            is_active: false,
          }}
        />
      </FilterList>

      <FilterList label="Certification" icon={<BadgeIcon />}>
        <FilterListItem
          label="Certified"
          value={{
            is_certified: true,
          }}
        />
        <FilterListItem
          label="Not Certified"
          value={{
            is_certified: false,
          }}
        />
      </FilterList> */}
    </>
  );
};

const UserFilters = () => {
  const { setUserFilters, selectedTab, isSavingQuery, setSavingQuery } =
    useHumanResourcesContext();

  const { filterValues } = useListFilterContext();

  const { roles } = useRolesContext();

  React.useEffect(() => {
    if (filterValues) {
      setUserFilters({ ...filterValues });
    }
  }, [filterValues]);

  return !filterValues ? (
    <Loading />
  ) : (
    <>
      <SavedFilters
        resource={selectedTab}
        savingQuery={isSavingQuery}
        setSavingQuery={setSavingQuery}
      />
      <Divider sx={{ mt: 2, mb: 2 }} />

      <FilterLiveSearch />

      <FilterList label="Role" icon={<BadgeIcon />}>
        {roles.map((role, index) => {
          return (
            <FilterListItem
              key={`${role} ${index}`}
              label={role.name}
              value={{
                role: role.id,
              }}
            />
          );
        })}
      </FilterList>

      <FilterList label="Status" icon={<BadgeIcon />}>
        <FilterListItem
          label="Confirmed"
          value={{
            confirmed: true,
          }}
        />
        <FilterListItem
          label="Not Confirmed"
          value={{
            confirmed: false,
          }}
        />
      </FilterList>
    </>
  );
};

const HumanResourcesFilters = () => {
  const {
    selectedTab,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    isLoading,
    contactFilters,
    staffFilters,
    instructorFilters,
    userFilters,
    setSavingQuery,
  } = useHumanResourcesContext();

  if (isLoading) {
    return null;
  }

  return (
    <FilterSidebarShell
      open={isFilterSidebarOpen}
      onClose={() => setIsFilterSidebarOpen(false)}
      headerActions={
        <Tooltip title="Save Current Filter">
          <IconButton
            onClick={() => setSavingQuery((prev) => !prev)}
            size="small"
            sx={{ color: "common.white" }}
            aria-label="Save current filter"
          >
            <Favorite fontSize="small" />
          </IconButton>
        </Tooltip>
      }
    >
      <Box sx={{ p: 2 }}>
        {selectedTab === "contacts" && (
          <ListBase
            filterDefaultValues={contactFilters || null}
            disableSyncWithLocation
            resource={"contacts"}
          >
            <ContactFilters />
          </ListBase>
        )}

        {selectedTab === "staff" && (
          <ListBase
            filterDefaultValues={staffFilters || null}
            disableSyncWithLocation
            resource={"staff"}
          >
            <StaffFilters />
          </ListBase>
        )}

        {selectedTab === "training-instructors" && (
          <ListBase
            filterDefaultValues={instructorFilters || null}
            disableSyncWithLocation
            resource={"training-instructors"}
          >
            <InstructorFilters />
          </ListBase>
        )}

        {selectedTab === "users" && (
          <ListBase
            filterDefaultValues={userFilters || null}
            disableSyncWithLocation
            resource={"users"}
          >
            <RolesContextProvider>
              <UserFilters />
            </RolesContextProvider>
          </ListBase>
        )}
      </Box>
    </FilterSidebarShell>
  );
};

export default HumanResourcesFilters;
