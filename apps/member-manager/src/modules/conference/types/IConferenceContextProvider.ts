import React, { ReactElement } from 'react'
import IConferenceTicket from './IConferenceTicket'
import IConference from './IConference'


export interface IConferenceContextProvider {
    year: number
    setYear: React.Dispatch<React.SetStateAction<number>>   
    selectedTab: TabValue
    setSelectedTab: React.Dispatch<React.SetStateAction<TabValue>>
    tickets: IConferenceTicket[]
    conferences: IConference[]
    isFilterSidebarOpen: boolean
    setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    resource: string
    setResource: React.Dispatch<React.SetStateAction<string>>
    isCreating: boolean
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
    searchFilter: ReactElement | ReactElement[]
    setSearchFilter: React.Dispatch<React.SetStateAction<ReactElement | ReactElement[]>>
    savingQuery: boolean,
    setSavingQuery: React.Dispatch<React.SetStateAction<boolean>>
    tabFilters: Record<string, any>
    setTabFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>
    tabSorts: Record<string, any>
    setTabSorts: React.Dispatch<React.SetStateAction<Record<string, any>>>
    currentFilter: Record<string, any>
}
export type TabValue = 'summary' | 'edit' | 'registrations' | 'attendees' | 'booths' | 'contestants' | 'sponsors' | 'tickets' | 'extras' | 'schedule' | 'sponsorships' | 'teams' | 'tools' | 'addons'
  