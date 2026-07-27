export type ContestantLine = {
  previous_registration_id?: string | number;
  source_ticket_id?: string | number;
  price?: number | string;
  ticket_type?: { id?: unknown; name?: string };
  first?: string;
  last?: string;
  email?: string;
  extras?: unknown[];
  [key: string]: unknown;
};

type AttendeeLike = {
  id?: string | number;
  documentId?: string;
};

type RegistrationWithAttendees = {
  id?: string | number;
  attendees?: AttendeeLike[] | null;
};

export const partitionContestantLines = (
  tickets: ContestantLine[]
): {
  attachGroups: Map<string, ContestantLine[]>;
  standalone: ContestantLine[];
} => {
  const attachGroups = new Map<string, ContestantLine[]>();
  const standalone: ContestantLine[] = [];

  for (const line of tickets) {
    const attachId = line.previous_registration_id;
    if (attachId == null || attachId === "") {
      standalone.push(line);
      continue;
    }
    const key = String(attachId);
    const group = attachGroups.get(key) ?? [];
    group.push(line);
    attachGroups.set(key, group);
  }

  return { attachGroups, standalone };
};

export const sharePaymentAmount = (lines: ContestantLine[]): number =>
  lines.reduce((sum, line) => sum + (Number(line.price) || 0), 0);

export const assertSourcePersonOnRegistration = (
  registration: RegistrationWithAttendees | null | undefined,
  sourceTicketId: string | number | null | undefined
): void => {
  if (sourceTicketId == null || sourceTicketId === "") {
    throw new Error("Contestant attach requires a source person");
  }
  const attendees = registration?.attendees ?? [];
  const found = attendees.some(
    (person) =>
      String(person.id) === String(sourceTicketId) ||
      String(person.documentId ?? "") === String(sourceTicketId)
  );
  if (!found) {
    throw new Error(
      "Selected source person was not found on the previous registration"
    );
  }
};
