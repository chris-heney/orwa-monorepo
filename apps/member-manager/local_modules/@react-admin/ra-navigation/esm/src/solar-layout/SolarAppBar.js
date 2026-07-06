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
import { HideOnScroll, TitlePortal, LoadingIndicator } from 'react-admin';
import { Stack, AppBar as MuiAppBar, styled, Toolbar, useMediaQuery, } from '@mui/material';
import { usePrimarySidebarState } from './usePrimarySidebarState';
import { SolarSidebarToggleButton } from './SolarSidebarToggleButton';
/**
 * An AppBar alternative that is only shown on small devices unless users have scrolled down.
 * Used in the SolarLayout.
 * It only displays the app title if provided and the button allowing to open the sidebar.
 * You can customize it by passing children.
 *
 * @param props {SolarAppBarProps}
 * @param props.alwaysOn {boolean} Optional. This prop is injected by Layout. You should not use it directly unless you are using a custom layout. If you are using the default layout, use `<Layout appBarAlwaysOn>` instead. On small devices, this prop make the AppBar always visible. Disabled by default.
 * @param props.children {ReactNode} Optional. The content to render inside the AppBar. If you passed a title on your <Admin>, it will render it by default.
 * @param props.className {string} Optional. A class name to apply to the AppBar container.
 * @param props.color {string} Optional. The color of the AppBar. Can be primary, secondary, or inherit. Defaults to secondary.
 * @param props.container {ElementType} Optional. The component used for the root node. Defaults to HideOnScroll.
 * @param props.title {string} Optional. The title to render inside the AppBar. If you passed a title on your <Admin>, it will be passed automatically and rendered by default.
 * @param props.toolbar {JSX.Element} Optional. The toolbar to render inside the AppBar. Defaults to null.
 *
 * @example <caption>Custom content</caption>
 * import { Admin, AppBarProps, Resource } from 'react-admin';
 * import { SolarAppBar, SolarLayout, SolarLayoutProps } from '@react-admin/ra-navigation';
 *
 * const CustomAppBar = () => (
 *    <SolarAppBar>
 *       <Typography variant="h6">MyApp</Typography>
 *   </SolarAppBar>
 * );
 *
 * export const CustomLayout = (props: SolarLayoutProps) => (
 *    <SolarLayout {...props} appBar={CustomAppBar} />
 * );
 *
 * export const App = () => (
 *     <Admin dataProvider={dataProvider} layout={CustomLayout}>
 *         <Resource name="songs" list={SongList} />
 *         <Resource name="artists" list={ArtistList} />
 *     </Admin>
 * );
 */
export var SolarAppBar = function (_a) {
    var alwaysOn = _a.alwaysOn, className = _a.className, _b = _a.color, color = _b === void 0 ? 'secondary' : _b, _c = _a.container, Container = _c === void 0 ? alwaysOn ? 'div' : HideOnScroll : _c, children = _a.children, rest = __rest(_a, ["alwaysOn", "className", "color", "container", "children"]);
    var isSidebarOpen = usePrimarySidebarState()[0];
    var isXSmall = useMediaQuery(function (theme) {
        return theme.breakpoints.down('sm');
    });
    return (React.createElement(Container, { className: className },
        React.createElement(StyledAppBar, __assign({ className: AppBarClasses.appBar, color: color, isSidebarOpen: isSidebarOpen }, rest),
            React.createElement(Toolbar, { disableGutters: true, variant: isXSmall ? 'regular' : 'dense', className: AppBarClasses.toolbar },
                React.createElement(SolarSidebarToggleButton, { className: AppBarClasses.menuButton }),
                React.createElement(TitlePortal, null),
                React.createElement(Stack, { direction: "row", marginLeft: "auto", alignItems: "center" }, children || React.createElement(LoadingIndicator, null))))));
};
/** Only exists to declare the isSidebarOpen prop which is only used in the styled component below */
var AppBar = React.forwardRef(function (_a, ref) {
    var isSidebarOpen = _a.isSidebarOpen, props = __rest(_a, ["isSidebarOpen"]);
    return React.createElement(MuiAppBar, __assign({ ref: ref }, props));
});
AppBar.displayName = 'AppBar';
var PREFIX = 'RaSolarAppBar';
export var AppBarClasses = {
    appBar: "".concat(PREFIX, "-appBar"),
    toolbar: "".concat(PREFIX, "-toolbar"),
    rightToolbar: "".concat(PREFIX, "-rightToolbar"),
    menuButton: "".concat(PREFIX, "-menuButton"),
};
var StyledAppBar = styled(AppBar, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
    shouldForwardProp: function (propName) {
        return propName !== 'isSidebarOpen';
    },
})(function (_a) {
    var _b, _c;
    var theme = _a.theme, isSidebarOpen = _a.isSidebarOpen;
    return (_b = {
            display: isSidebarOpen ? 'none' : 'block'
        },
        _b[theme.breakpoints.up('md')] = {
            display: 'none',
        },
        _b["& .".concat(AppBarClasses.toolbar)] = (_c = {
                padding: "0 ".concat(theme.spacing(1))
            },
            _c[theme.breakpoints.down('md')] = {
                minHeight: theme.spacing(6),
            },
            _c),
        _b["& .".concat(AppBarClasses.menuButton)] = {
            marginRight: '0.2em',
        },
        _b);
});
