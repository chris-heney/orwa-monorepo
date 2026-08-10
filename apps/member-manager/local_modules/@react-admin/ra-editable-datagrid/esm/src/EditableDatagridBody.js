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
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { TableBody } from '@mui/material';
import { RecordContextProvider, } from 'react-admin';
import EditableDatagridRow from './EditableDatagridRow';
import EditableDatagridCreateForm from './EditableDatagridCreateForm';
import { DatagridClasses } from './EditableDatagrid';
var EditableDatagridBody = function (_a) {
    var children = _a.children, className = _a.className, _b = _a.data, data = _b === void 0 ? [] : _b, expand = _a.expand, _c = _a.hasBulkActions, hasBulkActions = _c === void 0 ? false : _c, hover = _a.hover, onToggleItem = _a.onToggleItem, resource = _a.resource, rowClick = _a.rowClick, rowStyle = _a.rowStyle, rowSx = _a.rowSx, selectedIds = _a.selectedIds, isRowSelectable = _a.isRowSelectable, editForm = _a.editForm, createForm = _a.createForm, _d = _a.hasStandaloneCreateForm, hasStandaloneCreateForm = _d === void 0 ? false : _d, isStandaloneCreateFormVisible = _a.isStandaloneCreateFormVisible, closeStandaloneCreateForm = _a.closeStandaloneCreateForm, mutationMode = _a.mutationMode, rest = __rest(_a, ["children", "className", "data", "expand", "hasBulkActions", "hover", "onToggleItem", "resource", "rowClick", "rowStyle", "rowSx", "selectedIds", "isRowSelectable", "editForm", "createForm", "hasStandaloneCreateForm", "isStandaloneCreateFormVisible", "closeStandaloneCreateForm", "mutationMode"]);
    return (React.createElement(TableBody, __assign({ className: clsx('datagrid-body', className, DatagridClasses.tbody) }, rest),
        createForm && (React.createElement(EditableDatagridCreateForm, { closeStandaloneCreateForm: closeStandaloneCreateForm, createForm: createForm, expand: expand, hasBulkActions: hasBulkActions, hasStandaloneCreateForm: hasStandaloneCreateForm, isStandaloneCreateFormVisible: isStandaloneCreateFormVisible, resource: resource })),
        data.map(function (record, rowIndex) {
            var _a;
            return (React.createElement(RecordContextProvider, { value: record, key: record.id },
                React.createElement(EditableDatagridRow, { className: clsx(DatagridClasses.row, (_a = {},
                        _a[DatagridClasses.rowEven] = rowIndex % 2 === 0,
                        _a[DatagridClasses.rowOdd] = rowIndex % 2 !== 0,
                        _a[DatagridClasses.clickableRow] = rowClick,
                        _a)), expand: expand, form: editForm, hasBulkActions: hasBulkActions, hover: hover, onToggleItem: onToggleItem, resource: resource, rowClick: rowClick, selectable: !isRowSelectable || isRowSelectable(record), selected: selectedIds.includes(record.id), sx: rowSx === null || rowSx === void 0 ? void 0 : rowSx(record, rowIndex), style: rowStyle ? rowStyle(record, rowIndex) : null, key: record.id, mutationMode: mutationMode }, children)));
        })));
};
EditableDatagridBody.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    data: PropTypes.arrayOf(PropTypes.any),
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool,
    hover: PropTypes.bool,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
    rowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowStyle: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    isRowSelectable: PropTypes.func,
    version: PropTypes.number,
};
// trick material-ui Table into thinking this is one of the child type it supports
// @ts-ignore
EditableDatagridBody.muiName = 'TableBody';
export default EditableDatagridBody;
