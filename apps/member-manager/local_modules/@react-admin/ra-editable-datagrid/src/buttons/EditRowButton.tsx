import * as React from 'react';
import { Tooltip, IconButton, IconButtonProps } from '@mui/material';
import ContentCreate from '@mui/icons-material/Create';
import { useTranslate } from 'react-admin';

import { useRowContext } from '../useRowContext';

export const EditRowButton = (props: EditRowButton) => {
    const { open } = useRowContext();
    const translate = useTranslate();
    const { label = 'ra.action.edit' } = props;
    const translatedLabel = translate(label, { _: 'Edit' });

    const handleClick = e => {
        e.stopPropagation();
        open();
    };

    return (
        <Tooltip title={translatedLabel}>
            <IconButton
                onClick={handleClick}
                size="small"
                color="primary"
                aria-label={translatedLabel}
                {...props}
            >
                <ContentCreate />
            </IconButton>
        </Tooltip>
    );
};

// eslint-disable-next-line no-redeclare
export type EditRowButton = Omit<IconButtonProps, 'onClick'> & {
    label?: string;
};
