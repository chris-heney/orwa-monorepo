import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
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
});

export const useGrantContext = () => useContext(GrantContext);

const GrantContextProvider = ({ children }: PropsWithChildren) => {
  const [grantIndex, setGrantIndex] = useState(0);
  // documentId — used by Show/Edit getOne
  const [grantId, setGrantId] = useState<Identifier>(0);
  // numeric PK — used by Strapi relation list filters
  const [grantFilterId, setGrantFilterId] = useState<Identifier>(4);
  const [from, setFrom] = useState<Dayjs | null>(null);
  const [to, setTo] = useState<Dayjs | null>(null);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const isBeforeJulyFirst = currentDate.getMonth() < 6; // 6 is July (0-based months)

  const [fiscalYearStart, setFiscalYearStart] = useState<string | null>(
    isBeforeJulyFirst
      ? `${currentYear - 1}-07-01`
      : `${currentYear}-07-01`
  );
  const [fiscalYearEnd, setFiscalYearEnd] = useState<string | null>(
    isBeforeJulyFirst
      ? `${currentYear}-06-30`
      : `${currentYear + 1}-06-30`
  );

  const [selectedTab, setSelectedTab] = useStore<TabValue>(
    "grants-tab-value",
    "applications"
  );
  const [application, setApplication] = useState<IGrantApplication>(
    {} as IGrantApplication
  );
  const [godMode, setGodMode] = useState(false);

  // Sidebars — closed until the user opens them
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  const [isEmailSidebarOpen, setIsEmailSidebarOpen] = useState(false);

  const [payoutStatusId, setPayoutStatusId] = useState<Identifier>(0);
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

  useEffect(() => {
    if (!grants || grantsLoading) return;
    const openGrantIndex = grants.findIndex((grant) => grant.status === "Open");
    const index = openGrantIndex !== -1 ? openGrantIndex : 0;
    const selected = grants[index];
    const filterId = getRelationFilterId(selected);
    setGrantIndex(index);
    setGrantId(selected.id);
    if (filterId != null) setGrantFilterId(filterId);
    setTo(dayjs(selected.closes));
    setFrom(dayjs(selected.opens));
  }, [grants, grantsLoading]);

  if (!GrantContext || !grants || grants.length === 0 || grantsLoading) {
    return <Loading />;
  }

  // Derive from the selected grant so children never see a stale/zero id
  // between first paint and the sync effect.
  const selectedGrant = grants[grantIndex] ?? grants[0];
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
      }}
    >
      {children}
    </GrantContext.Provider>
  );
};

export default GrantContextProvider;
