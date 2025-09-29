import { IContact } from '../../training/_types';

export interface IScholarshipApplication {
  id?: number;
  // Contact Information
  contact?: IContact;
  watersystem?: {
    id: number;
    name: string;
  };
  application_status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Denied';
  submission_date?: string;
  review_notes?: string;
  
  // Applicant Information
  applicant_first_name: string;
  applicant_middle_name?: string;
  applicant_last_name: string;
  applicant_phone: string;
  applicant_email: string;
  applicant_street: string;
  applicant_city: string;
  applicant_state: string;
  applicant_zip: string;
  
  // System Information
  system_name: string;
  relationship: 'Self' | 'DependentChild' | 'DependentGrandchild';
  
  // Eligible Participant
  eligible_participant_name?: {
    first: string;
    middle?: string;
    last: string;
  };
  eligible_participant_title: string;
  eligible_participant_phone: string;
  eligible_participant_email: string;
  eligible_participant_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  
  // School Information
  school_name: string;
  graduation_date: string;
  school_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  
  // Academic Information
  gpa: number;
  sat_score: number;
  act_score: number;
  first_year: string;
  credits_completed: number;
  credits_required: number;
  college_gpa: number;
  education_type: 'FourYearCollege' | 'TwoYearCollege' | 'VocationalSchool';
  major?: string;
  awards?: string;
  
  // Recommenders
  recommender1_name?: {
    first: string;
    middle?: string;
    last: string;
  };
  recommender1_email: string;
  recommender1_phone: string;
  
  recommender2_name?: {
    first: string;
    middle?: string;
    last: string;
  };
  recommender2_email: string;
  recommender2_phone: string;
  
  // Financial Information
  financial1_institution?: string;
  financial1_amount?: number;
  financial2_institution?: string;
  financial2_amount?: number;
  
  // Files
  transcript?: StrapiFile;
  test_scores?: StrapiFile;
  recommendation_letter_1?: StrapiFile;
  recommendation_letter_2?: StrapiFile;
  essay?: StrapiFile;
  biography?: StrapiFile;
  photograph?: StrapiFile;
  applicant_pdf?: StrapiFile;
  
  // Certifications
  age_confirm: string;
  applicant_certification: boolean;
  applicant_certification_date: string;
  guardian_name?: {
    first: string;
    middle?: string;
    last: string;
  };
  guardian_certification?: boolean;
  guardian_certification_date?: string;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export interface StrapiFile {
  id: number;
  name: string;
  url: string;
  size?: number;
  mime?: string;
}

export interface IScholarshipFormPayload extends Partial<IScholarshipApplication> {
  // Form submission payload type
}
