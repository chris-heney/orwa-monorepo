export const scholarshipDefaultPayload = {
  // Personal Data (matching schema)
  applicant_first_name: '',
  applicant_middle_name: '',
  applicant_last_name: '',
  applicant_phone: '',
  applicant_email: '',
  applicant_street: '',
  applicant_city: '',
  applicant_state: 'Oklahoma',
  applicant_zip: '',

  // Eligibility (matching schema)
  watersystem_id: null,
  relationship: '',
  eligible_participant_id: null,
  eligible_participant_title: '',

  // High School Data (matching schema)
  school_name: '',
  graduation_date: '',
  school_street: '',
  school_city: '',
  school_state: 'Oklahoma',
  school_zip: '',
  high_school_gpa: '',
  sat_score: '',
  act_score: '',
  transcript: null,
  test_scores: null,

  // College Data (matching schema)
  first_year_higher_education: false,
  credits_completed: '',
  credits_required: '',
  college_gpa: '',
  education_type: '',
  major: '',

  // Awards (matching schema)
  awards_recognition: '',

  // Recommendations (matching schema)
  recommender1_first_name: '',
  recommender1_last_name: '',
  recommender1_email: '',
  recommender1_phone: '',
  recommendation_letter_1: null,
  recommender2_first_name: '',
  recommender2_last_name: '',
  recommender2_email: '',
  recommender2_phone: '',
  recommendation_letter_2: null,

  // Financial Data (matching schema)
  financial_aid_1_institution: '',
  financial_aid_1_amount: '',
  financial_aid_2_institution: '',
  financial_aid_2_amount: '',

  // Uploads (matching schema)
  essay: null,
  biography: null,
  photograph: null,

  // Certification (matching schema)
  age_18_or_older: false,
  applicant_certification: false,
  applicant_certification_date: '',
  guardian_first_name: '',
  guardian_last_name: '',
  guardian_certification: false,
  guardian_certification_date: ''
};
