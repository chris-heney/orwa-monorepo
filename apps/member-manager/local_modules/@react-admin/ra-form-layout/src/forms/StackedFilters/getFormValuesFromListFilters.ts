import { FiltersConfig } from './types';

/**
 * Converts a list of filters to a list of filter form values.
 * The list of filters is an object with the following shape: { foo_eq: 'bar' }.
 * The form values are an array of objects with the following shape: { source: 'foo', operator: 'eq', value: 'bar' }.
 * @param filterValues The filters from the ListContext
 * @param config The StackedFilters config
 */
export const getFormValuesFromListFilters = (
    filterValues: Record<string, any>,
    config: FiltersConfig
) => {
    const filters = [];

    Object.keys(filterValues).forEach(key => {
        const parts = key.split('_');
        let sourcePartIndex = 0;
        let source = parts[0];

        while (config[source] == null && sourcePartIndex <= parts.length) {
            source += `_${parts[++sourcePartIndex]}`;
        }

        if (config[source] == null) {
            return;
        }

        const operator = key.replace(`${source}_`, '');

        if (config[source].operators.find(o => o.value === operator) == null) {
            return;
        }

        const value = filterValues[key];

        filters.push({
            source,
            operator,
            value,
        });
    });

    if (filters.length === 0) {
        return [{}];
    }

    return filters;
};
