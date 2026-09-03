/**
 * Server-side filter for public watersystem selects.
 *
 * Watersystem has no `active` column and no `memberships` collection. Member
 * Manager treats a system as "Member" / active when last payment is present
 * and within the past year (`payment_last_date $notNull` + `$gte` one year
 * ago). That is the same simple model as Memberships → Member Status, not the
 * overlap-aware `isMembershipActiveByExpiration` display helper.
 */

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** YYYY-MM-DD one year before `now`. Recomputed on each call. */
export const rollingOneYearAgo = (now = new Date()): string => {
  const cutoff = new Date(now.getTime());
  cutoff.setFullYear(cutoff.getFullYear() - 1);
  return formatDate(cutoff);
};

export const activeMembershipWatersystemsQuery = (
  fields: string[],
  now = new Date()
): string => {
  const cutoff = rollingOneYearAgo(now);
  const fieldParams = fields
    .map((field, index) => `fields[${index}]=${encodeURIComponent(field)}`)
    .join("&");
  return (
    `?filters[payment_last_date][$notNull]=true` +
    `&filters[payment_last_date][$gte]=${cutoff}` +
    `&pagination[limit]=1000` +
    `&sort=name:ASC` +
    (fieldParams ? `&${fieldParams}` : "")
  );
};
