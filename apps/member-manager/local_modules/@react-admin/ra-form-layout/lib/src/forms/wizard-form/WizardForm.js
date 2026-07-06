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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WizardForm = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var clsx_1 = __importDefault(require("clsx"));
var react_admin_1 = require("react-admin");
var react_hook_form_1 = require("react-hook-form");
var WizardProgress_1 = require("./WizardProgress");
var WizardToolbar_1 = require("./WizardToolbar");
var WizardFormContext_1 = require("./WizardFormContext");
var WizardFormStepProvider_1 = require("./WizardFormStepProvider");
var WizardFormStep_1 = require("./WizardFormStep");
/**
 * Form component rendering a wizard form with stepper
 *
 * Alternative to <SimpleForm>, to be used as child of <Create>.
 * Expects <WizardFormStep> elements as children.
 *
 * @param {ComponentType} toolbar An alternative toolbar element (to customize form buttons)
 * @param {ComponentType} progress An alternative progress bar element (to customize stepper)
 *
 * @example
 *
 * import React from 'react';
 * import { Create, TextInput, required } from 'react-admin';
 * import { WizardForm, WizardFormStep } from '@react-admin/ra-form-layout';
 *
 * const PostCreate = props => (
 *   <Create>
 *       <WizardForm>
 *           <WizardFormStep label="First step">
 *               <TextInput source="title" validate={required()} />
 *           </WizardFormStep>
 *           <WizardFormStep label="Second step">
 *               <TextInput source="description" />
 *           </WizardFormStep>
 *           <WizardFormStep label="Third step">
 *               <TextInput source="fullDescription" validate={required()} />
 *           </WizardFormStep>
 *       </WizardForm>
 *   </Create>
 * );
 */
var WizardForm = function (props) {
    var children = props.children, progress = props.progress, toolbar = props.toolbar, rest = __rest(props, ["children", "progress", "toolbar"]);
    var record = (0, react_admin_1.useRecordContext)(props);
    var _a = (0, react_admin_1.useAugmentedForm)(__assign({ mode: 'onChange' }, rest)), form = _a.form, formHandleSubmit = _a.formHandleSubmit;
    return (React.createElement(react_admin_1.OptionalRecordContextProvider, { value: record },
        React.createElement(react_hook_form_1.FormProvider, __assign({}, form),
            React.createElement(react_admin_1.FormGroupsProvider, null,
                React.createElement(WizardFormView, { onSubmit: formHandleSubmit, progress: progress, toolbar: toolbar }, children)))));
};
exports.WizardForm = WizardForm;
var DefaultProgress = React.createElement(WizardProgress_1.WizardProgress, null);
var DefaultToolbar = React.createElement(WizardToolbar_1.WizardToolbar, null);
var WizardFormView = function (_a) {
    var children = _a.children, className = _a.className, onSubmit = _a.onSubmit, _b = _a.toolbar, toolbar = _b === void 0 ? DefaultToolbar : _b, _c = _a.progress, progress = _c === void 0 ? DefaultProgress : _c, rest = __rest(_a, ["children", "className", "onSubmit", "toolbar", "progress"]);
    var _d = (0, react_1.useState)(0), currentStep = _d[0], setCurrentStep = _d[1];
    var goToNextStep = (0, react_1.useCallback)(function () {
        setCurrentStep(function (step) { return step + 1; });
    }, []);
    var goToPreviousStep = (0, react_1.useCallback)(function () {
        setCurrentStep(function (step) { return step - 1; });
    }, []);
    // We can't go forward using the progress stepper
    // So we don't need extra checks here
    var goToStep = (0, react_1.useCallback)(function (index) {
        setCurrentStep(index);
    }, []);
    var steps = React.Children.toArray(children).filter(react_1.isValidElement);
    var hasPreviousStep = currentStep > 0;
    var hasNextStep = currentStep < steps.length - 1;
    var context = (0, react_1.useMemo)(function () { return ({
        currentStep: currentStep,
        hasPreviousStep: hasPreviousStep,
        hasNextStep: hasNextStep,
        goToNextStep: goToNextStep,
        goToPreviousStep: goToPreviousStep,
        goToStep: goToStep,
        steps: steps,
    }); }, [
        currentStep,
        hasPreviousStep,
        hasNextStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        steps,
    ]);
    return (React.createElement(WizardFormContext_1.WizardFormContext.Provider, { value: context },
        progress,
        React.createElement("form", __assign({ className: (0, clsx_1.default)('wizard-form', className), onSubmit: onSubmit }, rest),
            React.createElement(react_admin_1.CardContentInner, null, steps.map(function (step, index) { return (React.createElement(react_admin_1.FormGroupContextProvider, { key: step.key, name: "step-".concat(index) },
                React.createElement(WizardFormStepProvider_1.WizardFormStepProvider, { key: step.key, step: index }, step))); })),
            toolbar)));
};
exports.WizardForm.Step = WizardFormStep_1.WizardFormStep;
