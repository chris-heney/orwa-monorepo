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
exports.SmartEditToolbar = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var AutoCorrectButton_1 = require("./AutoCorrectButton");
var RephraseButton_1 = require("./RephraseButton");
var SummarizeButton_1 = require("./SummarizeButton");
var ContinueButton_1 = require("./ContinueButton");
/**
 * A toolbar for the TipTap editor that adds AI-based editing features:
 * - auto-correct,
 * - rephrase,
 * - summarize, and
 * - continue writing.
 */
var SmartEditToolbar = function (_a) {
    var size = _a.size;
    return (React.createElement(React.Fragment, null,
        React.createElement(material_1.ToggleButtonGroup, { "arial-label": "Smart Replace", size: size },
            React.createElement(AutoCorrectButton_1.AutoCorrectButton, null),
            React.createElement(RephraseButton_1.RephraseButton, null),
            React.createElement(SummarizeButton_1.SummarizeButton, null)),
        React.createElement(ContinueButton_1.ContinueButton, { size: size })));
};
exports.SmartEditToolbar = SmartEditToolbar;
