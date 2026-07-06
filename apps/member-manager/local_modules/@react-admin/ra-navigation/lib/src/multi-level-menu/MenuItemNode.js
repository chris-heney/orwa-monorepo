"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemClasses = exports.MenuItemNode = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var prop_types_1 = __importDefault(require("prop-types"));
var clsx_1 = __importDefault(require("clsx"));
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@mui/material");
var ExpandLess_1 = __importDefault(require("@mui/icons-material/ExpandLess"));
var ExpandMore_1 = __importDefault(require("@mui/icons-material/ExpandMore"));
var app_location_1 = require("../app-location");
var MultiLevelMenuContext_1 = require("./MultiLevelMenuContext");
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
var MenuItemNode = function (props) {
    var _a;
    var children = props.children, className = props.className, end = props.end, icon = props.icon, label = props.label, name = props.name, onClick = props.onClick, to = props.to, _b = props.disableGutters, disableGutters = _b === void 0 ? true : _b, rest = __rest(props, ["children", "className", "end", "icon", "label", "name", "onClick", "to", "disableGutters"]);
    var rootRef = (0, react_1.useRef)();
    var translate = (0, react_admin_1.useTranslate)();
    var sidebarIsOpen = (0, react_admin_1.useSidebarState)()[0];
    var hasSubItems = react_1.Children.count(children) > 0;
    var match = (0, app_location_1.useAppLocationMatcher)();
    var multiLevelMenuContext = (0, MultiLevelMenuContext_1.useMultiLevelMenu)();
    var isActive = !!match(name);
    var _c = (0, react_1.useState)(isActive || multiLevelMenuContext.isOpen(name)), isOpen = _c[0], setIsOpenState = _c[1];
    var showSubMenuToggle = hasSubItems && (sidebarIsOpen || multiLevelMenuContext.hasCategories);
    (0, react_1.useEffect)(function () {
        if ((multiLevelMenuContext.isFirstLoad &&
            multiLevelMenuContext.initialOpen) ||
            multiLevelMenuContext.openItemList.includes(name)) {
            multiLevelMenuContext.open(name);
            setIsOpenState(true);
        }
    }, []); // eslint-disable-line
    (0, react_1.useEffect)(function () {
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
    var handleMenuTap = (0, react_1.useCallback)(function (e) {
        onClick && onClick(e);
    }, [onClick]);
    var handleToggleSubMenu = function () {
        setIsOpen(!isOpen);
    };
    var translatedLabel = (0, react_1.isValidElement)(label)
        ? label
        : translate(label.toString(), { _: label });
    return (React.createElement(Root, null,
        React.createElement(material_1.ListItem, __assign({ className: (0, clsx_1.default)(exports.MenuItemClasses.container, className), ref: rootRef }, rest, { button: false, disableGutters: disableGutters, onClick: handleMenuTap }),
            React.createElement(ListItemChildren, { end: end, handleToggleSubMenu: handleToggleSubMenu, hasSubItems: hasSubItems, isActive: isActive, to: to, rightSide: React.createElement(RightSide, { showSubMenuToggle: showSubMenuToggle, isOpen: isOpen, name: name, handleToggleSubMenu: handleToggleSubMenu }) },
                icon && (React.createElement(material_1.ListItemIcon, { className: exports.MenuItemClasses.menuIcon }, (0, react_1.cloneElement)(icon, {
                    titleAccess: translatedLabel,
                }))),
                (sidebarIsOpen || multiLevelMenuContext.hasCategories) && (React.createElement(material_1.ListItemText, null, translatedLabel)))),
        hasSubItems && (React.createElement(material_1.Collapse, { in: isOpen, 
            // @ts-ignore
            component: (0, react_1.forwardRef)(function NavListItem(props, ref) {
                return (React.createElement("li", __assign({ id: "".concat(name, "-submenu"), ref: ref }, props)));
            }), unmountOnExit: true },
            React.createElement(material_1.List, { className: (0, clsx_1.default)(exports.MenuItemClasses.nestedList, (_a = {},
                    _a[exports.MenuItemClasses.hiddenNestedList] = !showSubMenuToggle,
                    _a)), disablePadding: true }, children)))));
};
exports.MenuItemNode = MenuItemNode;
var RightSide = function (props) {
    var translate = (0, react_admin_1.useTranslate)();
    var showSubMenuToggle = props.showSubMenuToggle, isOpen = props.isOpen, name = props.name, handleToggleSubMenu = props.handleToggleSubMenu;
    if (!showSubMenuToggle) {
        return null;
    }
    var handleClick = function (event) {
        event.preventDefault();
        event.stopPropagation();
        handleToggleSubMenu(event);
    };
    return (React.createElement(material_1.ListItemSecondaryAction, { className: exports.MenuItemClasses.icon },
        React.createElement(material_1.IconButton, { className: exports.MenuItemClasses.button, onClick: handleClick, edge: "end", size: "small", "aria-expanded": isOpen, "aria-controls": "".concat(name, "-submenu"), "aria-label": translate(isOpen ? 'ra.action.close' : 'ra.action.expand') }, isOpen ? React.createElement(ExpandLess_1.default, null) : React.createElement(ExpandMore_1.default, null))));
};
var ListItemChildren = function (props) {
    var _a;
    var to = props.to, children = props.children, handleToggleSubMenu = props.handleToggleSubMenu, hasSubItems = props.hasSubItems, rightSide = props.rightSide, isActive = props.isActive, end = props.end;
    if (!to && !hasSubItems) {
        throw new Error('A menu item must have at least one property to or have children');
    }
    return (React.createElement(material_1.ListItemButton, { component: to ? react_router_dom_1.NavLink : 'div', onClick: handleToggleSubMenu, className: exports.MenuItemClasses.itemButton, to: to, end: end },
        React.createElement("span", { className: (0, clsx_1.default)(exports.MenuItemClasses.link, (_a = {},
                _a[exports.MenuItemClasses.active] = !!isActive,
                _a)) }, children),
        rightSide));
};
exports.MenuItemNode.propTypes = {
    className: prop_types_1.default.string,
    icon: prop_types_1.default.element,
    onClick: prop_types_1.default.func,
    label: prop_types_1.default.node,
    to: prop_types_1.default.oneOfType([prop_types_1.default.string, prop_types_1.default.object]),
};
ListItemChildren.propTypes = {
    children: prop_types_1.default.node,
    end: prop_types_1.default.bool,
    hasSubItems: prop_types_1.default.bool,
    handleToggleSubMenu: prop_types_1.default.func,
    isActive: prop_types_1.default.bool,
    rightSide: prop_types_1.default.node,
    to: prop_types_1.default.oneOfType([prop_types_1.default.string, prop_types_1.default.object]),
};
var PREFIX = 'RaMenuItem';
exports.MenuItemClasses = {
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
var Root = (0, material_1.styled)('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            color: theme.palette.text.secondary,
            paddingLeft: theme.spacing(2),
            '&:hover': {
                backgroundColor: (0, material_1.alpha)(theme.palette.text.primary, theme.palette.action.hoverOpacity),
            }
        },
        _b["& .".concat(exports.MenuItemClasses.container)] = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0',
        },
        _b["& .".concat(exports.MenuItemClasses.link)] = {
            color: 'inherit',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            display: 'flex',
        },
        _b["& .".concat(exports.MenuItemClasses.active)] = {
            color: theme.palette.text.primary,
        },
        _b["& .".concat(exports.MenuItemClasses.menuIcon)] = {
            alignItems: 'center',
            color: 'inherit',
            minWidth: theme.spacing(4),
        },
        _b["& .".concat(exports.MenuItemClasses.icon)] = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            right: theme.spacing(2),
            color: 'inherit',
        },
        _b["& .".concat(exports.MenuItemClasses.button)] = {
            color: 'inherit',
        },
        _b["& .".concat(exports.MenuItemClasses.nestedList)] = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            paddingLeft: theme.spacing(2),
        },
        _b["& .".concat(exports.MenuItemClasses.hiddenNestedList)] = {
            display: 'none',
        },
        _b["& .".concat(exports.MenuItemClasses.itemButton)] = {
            display: 'flex',
            padding: 0,
            width: '100%',
            '&:hover': {
                backgroundColor: 'transparent',
            },
        },
        _b);
});
