import React, { createContext, useContext, ReactNode } from 'react';
import { useStore } from 'react-admin';

interface FilterContextValue {
    // Filter state
    filters: Record<string, any>;
    setFilters: (filters: Record<string, any>) => void;
    
    // Sidebar state
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;
    
    // Search state
    searchValue: string;
    setSearchValue: (value: string) => void;
    
    // View state
    viewMode: 'list' | 'grid';
    setViewMode: (mode: 'list' | 'grid') => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

interface FilterProviderProps {
    children: ReactNode;
    resourceName: string;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children, resourceName }) => {
    // Use resource-specific keys for storing state
    const [filters, setFilters] = useStore<Record<string, any>>(`${resourceName}.filters`, {});
    const [sidebarOpen, setSidebarOpen] = useStore<boolean>(`${resourceName}.sidebarOpen`, true);
    const [sidebarWidth, setSidebarWidth] = useStore<number>(`${resourceName}.sidebarWidth`, 320);
    const [searchValue, setSearchValue] = useStore<string>(`${resourceName}.searchValue`, '');
    const [viewMode, setViewMode] = useStore<'list' | 'grid'>(`${resourceName}.viewMode`, 'list');

    const value: FilterContextValue = {
        filters,
        setFilters,
        sidebarOpen,
        setSidebarOpen,
        sidebarWidth,
        setSidebarWidth,
        searchValue,
        setSearchValue,
        viewMode,
        setViewMode,
    };

    return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilterProvider = (): FilterContextValue => {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useFilterProvider must be used within a FilterProvider');
    }
    return context;
};
