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
exports.WizardToolbar = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var react_admin_1 = require("react-admin");
var react_hook_form_1 = require("react-hook-form");
var NextButton_1 = require("./NextButton");
var useWizardFormContext_1 = require("./useWizardFormContext");
var PreviousButton_1 = require("./PreviousButton");
/**
 * The Toolbar displayed at the bottom of WizardForm.
 *
 * @prop {boolean} hasPreviousStep Optional. Does the wizard have a previous step?
 * @prop {boolean} hasNextStep Optional. Does the wizard have a next step?
 * @prop {Function} onPreviousClick Optional. Previous button click action
 * @prop {Function} onNextClick Optional. Next button click action
 * @prop {...BaseToolbarSubmitProps}
 */
var WizardToolbar = function (props) {
    var children = props.children, rest = __rest(props, ["children"]);
    var trigger = (0, react_hook_form_1.useFormContext)().trigger;
    // For some reason, the SaveButton stay disabled unless we subscribe to the isDirty field here
    // Note: this hack is no longer needed with RHF v7.39.1, but let's keep it for older versions
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var isDirty = (0, react_hook_form_1.useFormState)().isDirty;
    var _a = (0, useWizardFormContext_1.useWizardFormContext)(props), hasNextStep = _a.hasNextStep, currentStep = _a.currentStep;
    // Trigger form validation initially, and on step change, to force the FormGroup-level
    // isValid flag to be in sync
    React.useEffect(function () {
        trigger();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);
    return (React.createElement(material_1.Toolbar, __assign({}, sanitizeRestProps(rest)), children ? (children) : (React.createElement(material_1.Grid, { container: true, direction: "row", justifyContent: "space-between", alignItems: "center" },
        React.createElement(material_1.Grid, { item: true },
            React.createElement(PreviousButton_1.PreviousButton, null)),
        React.createElement(material_1.Grid, { item: true }, hasNextStep ? React.createElement(NextButton_1.NextButton, null) : React.createElement(react_admin_1.SaveButton, null))))));
};
exports.WizardToolbar = WizardToolbar;
var sanitizeRestProps = function (_a) {
    var currentStep = _a.currentStep, goToNextStep = _a.goToNextStep, goToPreviousStep = _a.goToPreviousStep, goToStep = _a.goToStep, steps = _a.steps, rest = __rest(_a, ["currentStep", "goToNextStep", "goToPreviousStep", "goToStep", "steps"]);
    return rest;
};
