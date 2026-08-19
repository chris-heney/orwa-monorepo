import { describe, expect, it } from "vitest";
import {
  awardNamePrintedLabel,
  isSystemOfTheYearAward,
  resolveAwardNamePrinted,
} from "./awardType";

describe("awardType helpers", () => {
  it("treats legacy Water/Wastewater System of the Year as System of the Year", () => {
    expect(isSystemOfTheYearAward("System of the Year")).toBe(true);
    expect(isSystemOfTheYearAward("Water/Wastewater System of the Year")).toBe(
      true
    );
    expect(isSystemOfTheYearAward("Excellence in Operations")).toBe(false);
  });

  it("labels the printed field by award type", () => {
    expect(awardNamePrintedLabel("System of the Year")).toBe("System Name");
    expect(awardNamePrintedLabel("Excellence in Management")).toBe(
      "Nominee's Full Name"
    );
  });

  it("falls back to legacy system_name print spelling", () => {
    expect(
      resolveAwardNamePrinted({
        award_name_printed: "Custom Print",
        system_name: "Picker Name",
      })
    ).toBe("Custom Print");
    expect(
      resolveAwardNamePrinted({ system_name: "Picker Name" })
    ).toBe("Picker Name");
  });
});
