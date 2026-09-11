import { describe, expect, it, vi } from "vitest";

vi.mock("react-admin", () => ({ downloadCSV: vi.fn() }));

import {
  buildScheduleCsv,
  formatScheduleTime,
  scheduleCsvCell,
  scheduleCsvFilename,
  scheduleDateHeading,
} from "./scheduleCsv";
import type { ScheduleItem } from "./types";

const item = (overrides: Partial<ScheduleItem>): ScheduleItem => ({
  id: 1,
  date: "2026-09-30",
  start: "08:00:00.000",
  end: "09:00:00.000",
  location: "Lobby",
  event: "Registration",
  description: "",
  speaker: "",
  company: "",
  ...overrides,
});

describe("scheduleCsvCell", () => {
  it("collapses every kind of line break so a cell never splits the row", () => {
    expect(scheduleCsvCell("Introduction,\nKickoff\r\nand\rupdates")).toBe(
      '"Introduction, Kickoff and updates"'
    );
  });

  it("doubles quotes and trims", () => {
    expect(scheduleCsvCell('  The "Open Meeting" Act  ')).toBe('"The ""Open Meeting"" Act"');
  });

  it("renders null / undefined as an empty quoted cell", () => {
    expect(scheduleCsvCell(undefined)).toBe('""');
    expect(scheduleCsvCell(null)).toBe('""');
  });
});

describe("formatScheduleTime", () => {
  it("keeps the existing export format", () => {
    expect(formatScheduleTime("08:00:00.000")).toBe("8AM");
    expect(formatScheduleTime("13:30:00")).toBe("1:30 PM");
    expect(formatScheduleTime("00:15")).toBe("12:15 AM");
    expect(formatScheduleTime("")).toBe("");
  });
});

describe("scheduleDateHeading", () => {
  it("reads the date as a local calendar day, not UTC midnight", () => {
    expect(scheduleDateHeading("2026-09-30")).toBe("Wednesday, September 30");
    expect(scheduleDateHeading("2026-10-01")).toBe("Thursday, October 1");
  });
});

describe("buildScheduleCsv", () => {
  it("puts multi-line descriptions on one row and escapes quotes in every column", () => {
    const csv = buildScheduleCsv([
      item({
        event: 'Opening "Session"',
        description: "Introduction, Kickoff and\nRegulatory / Agency updates",
        speaker: "Arvil Morgan",
      }),
    ]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("Time,Location,Event,Description,Speaker");
    expect(lines[1]).toBe('"Wednesday, September 30",,,,');
    expect(lines[2]).toBe(
      '"8AM - 9AM","Lobby","Opening ""Session""","Introduction, Kickoff and Regulatory / Agency updates","Arvil Morgan"'
    );
    // heading + 1 item + blank separator, trailing newline
    expect(lines).toHaveLength(5);
    expect(csv.endsWith("\n\n")).toBe(true);
  });

  it("groups by day in time order without mutating the input", () => {
    const records = [
      item({ id: 3, date: "2026-10-01", start: "09:00:00", event: "Day 2" }),
      item({ id: 2, date: "2026-09-30", start: "10:00:00", event: "Later" }),
      item({ id: 1, date: "2026-09-30", start: "07:30:00", end: "", event: "Early" }),
    ];
    const csv = buildScheduleCsv(records);
    expect(records.map((r) => r.id)).toEqual([3, 2, 1]);
    const rows = csv.split("\n").filter(Boolean);
    expect(rows).toEqual([
      "Time,Location,Event",
      '"Wednesday, September 30",,',
      '"7:30 AM","Lobby","Early"',
      '"10AM - 9AM","Lobby","Later"',
      '"Thursday, October 1",,',
      '"9AM - 9AM","Lobby","Day 2"',
    ]);
  });

  it("adds Training Hours only when an item has some", () => {
    const csv = buildScheduleCsv([item({ training_hours: 1 }), item({ id: 2, training_hours: 0 })]);
    expect(csv.split("\n")[0]).toBe("Time,Location,Event,Training Hours");
    expect(csv).toContain('"8AM - 9AM","Lobby","Registration","1"');
    expect(csv).toContain('"8AM - 9AM","Lobby","Registration",""');
  });
});

describe("scheduleCsvFilename", () => {
  it("names the conference when known", () => {
    const now = new Date("2026-09-11T15:00:00Z");
    expect(scheduleCsvFilename("Fall Conference", now)).toBe("ORWA-Schedule-Fall Conference-2026-09-11");
    expect(scheduleCsvFilename("", now)).toBe("ORWA-Schedule-2026-09-11");
  });
});
