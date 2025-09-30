import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useGetList } from 'react-admin';

export type TabValue = 'summary' | 'nominations' | 'under-review' | 'winners' | 'not-selected';

interface AwardNominationContextType {
  selectedTab: TabValue;
  setSelectedTab: (value: TabValue) => void;
  statusFilter: string[];
  setStatusFilter: (statuses: string[]) => void;
  awardTypeFilter: string[];
  setAwardTypeFilter: (types: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isFilterSidebarOpen: boolean;
  setIsFilterSidebarOpen: (open: boolean) => void;
  isActivitySidebarOpen: boolean;
  setIsActivitySidebarOpen: (open: boolean) => void;
  isEmailSidebarOpen: boolean;
  setIsEmailSidebarOpen: (open: boolean) => void;
  totalNominations: number;
  pendingCount: number;
  winnersCount: number;
  notSelectedCount: number;
  underReviewCount: number;
}

const AwardNominationContext = createContext<AwardNominationContextType | undefined>(undefined);

export const useAwardNominationContext = () => {
  const context = useContext(AwardNominationContext);
  if (!context) {
    throw new Error('useAwardNominationContext must be used within AwardNominationContextProvider');
  }
  return context;
};

interface AwardNominationContextProviderProps {
  children: ReactNode;
}

export const AwardNominationContextProvider: React.FC<AwardNominationContextProviderProps> = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState<TabValue>('nominations');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [awardTypeFilter, setAwardTypeFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  const [isEmailSidebarOpen, setIsEmailSidebarOpen] = useState(false);

  // Get nomination counts
  const { data: allNominations } = useGetList('award-nominations', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'id', order: 'ASC' },
  });

  const totalNominations = allNominations?.length || 0;
  const pendingCount = allNominations?.filter(nom => nom.nomination_status === 'Submitted').length || 0;
  const winnersCount = allNominations?.filter(nom => nom.nomination_status === 'Winner').length || 0;
  const notSelectedCount = allNominations?.filter(nom => nom.nomination_status === 'Not Selected').length || 0;
  const underReviewCount = allNominations?.filter(nom => nom.nomination_status === 'Under Review').length || 0;

  const value = {
    selectedTab,
    setSelectedTab,
    statusFilter,
    setStatusFilter,
    awardTypeFilter,
    setAwardTypeFilter,
    searchTerm,
    setSearchTerm,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    isActivitySidebarOpen,
    setIsActivitySidebarOpen,
    isEmailSidebarOpen,
    setIsEmailSidebarOpen,
    totalNominations,
    pendingCount,
    winnersCount,
    notSelectedCount,
    underReviewCount,
  };

  return (
    <AwardNominationContext.Provider value={value}>
      {children}
    </AwardNominationContext.Provider>
  );
};
