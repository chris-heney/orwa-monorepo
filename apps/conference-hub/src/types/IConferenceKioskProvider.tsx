import type { JSX } from "react";

export type IConferenceVenue = {
    street: string
    city: string
    state: string
    zip: string
    name: string
}

export type conferenceStatus = "Online Registration" | "Online Registration Closed" | "Kiosk Registration" | "Coming Soon" | "Archived" | "Closed"

export interface IConference {
    id: number
    documentId?: string
    venue: IConferenceVenue | null
    booths_available: number
    booth_price: number
    brochure_link: string | null
    training_hours_available: number
    booth_price_2: number
    non_member_fee: number
    attendee_price: number
    vendor_price: number
    closed_message: string | null
    status: conferenceStatus
    name: string
    year: number
    description: string | null
    start_date: string 
    end_date: string
    online_registration_end: string | null
    logo: {
        url: string
    } | null
    booth_map : {
        url: string
    } | null
    attendee_information: ConferenceDetails[] | null
    vendor_information: ConferenceDetails[] | null
    conference_details: ConferenceDetails[] | null
}

interface ConferenceDetails {
    title: string
    description: string
    important: boolean
    order: number
    hidden: boolean
}

export interface ITab {
    name: string;
    show?: boolean;
    component: JSX.Element;
    external?: boolean;
    href?: string;
}

export interface IConferenceKioskProvider {
    conferenceId: string
    conference: IConference
    setConference: React.Dispatch<React.SetStateAction<IConference | undefined>>
    selectedTab: number
    setSelectedTab: React.Dispatch<React.SetStateAction<number>>
    isLoggedIn: boolean
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    tabs: ITab[]
    handleTabChange: (index: number) => void
    isAdminView: boolean
    setIsAdminView: React.Dispatch<React.SetStateAction<boolean>>
}

