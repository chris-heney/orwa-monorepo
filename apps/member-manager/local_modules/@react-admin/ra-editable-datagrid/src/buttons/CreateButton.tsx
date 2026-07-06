import React from 'react';
import {
    useGetResourceLabel,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Tooltip, Button, ButtonProps } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const CreateButton = (props: CreateButtonProps) => {
    const { resource: resourceOverride, ...rest } = props;
    const translate = useTranslate();
    const resource = useResourceContext(props);
    const getResourceLabel = useGetResourceLabel();
    const singularResourceName = getResourceLabel(resource, 1);

    const label = translate('ra.page.create', { name: singularResourceName });

    return (
        <Tooltip title={label}>
            <Button size="small" color="primary" aria-label={label} {...rest}>
                <AddIcon />
                {label}
            </Button>
        </Tooltip>
    );
};

export type CreateButtonProps = ButtonProps & {
    resource: string;
};
