import { Dispatch, SetStateAction } from "react";

export interface IStep {
  label: string;
  component: React.ReactNode;
  active: boolean;
}

export type Identifier = number;
// export interface IRegistrationOptions {
//   setRegistrationOptions?: React.Dispatch<React.SetStateAction<IRegistrationOptions>>
//   AllConferenceOptions: IConference[]
//   AssociateOptions: IAssociateOption[]
//   ExtraOptions: IExtraOption[]
//   SponsorshipOptions: ISponsorshipOption[]
//   TicketOptions: ITicketOption[]
//   ConferenceOptions: IConference
//   WatersystemOptions: IWatersystemOption[]
//   isLoading: boolean
// }

export interface entryPayload {
  createdAt: Date;
  id: number;
  resource: string;
  data: IGrantApplicationFormPayload;
}

export interface EntryPayloadContext {
  entryPayload: IGrantApplicationFormPayload | null;
  setEntryPayload: Dispatch<SetStateAction<IGrantApplicationFormPayload | null>>;
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

export interface IAddress {
  address: string;
  city: string;
  state: string;
  zip: string;
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
  title: string;
}

export interface ExtraDetailsContext {
  extraDetails: string;
  setExtraDetails: Dispatch<SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IGrant {
  name: string;
  status: string;
  reimbursement_type: string;
  opens: Date;
  closes: Date;
  type: IGrantType;
  grant_amount: number;
  funds_approved: number;
  funds_provided: number;
}

export interface IGrantType {
  id: number;
  name: string;
  description: string;
}

export interface IGrantApplicationFormPayload {
  additional_funding_requested: number;
  legal_entity_name: string;
  facility_id: string;
  population_served: number;
  county: string;
  physical_address_street: string;
  physical_address_line_two: string;
  physical_address_city: string;
  physical_address_state: string;
  physical_address_zip: string;
  physical_same_as_mailing: boolean;
  mailing_address_street: string;
  mailing_address_line_two: string;
  mailing_address_city: string;
  mailing_address_state: string;
  mailing_address_zip: string;
  point_of_contact: IContactPayload;
  chairman: IContactPayload;
  chairman_also_mayer_of_municipal_city: boolean;
  has_engineer: boolean;
  engineer: IContactPayload;
  drinking_or_wastewater: "Drinking Water" | "Wastewater";
  other_describe: string;
  description_justification_estimated_cost: string;
  combined_cost_of_projects: number;
  requested_grant_amount: number;
  minimum_utility_financial_contribution?: number;
  engineering_report: "Yes" | "No" | "N/A";
  report_approved_by_deq: string;
  engineering_report_deq_approved: "Yes" | "No";
  resolves_violation: string;
  signatory_name: string;
  signatory_title: string;
  signature: string;
  other_needs: string;
  change_order_request: "Yes" | "No";
  original_application_number: string;
  grant: Identifier;
  // committee_date: Date
  application_date: Date;
  status: Identifier;
  selected_projects: string[];
  proposals: StrapiFormattedFile[];
  uploaded_engineering_report: StrapiFormattedFile[];
  uploaded_notice_of_violation: StrapiFormattedFile[];
  uploaded_additional_files: StrapiFormattedFile[];
  satisfy_deq_issued_order: boolean;
  consent_order: StrapiFormattedFile;
  consent_order_number: string;
  money_set_aside: boolean;
  applied_to_other_loans: boolean;
  additional_information: string;
  lrsp_plan: boolean;
  more_info_lrsp: boolean;
}

export interface StrapiFormattedFile {
  rawFile: File;
  src: string;
  title: string;
  cacheId?: string; // ID for cached file in IndexedDB
}

export interface GrantApplicationPayloadContext {
  grantApplicationFormPayload: IGrantApplicationFormPayload;
  setGrantApplicationFormPayload: Dispatch<
    SetStateAction<IGrantApplicationFormPayload>
  >;
}

export interface FormSubmittedContext {
  isFormSubmitted: boolean;
  setIsFormSubmitted: Dispatch<SetStateAction<boolean>>;
}

export interface EmailPayload {
  to: string;
  from: string;
  html: string;
  subject: string;
}

export interface IScoringCriteria {
  id: number;
  order: string;
  label: string;
  project_type: {
    data : IProject
  };
}

export interface IProject {
  order: string
  id: number;
  name: string;
  description: string;
  classification: "Drinking Water" | "Wastewater";
}

export interface ProjectOptionsContext {
  drinkingWaterProjects: IProject[];
  wastewaterProjects: IProject[];
}
