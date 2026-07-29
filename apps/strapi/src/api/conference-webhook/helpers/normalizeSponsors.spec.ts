import { describe, expect, it } from "vitest";
import {
  normalizeSponsorAmounts,
  SponsorAmountError,
  type SponsorshipCatalogRow,
} from "./normalizeSponsors";

const catalog = (
  rows: SponsorshipCatalogRow[]
): Map<string, SponsorshipCatalogRow> =>
  new Map(rows.map((row) => [String(row.id), row]));

describe("normalizeSponsorAmounts", () => {
  it("forces fixed packages to catalog amount", () => {
    const result = normalizeSponsorAmounts(
      [{ id: 1, name: "Banner", amount: 1 }],
      catalog([{ id: 1, name: "Banner", amount: 150, allow_custom_amount: false }])
    );
    expect(result).toEqual([{ id: 1, name: "Banner", amount: 150 }]);
  });

  it("keeps custom amounts at or above minimum", () => {
    const result = normalizeSponsorAmounts(
      [{ id: 2, name: "Bass", amount: 250 }],
      catalog([{ id: 2, name: "Bass", amount: 150, allow_custom_amount: true }])
    );
    expect(result[0].amount).toBe(250);
  });

  it("rejects custom amounts below minimum", () => {
    expect(() =>
      normalizeSponsorAmounts(
        [{ id: 2, name: "Bass", amount: 100 }],
        catalog([{ id: 2, name: "Bass", amount: 150, allow_custom_amount: true }])
      )
    ).toThrow(SponsorAmountError);
  });

  it("collapses duplicate custom-amount lines to one", () => {
    const result = normalizeSponsorAmounts(
      [
        { id: 2, name: "Bass", amount: 200 },
        { id: 2, name: "Bass", amount: 300 },
      ],
      catalog([{ id: 2, name: "Bass", amount: 150, allow_custom_amount: true }])
    );
    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe(200);
  });
});
