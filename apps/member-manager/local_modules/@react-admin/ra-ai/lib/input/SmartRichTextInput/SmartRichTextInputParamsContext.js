"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSmartRichTextInputParamsContext = exports.SmartRichTextInputParamsContext = void 0;
var react_1 = require("react");
var defaults_1 = __importDefault(require("lodash/defaults"));
exports.SmartRichTextInputParamsContext = (0, react_1.createContext)({});
var useSmartRichTextInputParamsContext = function (props) {
    var context = (0, react_1.useContext)(exports.SmartRichTextInputParamsContext);
    return (0, defaults_1.default)({}, props != null ? extractContext(props) : {}, context);
};
exports.useSmartRichTextInputParamsContext = useSmartRichTextInputParamsContext;
var extractContext = function (_a) {
    var locale = _a.locale, stop = _a.stop, maxSize = _a.maxSize, temperature = _a.temperature, meta = _a.meta, mutationOptions = _a.mutationOptions;
    return ({
        locale: locale,
        stop: stop,
        maxSize: maxSize,
        temperature: temperature,
        meta: meta,
        mutationOptions: mutationOptions,
    });
};
