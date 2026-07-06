import { createContext, ReactElement } from 'react';

export const WizardFormContext =
    createContext<WizardFormContextValue>(undefined);

export interface WizardFormContextValue {
    currentStep: number;
    hasPreviousStep: boolean;
    hasNextStep: boolean;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    goToStep: (step: number) => void;
    steps: ReactElement[];
}
