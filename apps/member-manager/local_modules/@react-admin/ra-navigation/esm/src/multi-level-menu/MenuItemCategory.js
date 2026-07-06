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
import { Children, cloneElement, isValidElement, useCallback, useEffect, useRef, useState, } from 'react';
import { useSidebarState, useTranslate } from 'react-admin';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText, styled, alpha, } from '@mui/material';
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
export var MenuItemCategory = function (props) {
    var _a;
    var children = props.children, className = props.className, label = props.label, icon = props.icon, name = props.name, onClick = props.onClick, to = props.to, end = props.end, sx = props.sx, rest = __rest(props, ["children", "className", "label", "icon", "name", "onClick", "to", "end", "sx"]);
    var rootRef = useRef();
    var subMenuRef = useRef();
    var translate = useTranslate();
    var match = useAppLocationMatcher();
    var multiLevelMenuContext = useMultiLevelMenu();
    var sidebarIsOpen = useSidebarState()[0];
    var isActive = !!match(name);
    var _b = useState(isActive || multiLevelMenuContext.isOpen(name)), isSubMenuOpen = _b[0], setIsSubMenuOpenState = _b[1];
    var setIsSubmenuOpen = useCallback(function (isOpen) {
        multiLevelMenuContext.setIsOpen(name, isOpen);
        setIsSubMenuOpenState(isOpen);
    }, [multiLevelMenuContext, name]);
    useEffect(function () {
        var callback = function (openingName) {
            // We don't close items that starts with the same name
            // It avoid closing item when a submenu is selected
            if (!openingName.startsWith(name)) {
                setIsSubmenuOpen(false);
            }
        };
        multiLevelMenuContext.onOpen(callback);
        return function () { return multiLevelMenuContext.offOpen(callback); };
    }, [multiLevelMenuContext, name, setIsSubmenuOpen]);
    var hasSubItems = Children.count(children) > 0;
    var handleMenuTap = useCallback(function (event) {
        onClick && onClick(event);
        setIsSubmenuOpen(!isSubMenuOpen);
    }, [isSubMenuOpen, onClick, setIsSubmenuOpen]);
    useEffect(function () {
        multiLevelMenuContext.setHasCategories(true);
        if (subMenuRef.current) {
            autoFocusFirstSubMenuItem(subMenuRef.current);
        }
    }, [multiLevelMenuContext]);
    var handleCloseSubMenu = function () {
        setIsSubmenuOpen(false);
    };
    useEffect(function () {
        if (!isActive) {
            setIsSubmenuOpen(false);
        }
    }, [isActive, setIsSubmenuOpen]);
    var translatedLabel = isValidElement(label)
        ? label
        : translate(label.toString(), { _: label });
    if (to && hasSubItems && process.env.NODE_ENV !== 'production') {
        console.warn('A <MenuItemCategory> cannot have children and a `to` prop set');
    }
    return (React.createElement(Root, { sx: sx },
        React.createElement(ListItem, __assign({ className: clsx(MenuItemCategoryClasses.container, className, (_a = {},
                _a[MenuItemCategoryClasses.active] = isActive,
                _a)), ref: rootRef }, rest, { button: false, onClick: handleMenuTap }), to && !hasSubItems ? (React.createElement(NavLink, { className: MenuItemCategoryClasses.link, to: to, end: end },
            icon && (React.createElement(ListItemIcon, { className: MenuItemCategoryClasses.icon }, cloneElement(icon, {
                titleAccess: translatedLabel,
            }))),
            sidebarIsOpen && (React.createElement(ListItemText, null, translatedLabel)))) : (React.createElement("div", { className: MenuItemCategoryClasses.link },
            icon && (React.createElement(ListItemIcon, { className: MenuItemCategoryClasses.icon }, cloneElement(icon, {
                titleAccess: translatedLabel,
            }))),
            sidebarIsOpen && (React.createElement(ListItemText, null, translatedLabel))))),
        hasSubItems && (React.createElement(MenuItemCategoryPopper, { anchorEl: rootRef.current, open: isSubMenuOpen, onClose: handleCloseSubMenu, placement: "right-start", sx: { zIndex: 1300 }, transition: true }, children))));
};
function autoFocusFirstSubMenuItem(element) {
    setTimeout(function () {
        var focusables = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusables.length > 0) {
            focusables[0].focus();
        }
    }, 150);
}
MenuItemCategory.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.element,
    onClick: PropTypes.func,
    label: PropTypes.node,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
var PREFIX = 'RaMenuItemCategory';
export var MenuItemCategoryClasses = {
    container: "".concat(PREFIX, "-container"),
    link: "".concat(PREFIX, "-link"),
    active: "".concat(PREFIX, "-active"),
    icon: "".concat(PREFIX, "-icon"),
    gutters: "".concat(PREFIX, "-gutters"),
};
var Root = styled('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(MenuItemCategoryClasses.container)] = {
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing(1),
            '&:hover': {
                backgroundColor: alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity),
            },
        },
        _b["& .".concat(MenuItemCategoryClasses.link)] = {
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
        _b["& .".concat(MenuItemCategoryClasses.active)] = {
            backgroundColor: alpha(theme.palette.text.primary, theme.palette.action.selectedOpacity),
            '&:hover': {
                backgroundColor: alpha(theme.palette.text.primary, theme.palette.action.selectedOpacity),
            },
        },
        _b["& .".concat(MenuItemCategoryClasses.icon)] = {
            color: 'inherit',
            minWidth: 0,
        },
        _b);
});
