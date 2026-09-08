import { contestantLifecycleContext } from "../../services/contestant-lifecycle-context";
import { findOneById } from "../../../../utils/document-compat";

const LIFECYCLE_FIELDS = [
  "status",
  "cancelled_at",
  "cancelled_reason",
  "cancelled_by",
];
const CONTESTANT_UID = "api::conference-contestant.conference-contestant";
const RELATION_FIELDS = ["conference", "conference_ticket"] as const;

const hasOwn = (data: Record<string, unknown>, field: string): boolean =>
  Object.prototype.hasOwnProperty.call(data, field);

const dataFromEvent = (event: { params?: { data?: Record<string, unknown> } }) =>
  event.params?.data ?? {};

const assertNoLifecycleBypass = (
  event: { params?: { data?: Record<string, unknown> } }
) => {
  const data = dataFromEvent(event);
  const context = contestantLifecycleContext();
  const lifecycleAttempted = LIFECYCLE_FIELDS.some((field) => hasOwn(data, field));
  if (lifecycleAttempted && !context.allowLifecycleTransition) {
    throw new Error(
      "Conference contestant lifecycle fields must be changed through cancel/restore actions."
    );
  }
};

const normalizeRelationValue = (value: unknown): string | number | null => {
  if (value == null) return null;
  if (typeof value === "string" || typeof value === "number") return value;
  if (Array.isArray(value)) return normalizeRelationValue(value[0]);
  if (typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  if (Array.isArray(record.set)) return normalizeRelationValue(record.set[0]);
  if (record.connect) return normalizeRelationValue(record.connect);
  if (record.id != null && (typeof record.id === "string" || typeof record.id === "number")) {
    return record.id;
  }
  if (typeof record.documentId === "string") return record.documentId;
  return null;
};

const sameRelation = (requested: unknown, current: unknown): boolean => {
  const requestedId = normalizeRelationValue(requested);
  const currentId = normalizeRelationValue(current);
  const currentDocId =
    typeof current === "object" && current
      ? (current as Record<string, unknown>).documentId
      : null;

  if (requestedId == null) return true;
  return requestedId === currentId || requestedId === currentDocId;
};

const loadCurrentContestant = async (
  event: { params?: { where?: Record<string, unknown> } }
) => {
  const where = event.params?.where ?? {};
  const id = where.documentId ?? where.id;
  if (typeof id !== "string" && typeof id !== "number") {
    throw new Error("Current conference contestant is required before changing relations.");
  }
  return findOneById(CONTESTANT_UID, id, {
    populate: { conference: true, conference_ticket: true },
  });
};

const assertNoRelationRepoint = async (
  event: { params?: { data?: Record<string, unknown>; where?: Record<string, unknown> } }
) => {
  const data = dataFromEvent(event);
  const attempted = RELATION_FIELDS.filter((field) => hasOwn(data, field));
  if (attempted.length === 0) return;

  const current = await loadCurrentContestant(event);
  if (!current) {
    throw new Error("Current conference contestant is required before changing relations.");
  }

  for (const field of attempted) {
    if (!sameRelation(data[field], current[field])) {
      throw new Error("Cancel and create a new contestant to change conference or ticket.");
    }
  }
};

export default {
  async beforeCreate(event: { params?: { data?: Record<string, unknown> } }) {
    assertNoLifecycleBypass(event);
    const data = dataFromEvent(event);
    const context = contestantLifecycleContext();
    const directContestantCreate = RELATION_FIELDS.some((field) => hasOwn(data, field));
    if (directContestantCreate && !context.allowRestCreate) {
      throw new Error(
        "Conference contestants must be created through the guarded Add Contestant flow."
      );
    }
  },

  async beforeUpdate(event: { params?: { data?: Record<string, unknown> } }) {
    assertNoLifecycleBypass(event);
    if (!contestantLifecycleContext().allowRelationRepoint) {
      await assertNoRelationRepoint(event);
    }
  },

  async beforeDelete() {
    if (!contestantLifecycleContext().allowHardDelete) {
      throw new Error("Conference contestants must be cancelled, not deleted.");
    }
  },
};
