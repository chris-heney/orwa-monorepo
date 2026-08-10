import { Identifier } from 'react-admin'
import { IGrantApplication } from '../grant-application/GrantApplicationTypes'
import { IGrant } from '../grants/components/GrantTypes'
import { Dayjs } from 'dayjs'
import type { SearchableTab } from '../helpers/searchBarTabs'

export type TabValue = 'summary' | 'edit' | 'applications' | 'grant' | 'payouts' | 'Admin Payouts' | 'application scores' | 'tokens' | 'map' 

export interface IGrantContextProvider {
    grants: IGrant[]
    grantIndex: number
    setGrantIndex: React.Dispatch<React.SetStateAction<number>>
    grantId: Identifier
    setGrantId: React.Dispatch<React.SetStateAction<Identifier>>
    /** Numeric PK for Strapi relation filters (grantId is documentId). */
    grantFilterId: Identifier
    setGrantFilterId: React.Dispatch<React.SetStateAction<Identifier>>
    from: Dayjs | null
    setFrom: React.Dispatch<React.SetStateAction<Dayjs | null>>
    to: Dayjs | null
    setTo: React.Dispatch<React.SetStateAction<Dayjs | null>>
    selectedTab: TabValue
    setSelectedTab: React.Dispatch<React.SetStateAction<TabValue>>
    application: IGrantApplication
    setApplication: React.Dispatch<React.SetStateAction<IGrantApplication>>
    godMode: boolean
    setGodMode: React.Dispatch<React.SetStateAction<boolean>>
    isFilterSidebarOpen: boolean
    setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    payoutStatusId: Identifier
    setPayoutStatusId: React.Dispatch<React.SetStateAction<Identifier>>
    applicationStatuses: string[]
    setApplicationStatuses: React.Dispatch<React.SetStateAction<string[]>>
    dashboardContext: 'create' | 'edit'
    setDashboardContext: React.Dispatch<React.SetStateAction<'create' | 'edit'>>
    isSettingsOpen: boolean
    setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
    isActivitySidebarOpen: boolean
    setIsActivitySidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    isEmailSidebarOpen: boolean
    setIsEmailSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    resource: string | null
    setResource: React.Dispatch<React.SetStateAction<string | null>>
    fiscalYearStart: string | null
    setFiscalYearStart: React.Dispatch<React.SetStateAction<string | null>>
    fiscalYearEnd: string | null
    setFiscalYearEnd: React.Dispatch<React.SetStateAction<string | null>>
    applicationSearchFilter: string
    setApplicationSearchFilter: (value: string) => void
    searchBarOpen: Record<SearchableTab, boolean>
    setSearchBarOpenForTab: (tab: SearchableTab, open: boolean) => void
    toggleSearchBarForTab: (tab: SearchableTab) => void
}
