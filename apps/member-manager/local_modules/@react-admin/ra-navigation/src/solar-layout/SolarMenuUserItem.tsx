import * as React from 'react';
import { ElementType } from 'react';
import {
    useAuthProvider,
    useGetIdentity,
    useLocales,
    useThemesContext,
} from 'react-admin';
import { Avatar, styled } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import clsx from 'clsx';
import { SolarMenuItem, SolarMenuItemProps } from './SolarMenuItem';
import { SolarMenuList } from './SolarMenuList';
import { SolarMenuUserProfileItem } from './SolarMenuUserProfileItem';
import { SolarMenuToggleThemeItem } from './SolarMenuToggleThemeItem';
import { SolarMenuLocalesItem } from './SolarMenuLocalesItem';
import { genericForwardRef } from './genericForwardRef';

/**
 * A <SolarMenu> item that displays a user menu item when an authProvider is
 * available or a settings menu item when no authProvider is available but the
 * <Admin> has a darkTheme set or the i18nProvider supports multiple locales.
 *
 * It accepts the same props as the <SolarMenuItem> component.
 */
const SolarMenuUserItemComponent = (
    { subMenu, className, ...props }: SolarMenuUserItemProps,
    ref
) => {
    const { isLoading, identity } = useGetIdentity();
    const authProvider = useAuthProvider();
    const { darkTheme } = useThemesContext();
    const locales = useLocales();
    const hasManyLocales = locales && locales.length > 1;

    if (isLoading) return null;

    return (
        <Root
            name="user_menu"
            className={clsx(SolarMenuUserItemClasses.root, className)}
            label={
                authProvider != null
                    ? 'ra.auth.user_menu'
                    : 'ra.configurable.customize'
            }
            icon={
                authProvider ? (
                    identity?.avatar ? (
                        <Avatar
                            src={identity.avatar}
                            className={SolarMenuUserItemClasses.avatar}
                            alt={identity.fullName}
                        />
                    ) : (
                        <Avatar className={SolarMenuUserItemClasses.avatar} />
                    )
                ) : (
                    <SettingsIcon />
                )
            }
            ref={ref}
            subMenu={
                subMenu || (
                    <SolarMenuList
                        // We can't use the classes from this component here because the
                        // list is displayed in the secondary sidebar, hence it is not a
                        // child of the <SolarMenuUserItem> component
                        sx={{
                            marginTop: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {hasManyLocales ? <SolarMenuLocalesItem /> : null}
                        {darkTheme ? <SolarMenuToggleThemeItem /> : null}
                        {authProvider != null ? (
                            <SolarMenuUserProfileItem />
                        ) : null}
                    </SolarMenuList>
                )
            }
            {...props}
        />
    );
};

export const SolarMenuUserItem = genericForwardRef(SolarMenuUserItemComponent);

export type SolarMenuUserItemProps = Partial<SolarMenuItemProps> & {
    component?: ElementType;
};

const PREFIX = 'RaSolarMenuUserItem';

export const SolarMenuUserItemClasses = {
    root: `${PREFIX}-root`,
    avatar: `${PREFIX}-avatar`,
};

// FIXME: can't find a way to propagate the component type
// @ts-ignore
const Root = styled(SolarMenuItem)<SolarMenuItemProps>(() => ({
    paddingLeft: 6,
    paddingRight: 6,
    [`& .${SolarMenuUserItemClasses.avatar}`]: {
        maxWidth: '1.4em',
        maxHeight: '1.4em',
    },
}));
