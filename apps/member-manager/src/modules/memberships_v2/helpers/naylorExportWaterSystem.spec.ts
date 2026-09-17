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

import {
  NAYLOR_SYSTEM_FIELDS,
  NaylorExportWaterSystem,
  naylorCell,
  naylorColumnLabels,
} from "./naylorExportWaterSystem";

type Contact = Record<string, unknown>;

const system = (
  contacts: Contact[],
  overrides: Record<string, unknown> = {}
) => ({
  id: "docidaaaaaaaaaaaaaaaa",
  entityId: 11,
  name: "Testville RWD",
  email: "office@testville.org",
  payment_last_date: null,
  payment_previous_date: null,
  contacts,
  ...overrides,
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
  await NaylorExportWaterSystem([system(contacts)] as never, "probe", dp as never);
  return { row: captured[captured.length - 1][0], dp };
};

/** Export whole systems (no contacts) and return every captured row. */
const runSystems = async (systems: Record<string, unknown>[]) => {
  await NaylorExportWaterSystem(systems as never, "probe", providerWith([]) as never);
  return captured[captured.length - 1];
};

const FULL_SYSTEM = {
  name: "Adair Co RWD #2",
  county: "Adair",
  office_hours: "8:00 - 4:30 Mon-Fri",
  meters: 412,
  url: "adairrwd2.org",
  board_meeting: "2nd Tuesday 6pm",
  orwaag: true,
  address_physical_line1: "100 Main St",
  address_physical_city: "Stilwell",
  address_physical_state: "Oklahoma",
  address_physical_zip: "74960",
  address_mailing_pobox: "PO Box 9",
  address_mailing_city: "Stilwell",
  address_mailing_state: "Oklahoma",
  address_mailing_zip: "74960",
  system_type_dirty: "Purchased",
  email: "office@adairrwd2.org",
  phone: "(918) 555-0100",
  fax: "(918) 555-0101",
};

describe("NaylorExportWaterSystem — system columns", () => {
  it("fills every directory column from the record, whatever the grid shows", async () => {
    // Regression (2026-09-17): the exporter walked the user's VISIBLE grid
    // columns, so hiding Office Hours / Meters / Website / … in the grid blanked
    // them in the directory file. It now takes no column information at all.
    expect(NaylorExportWaterSystem.length).toBe(3);

    const [row] = await runSystems([system([], FULL_SYSTEM)]);
    expect(row).toMatchObject({
      "System Name": "Adair Co RWD #2",
      County: "Adair",
      "Office Hours": "8:00 - 4:30 Mon-Fri",
      "# Meters": "412",
      Website: "adairrwd2.org",
      "Board Meeting": "2nd Tuesday 6pm",
      ORWAAG: "+",
      "Physical Address": "100 Main St",
      "Physical City": "Stilwell",
      "Physical State": "Oklahoma",
      "Physical Zip": "74960",
      "Mailing Address": "PO Box 9",
      "Mailing City": "Stilwell",
      "Mailing State": "Oklahoma",
      "Mailing Zip": "74960",
      "System Type": "Purchased",
      Email: "office@adairrwd2.org",
      Phone: "(918) 555-0100",
      Fax: "(918) 555-0101",
    });
  });

  it("emits the contractual header, in order, even for an empty record", async () => {
    const [row] = await runSystems([system([], { email: null })]);
    expect(Object.keys(row)).toEqual(naylorColumnLabels());
    expect(Object.keys(row).slice(0, NAYLOR_SYSTEM_FIELDS.length)).toEqual([
      "System Name", "County", "Office Hours", "# Meters", "Website",
      "Board Meeting", "ORWAAG", "Physical Address", "Physical City",
      "Physical State", "Physical Zip", "Mailing Address", "Mailing City",
      "Mailing State", "Mailing Zip", "System Type", "Email", "Phone", "Fax",
    ]);
    expect(row["Office Hours"]).toBe("");
    expect(row.Email).toBe("");
  });

  it("stars current members and leaves lapsed ones plain", async () => {
    const recent = new Date().toISOString().slice(0, 10);
    const rows = await runSystems([
      system([], { name: "Paid RWD", payment_last_date: recent }),
      system([], { name: "Lapsed RWD", payment_last_date: "2019-01-01" }),
    ]);
    const names = rows.map((r) => r["System Name"]);
    expect(names).toContain("*Paid RWD");
    expect(names).toContain("Lapsed RWD");
  });

  it("sorts by county, then district number, then name", async () => {
    const rows = await runSystems([
      system([], { name: "Zeta RWD #10", county: "Adair" }),
      system([], { name: "Alpha PWA", county: "Adair" }),
      system([], { name: "Zeta RWD #2", county: "Adair" }),
      system([], { name: "Anything", county: "Atoka" }),
    ]);
    expect(rows.map((r) => r["System Name"])).toEqual([
      "Zeta RWD #2", "Zeta RWD #10", "Alpha PWA", "Anything",
    ]);
  });

  it("keeps a multi-line cell on one row", () => {
    expect(naylorCell("Mon-Thu 8-5\r\n  Fri 8-12\n")).toBe("Mon-Thu 8-5; Fri 8-12");
    expect(naylorCell(false)).toBe(" ");
    expect(naylorCell(0)).toBe("0");
    expect(naylorCell(null)).toBe("");
  });
});

beforeEach(() => {
  captured.length = 0;
});

describe("NaylorExportWaterSystem — directory contacts", () => {
  it("publishes the contact block for contacts who have not opted out", async () => {
    const { row } = await run([
      { id: 1, first: "Ada", last: "Byron", title: "Manager", email: "ada@x.org", phone: "555-1000" },
    ]);
    expect(row["Contact 1: First Name"]).toBe("Ada");
    expect(row["Contact 1: Last Name"]).toBe("Byron");
    expect(row["Contact 1: Title"]).toBe("Manager");
    // Unfilled slots still emit their columns, so the file shape is stable.
    expect(row["Contact 2: First Name"]).toBe("");
    expect(row["Contact 3: Title"]).toBe("");
  });

  it("prints only name and title per contact — no email or phone columns", async () => {
    const { row } = await run([
      { id: 1, first: "Ada", last: "Byron", title: "Manager", email: "ada@x.org", phone: "555-1000" },
    ]);
    const contactKeys = Object.keys(row).filter((k) => k.startsWith("Contact "));
    expect(contactKeys).toEqual([
      "Contact 1: Title", "Contact 1: First Name", "Contact 1: Last Name",
      "Contact 2: Title", "Contact 2: First Name", "Contact 2: Last Name",
      "Contact 3: Title", "Contact 3: First Name", "Contact 3: Last Name",
    ]);
    expect(row).not.toHaveProperty("Contact 1: Email");
    expect(row).not.toHaveProperty("Contact 1: Phone");
    // The contact's email and phone never leak into any other cell either.
    expect(Object.values(row)).not.toContain("ada@x.org");
    expect(Object.values(row)).not.toContain("555-1000");
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
      NaylorExportWaterSystem([system([{ id: 1, first: "Ada" }])] as never, "probe", dp)
    ).rejects.toThrow("network");
  });
});
