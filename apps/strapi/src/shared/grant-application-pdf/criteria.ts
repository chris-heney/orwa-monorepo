import { ScoringCriteriaRow, ScoringLike } from "./types";

type ProjectTypeLike = { id?: number | string; classification?: string | null };

/**
 * Strapi 5 flattens relations (`project_type: { id, … }`); v4 responses nest
 * them (`project_type: { data: { id, … } }`). Accept both.
 */
export function resolveProjectType(
  criteria: ScoringLike | null | undefined
): ProjectTypeLike | null {
  const raw = criteria?.project_type as
    | ProjectTypeLike
    | { data?: ProjectTypeLike | null }
    | null
    | undefined;
  if (raw == null) return null;
  if ("data" in raw) return raw.data ?? null;
  return raw as ProjectTypeLike;
}

/**
 * Funding Request checklist rows for the PDF: every scoring criterion whose
 * project type matches the application's classification, checked when the
 * project type is among the selected projects.
 */
export function selectScoringCriteria(
  selectedProjectIds: Array<string | number | { id?: string | number }> | null | undefined,
  scorings: ScoringLike[] | null | undefined,
  drinkingOrWastewater: string
): ScoringCriteriaRow[] {
  const selected = new Set(
    (selectedProjectIds ?? []).map((p) =>
      String(typeof p === "object" && p !== null ? p.id : p)
    )
  );

  return (scorings ?? [])
    .filter((criteria) => {
      const projectType = resolveProjectType(criteria);
      return (
        projectType != null &&
        projectType.classification === drinkingOrWastewater
      );
    })
    .map((criteria) => {
      const projectType = resolveProjectType(criteria)!;
      return [
        String(criteria.order ?? ""),
        String(criteria.label ?? ""),
        selected.has(String(projectType.id)),
      ] as ScoringCriteriaRow;
    });
}
