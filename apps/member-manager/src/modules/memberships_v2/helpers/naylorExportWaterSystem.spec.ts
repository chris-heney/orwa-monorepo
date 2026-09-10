import { describe, expect, it, vi, beforeEach } from "vitest";

const captured: Record<string, string>[][] = [];
vi.mock("jsonexport/dist", () => ({
  default: (
    data: Record<string, string>[],
    cb: (e: unknown, csv: string) => void
  ) => {
    captured.push(data);
    cb(null, "");
  },
}));
vi.mock("react-admin", () => ({ downloadCSV: () => undefined }));

import { NaylorExportWaterSystem } from "./naylorExportWaterSystem";

const COLUMNS = [
  { index: "0", source: "name", label: "Name" },
  { index: "1", source: "email", label: "Office Email" },
] as never;

type Contact = Record<string, unknown>;

const system = (contacts: Contact[]) => ({
  id: "docidaaaaaaaaaaaaaaaa",
  entityId: 11,
  name: "Testville RWD",
  email: "office@testville.org",
  payment_last_date: null,
  payment_previous_date: null,
  contacts,
});

/** getList stub: only the opt-out sweep of `contacts` is ever called. */
const providerWith = (optedOutRows: Contact[]) => ({
  getList: vi.fn().mockResolvedValue({
    data: optedOutRows,
    total: optedOutRows.length,
  }),
});

const run = async (contacts: Contact[], optedOutRows: Contact[] = []) => {
  const dp = providerWith(optedOutRows);
  await NaylorExportWaterSystem(
    [system(contacts)] as never,
    COLUMNS,
    [],
    "probe",
    dp as never
  );
  return { row: captured[captured.length - 1][0], dp };
};

beforeEach(() => {
  captured.length = 0;
});

describe("NaylorExportWaterSystem — directory contacts", () => {
  it("publishes the contact block for contacts who have not opted out", async () => {
    const { row } = await run([
      { id: 1, first: "Ada", last: "Byron", title: "Manager", email: "ada@x.org", phone: "555-1000" },
    ]);
    expect(row["Contact 1: First Name"]).toBe("Ada");
    expect(row["Contact 1: Title"]).toBe("Manager");
    expect(row["Contact 1: Email"]).toBe("ada@x.org");
    expect(row["Contact 1: Phone"]).toBe("555-1000");
    // Unfilled slots still emit their columns, so the file shape is stable.
    expect(row["Contact 2: First Name"]).toBe("");
    expect(row["Contact 3: Email"]).toBe("");
  });

  it("suppresses a contact flagged inline, and re-indexes the survivors", async () => {
    const { row } = await run([
      { id: 1, first: "OptedOut", email: "no@x.org", directory_opt_out: true },
      { id: 2, first: "Published", email: "yes@x.org" },
    ]);
    expect(row["Contact 1: First Name"]).toBe("Published");
    expect(row["Contact 2: First Name"]).toBe("");
  });

  it("suppresses a contact whose email opted out on a different contact row", async () => {
    // The inline copy has no flag; the contacts table says this person opted out.
    const { row, dp } = await run(
      [{ id: 9, first: "Ada", email: "Ada@X.org" }],
      [{ id: 77, email: "ada@x.org", directory_opt_out: true }]
    );
    expect(row["Contact 1: First Name"]).toBe("");
    expect(dp.getList).toHaveBeenCalledWith(
      "contacts",
      expect.objectContaining({ filter: { directory_opt_out: true } })
    );
  });

  it("still publishes a contact with no email when nothing flags them", async () => {
    const { row } = await run(
      [{ id: 3, first: "NoEmail", last: "Person" }],
      [{ id: 78, email: "", directory_opt_out: true }]
    );
    // An empty opt-out email must not match every email-less contact.
    expect(row["Contact 1: First Name"]).toBe("NoEmail");
  });

  it("orders the slots by title, after opt-outs are removed", async () => {
    const { row } = await run(
      [
        { id: 1, first: "Opal", title: "Operator", email: "opal@x.org" },
        { id: 2, first: "Bob", title: "Bookkeeper", email: "bob@x.org" },
        { id: 3, first: "Vera", title: "Vice-Chairman", email: "vera@x.org" },
        { id: 4, first: "Cora", title: "Chairman", email: "cora@x.org" },
        { id: 5, first: "Dana", title: "Director", email: "dana@x.org" },
      ],
      // Cora opted out on another contact row, so Vera leads the block.
      [{ id: 90, email: "cora@x.org", directory_opt_out: true }]
    );
    expect(row["Contact 1: First Name"]).toBe("Vera");
    expect(row["Contact 1: Title"]).toBe("Vice-Chairman");
    expect(row["Contact 2: First Name"]).toBe("Dana");
    expect(row["Contact 3: First Name"]).toBe("Opal");
    // Only three slots print; Bob (Bookkeeper) falls off the end.
    expect(row["Contact 3: Title"]).toBe("Operator");
  });

  it("aborts the export when the opt-out sweep fails", async () => {
    const dp = {
      getList: vi.fn().mockRejectedValue(new Error("network")),
    } as never;
    await expect(
      NaylorExportWaterSystem([system([{ id: 1, first: "Ada" }])] as never, COLUMNS, [], "probe", dp)
    ).rejects.toThrow("network");
  });
});
