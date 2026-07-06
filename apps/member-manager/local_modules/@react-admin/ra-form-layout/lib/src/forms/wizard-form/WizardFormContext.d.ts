import { ReactElement } from 'react';
export declare const WizardFormContext: import("react").Context<WizardFormContextValue>;
export interface WizardFormContextValue {
    currentStep: number;
    hasPreviousStep: boolean;
    hasNextStep: boolean;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    goToStep: (step: number) => void;
    steps: ReactElement[];
}
//# sourceMappingURL=WizardFormContext.d.ts.map