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

export const isSelected = (value: any, filters: any, filterName?: string) => {
  // Handle direct primitive values (like conference IDs)
  if (typeof value !== 'object' || value === null) {
    const filterValues = filters[filterName || 'conference'] || [];
    return Array.isArray(filterValues) 
      ? filterValues.some((v) => idsEqual(v, value))
      : idsEqual(filterValues, value);
  }

  // Handle object values with multiple filter fields
  const filterEntries = Object.entries(value);
  if (filterEntries.length === 0) return false;

  // Check each filter field in the value
  return filterEntries.every(([key, val]) => {
    const currentValues = filters[key] || [];
    
    if (Array.isArray(currentValues)) {
      return currentValues.some((v) => idsEqual(v, val));
    }
    
    return idsEqual(currentValues, val);
  });
};

/**
 * Toggles a filter value on/off while preserving other filter values
 * @param value The value to toggle (either a single value or an object with a filter field)
 * @param filters Current filter values
 * @param filterName Optional filter field name when value is a primitive
 * @param preventDeselect If true, prevents deselection of the last value (only switches)
 * @returns Updated filter values with the value toggled
 */
export const toggleFilter = (value: any, filters: any, filterName?: string, preventDeselect: boolean = false) => {
  // Handle direct primitive values (like conference IDs)
  if (typeof value !== 'object' || value === null) {
    const field = filterName || 'conference';
    const currentValues = filters[field] || [];
    
    // Determine if we're using an array or single value
    const isArray = Array.isArray(currentValues);
    const isSelected = isArray 
      ? currentValues.includes(value)
      : currentValues === value;
    
    // If preventDeselect is true and this value is selected and it's the only one selected,
    // don't allow deselection
    if (preventDeselect && isSelected) {
      if (isArray && currentValues.length === 1) {
        return filters;
      } else if (!isArray) {
        return filters;
      }
    }
    
    // Toggle the value
    if (isArray) {
      // When preventDeselect is true and we're adding a new value,
      // replace instead of adding to array if it's a single-selection field
      if (preventDeselect && !isSelected && !isArray) {
        return {
          ...filters,
          [field]: value
        };
      }
      
      return {
        ...filters,
        [field]: isSelected
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      };
    } else {
      return {
        ...filters,
        [field]: isSelected ? undefined : value
      };
    }
  }
  
  // Handle object values with multiple filter fields
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
    const currentValues = filters[key] || [];
    
    if (Array.isArray(currentValues)) {
      // For array values, toggle presence in the array
      // If preventDeselect is true and we're deselecting the last item, don't allow it
      if (preventDeselect && currentValues.includes(val) && currentValues.length === 1) {
        result[key] = currentValues;
      } else {
        result[key] = currentValues.includes(val)
          ? currentValues.filter(v => v !== val)
          : [...currentValues, val];
      }
      
      // If array is empty, remove the field
      if (result[key].length === 0) {
        result[key] = undefined;
      }
    } else {
      // For single values, toggle between value and undefined (unless preventDeselect is true)
      if (preventDeselect && currentValues === val) {
        // Don't allow deselection when preventDeselect is true
        result[key] = val;
      } else {
        result[key] = currentValues === val ? undefined : val;
      }
    }
  });
  
  return result;
};
