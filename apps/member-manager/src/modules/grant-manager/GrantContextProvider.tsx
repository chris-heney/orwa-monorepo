import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IGrantContextProvider, TabValue } from "./types/IGrantContextProvider";
import { IGrantApplication } from "./grant-application/GrantApplicationTypes";
import { Identifier, Loading, useGetList, useStore } from "react-admin";
import { IGrant } from "./grants/components/GrantTypes";
import dayjs, { Dayjs } from "dayjs";
import {
  getRelationFilterId,
  sanitizeNumericFilterIds,
} from "./helpers/getRelationFilterId";
import {
  SearchableTab,
  hasPersistedSearch,
} from "./helpers/searchBarTabs";

const emptySearchBarOpen = (): Record<SearchableTab, boolean> => ({
  applications: false,
  payouts: false,
  "Admin Payouts": false,
  "application scores": false,
});

const defaultFiscalYearStart = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const isBeforeJulyFirst = currentDate.getMonth() < 6;
  return isBeforeJulyFirst
    ? `${currentYear - 1}-07-01`
    : `${currentYear}-07-01`;
};

const defaultFiscalYearEnd = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const isBeforeJulyFirst = currentDate.getMonth() < 6;
  return isBeforeJulyFirst
    ? `${currentYear}-06-30`
    : `${currentYear + 1}-06-30`;
};

export const GrantContext = createContext<IGrantContextProvider>({
  grants: [],
  grantIndex: 0,
  setGrantIndex: () => {},
  grantId: 0,
  setGrantId: () => {},
  grantFilterId: 0,
  setGrantFilterId: () => {},
  from: null,
  setFrom: () => {},
  to: null,
  setTo: () => {},
  selectedTab: "summary",
  setSelectedTab: () => {},
  application: {} as IGrantApplication,
  setApplication: () => {},
  godMode: false,
  setGodMode: () => {},
  isFilterSidebarOpen: false,
  setIsFilterSidebarOpen: () => {},
  payoutStatusId: 0,
  setPayoutStatusId: () => {},
  applicationStatuses: [],
  setApplicationStatuses: () => {},
  dashboardContext: "edit",
  setDashboardContext: () => {},
  isSettingsOpen: false,
  setIsSettingsOpen: () => {},
  isActivitySidebarOpen: false,
  setIsActivitySidebarOpen: () => {},
  isEmailSidebarOpen: false,
  setIsEmailSidebarOpen: () => {},
  resource: "",
  setResource: () => {},
  fiscalYearStart: null,
  setFiscalYearStart: () => {},
  fiscalYearEnd: null,
  setFiscalYearEnd: () => {},
  applicationSearchFilter: "",
  setApplicationSearchFilter: () => {},
  searchBarOpen: emptySearchBarOpen(),
  setSearchBarOpenForTab: () => {},
  toggleSearchBarForTab: () => {},
});

export const useGrantContext = () => useContext(GrantContext);

const GrantContextProvider = ({ children }: PropsWithChildren) => {
  const [grantIndex, setGrantIndex] = useState(0);
  // documentId — used by Show/Edit getOne
  const [grantId, setGrantId] = useState<Identifier>(0);
  // numeric PK — used by Strapi relation list filters (persisted across dashboard remounts)
  const [grantFilterId, setGrantFilterId] = useStore<Identifier>(
    "grants-filter-id",
    0
  );
  const [from, setFrom] = useState<Dayjs | null>(null);
  const [to, setTo] = useState<Dayjs | null>(null);

  const [fiscalYearStart, setFiscalYearStart] = useStore<string | null>(
    "grants-fiscal-year-start",
    defaultFiscalYearStart()
  );
  const [fiscalYearEnd, setFiscalYearEnd] = useStore<string | null>(
    "grants-fiscal-year-end",
    defaultFiscalYearEnd()
  );

  const [selectedTab, setSelectedTab] = useStore<TabValue>(
    "grants-tab-value",
    "applications"
  );
  const [application, setApplication] = useState<IGrantApplication>(
    {} as IGrantApplication
  );
  const [godMode, setGodMode] = useState(false);

  // Sidebars — closed until the user opens them (filter open state persisted)
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useStore(
    "grants-filter-sidebar-open",
    false
  );
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  const [isEmailSidebarOpen, setIsEmailSidebarOpen] = useState(false);

  // Default 1 = Paid (matches prior mount-effect behavior on payout tabs)
  const [payoutStatusId, setPayoutStatusId] = useStore<Identifier>(
    "grants-payout-status-id",
    1
  );
  const grantSelectionHydrated = useRef(false);
  const [applicationStatuses, setApplicationStatusesRaw] = useStore<string[]>(
    "grants-application-status",
    []
  );
  // Drop stale documentIds left in localStorage after the Strapi 5 id remap.
  const setApplicationStatuses = (
    value: string[] | ((prev: string[]) => string[])
  ) => {
    if (typeof value === "function") {
      setApplicationStatusesRaw((prev) =>
        sanitizeNumericFilterIds(value(prev))
      );
    } else {
      setApplicationStatusesRaw(sanitizeNumericFilterIds(value));
    }
  };
  const [applicationSearchFilter, setApplicationSearchFilter] = useStore<string>(
    "grants-application-search-filter",
    ""
  );

  const [searchBarOpen, setSearchBarOpen] =
    useState<Record<SearchableTab, boolean>>(emptySearchBarOpen);

  // Auto-open Applications search only when a persisted query exists.
  useEffect(() => {
    if (!hasPersistedSearch(applicationSearchFilter)) return;
    setSearchBarOpen((prev) =>
      prev.applications ? prev : { ...prev, applications: true }
    );
  }, [applicationSearchFilter]);

  const setSearchBarOpenForTab = (tab: SearchableTab, open: boolean) => {
    setSearchBarOpen((prev) => ({ ...prev, [tab]: open }));
  };

  const toggleSearchBarForTab = (tab: SearchableTab) => {
    setSearchBarOpen((prev) => ({ ...prev, [tab]: !prev[tab] }));
  };

  // Dashboard
  const [dashboardContext, setDashboardContext] = useState<"create" | "edit">(
    "edit"
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [resource, setResource] = useStore<string | null>(
    "grants-resource",
    null
  );

  const { data: grants, isLoading: grantsLoading } = useGetList<IGrant>(
    "grants",
    {
      meta: {
        populate: true,
        raw: true,
      },
      sort: { field: "name", order: "ASC" },
      pagination: { page: 1, perPage: 1000 },
    }
  );

  useEffect(() => {
    setApplicationStatusesRaw((prev) => {
      const cleaned = sanitizeNumericFilterIds(prev);
      return cleaned.length === prev.length ? prev : cleaned;
    });
  }, [setApplicationStatusesRaw]);

  // Hydrate grant selection once when grants load. Prefer persisted filter id;
  // otherwise first Open grant. Do not overwrite after the user changes grants.
  useEffect(() => {
    if (!grants || grantsLoading || grantSelectionHydrated.current) return;
    grantSelectionHydrated.current = true;

    const persistedNumeric =
      typeof grantFilterId === "number"
        ? grantFilterId
        : typeof grantFilterId === "string" && /^\d+$/.test(grantFilterId)
          ? parseInt(grantFilterId, 10)
          : null;

    let index = -1;
    if (persistedNumeric != null && persistedNumeric > 0) {
      index = grants.findIndex(
        (grant) => getRelationFilterId(grant) === persistedNumeric
      );
    }
    if (index === -1) {
      const openGrantIndex = grants.findIndex(
        (grant) => grant.status === "Open"
      );
      index = openGrantIndex !== -1 ? openGrantIndex : 0;
    }

    const selected = grants[index];
    if (!selected) return;
    const filterId = getRelationFilterId(selected);
    setGrantIndex(index);
    setGrantId(selected.id);
    if (filterId != null) setGrantFilterId(filterId);
    setTo(dayjs(selected.closes));
    setFrom(dayjs(selected.opens));
  }, [grants, grantsLoading, grantFilterId, setGrantFilterId]);

  if (!GrantContext || !grants || grants.length === 0 || grantsLoading) {
    return <Loading />;
  }

  // Prefer grant matching persisted numeric filter id so remounts don't
  // briefly (or incorrectly) resolve to grants[0] before the hydrate effect.
  const persistedNumeric =
    typeof grantFilterId === "number"
      ? grantFilterId
      : typeof grantFilterId === "string" && /^\d+$/.test(grantFilterId)
        ? parseInt(grantFilterId, 10)
        : null;
  const selectedGrant =
    (persistedNumeric != null && persistedNumeric > 0
      ? grants.find((g) => getRelationFilterId(g) === persistedNumeric)
      : undefined) ??
    grants[grantIndex] ??
    grants[0];
  const resolvedGrantId = selectedGrant?.id ?? grantId;
  const resolvedGrantFilterId =
    getRelationFilterId(selectedGrant) ?? grantFilterId;

  return (
    <GrantContext.Provider
      value={{
        grants,
        grantIndex,
        setGrantIndex,
        grantId: resolvedGrantId,
        setGrantId,
        grantFilterId: resolvedGrantFilterId,
        setGrantFilterId,
        from,
        setFrom,
        to,
        setTo,
        selectedTab,
        setSelectedTab,
        application,
        setApplication,
        godMode,
        setGodMode,
        isFilterSidebarOpen,
        setIsFilterSidebarOpen,
        payoutStatusId,
        setPayoutStatusId,
        applicationStatuses: sanitizeNumericFilterIds(applicationStatuses),
        setApplicationStatuses,
        dashboardContext,
        setDashboardContext,
        isSettingsOpen,
        setIsSettingsOpen,
        isActivitySidebarOpen,
        setIsActivitySidebarOpen,
        isEmailSidebarOpen,
        setIsEmailSidebarOpen,
        resource,
        setResource,
        fiscalYearStart,
        setFiscalYearStart,
        fiscalYearEnd,
        setFiscalYearEnd,
        applicationSearchFilter,
        setApplicationSearchFilter,
        searchBarOpen,
        setSearchBarOpenForTab,
        toggleSearchBarForTab,
      }}
    >
      {children}
    </GrantContext.Provider>
  );
};

export default GrantContextProvider;
