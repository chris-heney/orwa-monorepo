import { selectScoringCriteria } from "./criteria";
import {
  ApplicantPdfContact,
  ApplicantPdfInput,
  ScoringCriteriaRow,
  ScoringLike,
} from "./types";

/**
 * Field names shared by the gapp-form payload and the Strapi record. Only
 * `selected_projects` differs in shape (ids vs populated objects); both are
 * accepted.
 */
export interface ApplicationLike {
  legal_entity_name?: string | null;
  facility_id?: string | null;
  county?: string | null;
  population_served?: number | string | null;
  physical_address_street?: string | null;
  physical_address_city?: string | null;
  physical_address_state?: string | null;
  physical_address_zip?: string | null;
  point_of_contact?: ApplicantPdfContact | null;
  chairman?: ApplicantPdfContact | null;
  additional_contacts?: ApplicantPdfContact[] | null;
  has_engineer?: boolean | null;
  change_order_request?: string | null;
  drinking_or_wastewater?: string | null;
  selected_projects?: Array<string | number | { id?: string | number }> | null;
  engineering_report?: string | null;
  report_approved_by_deq?: string | null;
  resolves_violation?: string | null;
  satisfy_deq_issued_order?: boolean | null;
  money_set_aside?: boolean | null;
  applied_to_other_loans?: boolean | null;
  project_costs?: ApplicantPdfInput["projectCosts"] | null;
  combined_cost_of_projects?: number | string | null;
  requested_grant_amount?: number | string | null;
  minimum_utility_financial_contribution?: number | string | null;
  description_justification_estimated_cost?: string | null;
  signatory_name?: string | null;
  signatory_title?: string | null;
  signature?: string | null;
  application_id?: string | number | null;
  application_date?: Date | string | null;
  id?: number | string;
}

const yes = (value: unknown) => value === true || value === "Yes" || value === "true";

export function toPdfInput(
  record: ApplicationLike,
  scoringCriteria: ScoringCriteriaRow[],
  applicationNumber: string,
  applicationDate: Date | string | null | undefined
): ApplicantPdfInput {
  return {
    applicationNumber,
    applicationDate,
    legalEntityName: record.legal_entity_name ?? "",
    facilityId: record.facility_id,
    county: record.county,
    populationServed: record.population_served,
    physicalAddress: {
      street: record.physical_address_street,
      city: record.physical_address_city,
      state: record.physical_address_state,
      zip: record.physical_address_zip,
    },
    pointOfContact: record.point_of_contact ?? {},
    chairman: record.chairman ?? null,
    additionalContacts: record.additional_contacts ?? [],
    hasEngineer: !!record.has_engineer,
    changeOrderRequest: record.change_order_request ?? "No",
    drinkingOrWastewater: record.drinking_or_wastewater ?? "Drinking Water",
    scoringCriteria,
    projectStatus: {
      engineeringReport: yes(record.engineering_report),
      reportApprovedByDeq: yes(record.report_approved_by_deq),
      resolvesViolation: record.resolves_violation === "Yes - a current violation",
      satisfyDeqIssuedOrder: !!record.satisfy_deq_issued_order,
      moneySetAside: !!record.money_set_aside,
      appliedToOtherLoans: !!record.applied_to_other_loans,
    },
    projectCosts: Array.isArray(record.project_costs) ? record.project_costs : [],
    combinedCostOfProjects: Number(record.combined_cost_of_projects ?? 0),
    requestedGrantAmount: record.requested_grant_amount ?? null,
    minimumUtilityContribution: record.minimum_utility_financial_contribution ?? null,
    descriptionJustification: record.description_justification_estimated_cost ?? "",
    signatoryName: record.signatory_name ?? "",
    signatoryTitle: record.signatory_title ?? "",
    signatureDataUrl: record.signature || null,
  };
}

/** From a populated Strapi `grant-application-final` record. */
export function applicationToPdfInput(
  application: ApplicationLike,
  scorings: ScoringLike[]
): ApplicantPdfInput {
  const criteria = selectScoringCriteria(
    application.selected_projects,
    scorings,
    application.drinking_or_wastewater ?? "Drinking Water"
  );
  const number = String(application.application_id ?? application.id ?? "");
  return toPdfInput(application, criteria, number, application.application_date);
}

/** From gapp-form values; the caller decides the application number and date. */
export function formPayloadToPdfInput(
  payload: ApplicationLike,
  scoringCriteria: ScoringCriteriaRow[],
  applicationNumber: string,
  applicationDate: Date | string | null | undefined
): ApplicantPdfInput {
  return toPdfInput(payload, scoringCriteria, applicationNumber, applicationDate);
}
