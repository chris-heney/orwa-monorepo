import React, { ComponentType, HtmlHTMLAttributes, ReactNode } from 'react';
import { SxProps } from '@mui/material';
import { AppBarProps, CoreLayoutProps, ErrorProps } from 'react-admin';
import { SolarMenuProps } from './SolarMenu';
/**
 * Layout component without AppBar, using a narrow a sidebar that can expand to show more content.
 * On mobile, it shows the AppBar to allow opening the navigation menu.
 *
 * @example <caption>Basic usage</caption>
 * import { Admin, Resource, ListGuesser } from 'react-admin';
 * import { SolarLayout } from '@react-admin/ra-navigation';
 *
 * export const App = () => (
 *     <Admin dataProvider={dataProvider} layout={SolarLayout}>
 *         <Resource name="songs" list={ListGuesser} />
 *         <Resource name="artists" list={ListGuesser} />
 *     </Admin>
 * );
 */
export declare const SolarLayout: (props: SolarLayoutProps) => React.JSX.Element;
export interface SolarLayoutProps extends CoreLayoutProps, Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'> {
    appBar?: ComponentType<Omit<AppBarProps, 'title' | 'open'>>;
    className?: string;
    error?: ComponentType<ErrorProps>;
    logo?: ReactNode;
    menu?: ComponentType<SolarMenuProps>;
    sx?: SxProps;
}
export declare const LayoutClasses: {
    appFrame: string;
    contentWithSidebar: string;
    content: string;
};
//# sourceMappingURL=SolarLayout.d.ts.map