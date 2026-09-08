import { RaRecord } from "react-admin";
import { ISharedMeta } from "../types/IConference";
import { partitionContestants } from "./partitionContestants";

export const CONFERENCE_REGISTRATION_RECEIPT_POPULATE = {
  registrant: true,
  attendees: { populate: { conference_ticket: true } },
  booths: true,
  conference_sponsor: { populate: { sponsorship_items: true, logo: true } },
  team: true,
  contestants: {
    populate: {
      conference_ticket: true,
      team: true,
      items: { populate: { item: true } },
    },
  },
  taste_test_contestants: { populate: { watersystem: true } },
} as const;

const money = (value: unknown): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(Number(value)) ? Number(value) : 0);

const relationName = (
  relation: RaRecord | string | number | null | undefined,
  fallback = "Unspecified"
): string => {
  if (relation && typeof relation === "object") {
    return ((relation.name as string | undefined) || "").trim() || fallback;
  }
  return relation != null ? String(relation) : fallback;
};

const contestantName = (record: RaRecord): string =>
  `${record.first ?? ""} ${record.last ?? ""}`.trim() || "Unnamed contestant";

const mulliganItems = (items: ISharedMeta[] | null | undefined): ISharedMeta[] =>
  (items ?? []).filter((item) =>
    `${item.key ?? ""} ${item.label ?? ""}`.toLowerCase().includes("mulligan")
  );

const mulliganLabels = (items: ISharedMeta[] | null | undefined): string[] => {
  const counts = new Map<string, { label: string; value: unknown; count: number }>();
  for (const item of mulliganItems(items)) {
    const key = `${item.label}:${item.value}`;
    const existing = counts.get(key) ?? {
      label: item.label,
      value: item.value,
      count: 0,
    };
    existing.count += 1;
    counts.set(key, existing);
  }
  return Array.from(counts.values()).map(
    (item) => `${item.label} x${item.count} (${money(item.value)} each)`
  );
};

export interface ReceiptContestantRow extends RaRecord {
  name: string;
  ticket: string;
  team: string;
  mulligans: string[];
}

type ReceiptContestantRecord = RaRecord & { status?: string | null };

const toReceiptContestantRow = (record: RaRecord): ReceiptContestantRow => ({
  ...record,
  name: contestantName(record),
  ticket: relationName(record.conference_ticket as RaRecord | number | null),
  team: relationName(record.team as RaRecord | number | null, ""),
  mulligans: mulliganLabels(record.items as ISharedMeta[]),
});

export const buildReceiptContestantRows = (
  records: RaRecord[] | null | undefined
): { active: ReceiptContestantRow[]; cancelled: ReceiptContestantRow[] } => {
  const partitioned = partitionContestants(
    (records ?? []) as ReceiptContestantRecord[]
  );
  return {
    active: partitioned.active.map(toReceiptContestantRow),
    cancelled: partitioned.cancelled.map(toReceiptContestantRow),
  };
};

export const buildRegistrationReceiptRecord = <T extends RaRecord>(
  record: T
): T & {
  active_contestants: ReceiptContestantRow[];
  cancelled_contestants: ReceiptContestantRow[];
} => {
  const rows = buildReceiptContestantRows(
    Array.isArray(record.contestants) ? (record.contestants as RaRecord[]) : []
  );
  return {
    ...record,
    active_contestants: rows.active,
    cancelled_contestants: rows.cancelled,
  };
};
