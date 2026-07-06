import * as React from 'react';
import { MenuRootProps } from './MenuRoot';
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
export declare const MultiLevelMenu: {
    (props: MenuRootProps): React.JSX.Element;
    Item: {
        (props: import("./MenuItemNode").MenuItemNodeProps): React.JSX.Element;
        propTypes: {
            className: import("prop-types").Requireable<string>;
            icon: import("prop-types").Requireable<import("prop-types").ReactElementLike>;
            onClick: import("prop-types").Requireable<(...args: any[]) => any>;
            label: import("prop-types").Requireable<import("prop-types").ReactNodeLike>;
            to: import("prop-types").Requireable<NonNullable<string | object>>;
        };
    };
};
export type MultiLevelMenuProps = MenuRootProps;
//# sourceMappingURL=MultiLevelMenu.d.ts.map