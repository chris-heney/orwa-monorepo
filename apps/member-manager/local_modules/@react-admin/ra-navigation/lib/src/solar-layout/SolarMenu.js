"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolarMenuClasses = exports.SolarMenu = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var app_location_1 = require("../app-location");
var SolarPrimarySidebar_1 = require("./SolarPrimarySidebar");
var SolarSecondarySidebar_1 = require("./SolarSecondarySidebar");
var SolarMenuItem_1 = require("./SolarMenuItem");
var SolarMenuContext_1 = require("./SolarMenuContext");
var SolarMenuList_1 = require("./SolarMenuList");
var SolarMenuUserItem_1 = require("./SolarMenuUserItem");
var SolarMenuToggleThemeItem_1 = require("./SolarMenuToggleThemeItem");
var SolarMenuUserProfileItem_1 = require("./SolarMenuUserProfileItem");
var SolarMenuLocalesItem_1 = require("./SolarMenuLocalesItem");
var SolarMenuLoadingIndicatorItem_1 = require("./SolarMenuLoadingIndicatorItem");
var SolarMenuResourceItem_1 = require("./SolarMenuResourceItem");
var SolarMenuDashboardItem_1 = require("./SolarMenuDashboardItem");
var useHasDashboard_1 = require("../app-location/useHasDashboard");
var SolarLogoContext_1 = require("./SolarLogoContext");
/**
 * A menu that displays as a vertical sidebar and can show more content in a secondary sidebar inside a drawer.
 * Used in the SolarLayout.
 * By defaults, it will render a list of menu items for the dashboard and all registered resources without any secondary content for the drawer.
 * You can customize it by passing children, leveraging the related components: SolarMenuList, SolarMenuItem and SolarMenuUserItem.
 * You can also override the primary sidebar and the secondary sidebar by passing them as props.
 *
 * @example <caption>Custom menu</caption>
 * import { Admin, Resource } from 'react-admin';
 * import { SolarLayout, SolarMenu, SolarMenuProps } from '@react-admin/ra-navigation';
 * import { ListSubheader } from '@mui/material';
 * import { Logo } from './Logo';
 *
 * const CustomMenu = () => (
 *     <SolarMenu>
 *         <SolarMenu.DashboardItem />
 *         <SolarMenu.ResourceItem name="songs" subMenu={
 *             <SolarMenu.List disablePadding>
 *                 <SolarMenu.Item
 *                     name="songs.all"
 *                     label="All Songs"
 *                     to={`/songs?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: {} })
 *                     )}`}
 *                 />
 *                 <ListSubheader sx={{ marginTop: 2 }}>Rock</ListSubheader>
 *                 <SolarMenu.Item
 *                     name="songs.rock"
 *                     label="Rock Songs"
 *                     to={`/songs?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Rock' } })
 *                     )}`}
 *                 />
 *                 <SolarMenu.Item
 *                     name="songs.folk"
 *                     label="Folk Rock Songs"
 *                     to={`/songs?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Folk Rock' } })
 *                     )}`}
 *                 />
 *                 <SolarMenu.Item
 *                     name="songs.rock"
 *                     label="Pop Rock Songs"
 *                     to={`/songs?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Pop Rock' } })
 *                     )}`}
 *                 />
 *                 <ListSubheader sx={{ marginTop: 2 }}>Jazz</ListSubheader>
 *                 <SolarMenu.Item
 *                     name="songs.jazz"
 *                     label="Jazz songs"
 *                     to={`/songs?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Jazz' } })
 *                     )}`}
 *                 />
 *                 <SolarMenu.Item
 *                     name="songs.rb"
 *                     label="RB Songs"
 *                     to={`/songs?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'RB' } })
 *                     )}`}
 *                 />
 *             </SolarMenu.List>
 *         } />
 *         <SolarMenu.ResourceItem name="artists" subMenu={
 *             <SolarMenu.List disablePadding>
 *                 <SolarMenu.Item
 *                     name="artists.all"
 *                     label="All Artists"
 *                     to={`/artists?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: {} })
 *                     )}`}
 *                 />
 *                 <ListSubheader sx={{ marginTop: 2 }}>Rock</ListSubheader>
 *                 <SolarMenu.Item
 *                     name="artists.folk"
 *                     label="Folk Rock Artists"
 *                     to={`/artists?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Folk Rock' } })
 *                     )}`}
 *                 />
 *                 <SolarMenu.Item
 *                     name="artists.rock"
 *                     label="Pop Rock Artists"
 *                     to={`/artists?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Pop Rock' } })
 *                     )}`}
 *                 />
 *                 <ListSubheader sx={{ marginTop: 2 }}>Jazz</ListSubheader>
 *                 <SolarMenu.Item
 *                     name="artists.jazz"
 *                     label="Jazz artists"
 *                     to={`/artists?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Jazz' } })
 *                     )}`}
 *                 />
 *                 <SolarMenu.Item
 *                     name="artists.jazz"
 *                     label="RB Artists"
 *                     to={`/artists?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'RB' } })
 *                     )}`}
 *                 />
 *             </SolarMenu.List>
 *         } />
 *     </SolarMenu>
 * );
 */
var SolarMenu = function (_a) {
    var _b = _a.bottomToolbar, bottomToolbar = _b === void 0 ? null : _b, children = _a.children, className = _a.className, hasDashboardProp = _a.hasDashboard, logoFromProps = _a.logo, _c = _a.dense, dense = _c === void 0 ? false : _c, sx = _a.sx, _d = _a.userMenu, userMenu = _d === void 0 ? null : _d;
    var definitions = (0, react_admin_1.useResourceDefinitions)();
    var authProvider = (0, react_admin_1.useAuthProvider)();
    var darkTheme = (0, react_admin_1.useThemesContext)().darkTheme;
    var locales = (0, react_admin_1.useLocales)();
    var hasDashboard = (0, useHasDashboard_1.useHasDashboard)({ hasDashboard: hasDashboardProp });
    var logo = (0, SolarLogoContext_1.useSolarLogoContext)({ logo: logoFromProps });
    var _e = (0, react_1.useState)(null), secondaryContent = _e[0], setSecondaryContent = _e[1];
    var primaryContext = (0, react_1.useMemo)(function () { return ({
        renderSlot: 'primary',
        setSecondaryContent: setSecondaryContent,
    }); }, []);
    var secondaryContext = (0, react_1.useMemo)(function () { return ({
        renderSlot: 'secondary',
        setSecondaryContent: setSecondaryContent,
    }); }, []);
    var location = (0, app_location_1.useAppLocationState)()[0];
    if (!location.path)
        return null;
    var showUserMenu = authProvider != null || darkTheme || (locales && locales.length > 1);
    return (React.createElement(Root, { sx: sx, className: className },
        React.createElement(SolarPrimarySidebar_1.SolarPrimarySidebar, null,
            React.createElement(SolarMenuContext_1.SolarMenuContextProvider, { value: primaryContext },
                React.createElement(SolarMenuList_1.SolarMenuList, { className: exports.SolarMenuClasses.topToolbar, dense: dense }, children !== null && children !== void 0 ? children : (React.createElement(React.Fragment, null,
                    hasDashboard && (React.createElement(SolarMenuDashboardItem_1.SolarMenuDashboardItem, { icon: logo })),
                    Object.keys(definitions).map(function (name) { return (React.createElement(SolarMenuResourceItem_1.SolarMenuResourceItem, { key: name, name: name })); })))),
                React.createElement(material_1.Box, { className: exports.SolarMenuClasses.bottomToolbar }, bottomToolbar !== null && bottomToolbar !== void 0 ? bottomToolbar : (React.createElement(SolarMenuList_1.SolarMenuList, { dense: dense },
                    React.createElement(SolarMenuLoadingIndicatorItem_1.SolarMenuLoadingIndicatorItem, null), userMenu !== null && userMenu !== void 0 ? userMenu : (showUserMenu ? (React.createElement(SolarMenuUserItem_1.SolarMenuUserItem, null)) : null)))))),
        React.createElement(SolarSecondarySidebar_1.SolarSecondarySidebar, null,
            React.createElement(SolarMenuContext_1.SolarMenuContextProvider, { value: secondaryContext },
                React.createElement(React.Fragment, null, secondaryContent)))));
};
exports.SolarMenu = SolarMenu;
var PREFIX = 'RaSolarMenu';
exports.SolarMenuClasses = {
    root: "".concat(PREFIX, "-root"),
    topToolbar: "".concat(PREFIX, "-topToolbar"),
    bottomToolbar: "".concat(PREFIX, "-bottomToolbar"),
};
var Root = (0, material_1.styled)('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function () {
    var _a;
    return (_a = {},
        _a["& .".concat(exports.SolarMenuClasses.bottomToolbar)] = {
            marginTop: 'auto',
        },
        _a);
});
exports.SolarMenu.Item = SolarMenuItem_1.SolarMenuItem;
exports.SolarMenu.DashboardItem = SolarMenuDashboardItem_1.SolarMenuDashboardItem;
exports.SolarMenu.ResourceItem = SolarMenuResourceItem_1.SolarMenuResourceItem;
exports.SolarMenu.List = SolarMenuList_1.SolarMenuList;
exports.SolarMenu.UserItem = SolarMenuUserItem_1.SolarMenuUserItem;
exports.SolarMenu.ToggleThemeItem = SolarMenuToggleThemeItem_1.SolarMenuToggleThemeItem;
exports.SolarMenu.UserProfileItem = SolarMenuUserProfileItem_1.SolarMenuUserProfileItem;
exports.SolarMenu.LocalesItem = SolarMenuLocalesItem_1.SolarMenuLocalesItem;
exports.SolarMenu.LoadingIndicatorItem = SolarMenuLoadingIndicatorItem_1.SolarMenuLoadingIndicatorItem;
