import * as React from 'react';
import {
    Children,
    cloneElement,
    isValidElement,
    MouseEvent,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useSidebarState, useTranslate } from 'react-admin';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { NavLink, NavLinkProps, To } from 'react-router-dom';
import {
    ListItem,
    ListItemIcon,
    ListItemProps,
    ListItemText,
    styled,
    alpha,
} from '@mui/material';

import { useMultiLevelMenu } from './MultiLevelMenuContext';
import { useAppLocationMatcher } from '../app-location';
import { MenuItemCategoryPopper } from './MenuItemCategoryPopper';

/**
 * The <MenuItemCategory> component is used to display a single category item inside a <MultiLevelMenu> component.
 * @see MultiLevelMenu
 *
 * It accepts <MenuItems> children which will be displayed inside a collapsible container.
 *
 * @example <caption>Category Menu</caption>
 * import * as React from 'react';
 * import { Admin, Resource, Layout } from 'react-admin';
 * import { MultiLevelMenu, MenuItemList, MenuItemCategory, MenuItemNode } from '@react-admin/ra-navigation';
 * import { Dashboard } from './Dashboard';
 * import { SongList } from './SongList';
 * import { ArtistList } from './ArtistList';
 *
 * const MyMenu = () => (
 *     <MultiLevelMenu variant="categories">
 *         <MenuItemCategory name="dashboard" to="/" exact label="Dashboard" />
 *         <MenuItemCategory name="songs" to="/songs" label="Songs" />
 *         <MenuItemCategory name="artists" to={'/artists?filter={}'} label="Artists">
 *             <Typography variant="h3">By genre</Typography>
 *             <MenuItemList>
 *                 <MenuItemNode name="artists.rock" to={'/artists?filter={"type":"Rock"}'} label="Rock" />
 *                 <MenuItemNode name="artists.jazz" to={'/artists?filter={"type":"Jazz"}'} label="Jazz" />
 *             </MenuItemList>
 *         </MenuItem>
 *     </MultiLevelMenu>
 * );
 *
 * const MyLayout = props => (
 *     <AppLocationContext>
 *         <Layout {...props} menu={MyMenu} />
 *     </AppLocationContext>
 * );
 *
 * export const App = () => (
 *     <Admin
 *         dataProvider={dataProvider}
 *         layout={MyLayout}
 *         dashboard={Dashboard}
 *     >
 *         <Resource name="songs" list={SongList} />
 *         <Resource name="artists" list={ArtistList} />
 *     </Admin>
 * );
 */
export const MenuItemCategory = (props: MenuItemCategoryProps) => {
    const {
        children,
        className,
        label,
        icon,
        name,
        onClick,
        to,
        end,
        sx,
        ...rest
    } = props;
    const rootRef = useRef<HTMLLIElement>();
    const subMenuRef = useRef();
    const translate = useTranslate();
    const match = useAppLocationMatcher();
    const multiLevelMenuContext = useMultiLevelMenu();
    const [sidebarIsOpen] = useSidebarState();

    const isActive = !!match(name);
    const [isSubMenuOpen, setIsSubMenuOpenState] = useState(
        isActive || multiLevelMenuContext.isOpen(name)
    );

    const setIsSubmenuOpen = useCallback(
        (isOpen: boolean): void => {
            multiLevelMenuContext.setIsOpen(name, isOpen);
            setIsSubMenuOpenState(isOpen);
        },
        [multiLevelMenuContext, name]
    );

    useEffect(() => {
        const callback = (openingName: string): void => {
            // We don't close items that starts with the same name
            // It avoid closing item when a submenu is selected
            if (!openingName.startsWith(name)) {
                setIsSubmenuOpen(false);
            }
        };

        multiLevelMenuContext.onOpen(callback);
        return (): void => multiLevelMenuContext.offOpen(callback);
    }, [multiLevelMenuContext, name, setIsSubmenuOpen]);

    const hasSubItems = Children.count(children) > 0;

    const handleMenuTap = useCallback(
        (event: MouseEvent<HTMLLIElement>) => {
            onClick && onClick(event);
            setIsSubmenuOpen(!isSubMenuOpen);
        },
        [isSubMenuOpen, onClick, setIsSubmenuOpen]
    );

    useEffect(() => {
        multiLevelMenuContext.setHasCategories(true);
        if (subMenuRef.current) {
            autoFocusFirstSubMenuItem(subMenuRef.current);
        }
    }, [multiLevelMenuContext]);

    const handleCloseSubMenu = (): void => {
        setIsSubmenuOpen(false);
    };

    useEffect(() => {
        if (!isActive) {
            setIsSubmenuOpen(false);
        }
    }, [isActive, setIsSubmenuOpen]);

    const translatedLabel = isValidElement(label)
        ? label
        : translate(label.toString(), { _: label });

    if (to && hasSubItems && process.env.NODE_ENV !== 'production') {
        console.warn(
            'A <MenuItemCategory> cannot have children and a `to` prop set'
        );
    }

    return (
        <Root sx={sx}>
            <ListItem
                className={clsx(MenuItemCategoryClasses.container, className, {
                    [MenuItemCategoryClasses.active]: isActive,
                })}
                ref={rootRef}
                {...rest}
                button={false}
                onClick={handleMenuTap}
            >
                {to && !hasSubItems ? (
                    <NavLink
                        className={MenuItemCategoryClasses.link}
                        to={to}
                        end={end}
                    >
                        {icon && (
                            <ListItemIcon
                                className={MenuItemCategoryClasses.icon}
                            >
                                {cloneElement(icon, {
                                    titleAccess: translatedLabel,
                                })}
                            </ListItemIcon>
                        )}
                        {sidebarIsOpen && (
                            <ListItemText>{translatedLabel}</ListItemText>
                        )}
                    </NavLink>
                ) : (
                    <div className={MenuItemCategoryClasses.link}>
                        {icon && (
                            <ListItemIcon
                                className={MenuItemCategoryClasses.icon}
                            >
                                {cloneElement(icon, {
                                    titleAccess: translatedLabel,
                                })}
                            </ListItemIcon>
                        )}
                        {sidebarIsOpen && (
                            <ListItemText>{translatedLabel}</ListItemText>
                        )}
                    </div>
                )}
            </ListItem>
            {hasSubItems && (
                <MenuItemCategoryPopper
                    anchorEl={rootRef.current}
                    open={isSubMenuOpen}
                    onClose={handleCloseSubMenu}
                    placement="right-start"
                    sx={{ zIndex: 1300 }}
                    transition
                >
                    {children}
                </MenuItemCategoryPopper>
            )}
        </Root>
    );
};

function autoFocusFirstSubMenuItem(element: HTMLElement): void {
    setTimeout(() => {
        const focusables = element.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusables.length > 0) {
            focusables[0].focus();
        }
    }, 150);
}

interface Props {
    children?: ReactNode;
    icon?: ReactElement;
    name: string;
    label?: ReactNode;
    to?: To;
}

export type MenuItemCategoryProps = Props &
    Omit<NavLinkProps, 'children' | 'to'> &
    ListItemProps<'li', { button?: true }>; // HACK: https://github.com/mui-org/material-ui/issues/16245

MenuItemCategory.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.element,
    onClick: PropTypes.func,
    label: PropTypes.node,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

const PREFIX = 'RaMenuItemCategory';
export const MenuItemCategoryClasses = {
    container: `${PREFIX}-container`,
    link: `${PREFIX}-link`,
    active: `${PREFIX}-active`,
    icon: `${PREFIX}-icon`,
    gutters: `${PREFIX}-gutters`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${MenuItemCategoryClasses.container}`]: {
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1),

        '&:hover': {
            backgroundColor: alpha(
                theme.palette.text.primary,
                theme.palette.action.hoverOpacity
            ),
        },
    },
    [`& .${MenuItemCategoryClasses.link}`]: {
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '& span': {
            fontSize: theme.typography.caption.fontSize,
        },
    },
    [`& .${MenuItemCategoryClasses.active}`]: {
        backgroundColor: alpha(
            theme.palette.text.primary,
            theme.palette.action.selectedOpacity
        ),
        '&:hover': {
            backgroundColor: alpha(
                theme.palette.text.primary,
                theme.palette.action.selectedOpacity
            ),
        },
    },
    [`& .${MenuItemCategoryClasses.icon}`]: {
        color: 'inherit',
        minWidth: 0,
    },
}));
