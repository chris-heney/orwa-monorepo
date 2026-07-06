import * as React from 'react';
import { ReactElement, ReactNode, useMemo, useState } from 'react';
import {
    useAuthProvider,
    useLocales,
    useResourceDefinitions,
    useThemesContext,
} from 'react-admin';
import { styled, Box, SxProps } from '@mui/material';
import { useAppLocationState } from '../app-location';
import { SolarPrimarySidebar } from './SolarPrimarySidebar';
import { SolarSecondarySidebar } from './SolarSecondarySidebar';
import { SolarMenuItem, SolarMenuItemProps } from './SolarMenuItem';
import {
    SolarMenuContextProvider,
    SolarMenuContextValue,
} from './SolarMenuContext';
import { SolarMenuList } from './SolarMenuList';
import { SolarMenuUserItem } from './SolarMenuUserItem';
import { SolarMenuToggleThemeItem } from './SolarMenuToggleThemeItem';
import { SolarMenuUserProfileItem } from './SolarMenuUserProfileItem';
import { SolarMenuLocalesItem } from './SolarMenuLocalesItem';
import { SolarMenuLoadingIndicatorItem } from './SolarMenuLoadingIndicatorItem';
import { SolarMenuResourceItem } from './SolarMenuResourceItem';
import { SolarMenuDashboardItem } from './SolarMenuDashboardItem';
import { useHasDashboard } from '../app-location/useHasDashboard';
import { useSolarLogoContext } from './SolarLogoContext';

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
export const SolarMenu = ({
    bottomToolbar = null,
    children,
    className,
    hasDashboard: hasDashboardProp,
    logo: logoFromProps,
    dense = false,
    sx,
    userMenu = null,
}: SolarMenuProps) => {
    const definitions = useResourceDefinitions();
    const authProvider = useAuthProvider();
    const { darkTheme } = useThemesContext();
    const locales = useLocales();
    const hasDashboard = useHasDashboard({ hasDashboard: hasDashboardProp });
    const logo = useSolarLogoContext({ logo: logoFromProps });
    const [secondaryContent, setSecondaryContent] = useState<ReactNode>(null);

    const primaryContext = useMemo<SolarMenuContextValue>(
        () => ({
            renderSlot: 'primary',
            setSecondaryContent,
        }),
        []
    );

    const secondaryContext = useMemo<SolarMenuContextValue>(
        () => ({
            renderSlot: 'secondary',
            setSecondaryContent,
        }),
        []
    );

    const [location] = useAppLocationState();
    if (!location.path) return null;

    const showUserMenu =
        authProvider != null || darkTheme || (locales && locales.length > 1);

    return (
        <Root sx={sx} className={className}>
            <SolarPrimarySidebar>
                <SolarMenuContextProvider value={primaryContext}>
                    <SolarMenuList
                        className={SolarMenuClasses.topToolbar}
                        dense={dense}
                    >
                        {children ?? (
                            <>
                                {hasDashboard && (
                                    <SolarMenuDashboardItem icon={logo} />
                                )}
                                {Object.keys(definitions).map(name => (
                                    <SolarMenuResourceItem
                                        key={name}
                                        name={name}
                                    />
                                ))}
                            </>
                        )}
                    </SolarMenuList>
                    <Box className={SolarMenuClasses.bottomToolbar}>
                        {bottomToolbar ?? (
                            <SolarMenuList dense={dense}>
                                <SolarMenuLoadingIndicatorItem />
                                {userMenu ??
                                    (showUserMenu ? (
                                        <SolarMenuUserItem />
                                    ) : null)}
                            </SolarMenuList>
                        )}
                    </Box>
                </SolarMenuContextProvider>
            </SolarPrimarySidebar>
            <SolarSecondarySidebar>
                <SolarMenuContextProvider value={secondaryContext}>
                    <>{secondaryContent}</>
                </SolarMenuContextProvider>
            </SolarSecondarySidebar>
        </Root>
    );
};

export interface SolarMenuProps {
    children?:
        | ReactElement<SolarMenuItemProps>
        | Array<ReactElement<SolarMenuItemProps>>;
    className?: string;
    dense?: boolean;
    hasDashboard?: boolean;
    logo?: ReactNode;
    bottomToolbar?: ReactNode;
    sx?: SxProps;
    userMenu?: ReactNode;
}

const PREFIX = 'RaSolarMenu';

export const SolarMenuClasses = {
    root: `${PREFIX}-root`,
    topToolbar: `${PREFIX}-topToolbar`,
    bottomToolbar: `${PREFIX}-bottomToolbar`,
};
const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({
    [`& .${SolarMenuClasses.bottomToolbar}`]: {
        marginTop: 'auto',
    },
}));

SolarMenu.Item = SolarMenuItem;
SolarMenu.DashboardItem = SolarMenuDashboardItem;
SolarMenu.ResourceItem = SolarMenuResourceItem;
SolarMenu.List = SolarMenuList;
SolarMenu.UserItem = SolarMenuUserItem;
SolarMenu.ToggleThemeItem = SolarMenuToggleThemeItem;
SolarMenu.UserProfileItem = SolarMenuUserProfileItem;
SolarMenu.LocalesItem = SolarMenuLocalesItem;
SolarMenu.LoadingIndicatorItem = SolarMenuLoadingIndicatorItem;
