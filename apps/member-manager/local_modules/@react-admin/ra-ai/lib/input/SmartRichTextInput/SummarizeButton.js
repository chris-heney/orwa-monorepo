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
exports.SummarizeButton = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var Compress_1 = __importDefault(require("@mui/icons-material/Compress"));
var SmartReplaceButton_1 = require("./SmartReplaceButton");
var promptGenerator = function (text, locale) {
    if (locale === void 0) { locale = 'en'; }
    return locale === 'en'
        ? "Summarize the following article delimited by triple quotes.\nDo not include triple quotes in the corrected text.\n\"\"\"".concat(text, "\"\"\"\n")
        : "Here is an article delimited by triple quotes using the ".concat(locale, " locale. Summarize it.\nKeep the original locale. Do not include triple quotes in the rephrased text.\n\"\"\"").concat(text, "\"\"\"\n\n");
};
var SummarizeButton = function (props) {
    var translate = (0, react_admin_1.useTranslate)();
    return (React.createElement(SmartReplaceButton_1.SmartReplaceButton, __assign({ promptGenerator: promptGenerator, label: translate('ra.ai.button.summarize', { _: 'Summarize' }), Icon: Compress_1.default }, props)));
};
exports.SummarizeButton = SummarizeButton;
