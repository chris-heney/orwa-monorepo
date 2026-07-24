import { T } from "../theme/tokens";
import IGrantApplication from "../types/IGrantApplication";
import { APPROVED_STATUSES, isPfy } from "./fiscalYear";

export type StageKey = keyof typeof T.stage;

export const UNAPPROVED_STATUSES = [
  "Not Approved",
  "Withdrawn",
  "On Hold",
  "Tabled Application",
  "Denial: Over Population Limit",
  "Denial: Insufficient",
  "Inelegible",
];

export const NEEDS_REVIEW_STATUSES = ["New Application", "Awaiting Committee"];

/**
 * Where an application sits on the dollar lifecycle. Drives the map circle
 * colors and the legend, mirroring the stage ramp used by the Grant Manager
 * summary dashboard.
 */
export const stageKeyForApplication = (app: IGrantApplication): StageKey => {
  const name = app.status?.name ?? "";
  if (isPfy(app)) return "closed";
  if (name === "Paid in Full") return "paid";
  if (name === "Grant Agreement Signed/Sealed/Returned") return "signed";
  if (APPROVED_STATUSES.includes(name)) return "approved";
  if (name === "Change Order") return "cor";
  if (UNAPPROVED_STATUSES.includes(name)) return "declined";
  if (name === "Awaiting Committee") return "review";
  return "received";
};

export const stageColorForApplication = (app: IGrantApplication): string =>
  T.stage[stageKeyForApplication(app)];

/** Legend entries for the map, in lifecycle order. */
export const MAP_STAGE_LEGEND: { key: StageKey; label: string }[] = [
  { key: "received", label: "Received" },
  { key: "review", label: "Awaiting Committee" },
  { key: "approved", label: "Approved" },
  { key: "signed", label: "Agreement Signed" },
  { key: "paid", label: "Paid in Full" },
  { key: "closed", label: "Prior FY / Closed" },
  { key: "cor", label: "Change Order" },
  { key: "declined", label: "Not Approved" },
];
