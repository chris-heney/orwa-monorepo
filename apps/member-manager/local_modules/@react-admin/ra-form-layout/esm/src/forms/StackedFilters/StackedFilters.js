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
import * as React from 'react';
import { useCallback, useState } from 'react';
import { Button as RaButton, useListContext, useTranslate, } from 'react-admin';
import { Badge, Box, Popover, styled, } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import clsx from 'clsx';
import { StackedFiltersForm, } from './StackedFiltersForm';
/**
 * An alternative to the <Filter> component that add the concept of operator and displays the filters form in a popover.
 * @example
 * import { CreateButton,List, NumberInput, TopToolbar } from 'react-admin';
 * import { StackedFilters, FiltersConfig, textFilter, numberFilter, referenceFilter, booleanFilter } from '@react-admin/ra-form-layout';
 * import { MyNumberRangeInput } from './MyNumberRangeInput';
 *
 * const postListFilters: FiltersConfig = {
 *     title: textFilter(),
 *     views: numberFilter(),
 *     tag_ids: referenceFilter({ reference: 'tags' }),
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
 * const PostListToolbar = () => (
 *     <TopToolbar>
 *         <CreateButton />
 *         <StackedFilters config={postListFilters} />
 *     </TopToolbar>
 * );
 * const PostList = () => (
 *     <List actions={<PostListToolbar />}>
 *         ...
 *     </List>
 * );
 * @param props
 * @param props.config {FilterConfig} The filters configuration.
 * @returns A filter element for a <List>.
 */
export var StackedFilters = function (props) {
    var BadgeProps = props.BadgeProps, ButtonProps = props.ButtonProps, className = props.className, config = props.config, PopoverProps = props.PopoverProps, StackedFiltersFormProps = props.StackedFiltersFormProps, sx = props.sx;
    var translate = useTranslate();
    var filterValues = useListContext().filterValues;
    var _a = useState(null), anchorEl = _a[0], setAnchorEl = _a[1];
    var handlePopoverClose = useCallback(function () {
        setAnchorEl(null);
    }, [setAnchorEl]);
    var handlePopoverOpen = useCallback(function (event) {
        setAnchorEl(event.currentTarget);
    }, [setAnchorEl]);
    return (React.createElement(Root, { className: clsx(StackedFiltersClasses.root, className), sx: sx },
        React.createElement(Badge, __assign({ badgeContent: Object.keys(filterValues).length, color: "secondary", id: "filters-badge" }, BadgeProps),
            React.createElement(RaButton, __assign({ onClick: handlePopoverOpen, size: "small", label: translate('ra-form-layout.filters.filters_button_label', {
                    _: 'Filters',
                }), "aria-describedby": "filters-badge" }, ButtonProps),
                React.createElement(FilterListIcon, null))),
        React.createElement(Popover, __assign({ open: Boolean(anchorEl), anchorEl: anchorEl, onClose: handlePopoverClose, anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
            } }, PopoverProps),
            React.createElement(Box, { className: StackedFiltersClasses.formContainer, minWidth: function (theme) { return theme.breakpoints.values.sm; }, p: 1 },
                React.createElement(StackedFiltersForm, __assign({ config: config, onFiltersApplied: handlePopoverClose }, StackedFiltersFormProps))))));
};
var PREFIX = 'RaStackedFilters';
export var StackedFiltersClasses = {
    root: "".concat(PREFIX, "-root"),
    popover: "".concat(PREFIX, "-popover"),
    formContainer: "".concat(PREFIX, "-form-container"),
};
var Root = styled('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function () { return ({}); });
