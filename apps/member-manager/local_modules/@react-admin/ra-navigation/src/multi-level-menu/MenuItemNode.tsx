import * as React from 'react';
import {
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
    forwardRef,
} from 'react';
import { useSidebarState, useTranslate } from 'react-admin';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { NavLink, NavLinkProps, To } from 'react-router-dom';
import {
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemProps,
    ListItemSecondaryAction,
    ListItemText,
    styled,
    alpha,
    ListItemButton,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppLocationMatcher } from '../app-location';
import { useMultiLevelMenu } from './MultiLevelMenuContext';

/**
 * The <MenuItem> component is used to display a single item inside a <MultiLevelMenu> component.
 * @see Breadcrumb
 *
 * It accepts <MenuItems> children which will be displayed inside a collapsible container.
 *
 * @example <caption>Simple Menu</caption>
 * import * as React from 'react';
 * import { Admin, Resource, Layout } from 'react-admin';
 * import { MultiLevelMenu, MenuItemNode } from '@react-admin/ra-navigation';
 * import { Dashboard } from './Dashboard';
 * import { SongList } from './SongList';
 * import { ArtistList } from './ArtistList';
 *
 * const MyMenu = () => (
 *     <MultiLevelMenu>
 *         <MenuItemNode name="dashboard" to="/" exact label="Dashboard" />
 *         <MenuItemNode name="songs" to="/songs" label="Songs" />
 *         <MenuItemNode name="artists" to={'/artists?filter={}'} label="Artists">
 *             <MenuItemNode name="artists.rock" to={'/artists?filter={"type":"Rock"}'} label="Rock" />
 *             <MenuItemNode name="artists.jazz" label="Jazz">
 *                 <MenuItemNode name="artists.jazz.rb" to={'/artists?filter={"type":"RB"}'} label="R&B" />
 *             </MenuItemNode>
 *         </MenuItemNode>
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
export const MenuItemNode = (props: MenuItemNodeProps) => {
    const {
        children,
        className,
        end,
        icon,
        label,
        name,
        onClick,
        to,
        disableGutters = true,
        ...rest
    } = props;
    const rootRef = useRef();
    const translate = useTranslate();
    const [sidebarIsOpen] = useSidebarState();
    const hasSubItems = Children.count(children) > 0;

    const match = useAppLocationMatcher();
    const multiLevelMenuContext = useMultiLevelMenu();
    const isActive = !!match(name);
    const [isOpen, setIsOpenState] = useState(
        isActive || multiLevelMenuContext.isOpen(name)
    );
    const showSubMenuToggle =
        hasSubItems && (sidebarIsOpen || multiLevelMenuContext.hasCategories);

    useEffect(() => {
        if (
            (multiLevelMenuContext.isFirstLoad &&
                multiLevelMenuContext.initialOpen) ||
            multiLevelMenuContext.openItemList.includes(name)
        ) {
            multiLevelMenuContext.open(name);
            setIsOpenState(true);
        }
    }, []); // eslint-disable-line

    useEffect(() => {
        // Automatically open submenu if needed on location change
        if (isActive && !multiLevelMenuContext.isOpen(name)) {
            multiLevelMenuContext.open(name);
            setIsOpenState(true);
        }
    }, [isActive, multiLevelMenuContext, name]);

    const setIsOpen = (isOpen: boolean): void => {
        multiLevelMenuContext.setIsOpen(name, isOpen);
        setIsOpenState(isOpen);
    };

    const handleMenuTap = useCallback(
        e => {
            onClick && onClick(e);
        },
        [onClick]
    );

    const handleToggleSubMenu = (): void => {
        setIsOpen(!isOpen);
    };

    const translatedLabel = isValidElement(label)
        ? label
        : translate(label.toString(), { _: label });

    return (
        <Root>
            <ListItem
                className={clsx(MenuItemClasses.container, className)}
                ref={rootRef}
                {...rest}
                button={false}
                disableGutters={disableGutters}
                onClick={handleMenuTap}
            >
                <ListItemChildren
                    end={end}
                    handleToggleSubMenu={handleToggleSubMenu}
                    hasSubItems={hasSubItems}
                    isActive={isActive}
                    to={to}
                    rightSide={
                        <RightSide
                            showSubMenuToggle={showSubMenuToggle}
                            isOpen={isOpen}
                            name={name}
                            handleToggleSubMenu={handleToggleSubMenu}
                        />
                    }
                >
                    {icon && (
                        <ListItemIcon className={MenuItemClasses.menuIcon}>
                            {cloneElement(icon, {
                                titleAccess: translatedLabel,
                            })}
                        </ListItemIcon>
                    )}
                    {(sidebarIsOpen || multiLevelMenuContext.hasCategories) && (
                        <ListItemText>{translatedLabel}</ListItemText>
                    )}
                </ListItemChildren>
            </ListItem>
            {hasSubItems && (
                <Collapse
                    in={isOpen}
                    // @ts-ignore
                    component={forwardRef<HTMLLIElement>(function NavListItem(
                        props,
                        ref
                    ) {
                        return (
                            <li id={`${name}-submenu`} ref={ref} {...props} />
                        );
                    })}
                    unmountOnExit
                >
                    <List
                        className={clsx(MenuItemClasses.nestedList, {
                            [MenuItemClasses.hiddenNestedList]:
                                !showSubMenuToggle,
                        })}
                        disablePadding
                    >
                        {children}
                    </List>
                </Collapse>
            )}
        </Root>
    );
};

const RightSide = (props: any) => {
    const translate = useTranslate();
    const { showSubMenuToggle, isOpen, name, handleToggleSubMenu } = props;
    if (!showSubMenuToggle) {
        return null;
    }
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        handleToggleSubMenu(event);
    };

    return (
        <ListItemSecondaryAction className={MenuItemClasses.icon}>
            <IconButton
                className={MenuItemClasses.button}
                onClick={handleClick}
                edge="end"
                size="small"
                aria-expanded={isOpen}
                aria-controls={`${name}-submenu`}
                aria-label={translate(
                    isOpen ? 'ra.action.close' : 'ra.action.expand'
                )}
            >
                {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
        </ListItemSecondaryAction>
    );
};

const ListItemChildren = (props: ListItemChildrenProps) => {
    const {
        to,
        children,
        handleToggleSubMenu,
        hasSubItems,
        rightSide,
        isActive,
        end,
    } = props;

    if (!to && !hasSubItems) {
        throw new Error(
            'A menu item must have at least one property to or have children'
        );
    }

    return (
        <ListItemButton
            component={to ? NavLink : 'div'}
            onClick={handleToggleSubMenu}
            className={MenuItemClasses.itemButton}
            to={to}
            end={end}
        >
            <span
                className={clsx(MenuItemClasses.link, {
                    [MenuItemClasses.active]: !!isActive,
                })}
            >
                {children}
            </span>
            {rightSide}
        </ListItemButton>
    );
};

interface Props {
    children?: ReactNode;
    icon?: ReactElement;
    name: string;
    label?: ReactNode;
    to?: To;
}

export type MenuItemNodeProps = Props &
    Omit<NavLinkProps, 'children' | 'to'> &
    Omit<ListItemProps<'li', { button?: true }>, 'children'>; // HACK: https://github.com/mui-org/material-ui/issues/16245

MenuItemNode.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.element,
    onClick: PropTypes.func,
    label: PropTypes.node,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export type ListItemChildrenProps = {
    children?: ReactNode;
    end?: boolean;
    hasSubItems: boolean;
    handleToggleSubMenu?: (event: any) => void;
    isActive?: boolean;
    rightSide?: ReactNode;
    to?: To;
};

ListItemChildren.propTypes = {
    children: PropTypes.node,
    end: PropTypes.bool,
    hasSubItems: PropTypes.bool,
    handleToggleSubMenu: PropTypes.func,
    isActive: PropTypes.bool,
    rightSide: PropTypes.node,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

const PREFIX = 'RaMenuItem';
export const MenuItemClasses = {
    root: PREFIX,
    container: `${PREFIX}-container`,
    link: `${PREFIX}-link`,
    active: `${PREFIX}-active`,
    menuIcon: `${PREFIX}-menuIcon`,
    icon: `${PREFIX}-icon`,
    button: `${PREFIX}-button`,
    nestedList: `${PREFIX}-nestedList`,
    hiddenNestedList: `${PREFIX}-hiddenNestedList`,
    itemButton: `${PREFIX}-itemButton`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    color: theme.palette.text.secondary,
    paddingLeft: theme.spacing(2),
    '&:hover': {
        backgroundColor: alpha(
            theme.palette.text.primary,
            theme.palette.action.hoverOpacity
        ),
    },
    [`& .${MenuItemClasses.container}`]: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '0',
    },
    [`& .${MenuItemClasses.link}`]: {
        color: 'inherit',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        display: 'flex',
    },
    [`& .${MenuItemClasses.active}`]: {
        color: theme.palette.text.primary,
    },
    [`& .${MenuItemClasses.menuIcon}`]: {
        alignItems: 'center',
        color: 'inherit',
        minWidth: theme.spacing(4),
    },
    [`& .${MenuItemClasses.icon}`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        right: theme.spacing(2),
        color: 'inherit',
    },
    [`& .${MenuItemClasses.button}`]: {
        color: 'inherit',
    },
    [`& .${MenuItemClasses.nestedList}`]: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingLeft: theme.spacing(2),
    },
    [`& .${MenuItemClasses.hiddenNestedList}`]: {
        display: 'none',
    },
    [`& .${MenuItemClasses.itemButton}`]: {
        display: 'flex',
        padding: 0,
        width: '100%',
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
}));
