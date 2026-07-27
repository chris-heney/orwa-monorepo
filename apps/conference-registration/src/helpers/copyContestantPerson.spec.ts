import { describe, expect, it } from "vitest";
import {
  contactFieldsFromPerson,
  emailAutoSelect,
} from "./copyContestantPerson";

describe("contactFieldsFromPerson", () => {
  it("copies contact fields and source id", () => {
    expect(
      contactFieldsFromPerson({
        id: 99,
        first: "Ada",
        last: "Lovelace",
        email: "ada@example.com",
        phone: "405-555-0100",
        license: "OP-1",
      })
    ).toEqual({
      first: "Ada",
      last: "Lovelace",
      email: "ada@example.com",
      phone: "405-555-0100",
      license: "OP-1",
      source_ticket_id: 99,
    });
  });
});

describe("emailAutoSelect", () => {
  const regs = [
    {
      id: 10,
      organization: "Alpha Water",
      attendees: [
        {
          id: 1,
          first: "Ann",
          last: "A",
          email: "ann@alpha.org",
        },
        {
          id: 2,
          first: "Bob",
          last: "B",
          email: "bob@alpha.org",
        },
      ],
    },
    {
      id: 20,
      organization: "Beta Water",
      attendees: [
        {
          id: 3,
          first: "Ann",
          last: "Clone",
          email: "ann@alpha.org",
        },
      ],
    },
  ];

  it("selects org and person when email uniquely matches one attendee", () => {
    expect(emailAutoSelect({ email: "bob@alpha.org", registrations: regs })).toEqual({
      registrationId: 10,
      personId: 2,
    });
  });

  it("selects neither when email matches multiple registrations", () => {
    expect(emailAutoSelect({ email: "ann@alpha.org", registrations: regs })).toEqual(
      {}
    );
  });

  it("selects org only when email matches multiple people in one org", () => {
    const oneOrg = [
      {
        id: 10,
        organization: "Alpha Water",
        attendees: [
          { id: 1, first: "Ann", last: "A", email: "shared@alpha.org" },
          { id: 2, first: "Ann", last: "B", email: "shared@alpha.org" },
        ],
      },
    ];
    expect(
      emailAutoSelect({ email: "shared@alpha.org", registrations: oneOrg })
    ).toEqual({ registrationId: 10 });
  });

  it("is case-insensitive and trims", () => {
    expect(
      emailAutoSelect({ email: "  Bob@Alpha.ORG ", registrations: regs })
    ).toEqual({ registrationId: 10, personId: 2 });
  });

  it("returns empty when email missing", () => {
    expect(emailAutoSelect({ email: undefined, registrations: regs })).toEqual(
      {}
    );
  });
});
