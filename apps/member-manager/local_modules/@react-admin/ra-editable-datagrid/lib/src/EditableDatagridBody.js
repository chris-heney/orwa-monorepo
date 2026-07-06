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
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var clsx_1 = __importDefault(require("clsx"));
var material_1 = require("@mui/material");
var react_admin_1 = require("react-admin");
var EditableDatagridRow_1 = __importDefault(require("./EditableDatagridRow"));
var EditableDatagridCreateForm_1 = __importDefault(require("./EditableDatagridCreateForm"));
var EditableDatagrid_1 = require("./EditableDatagrid");
var EditableDatagridBody = function (props) {
    var children = props.children, className = props.className, data = props.data, expand = props.expand, hasBulkActions = props.hasBulkActions, hover = props.hover, onToggleItem = props.onToggleItem, resource = props.resource, rowClick = props.rowClick, rowStyle = props.rowStyle, rowSx = props.rowSx, selectedIds = props.selectedIds, isRowSelectable = props.isRowSelectable, editForm = props.editForm, createForm = props.createForm, _a = props.hasStandaloneCreateForm, hasStandaloneCreateForm = _a === void 0 ? false : _a, isStandaloneCreateFormVisible = props.isStandaloneCreateFormVisible, closeStandaloneCreateForm = props.closeStandaloneCreateForm, mutationMode = props.mutationMode, rest = __rest(props, ["children", "className", "data", "expand", "hasBulkActions", "hover", "onToggleItem", "resource", "rowClick", "rowStyle", "rowSx", "selectedIds", "isRowSelectable", "editForm", "createForm", "hasStandaloneCreateForm", "isStandaloneCreateFormVisible", "closeStandaloneCreateForm", "mutationMode"]);
    return (react_1.default.createElement(material_1.TableBody, __assign({ className: (0, clsx_1.default)('datagrid-body', className, EditableDatagrid_1.DatagridClasses.tbody) }, rest),
        createForm && (react_1.default.createElement(EditableDatagridCreateForm_1.default, { closeStandaloneCreateForm: closeStandaloneCreateForm, createForm: createForm, expand: expand, hasBulkActions: hasBulkActions, hasStandaloneCreateForm: hasStandaloneCreateForm, isStandaloneCreateFormVisible: isStandaloneCreateFormVisible, resource: resource })),
        data.map(function (record, rowIndex) {
            var _a;
            return (react_1.default.createElement(react_admin_1.RecordContextProvider, { value: record, key: record.id },
                react_1.default.createElement(EditableDatagridRow_1.default, { className: (0, clsx_1.default)(EditableDatagrid_1.DatagridClasses.row, (_a = {},
                        _a[EditableDatagrid_1.DatagridClasses.rowEven] = rowIndex % 2 === 0,
                        _a[EditableDatagrid_1.DatagridClasses.rowOdd] = rowIndex % 2 !== 0,
                        _a[EditableDatagrid_1.DatagridClasses.clickableRow] = rowClick,
                        _a)), expand: expand, form: editForm, hasBulkActions: hasBulkActions, hover: hover, onToggleItem: onToggleItem, resource: resource, rowClick: rowClick, selectable: !isRowSelectable || isRowSelectable(record), selected: selectedIds.includes(record.id), sx: rowSx === null || rowSx === void 0 ? void 0 : rowSx(record, rowIndex), style: rowStyle ? rowStyle(record, rowIndex) : null, key: record.id, mutationMode: mutationMode }, children)));
        })));
};
EditableDatagridBody.propTypes = {
    className: prop_types_1.default.string,
    children: prop_types_1.default.node,
    data: prop_types_1.default.arrayOf(prop_types_1.default.any).isRequired,
    expand: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.elementType]),
    hasBulkActions: prop_types_1.default.bool.isRequired,
    hover: prop_types_1.default.bool,
    onToggleItem: prop_types_1.default.func,
    resource: prop_types_1.default.string,
    rowClick: prop_types_1.default.oneOfType([prop_types_1.default.string, prop_types_1.default.func]),
    rowStyle: prop_types_1.default.func,
    selectedIds: prop_types_1.default.arrayOf(prop_types_1.default.any),
    isRowSelectable: prop_types_1.default.func,
    version: prop_types_1.default.number,
};
EditableDatagridBody.defaultProps = {
    data: [],
    hasBulkActions: false,
};
// trick material-ui Table into thinking this is one of the child type it supports
// @ts-ignore
EditableDatagridBody.muiName = 'TableBody';
exports.default = EditableDatagridBody;
