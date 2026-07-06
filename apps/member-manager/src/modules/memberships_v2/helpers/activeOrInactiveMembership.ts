export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Rolling "one year ago" (YYYY-MM-DD) for list filters. Use this on every render,
 * not a module-constant—otherwise the cutoff is stuck at the day the bundle loaded.
 * Aligns "Member" / active filters with a simple last-payment-within-~12-months rule
 * so they match `isMembershipActiveByExpiration` better than the old ~14-month window.
 */
export const getRollingOneYearAgoForFilters = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return formatDate(d);
};
