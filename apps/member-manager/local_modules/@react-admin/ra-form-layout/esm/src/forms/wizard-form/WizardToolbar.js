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
import { Toolbar as MUIToolbar, Grid } from '@mui/material';
import { SaveButton } from 'react-admin';
import { useFormState, useFormContext } from 'react-hook-form';
import { NextButton } from './NextButton';
import { useWizardFormContext } from './useWizardFormContext';
import { PreviousButton } from './PreviousButton';
/**
 * The Toolbar displayed at the bottom of WizardForm.
 *
 * @prop {boolean} hasPreviousStep Optional. Does the wizard have a previous step?
 * @prop {boolean} hasNextStep Optional. Does the wizard have a next step?
 * @prop {Function} onPreviousClick Optional. Previous button click action
 * @prop {Function} onNextClick Optional. Next button click action
 * @prop {...BaseToolbarSubmitProps}
 */
export var WizardToolbar = function (props) {
    var children = props.children, rest = __rest(props, ["children"]);
    var trigger = useFormContext().trigger;
    // For some reason, the SaveButton stay disabled unless we subscribe to the isDirty field here
    // Note: this hack is no longer needed with RHF v7.39.1, but let's keep it for older versions
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var isDirty = useFormState().isDirty;
    var _a = useWizardFormContext(props), hasNextStep = _a.hasNextStep, currentStep = _a.currentStep;
    // Trigger form validation initially, and on step change, to force the FormGroup-level
    // isValid flag to be in sync
    React.useEffect(function () {
        trigger();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);
    return (React.createElement(MUIToolbar, __assign({}, sanitizeRestProps(rest)), children ? (children) : (React.createElement(Grid, { container: true, direction: "row", justifyContent: "space-between", alignItems: "center" },
        React.createElement(Grid, { item: true },
            React.createElement(PreviousButton, null)),
        React.createElement(Grid, { item: true }, hasNextStep ? React.createElement(NextButton, null) : React.createElement(SaveButton, null))))));
};
var sanitizeRestProps = function (_a) {
    var currentStep = _a.currentStep, goToNextStep = _a.goToNextStep, goToPreviousStep = _a.goToPreviousStep, goToStep = _a.goToStep, steps = _a.steps, rest = __rest(_a, ["currentStep", "goToNextStep", "goToPreviousStep", "goToStep", "steps"]);
    return rest;
};
