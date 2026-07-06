import * as React from 'react';
import { ForwardedRef } from 'react';
import { SolarMenuItemProps } from './SolarMenuItem';
export type SolarMenuResourceItemProps = {
    name: string;
} & Partial<SolarMenuItemProps>;
export declare const SolarMenuResourceItem: ({ name, ...rest }: SolarMenuResourceItemProps, ref: ForwardedRef<HTMLDivElement>) => React.JSX.Element;
//# sourceMappingURL=SolarMenuResourceItem.d.ts.map