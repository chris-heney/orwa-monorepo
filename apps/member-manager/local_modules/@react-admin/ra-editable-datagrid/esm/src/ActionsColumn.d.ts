import * as React from 'react';
import { ReactNode } from 'react';
export declare const ActionsColumn: ({ mutationMode, children, noDelete, label, ...props }: ActionsColumnProp) => React.JSX.Element;
export interface ActionsColumnProp {
    children?: ReactNode;
    noDelete?: boolean;
    redirect: string | boolean;
    [key: string]: any;
}
//# sourceMappingURL=ActionsColumn.d.ts.map