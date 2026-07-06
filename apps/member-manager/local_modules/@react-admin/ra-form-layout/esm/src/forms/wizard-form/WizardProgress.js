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
import * as React from 'react';
import { Stepper, StepButton, Step } from '@mui/material';
import { useWizardFormContext } from './useWizardFormContext';
import { WizardFormStepProvider } from './WizardFormStepProvider';
import { styled } from '@mui/system';
/**
 * Progress component rendering a stepper on top of the wizard
 *
 * @prop {number} currentStep Current selected step index
 * @prop {Function} onStepClick Action called when a step is clicked
 * @prop {React.ReactElement[]} steps Array of step elements
 */
export var WizardProgress = function (props) {
    var _a = useWizardFormContext(props), currentStep = _a.currentStep, goToStep = _a.goToStep, steps = _a.steps;
    var handleStepClick = function (index) { return function () { return goToStep(index); }; };
    return (React.createElement(StyledStepper, __assign({ activeStep: currentStep }, props), steps.map(function (step, index) {
        var label = React.cloneElement(step, { intent: 'label' });
        return (React.createElement(Step, { key: "step_".concat(index) },
            React.createElement(StepButton, { onClick: handleStepClick(index) },
                React.createElement(WizardFormStepProvider, { key: step.key, step: index }, label))));
    })));
};
var WizardProgressPrefix = 'RaWizardProgress';
var StyledStepper = styled(Stepper, {
    overridesResolver: function (props, styles) { return styles.root; },
    name: WizardProgressPrefix,
})(function (_a) {
    var theme = _a.theme;
    return ({
        margin: theme.spacing(3),
    });
});
