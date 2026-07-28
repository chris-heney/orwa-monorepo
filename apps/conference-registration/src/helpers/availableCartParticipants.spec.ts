import { describe, expect, it } from "vitest";
import { availableCartParticipants } from "./availableCartParticipants";
import type { ITicketPayload } from "../types/types";

const person = (
  type: "Attendee" | "Vendor" | "Contestant",
  first: string,
  opts?: { source?: number; ticketName?: string }
): ITicketPayload =>
  ({
    type,
    first,
    last: "Test",
    source_ticket_id: opts?.source,
    ticket_type: opts?.ticketName ? { name: opts.ticketName } : undefined,
  }) as ITicketPayload;

describe("availableCartParticipants", () => {
  const tickets = [
    person("Attendee", "Sarah"), // 0
    person("Attendee", "Chris"), // 1
    person("Contestant", "SarahGolf", {
      source: 0,
      ticketName: "Golfer",
    }), // 2
  ];

  it("excludes people already attached to the same sport", () => {
    const available = availableCartParticipants({
      tickets,
      currentContestantIndex: 3,
      sport: "golf",
    });
    expect(available.map((row) => row.person.first)).toEqual(["Chris"]);
    expect(available.map((row) => row.absoluteIndex)).toEqual([1]);
  });

  it("allows a golfer to also be selected as a fisher", () => {
    const available = availableCartParticipants({
      tickets,
      currentContestantIndex: 3,
      sport: "fish",
    });
    expect(available.map((row) => row.absoluteIndex)).toEqual([0, 1]);
  });

  it("keeps the currently attached person when editing that contestant", () => {
    const available = availableCartParticipants({
      tickets,
      currentContestantIndex: 2,
      currentSourceTicketId: 0,
      sport: "golf",
    });
    expect(available.map((row) => row.absoluteIndex)).toEqual([0, 1]);
  });

  it("blocks duplicate fishers while still allowing a golfer for that person", () => {
    const withFish = [
      ...tickets,
      person("Contestant", "SarahFish", {
        source: 0,
        ticketName: "Fishing Tournament",
      }),
    ];
    expect(
      availableCartParticipants({
        tickets: withFish,
        currentContestantIndex: 4,
        sport: "fish",
      }).map((row) => row.absoluteIndex)
    ).toEqual([1]);
    expect(
      availableCartParticipants({
        tickets: withFish,
        currentContestantIndex: 4,
        sport: "golf",
      }).map((row) => row.absoluteIndex)
    ).toEqual([1]); // Sarah already golfing on line 2
  });

  it("treats cart index 0 as a real selection for exclusion", () => {
    const available = availableCartParticipants({
      tickets: [
        person("Attendee", "Only"),
        person("Contestant", "Dup", { source: 0, ticketName: "Golfer" }),
      ],
      currentContestantIndex: 2,
      sport: "golf",
    });
    expect(available).toEqual([]);
  });
});
