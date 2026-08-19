import { IAwardNominationPayload, StrapiFormattedFile } from "../types/types";
import orwaLogo from '/orwa.webp'
// Test image file for demonstration
const testImageFile: StrapiFormattedFile = {
    rawFile: new File([orwaLogo], 'orwa_logo.webp', { type: 'image/webp' }),
    src: '/uploads/orwa_1234567890.webp',
    title: 'ORWA Logo for testing',
    cacheId: 'orwa_1234567890'
};

// Test PDF file for nomination documents
const testPdfFile: StrapiFormattedFile = {
    rawFile: new File(['test pdf content'], 'nomination_document.pdf', { type: 'application/pdf' }),
    src: '/uploads/nomination_1234567890.pdf',
    title: 'Award Nomination Supporting Document',
    cacheId: 'nomination_1234567890'
};

export const testPayload: IAwardNominationPayload = {
    // Nominee Information
    nominee_name: 'John Michael Rodriguez',
    email: 'john.rodriguez@ruralwater.com',
    daytime_phone: '(405) 555-0123',
    address: '123 Main Street',
    city: 'Norman',
    state: 'Oklahoma',
    zip: '73069',
    county: 'Cleveland',

    // Nominator Information
    nominator_first_name: 'Maria',
    nominator_last_name: 'Chen',
    nominator_address: '456 Boardwalk Ave',
    nominator_address_2: '',
    nominator_city: 'Norman',
    nominator_state: 'Oklahoma',
    nominator_zip: '73072',
    nominator_country: 'United States',
    nominator_phone: '(405) 555-0199',
    nominator_email: 'maria.chen@ruralwater.com',
    
    // System Information
    system_name: 'Norman Rural Water District #1',
    watersystem: 42,
    operation_start_date: '2018-03-15',
    employment_date: '2015-06-01',
    
    // Employee Counts
    current_members: 1250,
    beginning_members: 1100,
    clerical_employees: 2,
    operation_maintenance_employees: 4,
    management_employees: 1,
    
    // Nomination Details
    nomination_description: 'John Rodriguez has demonstrated exceptional leadership and dedication to the Norman Rural Water District #1 over the past 8 years. As the Operations Manager, he has implemented innovative water treatment processes that improved water quality by 15% while reducing operational costs by 20%. His commitment to safety has resulted in zero workplace accidents for the past 3 years. John has also been instrumental in securing $2.5M in infrastructure grants and has mentored 3 new operators who have all successfully obtained their certifications. His community involvement includes organizing annual water conservation workshops and serving on the local emergency response team. John\'s expertise in water system management and his dedication to serving the community make him an exemplary candidate for the Operator of the Year award.',
    award_type: 'System of the Year',
    award_year: 2024,

    biography_method: 'Copy/Paste or Type Biography',
    biography_text: 'John has served rural water systems for over a decade.',
    biography_file: null,
    photographs: [testImageFile],
    board_list_method: 'File You Upload',
    board_list_file: testPdfFile,
    board_members: [{ first: 'Jane', last: 'Board', title: 'Chair' }],
    
    // Documents
    supporting_documents: [testImageFile, testPdfFile],
    nomination_pdf: null,
    
    // Status
    nomination_status: 'Submitted',
    submission_date: '2024-01-15T10:30:00Z',
    
    // Admin options
    // adminOptions: {
    //     registrantNotification: true,
    //     adminNotification: true,
    //     customEmail: 'admin@orwa.org',
    //     resubmit: false
    // }
}