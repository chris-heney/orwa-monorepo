import * as React from 'react';
import { styled } from '@mui/material/styles';
import { IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslate } from 'ra-core';

import { usePrimarySidebarState } from './usePrimarySidebarState';

/**
 * A button that toggles the solar primary sidebar. Used by default in the <SolarAppBar>.
 * @param props The component props
 * @param {String} props.className An optional class name to apply to the button
 */
export const SolarSidebarToggleButton = (
    props: SolarSidebarToggleButtonProps
) => {
    const translate = useTranslate();

    const { className } = props;
    const [open, setOpen] = usePrimarySidebarState();

    return (
        <Tooltip
            className={className}
            title={translate(
                open ? 'ra.action.close_menu' : 'ra.action.open_menu',
                { _: 'Open/Close menu' }
            )}
            enterDelay={500}
        >
            <StyledIconButton color="inherit" onClick={() => setOpen(!open)}>
                <MenuIcon
                    classes={{
                        root: open
                            ? SidebarToggleButtonClasses.menuButtonIconOpen
                            : SidebarToggleButtonClasses.menuButtonIconClosed,
                    }}
                />
            </StyledIconButton>
        </Tooltip>
    );
};

export type SolarSidebarToggleButtonProps = {
    className?: string;
};

const PREFIX = 'RaSolarSidebarToggleButton';

export const SidebarToggleButtonClasses = {
    menuButtonIconClosed: `${PREFIX}-menuButtonIconClosed`,
    menuButtonIconOpen: `${PREFIX}-menuButtonIconOpen`,
};

const StyledIconButton = styled(IconButton, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${SidebarToggleButtonClasses.menuButtonIconClosed}`]: {
        transition: theme.transitions.create(['transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        transform: 'rotate(0deg)',
    },

    [`& .${SidebarToggleButtonClasses.menuButtonIconOpen}`]: {
        transition: theme.transitions.create(['transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        transform: 'rotate(180deg)',
    },
}));
