type Identifier = number;

export interface IContactEntity {
  id: number;
  first: string;
  last: string;
  email: string;
  phone: string;
  contact_type:
    | "associate"
    | "watersystem"
    | "instructor"
    | "staff"
    | "administrator";
  title?: string;
  license?: string;
  user: number;
  passport: number | null;
}

export interface IAttendeeEntity {
  id?: number;
  conference: number;
  year: number;
  registration: number;
  first: string;
  last: string;
  type: string; // Based on ticket type
  contact: number;
  passport_id?: number; // Based on Contact ID
  training_type: "None" | "Both" | "Operator" | "Board";
  organization: string; // Based on registration_type: Attendee: Organization, Vendor: Association
  email: string; // Based on Contact, if not available, use the email from the registration
  phone: string; // Based on Contact, if not available, use the phone from the registration
  license?: string;
  items?: IExtraEntity[];
  conference_ticket: Identifier;
  orwa_voting_status?: string;
  orwaag_voting_status?: string;
  title?: string;
  speaker?: string;
  promotional_emails?: boolean;
}

export interface ITicketOption {
  id: Identifier;
  attributes: any;
  name: string;
  price_online: number;
  price_event: number;
  description: string;
  includes: IExtraEntity[];
  excludes: IExtraEntity[];
  context: "Attendee" | "Vendor" | "Contestant";
}

export interface IExtraOption {
  context: "Booth" | "Attendee" | "Registration" | "Contestants";
  id: any;
  max_qty_each: number;
  extra: Identifier; // To enable a relationship that will define if it is counted on the summary.
  name: string;
  quantity: number;
  amount: number;
  price_online: number;
  price_event: number;
  max_qty: number;
  counted: boolean;
  details: string;
  included: {
    data: ITicketOption[];
  };
  excluded: {
    data: ITicketOption[];
  };
  conference: Identifier;
  description: string;
}

export interface ITicketPayload {
  participating_in_demo: boolean; // only for expo conference
  first: string;
  last: string;
  email: string;
  phone: string;
  license?: string;
  training_type?: "None" | "Both" | "Operator" | "Board";
  type: "Attendee" | "Vendor" | "Guest";
  price: number;
  extras: number[];
  ticket_type: ITicketOption;
  [key: string]: unknown;
}

export interface IBoothMeta {
  id?: number;
  key: string;
  value: string;
  label: string;
  type: string;
}

export interface IBoothEntity {
  id?: number;
  conference: number;
  year: number;
  registration: number;
  organization: string;
  subtotal: number;
  wp_eid: number;
  items?: IBoothMeta[];
}

export interface IRegistrationEntity {
  conference: number;
  year: number;
  registration_date: Date;
  registrant: number;
  total: number;
  payment_method: string;
  booths?: number[];
  sponsors?: number[];
}

export interface ISponsorEntity {
  id: Identifier;
  name: string;
  description: string;
  available: string;
  amount: number;
}

export interface IExtraEntity {
  item: Identifier;
  context: "booth" | "attendee";
  id: any;
  max_qty_each: number;
  extra: Identifier; // To enable a relationship that will define if it is counted on the summary.
  name: string;
  quantity: number;
  amount: number;
  price_online: number;
  price_event: number;
  max_qty: number;
  counted: boolean;
  included: Identifier[];
  excluded: Identifier[];
  conference: Identifier;
}

export interface IExtraEntityRaw extends IAttendeeEntity {
  included: ITicketOption[];
  excluded: ITicketOption[];
}

// orwa-strapi  | - Authorize.Net Response { messages: { resultCode: 'Error', message: [ [Object] ] } }

export interface IAuthNetResponse {
  messages: {
    resultCode: string;
    message: {
      code: string;
      text: string;
    }[];
  };
  transactionResponse: {
    authCode: string;
    transId: string;
    networkTransId: string;
  };
  responseCode: string;
}

export const state_map = [
  { Alabama: "AL" },
  { Alaska: "AK" },
  { Arizona: "AZ" },
  { Arkansas: "AR" },
  { California: "CA" },
  { Colorado: "CO" },
  { Connecticut: "CT" },
  { Delaware: "DE" },
  { Florida: "FL" },
  { Georgia: "GA" },
  { Hawaii: "HI" },
  { Idaho: "ID" },
  { Illinois: "IL" },
  { Indiana: "IN" },
  { Iowa: "IA" },
  { Kansas: "KS" },
  { Kentucky: "KY" },
  { Louisiana: "LA" },
  { Maine: "ME" },
  { Maryland: "MD" },
  { Massachusetts: "MA" },
  { Michigan: "MI" },
  { Minnesota: "MN" },
  { Mississippi: "MS" },
  { Missouri: "MO" },
  { Montana: "MT" },
  { Nebraska: "NE" },
  { Nevada: "NV" },
  { "New Hampshire": "NH" },
  { "New Jersey": "NJ" },
  { "New Mexico": "NM" },
  { "New York": "NY" },
  { "North Carolina": "NC" },
  { "North Dakota": "ND" },
  { Ohio: "OH" },
  { Oklahoma: "OK" },
  { Oregon: "OR" },
  { Pennsylvania: "PA" },
  { "Rhode Island": "RI" },
  { "South Carolina": "SC" },
  { "South Dakota": "SD" },
  { Tennessee: "TN" },
  { Texas: "TX" },
  { Utah: "UT" },
  { Vermont: "VT" },
  { Virginia: "VA" },
  { Washington: "WA" },
  { "West Virginia": "WV" },
  { Wisconsin: "WI" },
  { Wyoming: "WY" },
];
