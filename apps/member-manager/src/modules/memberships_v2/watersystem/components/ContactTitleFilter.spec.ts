import { describe, it, expect } from "vitest";
import {
  readContactTitleFilter,
  isContactTitleSelected,
  toggleContactTitle,
} from "./ContactTitleFilter";

/**
 * `contact.title` is free text, so the filter matches case-insensitive
 * substrings. These cover the pure helpers behind the drawer chips: what the
 * toggle emits, and that a filter saved under an older shape still reads back.
 */
describe("readContactTitleFilter", () => {
  it("reads the emitted $or/$containsi shape", () => {
    expect(
      readContactTitleFilter({
        contacts: {
          $or: [
            { title: { $containsi: "Manager" } },
            { title: { $containsi: "Operator" } },
          ],
        },
      })
    ).toEqual(["Manager", "Operator"]);
  });

  it("reads the legacy $in shape from a saved filter", () => {
    expect(
      readContactTitleFilter({ contacts: { title: { $in: ["Bookkeeper"] } } })
    ).toEqual(["Bookkeeper"]);
  });

  it("reads a legacy bare-string title", () => {
    expect(readContactTitleFilter({ contacts: { title: "Chairman" } })).toEqual([
      "Chairman",
    ]);
  });

  it("returns nothing for absent, empty or malformed filters", () => {
    expect(readContactTitleFilter(undefined)).toEqual([]);
    expect(readContactTitleFilter({})).toEqual([]);
    expect(readContactTitleFilter({ contacts: { title: "" } })).toEqual([]);
    expect(readContactTitleFilter({ contacts: { $or: [null, {}, 7] } })).toEqual(
      []
    );
  });
});

describe("isContactTitleSelected", () => {
  it("marks only the titles present in the filter", () => {
    const filters = { contacts: { $or: [{ title: { $containsi: "Manager" } }] } };
    expect(isContactTitleSelected({ title: "Manager" }, filters)).toBe(true);
    expect(isContactTitleSelected({ title: "Operator" }, filters)).toBe(false);
  });
});

describe("toggleContactTitle", () => {
  it("adds a title as a $containsi clause", () => {
    expect(toggleContactTitle({ title: "Manager" }, {})).toEqual({
      contacts: { $or: [{ title: { $containsi: "Manager" } }] },
    });
  });

  it("accumulates titles as an OR, keeping selection order", () => {
    const one = toggleContactTitle({ title: "Manager" }, {});
    expect(toggleContactTitle({ title: "Operator" }, one)).toEqual({
      contacts: {
        $or: [
          { title: { $containsi: "Manager" } },
          { title: { $containsi: "Operator" } },
        ],
      },
    });
  });

  it("removes a selected title without disturbing the others", () => {
    const both = {
      contacts: {
        $or: [
          { title: { $containsi: "Manager" } },
          { title: { $containsi: "Operator" } },
        ],
      },
    };
    expect(toggleContactTitle({ title: "Manager" }, both)).toEqual({
      contacts: { $or: [{ title: { $containsi: "Operator" } }] },
    });
  });

  it("drops the contacts key entirely when the last title is removed", () => {
    const one = { region: "Region 1", contacts: { $or: [{ title: { $containsi: "Manager" } }] } };
    expect(toggleContactTitle({ title: "Manager" }, one)).toEqual({
      region: "Region 1",
    });
  });

  it("leaves the list's other filters untouched", () => {
    expect(toggleContactTitle({ title: "Operator" }, { region: "Region 2" })).toEqual({
      region: "Region 2",
      contacts: { $or: [{ title: { $containsi: "Operator" } }] },
    });
  });

  it("upgrades a legacy $in filter to the substring shape when toggled", () => {
    expect(
      toggleContactTitle(
        { title: "Operator" },
        { contacts: { title: { $in: ["Manager"] } } }
      )
    ).toEqual({
      contacts: {
        $or: [
          { title: { $containsi: "Manager" } },
          { title: { $containsi: "Operator" } },
        ],
      },
    });
  });
});
