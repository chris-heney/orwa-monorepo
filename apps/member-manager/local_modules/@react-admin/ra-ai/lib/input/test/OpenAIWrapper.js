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
exports.OpenAIWrapper = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var OpenAIWrapper = function (_a) {
    var children = _a.children;
    var _b = React.useState(localStorage.getItem('ra-ai.openai-api-key')), key = _b[0], setKey = _b[1];
    if (key) {
        return children;
    }
    return (React.createElement(material_1.Box, { m: 2 },
        React.createElement("form", { onSubmit: function (e) {
                e.preventDefault();
                var form = e.target;
                // @ts-ignore
                var keyInput = form.elements.key;
                localStorage.setItem('ra-ai.openai-api-key', keyInput.value);
                setKey(keyInput.value);
            } },
            React.createElement("label", { htmlFor: "key" }, "OpenAI API key: "),
            React.createElement("input", { type: "text", id: "key", name: "key" }),
            React.createElement("button", { type: "submit" }, "Submit"))));
};
exports.OpenAIWrapper = OpenAIWrapper;
