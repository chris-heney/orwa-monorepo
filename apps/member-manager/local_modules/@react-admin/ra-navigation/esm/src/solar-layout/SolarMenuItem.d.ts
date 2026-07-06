import * as React from 'react';
import { ForwardedRef, ReactNode } from 'react';
import { ListItemButtonProps, TooltipProps } from '@mui/material';
import { To } from 'react-router-dom';
export declare const SolarMenuItem: ({ children, subMenu, className, icon, name, label, to, tooltipProps, ...rest }: SolarMenuItemProps, ref: ForwardedRef<HTMLLinkElement>) => React.JSX.Element;
export type SolarMenuItemProps = Omit<ListItemButtonProps, 'component'> & {
    children?: ReactNode;
    icon?: ReactNode;
    name: string;
    label?: string;
    subMenu?: ReactNode;
    to?: To;
    tooltipProps?: TooltipProps;
};
export declare const SolarMenuItemClasses: {
    root: string;
    active: string;
    icon: string;
    iconSecondary: string;
};
//# sourceMappingURL=SolarMenuItem.d.ts.map