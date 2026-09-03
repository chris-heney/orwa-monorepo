import React, { createContext, useContext, PropsWithChildren } from "react";
import { useStore } from "react-admin";
import { nominationCycleYear } from "./helpers/listFilters";

export type AwardTab = "summary" | "nominations" | "winners" | "settings";

type AwardContextValue = {
  selectedTab: AwardTab;
  setSelectedTab: (tab: AwardTab) => void;
  year: number | "all";
  setYear: (year: number | "all") => void;
  search: string;
  setSearch: (search: string) => void;
  region: string;
  setRegion: (region: string) => void;
  awardType: string;
  setAwardType: (awardType: string) => void;
  isFilterSidebarOpen: boolean;
  setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AwardContext = createContext<AwardContextValue | null>(null);

export const useAwardContext = () =>
  useContext(AwardContext) ?? {
    selectedTab: "summary" as AwardTab,
    setSelectedTab: () => {},
    year: nominationCycleYear(),
    setYear: () => {},
    search: "",
    setSearch: () => {},
    region: "all",
    setRegion: () => {},
    awardType: "all",
    setAwardType: () => {},
    isFilterSidebarOpen: false,
    setIsFilterSidebarOpen: () => {},
  };

const AwardContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedTab, setSelectedTab] = useStore<AwardTab>(
    "orwa-awards-tab-value",
    "summary"
  );
  const [year, setYear] = useStore<number | "all">(
    "orwa-awards-cycle-year",
    nominationCycleYear()
  );
  const [search, setSearch] = useStore("orwa-awards-nomination-search", "");
  const [region, setRegion] = useStore("orwa-awards-nomination-region", "all");
  const [awardType, setAwardType] = useStore(
    "orwa-awards-nomination-award-type",
    "all"
  );
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
        search,
        setSearch,
        region,
        setRegion,
        awardType,
        setAwardType,
        isFilterSidebarOpen,
        setIsFilterSidebarOpen,
      }}
    >
      {children}
    </AwardContext.Provider>
  );
};

export default AwardContextProvider;
