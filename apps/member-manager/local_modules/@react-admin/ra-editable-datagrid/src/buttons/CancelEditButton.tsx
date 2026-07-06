import React from 'react';
import { useTranslate } from 'react-admin';
import { Tooltip, IconButton, IconButtonProps } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRowContext } from '../useRowContext';

export const CancelEditButton = (props: CancelEditButtonProps) => {
    const translate = useTranslate();
    const { close } = useRowContext();
    return (
        <Tooltip
            title={translate('ra.action.cancel', {
                _: 'ra.action.cancel',
            })}
        >
            <IconButton onClick={close} size="small" {...props}>
                <CancelIcon />
            </IconButton>
        </Tooltip>
    );
};

export interface CancelEditButtonProps // eslint-disable-line @typescript-eslint/no-empty-interface
    extends Omit<IconButtonProps, 'onClick'> {}

export default CancelEditButton;
