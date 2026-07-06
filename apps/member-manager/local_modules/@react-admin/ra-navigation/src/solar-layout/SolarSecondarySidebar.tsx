import * as React from 'react';
import { Drawer, DrawerProps, styled } from '@mui/material';
import clsx from 'clsx';
import { useSolarSidebarActiveMenu } from './useSolarSidebarActiveMenu';

export const SolarSecondarySidebar = ({
    children,
    className,
    ...props
}: DrawerProps) => {
    const [activeMenu, setActiveMenu] = useSolarSidebarActiveMenu();

    return (
        <Root
            open={!!activeMenu}
            className={clsx(SolarSecondarySidebarClasses.root, className)}
            onClose={() => setActiveMenu(null)}
            elevation={0}
            disableEnforceFocus
            disablePortal
            {...props}
        >
            {children}
        </Root>
    );
};

const PREFIX = 'RaSolarSecondarySidebar';
export const SolarSecondarySidebarClasses = {
    root: `${PREFIX}-root`,
};

const Root = styled(Drawer, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => {
    return {
        '& .MuiBackdrop-root': {
            left: 'var(--SolarPrimarySidebarWidth)',
        },
        '& .MuiDrawer-paper': {
            minWidth: 'calc(80% - var(--SolarPrimarySidebarWidth))',
            [theme.breakpoints.up('md')]: {
                minWidth: `18em`,
            },
            left: 'var(--SolarPrimarySidebarWidth)',
            borderLeftStyle: 'none',
            borderColor: theme.palette.divider,
            paddingBottom: theme.spacing(1),
            paddingTop: theme.spacing(1),
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        },
    };
});
