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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerLayoutClasses = exports.ContainerLayout = void 0;
var material_1 = require("@mui/material");
var styles_1 = require("@mui/material/styles");
var clsx_1 = __importDefault(require("clsx"));
var react_1 = __importStar(require("react"));
var react_error_boundary_1 = require("react-error-boundary");
var react_admin_1 = require("react-admin");
var app_location_1 = require("../app-location");
var ContainerLayoutContext_1 = require("./ContainerLayoutContext");
var Header_1 = require("./Header");
/**
 * Layout component with no sidebar and a horizontal menu.
 *
 * @example
 * import { Admin, Resource } from 'react-admin';
 * import { ContainerLayout } from '@react-admin/ra-navigation';
 *
 * export const App = () => (
 *     <Admin dataProvider={dataProvider} layout={ContainerLayout}>
 *         <Resource name="songs" list={SongList} />
 *         <Resource name="artists" list={ArtistList} />
 *     </Admin>
 * );
 */
var ContainerLayout = function (props) {
    var _a = props.appBar, appBar = _a === void 0 ? defaultAppBar : _a, children = props.children, className = props.className, dashboard = props.dashboard, errorComponent = props.error, menu = props.menu, title = props.title, toolbar = props.toolbar, maxWidth = props.maxWidth, fixed = props.fixed, userMenu = props.userMenu, sx = props.sx;
    var _b = (0, react_1.useState)(null), errorInfo = _b[0], setErrorInfo = _b[1];
    var handleError = function (error, componentStack) {
        setErrorInfo(componentStack);
    };
    return (react_1.default.createElement(app_location_1.AppLocationContext, null,
        react_1.default.createElement(ContainerLayoutContext_1.ContainerLayoutContext.Provider, { value: {
                hasDashboard: !!dashboard,
                title: title,
                menu: menu,
                toolbar: toolbar,
                userMenu: userMenu,
            } },
            react_1.default.createElement(StyledLayout, { className: (0, clsx_1.default)('layout', exports.ContainerLayoutClasses.root, className), sx: sx },
                react_1.default.createElement(react_admin_1.SkipNavigationButton, null),
                appBar,
                react_1.default.createElement(material_1.Container, { id: "main-content", className: exports.ContainerLayoutClasses.content, maxWidth: maxWidth, fixed: fixed },
                    react_1.default.createElement(react_error_boundary_1.ErrorBoundary, { onError: handleError, fallbackRender: function (_a) {
                            var error = _a.error, resetErrorBoundary = _a.resetErrorBoundary;
                            return (react_1.default.createElement(react_admin_1.Error, { error: error, errorComponent: errorComponent, errorInfo: errorInfo, resetErrorBoundary: resetErrorBoundary, title: title }));
                        } }, children))))));
};
exports.ContainerLayout = ContainerLayout;
var defaultAppBar = react_1.default.createElement(Header_1.Header, null);
var PREFIX = 'RaContainerLayout';
exports.ContainerLayoutClasses = {
    root: "".concat(PREFIX, "-root"),
    content: "".concat(PREFIX, "-content"),
};
var StyledLayout = (0, styles_1.styled)('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var theme = _a.theme;
    return ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.getContrastText(theme.palette.background.default),
        minHeight: "100vh",
    });
});
