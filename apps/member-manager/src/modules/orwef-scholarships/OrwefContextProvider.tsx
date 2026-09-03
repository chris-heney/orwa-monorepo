import React, { createContext, useContext, PropsWithChildren } from "react";
import { useStore } from "react-admin";

export type OrwefTab = "summary" | "applications";

type OrwefContextValue = {
  selectedTab: OrwefTab;
  setSelectedTab: (tab: OrwefTab) => void;
  year: number | "all";
  setYear: (year: number | "all") => void;
  search: string;
  setSearch: (search: string) => void;
  region: string;
  setRegion: (region: string) => void;
  isFilterSidebarOpen: boolean;
  setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const OrwefContext = createContext<OrwefContextValue | null>(null);

export const useOrwefContext = () =>
  useContext(OrwefContext) ?? {
    selectedTab: "summary" as OrwefTab,
    setSelectedTab: () => undefined,
    year: "all" as const,
    setYear: () => undefined,
    search: "",
    setSearch: () => undefined,
    region: "all",
    setRegion: () => undefined,
    isFilterSidebarOpen: false,
    setIsFilterSidebarOpen: () => undefined,
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
  const [search, setSearch] = useStore("orwef-application-search", "");
  const [region, setRegion] = useStore("orwef-scholarships-region", "all");
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
        search,
        setSearch,
        region,
        setRegion,
        isFilterSidebarOpen,
        setIsFilterSidebarOpen,
      }}
    >
      {children}
    </OrwefContext.Provider>
  );
};

export default OrwefContextProvider;
