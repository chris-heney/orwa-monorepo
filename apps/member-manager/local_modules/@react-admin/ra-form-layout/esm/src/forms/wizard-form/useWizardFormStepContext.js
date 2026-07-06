import { useContext, useMemo } from 'react';
import { WizardFormStepContext, } from './WizardFormStepContext';
/**
 * A hook that returns the WizardFormStepContext.
 * This context provides access to the current wizard step, the index and active status of the step for the calling component, and handlers to navigate between steps.
 * @param {Partial<WizardFormStepContextValue>} props Optional. Props to use instead of the values from the context.
 * @returns {WizardFormStepContextValue} The WizardFormStepContext.
 */
export var useWizardFormStepContext = function (props) {
    var context = useContext(WizardFormStepContext);
    if (context == null && props == null) {
        throw new Error('useWizardFormStepContext must be used within a WizardFormStepContext.');
    }
    var result = useMemo(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return ({
            active: (_b = (_a = props === null || props === void 0 ? void 0 : props.active) !== null && _a !== void 0 ? _a : context === null || context === void 0 ? void 0 : context.active) !== null && _b !== void 0 ? _b : false,
            step: (_c = props === null || props === void 0 ? void 0 : props.step) !== null && _c !== void 0 ? _c : context === null || context === void 0 ? void 0 : context.step,
            currentStep: (_e = (_d = props === null || props === void 0 ? void 0 : props.currentStep) !== null && _d !== void 0 ? _d : context === null || context === void 0 ? void 0 : context.currentStep) !== null && _e !== void 0 ? _e : 0,
            goToNextStep: (_f = props === null || props === void 0 ? void 0 : props.goToNextStep) !== null && _f !== void 0 ? _f : context === null || context === void 0 ? void 0 : context.goToNextStep,
            goToPreviousStep: (_g = props === null || props === void 0 ? void 0 : props.goToPreviousStep) !== null && _g !== void 0 ? _g : context === null || context === void 0 ? void 0 : context.goToPreviousStep,
            goToStep: (_h = props === null || props === void 0 ? void 0 : props.goToStep) !== null && _h !== void 0 ? _h : context === null || context === void 0 ? void 0 : context.goToStep,
            hasNextStep: (_j = props === null || props === void 0 ? void 0 : props.hasNextStep) !== null && _j !== void 0 ? _j : context === null || context === void 0 ? void 0 : context.hasNextStep,
            hasPreviousStep: (_k = props === null || props === void 0 ? void 0 : props.hasPreviousStep) !== null && _k !== void 0 ? _k : context === null || context === void 0 ? void 0 : context.hasPreviousStep,
            steps: (_l = props === null || props === void 0 ? void 0 : props.steps) !== null && _l !== void 0 ? _l : context === null || context === void 0 ? void 0 : context.steps,
        });
    }, [props, context]);
    return result;
};
