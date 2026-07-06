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
exports.DeleteWithConfirmIconButton = void 0;
var react_1 = __importStar(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var material_1 = require("@mui/material");
var Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
var clsx_1 = __importDefault(require("clsx"));
var inflection_1 = __importDefault(require("inflection"));
var react_admin_1 = require("react-admin");
var DeleteWithConfirmIconButton = function (props) {
    var className = props.className, _a = props.confirmContent, confirmContent = _a === void 0 ? 'ra.message.delete_content' : _a, _b = props.confirmTitle, confirmTitle = _b === void 0 ? 'ra.message.delete_title' : _b, _c = props.label, label = _c === void 0 ? 'ra.action.delete' : _c, mutationMode = props.mutationMode, mutationOptions = props.mutationOptions, onClick = props.onClick, _d = props.redirect, redirectTo = _d === void 0 ? 'list' : _d, _e = props.translateOptions, translateOptions = _e === void 0 ? {} : _e;
    var record = (0, react_admin_1.useRecordContext)(props);
    var resource = (0, react_admin_1.useResourceContext)(props);
    var _f = (0, react_admin_1.useDeleteWithConfirmController)({
        mutationMode: mutationMode,
        mutationOptions: mutationOptions,
        onClick: onClick,
        resource: resource,
        record: record,
        redirect: redirectTo,
    }), open = _f.open, isLoading = _f.isLoading, handleDialogOpen = _f.handleDialogOpen, handleDialogClose = _f.handleDialogClose, handleDelete = _f.handleDelete;
    var translate = (0, react_admin_1.useTranslate)();
    var translatedLabel = translate(label, { _: label });
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(material_1.Tooltip, { title: translatedLabel },
            react_1.default.createElement(material_1.IconButton, { "aria-label": translatedLabel, onClick: handleDialogOpen, className: (0, clsx_1.default)('ra-delete-button', className), key: "button", size: "small" },
                react_1.default.createElement(Delete_1.default, { color: "error" }))),
        react_1.default.createElement(react_admin_1.Confirm, { isOpen: open, loading: isLoading, title: confirmTitle, content: confirmContent, translateOptions: __assign({ name: translate("resources.".concat(resource, ".forcedCaseName"), {
                    smart_count: 1,
                    _: inflection_1.default.humanize(translate("resources.".concat(resource, ".name"), {
                        smart_count: 1,
                        _: inflection_1.default.singularize(resource),
                    }), true),
                }), id: record === null || record === void 0 ? void 0 : record.id }, translateOptions), onConfirm: handleDelete, onClose: handleDialogClose })));
};
exports.DeleteWithConfirmIconButton = DeleteWithConfirmIconButton;
exports.DeleteWithConfirmIconButton.propTypes = {
    className: prop_types_1.default.string,
    confirmContent: prop_types_1.default.string,
    confirmTitle: prop_types_1.default.string,
    icon: prop_types_1.default.element,
    label: prop_types_1.default.string,
    mutationMode: prop_types_1.default.oneOf(['pessimistic', 'optimistic', 'undoable']),
    mutationOptions: prop_types_1.default.object,
    onClick: prop_types_1.default.func,
    record: prop_types_1.default.any,
    redirect: prop_types_1.default.oneOfType([
        prop_types_1.default.string,
        prop_types_1.default.bool,
        prop_types_1.default.func,
    ]),
    resource: prop_types_1.default.string,
    submitOnEnter: prop_types_1.default.bool,
    translateOptions: prop_types_1.default.object,
};
