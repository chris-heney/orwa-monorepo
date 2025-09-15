import { Identifier } from 'react-admin'
import IConference from './IConference'

export interface IConferenceAttendeeRecord {
  conference: number
  contact: number
}

export interface IConferenceAttendeeDraft {
  conference: IConference
  contact: IContact
}

// Related interfaces (minimal definitions; adjust as necessary)
export interface IContact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // Add additional contact fields if needed
}


export interface IFieldMeta {
  id: number;
  field: string;
  value: string;
  // Add additional field meta fields if needed
}

export interface IConferenceTicket {
  id: number;
  conferences: IConference[];
  price_online: number;
  price_event: number;
  name: string;
  description: string;
  includes: any[]; // Ideally, replace with a more specific type (e.g., IConferenceExtra)
  excludes: any[]; // Ideally, replace with a more specific type (e.g., IConferenceExtra)
  context: 'Attendee' | 'Contestant' | 'Vendor';
}

// Main interface for Conference Attendee
export interface IConferenceAttendee {
  id: number;
  contact: IContact;                  
  conference: IConference;           
  year: number;
  registration:  Identifier
  wp_eid: number;
  passport_id: number;
  training_type: 'None' | 'Both' | 'Operator' | 'Board';
  organization: string;
  email: string;
  phone: string;
  qr_url: string;
  license: string;
  first: string;
  last: string;
  type: string;
  title: string;
  items: IFieldMeta[];                  // Repeatable component items
  orwa_voting_status: 'Non Voting' | 'Voting Delegate' | 'Voting Alternate';
  orwaag_voting_status: 'Non Voting' | 'Voting Delegate' | 'Voting Alternate';
  speaker: boolean;
  conference_ticket: IConferenceTicket
}
