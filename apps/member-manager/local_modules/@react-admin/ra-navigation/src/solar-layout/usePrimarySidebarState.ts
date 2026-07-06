import { useStore, useSidebarStateResult } from 'react-admin';

/**
 * A hook that returns the primary solar sidebar open state and a function to toggle it.
 *
 * The sidebar is closed by default.
 *
 * @example
 * const ToggleSidebar = () => {
 *     const [open, setOpen] = usePrimarySidebarState();
 *     return (
 *         <Button onClick={() => setOpen(!open)}>
 *             {open ? 'Open' : 'Close'}
 *         </Button>
 *     );
 * };
 */
export const usePrimarySidebarState = (): useSidebarStateResult => {
    return useStore<boolean>('primary_solar_sidebar.open', false);
};
