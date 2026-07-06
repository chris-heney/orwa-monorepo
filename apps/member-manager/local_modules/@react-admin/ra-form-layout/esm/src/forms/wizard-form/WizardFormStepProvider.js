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
import { useMemo } from 'react';
import { useWizardFormContext } from './useWizardFormContext';
import { WizardFormStepContext } from './WizardFormStepContext';
export var WizardFormStepProvider = function (_a) {
    var children = _a.children, step = _a.step;
    var context = useWizardFormContext();
    var stepContext = useMemo(function () { return (__assign(__assign({}, context), { active: step === context.currentStep, step: step })); }, [context, step]);
    return (React.createElement(WizardFormStepContext.Provider, { value: stepContext }, children));
};
