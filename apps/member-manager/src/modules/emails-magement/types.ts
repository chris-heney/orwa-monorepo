import React from 'react'

    export type TabValue = 'emails' | 'email-templates' | 'scheduled-email-tasks' | 'email-logs' | 'email-settings'

export interface IEmailManagementContextProvider {
    selectedTab: TabValue
    setSelectedTab: React.Dispatch<React.SetStateAction<TabValue>>
    isFilterSidebarOpen: boolean
    setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    isSettingsOpen: boolean
    setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
    savingQuery: boolean
    setSavingQuery: React.Dispatch<React.SetStateAction<boolean>>
    emailFilters: React.ReactElement | React.ReactElement[]
    setEmailFilters: React.Dispatch<React.SetStateAction<React.ReactElement | React.ReactElement[]>>
    emailLogFilters: React.ReactElement | React.ReactElement[]
    setEmailLogFilters: React.Dispatch<React.SetStateAction<React.ReactElement | React.ReactElement[]>>
    emailTaskFilters: React.ReactElement | React.ReactElement[]
    setEmailTaskFilters: React.Dispatch<React.SetStateAction<React.ReactElement | React.ReactElement[]>>
}