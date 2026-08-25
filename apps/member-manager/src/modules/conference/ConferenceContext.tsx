import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  IConferenceContextProvider,
  TabValue,
} from "./types/IConferenceContextProvider";
import { Loading, useGetList, useStore } from "react-admin";
import { IConference } from "./types";
import IConferenceTicket from "./types/IConferenceTicket";
import {
  DEFAULT_CONFERENCE_ID,
  MULTI_CONFERENCE_TABS,
  ensureConferenceInFilters,
} from "./helpers/mergeConferenceAcrossTabFilters";
import { resourceForConferenceTab } from "./helpers/conferenceTabResources";

/** Re-export for existing imports. */
export { DEFAULT_CONFERENCE_ID };

function defaultFilterForTab(tab: string, year: number): Record<string, any> {
  if (MULTI_CONFERENCE_TABS.has(tab)) {
    return { conferences: [DEFAULT_CONFERENCE_ID] };
  }
  if (tab === "edit") {
    return { conference: DEFAULT_CONFERENCE_ID };
  }
  return { conference: DEFAULT_CONFERENCE_ID, year };
}

const yearNow = new Date().getFullYear();

export const ConferenceContext = createContext<IConferenceContextProvider>({
  year: yearNow,
  selectedTab: "summary",
  setYear: () => {},
  setSelectedTab: () => {},
  conferences: [],
  tickets: [],
  isFilterSidebarOpen: false,
  setIsFilterSidebarOpen: () => {},
  resource: "",
  setResource: () => {},
  isCreating: false,
  setIsCreating: () => {},
  searchFilter: [],
  setSearchFilter: () => {},
  savingQuery: false,
  setSavingQuery: () => {},
  tabFilters: {},
  setTabFilters: () => {},
  tabSorts: {},
  setTabSorts: () => {},
  currentFilter: { conference: DEFAULT_CONFERENCE_ID, year: yearNow },
});

export const useConferenceContext = () => useContext(ConferenceContext);

const ConferenceContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedTab, setSelectedTab] = useStore<TabValue>(
    "conference-tab-value",
    "summary"
  );
  const [year, setYear] = useState(new Date().getFullYear());
  const [resource, setResource] = useStore(
    "selected-conference-resource",
    ""
  );
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useStore(
    "conference-filter-sidebar",
    false
  );
  const [searchFilter, setSearchFilter] = useState<
    React.ReactElement | React.ReactElement[]
  >([]);
  const [isCreating, setIsCreating] = useState(false);
  const [savingQuery, setSavingQuery] = useState(false);
  const [tabFilters, setTabFilters] = useStore<Record<string, any>>(
    "conferenceTabFilters",
    {
      summary: { year: yearNow, conference: DEFAULT_CONFERENCE_ID },
      registrations: {
        conference: DEFAULT_CONFERENCE_ID,
        year: yearNow,
      },
      attendees: { conference: DEFAULT_CONFERENCE_ID, year: yearNow },
      booths: { conference: DEFAULT_CONFERENCE_ID, year: yearNow },
      tools: { conference: DEFAULT_CONFERENCE_ID, year: yearNow },
      contestants: { conference: DEFAULT_CONFERENCE_ID, year: yearNow },
      teams: { conference: DEFAULT_CONFERENCE_ID, year: yearNow },
      "taste test": { conference: DEFAULT_CONFERENCE_ID, year: yearNow },
      sponsors: { conference: DEFAULT_CONFERENCE_ID, year: yearNow },
      edit: { conference: DEFAULT_CONFERENCE_ID },
      schedule: { conference: DEFAULT_CONFERENCE_ID, year: yearNow },
      tickets: { conferences: [DEFAULT_CONFERENCE_ID] },
      extras: { conferences: [DEFAULT_CONFERENCE_ID] },
      addons: { conferences: [DEFAULT_CONFERENCE_ID] },
      sponsorships: { conference: DEFAULT_CONFERENCE_ID },
      feedback: { conference: DEFAULT_CONFERENCE_ID, year: yearNow },
    }
  );
  const [tabSorts, setTabSorts] = useStore<Record<string, any>>(
    "conferenceTabSorts",
    {}
  );

  const { data: conferences, isLoading: conferencesLoading } =
    useGetList<IConference>("conferences", {
      meta: {
        populate: true,
        raw: true,
      },
      sort: { field: "name", order: "ASC" },
      pagination: { page: 1, perPage: 1000 },
    });

  // Ticket Types
  const { data: tickets, isLoading: ticketsLoading } =
    useGetList<IConferenceTicket>("conference-tickets", {
      filter: {}, // @TODO: Filter by Conference ID; might want to use the UseState
      meta: {
        populate: true,
        raw: true,
      },
      pagination: { page: 1, perPage: 1000 },
    });

  useEffect(() => {
    setIsCreating(false);
    setSearchFilter([]);
    setResource(resourceForConferenceTab(selectedTab));
  }, [selectedTab, setResource]);

  // Persisted tab filters can lose `conference` (toggle/X clear). Re-hydrate.
  useEffect(() => {
    setTabFilters((prev) => {
      let changed = false;
      const next: Record<string, any> = {};
      for (const [tab, filters] of Object.entries(prev || {})) {
        const ensured = ensureConferenceInFilters(filters, tab);
        next[tab] = ensured;
        if (ensured !== filters) changed = true;
      }
      return changed ? next : prev;
    });
  }, [setTabFilters]);

  const currentFilter = ensureConferenceInFilters(
    {
      ...defaultFilterForTab(selectedTab, year),
      ...tabFilters[selectedTab],
    },
    selectedTab
  );

  return !tickets || !conferences || conferencesLoading || ticketsLoading ? (
    <Loading />
  ) : (
    <ConferenceContext.Provider
      value={{
        year,
        setYear,
        selectedTab,
        setSelectedTab,
        conferences,
        tickets,
        isFilterSidebarOpen,
        setIsFilterSidebarOpen,
        resource,
        setResource,
        isCreating,
        setIsCreating,
        searchFilter,
        setSearchFilter,
        savingQuery,
        setSavingQuery,
        tabFilters,
        setTabFilters,
        tabSorts,
        setTabSorts,
        currentFilter,
      }}
    >
      {children}
    </ConferenceContext.Provider>
  );
};

export default ConferenceContextProvider;