import React from "react";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useStore } from "react-admin";

export type TabValue = "contacts" | "staff" | "training-instructors" | "users";

export interface IHumanResourcesContextProvider {
  selectedTab: TabValue;
  setSelectedTab: React.Dispatch<React.SetStateAction<TabValue>>;
  isFilterSidebarOpen: boolean;
  setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contactFilters: any;
  setContactFilters: React.Dispatch<React.SetStateAction<any>>;
  staffFilters: any;
  setStaffFilters: React.Dispatch<React.SetStateAction<any>>;
  instructorFilters: any;
  setInstructorFilters: React.Dispatch<React.SetStateAction<any>>;
  userFilters: any;
  setUserFilters: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSavingQuery: boolean;
  setSavingQuery: React.Dispatch<React.SetStateAction<boolean>>;
  userListVersion: number;
  refreshUserList: () => void;
}

export const HumanResourcesContext = createContext<IHumanResourcesContextProvider>({
  selectedTab: "contacts",
  setSelectedTab: () => {},
  isFilterSidebarOpen: false,
  setIsFilterSidebarOpen: () => {},
  contactFilters: {},
  setContactFilters: () => {},
  staffFilters: {},
  setStaffFilters: () => {},
  instructorFilters: {},
  setInstructorFilters: () => {},
  userFilters: {},
  setUserFilters: () => {},
  isLoading: false,
  setIsLoading: () => {},
  isSettingsOpen: false,
  setIsSettingsOpen: () => {},
  isSavingQuery: false,
  setSavingQuery: () => {},
  userListVersion: 0,
  refreshUserList: () => {},
});

export const useHumanResourcesContext = () => useContext(HumanResourcesContext);

const HumanResourcesContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedTab, setSelectedTab] = useStore<TabValue>(
    "human-resources-tab-value",
    "contacts"
  );
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useStore<boolean>(
    "human-resources-filter-sidebar",
    false
  );
  const [contactFilters, setContactFilters] = useStore<any>(
    "contacts-filter", 
    {}
  );
  const [staffFilters, setStaffFilters] = useStore<any>(
    "staff-filter", 
    {}
  );
  const [instructorFilters, setInstructorFilters] = useStore<any>(
    "instructors-filter", 
    {}
  );
  const [userFilters, setUserFilters] = useStore<any>(
    "users-filter", 
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavingQuery, setSavingQuery] = useState(false);
  const [userListVersion, setUserListVersion] = useState(0);
  const refreshUserList = () => setUserListVersion((version) => version + 1);

  return (
    <HumanResourcesContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        isFilterSidebarOpen,
        setIsFilterSidebarOpen,
        contactFilters,
        setContactFilters,
        staffFilters,
        setStaffFilters,
        instructorFilters,
        setInstructorFilters,
        userFilters,
        setUserFilters,
        isLoading,
        setIsLoading,
        isSettingsOpen,
        setIsSettingsOpen,
        isSavingQuery,
        setSavingQuery,
        userListVersion,
        refreshUserList,
      }}
    >
      {children}
    </HumanResourcesContext.Provider>
  );
};

export default HumanResourcesContextProvider;
