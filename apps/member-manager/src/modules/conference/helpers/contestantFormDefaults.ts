export const contestantCreateDefaults = (
  filterValues: Record<string, unknown>
): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};
  if (filterValues.conference != null) defaults.conference = filterValues.conference;
  if (filterValues.year != null) defaults.year = filterValues.year;
  return defaults;
};

/**
 * The conference is locked after create (cancel + re-add to move someone),
 * so it never rides along on the PUT. The ticket does: Strapi's update path
 * re-checks conference membership and settles golf capacity for a swap.
 */
export const contestantUpdatePayload = <T extends Record<string, unknown>>(
  formData: T
): Omit<T, "conference"> => {
  const { conference, ...editable } = formData;
  void conference;
  return editable;
};
