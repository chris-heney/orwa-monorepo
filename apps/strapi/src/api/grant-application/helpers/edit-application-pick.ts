export const NEW_APPLICATION_STATUS = "New Application";

type StatusName = { name?: string | null } | null | undefined;

export type EditableApplication = {
  documentId?: string;
  legal_entity_name?: string | null;
  status?: StatusName;
  point_of_contact?: { email?: string | null } | null;
  chairman?: { email?: string | null } | null;
  engineer?: { email?: string | null } | null;
  additional_contacts?: Array<{ email?: string | null } | null> | null;
};

export const isNewApplicationStatus = (application: {
  status?: StatusName;
}) => application.status?.name === NEW_APPLICATION_STATUS;

/**
 * Applications are newest-first. Prefer the newest one still in
 * "New Application". If every match has moved on, return the newest
 * so the caller can tell "locked" apart from "not found".
 */
export function pickApplicationForEdit<T extends { status?: StatusName }>(
  applications: T[]
): T | null {
  return (
    applications.find((application) => isNewApplicationStatus(application)) ??
    applications[0] ??
    null
  );
}

export function contactEmails(application: EditableApplication): string[] {
  const contacts = [
    application.point_of_contact,
    application.chairman,
    application.engineer,
    ...(application.additional_contacts ?? []),
  ];
  const emails = contacts
    .map((contact) =>
      typeof contact?.email === "string" ? contact.email.trim().toLowerCase() : ""
    )
    .filter(Boolean);
  return [...new Set(emails)];
}

/**
 * Newest still-editable application for the same legal entity, excluding
 * the one the caller already has. Candidates must be newest-first.
 * Same-entity keeps a shared engineer from opening a different utility.
 */
export function pickEditableSibling<T extends EditableApplication>(
  locked: T,
  candidates: T[]
): T | null {
  const entity = (locked.legal_entity_name ?? "").trim().toLowerCase();
  if (!entity) return null;
  return (
    candidates.find(
      (candidate) =>
        candidate.documentId !== locked.documentId &&
        (candidate.legal_entity_name ?? "").trim().toLowerCase() === entity &&
        isNewApplicationStatus(candidate)
    ) ?? null
  );
}

export function switchedApplicationNotice(
  locked: { application_id?: string | number | null; status?: StatusName },
  opened: { application_id?: string | number | null }
): string {
  const lockedId = locked.application_id ?? "the one you opened";
  const openedId = opened.application_id ?? "another application";
  const status = locked.status?.name ?? "no longer New Application";
  return `Application #${lockedId} is ${status}, so it can no longer be modified. This form is application #${openedId}, which is still a New Application.`;
}
