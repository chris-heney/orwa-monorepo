"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceFilter = exports.choicesArrayFilter = exports.choicesFilter = exports.booleanFilter = exports.dateFilter = exports.numberFilter = exports.textFilter = void 0;
/* eslint-disable react/display-name */
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
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
var textFilter = function (_a) {
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
        input: function (props) { return (React.createElement(react_admin_1.TextInput, __assign({ sx: { flex: 1 }, helperText: false }, props))); },
    };
};
exports.textFilter = textFilter;
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
var numberFilter = function (_a) {
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
        input: function (props) { return (React.createElement(react_admin_1.NumberInput, __assign({ sx: { flex: 1 }, helperText: false }, props))); },
    };
};
exports.numberFilter = numberFilter;
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
var dateFilter = function (_a) {
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
        input: function (props) { return (React.createElement(react_admin_1.DateInput, __assign({ sx: { flex: 1 }, helperText: false }, props))); },
    };
};
exports.dateFilter = dateFilter;
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
var booleanFilter = function () {
    return {
        operators: [
            { value: 'eq', label: 'ra-form-layout.filters.operators.eq' },
        ],
        // Here we don't want to apply the default label
        input: function (_a) {
            var label = _a.label, props = __rest(_a, ["label"]);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            var translate = (0, react_admin_1.useTranslate)();
            return (React.createElement(react_admin_1.BooleanInput, __assign({ sx: { flex: 1 }, label: translate('ra-form-layout.filters.operators.boolean', {
                    _: 'Is true',
                }), helperText: false }, props)));
        },
    };
};
exports.booleanFilter = booleanFilter;
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
var choicesFilter = function (_a) {
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
            input: function (props) { return (React.createElement(react_admin_1.SelectArrayInput, __assign({ choices: choices, optionText: optionText, optionValue: optionValue, helperText: false }, props))); },
        });
    }
    if (includedOperators.includes('neq_any')) {
        operators.push({
            value: 'neq_any',
            label: 'ra-form-layout.filters.operators.neq_any',
            input: function (props) { return (React.createElement(react_admin_1.SelectArrayInput, __assign({ choices: choices, optionText: optionText, optionValue: optionValue, helperText: false }, props))); },
        });
    }
    return {
        operators: operators,
        input: function (props) { return (React.createElement(react_admin_1.SelectInput, __assign({ choices: choices, optionText: optionText, optionValue: optionValue, helperText: false }, props))); },
    };
};
exports.choicesFilter = choicesFilter;
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
var choicesArrayFilter = function (_a) {
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
        input: function (props) { return (React.createElement(react_admin_1.SelectArrayInput, __assign({ choices: choices, optionText: optionText, optionValue: optionValue, helperText: false }, props))); },
    };
};
exports.choicesArrayFilter = choicesArrayFilter;
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
var referenceFilter = function (_a) {
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
                return (React.createElement(react_admin_1.ReferenceArrayInput, { source: source, reference: reference },
                    React.createElement(react_admin_1.AutocompleteArrayInput, __assign({ optionText: optionText, sx: { flexBasis: '100%' }, helperText: false }, props))));
            },
        });
    }
    if (includedOperators.includes('neq_any')) {
        operators.push({
            value: 'neq_any',
            label: 'ra-form-layout.filters.operators.neq_any',
            input: function (_a) {
                var source = _a.source, props = __rest(_a, ["source"]);
                return (React.createElement(react_admin_1.ReferenceArrayInput, { source: source, reference: reference },
                    React.createElement(react_admin_1.AutocompleteArrayInput, __assign({ optionText: optionText, sx: { flexBasis: '100%' }, helperText: false }, props))));
            },
        });
    }
    return {
        operators: operators,
        input: function (_a) {
            var source = _a.source, props = __rest(_a, ["source"]);
            return (React.createElement(react_admin_1.ReferenceInput, { source: source, reference: reference },
                React.createElement(react_admin_1.AutocompleteInput, __assign({ optionText: optionText, helperText: false }, props))));
        },
    };
};
exports.referenceFilter = referenceFilter;
