import React from 'react';
import { Tooltip, IconButton, IconButtonProps } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslate } from 'react-admin';

export const InlineCreateButton = (props: IconButtonProps) => {
    const translate = useTranslate();
    const label = translate('ra.action.create', { _: 'ra.action.create' });
    return (
        <Tooltip title={label}>
            <IconButton
                aria-label={label}
                size="small"
                color="primary"
                {...props}
            >
                <AddIcon />
                {props.children}
            </IconButton>
        </Tooltip>
    );
};
