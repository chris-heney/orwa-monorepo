import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { ButtonProps, Button, useTranslate } from 'react-admin';
import { Tooltip, IconButton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FormDialogContext } from './FormDialogContext';

/**
 * Internal component which creates a dialog, along with a `<Button>` to open it.
 * This component is also responsible for managing the open/close state of the Dialog
 * (using an internal state, not the router).
 *
 * @param props.dialog A React Element containing the dialog
 * @param props.inline Optional - Set to true for an inline button, having only an icon and a tooltip
 * @param props.icon Optional - The icon associated to the button label
 * @param props.label Optional - The button label
 * @param props.ButtonProps Optional - An object containing props to pass to the MUI Button
 */
export const FormDialogButton = (props: FormDialogButtonProps) => {
    const translate = useTranslate();
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => {
        setIsOpen(true);
    }, []);
    const close = useCallback(() => {
        setIsOpen(false);
    }, []);
    const contextValue = useMemo(
        () => ({
            isOpen,
            open,
            close,
        }),
        [close, isOpen, open]
    );

    const {
        icon = defaultIcon,
        label = '',
        inline,
        dialog,
        ButtonProps,
    } = props;

    const onClick = useCallback(
        (e: any) => {
            open();
            e.stopPropagation();
        },
        [open]
    );

    const translatedLabel = translate(label, { _: label });

    const button = inline ? (
        <Tooltip title={translatedLabel}>
            <IconButton
                aria-label={translatedLabel}
                size="small"
                color="primary"
                {...ButtonProps}
                onClick={onClick}
            >
                {icon}
            </IconButton>
        </Tooltip>
    ) : (
        <Button label={translatedLabel} {...ButtonProps} onClick={onClick}>
            {icon}
        </Button>
    );

    return (
        <FormDialogContext.Provider value={contextValue}>
            {button}
            {dialog}
        </FormDialogContext.Provider>
    );
};

const defaultIcon = <OpenInNewIcon />;

export type FormDialogButtonProps = {
    inline?: boolean;
    icon?: ReactElement;
    dialog: ReactElement;
    label?: string;
    ButtonProps?: Omit<ButtonProps, 'onClick'>;
};
