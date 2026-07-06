import * as React from 'react';
import { Stepper, StepperProps, StepButton, Step } from '@mui/material';
import { useWizardFormContext } from './useWizardFormContext';
import { WizardFormContextValue } from './WizardFormContext';
import { WizardFormStepProvider } from './WizardFormStepProvider';
import { styled } from '@mui/system';

/**
 * Progress component rendering a stepper on top of the wizard
 *
 * @prop {number} currentStep Current selected step index
 * @prop {Function} onStepClick Action called when a step is clicked
 * @prop {React.ReactElement[]} steps Array of step elements
 */
export const WizardProgress = (props: WizardFormProgressProps) => {
    const { currentStep, goToStep, steps } = useWizardFormContext(props);

    const handleStepClick = (index: number) => (): void => goToStep(index);

    return (
        <StyledStepper activeStep={currentStep} {...props}>
            {steps.map((step, index) => {
                const label = React.cloneElement(step, { intent: 'label' });

                return (
                    <Step key={`step_${index}`}>
                        <StepButton onClick={handleStepClick(index)}>
                            <WizardFormStepProvider key={step.key} step={index}>
                                {label}
                            </WizardFormStepProvider>
                        </StepButton>
                    </Step>
                );
            })}
        </StyledStepper>
    );
};

export interface WizardFormProgressProps
    extends Omit<StepperProps, 'activeStep' | 'children'>,
        Partial<WizardFormContextValue> {}

const WizardProgressPrefix = 'RaWizardProgress';

const StyledStepper = styled(Stepper, {
    overridesResolver: (props, styles) => styles.root,
    name: WizardProgressPrefix,
})(({ theme }) => ({
    margin: theme.spacing(3),
}));
