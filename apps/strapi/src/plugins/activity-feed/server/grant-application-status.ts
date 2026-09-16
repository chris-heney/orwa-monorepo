/**
 * Activity-feed messages for grant application status changes.
 *
 * Grant applications live in `api::grant-application-final.grant-application-final`
 * (table `grant_application_finals`). There is no `grant-application` content
 * type — only custom routes under that name — so the lifecycle case that used
 * to listen on `grant-application` never fired. member-manager logged status
 * changes client-side instead; the server now owns it so every write path
 * (status select, email modal, scripts) is logged exactly once.
 *
 * Pure helpers here; the lifecycle wiring is in bootstrap.ts.
 */

export const GRANT_APPLICATION_FINAL_UID =
  "api::grant-application-final.grant-application-final" as const;

/** `event.model.singularName` for the final model. */
export const GRANT_APPLICATION_FINAL_MODEL = "grant-application-final" as const;

/** Populate needed to build a status-change message. */
export const GRANT_APPLICATION_STATUS_POPULATE = {
  status: { fields: ["id", "name"] },
  grant: { fields: ["id", "name"] },
  point_of_contact: { fields: ["id", "first", "last"] },
} as const;

export interface NamedRef {
  id?: number | null;
  name?: string | null;
}

export interface ContactRef {
  id?: number | null;
  first?: string | null;
  last?: string | null;
}

export interface GrantApplicationSnapshot {
  id?: number | null;
  legal_entity_name?: string | null;
  application_id?: string | null;
  status?: NamedRef | null;
  grant?: NamedRef | null;
  point_of_contact?: ContactRef | null;
}

export interface StatusChangeActivity {
  message: string[];
  relations: { id: number; name: string }[];
}

const numericId = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;

/**
 * Build the activity for a status transition, or null when the status did
 * not change (other-field edits, applicant edit-sessions, re-saves).
 *
 * `before` is the snapshot taken in beforeUpdate; `after` is the re-read
 * record after the update. The status relation is compared by numeric id.
 */
export const grantApplicationStatusChange = (
  before: GrantApplicationSnapshot | null | undefined,
  after: GrantApplicationSnapshot | null | undefined
): StatusChangeActivity | null => {
  const applicationId = numericId(after?.id);
  if (!after || applicationId == null) return null;

  const oldStatusId = numericId(before?.status?.id);
  const newStatusId = numericId(after.status?.id);
  if (newStatusId == null || oldStatusId === newStatusId) return null;

  const applicant = after.legal_entity_name?.trim() || "an applicant";
  const applicationNumber = after.application_id ? ` #${after.application_id}` : "";
  const message = [
    `Grant Application${applicationNumber} for ${applicant}`,
    `was updated to ${after.status?.name ?? "a new status"}`,
  ];
  if (before?.status?.name) {
    message.push(`from ${before.status.name}`);
  }
  if (after.grant?.name) {
    message.push(`(${after.grant.name})`);
  }

  const relations: StatusChangeActivity["relations"] = [
    { id: applicationId, name: "grant-application" },
  ];
  const grantId = numericId(after.grant?.id);
  if (grantId != null) relations.push({ id: grantId, name: "grant" });
  const contactId = numericId(after.point_of_contact?.id);
  if (contactId != null) relations.push({ id: contactId, name: "contact" });

  return { message, relations };
};

/**
 * Snapshots keyed by numeric row id, taken in beforeUpdate and consumed in
 * afterUpdate. Used when the lifecycle event carries no shared `state`.
 */
export const pendingSnapshots = new Map<number, GrantApplicationSnapshot | null>();
