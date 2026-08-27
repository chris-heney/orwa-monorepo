import React from 'react'
import { Identifier } from 'react-admin'

export type TabValue = 'summary' | 'watersystems' | 'associates' | 'memberships' | 'membership-items' | 'invoices'

/** Permanent / persisted list filter values for react-admin `List` `filter` prop. */
export type MembershipFilterValues = Record<string, unknown>

export interface IMembershipContextProvider {
    selectedTab: TabValue
    setSelectedTab: React.Dispatch<React.SetStateAction<TabValue>>
    isFilterSidebarOpen: boolean
    setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    watersystemFilters: MembershipFilterValues
    setWatersystemFilters: React.Dispatch<React.SetStateAction<MembershipFilterValues>>
    associateFilters: MembershipFilterValues
    setAssociateFilters: React.Dispatch<React.SetStateAction<MembershipFilterValues>>
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
    invoicesFilters: MembershipFilterValues
    setInvoicesFilters: React.Dispatch<React.SetStateAction<MembershipFilterValues>>
    /** Hide invoices that already have a payment_date. Persisted via RaStore / user prefs. */
    hideMarkedPayments: boolean
    setHideMarkedPayments: React.Dispatch<React.SetStateAction<boolean>>
    membershipExtraFilters: MembershipFilterValues
    setMembershipExtraFilters: React.Dispatch<React.SetStateAction<MembershipFilterValues>>
    membershipFilters: MembershipFilterValues
    setMembershipFilters: React.Dispatch<React.SetStateAction<MembershipFilterValues>>
    isSettingsOpen: boolean
    setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
    savingQuery: boolean
    setSavingQuery: React.Dispatch<React.SetStateAction<boolean>>
    isGridView: boolean
    setIsGridView: React.Dispatch<React.SetStateAction<boolean>>
}
