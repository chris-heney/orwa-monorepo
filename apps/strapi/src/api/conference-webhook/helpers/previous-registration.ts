type RelationReference =
  | number
  | string
  | { id?: number | string; documentId?: string }
  | null
  | undefined;

type PreviousRegistration = {
  id?: number | string;
  documentId?: string;
  conference?: RelationReference;
  year?: number | string;
  type?: string;
  total?: number | string | null;
  items?: unknown[] | null;
};

const relationId = (relation: RelationReference): string =>
  typeof relation === "object" && relation !== null
    ? String(relation.id ?? relation.documentId ?? "")
    : String(relation ?? "");

export const assertEligiblePreviousRegistration = <
  T extends PreviousRegistration
>(
  registration: T | null | undefined,
  conferenceId: number | string,
  year: number
): T => {
  if (!registration) {
    throw new Error("Selected previous registration was not found");
  }
  if (relationId(registration.conference) !== String(conferenceId)) {
    throw new Error("Selected registration belongs to a different conference");
  }
  if (Number(registration.year) !== year) {
    throw new Error("Selected registration belongs to a different year");
  }
  if (registration.type !== "Attendee" && registration.type !== "Vendor") {
    throw new Error(
      "Selected registration must be an Attendee or Vendor registration"
    );
  }
  return registration;
};

export const buildAttachedRegistrationUpdate = (
  registration: PreviousRegistration,
  paymentAmount: number | string,
  newItems: unknown[] = []
) => ({
  total:
    (Number(registration.total) || 0) + (Number(paymentAmount) || 0),
  items: [...(registration.items ?? []), ...newItems],
});
