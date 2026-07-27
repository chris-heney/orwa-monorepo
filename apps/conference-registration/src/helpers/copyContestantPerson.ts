import { Identifier } from "../types/types";

export type ContestantPersonSource = {
  id: string | number;
  first?: string;
  last?: string;
  email?: string;
  phone?: string;
  license?: string;
};

export const contactFieldsFromPerson = (
  person: ContestantPersonSource
): {
  first: string;
  last: string;
  email: string;
  phone: string;
  license: string;
  source_ticket_id: Identifier;
} => ({
  first: person.first ?? "",
  last: person.last ?? "",
  email: person.email ?? "",
  phone: person.phone ?? "",
  license: person.license ?? "",
  source_ticket_id: person.id,
});

const normalizeEmail = (email: string | undefined): string =>
  (email ?? "").trim().toLowerCase();

/**
 * If registrant email uniquely matches one attendee → org + person.
 * If it matches multiple people but only one org → org only.
 * Otherwise empty (never guess across orgs).
 */
export const emailAutoSelect = (args: {
  email: string | undefined;
  registrations: Array<{
    id: Identifier;
    organization?: string;
    attendees?: ContestantPersonSource[];
  }>;
}): { registrationId?: Identifier; personId?: Identifier } => {
  const target = normalizeEmail(args.email);
  if (!target) return {};

  const matches: Array<{ registrationId: Identifier; personId: Identifier }> =
    [];
  for (const registration of args.registrations) {
    for (const person of registration.attendees ?? []) {
      if (normalizeEmail(person.email) === target) {
        matches.push({
          registrationId: registration.id,
          personId: person.id,
        });
      }
    }
  }

  if (matches.length === 1) {
    return {
      registrationId: matches[0].registrationId,
      personId: matches[0].personId,
    };
  }

  const uniqueRegIds = [
    ...new Set(matches.map((match) => String(match.registrationId))),
  ];
  if (uniqueRegIds.length === 1) {
    return { registrationId: matches[0].registrationId };
  }
  return {};
};
