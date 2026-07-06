"use strict";
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
exports.FormDialogTitleClasses = exports.FormDialogTitle = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_is_1 = require("react-is");
var material_1 = require("@mui/material");
var Close_1 = __importDefault(require("@mui/icons-material/Close"));
var react_admin_1 = require("react-admin");
var styles_1 = require("@mui/material/styles");
var FormDialogTitle = function (props) {
    var translate = (0, react_admin_1.useTranslate)();
    var defaultTitle = props.defaultTitle, onClose = props.onClose, record = props.record, title = props.title;
    return (React.createElement(StyledDialogTitle, { id: "edit-dialog-title" },
        (0, react_is_1.isElement)(title)
            ? (0, react_1.cloneElement)(title, { record: record })
            : title
                ? translate(title, { _: title })
                : defaultTitle,
        React.createElement(material_1.IconButton, { "aria-label": translate('ra.action.close'), className: exports.FormDialogTitleClasses.closeButton, onClick: onClose },
            React.createElement(Close_1.default, null))));
};
exports.FormDialogTitle = FormDialogTitle;
var PREFIX = 'RaFormDialogTitle';
exports.FormDialogTitleClasses = {
    closeButton: "".concat(PREFIX, "-closeButton"),
};
var StyledDialogTitle = (0, styles_1.styled)(material_1.DialogTitle, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(exports.FormDialogTitleClasses.closeButton)] = {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
        _b);
});
