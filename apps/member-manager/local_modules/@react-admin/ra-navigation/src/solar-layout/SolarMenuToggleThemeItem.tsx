import * as React from 'react';
import { ForwardedRef } from 'react';
import { useTheme, useThemesContext, useTranslate } from 'react-admin';
import {
    ListItem,
    ListItemButton,
    ListItemProps,
    styled,
    useMediaQuery,
} from '@mui/material';
import clsx from 'clsx';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { genericForwardRef } from './genericForwardRef';

/**
 * Button toggling the theme (light or dark).
 *
 * Enabled by default in the <AppBar> when the <Admin> component has a darkMode.
 *
 * @example
 * import { SolarMenu } from '@react-admin/navigation';
 *
 * const MyMenu = () => (
 *     <SolarMenu>
 *          <SolarMenu.ToggleThemeItem />
 *     </SolarMenu>
 * );
 */
const SolarMenuToggleThemeItemComponent = (
    { className, ...props }: Partial<SolarMenuToggleThemeItemProps>,
    ref: ForwardedRef<HTMLDivElement>
) => {
    const translate = useTranslate();
    const { darkTheme, defaultTheme } = useThemesContext();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
        noSsr: true,
    });
    const [theme, setTheme] = useTheme(
        defaultTheme || (prefersDarkMode && darkTheme ? 'dark' : 'light')
    );
    const handleClick = (): void => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    const toggleThemeTitle = translate('ra.action.toggle_theme', {
        _: 'Toggle Theme',
    });

    return (
        <Root
            component="div"
            disablePadding
            className={clsx(SolarMenuToggleThemeItemClasses.root, className)}
            secondaryAction={
                <div className={SolarMenuToggleThemeItemClasses.iconContainer}>
                    {theme === 'dark' ? (
                        <Brightness7Icon
                            className={SolarMenuToggleThemeItemClasses.icon}
                            sx={{ ml: 'auto' }}
                        />
                    ) : (
                        <Brightness4Icon
                            className={SolarMenuToggleThemeItemClasses.icon}
                            sx={{ ml: 'auto' }}
                        />
                    )}
                </div>
            }
            // @ts-ignore
            ref={ref}
            {...props}
        >
            <ListItemButton
                className={SolarMenuToggleThemeItemClasses.button}
                onClick={handleClick}
            >
                {toggleThemeTitle}
            </ListItemButton>
        </Root>
    );
};

export const SolarMenuToggleThemeItem = genericForwardRef(
    SolarMenuToggleThemeItemComponent
);

export type SolarMenuToggleThemeItemProps = Partial<ListItemProps<'div'>>;

const PREFIX = 'RaSolarMenuToggleThemeItem';

export const SolarMenuToggleThemeItemClasses = {
    root: `${PREFIX}-root`,
    icon: `${PREFIX}-icon`,
    iconContainer: `${PREFIX}-iconContainer`,
    button: `${PREFIX}-button`,
};

const Root = styled(ListItem)(({ theme }) => ({
    [`& .${SolarMenuToggleThemeItemClasses.iconContainer}`]: {
        padding: theme.spacing(1),
        marginRight: `-12px`,
    },
    [`& .${SolarMenuToggleThemeItemClasses.icon}`]: {
        color: theme.palette.text.secondary,
    },
    [`& .${SolarMenuToggleThemeItemClasses.button}`]: {},
}));
