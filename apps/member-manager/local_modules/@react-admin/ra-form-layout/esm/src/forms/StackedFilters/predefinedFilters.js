var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/* eslint-disable react/display-name */
import * as React from 'react';
import { AutocompleteArrayInput, AutocompleteInput, BooleanInput, DateInput, NumberInput, ReferenceArrayInput, ReferenceInput, SelectArrayInput, SelectInput, TextInput, useTranslate, } from 'react-admin';
/**
 * Get a filter definition for a text field to use in a <StackedFilters> component.
 * @example Basic usage
 * import { textFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    title: textFilter(),
 * };
 *
 * @example With custom operators
 * import { textFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    title: textFilter({ operators: ['eq', 'neq'] }),
 * };
 * @param options
 * @param options.operators The operators to include in the filter. Defaults to ['eq', 'neq', 'q'].
 * @returns A filter definition for a text field.
 */
export var textFilter = function (_a) {
    var _b = _a === void 0 ? { operators: ['eq', 'neq', 'q'] } : _a, _c = _b.operators, includedOperators = _c === void 0 ? ['eq', 'neq', 'q'] : _c;
    // eslint-disable-next-line array-callback-return
    var operators = includedOperators.map(function (operator) {
        switch (operator) {
            case 'eq':
                return {
                    value: 'eq',
                    label: 'ra-form-layout.filters.operators.eq',
                };
            case 'neq':
                return {
                    value: 'neq',
                    label: 'ra-form-layout.filters.operators.neq',
                };
            case 'q':
                return {
                    value: 'q',
                    label: 'ra-form-layout.filters.operators.q',
                };
        }
    });
    return {
        operators: operators,
        input: function (props) { return (React.createElement(TextInput, __assign({ sx: { flex: 1 }, helperText: false }, props))); },
    };
};
/**
 * Get a filter definition for a numeric field to use in a <StackedFilters> component.
 * @example Basic usage
 * import { numberFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    views: numberFilter(),
 * };
 *
 * @example With custom operators
 * import { numberFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    views: numberFilter({ operators: ['eq', 'neq'] }),
 * };
 * @param options
 * @param options.operators The operators to include in the filter. Defaults to ['eq', 'neq', 'gt', 'lt'].
 * @returns A filter definition for a numeric field.
 */
export var numberFilter = function (_a) {
    var _b = _a === void 0 ? { operators: ['eq', 'neq', 'gt', 'lt'] } : _a, _c = _b.operators, includedOperators = _c === void 0 ? ['eq', 'neq', 'gt', 'lt'] : _c;
    // eslint-disable-next-line array-callback-return
    var operators = includedOperators.map(function (operator) {
        switch (operator) {
            case 'eq':
                return {
                    value: 'eq',
                    label: 'ra-form-layout.filters.operators.eq',
                };
            case 'neq':
                return {
                    value: 'neq',
                    label: 'ra-form-layout.filters.operators.neq',
                };
            case 'gt':
                return {
                    value: 'gt',
                    label: 'ra-form-layout.filters.operators.gt',
                };
            case 'lt':
                return {
                    value: 'lt',
                    label: 'ra-form-layout.filters.operators.lt',
                };
        }
    });
    return {
        operators: operators,
        input: function (props) { return (React.createElement(NumberInput, __assign({ sx: { flex: 1 }, helperText: false }, props))); },
    };
};
/**
 * Get a filter definition for a date field to use in a <StackedFilters> component.
 * @example Basic usage
 * import { dateFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    published_at: dateFilter(),
 * };
 *
 * @example With custom operators
 * import { dateFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    published_at: dateFilter({ operators: ['eq', 'neq'] }),
 * };
 * @param options
 * @param options.operators The operators to include in the filter. Defaults to ['eq', 'neq', 'gt', 'lt'].
 * @returns A filter definition for a date field.
 */
export var dateFilter = function (_a) {
    var _b = _a === void 0 ? { operators: ['eq', 'neq', 'gt', 'lt'] } : _a, _c = _b.operators, includedOperators = _c === void 0 ? ['eq', 'neq', 'gt', 'lt'] : _c;
    // eslint-disable-next-line array-callback-return
    var operators = includedOperators.map(function (operator) {
        switch (operator) {
            case 'eq':
                return {
                    value: 'eq',
                    label: 'ra-form-layout.filters.operators.eq',
                };
            case 'neq':
                return {
                    value: 'neq',
                    label: 'ra-form-layout.filters.operators.neq',
                };
            case 'gt':
                return {
                    value: 'gt',
                    label: 'ra-form-layout.filters.operators.gt',
                };
            case 'lt':
                return {
                    value: 'lt',
                    label: 'ra-form-layout.filters.operators.lt',
                };
        }
    });
    return {
        operators: operators,
        input: function (props) { return (React.createElement(DateInput, __assign({ sx: { flex: 1 }, helperText: false }, props))); },
    };
};
/**
 * Get a filter definition for a boolean field to use in a <StackedFilters> component.
 * @example Basic usage
 * import { booleanFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    published: booleanFilter(),
 * };
 *
 * @returns A filter definition for a boolean field.
 */
export var booleanFilter = function () {
    return {
        operators: [
            { value: 'eq', label: 'ra-form-layout.filters.operators.eq' },
        ],
        // Here we don't want to apply the default label
        input: function (_a) {
            var label = _a.label, props = __rest(_a, ["label"]);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            var translate = useTranslate();
            return (React.createElement(BooleanInput, __assign({ sx: { flex: 1 }, label: translate('ra-form-layout.filters.operators.boolean', {
                    _: 'Is true',
                }), helperText: false }, props)));
        },
    };
};
/**
 * Get a filter definition for a choices field to use in a <StackedFilters> component.
 * @example Basic usage
 * import { selectFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    tags: selectFilter(),
 * };
 *
 * @example With custom operators
 * import { selectFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    tags: selectFilter({ operators: ['eq', 'neq'] }),
 * };
 * @param options
 * @param options.operators The operators to include in the filter. Defaults to ['eq', 'neq', 'eq_any', 'neq_any'].
 * @returns A filter definition for a choices field.
 */
export var choicesFilter = function (_a) {
    var _b = _a.operators, includedOperators = _b === void 0 ? ['eq', 'neq', 'eq_any', 'neq_any'] : _b, choices = _a.choices, optionText = _a.optionText, optionValue = _a.optionValue;
    var operators = [];
    if (includedOperators.includes('eq')) {
        operators.push({
            value: 'eq',
            label: 'ra-form-layout.filters.operators.eq',
        });
    }
    if (includedOperators.includes('neq')) {
        operators.push({
            value: 'neq',
            label: 'ra-form-layout.filters.operators.neq',
        });
    }
    if (includedOperators.includes('eq_any')) {
        operators.push({
            value: 'eq_any',
            label: 'ra-form-layout.filters.operators.eq_any',
            input: function (props) { return (React.createElement(SelectArrayInput, __assign({ choices: choices, optionText: optionText, optionValue: optionValue, helperText: false }, props))); },
        });
    }
    if (includedOperators.includes('neq_any')) {
        operators.push({
            value: 'neq_any',
            label: 'ra-form-layout.filters.operators.neq_any',
            input: function (props) { return (React.createElement(SelectArrayInput, __assign({ choices: choices, optionText: optionText, optionValue: optionValue, helperText: false }, props))); },
        });
    }
    return {
        operators: operators,
        input: function (props) { return (React.createElement(SelectInput, __assign({ choices: choices, optionText: optionText, optionValue: optionValue, helperText: false }, props))); },
    };
};
/**
 * Get a filter definition for a choices field to use in a <StackedFilters> component.
 * @example Basic usage
 * import { selectFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    tags: selectFilter(),
 * };
 *
 * @example With custom operators
 * import { selectFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    tags: selectFilter({ operators: ['eq', 'neq'] }),
 * };
 * @param options
 * @param options.operators The operators to include in the filter. Defaults to ['eq', 'neq', 'eq_any', 'neq_any'].
 * @returns A filter definition for a choices field.
 */
export var choicesArrayFilter = function (_a) {
    var _b = _a.operators, includedOperators = _b === void 0 ? ['inc', 'inc_any', 'ninc_any'] : _b, choices = _a.choices, optionText = _a.optionText, optionValue = _a.optionValue;
    var operators = [];
    if (includedOperators.includes('inc')) {
        operators.push({
            value: 'inc',
            label: 'ra-form-layout.filters.operators.inc',
        });
    }
    if (includedOperators.includes('inc_any')) {
        operators.push({
            value: 'inc_any',
            label: 'ra-form-layout.filters.operators.inc_any',
        });
    }
    if (includedOperators.includes('ninc_any')) {
        operators.push({
            value: 'ninc_any',
            label: 'ra-form-layout.filters.operators.ninc_any',
        });
    }
    return {
        operators: operators,
        input: function (props) { return (React.createElement(SelectArrayInput, __assign({ choices: choices, optionText: optionText, optionValue: optionValue, helperText: false }, props))); },
    };
};
/**
 * Get a filter definition for a choices field through references to use in a <StackedFilters> component.
 * @example Basic usage
 * import { referenceFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    tags: referenceFilter({ reference: 'tags' }),
 * };
 *
 * @example With custom operators
 * import { referenceFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    tags: referenceFilter({ reference: 'tags', operators: ['eq', 'neq'] }),
 * };
 * @param options
 * @param options.operators The operators to include in the filter. Defaults to ['eq', 'neq', 'eq_any', 'neq_any'].
 * @returns A filter definition for a choices field through references.
 */
export var referenceFilter = function (_a) {
    var _b = _a.operators, includedOperators = _b === void 0 ? ['eq', 'neq', 'eq_any', 'neq_any'] : _b, reference = _a.reference, optionText = _a.optionText;
    var operators = [];
    if (includedOperators.includes('eq')) {
        operators.push({
            value: 'eq',
            label: 'ra-form-layout.filters.operators.eq',
        });
    }
    if (includedOperators.includes('neq')) {
        operators.push({
            value: 'neq',
            label: 'ra-form-layout.filters.operators.neq',
        });
    }
    if (includedOperators.includes('eq_any')) {
        operators.push({
            value: 'eq_any',
            label: 'ra-form-layout.filters.operators.eq_any',
            input: function (_a) {
                var source = _a.source, props = __rest(_a, ["source"]);
                return (React.createElement(ReferenceArrayInput, { source: source, reference: reference },
                    React.createElement(AutocompleteArrayInput, __assign({ optionText: optionText, sx: { flexBasis: '100%' }, helperText: false }, props))));
            },
        });
    }
    if (includedOperators.includes('neq_any')) {
        operators.push({
            value: 'neq_any',
            label: 'ra-form-layout.filters.operators.neq_any',
            input: function (_a) {
                var source = _a.source, props = __rest(_a, ["source"]);
                return (React.createElement(ReferenceArrayInput, { source: source, reference: reference },
                    React.createElement(AutocompleteArrayInput, __assign({ optionText: optionText, sx: { flexBasis: '100%' }, helperText: false }, props))));
            },
        });
    }
    return {
        operators: operators,
        input: function (_a) {
            var source = _a.source, props = __rest(_a, ["source"]);
            return (React.createElement(ReferenceInput, { source: source, reference: reference },
                React.createElement(AutocompleteInput, __assign({ optionText: optionText, helperText: false }, props))));
        },
    };
};
