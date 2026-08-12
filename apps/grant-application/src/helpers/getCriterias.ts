import { IProject, IScoringCriteria } from "../types/types";

/**
 * Strapi 5 flattens relations (`project_type: { id, … }`).
 * Older code / v4 responses nest them (`project_type: { data: { id, … } }`).
 */
export function resolveProjectType(
  criteria: IScoringCriteria | null | undefined
): IProject | null {
  const raw = criteria?.project_type as
    | IProject
    | { data?: IProject | null }
    | null
    | undefined;
  if (raw == null) return null;
  if ("data" in raw) {
    return raw.data ?? null;
  }
  return raw;
}

export const getSelectedCriterias = (
  selectedProjects: string[],
  scoringCriterias: IScoringCriteria[] | null | undefined,
  drinking_or_wastewater: string
): (string | boolean)[][] => {
  const selected = selectedProjects ?? [];
  const list = scoringCriterias ?? [];

  return list
    .filter((criteria) => {
      const projectType = resolveProjectType(criteria);
      return (
        projectType != null &&
        projectType.classification === drinking_or_wastewater
      );
    })
    .map((criteria) => {
      const projectType = resolveProjectType(criteria)!;
      const included = selected.includes(String(projectType.id));
      return [criteria.order, criteria.label, included];
    });
};
