import { describe, expect, it } from "vitest";
import {
  DIRECTORY_TITLE_PRINT_ORDER,
  directoryTitleRank,
  sortDirectoryContactsByTitle,
} from "./directoryContacts";
import { WATERSYSTEM_DIRECTORY_TITLE_CHOICES } from "../../human-resources/contacts/constants/watersystemDirectoryTitles";

const titles = (list: { title?: string }[]) => list.map((c) => c.title ?? "");

describe("directoryTitleRank", () => {
  it("ranks the board/staff titles in print order", () => {
    expect(directoryTitleRank("Chairman")).toBe(0);
    expect(directoryTitleRank("Vice-Chairman")).toBe(1);
    expect(directoryTitleRank("Director")).toBe(2);
    expect(directoryTitleRank("Manager")).toBe(3);
    expect(directoryTitleRank("Operator")).toBe(4);
    expect(directoryTitleRank("Bookkeeper")).toBe(5);
  });

  it("ignores case, spacing and punctuation (titles are free text)", () => {
    expect(directoryTitleRank("vice chairman")).toBe(1);
    expect(directoryTitleRank("  VICE-CHAIRMAN ")).toBe(1);
    expect(directoryTitleRank("Vice Chairman")).toBe(1);
  });

  it("sorts unknown and blank titles last", () => {
    const last = DIRECTORY_TITLE_PRINT_ORDER.length;
    expect(directoryTitleRank("Board Member")).toBe(last);
    expect(directoryTitleRank("")).toBe(last);
    expect(directoryTitleRank(undefined)).toBe(last);
  });

  it("keeps every picker choice explicitly ranked", () => {
    // Guards against a title being added to the form but silently printing last.
    const unranked = WATERSYSTEM_DIRECTORY_TITLE_CHOICES.filter(
      (choice) => choice.id && directoryTitleRank(choice.id) === DIRECTORY_TITLE_PRINT_ORDER.length
    );
    expect(unranked).toEqual([]);
  });
});

describe("sortDirectoryContactsByTitle", () => {
  it("orders contacts left to right by title", () => {
    const sorted = sortDirectoryContactsByTitle([
      { title: "Bookkeeper" },
      { title: "Manager" },
      { title: "Chairman" },
      { title: "Operator" },
      { title: "Director" },
      { title: "Vice-Chairman" },
    ]);
    expect(titles(sorted)).toEqual([
      "Chairman",
      "Vice-Chairman",
      "Director",
      "Manager",
      "Operator",
      "Bookkeeper",
    ]);
  });

  it("puts unrecognized titles after the known ones", () => {
    const sorted = sortDirectoryContactsByTitle([
      { title: "Treasurer" },
      { title: "Manager" },
      { title: "" },
      { title: "Chairman" },
    ]);
    expect(titles(sorted)).toEqual(["Chairman", "Manager", "Treasurer", ""]);
  });

  it("is stable within a rank, keeping entry order", () => {
    const sorted = sortDirectoryContactsByTitle([
      { title: "Director", first: "Second" },
      { title: "Chairman", first: "Chair" },
      { title: "Director", first: "Third" },
    ] as { title?: string; first?: string }[]);
    expect(sorted.map((c) => c.first)).toEqual(["Chair", "Second", "Third"]);
  });

  it("does not mutate the input", () => {
    const input = [{ title: "Manager" }, { title: "Chairman" }];
    sortDirectoryContactsByTitle(input);
    expect(titles(input)).toEqual(["Manager", "Chairman"]);
  });
});
