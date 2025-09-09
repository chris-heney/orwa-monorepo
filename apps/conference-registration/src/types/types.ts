import { Dispatch, SetStateAction } from "react";

export interface IStep {
  label: string;
  component: React.ReactNode;
}

/**
 * Types will have 3 states
 *
 * - Option: The type of the payload that is expected
 *            e.g. BoothOption, TicketOption, ExtraOption
 *
 * - Payload: The type of the payload that is expected
 *            e.g. BoothPayload, TicketPayload, ExtraPayload
 *
 * - Self:
 *            e.g. Booth, Ticket, Extra
 */

export type Identifier = number;

export interface Membership {
  id: string;
  name: string;
  description?: string;
  price: number;
  context: "Watersystem" | "Associate"; // Enum-like context options
  membership_items?: {
    data: MembershipItem[];
  };
}

export interface MembershipItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  max_price?: number;
  max_purchasable?: number;
  min_purchasable?: number;
  memberships?: Membership[]; // Relation to Membership
}

export interface IAssociateOption {
  membership: {
    data: Membership[];
  };
  id: Identifier;
  name: string;
  category?:
    | "Accountant"
    | "Attorneys Bond Counsel"
    | "Automated Controls"
    | "Automatic Flushing"
    | "Automatic Meter Reading"
    | "Automotive Dealer"
    | "CNG"
    | "Car Dealership"
    | "Commercial"
    | "Communications"
    | "Community Service"
    | "Computers and Software"
    | "Construction"
    | "Consulting Service"
    | "Control Valve Sales and Service"
    | "Damage Prevention"
    | "Distributor"
    | "Electric Motor and Pump Repair"
    | "Electronic Fusion"
    | "Engineer"
    | "Environmental Service"
    | "Equipment Service Rental and Sales"
    | "Financial Service"
    | "Flow Meters"
    | "GIS"
    | "GPS Mapping and Survey Equipment"
    | "Geophysical Water Well Logging"
    | "Government Accounting Software"
    | "Health Care"
    | "Insurance"
    | "Lagoon Cleanouts"
    | "Landscape and Lawn Care"
    | "Manufacturer"
    | "Manufactures Rep"
    | "Mechanical/Plumbing and Maintenance"
    | "Meter and Automation"
    | "Meters and Meter Reading Equipment"
    | "Motor Carriers"
    | "Motor and Pump Repair"
    | "Municipal Services"
    | "Non-Destructive Testing"
    | "Oil Field Construction"
    | "Oilfield Flowback Services"
    | "Oilfield Service Company"
    | "Other"
    | "Painting and Coatings"
    | "Pumps"
    | "Rail Car Maintenance and Repair"
    | "Ranching"
    | "Residential and Industrial"
    | "Roofing"
    | "SCADA/Telemetry"
    | "Sales Representative"
    | "Sales Representatives"
    | "Sanitary Sewer Evaluation Services"
    | "Software and Supplies"
    | "Storage Tanks"
    | "Suppliers"
    | "Tank Inspection"
    | "Tank Maintenance"
    | "Training"
    | "Truck Equipment"
    | "Valves"
    | "Vehicles"
    | "Water Analysis"
    | "Water Metering"
    | "Water Meters"
    | "Water Operator Training"
    | "Water Tanks"
    | "Water Treatment"
    | "Water Well Drilling and Pump Installation"
    | "Website Provider"
    | "Welding/Fabrication";
  member_level?: "None" | "Basic" | "Bronze" | "Silver" | "Gold" | "Platinum";
  website?: string;
  logo?: {
    data: StoredStrapiFile[];
  };
  phone: string;
  total_years: number;
  email: string;
  contact_primary: {
    data: IContactPayload;
  };
  contact_secondary: {
    data: IContactPayload;
  };
  mailing_address_street: string;
  mailing_address_city: string;
  mailing_address_state: string;
  mailing_address_zip: string;
  address_street: string;
  address_city: string;
  address_state:
    | "Alabama"
    | "Alaska"
    | "Arizona"
    | "Arkansas"
    | "California"
    | "Colorado"
    | "Connecticut"
    | "Delaware"
    | "Florida"
    | "Georgia"
    | "Hawaii"
    | "Idaho"
    | "Illinois"
    | "Indiana"
    | "Iowa"
    | "Kansas"
    | "Kentucky"
    | "Louisiana"
    | "Maine"
    | "Maryland"
    | "Massachusetts"
    | "Michigan"
    | "Minnesota"
    | "Mississippi"
    | "Missouri"
    | "Montana"
    | "Nebraska"
    | "Nevada"
    | "New Hampshire"
    | "New Jersey"
    | "New Mexico"
    | "New York"
    | "North Carolina"
    | "North Dakota"
    | "Ohio"
    | "Oklahoma"
    | "Oregon"
    | "Pennsylvania"
    | "Rhode Island"
    | "South Carolina"
    | "South Dakota"
    | "Tennessee"
    | "Texas"
    | "Utah"
    | "Vermont"
    | "Virginia"
    | "Washington"
    | "West Virginia"
    | "Wisconsin"
    | "Wyoming";
  address_zip?: string;
  membership_directory_type: "Digital" | "Mail" | "Both" | "None";
  payment_last_date?: string;
  payment_method?: "Card" | "eCheck" | "Invoice";
  payment_amount?: number;
  fee_membership?: number;
  fee_scholarship?: number;
  payment_details?: string;
  wp_uid?: number;
  wp_eid?: number;
  application_date?: string;
  directory_mailed?: boolean;
  primary_ad?: { data: StoredStrapiFile };
  payment_previous_date?: string;
  directory_sent_date?: string;
}

export interface StrapiFormattedFile {
  rawFile: File;
  src: string;
  title: string;
}

export interface FormattedStoredStrapiFile extends StrapiFormattedFile {
  id: Identifier;
}

export interface StoredStrapiFile {
  id: Identifier;
  name: string;
  url: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
  formats: {
    thumbnail: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
    };
  };
}

export interface IRegistrationOptions {
  setRegistrationOptions?: React.Dispatch<
    React.SetStateAction<IRegistrationOptions>
  >;
  AllConferenceOptions: IConference[];
  AssociateOptions: IAssociateOption[];
  ExtraOptions: IExtraOption[];
  SponsorshipOptions: ISponsorshipOption[];
  TicketOptions: ITicketOption[];
  ConferenceOptions: IConference;
  WatersystemOptions: IWatersystemOption[];
  RegistrationAddons: IExtraOption[];
  isLoading: boolean;
}

export default interface IWatersystemOption {
  id: number;
  name: string;
  region: "Region 1" | "Region 2" | "Region 3" | "Region 4";
  office_hours: string;
  meters: number;
  url: string;
  board_meeting: string;
  funding: boolean;
  orwaag: boolean;
  workmans_comp: boolean;
  contacts: IContactPayload[];
  county:
    | "Adair"
    | "Alfalfa"
    | "Atoka"
    | "Beaver"
    | "Beckham"
    | "Blaine"
    | "Bryan"
    | "Caddo"
    | "Canadian"
    | "Carter"
    | "Cherokee"
    | "Choctaw"
    | "Cimarron"
    | "Cleveland"
    | "Coal"
    | "Comanche"
    | "Cotton"
    | "Craig"
    | "Creek"
    | "Custer"
    | "Delaware"
    | "Dewey"
    | "Ellis"
    | "Garfield"
    | "Garvin"
    | "Grady"
    | "Grant"
    | "Greer"
    | "Harmon"
    | "Harper"
    | "Haskell"
    | "Hughes"
    | "Jackson"
    | "Jefferson"
    | "Johnston"
    | "Kay"
    | "Kingfisher"
    | "Kiowa"
    | "Latimer"
    | "LeFlore"
    | "Lincoln"
    | "Logan"
    | "Love"
    | "Major"
    | "Marshall"
    | "Mayes"
    | "McClain"
    | "McCurtain"
    | "McIntosh"
    | "Murray"
    | "Muskogee"
    | "Noble"
    | "Nowata"
    | "Okfuskee"
    | "Oklahoma"
    | "Okmulgee"
    | "Osage"
    | "Ottawa"
    | "Pawnee"
    | "Payne"
    | "Pittsburg"
    | "Pontotoc"
    | "Pottawatomie"
    | "Pushmataha"
    | "Roger Mills"
    | "Rogers"
    | "Seminole"
    | "Sequoyah"
    | "Stephens"
    | "Texas"
    | "Tillman"
    | "Tulsa"
    | "Wagoner"
    | "Washington"
    | "Washita"
    | "Woods"
    | "Woodward";
  total_years: number;
  member_type: "RWC" | "RWD" | "TN";
  system_type_dirty:
    | "Puchased"
    | "Pur/Sew"
    | "Pur/Sew/Sur"
    | "Pur/Sew/Sur/Well"
    | "Pur/Sew/Sur/Wells"
    | "Pur/Sew/Wells"
    | "Pur/Sewer"
    | "Pur/Sur/Wells"
    | "Pur/Wells"
    | "Purased"
    | "Purc/Sew"
    | "Purch/Sew/Wells"
    | "Purch/Sewer"
    | "Purch/Surf"
    | "Purch/Surface"
    | "Purch/Well"
    | "Purch/Wells"
    | "Purchase"
    | "Purchased"
    | "Purchased/Sewer"
    | "Purchased/Surface"
    | "Purchased/surface"
    | "Sew/Sur"
    | "Sew/Surf"
    | "Sew/Wells"
    | "Sewer"
    | "Sewer Only"
    | "Sewer/Surf/Purchased"
    | "Sewer/Surface"
    | "Sewer/Wells"
    | "Surf/Wells"
    | "Surf/Wells/P"
    | "Surface"
    | "Surface/Purchased"
    | "Surface/Purchased/Sewer"
    | "Surface/Sew"
    | "Surface/Sewer"
    | "Surface/Wells"
    | "Surface/Wells/Purchased/Sewer"
    | "Surface/Wells/Sewer"
    | "Surfaced/Pur"
    | "Well/Pur/Sew"
    | "Wells"
    | "Wells/Purchased"
    | "Wells/Purchased/Sewer"
    | "Wells/Sewer"
    | "WellsPurch/Sew/Wells"
    | "purchased"
    | "wells";
  email: string;
  phone: string;
  fax: string;
  address_mailing_pobox: string;
  address_mailing_city: string;
  address_mailing_state: string;
  address_mailing_zip: string;
  address_physical_line1: string;
  address_physical_city: string;
  address_physical_state: string;
  address_physical_zip: string;
  annual_report_type: "Digital" | "Mail" | "Both" | "None";
  membership_directory_type: "Digital" | "Mail" | "Both" | "None";
  payment_last_date: Date;
  payment_method: "Card" | "eCheck" | "Invoice";
  payment_amount: number;
  payment_details: string;
  wp_uid: number;
  wp_eid: number;
  application_date: Date;
  directory_sent_date: Date;
}

export interface IConferenceDraft {
  name: string;
  year: number;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  // sponsors: IConferenceSponsor[]
  organizer: IContactPayload;
}

export type conferenceStatus =
  | "Online Registration"
  | "Online Registration Closed"
  | "Kiosk Registration"
  | "Coming Soon"
  | "Archived"
  | "Closed";

export interface IConference extends IConferenceDraft {
  id: number;
  venue: IConferenceVenue;
  booths_available: number;
  purchasable_booths: number;
  booth_price: number;
  training_hours_available: number;
  booth_price_2: number;
  non_member_fee: number;
  attendee_price: number;
  vendor_price: number;
  closed_message: string;
  status:
    | "Online Registration"
    | "Online Registration Closed"
    | "Kiosk Registration"
    | "Coming Soon"
    | "Archived"
    | "Closed";
  available_contestants: number;
  logo: {
    data: {
      url: string;
    };
  };
}

export type IConferenceVenue = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export interface IAddress {
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface IPaymentDataPayload {
  billingAddress: IAddress;
  cardNumber: string;
  expirationDate: string;
  cardCode: string;
  amount: number;
}

interface IConferenceTicket {
  id: number | Identifier;
  name: string;
  description: string;
  conferences: number[] | IConference[];
  price_online: number;
  price_event: number;
  includes: number[] | IExtraOption[];
  excludes: number[] | IExtraOption[];
}

export interface IConferenceOption {
  name: string;
  description: string;
  price_online: number;
  price_event: number;
  conferences: number[] | IConference[];
  included: number[] | IConferenceTicket[];
  excluded: number[] | IConferenceTicket[];
}

interface TextChild {
  bold?: boolean;
  underline?: boolean;
  text: string;
  type: "text";
  italic?: boolean;
  strikethrough?: boolean;
}

export interface ParagraphBlock {
  type: "paragraph";
  children: TextChild[];
}

export interface ISponsorshipOption {
  id: Identifier;
  name: string;
  description: string;
  available: number;
  amount: number;
  max_purchasable: number;
}

export interface IExtraOption {
  context: "Booth" | "Attendee" | "Registration" | "Contestant";
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
  order: number
}

export interface RegistrationAddon {
  context: "Booth" | "Attendee" | "Vendor" | "Contestants";
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
  conference: Identifier;
  description: string;
}

export interface ISponsorPayload {
  id?: Identifier;
  name: string;
  description: string;
  available: number;
  amount: number;
}

export interface IContactPayload {
  first: string;
  last: string;
  email: string;
  phone: string;
}

export type ticketType = "Attendee" | "Vendor" | "Guest" | "Contestant";

export interface ITicketOption {
  id: Identifier;
  name: string;
  price_online: number;
  price_event: number;
  description: string;
  includes: IExtraOption[];
  excludes: IExtraOption[];
  context: ticketType;
}

export interface ITicketPayload {
  participating_in_demo: boolean; // only for expo conference
  first: string;
  last: string;
  email: string;
  phone: string;
  license?: string;
  training_type?: "None" | "Both" | "Operator" | "Board";
  type: ticketType;
  price: number;
  extras: Identifier[];
  ticket_type: ITicketOption;
  [key: string]: unknown;
}

export interface IBoothOption {
  price1: number;
  price2?: number;
}

export interface IBoothPayload {
  subtotal: number;
  associate: Identifier;
  extras: Identifier[];
}

export interface IContestantPayload {
  first: string;
  last: string;
  email: string;
  phone: string;
  type: "Golfer" | "Fisher";
  conference_ticket: ITicketOption;
  team: string;
  fee: number;
  extras: IExtraOption[];
}

export interface entryPayload {
  createdAt: Date;
  id: number;
  resource: string;
  data: IRegistrationPayload;
}

export interface IRegistrationPayload {
  adminOptions?: AdminOptions;
  type: "Attendee" | "Vendor" | null;
  conference: Identifier;
  year: number;
  registrant: IContactPayload;
  tickets: ITicketPayload[] | [];
  booths: IBoothPayload[] | [];
  sponsors: ISponsorPayload[] | [];
  registrationAddonIds: Identifier[] | [];
  registrationExtrasIds: Identifier[] | [];
  passport_id?: number; // will be set via query param IF there is one.
  registrationType: "Vendor" | "Attendee" | null;
  organization: string; // in case they are an agency
  associate?: Identifier | null;
  watersystem?: Identifier | null;
  paymentType: "Card" | "Invoice";
  paymentData: IPaymentDataPayload;
  member_status: "Member" | "Non Member" | "";
  submitted: boolean;
  agency: string;
  online?: boolean;
  error?: boolean;
  contestants: IContestantPayload[] | [];
  team?: string;
}

export interface EntryPayloadContext {
  entryPayload: IRegistrationPayload | null;
  setEntryPayload: Dispatch<SetStateAction<IRegistrationPayload | null>>;
}

export interface ExtraDetailsContext {
  extraDetails: string;
  setExtraDetails: Dispatch<SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface UserContext {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  isAdminView: boolean;
  setIsAdminView: Dispatch<SetStateAction<boolean>>;
  viewingEntries: boolean;
  setViewingEntries: Dispatch<SetStateAction<boolean>>;
}

export interface TicketIndexContext {
  ticketIndex: number;
  setTicketIndex: Dispatch<SetStateAction<number>>;
}

export interface BoothIndexContext {
  boothIndex: number;
  setBoothIndex: Dispatch<SetStateAction<number>>;
}
export interface IRegistrationResponse extends IRegistrationPayload {
  result: "success" | "failure";
  id?: Identifier; // if successful
  transaction_id?: string; // if successful
  payment_method?: string; // if successful
}

export interface PayloadContext {
  registrationPayload: IRegistrationPayload;
  setRegistrationPayload: Dispatch<SetStateAction<PayloadContext>>;
  setPayloadBooths: Dispatch<SetStateAction<IBoothPayload[] | null>>;
  updateCheckoutTotal: (checkoutTotal: number, type: "add" | "sub") => void;
  setPayloadAttendees: Dispatch<SetStateAction<ITicketPayload[] | null>>;
  setPayloadSponsors: Dispatch<SetStateAction<ISponsorshipOption[] | null>>;
  setRegistrationExtras: Dispatch<SetStateAction<IExtraOption[] | null>>;
  setPayloadContestants: Dispatch<SetStateAction<IContestantPayload[] | null>>;
}

export interface EmailPayload {
  to: string;
  from: string;
  html: string;
  subject: string;
}


export interface AdminOptions {
  registrantNotification: true;
  adminNotification: true;
  customEmail: "";
  resubmit: true;
}

export const defaultPayload: IRegistrationPayload = {
  type: null,
  conference: 1,
  year: new Date().getFullYear(),
  registrant: {
    // first: "Marcos",
    // last: "Jimenez",
    // email: "Marcosje2005@gmail.com",
    // phone: "4694129135",
  } as IContactPayload,
  tickets: [],
  booths: [],
  sponsors: [],
  registrationExtrasIds: [],
  registrationAddonIds: [],
  passport_id: undefined,
  registrationType: null,
  organization: "",
  associate: null,
  watersystem: null,
  paymentType: "Invoice",
  paymentData: {
    billingAddress: {
      address: "",
      city: "",
      state: "Oklahoma",
      zip: "",
    },
    amount: 0,
  } as IPaymentDataPayload,
  member_status: "",
  submitted: false,
  agency: "",
  online: false,
  error: false,
  contestants: [],
};

export const testContestantPayload = {
  type: null,
  year: 2025,
  error: false,
  agency: "",
  booths: [],
  online: false,
  tickets: [
    {
      last: "Palmer",
      type: "Attendee",
      email: "dewayne@stilwellutilities.com",
      first: "Harold",
      phone: "(918) 696-5084",
      price: 250,
      extras: [2, 3, 4, 5, 7, 8, 9, 40],
      license: "91429",
      ticket_type: {
        id: 1,
        name: "Full Registration",
        context: "Attendee",
        createdAt: "2024-01-17T08:22:41.936Z",
        updatedAt: "2025-01-07T20:30:39.794Z",
        description: null,
        price_event: 300,
        price_online: 250,
      },
      training_type: "Operator",
    },
    {
      last: "James",
      type: "Attendee",
      email: "filtration@stilwellutilities.com",
      first: "Nathan ",
      phone: "(918) 410-2321",
      price: 250,
      extras: [2, 3, 4, 5, 7, 8, 9, 40],
      license: "96358",
      ticket_type: {
        id: 1,
        name: "Full Registration",
        context: "Attendee",
        createdAt: "2024-01-17T08:22:41.936Z",
        updatedAt: "2025-01-07T20:30:39.794Z",
        description: null,
        price_event: 300,
        price_online: 250,
      },
      training_type: "Operator",
    },
  ],
  sponsors: [],
  associate: null,
  submitted: false,
  conference: 1,
  registrant: {
    last: "Palmer",
    email: "dewayne@stilwellutilities.com",
    first: "Harold",
    phone: "(918) 696-5084",
  },
  contestants: [],
  paymentData: {
    amount: 500,
    cardCode: null,
    cardNumber: null,
    billingAddress: {
      zip: "74960",
      city: "Stilwell",
      state: "Oklahoma",
      address: "P.O. Box 1512",
    },
    expirationDate: null,
  },
  paymentType: "Card",
  watersystem: null,
  nonMemberFee: false,
  organization: "Stilwell Area Development Authority",
  member_status: "",
  selectedAddons: [1],
  registrationType: null,
  registration_type: "Attendee",
  registrationExtras: [1],
  registrationSource: "online",
  showContestantsStep: true,
};

export const testPayloadVendor = {
  conference: 1,
  year: 2025,
  registrant: {
    first: "Marcos",
    last: "Jimenez",
    email: "marcosje2005@gmail.com",
    phone: "(469) 412-9135",
  },
  booths: [
    {
      extras: [10, 11],
      subtotal: 690,
    },
    {
      extras: [10],
      subtotal: 340,
    },
  ],
  sponsors: [],
  registrationExtras: [36],
  passport_id: 12345,
  registrationType: "Attendee",
  organization: "Marcos Crop",
  associate: null,
  watersystem: null,
  paymentType: "Invoice",
  paymentData: {
    billingAddress: {
      address: "311 Pecan Hollow Dr",
      city: "Coppell",
      state: "Texas",
      zip: "75019",
    },
    card: "4111 1111 1111 1111",
    exp: "12/25",
    cvv: "123",
    amount: 5600,
  },
  submitted: false,
  online: true,
  error: false,
  contestants: [],
  address: "",
  city: "",
  zip: "",
  state: "Oklahoma",
  card: "",
  exp: "",
  cvv: "",
  member_status: "Non Member",
  billing_email: "",
  billing_phone: "",
  billing_first_name: "",
  billing_last_name: "",
  address_billing_line1: "",
  address_billing_city: "",
  address_billing_state: "",
  address_billing_zip: "",
  registration_type: "Vendor",
  tickets: [
    {
      first: "Marcos",
      last: "Jimenez",
      email: "anonymous+MarcosJimenez@orwa.org",
      phone: "(469) 412-9135",
      type: "Vendor",
      price: 0,
      extras: [3, 4, 5, 9],
      ticket_type: {
        id: 4,
        name: "Vendor",
        createdAt: "2024-01-18T07:42:57.000Z",
        updatedAt: "2025-01-09T23:20:37.765Z",
        description: null,
        price_online: 75,
        price_event: 125,
        context: "Vendor",
      },
    },
    {
      first: "Marcos",
      last: "Jimenez",
      email: "Marcosje2005@gmail.com",
      phone: "(469) 412-9135",
      type: "Vendor",
      price: 0,
      extras: [3, 4, 5, 9],
      ticket_type: {
        id: 4,
        name: "Vendor",
        createdAt: "2024-01-18T07:42:57.000Z",
        updatedAt: "2025-01-09T23:20:37.765Z",
        description: null,
        price_online: 75,
        price_event: 125,
        context: "Vendor",
      },
    },
  ],
  agency: "false",
};

export const testPayloadAttendee = {
  conference: 1,
  year: 2025,
  registrant: {
    first: "Marcos",
    last: "Jimenez",
    email: "marcosje2005@gmail.com",
    phone: "(469) 412-9135",
  },
  booths: [],
  sponsors: [],
  registrationExtras: [],
  passport_id: 12345,
  registrationType: "Attendee",
  organization: "Marcos Crop",
  associate: null,
  watersystem: null,
  paymentType: "Invoice",
  paymentData: {
    billingAddress: {
      address: "311 Pecan Hollow Dr",
      city: "Coppell",
      state: "Texas",
      zip: "75019",
    },
    card: "4111 1111 1111 1111",
    exp: "12/25",
    cvv: "123",
    amount: 5600,
  },
  submitted: false,
  online: true,
  error: false,
  contestants: [],
  address: "",
  city: "",
  zip: "",
  state: "Oklahoma",
  card: "",
  exp: "",
  cvv: "",
  member_status: "Non Member",
  billing_email: "",
  billing_phone: "",
  billing_first_name: "",
  billing_last_name: "",
  address_billing_line1: "",
  address_billing_city: "",
  address_billing_state: "",
  address_billing_zip: "",
  registration_type: "Attendee",
  tickets: [
    {
      first: "Marcos",
      last: "Jimenez",
      email: "anonymous+MarcosJimenez@orwa.org",
      phone: "(469) 412-9135",
      type: "Attendee",
      price: 250,
      extras: [2, 3, 4, 5, 7, 8, 9],
      ticket_type: {
        id: 1,
        name: "Full Registration",
        createdAt: "2024-01-17T08:22:41.936Z",
        updatedAt: "2025-01-09T23:20:25.293Z",
        description: null,
        price_online: 250,
        price_event: 300,
        context: "Attendee",
      },
      training_type: "None",
    },
  ],
};

export const testVendorSponsor = {
  conference: 1,
  year: 2025,
  registrant: {
    first: "Marcos",
    last: "Jimenez",
    email: "marcosje2005@gmail.com",
    phone: "(469) 412-9135",
  },
  booths: [
    {
      extras: [],
      subtotal: 600,
    },
    {
      extras: [11],
      subtotal: 350,
    },
  ],
  sponsors: [
    {
      id: 24,
      name: "Lanyards",
      description: "Lanyard Sponsor",
      amount: 1000,
      available: 1,
      createdAt: "2024-12-10T14:36:13.335Z",
      updatedAt: "2024-12-10T14:36:13.335Z",
      max_purchasable: 1,
    },
    {
      id: 26,
      name: "Vendor Social",
      description: "Vendor Social Sponsor",
      amount: 3500,
      available: 1,
      createdAt: "2024-12-10T14:37:29.856Z",
      updatedAt: "2024-12-10T14:39:00.863Z",
      max_purchasable: 1,
    },
    {
      id: 28,
      name: "Break",
      description: "Break Sponsor",
      amount: 1500,
      available: 2,
      createdAt: "2024-12-10T14:38:46.538Z",
      updatedAt: "2025-01-13T23:55:53.444Z",
      max_purchasable: 3,
    },
    {
      id: 28,
      name: "Break",
      description: "Break Sponsor",
      amount: 1500,
      available: 2,
      createdAt: "2024-12-10T14:38:46.538Z",
      updatedAt: "2025-01-13T23:55:53.444Z",
      max_purchasable: 3,
    },
  ],
  registrationExtras: [],
  passport_id: 12345,
  registrationType: "Attendee",
  organization: "Micro-Comm Inc",
  associate: null,
  watersystem: null,
  paymentType: "Invoice",
  paymentData: {
    billingAddress: {
      address: "311 Pecan Hollow Dr",
      city: "Coppell",
      state: "Texas",
      zip: "75019",
    },
    card: "",
    exp: "",
    cvv: "",
    amount: 5600,
  },
  submitted: false,
  online: true,
  error: false,
  contestants: [],
  address: "",
  city: "",
  zip: "",
  state: "Oklahoma",
  member_status: "Member",
  billing_email: "",
  billing_phone: "",
  billing_first_name: "",
  billing_last_name: "",
  address_billing_line1: "",
  address_billing_city: "",
  address_billing_state: "",
  address_billing_zip: "",
  registration_type: "Vendor",
  tickets: [
    {
      first: "Marcos.",
      last: "Jimenez",
      email: "anonymous+Marcos.Jimenez@orwa.org",
      phone: "(469) 412-9135",
      type: "Vendor",
      price: 0,
      extras: [3, 4, 5, 9],
      ticket_type: {
        id: 4,
        name: "Vendor",
        createdAt: "2024-01-18T07:42:57.000Z",
        updatedAt: "2025-01-13T22:54:14.930Z",
        description: null,
        price_online: 75,
        price_event: 125,
        context: "Vendor",
      },
    },
    {
      first: "Marcos",
      last: "Jimenez",
      email: "anonymous+MarcosJimenez@orwa.org",
      phone: "(469) 412-9135",
      type: "Vendor",
      price: 0,
      extras: [3, 4, 5, 9],
      ticket_type: {
        id: 4,
        name: "Vendor",
        createdAt: "2024-01-18T07:42:57.000Z",
        updatedAt: "2025-01-13T22:54:14.930Z",
        description: null,
        price_online: 75,
        price_event: 125,
        context: "Vendor",
      },
    },
    {
      first: "Marcos",
      last: "Jimenez Enero",
      email: "anonymous+MarcosJimenezEnero@orwa.org",
      phone: "(469) 412-9135",
      type: "Vendor",
      price: 0,
      extras: [3, 4, 5, 9],
      ticket_type: {
        id: 4,
        name: "Vendor",
        createdAt: "2024-01-18T07:42:57.000Z",
        updatedAt: "2025-01-13T22:54:14.930Z",
        description: null,
        price_online: 75,
        price_event: 125,
        context: "Vendor",
      },
    },
  ],
  agency: null,
  logo: [
    {
      id: 2522,
      rawFile: {},
      src: "http://localhost:1337/uploads/quick_shot_logo_3465b8f742.png",
      title: "quick-shot-logo.png",
    },
  ],
};
