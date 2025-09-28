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
  graduation_date: string;
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
  transcript: any;
  test_scores: any;

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
  recommendation_letter_1: any;
  recommender2_first_name: string;
  recommender2_last_name: string;
  recommender2_name?: {
    first: string;
    last: string;
  };
  recommender2_email: string;
  recommender2_phone: string;
  recommendation_letter_2: any;

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
  essay: any;
  biography: any;
  photograph: any;
  applicant_pdf?: any;

  // Certification
  age_confirm?: string;
  applicant_certification: boolean;
  applicant_certification_date: string;
  guardian_first_name?: string;
  guardian_last_name?: string;
  guardian_name?: {
    first: string;
    last: string;
  };
  guardian_certification?: boolean;
  guardian_certification_date?: string;

  // Admin options
  adminOptions?: {
    registrantNotification: boolean;
    adminNotification: boolean;
    customEmail: string;
    resubmit: boolean;
  };
}
