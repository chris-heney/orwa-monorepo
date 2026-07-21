import { describe, expect, it } from "vitest";
import { sanitizeRegistrationExtras } from "./sanitizeRegistrationExtras";
import { IExtraOption, IRegistrationPayload } from "../types/types";

const fallExtras = [
  { id: 37, name: "Lunch" },
  { id: 38, name: "Dinner" },
] as unknown as IExtraOption[];

describe("sanitizeRegistrationExtras", () => {
  it("removes orphan ticket extras from another conference", () => {
    const payload = {
      tickets: [
        {
          first: "Sean",
          last: "Landrum",
          extras: [34, 37], // 34 = Expo Lunch, 37 = Fall Lunch
        },
      ],
      booths: [],
    } as unknown as IRegistrationPayload;

    const sanitized = sanitizeRegistrationExtras(payload, fallExtras);
    expect(sanitized.tickets[0].extras).toEqual([37]);
  });
});
