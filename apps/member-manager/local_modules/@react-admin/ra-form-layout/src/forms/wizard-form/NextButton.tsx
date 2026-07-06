import * as React from 'react';
import { useFormGroup, useTranslate } from 'react-admin';
import { useFormState } from 'react-hook-form';
import { Button, ButtonProps } from '@mui/material';
import { useWizardFormContext } from './useWizardFormContext';

export const NextButton = ({
    alwaysEnable,
    disabled: disabledProp,
    ...rest
}: NextButtonProps) => {
    const translate = useTranslate();
    const { isValidating } = useFormState();
    const { currentStep, hasNextStep, goToNextStep } = useWizardFormContext();
    const { isValid } = useFormGroup(`step-${currentStep}`);
    const disabled = valueOrDefault(
        alwaysEnable === false || alwaysEnable === undefined
            ? undefined
            : !alwaysEnable,
        disabledProp || isValidating || !isValid
    );
    const label = translate('ra-form-layout.action.next');

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        goToNextStep();
    };

    if (hasNextStep || alwaysEnable) {
        return (
            <Button
                variant="contained"
                color="primary"
                disabled={disabled}
                type="submit"
                aria-label={label}
                onClick={handleClick}
                {...rest}
            >
                {label}
            </Button>
        );
    }

    return null;
};

export interface NextButtonProps extends ButtonProps {
    alwaysEnable?: boolean;
}

const valueOrDefault = (value, defaultValue) =>
    typeof value === 'undefined' ? defaultValue : value;
