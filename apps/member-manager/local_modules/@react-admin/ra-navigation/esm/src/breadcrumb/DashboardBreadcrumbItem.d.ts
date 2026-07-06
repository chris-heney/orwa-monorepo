import * as React from 'react';
import { HTMLAttributes } from 'react';
import { BreadcrumbItemProps } from './BreadcrumbItem';
export type DashboardBreadcrumbItemProps = Omit<BreadcrumbItemProps, 'name' | 'label'> & {
    name?: string;
    label?: string;
} & HTMLAttributes<HTMLElement>;
export declare const DashboardBreadcrumbItem: ({ children, label, ...props }: DashboardBreadcrumbItemProps) => React.JSX.Element;
//# sourceMappingURL=DashboardBreadcrumbItem.d.ts.map