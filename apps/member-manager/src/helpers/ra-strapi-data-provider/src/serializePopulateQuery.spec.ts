import { describe, expect, it } from "vitest";
import { serializePopulateQuery } from "./serializePopulateQuery";
import { CONFERENCE_REGISTRATION_RECEIPT_POPULATE } from "../../../modules/conference/helpers/registrationReceiptContestants";

describe("serializePopulateQuery", () => {
  it("defaults empty populate to populate=*", () => {
    expect(serializePopulateQuery([])).toBe("populate=*");
    expect(serializePopulateQuery(true)).toBe("populate=*");
    expect(serializePopulateQuery(undefined)).toBe("populate=*");
  });

  it("uses a custom filter as-is", () => {
    expect(serializePopulateQuery([], "populate[payouts]=true")).toBe(
      "populate[payouts]=true"
    );
  });

  it("serializes a first-level relation as populate[key]=true", () => {
    expect(serializePopulateQuery({ payouts: true })).toBe(
      "populate[payouts]=true"
    );
  });

  it("serializes nested populate without a relation-level * wildcard", () => {
    expect(
      serializePopulateQuery({
        payouts: { populate: { payout_status: true } },
      })
    ).toBe("populate[payouts][populate][payout_status]=true");
  });

  it("serializes the conference registration receipt populate shape for Strapi v5", () => {
    expect(serializePopulateQuery(CONFERENCE_REGISTRATION_RECEIPT_POPULATE)).toBe(
      [
        "populate[registrant]=true",
        "populate[attendees][populate][conference_ticket]=true",
        "populate[booths]=true",
        "populate[conference_sponsor][populate][sponsorship_items]=true",
        "populate[conference_sponsor][populate][logo]=true",
        "populate[team]=true",
        "populate[contestants][populate][conference_ticket]=true",
        "populate[contestants][populate][team]=true",
        "populate[contestants][populate][items][populate][item]=true",
        "populate[taste_test_contestants][populate][watersystem]=true",
      ].join("&")
    );
  });
});
