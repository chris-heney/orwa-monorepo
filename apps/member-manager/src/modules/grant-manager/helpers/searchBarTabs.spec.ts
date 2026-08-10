import { describe, expect, it } from "vitest";
import {
  buildApplicationOrFilter,
  buildScoresOrFilter,
  extractOrSearchText,
  hasPersistedSearch,
  isSearchableTab,
  stripSearchKeys,
} from "./searchBarTabs";

describe("searchBarTabs", () => {
  it("isSearchableTab", () => {
    expect(isSearchableTab("applications")).toBe(true);
    expect(isSearchableTab("summary")).toBe(false);
  });

  it("buildApplicationOrFilter returns null for blank", () => {
    expect(buildApplicationOrFilter("")).toBeNull();
    expect(buildApplicationOrFilter("  ")).toBeNull();
  });

  it("buildApplicationOrFilter builds name/id $or", () => {
    expect(buildApplicationOrFilter("Acme")).toEqual({
      $or: [
        { application: { legal_entity_name: { $containsi: "Acme" } } },
        { application: { application_id: { $containsi: "Acme" } } },
      ],
    });
  });

  it("buildScoresOrFilter builds grant_application $or", () => {
    expect(buildScoresOrFilter("42")).toEqual({
      $or: [
        { grant_application: { legal_entity_name: { $containsi: "42" } } },
        { grant_application: { application_id: { $containsi: "42" } } },
      ],
    });
  });

  it("extractOrSearchText reads first $containsi leaf", () => {
    expect(
      extractOrSearchText({
        $or: [{ application: { legal_entity_name: { $containsi: "X" } } }],
      })
    ).toBe("X");
    expect(extractOrSearchText({})).toBe("");
  });

  it("hasPersistedSearch", () => {
    expect(hasPersistedSearch("q")).toBe(true);
    expect(hasPersistedSearch("")).toBe(false);
    expect(hasPersistedSearch(undefined)).toBe(false);
  });

  it("stripSearchKeys removes q, $or, and legacy keys", () => {
    expect(
      stripSearchKeys(
        {
          grant: 4,
          q: "x",
          $or: [{ a: 1 }],
          "application][legal_entity_name][$contains": "y",
        },
        ["application][legal_entity_name][$contains"]
      )
    ).toEqual({ grant: 4 });
  });
});
