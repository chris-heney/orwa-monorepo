import { useContext, useMemo } from 'react';
import { WizardFormContext, WizardFormContextValue } from './WizardFormContext';

/**
 * A hook that returns the WizardFormContext.
 * This context provides access to the current wizard step and handlers to navigate between steps.
 * @param {Partial<WizardFormContextValue>} props Optional. Props to use instead of the values from the context.
 * @returns {WizardFormContextValue} The WizardFormContext.
 */
export const useWizardFormContext = (
    props?: Partial<WizardFormContextValue>
): WizardFormContextValue => {
    const context = useContext(WizardFormContext);

    if (context == null && props == null) {
        throw new Error(
            'useWizardFormContext must be used within a WizardFormContext.'
        );
    }

    const result = useMemo<WizardFormContextValue>(
        () => ({
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
