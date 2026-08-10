import React, { PropsWithChildren, createContext, useContext, useState } from 'react';
import { useStore } from 'react-admin';
import { ISoonerwarnApplication } from './types';

export type SoonerwarnTabValue = 'soonerwarn map' | 'soonerwarn applications' | 'applications' | 'needs assistance';

// Define the context interface
interface ISoonerwarnContextProvider {
  selectedTab: SoonerwarnTabValue;
  setSelectedTab: React.Dispatch<React.SetStateAction<SoonerwarnTabValue>>;
  isFilterSidebarOpen: boolean;
  setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isActivitySidebarOpen: boolean;
  setIsActivitySidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEmailSidebarOpen: boolean;
  setIsEmailSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resource: string | null;
  setResource: React.Dispatch<React.SetStateAction<string | null>>;
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  selectedApplication: ISoonerwarnApplication | null;
  setSelectedApplication: React.Dispatch<React.SetStateAction<ISoonerwarnApplication | null>>;
  selectedRequestedStatuses: string[];
  setSelectedRequestedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
}

// Create a default context
export const SoonerwarnContext = createContext<ISoonerwarnContextProvider>({
  selectedTab: 'applications',
  setSelectedTab: () => {},
  isFilterSidebarOpen: false,
  setIsFilterSidebarOpen: () => {},
  isSettingsOpen: false,
  setIsSettingsOpen: () => {},
  isActivitySidebarOpen: false,
  setIsActivitySidebarOpen: () => {},
  isEmailSidebarOpen: false,
  setIsEmailSidebarOpen: () => {},
  resource: null,
  setResource: () => {},
  isCreating: false,
  setIsCreating: () => {},
  selectedStatuses: [],
  setSelectedStatuses: () => {},
  selectedApplication: null,
  setSelectedApplication: () => {},
  selectedRequestedStatuses: [],
  setSelectedRequestedStatuses: () => {},
});

// Custom hook to access the SoonerwarnContext
export const useSoonerwarnContext = () => useContext(SoonerwarnContext);

// SoonerwarnContextProvider component
const SoonerwarnContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [selectedTab, setSelectedTab] = useStore<SoonerwarnTabValue>('soonerwarn-tab-value', 'soonerwarn applications');

  // Sidebar states
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useStore(
    "soonerwarn-filter-sidebar-open",
    false
  );
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  const [isEmailSidebarOpen, setIsEmailSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedRequestedStatuses, setSelectedRequestedStatuses] = useState<string[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ISoonerwarnApplication | null>(null);

  // Resource state
  const [resource, setResource] = useStore<string | null>('soonerwarn-resource', null);

  return (
    <SoonerwarnContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        isFilterSidebarOpen,
        setIsFilterSidebarOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isActivitySidebarOpen,
        setIsActivitySidebarOpen,
        isEmailSidebarOpen,
        setIsEmailSidebarOpen,
        resource,
        setResource,
        isCreating,
        setIsCreating,
        selectedStatuses,
        setSelectedStatuses,
        selectedApplication,
        setSelectedApplication,
        selectedRequestedStatuses,
        setSelectedRequestedStatuses,
      }}
    >
      {children}
    </SoonerwarnContext.Provider>
  );
};

export default SoonerwarnContextProvider;