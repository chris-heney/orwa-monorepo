import * as React from 'react';
import { ForwardedRef } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { DASHBOARD, DASHBOARD_LABEL } from '../app-location';
import { SolarMenuItem, SolarMenuItemProps } from './SolarMenuItem';
import { genericForwardRef } from './genericForwardRef';

const SolarMenuDashboardItemComponent = (
    { icon, ...props }: SolarMenuDashboardItemProps,
    ref: ForwardedRef<HTMLDivElement>
) => (
    // FIXME: can't find a way to propagate the component prop type
    // However it works and users that pass a custom component will have their ref correctly typed
    // @ts-ignore
    <SolarMenuItem
        key={DASHBOARD}
        name={DASHBOARD}
        label={DASHBOARD_LABEL}
        icon={icon == null ? DefaultIcon : icon}
        to="/"
        ref={ref}
        {...props}
    />
);

const DefaultIcon = <DashboardIcon />;

export const SolarMenuDashboardItem = genericForwardRef(
    SolarMenuDashboardItemComponent
);

export type SolarMenuDashboardItemProps = Partial<SolarMenuItemProps>;
