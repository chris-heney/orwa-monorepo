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
import { usePreference } from 'react-admin';
import RowForm from './RowForm';
/**
 * A version of `<RowForm>` that reflects the user preferences for the columns to display. It accepts the same props as the `<RowForm>` component.
 * Use it instead of `<RowForm>` in your `<EditableDatagrid>` if you want the inputs in the form to match the columns displayed in the datagrid.
 * @param props The component's props
 * @param props.preferenceKey The key to use to retrieve the user's preferences for this datagrid.
 */
export var RowFormConfigurable = function (props) {
    var children = props.children, rest = __rest(props, ["children"]);
    var availableColumns = usePreference('availableColumns', [])[0];
    var omit = usePreference('omit', [])[0];
    var columns = usePreference('columns', availableColumns
        .filter(function (column) { return !(omit === null || omit === void 0 ? void 0 : omit.includes(column.source)); })
        .map(function (column) { return column.index; }))[0];
    var childrenArray = React.Children.toArray(children);
    return (React.createElement(RowForm, __assign({}, rest), columns === undefined
        ? children
        : columns.map(function (index) { return childrenArray[index]; })));
};
