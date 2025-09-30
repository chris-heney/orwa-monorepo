import { IAwardNominationPayload } from "../types/types";

export const awardDefaultPayload: IAwardNominationPayload = {
  // Nominee Information
  nominee_name: "",
  email: "",
  daytime_phone: "",
  address: "",
  city: "",
  state: "OK",
  zip: "",
  county: "",
  
  // System Information
  system_name: "",
  watersystem: undefined,
  operation_start_date: null,
  employment_date: null,
  
  // Employee Counts
  current_members: 0,
  beginning_members: 0,
  clerical_employees: 0,
  operation_maintenance_employees: 0,
  management_employees: 0,
  
  // Nomination Details
  nomination_description: "",
  award_type: 'Operator of the Year',
  award_year: new Date().getFullYear(),
  
  // Documents
  supporting_documents: null,
  nomination_pdf: null,
  
  // Status
  nomination_status: 'Draft',
  submission_date: null,
  
  // Admin options
  adminOptions: {
    registrantNotification: true,
    adminNotification: true,
    customEmail: "",
    resubmit: true,
  },
};

export default awardDefaultPayload;
