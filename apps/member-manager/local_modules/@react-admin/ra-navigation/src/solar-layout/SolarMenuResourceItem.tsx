import * as React from 'react';
import { createElement, ForwardedRef } from 'react';
import { useGetResourceLabel, useResourceDefinitions } from 'react-admin';
import DefaultIcon from '@mui/icons-material/ViewList';
import { SolarMenuItem, SolarMenuItemProps } from './SolarMenuItem';
import { genericForwardRef } from './genericForwardRef';

const SolarMenuResourceItemComponent = (
    { name, ...rest }: SolarMenuResourceItemProps,
    ref: ForwardedRef<HTMLDivElement>
) => {
    const resources = useResourceDefinitions();
    const getResourceLabel = useGetResourceLabel();

    if (Object.keys(resources).length === 0) return null;

    return (
        <SolarMenuItem
            key={name}
            name={name}
            icon={
                resources[name].icon ? (
                    createElement(resources[name].icon)
                ) : (
                    <DefaultIcon />
                )
            }
            label={getResourceLabel(name, 2)}
            to={`/${name}`}
            ref={ref}
            {...rest}
        />
    );
};

export type SolarMenuResourceItemProps = {
    name: string;
} & Partial<SolarMenuItemProps>;

export const SolarMenuResourceItem = genericForwardRef(
    SolarMenuResourceItemComponent
);
