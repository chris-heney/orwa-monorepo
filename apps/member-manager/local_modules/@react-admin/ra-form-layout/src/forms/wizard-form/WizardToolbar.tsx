import * as React from 'react';
import { Toolbar as MUIToolbar, Grid, ToolbarProps } from '@mui/material';
import { SaveButton } from 'react-admin';
import { useFormState, useFormContext } from 'react-hook-form';

import { NextButton } from './NextButton';
import { WizardFormContextValue } from './WizardFormContext';
import { useWizardFormContext } from './useWizardFormContext';
import { PreviousButton } from './PreviousButton';

/**
 * The Toolbar displayed at the bottom of WizardForm.
 *
 * @prop {boolean} hasPreviousStep Optional. Does the wizard have a previous step?
 * @prop {boolean} hasNextStep Optional. Does the wizard have a next step?
 * @prop {Function} onPreviousClick Optional. Previous button click action
 * @prop {Function} onNextClick Optional. Next button click action
 * @prop {...BaseToolbarSubmitProps}
 */
export const WizardToolbar = (props: WizardToolbarProps) => {
    const { children, ...rest } = props;
    const { trigger } = useFormContext();

    // For some reason, the SaveButton stay disabled unless we subscribe to the isDirty field here
    // Note: this hack is no longer needed with RHF v7.39.1, but let's keep it for older versions
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isDirty } = useFormState();

    const { hasNextStep, currentStep } = useWizardFormContext(props);

    // Trigger form validation initially, and on step change, to force the FormGroup-level
    // isValid flag to be in sync
    React.useEffect(() => {
        trigger();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);

    return (
        <MUIToolbar {...sanitizeRestProps(rest)}>
            {children ? (
                children
            ) : (
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <PreviousButton />
                    </Grid>
                    <Grid item>
                        {hasNextStep ? <NextButton /> : <SaveButton />}
                    </Grid>
                </Grid>
            )}
        </MUIToolbar>
    );
};

const sanitizeRestProps = ({
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    steps,
    ...rest
}: WizardToolbarProps): Omit<ToolbarProps, 'classes'> => rest;

export interface WizardToolbarProps
    extends Omit<ToolbarProps, 'classes'>,
        Partial<WizardFormContextValue> {}
