import { createContext, useContext } from 'react';
import defaults from 'lodash/defaults';
export var ContainerLayoutContext = createContext({});
export var useContainerLayout = function (props) {
    var context = useContext(ContainerLayoutContext);
    return defaults({}, props != null ? extractContainerLayoutProps(props) : {}, context);
};
var extractContainerLayoutProps = function (_a) {
    var hasDashboard = _a.hasDashboard, menu = _a.menu, title = _a.title, toolbar = _a.toolbar, userMenu = _a.userMenu;
    return ({
        hasDashboard: hasDashboard,
        menu: menu,
        title: title,
        toolbar: toolbar,
        userMenu: userMenu,
    });
};
