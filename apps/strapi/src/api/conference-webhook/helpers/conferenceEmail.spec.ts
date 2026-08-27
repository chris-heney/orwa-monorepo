import { describe, expect, it } from "vitest";
import {
  conferenceNotificationRecipients,
  conferenceNotificationSubject,
} from "./conferenceEmail";

describe("conferenceNotificationSubject", () => {
  it("names invoice sponsorships as invoices", () => {
    expect(
      conferenceNotificationSubject({
        conferenceName: "Fall Conference",
        organization: "BancFirst",
        paymentType: "Invoice",
        hasSponsors: true,
      })
    ).toBe("ORWA Fall Conference Sponsorship Invoice — BancFirst");
  });

  it("keeps a confirmation subject for card-paid sponsorships", () => {
    expect(
      conferenceNotificationSubject({
        conferenceName: "Fall Conference",
        organization: "Parkhill",
        paymentType: "Card",
        hasSponsors: true,
      })
    ).toBe("ORWA Fall Conference Sponsorship Confirmation — Parkhill");
  });

  it("falls back to the generic registration subject", () => {
    expect(
      conferenceNotificationSubject({
        conferenceName: "Fall Conference",
        paymentType: "Card",
        hasSponsors: false,
      })
    ).toBe("ORWA Fall Conference Registration");
  });
});

describe("conferenceNotificationRecipients", () => {
  it("dedupes registrant, billing, office, and conference recipients", () => {
    expect(
      conferenceNotificationRecipients({
        registrantEmail: "randy.mcdaniel@bancfirst.bank",
        billingEmail: " randy.mcdaniel@bancfirst.bank ",
        conferenceRecipient: "steph@orwa.org",
      })
    ).toEqual([
      "randy.mcdaniel@bancfirst.bank",
      "office@orwa.org",
      "steph@orwa.org",
    ]);
  });
});
