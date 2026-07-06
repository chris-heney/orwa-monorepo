import * as React from 'react';
import { ForwardedRef } from 'react';
import { List, ListProps, styled } from '@mui/material';
import clsx from 'clsx';
import { genericForwardRef } from './genericForwardRef';

const SolarMenuListComponent = (
    { className, component = 'div', ...props }: SolarMenuListProps,
    ref: ForwardedRef<any>
) => {
    return (
        // FIXME: can't find a way to propagate the component prop type to a styled component
        // However it works and users that pass a custom component will have their ref correctly typed
        // @ts-ignore
        <Root
            disablePadding
            className={clsx(SolarMenuListClasses.root, className)}
            {...props}
            component={component}
            ref={ref}
        />
    );
};

export const SolarMenuList = genericForwardRef(SolarMenuListComponent);

export type SolarMenuListProps = ListProps & {
    component?: React.ElementType;
};

const PREFIX = 'RaSolarMenuList';

export const SolarMenuListClasses = {
    root: `${PREFIX}-root`,
};

const Root = styled(List, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    gap: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    flexShrink: 0,
})) as typeof List;
