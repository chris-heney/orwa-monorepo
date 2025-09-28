import { Dispatch, SetStateAction } from "react";

export interface FormSubmittedContext {
  isFormSubmitted: boolean;
  setIsFormSubmitted: Dispatch<SetStateAction<boolean>>;
}

export interface IStep {
  label: string;
  component: React.ReactNode;
  active: boolean;
}

export default interface IWatersystemOption {
  id: number;
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

export interface StrapiFormattedFile {
  rawFile: File;
  src: string;
  title: string;
  cacheId?: string; // ID for cached file in IndexedDB
}


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
  data: IScholarshipApplicationPayload;
}

export interface EntryPayloadContext {
  entryPayload: IScholarshipApplicationPayload | null;
  setEntryPayload: Dispatch<SetStateAction<IScholarshipApplicationPayload | null>>;
}

export default interface IWatersystemOption {
  id: number;
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


export interface IScholarshipApplicationFormPayload {
  scholarshipApplicationFormPayload: IScholarshipApplicationPayload;
  setScholarshipApplicationFormPayload: Dispatch<SetStateAction<IScholarshipApplicationPayload>>;
}

// Define scholarship application payload interface
export interface IScholarshipApplicationPayload {
  // Personal Data (from contact relationship)
  applicant_email: string;
  applicant_first_name: string;
  applicant_middle_name?: string;
  applicant_last_name: string;
  applicant_phone: string;
  applicant_street: string;
  applicant_city: string;
  applicant_state: string;
  applicant_zip: string;

  // Eligibility
  watersystem: number;
  relationship: "Self" | "DependentChild" | "DependentGrandchild";
  eligible_participant_id?: number;
  eligible_participant_name?: {
    first: string;
    last: string;
  };
  eligible_participant_title: string;
  eligible_participant_phone?: string;
  eligible_participant_email?: string;
  eligible_participant_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  // Academic Data
  school_name: string;
  graduation_date: string | null;
  school_street: string;
  school_city: string;
  school_state: string;
  school_zip: string;
  school_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  high_school_gpa: number;
  sat_score: number;
  act_score: number;
  transcript: StrapiFormattedFile | null;
  test_scores: StrapiFormattedFile[] | null;

  // College Data
  first_year?: string;
  credits_completed: number;
  credits_required: number;
  college_gpa: number;
  education_type: "FourYearCollege" | "TwoYearCollege" | "VocationalSchool";
  major?: string;

  // Additional Info
  awards?: string;

  // Recommendations
  recommender1_first_name: string;
  recommender1_last_name: string;
  recommender1_name?: {
    first: string;
    last: string;
  };
  recommender1_email: string;
  recommender1_phone: string;
  recommendation_letter_1: StrapiFormattedFile | null;
  recommender2_first_name: string;
  recommender2_last_name: string;
  recommender2_name?: {
    first: string;
    last: string;
  };
  recommender2_email: string;
  recommender2_phone: string;
  recommendation_letter_2: StrapiFormattedFile | null;

  // Financial Aid
  financial_aid_1_institution?: string;
  financial_aid_1_amount?: number;
  financial_aid_2_institution?: string;
  financial_aid_2_amount?: number;
  financial1_institution?: string;
  financial1_amount?: number;
  financial2_institution?: string;
  financial2_amount?: number;

  // Uploads
  essay: StrapiFormattedFile | null;
  biography: StrapiFormattedFile | null;
  photograph: StrapiFormattedFile | null ;

  // Certification
  age_confirm?: string;
  applicant_certification: boolean;
  applicant_certification_date: string | null;
  guardian_first_name?: string;
  guardian_last_name?: string;
  guardian_name?: {
    first: string;
    last: string;
  };
  guardian_certification?: boolean;
  guardian_certification_date?: string | null;

  // Admin options  
  adminOptions?: AdminOptions;
}


export interface AdminOptions {
  registrantNotification: true;
  adminNotification: true;
  customEmail: "";
  resubmit: true;
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