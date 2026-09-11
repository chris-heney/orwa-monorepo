import { downloadCSV } from "react-admin";
import type { ScheduleItem } from "./types";

/**
 * CR/LF plus the Unicode line and paragraph separators (U+2028 / U+2029),
 * which some editors paste into descriptions. Built from char codes so the
 * source never contains the raw separators — they terminate a regex literal.
 */
const LINE_BREAKS = new RegExp(
  `\\r\\n|[\\r\\n${String.fromCharCode(0x2028, 0x2029)}]`,
  "g"
);

/**
 * One CSV cell for the schedule export.
 *
 * Descriptions are typed in a multi-line field; a raw newline inside a cell
 * starts a new row in Excel / Sheets, so line breaks collapse to a single
 * space. Quotes are doubled in EVERY field (the old export only escaped
 * Description, so a quote in a location or speaker broke the row).
 */
export const scheduleCsvCell = (value: unknown): string => {
  const text = value == null ? "" : String(value);
  const flat = text.replace(LINE_BREAKS, " ").replace(/[ \t]{2,}/g, " ").trim();
  return `"${flat.replace(/"/g, '""')}"`;
};

/** "13:30:00.000" → "1:30 PM"; whole hours read "1PM" (the export's existing format). */
export const formatScheduleTime = (time: string | null | undefined): string => {
  if (!time) return "";
  const parts = time.split(":");
  if (parts.length < 2) return time;
  let hours = parseInt(parts[0], 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutes = parseInt(parts[1], 10);
  return minutes === 0
    ? `${hours}${ampm}`
    : `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

const timeRange = (item: ScheduleItem): string => {
  if (item.start && item.end) {
    return `${formatScheduleTime(item.start)} - ${formatScheduleTime(item.end)}`;
  }
  if (item.start) return formatScheduleTime(item.start);
  if (item.end) return formatScheduleTime(item.end);
  return "N/A";
};

/**
 * "2026-09-30" → "Wednesday, September 30".
 * Parsed as a LOCAL date: `new Date("2026-09-30")` is UTC midnight, the
 * previous evening west of Greenwich — which the old export papered over by
 * adding a day (and so was a day late anywhere east of UTC).
 */
export const scheduleDateHeading = (date: string): string => {
  const [y, m, d] = date.split("-").map(Number);
  const local = y && m && d ? new Date(y, m - 1, d) : new Date(date);
  return local.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const hasText = (value: unknown) => typeof value === "string" && value.trim() !== "";

/**
 * The schedule as CSV: Time / Location / Event plus Description, Speaker,
 * Company and Training Hours only when some item has them; a heading row per
 * day and a blank row after each day. Does not mutate `records`.
 */
export const buildScheduleCsv = (records: ScheduleItem[]): string => {
  const sorted = [...records].sort(
    (a, b) =>
      new Date(`${a.date}T${a.start}`).getTime() -
      new Date(`${b.date}T${b.start}`).getTime()
  );
  const days = new Map<string, ScheduleItem[]>();
  for (const item of sorted) {
    const list = days.get(item.date) ?? [];
    list.push(item);
    days.set(item.date, list);
  }

  const withDescription = sorted.some((r) => hasText(r.description));
  const withSpeaker = sorted.some((r) => hasText(r.speaker));
  const withCompany = sorted.some((r) => hasText(r.company));
  const withTrainingHours = sorted.some(
    (r) => r.training_hours !== undefined && r.training_hours !== null && r.training_hours > 0
  );

  const headers = ["Time", "Location", "Event"];
  if (withDescription) headers.push("Description");
  if (withSpeaker) headers.push("Speaker");
  if (withCompany) headers.push("Company");
  if (withTrainingHours) headers.push("Training Hours");

  const lines = [headers.join(",")];
  days.forEach((items, date) => {
    lines.push(`${scheduleCsvCell(scheduleDateHeading(date))}${",".repeat(headers.length - 1)}`);
    for (const item of items) {
      const row: unknown[] = [timeRange(item), item.location, item.event];
      if (withDescription) row.push(item.description);
      if (withSpeaker) row.push(item.speaker);
      if (withCompany) row.push(item.company);
      if (withTrainingHours) row.push(item.training_hours || "");
      lines.push(row.map(scheduleCsvCell).join(","));
    }
    lines.push("");
  });
  return `${lines.join("\n")}\n`;
};

/** `ORWA-Schedule-<Conference>-<YYYY-MM-DD>` (downloadCSV appends `.csv`). */
export const scheduleCsvFilename = (conferenceName?: string, now = new Date()): string =>
  `ORWA-Schedule-${conferenceName ? `${conferenceName}-` : ""}${now.toISOString().split("T")[0]}`;

export const downloadScheduleCsv = (records: ScheduleItem[], conferenceName?: string): void =>
  downloadCSV(buildScheduleCsv(records), scheduleCsvFilename(conferenceName));
