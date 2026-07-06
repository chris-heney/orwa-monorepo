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
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { styled } from '@mui/material';
import { MenuRoot } from './MenuRoot';
import { MenuItemNode } from './MenuItemNode';
/**
 * The `<MultiLevelMenu>` component allows to have complex menus with collapsible
 * sub menus inside our application.
 * The app must be inside an AppLocationContext.
 *
 * @see AppLocationContext
 *
 * It accepts `<MultiLevelMenu.Item>` components as children, which may also have `<MultiLevelMenu.Item>` children.
 *
 * @example <caption>Simple Menu</caption>
 * import * as React from 'react';
 * import { Admin, Resource, Layout } from 'react-admin';
 * import { MultiLevelMenu } from '@react-admin/ra-navigation';
 *
 * import { Dashboard } from './Dashboard';
 * import { SongList } from './SongList';
 * import { ArtistList } from './ArtistList';
 *
 * const BasicMultiLevelMenu = () => (
 *     <MultiLevelMenu>
 *         <MultiLevelMenu.Item name="dashboard" to="/" exact label="Dashboard" />
 *         <MultiLevelMenu.Item name="songs" to="/songs" label="Songs" />
 *         <MultiLevelMenu.Item name="artists" label="Artists">
 *             <MultiLevelMenu.Item name="artists.rock" to={'/artists?filter={"type":"Rock"}'} label="Rock" />
 *             <MultiLevelMenu.Item name="artists.jazz" to={'/artists?filter={"type":"Jazz"}'} label="Jazz" />
 *         </MultiLevelMenu.Item>
 *     </MultiLevelMenu>
 * );
 *
 * const BasicLayout = props => (
 *     <AppLocationContext>
 *         <Layout {...props} menu={BasicMultiLevelMenu} />
 *     </AppLocationContext>
 * );
 *
 * export const App = () => (
 *     <Admin
 *         dataProvider={dataProvider}
 *         layout={BasicLayout}
 *         dashboard={Dashboard}
 *     >
 *         <Resource name="songs" list={SongList} />
 *         <Resource name="artists" list={ArtistList} />
 *     </Admin>
 * );
 */
export var MultiLevelMenu = function (props) { return (React.createElement(Root, __assign({ variant: "default" }, props))); };
var Root = styled(MenuRoot, {
    name: 'RaMultiLevelMenu',
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var theme = _a.theme;
    return ({
        // @ts-ignore
        width: theme.sidebar.width,
    });
});
MultiLevelMenu.Item = MenuItemNode;
