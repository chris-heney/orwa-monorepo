import { AdminOptions } from "../../membership-forms/types";

export interface IContactEntity {
  id: number;
  documentId?: string;
  first: string;
  last: string;
  email: string;
  phone?: string;
  title?: string;
  user?: number;
  passport?: string | number | null;
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

export interface IScholarshipApplicationPayload {
  applicant_email: string;
  applicant_first_name: string;
  applicant_middle_name?: string;
  applicant_last_name: string;
  applicant_phone: string;
  applicant_street: string;
  applicant_city: string;
  applicant_state: string;
  applicant_zip: string;

  watersystem?: number | string | null;
  watersystem_id?: number | string | null;
  system_name?: string;
  relationship: "Self" | "DependentChild" | "DependentGrandchild";
  eligible_participant_name?: ScholarshipName;
  eligible_participant_title: string;
  eligible_participant_phone?: string;
  eligible_participant_email?: string;
  eligible_participant_address?: ScholarshipAddress;

  school_name: string;
  graduation_date: string;
  school_address?: ScholarshipAddress;
  gpa?: number;
  high_school_gpa?: number;
  sat_score?: number;
  act_score?: number;
  transcript?: unknown;
  test_scores?: unknown;

  first_year?: string;
  credits_completed: number;
  credits_required: number;
  college_gpa: number;
  education_type: "FourYearCollege" | "TwoYearCollege" | "VocationalSchool";
  major?: string;
  awards?: string;

  recommender1_name?: ScholarshipName;
  recommender1_email: string;
  recommender1_phone: string;
  recommendation_letter_1?: unknown;
  recommender2_name?: ScholarshipName;
  recommender2_email: string;
  recommender2_phone: string;
  recommendation_letter_2?: unknown;

  financial_resources?: Array<{
    institution?: string;
    amount?: number;
  }>;
  financial1_institution?: string;
  financial1_amount?: number;
  financial2_institution?: string;
  financial2_amount?: number;

  essay?: unknown;
  biography?: unknown;
  photograph?: unknown;
  applicant_pdf?: unknown;

  age_confirm?: string;
  applicant_certification: boolean;
  applicant_certification_date: string;
  guardian_name?: ScholarshipName;
  guardian_certification?: boolean;
  guardian_certification_date?: string;

  adminOptions?: AdminOptions;
}

export interface IAwardNominationPayload {
  nominee_name: string;
  system_name: string;
  watersystem?: number | string | null;
  watersystem_id?: number | string | null;
  county: string;
  address: string;
  city: string;
  state?: string;
  zip: string;
  daytime_phone: string;
  email: string;
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
  operation_start_date?: string;
  employment_date?: string;
  current_members?: number;
  beginning_members?: number;
  clerical_employees?: number;
  operation_maintenance_employees?: number;
  management_employees?: number;
  nomination_description: string;
  award_type:
    | "System of the Year"
    | "Water/Wastewater System of the Year"
    | "Excellence in Operations"
    | "Excellence in Management"
    | "Excellence in Office Operations";
  biography_method?: string;
  biography_text?: string;
  biography_file?: unknown;
  photographs?: unknown;
  board_list_method?: string;
  board_list_file?: unknown;
  board_members?: unknown;
  supporting_documents?: unknown;
  nomination_pdf?: unknown;
  award_year?: number;
  adminOptions?: AdminOptions;
}
