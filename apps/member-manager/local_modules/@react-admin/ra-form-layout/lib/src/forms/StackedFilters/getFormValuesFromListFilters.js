"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormValuesFromListFilters = void 0;
/**
 * Converts a list of filters to a list of filter form values.
 * The list of filters is an object with the following shape: { foo_eq: 'bar' }.
 * The form values are an array of objects with the following shape: { source: 'foo', operator: 'eq', value: 'bar' }.
 * @param filterValues The filters from the ListContext
 * @param config The StackedFilters config
 */
var getFormValuesFromListFilters = function (filterValues, config) {
    var filters = [];
    Object.keys(filterValues).forEach(function (key) {
        var parts = key.split('_');
        var sourcePartIndex = 0;
        var source = parts[0];
        while (config[source] == null && sourcePartIndex <= parts.length) {
            source += "_".concat(parts[++sourcePartIndex]);
        }
        if (config[source] == null) {
            return;
        }
        var operator = key.replace("".concat(source, "_"), '');
        if (config[source].operators.find(function (o) { return o.value === operator; }) == null) {
            return;
        }
        var value = filterValues[key];
        filters.push({
            source: source,
            operator: operator,
            value: value,
        });
    });
    if (filters.length === 0) {
        return [{}];
    }
    return filters;
};
exports.getFormValuesFromListFilters = getFormValuesFromListFilters;
