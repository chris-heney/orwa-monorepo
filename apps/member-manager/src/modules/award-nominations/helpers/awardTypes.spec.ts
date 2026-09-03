import { describe, expect, it } from "vitest";
import { awardTypeChoices, sortAwardTypes } from "./awardTypes";

describe("sortAwardTypes", () => {
  it("sorts by order then name", () => {
    expect(
      sortAwardTypes([
        { id: "b", name: "Beta", order: 20 },
        { id: "a", name: "Alpha", order: 20 },
        { id: "c", name: "First", order: 10 },
      ]).map((row) => row.name)
    ).toEqual(["First", "Alpha", "Beta"]);
  });
});

describe("awardTypeChoices", () => {
  it("maps Strapi rows to select choices and keeps an unknown current value", () => {
    expect(
      awardTypeChoices(
        [{ id: "1", name: "System of the Year", order: 10 }],
        "Legacy Title"
      )
    ).toEqual([
      { id: "System of the Year", name: "System of the Year" },
      { id: "Legacy Title", name: "Legacy Title" },
    ]);
  });

  it("falls back to the previous hardcoded list when the API is empty", () => {
    const choices = awardTypeChoices([]);
    expect(choices.some((row) => row.id === "System of the Year")).toBe(true);
    expect(choices.some((row) => row.id === "Excellence in Operations")).toBe(
      true
    );
  });
});
