"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteWithUndoIconButton = void 0;
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var material_1 = require("@mui/material");
var Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
var clsx_1 = __importDefault(require("clsx"));
var react_admin_1 = require("react-admin");
var DeleteWithUndoIconButton = function (props) {
    var className = props.className, _a = props.label, label = _a === void 0 ? 'ra.action.delete' : _a, _b = props.redirect, redirectTo = _b === void 0 ? 'list' : _b, mutationOptions = props.mutationOptions;
    var record = (0, react_admin_1.useRecordContext)(props);
    var resource = (0, react_admin_1.useResourceContext)(props);
    var _c = (0, react_admin_1.useDeleteWithUndoController)({
        mutationOptions: mutationOptions,
        resource: resource,
        record: record,
        redirect: redirectTo,
    }), isLoading = _c.isLoading, handleDelete = _c.handleDelete;
    var translate = (0, react_admin_1.useTranslate)();
    var translatedLabel = translate(label, { _: label });
    return (react_1.default.createElement(material_1.Tooltip, { title: translatedLabel },
        react_1.default.createElement(material_1.IconButton, { "aria-label": translatedLabel, disabled: isLoading, onClick: handleDelete, className: (0, clsx_1.default)('ra-delete-button', className), key: "button", size: "small" },
            react_1.default.createElement(Delete_1.default, { color: "error" }))));
};
exports.DeleteWithUndoIconButton = DeleteWithUndoIconButton;
exports.DeleteWithUndoIconButton.propTypes = {
    className: prop_types_1.default.string,
    confirmTitle: prop_types_1.default.string,
    confirmContent: prop_types_1.default.string,
    label: prop_types_1.default.string,
    mutationOptions: prop_types_1.default.object,
    onClick: prop_types_1.default.func,
    record: prop_types_1.default.any,
    redirect: prop_types_1.default.oneOfType([
        prop_types_1.default.string,
        prop_types_1.default.bool,
        prop_types_1.default.func,
    ]),
    resource: prop_types_1.default.string,
    icon: prop_types_1.default.element,
};
