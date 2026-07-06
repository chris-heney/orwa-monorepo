import * as React from 'react';
import { Tabs, TabsProps } from '@mui/material';
import {
    useResourceDefinitions,
    useGetResourceLabel,
    useCreatePath,
    useTranslate,
} from 'react-admin';

import { useAppLocationMatcher } from '../app-location';
import { useContainerLayout } from './ContainerLayoutContext';
import { HorizontalMenuItem } from './HorizontalMenuItem';

/**
 * A horizontal menu component, alternative to react-admin's `<Menu>`.
 * To be used in the AppBar of the `<ContainerLayout>`.
 *
 * @example
 * import { HorizontalMenu } from '@react-admin/ra-navigation';
 *
 * export const Menu = () => (
 *     <HorizontalMenu>
 *         <HorizontalMenu.Item label="Dashboard" to="/" value="" />
 *         <HorizontalMenu.Item label="Songs" to="/songs" value="songs" />
 *         <HorizontalMenu.Item label="Artists" to="/artists" value="artists" />
 *     </HorizontalMenu>
 * );
 */
export const HorizontalMenu = (props: HorizontalMenuProps) => {
    const resources = useResourceDefinitions();
    const getResourceLabel = useGetResourceLabel();
    const { hasDashboard } = useContainerLayout(props);
    const createPath = useCreatePath();
    const translate = useTranslate();
    const {
        children = [
            hasDashboard ? (
                <HorizontalMenuItem
                    key="dashboard"
                    label={translate('ra.page.dashboard')}
                    to="/"
                    value=""
                />
            ) : null,
            ...Object.keys(resources)
                .filter(name => resources[name].hasList)
                .map(name => (
                    <HorizontalMenuItem
                        key={name}
                        label={getResourceLabel(name, 2)}
                        to={createPath({
                            resource: name,
                            type: 'list',
                        })}
                        value={name}
                        state={{ _scrollToTop: true }}
                    />
                )),
        ].filter(React.isValidElement),
        hasDashboard: hasDashboardOverride,
        ...rest
    } = props;
    const match = useAppLocationMatcher();

    const paths = React.Children.map(
        children,
        (child: any) => child.props.value
    );

    let currentPath = false,
        index = 0;
    while (!currentPath && index < paths.length) {
        const value = paths[index];
        if (match(value)) {
            currentPath = value;
        }
        index++;
    }

    return (
        <Tabs
            value={currentPath}
            aria-label="Navigation Tabs"
            textColor="inherit"
            {...rest}
        >
            {children}
        </Tabs>
    );
};

export interface HorizontalMenuProps extends TabsProps {
    children?: React.ReactNode;
    hasDashboard?: boolean;
}

HorizontalMenu.Item = HorizontalMenuItem;
