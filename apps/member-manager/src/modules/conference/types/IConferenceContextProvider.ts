import React from 'react'
import IConferenceTicket from './IConferenceTicket'
import IConference from './IConference'

/**
 * What Conference Manager panels still read from the module context after the
 * layout-framework migration. Tab / resource / filter-sidebar / saved-query
 * state is owned by the framework (`PageShell`); `selectedTab`, `resource`,
 * `year` and `currentFilter` are DERIVED here (from `usePageManifest().tab`
 * and the `conference.selection` RaStore key) for the many consumers that
 * still read them.
 */
export interface IConferenceContextProvider {
    /** Active dashboard tab key (`'summary'` outside the dashboard). */
    selectedTab: TabValue | string
    /** List resource of the active tab (`''` when the tab has no real list). */
    resource: string
    /** Selected conference year. */
    year: number
    tickets: IConferenceTicket[]
    conferences: IConference[]
    /** Inline "Add …" form toggle — scoped to the active tab. */
    isCreating: boolean
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
    /**
     * Selected conference / year in the active tab's filter shape
     * (`conference` or `conferences: [id]`) — form defaults read it.
     */
    currentFilter: Record<string, any>
}
export type TabValue = 'summary' | 'edit' | 'registrations' | 'attendees' | 'booths' | 'contestants' | 'sponsors' | 'tickets' | 'extras' | 'schedule' | 'sponsorships' | 'teams' | 'tools' | 'addons' | 'taste test' | 'feedback'
