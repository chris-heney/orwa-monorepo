import { createContext } from 'react';
import { WizardFormContextValue } from './WizardFormContext';

export const WizardFormStepContext =
    createContext<WizardFormStepContextValue>(undefined);

export interface WizardFormStepContextValue extends WizardFormContextValue {
    active: boolean;
    step: number;
}
