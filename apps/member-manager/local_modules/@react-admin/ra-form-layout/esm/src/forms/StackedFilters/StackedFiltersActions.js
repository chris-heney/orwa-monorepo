import * as React from 'react';
import { useCallback, useMemo, useRef } from 'react';
import { useArrayInput, useListContext, useSimpleFormIterator, useTranslate, } from 'react-admin';
import { Button, Stack, styled } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/ClearAll';
import FilterIcon from '@mui/icons-material/Filter';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';
import { getListFiltersFromFormValues } from './getListFiltersFromFormValues';
export var StackedFiltersFormActions = function (props) {
    var className = props.className, onFiltersApplied = props.onFiltersApplied, sx = props.sx;
    var _a = useListContext(), filterValues = _a.filterValues, setFilters = _a.setFilters;
    var translate = useTranslate();
    var add = useSimpleFormIterator().add;
    var remove = useArrayInput().remove;
    var _b = useFormContext(), getFieldState = _b.getFieldState, getValues = _b.getValues;
    var filterFieldState = getFieldState('filters');
    var hadFilters = useRef(false);
    var disableApply = useMemo(function () {
        var filters = getListFiltersFromFormValues(getValues().filters);
        var hasFilters = Object.keys(filters).length > 0;
        var isDirty = filterFieldState.isDirty;
        // If users remove the last filter, the form is not dirty and the field might not be dirty as well
        // so we need to check whether the form had filters before and still enable the apply button in this case
        var disableApply = !isDirty && (!hasFilters || !hadFilters.current);
        hadFilters.current = hasFilters;
        return disableApply;
    }, [filterFieldState, getValues]);
    var addFilter = useCallback(function () {
        add();
    }, [add]);
    var handleClearFilters = useCallback(function () {
        // calling the replace method would probably be better
        // but it doesn't work for some reason
        // See https://react-hook-form.com/docs/usefieldarray
        remove(); // Clear the filter ArrayInput
        add(); // Add en empty filter so that the form is not empty
        setFilters({}, {}, false); // Clear the list filters
        if (onFiltersApplied && typeof onFiltersApplied === 'function') {
            onFiltersApplied();
        }
    }, [add, onFiltersApplied, remove, setFilters]);
    return (React.createElement(Root, { className: clsx(StackedFiltersActionsClasses.root, className), gap: 1, flexDirection: "row", justifyContent: "space-between", sx: sx },
        React.createElement(Button, { className: StackedFiltersActionsClasses.addFilterButton, disableElevation: true, onClick: addFilter, startIcon: React.createElement(AddIcon, null), size: "small" }, translate('ra.action.add_filter', {
            _: 'Add filter',
        })),
        React.createElement(Stack, { gap: 1, flexDirection: "row" },
            Object.keys(filterValues).length > 0 && (React.createElement(Button, { className: StackedFiltersActionsClasses.removeFiltersButton, disableElevation: true, onClick: handleClearFilters, startIcon: React.createElement(ClearIcon, null), size: "small" }, translate('ra-form-layout.filters.remove_all_filters', {
                _: 'Remove all filters',
            }))),
            React.createElement(Button, { className: StackedFiltersActionsClasses.applyButton, disableElevation: true, type: "submit", startIcon: React.createElement(FilterIcon, null), size: "small", disabled: disableApply }, translate('ra-form-layout.filters.apply_filters', {
                _: 'Apply',
            })))));
};
var PREFIX = 'RaStackedFiltersActions';
export var StackedFiltersActionsClasses = {
    root: "".concat(PREFIX, "-root"),
    addFilterButton: "".concat(PREFIX, "-addFilterButton"),
    removeFiltersButton: "".concat(PREFIX, "-removeFiltersButton"),
    applyButton: "".concat(PREFIX, "-applyButton"),
};
var Root = styled(Stack, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function () { return ({}); });
