import * as React from 'react';
import { useMemo, useState } from 'react';
import { useAuthProvider, useLocales, useResourceDefinitions, useThemesContext, } from 'react-admin';
import { styled, Box } from '@mui/material';
import { useAppLocationState } from '../app-location';
import { SolarPrimarySidebar } from './SolarPrimarySidebar';
import { SolarSecondarySidebar } from './SolarSecondarySidebar';
import { SolarMenuItem } from './SolarMenuItem';
import { SolarMenuContextProvider, } from './SolarMenuContext';
import { SolarMenuList } from './SolarMenuList';
import { SolarMenuUserItem } from './SolarMenuUserItem';
import { SolarMenuToggleThemeItem } from './SolarMenuToggleThemeItem';
import { SolarMenuUserProfileItem } from './SolarMenuUserProfileItem';
import { SolarMenuLocalesItem } from './SolarMenuLocalesItem';
import { SolarMenuLoadingIndicatorItem } from './SolarMenuLoadingIndicatorItem';
import { SolarMenuResourceItem } from './SolarMenuResourceItem';
import { SolarMenuDashboardItem } from './SolarMenuDashboardItem';
import { useHasDashboard } from '../app-location/useHasDashboard';
import { useSolarLogoContext } from './SolarLogoContext';
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
export var SolarMenu = function (_a) {
    var _b = _a.bottomToolbar, bottomToolbar = _b === void 0 ? null : _b, children = _a.children, className = _a.className, hasDashboardProp = _a.hasDashboard, logoFromProps = _a.logo, _c = _a.dense, dense = _c === void 0 ? false : _c, sx = _a.sx, _d = _a.userMenu, userMenu = _d === void 0 ? null : _d;
    var definitions = useResourceDefinitions();
    var authProvider = useAuthProvider();
    var darkTheme = useThemesContext().darkTheme;
    var locales = useLocales();
    var hasDashboard = useHasDashboard({ hasDashboard: hasDashboardProp });
    var logo = useSolarLogoContext({ logo: logoFromProps });
    var _e = useState(null), secondaryContent = _e[0], setSecondaryContent = _e[1];
    var primaryContext = useMemo(function () { return ({
        renderSlot: 'primary',
        setSecondaryContent: setSecondaryContent,
    }); }, []);
    var secondaryContext = useMemo(function () { return ({
        renderSlot: 'secondary',
        setSecondaryContent: setSecondaryContent,
    }); }, []);
    var location = useAppLocationState()[0];
    if (!location.path)
        return null;
    var showUserMenu = authProvider != null || darkTheme || (locales && locales.length > 1);
    return (React.createElement(Root, { sx: sx, className: className },
        React.createElement(SolarPrimarySidebar, null,
            React.createElement(SolarMenuContextProvider, { value: primaryContext },
                React.createElement(SolarMenuList, { className: SolarMenuClasses.topToolbar, dense: dense }, children !== null && children !== void 0 ? children : (React.createElement(React.Fragment, null,
                    hasDashboard && (React.createElement(SolarMenuDashboardItem, { icon: logo })),
                    Object.keys(definitions).map(function (name) { return (React.createElement(SolarMenuResourceItem, { key: name, name: name })); })))),
                React.createElement(Box, { className: SolarMenuClasses.bottomToolbar }, bottomToolbar !== null && bottomToolbar !== void 0 ? bottomToolbar : (React.createElement(SolarMenuList, { dense: dense },
                    React.createElement(SolarMenuLoadingIndicatorItem, null), userMenu !== null && userMenu !== void 0 ? userMenu : (showUserMenu ? (React.createElement(SolarMenuUserItem, null)) : null)))))),
        React.createElement(SolarSecondarySidebar, null,
            React.createElement(SolarMenuContextProvider, { value: secondaryContext },
                React.createElement(React.Fragment, null, secondaryContent)))));
};
var PREFIX = 'RaSolarMenu';
export var SolarMenuClasses = {
    root: "".concat(PREFIX, "-root"),
    topToolbar: "".concat(PREFIX, "-topToolbar"),
    bottomToolbar: "".concat(PREFIX, "-bottomToolbar"),
};
var Root = styled('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function () {
    var _a;
    return (_a = {},
        _a["& .".concat(SolarMenuClasses.bottomToolbar)] = {
            marginTop: 'auto',
        },
        _a);
});
SolarMenu.Item = SolarMenuItem;
SolarMenu.DashboardItem = SolarMenuDashboardItem;
SolarMenu.ResourceItem = SolarMenuResourceItem;
SolarMenu.List = SolarMenuList;
SolarMenu.UserItem = SolarMenuUserItem;
SolarMenu.ToggleThemeItem = SolarMenuToggleThemeItem;
SolarMenu.UserProfileItem = SolarMenuUserProfileItem;
SolarMenu.LocalesItem = SolarMenuLocalesItem;
SolarMenu.LoadingIndicatorItem = SolarMenuLoadingIndicatorItem;
