import * as React from 'react';
import { TabsProps } from '@mui/material';
/**
 * A horizontal menu component, alternative to react-admin's `<Menu>`.
 * To be used in the AppBar of the `<ContainerLayout>`.
 *
 * @example
 * import { HorizontalMenu } from '@react-admin/ra-navigation';
 *
 * export const Menu = () => (
 *     <HorizontalMenu>
 *         <HorizontalMenu.Item label="Dashboard" to="/" value="" />
 *         <HorizontalMenu.Item label="Songs" to="/songs" value="songs" />
 *         <HorizontalMenu.Item label="Artists" to="/artists" value="artists" />
 *     </HorizontalMenu>
 * );
 */
export declare const HorizontalMenu: {
    (props: HorizontalMenuProps): React.JSX.Element;
    Item: ({ label, to, value, ...props }: import("./HorizontalMenuItem").HorizontalMenuItemProps) => React.JSX.Element;
};
export interface HorizontalMenuProps extends TabsProps {
    children?: React.ReactNode;
    hasDashboard?: boolean;
}
//# sourceMappingURL=HorizontalMenu.d.ts.map