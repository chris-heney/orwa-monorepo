export const contestantCreateDefaults = (
  filterValues: Record<string, unknown>
): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};
  if (filterValues.conference != null) defaults.conference = filterValues.conference;
  if (filterValues.year != null) defaults.year = filterValues.year;
  return defaults;
};

export const contestantUpdatePayload = <T extends Record<string, unknown>>(
  formData: T
): Omit<T, "conference" | "conference_ticket"> => {
  const { conference, conference_ticket, ...editable } = formData;
  void conference;
  void conference_ticket;
  return editable;
};
