import { describe, expect, it } from "vitest";
import { mergedPacketFilename } from "../../../framework/printPacket";
import type { AwardNominationPrintRecord } from "../helpers/nominationPrintModel";
import { awardPrintAdapter } from "./AwardPrintButton";

const record = (
  overrides: Partial<AwardNominationPrintRecord> = {}
): AwardNominationPrintRecord =>
  ({
    id: "doc",
    award_year: 2027,
    submission_date: "2026-10-15",
    ...overrides,
  }) as AwardNominationPrintRecord;

describe("awardPrintAdapter", () => {
  it("labels the packet year with the single conference year (never split)", () => {
    expect(awardPrintAdapter.packetYearLabel(record())).toBe("2027");
  });

  it("names the merged packet after the shared conference year", () => {
    const records = [record(), record()];
    expect(
      mergedPacketFilename(
        awardPrintAdapter.mergedFilenamePrefix,
        records.map((r) => awardPrintAdapter.packetYearLabel(r)),
        records.length
      )
    ).toBe("ORWA-Award-Nominations-Packets-2027-2.pdf");
  });

  it("omits the year for a mixed-year selection", () => {
    const records = [record(), record({ award_year: 2026 })];
    expect(
      mergedPacketFilename(
        awardPrintAdapter.mergedFilenamePrefix,
        records.map((r) => awardPrintAdapter.packetYearLabel(r)),
        records.length
      )
    ).toBe("ORWA-Award-Nominations-Packets-2.pdf");
  });
});
