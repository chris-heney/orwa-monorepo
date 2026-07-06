import * as React from 'react';
import { ForwardedRef, useCallback } from 'react';
import { useGetIdentity, useLogout, useTranslate } from 'react-admin';
import {
    IconButton,
    ListItem,
    ListItemButton,
    ListItemProps,
    ListItemText,
    Tooltip,
    styled,
} from '@mui/material';
import clsx from 'clsx';
import ExitIcon from '@mui/icons-material/PowerSettingsNew';
import { genericForwardRef } from './genericForwardRef';

/**
 * This <SolarMenu> item displays the user name from the `authProvider.getIdentity` if available and a logout button.
 * Meant to be used in the secondary sidebar of the <SolarMenu> component.
 * Used by default in the <SolarMenu.UserItem> component.
 * It accepts the same props as MUI's <ListItem> component.
 * @see SolarMenu
 * @see SolarMenu.UserItem
 * @param props {SolarMenuUserProfileItemProps}
 * @param props.redirectTo {string} Optional. The location to redirect the user to when clicking on the logout button. Defaults to '/'. Set to false to disable redirection.
 */
const SolarMenuUserProfileItemComponent = (
    { redirectTo, className, ...props }: SolarMenuUserProfileItemProps,
    ref: ForwardedRef<HTMLDivElement>
) => {
    const { isLoading, identity } = useGetIdentity();
    const translate = useTranslate();
    const logout = useLogout();

    const handleClick = useCallback(
        () => logout(null, redirectTo, false),
        [redirectTo, logout]
    );
    if (isLoading) return null;

    return (
        <Root
            component="div"
            className={clsx(SolarMenuUserProfileItemClasses.root, className)}
            // @ts-ignore
            ref={ref}
            secondaryAction={
                identity?.fullName ? (
                    <Tooltip title={translate('ra.auth.logout')}>
                        <IconButton
                            edge="end"
                            aria-label={translate('ra.auth.logout')}
                            onClick={handleClick}
                            className={
                                SolarMenuUserProfileItemClasses.logoutIconButton
                            }
                        >
                            <ExitIcon />
                        </IconButton>
                    </Tooltip>
                ) : null
            }
            disablePadding={identity?.fullName == null}
            {...props}
        >
            {identity?.fullName != null ? (
                <ListItemText
                    className={SolarMenuUserProfileItemClasses.userFullName}
                    primary={identity?.fullName ?? null}
                />
            ) : (
                <ListItemButton onClick={handleClick}>
                    <ListItemText>{translate('ra.auth.logout')}</ListItemText>
                    <ExitIcon />
                </ListItemButton>
            )}
        </Root>
    );
};

export const SolarMenuUserProfileItem = genericForwardRef(
    SolarMenuUserProfileItemComponent
);

export type SolarMenuUserProfileItemProps = Partial<
    Omit<ListItemProps<'div'>, 'component'>
> & {
    redirectTo?: string;
};

const PREFIX = 'RaSolarMenuUserItem';

export const SolarMenuUserProfileItemClasses = {
    root: `${PREFIX}-root`,
    logoutIconButton: `${PREFIX}-logoutIconButton`,
    userFullName: `${PREFIX}-userFullName`,
};

// FIXME: can't find a way to propagate the component type
const Root = styled(ListItem)(() => ({
    [`& .${SolarMenuUserProfileItemClasses.logoutIconButton}`]: {
        marginRight: theme => `-${theme.spacing(1)}`,
    },
    [`& .${SolarMenuUserProfileItemClasses.userFullName}`]: {
        margin: 0,
    },
}));
