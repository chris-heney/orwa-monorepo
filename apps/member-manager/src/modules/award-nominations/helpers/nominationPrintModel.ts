import {
  asPacketMediaItems,
  bestPacketMediaUrl,
  orderPacketAttachments,
  type AttachmentSlot,
  type OrderedAttachment,
  type PacketMediaFile,
} from "../../_components/review-packet/packetAttachments";
import { cycleYearOf } from "../../_components/review-packet/formatters";
import { boardMembersSummary, employeeTotal } from "./recordDisplay";

export type AwardPrintMedia = PacketMediaFile;

export type AwardPrintWatersystem = {
  name?: string | null;
  county?: string | null;
  region?: string | null;
} | null;

export type AwardNominationPrintRecord = Record<string, unknown> & {
  id?: string | number;
  documentId?: string;
  entityId?: number;
  nominee_name?: string | null;
  email?: string | null;
  daytime_phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  county?: string | null;
  system_name?: string | null;
  award_name_printed?: string | null;
  award_type?: string | null;
  award_year?: number | null;
  nomination_status?: string | null;
  submission_date?: string | null;
  createdAt?: string | null;
  operation_start_date?: string | null;
  employment_date?: string | null;
  beginning_members?: number | null;
  current_members?: number | null;
  clerical_employees?: number | null;
  operation_maintenance_employees?: number | null;
  management_employees?: number | null;
  justification?: string | null;
  biography_method?: string | null;
  biography_text?: string | null;
  biography_file?: AwardPrintMedia | AwardPrintMedia[];
  photographs?: AwardPrintMedia | AwardPrintMedia[];
  board_list_method?: string | null;
  board_list_file?: AwardPrintMedia | AwardPrintMedia[];
  board_members?: unknown;
  supporting_documents?: AwardPrintMedia | AwardPrintMedia[];
  nomination_pdf?: AwardPrintMedia | AwardPrintMedia[];
  nominator_first_name?: string | null;
  nominator_last_name?: string | null;
  nominator_address?: string | null;
  nominator_address_2?: string | null;
  nominator_city?: string | null;
  nominator_state?: string | null;
  nominator_zip?: string | null;
  nominator_country?: string | null;
  nominator_phone?: string | null;
  nominator_email?: string | null;
  watersystem?: AwardPrintWatersystem;
  contact?: {
    first?: string;
    last?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    name?: string;
  } | null;
};

export const AWARD_PRINT_POPULATE = {
  watersystem: true,
  photographs: true,
  biography_file: true,
  board_list_file: true,
  supporting_documents: true,
  nomination_pdf: true,
  contact: true,
};

/**
 * Upload fields in the order the public form asks for them
 * (`apps/awards` steps: Nominee Data → Biography → Photographs). The appendix
 * renders attachments in this order. `supporting_documents` is a legacy field
 * no step collects anymore; it prints last when present. `nomination_pdf` is
 * the PDF Strapi generated at submit time — it repeats this form, so it is
 * excluded unless the caller asks for it.
 */
export const AWARD_ATTACHMENT_SLOTS: ReadonlyArray<AttachmentSlot> = [
  { key: "board_list_file", label: "Board / Employee List" },
  { key: "biography_file", label: "Biography" },
  { key: "photographs", label: "Photographs" },
  { key: "supporting_documents", label: "Supporting Documents" },
  { key: "nomination_pdf", label: "Submitted Nomination PDF", system: true },
];

export const orderAwardAttachments = (
  record: AwardNominationPrintRecord,
  options: { includeSubmissionPdf?: boolean } = {}
): OrderedAttachment[] =>
  orderPacketAttachments(record, AWARD_ATTACHMENT_SLOTS, {
    includeSystem: options.includeSubmissionPdf,
  });

/** Keyed-in board members & employees → one printable line each. */
export const boardMemberLines = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return (value as Array<{ first?: string; last?: string; title?: string }>)
    .map((member) => {
      const name = joinPresent([member?.first, member?.last]);
      const title = String(member?.title || "").trim();
      if (!name && !title) return "";
      return title ? `${name || "—"} — ${title}` : name;
    })
    .filter(Boolean);
};

export const isSystemOfTheYearAward = (
  awardType: string | null | undefined
): boolean =>
  awardType === "System of the Year" ||
  awardType === "Water/Wastewater System of the Year";

export const displayValue = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

export const joinPresent = (
  parts: Array<string | null | undefined>,
  separator = " "
): string => parts.map((part) => String(part || "").trim()).filter(Boolean).join(separator);

const sanitizeFilename = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

/**
 * Year printed on the packet: the stamped `award_year`, else the cycle year
 * of the submission (`cycleYearOf`, same rule Strapi uses to stamp it).
 */
export const nominationPacketYear = (
  record?: Pick<
    AwardNominationPrintRecord,
    "award_year" | "submission_date" | "createdAt"
  > | null
): number => {
  if (record?.award_year) return Number(record.award_year);
  const derived = cycleYearOf(
    record?.submission_date ?? record?.createdAt ?? new Date()
  );
  return Number.isNaN(derived) ? cycleYearOf(new Date()) : derived;
};

export const nominationApplicationFilename = (
  record?: Pick<
    AwardNominationPrintRecord,
    "nominee_name" | "system_name" | "award_year" | "submission_date" | "createdAt"
  > | null
): string => {
  const who =
    sanitizeFilename(String(record?.nominee_name || "").trim()) ||
    sanitizeFilename(String(record?.system_name || "").trim()) ||
    "Nomination";
  return `ORWA-Award-Nomination-${who}-${nominationPacketYear(record)}.pdf`;
};

export const systemDisplayName = (
  record: AwardNominationPrintRecord
): string =>
  record.system_name?.trim() ||
  record.watersystem?.name?.trim() ||
  "";

export const printedAwardName = (
  record: AwardNominationPrintRecord
): string =>
  record.award_name_printed?.trim() ||
  systemDisplayName(record) ||
  record.nominee_name?.trim() ||
  "";

/** System name shown as the cover H1 (as printed on the award for system awards). */
export const systemNameAsPrinted = (
  record: AwardNominationPrintRecord
): string => {
  if (isSystemOfTheYearAward(record.award_type)) {
    return (
      record.award_name_printed?.trim() ||
      systemDisplayName(record) ||
      record.nominee_name?.trim() ||
      ""
    );
  }
  return systemDisplayName(record);
};

/** Person name as printed — empty for system awards (no individual nominee). */
export const nomineeNameAsPrinted = (
  record: AwardNominationPrintRecord
): string => {
  if (isSystemOfTheYearAward(record.award_type)) return "";
  return record.award_name_printed?.trim() || record.nominee_name?.trim() || "";
};

export const isPersonNomineeAward = (
  record: AwardNominationPrintRecord
): boolean => Boolean(nomineeNameAsPrinted(record));

export const printedNameLabel = (
  awardType: string | null | undefined
): string =>
  isSystemOfTheYearAward(awardType) ? "System Name" : "Nominee's Full Name";

export const countyRegion = (record: AwardNominationPrintRecord): string => {
  const county =
    record.county?.trim() || record.watersystem?.county?.trim() || "";
  const region = record.watersystem?.region?.trim() || "";
  return joinPresent([county, region], " / ");
};

export const nomineeMailingAddress = (
  record: AwardNominationPrintRecord
): string =>
  joinPresent(
    [
      record.address,
      joinPresent([record.city, record.state], ", "),
      record.zip,
    ],
    ", "
  );

const MONTHS_SHORT = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

/** Print EST callout — date-only strings stay on the calendar day (UTC). */
export const formatEstablishedDate = (
  value: string | null | undefined
): string => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const isoDay = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDay) {
    const year = Number(isoDay[1]);
    const month = Number(isoDay[2]) - 1;
    const day = Number(isoDay[3]);
    if (month >= 0 && month < 12 && day >= 1 && day <= 31) {
      return `${MONTHS_SHORT[month]} ${day} ${year}`;
    }
  }
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return `${MONTHS_SHORT[parsed.getUTCMonth()]} ${parsed.getUTCDate()} ${parsed.getUTCFullYear()}`;
};

export const formatCount = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "—";
  const num = Number(value);
  if (!Number.isFinite(num)) return displayValue(value);
  return num.toLocaleString("en-US");
};

export const nomineeAddressLines = (
  record: AwardNominationPrintRecord
): string[] => {
  const street = String(record.address || "").trim();
  const cityLine = joinPresent(
    [joinPresent([record.city, record.state], ", "), record.zip],
    " "
  );
  return [street, cityLine].filter(Boolean);
};

export const nominatorAddressLines = (
  record: AwardNominationPrintRecord
): string[] => {
  const lines = [
    String(record.nominator_address || "").trim(),
    String(record.nominator_address_2 || "").trim(),
    joinPresent(
      [
        joinPresent([record.nominator_city, record.nominator_state], ", "),
        record.nominator_zip,
      ],
      " "
    ),
    String(record.nominator_country || "").trim(),
  ].filter(Boolean);
  return lines;
};

export const nominatorFullName = (
  record: AwardNominationPrintRecord
): string =>
  joinPresent([record.nominator_first_name, record.nominator_last_name]);

export const nominatorMailingAddress = (
  record: AwardNominationPrintRecord
): string =>
  joinPresent(
    [
      record.nominator_address,
      record.nominator_address_2,
      joinPresent([record.nominator_city, record.nominator_state], ", "),
      record.nominator_zip,
      record.nominator_country,
    ],
    ", "
  );

export type IdentificationRow = {
  label: string;
  value: string;
};

/** Remaining identification fields after header / section-bar values. */
export const identificationRows = (
  record: AwardNominationPrintRecord
): IdentificationRow[] => [
  {
    label: "Address",
    value: displayValue(record.address),
  },
  {
    label: "City / State / ZIP",
    value: displayValue(
      joinPresent(
        [joinPresent([record.city, record.state], ", "), record.zip],
        " "
      )
    ),
  },
  {
    label: "Phone",
    value: displayValue(record.daytime_phone),
  },
  {
    label: "Email",
    value: displayValue(record.email),
  },
];

export const systemRecordRows = (
  record: AwardNominationPrintRecord
): Array<{ label: string; value: string }> => {
  const rows: Array<{ label: string; value: string }> = [
    {
      label: "Date system began operation",
      value: displayValue(record.operation_start_date),
    },
    {
      label: "Beginning meter connections",
      value: displayValue(record.beginning_members),
    },
    {
      label: "Current meter connections",
      value: displayValue(record.current_members),
    },
  ];
  if (isSystemOfTheYearAward(record.award_type)) {
    rows.push(
      {
        label: "Clerical employees",
        value: displayValue(record.clerical_employees),
      },
      {
        label: "Operation & maintenance employees",
        value: displayValue(record.operation_maintenance_employees),
      },
      {
        label: "Management employees",
        value: displayValue(record.management_employees),
      },
      {
        label: "Total employees",
        value: displayValue(employeeTotal(record)),
      }
    );
  }
  return rows;
};

export const nomineeBasicRows = (
  record: AwardNominationPrintRecord
): Array<{ label: string; value: string }> => {
  const rows: Array<{ label: string; value: string }> = [];
  if (!isSystemOfTheYearAward(record.award_type)) {
    rows.push({
      label: "Date employed",
      value: displayValue(record.employment_date),
    });
  }
  if (isSystemOfTheYearAward(record.award_type)) {
    rows.push({
      label: "Board / employee list via",
      value: displayValue(record.board_list_method),
    });
    const keyed = boardMembersSummary(record.board_members);
    if (keyed) {
      rows.push({
        label: "Board members & employees",
        value: keyed,
      });
    }
  }
  return rows;
};

export const nominatorRows = (
  record: AwardNominationPrintRecord
): Array<{ label: string; value: string }> => [
  { label: "First", value: displayValue(record.nominator_first_name) },
  { label: "Last", value: displayValue(record.nominator_last_name) },
  { label: "Email", value: displayValue(record.nominator_email) },
  { label: "Phone", value: displayValue(record.nominator_phone) },
  { label: "Mailing address", value: displayValue(record.nominator_address) },
  {
    label: "Address line 2",
    value: displayValue(record.nominator_address_2),
  },
  { label: "City", value: displayValue(record.nominator_city) },
  {
    label: "State / Province / Region",
    value: displayValue(record.nominator_state),
  },
  { label: "ZIP / Postal code", value: displayValue(record.nominator_zip) },
  { label: "Country", value: displayValue(record.nominator_country) },
];

export const asMediaItems = (
  file: AwardPrintMedia | AwardPrintMedia[] | undefined
): NonNullable<AwardPrintMedia>[] => asPacketMediaItems(file);

export const bestMediaUrl = (file: NonNullable<AwardPrintMedia>): string | null =>
  bestPacketMediaUrl(file) || null;

export const nominationRecordId = (
  record: AwardNominationPrintRecord
): string | number | null => {
  const id = record.id ?? record.documentId;
  if (id == null || id === "") return null;
  return id;
};
