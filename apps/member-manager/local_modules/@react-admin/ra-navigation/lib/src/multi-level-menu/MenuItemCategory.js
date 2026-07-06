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
exports.MenuItemCategoryClasses = exports.MenuItemCategory = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var prop_types_1 = __importDefault(require("prop-types"));
var clsx_1 = __importDefault(require("clsx"));
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@mui/material");
var MultiLevelMenuContext_1 = require("./MultiLevelMenuContext");
var app_location_1 = require("../app-location");
var MenuItemCategoryPopper_1 = require("./MenuItemCategoryPopper");
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
var MenuItemCategory = function (props) {
    var _a;
    var children = props.children, className = props.className, label = props.label, icon = props.icon, name = props.name, onClick = props.onClick, to = props.to, end = props.end, sx = props.sx, rest = __rest(props, ["children", "className", "label", "icon", "name", "onClick", "to", "end", "sx"]);
    var rootRef = (0, react_1.useRef)();
    var subMenuRef = (0, react_1.useRef)();
    var translate = (0, react_admin_1.useTranslate)();
    var match = (0, app_location_1.useAppLocationMatcher)();
    var multiLevelMenuContext = (0, MultiLevelMenuContext_1.useMultiLevelMenu)();
    var sidebarIsOpen = (0, react_admin_1.useSidebarState)()[0];
    var isActive = !!match(name);
    var _b = (0, react_1.useState)(isActive || multiLevelMenuContext.isOpen(name)), isSubMenuOpen = _b[0], setIsSubMenuOpenState = _b[1];
    var setIsSubmenuOpen = (0, react_1.useCallback)(function (isOpen) {
        multiLevelMenuContext.setIsOpen(name, isOpen);
        setIsSubMenuOpenState(isOpen);
    }, [multiLevelMenuContext, name]);
    (0, react_1.useEffect)(function () {
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
    var hasSubItems = react_1.Children.count(children) > 0;
    var handleMenuTap = (0, react_1.useCallback)(function (event) {
        onClick && onClick(event);
        setIsSubmenuOpen(!isSubMenuOpen);
    }, [isSubMenuOpen, onClick, setIsSubmenuOpen]);
    (0, react_1.useEffect)(function () {
        multiLevelMenuContext.setHasCategories(true);
        if (subMenuRef.current) {
            autoFocusFirstSubMenuItem(subMenuRef.current);
        }
    }, [multiLevelMenuContext]);
    var handleCloseSubMenu = function () {
        setIsSubmenuOpen(false);
    };
    (0, react_1.useEffect)(function () {
        if (!isActive) {
            setIsSubmenuOpen(false);
        }
    }, [isActive, setIsSubmenuOpen]);
    var translatedLabel = (0, react_1.isValidElement)(label)
        ? label
        : translate(label.toString(), { _: label });
    if (to && hasSubItems && process.env.NODE_ENV !== 'production') {
        console.warn('A <MenuItemCategory> cannot have children and a `to` prop set');
    }
    return (React.createElement(Root, { sx: sx },
        React.createElement(material_1.ListItem, __assign({ className: (0, clsx_1.default)(exports.MenuItemCategoryClasses.container, className, (_a = {},
                _a[exports.MenuItemCategoryClasses.active] = isActive,
                _a)), ref: rootRef }, rest, { button: false, onClick: handleMenuTap }), to && !hasSubItems ? (React.createElement(react_router_dom_1.NavLink, { className: exports.MenuItemCategoryClasses.link, to: to, end: end },
            icon && (React.createElement(material_1.ListItemIcon, { className: exports.MenuItemCategoryClasses.icon }, (0, react_1.cloneElement)(icon, {
                titleAccess: translatedLabel,
            }))),
            sidebarIsOpen && (React.createElement(material_1.ListItemText, null, translatedLabel)))) : (React.createElement("div", { className: exports.MenuItemCategoryClasses.link },
            icon && (React.createElement(material_1.ListItemIcon, { className: exports.MenuItemCategoryClasses.icon }, (0, react_1.cloneElement)(icon, {
                titleAccess: translatedLabel,
            }))),
            sidebarIsOpen && (React.createElement(material_1.ListItemText, null, translatedLabel))))),
        hasSubItems && (React.createElement(MenuItemCategoryPopper_1.MenuItemCategoryPopper, { anchorEl: rootRef.current, open: isSubMenuOpen, onClose: handleCloseSubMenu, placement: "right-start", sx: { zIndex: 1300 }, transition: true }, children))));
};
exports.MenuItemCategory = MenuItemCategory;
function autoFocusFirstSubMenuItem(element) {
    setTimeout(function () {
        var focusables = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusables.length > 0) {
            focusables[0].focus();
        }
    }, 150);
}
exports.MenuItemCategory.propTypes = {
    className: prop_types_1.default.string,
    icon: prop_types_1.default.element,
    onClick: prop_types_1.default.func,
    label: prop_types_1.default.node,
    to: prop_types_1.default.oneOfType([prop_types_1.default.string, prop_types_1.default.object]),
};
var PREFIX = 'RaMenuItemCategory';
exports.MenuItemCategoryClasses = {
    container: "".concat(PREFIX, "-container"),
    link: "".concat(PREFIX, "-link"),
    active: "".concat(PREFIX, "-active"),
    icon: "".concat(PREFIX, "-icon"),
    gutters: "".concat(PREFIX, "-gutters"),
};
var Root = (0, material_1.styled)('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(exports.MenuItemCategoryClasses.container)] = {
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing(1),
            '&:hover': {
                backgroundColor: (0, material_1.alpha)(theme.palette.text.primary, theme.palette.action.hoverOpacity),
            },
        },
        _b["& .".concat(exports.MenuItemCategoryClasses.link)] = {
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
        _b["& .".concat(exports.MenuItemCategoryClasses.active)] = {
            backgroundColor: (0, material_1.alpha)(theme.palette.text.primary, theme.palette.action.selectedOpacity),
            '&:hover': {
                backgroundColor: (0, material_1.alpha)(theme.palette.text.primary, theme.palette.action.selectedOpacity),
            },
        },
        _b["& .".concat(exports.MenuItemCategoryClasses.icon)] = {
            color: 'inherit',
            minWidth: 0,
        },
        _b);
});
