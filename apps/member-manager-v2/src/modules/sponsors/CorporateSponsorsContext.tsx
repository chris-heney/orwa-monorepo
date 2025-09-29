import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CorporateSponsorsContextProps {
  isFilterSidebarOpen: boolean;
  toggleFilterSidebar: () => void;
  filters: {
    name?: string;
    active?: boolean;
  };
  setFilters: (filters: any) => void;
  savingQuery: boolean;
  setSavingQuery: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultContext: CorporateSponsorsContextProps = {
  isFilterSidebarOpen: false,
  toggleFilterSidebar: () => {},
  filters: {},
  setFilters: () => {},
  savingQuery: false,
  setSavingQuery: () => {},
};

export const CorporateSponsorsContext = createContext<CorporateSponsorsContextProps>(defaultContext);

export const useCorporateSponsorsContext = () => useContext(CorporateSponsorsContext);

interface CorporateSponsorsContextProviderProps {
  children: ReactNode;
}

export const CorporateSponsorsContextProvider = ({ children }: CorporateSponsorsContextProviderProps) => {
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const toggleFilterSidebar = () => {
    setIsFilterSidebarOpen(!isFilterSidebarOpen);
  };

  const [savingQuery, setSavingQuery] = useState(false);

  return (
    <CorporateSponsorsContext.Provider
      value={{
        isFilterSidebarOpen,
        toggleFilterSidebar,
        filters,
        setFilters,
        savingQuery,
        setSavingQuery,
      }}
    >
      {children}
    </CorporateSponsorsContext.Provider>
  );
}; 