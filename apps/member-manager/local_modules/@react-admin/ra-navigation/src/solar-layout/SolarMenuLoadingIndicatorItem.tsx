import * as React from 'react';
import { ForwardedRef, useCallback } from 'react';
import { useLoading, useRefresh } from 'react-admin';
import { CircularProgress, styled } from '@mui/material';
import clsx from 'clsx';
import NavigationRefresh from '@mui/icons-material/Refresh';
import { genericForwardRef } from './genericForwardRef';
import { SolarMenuItem, SolarMenuItemProps } from './SolarMenuItem';

const SolarMenuLoadingIndicatorItemComponent = (
    { className, ...props }: SolarMenuLoadingIndicatorItemProps,
    ref: ForwardedRef<HTMLDivElement>
) => {
    const loading = useLoading();
    const refresh = useRefresh();
    const handleClick = useCallback(
        event => {
            event.preventDefault();
            refresh();
        },
        [refresh]
    );
    return (
        // FIXME: can't find a way to propagate the component prop type
        // However it works and users that pass a custom component will have their ref correctly typed
        // @ts-ignore
        <Root
            name="loading"
            className={clsx(
                SolarMenuLoadingIndicatorItemClasses.root,
                className
            )}
            icon={
                loading ? (
                    <CircularProgress
                        className={
                            SolarMenuLoadingIndicatorItemClasses.progress
                        }
                        size={16}
                        thickness={6}
                    />
                ) : (
                    <NavigationRefresh
                        className={SolarMenuLoadingIndicatorItemClasses.icon}
                    />
                )
            }
            label={loading ? 'ra.page.loading' : 'ra.action.refresh'}
            onClick={handleClick}
            // @ts-ignore
            ref={ref}
            {...props}
        />
    );
};

export const SolarMenuLoadingIndicatorItem = genericForwardRef(
    SolarMenuLoadingIndicatorItemComponent
);

export type SolarMenuLoadingIndicatorItemProps = Partial<
    Omit<SolarMenuItemProps, 'component'>
>;

const PREFIX = 'RaSolarMenuLoadingIndicatorItem';

export const SolarMenuLoadingIndicatorItemClasses = {
    root: `${PREFIX}-root`,
    icon: `${PREFIX}-icon`,
    progress: `${PREFIX}-progress`,
};

// @ts-ignore
const Root = styled(SolarMenuItem)(({ theme }) => ({
    [`& .${SolarMenuLoadingIndicatorItemClasses.progress}`]: {
        margin: theme.spacing(0.5),
    },
}));
