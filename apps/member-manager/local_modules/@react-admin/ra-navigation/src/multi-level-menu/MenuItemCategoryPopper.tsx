import * as React from 'react';
import {
    ClickAwayListener,
    IconButton,
    Paper,
    PopperProps,
    Popper,
    Slide,
    styled,
    SxProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MenuItemClasses } from './MenuItemNode';
import { useTranslate } from 'react-admin';

export const MenuItemCategoryPopper = ({
    children,
    onClose,
    ...props
}: MenuItemCategoryPopperProps) => {
    const translate = useTranslate();

    return (
        <Root {...props} role="presentation">
            {({ TransitionProps }) => (
                <ClickAwayListener onClickAway={onClose}>
                    <Slide {...TransitionProps} direction="right">
                        <Paper>
                            <IconButton
                                aria-label={translate('ra.action.close')}
                                className={
                                    MenuItemCategoryPopoverClasses.closeButton
                                }
                                onClick={onClose}
                            >
                                <CloseIcon />
                            </IconButton>
                            {children}
                        </Paper>
                    </Slide>
                </ClickAwayListener>
            )}
        </Root>
    );
};

const PREFIX = 'RaMenuItemCategoryPopover';
export const MenuItemCategoryPopoverClasses = {
    closeButton: `${PREFIX}-closeButton`,
};

const Root = styled(Popper, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    '& .MuiPaper-root': {
        backgroundColor: theme.palette.background.paper,
        minWidth: 250,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        paddingRight: theme.spacing(4), // Some space to ensure the close button is visible

        [`& .${MenuItemClasses.link}`]: {
            color:
                theme.palette.mode === 'dark'
                    ? theme.palette.common.white
                    : theme.palette.common.black,
        },

        [`& .${MenuItemClasses.active}`]: {
            color:
                theme.palette.mode === 'dark'
                    ? theme.palette.common.white
                    : theme.palette.common.black,
        },

        [`& .${MenuItemClasses.icon}`]: {
            color:
                theme.palette.mode === 'dark'
                    ? theme.palette.common.white
                    : theme.palette.common.black,
        },
        [`& .${MenuItemClasses.button}`]: {
            color:
                theme.palette.mode === 'dark'
                    ? theme.palette.common.white
                    : theme.palette.common.black,
        },
    },

    [`& .${MenuItemCategoryPopoverClasses.closeButton}`]: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
    },
}));

export interface MenuItemCategoryPopperProps extends PopperProps {
    onClose: () => void;
    sx?: SxProps;
}
