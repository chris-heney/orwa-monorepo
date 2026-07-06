import * as React from 'react';
import { HTMLAttributes } from 'react';

import { BreadcrumbItem, BreadcrumbItemProps } from './BreadcrumbItem';
import { DASHBOARD, DASHBOARD_LABEL } from '../app-location';
import { useBasename } from 'react-admin';

export type DashboardBreadcrumbItemProps = Omit<
    BreadcrumbItemProps,
    'name' | 'label'
> & {
    name?: string;
    label?: string;
} & HTMLAttributes<HTMLElement>;

export const DashboardBreadcrumbItem = ({
    children,
    label = DASHBOARD_LABEL,
    ...props
}: DashboardBreadcrumbItemProps) => {
    const basename = useBasename();
    const to = basename !== '' ? `${basename}` : '/';

    return (
        <BreadcrumbItem name={DASHBOARD} to={to} label={label} {...props}>
            {children}
        </BreadcrumbItem>
    );
};
