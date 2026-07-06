"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListFiltersFromFormValues = void 0;
/**
 * Transforms the form values into a list of filters. The form values are an array of objects
 * with the following shape: { source: 'foo', operator: 'eq', value: 'bar' }.
 * The list of filters is an object with the following shape: { foo_eq: 'bar' }.
 *
 * @param filters The form values for the filters field (an ArrayInput)
 */
var getListFiltersFromFormValues = function (filters) {
    return filters != null
        ? filters.reduce(function (acc, filter) {
            var source = filter.source, operator = filter.operator, value = filter.value;
            if (source && operator && value != null) {
                acc["".concat(source).concat(operator ? "_".concat(operator) : '')] = value;
            }
            return acc;
        }, {})
        : {};
};
exports.getListFiltersFromFormValues = getListFiltersFromFormValues;
