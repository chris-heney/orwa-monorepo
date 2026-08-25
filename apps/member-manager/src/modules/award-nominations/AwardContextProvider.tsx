import React, { createContext, useContext, PropsWithChildren } from "react";
import { useStore } from "react-admin";

export type AwardTab = "summary" | "nominations" | "winners";

type AwardContextValue = {
  selectedTab: AwardTab;
  setSelectedTab: (tab: AwardTab) => void;
  year: number | "all";
  setYear: (year: number | "all") => void;
  status: string;
  setStatus: (status: string) => void;
  search: string;
  setSearch: (search: string) => void;
  isFilterSidebarOpen: boolean;
  setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AwardContext = createContext<AwardContextValue | null>(null);

export const useAwardContext = () =>
  useContext(AwardContext) ?? {
    selectedTab: "summary" as AwardTab,
    setSelectedTab: () => {},
    year: "all" as const,
    setYear: () => {},
    status: "all",
    setStatus: () => {},
    search: "",
    setSearch: () => {},
    isFilterSidebarOpen: false,
    setIsFilterSidebarOpen: () => {},
  };

const AwardContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedTab, setSelectedTab] = useStore<AwardTab>(
    "orwa-awards-tab-value",
    "summary"
  );
  const [year, setYear] = useStore<number | "all">(
    "orwa-awards-year-filter",
    new Date().getFullYear()
  );
  const [status, setStatus] = useStore("orwa-awards-nomination-status", "all");
  const [search, setSearch] = useStore("orwa-awards-nomination-search", "");
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useStore(
    "orwa-awards-filter-sidebar-open",
    false
  );

  return (
    <AwardContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        year,
        setYear,
        status,
        setStatus,
        search,
        setSearch,
        isFilterSidebarOpen,
        setIsFilterSidebarOpen,
      }}
    >
      {children}
    </AwardContext.Provider>
  );
};

export default AwardContextProvider;
