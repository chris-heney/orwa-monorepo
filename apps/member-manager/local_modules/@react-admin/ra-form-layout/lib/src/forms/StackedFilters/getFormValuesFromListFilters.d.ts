import { FiltersConfig } from './types';
/**
 * Converts a list of filters to a list of filter form values.
 * The list of filters is an object with the following shape: { foo_eq: 'bar' }.
 * The form values are an array of objects with the following shape: { source: 'foo', operator: 'eq', value: 'bar' }.
 * @param filterValues The filters from the ListContext
 * @param config The StackedFilters config
 */
export declare const getFormValuesFromListFilters: (filterValues: Record<string, any>, config: FiltersConfig) => any[];
//# sourceMappingURL=getFormValuesFromListFilters.d.ts.map