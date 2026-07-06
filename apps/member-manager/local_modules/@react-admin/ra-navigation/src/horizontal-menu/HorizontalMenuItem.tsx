import * as React from 'react';
import { Tab } from '@mui/material';
import { Link } from 'react-router-dom';

export const HorizontalMenuItem = ({
    label,
    to,
    value = '',
    ...props
}: HorizontalMenuItemProps) => (
    <Tab
        value={value}
        label={label || value}
        to={to || `/${value}`}
        component={Link}
        {...props}
    />
);

export interface HorizontalMenuItemProps {
    value: string;
    label?: string;
    to?: string;
    // cannot extend TabProps because TS complains about the 'component' prop
    [key: string]: any;
}
