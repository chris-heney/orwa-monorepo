export interface ApplicantPdfContact {
  first?: string | null;
  last?: string | null;
  email?: string | null;
  phone?: string | null;
  title?: string | null;
}

/** `[order, label, checked]` — one row of the Funding Request checklist. */
export type ScoringCriteriaRow = [string, string, boolean];

export interface ApplicantPdfProjectCost {
  project_type_id?: number | string | null;
  name?: string | null;
  amount?: number | string | null;
}

export interface ApplicantPdfInput {
  /** Printed as "Application # …". */
  applicationNumber: string;
  /** "Date Received" and the signature-line date. */
  applicationDate: Date | string | null | undefined;
  /** When set, a "Revised: …" line is stamped under "Date Received". */
  revisedDate?: Date | string | null;
  legalEntityName: string;
  facilityId?: string | null;
  county?: string | null;
  populationServed?: number | string | null;
  physicalAddress: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  };
  pointOfContact: ApplicantPdfContact;
  chairman?: ApplicantPdfContact | null;
  additionalContacts?: ApplicantPdfContact[];
  hasEngineer: boolean;
  changeOrderRequest?: string | null;
  drinkingOrWastewater: string;
  scoringCriteria: ScoringCriteriaRow[];
  projectStatus: {
    engineeringReport: boolean;
    reportApprovedByDeq: boolean;
    resolvesViolation: boolean;
    satisfyDeqIssuedOrder: boolean;
    moneySetAside: boolean;
    appliedToOtherLoans: boolean;
  };
  /** Carried for callers; the PDF prints only the combined "Estimated Cost". */
  projectCosts: ApplicantPdfProjectCost[];
  combinedCostOfProjects: number;
  descriptionJustification: string;
  signatoryName: string;
  signatoryTitle: string;
  /** PNG/JPEG data URL. The signature block is drawn without an image when absent. */
  signatureDataUrl?: string | null;
}

/** Minimal shape of an `api::grant-application-scoring` entry (v4 or v5 relation nesting). */
export interface ScoringLike {
  order?: string | number | null;
  label?: string | null;
  project_type?:
    | { id?: number | string; classification?: string | null }
    | { data?: { id?: number | string; classification?: string | null } | null }
    | null;
}
