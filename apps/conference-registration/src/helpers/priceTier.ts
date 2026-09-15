/**
 * Which catalog price a registration pays: `price_online` (early) or
 * `price_event` (late / at the door).
 *
 * The URL `source` says where the form is being filled in (online vs kiosk)
 * and still gates flow decisions (isRegistrationOpen, addons, vendor steps).
 * It does NOT decide price on its own: once the conference's
 * `online_registration_end` date has passed, online registrations pay the
 * event price too. The conference copy reads "$150 - Good through Sept 11 /
 * $200 - After Sept 11", so the end date is inclusive, in Oklahoma time.
 *
 * Mirrored in apps/strapi/src/api/conference-webhook/helpers/price-tier.ts
 * and apps/conference-hub/src/helpers/priceTier.ts — keep them in step.
 */
export type PriceTier = "online" | "event";

export const PRICING_TIME_ZONE = "America/Chicago";

type Priced = {
  price_online?: number | string | null;
  price_event?: number | string | null;
};

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

/** True once the calendar day after `online_registration_end` has begun. */
export const isPastOnlineRegistrationEnd = (
  onlineRegistrationEnd: string | null | undefined,
  now: Date = new Date()
): boolean => {
  const end = /^\d{4}-\d{2}-\d{2}/.exec(
    String(onlineRegistrationEnd ?? "").trim()
  )?.[0];
  if (!end) return false;
  return pricingCalendarDay(now) > end;
};

export const resolvePriceTier = (
  registrationSource: string | null | undefined,
  onlineRegistrationEnd: string | null | undefined,
  now: Date = new Date()
): PriceTier => {
  if ((registrationSource || "online") !== "online") return "event";
  return isPastOnlineRegistrationEnd(onlineRegistrationEnd, now)
    ? "event"
    : "online";
};

/** The catalog price of a ticket type / extra / addon for this tier. */
export const priceFor = (
  item: Priced | null | undefined,
  tier: PriceTier
): number =>
  Number(tier === "online" ? item?.price_online : item?.price_event) || 0;
