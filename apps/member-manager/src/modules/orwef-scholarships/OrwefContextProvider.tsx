import React, { createContext, useContext, PropsWithChildren } from "react";
import { useStore } from "react-admin";

export type OrwefTab = "summary" | "applications";

type OrwefContextValue = {
  selectedTab: OrwefTab;
  setSelectedTab: (tab: OrwefTab) => void;
  year: number | "all";
  setYear: (year: number | "all") => void;
  status: string;
  setStatus: (status: string) => void;
  search: string;
  setSearch: (search: string) => void;
  isFilterSidebarOpen: boolean;
  setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const OrwefContext = createContext<OrwefContextValue | null>(null);

export const useOrwefContext = () =>
  useContext(OrwefContext) ?? {
    selectedTab: "summary" as OrwefTab,
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

const OrwefContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedTab, setSelectedTab] = useStore<OrwefTab>(
    "orwef-tab-value",
    "summary"
  );
  const [year, setYear] = useStore<number | "all">(
    "orwef-year-filter",
    new Date().getFullYear()
  );
  const [status, setStatus] = useStore("orwef-application-status", "all");
  const [search, setSearch] = useStore("orwef-application-search", "");
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useStore(
    "orwef-filter-sidebar-open",
    false
  );

  return (
    <OrwefContext.Provider
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
    </OrwefContext.Provider>
  );
};

export default OrwefContextProvider;
