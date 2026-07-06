/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { styled } from '@mui/material';

import { MenuRoot, MenuRootProps } from './MenuRoot';
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
export const MultiLevelMenu = (props: MenuRootProps) => (
    <Root variant="default" {...props} />
);

const Root = styled(MenuRoot, {
    name: 'RaMultiLevelMenu',
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    // @ts-ignore
    width: theme.sidebar.width,
}));

MultiLevelMenu.Item = MenuItemNode;

export type MultiLevelMenuProps = MenuRootProps;
