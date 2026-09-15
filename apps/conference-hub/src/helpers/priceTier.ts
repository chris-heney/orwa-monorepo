/**
 * Early (online) pricing lasts through `online_registration_end`, inclusive,
 * in Oklahoma time ("$150 - Good through Sept 11"). After that the
 * registration form charges `price_event` even for online registrations.
 *
 * Mirrors apps/conference-registration/src/helpers/priceTier.ts — keep them
 * in step.
 */
export const PRICING_TIME_ZONE = "America/Chicago";

/** Calendar day (YYYY-MM-DD) of `now` in the pricing time zone. */
export const pricingCalendarDay = (
  now: Date = new Date(),
  timeZone: string = PRICING_TIME_ZONE
): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
};

const endDay = (onlineRegistrationEnd: string | null | undefined) =>
  /^\d{4}-\d{2}-\d{2}/.exec(String(onlineRegistrationEnd ?? "").trim())?.[0];

/** True while early pricing is still in effect (through the end date). */
export const isEarlyPricingOpen = (
  onlineRegistrationEnd: string | null | undefined,
  now: Date = new Date()
): boolean => {
  const end = endDay(onlineRegistrationEnd);
  if (!end) return false;
  return pricingCalendarDay(now) <= end;
};

/**
 * The day after the end date (YYYY-MM-DD) — the moment early pricing stops,
 * so a countdown to it reaches zero at the end of the last early day rather
 * than at its start.
 */
export const earlyPricingEndsOn = (
  onlineRegistrationEnd: string | null | undefined
): string | null => {
  const end = endDay(onlineRegistrationEnd);
  if (!end) return null;
  const [y, m, d] = end.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return next.toISOString().slice(0, 10);
};
