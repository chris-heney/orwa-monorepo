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
exports.InlineCreateButton = void 0;
var react_1 = __importDefault(require("react"));
var material_1 = require("@mui/material");
var Add_1 = __importDefault(require("@mui/icons-material/Add"));
var react_admin_1 = require("react-admin");
var InlineCreateButton = function (props) {
    var translate = (0, react_admin_1.useTranslate)();
    var label = translate('ra.action.create', { _: 'ra.action.create' });
    return (react_1.default.createElement(material_1.Tooltip, { title: label },
        react_1.default.createElement(material_1.IconButton, __assign({ "aria-label": label, size: "small", color: "primary" }, props),
            react_1.default.createElement(Add_1.default, null),
            props.children)));
};
exports.InlineCreateButton = InlineCreateButton;
