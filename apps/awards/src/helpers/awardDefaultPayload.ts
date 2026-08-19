import { IAwardNominationPayload } from "../types/types";
import { nextConferenceYear } from "./nextConferenceYear";

export const awardDefaultPayload: IAwardNominationPayload = {
  // Nominee Information
  nominee_name: "",
  email: "",
  daytime_phone: "",
  address: "",
  city: "",
  state: "OK",
  zip: "",

  // Nominator Information
  nominator_first_name: "",
  nominator_last_name: "",
  nominator_address: "",
  nominator_address_2: "",
  nominator_city: "",
  nominator_state: "",
  nominator_zip: "",
  nominator_country: "United States",
  nominator_phone: "",
  nominator_email: "",

  // System Information
  system_name: "",
  award_name_printed: "",
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
  justification: "",
  award_type: "System of the Year",
  award_year: nextConferenceYear(),

  biography_method: "Copy/Paste or Type Biography",
  biography_text: "",
  biography_file: null,
  photographs: null,
  board_list_method: "",
  board_list_file: null,
  board_members: [{ first: "", last: "", title: "" }],

  // Documents
  supporting_documents: null,
  nomination_pdf: null,

  // Status
  nomination_status: "Draft",
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
