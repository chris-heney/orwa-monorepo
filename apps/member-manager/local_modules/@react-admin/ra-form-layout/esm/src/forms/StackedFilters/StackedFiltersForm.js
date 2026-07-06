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
import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { ArrayInput, AutocompleteInput, Form, FormDataConsumer, IconButtonWithTooltip, SelectInput, SimpleFormIterator, TextInput, useListContext, useResourceContext, useSimpleFormIterator, useSimpleFormIteratorItem, useTranslate, useTranslateLabel, } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/RemoveCircleOutline';
import clsx from 'clsx';
import { getListFiltersFromFormValues } from './getListFiltersFromFormValues';
import { getFormValuesFromListFilters } from './getFormValuesFromListFilters';
import { StackedFiltersFormActions } from './StackedFiltersActions';
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
export var StackedFiltersForm = function (props) {
    var className = props.className, config = props.config, onFiltersApplied = props.onFiltersApplied, sx = props.sx;
    var translate = useTranslate();
    var _a = useListContext(), filterValues = _a.filterValues, setFilters = _a.setFilters;
    var onApplyFilters = useCallback(function (values) {
        var filters = values.filters;
        var newFilters = getListFiltersFromFormValues(filters);
        setFilters(newFilters, Object.keys(newFilters).reduce(function (acc, key) {
            acc[key] = true;
            return acc;
        }, {}));
        if (onFiltersApplied && typeof onFiltersApplied === 'function') {
            onFiltersApplied();
        }
    }, [onFiltersApplied, setFilters]);
    var appliedFilters = {
        filters: getFormValuesFromListFilters(filterValues, config),
    };
    var sourceChoices = Object.keys(config).map(function (source) { return ({
        id: source,
        name: source,
        label: config[source].label,
    }); });
    return (React.createElement(Root, { className: clsx(StackedFiltersFormClasses.root, className), onSubmit: onApplyFilters, defaultValues: appliedFilters, sx: sx },
        React.createElement(ArrayInput, { label: false, source: "filters" },
            React.createElement(SimpleFormIterator, { inline: true, disableReordering: true, disableClear: true, addButton: React.createElement(StackedFiltersFormActions, { onFiltersApplied: onFiltersApplied }), removeButton: React.createElement(RemoveItemButton, null), sx: {
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
                React.createElement(SourceInput, { className: StackedFiltersFormClasses.sourceInput, source: "source", label: translate('ra-form-layout.filters.source', {
                        _: 'Source',
                    }), choices: sourceChoices }),
                React.createElement(FormDataConsumer, null, function (_a) {
                    var _b;
                    var scopedFormData = _a.scopedFormData, getSource = _a.getSource;
                    var source = scopedFormData.source;
                    var operators = ((_b = config[source]) !== null && _b !== void 0 ? _b : {
                        operators: [],
                    }).operators;
                    return (React.createElement(OperatorInput, { className: StackedFiltersFormClasses.operatorInput, source: getSource('operator'), operators: operators, label: translate('ra-form-layout.filters.operator', {
                            _: 'Operator',
                        }) }));
                }),
                React.createElement(FormDataConsumer, null, function (_a) {
                    var _b;
                    var scopedFormData = _a.scopedFormData, getSource = _a.getSource;
                    var source = scopedFormData.source;
                    var operator = scopedFormData.operator;
                    var _c = (_b = config[source]) !== null && _b !== void 0 ? _b : {
                        operators: [],
                        // eslint-disable-next-line react/display-name
                        input: function (_a) {
                            var source = _a.source;
                            return (React.createElement(TextInput, { className: StackedFiltersFormClasses.valueInput, label: translate('ra-form-layout.filters.value', {
                                    _: 'Value',
                                }), source: source, disabled: true, helperText: false }));
                        },
                    }, operators = _c.operators, input = _c.input;
                    var operatorConfig = operators.find(function (o) { return o.value === operator; });
                    return operatorConfig && operatorConfig.input
                        ? operatorConfig.input({
                            className: StackedFiltersFormClasses.valueInput,
                            operator: operator,
                            source: getSource('value'),
                            label: translate('ra-form-layout.filters.value', {
                                _: 'Value',
                            }),
                        })
                        : input({
                            className: StackedFiltersFormClasses.valueInput,
                            operator: operator,
                            source: getSource('value'),
                            label: translate('ra-form-layout.filters.value', {
                                _: 'Value',
                            }),
                        });
                })))));
};
var SourceInput = function (_a) {
    var source = _a.source, choices = _a.choices, rest = __rest(_a, ["source", "choices"]);
    var resource = useResourceContext();
    var translateLabel = useTranslateLabel();
    return (React.createElement(AutocompleteInput, __assign({ source: source, choices: choices, optionText: function (choice) {
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
    var formContext = useFormContext();
    // This effect is necessary because the form default values might have already been set
    // and this input is added dynamically. For some reason, react-hook-form sometimes does not
    // set the default value in this case.
    useEffect(function () {
        if (operators.length === 1) {
            formContext.setValue(source, operators[0].value);
        }
    }, [operators, formContext, source]);
    var handleChange = useCallback(function () {
        formContext.resetField('value');
    }, [formContext]);
    return operators.length === 1 ? (React.createElement(TextInput, __assign({ className: className, source: source, type: "hidden", defaultValue: operators[0].value, sx: { display: 'none' }, helperText: false }, rest))) : (React.createElement(SelectInput, __assign({ className: className, source: source, choices: operators, optionValue: "value", optionText: "label", sx: { flex: 1 }, onChange: handleChange, disabled: operators.length === 0, helperText: false, defaultValue: (_b = operators[0]) === null || _b === void 0 ? void 0 : _b.value }, rest)));
};
var RemoveItemButton = function (_a) {
    var onClick = _a.onClick, props = __rest(_a, ["onClick"]);
    var _b = useSimpleFormIterator(), add = _b.add, total = _b.total;
    var remove = useSimpleFormIteratorItem().remove;
    var handleClick = useCallback(function () {
        remove();
        // We don't want the filter list to be empty so we add a new empty filter
        // if that was the last one
        if (total === 1) {
            add();
        }
    }, [add, remove, total]);
    return (React.createElement(IconButtonWithTooltip, __assign({ label: "ra.action.remove", size: "small", onClick: handleClick, color: "warning" }, props),
        React.createElement(CloseIcon, { fontSize: "small" })));
};
var PREFIX = 'RaStackedFiltersForm';
export var StackedFiltersFormClasses = {
    root: "".concat(PREFIX, "-root"),
    sourceInput: "".concat(PREFIX, "-sourceInput"),
    operatorInput: "".concat(PREFIX, "-operatorInput"),
    valueInput: "".concat(PREFIX, "-valueInput"),
};
var Root = styled(Form, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function () { return ({}); });
