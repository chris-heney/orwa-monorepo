import { StrapiFormattedFile } from "./types";

/** Eligible application as returned by GET /grant-reimbursement/session. */
export interface IReimbursableApplication {
  documentId: string;
  application_id: string;
  legal_entity_name: string;
  facility_id: string;
  county: string;
  status: string;
  committee_date: string | null;
  grant_name: string;
  point_of_contact: {
    first: string;
    last: string;
    title: string;
    email: string;
    phone: string;
  } | null;
  award_amount: number;
  paid_to_date: number;
  pending_requests: number;
  remaining_balance: number;
  payout_count: number;
}

export interface IReimbursementSession {
  email: string;
  expires: string;
  applications: IReimbursableApplication[];
}

export interface IInvoiceLine {
  vendor: string;
  invoice_number: string;
  amount: number | undefined;
}

/** react-hook-form state for the reimbursement request. */
export interface IReimbursementFormValues {
  application: string;
  invoices: IInvoiceLine[];
  requester_name: string;
  requester_title: string;
  requester_email: string;
  requester_phone: string;
  requester_signature: string;
  certified: boolean;
  applicant_notes: string;
  paid_invoices: StrapiFormattedFile[];
  proof_of_payment: StrapiFormattedFile[];
  project_photos: StrapiFormattedFile[];
  photos_not_applicable: boolean;
}

export interface IReimbursementSubmitResponse {
  code: string;
  duplicate?: boolean;
  errors?: string[];
  message?: string;
  subject?: string;
  capped?: boolean;
  emails_sent?: boolean;
  payout?: {
    id: number;
    documentId?: string;
    amount: number;
    invoice_total?: number;
    transaction_date?: string;
  };
  balance?: {
    award: number;
    paid: number;
    pending: number;
    remaining: number;
    remaining_after: number;
  };
}
