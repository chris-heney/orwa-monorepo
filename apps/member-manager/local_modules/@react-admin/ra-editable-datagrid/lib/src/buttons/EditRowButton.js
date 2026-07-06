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
exports.EditRowButton = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var Create_1 = __importDefault(require("@mui/icons-material/Create"));
var react_admin_1 = require("react-admin");
var useRowContext_1 = require("../useRowContext");
var EditRowButton = function (props) {
    var open = (0, useRowContext_1.useRowContext)().open;
    var translate = (0, react_admin_1.useTranslate)();
    var _a = props.label, label = _a === void 0 ? 'ra.action.edit' : _a;
    var translatedLabel = translate(label, { _: 'Edit' });
    var handleClick = function (e) {
        e.stopPropagation();
        open();
    };
    return (React.createElement(material_1.Tooltip, { title: translatedLabel },
        React.createElement(material_1.IconButton, __assign({ onClick: handleClick, size: "small", color: "primary", "aria-label": translatedLabel }, props),
            React.createElement(Create_1.default, null))));
};
exports.EditRowButton = EditRowButton;
