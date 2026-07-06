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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WizardFormStepProvider = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var useWizardFormContext_1 = require("./useWizardFormContext");
var WizardFormStepContext_1 = require("./WizardFormStepContext");
var WizardFormStepProvider = function (_a) {
    var children = _a.children, step = _a.step;
    var context = (0, useWizardFormContext_1.useWizardFormContext)();
    var stepContext = (0, react_1.useMemo)(function () { return (__assign(__assign({}, context), { active: step === context.currentStep, step: step })); }, [context, step]);
    return (React.createElement(WizardFormStepContext_1.WizardFormStepContext.Provider, { value: stepContext }, children));
};
exports.WizardFormStepProvider = WizardFormStepProvider;
