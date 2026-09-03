import { describe, expect, it } from "vitest";
import { AWARD_TYPE_SEEDS } from "./seed";

const PUBLIC_FORM_TYPES = [
  "System of the Year",
  "Excellence in Operations",
  "Excellence in Management",
  "Excellence in Office Operations",
];

describe("AWARD_TYPE_SEEDS", () => {
  it("has unique names", () => {
    const names = AWARD_TYPE_SEEDS.map((row) => row.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("marks current public-form types nominatable and the rest not", () => {
    for (const row of AWARD_TYPE_SEEDS) {
      expect(row.nominatable).toBe(PUBLIC_FORM_TYPES.includes(row.name));
    }
  });

  it("includes the legacy Water/Wastewater System of the Year label", () => {
    const legacy = AWARD_TYPE_SEEDS.find(
      (row) => row.name === "Water/Wastewater System of the Year"
    );
    expect(legacy?.nominatable).toBe(false);
  });

  it("orders nominatable types before ceremony titles", () => {
    const lastNominatable = Math.max(
      ...AWARD_TYPE_SEEDS.filter((row) => row.nominatable).map((row) => row.order)
    );
    const firstCeremony = Math.min(
      ...AWARD_TYPE_SEEDS.filter((row) => !row.nominatable).map((row) => row.order)
    );
    expect(lastNominatable).toBeLessThan(firstCeremony);
  });
});
