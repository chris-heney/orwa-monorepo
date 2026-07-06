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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartRichTextInputToolbar = void 0;
var React = __importStar(require("react"));
var styles_1 = require("@mui/material/styles");
var ra_input_rich_text_1 = require("ra-input-rich-text");
var SmartEditToolbar_1 = require("./SmartEditToolbar");
/**
 * A toolbar for the <RichTextInput> with smart replace buttons powered by AI.
 */
var SmartRichTextInputToolbar = function (props) {
    var _a = props.size, size = _a === void 0 ? 'medium' : _a, _b = props.children, children = _b === void 0 ? (React.createElement(React.Fragment, null,
        React.createElement(ra_input_rich_text_1.LevelSelect, { size: size }),
        React.createElement(ra_input_rich_text_1.FormatButtons, { size: size }),
        React.createElement(ra_input_rich_text_1.ColorButtons, { size: size }),
        React.createElement(ra_input_rich_text_1.AlignmentButtons, { size: size }),
        React.createElement(ra_input_rich_text_1.ListButtons, { size: size }),
        React.createElement(ra_input_rich_text_1.LinkButtons, { size: size }),
        React.createElement(ra_input_rich_text_1.ImageButtons, { size: size }),
        React.createElement(ra_input_rich_text_1.QuoteButtons, { size: size }),
        React.createElement(ra_input_rich_text_1.ClearButtons, { size: size }),
        React.createElement(SmartEditToolbar_1.SmartEditToolbar, { size: size }))) : _b, rest = __rest(props, ["size", "children"]);
    return (React.createElement(Root, __assign({ className: classes.root }, rest), children));
};
exports.SmartRichTextInputToolbar = SmartRichTextInputToolbar;
var PREFIX = 'RaSmartRichTextInputToolbar';
var classes = {
    root: "".concat(PREFIX, "-root"),
};
var Root = (0, styles_1.styled)('div')(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["&.".concat(classes.root)] = {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            '& > *': {
                marginRight: theme.spacing(1),
                marginBottom: theme.spacing(1),
            },
            '& > *:last-child': {
                marginRight: 0,
            },
            '& button.MuiToggleButton-sizeSmall': {
                padding: theme.spacing(0.3),
                fontSize: theme.typography.pxToRem(18),
            },
            '& button.MuiToggleButton-sizeMedium': {
                padding: theme.spacing(0.5),
                fontSize: theme.typography.pxToRem(24),
            },
            '& button.MuiToggleButton-sizeLarge': {
                padding: theme.spacing(1),
                fontSize: theme.typography.pxToRem(24),
            },
        },
        _b);
});
