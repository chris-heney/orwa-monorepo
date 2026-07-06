import * as React from 'react';
import { MenuRootProps } from './MenuRoot';
/**
 * The <IconMenu> component renders a vertical menu bar with icons.
 *
 * Clicking on an item opens a sub menu.
 * The app must be inside an AppLocationContext.
 *
 * @see AppLocationContext
 *
 * It accepts <IconMenu.Item> components as children.
 *
 * @example <caption>Simple Menu</caption>
 * import * as React from 'react';
 * import { Admin, Resource, Layout } from 'react-admin';
 * import { IconMenu, MenuItemList, MenuItemNode } from '@react-admin/ra-navigation';
 *
 * const BasicIconMenu = () => (
 *     <IconMenu>
 *          <IconMenu.Item name="dashboard" to="/" exact label="Dashboard" icon={<DashboardIcon />} />
 *          <IconMenu.Item name="songs" to="/songs" label="Songs" icon={<MusicIcon />} />
 *          <IconMenu.Item name="artists" to="/artists?filter={}" label="Artists" icon={<PeopleIcon />}>
 *              <CardContent>
 *                  <Typography variant="h3" gutterBottom>Artist Categories</Typography>
 *                  <MenuItemList>
 *                      <MenuItemNode name="artists.rock" to={'/artists?filter={"type":"rock"}'} label="Rock" />
 *                      <MenuItemNode name="artists.jazz" to={'/artists?filter={"type":"jazz"}'} label="Jazz" />
 *                      <MenuItemNode name="artists.classical" to={'/artists?filter={"type":"classical"}'} label="Rock" />
 *                  </MenuItemList>
 *              </CardContent>
 *          </IconMenu.Item>
 *          <IconMenu.Item name="configuration" to="/" exact label="Configuration" icon={<SettingsIcon />} sx={{ marginTop: 'auto' }} />
 *     </IconMenu>
 * );
 *
 * const BasicLayout = props => (
 *     <AppLocationContext>
 *         <Layout {...props} menu={BasicIconMenu} />
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
export declare const IconMenu: {
    (props: IconMenuProps): React.JSX.Element;
    Item: {
        (props: import("./MenuItemCategory").MenuItemCategoryProps): React.JSX.Element;
        propTypes: {
            className: import("prop-types").Requireable<string>;
            icon: import("prop-types").Requireable<import("prop-types").ReactElementLike>;
            onClick: import("prop-types").Requireable<(...args: any[]) => any>;
            label: import("prop-types").Requireable<import("prop-types").ReactNodeLike>;
            to: import("prop-types").Requireable<NonNullable<string | object>>;
        };
    };
};
export type IconMenuProps = MenuRootProps;
//# sourceMappingURL=IconMenu.d.ts.map