import { IScholarshipApplicationPayload, StrapiFormattedFile } from "../types/types";
import orwaLogo from '/orwa.webp';

// Test image file for demonstration
const testImageFile: StrapiFormattedFile = {
    rawFile: new File([orwaLogo], 'orwa_logo.webp', { type: 'image/webp' }),
    src: '/uploads/orwa_1234567890.webp',
    title: 'ORWA Logo for testing',
    cacheId: 'orwa_1234567890'
};

export const testPayload: IScholarshipApplicationPayload = {
    // Personal Data
    applicant_email: 'marcosje2005@gmail.com',
    applicant_first_name: 'Marcos',
    applicant_middle_name: '',
    applicant_last_name: 'Jimenez',
    applicant_phone: '(469) 412-9135',
    applicant_street: '311 Pecan Hollow Drive',
    applicant_city: 'Coppell',
    applicant_state: 'Texas',
    applicant_zip: '75019',
    
    // Eligibility
    watersystem: 1,
    // system_name: 'Coppell Water System',
    relationship: 'Self',
    eligible_participant_id: 1,
    eligible_participant_name: {
        first: 'Marcos',
        last: 'Jimenez'
    },
    eligible_participant_title: 'Water System Manager',
    eligible_participant_phone: '(469) 412-9135',
    eligible_participant_email: 'marcos.jimenez@coppellwater.com',
    eligible_participant_address: {
        street: '311 Pecan Hollow Drive',
        city: 'Coppell',
        state: 'Texas',
        zip: '75019'
    },
    
    // High School Data
    school_name: 'Coppell High School',
    graduation_date: '2023-05-15',
    school_street: '185 West Parkway Boulevard',
    school_city: 'Coppell',
    school_state: 'Texas',
    school_zip: '75019',
    school_address: {
        street: '185 West Parkway Boulevard',
        city: 'Coppell',
        state: 'Texas',
        zip: '75019'
    },
    high_school_gpa: 3.8,
    sat_score: 1250,
    act_score: 28,
    transcript: testImageFile,
    test_scores: [testImageFile],
    
    // College Data
    first_year: 'No',
    credits_completed: 60,
    credits_required: 120,
    college_gpa: 3.7,
    education_type: 'FourYearCollege',
    major: 'Environmental Engineering',
    
    // Awards
    awards: 'National Honor Society, Dean\'s List, Student Council President, Environmental Club Vice President, Academic Excellence Award, Science Fair Winner, Math Competition State Finalist',
    
    // Recommendations
    recommender1_first_name: 'Dr. Sarah',
    recommender1_last_name: 'Johnson',
    recommender1_name: {
        first: 'Dr. Sarah',
        last: 'Johnson'
    },
    recommender1_email: 'sarah.johnson@coppell.edu',
    recommender1_phone: '(469) 555-0123',
    recommendation_letter_1: testImageFile,
    
    recommender2_first_name: 'Michael',
    recommender2_last_name: 'Rodriguez',
    recommender2_name: {
        first: 'Michael',
        last: 'Rodriguez'
    },
    recommender2_email: 'michael.rodriguez@company.com',
    recommender2_phone: '(214) 555-0456',
    recommendation_letter_2: testImageFile,
    
    // Financial Data
    financial_aid_1_institution: 'University of Texas at Arlington',
    financial_aid_1_amount: 5000.00,
    financial_aid_2_institution: 'ORWA Foundation Scholarship',
    financial_aid_2_amount: 2500.00,
    financial1_institution: 'University of Texas at Arlington',
    financial1_amount: 5000.00,
    financial2_institution: 'ORWA Foundation Scholarship',
    financial2_amount: 2500.00,
    
    // Essay and Documents
    essay: testImageFile,
    biography: testImageFile,
    photograph: testImageFile,
    
    // Certification
    age_confirm: 'Yes, I am 18 years or older',
    applicant_certification: true,
    applicant_certification_date: '2024-01-15',
    guardian_first_name: 'Maria',
    guardian_last_name: 'Jimenez',
    guardian_name: {
        first: 'Maria',
        last: 'Jimenez'
    },
    guardian_certification: false,
    guardian_certification_date: null
}