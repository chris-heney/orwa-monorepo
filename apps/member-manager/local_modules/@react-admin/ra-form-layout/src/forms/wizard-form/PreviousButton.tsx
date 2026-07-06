import * as React from 'react';
import { useTranslate } from 'react-admin';
import { useFormState } from 'react-hook-form';
import { Button, ButtonProps } from '@mui/material';
import { useWizardFormContext } from './useWizardFormContext';

export const PreviousButton = ({
    alwaysEnable,
    disabled: disabledProp,
    ...rest
}: PreviousButtonProps) => {
    const translate = useTranslate();
    const { isValidating } = useFormState();
    const { hasPreviousStep, goToPreviousStep } = useWizardFormContext();
    const disabled = valueOrDefault(
        alwaysEnable === false || alwaysEnable === undefined
            ? undefined
            : !alwaysEnable,
        disabledProp || isValidating
    );
    const label = translate('ra-form-layout.action.previous');

    const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
        event.preventDefault();
        goToPreviousStep();
    };

    if (hasPreviousStep || alwaysEnable) {
        return (
            <Button
                color="primary"
                disabled={disabled}
                type="button"
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

export interface PreviousButtonProps extends ButtonProps {
    alwaysEnable?: boolean;
}

const valueOrDefault = (value, defaultValue) =>
    typeof value === 'undefined' ? defaultValue : value;
