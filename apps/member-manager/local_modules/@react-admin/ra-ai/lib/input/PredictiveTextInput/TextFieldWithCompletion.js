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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextFieldWithCompletion = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var styles_1 = require("@mui/material/styles");
/**
 * A version of material-ui's `<TextField>` that also renders a completion suggestion.
 *
 * @private for internal use only
 */
exports.TextFieldWithCompletion = React.forwardRef(function (_a, ref) {
    var completion = _a.completion, multiline = _a.multiline, value = _a.value, defaultValue = _a.defaultValue, fullWidth = _a.fullWidth, rest = __rest(_a, ["completion", "multiline", "value", "defaultValue", "fullWidth"]);
    var inputRef = React.useRef(null);
    var secondInputRef = React.useRef(null);
    // copy the styles from the first input to the second one when the completion changes
    React.useEffect(function () {
        if (!inputRef.current || !secondInputRef.current)
            return;
        var input = inputRef.current;
        var boundingBox = input.getBoundingClientRect();
        var computedStyle = window.getComputedStyle(input);
        var secondInput = secondInputRef.current;
        // copy styles from the first input to the second one
        secondInput.style.cssText = getCssText(computedStyle);
        secondInput.style.letterSpacing = '0.00938em'; // FIXME: letterSpacing isn't properly copied with getComputedStyle
        // position the second input on top of the first one
        secondInput.style.position = 'absolute';
        secondInput.style.boxSizing = 'content-box';
        secondInput.style.top = "".concat(boundingBox.top + window.scrollY, "px");
        secondInput.style.left = "".concat(boundingBox.left + window.scrollX, "px");
        secondInput.style.opacity = 0.5;
        secondInput.style.pointerEvents = 'none';
    }, [completion]);
    // add a listener to copy the scrollLeft from the first input to the second one
    // so that they are aligned even when the input value overflows
    React.useEffect(function () {
        if (!inputRef.current || !secondInputRef.current)
            return;
        var input = inputRef.current;
        var eventListener = function () {
            secondInputRef.current.scrollLeft = input.scrollLeft;
            secondInputRef.current.scrollTop = input.scrollTop;
        };
        input.addEventListener('keyup', eventListener);
        input.addEventListener('scroll', eventListener);
        return function () {
            input.removeEventListener('keyup', eventListener);
            input.removeEventListener('scroll', eventListener);
        };
    }, []);
    return (React.createElement(Root, { className: fullWidth ? TextFieldWithCompletionClasses.fullWidth : '' },
        React.createElement(material_1.TextField, __assign({ ref: ref, inputRef: inputRef, multiline: multiline, value: value, defaultValue: defaultValue, fullWidth: fullWidth }, rest)),
        multiline ? (React.createElement("textarea", { "data-testid": "ra-ai.".concat(rest.name, ".completion"), className: TextFieldWithCompletionClasses.multilineCompletion, style: { display: 'none' }, tabIndex: -1, ref: secondInputRef, value: "".concat(value !== null && value !== void 0 ? value : '').concat(defaultValue !== null && defaultValue !== void 0 ? defaultValue : '').concat(completion !== null && completion !== void 0 ? completion : ''), readOnly: true })) : (React.createElement("input", { "data-testid": "ra-ai.".concat(rest.name, ".completion"), style: { display: 'none' }, type: "text", tabIndex: -1, ref: secondInputRef, value: "".concat(value !== null && value !== void 0 ? value : '').concat(defaultValue !== null && defaultValue !== void 0 ? defaultValue : '').concat(completion !== null && completion !== void 0 ? completion : ''), readOnly: true }))));
});
exports.TextFieldWithCompletion.displayName = 'TextFieldWithCompletion';
var PREFIX = 'RaTextFieldWithCompletion';
var TextFieldWithCompletionClasses = {
    fullWidth: "".concat(PREFIX, "-fullWidth"),
    multilineCompletion: "".concat(PREFIX, "-multilineCompletion"),
};
var Root = (0, styles_1.styled)('span', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})((_a = {},
    _a["&.".concat(TextFieldWithCompletionClasses.fullWidth)] = {
        width: '100%',
    },
    _a["& .".concat(TextFieldWithCompletionClasses.multilineCompletion, "::-webkit-scrollbar")] = {
        display: 'none',
    },
    _a));
/**
 * Convert the output of window.getComputedStyle() to a CSS string
 * @returns {string}
 */
var getCssText = function (cssStyleDeclaration) {
    var nbProperties = cssStyleDeclaration.length;
    var css = '';
    for (var i = 0; i < nbProperties; i++) {
        var propertyName = cssStyleDeclaration.item(i);
        var propertyValue = cssStyleDeclaration.getPropertyValue(propertyName);
        if (propertyValue !== '') {
            css += "".concat(propertyName, ":").concat(propertyValue, "; ");
        }
    }
    return css;
};
