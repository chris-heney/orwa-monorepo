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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultilineRows = exports.MultilineAutoSize = exports.Multiline = exports.HelperText = exports.FullWidth = exports.Standard = exports.Filled = exports.Default = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var TextFieldWithCompletion_1 = require("./TextFieldWithCompletion");
exports.default = {
    title: 'ra-ai/input/TextFieldWithCompletion',
};
// set the completion after a delay to simulate a network request
var WithCompletion = function (_a) {
    var children = _a.children;
    var _b = React.useState(), completion = _b[0], setCompletion = _b[1];
    React.useEffect(function () {
        setTimeout(function () {
            setCompletion(' ipsum dolor sit amet');
        }, 500);
    }, []);
    return React.createElement(material_1.Box, { m: 2 }, children(completion));
};
var Default = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion_1.TextFieldWithCompletion, { name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
exports.Default = Default;
var Filled = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion_1.TextFieldWithCompletion, { variant: "filled", name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
exports.Filled = Filled;
var Standard = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion_1.TextFieldWithCompletion, { variant: "standard", name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
exports.Standard = Standard;
var FullWidth = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion_1.TextFieldWithCompletion, { fullWidth: true, name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
exports.FullWidth = FullWidth;
var HelperText = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion_1.TextFieldWithCompletion, { name: "title", label: "Title", defaultValue: "Lorem", completion: completion, helperText: "Please fill the void" })); })); };
exports.HelperText = HelperText;
var Multiline = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion_1.TextFieldWithCompletion, { multiline: true, rows: 3, name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
exports.Multiline = Multiline;
var MultilineAutoSize = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion_1.TextFieldWithCompletion, { multiline: true, name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
exports.MultilineAutoSize = MultilineAutoSize;
var MultilineRows = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion_1.TextFieldWithCompletion, { multiline: true, rows: 3, variant: "filled", name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
exports.MultilineRows = MultilineRows;
