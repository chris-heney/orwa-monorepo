import { styled } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { CheckboxGroupInput, CheckboxGroupInputProps } from 'react-admin';

export const InputSelector = (props: InputSelectorProps) => {
    const {
        className,
        inputs,
        fullWidth = true,
        helperText = <>&nbsp;</>, // to avoid visual jumps
        ...rest
    } = props;

    return (
        <StyledCheckboxGroupInput
            choices={inputs.map(input => ({
                id: input,
                name: input,
            }))}
            row={false}
            fullWidth={fullWidth}
            helperText={helperText}
            className={clsx(className, InputSelectorClasses.root)}
            {...rest}
        />
    );
};

export interface InputSelectorProps extends CheckboxGroupInputProps {
    inputs: string[];
}

const PREFIX = 'RaInputSelector';

export const InputSelectorClasses = {
    root: `${PREFIX}-root`,
};

const StyledCheckboxGroupInput = styled(CheckboxGroupInput, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    '& .MuiFormGroup-root': {
        maxHeight: 'max(calc(100vh - 300px), 100px)',
        overflowY: 'auto',
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        flexWrap: 'nowrap',
    },
    '& .MuiFormControlLabel-root': {
        marginRight: theme.spacing(-1),
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
}));
