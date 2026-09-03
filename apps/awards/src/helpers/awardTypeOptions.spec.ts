import { describe, expect, it } from "vitest";
import {
  FALLBACK_NOMINATABLE_AWARD_TYPES,
  nominatableAwardTypes,
  toAwardTypeSelectOptions,
} from "./awardTypeOptions";

describe("nominatableAwardTypes", () => {
  it("keeps only nominatable rows and sorts by order", () => {
    expect(
      nominatableAwardTypes([
        { name: "Man of the Year", nominatable: false, order: 5 },
        { name: "Excellence in Management", nominatable: true, order: 30 },
        { name: "System of the Year", nominatable: true, order: 10 },
      ]).map((row) => row.name)
    ).toEqual(["System of the Year", "Excellence in Management"]);
  });
});

describe("toAwardTypeSelectOptions", () => {
  it("falls back to the previous public-form list when the API is empty", () => {
    const { options, usedFallback } = toAwardTypeSelectOptions([]);
    expect(usedFallback).toBe(true);
    expect(options.map((row) => row.value)).toEqual([
      ...FALLBACK_NOMINATABLE_AWARD_TYPES,
    ]);
  });

  it("keeps a draft value that is no longer nominatable", () => {
    const { options, usedFallback } = toAwardTypeSelectOptions(
      [{ name: "System of the Year", nominatable: true, order: 10 }],
      "Man of the Year"
    );
    expect(usedFallback).toBe(false);
    expect(options.map((row) => row.value)).toEqual([
      "System of the Year",
      "Man of the Year",
    ]);
  });
});
