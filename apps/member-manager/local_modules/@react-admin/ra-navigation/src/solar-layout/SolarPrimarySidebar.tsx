import * as React from 'react';
import { useRef } from 'react';
import {
    Drawer,
    DrawerProps,
    GlobalStyles,
    styled,
    Theme,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import get from 'lodash/get';
import clsx from 'clsx';
import { usePrimarySidebarState } from './usePrimarySidebarState';
import { useSolarSidebarActiveMenu } from './useSolarSidebarActiveMenu';
import { useHasHorizontalScrollbar } from './useHasHorizontalScrollbar';

export const SolarPrimarySidebar = ({
    children,
    className,
    ...props
}: DrawerProps) => {
    const [isPrimarySidebarOpen, setIsPrimarySidebarOpen] =
        usePrimarySidebarState();
    const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] =
        useSolarSidebarActiveMenu();
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
    const theme = useTheme();
    const sideBarWidth = get(
        theme,
        `solarPrimarySidebar.width`,
        theme.spacing(6.75)
    );
    const paperRef = useRef<HTMLDivElement>(null);

    const hasHorizontalScrollbar = useHasHorizontalScrollbar(paperRef);
    const handleClose = () => {
        setIsPrimarySidebarOpen(false);
        setIsSecondarySidebarOpen(null);
    };

    // Had to do this to avoid Drawer passing the disableProp to the underlying div when
    // its variant is "permanent". Setting it to undefined wasn't enough.
    const drawerProps = props;
    if (isSmall && !isSecondarySidebarOpen) {
        drawerProps.disablePortal = true;
    }

    return (
        <Root
            className={clsx(SolarPrimarySidebarClasses.root, className)}
            open={isPrimarySidebarOpen || !isSmall}
            variant={
                isSmall && !isSecondarySidebarOpen ? 'temporary' : 'permanent'
            }
            onClose={handleClose}
            PaperProps={{
                ref: paperRef,
            }}
            {...drawerProps}
        >
            <GlobalStyles
                styles={{
                    ':root': {
                        '--SolarPrimarySidebarWidth': hasHorizontalScrollbar
                            ? `calc(${sideBarWidth} + ${theme.spacing(2)})`
                            : sideBarWidth,
                    },
                }}
            />
            {children}
        </Root>
    );
};

const PREFIX = 'RaSolarPrimarySidebar';
export const SolarPrimarySidebarClasses = {
    root: `${PREFIX}-root`,
};

const Root = styled(Drawer, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => {
    return {
        '& .MuiDrawer-paper': {
            width: 'var(--SolarPrimarySidebarWidth)',
            paddingBottom: theme.spacing(1),
            paddingTop: theme.spacing(1),
            paddingLeft: 0,
            paddingRight: 0,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: theme.spacing(1),
            borderRightStyle: 'solid',
            borderRightWidth: 1,
            borderColor: theme.palette.divider,
            [theme.breakpoints.down('md')]: {
                borderColor:
                    theme.palette.mode === 'dark'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[300],
            },
            overflowX: 'hidden',
            zIndex: theme.zIndex.drawer + 1,
        },
        zIndex: theme.zIndex.drawer + 1,
    };
});
