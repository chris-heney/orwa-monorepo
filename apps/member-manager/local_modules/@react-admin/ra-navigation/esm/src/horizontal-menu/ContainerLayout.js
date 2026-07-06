import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import React, { useState, } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Error, SkipNavigationButton,
// FIXME: add this when the react-admin dependency is updated
//Inspector,
 } from 'react-admin';
import { AppLocationContext } from '../app-location';
import { ContainerLayoutContext } from './ContainerLayoutContext';
import { Header } from './Header';
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
export var ContainerLayout = function (props) {
    var _a = props.appBar, appBar = _a === void 0 ? defaultAppBar : _a, children = props.children, className = props.className, dashboard = props.dashboard, errorComponent = props.error, menu = props.menu, title = props.title, toolbar = props.toolbar, maxWidth = props.maxWidth, fixed = props.fixed, userMenu = props.userMenu, sx = props.sx;
    var _b = useState(null), errorInfo = _b[0], setErrorInfo = _b[1];
    var handleError = function (error, componentStack) {
        setErrorInfo(componentStack);
    };
    return (React.createElement(AppLocationContext, null,
        React.createElement(ContainerLayoutContext.Provider, { value: {
                hasDashboard: !!dashboard,
                title: title,
                menu: menu,
                toolbar: toolbar,
                userMenu: userMenu,
            } },
            React.createElement(StyledLayout, { className: clsx('layout', ContainerLayoutClasses.root, className), sx: sx },
                React.createElement(SkipNavigationButton, null),
                appBar,
                React.createElement(Container, { id: "main-content", className: ContainerLayoutClasses.content, maxWidth: maxWidth, fixed: fixed },
                    React.createElement(ErrorBoundary, { onError: handleError, fallbackRender: function (_a) {
                            var error = _a.error, resetErrorBoundary = _a.resetErrorBoundary;
                            return (React.createElement(Error, { error: error, errorComponent: errorComponent, errorInfo: errorInfo, resetErrorBoundary: resetErrorBoundary, title: title }));
                        } }, children))))));
};
var defaultAppBar = React.createElement(Header, null);
var PREFIX = 'RaContainerLayout';
export var ContainerLayoutClasses = {
    root: "".concat(PREFIX, "-root"),
    content: "".concat(PREFIX, "-content"),
};
var StyledLayout = styled('div', {
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
