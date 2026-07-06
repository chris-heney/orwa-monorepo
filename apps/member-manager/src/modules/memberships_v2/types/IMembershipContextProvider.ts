import React, { ReactElement } from 'react'
import { Identifier } from 'react-admin'

export type TabValue = 'summary' | 'watersystems' | 'associates' | 'memberships' | 'membership-items' | 'invoices'

export interface IMembershipContextProvider {
    selectedTab: TabValue
    setSelectedTab: React.Dispatch<React.SetStateAction<TabValue>>
    isFilterSidebarOpen: boolean
    setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    watersystemFilters: ReactElement | ReactElement[]
    setWatersystemFilters: React.Dispatch<React.SetStateAction<ReactElement | ReactElement[]>>
    associateFilters: ReactElement | ReactElement[]
    setAssociateFilters: React.Dispatch<React.SetStateAction<ReactElement | ReactElement[]>>
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    isContactModalOpen: boolean
    setIsContactModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    /** Merged into the create-contact form when opening “Add Contact” from membership flows. */
    contactCreateDefaultValues: Record<string, unknown>
    setContactCreateDefaultValues: React.Dispatch<
        React.SetStateAction<Record<string, unknown>>
    >
    contactEditId: Identifier | null
    setContactEditId: React.Dispatch<React.SetStateAction<Identifier | null>>
    /** When set, saving a new contact from the modal also attaches it to this water system (show view "+"). */
    linkNewContactToWatersystemId: Identifier | null
    setLinkNewContactToWatersystemId: React.Dispatch<
        React.SetStateAction<Identifier | null>
    >
    invoicesFilters: ReactElement | ReactElement[]
    setInvoicesFilters: React.Dispatch<React.SetStateAction<ReactElement | ReactElement[]>>
    membershipExtraFilters: ReactElement | ReactElement[]
    setMembershipExtraFilters: React.Dispatch<React.SetStateAction<ReactElement | ReactElement[]>>
    membershipFilters: ReactElement | ReactElement[]
    setMembershipFilters: React.Dispatch<React.SetStateAction<ReactElement | ReactElement[]>>
    isSettingsOpen: boolean
    setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
    savingQuery: boolean
    setSavingQuery: React.Dispatch<React.SetStateAction<boolean>>
    isGridView: boolean
    setIsGridView: React.Dispatch<React.SetStateAction<boolean>>
}