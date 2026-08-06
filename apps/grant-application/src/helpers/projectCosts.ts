/** Per-type cost row as submitted to Strapi / shown in the applicant PDF. */
export type ProjectCostRow = {
  project_type_id: number;
  amount: number;
  name?: string;
  classification?: string;
  source?: "applicant" | "document" | "even-split";
};

/** Form-state shape: amounts keyed by project type id string. */
export type ProjectCostsMap = Record<string, number | undefined>;

/** Normalize edit-session / API arrays (or an existing map) into form state. */
export function projectCostsToFormMap(costs: unknown): ProjectCostsMap {
  if (costs == null) return {};
  if (Array.isArray(costs)) {
    return Object.fromEntries(
      (costs as ProjectCostRow[]).map((row) => [
        String(row.project_type_id),
        Number(row.amount) || 0,
      ])
    );
  }
  if (typeof costs === "object") {
    const map: ProjectCostsMap = {};
    for (const [key, value] of Object.entries(costs as Record<string, unknown>)) {
      if (value === undefined || value === null || value === "") continue;
      const n = Number(value);
      if (!Number.isNaN(n)) map[key] = n;
    }
    return map;
  }
  return {};
}

/**
 * Convert the form map to the API array for selected project types.
 * Amounts are rounded to whole dollars (matches server Σ round(amount)).
 */
export function projectCostsMapToRows(
  costsMap: ProjectCostsMap | undefined,
  selectedProjectIds: string[],
  projects?: Array<{ id: number; name: string; classification?: string }>
): ProjectCostRow[] {
  const map = costsMap ?? {};
  return selectedProjectIds.map((id) => {
    const project = projects?.find((p) => p.id.toString() === id);
    return {
      project_type_id: Number(id),
      amount: Math.round(Number(map[id]) || 0),
      ...(project
        ? {
            name: project.name,
            classification: project.classification,
          }
        : {}),
    };
  });
}

/** Rounded sum of per-type amounts for the selected set. */
export function sumProjectCosts(
  costsMap: ProjectCostsMap | undefined,
  selectedProjectIds: string[]
): number {
  const map = costsMap ?? {};
  return selectedProjectIds.reduce(
    (sum, id) => sum + Math.round(Number(map[id]) || 0),
    0
  );
}
