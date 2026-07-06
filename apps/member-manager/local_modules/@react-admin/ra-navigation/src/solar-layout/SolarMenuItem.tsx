import * as React from 'react';
import { ForwardedRef, ReactNode, useCallback } from 'react';
import {
    ListItemButton,
    ListItemButtonProps,
    ListItemIcon,
    styled,
    Tooltip,
    TooltipProps,
} from '@mui/material';
import { useTranslate } from 'react-admin';
import { Link, To } from 'react-router-dom';
import clsx from 'clsx';
import { useAppLocationMatcher } from '../app-location';
import { useSolarMenuContext } from './SolarMenuContext';
import { useSolarSidebarActiveMenu } from './useSolarSidebarActiveMenu';
import { usePrimarySidebarState } from './usePrimarySidebarState';
import { genericForwardRef } from './genericForwardRef';

const SolarMenuItemComponent = (
    {
        children,
        subMenu,
        className,
        icon,
        name,
        label,
        to,
        tooltipProps,
        ...rest
    }: SolarMenuItemProps,
    ref: ForwardedRef<HTMLLinkElement>
) => {
    const translate = useTranslate();
    const matchLocation = useAppLocationMatcher();
    const { setSecondaryContent, renderSlot } = useSolarMenuContext();
    const [, setIsPrimarySidebarOpen] = usePrimarySidebarState();
    const [secondarySidebarOpener, setSecondarySidebarOpener] =
        useSolarSidebarActiveMenu();

    const handleClick = useCallback(() => {
        if (!subMenu) {
            setSecondarySidebarOpener(null);
            setIsPrimarySidebarOpen(false);
            return;
        }
        if (secondarySidebarOpener === name) {
            setSecondarySidebarOpener(null);
            return;
        }

        setSecondarySidebarOpener(name);
        setSecondaryContent(subMenu);
    }, [
        subMenu,
        name,
        secondarySidebarOpener,
        setSecondarySidebarOpener,
        setIsPrimarySidebarOpen,
        setSecondaryContent,
    ]);

    return (
        <TooltipWrapper
            enabled={renderSlot === 'primary'}
            title={
                typeof label === 'string'
                    ? translate(label, { _: label })
                    : label
            }
            placement="right"
            {...tooltipProps}
        >
            {to && !subMenu ? (
                <Root
                    className={clsx(SolarMenuItemClasses.root, className, {
                        [SolarMenuItemClasses.active]:
                            secondarySidebarOpener === name,
                    })}
                    component={Link}
                    to={to}
                    onClick={handleClick}
                    selected={!!matchLocation(name)}
                    aria-current={!!matchLocation(name) ? 'page' : undefined}
                    // @ts-ignore
                    ref={ref}
                    {...rest}
                >
                    {renderSlot === 'primary' || icon != null ? (
                        <ListItemIcon
                            className={clsx(SolarMenuItemClasses.icon, {
                                [SolarMenuItemClasses.iconSecondary]:
                                    renderSlot === 'secondary',
                            })}
                        >
                            {icon}
                        </ListItemIcon>
                    ) : null}
                    {renderSlot === 'secondary'
                        ? label
                            ? translate(label, { _: label })
                            : children
                        : null}
                </Root>
            ) : (
                // FIXME: can't find a way to propagate the component prop type to a styled component
                // However it works and users that pass a custom component will have their ref correctly typed
                // @ts-ignore
                <Root
                    className={clsx(SolarMenuItemClasses.root, className, {
                        [SolarMenuItemClasses.active]:
                            secondarySidebarOpener === name,
                    })}
                    selected={!!matchLocation(name)}
                    aria-current={!!matchLocation(name) ? 'page' : undefined}
                    onClick={handleClick}
                    // @ts-ignore
                    ref={ref}
                    {...rest}
                >
                    {renderSlot === 'primary' || icon != null ? (
                        <ListItemIcon
                            className={clsx(SolarMenuItemClasses.icon, {
                                [SolarMenuItemClasses.iconSecondary]:
                                    renderSlot === 'secondary',
                            })}
                        >
                            {icon}
                        </ListItemIcon>
                    ) : null}
                    {renderSlot === 'secondary'
                        ? label
                            ? translate(label, { _: label })
                            : children
                        : null}
                </Root>
            )}
        </TooltipWrapper>
    );
};

const TooltipWrapper = ({
    children,
    enabled,
    ...props
}: { enabled: boolean } & TooltipProps) => {
    if (enabled) {
        return <Tooltip {...props}>{children}</Tooltip>;
    }

    return <>{children}</>;
};

export const SolarMenuItem = genericForwardRef(SolarMenuItemComponent);

export type SolarMenuItemProps = Omit<ListItemButtonProps, 'component'> & {
    children?: ReactNode;
    icon?: ReactNode;
    name: string;
    label?: string;
    subMenu?: ReactNode;
    to?: To;
    tooltipProps?: TooltipProps;
};

const PREFIX = 'RaSolarMenuItem';

export const SolarMenuItemClasses = {
    root: `${PREFIX}-root`,
    active: `${PREFIX}-active`,
    icon: `${PREFIX}-icon`,
    iconSecondary: `${PREFIX}-iconSecondary`,
};

const Root = styled(ListItemButton, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})<ListItemButtonProps>(({ theme }) => {
    return {
        display: 'flex',
        color: theme.palette.text.secondary,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
        minWidth: '1em',

        [`&.${SolarMenuItemClasses.active}`]: {
            backgroundColor: theme.palette.action.selected,
        },

        '&.Mui-selected': {
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.main,
        },

        [`& .${SolarMenuItemClasses.icon}`]: {
            color: 'inherit',
            minWidth: 'unset',
        },
        [`& .${SolarMenuItemClasses.iconSecondary}`]: {
            marginRight: theme.spacing(1),
        },
    };
});
