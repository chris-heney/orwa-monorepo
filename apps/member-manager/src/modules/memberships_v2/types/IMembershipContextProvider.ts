import React from 'react'
import { Identifier } from 'react-admin'

/**
 * What the memberships module still shares through React context after the
 * layout-framework migration: the contact create / edit modals used by the
 * water-system and associate forms and the water-system show page. Tab,
 * header, filter-sidebar and list-filter state now live in the framework
 * (`PageShell` + `ListScope`) and react-admin list params.
 */
export interface IMembershipContextProvider {
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
}
