import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useGetList } from 'react-admin';

export type TabValue = 'summary' | 'applications' | 'approved' | 'denied' | 'review';

interface ScholarshipContextType {
  selectedTab: TabValue;
  setSelectedTab: (value: TabValue) => void;
  statusFilter: string[];
  setStatusFilter: (statuses: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isFilterSidebarOpen: boolean;
  setIsFilterSidebarOpen: (open: boolean) => void;
  isActivitySidebarOpen: boolean;
  setIsActivitySidebarOpen: (open: boolean) => void;
  isEmailSidebarOpen: boolean;
  setIsEmailSidebarOpen: (open: boolean) => void;
  totalApplications: number;
  pendingCount: number;
  approvedCount: number;
  deniedCount: number;
  reviewCount: number;
}

const ScholarshipContext = createContext<ScholarshipContextType | undefined>(undefined);

export const useScholarshipContext = () => {
  const context = useContext(ScholarshipContext);
  if (!context) {
    throw new Error('useScholarshipContext must be used within ScholarshipContextProvider');
  }
  return context;
};

interface ScholarshipContextProviderProps {
  children: ReactNode;
}

export const ScholarshipContextProvider: React.FC<ScholarshipContextProviderProps> = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState<TabValue>('applications');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  const [isEmailSidebarOpen, setIsEmailSidebarOpen] = useState(false);

  // Get application counts
  const { data: allApplications } = useGetList('scholarship-applications', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'id', order: 'ASC' },
  });

  const totalApplications = allApplications?.length || 0;
  const pendingCount = allApplications?.filter(app => app.application_status === 'Submitted').length || 0;
  const approvedCount = allApplications?.filter(app => app.application_status === 'Approved').length || 0;
  const deniedCount = allApplications?.filter(app => app.application_status === 'Denied').length || 0;
  const reviewCount = allApplications?.filter(app => app.application_status === 'Under Review').length || 0;

  const value = {
    selectedTab,
    setSelectedTab,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    isActivitySidebarOpen,
    setIsActivitySidebarOpen,
    isEmailSidebarOpen,
    setIsEmailSidebarOpen,
    totalApplications,
    pendingCount,
    approvedCount,
    deniedCount,
    reviewCount,
  };

  return (
    <ScholarshipContext.Provider value={value}>
      {children}
    </ScholarshipContext.Provider>
  );
};
