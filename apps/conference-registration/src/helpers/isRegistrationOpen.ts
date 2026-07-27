import type { conferenceStatus } from "../types/types";

/**
 * True when the public registration form should be available for the
 * given conference status + registration source (online vs kiosk).
 * Admin override is intentionally excluded — callers decide that separately.
 */
export function isRegistrationOpen(
  status: conferenceStatus | string | undefined | null,
  source: string
): boolean {
  if (status === "Online Registration") return true;
  if (status === "Kiosk Registration" && source === "kiosk") return true;
  return false;
}
