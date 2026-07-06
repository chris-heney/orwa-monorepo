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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var react_1 = require("react");
var prop_types_1 = __importDefault(require("prop-types"));
var react_admin_1 = require("react-admin");
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@mui/material");
var RowContext_1 = require("./RowContext");
var EditableDatagridCreateForm = function (props) {
    var expand = props.expand, hasBulkActions = props.hasBulkActions, createForm = props.createForm, hasStandaloneCreateForm = props.hasStandaloneCreateForm, isStandaloneCreateFormVisible = props.isStandaloneCreateFormVisible, closeStandaloneCreateForm = props.closeStandaloneCreateForm, _a = props.mutationOptions, mutationOptions = _a === void 0 ? {} : _a, transform = props.transform;
    var notify = (0, react_admin_1.useNotify)();
    var refresh = (0, react_admin_1.useRefresh)();
    var resource = (0, react_admin_1.useResourceContext)(props);
    var match = (0, react_router_dom_1.useMatch)("/".concat(resource, "/create/*"));
    var defaultOnSuccess = (0, react_1.useCallback)(function () {
        notify('ra.notification.created', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        refresh();
        closeStandaloneCreateForm();
    }, [closeStandaloneCreateForm, notify, refresh]);
    var defaultOnError = (0, react_1.useCallback)(function (error) {
        notify(typeof error === 'string'
            ? error
            : error.message || 'ra.notification.http_error', { type: 'warning' });
    }, [notify]);
    var createContext = (0, react_1.useMemo)(function () { return ({
        open: function () {
            /* */
        },
        close: closeStandaloneCreateForm,
    }); }, [closeStandaloneCreateForm]);
    var createFormElement = (React.createElement(RowContext_1.RowContext.Provider, { value: createContext },
        React.createElement(react_admin_1.CreateBase, { mutationOptions: __assign({ onSuccess: defaultOnSuccess, onError: defaultOnError }, mutationOptions), transform: transform, resource: resource },
            React.createElement(material_1.TableRow, { key: "create-record" },
                expand && (React.createElement(material_1.TableCell, { padding: "none" },
                    React.createElement(react_admin_1.ExpandRowButton, { expanded: false, disabled: true }))),
                hasBulkActions && (React.createElement(material_1.TableCell, { padding: "checkbox" },
                    React.createElement(material_1.Checkbox, { color: "primary", disabled: true }))),
                createForm))));
    if (hasStandaloneCreateForm) {
        // create form triggered by state
        return isStandaloneCreateFormVisible && createFormElement;
    }
    else {
        // create form in a route
        return !!match ? createFormElement : null;
    }
};
EditableDatagridCreateForm.propTypes = {
    expand: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.elementType]),
    hasBulkActions: prop_types_1.default.bool.isRequired,
    resource: prop_types_1.default.string,
    createForm: prop_types_1.default.element,
    hasStandaloneCreateForm: prop_types_1.default.bool,
    isStandaloneCreateFormVisible: prop_types_1.default.bool.isRequired,
    closeStandaloneCreateForm: prop_types_1.default.func.isRequired,
};
exports.default = EditableDatagridCreateForm;
