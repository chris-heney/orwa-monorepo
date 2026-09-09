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
  event: { params?: { data?: Record<string, unknown>; where?: Record<string, unknown> } },
  current?: Record<string, unknown> | null
) => {
  const data = dataFromEvent(event);
  const context = contestantLifecycleContext();
  const attempted = LIFECYCLE_FIELDS.filter((field) => hasOwn(data, field));
  if (attempted.length === 0 || context.allowLifecycleTransition) return;

  const permitted =
    context.allowRestCreate
      ? attempted.every((field) => sameLifecycleValue(field, data[field], undefined))
      : current != null &&
        attempted.every((field) => sameLifecycleValue(field, data[field], current[field]));

  if (permitted) return;

  throw new Error(
    "Conference contestant lifecycle fields must be changed through cancel/restore actions."
  );
};

const normalizedStatus = (value: unknown): string =>
  value == null || value === "" ? "active" : String(value);

const sameLifecycleValue = (
  field: string,
  requested: unknown,
  current: unknown
): boolean => {
  if (field === "status") {
    return normalizedStatus(requested) === normalizedStatus(current);
  }
  return requested == null && current == null ? true : requested === current;
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
  const currentRecord =
    typeof current === "object" && current ? (current as Record<string, unknown>) : {};
  const currentDocId = currentRecord.documentId;
  const currentEntityId = currentRecord.id;

  if (isExplicitRelationClear(requested)) {
    return currentId == null && currentDocId == null && currentEntityId == null;
  }
  if (requestedId == null) return true;
  return (
    requestedId === currentId ||
    requestedId === currentDocId ||
    String(requestedId) === String(currentEntityId)
  );
};

const isExplicitRelationClear = (value: unknown): boolean => {
  if (value === null || value === "") return true;
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (Array.isArray(record.set) && record.set.length === 0) return true;
  if (Array.isArray(record.connect) && record.connect.length === 0) return true;
  if (Array.isArray(record.disconnect)) return true;
  return false;
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
  event: { params?: { data?: Record<string, unknown>; where?: Record<string, unknown> } },
  currentOverride?: Record<string, unknown> | null
) => {
  const data = dataFromEvent(event);
  const attempted = RELATION_FIELDS.filter((field) => hasOwn(data, field));
  if (attempted.length === 0) return;

  const current = currentOverride ?? await loadCurrentContestant(event);
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
    const data = dataFromEvent(event);
    const context = contestantLifecycleContext();
    assertNoLifecycleBypass(event);
    const directContestantCreate = RELATION_FIELDS.some((field) => hasOwn(data, field));
    if (directContestantCreate && !context.allowRestCreate) {
      throw new Error(
        "Conference contestants must be created through the guarded Add Contestant flow."
      );
    }
  },

  async beforeUpdate(event: { params?: { data?: Record<string, unknown>; where?: Record<string, unknown> } }) {
    const data = dataFromEvent(event);
    const context = contestantLifecycleContext();
    const lifecycleAttempted = LIFECYCLE_FIELDS.some((field) => hasOwn(data, field));
    const relationAttempted = RELATION_FIELDS.some((field) => hasOwn(data, field));
    const where = event.params?.where ?? {};
    if (
      lifecycleAttempted &&
      !relationAttempted &&
      !context.allowLifecycleTransition &&
      where.documentId == null &&
      where.id == null
    ) {
      assertNoLifecycleBypass(event, null);
    }
    const needsCurrent =
      relationAttempted || (lifecycleAttempted && !context.allowLifecycleTransition);
    const current = needsCurrent ? await loadCurrentContestant(event) : null;
    assertNoLifecycleBypass(event, current);
    if (!context.allowRelationRepoint) {
      await assertNoRelationRepoint(event, current);
    }
  },

  async beforeDelete() {
    if (!contestantLifecycleContext().allowHardDelete) {
      throw new Error("Conference contestants must be cancelled, not deleted.");
    }
  },
};
