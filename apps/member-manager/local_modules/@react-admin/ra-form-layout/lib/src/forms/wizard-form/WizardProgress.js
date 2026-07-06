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
exports.WizardProgress = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var useWizardFormContext_1 = require("./useWizardFormContext");
var WizardFormStepProvider_1 = require("./WizardFormStepProvider");
var system_1 = require("@mui/system");
/**
 * Progress component rendering a stepper on top of the wizard
 *
 * @prop {number} currentStep Current selected step index
 * @prop {Function} onStepClick Action called when a step is clicked
 * @prop {React.ReactElement[]} steps Array of step elements
 */
var WizardProgress = function (props) {
    var _a = (0, useWizardFormContext_1.useWizardFormContext)(props), currentStep = _a.currentStep, goToStep = _a.goToStep, steps = _a.steps;
    var handleStepClick = function (index) { return function () { return goToStep(index); }; };
    return (React.createElement(StyledStepper, __assign({ activeStep: currentStep }, props), steps.map(function (step, index) {
        var label = React.cloneElement(step, { intent: 'label' });
        return (React.createElement(material_1.Step, { key: "step_".concat(index) },
            React.createElement(material_1.StepButton, { onClick: handleStepClick(index) },
                React.createElement(WizardFormStepProvider_1.WizardFormStepProvider, { key: step.key, step: index }, label))));
    })));
};
exports.WizardProgress = WizardProgress;
var WizardProgressPrefix = 'RaWizardProgress';
var StyledStepper = (0, system_1.styled)(material_1.Stepper, {
    overridesResolver: function (props, styles) { return styles.root; },
    name: WizardProgressPrefix,
})(function (_a) {
    var theme = _a.theme;
    return ({
        margin: theme.spacing(3),
    });
});
