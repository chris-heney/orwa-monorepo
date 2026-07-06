"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWizardFormContext = void 0;
var react_1 = require("react");
var WizardFormContext_1 = require("./WizardFormContext");
/**
 * A hook that returns the WizardFormContext.
 * This context provides access to the current wizard step and handlers to navigate between steps.
 * @param {Partial<WizardFormContextValue>} props Optional. Props to use instead of the values from the context.
 * @returns {WizardFormContextValue} The WizardFormContext.
 */
var useWizardFormContext = function (props) {
    var context = (0, react_1.useContext)(WizardFormContext_1.WizardFormContext);
    if (context == null && props == null) {
        throw new Error('useWizardFormContext must be used within a WizardFormContext.');
    }
    var result = (0, react_1.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return ({
            currentStep: (_b = (_a = props === null || props === void 0 ? void 0 : props.currentStep) !== null && _a !== void 0 ? _a : context === null || context === void 0 ? void 0 : context.currentStep) !== null && _b !== void 0 ? _b : 0,
            goToNextStep: (_c = props === null || props === void 0 ? void 0 : props.goToNextStep) !== null && _c !== void 0 ? _c : context === null || context === void 0 ? void 0 : context.goToNextStep,
            goToPreviousStep: (_d = props === null || props === void 0 ? void 0 : props.goToPreviousStep) !== null && _d !== void 0 ? _d : context === null || context === void 0 ? void 0 : context.goToPreviousStep,
            goToStep: (_e = props === null || props === void 0 ? void 0 : props.goToStep) !== null && _e !== void 0 ? _e : context === null || context === void 0 ? void 0 : context.goToStep,
            hasNextStep: (_f = props === null || props === void 0 ? void 0 : props.hasNextStep) !== null && _f !== void 0 ? _f : context === null || context === void 0 ? void 0 : context.hasNextStep,
            hasPreviousStep: (_g = props === null || props === void 0 ? void 0 : props.hasPreviousStep) !== null && _g !== void 0 ? _g : context === null || context === void 0 ? void 0 : context.hasPreviousStep,
            steps: (_h = props === null || props === void 0 ? void 0 : props.steps) !== null && _h !== void 0 ? _h : context === null || context === void 0 ? void 0 : context.steps,
        });
    }, [props, context]);
    return result;
};
exports.useWizardFormContext = useWizardFormContext;
