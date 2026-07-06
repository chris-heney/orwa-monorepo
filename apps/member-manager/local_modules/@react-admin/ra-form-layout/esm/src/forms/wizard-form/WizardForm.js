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
import * as React from 'react';
import { isValidElement, useCallback, useMemo, useState, } from 'react';
import clsx from 'clsx';
import { CardContentInner, FormGroupContextProvider, FormGroupsProvider, OptionalRecordContextProvider, useAugmentedForm, useRecordContext, } from 'react-admin';
import { FormProvider } from 'react-hook-form';
import { WizardProgress } from './WizardProgress';
import { WizardToolbar } from './WizardToolbar';
import { WizardFormContext } from './WizardFormContext';
import { WizardFormStepProvider } from './WizardFormStepProvider';
import { WizardFormStep } from './WizardFormStep';
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
export var WizardForm = function (props) {
    var children = props.children, progress = props.progress, toolbar = props.toolbar, rest = __rest(props, ["children", "progress", "toolbar"]);
    var record = useRecordContext(props);
    var _a = useAugmentedForm(__assign({ mode: 'onChange' }, rest)), form = _a.form, formHandleSubmit = _a.formHandleSubmit;
    return (React.createElement(OptionalRecordContextProvider, { value: record },
        React.createElement(FormProvider, __assign({}, form),
            React.createElement(FormGroupsProvider, null,
                React.createElement(WizardFormView, { onSubmit: formHandleSubmit, progress: progress, toolbar: toolbar }, children)))));
};
var DefaultProgress = React.createElement(WizardProgress, null);
var DefaultToolbar = React.createElement(WizardToolbar, null);
var WizardFormView = function (_a) {
    var children = _a.children, className = _a.className, onSubmit = _a.onSubmit, _b = _a.toolbar, toolbar = _b === void 0 ? DefaultToolbar : _b, _c = _a.progress, progress = _c === void 0 ? DefaultProgress : _c, rest = __rest(_a, ["children", "className", "onSubmit", "toolbar", "progress"]);
    var _d = useState(0), currentStep = _d[0], setCurrentStep = _d[1];
    var goToNextStep = useCallback(function () {
        setCurrentStep(function (step) { return step + 1; });
    }, []);
    var goToPreviousStep = useCallback(function () {
        setCurrentStep(function (step) { return step - 1; });
    }, []);
    // We can't go forward using the progress stepper
    // So we don't need extra checks here
    var goToStep = useCallback(function (index) {
        setCurrentStep(index);
    }, []);
    var steps = React.Children.toArray(children).filter(isValidElement);
    var hasPreviousStep = currentStep > 0;
    var hasNextStep = currentStep < steps.length - 1;
    var context = useMemo(function () { return ({
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
    return (React.createElement(WizardFormContext.Provider, { value: context },
        progress,
        React.createElement("form", __assign({ className: clsx('wizard-form', className), onSubmit: onSubmit }, rest),
            React.createElement(CardContentInner, null, steps.map(function (step, index) { return (React.createElement(FormGroupContextProvider, { key: step.key, name: "step-".concat(index) },
                React.createElement(WizardFormStepProvider, { key: step.key, step: index }, step))); })),
            toolbar)));
};
WizardForm.Step = WizardFormStep;
