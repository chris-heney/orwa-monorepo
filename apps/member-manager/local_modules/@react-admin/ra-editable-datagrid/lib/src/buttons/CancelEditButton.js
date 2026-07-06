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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelEditButton = void 0;
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var Cancel_1 = __importDefault(require("@mui/icons-material/Cancel"));
var useRowContext_1 = require("../useRowContext");
var CancelEditButton = function (props) {
    var translate = (0, react_admin_1.useTranslate)();
    var close = (0, useRowContext_1.useRowContext)().close;
    return (react_1.default.createElement(material_1.Tooltip, { title: translate('ra.action.cancel', {
            _: 'ra.action.cancel',
        }) },
        react_1.default.createElement(material_1.IconButton, __assign({ onClick: close, size: "small" }, props),
            react_1.default.createElement(Cancel_1.default, null))));
};
exports.CancelEditButton = CancelEditButton;
exports.default = exports.CancelEditButton;
