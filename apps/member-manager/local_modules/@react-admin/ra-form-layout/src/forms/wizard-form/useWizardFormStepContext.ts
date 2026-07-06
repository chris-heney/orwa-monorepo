import { useContext, useMemo } from 'react';
import {
    WizardFormStepContext,
    WizardFormStepContextValue,
} from './WizardFormStepContext';

/**
 * A hook that returns the WizardFormStepContext.
 * This context provides access to the current wizard step, the index and active status of the step for the calling component, and handlers to navigate between steps.
 * @param {Partial<WizardFormStepContextValue>} props Optional. Props to use instead of the values from the context.
 * @returns {WizardFormStepContextValue} The WizardFormStepContext.
 */

export const useWizardFormStepContext = (
    props?: Partial<WizardFormStepContextValue>
): WizardFormStepContextValue => {
    const context = useContext(WizardFormStepContext);

    if (context == null && props == null) {
        throw new Error(
            'useWizardFormStepContext must be used within a WizardFormStepContext.'
        );
    }

    const result = useMemo<WizardFormStepContextValue>(
        () => ({
            active: props?.active ?? context?.active ?? false,
            step: props?.step ?? context?.step,
            currentStep: props?.currentStep ?? context?.currentStep ?? 0,
            goToNextStep: props?.goToNextStep ?? context?.goToNextStep,
            goToPreviousStep:
                props?.goToPreviousStep ?? context?.goToPreviousStep,
            goToStep: props?.goToStep ?? context?.goToStep,
            hasNextStep: props?.hasNextStep ?? context?.hasNextStep,
            hasPreviousStep: props?.hasPreviousStep ?? context?.hasPreviousStep,
            steps: props?.steps ?? context?.steps,
        }),
        [props, context]
    );

    return result;
};
