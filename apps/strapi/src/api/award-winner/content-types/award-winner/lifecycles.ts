/**
 * award-winner lifecycle guard.
 *
 * `award_winner.award_nomination` is a oneToOne, but the join table only has
 * a composite unique key (winner, nomination), so nothing stopped two gallery
 * entries from claiming the same nomination. Enforce it here so REST, the
 * Content Manager and the Document Service all share one rule.
 *
 * Deliberately NOT done here: deriving `award_year` from the nomination.
 * `award_year` is `required` in the schema and Strapi's entity validator
 * runs before DB lifecycles, so an empty year is rejected before this hook
 * could fill it — member-manager prefills it client-side instead.
 *
 * The nomination's `nomination_status` is staff-owned: linking a winner does
 * NOT touch it.
 */

import { errors } from "@strapi/utils";

const WINNER_UID = "api::award-winner.award-winner";
const NOMINATION_UID = "api::award-nomination.award-nomination";

type WriteEvent = {
  params?: { data?: Record<string, unknown>; where?: Record<string, unknown> };
};

type NominationRef = { id?: number; documentId?: string } | null;

const hasOwn = (data: Record<string, unknown>, field: string): boolean =>
  Object.prototype.hasOwnProperty.call(data, field);

const isDocumentId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-z0-9]{16,64}$/.test(value) && !/^\d+$/.test(value);

const isNumericId = (value: unknown): boolean =>
  (typeof value === "number" && Number.isFinite(value)) ||
  (typeof value === "string" && /^\d+$/.test(value));

/**
 * The single nomination reference a write is pointing at, in any of the
 * shapes Strapi accepts: bare id / documentId, a populated row, or the
 * `{ set | connect }` operator form. `null` means "no link".
 */
export const nominationRefFromValue = (value: unknown): NominationRef => {
  if (value == null || value === "") return null;
  if (isDocumentId(value)) return { documentId: value };
  if (isNumericId(value)) return { id: Number(value) };
  if (Array.isArray(value)) return nominationRefFromValue(value[0]);
  if (typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  if (hasOwn(record, "set")) return nominationRefFromValue(record.set);
  if (hasOwn(record, "connect")) return nominationRefFromValue(record.connect);
  if (isDocumentId(record.documentId)) return { documentId: record.documentId };
  if (isNumericId(record.id)) return { id: Number(record.id) };
  return null;
};

const db = () => (strapi as any).db;

const loadNomination = async (ref: NominationRef) => {
  if (!ref) return null;
  return db()
    .query(NOMINATION_UID)
    .findOne({
      where: ref.id != null ? { id: ref.id } : { documentId: ref.documentId },
      select: ["id", "documentId", "nominee_name"],
    });
};

const currentWinnerId = async (where: Record<string, unknown>): Promise<number | null> => {
  if (isNumericId(where.id)) return Number(where.id);
  if (isDocumentId(where.documentId)) {
    const row = await db()
      .query(WINNER_UID)
      .findOne({ where: { documentId: where.documentId }, select: ["id"] });
    return row?.id ?? null;
  }
  return null;
};

const assertNominationUnclaimed = async (
  nominationId: number,
  nomineeName: string | null | undefined,
  selfId: number | null
) => {
  const claimed = await db()
    .query(WINNER_UID)
    .findMany({
      where: { award_nomination: { id: nominationId } },
      select: ["id", "documentId", "title", "award_year"],
      limit: 2,
    });
  const other = (claimed || []).find((row: { id: number }) => row.id !== selfId);
  if (!other) return;
  const who = nomineeName ? ` (${nomineeName})` : "";
  const label = [other.award_year, other.title].filter(Boolean).join(" ");
  throw new errors.ApplicationError(
    `This nomination${who} is already in the Winners gallery${label ? ` as "${label}"` : ""}.`,
    { nomination: nominationId, winner: other.documentId ?? other.id }
  );
};

/**
 * Shared by beforeCreate / beforeUpdate: resolve the nomination the write
 * links and reject when another winner already owns it.
 */
const guardNominationLink = async (event: WriteEvent, selfId: number | null) => {
  const data = event.params?.data ?? {};
  if (!hasOwn(data, "award_nomination")) return;

  const ref = nominationRefFromValue(data.award_nomination);
  if (!ref) return; // unlink / no link: nothing to enforce

  const nomination = await loadNomination(ref);
  if (!nomination) {
    throw new errors.ApplicationError("The linked award nomination does not exist.");
  }

  await assertNominationUnclaimed(nomination.id, nomination.nominee_name, selfId);
};

export default {
  async beforeCreate(event: WriteEvent) {
    await guardNominationLink(event, null);
  },

  async beforeUpdate(event: WriteEvent) {
    const selfId = await currentWinnerId(event.params?.where ?? {});
    await guardNominationLink(event, selfId);
  },
};
