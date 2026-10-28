import {
  applicantPdfFileName,
  formPayloadToPdfInput,
  renderApplicantPdf,
  selectScoringCriteria,
  ScoringLike,
} from "@orwa/grant-application-pdf";
import { IProject } from "../types/types";
import {
  projectCostsMapToRows,
  ProjectCostsMap,
  sumProjectCosts,
} from "./projectCosts";

export interface PreviewIdentity {
  /** Printed as "Application # …". */
  applicationNumber: string;
  /** Falls back to today for a brand-new application. */
  applicationDate?: Date | string | null;
}

/**
 * Render the applicant PDF from the live form values — the same renderer
 * Strapi uses for the stored file, so what the admin previews is what the
 * record will carry after save.
 */
export async function buildPreviewPdf(
  formValues: Record<string, any>,
  scorings: ScoringLike[] | null | undefined,
  projects: IProject[] | null | undefined,
  identity: PreviewIdentity
): Promise<{ blob: Blob; fileName: string }> {
  const selectedProjectIds: string[] = formValues.selected_projects ?? [];
  const costsMap = (formValues.project_costs ?? {}) as ProjectCostsMap;
  const projectCosts = projectCostsMapToRows(costsMap, selectedProjectIds, projects ?? []);
  const combinedCost = sumProjectCosts(costsMap, selectedProjectIds);

  const criteria = selectScoringCriteria(
    selectedProjectIds,
    scorings,
    formValues.drinking_or_wastewater
  );

  const bytes = await renderApplicantPdf(
    formPayloadToPdfInput(
      {
        ...formValues,
        project_costs: projectCosts,
        combined_cost_of_projects: combinedCost,
      },
      criteria,
      identity.applicationNumber,
      identity.applicationDate ?? new Date()
    )
  );

  return {
    blob: new Blob([bytes], { type: "application/pdf" }),
    fileName: applicantPdfFileName(formValues.legal_entity_name ?? ""),
  };
}
