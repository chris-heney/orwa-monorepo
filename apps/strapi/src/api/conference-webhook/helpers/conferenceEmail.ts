const OFFICE_EMAIL = "office@orwa.org";

const trimEmail = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

export const conferenceNotificationSubject = ({
  conferenceName,
  organization,
  paymentType,
  hasSponsors,
}: {
  conferenceName: string;
  organization?: string;
  paymentType?: string;
  hasSponsors: boolean;
}): string => {
  const org = organization?.trim();
  const suffix = org ? ` — ${org}` : "";
  if (hasSponsors && paymentType === "Invoice") {
    return `ORWA ${conferenceName} Sponsorship Invoice${suffix}`;
  }
  if (hasSponsors) {
    return `ORWA ${conferenceName} Sponsorship Confirmation${suffix}`;
  }
  if (paymentType === "Invoice") {
    return `ORWA ${conferenceName} Registration Invoice${suffix}`;
  }
  return `ORWA ${conferenceName} Registration${suffix}`;
};

export const conferenceNotificationRecipients = ({
  registrantEmail,
  billingEmail,
  conferenceRecipient,
  officeEmail = OFFICE_EMAIL,
}: {
  registrantEmail?: unknown;
  billingEmail?: unknown;
  conferenceRecipient?: unknown;
  officeEmail?: string;
}): string[] => {
  const unique = new Set<string>();
  for (const email of [
    trimEmail(registrantEmail),
    trimEmail(billingEmail),
    trimEmail(officeEmail),
    trimEmail(conferenceRecipient),
  ]) {
    if (email) unique.add(email);
  }
  return [...unique];
};
