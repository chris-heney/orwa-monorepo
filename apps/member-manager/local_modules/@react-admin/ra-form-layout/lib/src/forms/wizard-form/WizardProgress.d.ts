import * as React from 'react';
import { StepperProps } from '@mui/material';
import { WizardFormContextValue } from './WizardFormContext';
/**
 * Progress component rendering a stepper on top of the wizard
 *
 * @prop {number} currentStep Current selected step index
 * @prop {Function} onStepClick Action called when a step is clicked
 * @prop {React.ReactElement[]} steps Array of step elements
 */
export declare const WizardProgress: (props: WizardFormProgressProps) => React.JSX.Element;
export interface WizardFormProgressProps extends Omit<StepperProps, 'activeStep' | 'children'>, Partial<WizardFormContextValue> {
}
//# sourceMappingURL=WizardProgress.d.ts.map