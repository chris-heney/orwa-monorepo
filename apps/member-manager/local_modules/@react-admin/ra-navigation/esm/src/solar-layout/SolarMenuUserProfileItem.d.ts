import * as React from 'react';
import { ForwardedRef } from 'react';
import { ListItemProps } from '@mui/material';
export declare const SolarMenuUserProfileItem: ({ redirectTo, className, ...props }: SolarMenuUserProfileItemProps, ref: ForwardedRef<HTMLDivElement>) => React.JSX.Element;
export type SolarMenuUserProfileItemProps = Partial<Omit<ListItemProps<'div'>, 'component'>> & {
    redirectTo?: string;
};
export declare const SolarMenuUserProfileItemClasses: {
    root: string;
    logoutIconButton: string;
    userFullName: string;
};
//# sourceMappingURL=SolarMenuUserProfileItem.d.ts.map