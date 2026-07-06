import * as React from 'react';
import { HTMLAttributes, ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { To } from 'history';
import { Link, styled, SxProps, Typography } from '@mui/material';

import { useAppLocationMatcher, DASHBOARD } from '../app-location';
import { useHasDashboard } from '../app-location/useHasDashboard';
import { useTranslate } from 'ra-core';

export type GetLabelFunction = (
    context: Record<string, unknown>
) => string | JSX.Element;

export type GetToFunction = (context: Record<string, unknown>) => string | To;

export type BreadcrumbPath = {
    label: string | GetLabelFunction;
    to?: string | To | GetToFunction;
};

export interface BreadcrumbItemProps
    extends BreadcrumbPath,
        HTMLAttributes<HTMLLIElement> {
    hasDashboard?: boolean;
    name: string;
    path?: string;
    sx?: SxProps;
}

const resolveOrReturn = (valueOrFunction: any, context: any): any =>
    typeof valueOrFunction === 'function'
        ? valueOrFunction(context)
        : valueOrFunction;

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
export const BreadcrumbItem = (props: BreadcrumbItemProps): ReactElement => {
    const locationMatcher = useAppLocationMatcher();
    const hasDashboard = useHasDashboard(props);
    const translate = useTranslate();

    const {
        to,
        name,
        path,
        label,
        children,
        hasDashboard: hasDashboardOverride,
        ...rest
    } = props;

    const currentPath =
        name === DASHBOARD ? '' : `${path ? `${path}.` : ''}${name}`;

    const location = locationMatcher(currentPath);
    if (!location) {
        return null;
    }
    if (name === DASHBOARD && location.path === DASHBOARD) {
        return null;
    }

    const exactMatch = location.path === currentPath;

    const resolvedLabel = resolveOrReturn(label, location.values);
    const translatedLabel = translate(resolvedLabel, { _: resolvedLabel });
    const resolvedTo = resolveOrReturn(to, location.values);

    return (
        <>
            <Root key={name} {...rest}>
                {resolvedTo && !exactMatch ? (
                    <Link
                        variant="body2"
                        color="inherit"
                        component={RouterLink}
                        to={resolvedTo}
                    >
                        {translatedLabel}
                    </Link>
                ) : (
                    <Typography
                        variant="body2"
                        color="inherit"
                        component="span"
                    >
                        {translatedLabel}
                    </Typography>
                )}
            </Root>
            {React.Children.map(children, child =>
                React.isValidElement(child)
                    ? React.cloneElement<any>(child, {
                          path: currentPath,
                          hasDashboard,
                      })
                    : null
            )}
        </>
    );
};

const Root = styled('li', {
    name: 'RaBreadcrumbItem',
    overridesResolver: (props, styles) => styles.root,
})({});
