/**
 * Generic filter utility functions that work with any filter field
 */

/**
 * Checks if a value is selected in the current filters
 * @param value The value to check (either a single value or an object with a filter field)
 * @param filters Current filter values
 * @param filterName Optional filter field name when value is a primitive
 * @returns Whether the value is selected
 */
const idsEqual = (a: unknown, b: unknown) => {
  if (a == null || b == null || a === "" || b === "") return false;
  if (a === b) return true;
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na === nb;
  return false;
};

const toValueArray = (current: unknown): unknown[] => {
  if (current == null || current === "") return [];
  return Array.isArray(current) ? current : [current];
};

const fromValueArray = (values: unknown[]): unknown => {
  if (values.length === 0) return undefined;
  // Keep multi-select as an array so Strapi gets $in; a single id stays scalar.
  return values.length === 1 ? values[0] : values;
};

export const isSelected = (value: any, filters: any, filterName?: string) => {
  // Handle direct primitive values (like conference IDs)
  if (typeof value !== "object" || value === null) {
    const filterValues = toValueArray(filters[filterName || "conference"]);
    return filterValues.some((v) => idsEqual(v, value));
  }

  // Handle object values with multiple filter fields
  const filterEntries = Object.entries(value);
  if (filterEntries.length === 0) return false;

  // Check each filter field in the value
  return filterEntries.every(([key, val]) => {
    const currentValues = toValueArray(filters[key]);
    return currentValues.some((v) => idsEqual(v, val));
  });
};

/**
 * Toggles a filter value on/off while preserving other filter values.
 * Multi-select: adding a second value promotes a scalar to an array ($in / OR).
 * @param value The value to toggle (either a single value or an object with a filter field)
 * @param filters Current filter values
 * @param filterName Optional filter field name when value is a primitive
 * @param preventDeselect If true, prevents deselection of the last value (only switches)
 * @returns Updated filter values with the value toggled
 */
export const toggleFilter = (
  value: any,
  filters: any,
  filterName?: string,
  preventDeselect: boolean = false
) => {
  // Handle direct primitive values (like conference IDs)
  if (typeof value !== "object" || value === null) {
    const field = filterName || "conference";
    const currentArr = toValueArray(filters[field]);
    const selected = currentArr.some((v) => idsEqual(v, value));

    if (preventDeselect && selected && currentArr.length <= 1) {
      return filters;
    }

    const next = selected
      ? currentArr.filter((v) => !idsEqual(v, value))
      : [...currentArr, value];

    return {
      ...filters,
      [field]: fromValueArray(next),
    };
  }

  // Handle object values with one or more filter fields
  const result = { ...filters };
  const filterEntries = Object.entries(value);

  // Check if this value is already selected
  const isValueSelected = isSelected(value, filters);

  // If preventDeselect is true and this value is selected, return unmodified filters
  if (preventDeselect && isValueSelected) {
    return filters;
  }

  // Process each field in the value object
  filterEntries.forEach(([key, val]) => {
    const currentArr = toValueArray(filters[key]);
    const selected = currentArr.some((v) => idsEqual(v, val));

    if (preventDeselect && selected && currentArr.length <= 1) {
      result[key] = filters[key];
      return;
    }

    const next = selected
      ? currentArr.filter((v) => !idsEqual(v, val))
      : [...currentArr, val];

    result[key] = fromValueArray(next);
  });

  return result;
};
