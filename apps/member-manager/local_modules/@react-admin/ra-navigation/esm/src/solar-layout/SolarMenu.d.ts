import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import { SxProps } from '@mui/material';
import { SolarMenuItemProps } from './SolarMenuItem';
/**
 * A menu that displays as a vertical sidebar and can show more content in a secondary sidebar inside a drawer.
 * Used in the SolarLayout.
 * By defaults, it will render a list of menu items for the dashboard and all registered resources without any secondary content for the drawer.
 * You can customize it by passing children, leveraging the related components: SolarMenuList, SolarMenuItem and SolarMenuUserItem.
 * You can also override the primary sidebar and the secondary sidebar by passing them as props.
 *
 * @example <caption>Custom menu</caption>
 * import { Admin, Resource } from 'react-admin';
 * import { SolarLayout, SolarMenu, SolarMenuProps } from '@react-admin/ra-navigation';
 * import { ListSubheader } from '@mui/material';
 * import { Logo } from './Logo';
 *
 * const CustomMenu = () => (
 *     <SolarMenu>
 *         <SolarMenu.DashboardItem />
 *         <SolarMenu.ResourceItem name="songs" subMenu={
 *             <SolarMenu.List disablePadding>
 *                 <SolarMenu.Item
 *                     name="songs.all"
 *                     label="All Songs"
 *                     to={`/songs?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: {} })
 *                     )}`}
 *                 />
 *                 <ListSubheader sx={{ marginTop: 2 }}>Rock</ListSubheader>
 *                 <SolarMenu.Item
 *                     name="songs.rock"
 *                     label="Rock Songs"
 *                     to={`/songs?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Rock' } })
 *                     )}`}
 *                 />
 *                 <SolarMenu.Item
 *                     name="songs.folk"
 *                     label="Folk Rock Songs"
 *                     to={`/songs?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Folk Rock' } })
 *                     )}`}
 *                 />
 *                 <SolarMenu.Item
 *                     name="songs.rock"
 *                     label="Pop Rock Songs"
 *                     to={`/songs?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Pop Rock' } })
 *                     )}`}
 *                 />
 *                 <ListSubheader sx={{ marginTop: 2 }}>Jazz</ListSubheader>
 *                 <SolarMenu.Item
 *                     name="songs.jazz"
 *                     label="Jazz songs"
 *                     to={`/songs?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Jazz' } })
 *                     )}`}
 *                 />
 *                 <SolarMenu.Item
 *                     name="songs.rb"
 *                     label="RB Songs"
 *                     to={`/songs?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'RB' } })
 *                     )}`}
 *                 />
 *             </SolarMenu.List>
 *         } />
 *         <SolarMenu.ResourceItem name="artists" subMenu={
 *             <SolarMenu.List disablePadding>
 *                 <SolarMenu.Item
 *                     name="artists.all"
 *                     label="All Artists"
 *                     to={`/artists?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: {} })
 *                     )}`}
 *                 />
 *                 <ListSubheader sx={{ marginTop: 2 }}>Rock</ListSubheader>
 *                 <SolarMenu.Item
 *                     name="artists.folk"
 *                     label="Folk Rock Artists"
 *                     to={`/artists?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Folk Rock' } })
 *                     )}`}
 *                 />
 *                 <SolarMenu.Item
 *                     name="artists.rock"
 *                     label="Pop Rock Artists"
 *                     to={`/artists?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Pop Rock' } })
 *                     )}`}
 *                 />
 *                 <ListSubheader sx={{ marginTop: 2 }}>Jazz</ListSubheader>
 *                 <SolarMenu.Item
 *                     name="artists.jazz"
 *                     label="Jazz artists"
 *                     to={`/artists?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'Jazz' } })
 *                     )}`}
 *                 />
 *                 <SolarMenu.Item
 *                     name="artists.jazz"
 *                     label="RB Artists"
 *                     to={`/artists?filter=${encodeURIComponent(
 *                         JSON.stringify({ filter: { type: 'RB' } })
 *                     )}`}
 *                 />
 *             </SolarMenu.List>
 *         } />
 *     </SolarMenu>
 * );
 */
export declare const SolarMenu: {
    ({ bottomToolbar, children, className, hasDashboard: hasDashboardProp, logo: logoFromProps, dense, sx, userMenu, }: SolarMenuProps): React.JSX.Element;
    Item: ({ children, subMenu, className, icon, name, label, to, tooltipProps, ...rest }: SolarMenuItemProps, ref: React.ForwardedRef<HTMLLinkElement>) => React.JSX.Element;
    DashboardItem: ({ icon, ...props }: Partial<SolarMenuItemProps>, ref: React.ForwardedRef<HTMLDivElement>) => React.JSX.Element;
    ResourceItem: ({ name, ...rest }: import("./SolarMenuResourceItem").SolarMenuResourceItemProps, ref: React.ForwardedRef<HTMLDivElement>) => React.JSX.Element;
    List: ({ className, component, ...props }: import("./SolarMenuList").SolarMenuListProps, ref: React.ForwardedRef<any>) => React.JSX.Element;
    UserItem: ({ subMenu, className, ...props }: import("./SolarMenuUserItem").SolarMenuUserItemProps, ref: any) => React.JSX.Element;
    ToggleThemeItem: ({ className, ...props }: Partial<Partial<import("@mui/material").ListItemProps<"div">>>, ref: React.ForwardedRef<HTMLDivElement>) => React.JSX.Element;
    UserProfileItem: ({ redirectTo, className, ...props }: import("./SolarMenuUserProfileItem").SolarMenuUserProfileItemProps, ref: React.ForwardedRef<HTMLDivElement>) => React.JSX.Element;
    LocalesItem: ({ className, ...props }: Partial<import("@mui/material").ListItemProps>, ref: React.ForwardedRef<HTMLDivElement>) => React.JSX.Element;
    LoadingIndicatorItem: ({ className, ...props }: Partial<Omit<SolarMenuItemProps, "component">>, ref: React.ForwardedRef<HTMLDivElement>) => React.JSX.Element;
};
export interface SolarMenuProps {
    children?: ReactElement<SolarMenuItemProps> | Array<ReactElement<SolarMenuItemProps>>;
    className?: string;
    dense?: boolean;
    hasDashboard?: boolean;
    logo?: ReactNode;
    bottomToolbar?: ReactNode;
    sx?: SxProps;
    userMenu?: ReactNode;
}
export declare const SolarMenuClasses: {
    root: string;
    topToolbar: string;
    bottomToolbar: string;
};
//# sourceMappingURL=SolarMenu.d.ts.map