import { ReactNode } from 'react';
export interface ContainerLayoutContextValue {
    hasDashboard?: boolean;
    menu?: ReactNode;
    title?: string | ReactNode;
    toolbar?: ReactNode;
    userMenu?: ReactNode;
}
export declare const ContainerLayoutContext: import("react").Context<ContainerLayoutContextValue>;
export declare const useContainerLayout: (props?: any) => ContainerLayoutContextValue;
//# sourceMappingURL=ContainerLayoutContext.d.ts.map