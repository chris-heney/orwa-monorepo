import { describe, expect, it } from "vitest";
import {
  countyRegion,
  identificationRows,
  nominationApplicationFilename,
  nominationRecordId,
  nomineeNameAsPrinted,
  printedAwardName,
  printedNameLabel,
  systemDisplayName,
  systemNameAsPrinted,
} from "./nominationPrintModel";

const seago = {
  id: "v9kv0s9tlw0dd5h9z2smdodh",
  documentId: "v9kv0s9tlw0dd5h9z2smdodh",
  entityId: 13,
  nominee_name: "JIMMY E. SEAGO",
  system_name: "Achille PUA",
  award_name_printed: "Achille PUA",
  award_type: "System of the Year",
  award_year: 2027,
  county: "Bryan",
  address: "100 Main Street",
  city: "Achille",
  state: "OK",
  zip: "73401",
  daytime_phone: "(580) 555-0100",
  email: "achille@example.com",
  watersystem: {
    name: "Achille PUA",
    county: "Bryan",
    region: "Region 3",
  },
};

describe("nominationApplicationFilename", () => {
  it("uses nominee name and award year", () => {
    expect(nominationApplicationFilename(seago)).toBe(
      "ORWA-Award-Nomination-JIMMY-E-SEAGO-2027.pdf"
    );
  });

  it("falls back to system name, then Nomination", () => {
    expect(
      nominationApplicationFilename({
        system_name: "Achille PUA",
        award_year: 2027,
      })
    ).toBe("ORWA-Award-Nomination-Achille-PUA-2027.pdf");
    expect(nominationApplicationFilename({})).toMatch(
      /^ORWA-Award-Nomination-Nomination-\d{4}\.pdf$/
    );
  });
});

describe("identificationRows", () => {
  it("keeps only address/contact rows (header already has type, names, county)", () => {
    const rows = identificationRows(seago);
    expect(rows.map((row) => row.label)).toEqual([
      "Address",
      "City / State / ZIP",
      "Phone",
      "Email",
    ]);
    expect(rows[0].value).toBe("100 Main Street");
    expect(rows[1].value).toBe("Achille, OK 73401");
  });

  it("omits a nominee heading for system awards and uses it for people", () => {
    expect(systemNameAsPrinted(seago)).toBe("Achille PUA");
    expect(nomineeNameAsPrinted(seago)).toBe("");
    expect(
      nomineeNameAsPrinted({
        award_type: "Excellence in Operations",
        award_name_printed: "Jane Doe",
        nominee_name: "Jane D",
        system_name: "Some RWD",
      })
    ).toBe("Jane Doe");
  });

  it("labels the printed name as nominee for individual awards", () => {
    expect(printedNameLabel("Excellence in Operations")).toBe(
      "Nominee's Full Name"
    );
    expect(
      printedAwardName({
        award_name_printed: "",
        nominee_name: "Jane Doe",
        system_name: "Some RWD",
      })
    ).toBe("Some RWD");
  });
});

describe("countyRegion / ids", () => {
  it("joins county and region and never parses documentId", () => {
    expect(countyRegion(seago)).toBe("Bryan / Region 3");
    expect(systemDisplayName({ watersystem: { name: "Only WS" } })).toBe(
      "Only WS"
    );
    expect(nominationRecordId(seago)).toBe("v9kv0s9tlw0dd5h9z2smdodh");
    expect(Number.isNaN(Number("v9kv0s9tlw0dd5h9z2smdodh"))).toBe(true);
  });
});
