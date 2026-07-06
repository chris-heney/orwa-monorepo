var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
import { Children, cloneElement, isValidElement, useCallback, useEffect, useRef, useState, forwardRef, } from 'react';
import { useSidebarState, useTranslate } from 'react-admin';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { Collapse, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, styled, alpha, ListItemButton, } from '@mui/material';
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
export var MenuItemNode = function (props) {
    var _a;
    var children = props.children, className = props.className, end = props.end, icon = props.icon, label = props.label, name = props.name, onClick = props.onClick, to = props.to, _b = props.disableGutters, disableGutters = _b === void 0 ? true : _b, rest = __rest(props, ["children", "className", "end", "icon", "label", "name", "onClick", "to", "disableGutters"]);
    var rootRef = useRef();
    var translate = useTranslate();
    var sidebarIsOpen = useSidebarState()[0];
    var hasSubItems = Children.count(children) > 0;
    var match = useAppLocationMatcher();
    var multiLevelMenuContext = useMultiLevelMenu();
    var isActive = !!match(name);
    var _c = useState(isActive || multiLevelMenuContext.isOpen(name)), isOpen = _c[0], setIsOpenState = _c[1];
    var showSubMenuToggle = hasSubItems && (sidebarIsOpen || multiLevelMenuContext.hasCategories);
    useEffect(function () {
        if ((multiLevelMenuContext.isFirstLoad &&
            multiLevelMenuContext.initialOpen) ||
            multiLevelMenuContext.openItemList.includes(name)) {
            multiLevelMenuContext.open(name);
            setIsOpenState(true);
        }
    }, []); // eslint-disable-line
    useEffect(function () {
        // Automatically open submenu if needed on location change
        if (isActive && !multiLevelMenuContext.isOpen(name)) {
            multiLevelMenuContext.open(name);
            setIsOpenState(true);
        }
    }, [isActive, multiLevelMenuContext, name]);
    var setIsOpen = function (isOpen) {
        multiLevelMenuContext.setIsOpen(name, isOpen);
        setIsOpenState(isOpen);
    };
    var handleMenuTap = useCallback(function (e) {
        onClick && onClick(e);
    }, [onClick]);
    var handleToggleSubMenu = function () {
        setIsOpen(!isOpen);
    };
    var translatedLabel = isValidElement(label)
        ? label
        : translate(label.toString(), { _: label });
    return (React.createElement(Root, null,
        React.createElement(ListItem, __assign({ className: clsx(MenuItemClasses.container, className), ref: rootRef }, rest, { button: false, disableGutters: disableGutters, onClick: handleMenuTap }),
            React.createElement(ListItemChildren, { end: end, handleToggleSubMenu: handleToggleSubMenu, hasSubItems: hasSubItems, isActive: isActive, to: to, rightSide: React.createElement(RightSide, { showSubMenuToggle: showSubMenuToggle, isOpen: isOpen, name: name, handleToggleSubMenu: handleToggleSubMenu }) },
                icon && (React.createElement(ListItemIcon, { className: MenuItemClasses.menuIcon }, cloneElement(icon, {
                    titleAccess: translatedLabel,
                }))),
                (sidebarIsOpen || multiLevelMenuContext.hasCategories) && (React.createElement(ListItemText, null, translatedLabel)))),
        hasSubItems && (React.createElement(Collapse, { in: isOpen, 
            // @ts-ignore
            component: forwardRef(function NavListItem(props, ref) {
                return (React.createElement("li", __assign({ id: "".concat(name, "-submenu"), ref: ref }, props)));
            }), unmountOnExit: true },
            React.createElement(List, { className: clsx(MenuItemClasses.nestedList, (_a = {},
                    _a[MenuItemClasses.hiddenNestedList] = !showSubMenuToggle,
                    _a)), disablePadding: true }, children)))));
};
var RightSide = function (props) {
    var translate = useTranslate();
    var showSubMenuToggle = props.showSubMenuToggle, isOpen = props.isOpen, name = props.name, handleToggleSubMenu = props.handleToggleSubMenu;
    if (!showSubMenuToggle) {
        return null;
    }
    var handleClick = function (event) {
        event.preventDefault();
        event.stopPropagation();
        handleToggleSubMenu(event);
    };
    return (React.createElement(ListItemSecondaryAction, { className: MenuItemClasses.icon },
        React.createElement(IconButton, { className: MenuItemClasses.button, onClick: handleClick, edge: "end", size: "small", "aria-expanded": isOpen, "aria-controls": "".concat(name, "-submenu"), "aria-label": translate(isOpen ? 'ra.action.close' : 'ra.action.expand') }, isOpen ? React.createElement(ExpandLessIcon, null) : React.createElement(ExpandMoreIcon, null))));
};
var ListItemChildren = function (props) {
    var _a;
    var to = props.to, children = props.children, handleToggleSubMenu = props.handleToggleSubMenu, hasSubItems = props.hasSubItems, rightSide = props.rightSide, isActive = props.isActive, end = props.end;
    if (!to && !hasSubItems) {
        throw new Error('A menu item must have at least one property to or have children');
    }
    return (React.createElement(ListItemButton, { component: to ? NavLink : 'div', onClick: handleToggleSubMenu, className: MenuItemClasses.itemButton, to: to, end: end },
        React.createElement("span", { className: clsx(MenuItemClasses.link, (_a = {},
                _a[MenuItemClasses.active] = !!isActive,
                _a)) }, children),
        rightSide));
};
MenuItemNode.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.element,
    onClick: PropTypes.func,
    label: PropTypes.node,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
var PREFIX = 'RaMenuItem';
export var MenuItemClasses = {
    root: PREFIX,
    container: "".concat(PREFIX, "-container"),
    link: "".concat(PREFIX, "-link"),
    active: "".concat(PREFIX, "-active"),
    menuIcon: "".concat(PREFIX, "-menuIcon"),
    icon: "".concat(PREFIX, "-icon"),
    button: "".concat(PREFIX, "-button"),
    nestedList: "".concat(PREFIX, "-nestedList"),
    hiddenNestedList: "".concat(PREFIX, "-hiddenNestedList"),
    itemButton: "".concat(PREFIX, "-itemButton"),
};
var Root = styled('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            color: theme.palette.text.secondary,
            paddingLeft: theme.spacing(2),
            '&:hover': {
                backgroundColor: alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity),
            }
        },
        _b["& .".concat(MenuItemClasses.container)] = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0',
        },
        _b["& .".concat(MenuItemClasses.link)] = {
            color: 'inherit',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            display: 'flex',
        },
        _b["& .".concat(MenuItemClasses.active)] = {
            color: theme.palette.text.primary,
        },
        _b["& .".concat(MenuItemClasses.menuIcon)] = {
            alignItems: 'center',
            color: 'inherit',
            minWidth: theme.spacing(4),
        },
        _b["& .".concat(MenuItemClasses.icon)] = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            right: theme.spacing(2),
            color: 'inherit',
        },
        _b["& .".concat(MenuItemClasses.button)] = {
            color: 'inherit',
        },
        _b["& .".concat(MenuItemClasses.nestedList)] = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            paddingLeft: theme.spacing(2),
        },
        _b["& .".concat(MenuItemClasses.hiddenNestedList)] = {
            display: 'none',
        },
        _b["& .".concat(MenuItemClasses.itemButton)] = {
            display: 'flex',
            padding: 0,
            width: '100%',
            '&:hover': {
                backgroundColor: 'transparent',
            },
        },
        _b);
});
