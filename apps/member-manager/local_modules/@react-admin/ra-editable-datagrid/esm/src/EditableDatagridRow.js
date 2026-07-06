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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import { isValidElement, cloneElement, createElement, useCallback, useEffect, useMemo, useState, } from 'react';
import { DatagridRow, ExpandRowButton, useResourceContext, useRecordContext, useDatagridContext, useExpanded, useCreatePath, } from 'react-admin';
import clsx from 'clsx';
import { Checkbox, styled, TableRow, TableCell } from '@mui/material';
import { RowContext } from './RowContext';
import { DatagridClasses } from './EditableDatagrid';
import { useNavigate } from 'react-router-dom';
import { EditableDatagridRowEditBase } from './EditableDatagridRowEditBase';
var EditableRow = function (props) {
    var _a;
    var children = props.children, expand = props.expand, form = props.form, hasBulkActions = props.hasBulkActions, idOverride = props.id, mutationMode = props.mutationMode, _b = props.mutationOptions, mutationOptions = _b === void 0 ? {} : _b, onToggleItem = props.onToggleItem, resourceOverride = props.resource, recordOverride = props.record, rowClick = props.rowClick, selectable = props.selectable, selected = props.selected, transform = props.transform, rest = __rest(props, ["children", "expand", "form", "hasBulkActions", "id", "mutationMode", "mutationOptions", "onToggleItem", "resource", "record", "rowClick", "selectable", "selected", "transform"]);
    var context = useDatagridContext();
    var resource = useResourceContext(props);
    var record = useRecordContext(props);
    var id = idOverride !== null && idOverride !== void 0 ? idOverride : record.id;
    var expandable = (!context ||
        !context.isRowExpandable ||
        context.isRowExpandable(record)) &&
        expand;
    var _c = useExpanded(resource, id, context && context.expandSingle), expanded = _c[0], toggleExpanded = _c[1];
    var _d = useState(false), isEdit = _d[0], setEdit = _d[1];
    var openEditMode = useCallback(function () {
        setEdit(true);
    }, []);
    var closeEditMode = useCallback(function () {
        setEdit(false);
    }, []);
    var navigate = useNavigate();
    var createPath = useCreatePath();
    var _e = useState(function () {
        return computeNbColumns(expandable, children, hasBulkActions);
    }), nbColumns = _e[0], setNbColumns = _e[1];
    useEffect(function () {
        // Fields can be hidden dynamically based on permissions;
        // The expand panel must span over the remaining columns
        // So we must recompute the number of columns to span on
        var newNbColumns = computeNbColumns(expandable, children, hasBulkActions);
        if (newNbColumns !== nbColumns) {
            setNbColumns(newNbColumns);
        }
    }, [expandable, nbColumns, children, hasBulkActions]);
    var handleToggleExpand = useCallback(function (event) {
        toggleExpanded();
        event.stopPropagation();
    }, [toggleExpanded]);
    var handleToggleSelection = useCallback(function (event) {
        if (!selectable)
            return;
        onToggleItem(id, event);
        event.stopPropagation();
    }, [id, onToggleItem, selectable]);
    var handleClick = useCallback(function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var type, _a, _b, tbody_1, row_1, column_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    event.persist();
                    if (!(typeof rowClick === 'function')) return [3 /*break*/, 2];
                    return [4 /*yield*/, rowClick(id, resource, record)];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = rowClick;
                    _c.label = 3;
                case 3:
                    type = _a;
                    if (type === false || type == null) {
                        return [2 /*return*/];
                    }
                    if (type === 'show') {
                        navigate(createPath({ resource: resource, id: id, type: type }));
                        return [2 /*return*/];
                    }
                    if (type === 'expand') {
                        handleToggleExpand(event);
                        return [2 /*return*/];
                    }
                    if (type === 'toggleSelection') {
                        handleToggleSelection(event);
                        return [2 /*return*/];
                    }
                    if (type === 'edit') {
                        _b = getTableClickEventPosition(event), tbody_1 = _b.tbody, row_1 = _b.row, column_1 = _b.column;
                        openEditMode();
                        // once the row is replaced by a form, focus the input inside the cell clicked
                        setTimeout(function () {
                            // No way to know the markup of the form in advance, as developers
                            // can inject a form element of their own. The only valid assumption
                            // is that the form should have the same number of columns as the row.
                            // So we select the input based on the column it's in.
                            var input = tbody_1.querySelector("tr:nth-child(".concat(row_1, ") td:nth-child(").concat(column_1, ") input"));
                            input && input.focus && input.focus();
                        }, 100); // FIXME not super robust
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [
        createPath,
        openEditMode,
        rowClick,
        handleToggleExpand,
        handleToggleSelection,
        navigate,
        id,
        resource,
        record,
    ]);
    var rowContext = useMemo(function () { return ({
        open: openEditMode,
        close: closeEditMode,
    }); }, [openEditMode, closeEditMode]);
    return (React.createElement(RowContext.Provider, { value: rowContext }, isEdit ? (React.createElement(EditableDatagridRowEditBase, { mutationOptions: mutationOptions, transform: transform, mutationMode: mutationMode },
        React.createElement(TableRow, { key: id },
            expand ? (React.createElement(TableCell, { padding: "none" }, expandable && (React.createElement(ExpandRowButton, { className: clsx(DatagridClasses.expandIcon, (_a = {},
                    _a[DatagridClasses.expanded] = expanded,
                    _a)), expanded: expanded, onClick: handleToggleExpand, expandContentId: "".concat(id, "-expand") })))) : null,
            hasBulkActions ? (React.createElement(TableCell, { padding: "checkbox" }, selectable ? (React.createElement(Checkbox, { color: "primary", checked: selected, disabled: true })) : null)) : null,
            form),
        expandable && expanded && (React.createElement(TableRow, { key: "".concat(id, "-expand"), id: "".concat(id, "-expand"), className: DatagridClasses.expandedPanel },
            React.createElement(TableCell, { colSpan: nbColumns }, isValidElement(expand)
                ? cloneElement(expand, {
                    // @ts-ignore
                    record: record,
                    resource: resource,
                    id: String(id),
                })
                : typeof expand === 'function'
                    ? createElement(expand, {
                        record: record,
                        resource: resource,
                        id: String(id),
                    })
                    : null))))) : (React.createElement(StyledDatagridRow, __assign({ id: id }, rest, { expand: expand, hasBulkActions: hasBulkActions, onClick: handleClick, onToggleItem: onToggleItem, selectable: selectable, selected: selected }), children))));
};
var computeNbColumns = function (expand, children, hasBulkActions) {
    return expand
        ? 1 + // show expand button
            (hasBulkActions ? 1 : 0) + // checkbox column
            React.Children.toArray(children).filter(function (child) { return !!child; }).length // non-null children
        : 0;
}; // we don't need to compute columns if there is no expand panel;
/**
 * Based on a MouseEvent triggered by a click on a table row,
 * get the tbody element, the row and column number of the cell clicked.
 *
 * @param {MouseEvent} event
 */
var getTableClickEventPosition = function (event) {
    var target = event.target;
    var td = target.closest('td');
    var tr = td.parentNode;
    var columns = tr.children;
    var column;
    for (var index = 0; index < columns.length; index++) {
        if (columns.item(index) === td) {
            column = index + 1;
        }
    }
    var tbody = tr.parentNode;
    var rows = tbody.children;
    var row;
    for (var index = 0; index < rows.length; index++) {
        if (rows.item(index) === tr) {
            row = index + 1;
        }
    }
    return { tbody: tbody, row: row, column: column };
};
var PREFIX = 'RaEditableDatagridRow';
export var DatagridRowClasses = {
    td: "".concat(PREFIX, "-td"),
};
var StyledDatagridRow = styled(DatagridRow)(function () { return ({
    '& td:last-of-type > *': {
        visibility: 'hidden',
    },
    '&:hover td:last-of-type > *': {
        visibility: 'visible',
    },
}); });
export default EditableRow;
