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

export const GrantContext = createContext<IGrantContextProvider>({
  grants: [],
  grantIndex: 0,
  setGrantIndex: () => {},
  grantId: 0,
  setGrantId: () => {},
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
});

export const useGrantContext = () => useContext(GrantContext);

const GrantContextProvider = ({ children }: PropsWithChildren) => {
  // const dataProvider = useDataProvider()

  const [grantIndex, setGrantIndex] = useState(1);
  const [grantId, setGrantId] = useState<Identifier>(4);
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

  // Sidebars
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(true);
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  const [isEmailSidebarOpen, setIsEmailSidebarOpen] = useState(false);

  const [payoutStatusId, setPayoutStatusId] = useState<Identifier>(0);
  const [applicationStatuses, setApplicationStatuses] = useStore<string[]>(
    "grants-application-status",
    ["12"]
  );
  const [dashboardContext, setDashboardContext] = useState<"create" | "edit">(
    "edit"
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // resource

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
    if (!grants || grantsLoading) return;
    const openGrantIndex = grants.findIndex((grant) => grant.status === "Open");
    setGrantIndex(openGrantIndex !== -1 ? openGrantIndex : 1);
    setGrantId(grants[openGrantIndex !== -1 ? openGrantIndex : 1].id);
    setTo(dayjs(grants[grantIndex].closes));
    setFrom(dayjs(grants[grantIndex].opens));
  }, [grantsLoading]);

  // TODO improve this
  // useEffect(() => { 
  //   if (fiscalYearStart && fiscalYearEnd) {
  //     setFrom(dayjs(fiscalYearStart));
  //     setTo(dayjs(fiscalYearEnd));
  //   }
  // }, [fiscalYearStart, fiscalYearEnd]);

  return !GrantContext || !grants || grants?.length === 0 || grantsLoading ? (
    <Loading />
  ) : (
    <GrantContext.Provider
      value={{
        grants,
        grantIndex,
        setGrantIndex,
        grantId,
        setGrantId,
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
        applicationStatuses,
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
      }}
    >
      {children}
    </GrantContext.Provider>
  );
};

export default GrantContextProvider;
