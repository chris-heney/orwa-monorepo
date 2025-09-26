export const testScholarshipPayload = {
  // Personal Data
  applicant_first_name: "Jane",
  applicant_middle_name: "Marie",
  applicant_last_name: "Doe",
  applicant_phone: "(555) 123-4567",
  applicant_email: "jane.doe@example.com",
  applicant_street: "123 Main Street",
  applicant_city: "Oklahoma City",
  applicant_state: "Oklahoma",
  applicant_zip: "73101",

  // Eligibility
  watersystem_id: 1, // Assuming water system ID 1 exists
  relationship: "Self",
  eligible_participant_id: null,
  eligible_participant_title: "Water System Manager",

  // High School Data
  school_name: "Oklahoma City High School",
  graduation_date: "2023-05-15",
  school_street: "456 School Ave",
  school_city: "Oklahoma City",
  school_state: "Oklahoma",
  school_zip: "73102",
  high_school_gpa: 3.8,
  sat_score: 1250,
  act_score: 28,
  transcript: null, // File would be uploaded
  test_scores: null, // File would be uploaded

  // College Data
  first_year_higher_education: true,
  credits_completed: 15,
  credits_required: 120,
  college_gpa: 3.9,
  education_type: "FourYearCollege",
  major: "Environmental Engineering",

  // Awards
  awards_recognition: "National Honor Society, Dean's List, Student Council President",

  // Recommendations
  recommender1_first_name: "John",
  recommender1_last_name: "Smith",
  recommender1_email: "john.smith@school.edu",
  recommender1_phone: "(555) 234-5678",
  recommendation_letter_1: null, // File would be uploaded
  recommender2_first_name: "Sarah",
  recommender2_last_name: "Johnson",
  recommender2_email: "sarah.johnson@company.com",
  recommender2_phone: "(555) 345-6789",
  recommendation_letter_2: null, // File would be uploaded

  // Financial Aid
  financial_aid_1_institution: "State University",
  financial_aid_1_amount: 5000,
  financial_aid_2_institution: "",
  financial_aid_2_amount: 0,

  // Uploads
  essay: null, // File would be uploaded
  biography: null, // File would be uploaded
  photograph: null, // File would be uploaded

  // Certification
  age_18_or_older: true,
  applicant_certification: true,
  applicant_certification_date: "2024-01-15",
  guardian_first_name: "",
  guardian_last_name: "",
  guardian_certification: false,
  guardian_certification_date: ""
};


