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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackedFiltersFormClasses = exports.StackedFiltersForm = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var react_hook_form_1 = require("react-hook-form");
var material_1 = require("@mui/material");
var RemoveCircleOutline_1 = __importDefault(require("@mui/icons-material/RemoveCircleOutline"));
var clsx_1 = __importDefault(require("clsx"));
var getListFiltersFromFormValues_1 = require("./getListFiltersFromFormValues");
var getFormValuesFromListFilters_1 = require("./getFormValuesFromListFilters");
var StackedFiltersActions_1 = require("./StackedFiltersActions");
/**
 * An alternative to the <Filter> component that add the concept of operator.
 * It allows users to apply an operator with a value to multiple fields.
 *
 * @example
 * import { List, NumberInput } from 'react-admin';
 * import { StackedFilters, FiltersConfig, textFilter, numberFilter, referenceFilter, booleanFilter } from '@react-admin/ra-form-layout';
 * import { MyNumberRangeInput } from './MyNumberRangeInput';
 *
 * const PostListFilters: FiltersConfig = {
 *     title: textFilter(),
 *     views: numberFilter(),
 *     tags: referenceFilter({ reference: 'tags' }),
 *     published: booleanFilter(),
 *     note: {
 *         operators: [
 *            { value: 'eq', label: 'Equals' },
 *            { value: 'neq', label: 'Not Equals' },
 *            { value: 'between', label: 'Between', input: ({ source }) => <MyNumberRangeInput source={source} /> },
 *         ],
 *         input: ({ source }) => <NumberInput source={source} />,
 *     }
 * };
 * const PostList = (props) => (
 *    <ListBase {...props}>
 *       <Accordion>
 *           <AccordionSummary
 *               expandIcon={<ExpandMoreIcon />}
 *               aria-controls="filters-panel-content"
 *               id="filters-panel-header"
 *           >
 *               <Typography>Filters</Typography>
 *           </AccordionSummary>
 *           <AccordionDetails>
 *               <StackedFiltersForm config={PostListFilters} />
 *           </AccordionDetails>
 *       </Accordion>
 *       ...
 *     </ListBase>
 * );
 * @param props
 * @param props.config {FilterConfig} The filters configuration.
 * @param props.onFiltersApplied Callback function called after the filters have been applied.
 * @returns A filter form for a <List>.
 */
var StackedFiltersForm = function (props) {
    var className = props.className, config = props.config, onFiltersApplied = props.onFiltersApplied, sx = props.sx;
    var translate = (0, react_admin_1.useTranslate)();
    var _a = (0, react_admin_1.useListContext)(), filterValues = _a.filterValues, setFilters = _a.setFilters;
    var onApplyFilters = (0, react_1.useCallback)(function (values) {
        var filters = values.filters;
        var newFilters = (0, getListFiltersFromFormValues_1.getListFiltersFromFormValues)(filters);
        setFilters(newFilters, Object.keys(newFilters).reduce(function (acc, key) {
            acc[key] = true;
            return acc;
        }, {}));
        if (onFiltersApplied && typeof onFiltersApplied === 'function') {
            onFiltersApplied();
        }
    }, [onFiltersApplied, setFilters]);
    var appliedFilters = {
        filters: (0, getFormValuesFromListFilters_1.getFormValuesFromListFilters)(filterValues, config),
    };
    var sourceChoices = Object.keys(config).map(function (source) { return ({
        id: source,
        name: source,
        label: config[source].label,
    }); });
    return (React.createElement(Root, { className: (0, clsx_1.default)(exports.StackedFiltersFormClasses.root, className), onSubmit: onApplyFilters, defaultValues: appliedFilters, sx: sx },
        React.createElement(react_admin_1.ArrayInput, { label: false, source: "filters" },
            React.createElement(react_admin_1.SimpleFormIterator, { inline: true, disableReordering: true, disableClear: true, addButton: React.createElement(StackedFiltersActions_1.StackedFiltersFormActions, { onFiltersApplied: onFiltersApplied }), removeButton: React.createElement(RemoveItemButton, null), sx: {
                    '& .RaSimpleFormIterator-inline': {
                        width: '100%',
                        alignItems: 'center',
                    },
                    '& .RaSimpleFormIterator-action': {
                        display: 'flex',
                        alignItems: 'center',
                    },
                    '& .RaSimpleFormIterator-add': {
                        marginTop: 1,
                        width: '100%',
                    },
                } },
                React.createElement(SourceInput, { className: exports.StackedFiltersFormClasses.sourceInput, source: "source", label: translate('ra-form-layout.filters.source', {
                        _: 'Source',
                    }), choices: sourceChoices }),
                React.createElement(react_admin_1.FormDataConsumer, null, function (_a) {
                    var _b;
                    var scopedFormData = _a.scopedFormData, getSource = _a.getSource;
                    var source = scopedFormData.source;
                    var operators = ((_b = config[source]) !== null && _b !== void 0 ? _b : {
                        operators: [],
                    }).operators;
                    return (React.createElement(OperatorInput, { className: exports.StackedFiltersFormClasses.operatorInput, source: getSource('operator'), operators: operators, label: translate('ra-form-layout.filters.operator', {
                            _: 'Operator',
                        }) }));
                }),
                React.createElement(react_admin_1.FormDataConsumer, null, function (_a) {
                    var _b;
                    var scopedFormData = _a.scopedFormData, getSource = _a.getSource;
                    var source = scopedFormData.source;
                    var operator = scopedFormData.operator;
                    var _c = (_b = config[source]) !== null && _b !== void 0 ? _b : {
                        operators: [],
                        // eslint-disable-next-line react/display-name
                        input: function (_a) {
                            var source = _a.source;
                            return (React.createElement(react_admin_1.TextInput, { className: exports.StackedFiltersFormClasses.valueInput, label: translate('ra-form-layout.filters.value', {
                                    _: 'Value',
                                }), source: source, disabled: true, helperText: false }));
                        },
                    }, operators = _c.operators, input = _c.input;
                    var operatorConfig = operators.find(function (o) { return o.value === operator; });
                    return operatorConfig && operatorConfig.input
                        ? operatorConfig.input({
                            className: exports.StackedFiltersFormClasses.valueInput,
                            operator: operator,
                            source: getSource('value'),
                            label: translate('ra-form-layout.filters.value', {
                                _: 'Value',
                            }),
                        })
                        : input({
                            className: exports.StackedFiltersFormClasses.valueInput,
                            operator: operator,
                            source: getSource('value'),
                            label: translate('ra-form-layout.filters.value', {
                                _: 'Value',
                            }),
                        });
                })))));
};
exports.StackedFiltersForm = StackedFiltersForm;
var SourceInput = function (_a) {
    var source = _a.source, choices = _a.choices, rest = __rest(_a, ["source", "choices"]);
    var resource = (0, react_admin_1.useResourceContext)();
    var translateLabel = (0, react_admin_1.useTranslateLabel)();
    return (React.createElement(react_admin_1.AutocompleteInput, __assign({ source: source, choices: choices, optionText: function (choice) {
            return translateLabel({
                label: choice.label,
                resource: resource,
                source: choice.name,
            });
        }, helperText: false, sx: { flex: 1 } }, rest)));
};
var OperatorInput = function (_a) {
    var _b;
    var className = _a.className, operators = _a.operators, source = _a.source, rest = __rest(_a, ["className", "operators", "source"]);
    var formContext = (0, react_hook_form_1.useFormContext)();
    // This effect is necessary because the form default values might have already been set
    // and this input is added dynamically. For some reason, react-hook-form sometimes does not
    // set the default value in this case.
    (0, react_1.useEffect)(function () {
        if (operators.length === 1) {
            formContext.setValue(source, operators[0].value);
        }
    }, [operators, formContext, source]);
    var handleChange = (0, react_1.useCallback)(function () {
        formContext.resetField('value');
    }, [formContext]);
    return operators.length === 1 ? (React.createElement(react_admin_1.TextInput, __assign({ className: className, source: source, type: "hidden", defaultValue: operators[0].value, sx: { display: 'none' }, helperText: false }, rest))) : (React.createElement(react_admin_1.SelectInput, __assign({ className: className, source: source, choices: operators, optionValue: "value", optionText: "label", sx: { flex: 1 }, onChange: handleChange, disabled: operators.length === 0, helperText: false, defaultValue: (_b = operators[0]) === null || _b === void 0 ? void 0 : _b.value }, rest)));
};
var RemoveItemButton = function (_a) {
    var onClick = _a.onClick, props = __rest(_a, ["onClick"]);
    var _b = (0, react_admin_1.useSimpleFormIterator)(), add = _b.add, total = _b.total;
    var remove = (0, react_admin_1.useSimpleFormIteratorItem)().remove;
    var handleClick = (0, react_1.useCallback)(function () {
        remove();
        // We don't want the filter list to be empty so we add a new empty filter
        // if that was the last one
        if (total === 1) {
            add();
        }
    }, [add, remove, total]);
    return (React.createElement(react_admin_1.IconButtonWithTooltip, __assign({ label: "ra.action.remove", size: "small", onClick: handleClick, color: "warning" }, props),
        React.createElement(RemoveCircleOutline_1.default, { fontSize: "small" })));
};
var PREFIX = 'RaStackedFiltersForm';
exports.StackedFiltersFormClasses = {
    root: "".concat(PREFIX, "-root"),
    sourceInput: "".concat(PREFIX, "-sourceInput"),
    operatorInput: "".concat(PREFIX, "-operatorInput"),
    valueInput: "".concat(PREFIX, "-valueInput"),
};
var Root = (0, material_1.styled)(react_admin_1.Form, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function () { return ({}); });
