import dayjs from "dayjs";

/** Local calendar date as YYYY-MM-DD. Never return a Date instance. */
export const asDateString = (value: unknown): string => {
  if (value == null || value === "") return "";
  if (value instanceof Date && Number.isNaN(value.getTime())) return "";
  const parsed = dayjs(value as string | Date);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
};

export const dateInputProps = {
  parse: (value: unknown) => {
    if (value == null || value === "") return null;
    return asDateString(value) || null;
  },
  format: (value: unknown) => asDateString(value),
};
