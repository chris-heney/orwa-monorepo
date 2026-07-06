import { HTMLAttributes, ReactElement } from 'react';
import { To } from 'history';
import { SxProps } from '@mui/material';
export type GetLabelFunction = (context: Record<string, unknown>) => string | JSX.Element;
export type GetToFunction = (context: Record<string, unknown>) => string | To;
export type BreadcrumbPath = {
    label: string | GetLabelFunction;
    to?: string | To | GetToFunction;
};
export interface BreadcrumbItemProps extends BreadcrumbPath, HTMLAttributes<HTMLLIElement> {
    hasDashboard?: boolean;
    name: string;
    path?: string;
    sx?: SxProps;
}
/**
 * The <BreadcrumbItem /> is the component used to display the breadcrumb path inside <Breadcrumb />
 *
 * Also exported as `Breadcrumb.Item` for convenience.
 *
 * @param {string} name Required. The name of this item which will be used to infer its full path.
 * @param {string} path Internal prop used to build the item full path.
 * @param {function|string} label Required. The label to display for this item.
 * @param {function|string} to Optional. The react-router path to redirect to.
 * @param {boolean} hasDashboard Optional. A boolean indicating whether a dashboard is present. If it is, the dashboard item will be added in the breadcrumb on every pages. You shouldn't have to pass this prop unless you're wrapping the `<BreadcrumbItem>`
 *
 * @see Breadcrumb
 */
export declare const BreadcrumbItem: (props: BreadcrumbItemProps) => ReactElement;
//# sourceMappingURL=BreadcrumbItem.d.ts.map