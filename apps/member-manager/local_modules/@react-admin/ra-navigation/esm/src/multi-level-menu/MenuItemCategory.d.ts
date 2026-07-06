import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { NavLinkProps, To } from 'react-router-dom';
import { ListItemProps } from '@mui/material';
/**
 * The <MenuItemCategory> component is used to display a single category item inside a <MultiLevelMenu> component.
 * @see MultiLevelMenu
 *
 * It accepts <MenuItems> children which will be displayed inside a collapsible container.
 *
 * @example <caption>Category Menu</caption>
 * import * as React from 'react';
 * import { Admin, Resource, Layout } from 'react-admin';
 * import { MultiLevelMenu, MenuItemList, MenuItemCategory, MenuItemNode } from '@react-admin/ra-navigation';
 * import { Dashboard } from './Dashboard';
 * import { SongList } from './SongList';
 * import { ArtistList } from './ArtistList';
 *
 * const MyMenu = () => (
 *     <MultiLevelMenu variant="categories">
 *         <MenuItemCategory name="dashboard" to="/" exact label="Dashboard" />
 *         <MenuItemCategory name="songs" to="/songs" label="Songs" />
 *         <MenuItemCategory name="artists" to={'/artists?filter={}'} label="Artists">
 *             <Typography variant="h3">By genre</Typography>
 *             <MenuItemList>
 *                 <MenuItemNode name="artists.rock" to={'/artists?filter={"type":"Rock"}'} label="Rock" />
 *                 <MenuItemNode name="artists.jazz" to={'/artists?filter={"type":"Jazz"}'} label="Jazz" />
 *             </MenuItemList>
 *         </MenuItem>
 *     </MultiLevelMenu>
 * );
 *
 * const MyLayout = props => (
 *     <AppLocationContext>
 *         <Layout {...props} menu={MyMenu} />
 *     </AppLocationContext>
 * );
 *
 * export const App = () => (
 *     <Admin
 *         dataProvider={dataProvider}
 *         layout={MyLayout}
 *         dashboard={Dashboard}
 *     >
 *         <Resource name="songs" list={SongList} />
 *         <Resource name="artists" list={ArtistList} />
 *     </Admin>
 * );
 */
export declare const MenuItemCategory: {
    (props: MenuItemCategoryProps): React.JSX.Element;
    propTypes: {
        className: PropTypes.Requireable<string>;
        icon: PropTypes.Requireable<PropTypes.ReactElementLike>;
        onClick: PropTypes.Requireable<(...args: any[]) => any>;
        label: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        to: PropTypes.Requireable<NonNullable<string | object>>;
    };
};
interface Props {
    children?: ReactNode;
    icon?: ReactElement;
    name: string;
    label?: ReactNode;
    to?: To;
}
export type MenuItemCategoryProps = Props & Omit<NavLinkProps, 'children' | 'to'> & ListItemProps<'li', {
    button?: true;
}>;
export declare const MenuItemCategoryClasses: {
    container: string;
    link: string;
    active: string;
    icon: string;
    gutters: string;
};
export {};
//# sourceMappingURL=MenuItemCategory.d.ts.map