import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import { useWizardFormContext } from './useWizardFormContext';
import { WizardFormStepContext } from './WizardFormStepContext';

export const WizardFormStepProvider = ({
    children,
    step,
}: {
    children: ReactNode;
    step: number;
}) => {
    const context = useWizardFormContext();

    const stepContext = useMemo(
        () => ({
            ...context,
            active: step === context.currentStep,
            step,
        }),
        [context, step]
    );

    return (
        <WizardFormStepContext.Provider value={stepContext}>
            {children}
        </WizardFormStepContext.Provider>
    );
};
