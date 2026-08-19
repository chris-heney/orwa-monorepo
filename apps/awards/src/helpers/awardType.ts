/** Public wizard + Strapi both treat the legacy label as System of the Year. */
export const isSystemOfTheYearAward = (
  awardType: string | null | undefined
): boolean =>
  awardType === "System of the Year" ||
  awardType === "Water/Wastewater System of the Year";

export const AWARD_NAME_PRINTED_HELPER =
  "As you would like it printed on the award (if awarded).";

export const awardNamePrintedLabel = (
  awardType: string | null | undefined
): string =>
  isSystemOfTheYearAward(awardType) ? "System Name" : "Nominee's Full Name";

export const resolveAwardNamePrinted = (payload: {
  award_name_printed?: string | null;
  system_name?: string | null;
}): string | undefined => {
  const printed = String(payload.award_name_printed || "").trim();
  if (printed) return printed;
  const system = String(payload.system_name || "").trim();
  return system || undefined;
};
