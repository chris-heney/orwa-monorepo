import { useStore } from 'react-admin';

/**
 * A hook that returns the secondary solar sidebar currently active menu and a function to set it.
 *
 * @example
 * const EnableUserMenu = () => {
 *     const [active, setActive] = useSolarSidebarActiveMenu();
 *     return (
 *         <Button onClick={() => setActive('usermenu')}>
 *             Open User Menu
 *         </Button>
 *     );
 * };
 */
export const useSolarSidebarActiveMenu = () => {
    return useStore<string>('secondary_solar_sidebar.open', null);
};
