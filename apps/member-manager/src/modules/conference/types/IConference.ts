import { Dispatch, SetStateAction } from 'react'
import IContact from '../../human-resources/contacts/types/IContact'
import IConferenceExtra from './IConferenceExtra'
import IConferenceSponsor from './IConferenceSponsor'
import { RaRecord } from 'react-admin'

export type IConferenceVenue = {
  street: string
  city: string
  state: string
  zip: string
}

export interface IConferenceDraft {
  name: string
  year: number
  description: string
  extras: IConferenceExtra[]
  startDate: string | Date
  endDate: string | Date
  sponsors: IConferenceSponsor[]
  organizer: IContact
  start_date: Date
}

export interface IConferenceRecord extends IConferenceDraft, RaRecord {
  id: number
  venue: number
}

export default interface IConference extends IConferenceDraft {
  status: string
  id: number
  venue: IConferenceVenue
}

export interface ISharedMeta {
  id?: number
  label: string
  value: string
  key: string
  /** Chosen option for extras with `requires_selection` (e.g. shirt size). */
  selection?: string | null
  item: IExtra | null
}

export interface IExtra {
  id: number
  name: string
  price_online: number
  price_event: number
  context: number[]
  excluded: number[]
  quantity_selection?: boolean | null
  min_qty_each?: number | null
  requires_selection?: boolean | null
  selection_name?: string | null
  selection_options?: string[] | null
  counted_by_selection?: boolean | null
}

export interface ConferenceBoothsProps {
  setMeta: Dispatch<SetStateAction<ISharedMeta[]>>
  context: string
  ticketType: string
  meta: ISharedMeta[]
}
