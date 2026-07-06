import { ContainerProps } from '@mui/material';
import { SxProps } from '@mui/material/styles';
import React, { ComponentType, HtmlHTMLAttributes, ReactNode } from 'react';
import { CoreLayoutProps, ErrorProps } from 'react-admin';
/**
 * Layout component with no sidebar and a horizontal menu.
 *
 * @example
 * import { Admin, Resource } from 'react-admin';
 * import { ContainerLayout } from '@react-admin/ra-navigation';
 *
 * export const App = () => (
 *     <Admin dataProvider={dataProvider} layout={ContainerLayout}>
 *         <Resource name="songs" list={SongList} />
 *         <Resource name="artists" list={ArtistList} />
 *     </Admin>
 * );
 */
export declare const ContainerLayout: (props: LayoutProps) => React.JSX.Element;
export interface LayoutProps extends Omit<CoreLayoutProps, 'menu'>, Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'> {
    appBar?: ReactNode;
    className?: string;
    error?: ComponentType<ErrorProps>;
    fixed?: ContainerProps['fixed'];
    maxWidth?: ContainerProps['maxWidth'];
    menu?: ReactNode;
    sidebar?: ComponentType<{
        children: ReactNode;
    }>;
    sx?: SxProps;
    toolbar?: ReactNode;
    userMenu?: ReactNode;
}
export declare const ContainerLayoutClasses: {
    root: string;
    content: string;
};
//# sourceMappingURL=ContainerLayout.d.ts.map