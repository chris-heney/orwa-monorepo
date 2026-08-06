/**
 * Authoritative project_costs enrichment for grant-application-final writes.
 *
 * When `project_costs` is present on create/update:
 *  - snapshot `name` / `classification` from project-type by numeric id
 *  - recompute `combined_cost_of_projects` as Σ round(amount)
 *
 * Rounding matches coerce-to-schema's roundIfIntegerType so the committee
 * total never drifts from the itemized rows.
 */

type ProjectCostRow = {
  project_type_id?: unknown;
  name?: unknown;
  classification?: unknown;
  amount?: unknown;
  source?: unknown;
  [key: string]: unknown;
};

const roundAmount = (value: unknown): number => {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n);
};

export const enrichProjectCosts = async (
  data: Record<string, unknown>
): Promise<void> => {
  const rows = data.project_costs;
  if (!Array.isArray(rows)) return;

  const ids = [
    ...new Set(
      rows
        .map((row) => {
          const id = Number((row as ProjectCostRow)?.project_type_id);
          return Number.isFinite(id) && id > 0 ? id : null;
        })
        .filter((id): id is number => id != null)
    ),
  ];

  const typeById = new Map<
    number,
    { name?: string | null; classification?: string | null }
  >();

  if (ids.length > 0) {
    const types = await strapi.db.query("api::project-type.project-type").findMany({
      where: { id: { $in: ids } },
      select: ["id", "name", "classification"],
    });
    for (const t of types) {
      typeById.set(Number(t.id), t);
    }
  }

  let combined = 0;
  data.project_costs = rows.map((raw) => {
    const row = { ...(raw as ProjectCostRow) };
    const typeId = Number(row.project_type_id);
    const type =
      Number.isFinite(typeId) && typeId > 0 ? typeById.get(typeId) : undefined;

    if (type) {
      row.name = type.name ?? row.name ?? "";
      row.classification = type.classification ?? row.classification ?? "";
    }

    const amount = roundAmount(row.amount);
    row.amount = amount;
    combined += amount;
    return row;
  });

  data.combined_cost_of_projects = combined;
};
