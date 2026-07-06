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
exports.FormDialogButton = void 0;
var react_1 = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var OpenInNew_1 = __importDefault(require("@mui/icons-material/OpenInNew"));
var FormDialogContext_1 = require("./FormDialogContext");
/**
 * Internal component which creates a dialog, along with a `<Button>` to open it.
 * This component is also responsible for managing the open/close state of the Dialog
 * (using an internal state, not the router).
 *
 * @param props.dialog A React Element containing the dialog
 * @param props.inline Optional - Set to true for an inline button, having only an icon and a tooltip
 * @param props.icon Optional - The icon associated to the button label
 * @param props.label Optional - The button label
 * @param props.ButtonProps Optional - An object containing props to pass to the MUI Button
 */
var FormDialogButton = function (props) {
    var translate = (0, react_admin_1.useTranslate)();
    var _a = (0, react_1.useState)(false), isOpen = _a[0], setIsOpen = _a[1];
    var open = (0, react_1.useCallback)(function () {
        setIsOpen(true);
    }, []);
    var close = (0, react_1.useCallback)(function () {
        setIsOpen(false);
    }, []);
    var contextValue = (0, react_1.useMemo)(function () { return ({
        isOpen: isOpen,
        open: open,
        close: close,
    }); }, [close, isOpen, open]);
    var _b = props.icon, icon = _b === void 0 ? defaultIcon : _b, _c = props.label, label = _c === void 0 ? '' : _c, inline = props.inline, dialog = props.dialog, ButtonProps = props.ButtonProps;
    var onClick = (0, react_1.useCallback)(function (e) {
        open();
        e.stopPropagation();
    }, [open]);
    var translatedLabel = translate(label, { _: label });
    var button = inline ? (react_1.default.createElement(material_1.Tooltip, { title: translatedLabel },
        react_1.default.createElement(material_1.IconButton, __assign({ "aria-label": translatedLabel, size: "small", color: "primary" }, ButtonProps, { onClick: onClick }), icon))) : (react_1.default.createElement(react_admin_1.Button, __assign({ label: translatedLabel }, ButtonProps, { onClick: onClick }), icon));
    return (react_1.default.createElement(FormDialogContext_1.FormDialogContext.Provider, { value: contextValue },
        button,
        dialog));
};
exports.FormDialogButton = FormDialogButton;
var defaultIcon = react_1.default.createElement(OpenInNew_1.default, null);
