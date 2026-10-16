import { describe, expect, it } from "vitest";
import { mergedPacketFilename } from "../../../framework/printPacket";
import type { ScholarshipPacketRecord } from "../helpers/printScholarshipPacket";
import { scholarshipPacketFilename } from "../helpers/scholarshipPacketFilename";
import { scholarshipPrintAdapter } from "./ScholarshipPrintActions";

const record = (
  overrides: Partial<ScholarshipPacketRecord> = {}
): ScholarshipPacketRecord =>
  ({
    id: "doc",
    applicant_last_name: "Rivera",
    scholarship_year: 2027,
    submission_date: "2026-10-15",
    ...overrides,
  }) as ScholarshipPacketRecord;

describe("scholarshipPrintAdapter", () => {
  it("labels the packet year with the split academic year", () => {
    expect(scholarshipPrintAdapter.packetYearLabel(record())).toBe("2027-2028");
    // Legacy row without a stamped year: cycle rule on the submission date.
    expect(
      scholarshipPrintAdapter.packetYearLabel(
        record({ scholarship_year: null, submission_date: "2026-08-19" })
      )
    ).toBe("2027-2028");
  });

  it("gives the merged packet the SAME year label as the single packet", () => {
    const records = [record(), record({ applicant_last_name: "Chen" }), record()];
    expect(scholarshipPacketFilename(records[0])).toBe(
      "ORWEF-Scholarship-Rivera-2027-2028.pdf"
    );
    expect(
      mergedPacketFilename(
        scholarshipPrintAdapter.mergedFilenamePrefix,
        records.map((r) => scholarshipPrintAdapter.packetYearLabel(r)),
        records.length
      )
    ).toBe("ORWEF-Scholarships-Packets-2027-2028-3.pdf");
  });

  it("omits the year when the selection spans academic years", () => {
    const records = [record(), record({ scholarship_year: 2026 })];
    expect(
      mergedPacketFilename(
        scholarshipPrintAdapter.mergedFilenamePrefix,
        records.map((r) => scholarshipPrintAdapter.packetYearLabel(r)),
        records.length
      )
    ).toBe("ORWEF-Scholarships-Packets-2.pdf");
  });
});
