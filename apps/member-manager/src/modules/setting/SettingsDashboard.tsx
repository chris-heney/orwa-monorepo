import React, { useEffect, useMemo } from 'react';
import { Box, Divider, IconButton, Tab, Tabs, Tooltip } from '@mui/material';
import { Title } from 'react-admin';
import { TabContext, TabPanel } from '@mui/lab';
import PeopleIcon from '@mui/icons-material/Groups';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SearchIcon from '@mui/icons-material/Search';
import PageHeadingBar from '../_components/PageHeadingBar';
import CollapsibleSearchBar from '../_components/CollapsibleSearchBar';
import HumanResourcesContextProvider, {
  useHumanResourcesContext,
} from '../human-resources/HumanResourcesContext';
import RolesContextProvider from '../../context/RolesContextProvider';
import StaffList from '../human-resources/staff/StaffList';
import InstructorsList from '../human-resources/instructors/InstructorList';
import UserList from '../human-resources/users/UserList';
import BadgeList from '../human-resources/contacts/badges/BadgeList';
import { useCan } from '../rbac-manager/useCan';

type SettingsTab = 'users' | 'staff' | 'training-instructors' | 'badges';

type FilterBag = Record<string, unknown>;

/** How one tab's search text maps onto its RaStore filter bag. */
type SearchBinding = {
  filters: FilterBag;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  placeholder: string;
  tooltip: string;
  /** Filter keys the search owns — removed before re-applying or on clear. */
  keys: readonly string[];
  /** Filter fragment for a non-empty search string. */
  build: (text: string) => FilterBag;
  /** Recover the search string from a persisted filter bag. */
  read: (filters: FilterBag) => string;
};

/** Strapi `_q` full-text search (serialized from RA's `q`). */
const qSearch: Pick<SearchBinding, 'keys' | 'build' | 'read'> = {
  keys: ['q'],
  build: (text) => ({ q: text }),
  read: (filters) => (typeof filters.q === 'string' ? filters.q : ''),
};

/** Contact fields searched when the row's text lives on a related contact. */
const CONTACT_SEARCH_FIELDS = ['first', 'last', 'email', 'phone', 'title'] as const;

/**
 * `$or` of case-insensitive contains across the related contact's fields,
 * e.g. `{ $or: [{ contact: { first: { $containsi } } }, …] }`.
 */
const relationSearch = (
  relation: string
): Pick<SearchBinding, 'keys' | 'build' | 'read'> => ({
  keys: ['$or'],
  build: (text) => ({
    $or: CONTACT_SEARCH_FIELDS.map((field) => ({
      [relation]: { [field]: { $containsi: text } },
    })),
  }),
  read: (filters) => {
    const first = Array.isArray(filters.$or) ? filters.$or[0] : undefined;
    const leaf = (first as FilterBag | undefined)?.[relation] as
      | Record<string, { $containsi?: unknown }>
      | undefined;
    const term = leaf?.[CONTACT_SEARCH_FIELDS[0]]?.$containsi;
    return typeof term === 'string' ? term : '';
  },
});

/**
 * Settings — administrative directory of people/accounts, laid out like the
 * Contacts page but for config entities: Users, Staff, Instructors. Each tab
 * is capability-gated; the first tab the role can see is selected by default.
 * (Personal profile + UI preferences live on the avatar menu → My Profile.)
 */
const SettingsDashboardInner = () => {
  const { can, canAction, canOnResource } = useCan();

  const tabs = useMemo(
    () =>
      [
        canAction('plugin::users-permissions.user.find') && {
          label: 'Users',
          value: 'users' as const,
          icon: <PeopleIcon />,
        },
        canOnResource('find', 'staff') && {
          label: 'Staff',
          value: 'staff' as const,
          icon: <BadgeIcon />,
        },
        canOnResource('find', 'training-instructors') && {
          label: 'Instructors',
          value: 'training-instructors' as const,
          icon: <SchoolIcon />,
        },
        can('create', 'contact-badge') && {
          label: 'Badges',
          value: 'badges' as const,
          icon: <MilitaryTechIcon />,
        },
      ].filter(Boolean) as { label: string; value: SettingsTab; icon: JSX.Element }[],
    [can, canAction, canOnResource]
  );

  const [selected, setSelected] = React.useState<SettingsTab | ''>('');
  const active: SettingsTab | '' =
    selected && tabs.some((t) => t.value === selected)
      ? selected
      : tabs[0]?.value ?? '';

  // Fuzzy search scoped to the active tab. Each list already reads its filter
  // bag from HumanResourcesContext (RaStore-backed); the search merges its
  // fragment into that bag and the data provider serializes it for Strapi.
  const {
    userFilters,
    setUserFilters,
    staffFilters,
    setStaffFilters,
    instructorFilters,
    setInstructorFilters,
  } = useHumanResourcesContext();

  const searchBindings: Partial<Record<SettingsTab, SearchBinding>> = {
    // users-permissions users carry username/email on the row itself, so
    // Strapi's `_q` (case-insensitive contains across string columns + id)
    // is the fuzzy search.
    users: {
      filters: userFilters || {},
      setFilters: setUserFilters,
      placeholder: 'Search users by username, email, or ID…',
      tooltip: 'Search users',
      ...qSearch,
    },
    // Staff / instructor rows hold no text of their own — every searchable
    // field lives on the related contact — so `_q` can never match. Search
    // the relation with a `$or` of `$containsi` leaves instead.
    staff: {
      filters: staffFilters || {},
      setFilters: setStaffFilters,
      placeholder: 'Search staff by name, email, phone, or title…',
      tooltip: 'Search staff',
      ...relationSearch('contact'),
    },
    'training-instructors': {
      filters: instructorFilters || {},
      setFilters: setInstructorFilters,
      placeholder: 'Search instructors by name, email, phone, or title…',
      tooltip: 'Search instructors',
      ...relationSearch('instructor'),
    },
  };

  const searchBinding = active ? searchBindings[active] : undefined;
  const searchQuery = searchBinding ? searchBinding.read(searchBinding.filters) : '';

  const [searchOpen, setSearchOpen] = React.useState<boolean>(false);

  // A persisted search (reload / return to Settings) re-opens the bar so the
  // active constraint is never hidden from the user.
  useEffect(() => {
    if (searchQuery) setSearchOpen(true);
  }, [searchQuery]);

  const commitSearch = (value: string) => {
    if (!searchBinding) return;
    const rest: Record<string, unknown> = { ...searchBinding.filters };
    for (const key of searchBinding.keys) delete rest[key];
    searchBinding.setFilters(
      value ? { ...rest, ...searchBinding.build(value) } : rest
    );
  };

  const toggleSearch = () => {
    if (searchOpen) {
      // Clear before closing so the persisted-query effect cannot re-open it.
      commitSearch('');
      setSearchOpen(false);
    } else {
      setSearchOpen(true);
    }
  };

  return (
    <Box>
      <Title title="Settings" />
      <Box sx={{ width: 1, minWidth: 0 }}>
        <PageHeadingBar
          title="Settings"
          info="Manage user accounts, staff, and instructors. Edit your own profile and preferences from the avatar menu (top right)."
          sx={{ mb: 0 }}
        />
        {tabs.length === 0 ? (
          <Box sx={{ p: 3, color: 'text.secondary' }}>
            You don&apos;t have access to any settings sections.
          </Box>
        ) : (
          <TabContext value={active}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? theme.palette.grey[900]
                    : theme.palette.grey[100],
              }}
            >
              <Tabs
                value={active}
                onChange={(_e, v) => setSelected(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ flex: 1, minWidth: 0 }}
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                    icon={tab.icon}
                    iconPosition="start"
                  />
                ))}
              </Tabs>
              {searchBinding && (
                <Tooltip title={searchOpen ? 'Close search' : searchBinding.tooltip}>
                  <IconButton
                    onClick={toggleSearch}
                    aria-label={searchOpen ? 'Close search' : searchBinding.tooltip}
                    aria-pressed={searchOpen}
                    size="small"
                    sx={{
                      mx: 1,
                      color: searchOpen || searchQuery ? 'primary.main' : 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Divider />
            {searchBinding && (
              <CollapsibleSearchBar
                open={searchOpen}
                value={searchQuery}
                onChange={commitSearch}
                onClose={toggleSearch}
                placeholder={searchBinding.placeholder}
                label={searchBinding.tooltip}
              />
            )}
            <Box sx={{ backgroundColor: 'background.paper' }}>
              <TabPanel value="users" sx={{ p: 0 }}>
                <RolesContextProvider>
                  <UserList />
                </RolesContextProvider>
              </TabPanel>
              <TabPanel value="staff" sx={{ p: 0 }}>
                <StaffList title=" " />
              </TabPanel>
              <TabPanel value="training-instructors" sx={{ p: 0 }}>
                <InstructorsList title=" " />
              </TabPanel>
              <TabPanel value="badges" sx={{ p: 2 }}>
                <BadgeList />
              </TabPanel>
            </Box>
          </TabContext>
        )}
      </Box>
    </Box>
  );
};

const SettingsDashboard = () => (
  <HumanResourcesContextProvider>
    <SettingsDashboardInner />
  </HumanResourcesContextProvider>
);

export default SettingsDashboard;
