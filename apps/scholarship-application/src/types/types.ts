import { Dispatch, SetStateAction } from "react";

export type Identifier = number | string;

export interface IStep {
  label: string;
  key: string;
  component: React.ReactNode;
  active: boolean;
}

export interface ScholarshipName {
  first: string;
  last: string;
}

export interface ScholarshipAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface ScholarshipFinancialResource {
  institution: string;
  amount: number | "";
}

export interface IWatersystemOption {
  id: Identifier;
  documentId?: string;
  name: string;
  county?: string;
}

export interface StrapiFormattedFile {
  rawFile: File;
  src: string;
  title: string;
  cacheId?: string;
}

export interface AdminOptions {
  registrantNotification: boolean;
  adminNotification: boolean;
  customEmail: string;
  resubmit: boolean;
}

export interface IScholarshipApplicationPayload {
  applicant_first_name: string;
  applicant_middle_name?: string;
  applicant_last_name: string;
  applicant_phone: string;
  applicant_email: string;
  applicant_street: string;
  applicant_city: string;
  applicant_state: string;
  applicant_zip: string;

  system_name: string;
  watersystem?: Identifier | null;
  relationship: "Self" | "DependentChild" | "DependentGrandchild" | "";
  eligible_participant_name: ScholarshipName;
  eligible_participant_title: string;
  eligible_participant_phone: string;
  eligible_participant_email: string;
  eligible_participant_address: ScholarshipAddress;

  school_name: string;
  graduation_date: string;
  school_address: ScholarshipAddress;
  gpa: number | "";
  sat_score: number | "";
  act_score: number | "";
  transcript: StrapiFormattedFile[] | number | string | null;
  test_scores: StrapiFormattedFile[] | number | string | null;

  first_year: "Yes" | "No" | "";
  credits_completed: number | "";
  credits_required: number | "";
  college_gpa: number | "";
  education_type:
    | "FourYearCollege"
    | "TwoYearCollege"
    | "VocationalSchool"
    | "";
  major?: string;
  awards?: string;

  recommender1_name: ScholarshipName;
  recommender1_email: string;
  recommender1_phone: string;
  recommendation_letter_1: StrapiFormattedFile[] | number | string | null;
  recommender2_name: ScholarshipName;
  recommender2_email: string;
  recommender2_phone: string;
  recommendation_letter_2: StrapiFormattedFile[] | number | string | null;

  financial_resources: ScholarshipFinancialResource[];
  financial1_institution?: string;
  financial1_amount?: number | "";
  financial2_institution?: string;
  financial2_amount?: number | "";

  essay: StrapiFormattedFile[] | number | string | null;
  biography: StrapiFormattedFile[] | number | string | null;
  photograph: StrapiFormattedFile[] | number | string | null;
  applicant_pdf?: number | string | null;

  age_confirm: string;
  applicant_certification: boolean;
  applicant_certification_date: string;
  guardian_name?: ScholarshipName;
  guardian_certification?: boolean;
  guardian_certification_date?: string;

  accepted_terms?: unknown[];
  adminOptions?: AdminOptions;
}

export interface entryPayload {
  createdAt: Date;
  id: Identifier;
  resource: string;
  data: IScholarshipApplicationPayload;
}

export interface EntryPayloadContext {
  entryPayload: IScholarshipApplicationPayload | null;
  setEntryPayload: Dispatch<
    SetStateAction<IScholarshipApplicationPayload | null>
  >;
}

export interface ScholarshipApplicationPayloadContext {
  scholarshipApplicationFormPayload: IScholarshipApplicationPayload;
  setScholarshipApplicationFormPayload: Dispatch<
    SetStateAction<IScholarshipApplicationPayload>
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

export default IWatersystemOption;
