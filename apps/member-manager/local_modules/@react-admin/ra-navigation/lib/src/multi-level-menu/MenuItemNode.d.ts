import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { NavLinkProps, To } from 'react-router-dom';
import { ListItemProps } from '@mui/material';
/**
 * The <MenuItem> component is used to display a single item inside a <MultiLevelMenu> component.
 * @see Breadcrumb
 *
 * It accepts <MenuItems> children which will be displayed inside a collapsible container.
 *
 * @example <caption>Simple Menu</caption>
 * import * as React from 'react';
 * import { Admin, Resource, Layout } from 'react-admin';
 * import { MultiLevelMenu, MenuItemNode } from '@react-admin/ra-navigation';
 * import { Dashboard } from './Dashboard';
 * import { SongList } from './SongList';
 * import { ArtistList } from './ArtistList';
 *
 * const MyMenu = () => (
 *     <MultiLevelMenu>
 *         <MenuItemNode name="dashboard" to="/" exact label="Dashboard" />
 *         <MenuItemNode name="songs" to="/songs" label="Songs" />
 *         <MenuItemNode name="artists" to={'/artists?filter={}'} label="Artists">
 *             <MenuItemNode name="artists.rock" to={'/artists?filter={"type":"Rock"}'} label="Rock" />
 *             <MenuItemNode name="artists.jazz" label="Jazz">
 *                 <MenuItemNode name="artists.jazz.rb" to={'/artists?filter={"type":"RB"}'} label="R&B" />
 *             </MenuItemNode>
 *         </MenuItemNode>
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
export declare const MenuItemNode: {
    (props: MenuItemNodeProps): React.JSX.Element;
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
export type MenuItemNodeProps = Props & Omit<NavLinkProps, 'children' | 'to'> & Omit<ListItemProps<'li', {
    button?: true;
}>, 'children'>;
export type ListItemChildrenProps = {
    children?: ReactNode;
    end?: boolean;
    hasSubItems: boolean;
    handleToggleSubMenu?: (event: any) => void;
    isActive?: boolean;
    rightSide?: ReactNode;
    to?: To;
};
export declare const MenuItemClasses: {
    root: string;
    container: string;
    link: string;
    active: string;
    menuIcon: string;
    icon: string;
    button: string;
    nestedList: string;
    hiddenNestedList: string;
    itemButton: string;
};
export {};
//# sourceMappingURL=MenuItemNode.d.ts.map