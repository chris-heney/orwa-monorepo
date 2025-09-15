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

export const ConferenceContext = createContext<IConferenceContextProvider>({
  year: new Date().getFullYear(),
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
  currentFilter: {},
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
    "conference-attendees"
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
      summary: { year: new Date().getFullYear(), conference: 2 },
      registrations: { conference: 2, year: new Date().getFullYear() },
      attendees: { conference: 2, year: new Date().getFullYear() },
      booths: { conference: 2, year: new Date().getFullYear() },
      sponsors: { conference: 2, year: new Date().getFullYear() },
      edit: { conference: 2 },
      schedule: { conference: 2, year: new Date().getFullYear() },
      tickets: { conferences: [2] },
      extras: { conferences: [2] },
      addons: { conferences: [2] },
      sponsorships: { conference: 2 },
      feedback: { conference: 2, year: new Date().getFullYear() },
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

  // reset search filter when tab changes

  useEffect(() => {
    setIsCreating(false);
    setSearchFilter([]);
  }, [selectedTab]);

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
        currentFilter: tabFilters[selectedTab],
      }}
    >
      {children}
    </ConferenceContext.Provider>
  );
};

export default ConferenceContextProvider;
