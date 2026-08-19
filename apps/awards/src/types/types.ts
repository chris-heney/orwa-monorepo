import { Dispatch, SetStateAction } from "react";

export interface FormSubmittedContext {
  isFormSubmitted: boolean;
  setIsFormSubmitted: Dispatch<SetStateAction<boolean>>;
}

export interface IStep {
  label: string;
  key: string;
  component: React.ReactNode;
  active: boolean;
}

export default interface IWatersystemOption {
  id: number | string;
  documentId?: string;
  name: string;
  legal_entity_name?: string;
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
  system_type_dirty: string;
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

export interface IContactPayload {
  first?: string;
  last?: string;
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

export interface StrapiFormattedFile {
  rawFile: File;
  src: string;
  title: string;
  cacheId?: string; // ID for cached file in IndexedDB
}

export type Identifier = number;

export interface entryPayload {
  createdAt: Date;
  id: number;
  resource: string;
  data: IAwardNominationPayload;
}

export interface EntryPayloadContext {
  entryPayload: IAwardNominationPayload | null;
  setEntryPayload: Dispatch<SetStateAction<IAwardNominationPayload | null>>;
}

export interface IAwardNominationFormPayload {
  awardNominationFormPayload: IAwardNominationPayload;
  setAwardNominationFormPayload: Dispatch<SetStateAction<IAwardNominationPayload>>;
}

// Define award nomination payload interface
export interface IAwardNominationPayload {
  // Nominee Information
  nominee_name: string;
  email: string;
  daytime_phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  county?: string;
  
  // Nominator Information
  nominator_first_name?: string;
  nominator_last_name?: string;
  nominator_address?: string;
  nominator_address_2?: string;
  nominator_city?: string;
  nominator_state?: string;
  nominator_zip?: string;
  nominator_country?: string;
  nominator_phone?: string;
  nominator_email?: string;

  // System Information
  system_name: string;
  watersystem?: number | string;
  operation_start_date?: string | null;
  employment_date?: string | null;
  
  // Employee Counts
  current_members?: number;
  beginning_members?: number;
  clerical_employees?: number;
  operation_maintenance_employees?: number;
  management_employees?: number;
  
  // Nomination Details
  nomination_description: string;
  award_type:
    | "System of the Year"
    | "Water/Wastewater System of the Year"
    | "Excellence in Operations"
    | "Excellence in Management"
    | "Excellence in Office Operations";
  award_year?: number;

  // Biography / Photos / Board list (GF 70)
  biography_method?:
    | "Copy/Paste or Type Biography"
    | "Upload Biography"
    | "";
  biography_text?: string;
  biography_file?: StrapiFormattedFile[] | StrapiFormattedFile | null;
  photographs?: StrapiFormattedFile[] | null;
  board_list_method?: "File You Upload" | "Keyed In List" | "";
  board_list_file?: StrapiFormattedFile[] | StrapiFormattedFile | null;
  board_members?: { first: string; last: string; title: string }[];

  // Documents
  supporting_documents?: StrapiFormattedFile[] | null;
  nomination_pdf?: StrapiFormattedFile | null;
  
  // Status
  nomination_status?: 'Draft' | 'Submitted' | 'Under Review' | 'Winner' | 'Runner Up' | 'Not Selected';
  accepted_terms?: unknown[];
  submission_date?: string | null;
  
  // Admin options
  adminOptions?: AdminOptions;
}

export interface AdminOptions {
  registrantNotification: boolean;
  adminNotification: boolean;
  customEmail: string;
  resubmit: boolean;
}

export interface IContactEntity {
  id: number;
  first: string;
  last: string;
  email: string;
  phone?: string;
  title?: string;
  user?: number;
  passport?: string;
}

export interface EmailPayload {
  to: string;
  from: string;
  html: string;
  subject: string;
}