import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { useStore } from "react-admin";
import { IEmailManagementContextProvider, TabValue } from "./types";

export const EmailManagementContext =
  createContext<IEmailManagementContextProvider>({
    selectedTab: "emails",
    setSelectedTab: () => {},
    isFilterSidebarOpen: false,
    setIsFilterSidebarOpen: () => {},
    isLoading: false,
    setIsLoading: () => {},
    isSettingsOpen: false,
    setIsSettingsOpen: () => {},
    savingQuery: false,
    setSavingQuery: () => {},
    emailFilters: [],
    setEmailFilters: () => {},
    emailLogFilters: [],
    setEmailLogFilters: () => {},
    emailTaskFilters: [],
    setEmailTaskFilters: () => {},
  });

export const useEmailManagementContext = () =>
  useContext(EmailManagementContext);

const EmailManagementContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedTab, setSelectedTab] = useStore<TabValue>(
    "email-management-tab-value",
    "email-templates"
  );
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useStore(
    "email-management-filter-sidebar-open",
    false
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [emailFilters, setEmailFilters] = useStore<
    React.ReactElement | React.ReactElement[]
  >("email-filters", []);

  const [savingQuery, setSavingQuery] = useState(false);

  const [emailLogFilters, setEmailLogFilters] = useStore< React.ReactElement | React.ReactElement[] >("email-log-filters", []);

  const [emailTaskFilters, setEmailTaskFilters] = useStore< React.ReactElement | React.ReactElement[] >("email-task-filters", []);

  return (
    <EmailManagementContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        isFilterSidebarOpen,
        setIsFilterSidebarOpen,
        isLoading,
        setIsLoading,
        isSettingsOpen,
        setIsSettingsOpen,
        savingQuery,
        setSavingQuery,
        emailFilters,
        setEmailFilters,
        emailLogFilters,
        setEmailLogFilters,
        emailTaskFilters,
        setEmailTaskFilters,
      }}
    >
      {children}
    </EmailManagementContext.Provider>
  );
};

export default EmailManagementContextProvider;
