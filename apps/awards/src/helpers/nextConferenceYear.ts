/** Calendar year of the next annual conference (current year + 1). */
export const nextConferenceYear = (now: Date = new Date()): number =>
  now.getFullYear() + 1;
