import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Toolbar, AppBar, AppBarProps, Box, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    UserMenu,
    LoadingIndicator,
    LocalesMenuButton,
    TitleComponent,
    useLocales,
} from 'react-admin';

import { useContainerLayout } from './ContainerLayoutContext';
import { HorizontalMenu } from './HorizontalMenu';

export const Header = (props: HeaderProps) => {
    const {
        title = 'React-admin',
        menu = defaultMenu,
        toolbar = defaultToolbar,
        userMenu = defaultUserMenu,
    } = useContainerLayout(props);

    return (
        <Root
            position="static"
            color="secondary"
            className={HeaderClasses.root}
            {...sanitizeRestProps(props)}
        >
            <Toolbar variant="dense" className={HeaderClasses.toolbar}>
                <Box display="flex" alignItems="center">
                    <Link
                        component={RouterLink}
                        to="/"
                        variant="h6"
                        color="primary.contrastText"
                        underline="none"
                    >
                        {title}
                    </Link>
                </Box>
                <Box>{menu}</Box>
                <Box display="flex">
                    {toolbar}
                    {typeof userMenu === 'boolean' ? (
                        userMenu === true ? (
                            <UserMenu />
                        ) : null
                    ) : (
                        userMenu
                    )}
                </Box>
            </Toolbar>
        </Root>
    );
};

const PREFIX = 'RaHeader';
export const HeaderClasses = {
    root: `${PREFIX}-root`,
    toolbar: `${PREFIX}-toolbar`,
};

const Root = styled(AppBar, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})({
    [`& .${HeaderClasses.toolbar}`]: {
        flex: 1,
        justifyContent: 'space-between',
    },
});

const defaultMenu = <HorizontalMenu />;
const defaultUserMenu = <UserMenu />;

const sanitizeRestProps = ({ title, menu, userMenu, toolbar, ...props }: any) =>
    props;

const DefaultToolbar = () => {
    const locales = useLocales();
    return (
        <>
            {locales && locales.length > 1 && <LocalesMenuButton />}
            <LoadingIndicator />
        </>
    );
};

const defaultToolbar = <DefaultToolbar />;

export interface HeaderProps extends Omit<AppBarProps, 'title'> {
    menu?: React.ReactNode;
    title?: TitleComponent;
    toolbar?: React.ReactNode;
    userMenu?: React.ReactNode;
}
