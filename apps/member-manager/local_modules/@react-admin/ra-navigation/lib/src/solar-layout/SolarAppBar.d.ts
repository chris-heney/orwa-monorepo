import * as React from 'react';
import { ElementType } from 'react';
import { AppBarProps as MuiAppBarProps } from '@mui/material';
/**
 * An AppBar alternative that is only shown on small devices unless users have scrolled down.
 * Used in the SolarLayout.
 * It only displays the app title if provided and the button allowing to open the sidebar.
 * You can customize it by passing children.
 *
 * @param props {SolarAppBarProps}
 * @param props.alwaysOn {boolean} Optional. This prop is injected by Layout. You should not use it directly unless you are using a custom layout. If you are using the default layout, use `<Layout appBarAlwaysOn>` instead. On small devices, this prop make the AppBar always visible. Disabled by default.
 * @param props.children {ReactNode} Optional. The content to render inside the AppBar. If you passed a title on your <Admin>, it will render it by default.
 * @param props.className {string} Optional. A class name to apply to the AppBar container.
 * @param props.color {string} Optional. The color of the AppBar. Can be primary, secondary, or inherit. Defaults to secondary.
 * @param props.container {ElementType} Optional. The component used for the root node. Defaults to HideOnScroll.
 * @param props.title {string} Optional. The title to render inside the AppBar. If you passed a title on your <Admin>, it will be passed automatically and rendered by default.
 * @param props.toolbar {JSX.Element} Optional. The toolbar to render inside the AppBar. Defaults to null.
 *
 * @example <caption>Custom content</caption>
 * import { Admin, AppBarProps, Resource } from 'react-admin';
 * import { SolarAppBar, SolarLayout, SolarLayoutProps } from '@react-admin/ra-navigation';
 *
 * const CustomAppBar = () => (
 *    <SolarAppBar>
 *       <Typography variant="h6">MyApp</Typography>
 *   </SolarAppBar>
 * );
 *
 * export const CustomLayout = (props: SolarLayoutProps) => (
 *    <SolarLayout {...props} appBar={CustomAppBar} />
 * );
 *
 * export const App = () => (
 *     <Admin dataProvider={dataProvider} layout={CustomLayout}>
 *         <Resource name="songs" list={SongList} />
 *         <Resource name="artists" list={ArtistList} />
 *     </Admin>
 * );
 */
export declare const SolarAppBar: ({ alwaysOn, className, color, container: Container, children, ...rest }: SolarAppBarProps) => React.JSX.Element;
export interface SolarAppBarProps extends Omit<MuiAppBarProps, 'title'> {
    /**
     * This prop is injected by Layout. You should not use it directly unless
     * you are using a custom layout.
     * If you are using the default layout, use `<Layout appBarAlwaysOn>` instead.
     */
    alwaysOn?: boolean;
    container?: ElementType<any>;
    toolbar?: JSX.Element;
}
export declare const AppBarClasses: {
    appBar: string;
    toolbar: string;
    rightToolbar: string;
    menuButton: string;
};
//# sourceMappingURL=SolarAppBar.d.ts.map