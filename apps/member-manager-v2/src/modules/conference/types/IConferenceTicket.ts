import { Identifier, RaRecord } from 'react-admin'
import IConference from './IConference'
import IConferenceExtra from './IConferenceExtra'

export default interface IConferenceTicket extends RaRecord {
  id: number | Identifier
  name: string
  description: string
  conferences: number[] | IConference[]
  price_online: number
  price_event: number
  includes: number[] | IConferenceExtra[]
  excludes: number[] | IConferenceExtra[]
}