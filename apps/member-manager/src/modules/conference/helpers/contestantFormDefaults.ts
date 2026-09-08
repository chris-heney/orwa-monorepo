export const contestantCreateDefaults = (
  filterValues: Record<string, unknown>
): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};
  if (filterValues.conference != null) defaults.conference = filterValues.conference;
  if (filterValues.year != null) defaults.year = filterValues.year;
  return defaults;
};
