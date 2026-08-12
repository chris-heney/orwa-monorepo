/**
 * Serialize react-admin `meta.populate` into a Strapi 5 query string.
 *
 * `populate[payouts]=*` is not "populate this relation". Strapi 5 treats `*` as
 * "every nested relation on payouts", including the inverse `application`
 * link, and 400s: `Invalid key application at payouts.application`.
 * Nested objects become `populate[payouts][populate][payout_status]=true`.
 */
export const serializePopulateQuery = (
  populationOptions: unknown,
  customFilter?: string
): string => {
  if (customFilter) return customFilter;
  if (
    populationOptions == null ||
    populationOptions === true ||
    populationOptions === "*"
  ) {
    return "populate=*";
  }
  if (Array.isArray(populationOptions) && populationOptions.length === 0) {
    return "populate=*";
  }

  const parts: string[] = [];

  const walk = (value: unknown, path: string) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const obj = value as Record<string, unknown>;
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        if (path) parts.push(`${path}=true`);
        return;
      }
      for (const key of keys) {
        walk(obj[key], path ? `${path}[${key}]` : `populate[${key}]`);
      }
      return;
    }
    if (path) parts.push(`${path}=${value}`);
  };

  walk(populationOptions, "");
  return parts.length ? parts.join("&") : "populate=*";
};
