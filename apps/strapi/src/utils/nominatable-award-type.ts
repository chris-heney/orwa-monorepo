/**
 * Server-side check that an award type exists and is open for public
 * nomination. The public awards form only offers `award-types` rows with
 * `nominatable = true` (see apps/awards `awardTypeOptions.ts`), but
 * `award-nomination.award_type` is a free-text string, so the submissions
 * controller must enforce the same rule.
 */

export const AWARD_TYPE_UID = "api::award-type.award-type" as const;

export type AwardTypeRow = {
  id: number;
  documentId: string;
  name: string;
  nominatable: boolean | null;
};

export type AwardTypeCheck =
  | { status: "nominatable"; awardType: AwardTypeRow }
  | { status: "not_nominatable"; awardType: AwardTypeRow }
  | { status: "not_found" };

/** Exact `name` match — the public form sends the catalog name verbatim. */
export const checkNominatableAwardType = async (
  name: unknown
): Promise<AwardTypeCheck> => {
  const trimmed = typeof name === "string" ? name.trim() : "";
  if (!trimmed) return { status: "not_found" };

  const row = (await (strapi as any).db.query(AWARD_TYPE_UID).findOne({
    where: { name: trimmed },
    select: ["id", "documentId", "name", "nominatable"],
  })) as AwardTypeRow | null;

  if (!row) return { status: "not_found" };
  if (!row.nominatable) return { status: "not_nominatable", awardType: row };
  return { status: "nominatable", awardType: row };
};
