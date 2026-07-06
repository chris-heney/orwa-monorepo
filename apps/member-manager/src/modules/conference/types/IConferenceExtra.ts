import IConference from './IConference'
import IConferenceTicket from './IConferenceTicket'

export default interface IConferenceExtra {
  name: string
  description: string
  price_online: number
  price_event: number
  conferences: number[] | IConference[]
  included: number[] | IConferenceTicket[]
  excluded: number[] | IConferenceTicket[]
}